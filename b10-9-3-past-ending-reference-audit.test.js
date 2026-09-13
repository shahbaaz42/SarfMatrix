"use strict";
const fs = require("fs");
const assert = require("assert");
const source = fs.readFileSync("explanation-learner-labels.js", "utf8");
for (const text of [
  "تاء التأنيث",
  "ألف الاثنين",
  "تاء الفاعل للمخاطب",
  "أنتما",
  "أنتم",
  "أنتنّ",
  "تاء الفاعل للمتكلم",
  "نا الفاعلين",
]) assert(source.includes(text), `Missing audited past-ending label: ${text}`);
assert(source.includes("ACTIVE_PAST_ENDINGS"), "Active-past ending layout should be explicit");
assert(source.includes("splitReferenceAuditedPastEnding"), "Past endings should split into separate Structure cards");
console.log("Verified reference-audited active-past Structure ending labels are present.");
