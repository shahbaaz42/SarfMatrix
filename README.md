# Arabic Ṣarf Generator

Version 1 is a small, browser-based interface for entering a three-letter Arabic
root and selecting one of the six standard Thulāthī Mujarrad Bābs. It displays
the current selection only; morphology and conjugation rules are intentionally
reserved for a future version.

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
- `script.js` displays the entered root and selected Bāb when **Generate** is
  clicked.
