# Arabic Ṣarf Generator

Version 8 is a small, browser-based generator for entering a three-letter Arabic
root and selecting one of the six Thulāthī Mujarrad Bābs defined in the reference
workbook. It generates all 14 fully vocalized Ṣīghahs of the active past and active
present using the selected Bāb's middle-radical vowels. It also generates the
workbook's 14-form passive past, passive present, majzūm present, and manṣūb
present families. It additionally generates the workbook's present forms with
`لَامُ التَّأْكِيدِ` and either heavy or light `نُونُ التَّأْكِيدِ`.
The majzūm forms can be generated with any of the workbook's three H3 validation
options: `لَمْ`, `لَمَّا`, or `لَا`.

The manṣūb forms can be generated with any of the workbook's four normalized
I3 particle options: `لَنْ`, `أَنْ`, `كَيْ`, or `إِذَنْ`; `لَنْ` is the default. The application
inserts exactly one space between the selected particle and the verb.

The heavy-Nūn family follows all 14 populated cells in `Base - Template` column
J. The light-Nūn family follows column K: its dual and feminine-plural positions
are blank in the workbook, so Version 7 keeps those six result cells blank rather
than manufacturing forms. Both families join `لَ` directly to the present stem
without a space.

Version 7 adds all 14 workbook-derived imperative rows, including `لام الأمر`
forms, direct imperatives, and their heavy- and light-Nūn families. Workbook-unavailable
light-Nūn cells remain blank. Version 8 adds the workbook-derived `اسم الفاعل`,
`اسم المفعول`, `اسم التفضيل`, and `اسم الظرف` tables while preserving the
workbook's blank positions and Bāb-dependent ظرف vowel. Optional derived patterns
and Thulāthī Mazīd Fīh forms remain outside the application.

The final Version 8 interface can colour the three root positions without
changing generated Unicode strings. After generation, an immutable snapshot
keeps displayed metadata and morphology synchronized while client-side PDF and
genuine DOCX downloads provide portrait and landscape layouts. Editing a root
or Bāb invalidates that snapshot until **Generate** is clicked again.

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
- `script.js` contains the workbook-derived Bāb, reusable 14-Ṣīghah, and nominal
  configurations and builds the Version 8 result tables
  when **Generate** is clicked.
- `export.js` builds browser-shaped PDF pages and WordprocessingML DOCX packages
  entirely in the browser from the immutable generated-state snapshot.
- `Arabic Sarf Template.xlsx` is the authoritative reference workbook.
