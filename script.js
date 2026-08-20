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

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function buildGeneratedSnapshot({ root, bab, babLabel, majzumParticle, mansubParticle, colourRootLetters = false }) {
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

  return deepFreeze({
    root: stableRoot,
    bab,
    babLabel,
    majzumParticle,
    mansubParticle,
    presentation: { colourRootLetters: Boolean(colourRootLetters) },
    sections: {
      section01: active.map(({ pronoun, past, present }, index) => ({ pronoun, past, present, passivePast: version4[index].passivePast, passivePresent: version4[index].passivePresent })),
      section02: version4.map(({ pronoun, majzumPresent }, index) => ({ pronoun, majzumPresent, mansubPresent: mansub[index].mansubPresent, heavyEmphatic: emphatic[index].heavyEmphatic, lightEmphatic: emphatic[index].lightEmphatic })),
      section03: imperative.map(({ pronoun, imperative: ordinary, heavyImperative, lightImperative }) => ({ pronoun, imperative: ordinary, heavyImperative, lightImperative })),
      section04: {
        activeParticiple: [
          { label: "مرفوع", values: activeParticiple.map(({ nominative }) => nominative) },
          { label: "منصوب ومجرور", values: activeParticiple.map(({ oblique }) => oblique) },
        ],
        passiveParticiple: [
          { label: "مرفوع", values: passiveParticiple.map(({ nominative }) => nominative) },
          { label: "منصوب ومجرور", values: passiveParticiple.map(({ oblique }) => oblique) },
        ],
        elative: [
          { label: "الصيغة الأساسية", values: [...elative.primary] },
          { label: "خيار جمع إضافي", values: [...elative.additional] },
        ],
        zarf: [
          { label: "الصيغة العادية", values: [zarf.ordinarySingular, zarf.ordinaryDual, zarf.ordinaryPlural] },
          { label: "صيغة التاء المربوطة", values: [zarf.taMarbutaSingular, zarf.taMarbutaDual, zarf.taMarbutaPlural] },
        ],
      },
    },
  });
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
    generate: (options) => { snapshot = buildGeneratedSnapshot(options); return snapshot; },
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

function splitGraphemes(value) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return [...new Intl.Segmenter("ar", { granularity: "grapheme" }).segment(value)].map(({ segment }) => segment);
  }
  return value.match(/[^\p{M}]\p{M}*/gu) || [];
}

function baseLetter(grapheme) {
  return grapheme.normalize("NFD").replace(/\p{M}/gu, "");
}

