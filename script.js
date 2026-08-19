// These reusable marks and letters mirror the helper cells in the workbook.
const HARAKAT = Object.freeze({
  FATHA: "َ",
  DAMMA: "ُ",
  KASRA: "ِ",
  SUKUN: "ْ",
  SHADDA: "ّ",
});

const LETTERS = Object.freeze({
  ALIF: "ا",
  WAW: "و",
  TA: "ت",
  NUN: "ن",
  MIM: "م",
  YA: "ي",
  HAMZA: "أ",
});

// H3's validation list supplies these particles. A separating space is part of
// the H-column concatenation in the workbook's selected validation values.
const MAJZUM_PARTICLES = Object.freeze(["لَمْ", "لَمَّا", "لَا"]);

// I3's validation list supplies these particles. Its inconsistent surrounding
// whitespace is deliberately normalized; builders add the one separator.
const MANSUB_PARTICLES = Object.freeze(["أَنْ", "لَنْ", "كَيْ", "إِذَنْ"]);

// The Bāb-dependent vowels are transcribed from the workbook's hidden Q1:U7 table.
const BAB_CONFIG = Object.freeze({
  "فَتَحَ-يَفْتَحُ": Object.freeze({ pastMiddleVowel: HARAKAT.FATHA, presentMiddleVowel: HARAKAT.FATHA }),
  "ضَرَبَ-يَضْرِبُ": Object.freeze({ pastMiddleVowel: HARAKAT.FATHA, presentMiddleVowel: HARAKAT.KASRA }),
  "نَصَرَ-يَنْصُرُ": Object.freeze({ pastMiddleVowel: HARAKAT.FATHA, presentMiddleVowel: HARAKAT.DAMMA }),
  "سَمِعَ-يَسْمَعُ": Object.freeze({ pastMiddleVowel: HARAKAT.KASRA, presentMiddleVowel: HARAKAT.FATHA }),
  "كَرُمَ-يَكْرُمُ": Object.freeze({ pastMiddleVowel: HARAKAT.DAMMA, presentMiddleVowel: HARAKAT.DAMMA }),
  "حَسِبَ-يَحْسِبُ": Object.freeze({ pastMiddleVowel: HARAKAT.KASRA, presentMiddleVowel: HARAKAT.KASRA }),
});

const { FATHA, DAMMA, KASRA, SUKUN, SHADDA } = HARAKAT;
const { ALIF, WAW, TA, NUN, MIM, YA, HAMZA } = LETTERS;

