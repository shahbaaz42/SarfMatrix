// These reusable marks and letters mirror the helper cells in the workbook.
const HARAKAT = Object.freeze({
  FATHA: "َ",
  DAMMA: "ُ",
  KASRA: "ِ",
  SUKUN: "ْ",
  SHADDA: "ّ",
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

const { FATHA, DAMMA, KASRA, SUKUN, SHADDA, KASRATAN, DAMMATAN } = HARAKAT;
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

// D:I in the two participle sections share one workbook ending matrix. Null
// entries preserve the genuinely blank singular oblique cells.
const NOMINAL_INFLECTIONS = Object.freeze([
  { id: "masculine-singular", gender: "masculine", number: "singular", nominative: DAMMATAN, oblique: null },
  { id: "masculine-dual", gender: "masculine", number: "dual", nominative: FATHA + ALIF + NUN + KASRA, oblique: FATHA + YA + SUKUN + NUN + KASRA },
  { id: "masculine-plural", gender: "masculine", number: "plural", nominative: DAMMA + WAW + SUKUN + NUN + FATHA, oblique: KASRA + YA + SUKUN + NUN + FATHA },
  { id: "feminine-singular", gender: "feminine", number: "singular", nominative: FATHA + TA_MARBUTA + DAMMATAN, oblique: null },
  { id: "feminine-dual", gender: "feminine", number: "dual", nominative: FATHA + TA + FATHA + ALIF + NUN + KASRA, oblique: FATHA + TA + FATHA + YA + SUKUN + NUN + KASRA },
  { id: "feminine-plural", gender: "feminine", number: "plural", nominative: FATHA + ALIF + TA + DAMMATAN, oblique: FATHA + ALIF + TA + KASRATAN },
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
  return `${MIM}${FATHA}${first}${SUKUN}${second}${DAMMA}${WAW}${SUKUN}${third}`;
}

function inflectNominalStem(stem) {
  return NOMINAL_INFLECTIONS.map((form) => ({
    ...form,
    nominative: `${stem}${form.nominative}`,
    oblique: form.oblique === null ? null : `${stem}${form.oblique}`,
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

if (typeof document !== "undefined") {
  const form = document.querySelector("#sarf-form");
  const rootInputs = ["#root-one", "#root-two", "#root-three"].map((selector) => document.querySelector(selector));
  const babSelect = document.querySelector("#bab");
  const particleSelect = document.querySelector("#majzum-particle");
  const mansubParticleSelect = document.querySelector("#mansub-particle");
  const sectionBodies = ["#section-01-body", "#section-02-body", "#section-03-body"].map((selector) => document.querySelector(selector));
  const derivedBodies = {
    activeParticiple: document.querySelector("#active-participle-body"),
    passiveParticiple: document.querySelector("#passive-participle-body"),
    elative: document.querySelector("#elative-body"),
    zarf: document.querySelector("#zarf-body"),
  };

  function replaceTableRows(body, rows) {
    const fragment = document.createDocumentFragment();
    for (const values of rows) {
      const row = document.createElement("tr");
      for (const value of values) {
        const cell = document.createElement("td");
        cell.lang = "ar";
        cell.dir = "rtl";
        cell.textContent = value ?? "";
        row.append(cell);
      }
      fragment.append(row);
    }
    body.replaceChildren(fragment);
  }

  function renderResults() {
    const root = rootInputs.map((input) => input.value.trim());
    const activeForms = generateActiveForms(root, babSelect.value);
    const version4Forms = generateVersion4Forms(root, babSelect.value, particleSelect.value);
    const mansubForms = generateMansubForms(root, babSelect.value, mansubParticleSelect.value);
    const emphaticForms = generateEmphaticForms(root, babSelect.value);
    const imperativeForms = generateImperativeForms(root, babSelect.value);
    const activeParticipleForms = generateActiveParticipleForms(root);
    const passiveParticipleForms = generatePassiveParticipleForms(root);
    const elativeForms = generateElativeForms(root);
    const zarfForms = generateZarfForms(root, babSelect.value);

    replaceTableRows(sectionBodies[0], activeForms.map(({ pronoun, past, present }, index) => [pronoun, past, present, version4Forms[index].passivePast, version4Forms[index].passivePresent]));
    replaceTableRows(sectionBodies[1], version4Forms.map(({ pronoun, majzumPresent }, index) => [pronoun, majzumPresent, mansubForms[index].mansubPresent, emphaticForms[index].heavyEmphatic, emphaticForms[index].lightEmphatic]));
    replaceTableRows(sectionBodies[2], imperativeForms.map(({ pronoun, imperative, heavyImperative, lightImperative }) => [pronoun, imperative, heavyImperative, lightImperative]));
    replaceTableRows(derivedBodies.activeParticiple, [
      ["مرفوع", ...activeParticipleForms.map(({ nominative }) => nominative)],
      ["منصوب ومجرور", ...activeParticipleForms.map(({ oblique }) => oblique)],
    ]);
    replaceTableRows(derivedBodies.passiveParticiple, [
      ["مرفوع", ...passiveParticipleForms.map(({ nominative }) => nominative)],
      ["منصوب ومجرور", ...passiveParticipleForms.map(({ oblique }) => oblique)],
    ]);
    replaceTableRows(derivedBodies.elative, [
      ["الصيغة الأساسية", ...elativeForms.primary],
      ["خيار جمع إضافي", ...elativeForms.additional],
    ]);
    replaceTableRows(derivedBodies.zarf, [
      ["الصيغة العادية", zarfForms.ordinarySingular, zarfForms.ordinaryDual, zarfForms.ordinaryPlural],
      ["صيغة التاء المربوطة", zarfForms.taMarbutaSingular, zarfForms.taMarbutaDual, zarfForms.taMarbutaPlural],
    ]);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResults();
  });

  for (const select of [particleSelect, mansubParticleSelect]) {
    select.addEventListener("change", () => {
      if (sectionBodies[0].hasChildNodes()) renderResults();
    });
  }
}
if (typeof module !== "undefined") {
  module.exports = {
    BAB_CONFIG, HARAKAT, LETTERS, MAJZUM_PARTICLES, MANSUB_PARTICLES, NOMINAL_INFLECTIONS, SIGHAS,
    buildActivePast, buildActivePresent, buildPassivePast, buildPassivePresent,
    buildPresentStem, buildMajzumPresent, buildMansubPresent, buildEmphaticPresent, buildImperative,
    buildActiveParticipleStem, buildPassiveParticipleStem, inflectNominalStem,
    generateActiveForms, generateVersion4Forms, generateMansubForms, generateEmphaticForms, generateImperativeForms,
    generateActiveParticipleForms, generatePassiveParticipleForms, generateElativeForms, generateZarfForms, getBabConfig,
  };
}
