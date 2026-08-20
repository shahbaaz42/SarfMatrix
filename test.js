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
const mansubSelect = html.match(/<select id="mansub-particle"[\s\S]*?<\/select>/)[0];
assert.equal(mansubSelect.match(/<option[^>]*value="([^"]+)"/)[1], "لَنْ");
assert.equal(mansubSelect.includes('<option value="لَنْ" selected>'), true);
assert.deepEqual([...mansubSelect.matchAll(/<option[^>]*value="([^"]+)"/g)].map((match) => match[1]), MANSUB_PARTICLES);

console.log("Verified all 33 Section 04 workbook cells and all Version 2–7 morphology regressions.");
