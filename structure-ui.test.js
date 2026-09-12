"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.join(__dirname, "explanation-ui.css"), "utf8");

assert.match(css, /\.explanation-block:has\(\.structure-runs\)\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;/s,
  "Structure block should span the full explanation grid");
assert.match(css, /\.structure-runs\s*\{[^}]*direction:\s*rtl;/s,
  "Structure sequence should flow right-to-left");
assert.match(css, /\.structure-run\s*\{[^}]*direction:\s*ltr;/s,
  "Learner-facing segment cards should isolate English labels left-to-right");
assert.match(css, /\.structure-run__arabic\s*\{[^}]*direction:\s*rtl;[^}]*unicode-bidi:\s*isolate;/s,
  "Arabic segment text should be RTL and bidi-isolated");
assert.match(css, /\.structure-run__label\s*\{[^}]*direction:\s*ltr;[^}]*unicode-bidi:\s*plaintext;/s,
  "Identity labels should remain readable left-to-right");
assert.match(css, /@media\s*\(max-width:\s*32rem\)[\s\S]*\.structure-runs\s*\{[^}]*minmax\(6\.8rem,\s*1fr\)/s,
  "Structure view should retain a compact responsive layout on narrow screens");

console.log("Verified B9 RTL Structure UI layout contract.");
