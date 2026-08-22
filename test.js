const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
  BAB_CONFIG, MAJZUM_PARTICLES, MANSUB_PARTICLES, SIGHAS, buildActivePast, buildActivePresent,
  buildPassivePast, buildPassivePresent, buildMajzumPresent,
  buildMansubPresent, generateActiveForms, generateVersion4Forms, generateMansubForms,
  buildEmphaticPresent, generateEmphaticForms, buildImperative, generateImperativeForms,
  HARAKAT, LETTERS, NOMINAL_INFLECTIONS, buildActiveParticipleStem, buildPassiveParticipleStem,
  inflectNominalStem, generateActiveParticipleForms, generatePassiveParticipleForms,
  generateElativeForms, generateZarfForms,
  buildGeneratedSnapshot, updateSnapshotColour, createGeneratedStateStore, presentedRuns,
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

// Exact Base - Template!D24:I38 derived-noun regressions for the workbook's ك ر م example.
const derivedRoot = ["ك", "ر", "م"];
assert.equal(HARAKAT.DAMMATAN, "ٌ");
assert.equal(HARAKAT.KASRATAN, "ٍ");
assert.equal(LETTERS.TA_MARBUTA, "ة");
assert.equal(LETTERS.ALIF_MAQSURA, "ى");
assert.equal(buildActiveParticipleStem(derivedRoot), "كَارِم");
assert.equal(buildPassiveParticipleStem(derivedRoot), "مَكْرُوْم");

const activeParticiple = generateActiveParticipleForms(derivedRoot);
const passiveParticiple = generatePassiveParticipleForms(derivedRoot);
assert.deepEqual(activeParticiple.map(({ nominative }) => nominative), ["كَارِمٌ", "كَارِمَانِ", "كَارِمُوْنَ", "كَارِمَةٌ", "كَارِمَتَانِ", "كَارِمَاتٌ"]);
assert.deepEqual(activeParticiple.map(({ oblique }) => oblique), [null, "كَارِمَيْنِ", "كَارِمِيْنَ", null, "كَارِمَتَيْنِ", "كَارِمَاتٍ"]);
assert.deepEqual(passiveParticiple.map(({ nominative }) => nominative), ["مَكْرُوْمٌ", "مَكْرُوْمَانِ", "مَكْرُوْمُوْنَ", "مَكْرُوْمَةٌ", "مَكْرُوْمَتَانِ", "مَكْرُوْمَاتٌ"]);
assert.deepEqual(passiveParticiple.map(({ oblique }) => oblique), [null, "مَكْرُوْمَيْنِ", "مَكْرُوْمِيْنَ", null, "مَكْرُوْمَتَيْنِ", "مَكْرُوْمَاتٍ"]);
assert.deepEqual(activeParticiple.map(({ id, gender, number, oblique }) => ({ id, gender, number, available: oblique !== null })), passiveParticiple.map(({ id, gender, number, oblique }) => ({ id, gender, number, available: oblique !== null })));
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

const populatedDerivedCells = activeParticiple.filter(({ nominative }) => nominative).length
  + activeParticiple.filter(({ oblique }) => oblique).length
  + passiveParticiple.filter(({ nominative }) => nominative).length
  + passiveParticiple.filter(({ oblique }) => oblique).length
  + elative.primary.filter(Boolean).length + elative.additional.filter(Boolean).length
  + Object.values(generateZarfForms(derivedRoot, "كَرُمَ-يَكْرُمُ")).filter(Boolean).length;
assert.equal(populatedDerivedCells, 33);

const html = fs.readFileSync("index.html", "utf8");
assert.equal((html.match(/class="result-section(?: derived-section)?"/g) || []).length, 4);
assert.equal((html.match(/class="table-wrap"/g) || []).length, 7);
assert.equal((html.match(/class="derived-card"/g) || []).length, 4);
for (const label of ["القسم 01 — المرفوع والمجهول", "القسم 02 — المجزوم والمنصوب والتوكيد", "القسم 03 — فعل الأمر", "القسم 04 — المشتقات"]) assert.equal(html.includes(label), true);
for (const label of ["اسم الفاعل", "اسم المفعول", "اسم التفضيل", "اسم الظرف"]) assert.equal(html.includes(`<h3>${label}</h3>`), true);
for (const label of ["الفعل الماضي المرفوع", "الفعل المضارع المرفوع", "الفعل الماضي المجهول", "الفعل المضارع المجهول", "حرف الجزم", "حرف النصب"]) assert.equal(html.includes(label), true);
const babSelect = html.match(/<select id="bab"[\s\S]*?<\/select>/)[0];
assert.equal(babSelect.includes('required'), true);
assert.equal(babSelect.includes('<option value="" selected disabled>اختر الباب</option>'), true);
assert.deepEqual([...babSelect.matchAll(/<option value="([^"]*)"/g)].map((match) => match[1]), ["", ...Object.keys(BAB_CONFIG)]);
assert.deepEqual([...babSelect.matchAll(/<option[^>]*>([^<]+)<\/option>/g)].map((match) => match[1]), [
  "اختر الباب",
  "فَتَحَ / يَفْتَحُ — فَعَلَ / يَفْعَلُ", "ضَرَبَ / يَضْرِبُ — فَعَلَ / يَفْعِلُ",
  "نَصَرَ / يَنْصُرُ — فَعَلَ / يَفْعُلُ", "سَمِعَ / يَسْمَعُ — فَعِلَ / يَفْعَلُ",
  "كَرُمَ / يَكْرُمُ — فَعُلَ / يَفْعُلُ", "حَسِبَ / يَحْسِبُ — فَعِلَ / يَفْعِلُ",
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
for (const headings of Object.values(require("./export.js").HEADINGS)) {
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
const scriptSource = fs.readFileSync("script.js", "utf8");
assert.equal(scriptSource.includes("splitRootRuns"), false);
assert.equal(scriptSource.includes("baseLetter"), false);
assert.match(scriptSource, /addEventListener\("click", async \(\) =>/);
assert.match(scriptSource, /await window\.SarfExport\.download/);
assert.match(scriptSource, /console\.error\("Sarf export failed"/);

console.log("Verified all morphology, snapshot, colouring, UI, DOCX, and PDF regressions.");
