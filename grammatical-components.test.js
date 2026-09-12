"use strict";

const assert = require("node:assert/strict");
const { dispatchGeneration } = require("./script.js");
const { enrichGeneratedSnapshot } = require("./grammatical-components.js");

const raw = dispatchGeneration({
  root: ["ن", "ص", "ر"],
  rootFamily: "triliteral",
  bab: "نَصَرَ-يَنْصُرُ",
  babLabel: "نَصَرَ / يَنْصُرُ — فَعَلَ / يَفْعُلُ",
  majzumParticle: "لَمْ",
  mansubParticle: "لَنْ",
});
const enriched = enrichGeneratedSnapshot(raw);

// B8.2 is metadata-only: authoritative generated surfaces are unchanged.
for (const section of ["section01", "section02", "section03"]) {
  raw.sections[section].forEach((row, index) => {
    for (const [key, value] of Object.entries(row)) {
      if (key === "presentation") continue;
      assert.deepEqual(enriched.sections[section][index][key], value, `${section}[${index}].${key}`);
    }
  });
}

function roles(section, rowIndex, field) {
  return enriched.sections[section][rowIndex].presentation[field].runs.flatMap((run) => run.morphologicalRoles || []);
}
function orthographicRoles(section, rowIndex, field) {
  return enriched.sections[section][rowIndex].presentation[field].runs.flatMap((run) => run.orthographicRoles || []);
}

assert.ok(roles("section01", 12, "present").includes("present-prefix-alif"));
assert.ok(orthographicRoles("section01", 12, "present").includes("hamzat-qat"));
assert.ok(roles("section01", 13, "present").includes("present-prefix-nun"));
assert.ok(roles("section01", 0, "present").includes("present-prefix-ya"));
assert.ok(roles("section01", 3, "present").includes("present-prefix-ta"));

assert.ok(roles("section01", 1, "past").includes("dual-alif"));
assert.ok(roles("section01", 2, "past").includes("plural-waw"));
assert.ok(roles("section01", 3, "past").includes("feminine-ta"));
assert.ok(roles("section01", 5, "past").includes("nun-niswa"));
assert.ok(roles("section01", 6, "past").includes("subject-ta"));
assert.ok(roles("section01", 13, "past").includes("subject-na"));

assert.ok(roles("section01", 2, "present").includes("plural-waw"));
assert.ok(roles("section01", 9, "present").includes("feminine-address-ya"));
assert.ok(roles("section01", 5, "present").includes("nun-niswa"));

assert.ok(roles("section02", 0, "majzumPresent").includes("jussive-particle"));
assert.ok(roles("section02", 0, "mansubPresent").includes("subjunctive-particle"));
assert.ok(roles("section02", 0, "heavyEmphatic").includes("heavy-emphasis-nun"));
assert.ok(roles("section02", 0, "lightEmphatic").includes("light-emphasis-nun"));
assert.ok(roles("section02", 5, "heavyEmphatic").includes("nun-niswa"));

assert.ok(roles("section03", 8, "imperative").includes("plural-waw"));
assert.ok(roles("section03", 9, "imperative").includes("feminine-address-ya"));
assert.ok(roles("section03", 11, "imperative").includes("nun-niswa"));
assert.ok(roles("section03", 7, "heavyImperative").includes("heavy-emphasis-nun"));

// Existing ownership remains intact.
const radicalRuns = enriched.sections.section01[12].presentation.present.runs.filter((run) => run.kind === "radical");
assert.deepEqual(radicalRuns.map((run) => run.radicalIndex), [1, 2, 3]);
assert.ok(Object.isFrozen(enriched));
assert.ok(Object.isFrozen(enriched.sections.section01[0].presentation.present.runs));

console.log("Verified B8.2 grammatical component identities without changing generated surfaces.");
