# Arabic Ṣarf Generator

Version 4 is a small, browser-based generator for entering a three-letter Arabic
root and selecting one of the six Thulāthī Mujarrad Bābs defined in the reference
workbook. It generates all 14 fully vocalized Ṣīghahs of the active past and active
present using the selected Bāb's middle-radical vowels. Version 4 also generates
the workbook's 14-form passive past, passive present, and majzūm present families.
The majzūm forms can be generated with any of the workbook's three H3 validation
options: `لَمْ`, `لَمَّا`, or `لَا`.

Version 4 intentionally does not generate manṣūb, imperatives, emphatic forms,
derived nouns, optional patterns, or Thulāthī Mazīd Fīh forms.

## Known workbook inconsistency

`Base - Template!A18` contains an inconsistent helper formula and cached value
(`كْرَمُا`). It is not an output dependency: `E18` depends on `B18`, whose formula
produces the workbook's active-present output `تَكْرُمَانِ`. Version 3 therefore
follows the actual `B18` → `E18` dependency and leaves the workbook unchanged.

## Run locally

No installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.

For a local development server, you can instead run the following command from
the project directory if Python 3 is installed:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000> in your browser.

## Project files

- `index.html` contains the page structure and form.
- `style.css` provides the responsive layout and visual design.
- `script.js` contains the workbook-derived Bāb and reusable 14-Ṣīghah
  configurations and builds both result tables when **Generate** is clicked.
- `Arabic Sarf Template.xlsx` is the authoritative reference workbook.
