// Phase B8.4+: expose semantic component identities through the explanation layer
// without changing authoritative generated surfaces. B10.1 additionally splits
// compound grammatical endings for learner-facing structure explanations.
(function exposeExplanationIdentities(globalScope) {
  "use strict";

  const grammatical = typeof module !== "undefined" && module.exports
    ? require("./grammatical-components.js")
    : globalScope.SarfGrammaticalComponents;
  const derivational = typeof module !== "undefined" && module.exports
    ? require("./derivational-components.js")
    : globalScope.SarfDerivationalComponents;
  const baseEngine = typeof module !== "undefined" && module.exports
    ? require("./explanation-engine.js")
    : globalScope.SarfExplanationEngine;
  const baseText = typeof module !== "undefined" && module.exports
    ? require("./explanation-text.js")
    : globalScope.SarfExplanationText;

  if (!grammatical || !derivational || !baseEngine || !baseText) {
    throw new Error("B8.4 explanation identity dependencies are required");
  }

  const CASE_BY_ROW = Object.freeze([
    Object.freeze({ key: "nominative", role: "case-nominative", vowelRole: "case-marker-damma" }),
    Object.freeze({ key: "accusative", role: "case-accusative", vowelRole: "case-marker-fatha" }),
    Object.freeze({ key: "genitive", role: "case-genitive", vowelRole: "case-marker-kasra" }),
  ]);

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clone(child)]));
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  function semanticRun(text, source, elementId, morphologicalRoles) {
    return {
      ...clone(source),
      text,
      radicalIndex: null,
      kind: "grammatical",
      elementId,
      morphologicalRoles: [...morphologicalRoles],
      orthographicRoles: [...(source?.orthographicRoles ?? [])],
    };
  }

  function splitFeminineEmphasisRun(run) {
    const roles = run?.morphologicalRoles ?? [];
    if (!roles.includes("nun-niswa") || !roles.includes("heavy-emphasis-nun")) return [clone(run)];
    const alifIndex = run.text.indexOf("ا");
    if (alifIndex <= 0 || alifIndex >= run.text.length - 1) return [clone(run)];
    const niswah = run.text.slice(0, alifIndex);
    const separator = run.text.slice(alifIndex, alifIndex + 1);
    const emphasis = run.text.slice(alifIndex + 1);
    return [
      semanticRun(niswah, run, "inflection.nun-niswa", ["nun-niswa"]),
      semanticRun(separator, run, "emphasis.feminine-separator-alif", ["feminine-emphasis-separator-alif"]),
      semanticRun(emphasis, run, "emphasis.heavy", ["heavy-emphasis-nun"]),
    ];
  }

  function splitFinitePresentation(presentation) {
    if (!presentation || !Array.isArray(presentation.runs)) return clone(presentation);
    const runs = presentation.runs.flatMap(splitFeminineEmphasisRun);
    return { ...clone(presentation), runs };
  }

  function caseRoles(caseInfo, markerOverride = null) {
    return [caseInfo.role, markerOverride ?? caseInfo.vowelRole];
  }

  function splitAtLastNun(text) {
    const index = text.lastIndexOf("ن");
    if (index <= 0) return null;
    return [text.slice(0, index), text.slice(index)];
  }

  function splitFeminineDual(text, caseInfo) {
    const nunIndex = text.lastIndexOf("ن");
    if (nunIndex <= 0) return null;
    const markerLetter = caseInfo.key === "nominative" ? "ا" : "ي";
    const markerIndex = text.lastIndexOf(markerLetter, nunIndex - 1);
    if (markerIndex <= 0) return null;
    return [text.slice(0, markerIndex), text.slice(markerIndex, nunIndex), text.slice(nunIndex)];
  }

  function splitFemininePlural(text) {
    const taIndex = text.lastIndexOf("ت");
    if (taIndex <= 0 || taIndex >= text.length - 1) return null;
    return [text.slice(0, taIndex + 1), text.slice(taIndex + 1)];
  }

  function splitFeminineSingular(text) {
    const taIndex = text.lastIndexOf("ة");
    if (taIndex < 0) return null;
    return [text.slice(0, taIndex + 1), text.slice(taIndex + 1)];
  }

  function splitNominalEnding(run, formIndex, caseInfo) {
    if (!run?.text) return [clone(run)];
    const source = run;

    if (formIndex === 0) {
      return [semanticRun(run.text, source, `nominal.case.${caseInfo.key}.masculine-singular`, [...caseRoles(caseInfo), "tanwin"])];
    }

    if (formIndex === 1) {
      const parts = splitAtLastNun(run.text);
      if (!parts) return [clone(run)];
      const markerRole = caseInfo.key === "nominative" ? "dual-case-alif" : "dual-case-ya";
      return [
        semanticRun(parts[0], source, `nominal.dual.${caseInfo.key}.case-marker`, [caseInfo.role, markerRole]),
        semanticRun(parts[1], source, "nominal.dual.nun", ["dual-nun"]),
      ];
    }

    if (formIndex === 2) {
      const parts = splitAtLastNun(run.text);
      if (!parts) return [clone(run)];
      const markerRole = caseInfo.key === "nominative" ? "sound-masculine-plural-waw" : "sound-masculine-plural-ya";
      return [
        semanticRun(parts[0], source, `nominal.sound-masculine-plural.${caseInfo.key}.case-marker`, [caseInfo.role, markerRole]),
        semanticRun(parts[1], source, "nominal.sound-masculine-plural.nun", ["sound-masculine-plural-nun"]),
      ];
    }

    if (formIndex === 3) {
      const parts = splitFeminineSingular(run.text);
      if (!parts || !parts[1]) return [semanticRun(run.text, source, "nominal.feminine-singular", ["feminine-singular-ta-marbuta", ...caseRoles(caseInfo)])];
      return [
        semanticRun(parts[0], source, "nominal.feminine-singular.ta-marbuta", ["feminine-singular-ta-marbuta"]),
        semanticRun(parts[1], source, `nominal.case.${caseInfo.key}.feminine-singular`, [...caseRoles(caseInfo), "tanwin"]),
      ];
    }

    if (formIndex === 4) {
      const parts = splitFeminineDual(run.text, caseInfo);
      if (!parts) return [clone(run)];
      const markerRole = caseInfo.key === "nominative" ? "dual-case-alif" : "dual-case-ya";
      return [
        semanticRun(parts[0], source, "nominal.feminine-dual.ta", ["feminine-dual-ta"]),
        semanticRun(parts[1], source, `nominal.feminine-dual.${caseInfo.key}.case-marker`, [caseInfo.role, markerRole]),
        semanticRun(parts[2], source, "nominal.feminine-dual.nun", ["dual-nun"]),
      ];
    }

    if (formIndex === 5) {
      const parts = splitFemininePlural(run.text);
      if (!parts || !parts[1]) return [clone(run)];
      const pluralCaseMarker = caseInfo.key === "nominative" ? "case-marker-damma" : "case-marker-kasra";
      return [
        semanticRun(parts[0], source, "nominal.sound-feminine-plural.at", ["sound-feminine-plural-at"]),
        semanticRun(parts[1], source, `nominal.sound-feminine-plural.${caseInfo.key}.case-marker`, [caseInfo.role, pluralCaseMarker, "tanwin"]),
      ];
    }

    return [clone(run)];
  }

  function enrichNominalPresentation(presentation, formIndex, caseInfo) {
    if (!presentation || !Array.isArray(presentation.runs)) return clone(presentation);
    const runs = presentation.runs.map(clone);
    let endingIndex = -1;
    for (let index = runs.length - 1; index >= 0; index -= 1) {
      if (runs[index]?.kind === "grammatical") {
        endingIndex = index;
        break;
      }
    }
    if (endingIndex < 0) return { ...clone(presentation), runs };
    const replacement = splitNominalEnding(runs[endingIndex], formIndex, caseInfo);
    runs.splice(endingIndex, 1, ...replacement);
    return { ...clone(presentation), runs };
  }

  function enrichB101Snapshot(snapshot) {
    const copy = clone(snapshot);

    for (const sectionName of ["section01", "section02", "section03"]) {
      const rows = copy.sections?.[sectionName];
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (!row.presentation) continue;
        for (const [field, presentation] of Object.entries(row.presentation)) {
          row.presentation[field] = splitFinitePresentation(presentation);
        }
      }
    }

    const section04 = copy.sections?.section04;
    if (section04) {
      for (const group of ["activeParticiple", "passiveParticiple"]) {
        const rows = section04[group];
        if (!Array.isArray(rows)) continue;
        rows.forEach((row, rowIndex) => {
          const caseInfo = CASE_BY_ROW[rowIndex];
          if (!caseInfo || !Array.isArray(row.presentations)) return;
          row.presentations = row.presentations.map((presentation, formIndex) => enrichNominalPresentation(presentation, formIndex, caseInfo));
        });
      }
    }

    return deepFreeze(copy);
  }

  function enrichExplanationSnapshot(snapshot) {
    const grammaticalSnapshot = grammatical.enrichGeneratedSnapshot(snapshot);
    const derivationalSnapshot = derivational.enrichDerivationalSnapshot(grammaticalSnapshot);
    return enrichB101Snapshot(derivationalSnapshot);
  }

  function presentationFor(snapshot, target) {
    const section = snapshot.sections?.[target.section];
    if (!section) return null;
    if (target.section === "section04") {
      const group = target.group ?? target.field;
      const row = section[group]?.[target.rowIndex];
      return row?.presentations?.[target.valueIndex ?? 0] ?? null;
    }
    return section[target.rowIndex]?.presentation?.[target.field] ?? null;
  }

  function attachComponentIdentities(record, enrichedSnapshot, target) {
    const result = clone(record);
    const runs = presentationFor(enrichedSnapshot, target)?.runs ?? [];
    result.structure = result.structure.map((segment, index) => ({
      ...segment,
      morphologicalRoles: [...(runs[index]?.morphologicalRoles ?? [])],
      orthographicRoles: [...(runs[index]?.orthographicRoles ?? [])],
    }));
    return deepFreeze(result);
  }

  const SPECIAL_LABELS = Object.freeze({
    "present-prefix-alif": "Present-tense prefix alif",
    "present-prefix-nun": "Present-tense prefix nūn",
    "present-prefix-ya": "Present-tense prefix yāʾ",
    "present-prefix-ta": "Present-tense prefix tāʾ",
    "dual-alif": "Dual alif",
    "plural-waw": "Plural wāw",
    "feminine-address-ya": "Feminine-address yāʾ",
    "nun-niswa": "Nūn al-niswah",
    "feminine-ta": "Feminine tāʾ",
    "subject-ta": "Subject tāʾ",
    "subject-na": "Subject nā",
    "heavy-emphasis-nun": "Heavy-emphasis nūn",
    "light-emphasis-nun": "Light-emphasis nūn",
    "feminine-emphasis-separator-alif": "Separating alif between nūn al-niswah and nūn al-tawkīd",
    "jussive-particle": "Jussive particle",
    "subjunctive-particle": "Subjunctive particle",
    "case-nominative": "Nominative (marfūʿ)",
    "case-accusative": "Accusative (manṣūb)",
    "case-genitive": "Genitive (majrūr)",
    "case-marker-damma": "Ḍammah case marker",
    "case-marker-fatha": "Fatḥah case marker",
    "case-marker-kasra": "Kasrah case marker",
    "tanwin": "Tanwīn",
    "dual-case-alif": "Dual nominative alif",
    "dual-case-ya": "Dual accusative/genitive yāʾ",
    "dual-nun": "Dual nūn",
    "sound-masculine-plural-waw": "Sound masculine plural nominative wāw",
    "sound-masculine-plural-ya": "Sound masculine plural accusative/genitive yāʾ",
    "sound-masculine-plural-nun": "Sound masculine plural nūn",
    "feminine-singular-ta-marbuta": "Feminine singular tāʾ marbūṭah",
    "feminine-dual-ta": "Feminine dual tāʾ",
    "sound-feminine-plural-at": "Sound feminine plural -āt",
    "hamzat-wasl": "Hamzat al-waṣl",
    "hamzat-qat": "Hamzat al-qaṭʿ",
    "masdar-alif": "Maṣdar alif",
    "masdar-mim": "Maṣdar mīm",
    "masdar-ta-marbuta": "Maṣdar tāʾ marbūṭah",
    "participle-mim": "Participle mīm",
  });

  function titleCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function humanize(value) {
    return value.replace(/-/g, " ").replace(/\br([1-4])\b/g, "R$1");
  }

  function roleLabel(locale, role, dimension = "morphological") {
    if (locale !== "en") throw new Error(`Unsupported B8.4 identity locale: ${String(locale)}`);
    if (SPECIAL_LABELS[role]) return SPECIAL_LABELS[role];
    if (role.startsWith("hamza-of-")) return `Derivational hamzah of ${humanize(role.slice("hamza-of-"))}`;
    const form = role.match(/^form(\d+)-(.+)$/);
    if (form) return `Form ${form[1]} ${humanize(form[2])}`;
    if (role.startsWith("quadriliteral-")) return `Quadriliteral ${humanize(role.slice("quadriliteral-".length))}`;
    return titleCase(humanize(role || dimension));
  }

  function buildExplanationRecord(snapshot, target) {
    const enrichedSnapshot = enrichExplanationSnapshot(snapshot);
    const record = baseEngine.buildExplanationRecord(enrichedSnapshot, target);
    return attachComponentIdentities(record, enrichedSnapshot, target);
  }

  function buildLocalizedExplanation(record, locale) {
    const model = clone(baseText.buildLocalizedExplanation(record, locale));
    model.structure = model.structure.map((segment, index) => {
      const source = record.structure[index] ?? {};
      const morphologicalRoles = [...(source.morphologicalRoles ?? [])];
      const orthographicRoles = [...(source.orthographicRoles ?? [])];
      const morphologicalRoleLabels = morphologicalRoles.map((role) => roleLabel(locale, role, "morphological"));
      const orthographicRoleLabels = orthographicRoles.map((role) => roleLabel(locale, role, "orthographic"));
      const identityLabels = [...morphologicalRoleLabels, ...orthographicRoleLabels];
      return {
        ...segment,
        morphologicalRoles,
        orthographicRoles,
        morphologicalRoleLabels,
        orthographicRoleLabels,
        identitySummary: identityLabels.length ? identityLabels.join(" · ") : null,
        note: segment.note || (identityLabels.length ? identityLabels.join(" · ") : null),
      };
    });
    return deepFreeze(model);
  }

  function loadB10Navigation() {
    if (typeof document === "undefined") return;
    if (!document.querySelector('link[data-sarf-b10-navigation]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "explanation-navigation.css?v=phase-b10";
      stylesheet.dataset.sarfB10Navigation = "true";
      document.head.append(stylesheet);
    }
    if (!document.querySelector('script[data-sarf-b10-navigation]')) {
      const script = document.createElement("script");
      script.src = "explanation-navigation.js?v=phase-b10";
      script.dataset.sarfB10Navigation = "true";
      document.body.append(script);
    }
  }

  const api = deepFreeze({
    CASE_BY_ROW,
    enrichB101Snapshot,
    enrichExplanationSnapshot,
    attachComponentIdentities,
    buildExplanationRecord,
    buildLocalizedExplanation,
    roleLabel,
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfExplanationIdentities = api;
    globalScope.SarfExplanationEngine = deepFreeze({ ...baseEngine, buildExplanationRecord });
    globalScope.SarfExplanationText = deepFreeze({ ...baseText, buildLocalizedExplanation });
    if (typeof window !== "undefined") window.addEventListener("load", loadB10Navigation, { once: true });
  }
})(typeof globalThis === "undefined" ? this : globalThis);
