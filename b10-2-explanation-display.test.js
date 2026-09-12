"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const ui = fs.readFileSync("explanation-ui.js", "utf8");
const css = fs.readFileSync("explanation-ui.css", "utf8");

// Learner-facing Bāb labels must come from the selected Arabic Bāb name,
// not from Roman-number terminology such as "Form VIII".
assert.match(ui, /function currentBabName\(\)/);
assert.match(ui, /Derivational hamzah of \$\{babName\}/);
assert.match(ui, /Inserted ت of \$\{babName\}/);

// Transformation prose should show the Arabic letters themselves.
assert.match(ui, /The inserted ت changes to ط\./);
assert.match(ui, /the inserted ت changes to ط after this emphatic initial radical/);

// The displayed source/result order is fixed as source → result regardless of RTL.
assert.match(ui, /change\.dir = "ltr"/);
assert.match(ui, /change\.append\(before, arrow, after\)/);
assert.match(ui, /create\("span", "explanation-step__arrow", "→"\)/);
assert.match(css, /\.explanation-step__change[\s\S]*direction: ltr/);
assert.match(css, /\.explanation-step__arabic-token[\s\S]*direction: rtl/);

console.log("Verified B10.2 Bāb-aware labels, Arabic-letter rule wording and source-to-result arrow direction guards.");
