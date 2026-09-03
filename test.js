const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const {
  BAB_CONFIG, MAZID_BAB_CONFIG, MAJZUM_PARTICLES, MANSUB_PARTICLES, SIGHAS, buildActivePast, buildActivePresent,
  buildPassivePast, buildPassivePresent, buildMajzumPresent,
  buildMansubPresent, generateActiveForms, generateVersion4Forms, generateMansubForms,
  buildEmphaticPresent, generateEmphaticForms, buildImperative, generateImperativeForms,
  HARAKAT, LETTERS, NOMINAL_INFLECTIONS, buildActiveParticipleStem, buildPassiveParticipleStem,
  inflectNominalStem, generateActiveParticipleForms, generatePassiveParticipleForms,
  generateElativeForms, generateZarfForms,
  buildGeneratedSnapshot, dispatchGeneration, updateSnapshotColour, createGeneratedStateStore, presentedRuns, isSoundFormIVRoot, isRegularFormVIIIRoot,
  FORM_VIII_PHASE_A_RULES, formVIIITransformation,
} = require("./script.js");
const { filenameFor, metadataRows, metadataLine, landscapeVerbTable, buildExportPages, buildDocx, buildPdfDocument, FOOTER } = require("./export.js");

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

assert.deepEqual(MANSUB_PARTICLES, ["لَنْ", "أَنْ", "كَيْ", "إِذَنْ"]);
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

// Exact L/M/N workbook outputs for all 14 rows, including unavailable light-Nūn forms.
const imperativeForms = generateImperativeForms(["ك", "ر", "م"], "كَرُمَ-يَكْرُمُ");
assert.deepEqual(imperativeForms.map(({ imperative }) => imperative), [
  "لِيَكْرُمْ", "لِيَكْرُمَا", "لِيَكْرُمُوْا", "لِتَكْرُمْ", "لِتَكْرُمَا", "لِيَكْرُمْنَ",
  "اُكْرُمْ", "اُكْرُمَا", "اُكْرُمُوْا", "اُكْرُمِيْ", "اُكْرُمَا", "اُكْرُمْنَ", "لِأَكْرُمْ", "لِنَكْرُمْ",
]);
assert.deepEqual(imperativeForms.map(({ heavyImperative }) => heavyImperative), [
  "لِيَكْرُمَنَّ", "لِيَكْرُمَانِّ", "لِيَكْرُمُنَّ", "لِتَكْرُمَنَّ", "لِتَكْرُمَانِّ", "لِيَكْرُمْنَانِّ",
  "اُكْرُمَنَّ", "اُكْرُمَانِّ", "اُكْرُمُنَّ", "اُكْرُمِنَّ", "اُكْرُمَانِّ", "اُكْرُمْنَانِّ", "لِأَكْرُمَنَّ", "لِنَكْرُمَنَّ",
]);
assert.deepEqual(imperativeForms.map(({ lightImperative }) => lightImperative), [
  "لِيَكْرُمَنْ", null, "لِيَكْرُمُنْ", "لِتَكْرُمَنْ", null, null,
  "اُكْرُمَنْ", null, "اُكْرُمُنْ", "اُكْرُمِنْ", null, null, "لِأَكْرُمَنْ", "لِنَكْرُمَنْ",
]);

for (const [bab] of basicCases) {
  const config = BAB_CONFIG[bab];
  const forms = generateImperativeForms(["ف", "ع", "ل"], bab);
  for (const [index, sighah] of SIGHAS.entries()) {
    assert.equal(forms[index].imperative, buildImperative(["ف", "ع", "ل"], config, "ordinary", sighah));
    assert.equal(forms[index].heavyImperative, buildImperative(["ف", "ع", "ل"], config, "heavy", sighah));
    assert.equal(forms[index].lightImperative, buildImperative(["ف", "ع", "ل"], config, "light", sighah));
    if (sighah.person === 2) {
      const initial = `ا${config.imperativeInitialVowel}`;
      assert.equal(forms[index].imperative.startsWith(initial), true);
      assert.equal(forms[index].heavyImperative.startsWith(initial), true);
      if (forms[index].lightImperative !== null) assert.equal(forms[index].lightImperative.startsWith(initial), true);
    }
  }
}
assert.throws(() => buildImperative(["ف", "ع", "ل"], BAB_CONFIG[basicCases[0][0]], "medium"), /Unknown imperative weight/);

// Combined case declensions share one engine for both participle stems.
const derivedRoot = ["ك", "ر", "م"];
assert.equal(HARAKAT.DAMMATAN, "ٌ");
assert.equal(HARAKAT.FATHATAN, "ً");
assert.equal(HARAKAT.KASRATAN, "ٍ");
assert.equal(LETTERS.TA_MARBUTA, "ة");
assert.equal(LETTERS.ALIF_MAQSURA, "ى");
assert.equal(buildActiveParticipleStem(derivedRoot), "كَارِم");
assert.equal(buildPassiveParticipleStem(derivedRoot), "مَكْرُوم");

const activeParticiple = generateActiveParticipleForms(derivedRoot);
const passiveParticiple = generatePassiveParticipleForms(derivedRoot);
const expectedActiveCases = {
  nominative: ["كَارِمٌ", "كَارِمَانِ", "كَارِمُونَ", "كَارِمَةٌ", "كَارِمَتَانِ", "كَارِمَاتٌ"],
  accusative: ["كَارِمًا", "كَارِمَيْنِ", "كَارِمِينَ", "كَارِمَةً", "كَارِمَتَيْنِ", "كَارِمَاتٍ"],
  genitive: ["كَارِمٍ", "كَارِمَيْنِ", "كَارِمِينَ", "كَارِمَةٍ", "كَارِمَتَيْنِ", "كَارِمَاتٍ"],
};
const expectedPassiveCases = {
  nominative: ["مَكْرُومٌ", "مَكْرُومَانِ", "مَكْرُومُونَ", "مَكْرُومَةٌ", "مَكْرُومَتَانِ", "مَكْرُومَاتٌ"],
  accusative: ["مَكْرُومًا", "مَكْرُومَيْنِ", "مَكْرُومِينَ", "مَكْرُومَةً", "مَكْرُومَتَيْنِ", "مَكْرُومَاتٍ"],
  genitive: ["مَكْرُومٍ", "مَكْرُومَيْنِ", "مَكْرُومِينَ", "مَكْرُومَةٍ", "مَكْرُومَتَيْنِ", "مَكْرُومَاتٍ"],
};
for (const caseName of ["nominative", "accusative", "genitive"]) {
  assert.deepEqual(activeParticiple.map((form) => form[caseName]), expectedActiveCases[caseName]);
  assert.deepEqual(passiveParticiple.map((form) => form[caseName]), expectedPassiveCases[caseName]);
}
assert.deepEqual(activeParticiple.map(({ id, gender, number }) => ({ id, gender, number })), passiveParticiple.map(({ id, gender, number }) => ({ id, gender, number })));
assert.deepEqual(inflectNominalStem("س").map(({ id }) => id), NOMINAL_INFLECTIONS.map(({ id }) => id));

const elative = generateElativeForms(derivedRoot);
assert.deepEqual(elative.primary, ["أَكْرَمُ", "أَكْرَمَانِ", "أَكْرَمُوْنَ", "كُرْمَى", "كُرْمَيَانِ", "كُرْمَيَاتٌ"]);
assert.deepEqual(elative.additional, [null, null, "أَكَارِمُ", null, null, "كُرَمٌ"]);

const zarfVowels = [
  ["فَتَحَ-يَفْتَحُ", "َ"], ["ضَرَبَ-يَضْرِبُ", "ِ"], ["نَصَرَ-يَنْصُرُ", "َ"],
  ["سَمِعَ-يَسْمَعُ", "َ"], ["كَرُمَ-يَكْرُمُ", "َ"], ["حَسِبَ-يَحْسِبُ", "ِ"],
];
const zarfPlurals = new Set();
for (const [bab, vowel] of zarfVowels) {
  assert.equal(BAB_CONFIG[bab].zarfMiddleVowel, vowel);
  const forms = generateZarfForms(derivedRoot, bab);
  zarfPlurals.add(forms.ordinaryPlural);
  assert.equal(forms.taMarbutaPlural, null);
  assert.equal(forms.ordinarySingular, `مَكْر${vowel}مُ`);
}
assert.deepEqual([...zarfPlurals], ["مَكَارِمُ"]);
assert.deepEqual(generateZarfForms(derivedRoot, "كَرُمَ-يَكْرُمُ"), {
  ordinarySingular: "مَكْرَمُ", ordinaryDual: "مَكْرَمَانِ", ordinaryPlural: "مَكَارِمُ",
  taMarbutaSingular: "مَكْرَمَةٌ", taMarbutaDual: "مَكْرَمَتَانِ", taMarbutaPlural: null,
});

const populatedDerivedCells = ["nominative", "accusative", "genitive"]
  .reduce((total, caseName) => total + activeParticiple.filter((form) => form[caseName]).length + passiveParticiple.filter((form) => form[caseName]).length, 0)
  + elative.primary.filter(Boolean).length + elative.additional.filter(Boolean).length
  + Object.values(generateZarfForms(derivedRoot, "كَرُمَ-يَكْرُمُ")).filter(Boolean).length;
assert.equal(populatedDerivedCells, 49);

