"use strict";

const assert = require("node:assert/strict");
const {
  dispatchGeneration,
  MAZID_BAB_CONFIG,
  QUADRILITERAL_BAB_CONFIG,
} = require("./script.js");
const { enrichGeneratedSnapshot } = require("./grammatical-components.js");
const {
  enrichPresentation,
  enrichDerivationalSnapshot,
  ELEMENT_ROLE_MAP,
  LEGACY_ROLE_SEQUENCES,
} = require("./derivational-components.js");
const { validateStructuralRunIdentity } = require("./component-contract.js");

const TRI_ROOT = ["ك", "ت", "ب"];
const QUAD_ROOT = ["د", "ح", "ر", "ج"];
const OPTIONS = Object.freeze({ majzumParticle: "لَمْ", mansubParticle: "لَنْ" });

function generate(bab, rootFamily) {
  return dispatchGeneration({
    root: rootFamily === "quadriliteral" ? QUAD_ROOT : TRI_ROOT,
    rootFamily,
    bab,
    babLabel: bab,
    ...OPTIONS,
  });
}

function presentations(snapshot) {
  const values = [];
  for (const sectionName of ["section01", "section02", "section03"]) {
    for (const [rowIndex, row] of (snapshot.sections[sectionName] || []).entries()) {
      for (const [field, presentation] of Object.entries(row.presentation || {})) {
        if (presentation?.runs) values.push({ sectionName, rowIndex, field, presentation });
      }
    }
  }
  for (const [group, rows] of Object.entries(snapshot.sections.section04 || {})) {
    for (const [rowIndex, row] of (rows || []).entries()) {
      for (const [presentationIndex, presentation] of (row.presentations || []).entries()) {
        if (presentation?.runs) values.push({ sectionName: "section04", group, rowIndex, presentationIndex, field: group, presentation });
      }
    }
  }
  return values;
}

function stripIdentity(value) {
  if (Array.isArray(value)) return value.map(stripIdentity);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== "morphologicalRoles" && key !== "orthographicRoles")
    .map(([key, child]) => [key, stripIdentity(child)]));
}

function assertDeepFrozen(value, path = "snapshot") {
  if (!value || typeof value !== "object") return;
  assert.ok(Object.isFrozen(value), `${path} must be frozen`);
  if (Array.isArray(value)) value.forEach((child, index) => assertDeepFrozen(child, `${path}[${index}]`));
  else for (const [key, child] of Object.entries(value)) assertDeepFrozen(child, `${path}.${key}`);
}

function assertRoleSubset(before, after, label) {
  for (const role of before.morphologicalRoles || []) assert.ok((after.morphologicalRoles || []).includes(role), `${label}: lost morphological role ${role}`);
  for (const role of before.orthographicRoles || []) assert.ok((after.orthographicRoles || []).includes(role), `${label}: lost orthographic role ${role}`);
}

const observedElementIds = new Set();
const families = [
  ...Object.keys(MAZID_BAB_CONFIG).map((bab) => ({ bab, rootFamily: "triliteral" })),
  ...Object.keys(QUADRILITERAL_BAB_CONFIG).map((bab) => ({ bab, rootFamily: "quadriliteral" })),
];

