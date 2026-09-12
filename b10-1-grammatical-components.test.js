"use strict";

const assert = require("node:assert/strict");
const { dispatchGeneration } = require("./script.js");
const identities = require("./explanation-identities.js");

const raw = dispatchGeneration({
  root: ["ك", "ت", "ب"],
  rootFamily: "triliteral",
  bab: "نَصَرَ-يَنْصُرُ",
  babLabel: "نَصَرَ-يَنْصُرُ",
  majzumParticle: "لَمْ",
  mansubParticle: "لَنْ",
});

function record(target) {
  return identities.buildExplanationRecord(raw, target);
}

function segmentsWithRole(explanation, role) {
  return explanation.structure.filter((segment) => (segment.morphologicalRoles || []).includes(role));
}

function oneRole(explanation, role) {
  const matches = segmentsWithRole(explanation, role);
  assert.equal(matches.length, 1, `${role} should identify exactly one structure segment`);
  return matches[0];
}

// Feminine-plural emphatic forms: nūn al-niswah, separating alif and heavy
// nūn al-tawkīd must be three independent structure components.
for (const rowIndex of [5, 11]) {
  const explanation = record({ section: "section02", rowIndex, field: "heavyEmphatic" });
  const niswah = oneRole(explanation, "nun-niswa");
  const separator = oneRole(explanation, "feminine-emphasis-separator-alif");
  const emphasis = oneRole(explanation, "heavy-emphasis-nun");
  assert.notEqual(niswah, emphasis, "the two nūns must never share one structure segment");
  assert.equal(separator.text.replace(/\p{M}/gu, ""), "ا");
}

// Masculine dual.
{
  const nominative = record({ section: "section04", group: "activeParticiple", rowIndex: 0, valueIndex: 1 });
  oneRole(nominative, "dual-case-alif");
  oneRole(nominative, "dual-nun");

  const accusative = record({ section: "section04", group: "activeParticiple", rowIndex: 1, valueIndex: 1 });
  oneRole(accusative, "dual-case-ya");
  oneRole(accusative, "dual-nun");
}

// Sound masculine plural.
{
  const nominative = record({ section: "section04", group: "activeParticiple", rowIndex: 0, valueIndex: 2 });
  oneRole(nominative, "sound-masculine-plural-waw");
  oneRole(nominative, "sound-masculine-plural-nun");

  const genitive = record({ section: "section04", group: "activeParticiple", rowIndex: 2, valueIndex: 2 });
  oneRole(genitive, "sound-masculine-plural-ya");
  oneRole(genitive, "sound-masculine-plural-nun");
}

// Feminine singular, dual and sound feminine plural are mandatory B10.1 scope.
{
  const singular = record({ section: "section04", group: "activeParticiple", rowIndex: 0, valueIndex: 3 });
  oneRole(singular, "feminine-singular-ta-marbuta");
  oneRole(singular, "case-nominative");

  const dual = record({ section: "section04", group: "activeParticiple", rowIndex: 2, valueIndex: 4 });
  oneRole(dual, "feminine-dual-ta");
  oneRole(dual, "dual-case-ya");
  oneRole(dual, "dual-nun");

  const pluralAccusative = record({ section: "section04", group: "activeParticiple", rowIndex: 1, valueIndex: 5 });
  oneRole(pluralAccusative, "sound-feminine-plural-at");
  const caseSegment = oneRole(pluralAccusative, "case-accusative");
  assert.ok(caseSegment.morphologicalRoles.includes("case-marker-kasra"), "sound feminine plural accusative must use kasrah");
}

// Passive participles must receive the same nominal case architecture.
{
  const feminineDual = record({ section: "section04", group: "passiveParticiple", rowIndex: 0, valueIndex: 4 });
  oneRole(feminineDual, "feminine-dual-ta");
  oneRole(feminineDual, "dual-case-alif");
  oneRole(feminineDual, "dual-nun");
}

console.log("Verified B10.1 separation of feminine emphatic nūns and Section 04 masculine/feminine nominal components.");