const html = fs.readFileSync("index.html", "utf8");
assert.equal(html.includes('<script src="script.js?v=form-viii-special-phase-a"></script>'), true);
assert.equal((html.match(/class="result-section(?: derived-section)?"/g) || []).length, 4);
assert.equal((html.match(/class="table-wrap"/g) || []).length, 8);
assert.equal((html.match(/class="derived-card"/g) || []).length, 5);
for (const label of ["القسم 01 — المرفوع والمجهول", "القسم 02 — المجزوم والمنصوب والتوكيد", "القسم 03 — فعل الأمر", "القسم 04 — المشتقات"]) assert.equal(html.includes(label), true);
for (const label of ["اسم الفاعل", "اسم المفعول", "اسم التفضيل", "اسم الظرف"]) assert.equal(html.includes(`<h3>${label}</h3>`), true);
for (const label of ["الفعل الماضي المرفوع", "الفعل المضارع المرفوع", "الفعل الماضي المجهول", "الفعل المضارع المجهول", "حرف الجزم", "حرف النصب"]) assert.equal(html.includes(label), true);
const babSelect = html.match(/<select id="bab"[\s\S]*?<\/select>/)[0];
assert.equal(babSelect.includes('required'), true);
assert.equal(babSelect.includes('<option value="" selected disabled>اختر الباب</option>'), true);
assert.deepEqual([...babSelect.matchAll(/<option value="([^"]*)"/g)].map((match) => match[1]), ["", ...Object.keys(BAB_CONFIG), ...Object.keys(MAZID_BAB_CONFIG)]);
assert.deepEqual([...babSelect.matchAll(/<option[^>]*>([^<]+)<\/option>/g)].map((match) => match[1]), [
  "اختر الباب",
  "فَتَحَ / يَفْتَحُ — فَعَلَ / يَفْعَلُ", "ضَرَبَ / يَضْرِبُ — فَعَلَ / يَفْعِلُ",
  "نَصَرَ / يَنْصُرُ — فَعَلَ / يَفْعُلُ", "سَمِعَ / يَسْمَعُ — فَعِلَ / يَفْعَلُ",
  "كَرُمَ / يَكْرُمُ — فَعُلَ / يَفْعُلُ", "حَسِبَ / يَحْسِبُ — فَعِلَ / يَفْعِلُ",
  "باب الإفعال — أَفْعَلَ / يُفْعِلُ",
  "باب التفعيل — فَعَّلَ / يُفَعِّلُ",
  "باب المفاعلة — فَاعَلَ / يُفَاعِلُ",
  "باب التفعّل — تَفَعَّلَ / يَتَفَعَّلُ",
  "باب التفاعل — تَفَاعَلَ / يَتَفَاعَلُ",
  "باب الانفعال — اِنْفَعَلَ / يَنْفَعِلُ",
  "باب الافتعال — اِفْتَعَلَ / يَفْتَعِلُ",
]);
const mansubSelect = html.match(/<select id="mansub-particle"[\s\S]*?<\/select>/)[0];
assert.equal(mansubSelect.match(/<option[^>]*value="([^"]+)"/)[1], "لَنْ");
assert.equal(mansubSelect.includes('<option value="لَنْ" selected>'), true);
assert.deepEqual([...mansubSelect.matchAll(/<option[^>]*value="([^"]+)"/g)].map((match) => match[1]), MANSUB_PARTICLES);

// Version 8 final presentation and immutable export-state regressions.
const css = fs.readFileSync("style.css", "utf8");
assert.match(css, /\.app\s*\{[\s\S]*?width:\s*94vw;[\s\S]*?max-width:\s*100rem;/);
assert.match(css, /font-family:\s*Calibri,\s*"Segoe UI",\s*Arial,\s*sans-serif;/);
assert.match(css, /\.result-section h2\s*\{[\s\S]*?text-align:\s*right;/);
assert.match(css, /\.derived-card h3\s*\{[\s\S]*?text-align:\s*right;/);
assert.match(css, /th\s*\{[\s\S]*?text-align:\s*center;/);
assert.match(css, /td\s*\{[\s\S]*?text-align:\s*center;/);
assert.match(css, /tbody td:first-child\s*\{\s*text-align:\s*right;/);
assert.match(css, /@media \(max-width: 32rem\)[\s\S]*?overflow-y:\s*auto;/);
assert.match(css, /\.table-wrap[\s\S]*?overflow-x:\s*auto;/);
assert.equal(/id="colour-root-letters"[^>]*checked/.test(html), false);
assert.match(html, /<span>Colour root letters<\/span>/);
assert.match(html, /<section id="export-panel"[\s\S]*?PDF[\s\S]*?Word[\s\S]*?Portrait[\s\S]*?Landscape[\s\S]*?Download/);
assert.match(html, /Developed by Shahbaaz Ahmed/);
assert.match(html, /mailto:shahbaaz\.education@gmail\.com/);
assert.match(html, /© Shahbaaz Ahmed\. All Rights Reserved\./);

const snapshotOptions = {
  root: ["د", "خ", "ل"],
  bab: "فَتَحَ-يَفْتَحُ",
  babLabel: "فَتَحَ / يَفْتَحُ — فَعَلَ / يَفْعَلُ",
  majzumParticle: "لَمْ",
  mansubParticle: "لَنْ",
};
const snapshot = buildGeneratedSnapshot(snapshotOptions);
assert.equal(Object.isFrozen(snapshot), true);
assert.equal(Object.isFrozen(snapshot.root), true);
assert.equal(Object.isFrozen(snapshot.sections.section04.activeParticiple[0].values), true);
snapshot.root[0] = "ك";
assert.equal(snapshot.root[0], "د");
assert.equal(snapshot.sections.section01[0].past, generateActiveForms(snapshotOptions.root, snapshotOptions.bab)[0].past);

// Every Mujarrad Bāb uses the same complete participle declension while the
// three verb sections remain projections of their pre-existing generators.
for (const [root, bab] of Object.keys(BAB_CONFIG).map((bab, index) => [index % 2 ? ["ن", "ص", "ر"] : ["د", "خ", "ل"], bab])) {
  const babSnapshot = buildGeneratedSnapshot({ ...snapshotOptions, root, bab });
  const activeVerbs = generateActiveForms(root, bab);
  const passiveVerbs = generateVersion4Forms(root, bab, snapshotOptions.majzumParticle);
  const mansubVerbs = generateMansubForms(root, bab, snapshotOptions.mansubParticle);
  const imperatives = generateImperativeForms(root, bab);
  assert.deepEqual(babSnapshot.sections.section01.map(({ pronoun, past, present, passivePast, passivePresent }) => ({ pronoun, past, present, passivePast, passivePresent })), activeVerbs.map(({ pronoun, past, present }, index) => ({ pronoun, past, present, passivePast: passiveVerbs[index].passivePast, passivePresent: passiveVerbs[index].passivePresent })));
  assert.deepEqual(babSnapshot.sections.section02.map(({ mansubPresent }) => mansubPresent), mansubVerbs.map(({ mansubPresent }) => mansubPresent));
  assert.deepEqual(babSnapshot.sections.section03.map(({ imperative, heavyImperative, lightImperative }) => ({ imperative, heavyImperative, lightImperative })), imperatives.map(({ imperative, heavyImperative, lightImperative }) => ({ imperative, heavyImperative, lightImperative })));
  for (const key of ["activeParticiple", "passiveParticiple"]) {
    const rows = babSnapshot.sections.section04[key];
    assert.deepEqual(rows.map(({ label }) => label), ["مرفوع", "منصوب", "مجرور"]);
    assert.equal(rows.length, 3);
    assert.equal(rows.every(({ values }) => values.length === 6), true);
  }
}
const colouredSnapshot = updateSnapshotColour(snapshot, true);
assert.equal(colouredSnapshot.sections, snapshot.sections);
assert.equal(colouredSnapshot.sections.section01[0].past, snapshot.sections.section01[0].past);
for (const row of snapshot.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.equal(row.presentation[key].text, row[key]);
for (const row of snapshot.sections.section02) for (const key of ["majzumPresent", "mansubPresent", "heavyEmphatic", "lightEmphatic"]) assert.equal(row.presentation[key].text || null, row[key]);
for (const row of snapshot.sections.section03) for (const key of ["imperative", "heavyImperative", "lightImperative"]) assert.equal(row.presentation[key].text || null, row[key]);
for (const rows of Object.values(snapshot.sections.section04)) for (const row of rows) row.values.forEach((value, index) => assert.equal(row.presentations[index].text || null, value));

function assertStructuralValue(value, expectedText = value.text) {
  assert.equal(value.text, expectedText);
  assert.equal(value.runs.map(({ text }) => text).join(""), expectedText);
  assert.deepEqual(value.runs.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
}
const enteredPast = snapshot.sections.section01[0].presentation.past;
assertStructuralValue(enteredPast, "دَخَلَ");
assert.deepEqual(enteredPast.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["دَ", 1], ["خَ", 2], ["لَ", 3]]);
const enteredDual = snapshot.sections.section01[1].presentation.past;
assertStructuralValue(enteredDual, "دَخَلَا");
assert.deepEqual(enteredDual.runs.slice(-2).map(({ text, radicalIndex }) => [text, radicalIndex]), [["لَ", 3], ["ا", null]]);
assert.equal(snapshot.sections.section01[1].past, "دَخَلَا");
assert.deepEqual(presentedRuns(enteredDual.text, enteredDual, true).map(({ text, radicalIndex }) => [text, radicalIndex]), [["دَ", 1], ["خَ", 2], ["لَ", 3], ["ا", null]]);
const otherDualSnapshot = buildGeneratedSnapshot({ ...snapshotOptions, root: ["ن", "ص", "ر"], bab: "نَصَرَ-يَنْصُرُ" });
const otherDual = otherDualSnapshot.sections.section01[1].presentation.past;
assert.equal(otherDual.text, "نَصَرَا");
assert.deepEqual(otherDual.runs.slice(-2).map(({ text, radicalIndex }) => [text, radicalIndex]), [["رَ", 3], ["ا", null]]);
for (const particle of ["لَمْ", "لَنْ", "لَا"]) {
  const particleSnapshot = buildGeneratedSnapshot({ ...snapshotOptions, majzumParticle: particle === "لَنْ" ? "لَمْ" : particle, mansubParticle: particle === "لَنْ" ? particle : "لَنْ" });
  const value = particle === "لَنْ" ? particleSnapshot.sections.section02[0].presentation.mansubPresent : particleSnapshot.sections.section02[0].presentation.majzumPresent;
  assert.equal(value.runs[0].radicalIndex, null);
  assert.equal(value.runs[0].text.startsWith(`${particle} `), true);
  assert.equal(value.runs.filter(({ radicalIndex }) => radicalIndex).length, 3);
}
const hamzahSnapshot = buildGeneratedSnapshot({ ...snapshotOptions, root: ["أ", "م", "ر"] });
const hamzahElative = hamzahSnapshot.sections.section04.elative[0].presentations[0];
assert.equal(hamzahElative.runs[0].text, "أَ");
assert.equal(hamzahElative.runs[0].radicalIndex, null);
assert.equal(hamzahElative.runs[1].radicalIndex, 1);
assert.equal(hamzahElative.runs[1].text, "أْ");
const repeatedSnapshot = buildGeneratedSnapshot({ ...snapshotOptions, root: ["د", "د", "د"] });
assertStructuralValue(repeatedSnapshot.sections.section01[1].presentation.past, repeatedSnapshot.sections.section01[1].past);
assert.deepEqual(repeatedSnapshot.sections.section01[1].presentation.past.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["دَ", 1], ["دَ", 2], ["دَ", 3], ["ا", null]]);
for (const addition of ["ت", "م", "ن", "ي", "و", "ا", "أ"]) {
  const additionSnapshot = buildGeneratedSnapshot({ ...snapshotOptions, root: [addition, addition, addition] });
  const structural = additionSnapshot.sections.section03[0].presentation.heavyImperative;
  assertStructuralValue(structural, additionSnapshot.sections.section03[0].heavyImperative);
  assert.equal(structural.runs.filter(({ radicalIndex }) => radicalIndex).length, 3);
}

for (const key of ["activeParticiple", "passiveParticiple"]) {
  for (const row of colouredSnapshot.sections.section04[key]) {
    for (const presentation of row.presentations) {
      assert.equal(presentation.runs.filter(({ radicalIndex }) => radicalIndex).length, 3);
      assert.equal(presentation.runs.at(-1).radicalIndex, null, "nominal inflection endings must remain non-radical");
    }
  }
}

assert.equal(
  crypto.createHash("sha256").update(fs.readFileSync("Arabic Sarf Template.xlsx")).digest("hex"),
  "728156be24b19c9c4246c8ec3cde5d671dafca0c8213d586fff8e778a233a76a",
  "Arabic Sarf Template.xlsx must remain unchanged",
);

const store = createGeneratedStateStore();
store.generate(snapshotOptions);
const generatedBeforeEdit = store.get();
store.invalidate(); // Root or Bāb input listeners use this exact invalidation path.
assert.equal(store.get(), null);
store.generate(snapshotOptions); // Export works again only after regeneration.
assert.equal(filenameFor(store.get(), "pdf"), "Sarf_دخل.pdf");
assert.equal(filenameFor(store.get(), "docx"), "Sarf_دخل.docx");
store.updateParticles("لَمَّا", "كَيْ");
assert.equal(store.get().majzumParticle, "لَمَّا");
assert.equal(store.get().mansubParticle, "كَيْ");
assert.equal(store.get().root.join(""), generatedBeforeEdit.root.join(""));
assert.equal(store.get().bab, generatedBeforeEdit.bab);
assert.equal(store.get().sections.section02[0].majzumPresent.startsWith("لَمَّا "), true);
assert.equal(store.get().sections.section02[0].mansubPresent.startsWith("كَيْ "), true);
store.updateColour(true);
assert.deepEqual(store.get().root, snapshotOptions.root);

assert.deepEqual(metadataRows(snapshot), [
  ["الجذر", "دخل"], ["الباب", snapshotOptions.babLabel], ["حرف الجزم", "لَمْ"], ["حرف النصب", "لَنْ"],
]);
assert.equal(metadataLine(snapshot), `الجذر: دخل | الباب: ${snapshotOptions.babLabel} | حرف الجزم: لَمْ | حرف النصب: لَنْ`);
const landscape = landscapeVerbTable(snapshot);
assert.equal(landscape.headings.filter((heading) => heading === "الضمير").length, 1);
assert.equal(landscape.headings.length, 12);
assert.equal(landscape.rows.every((row) => row.length === 12), true);
const portraitPages = buildExportPages(colouredSnapshot, "portrait");
const landscapePages = buildExportPages(colouredSnapshot, "landscape");
assert.equal(portraitPages.length, 4);
assert.equal(portraitPages[0].includes("القسم 01"), true);
assert.equal(portraitPages[1].includes("القسم 02"), true);
assert.equal(portraitPages[2].includes("القسم 03"), true);
assert.equal(portraitPages[3].includes("القسم 04 — المشتقات"), true);
assert.equal(landscapePages[0].match(/الضمير/g).length, 1);
assert.equal(landscapePages[0].includes("القسم 01 — المرفوع والمجهول · القسم 02"), false);
assert.equal(landscapePages[0].includes("الجذر: دخل | الباب:"), true);
assert.equal(landscapePages[0].includes('class="metadata" dir="rtl"'), true);
assert.equal(landscapePages[0].includes('class="verb-table"'), true);
assert.equal(landscapePages.length, 2);
assert.equal(landscapePages[1].includes("section04-page"), true);
assert.equal(landscapePages[1].includes("القسم 04 — المشتقات"), false);
for (const title of ["اسم الفاعل", "اسم المفعول", "اسم التفضيل", "اسم الظرف"]) {
  assert.equal(landscapePages[1].includes(title), true);
  assert.equal(portraitPages[3].includes(title), true);
}
assert.equal(landscapePages.every((page) => page.includes(FOOTER)), true);
assert.equal(landscapePages.join("").includes("color:#C62828"), true);
assert.equal(buildExportPages(snapshot, "portrait").join("").includes("color:#C62828"), false);
assert.equal(portraitPages.every((page) => page.includes("الجذر: دخل | الباب:")), true);
assert.equal(portraitPages[0].includes("القسم 02"), false);
assert.equal(portraitPages[1].includes("القسم 01"), false);
assert.match(portraitPages[3], /<th>الحالة<\/th>/);
assert.match(portraitPages[3], /<td class="category">مرفوع<\/td>/);
assert.match(fs.readFileSync("export.js", "utf8"), /\.derived-table \.category\{text-align:center\}/);
assert.match(fs.readFileSync("export.js", "utf8"), /const scale = 3;/);
assert.equal(require("./export.js").HEADINGS.section03.includes("فعل الأمر"), true);
assert.equal(html.includes("فعل الامر"), false);
assert.equal(portraitPages[0].includes('<span style="color:#2E7D32">لَ</span>ا'), true);

const docx = buildDocx(colouredSnapshot, "landscape");
assert.equal(Buffer.from(docx.subarray(0, 4)).toString("binary"), "PK\u0003\u0004");
for (const requiredPart of ["[Content_Types].xml", "word/document.xml", "word/footer1.xml", "word/_rels/document.xml.rels"]) assert.equal(Buffer.from(docx).includes(Buffer.from(requiredPart)), true);
assert.equal(Buffer.from(docx).includes(Buffer.from('w:orient="landscape"')), true);
assert.equal(Buffer.from(docx).includes(Buffer.from("C62828")), true);
assert.equal(Buffer.from(docx).includes(Buffer.from(FOOTER)), true);
const landscapeDocxXml = Buffer.from(docx).toString("utf8");
assert.equal(landscapeDocxXml.includes("القسم 04 — المشتقات"), false);
assert.equal((landscapeDocxXml.match(/الجذر: دخل \| الباب:/g) || []).length, 2);
assert.match(landscapeDocxXml, /<w:pPr><w:bidi\/><w:jc w:val="right"\/><\/w:pPr>[\s\S]*?الجذر: دخل/);
assert.equal(landscapeDocxXml.includes('<w:jc w:val="center"/>'), true);
assert.match(landscapeDocxXml, /<w:color w:val="2E7D32"\/><w:rtl\/><\/w:rPr><w:t xml:space="preserve">لَ<\/w:t><\/w:r><w:r>[\s\S]*?<w:t xml:space="preserve">ا<\/w:t>/);
assert.equal(Buffer.from(buildDocx(snapshot, "portrait")).includes(Buffer.from("C62828")), false);
const portraitDocxXml = Buffer.from(buildDocx(snapshot, "portrait")).toString("utf8");
assert.equal((portraitDocxXml.match(/الجذر: دخل \| الباب:/g) || []).length, 4);
assert.match(portraitDocxXml, /<w:pPr><w:bidi\/><w:jc w:val="right"\/><\/w:pPr>[\s\S]*?الجذر: دخل/);
for (const title of Object.values(require("./export.js").SECTION_TITLES)) assert.match(portraitDocxXml, new RegExp(`<w:jc w:val="right"\/>[\\s\\S]*?${title}`));
for (const title of ["اسم الفاعل", "اسم المفعول", "اسم التفضيل", "اسم الظرف"]) assert.match(portraitDocxXml, new RegExp(`<w:jc w:val="right"\/>[\\s\\S]*?${title}`));
for (const [key, headings] of Object.entries(require("./export.js").HEADINGS)) {
  if (key === "masdar") continue;
  const grid = `<w:tblGrid>${headings.map(() => "<w:gridCol/>").join("")}</w:tblGrid>`;
  assert.equal(portraitDocxXml.includes(grid) || landscapeDocxXml.includes(grid), true);
}

const tinyJpeg = Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/2Q==", "base64");
const pdf = buildPdfDocument([tinyJpeg], "portrait");
const landscapePdf = buildPdfDocument([tinyJpeg], "landscape");
const portraitFourPagePdf = buildPdfDocument(Array(4).fill(tinyJpeg), "portrait");
const landscapeTwoPagePdf = buildPdfDocument(Array(2).fill(tinyJpeg), "landscape");
assert.equal(Buffer.from(pdf.subarray(0, 8)).toString("ascii"), "%PDF-1.4");
assert.equal(Buffer.from(pdf).includes(Buffer.from("/Type /Page")), true);
assert.equal(Buffer.from(pdf).subarray(-6).toString("ascii"), "%%EOF\n");
assert.equal(Buffer.from(landscapePdf.subarray(0, 8)).toString("ascii"), "%PDF-1.4");
assert.equal((Buffer.from(portraitFourPagePdf).toString("binary").match(/\/Type \/Page\b/g) || []).length, 4);
assert.equal((Buffer.from(landscapeTwoPagePdf).toString("binary").match(/\/Type \/Page\b/g) || []).length, 2);
// Form IV Phase 1 covers the complete shared matrices and structural colouring.
const formIV = (root) => buildGeneratedSnapshot({ root, bab: "form-iv-ifal", babLabel: "باب الإفعال", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const karamIV = formIV(["ك", "ر", "م"]);
assert.equal(karamIV.family, "mazid");
assert.equal(karamIV.sections.section01.length, 14);
assert.deepEqual(karamIV.sections.section01.slice(0, 3).map((row) => row.past), ["أَكْرَمَ", "أَكْرَمَا", "أَكْرَمُوْا"]);
assert.deepEqual(karamIV.sections.section01.slice(0, 3).map((row) => row.present), ["يُكْرِمُ", "يُكْرِمَانِ", "يُكْرِمُوْنَ"]);
assert.deepEqual([karamIV.sections.section01[0].passivePast, karamIV.sections.section01[0].passivePresent], ["أُكْرِمَ", "يُكْرَمُ"]);
assert.deepEqual([karamIV.sections.section02[0].majzumPresent, karamIV.sections.section02[0].mansubPresent], ["لَمْ يُكْرِمْ", "لَنْ يُكْرِمَ"]);
assert.deepEqual([karamIV.sections.section02[0].heavyEmphatic, karamIV.sections.section02[0].lightEmphatic], ["لَيُكْرِمَنَّ", "لَيُكْرِمَنْ"]);
assert.equal(karamIV.sections.section03[0].imperative, "لِيُكْرِمْ");
assert.deepEqual(karamIV.sections.section03.slice(6, 12).map((row) => row.imperative), ["أَكْرِمْ", "أَكْرِمَا", "أَكْرِمُوْا", "أَكْرِمِيْ", "أَكْرِمَا", "أَكْرِمْنَ"]);
assert.equal(karamIV.sections.section04.masdar[0].values[0], "إِكْرَام");
assert.deepEqual(karamIV.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُكْرِمٌ", "مُكْرِمًا", "مُكْرِمٍ"]);
assert.deepEqual(karamIV.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُكْرَمٌ", "مُكْرَمًا", "مُكْرَمٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(karamIV.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);
for (const root of [["ك", "ر", "م"], ["خ", "ر", "ج"], ["ن", "ز", "ل"], ["د", "ر", "د"]]) assert.equal(formIV(root).sections.section01.length, 14);
const repeatedRuns = formIV(["د", "ر", "د"]).sections.section01[0].presentation.past.runs;
assert.deepEqual(repeatedRuns.filter((run) => run.radicalIndex).map((run) => run.radicalIndex), [1, 2, 3]);
assert.equal(repeatedRuns[0].radicalIndex, null);
assert.equal(isSoundFormIVRoot(["ق", "و", "ل"]), false);
assert.equal(isSoundFormIVRoot(["م", "د", "د"]), false);
assert.throws(() => formIV(["أ", "ك", "ل"]), /الصحيح السالم/);
assert.equal(buildExportPages(karamIV, "portrait")[3].includes("اسم التفضيل"), false);
assert.equal(Buffer.from(buildDocx(karamIV, "portrait")).toString("utf8").includes("المصدر"), true);

// Form II is a declarative Mazīd configuration: the shared SIGHAS, mood,
// request, nominal-inflection, presentation, and snapshot engines consume it.
const formII = (root) => buildGeneratedSnapshot({ root, bab: "form-ii-tafil", babLabel: "باب التفعيل", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const allamaII = formII(["ع", "ل", "م"]);
assert.equal(allamaII.family, "mazid");
assert.deepEqual(allamaII.sections.section01.map((row) => row.past).slice(0, 4), ["عَلَّمَ", "عَلَّمَا", "عَلَّمُوْا", "عَلَّمَتْ"]);
assert.deepEqual(allamaII.sections.section01.map((row) => row.present).slice(0, 4), ["يُعَلِّمُ", "يُعَلِّمَانِ", "يُعَلِّمُوْنَ", "تُعَلِّمُ"]);
assert.deepEqual([allamaII.sections.section01[0].passivePast, allamaII.sections.section01[0].passivePresent], ["عُلِّمَ", "يُعَلَّمُ"]);
assert.equal(allamaII.sections.section01.length, SIGHAS.length);
for (const row of allamaII.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.ok(row[key]);
assert.deepEqual([allamaII.sections.section02[0].majzumPresent, allamaII.sections.section02[0].mansubPresent], ["لَمْ يُعَلِّمْ", "لَنْ يُعَلِّمَ"]);
assert.deepEqual([allamaII.sections.section02[0].heavyEmphatic, allamaII.sections.section02[0].lightEmphatic], ["لَيُعَلِّمَنَّ", "لَيُعَلِّمَنْ"]);
assert.equal(allamaII.sections.section03[0].imperative, "لِيُعَلِّمْ");
assert.deepEqual(allamaII.sections.section03.slice(6, 12).map((row) => row.imperative), ["عَلِّمْ", "عَلِّمَا", "عَلِّمُوْا", "عَلِّمِيْ", "عَلِّمَا", "عَلِّمْنَ"]);
assert.deepEqual([allamaII.sections.section03[6].heavyImperative, allamaII.sections.section03[6].lightImperative], ["عَلِّمَنَّ", "عَلِّمَنْ"]);
assert.equal(allamaII.sections.section04.masdar[0].values[0], "تَعْلِيم");
assert.deepEqual(allamaII.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُعَلِّمٌ", "مُعَلِّمًا", "مُعَلِّمٍ"]);
assert.deepEqual(allamaII.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُعَلَّمٌ", "مُعَلَّمًا", "مُعَلَّمٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(allamaII.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);
for (const root of [["ع", "ل", "م"], ["ص", "ر", "ف"], ["ك", "ب", "ر"], ["د", "ر", "د"]]) assert.equal(formII(root).sections.section01.length, 14);

// Shaddah is a mark inside the single R2 run, never an added pseudo-radical.
const formIIPastRuns = allamaII.sections.section01[0].presentation.past.runs;
assert.deepEqual(formIIPastRuns.map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
assert.deepEqual(formIIPastRuns.map(({ text }) => text), ["عَ", "لَّ", "مَ"]);
assert.equal(formIIPastRuns[1].radicalIndex, 2);
const masdarRuns = allamaII.sections.section04.masdar[0].presentations[0].runs;
assert.deepEqual(masdarRuns.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تَ", null], ["عْ", 1], ["لِ", 2], ["ي", null], ["م", 3]]);
for (const key of ["activeParticiple", "passiveParticiple"]) {
  const runs = allamaII.sections.section04[key][0].presentations[0].runs;
  assert.deepEqual(runs.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
  assert.equal(runs[0].radicalIndex, null);
  assert.equal(runs[0].text, "مُ");
  assert.equal(runs[2].radicalIndex, 2);
  assert.match(runs[2].text, /ّ/u);
}
assert.throws(() => formII(["ق", "و", "ل"]), /الصحيح السالم/);
assert.throws(() => formII(["م", "د", "د"]), /الصحيح السالم/);
assert.throws(() => formII(["أ", "ك", "ل"]), /الصحيح السالم/);

// Form III adds only declarative stems; all four sections continue through the
// shared Mazīd person, mood, request, declension, and presentation machinery.
const formIII = (root) => buildGeneratedSnapshot({ root, bab: "form-iii-mufaalah", babLabel: "باب المفاعلة", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const qatalaIII = formIII(["ق", "ت", "ل"]);
assert.equal(qatalaIII.family, "mazid");
assert.equal(qatalaIII.sections.section01.length, SIGHAS.length);
assert.deepEqual(qatalaIII.sections.section01.slice(0, 4).map((row) => row.past), ["قَاتَلَ", "قَاتَلَا", "قَاتَلُوْا", "قَاتَلَتْ"]);
assert.deepEqual(qatalaIII.sections.section01.slice(0, 4).map((row) => row.present), ["يُقَاتِلُ", "يُقَاتِلَانِ", "يُقَاتِلُوْنَ", "تُقَاتِلُ"]);
assert.deepEqual(qatalaIII.sections.section01.slice(0, 4).map((row) => row.passivePast), ["قُوتِلَ", "قُوتِلَا", "قُوتِلُوْا", "قُوتِلَتْ"]);
assert.deepEqual(qatalaIII.sections.section01.slice(0, 4).map((row) => row.passivePresent), ["يُقَاتَلُ", "يُقَاتَلَانِ", "يُقَاتَلُوْنَ", "تُقَاتَلُ"]);
for (const row of qatalaIII.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.ok(row[key]);
assert.equal(qatalaIII.sections.section02.length, SIGHAS.length);
assert.deepEqual([qatalaIII.sections.section02[0].majzumPresent, qatalaIII.sections.section02[0].mansubPresent], ["لَمْ يُقَاتِلْ", "لَنْ يُقَاتِلَ"]);
assert.deepEqual([qatalaIII.sections.section02[0].heavyEmphatic, qatalaIII.sections.section02[0].lightEmphatic], ["لَيُقَاتِلَنَّ", "لَيُقَاتِلَنْ"]);
assert.equal(qatalaIII.sections.section02.filter((row) => row.heavyEmphatic).length, SIGHAS.filter((s) => s.heavyEmphaticEnding !== null).length);
assert.equal(qatalaIII.sections.section02.filter((row) => row.lightEmphatic).length, SIGHAS.filter((s) => s.lightEmphaticEnding !== null).length);
assert.equal(qatalaIII.sections.section03.length, SIGHAS.length);
assert.equal(qatalaIII.sections.section03[0].imperative, "لِيُقَاتِلْ");
assert.deepEqual(qatalaIII.sections.section03.slice(6, 12).map((row) => row.imperative), ["قَاتِلْ", "قَاتِلَا", "قَاتِلُوْا", "قَاتِلِيْ", "قَاتِلَا", "قَاتِلْنَ"]);
assert.deepEqual([qatalaIII.sections.section03[6].heavyImperative, qatalaIII.sections.section03[6].lightImperative], ["قَاتِلَنَّ", "قَاتِلَنْ"]);
assert.equal(qatalaIII.sections.section04.masdar[0].values[0], "مُقَاتَلَة");
assert.deepEqual(qatalaIII.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُقَاتِلٌ", "مُقَاتِلًا", "مُقَاتِلٍ"]);
assert.deepEqual(qatalaIII.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُقَاتَلٌ", "مُقَاتَلًا", "مُقَاتَلٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) {
  assert.deepEqual(qatalaIII.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);
  assert.equal(qatalaIII.sections.section04[key].flatMap((row) => row.values).length, 18);
}
assert.deepEqual(qatalaIII.sections.section01[0].presentation.past.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["قَ", 1], ["ا", null], ["تَ", 2], ["لَ", 3]]);
assert.deepEqual(qatalaIII.sections.section01[0].presentation.passivePast.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["قُ", 1], ["و", null], ["تِ", 2], ["لَ", 3]]);
assert.deepEqual(qatalaIII.sections.section04.masdar[0].presentations[0].runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["مُ", null], ["قَ", 1], ["ا", null], ["تَ", 2], ["لَ", 3], ["ة", null]]);
for (const root of [["ق", "ت", "ل"], ["ج", "ه", "د"], ["س", "ف", "ر"], ["د", "ر", "د"]]) assert.equal(formIII(root).sections.section01.length, 14);
const repeatedIIIRuns = formIII(["د", "ر", "د"]).sections.section01[0].presentation.past.runs;
assert.deepEqual(repeatedIIIRuns.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
assert.throws(() => formIII(["ق", "و", "ل"]), /الصحيح السالم/);
assert.throws(() => formIII(["م", "د", "د"]), /الصحيح السالم/);
assert.throws(() => formIII(["أ", "ك", "ل"]), /الصحيح السالم/);
assert.equal(Buffer.from(buildDocx(qatalaIII, "portrait")).toString("utf8").includes("المصدر"), true);

// Form V combines a derivational tāʾ with morphological R2 doubling while
// continuing to use the shared Mazīd inflection and presentation machinery.
const formV = (root) => buildGeneratedSnapshot({ root, bab: "form-v-tafaul", babLabel: "باب التفعّل", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const fahimaV = formV(["ف", "ه", "م"]);
assert.equal(fahimaV.family, "mazid");
assert.equal(fahimaV.sections.section01.length, SIGHAS.length);
assert.deepEqual(fahimaV.sections.section01.slice(0, 4).map((row) => row.past), ["تَفَهَّمَ", "تَفَهَّمَا", "تَفَهَّمُوْا", "تَفَهَّمَتْ"]);
assert.deepEqual(fahimaV.sections.section01.slice(0, 4).map((row) => row.present), ["يَتَفَهَّمُ", "يَتَفَهَّمَانِ", "يَتَفَهَّمُوْنَ", "تَتَفَهَّمُ"]);
assert.deepEqual(fahimaV.sections.section01.slice(0, 4).map((row) => row.passivePast), ["تُفُهِّمَ", "تُفُهِّمَا", "تُفُهِّمُوْا", "تُفُهِّمَتْ"]);
assert.deepEqual(fahimaV.sections.section01.slice(0, 4).map((row) => row.passivePresent), ["يُتَفَهَّمُ", "يُتَفَهَّمَانِ", "يُتَفَهَّمُوْنَ", "تُتَفَهَّمُ"]);
for (const row of fahimaV.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.ok(row[key]);
assert.equal(fahimaV.sections.section02.length, SIGHAS.length);
assert.deepEqual([fahimaV.sections.section02[0].majzumPresent, fahimaV.sections.section02[0].mansubPresent], ["لَمْ يَتَفَهَّمْ", "لَنْ يَتَفَهَّمَ"]);
assert.deepEqual([fahimaV.sections.section02[0].heavyEmphatic, fahimaV.sections.section02[0].lightEmphatic], ["لَيَتَفَهَّمَنَّ", "لَيَتَفَهَّمَنْ"]);
assert.equal(fahimaV.sections.section02.filter((row) => row.heavyEmphatic).length, SIGHAS.filter((s) => s.heavyEmphaticEnding !== null).length);
assert.equal(fahimaV.sections.section02.filter((row) => row.lightEmphatic).length, SIGHAS.filter((s) => s.lightEmphaticEnding !== null).length);
assert.equal(fahimaV.sections.section03.length, SIGHAS.length);
assert.equal(fahimaV.sections.section03[0].imperative, "لِيَتَفَهَّمْ");
assert.deepEqual(fahimaV.sections.section03.slice(6, 12).map((row) => row.imperative), ["تَفَهَّمْ", "تَفَهَّمَا", "تَفَهَّمُوْا", "تَفَهَّمِيْ", "تَفَهَّمَا", "تَفَهَّمْنَ"]);
assert.deepEqual([fahimaV.sections.section03[6].heavyImperative, fahimaV.sections.section03[6].lightImperative], ["تَفَهَّمَنَّ", "تَفَهَّمَنْ"]);
assert.equal(fahimaV.sections.section04.masdar[0].values[0], "تَفَهُّم");
assert.deepEqual(fahimaV.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُتَفَهِّمٌ", "مُتَفَهِّمًا", "مُتَفَهِّمٍ"]);
assert.deepEqual(fahimaV.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُتَفَهَّمٌ", "مُتَفَهَّمًا", "مُتَفَهَّمٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(fahimaV.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);

assert.deepEqual(fahimaV.sections.section01[0].presentation.past.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تَ", null], ["فَ", 1], ["هَّ", 2], ["مَ", 3]]);
assert.deepEqual(fahimaV.sections.section01[0].presentation.present.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["يَ", null], ["تَ", null], ["فَ", 1], ["هَّ", 2], ["مُ", 3]]);
assert.deepEqual(fahimaV.sections.section01[0].presentation.passivePast.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تُ", null], ["فُ", 1], ["هِّ", 2], ["مَ", 3]]);
assert.deepEqual(fahimaV.sections.section01[0].presentation.passivePresent.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["يُ", null], ["تَ", null], ["فَ", 1], ["هَّ", 2], ["مُ", 3]]);
assert.deepEqual(fahimaV.sections.section03[6].presentation.imperative.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تَ", null], ["فَ", 1], ["هَّ", 2], ["مْ", 3]]);
assert.deepEqual(fahimaV.sections.section04.masdar[0].presentations[0].runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تَ", null], ["فَ", 1], ["هُّ", 2], ["م", 3]]);
for (const key of ["activeParticiple", "passiveParticiple"]) {
  const runs = fahimaV.sections.section04[key][0].presentations[0].runs;
  assert.deepEqual(runs.slice(0, 2).map(({ text, radicalIndex }) => [text, radicalIndex]), [["مُ", null], ["تَ", null]]);
  assert.deepEqual(runs.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
  assert.match(runs.find(({ radicalIndex }) => radicalIndex === 2).text, /ّ/u);
}
for (const root of [["ف", "ه", "م"], ["ع", "ل", "م"], ["ك", "س", "ر"], ["د", "ر", "د"]]) assert.equal(formV(root).sections.section01.length, 14);
const repeatedVRuns = formV(["د", "ر", "د"]).sections.section01[0].presentation.past.runs;
assert.deepEqual(repeatedVRuns.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
assert.throws(() => formV(["ق", "و", "ل"]), /الصحيح السالم/);
assert.throws(() => formV(["م", "د", "د"]), /الصحيح السالم/);
assert.throws(() => formV(["أ", "ك", "ل"]), /الصحيح السالم/);
assert.equal(Buffer.from(buildDocx(fahimaV, "portrait")).toString("utf8").includes("المصدر"), true);

// Form VI is another declarative template set consumed by the shared Mazīd
// person, mood, request, declension, presentation, validation, and export paths.
const formVI = (root) => buildGeneratedSnapshot({ root, bab: "form-vi-tafaul", babLabel: "باب التفاعل", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const qatalaVI = formVI(["ق", "ت", "ل"]);
assert.equal(qatalaVI.family, "mazid");
assert.equal(qatalaVI.sections.section01.length, SIGHAS.length);
assert.deepEqual(qatalaVI.sections.section01.slice(0, 4).map((row) => row.past), ["تَقَاتَلَ", "تَقَاتَلَا", "تَقَاتَلُوْا", "تَقَاتَلَتْ"]);
assert.deepEqual(qatalaVI.sections.section01.slice(0, 4).map((row) => row.present), ["يَتَقَاتَلُ", "يَتَقَاتَلَانِ", "يَتَقَاتَلُوْنَ", "تَتَقَاتَلُ"]);
assert.deepEqual(qatalaVI.sections.section01.slice(0, 4).map((row) => row.passivePast), ["تُقُوتِلَ", "تُقُوتِلَا", "تُقُوتِلُوْا", "تُقُوتِلَتْ"]);
assert.deepEqual(qatalaVI.sections.section01.slice(0, 4).map((row) => row.passivePresent), ["يُتَقَاتَلُ", "يُتَقَاتَلَانِ", "يُتَقَاتَلُوْنَ", "تُتَقَاتَلُ"]);
for (const row of qatalaVI.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.ok(row[key]);
assert.equal(qatalaVI.sections.section02.length, SIGHAS.length);
assert.deepEqual([qatalaVI.sections.section02[0].majzumPresent, qatalaVI.sections.section02[0].mansubPresent], ["لَمْ يَتَقَاتَلْ", "لَنْ يَتَقَاتَلَ"]);
assert.deepEqual([qatalaVI.sections.section02[0].heavyEmphatic, qatalaVI.sections.section02[0].lightEmphatic], ["لَيَتَقَاتَلَنَّ", "لَيَتَقَاتَلَنْ"]);
assert.equal(qatalaVI.sections.section02.filter((row) => row.heavyEmphatic).length, SIGHAS.filter((s) => s.heavyEmphaticEnding !== null).length);
assert.equal(qatalaVI.sections.section02.filter((row) => row.lightEmphatic).length, SIGHAS.filter((s) => s.lightEmphaticEnding !== null).length);
assert.equal(qatalaVI.sections.section03.length, SIGHAS.length);
assert.equal(qatalaVI.sections.section03[0].imperative, "لِيَتَقَاتَلْ");
assert.deepEqual(qatalaVI.sections.section03.slice(6, 12).map((row) => row.imperative), ["تَقَاتَلْ", "تَقَاتَلَا", "تَقَاتَلُوْا", "تَقَاتَلِيْ", "تَقَاتَلَا", "تَقَاتَلْنَ"]);
assert.deepEqual([qatalaVI.sections.section03[6].heavyImperative, qatalaVI.sections.section03[6].lightImperative], ["تَقَاتَلَنَّ", "تَقَاتَلَنْ"]);
assert.equal(qatalaVI.sections.section04.masdar[0].values[0], "تَقَاتُل");
assert.deepEqual(qatalaVI.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُتَقَاتِلٌ", "مُتَقَاتِلًا", "مُتَقَاتِلٍ"]);
assert.deepEqual(qatalaVI.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُتَقَاتَلٌ", "مُتَقَاتَلًا", "مُتَقَاتَلٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(qatalaVI.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);
assert.deepEqual(qatalaVI.sections.section01[0].presentation.past.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تَ", null], ["قَ", 1], ["ا", null], ["تَ", 2], ["لَ", 3]]);
assert.deepEqual(qatalaVI.sections.section01[0].presentation.present.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["يَ", null], ["تَ", null], ["قَ", 1], ["ا", null], ["تَ", 2], ["لُ", 3]]);
assert.deepEqual(qatalaVI.sections.section01[0].presentation.passivePast.runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تُ", null], ["قُ", 1], ["و", null], ["تِ", 2], ["لَ", 3]]);
assert.deepEqual(qatalaVI.sections.section04.masdar[0].presentations[0].runs.map(({ text, radicalIndex }) => [text, radicalIndex]), [["تَ", null], ["قَ", 1], ["ا", null], ["تُ", 2], ["ل", 3]]);
for (const key of ["activeParticiple", "passiveParticiple"]) {
  const runs = qatalaVI.sections.section04[key][0].presentations[0].runs;
  assert.deepEqual(runs.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
  assert.deepEqual(runs.slice(0, 2).map(({ radicalIndex }) => radicalIndex), [null, null]);
  assert.equal(runs.find(({ text }) => text === "ا").radicalIndex, null);
}
for (const root of [["ق", "ت", "ل"], ["خ", "ص", "م"], ["ج", "م", "ع"], ["د", "ر", "د"]]) assert.equal(formVI(root).sections.section01.length, 14);
assert.deepEqual(formVI(["د", "ر", "د"]).sections.section01[0].presentation.past.runs.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
for (const root of [["ق", "و", "ل"], ["م", "د", "د"], ["أ", "ك", "ل"]]) assert.throws(() => formVI(root), /الصحيح السالم/);
assert.equal(buildExportPages(qatalaVI, "portrait").join("\n").includes("المصدر"), true);
assert.equal(Buffer.from(buildDocx(qatalaVI, "portrait")).toString("utf8").includes("المصدر"), true);

// Form VII is entirely declarative: hamzat al-waṣl and the derivational nūn
// are literal runs, while the same shared engines supply every inflection.
const formVII = (root) => buildGeneratedSnapshot({ root, bab: "form-vii-infial", babLabel: "باب الانفعال", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const kasaraVII = formVII(["ك", "س", "ر"]);
assert.equal(kasaraVII.family, "mazid");
assert.deepEqual(kasaraVII.sections.section01.slice(0, 4).map((row) => row.past), ["اِنْكَسَرَ", "اِنْكَسَرَا", "اِنْكَسَرُوْا", "اِنْكَسَرَتْ"]);
assert.deepEqual(kasaraVII.sections.section01.slice(0, 4).map((row) => row.present), ["يَنْكَسِرُ", "يَنْكَسِرَانِ", "يَنْكَسِرُوْنَ", "تَنْكَسِرُ"]);
assert.deepEqual(kasaraVII.sections.section01.slice(0, 4).map((row) => row.passivePast), ["اُنْكُسِرَ", "اُنْكُسِرَا", "اُنْكُسِرُوْا", "اُنْكُسِرَتْ"]);
assert.deepEqual(kasaraVII.sections.section01.slice(0, 4).map((row) => row.passivePresent), ["يُنْكَسَرُ", "يُنْكَسَرَانِ", "يُنْكَسَرُوْنَ", "تُنْكَسَرُ"]);
for (const row of kasaraVII.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.ok(row[key]);
assert.equal(kasaraVII.sections.section02.length, 14);
assert.deepEqual(Object.values(kasaraVII.sections.section02[0]).slice(1, 5), ["لَمْ يَنْكَسِرْ", "لَنْ يَنْكَسِرَ", "لَيَنْكَسِرَنَّ", "لَيَنْكَسِرَنْ"]);
assert.equal(kasaraVII.sections.section02.filter((row) => row.heavyEmphatic).length, SIGHAS.filter((s) => s.heavyEmphaticEnding !== null).length);
assert.equal(kasaraVII.sections.section02.filter((row) => row.lightEmphatic).length, SIGHAS.filter((s) => s.lightEmphaticEnding !== null).length);
assert.equal(kasaraVII.sections.section03.length, 14);
assert.equal(kasaraVII.sections.section03[0].imperative, "لِيَنْكَسِرْ");
assert.deepEqual(kasaraVII.sections.section03.slice(6, 12).map((row) => row.imperative), ["اِنْكَسِرْ", "اِنْكَسِرَا", "اِنْكَسِرُوْا", "اِنْكَسِرِيْ", "اِنْكَسِرَا", "اِنْكَسِرْنَ"]);
assert.deepEqual([kasaraVII.sections.section03[6].heavyImperative, kasaraVII.sections.section03[6].lightImperative], ["اِنْكَسِرَنَّ", "اِنْكَسِرَنْ"]);
assert.equal(kasaraVII.sections.section04.masdar[0].values[0], "اِنْكِسَار");
assert.deepEqual(kasaraVII.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُنْكَسِرٌ", "مُنْكَسِرًا", "مُنْكَسِرٍ"]);
assert.deepEqual(kasaraVII.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُنْكَسَرٌ", "مُنْكَسَرًا", "مُنْكَسَرٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(kasaraVII.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);
const runPairs = (value) => value.runs.map(({ text, radicalIndex }) => [text, radicalIndex]);
assert.deepEqual(runPairs(kasaraVII.sections.section01[0].presentation.past), [["اِ", null], ["نْ", null], ["كَ", 1], ["سَ", 2], ["رَ", 3]]);
assert.deepEqual(runPairs(kasaraVII.sections.section01[0].presentation.present), [["يَ", null], ["نْ", null], ["كَ", 1], ["سِ", 2], ["رُ", 3]]);
assert.deepEqual(runPairs(kasaraVII.sections.section01[0].presentation.passivePast), [["اُ", null], ["نْ", null], ["كُ", 1], ["سِ", 2], ["رَ", 3]]);
assert.deepEqual(runPairs(kasaraVII.sections.section01[0].presentation.passivePresent), [["يُ", null], ["نْ", null], ["كَ", 1], ["سَ", 2], ["رُ", 3]]);
assert.deepEqual(runPairs(kasaraVII.sections.section03[6].presentation.imperative), [["اِ", null], ["نْ", null], ["كَ", 1], ["سِ", 2], ["رْ", 3]]);
assert.deepEqual(runPairs(kasaraVII.sections.section04.masdar[0].presentations[0]), [["اِ", null], ["نْ", null], ["كِ", 1], ["سَ", 2], ["ا", null], ["ر", 3]]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(runPairs(kasaraVII.sections.section04[key][0].presentations[0]).map((pair) => pair[1]), [null, null, 1, 2, 3, null]);
for (const root of [["ك", "س", "ر"], ["ف", "ت", "ح"], ["ق", "ط", "ع"], ["د", "ر", "د"], ["ن", "ص", "ر"]]) assert.equal(formVII(root).sections.section01.length, 14);
assert.deepEqual(formVII(["د", "ر", "د"]).sections.section01[0].presentation.past.runs.filter(({ radicalIndex }) => radicalIndex).map(({ radicalIndex }) => radicalIndex), [1, 2, 3]);
assert.deepEqual(runPairs(formVII(["ن", "ص", "ر"]).sections.section01[0].presentation.past).slice(0, 3), [["اِ", null], ["نْ", null], ["نَ", 1]]);
for (const root of [["ق", "و", "ل"], ["م", "د", "د"], ["أ", "ك", "ل"]]) assert.throws(() => formVII(root), /الصحيح السالم/);
assert.equal(buildExportPages(kasaraVII, "portrait").join("\n").includes("المصدر"), true);
assert.equal(Buffer.from(buildDocx(kasaraVII, "portrait")).toString("utf8").includes("المصدر"), true);

// Form VIII uses the shared declarative engine while retaining the inserted
// derivational tāʾ and hamzat al-waṣl as non-radical structural runs.
const formVIII = (root) => buildGeneratedSnapshot({ root, bab: "form-viii-iftial", babLabel: "باب الافتعال", majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: true });
const ijtamaaVIII = formVIII(["ج", "م", "ع"]);
assert.equal(ijtamaaVIII.family, "mazid");
assert.deepEqual(ijtamaaVIII.sections.section01.slice(0, 4).map((row) => row.past), ["اِجْتَمَعَ", "اِجْتَمَعَا", "اِجْتَمَعُوْا", "اِجْتَمَعَتْ"]);
assert.deepEqual(ijtamaaVIII.sections.section01.slice(0, 4).map((row) => row.present), ["يَجْتَمِعُ", "يَجْتَمِعَانِ", "يَجْتَمِعُوْنَ", "تَجْتَمِعُ"]);
assert.deepEqual(ijtamaaVIII.sections.section01.slice(0, 4).map((row) => row.passivePast), ["اُجْتُمِعَ", "اُجْتُمِعَا", "اُجْتُمِعُوْا", "اُجْتُمِعَتْ"]);
assert.deepEqual(ijtamaaVIII.sections.section01.slice(0, 4).map((row) => row.passivePresent), ["يُجْتَمَعُ", "يُجْتَمَعَانِ", "يُجْتَمَعُوْنَ", "تُجْتَمَعُ"]);
assert.equal(ijtamaaVIII.sections.section01.length, 14);
for (const row of ijtamaaVIII.sections.section01) for (const key of ["past", "present", "passivePast", "passivePresent"]) assert.ok(row[key]);
assert.equal(ijtamaaVIII.sections.section02.length, 14);
assert.deepEqual(Object.values(ijtamaaVIII.sections.section02[0]).slice(1, 5), ["لَمْ يَجْتَمِعْ", "لَنْ يَجْتَمِعَ", "لَيَجْتَمِعَنَّ", "لَيَجْتَمِعَنْ"]);
assert.equal(ijtamaaVIII.sections.section02.filter((row) => row.heavyEmphatic).length, SIGHAS.filter((s) => s.heavyEmphaticEnding !== null).length);
assert.equal(ijtamaaVIII.sections.section02.filter((row) => row.lightEmphatic).length, SIGHAS.filter((s) => s.lightEmphaticEnding !== null).length);
assert.equal(ijtamaaVIII.sections.section03.length, 14);
assert.equal(ijtamaaVIII.sections.section03[0].imperative, "لِيَجْتَمِعْ");
assert.deepEqual(ijtamaaVIII.sections.section03.slice(6, 12).map((row) => row.imperative), ["اِجْتَمِعْ", "اِجْتَمِعَا", "اِجْتَمِعُوْا", "اِجْتَمِعِيْ", "اِجْتَمِعَا", "اِجْتَمِعْنَ"]);
assert.deepEqual([ijtamaaVIII.sections.section03[6].heavyImperative, ijtamaaVIII.sections.section03[6].lightImperative], ["اِجْتَمِعَنَّ", "اِجْتَمِعَنْ"]);
assert.equal(ijtamaaVIII.sections.section04.masdar[0].values[0], "اِجْتِمَاع");
assert.deepEqual(ijtamaaVIII.sections.section04.activeParticiple.map((row) => row.values[0]), ["مُجْتَمِعٌ", "مُجْتَمِعًا", "مُجْتَمِعٍ"]);
assert.deepEqual(ijtamaaVIII.sections.section04.passiveParticiple.map((row) => row.values[0]), ["مُجْتَمَعٌ", "مُجْتَمَعًا", "مُجْتَمَعٍ"]);
for (const key of ["activeParticiple", "passiveParticiple"]) assert.deepEqual(ijtamaaVIII.sections.section04[key].map((row) => row.values.length), [6, 6, 6]);
assert.deepEqual(runPairs(ijtamaaVIII.sections.section01[0].presentation.past), [["اِ", null], ["جْ", 1], ["تَ", null], ["مَ", 2], ["عَ", 3]]);
assert.deepEqual(runPairs(ijtamaaVIII.sections.section01[0].presentation.present), [["يَ", null], ["جْ", 1], ["تَ", null], ["مِ", 2], ["عُ", 3]]);
assert.deepEqual(runPairs(ijtamaaVIII.sections.section01[0].presentation.passivePast), [["اُ", null], ["جْ", 1], ["تُ", null], ["مِ", 2], ["عَ", 3]]);
assert.deepEqual(runPairs(ijtamaaVIII.sections.section01[0].presentation.passivePresent), [["يُ", null], ["جْ", 1], ["تَ", null], ["مَ", 2], ["عُ", 3]]);
assert.deepEqual(runPairs(ijtamaaVIII.sections.section03[6].presentation.imperative), [["اِ", null], ["جْ", 1], ["تَ", null], ["مِ", 2], ["عْ", 3]]);
assert.deepEqual(runPairs(ijtamaaVIII.sections.section04.masdar[0].presentations[0]), [["اِ", null], ["جْ", 1], ["تِ", null], ["مَ", 2], ["ا", null], ["ع", 3]]);
for (const key of ["activeParticiple", "passiveParticiple"]) {
  const runs = runPairs(ijtamaaVIII.sections.section04[key][0].presentations[0]);
  assert.deepEqual(runs.slice(0, 3).map((pair) => pair[1]), [null, 1, null]);
  assert.deepEqual(runs.filter((pair) => pair[1]).map((pair) => pair[1]), [1, 2, 3]);
}
// Repeated glyphs cannot acquire radical identity from character matching.
assert.deepEqual(runPairs(formVIII(["ج", "م", "ج"]).sections.section01[0].presentation.past).filter((pair) => pair[1]).map((pair) => pair[1]), [1, 2, 3]);
for (const text of [ijtamaaVIII.sections.section01[0].past, ijtamaaVIII.sections.section03[6].imperative, ijtamaaVIII.sections.section04.masdar[0].values[0]]) {
  assert.equal(/[أإ]/u.test(text), false);
  assert.equal(/[\u200c\u200d]/u.test(text), false);
}
assert.equal(isRegularFormVIIIRoot(["ج", "م", "ع"]), true);
for (const first of ["ت", "ث", "د", "ذ", "ز", "ص", "ض", "ط", "ظ"]) {
  assert.equal(isRegularFormVIIIRoot([first, "ك", "ب"]), false);
  if (["ت", "ث", "ذ", "ظ"].includes(first)) assert.throws(() => formVIII([first, "ك", "ب"]), /requires an assimilation rule/);
}
for (const root of [["ق", "و", "ل"], ["م", "د", "د"], ["أ", "ك", "ل"]]) assert.throws(() => formVIII(root), /الصحيح السالم/);
assert.equal(buildExportPages(ijtamaaVIII, "portrait").join("\n").includes("المصدر"), true);
assert.equal(Buffer.from(buildDocx(ijtamaaVIII, "portrait")).toString("utf8").includes("المصدر"), true);

// Form VIII Phase A applies one structural derivational-tāʾ rule before the
// shared person and nominal inflection engines run.
const phaseACases = [
  { root: ["ص", "ب", "ر"], core: ["اِصْطَبَرَ", "يَصْطَبِرُ", "اُصْطُبِرَ", "يُصْطَبَرُ", "اِصْطَبِرْ", "اِصْطِبَار", "مُصْطَبِرٌ", "مُصْطَبَرٌ"], type: "ibdal", sequence: ["صْت", "صْط"] },
  { root: ["ض", "ر", "ب"], core: ["اِضْطَرَبَ", "يَضْطَرِبُ", "اُضْطُرِبَ", "يُضْطَرَبُ", "اِضْطَرِبْ", "اِضْطِرَاب", "مُضْطَرِبٌ", "مُضْطَرَبٌ"], type: "ibdal", sequence: ["ضْت", "ضْط"] },
  { root: ["ط", "ر", "د"], core: ["اِطَّرَدَ", "يَطَّرِدُ", "اُطُّرِدَ", "يُطَّرَدُ", "اِطَّرِدْ", "اِطِّرَاد", "مُطَّرِدٌ", "مُطَّرَدٌ"], type: "ibdal-idgham", sequence: ["طْت", "طّ"] },
  { root: ["د", "ر", "ك"], core: ["اِدَّرَكَ", "يَدَّرِكُ", "اُدُّرِكَ", "يُدَّرَكُ", "اِدَّرِكْ", "اِدِّرَاك", "مُدَّرِكٌ", "مُدَّرَكٌ"], type: "ibdal-idgham", sequence: ["دْت", "دّ"] },
  { root: ["ز", "ه", "ر"], core: ["اِزْدَهَرَ", "يَزْدَهِرُ", "اُزْدُهِرَ", "يُزْدَهَرُ", "اِزْدَهِرْ", "اِزْدِهَار", "مُزْدَهِرٌ", "مُزْدَهَرٌ"], type: "ibdal", sequence: ["زْت", "زْد"] },
];
assert.deepEqual(Object.keys(FORM_VIII_PHASE_A_RULES).sort(), ["د", "ز", "ص", "ض", "ط"].sort());
for (const { root, core, type, sequence } of phaseACases) {
  const snapshot = formVIII(root);
  assert.deepEqual([
    snapshot.sections.section01[0].past, snapshot.sections.section01[0].present,
    snapshot.sections.section01[0].passivePast, snapshot.sections.section01[0].passivePresent,
    snapshot.sections.section03[6].imperative, snapshot.sections.section04.masdar[0].values[0],
    snapshot.sections.section04.activeParticiple[0].values[0], snapshot.sections.section04.passiveParticiple[0].values[0],
  ], core);
  assert.deepEqual([snapshot.sections.section01.length, snapshot.sections.section02.length, snapshot.sections.section03.length], [14, 14, 14]);
  assert.deepEqual(snapshot.sections.section04.activeParticiple.map((row) => row.values.length), [6, 6, 6]);
  assert.deepEqual(snapshot.sections.section04.passiveParticiple.map((row) => row.values.length), [6, 6, 6]);
  for (const section of [snapshot.sections.section01, snapshot.sections.section02, snapshot.sections.section03]) {
    for (const row of section) for (const value of Object.values(row.presentation)) {
      if (value.text) assert.deepEqual(value.runs.filter((run) => run.radicalIndex).map((run) => run.radicalIndex), [1, 2, 3]);
    }
  }
  assert.equal(snapshot.transformation.ruleType, type);
  assert.equal(snapshot.transformation.babId, "form-viii-iftial");
  assert.deepEqual([snapshot.transformation.originalSequence, snapshot.transformation.resultSequence], sequence);
  assert.equal(snapshot.transformation.affectedElement.elementId, "form8Ta");
  assert.equal(snapshot.transformation.affectedElement.radicalIndex, null);
  assert.equal(snapshot.transformation.underlyingForm.includes(`${root[0]}ْت`), true);
  assert.equal(snapshot.transformation.resultForm, core[0]);
  assert.equal(formVIIITransformation(root).ruleId, snapshot.transformation.ruleId);
  assert.equal(dispatchGeneration({ root, bab: "form-viii-iftial", babLabel: "باب الافتعال", majzumParticle: "لَمْ", mansubParticle: "لَنْ" }).sections.section01[0].past, core[0]);
  assert.equal(buildExportPages(snapshot, "portrait").join("\n").includes("المصدر"), true);
  assert.equal(Buffer.from(buildDocx(snapshot, "portrait")).toString("utf8").includes("المصدر"), true);
}
for (const root of [["ط", "ر", "د"], ["د", "ر", "ك"]]) {
  const snapshot = formVIII(root);
  const r1 = root[0];
  const runs = snapshot.sections.section01[0].presentation.past.runs;
  assert.equal(runs.filter((run) => run.text.startsWith(r1)).length, 1, "assimilation must display one consonant run");
  assert.equal(runs.find((run) => run.radicalIndex === 1).text, `${r1}َّ`);
  assert.equal(snapshot.sections.section01[0].past.includes(`${r1}${r1}`), false);
  assert.equal(snapshot.transformation.affectedElement.assimilatedIntoRadicalIndex, 1);
  assert.deepEqual(snapshot.transformation.stages.map((stage) => stage.operation), ["ibdal", "idgham"]);
  assert.equal(snapshot.transformation.formStages.length, 3);
}
for (const root of [["ج", "م", "ع"], ["ج", "ن", "ب"]]) {
  const regular = formVIII(root);
  assert.equal(regular.transformation, null);
}
assert.equal(formVIII(["ج", "ن", "ب"]).sections.section01[0].past, "اِجْتَنَبَ");

// Exercise the same top-level family dispatch used by the browser's Generate
// submit handler, including semantic R1/R2/R3 order from the three UI fields.
const browserDispatch = (root, bab) => dispatchGeneration({ root, bab, babLabel: bab, majzumParticle: "لَمْ", mansubParticle: "لَنْ", colourRootLetters: false });
const ijtamaaVIIIDispatch = browserDispatch(["ج", "م", "ع"], "form-viii-iftial");
assert.deepEqual(ijtamaaVIIIDispatch.sections.section01[0], {
  ...ijtamaaVIIIDispatch.sections.section01[0],
  past: "اِجْتَمَعَ", present: "يَجْتَمِعُ", passivePast: "اُجْتُمِعَ", passivePresent: "يُجْتَمَعُ",
});
for (const section of [ijtamaaVIIIDispatch.sections.section01, ijtamaaVIIIDispatch.sections.section02, ijtamaaVIIIDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(ijtamaaVIIIDispatch.sections.section04)) assert.ok(section.length > 0);
assert.equal(browserDispatch(["ص", "ب", "ر"], "form-viii-iftial").sections.section01[0].past, "اِصْطَبَرَ");
const kharajaIV = browserDispatch(["خ", "ر", "ج"], "form-iv-ifal");
assert.deepEqual(kharajaIV.root, ["خ", "ر", "ج"]);
assert.deepEqual(kharajaIV.sections.section01[0], {
  ...kharajaIV.sections.section01[0],
  past: "أَخْرَجَ", present: "يُخْرِجُ", passivePast: "أُخْرِجَ", passivePresent: "يُخْرَجُ",
});
for (const section of [kharajaIV.sections.section01, kharajaIV.sections.section02, kharajaIV.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(kharajaIV.sections.section04)) assert.ok(section.length > 0);
const allamaIIDispatch = browserDispatch(["ع", "ل", "م"], "form-ii-tafil");
assert.equal(allamaIIDispatch.sections.section01[0].past, "عَلَّمَ");
for (const section of [allamaIIDispatch.sections.section01, allamaIIDispatch.sections.section02, allamaIIDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(allamaIIDispatch.sections.section04)) assert.ok(section.length > 0);
const qatalaIIIDispatch = browserDispatch(["ق", "ت", "ل"], "form-iii-mufaalah");
assert.deepEqual(qatalaIIIDispatch.sections.section01[0], {
  ...qatalaIIIDispatch.sections.section01[0],
  past: "قَاتَلَ", present: "يُقَاتِلُ", passivePast: "قُوتِلَ", passivePresent: "يُقَاتَلُ",
});
for (const section of [qatalaIIIDispatch.sections.section01, qatalaIIIDispatch.sections.section02, qatalaIIIDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(qatalaIIIDispatch.sections.section04)) assert.ok(section.length > 0);
const fahimaVDispatch = browserDispatch(["ف", "ه", "م"], "form-v-tafaul");
assert.deepEqual(fahimaVDispatch.sections.section01[0], {
  ...fahimaVDispatch.sections.section01[0],
  past: "تَفَهَّمَ", present: "يَتَفَهَّمُ", passivePast: "تُفُهِّمَ", passivePresent: "يُتَفَهَّمُ",
});
for (const section of [fahimaVDispatch.sections.section01, fahimaVDispatch.sections.section02, fahimaVDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(fahimaVDispatch.sections.section04)) assert.ok(section.length > 0);
const qatalaVIDispatch = browserDispatch(["ق", "ت", "ل"], "form-vi-tafaul");
assert.deepEqual(qatalaVIDispatch.sections.section01[0], {
  ...qatalaVIDispatch.sections.section01[0],
  past: "تَقَاتَلَ", present: "يَتَقَاتَلُ", passivePast: "تُقُوتِلَ", passivePresent: "يُتَقَاتَلُ",
});
for (const section of [qatalaVIDispatch.sections.section01, qatalaVIDispatch.sections.section02, qatalaVIDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(qatalaVIDispatch.sections.section04)) assert.ok(section.length > 0);
const kasaraVIIDispatch = browserDispatch(["ك", "س", "ر"], "form-vii-infial");
assert.deepEqual(kasaraVIIDispatch.sections.section01[0], {
  ...kasaraVIIDispatch.sections.section01[0],
  past: "اِنْكَسَرَ", present: "يَنْكَسِرُ", passivePast: "اُنْكُسِرَ", passivePresent: "يُنْكَسَرُ",
});
for (const section of [kasaraVIIDispatch.sections.section01, kasaraVIIDispatch.sections.section02, kasaraVIIDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(kasaraVIIDispatch.sections.section04)) assert.ok(section.length > 0);
const mujarradDispatch = browserDispatch(["ن", "ص", "ر"], "نَصَرَ-يَنْصُرُ");
assert.equal(mujarradDispatch.family, "mujarrad");
for (const section of [mujarradDispatch.sections.section01, mujarradDispatch.sections.section02, mujarradDispatch.sections.section03]) assert.ok(section.length > 0);
for (const section of Object.values(mujarradDispatch.sections.section04)) assert.ok(section.length > 0);

const scriptSource = fs.readFileSync("script.js", "utf8");
assert.equal(scriptSource.includes("splitRootRuns"), false);
assert.equal(scriptSource.includes("baseLetter"), false);
assert.match(scriptSource, /addEventListener\("click", async \(\) =>/);
assert.match(scriptSource, /await window\.SarfExport\.download/);
assert.match(scriptSource, /console\.error\("Sarf export failed"/);
assert.match(scriptSource, /console\.error\("Sarf generation failed"/);

console.log("Verified all morphology, snapshot, colouring, UI, DOCX, and PDF regressions.");
