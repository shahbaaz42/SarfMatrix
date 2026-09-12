// Phase B8.2: attach precise grammatical identities to generated structural runs.
// This layer is additive: it never changes Arabic surface text or lexical radical ownership.
(function exposeGrammaticalComponents(globalScope) {
  "use strict";

  const contract = typeof module !== "undefined" && module.exports
    ? require("./component-contract.js")
    : globalScope.SarfComponentContract;
  if (!contract) throw new Error("Sarf component contract is required");

  const { withComponentIdentity } = contract;

  const PREFIX_ROLE_BY_ROW = Object.freeze([
    "present-prefix-ya", "present-prefix-ya", "present-prefix-ya", "present-prefix-ta",
    "present-prefix-ta", "present-prefix-ya", "present-prefix-ta", "present-prefix-ta",
    "present-prefix-ta", "present-prefix-ta", "present-prefix-ta", "present-prefix-ta",
    "present-prefix-alif", "present-prefix-nun",
  ]);

  const PAST_ENDING_ROLES = Object.freeze([
    [], ["dual-alif"], ["plural-waw"], ["feminine-ta"], ["feminine-ta", "dual-alif"], ["nun-niswa"],
    ["subject-ta"], ["subject-ta", "dual-alif"], ["subject-ta"], ["subject-ta"],
    ["subject-ta", "dual-alif"], ["subject-ta", "nun-niswa"], ["subject-ta"], ["subject-na"],
  ].map(Object.freeze));

  const NONPAST_ENDING_ROLES = Object.freeze([
    [], ["dual-alif"], ["plural-waw"], [], ["dual-alif"], ["nun-niswa"],
    [], ["dual-alif"], ["plural-waw"], ["feminine-address-ya"], ["dual-alif"], ["nun-niswa"], [], [],
  ].map(Object.freeze));

  const HEAVY_ENDING_ROLES = Object.freeze([
    ["heavy-emphasis-nun"], ["dual-alif", "heavy-emphasis-nun"], ["heavy-emphasis-nun"], ["heavy-emphasis-nun"],
    ["dual-alif", "heavy-emphasis-nun"], ["nun-niswa", "heavy-emphasis-nun"], ["heavy-emphasis-nun"],
    ["dual-alif", "heavy-emphasis-nun"], ["heavy-emphasis-nun"], ["heavy-emphasis-nun"],
    ["dual-alif", "heavy-emphasis-nun"], ["nun-niswa", "heavy-emphasis-nun"], ["heavy-emphasis-nun"], ["heavy-emphasis-nun"],
  ].map(Object.freeze));

  const LIGHT_ENDING_ROLES = Object.freeze([
    ["light-emphasis-nun"], [], ["light-emphasis-nun"], ["light-emphasis-nun"], [], [],
    ["light-emphasis-nun"], [], ["light-emphasis-nun"], ["light-emphasis-nun"], [], [],
    ["light-emphasis-nun"], ["light-emphasis-nun"],
  ].map(Object.freeze));

  const FIELD_CLASS = Object.freeze({
    past: "past", passivePast: "past",
    present: "nonpast", passivePresent: "nonpast", majzumPresent: "nonpast", mansubPresent: "nonpast",
    imperative: "nonpast",
    heavyEmphatic: "heavy", heavyImperative: "heavy",
    lightEmphatic: "light", lightImperative: "light",
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

  function endingRoles(field, rowIndex) {
    const family = FIELD_CLASS[field];
    if (family === "past") return PAST_ENDING_ROLES[rowIndex] || [];
    if (family === "nonpast") return NONPAST_ENDING_ROLES[rowIndex] || [];
    if (family === "heavy") return HEAVY_ENDING_ROLES[rowIndex] || [];
    if (family === "light") return LIGHT_ENDING_ROLES[rowIndex] || [];
    return [];
  }

  function isFiniteField(field) {
    return Object.prototype.hasOwnProperty.call(FIELD_CLASS, field);
  }

  function enrichRun(run, { field, rowIndex, runIndex, runs }) {
    if (!run || typeof run !== "object") return run;
    const morphologicalRoles = [...(run.morphologicalRoles || [])];
    const orthographicRoles = [...(run.orthographicRoles || [])];
    const add = (role) => { if (role && !morphologicalRoles.includes(role)) morphologicalRoles.push(role); };
    const addOrthographic = (role) => { if (role && !orthographicRoles.includes(role)) orthographicRoles.push(role); };

    if (run.kind === "particle" && run.elementId === "particle.mood") {
      if (field === "majzumPresent") add("jussive-particle");
      if (field === "mansubPresent") add("subjunctive-particle");
    }

    if (isFiniteField(field) && run.kind === "grammatical") {
      const firstLexicalIndex = runs.findIndex((candidate) => candidate?.kind === "radical");
      const looksLikePrefix = run.elementId?.startsWith("personPrefix") || (firstLexicalIndex >= 0 && runIndex < firstLexicalIndex && run.elementId !== "particle.mood");
      if (looksLikePrefix) {
        const prefixRole = PREFIX_ROLE_BY_ROW[rowIndex];
        add(prefixRole);
        if (prefixRole === "present-prefix-alif") addOrthographic("hamzat-qat");
      } else {
        for (const role of endingRoles(field, rowIndex)) add(role);
      }
    }

    if (morphologicalRoles.length === (run.morphologicalRoles || []).length && orthographicRoles.length === (run.orthographicRoles || []).length) return clone(run);
    return withComponentIdentity(run, { morphologicalRoles, orthographicRoles });
  }

  function enrichPresentation(presentation, context) {
    if (!presentation || !Array.isArray(presentation.runs)) return clone(presentation);
    const runs = presentation.runs.map((run, runIndex) => enrichRun(run, { ...context, runIndex, runs: presentation.runs }));
    return deepFreeze({ ...clone(presentation), runs });
  }

  function enrichSectionRows(rows, section) {
    return rows.map((row, rowIndex) => {
      const copy = clone(row);
      if (!copy.presentation || typeof copy.presentation !== "object") return deepFreeze(copy);
      for (const [field, presentation] of Object.entries(copy.presentation)) {
        copy.presentation[field] = enrichPresentation(presentation, { section, field, rowIndex });
      }
      return deepFreeze(copy);
    });
  }

  function enrichGeneratedSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object" || !snapshot.sections) throw new Error("Generated snapshot is required");
    const copy = clone(snapshot);
    for (const section of ["section01", "section02", "section03"]) {
      if (Array.isArray(copy.sections[section])) copy.sections[section] = enrichSectionRows(copy.sections[section], section);
    }
    return deepFreeze(copy);
  }

  const api = deepFreeze({
    PREFIX_ROLE_BY_ROW, PAST_ENDING_ROLES, NONPAST_ENDING_ROLES, HEAVY_ENDING_ROLES, LIGHT_ENDING_ROLES,
    endingRoles, enrichPresentation, enrichGeneratedSnapshot,
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfGrammaticalComponents = api;
})(typeof globalThis === "undefined" ? this : globalThis);
