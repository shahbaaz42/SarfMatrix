# Arabic Ṣarf Generator

Version 6 is a small, browser-based generator for entering a three-letter Arabic
root and selecting one of the six Thulāthī Mujarrad Bābs defined in the reference
workbook. It generates all 14 fully vocalized Ṣīghahs of the active past and active
present using the selected Bāb's middle-radical vowels. It also generates the
workbook's 14-form passive past, passive present, majzūm present, and manṣūb
present families. It additionally generates the workbook's present forms with
`لَامُ التَّأْكِيدِ` and either heavy or light `نُونُ التَّأْكِيدِ`.
The majzūm forms can be generated with any of the workbook's three H3 validation
options: `لَمْ`, `لَمَّا`, or `لَا`.

The manṣūb forms can be generated with any of the workbook's four normalized
I3 particle options: `أَنْ`, `لَنْ`, `كَيْ`, or `إِذَنْ`. The application
inserts exactly one space between the selected particle and the verb.

The heavy-Nūn family follows all 14 populated cells in `Base - Template` column
J. The light-Nūn family follows column K: its dual and feminine-plural positions
are blank in the workbook, so Version 6 keeps those six result cells blank rather
than manufacturing forms. Both families join `لَ` directly to the present stem
without a space.

Version 6 intentionally does not generate imperatives, derived nouns, optional
derived patterns, or Thulāthī Mazīd Fīh forms.

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
  configurations and builds the active and Version 4–6 result tables
  when **Generate** is clicked.
- `Arabic Sarf Template.xlsx` is the authoritative reference workbook.
