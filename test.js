const assert = require("node:assert/strict");
const {
  BAB_CONFIG, MAJZUM_PARTICLES, MANSUB_PARTICLES, SIGHAS, buildActivePast, buildActivePresent,
  buildPassivePast, buildPassivePresent, buildMajzumPresent,
  buildMansubPresent, generateActiveForms, generateVersion4Forms, generateMansubForms,
  buildEmphaticPresent, generateEmphaticForms,
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

// Columns J and K build the same present stem with لَ directly prefixed, then
// use row-specific endings. Nulls preserve the six genuinely blank K cells.
function expectedEmphaticForms(middleVowel) {
  const stem = `فْع${middleVowel}ل`;
  return {
    heavy: [
      `لَيَ${stem}َنَّ`, `لَيَ${stem}َانِّ`, `لَيَ${stem}ُنَّ`,
      `لَتَ${stem}َنَّ`, `لَتَ${stem}َانِّ`, `لَيَ${stem}ْنَانِّ`,
      `لَتَ${stem}َنَّ`, `لَتَ${stem}َانِّ`, `لَتَ${stem}ُنَّ`,
      `لَتَ${stem}ِنَّ`, `لَتَ${stem}َانِّ`, `لَتَ${stem}ْنَانِّ`,
      `لَأَ${stem}َنَّ`, `لَنَ${stem}َنَّ`,
    ],
    light: [
      `لَيَ${stem}َنْ`, null, `لَيَ${stem}ُنْ`,
      `لَتَ${stem}َنْ`, null, null,
      `لَتَ${stem}َنْ`, null, `لَتَ${stem}ُنْ`,
      `لَتَ${stem}ِنْ`, null, null,
      `لَأَ${stem}َنْ`, `لَنَ${stem}َنْ`,
    ],
  };
}

const emphaticBabCases = [
  ["فَتَحَ-يَفْتَحُ", "َ"],
  ["ضَرَبَ-يَضْرِبُ", "ِ"],
  ["نَصَرَ-يَنْصُرُ", "ُ"],
  ["سَمِعَ-يَسْمَعُ", "َ"],
  ["كَرُمَ-يَكْرُمُ", "ُ"],
  ["حَسِبَ-يَحْسِبُ", "ِ"],
];
const blankLightIndexes = [1, 4, 5, 7, 10, 11];
for (const [bab, middleVowel] of emphaticBabCases) {
  const expected = expectedEmphaticForms(middleVowel);
  const actual = generateEmphaticForms(["ف", "ع", "ل"], bab);
  assert.deepEqual(actual.map(({ heavyEmphatic }) => heavyEmphatic), expected.heavy);
  assert.deepEqual(actual.map(({ lightEmphatic }) => lightEmphatic), expected.light);
  assert.equal(actual.filter(({ heavyEmphatic }) => heavyEmphatic !== null).length, 14);
  assert.equal(actual.filter(({ lightEmphatic }) => lightEmphatic !== null).length, 8);
  assert.deepEqual(actual.flatMap(({ lightEmphatic }, index) => lightEmphatic === null ? [index] : []), blankLightIndexes);

  for (const [index, sighah] of SIGHAS.entries()) {
    assert.equal(actual[index].heavyEmphatic, buildEmphaticPresent(["ف", "ع", "ل"], BAB_CONFIG[bab], "heavy", sighah));
    assert.equal(actual[index].lightEmphatic, buildEmphaticPresent(["ف", "ع", "ل"], BAB_CONFIG[bab], "light", sighah));
    assert.equal(actual[index].heavyEmphatic.startsWith("لَ "), false);
    assert.equal(actual[index].heavyEmphatic.slice(0, 3), `لَ${sighah.presentPrefix}`);
    if (actual[index].lightEmphatic !== null) {
      assert.equal(actual[index].lightEmphatic.startsWith("لَ "), false);
      assert.equal(actual[index].lightEmphatic.slice(0, 3), `لَ${sighah.presentPrefix}`);
    }
  }

  // Exact workbook sequences: heavy shaddah versus light sukūn, and the
  // workbook-specific dual and feminine-plural heavy endings.
  assert.equal(actual[0].heavyEmphatic.endsWith("نَّ"), true);
  assert.equal(actual[0].lightEmphatic.endsWith("نْ"), true);
  assert.deepEqual([...actual[0].heavyEmphatic.slice(-3)].map((character) => character.codePointAt(0)), [0x646, 0x651, 0x64e]);
  assert.deepEqual([...actual[0].lightEmphatic.slice(-2)].map((character) => character.codePointAt(0)), [0x646, 0x652]);
  assert.equal(actual[1].heavyEmphatic.endsWith("َانِّ"), true);
  assert.equal(actual[5].heavyEmphatic.endsWith("ْنَانِّ"), true);
  assert.equal(actual[2].heavyEmphatic.includes("و"), false);
  assert.equal(actual[2].lightEmphatic.includes("و"), false);
  assert.equal(actual[9].heavyEmphatic.includes("ي"), false);
  assert.equal(actual[9].lightEmphatic.includes("ي"), false);
}
assert.throws(() => buildEmphaticPresent(["ف", "ع", "ل"], BAB_CONFIG[basicCases[0][0]], "medium"), /Unknown emphatic weight/);

console.log("Verified workbook-derived Version 6 emphatic forms for all six Bābs and all prior regressions.");
