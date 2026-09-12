// Phase B8.4: expose B8.2/B8.3 component identities through the explanation layer
// without changing authoritative generated surfaces.
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

  function enrichExplanationSnapshot(snapshot) {
    return derivational.enrichDerivationalSnapshot(grammatical.enrichGeneratedSnapshot(snapshot));
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
    "jussive-particle": "Jussive particle",
    "subjunctive-particle": "Subjunctive particle",
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
