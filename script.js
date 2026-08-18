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

// One ordered configuration drives both columns. Endings are literal workbook
// concatenations, including its explicit sukūn on long wāw and yāʾ.
const SIGHAS = Object.freeze([
  { id: "3ms", pronoun: "هُوَ", person: 3, gender: "masculine", number: "singular", presentPrefix: YA, pastEnding: FATHA, presentEnding: DAMMA },
  { id: "3md", pronoun: "هُمَا", person: 3, gender: "masculine", number: "dual", presentPrefix: YA, pastEnding: FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA },
  { id: "3mp", pronoun: "هُمْ", person: 3, gender: "masculine", number: "plural", presentPrefix: YA, pastEnding: DAMMA + WAW + SUKUN + ALIF, presentEnding: DAMMA + WAW + SUKUN + NUN + FATHA },
  { id: "3fs", pronoun: "هِيَ", person: 3, gender: "feminine", number: "singular", presentPrefix: TA, pastEnding: FATHA + TA + SUKUN, presentEnding: DAMMA },
  { id: "3fd", pronoun: "هُمَا", person: 3, gender: "feminine", number: "dual", presentPrefix: TA, pastEnding: FATHA + TA + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA },
  { id: "3fp", pronoun: "هُنَّ", person: 3, gender: "feminine", number: "plural", presentPrefix: YA, pastEnding: SUKUN + NUN + FATHA, presentEnding: SUKUN + NUN + FATHA },
  { id: "2ms", pronoun: "أَنْتَ", person: 2, gender: "masculine", number: "singular", presentPrefix: TA, pastEnding: SUKUN + TA + FATHA, presentEnding: DAMMA },
  { id: "2md", pronoun: "أَنْتُمَا", person: 2, gender: "masculine", number: "dual", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA },
  { id: "2mp", pronoun: "أَنْتُمْ", person: 2, gender: "masculine", number: "plural", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + SUKUN, presentEnding: DAMMA + WAW + SUKUN + NUN + FATHA },
  { id: "2fs", pronoun: "أَنْتِ", person: 2, gender: "feminine", number: "singular", presentPrefix: TA, pastEnding: SUKUN + TA + KASRA, presentEnding: KASRA + YA + SUKUN + NUN + FATHA },
  { id: "2fd", pronoun: "أَنْتُمَا", person: 2, gender: "feminine", number: "dual", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + MIM + FATHA + ALIF, presentEnding: FATHA + ALIF + NUN + KASRA },
  { id: "2fp", pronoun: "أَنْتُنَّ", person: 2, gender: "feminine", number: "plural", presentPrefix: TA, pastEnding: SUKUN + TA + DAMMA + NUN + SHADDA + FATHA, presentEnding: SUKUN + NUN + FATHA },
  { id: "1s", pronoun: "أَنَا", person: 1, gender: "common", number: "singular", presentPrefix: HAMZA, pastEnding: SUKUN + TA + DAMMA, presentEnding: DAMMA },
  { id: "1p", pronoun: "نَحْنُ", person: 1, gender: "common", number: "plural", presentPrefix: NUN, pastEnding: SUKUN + NUN + FATHA + ALIF, presentEnding: DAMMA },
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
  return `${sighah.presentPrefix}${FATHA}${first}${SUKUN}${second}${config.presentMiddleVowel}${third}${sighah.presentEnding}`;
}

function generateActiveForms(root, bab) {
  const config = getBabConfig(bab);
  return SIGHAS.map((sighah) => ({
    ...sighah,
    past: buildActivePast(root, config, sighah),
    present: buildActivePresent(root, config, sighah),
  }));
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#sarf-form");
  const rootInputs = ["#root-one", "#root-two", "#root-three"].map((selector) => document.querySelector(selector));
  const babSelect = document.querySelector("#bab");
  const results = document.querySelector("#results");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const root = rootInputs.map((input) => input.value.trim());
    const forms = generateActiveForms(root, babSelect.value);
    const rows = forms.map(({ pronoun, past, present }) => {
      const row = document.createElement("tr");
      for (const value of [pronoun, past, present]) {
        const cell = document.createElement("td");
        cell.lang = "ar";
        cell.dir = "rtl";
        cell.textContent = value;
        row.append(cell);
      }
      return row;
    });

    const heading = document.createElement("h2");
    heading.textContent = "التَّصْرِيفُ";
    heading.lang = "ar";
    heading.dir = "rtl";
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-wrap";
    const table = document.createElement("table");
    table.dir = "rtl";
    table.innerHTML = "<thead><tr><th scope=\"col\">الضَّمِيرُ</th><th scope=\"col\">الْمَاضِي</th><th scope=\"col\">الْمُضَارِعُ</th></tr></thead>";
    const body = document.createElement("tbody");
    body.append(...rows);
    table.append(body);
    tableWrap.append(table);
    results.replaceChildren(heading, tableWrap);
  });
}

if (typeof module !== "undefined") {
  module.exports = { BAB_CONFIG, HARAKAT, LETTERS, SIGHAS, buildActivePast, buildActivePresent, generateActiveForms, getBabConfig };
}
