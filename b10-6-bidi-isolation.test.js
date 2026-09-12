"use strict";
const fs = require("fs");
const assert = require("assert");
const ui = fs.readFileSync("explanation-ui.js", "utf8");

assert(ui.includes('create("bdi", "explanation-inline-arabic"'), "Arabic fragments should render in isolated BDI nodes");
assert(ui.includes('token.dir = "rtl"'), "Arabic fragments should explicitly use RTL direction");
assert(ui.includes('First root radical (فاء الكلمة)'), "Root terminology should show English with Arabic in brackets");
assert(ui.includes('Subject ت (تاء الفاعل)'), "Subject tāʾ should use the Arabic letter and Arabic terminology in brackets");
assert(ui.includes('Feminine plural ن (نون النسوة)'), "Nūn al-niswah should use Arabic terminology in brackets");
assert(ui.includes('return `ت of ${babName}`'), "Bāb al-iftial component should retain the simple learner label");
assert(ui.includes('Substitution (إبدال)'), "Ibdāl should display with its English translation and isolated Arabic term");
assert(ui.includes('Assimilation (إدغام)'), "Idghām should display with its English translation and isolated Arabic term");
assert(ui.includes('combinedForm8'), "Combined Form VIII rules should suppress misleading single-operation metadata");

console.log("Verified B10.6 mixed Arabic/English labels use learner-friendly bracketed terminology and bidi isolation.");
