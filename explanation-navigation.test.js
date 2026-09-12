"use strict";

const assert = require("assert");
const navigation = require("./explanation-navigation.js");

assert.deepStrictEqual(
  navigation.targetForResultPosition("section-01-body", 3, 2),
  { section: "section01", rowIndex: 3, field: "present" },
);
assert.deepStrictEqual(
  navigation.targetForResultPosition("section-02-body", 9, 4),
  { section: "section02", rowIndex: 9, field: "heavyEmphatic" },
);
assert.deepStrictEqual(
  navigation.targetForResultPosition("section-03-body", 1, 3),
  { section: "section03", rowIndex: 1, field: "heavyImperative" },
);
assert.deepStrictEqual(
  navigation.targetForResultPosition("active-participle-body", 2, 5),
  { section: "section04", group: "activeParticiple", rowIndex: 2, valueIndex: 4 },
);
assert.deepStrictEqual(
  navigation.targetForResultPosition("masdar-body", 0, 1),
  { section: "section04", group: "masdar", rowIndex: 0, valueIndex: 0 },
);

assert.strictEqual(navigation.targetForResultPosition("section-01-body", 0, 0), null, "row-label cells must not navigate");
assert.strictEqual(navigation.targetForResultPosition("section-03-body", 0, 4), null, "out-of-range verbal cells must not navigate");
assert.strictEqual(navigation.targetForResultPosition("unknown-body", 0, 1), null, "unknown tables must not navigate");
assert.strictEqual(navigation.targetForResultPosition("masdar-body", -1, 1), null, "invalid row indices must not navigate");

assert(Object.isFrozen(navigation.VERBAL_TABLES));
assert(Object.isFrozen(navigation.DERIVED_TABLES));

console.log("Verified B10 generated-cell to explanation-target navigation mapping.");