for (const { bab, rootFamily } of families) {
  const raw = generate(bab, rootFamily);
  const grammatical = enrichGeneratedSnapshot(raw);
  const sourceBefore = JSON.stringify(grammatical);
  const enriched = enrichDerivationalSnapshot(grammatical);

  // B8.3 is metadata-only: every non-identity datum and every surface remains byte-for-byte equal.
  assert.deepEqual(stripIdentity(enriched), stripIdentity(grammatical), `${bab}: B8.3 changed non-identity data`);
  assert.equal(JSON.stringify(grammatical), sourceBefore, `${bab}: source snapshot was mutated`);

  const beforePresentations = presentations(grammatical);
  const afterPresentations = presentations(enriched);
  assert.equal(afterPresentations.length, beforePresentations.length, `${bab}: presentation count changed`);

  for (let i = 0; i < afterPresentations.length; i += 1) {
    const before = beforePresentations[i];
    const after = afterPresentations[i];
    assert.equal(after.presentation.text, before.presentation.text, `${bab}/${after.field}: presentation text changed`);
    assert.equal(after.presentation.runs.length, before.presentation.runs.length, `${bab}/${after.field}: run count changed`);

    for (let j = 0; j < after.presentation.runs.length; j += 1) {
      const beforeRun = before.presentation.runs[j];
      const afterRun = after.presentation.runs[j];
      assertRoleSubset(beforeRun, afterRun, `${bab}/${after.field}/run${j}`);
      validateStructuralRunIdentity(afterRun);

      if (afterRun.elementId) observedElementIds.add(afterRun.elementId);
      const expected = afterRun.elementId ? ELEMENT_ROLE_MAP[afterRun.elementId] : null;
      if (expected) {
        for (const role of expected.morphologicalRoles || []) assert.ok(afterRun.morphologicalRoles.includes(role), `${bab}/${after.field}/${afterRun.elementId}: missing ${role}`);
        for (const role of expected.orthographicRoles || []) assert.ok(afterRun.orthographicRoles.includes(role), `${bab}/${after.field}/${afterRun.elementId}: missing ${role}`);
      }

      const hamzaRoles = (afterRun.morphologicalRoles || []).filter((role) => role.startsWith("hamza-of-"));
      for (const role of hamzaRoles) {
        const expectedOrthography = role === "hamza-of-ifal" ? "hamzat-qat" : "hamzat-wasl";
        assert.ok(afterRun.orthographicRoles.includes(expectedOrthography), `${bab}/${after.field}: ${role} must also be ${expectedOrthography}`);
      }
    }
  }

  // Enrichment is stable and repeatable; a second pass cannot duplicate or reorder identities.
  assert.deepEqual(enrichDerivationalSnapshot(enriched), enriched, `${bab}: enrichment is not idempotent`);
  assertDeepFrozen(enriched, bab);
}

// Every stable builder identity registered for B8.3 must be exercised by at least one real generated presentation.
for (const elementId of Object.keys(ELEMENT_ROLE_MAP)) {
  assert.ok(observedElementIds.has(elementId), `ELEMENT_ROLE_MAP entry is not exercised by a generated path: ${elementId}`);
}

// Legacy templates are ordinal-by-structure, not glyph-driven. Interleaved non-derivational runs
// must not consume derivational ordinals, and each configured role sequence must be reproduced exactly.
for (const [bab, fields] of Object.entries(LEGACY_ROLE_SEQUENCES)) {
  for (const [field, sequence] of Object.entries(fields)) {
    const runs = [];
    for (let index = 0; index < sequence.length; index += 1) {
      runs.push({ text: `g${index}`, kind: "grammatical" });
      runs.push({ text: `d${index}`, kind: index % 2 ? "derivational-copy" : "derivational", radicalIndex: null, sourceRadicalIndex: index % 2 ? 1 : undefined });
      runs.push({ text: `r${index}`, kind: "radical", radicalIndex: 1 });
    }
    const enriched = enrichPresentation({ text: "synthetic", runs }, { bab, field });
    const derivationalRuns = enriched.runs.filter((run) => run.kind === "derivational" || run.kind === "derivational-copy");
    assert.equal(derivationalRuns.length, sequence.length, `${bab}/${field}: synthetic sequence length mismatch`);
    derivationalRuns.forEach((run, index) => {
      assert.deepEqual(run.morphologicalRoles, sequence[index], `${bab}/${field}: ordinal ${index} role mismatch`);
      const expectedOrthography = sequence[index].includes("hamza-of-ifal")
        ? ["hamzat-qat"]
        : sequence[index].some((role) => role === "hamza-of-infial" || role === "hamza-of-iftial")
          ? ["hamzat-wasl"]
          : [];
      assert.deepEqual(run.orthographicRoles, expectedOrthography, `${bab}/${field}: ordinal ${index} orthography mismatch`);
    });
  }
}

// Unknown/unmapped structural material remains semantically untouched rather than being guessed from its glyph.
const unknown = enrichPresentation({ text: "أ", runs: [{ text: "أ", kind: "derivational", elementId: "future.unmapped.hamza", morphologicalRoles: [], orthographicRoles: [] }] }, { bab: "future-bab", field: "past" });
assert.deepEqual(unknown.runs[0].morphologicalRoles, []);
assert.deepEqual(unknown.runs[0].orthographicRoles, []);

// Contract edges: null presentation is clone-safe; malformed snapshots are rejected.
assert.equal(enrichPresentation(null, { bab: "form-iv-ifal", field: "past" }), null);
assert.throws(() => enrichDerivationalSnapshot(null), /Generated snapshot is required/);
assert.throws(() => enrichDerivationalSnapshot({}), /Generated snapshot is required/);

console.log(`Verified B8.3 parity across ${families.length} implemented Mazīd families and all registered derivational identities.`);