// Locate the tightest ordered radical sequence. This colours morphological
// positions rather than every matching character, so repeated radicals and
// identical letters in particles, prefixes, or endings remain safe.
function splitRootRuns(value, root) {
  if (value === null || value === undefined || value === "") return [{ text: value ?? "", radical: 0 }];
  const graphemes = splitGraphemes(value);
  const wanted = root.map((letter) => baseLetter(letter));
  let best = null;
  for (let first = 0; first < graphemes.length; first += 1) {
    if (baseLetter(graphemes[first]) !== wanted[0]) continue;
    for (let second = first + 1; second < graphemes.length; second += 1) {
      if (baseLetter(graphemes[second]) !== wanted[1]) continue;
      for (let third = second + 1; third < graphemes.length; third += 1) {
        if (baseLetter(graphemes[third]) !== wanted[2]) continue;
        const candidate = { indexes: [first, second, third], span: third - first, gaps: (second - first - 1) + (third - second - 1) };
        if (!best || candidate.span < best.span || (candidate.span === best.span && candidate.gaps < best.gaps)) best = candidate;
      }
    }
  }
  if (!best) return [{ text: value, radical: 0 }];
  const radicalAt = new Map(best.indexes.map((index, position) => [index, position + 1]));
  const runs = [];
  for (const [index, text] of graphemes.entries()) {
    const radical = radicalAt.get(index) || 0;
    const previous = runs[runs.length - 1];
    if (previous && previous.radical === radical) previous.text += text;
    else runs.push({ text, radical });
  }
  return runs;
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

  function appendPresentedText(cell, value) {
    const generatedSnapshot = generatedState.get();
    if (!generatedSnapshot.presentation.colourRootLetters || value === null) {
      cell.textContent = value ?? "";
      return;
    }
    for (const run of splitRootRuns(value, generatedSnapshot.root)) {
      const span = document.createElement("span");
      if (run.radical) span.className = `radical-${run.radical}`;
      span.textContent = run.text;
      cell.append(span);
    }
  }

  function replaceTableRows(body, rows) {
    const fragment = document.createDocumentFragment();
    for (const values of rows) {
      const row = document.createElement("tr");
      for (const [index, value] of values.entries()) {
        const cell = document.createElement("td");
        cell.lang = "ar";
        cell.dir = "rtl";
        if (index === 0) cell.textContent = value ?? "";
        else appendPresentedText(cell, value);
        row.append(cell);
      }
      fragment.append(row);
    }
    body.replaceChildren(fragment);
  }

  function renderResults() {
    const generatedSnapshot = generatedState.get();
    const { section01, section02, section03, section04 } = generatedSnapshot.sections;
    replaceTableRows(sectionBodies[0], section01.map(({ pronoun, past, present, passivePast, passivePresent }) => [pronoun, past, present, passivePast, passivePresent]));
    replaceTableRows(sectionBodies[1], section02.map(({ pronoun, majzumPresent, mansubPresent, heavyEmphatic, lightEmphatic }) => [pronoun, majzumPresent, mansubPresent, heavyEmphatic, lightEmphatic]));
    replaceTableRows(sectionBodies[2], section03.map(({ pronoun, imperative, heavyImperative, lightImperative }) => [pronoun, imperative, heavyImperative, lightImperative]));
    replaceTableRows(derivedBodies.activeParticiple, section04.activeParticiple.map(({ label, values }) => [label, ...values]));
    replaceTableRows(derivedBodies.passiveParticiple, section04.passiveParticiple.map(({ label, values }) => [label, ...values]));
    replaceTableRows(derivedBodies.elative, section04.elative.map(({ label, values }) => [label, ...values]));
    replaceTableRows(derivedBodies.zarf, section04.zarf.map(({ label, values }) => [label, ...values]));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    generatedState.generate({
      root: rootInputs.map((input) => input.value.trim()),
      bab: babSelect.value,
      babLabel: babSelect.options[babSelect.selectedIndex].text,
      majzumParticle: particleSelect.value,
      mansubParticle: mansubParticleSelect.value,
      colourRootLetters: colourToggle.checked,
    });
    renderResults();
    setExportAvailable(true);
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

  downloadButton.addEventListener("click", () => {
    const generatedSnapshot = generatedState.get();
    if (!generatedSnapshot || !window.SarfExport) return;
    const format = document.querySelector('input[name="export-format"]:checked').value;
    const layout = document.querySelector('input[name="export-layout"]:checked').value;
    window.SarfExport.download(generatedSnapshot, { format, layout });
  });

  setExportAvailable(false);
}
if (typeof module !== "undefined") {
  module.exports = {
    BAB_CONFIG, HARAKAT, LETTERS, MAJZUM_PARTICLES, MANSUB_PARTICLES, NOMINAL_INFLECTIONS, SIGHAS,
    buildActivePast, buildActivePresent, buildPassivePast, buildPassivePresent,
    buildPresentStem, buildMajzumPresent, buildMansubPresent, buildEmphaticPresent, buildImperative,
    buildActiveParticipleStem, buildPassiveParticipleStem, inflectNominalStem,
    generateActiveForms, generateVersion4Forms, generateMansubForms, generateEmphaticForms, generateImperativeForms,
    generateActiveParticipleForms, generatePassiveParticipleForms, generateElativeForms, generateZarfForms, getBabConfig,
    deepFreeze, buildGeneratedSnapshot, updateSnapshotParticles, updateSnapshotColour, createGeneratedStateStore, splitRootRuns,
  };
}

if (typeof window !== "undefined") window.SarfPresentation = { splitRootRuns };
