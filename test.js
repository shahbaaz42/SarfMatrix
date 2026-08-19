const assert = require("node:assert/strict");
const {
  BAB_CONFIG, MAJZUM_PARTICLES, MANSUB_PARTICLES, SIGHAS, buildActivePast, buildActivePresent,
  buildPassivePast, buildPassivePresent, buildMajzumPresent,
  buildMansubPresent, generateActiveForms, generateVersion4Forms, generateMansubForms,
} = require("./script.js");

const activeCases = [
  {
    root: ["ك", "ر", "م"], bab: "كَرُمَ-يَكْرُمُ",
    past: ["كَرُمَ", "كَرُمَا", "كَرُمُوْا", "كَرُمَتْ", "كَرُمَتَا", "كَرُمْنَ", "كَرُمْتَ", "كَرُمْتُمَا", "كَرُمْتُمْ", "كَرُمْتِ", "كَرُمْتُمَا", "كَرُمْتُنَّ", "كَرُمْتُ", "كَرُمْنَا"],
    present: ["يَكْرُمُ", "يَكْرُمَانِ", "يَكْرُمُوْنَ", "تَكْرُمُ", "تَكْرُمَانِ", "يَكْرُمْنَ", "تَكْرُمُ", "تَكْرُمَانِ", "تَكْرُمُوْنَ", "تَكْرُمِيْنَ", "تَكْرُمَانِ", "تَكْرُمْنَ", "أَكْرُمُ", "نَكْرُمُ"],
  },
  {
    root: ["ن", "ص", "ر"], bab: "نَصَرَ-يَنْصُرُ",
    past: ["نَصَرَ", "نَصَرَا", "نَصَرُوْا", "نَصَرَتْ", "نَصَرَتَا", "نَصَرْنَ", "نَصَرْتَ", "نَصَرْتُمَا", "نَصَرْتُمْ", "نَصَرْتِ", "نَصَرْتُمَا", "نَصَرْتُنَّ", "نَصَرْتُ", "نَصَرْنَا"],
    present: ["يَنْصُرُ", "يَنْصُرَانِ", "يَنْصُرُوْنَ", "تَنْصُرُ", "تَنْصُرَانِ", "يَنْصُرْنَ", "تَنْصُرُ", "تَنْصُرَانِ", "تَنْصُرُوْنَ", "تَنْصُرِيْنَ", "تَنْصُرَانِ", "تَنْصُرْنَ", "أَنْصُرُ", "نَنْصُرُ"],
  },
];

for (const testCase of activeCases) {
  const actual = generateActiveForms(testCase.root, testCase.bab);
  assert.deepEqual(actual.map(({ past }) => past), testCase.past);
  assert.deepEqual(actual.map(({ present }) => present), testCase.present);
}

// Exact expected strings transcribed from the F/G/H workbook formulas at rows
// 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 21, and 22.
const version4Cases = [
  {
    root: ["ك", "ر", "م"], bab: "كَرُمَ-يَكْرُمُ",
    passivePast: ["كُرِمَ", "كُرِمَا", "كُرِمُوْا", "كُرِمَتْ", "كُرِمَتَا", "كُرِمْنَ", "كُرِمْتَ", "كُرِمْتُمَا", "كُرِمْتُمْ", "كُرِمْتِ", "كُرِمْتُمَا", "كُرِمْتُنَّ", "كُرِمْتُ", "كُرِمْنَا"],
    passivePresent: ["يُكْرَمُ", "يُكْرَمَانِ", "يُكْرَمُوْنَ", "تُكْرَمُ", "تُكْرَمَانِ", "يُكْرَمْنَ", "تُكْرَمُ", "تُكْرَمَانِ", "تُكْرَمُوْنَ", "تُكْرَمِيْنَ", "تُكْرَمَانِ", "تُكْرَمْنَ", "أُكْرَمُ", "نُكْرَمُ"],
    majzumVerb: ["يَكْرُمْ", "يَكْرُمَا", "يَكْرُمُوْا", "تَكْرُمْ", "تَكْرُمَا", "يَكْرُمْنَ", "تَكْرُمْ", "تَكْرُمَا", "تَكْرُمُوْا", "تَكْرُمِيْ", "تَكْرُمَا", "تَكْرُمْنَ", "أَكْرُمْ", "نَكْرُمْ"],
  },
  {
    root: ["ن", "ص", "ر"], bab: "نَصَرَ-يَنْصُرُ",
    passivePast: ["نُصِرَ", "نُصِرَا", "نُصِرُوْا", "نُصِرَتْ", "نُصِرَتَا", "نُصِرْنَ", "نُصِرْتَ", "نُصِرْتُمَا", "نُصِرْتُمْ", "نُصِرْتِ", "نُصِرْتُمَا", "نُصِرْتُنَّ", "نُصِرْتُ", "نُصِرْنَا"],
    passivePresent: ["يُنْصَرُ", "يُنْصَرَانِ", "يُنْصَرُوْنَ", "تُنْصَرُ", "تُنْصَرَانِ", "يُنْصَرْنَ", "تُنْصَرُ", "تُنْصَرَانِ", "تُنْصَرُوْنَ", "تُنْصَرِيْنَ", "تُنْصَرَانِ", "تُنْصَرْنَ", "أُنْصَرُ", "نُنْصَرُ"],
    majzumVerb: ["يَنْصُرْ", "يَنْصُرَا", "يَنْصُرُوْا", "تَنْصُرْ", "تَنْصُرَا", "يَنْصُرْنَ", "تَنْصُرْ", "تَنْصُرَا", "تَنْصُرُوْا", "تَنْصُرِيْ", "تَنْصُرَا", "تَنْصُرْنَ", "أَنْصُرْ", "نَنْصُرْ"],
  },
];

