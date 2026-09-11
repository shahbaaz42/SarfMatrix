// Phase B4: pure, language-neutral explanation records built from generated data.
(function exposeExplanationEngine(globalScope) {
  "use strict";

  const registry = typeof module !== "undefined" && module.exports
    ? require("./rules-registry.js")
    : globalScope.SarfRuleRegistry;
  if (!registry) throw new Error("Sarf rule registry is required by the explanation engine");
  const { getRuleDefinition, getRuleSources } = registry;

  const SCHEMA_VERSION = 1;
  const VERBAL_FIELDS = Object.freeze({
    section01: Object.freeze(["past", "present", "passivePast", "passivePresent"]),
    section02: Object.freeze(["majzumPresent", "mansubPresent", "heavyEmphatic", "lightEmphatic"]),
    section03: Object.freeze(["imperative", "heavyImperative", "lightImperative"]),
  });

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clone(child)]));
  }

  function normalizeStructuralRuns(presentation) {
    if (!presentation || !Array.isArray(presentation.runs)) return deepFreeze([]);
    return deepFreeze(presentation.runs.map((run) => {
      const segment = {
        text: run.text,
        kind: run.kind,
        radicalIndex: run.radicalIndex ?? null,
        sourceRadicalIndex: run.sourceRadicalIndex ?? null,
        elementId: run.elementId ?? null,
      };
      for (const key of ["absorbed", "ruleId"]) if (run[key] !== undefined) segment[key] = clone(run[key]);
      return segment;
    }));
  }

  function availabilityFor(snapshot, target, surface) {
    if (surface !== null && surface !== undefined && surface !== "") return { status: "generated", code: null };
    const key = target.section === "section04" ? target.group : target.field;
    const code = snapshot.availability?.[key] ?? null;
    if (code === "suppressed") return { status: "suppressed", code };
    if (code === "unsupported") return { status: "unsupported", code };
    return { status: "unavailable", code };
  }

  function resolveExplanationTarget(snapshot, target) {
    if (!snapshot || typeof snapshot !== "object" || !snapshot.sections) throw new Error("Explanation snapshot is required");
    if (!target || typeof target !== "object") throw new Error("Explanation target is required");
    const section = snapshot.sections[target.section];
    if (!section || ![...Object.keys(VERBAL_FIELDS), "section04"].includes(target.section)) throw new Error("Unknown explanation section");
    let row;
    let field;
    let valueIndex = null;
    let surface;
    let presentation;
    let alternatives;
    let events;
    if (target.section === "section04") {
      const group = target.group ?? target.field;
      if (!group || !Object.prototype.hasOwnProperty.call(section, group)) throw new Error("Unknown explanation group");
      if (!Array.isArray(section[group])) throw new Error("Malformed explanation group");
      if (!Number.isInteger(target.rowIndex) || target.rowIndex < 0 || target.rowIndex >= section[group].length) throw new Error("Explanation row out of range");
      row = section[group][target.rowIndex];
      valueIndex = target.valueIndex ?? 0;
      if (!Number.isInteger(valueIndex) || valueIndex < 0 || valueIndex >= row.values.length) throw new Error("Explanation value index out of range");
      field = group;
      surface = row.values[valueIndex];
      presentation = row.presentations[valueIndex];
      alternatives = Array.isArray(row.alternatives) ? row.alternatives : (row.alternatives?.[valueIndex] ?? []);
      events = Array.isArray(row.events) ? row.events : (row.events?.[valueIndex] ?? []);
    } else {
      if (!VERBAL_FIELDS[target.section].includes(target.field)) throw new Error("Unknown explanation field");
      if (!Number.isInteger(target.rowIndex) || target.rowIndex < 0 || target.rowIndex >= section.length) throw new Error("Explanation row out of range");
      if (target.valueIndex !== undefined) throw new Error("Explanation value index is not valid for verbal targets");
      row = section[target.rowIndex];
      field = target.field;
      if (!Object.prototype.hasOwnProperty.call(row, field)) throw new Error("Unknown explanation field");
      surface = row[field];
      presentation = row.presentation?.[field] ?? null;
      alternatives = row.alternatives?.[field] ?? [];
      events = row.events?.[field] ?? [];
    }
    if (surface !== null && surface !== undefined && (!presentation || presentation.text !== surface)) throw new Error("Explanation presentation does not match surface");
    const normalizedTarget = { section: target.section, rowIndex: target.rowIndex, field };
    if (target.section === "section04") {
      normalizedTarget.group = field;
      normalizedTarget.valueIndex = valueIndex;
    }
    return deepFreeze({
      target: normalizedTarget, row, surface: surface ?? null, presentation: presentation ? clone(presentation) : null,
      structure: normalizeStructuralRuns(presentation), events: clone(events), alternatives: clone(alternatives),
      availability: availabilityFor(snapshot, normalizedTarget, surface),
      context: { pronoun: row.pronoun ?? null, rowLabel: row.label ?? null, groupLabel: target.section === "section04" ? field : null },
    });
  }

  function applicableTransformation(snapshot, resolved) {
    const transformation = snapshot.transformation;
    if (!transformation) return null;
    if (transformation.resultForm === resolved.surface) return transformation;
    const elementIds = new Set(resolved.structure.map((run) => run.elementId).filter(Boolean));
    const affected = typeof transformation.affectedElement === "string"
      ? transformation.affectedElement
      : transformation.affectedElement?.elementId || transformation.derivationalElement?.elementId;
    return affected && elementIds.has(affected) ? transformation : null;
  }

  function collectTargetRuleIds(resolved, transformation = null) {
    const ids = [];
    const add = (id) => { if (typeof id === "string" && !ids.includes(id)) ids.push(id); };
    for (const event of resolved.events) add(event.ruleId);
    for (const alternative of resolved.alternatives) {
      add(alternative.ruleId);
      for (const step of alternative.steps ?? []) add(step.ruleId);
    }
    if (resolved.presentation) add(resolved.presentation.ruleId);
    for (const run of resolved.structure) add(run.ruleId);
    const rowRule = resolved.row.rules?.[resolved.target.field];
    add(typeof rowRule === "string" ? rowRule : rowRule?.ruleId);
    if (transformation) {
      add(transformation.ruleId);
      for (const event of transformation.events ?? []) add(event.ruleId);
    }
    return deepFreeze(ids);
  }

  function resolveRules(ruleIds) {
    return deepFreeze(ruleIds.map((ruleId) => {
      const rule = getRuleDefinition(ruleId);
      return {
        id: rule.id, category: rule.category, defaultOperation: rule.defaultOperation,
        scope: clone(rule.scope), explanationKey: rule.explanationKey,
        shortExplanationKey: rule.shortExplanationKey, technicalNoteKey: rule.technicalNoteKey,
        relatedRuleIds: [...rule.relatedRuleIds],
      };
    }));
  }

  function resolveRuleSources(ruleIds) {
    const records = [];
    const seen = new Set();
    for (const ruleId of ruleIds) for (const { source, locator } of getRuleSources(ruleId)) {
      const key = [source.id, locator.pdfPage, locator.printedPage, locator.locator, locator.evidenceClass].map(String).join("\u0000");
      if (seen.has(key)) continue;
      seen.add(key);
      records.push({
        sourceId: source.id, filename: source.filename, title: source.title,
        language: source.language, edition: source.edition,
        locator: { pdfPage: locator.pdfPage, printedPage: locator.printedPage, locator: locator.locator, evidenceClass: locator.evidenceClass },
      });
    }
    return deepFreeze(records);
  }

  function orderedEvents(resolved, transformation) {
    const combined = [...resolved.events];
    // Some B2 selections encode the default surface as the first canonical
    // alternative. Its ordered steps are therefore local to this target.
    for (const alternative of resolved.alternatives) {
      if (alternative.value === resolved.surface) combined.push(...(alternative.steps ?? []));
    }
    if (transformation) combined.push(...(transformation.events ?? []));
    const seen = new Set();
    return deepFreeze(combined.filter((event) => {
      const key = `${event.eventId}\u0000${event.sequence}\u0000${event.ruleId}\u0000${event.operation}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((left, right) => (left.sequence ?? 0) - (right.sequence ?? 0)).map(clone));
  }

  function buildDerivation(events, surface, transformation) {
    const underlying = transformation?.resultForm === surface ? (transformation.underlyingForm ?? null) : (events[0]?.before?.text ?? null);
    const stages = events.map((event) => ({
      sequence: event.sequence, ruleId: event.ruleId, operation: event.operation,
      before: clone(event.before), after: clone(event.after),
    }));
    return deepFreeze({ underlying, stages, surface });
  }

  function resolveAlternatives(alternatives) {
    return deepFreeze(alternatives.map((alternative) => {
      const result = clone(alternative);
      if (alternative.ruleId) {
        result.rule = resolveRules([alternative.ruleId])[0];
        result.sources = resolveRuleSources([alternative.ruleId]);
      }
      return result;
    }));
  }

  function buildExplanationRecord(snapshot, target) {
    const resolved = resolveExplanationTarget(snapshot, target);
    const transformation = applicableTransformation(snapshot, resolved);
    const events = orderedEvents(resolved, transformation);
    const ruleIds = collectTargetRuleIds(resolved, transformation);
    return deepFreeze({
      schemaVersion: SCHEMA_VERSION,
      target: clone(resolved.target),
      surface: resolved.surface,
      presentation: clone(resolved.presentation),
      structure: clone(resolved.structure),
      context: {
        root: clone(snapshot.root ?? null), rootFamily: snapshot.rootFamily ?? null,
        rootArity: snapshot.rootArity ?? null, finalRadicalIndex: snapshot.finalRadicalIndex ?? null,
        bab: snapshot.bab ?? null, babLabel: snapshot.babLabel ?? null, family: snapshot.family ?? null,
        ...clone(resolved.context),
      },
      rules: resolveRules(ruleIds), events, alternatives: resolveAlternatives(resolved.alternatives),
      sources: resolveRuleSources(ruleIds), derivation: buildDerivation(events, resolved.surface, transformation),
      availability: clone(resolved.availability),
    });
  }

  const api = deepFreeze({ SCHEMA_VERSION, buildExplanationRecord, resolveExplanationTarget, normalizeStructuralRuns, collectTargetRuleIds, resolveRuleSources });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfExplanationEngine = api;
})(typeof globalThis === "undefined" ? this : globalThis);
