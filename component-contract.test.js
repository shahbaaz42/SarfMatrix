"use strict";

const assert = require("node:assert/strict");
const {
  COMPONENT_IDENTITY_SCHEMA_VERSION,
  STRUCTURAL_KINDS,
  MORPHOLOGICAL_ROLE_IDS,
  ORTHOGRAPHIC_ROLE_IDS,
  createComponentIdentity,
  validateComponentIdentity,
  withComponentIdentity,
  validateStructuralRunIdentity,
} = require("./component-contract.js");

assert.equal(COMPONENT_IDENTITY_SCHEMA_VERSION, 1);
assert.deepEqual(STRUCTURAL_KINDS, [
  "radical", "derivational", "derivational-copy", "grammatical", "particle", "presentation",
]);

for (const requiredRole of [
  "present-prefix-alif", "present-prefix-nun", "present-prefix-ya", "present-prefix-ta",
  "dual-alif", "plural-waw", "feminine-address-ya", "nun-niswa", "feminine-ta",
  "subject-ta", "subject-na", "heavy-emphasis-nun", "light-emphasis-nun",
  "jussive-particle", "subjunctive-particle", "hamza-of-ifal", "hamza-of-istifal",
]) assert.ok(MORPHOLOGICAL_ROLE_IDS.includes(requiredRole), requiredRole);

assert.deepEqual(ORTHOGRAPHIC_ROLE_IDS, ["hamzat-wasl", "hamzat-qat"]);

const empty = createComponentIdentity();
assert.deepEqual(empty, {
  schemaVersion: 1,
  morphologicalRoles: [],
  orthographicRoles: [],
});
assert.ok(Object.isFrozen(empty));
assert.ok(Object.isFrozen(empty.morphologicalRoles));
assert.ok(Object.isFrozen(empty.orthographicRoles));
assert.equal(validateComponentIdentity(empty), true);

// One visible hamzah may have independent morphological and orthographic identities.
const istifalHamza = createComponentIdentity({
  morphologicalRoles: ["hamza-of-istifal"],
  orthographicRoles: ["hamzat-wasl"],
});
assert.deepEqual(istifalHamza.morphologicalRoles, ["hamza-of-istifal"]);
assert.deepEqual(istifalHamza.orthographicRoles, ["hamzat-wasl"]);

const ifalHamza = createComponentIdentity({
  morphologicalRoles: ["hamza-of-ifal"],
  orthographicRoles: ["hamzat-qat"],
});
assert.deepEqual(ifalHamza.morphologicalRoles, ["hamza-of-ifal"]);
assert.deepEqual(ifalHamza.orthographicRoles, ["hamzat-qat"]);

const presentAlif = createComponentIdentity({
  morphologicalRoles: ["present-prefix-alif"],
  orthographicRoles: ["hamzat-qat"],
});
assert.deepEqual(presentAlif.morphologicalRoles, ["present-prefix-alif"]);
assert.deepEqual(presentAlif.orthographicRoles, ["hamzat-qat"]);

// Duplicate roles normalize deterministically without changing order.
const duplicate = createComponentIdentity({
  morphologicalRoles: ["plural-waw", "plural-waw", "heavy-emphasis-nun"],
  orthographicRoles: ["hamzat-qat", "hamzat-qat"],
});
assert.deepEqual(duplicate.morphologicalRoles, ["plural-waw", "heavy-emphasis-nun"]);
assert.deepEqual(duplicate.orthographicRoles, ["hamzat-qat"]);

// Applying identity is additive: structural ownership is preserved and the input is untouched.
const original = Object.freeze({ text: "اِ", radicalIndex: null, kind: "derivational", elementId: "form10.hamzatWasl" });
const enriched = withComponentIdentity(original, {
  morphologicalRoles: ["hamza-of-istifal"],
  orthographicRoles: ["hamzat-wasl"],
});
assert.notEqual(enriched, original);
assert.deepEqual(original, { text: "اِ", radicalIndex: null, kind: "derivational", elementId: "form10.hamzatWasl" });
assert.deepEqual({
  text: enriched.text,
  radicalIndex: enriched.radicalIndex,
  kind: enriched.kind,
  elementId: enriched.elementId,
}, original);
assert.deepEqual(enriched.morphologicalRoles, ["hamza-of-istifal"]);
assert.deepEqual(enriched.orthographicRoles, ["hamzat-wasl"]);
assert.ok(Object.isFrozen(enriched));
assert.equal(validateStructuralRunIdentity(enriched), true);

// Enrichment must not freeze nested objects owned by the original run.
const nestedMetadata = { trigger: { type: "example" } };
const sourceWithNestedMetadata = { text: "و", radicalIndex: null, kind: "grammatical", metadata: nestedMetadata };
const enrichedNested = withComponentIdentity(sourceWithNestedMetadata, { morphologicalRoles: ["plural-waw"] });
assert.equal(Object.isFrozen(sourceWithNestedMetadata), false);
assert.equal(Object.isFrozen(nestedMetadata), false);
assert.equal(Object.isFrozen(nestedMetadata.trigger), false);
assert.equal(Object.isFrozen(enrichedNested.metadata), true);
assert.notEqual(enrichedNested.metadata, nestedMetadata);

// Existing runs without B8 fields remain valid during the staged migration.
assert.equal(validateStructuralRunIdentity({ text: "رَ", radicalIndex: 2, kind: "radical" }), true);

assert.throws(() => createComponentIdentity({ morphologicalRoles: "plural-waw" }), /must be an array/);
assert.throws(() => createComponentIdentity({ morphologicalRoles: ["unknown-role"] }), /Unknown morphologicalRoles role/);
assert.throws(() => createComponentIdentity({ orthographicRoles: ["unknown-role"] }), /Unknown orthographicRoles role/);
assert.throws(() => validateComponentIdentity({ schemaVersion: 99, morphologicalRoles: [], orthographicRoles: [] }), /Unsupported/);
assert.throws(() => withComponentIdentity({ text: "x", kind: "unknown" }), /Unknown structural kind/);
assert.throws(() => validateStructuralRunIdentity(null), /Structural run is required/);

console.log("Verified B8.1 semantic component identity contract.");
