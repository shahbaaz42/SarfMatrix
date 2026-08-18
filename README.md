# Arabic Ṣarf Generator

Version 2 is a small, browser-based generator for entering a three-letter Arabic
root and selecting one of the six Thulāthī Mujarrad Bābs defined in the reference
workbook. It generates the fully vocalized third-person masculine singular active
past and active present forms using the selected Bāb's middle-radical vowels.

Version 2 intentionally does not yet generate the other 13 Ṣīghahs, passive or
derived forms, moods, imperatives, emphatic forms, or Thulāthī Mazīd Fīh forms.

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
- `script.js` contains the workbook-derived Bāb configuration and builds the two
  supported active forms when **Generate** is clicked.
- `Arabic Sarf Template.xlsx` is the authoritative reference workbook.
