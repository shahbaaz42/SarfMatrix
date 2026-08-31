// These reusable marks and letters mirror the helper cells in the workbook.
const HARAKAT = Object.freeze({
  FATHA: "َ",
  DAMMA: "ُ",
  KASRA: "ِ",
  SUKUN: "ْ",
  SHADDA: "ّ",
  FATHATAN: "ً",
  KASRATAN: "ٍ",
  DAMMATAN: "ٌ",
});

const LETTERS = Object.freeze({
  ALIF: "ا",
  WAW: "و",
  TA: "ت",
  NUN: "ن",
  MIM: "م",
  YA: "ي",
  HAMZA: "أ",
  LAM: "ل",
  TA_MARBUTA: "ة",
  ALIF_MAQSURA: "ى",
});

// H3's validation list supplies these particles. A separating space is part of
// the H-column concatenation in the workbook's selected validation values.
const MAJZUM_PARTICLES = Object.freeze(["لَمْ", "لَمَّا", "لَا"]);

// I3's validation list supplies these particles. Its inconsistent surrounding
// whitespace is deliberately normalized; builders add the one separator.
const MANSUB_PARTICLES = Object.freeze(["لَنْ", "أَنْ", "كَيْ", "إِذَنْ"]);

// The Bāb-dependent vowels are transcribed from the workbook's hidden Q1:U7 table.
const BAB_CONFIG = Object.freeze({
  "فَتَحَ-يَفْتَحُ": Object.freeze({ pastMiddleVowel: HARAKAT.FATHA, presentMiddleVowel: HARAKAT.FATHA, imperativeInitialVowel: HARAKAT.KASRA, zarfMiddleVowel: HARAKAT.FATHA }),
  "ضَرَبَ-يَضْرِبُ": Object.freeze({ pastMiddleVowel: HARAKAT.FATHA, presentMiddleVowel: HARAKAT.KASRA, imperativeInitialVowel: HARAKAT.KASRA, zarfMiddleVowel: HARAKAT.KASRA }),
  "نَصَرَ-يَنْصُرُ": Object.freeze({ pastMiddleVowel: HARAKAT.FATHA, presentMiddleVowel: HARAKAT.DAMMA, imperativeInitialVowel: HARAKAT.DAMMA, zarfMiddleVowel: HARAKAT.FATHA }),
  "سَمِعَ-يَسْمَعُ": Object.freeze({ pastMiddleVowel: HARAKAT.KASRA, presentMiddleVowel: HARAKAT.FATHA, imperativeInitialVowel: HARAKAT.KASRA, zarfMiddleVowel: HARAKAT.FATHA }),
  "كَرُمَ-يَكْرُمُ": Object.freeze({ pastMiddleVowel: HARAKAT.DAMMA, presentMiddleVowel: HARAKAT.DAMMA, imperativeInitialVowel: HARAKAT.DAMMA, zarfMiddleVowel: HARAKAT.FATHA }),
  "حَسِبَ-يَحْسِبُ": Object.freeze({ pastMiddleVowel: HARAKAT.KASRA, presentMiddleVowel: HARAKAT.KASRA, imperativeInitialVowel: HARAKAT.KASRA, zarfMiddleVowel: HARAKAT.KASRA }),
});

