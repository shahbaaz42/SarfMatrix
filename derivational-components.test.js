"use strict";

const assert = require("node:assert/strict");
const { dispatchGeneration } = require("./script.js");
const { enrichGeneratedSnapshot } = require("./grammatical-components.js");
const { enrichDerivationalSnapshot, ELEMENT_ROLE_MAP } = require("./derivational-components.js");

function generate(root, bab, rootFamily = "triliteral") {
  return dispatchGeneration({
    root,
    rootFamily,
    bab,
    babLabel: bab,
    majzumParticle: "لَمْ",
    mansubParticle: "لَنْ",
  });
}
function enrich(raw) {
  return enrichDerivationalSnapshot(enrichGeneratedSnapshot(raw));
}
function allRoles(presentation, field = "morphologicalRoles") {
  return presentation.runs.flatMap((run) => run[field] || []);
}
function assertSurfacesUnchanged(raw, enriched) {
  for (const section of ["section01", "section02", "section03"]) {
    raw.sections[section].forEach((row, rowIndex) => {
      for (const [key, value] of Object.entries(row)) {
        if (key === "presentation") continue;
        assert.deepEqual(enriched.sections[section][rowIndex][key], value, `${section}[${rowIndex}].${key}`);
      }
    });
  }
}

// Form IV: the same visible hamzah carries a Bāb function and qaṭʿ identity.
const formIVRaw = generate(["ك", "ر", "م"], "form-iv-ifal");
const formIV = enrich(formIVRaw);
assertSurfacesUnchanged(formIVRaw, formIV);
const formIVPast = formIV.sections.section01[0].presentation.past;
assert.ok(allRoles(formIVPast).includes("hamza-of-ifal"));
assert.ok(allRoles(formIVPast, "orthographicRoles").includes("hamzat-qat"));

// Form III legacy literal is identified by Bāb/field structure, not by scanning alif.
const formIIIRaw = generate(["ك", "ت", "ب"], "form-iii-mufaalah");
const formIII = enrich(formIIIRaw);
assertSurfacesUnchanged(formIIIRaw, formIII);
assert.ok(allRoles(formIII.sections.section01[0].presentation.past).includes("form3-alif"));
assert.ok(allRoles(formIII.sections.section01[0].presentation.passivePast).includes("form3-passive-waw"));

// Form X uses stable elementIds: hamzat al-waṣl remains independent from its
// morphological identity as the hamzah of istifʿāl.
const formXRaw = generate(["غ", "ف", "ر"], "form-x-istifal");
const formX = enrich(formXRaw);
assertSurfacesUnchanged(formXRaw, formX);
const formXPast = formX.sections.section01[0].presentation.past;
assert.ok(allRoles(formXPast).includes("hamza-of-istifal"));
assert.ok(allRoles(formXPast).includes("form10-sin"));
assert.ok(allRoles(formXPast).includes("form10-ta"));
assert.ok(allRoles(formXPast, "orthographicRoles").includes("hamzat-wasl"));

// Grammatical and derivational identities coexist without overwriting B8.2.
const formXFirstPersonPresent = formX.sections.section01[12].presentation.present;
assert.ok(allRoles(formXFirstPersonPresent).includes("present-prefix-alif"));
assert.ok(allRoles(formXFirstPersonPresent, "orthographicRoles").includes("hamzat-qat"));

// Genuine quadriliteral augmentation uses its own semantic role family.
const qRaw = generate(["د", "ح", "ر", "ج"], "quadriliteral-ifanlal", "quadriliteral");
const q = enrich(qRaw);
assertSurfacesUnchanged(qRaw, q);
const qPast = q.sections.section01[0].presentation.past;
assert.ok(allRoles(qPast).includes("hamza-of-quadriliteral-ifanlal"));
assert.ok(allRoles(qPast).includes("quadriliteral-ifanlal-inserted-nun"));
assert.ok(allRoles(qPast, "orthographicRoles").includes("hamzat-wasl"));

// Stable registry entries are language-neutral and frozen.
assert.deepEqual(ELEMENT_ROLE_MAP["form10.hamzatWasl"], {
  morphologicalRoles: ["hamza-of-istifal"],
  orthographicRoles: ["hamzat-wasl"],
});
assert.ok(Object.isFrozen(ELEMENT_ROLE_MAP));
assert.ok(Object.isFrozen(formX));

console.log("Verified B8.3 derivational and hamzah identities without changing generated surfaces.");
