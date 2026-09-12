"use strict";
const fs = require("fs");
const assert = require("assert");
const ui = fs.readFileSync("explanation-ui.js", "utf8");
const keyboard = fs.readFileSync("arabic-root-keyboard.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");

assert(ui.includes("إبدال (Substitution)"), "Derivation should teach Ibdāl with its English translation");
assert(ui.includes("إدغام (Assimilation)"), "Derivation should teach Idghām with its English translation");
assert(ui.includes("the two ت letters merge into تّ"), "Matching tāʾ assimilation should explain the doubled Arabic letter");
assert(ui.includes("the matching letters at the junction merge into a single doubled letter"), "Generic idghām wording must not falsely call every pair two tāʾ letters");
assert(ui.includes("orthography?`${orthography} of ${babName}`"), "Hamzah label should use the selected Bāb name without Roman form numbering");
assert(keyboard.includes('"ض"') && keyboard.includes('"ط"') && keyboard.includes('"ظ"'), "Arabic keyboard should expose distinct emphatic letters");
assert(keyboard.includes("firstAvailableInput"), "Keyboard should fill the next available root input");
assert(html.includes("arabic-root-keyboard.js?v=phase-b10-3"), "Arabic keyboard must be loaded by the live generator");
console.log("Verified B10.3 learner terminology and optional Arabic root keyboard wiring.");
