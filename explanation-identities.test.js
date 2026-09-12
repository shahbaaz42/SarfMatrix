"use strict";

const assert = require("node:assert/strict");
const { dispatchGeneration } = require("./script.js");
const identities = require("./explanation-identities.js");

const OPTIONS = Object.freeze({ majzumParticle: "لَمْ", mansubParticle: "لَنْ" });

function generate(bab, root = ["ك", "ت", "ب"], rootFamily = "triliteral") {
  return dispatchGeneration({ root, rootFamily, bab, babLabel: bab, ...OPTIONS });
}

function findRole(record, role) {
  return record.structure.find((segment) => (segment.morphologicalRoles || []).includes(role));
}

function findOrthography(record, role) {
  return record.structure.find((segment) => (segment.orthographicRoles || []).includes(role));
}

// Form X: B8.4 must expose both derivational identity and B8.2 grammatical identity
// while leaving the raw generator snapshot untouched.
{
  const raw = generate("form-x-istifal");
  const before = JSON.stringify(raw);
  const target = { section: "section01", rowIndex: 12, field: "present" }; // first person singular
  const record = identities.buildExplanationRecord(raw, target);

  assert.equal(JSON.stringify(raw), before, "B8.4 must not mutate the generated snapshot");
  assert.equal(record.surface, raw.sections.section01[12].present);
  assert.ok(findRole(record, "present-prefix-alif"), "first-person present prefix identity must reach B4 structure");
  assert.ok(findOrthography(record, "hamzat-qat"), "first-person alif must retain hamzat al-qat identity");
  assert.ok(findRole(record, "form10-sin"), "Form X sin identity must reach B4 structure");
  assert.ok(findRole(record, "form10-ta"), "Form X ta identity must reach B4 structure");

  const localized = identities.buildLocalizedExplanation(record, "en");
  const prefix = localized.structure.find((segment) => segment.morphologicalRoles.includes("present-prefix-alif"));
  assert.ok(prefix.morphologicalRoleLabels.includes("Present-tense prefix alif"));
  assert.ok(prefix.orthographicRoleLabels.includes("Hamzat al-qaṭʿ"));
  assert.ok(prefix.identitySummary.includes("Present-tense prefix alif"));
  assert.ok(prefix.note, "identity-bearing segments must expose learner-facing structure text");
}

// Form VII: morphological hamzah identity and orthographic waṣl identity are separate
// dimensions and must both remain visible in the explanation model.
{
  const raw = generate("form-vii-infial");
  const record = identities.buildExplanationRecord(raw, { section: "section01", rowIndex: 0, field: "past" });
  const hamza = findRole(record, "hamza-of-infial");
  assert.ok(hamza, "Form VII derivational hamzah must be exposed");
  assert.ok(hamza.orthographicRoles.includes("hamzat-wasl"), "Form VII hamzah must also expose waṣl orthography");

  const localized = identities.buildLocalizedExplanation(record, "en");
  const localizedHamza = localized.structure.find((segment) => segment.morphologicalRoles.includes("hamza-of-infial"));
  assert.ok(localizedHamza.identitySummary.includes("Derivational hamzah of infial"));
  assert.ok(localizedHamza.identitySummary.includes("Hamzat al-waṣl"));
}

// Form XV: the B8.3 hardening fix for ifanla.masdarAlif must be observable by B8.4.
{
  const raw = generate("bab-al-ifanla");
  const record = identities.buildExplanationRecord(raw, { section: "section04", group: "masdar", rowIndex: 0, valueIndex: 0 });
  assert.ok(findRole(record, "masdar-alif"), "Form XV maṣdar alif identity must reach explanations");
}

// The adapter remains explicit about supported learner-facing locales.
assert.throws(
  () => identities.roleLabel("ar", "hamzat-wasl", "orthographic"),
  /Unsupported B8\.4 identity locale/,
);

console.log("Verified B8.4 semantic component identities propagate into explanation records and English learner-facing structure labels.");