// One ordered configuration drives every 14-form family. Endings are literal
// workbook concatenations, including its explicit sukūn on long wāw and yāʾ.
const SIGHAS = Object.freeze([
  { id: "3ms", pronoun: "هُوَ", person: 3, gender: "masculine", number: "singular", presentPrefix: YA, pastEnding: FATHA, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA },
  { id: "3md", pronoun: "هُمَا", person: 3, gender: "masculine", number: "dual", presentPrefix: YA, pastEnding: FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF },
  { id: "3mp", pronoun: "هُمْ", person: 3, gender: "masculine", number: "plural", presentPrefix: YA, pastEnding: DAMMA + WAW + SUKUN + ALIF, presentEnding: DAMMA + WAW + SUKUN + NUN + FATHA, majzumEnding: DAMMA + WAW + SUKUN + ALIF, mansubEnding: DAMMA + WAW + SUKUN + ALIF },
  { id: "3fs", pronoun: "هِيَ", person: 3, gender: "feminine", number: "singular", presentPrefix: TA, pastEnding: FATHA + TA + SUKUN, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA },
  { id: "3fd", pronoun: "هُمَا", person: 3, gender: "feminine", number: "dual", presentPrefix: TA, pastEnding: FATHA + TA + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF },
  { id: "3fp", pronoun: "هُنَّ", person: 3, gender: "feminine", number: "plural", presentPrefix: YA, pastEnding: SUKUN + NUN + FATHA, presentEnding: SUKUN + NUN + FATHA, majzumEnding: SUKUN + NUN + FATHA, mansubEnding: SUKUN + NUN + FATHA },
  { id: "2ms", pronoun: "أَنْتَ", person: 2, gender: "masculine", number: "singular", presentPrefix: TA, pastEnding: SUKUN + TA + FATHA, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA },
  { id: "2md", pronoun: "أَنْتُمَا", person: 2, gender: "masculine", number: "dual", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF },
  { id: "2mp", pronoun: "أَنْتُمْ", person: 2, gender: "masculine", number: "plural", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + SUKUN, presentEnding: DAMMA + WAW + SUKUN + NUN + FATHA, majzumEnding: DAMMA + WAW + SUKUN + ALIF, mansubEnding: DAMMA + WAW + SUKUN + ALIF },
  { id: "2fs", pronoun: "أَنْتِ", person: 2, gender: "feminine", number: "singular", presentPrefix: TA, pastEnding: SUKUN + TA + KASRA, presentEnding: KASRA + YA + SUKUN + NUN + FATHA, majzumEnding: KASRA + YA + SUKUN, mansubEnding: KASRA + YA + SUKUN },
  { id: "2fd", pronoun: "أَنْتُمَا", person: 2, gender: "feminine", number: "dual", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA, majzumEnding: FATHA + ALIF, mansubEnding: FATHA + ALIF },
  { id: "2fp", pronoun: "أَنْتُنَّ", person: 2, gender: "feminine", number: "plural", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + NUN + SHADDA + FATHA, presentEnding: SUKUN + NUN + FATHA, majzumEnding: SUKUN + NUN + FATHA, mansubEnding: SUKUN + NUN + FATHA },
  { id: "1s", pronoun: "أَنَا", person: 1, gender: "common", number: "singular", presentPrefix: HAMZA, pastEnding: SUKUN + TA + DAMMA, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA },
  { id: "1p", pronoun: "نَحْنُ", person: 1, gender: "common", number: "plural", presentPrefix: NUN, pastEnding: SUKUN + NUN + FATHA + ALIF, presentEnding: DAMMA, majzumEnding: SUKUN, mansubEnding: FATHA },
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

function createResultsTable(headers, rows) {
  const tableWrap = document.createElement("div");
  tableWrap.className = "table-wrap";
  const table = document.createElement("table");
  table.dir = "rtl";
  const head = document.createElement("thead");
  const headingRow = document.createElement("tr");
  for (const header of headers) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = header;
    headingRow.append(cell);
  }
  head.append(headingRow);
  const body = document.createElement("tbody");
  for (const values of rows) {
    const row = document.createElement("tr");
    for (const value of values) {
      const cell = document.createElement("td");
      cell.lang = "ar";
      cell.dir = "rtl";
      cell.textContent = value;
      row.append(cell);
    }
    body.append(row);
  }
  table.append(head, body);
  tableWrap.append(table);
  return tableWrap;
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#sarf-form");
  const rootInputs = ["#root-one", "#root-two", "#root-three"].map((selector) => document.querySelector(selector));
  const babSelect = document.querySelector("#bab");
  const particleSelect = document.querySelector("#majzum-particle");
  const mansubParticleSelect = document.querySelector("#mansub-particle");
  const results = document.querySelector("#results");

  function renderResults() {
    const root = rootInputs.map((input) => input.value.trim());
    const activeForms = generateActiveForms(root, babSelect.value);
    const version4Forms = generateVersion4Forms(root, babSelect.value, particleSelect.value);
    const mansubForms = generateMansubForms(root, babSelect.value, mansubParticleSelect.value);

    const heading = document.createElement("h2");
    heading.textContent = "التَّصْرِيفُ";
    heading.lang = "ar";
    heading.dir = "rtl";
    const activeTable = createResultsTable(
      ["الضَّمِيرُ", "الْمَاضِي", "الْمُضَارِعُ"],
      activeForms.map(({ pronoun, past, present }) => [pronoun, past, present]),
    );
    const additionalHeading = document.createElement("h2");
    additionalHeading.textContent = "الْمَبْنِيُّ لِلْمَجْهُولِ وَالْمَجْزُومُ";
    additionalHeading.lang = "ar";
    additionalHeading.dir = "rtl";
    const additionalTable = createResultsTable(
      ["الضَّمِيرُ", "الْمَاضِي الْمَجْهُولُ", "الْمُضَارِعُ الْمَجْهُولُ", "الْمُضَارِعُ الْمَجْزُومُ"],
      version4Forms.map(({ pronoun, passivePast, passivePresent, majzumPresent }) => [pronoun, passivePast, passivePresent, majzumPresent]),
    );
    const mansubHeading = document.createElement("h2");
    mansubHeading.textContent = "فِعْلُ الْمُضَارِعِ الْمَنْصُوبِ";
    mansubHeading.lang = "ar";
    mansubHeading.dir = "rtl";
    const mansubTable = createResultsTable(
      ["الضَّمِيرُ", "الْمُضَارِعُ الْمَنْصُوبُ"],
      mansubForms.map(({ pronoun, mansubPresent }) => [pronoun, mansubPresent]),
    );
    results.replaceChildren(heading, activeTable, additionalHeading, additionalTable, mansubHeading, mansubTable);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResults();
  });

  mansubParticleSelect.addEventListener("change", () => {
    if (results.hasChildNodes()) renderResults();
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    BAB_CONFIG, HARAKAT, LETTERS, MAJZUM_PARTICLES, MANSUB_PARTICLES, SIGHAS,
    buildActivePast, buildActivePresent, buildPassivePast, buildPassivePresent,
    buildPresentStem, buildMajzumPresent, buildMansubPresent,
    generateActiveForms, generateVersion4Forms, generateMansubForms, getBabConfig,
  };
}
