// Phase B8.1: language-neutral semantic identity contract for structural morphology runs.
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

  // B8.1 freezes stable language-neutral identifiers. Later B8 phases attach
  // these IDs to existing generated runs without changing their surface text.
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

    // Hamzah can have a morphological function in addition to its independent
    // orthographic identity. These two examples are intentionally distinct.
    "hamza-of-ifal",
    "hamza-of-istifal",
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
  // the existing morphology object or its ownership fields.
  function withComponentIdentity(run, identityInput = {}) {
    if (!run || typeof run !== "object" || typeof run.text !== "string") throw new Error("Structural run is required");
    if (run.kind !== undefined && !STRUCTURAL_KINDS.includes(run.kind)) throw new Error(`Unknown structural kind: ${String(run.kind)}`);
    const identity = createComponentIdentity(identityInput);
    return deepFreeze({
      ...run,
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
