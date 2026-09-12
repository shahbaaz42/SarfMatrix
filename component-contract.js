// Phase B8.1+: language-neutral semantic identity contract for structural morphology runs.
// This module defines metadata only. It does not change generation, Arabic surfaces,
// root ownership, colouring, explanation text, or exports.
(function exposeComponentContract(globalScope) {
  "use strict";

  const COMPONENT_IDENTITY_SCHEMA_VERSION = 1;

  const STRUCTURAL_KINDS = Object.freeze([
    "radical",
    "derivational",
    "derivational-copy",
    "grammatical",
    "particle",
    "presentation",
  ]);

  // Stable language-neutral identifiers. Later presentation/localization layers
  // translate these roles without placing Arabic explanatory prose in morphology.
  const MORPHOLOGICAL_ROLE_IDS = Object.freeze([
    // Present-tense person prefixes (أحرف المضارعة).
    "present-prefix-alif",
    "present-prefix-nun",
    "present-prefix-ya",
    "present-prefix-ta",

    // Finite person / number / gender endings.
    "dual-alif",
    "plural-waw",
    "feminine-address-ya",
    "nun-niswa",
    "feminine-ta",
    "subject-ta",
    "subject-na",

    // Emphasis.
    "heavy-emphasis-nun",
    "light-emphasis-nun",

    // Particle functions.
    "jussive-particle",
    "subjunctive-particle",

    // Hamzah has a morphological function independent of its orthographic identity.
    "hamza-of-ifal",
    "hamza-of-infial",
    "hamza-of-iftial",
    "hamza-of-ifilal",
    "hamza-of-istifal",
    "hamza-of-ifawlal",
    "hamza-of-ifawwal",
    "hamza-of-ifanlal",
    "hamza-of-ifanla",
    "hamza-of-quadriliteral-ifanlal",
    "hamza-of-quadriliteral-ifalalla",

    // Bāb-specific derivational material.
    "form2-masdar-ta",
    "form2-masdar-ya",
    "form3-alif",
    "form3-passive-waw",
    "form4-masdar-alif",
    "form5-ta",
    "form6-ta",
    "form6-alif",
    "form7-nun",
    "form8-ta",
    "form9-r3-copy",
    "form10-sin",
    "form10-ta",
    "form11-pattern-alif",
    "form11-r3-copy",
    "form12-waw",
    "form13-waw-geminate",
    "form14-inserted-nun",
    "form14-r3-copy",
    "form15-inserted-nun",
    "form15-final-ya",
    "quadriliteral-tafaul-ta",
    "quadriliteral-ifanlal-inserted-nun",
    "quadriliteral-ifalalla-r4-copy",

    // Shared derived-form material.
    "masdar-alif",
    "masdar-mim",
    "masdar-ta-marbuta",
    "participle-mim",
  ]);

  const ORTHOGRAPHIC_ROLE_IDS = Object.freeze([
    "hamzat-wasl",
    "hamzat-qat",
  ]);

  const MORPHOLOGICAL_ROLE_SET = new Set(MORPHOLOGICAL_ROLE_IDS);
  const ORTHOGRAPHIC_ROLE_SET = new Set(ORTHOGRAPHIC_ROLE_IDS);

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

  function normalizeRoleList(value, allowed, fieldName) {
    if (value === null || value === undefined) return Object.freeze([]);
    if (!Array.isArray(value)) throw new Error(`${fieldName} must be an array`);
    const normalized = [];
    for (const role of value) {
      if (typeof role !== "string" || !allowed.has(role)) throw new Error(`Unknown ${fieldName} role: ${String(role)}`);
      if (!normalized.includes(role)) normalized.push(role);
    }
    return Object.freeze(normalized);
  }

  function createComponentIdentity({ morphologicalRoles = [], orthographicRoles = [] } = {}) {
    return deepFreeze({
      schemaVersion: COMPONENT_IDENTITY_SCHEMA_VERSION,
      morphologicalRoles: normalizeRoleList(morphologicalRoles, MORPHOLOGICAL_ROLE_SET, "morphologicalRoles"),
      orthographicRoles: normalizeRoleList(orthographicRoles, ORTHOGRAPHIC_ROLE_SET, "orthographicRoles"),
    });
  }

  function validateComponentIdentity(identity) {
    if (!identity || typeof identity !== "object") throw new Error("Component identity is required");
    if (identity.schemaVersion !== COMPONENT_IDENTITY_SCHEMA_VERSION) throw new Error("Unsupported component identity schema version");
    normalizeRoleList(identity.morphologicalRoles, MORPHOLOGICAL_ROLE_SET, "morphologicalRoles");
    normalizeRoleList(identity.orthographicRoles, ORTHOGRAPHIC_ROLE_SET, "orthographicRoles");
    return true;
  }

  // Returns a new frozen run so B8 metadata remains additive and never mutates
  // or deep-freezes nested metadata belonging to the source morphology object.
  function withComponentIdentity(run, identityInput = {}) {
    if (!run || typeof run !== "object" || typeof run.text !== "string") throw new Error("Structural run is required");
    if (run.kind !== undefined && !STRUCTURAL_KINDS.includes(run.kind)) throw new Error(`Unknown structural kind: ${String(run.kind)}`);
    const identity = createComponentIdentity(identityInput);
    return deepFreeze({
      ...clone(run),
      morphologicalRoles: identity.morphologicalRoles,
      orthographicRoles: identity.orthographicRoles,
    });
  }

  function validateStructuralRunIdentity(run) {
    if (!run || typeof run !== "object" || typeof run.text !== "string") throw new Error("Structural run is required");
    if (run.kind !== undefined && !STRUCTURAL_KINDS.includes(run.kind)) throw new Error(`Unknown structural kind: ${String(run.kind)}`);
    normalizeRoleList(run.morphologicalRoles, MORPHOLOGICAL_ROLE_SET, "morphologicalRoles");
    normalizeRoleList(run.orthographicRoles, ORTHOGRAPHIC_ROLE_SET, "orthographicRoles");
    return true;
  }

  const api = deepFreeze({
    COMPONENT_IDENTITY_SCHEMA_VERSION,
    STRUCTURAL_KINDS,
    MORPHOLOGICAL_ROLE_IDS,
    ORTHOGRAPHIC_ROLE_IDS,
    createComponentIdentity,
    validateComponentIdentity,
    withComponentIdentity,
    validateStructuralRunIdentity,
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfComponentContract = api;
})(typeof globalThis === "undefined" ? this : globalThis);
