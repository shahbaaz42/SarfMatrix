// Phase B5: pure conversion of a B4 record into locale-specific learner-facing data.
(function exposeExplanationText(globalScope) {
  "use strict";

  const localization = typeof module !== "undefined" && module.exports
    ? require("./localization.js")
    : globalScope.SarfLocalization;
  if (!localization) throw new Error("Sarf localization is required by the explanation text model");
  const { translate, hasTranslation, getLocalizationCatalog } = localization;

  const TEXT_SCHEMA_VERSION = 1;

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
  const label = (locale, family, id) => id === null || id === undefined ? null : translate(locale, `${family}.${id}`);

  function formatSource(source, locale) {
    const locator = source.locator || {};
    const params = { title: source.title, pdfPage: locator.pdfPage, printedPage: locator.printedPage };
    const citationText = locator.printedPage === null || locator.printedPage === undefined
      ? translate(locale, "citation.pdf", params)
      : translate(locale, "citation.pdfPrinted", params);
    return {
      sourceId: source.sourceId, sourceTitle: source.title, filename: source.filename,
      language: source.language, edition: source.edition, pdfPage: locator.pdfPage ?? null,
      printedPage: locator.printedPage ?? null, locator: locator.locator ?? null,
      evidenceClass: locator.evidenceClass ?? null,
      evidenceLabel: locator.evidenceClass ? label(locale, "evidence", locator.evidenceClass) : null,
      citationText,
    };
  }

  function formatRule(rule, locale, sources = []) {
    return {
      id: rule.id,
      shortText: translate(locale, rule.shortExplanationKey),
      detailText: translate(locale, rule.explanationKey),
      technicalText: rule.technicalNoteKey && hasTranslation(locale, rule.technicalNoteKey)
        ? translate(locale, rule.technicalNoteKey) : null,
      category: rule.category,
      categoryLabel: label(locale, "category", rule.category),
      defaultOperation: rule.defaultOperation,
      defaultOperationLabel: rule.defaultOperation ? label(locale, "operation", rule.defaultOperation) : null,
      sources: sources.map((source) => formatSource(source, locale)),
    };
  }

  function formatStep(stage, locale, rulesById) {
    const before = stage.before?.text ?? null;
    const after = stage.after?.text ?? null;
    const operationLabel = label(locale, "operation", stage.operation);
    return {
      sequence: stage.sequence ?? null, operation: stage.operation, operationLabel,
      ruleId: stage.ruleId ?? null, ruleShortText: stage.ruleId ? (rulesById.get(stage.ruleId)?.shortText ?? null) : null,
      before, after,
      text: before === null || after === null ? null : translate(locale, "derivation.step", { operation: operationLabel, before, after }),
    };
  }

  function localizedCode(locale, family, code) {
    if (!code) return null;
    const key = `${family}.${code}`;
    return hasTranslation(locale, key) ? translate(locale, key) : null;
  }

  function formatStructureSegment(segment, locale) {
    const radicalLabel = segment.radicalIndex ? label(locale, "radical", segment.radicalIndex) : null;
    const sourceRadicalLabel = segment.sourceRadicalIndex ? label(locale, "radical", segment.sourceRadicalIndex) : null;
    const inlineRadical = sourceRadicalLabel ? sourceRadicalLabel[0].toLowerCase() + sourceRadicalLabel.slice(1) : null;
    return {
      text: segment.text, kind: segment.kind, kindLabel: label(locale, "structure.kind", segment.kind),
      radicalIndex: segment.radicalIndex ?? null, radicalLabel,
      sourceRadicalIndex: segment.sourceRadicalIndex ?? null, sourceRadicalLabel,
      elementId: segment.elementId ?? null, ruleId: segment.ruleId ?? null,
      note: segment.kind === "derivational-copy"
        ? translate(locale, "structure.copyNote", { radical: inlineRadical }) : null,
      absorbed: segment.absorbed ? formatStructureSegment(segment.absorbed, locale) : null,
    };
  }

  function buildLocalizedExplanation(explanationRecord, locale) {
    if (!explanationRecord || typeof explanationRecord !== "object") throw new Error("B4 explanation record is required");
    getLocalizationCatalog(locale); // Enforce explicit supported-locale handling before formatting.
    if (!Array.isArray(explanationRecord.structure) || !Array.isArray(explanationRecord.rules) || !explanationRecord.derivation) {
      throw new Error("Malformed B4 explanation record");
    }
    const sources = (explanationRecord.sources || []).map((source) => formatSource(source, locale));
    const rules = explanationRecord.rules.map((rule) => formatRule(rule, locale, explanationRecord.sources || []));
    const rulesById = new Map(rules.map((rule) => [rule.id, rule]));
    const structure = explanationRecord.structure.map((segment) => formatStructureSegment(segment, locale));
    const stages = (explanationRecord.derivation.stages || []).map((stage) => formatStep(stage, locale, rulesById));
    const alternatives = (explanationRecord.alternatives || []).map((alternative) => {
      const alternativeSources = alternative.sources || [];
      const alternativeRule = alternative.rule
        ? formatRule(alternative.rule, locale, alternativeSources) : null;
      const alternativeRules = new Map(rulesById);
      if (alternativeRule) alternativeRules.set(alternativeRule.id, alternativeRule);
      return {
        variantId: alternative.variantId, value: alternative.value, status: alternative.status,
        statusLabel: label(locale, "status", alternative.status),
        reasonText: localizedCode(locale, "reason", alternative.reasonCode),
        preferenceText: localizedCode(locale, "preference", alternative.preferenceCode),
        rule: alternativeRule,
        steps: (alternative.steps || []).map((step) => formatStep(step, locale, alternativeRules)),
        sources: alternativeSources.map((source) => formatSource(source, locale)),
      };
    });
    const transformationCount = stages.length;
    const summary = transformationCount === 0 ? translate(locale, "summary.direct")
      : transformationCount === 1 ? translate(locale, "summary.one")
        : translate(locale, "summary.many", { count: transformationCount });
    return deepFreeze({
      schemaVersion: TEXT_SCHEMA_VERSION, recordSchemaVersion: explanationRecord.schemaVersion,
      locale, heading: translate(locale, "heading.explanation"), summary,
      target: clone(explanationRecord.target), surface: explanationRecord.surface,
      context: clone(explanationRecord.context), presentation: clone(explanationRecord.presentation),
      structure, rules, derivation: {
        underlying: explanationRecord.derivation.underlying,
        underlyingText: explanationRecord.derivation.underlying ?? null,
        stages, surface: explanationRecord.derivation.surface,
      }, alternatives, sources,
      availability: {
        status: explanationRecord.availability.status,
        code: explanationRecord.availability.code,
        label: label(locale, "availability", explanationRecord.availability.status),
      },
    });
  }

  const api = deepFreeze({ TEXT_SCHEMA_VERSION, buildLocalizedExplanation, formatSource });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfExplanationText = api;
})(typeof globalThis === "undefined" ? this : globalThis);
