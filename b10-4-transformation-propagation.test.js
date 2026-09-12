"use strict";
const assert = require("assert");
const { dispatchGeneration } = require("./script.js");
const engine = require("./explanation-engine.js");

const snapshot = dispatchGeneration({
  rootFamily: "triliteral",
  root: ["ط", "ل", "ع"],
  bab: "form-viii-iftial",
  babLabel: "باب الافتعال — اِفْتَعَلَ / يَفْتَعِلُ",
  majzumParticle: "لَمْ",
  mansubParticle: "لَنْ",
  colourRootLetters: false,
});

function record(section, field, rowIndex = 0) {
  return engine.buildExplanationRecord(snapshot, { section, field, rowIndex });
}

for (const [section, field] of [
  ["section01", "past"],
  ["section01", "present"],
  ["section02", "majzumPresent"],
  ["section02", "mansubPresent"],
  ["section02", "heavyEmphatic"],
  ["section03", "imperative"],
]) {
  const explanation = record(section, field);
  assert(explanation.rules.some((rule) => rule.id === "form8-ta-ta-assimilation"), `${section}.${field} should inherit the Bāb junction rule`);
  assert.strictEqual(explanation.events.length, 2, `${section}.${field} should expose Ibdāl then Idghām`);
  assert.strictEqual(explanation.events[0].operation, "substitution");
  assert.strictEqual(explanation.events[0].before.text, "طْت");
  assert.strictEqual(explanation.events[0].after.text, "طْط");
  assert.strictEqual(explanation.events[1].operation, "assimilation");
  assert.strictEqual(explanation.events[1].before.text, "طْط");
  assert.strictEqual(explanation.events[1].after.text, "طّ");
}

const activeParticiple = engine.buildExplanationRecord(snapshot, { section: "section04", group: "activeParticiple", rowIndex: 0, valueIndex: 0 });
assert(activeParticiple.rules.some((rule) => rule.id === "form8-ta-ta-assimilation"), "Active participle should inherit the transformed stem rule");
assert.strictEqual(activeParticiple.events.length, 2);

console.log("Verified B10.4 Bāb al-iftial Ibdāl → Idghām propagation across generated targets.");
