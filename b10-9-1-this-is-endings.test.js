"use strict";
const fs = require("fs");
const assert = require("assert");
const source = fs.readFileSync("explanation-learner-labels.js", "utf8");
assert(source.includes("This is ${text}"), "Nominal component labels should use a learner-friendly This is prefix");
assert(source.includes("NOMINAL_COMPONENT_PREFIX"), "Nominal component prefix matcher should be present");
console.log("Verified learner-facing nominal Structure labels use the This is prefix.");