// Mazīd bābs are structural templates, deliberately separate from the
// Mujarrad vowel table above.  Future forms can be added here without changing
// the person/ending engine. Forms IV, II, III, V, VI, and VII share every inflection path.
const MAZID_BAB_CONFIG = Object.freeze({
  "form-iv-ifal": Object.freeze({
    family: "mazid", form: 4, label: "باب الإفعال — أَفْعَلَ / يُفْعِلُ",
    availability: Object.freeze({ passive: "lexical-metadata-ready", passiveParticiple: "lexical-metadata-ready" }),
    templates: Object.freeze({
      activePast: Object.freeze([["literal", "أَ"], ["radical", 1, "ْ"], ["radical", 2, "َ"], ["radical", 3]]),
      activePresent: Object.freeze([["personPrefix", "ُ"], ["radical", 1, "ْ"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePast: Object.freeze([["literal", "أُ"], ["radical", 1, "ْ"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePresent: Object.freeze([["personPrefix", "ُ"], ["radical", 1, "ْ"], ["radical", 2, "َ"], ["radical", 3]]),
      imperative: Object.freeze([["literal", "أَ"], ["radical", 1, "ْ"], ["radical", 2, "ِ"], ["radical", 3]]),
      masdar: Object.freeze([["literal", "إِ"], ["radical", 1, "ْ"], ["radical", 2, "َ"], ["literal", "ا"], ["radical", 3]]),
      activeParticiple: Object.freeze([["literal", "مُ"], ["radical", 1, "ْ"], ["radical", 2, "ِ"], ["radical", 3]]),
      passiveParticiple: Object.freeze([["literal", "مُ"], ["radical", 1, "ْ"], ["radical", 2, "َ"], ["radical", 3]]),
    }),
  }),
  "form-ii-tafil": Object.freeze({
    family: "mazid", form: 2, label: "باب التفعيل — فَعَّلَ / يُفَعِّلُ",
    templates: Object.freeze({
      activePast: Object.freeze([["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
      activePresent: Object.freeze([["personPrefix", "ُ"], ["radical", 1, "َ"], ["radical", 2, "ِّ"], ["radical", 3]]),
      passivePast: Object.freeze([["radical", 1, "ُ"], ["radical", 2, "ِّ"], ["radical", 3]]),
      passivePresent: Object.freeze([["personPrefix", "ُ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
      imperative: Object.freeze([["radical", 1, "َ"], ["radical", 2, "ِّ"], ["radical", 3]]),
      masdar: Object.freeze([["literal", "تَ"], ["radical", 1, "ْ"], ["radical", 2, "ِ"], ["literal", "ي"], ["radical", 3]]),
      activeParticiple: Object.freeze([["literal", "مُ"], ["radical", 1, "َ"], ["radical", 2, "ِّ"], ["radical", 3]]),
      passiveParticiple: Object.freeze([["literal", "مُ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
    }),
  }),
  "form-iii-mufaalah": Object.freeze({
    family: "mazid", form: 3, label: "باب المفاعلة — فَاعَلَ / يُفَاعِلُ",
    templates: Object.freeze({
      activePast: Object.freeze([["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
      activePresent: Object.freeze([["personPrefix", "ُ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePast: Object.freeze([["radical", 1, "ُ"], ["literal", "و"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePresent: Object.freeze([["personPrefix", "ُ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
      imperative: Object.freeze([["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "ِ"], ["radical", 3]]),
      masdar: Object.freeze([["literal", "مُ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3, "َ"], ["literal", "ة"]]),
      activeParticiple: Object.freeze([["literal", "مُ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "ِ"], ["radical", 3]]),
      passiveParticiple: Object.freeze([["literal", "مُ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
    }),
  }),
  "form-v-tafaul": Object.freeze({
    family: "mazid", form: 5, label: "باب التفعّل — تَفَعَّلَ / يَتَفَعَّلُ",
    availability: Object.freeze({ passive: "lexical-metadata-ready", passiveParticiple: "lexical-metadata-ready" }),
    templates: Object.freeze({
      activePast: Object.freeze([["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
      activePresent: Object.freeze([["personPrefix", "َ"], ["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
      passivePast: Object.freeze([["literal", "تُ"], ["radical", 1, "ُ"], ["radical", 2, "ِّ"], ["radical", 3]]),
      passivePresent: Object.freeze([["personPrefix", "ُ"], ["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
      imperative: Object.freeze([["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
      masdar: Object.freeze([["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "ُّ"], ["radical", 3]]),
      activeParticiple: Object.freeze([["literal", "مُ"], ["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "ِّ"], ["radical", 3]]),
      passiveParticiple: Object.freeze([["literal", "مُ"], ["literal", "تَ"], ["radical", 1, "َ"], ["radical", 2, "َّ"], ["radical", 3]]),
    }),
  }),
  "form-vi-tafaul": Object.freeze({
    family: "mazid", form: 6, label: "باب التفاعل — تَفَاعَلَ / يَتَفَاعَلُ",
    availability: Object.freeze({ passive: "lexical-metadata-ready", passiveParticiple: "lexical-metadata-ready" }),
    templates: Object.freeze({
      activePast: Object.freeze([["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
      activePresent: Object.freeze([["personPrefix", "َ"], ["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
      passivePast: Object.freeze([["literal", "تُ"], ["radical", 1, "ُ"], ["literal", "و"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePresent: Object.freeze([["personPrefix", "ُ"], ["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
      imperative: Object.freeze([["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
      masdar: Object.freeze([["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "ُ"], ["radical", 3]]),
      activeParticiple: Object.freeze([["literal", "مُ"], ["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "ِ"], ["radical", 3]]),
      passiveParticiple: Object.freeze([["literal", "مُ"], ["literal", "تَ"], ["radical", 1, "َ"], ["literal", "ا"], ["radical", 2, "َ"], ["radical", 3]]),
    }),
  }),
  "form-vii-infial": Object.freeze({
    family: "mazid", form: 7, label: "باب الانفعال — اِنْفَعَلَ / يَنْفَعِلُ",
    availability: Object.freeze({ passive: "lexical-metadata-ready", passiveParticiple: "lexical-metadata-ready" }),
    templates: Object.freeze({
      activePast: Object.freeze([["literal", "اِ"], ["literal", "نْ"], ["radical", 1, "َ"], ["radical", 2, "َ"], ["radical", 3]]),
      activePresent: Object.freeze([["personPrefix", "َ"], ["literal", "نْ"], ["radical", 1, "َ"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePast: Object.freeze([["literal", "اُ"], ["literal", "نْ"], ["radical", 1, "ُ"], ["radical", 2, "ِ"], ["radical", 3]]),
      passivePresent: Object.freeze([["personPrefix", "ُ"], ["literal", "نْ"], ["radical", 1, "َ"], ["radical", 2, "َ"], ["radical", 3]]),
      imperative: Object.freeze([["literal", "اِ"], ["literal", "نْ"], ["radical", 1, "َ"], ["radical", 2, "ِ"], ["radical", 3]]),
      masdar: Object.freeze([["literal", "اِ"], ["literal", "نْ"], ["radical", 1, "ِ"], ["radical", 2, "َ"], ["literal", "ا"], ["radical", 3]]),
      activeParticiple: Object.freeze([["literal", "مُ"], ["literal", "نْ"], ["radical", 1, "َ"], ["radical", 2, "ِ"], ["radical", 3]]),
      passiveParticiple: Object.freeze([["literal", "مُ"], ["literal", "نْ"], ["radical", 1, "َ"], ["radical", 2, "َ"], ["radical", 3]]),
    }),
  }),
});

const { FATHA, DAMMA, KASRA, SUKUN, SHADDA, FATHATAN, KASRATAN, DAMMATAN } = HARAKAT;
const { ALIF, WAW, TA, NUN, MIM, YA, HAMZA, LAM, TA_MARBUTA, ALIF_MAQSURA } = LETTERS;

const HEAVY_NUN = NUN + SHADDA;
const LIGHT_NUN = NUN + SUKUN;

// One ordered configuration drives every 14-form family. Endings are literal
// workbook concatenations, including its explicit sukūn on long wāw and yāʾ.
const SIGHAS = Object.freeze([
  { id: "3ms", pronoun: "هُوَ", person: 3, gender: "masculine", number: "singular", presentPrefix: YA, pastEnding: FATHA, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA, heavyEmphaticEnding: FATHA + HEAVY_NUN + FATHA, lightEmphaticEnding: FATHA + LIGHT_NUN },
  { id: "3md", pronoun: "هُمَا", person: 3, gender: "masculine", number: "dual", presentPrefix: YA, pastEnding: FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF, heavyEmphaticEnding: FATHA + ALIF + HEAVY_NUN + KASRA, lightEmphaticEnding: null },
  { id: "3mp", pronoun: "هُمْ", person: 3, gender: "masculine", number: "plural", presentPrefix: YA, pastEnding: DAMMA + WAW + SUKUN + ALIF, presentEnding: DAMMA + WAW + SUKUN + NUN + FATHA, majzumEnding: DAMMA + WAW + SUKUN + ALIF, mansubEnding: DAMMA + WAW + SUKUN + ALIF, heavyEmphaticEnding: DAMMA + HEAVY_NUN + FATHA, lightEmphaticEnding: DAMMA + LIGHT_NUN },
  { id: "3fs", pronoun: "هِيَ", person: 3, gender: "feminine", number: "singular", presentPrefix: TA, pastEnding: FATHA + TA + SUKUN, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA, heavyEmphaticEnding: FATHA + HEAVY_NUN + FATHA, lightEmphaticEnding: FATHA + LIGHT_NUN },
  { id: "3fd", pronoun: "هُمَا", person: 3, gender: "feminine", number: "dual", presentPrefix: TA, pastEnding: FATHA + TA + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF, heavyEmphaticEnding: FATHA + ALIF + HEAVY_NUN + KASRA, lightEmphaticEnding: null },
  { id: "3fp", pronoun: "هُنَّ", person: 3, gender: "feminine", number: "plural", presentPrefix: YA, pastEnding: SUKUN + NUN + FATHA, presentEnding: SUKUN + NUN + FATHA, majzumEnding: SUKUN + NUN + FATHA, mansubEnding: SUKUN + NUN + FATHA, heavyEmphaticEnding: SUKUN + NUN + FATHA + ALIF + HEAVY_NUN + KASRA, lightEmphaticEnding: null },
  { id: "2ms", pronoun: "أَنْتَ", person: 2, gender: "masculine", number: "singular", presentPrefix: TA, pastEnding: SUKUN + TA + FATHA, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA, heavyEmphaticEnding: FATHA + HEAVY_NUN + FATHA, lightEmphaticEnding: FATHA + LIGHT_NUN },
  { id: "2md", pronoun: "أَنْتُمَا", person: 2, gender: "masculine", number: "dual", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF, heavyEmphaticEnding: FATHA + ALIF + HEAVY_NUN + KASRA, lightEmphaticEnding: null },
  { id: "2mp", pronoun: "أَنْتُمْ", person: 2, gender: "masculine", number: "plural", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + SUKUN, presentEnding: DAMMA + WAW + SUKUN + NUN + FATHA, majzumEnding: DAMMA + WAW + SUKUN + ALIF, mansubEnding: DAMMA + WAW + SUKUN + ALIF, heavyEmphaticEnding: DAMMA + HEAVY_NUN + FATHA, lightEmphaticEnding: DAMMA + LIGHT_NUN },
  { id: "2fs", pronoun: "أَنْتِ", person: 2, gender: "feminine", number: "singular", presentPrefix: TA, pastEnding: SUKUN + TA + KASRA, presentEnding: KASRA + YA + SUKUN + NUN + FATHA, majzumEnding: KASRA + YA + SUKUN, mansubEnding: KASRA + YA + SUKUN, heavyEmphaticEnding: KASRA + HEAVY_NUN + FATHA, lightEmphaticEnding: KASRA + LIGHT_NUN },
  { id: "2fd", pronoun: "أَنْتُمَا", person: 2, gender: "feminine", number: "dual", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF, heavyEmphaticEnding: FATHA + ALIF + HEAVY_NUN + KASRA, lightEmphaticEnding: null },
  { id: "2fp", pronoun: "أَنْتُنَّ", person: 2, gender: "feminine", number: "plural", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + NUN + SHADDA + FATHA, presentEnding: SUKUN + NUN + FATHA, majzumEnding: SUKUN + NUN + FATHA, mansubEnding: SUKUN + NUN + FATHA, heavyEmphaticEnding: SUKUN + NUN + FATHA + ALIF + HEAVY_NUN + KASRA, lightEmphaticEnding: null },
  { id: "1s", pronoun: "أَنَا", person: 1, gender: "common", number: "singular", presentPrefix: HAMZA, pastEnding: SUKUN + TA + DAMMA, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA, heavyEmphaticEnding: FATHA + HEAVY_NUN + FATHA, lightEmphaticEnding: FATHA + LIGHT_NUN },
  { id: "1p", pronoun: "نَحْنُ", person: 1, gender: "common", number: "plural", presentPrefix: NUN, pastEnding: SUKUN + NUN + FATHA + ALIF, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA, heavyEmphaticEnding: FATHA + HEAVY_NUN + FATHA, lightEmphaticEnding: FATHA + LIGHT_NUN },
].map(Object.freeze));

// One case-by-form matrix drives both participles.  Keeping the endings here,
// rather than assembling completed words, also lets the structural renderer
// keep every added letter outside the radical-colour runs.
const NOMINAL_INFLECTIONS = Object.freeze([
  { id: "masculine-singular", gender: "masculine", number: "singular", nominative: DAMMATAN, accusative: FATHATAN + ALIF, genitive: KASRATAN },
  { id: "masculine-dual", gender: "masculine", number: "dual", nominative: FATHA + ALIF + NUN + KASRA, accusative: FATHA + YA + SUKUN + NUN + KASRA, genitive: FATHA + YA + SUKUN + NUN + KASRA },
  { id: "masculine-plural", gender: "masculine", number: "plural", nominative: DAMMA + WAW + NUN + FATHA, accusative: KASRA + YA + NUN + FATHA, genitive: KASRA + YA + NUN + FATHA },
  { id: "feminine-singular", gender: "feminine", number: "singular", nominative: FATHA + TA_MARBUTA + DAMMATAN, accusative: FATHA + TA_MARBUTA + FATHATAN, genitive: FATHA + TA_MARBUTA + KASRATAN },
  { id: "feminine-dual", gender: "feminine", number: "dual", nominative: FATHA + TA + FATHA + ALIF + NUN + KASRA, accusative: FATHA + TA + FATHA + YA + SUKUN + NUN + KASRA, genitive: FATHA + TA + FATHA + YA + SUKUN + NUN + KASRA },
  { id: "feminine-plural", gender: "feminine", number: "plural", nominative: FATHA + ALIF + TA + DAMMATAN, accusative: FATHA + ALIF + TA + KASRATAN, genitive: FATHA + ALIF + TA + KASRATAN },
].map(Object.freeze));

function getBabConfig(bab) {
  const config = BAB_CONFIG[bab];
  if (!config) throw new Error(`Unknown Bāb: ${bab}`);
  return config;
}

function buildActivePast([first, second, third], config, sighah = SIGHAS[0]) {
  return `${first}${FATHA}${second}${config.pastMiddleVowel}${third}${sighah.pastEnding}`;
}

function buildActivePresent([first, second, third], config, sighah = SIGHAS[0]) {
  return `${buildPresentStem([first, second, third], config, sighah)}${sighah.presentEnding}`;
}

function buildPresentStem([first, second, third], config, sighah = SIGHAS[0]) {
  return `${sighah.presentPrefix}${FATHA}${first}${SUKUN}${second}${config.presentMiddleVowel}${third}`;
}

function buildPassivePast([first, second, third], sighah = SIGHAS[0]) {
  return `${first}${DAMMA}${second}${KASRA}${third}${sighah.pastEnding}`;
}

function buildPassivePresent([first, second, third], sighah = SIGHAS[0]) {
  return `${sighah.presentPrefix}${DAMMA}${first}${SUKUN}${second}${FATHA}${third}${sighah.presentEnding}`;
}

function buildMajzumPresent([first, second, third], config, particle, sighah = SIGHAS[0]) {
  if (!MAJZUM_PARTICLES.includes(particle)) throw new Error(`Unknown majzūm particle: ${particle}`);
  const verb = `${buildPresentStem([first, second, third], config, sighah)}${sighah.majzumEnding}`;
  return `${particle} ${verb}`;
}

function buildMansubPresent(root, config, particle, sighah = SIGHAS[0]) {
  if (!MANSUB_PARTICLES.includes(particle)) throw new Error(`Unknown manṣūb particle: ${particle}`);
  const verb = `${buildPresentStem(root, config, sighah)}${sighah.mansubEnding}`;
  return `${particle} ${verb}`;
}

function buildEmphaticPresent(root, config, weight, sighah = SIGHAS[0]) {
  const endingKey = weight === "heavy" ? "heavyEmphaticEnding" : weight === "light" ? "lightEmphaticEnding" : null;
  if (!endingKey) throw new Error(`Unknown emphatic weight: ${weight}`);
  const ending = sighah[endingKey];
  if (ending === null) return null;
  return `${LAM}${FATHA}${buildPresentStem(root, config, sighah)}${ending}`;
}

function buildImperative(root, config, weight = "ordinary", sighah = SIGHAS[0]) {
  const endingKey = weight === "ordinary" ? "majzumEnding" : weight === "heavy" ? "heavyEmphaticEnding" : weight === "light" ? "lightEmphaticEnding" : null;
  if (!endingKey) throw new Error(`Unknown imperative weight: ${weight}`);
  const ending = sighah[endingKey];
  if (ending === null) return null;

  const [first, second, third] = root;
  if (sighah.person === 2) {
    return `${ALIF}${config.imperativeInitialVowel}${first}${SUKUN}${second}${config.presentMiddleVowel}${third}${ending}`;
  }
  return `${LAM}${KASRA}${buildPresentStem(root, config, sighah)}${ending}`;
}

function generateActiveForms(root, bab) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => ({
    ...sighah,
    past: buildActivePast(root, config, sighah),
    present: buildActivePresent(root, config, sighah),
  }));
}

function generateVersion4Forms(root, bab, particle) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => ({
    ...sighah,
    passivePast: buildPassivePast(root, sighah),
    passivePresent: buildPassivePresent(root, sighah),
    majzumPresent: buildMajzumPresent(root, config, particle, sighah),
  }));
}

function generateMansubForms(root, bab, particle) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => ({
    ...sighah,
    mansubPresent: buildMansubPresent(root, config, particle, sighah),
  }));
}

function generateEmphaticForms(root, bab) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => ({
    ...sighah,
    heavyEmphatic: buildEmphaticPresent(root, config, "heavy", sighah),
    lightEmphatic: buildEmphaticPresent(root, config, "light", sighah),
  }));
}

function generateImperativeForms(root, bab) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => ({
    ...sighah,
    imperative: buildImperative(root, config, "ordinary", sighah),
    heavyImperative: buildImperative(root, config, "heavy", sighah),
    lightImperative: buildImperative(root, config, "light", sighah),
  }));
}

function buildActiveParticipleStem([first, second, third]) {
  return `${first}${FATHA}${ALIF}${second}${KASRA}${third}`;
}

function buildPassiveParticipleStem([first, second, third]) {
  return `${MIM}${FATHA}${first}${SUKUN}${second}${DAMMA}${WAW}${third}`;
}

function inflectNominalStem(stem) {
  return NOMINAL_INFLECTIONS.map((form) => ({
    ...form,
    nominative: `${stem}${form.nominative}`,
    accusative: `${stem}${form.accusative}`,
    genitive: `${stem}${form.genitive}`,
  }));
}

function generateActiveParticipleForms(root) {
  return inflectNominalStem(buildActiveParticipleStem(root));
}

function generatePassiveParticipleForms(root) {
  return inflectNominalStem(buildPassiveParticipleStem(root));
}

function generateElativeForms([first, second, third]) {
  const forms = {
    masculineSingular: `${HAMZA}${FATHA}${first}${SUKUN}${second}${FATHA}${third}${DAMMA}`,
    masculineDual: `${HAMZA}${FATHA}${first}${SUKUN}${second}${FATHA}${third}${FATHA}${ALIF}${NUN}${KASRA}`,
    masculinePlural: `${HAMZA}${FATHA}${first}${SUKUN}${second}${FATHA}${third}${DAMMA}${WAW}${SUKUN}${NUN}${FATHA}`,
    feminineSingular: `${first}${DAMMA}${second}${SUKUN}${third}${FATHA}${ALIF_MAQSURA}`,
    feminineDual: `${first}${DAMMA}${second}${SUKUN}${third}${FATHA}${YA}${FATHA}${ALIF}${NUN}${KASRA}`,
    femininePlural: `${first}${DAMMA}${second}${SUKUN}${third}${FATHA}${YA}${FATHA}${ALIF}${TA}${DAMMATAN}`,
    additionalMasculinePlural: `${HAMZA}${FATHA}${first}${FATHA}${ALIF}${second}${KASRA}${third}${DAMMA}`,
    additionalFemininePlural: `${first}${DAMMA}${second}${FATHA}${third}${DAMMATAN}`,
  };
  forms.primary = Object.freeze([forms.masculineSingular, forms.masculineDual, forms.masculinePlural, forms.feminineSingular, forms.feminineDual, forms.femininePlural]);
  forms.additional = Object.freeze([null, null, forms.additionalMasculinePlural, null, null, forms.additionalFemininePlural]);
  return Object.freeze(forms);
}

function generateZarfForms([first, second, third], bab) {
  const { zarfMiddleVowel } = getBabConfig(bab);
  const stem = `${MIM}${FATHA}${first}${SUKUN}${second}${zarfMiddleVowel}${third}`;
  return Object.freeze({
    ordinarySingular: `${stem}${DAMMA}`,
    ordinaryDual: `${stem}${FATHA}${ALIF}${NUN}${KASRA}`,
    ordinaryPlural: `${MIM}${FATHA}${first}${FATHA}${ALIF}${second}${KASRA}${third}${DAMMA}`,
    taMarbutaSingular: `${stem}${FATHA}${TA_MARBUTA}${DAMMATAN}`,
    taMarbutaDual: `${stem}${FATHA}${TA}${FATHA}${ALIF}${NUN}${KASRA}`,
    taMarbutaPlural: null,
  });
}

// Presentation metadata is composed at the same structural points as the
// morphology itself. It never searches a completed word for matching letters.
function morphologyRun(text, radicalIndex = null) {
  return Object.freeze({ text, radicalIndex });
}

function morphologyValue(...parts) {
  const runs = [];
  for (const part of parts.flat()) {
    if (!part || !part.text) continue;
    const previous = runs[runs.length - 1];
    // Only coalesce pieces of the same radical. Distinct adjacent additions
    // (for example Form V's person prefix and derivational tāʾ) must remain
    // separately identifiable structural runs even though both are uncoloured.
    if (previous && part.radicalIndex !== null && previous.radicalIndex === part.radicalIndex) {
      runs[runs.length - 1] = morphologyRun(previous.text + part.text, part.radicalIndex);
    } else runs.push(morphologyRun(part.text, part.radicalIndex));
  }
  return Object.freeze({ text: runs.map(({ text }) => text).join(""), runs: Object.freeze(runs) });
}

function literal(text) { return morphologyRun(text, null); }
function radical(root, index, marks = "") { return morphologyRun(`${root[index - 1]}${marks}`, index); }

function instantiateMazidTemplate(root, template, sighah = SIGHAS[0]) {
  return morphologyValue(template.map(([kind, value, marks = ""]) => {
    if (kind === "radical") return radical(root, value, marks);
    if (kind === "personPrefix") return literal(`${sighah.presentPrefix}${value}`);
    return literal(value);
  }));
}

function isSoundFormIVRoot(root) {
  const bare = root.map((letter) => String(letter).normalize("NFC").replace(/\p{M}/gu, ""));
  const weak = new Set(["ا", "و", "ي", "ى"]);
  return bare.length === 3 && bare.every((letter) => /^\p{Script=Arabic}$/u.test(letter))
    && !bare.some((letter) => weak.has(letter) || letter.includes("ء") || /[أإآؤئ]/u.test(letter))
    && bare[1] !== bare[2];
}

function buildMazidSnapshot({ root, bab, babLabel, majzumParticle, mansubParticle, colourRootLetters = false }) {
  const config = MAZID_BAB_CONFIG[bab];
  if (!config) throw new Error(`Unknown Mazīd Bāb: ${bab}`);
  if (!isSoundFormIVRoot(root)) throw new Error(`${config.label} متاح حاليًا للجذر الصحيح السالم فقط.`);
  const templates = config.templates;
  const verbs = SIGHAS.map((sighah) => {
    const inflect = (name, ending) => inflectVerbStem(instantiateMazidTemplate(root, templates[name], sighah).runs, ending);
    const present = instantiateMazidTemplate(root, templates.activePresent, sighah);
    const emphatic = (key) => sighah[key] === null ? morphologyValue() : inflectVerbStem([literal(`${LAM}${FATHA}`), ...present.runs], sighah[key]);
    const imperative = (key) => {
      if (sighah[key] === null) return morphologyValue();
      const stem = sighah.person === 2 ? instantiateMazidTemplate(root, templates.imperative, sighah).runs : [literal(`${LAM}${KASRA}`), ...present.runs];
      return inflectVerbStem(stem, sighah[key]);
    };
    const majzum = inflectVerbStem(present.runs, sighah.majzumEnding);
    const mansub = inflectVerbStem(present.runs, sighah.mansubEnding);
    return {
      pronoun: sighah.pronoun,
      past: inflect("activePast", sighah.pastEnding), present: inflect("activePresent", sighah.presentEnding),
      passivePast: inflect("passivePast", sighah.pastEnding), passivePresent: inflect("passivePresent", sighah.presentEnding),
      majzumPresent: morphologyValue(literal(`${majzumParticle} `), majzum.runs), mansubPresent: morphologyValue(literal(`${mansubParticle} `), mansub.runs),
      heavyEmphatic: emphatic("heavyEmphaticEnding"), lightEmphatic: emphatic("lightEmphaticEnding"),
      imperative: imperative("majzumEnding"), heavyImperative: imperative("heavyEmphaticEnding"), lightImperative: imperative("lightEmphaticEnding"),
    };
  });
  const nominalRows = (template) => {
    const stem = instantiateMazidTemplate(root, template).runs;
    return NOMINAL_CASES.map(({ key, label }) => ({ label, values: NOMINAL_INFLECTIONS.map((form) => morphologyValue(stem, literal(form[key])).text), presentations: NOMINAL_INFLECTIONS.map((form) => morphologyValue(stem, literal(form[key]))) }));
  };
  const section01 = verbs.map((v) => ({ pronoun: v.pronoun, past: v.past.text, present: v.present.text, passivePast: v.passivePast.text, passivePresent: v.passivePresent.text, presentation: { past: v.past, present: v.present, passivePast: v.passivePast, passivePresent: v.passivePresent } }));
  const section02 = verbs.map((v) => ({ pronoun: v.pronoun, majzumPresent: v.majzumPresent.text, mansubPresent: v.mansubPresent.text, heavyEmphatic: v.heavyEmphatic.text || null, lightEmphatic: v.lightEmphatic.text || null, presentation: { majzumPresent: v.majzumPresent, mansubPresent: v.mansubPresent, heavyEmphatic: v.heavyEmphatic, lightEmphatic: v.lightEmphatic } }));
  const section03 = verbs.map((v) => ({ pronoun: v.pronoun, imperative: v.imperative.text, heavyImperative: v.heavyImperative.text || null, lightImperative: v.lightImperative.text || null, presentation: { imperative: v.imperative, heavyImperative: v.heavyImperative, lightImperative: v.lightImperative } }));
  const masdar = instantiateMazidTemplate(root, templates.masdar);
  return deepFreeze({ root: [...root], bab, babLabel, family: "mazid", majzumParticle, mansubParticle, presentation: { colourRootLetters: Boolean(colourRootLetters) }, sections: { section01, section02, section03, section04: { masdar: [{ label: "المصدر", values: [masdar.text], presentations: [masdar] }], activeParticiple: nominalRows(templates.activeParticiple), passiveParticiple: nominalRows(templates.passiveParticiple) } } });
}

function presentedRuns(value, presentation, colourRootLetters) {
  if (!colourRootLetters || value === null) return null;
  return presentation.runs;
}

function splitInitialMarks(text) {
  const match = String(text ?? "").match(/^(\p{M}*)([\s\S]*)$/u);
  return { marks: match[1], remainder: match[2] };
}

function inflectVerbStem(stemRuns, ending) {
  const { marks, remainder } = splitInitialMarks(ending);
  const runs = [...stemRuns];
  const finalRadical = runs.pop();
  if (!finalRadical || finalRadical.radicalIndex !== 3) throw new Error("Verb stem must end with the third radical");
  return morphologyValue(runs, morphologyRun(finalRadical.text + marks, finalRadical.radicalIndex), literal(remainder));
}

function presentStemValue(root, config, sighah) {
  return morphologyValue(literal(`${sighah.presentPrefix}${FATHA}`), radical(root, 1, SUKUN), radical(root, 2, config.presentMiddleVowel), radical(root, 3));
}

function structuralVerbValues(root, bab, majzumParticle, mansubParticle) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => {
    const activePast = inflectVerbStem([radical(root, 1, FATHA), radical(root, 2, config.pastMiddleVowel), radical(root, 3)], sighah.pastEnding);
    const activePresent = inflectVerbStem(presentStemValue(root, config, sighah).runs, sighah.presentEnding);
    const passivePast = inflectVerbStem([radical(root, 1, DAMMA), radical(root, 2, KASRA), radical(root, 3)], sighah.pastEnding);
    const passivePresent = inflectVerbStem([literal(`${sighah.presentPrefix}${DAMMA}`), radical(root, 1, SUKUN), radical(root, 2, FATHA), radical(root, 3)], sighah.presentEnding);
    const majzumVerb = inflectVerbStem(presentStemValue(root, config, sighah).runs, sighah.majzumEnding);
    const mansubVerb = inflectVerbStem(presentStemValue(root, config, sighah).runs, sighah.mansubEnding);
    const emphatic = (weight) => {
      const ending = sighah[weight === "heavy" ? "heavyEmphaticEnding" : "lightEmphaticEnding"];
      return ending === null ? morphologyValue() : inflectVerbStem([literal(`${LAM}${FATHA}`), ...presentStemValue(root, config, sighah).runs], ending);
    };
    const imperative = (weight) => {
      const ending = sighah[weight === "ordinary" ? "majzumEnding" : weight === "heavy" ? "heavyEmphaticEnding" : "lightEmphaticEnding"];
      if (ending === null) return morphologyValue();
      const stem = sighah.person === 2
        ? [literal(`${ALIF}${config.imperativeInitialVowel}`), radical(root, 1, SUKUN), radical(root, 2, config.presentMiddleVowel), radical(root, 3)]
        : [literal(`${LAM}${KASRA}`), ...presentStemValue(root, config, sighah).runs];
      return inflectVerbStem(stem, ending);
    };
    return Object.freeze({
      activePast, activePresent, passivePast, passivePresent,
      majzumPresent: morphologyValue(literal(`${majzumParticle} `), ...majzumVerb.runs),
      mansubPresent: morphologyValue(literal(`${mansubParticle} `), ...mansubVerb.runs),
      heavyEmphatic: emphatic("heavy"), lightEmphatic: emphatic("light"),
      imperative: imperative("ordinary"), heavyImperative: imperative("heavy"), lightImperative: imperative("light"),
    });
  });
}

function inflectStructuralStem(stemRuns, ending) {
  if (ending === null) return morphologyValue();
  const { marks, remainder } = splitInitialMarks(ending);
  const runs = [...stemRuns];
  const last = runs.pop();
  return morphologyValue(runs, morphologyRun(last.text + marks, last.radicalIndex), literal(remainder));
}

function structuralDerivedValues(root, bab) {
  const activeStem = [radical(root, 1, FATHA), literal(ALIF), radical(root, 2, KASRA), radical(root, 3)];
  const passiveStem = [literal(`${MIM}${FATHA}`), radical(root, 1, SUKUN), radical(root, 2, DAMMA), literal(WAW), radical(root, 3)];
  const nominalRows = (stem) => Object.freeze(Object.fromEntries(
    ["nominative", "accusative", "genitive"].map((caseName) => [
      caseName,
      NOMINAL_INFLECTIONS.map((form) => morphologyValue(stem, literal(form[caseName]))),
    ]),
  ));
  const elativePrimary = [
    morphologyValue(literal(`${HAMZA}${FATHA}`), radical(root, 1, SUKUN), radical(root, 2, FATHA), radical(root, 3, DAMMA)),
    morphologyValue(literal(`${HAMZA}${FATHA}`), radical(root, 1, SUKUN), radical(root, 2, FATHA), radical(root, 3, FATHA), literal(`${ALIF}${NUN}${KASRA}`)),
    morphologyValue(literal(`${HAMZA}${FATHA}`), radical(root, 1, SUKUN), radical(root, 2, FATHA), radical(root, 3, DAMMA), literal(`${WAW}${SUKUN}${NUN}${FATHA}`)),
    morphologyValue(radical(root, 1, DAMMA), radical(root, 2, SUKUN), radical(root, 3, FATHA), literal(ALIF_MAQSURA)),
    morphologyValue(radical(root, 1, DAMMA), radical(root, 2, SUKUN), radical(root, 3, FATHA), literal(`${YA}${FATHA}${ALIF}${NUN}${KASRA}`)),
    morphologyValue(radical(root, 1, DAMMA), radical(root, 2, SUKUN), radical(root, 3, FATHA), literal(`${YA}${FATHA}${ALIF}${TA}${DAMMATAN}`)),
  ];
  const elativeAdditional = [morphologyValue(), morphologyValue(), morphologyValue(literal(`${HAMZA}${FATHA}`), radical(root, 1, FATHA), literal(ALIF), radical(root, 2, KASRA), radical(root, 3, DAMMA)), morphologyValue(), morphologyValue(), morphologyValue(radical(root, 1, DAMMA), radical(root, 2, FATHA), radical(root, 3, DAMMATAN))];
  const { zarfMiddleVowel } = getBabConfig(bab);
  const zarfStem = [literal(`${MIM}${FATHA}`), radical(root, 1, SUKUN), radical(root, 2, zarfMiddleVowel), radical(root, 3)];
  return Object.freeze({
    activeParticiple: nominalRows(activeStem), passiveParticiple: nominalRows(passiveStem),
    elative: { primary: elativePrimary, additional: elativeAdditional },
    zarf: {
      ordinary: [inflectStructuralStem(zarfStem, DAMMA), inflectStructuralStem(zarfStem, `${FATHA}${ALIF}${NUN}${KASRA}`), morphologyValue(literal(`${MIM}${FATHA}`), radical(root, 1, FATHA), literal(ALIF), radical(root, 2, KASRA), radical(root, 3, DAMMA))],
      taMarbuta: [inflectStructuralStem(zarfStem, `${FATHA}${TA_MARBUTA}${DAMMATAN}`), inflectStructuralStem(zarfStem, `${FATHA}${TA}${FATHA}${ALIF}${NUN}${KASRA}`), morphologyValue()],
    },
  });
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

const NOMINAL_CASES = Object.freeze([
  Object.freeze({ key: "nominative", label: "مرفوع" }),
  Object.freeze({ key: "accusative", label: "منصوب" }),
  Object.freeze({ key: "genitive", label: "مجرور" }),
]);

function nominalCaseRows(forms, structuralCases) {
  return NOMINAL_CASES.map(({ key, label }) => ({
    label,
    values: forms.map((form) => form[key]),
    presentations: structuralCases[key],
  }));
}

function buildGeneratedSnapshot({ root, bab, babLabel, majzumParticle, mansubParticle, colourRootLetters = false }) {
  if (MAZID_BAB_CONFIG[bab]) return buildMazidSnapshot({ root, bab, babLabel, majzumParticle, mansubParticle, colourRootLetters });
  const stableRoot = [...root];
  const active = generateActiveForms(stableRoot, bab);
  const version4 = generateVersion4Forms(stableRoot, bab, majzumParticle);
  const mansub = generateMansubForms(stableRoot, bab, mansubParticle);
  const emphatic = generateEmphaticForms(stableRoot, bab);
  const imperative = generateImperativeForms(stableRoot, bab);
  const activeParticiple = generateActiveParticipleForms(stableRoot);
  const passiveParticiple = generatePassiveParticipleForms(stableRoot);
  const elative = generateElativeForms(stableRoot);
  const zarf = generateZarfForms(stableRoot, bab);
  const verbStructure = structuralVerbValues(stableRoot, bab, majzumParticle, mansubParticle);
  const derivedStructure = structuralDerivedValues(stableRoot, bab);

  return deepFreeze({
    root: stableRoot,
    bab,
    family: "mujarrad",
    babLabel,
    majzumParticle,
    mansubParticle,
    presentation: { colourRootLetters: Boolean(colourRootLetters) },
    sections: {
      section01: active.map(({ pronoun, past, present }, index) => ({ pronoun, past, present, passivePast: version4[index].passivePast, passivePresent: version4[index].passivePresent, presentation: { past: verbStructure[index].activePast, present: verbStructure[index].activePresent, passivePast: verbStructure[index].passivePast, passivePresent: verbStructure[index].passivePresent } })),
      section02: version4.map(({ pronoun, majzumPresent }, index) => ({ pronoun, majzumPresent, mansubPresent: mansub[index].mansubPresent, heavyEmphatic: emphatic[index].heavyEmphatic, lightEmphatic: emphatic[index].lightEmphatic, presentation: { majzumPresent: verbStructure[index].majzumPresent, mansubPresent: verbStructure[index].mansubPresent, heavyEmphatic: verbStructure[index].heavyEmphatic, lightEmphatic: verbStructure[index].lightEmphatic } })),
      section03: imperative.map(({ pronoun, imperative: ordinary, heavyImperative, lightImperative }, index) => ({ pronoun, imperative: ordinary, heavyImperative, lightImperative, presentation: { imperative: verbStructure[index].imperative, heavyImperative: verbStructure[index].heavyImperative, lightImperative: verbStructure[index].lightImperative } })),
      section04: {
        activeParticiple: nominalCaseRows(activeParticiple, derivedStructure.activeParticiple),
        passiveParticiple: nominalCaseRows(passiveParticiple, derivedStructure.passiveParticiple),
        elative: [
          { label: "الصيغة الأساسية", values: [...elative.primary], presentations: derivedStructure.elative.primary },
          { label: "خيار جمع إضافي", values: [...elative.additional], presentations: derivedStructure.elative.additional },
        ],
        zarf: [
          { label: "الصيغة العادية", values: [zarf.ordinarySingular, zarf.ordinaryDual, zarf.ordinaryPlural], presentations: derivedStructure.zarf.ordinary },
          { label: "صيغة التاء المربوطة", values: [zarf.taMarbutaSingular, zarf.taMarbutaDual, zarf.taMarbutaPlural], presentations: derivedStructure.zarf.taMarbuta },
        ],
      },
    },
  });
}

// This is the single dispatch boundary used by the browser submit handler and
// by non-DOM consumers. Keeping the family decision behind this boundary makes
// browser-path regressions testable without duplicating the click-handler logic.
function dispatchGeneration(options) {
  return buildGeneratedSnapshot(options);
}

function updateSnapshotParticles(snapshot, majzumParticle, mansubParticle) {
  return buildGeneratedSnapshot({
    root: snapshot.root,
    bab: snapshot.bab,
    babLabel: snapshot.babLabel,
    majzumParticle,
    mansubParticle,
    colourRootLetters: snapshot.presentation.colourRootLetters,
  });
}

function updateSnapshotColour(snapshot, colourRootLetters) {
  const copy = {
    ...snapshot,
    presentation: { colourRootLetters: Boolean(colourRootLetters) },
  };
  return deepFreeze(copy);
}

function createGeneratedStateStore() {
  let snapshot = null;
  return Object.freeze({
    get: () => snapshot,
    generate: (options) => { snapshot = dispatchGeneration(options); return snapshot; },
    invalidate: () => { snapshot = null; },
    updateParticles: (majzumParticle, mansubParticle) => {
      if (snapshot) snapshot = updateSnapshotParticles(snapshot, majzumParticle, mansubParticle);
      return snapshot;
    },
    updateColour: (enabled) => {
      if (snapshot) snapshot = updateSnapshotColour(snapshot, enabled);
      return snapshot;
    },
  });
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#sarf-form");
  const rootInputs = ["#root-one", "#root-two", "#root-three"].map((selector) => document.querySelector(selector));
  const babSelect = document.querySelector("#bab");
  const particleSelect = document.querySelector("#majzum-particle");
  const mansubParticleSelect = document.querySelector("#mansub-particle");
  const sectionBodies = ["#section-01-body", "#section-02-body", "#section-03-body"].map((selector) => document.querySelector(selector));
  const derivedBodies = {
    masdar: document.querySelector("#masdar-body"),
    activeParticiple: document.querySelector("#active-participle-body"),
    passiveParticiple: document.querySelector("#passive-participle-body"),
    elative: document.querySelector("#elative-body"),
    zarf: document.querySelector("#zarf-body"),
  };
  const colourToggle = document.querySelector("#colour-root-letters");
  const exportPanel = document.querySelector("#export-panel");
  const downloadButton = document.querySelector("#download-export");
  const generatedState = createGeneratedStateStore();

  function setExportAvailable(available) {
    exportPanel.hidden = !available;
    downloadButton.disabled = !available;
  }

  function invalidateGeneratedState() {
    generatedState.invalidate();
    setExportAvailable(false);
  }

  function appendPresentedText(cell, value, presentation) {
    const generatedSnapshot = generatedState.get();
    const runs = presentedRuns(value, presentation, generatedSnapshot.presentation.colourRootLetters);
    if (!runs) {
      cell.textContent = value ?? "";
      return;
    }
    for (const run of runs) {
      const span = document.createElement("span");
      if (run.radicalIndex) span.className = `radical-${run.radicalIndex}`;
      span.textContent = run.text;
      cell.append(span);
    }
  }

  function replaceTableRows(body, rows) {
    const fragment = document.createDocumentFragment();
    for (const values of rows) {
      const row = document.createElement("tr");
      for (const [index, entry] of values.entries()) {
        const value = entry && typeof entry === "object" ? entry.text : entry;
        const cell = document.createElement("td");
        cell.lang = "ar";
        cell.dir = "rtl";
        if (index === 0) cell.textContent = value ?? "";
        else appendPresentedText(cell, value, entry.presentation);
        row.append(cell);
      }
      fragment.append(row);
    }
    body.replaceChildren(fragment);
  }

  function renderResults() {
    const generatedSnapshot = generatedState.get();
    const { section01, section02, section03, section04 } = generatedSnapshot.sections;
    const cell = (text, presentation) => ({ text, presentation });
    replaceTableRows(sectionBodies[0], section01.map(({ pronoun, past, present, passivePast, passivePresent, presentation }) => [pronoun, cell(past, presentation.past), cell(present, presentation.present), cell(passivePast, presentation.passivePast), cell(passivePresent, presentation.passivePresent)]));
    replaceTableRows(sectionBodies[1], section02.map(({ pronoun, majzumPresent, mansubPresent, heavyEmphatic, lightEmphatic, presentation }) => [pronoun, cell(majzumPresent, presentation.majzumPresent), cell(mansubPresent, presentation.mansubPresent), cell(heavyEmphatic, presentation.heavyEmphatic), cell(lightEmphatic, presentation.lightEmphatic)]));
    replaceTableRows(sectionBodies[2], section03.map(({ pronoun, imperative, heavyImperative, lightImperative, presentation }) => [pronoun, cell(imperative, presentation.imperative), cell(heavyImperative, presentation.heavyImperative), cell(lightImperative, presentation.lightImperative)]));
    const derivedRows = (rows) => rows.map(({ label, values, presentations }) => [label, ...values.map((value, index) => cell(value, presentations[index]))]);
    const mazid = generatedSnapshot.family === "mazid";
    document.querySelector("#masdar-card").hidden = !mazid;
    document.querySelector("#elative-card").hidden = mazid;
    document.querySelector("#zarf-card").hidden = mazid;
    replaceTableRows(derivedBodies.masdar, mazid ? derivedRows(section04.masdar) : []);
    replaceTableRows(derivedBodies.activeParticiple, derivedRows(section04.activeParticiple));
    replaceTableRows(derivedBodies.passiveParticiple, derivedRows(section04.passiveParticiple));
    // Mazīd snapshots intentionally omit the Mujarrad-only elative and zarf
    // collections. Render their hidden tables as empty instead of attempting
    // to map undefined values.
    replaceTableRows(derivedBodies.elative, derivedRows(section04.elative || []));
    replaceTableRows(derivedBodies.zarf, derivedRows(section04.zarf || []));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      generatedState.generate({
        // DOM order is semantic radical order even though the form is RTL.
        root: rootInputs.map((input) => input.value.trim()),
        bab: babSelect.value,
        babLabel: babSelect.options[babSelect.selectedIndex].text,
        majzumParticle: particleSelect.value,
        mansubParticle: mansubParticleSelect.value,
        colourRootLetters: colourToggle.checked,
      });
      renderResults();
      document.querySelector("#validation-message").textContent = "";
      setExportAvailable(true);
    } catch (error) {
      console.error("Sarf generation failed", error);
      document.querySelector("#validation-message").textContent = error instanceof Error ? error.message : "تعذر إنشاء التصريف. يرجى المحاولة مرة أخرى.";
      invalidateGeneratedState();
    }
  });

  for (const control of [...rootInputs, babSelect]) control.addEventListener(control === babSelect ? "change" : "input", invalidateGeneratedState);

  for (const select of [particleSelect, mansubParticleSelect]) {
    select.addEventListener("change", () => {
      if (generatedState.get()) {
        generatedState.updateParticles(particleSelect.value, mansubParticleSelect.value);
        renderResults();
      }
    });
  }

  colourToggle.addEventListener("change", () => {
    if (generatedState.get()) {
      generatedState.updateColour(colourToggle.checked);
      renderResults();
    }
  });

  downloadButton.addEventListener("click", async () => {
    const generatedSnapshot = generatedState.get();
    if (!generatedSnapshot || !window.SarfExport) return;
    const format = document.querySelector('input[name="export-format"]:checked').value;
    const layout = document.querySelector('input[name="export-layout"]:checked').value;
    downloadButton.disabled = true;
    try {
      await window.SarfExport.download(generatedSnapshot, { format, layout });
    } catch (error) {
      console.error("Sarf export failed", error);
      window.alert("The export could not be created. Please try again.");
    } finally {
      downloadButton.disabled = !generatedState.get();
    }
  });

  setExportAvailable(false);
}
if (typeof module !== "undefined") {
  module.exports = {
    BAB_CONFIG, MAZID_BAB_CONFIG, HARAKAT, LETTERS, MAJZUM_PARTICLES, MANSUB_PARTICLES, NOMINAL_CASES, NOMINAL_INFLECTIONS, SIGHAS,
    buildActivePast, buildActivePresent, buildPassivePast, buildPassivePresent,
    buildPresentStem, buildMajzumPresent, buildMansubPresent, buildEmphaticPresent, buildImperative,
    buildActiveParticipleStem, buildPassiveParticipleStem, inflectNominalStem, nominalCaseRows,
    generateActiveForms, generateVersion4Forms, generateMansubForms, generateEmphaticForms, generateImperativeForms,
    generateActiveParticipleForms, generatePassiveParticipleForms, generateElativeForms, generateZarfForms, getBabConfig,
    morphologyRun, morphologyValue, presentedRuns, structuralVerbValues, structuralDerivedValues,
    deepFreeze, instantiateMazidTemplate, isSoundFormIVRoot, buildMazidSnapshot, buildGeneratedSnapshot, dispatchGeneration, updateSnapshotParticles, updateSnapshotColour, createGeneratedStateStore,
  };
}