for (const testCase of version4Cases) {
  for (const particle of ["لَمْ", "لَا"]) {
    const actual = generateVersion4Forms(testCase.root, testCase.bab, particle);
    assert.deepEqual(actual.map(({ passivePast }) => passivePast), testCase.passivePast);
    assert.deepEqual(actual.map(({ passivePresent }) => passivePresent), testCase.passivePresent);
    assert.deepEqual(actual.map(({ majzumPresent }) => majzumPresent), testCase.majzumVerb.map((verb) => `${particle} ${verb}`));
  }
}

// Regression-check both active families for all 14 Ṣīghahs in all six Bābs.
const basicCases = [
  ["فَتَحَ-يَفْتَحُ", "فَعَلَ", "يَفْعَلُ"],
  ["ضَرَبَ-يَضْرِبُ", "فَعَلَ", "يَفْعِلُ"],
  ["نَصَرَ-يَنْصُرُ", "فَعَلَ", "يَفْعُلُ"],
  ["سَمِعَ-يَسْمَعُ", "فَعِلَ", "يَفْعَلُ"],
  ["كَرُمَ-يَكْرُمُ", "فَعُلَ", "يَفْعُلُ"],
  ["حَسِبَ-يَحْسِبُ", "فَعِلَ", "يَفْعِلُ"],
];
for (const [bab, expectedPast, expectedPresent] of basicCases) {
  const forms = generateActiveForms(["ف", "ع", "ل"], bab);
  assert.equal(forms[0].past, expectedPast);
  assert.equal(forms[0].present, expectedPresent);
  for (const [index, sighah] of SIGHAS.entries()) {
    assert.equal(forms[index].past, buildActivePast(["ف", "ع", "ل"], BAB_CONFIG[bab], sighah));
    assert.equal(forms[index].present, buildActivePresent(["ف", "ع", "ل"], BAB_CONFIG[bab], sighah));
  }
}

assert.equal(SIGHAS.length, 14);
assert.deepEqual(MAJZUM_PARTICLES, ["لَمْ", "لَمَّا", "لَا"]);
assert.throws(() => buildMajzumPresent(["ف", "ع", "ل"], BAB_CONFIG[basicCases[0][0]], "لَنْ"), /Unknown majzūm particle/);
assert.equal(buildPassivePast(["ف", "ع", "ل"]), "فُعِلَ");
assert.equal(buildPassivePresent(["ف", "ع", "ل"]), "يُفْعَلُ");

// Exact expected verb strings transcribed from the authoritative I-column
// formulas at rows 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 21, and 22.
const mansubCases = [
  {
    root: ["ك", "ر", "م"], bab: "كَرُمَ-يَكْرُمُ",
    verbs: ["يَكْرُمَ", "يَكْرُمَا", "يَكْرُمُوْا", "تَكْرُمَ", "تَكْرُمَا", "يَكْرُمْنَ", "تَكْرُمَ", "تَكْرُمَا", "تَكْرُمُوْا", "تَكْرُمِيْ", "تَكْرُمَا", "تَكْرُمْنَ", "أَكْرُمَ", "نَكْرُمَ"],
  },
  {
    root: ["ن", "ص", "ر"], bab: "نَصَرَ-يَنْصُرُ",
    verbs: ["يَنْصُرَ", "يَنْصُرَا", "يَنْصُرُوْا", "تَنْصُرَ", "تَنْصُرَا", "يَنْصُرْنَ", "تَنْصُرَ", "تَنْصُرَا", "تَنْصُرُوْا", "تَنْصُرِيْ", "تَنْصُرَا", "تَنْصُرْنَ", "أَنْصُرَ", "نَنْصُرَ"],
  },
];

assert.deepEqual(MANSUB_PARTICLES, ["أَنْ", "لَنْ", "كَيْ", "إِذَنْ"]);
for (const testCase of mansubCases) {
  for (const particle of MANSUB_PARTICLES) {
    const actual = generateMansubForms(testCase.root, testCase.bab, particle);
    const expected = testCase.verbs.map((verb) => `${particle} ${verb}`);
    assert.deepEqual(actual.map(({ mansubPresent }) => mansubPresent), expected);
    for (const [index, form] of actual.entries()) {
      assert.equal(form.mansubPresent, buildMansubPresent(testCase.root, BAB_CONFIG[testCase.bab], particle, SIGHAS[index]));
      assert.equal(form.mansubPresent.slice(particle.length, particle.length + 1), " ");
      assert.notEqual(form.mansubPresent.slice(particle.length + 1, particle.length + 2), " ");
    }
  }
}
assert.throws(() => buildMansubPresent(["ف", "ع", "ل"], BAB_CONFIG[basicCases[0][0]], "لِـ"), /Unknown manṣūb particle/);

console.log("Verified workbook-derived Version 5 manṣūb forms for two roots/all four particles and all prior regressions.");
