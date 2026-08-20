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

## Interface and exports

The responsive interface uses most of the available desktop width while keeping
each result table independently scrollable on narrow screens. An optional
**Colour root letters** control applies three position-aware colours to فاء
الكلمة, عين الكلمة, and لام الكلمة without changing the plain Unicode strings
returned by the morphology generators. The control is off by default and can be
toggled after results are generated.

Generated results can be downloaded entirely in the browser as PDF or Word in
Portrait or Landscape layout. Portrait output places the three verb sections on
separate pages followed by the derived forms. Landscape output consolidates the
verb sections into one table with a single pronoun column, then keeps Section 04
as an independent non-pronoun block. Both formats include root/Bāb/particle
metadata, root colours when enabled, and the developer footer on every page.

No third-party export library is used. PDF pages are rasterized by the browser's
HTML/SVG text engine before being packaged as a genuine PDF, preserving the
browser's Arabic shaping and combining marks. Word downloads are genuine DOCX
ZIP packages containing RTL WordprocessingML, table headers, page breaks,
coloured text runs, orientation settings, and a repeating footer. This keeps the
static GitHub Pages application backend-free and avoids direct PDF text drawing,
which can disconnect Arabic glyphs.

Section 04 remains structurally distinct from the 14-pronoun verb tables: its
participles retain their gender/number/state matrices, while اسم التفضيل and اسم
الظرف retain their workbook-specific alternatives and blank positions.

## Developer

Developed by Shahbaaz Ahmed — <shahbaaz.education@gmail.com>
© Shahbaaz Ahmed. All Rights Reserved.

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
- `export.js` builds client-side PDF and genuine DOCX downloads and contains no
  third-party runtime dependency.
- `Arabic Sarf Template.xlsx` is the authoritative reference workbook.
