// These reusable marks correspond to the harakāt helper cells in the workbook.
const HARAKAT = Object.freeze({
  FATHA: "َ",
  DAMMA: "ُ",
  KASRA: "ِ",
  SUKUN: "ْ",
});

// The two vowels used in Version 2 come directly from the workbook's Q1:U7 table.
const BAB_CONFIG = Object.freeze({
  "فَتَحَ-يَفْتَحُ": Object.freeze({
    pastMiddleVowel: HARAKAT.FATHA,
    presentMiddleVowel: HARAKAT.FATHA,
  }),
  "ضَرَبَ-يَضْرِبُ": Object.freeze({
    pastMiddleVowel: HARAKAT.FATHA,
    presentMiddleVowel: HARAKAT.KASRA,
  }),
  "نَصَرَ-يَنْصُرُ": Object.freeze({
    pastMiddleVowel: HARAKAT.FATHA,
    presentMiddleVowel: HARAKAT.DAMMA,
  }),
  "سَمِعَ-يَسْمَعُ": Object.freeze({
    pastMiddleVowel: HARAKAT.KASRA,
    presentMiddleVowel: HARAKAT.FATHA,
  }),
  "كَرُمَ-يَكْرُمُ": Object.freeze({
    pastMiddleVowel: HARAKAT.DAMMA,
    presentMiddleVowel: HARAKAT.DAMMA,
  }),
  "حَسِبَ-يَحْسِبُ": Object.freeze({
    pastMiddleVowel: HARAKAT.KASRA,
    presentMiddleVowel: HARAKAT.KASRA,
  }),
});

function getBabConfig(bab) {
  const config = BAB_CONFIG[bab];

  if (!config) {
    throw new Error(`Unknown Bāb: ${bab}`);
  }

  return config;
}

function buildActivePast([first, second, third], config) {
  return `${first}${HARAKAT.FATHA}${second}${config.pastMiddleVowel}${third}${HARAKAT.FATHA}`;
}

function buildActivePresent([first, second, third], config) {
  return `ي${HARAKAT.FATHA}${first}${HARAKAT.SUKUN}${second}${config.presentMiddleVowel}${third}${HARAKAT.DAMMA}`;
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#sarf-form");
  const rootInputs = [
    document.querySelector("#root-one"),
    document.querySelector("#root-two"),
    document.querySelector("#root-three"),
  ];
  const babSelect = document.querySelector("#bab");
  const results = document.querySelector("#results");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const root = rootInputs.map((input) => input.value.trim());
    const config = getBabConfig(babSelect.value);
    const forms = [
      ["فعل الماضي", buildActivePast(root, config)],
      ["فعل المضارع", buildActivePresent(root, config)],
    ];

    const heading = document.createElement("h2");
    heading.textContent = "Generated forms";

    const formCards = forms.map(([label, value]) => {
      const card = document.createElement("article");
      card.className = "form-result";
      card.dir = "rtl";

      const formLabel = document.createElement("h3");
      formLabel.textContent = label;

      const generatedForm = document.createElement("p");
      generatedForm.lang = "ar";
      generatedForm.textContent = value;

      card.append(formLabel, generatedForm);
      return card;
    });

    const formGrid = document.createElement("div");
    formGrid.className = "form-results";
    formGrid.append(...formCards);

    results.replaceChildren(heading, formGrid);
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    BAB_CONFIG,
    HARAKAT,
    buildActivePast,
    buildActivePresent,
    getBabConfig,
  };
}
