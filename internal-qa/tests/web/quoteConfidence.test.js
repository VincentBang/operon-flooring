"use strict";

const assert = require("assert");
const confidence = require("../../../apps/web/quoteConfidence");

function baseInput(overrides) {
  return Object.assign({
    selectedProductCategory: "hybrid",
    quoteMode: "supply_install",
    measurementMethod: "manual_total",
    propertyType: "house",
    parkingAccess: "easy",
    stairs: "no",
    removalDecision: "no",
    floorPrepDecision: "no",
    underlayDecision: "yes",
    finishDecision: "no",
    doorDecision: "no",
    furnitureDecision: "no"
  }, overrides || {});
}

function baseResult(overrides) {
  return Object.assign({
    realArea: 70,
    quoteMode: "supply_install",
    pricingMode: "product",
    pricePending: false,
    manualReviewRequired: false,
    warnings: []
  }, overrides || {});
}

let result = confidence.calculateEstimateConfidence({}, {});
assert.strictEqual(result.status, "not_ready");
assert(result.message.includes("Estimate pending"));

result = confidence.calculateEstimateConfidence(baseInput(), baseResult());
assert(["medium", "high"].includes(result.status));

result = confidence.calculateEstimateConfidence(baseInput({
  measurementMethod: "floorplan_upload"
}), baseResult());
assert.strictEqual(result.status, "high");

result = confidence.calculateEstimateConfidence(baseInput({
  stairs: "yes",
  stairWidthKnown: "no",
  stairsCount: "0",
  stairDetails: []
}), baseResult());
assert.strictEqual(result.status, "low");
assert(result.blockers.join(" ").includes("Stairs"));

result = confidence.calculateEstimateConfidence(baseInput({
  stairs: "yes",
  stairWidthKnown: "yes",
  stairWidthMm: "950",
  stairsCount: "10",
  stairDetails: [{ type: "straight_tread", quantity: 10 }]
}), baseResult({ manualReviewRequired: true }));
assert.strictEqual(result.status, "medium");

let notes = confidence.generateQuoteReviewNotes(baseInput({
  stairs: "yes",
  stairWidthKnown: "yes",
  stairWidthMm: "950",
  stairsCount: "10",
  stairDetails: [{ type: "straight_tread", quantity: 10 }]
}), baseResult(), result);
assert(notes.some((note) => /provided width and item count/i.test(note)));

result = confidence.calculateEstimateConfidence(baseInput({
  removalDecision: "yes",
  removalDisposal: "not_sure"
}), baseResult());
assert.notStrictEqual(result.status, "high");
notes = confidence.generateQuoteReviewNotes(baseInput({
  removalDecision: "yes",
  removalDisposal: "not_sure"
}), baseResult(), result);
assert(notes.some((note) => /Disposal\/take-away/i.test(note)));

result = confidence.calculateEstimateConfidence(baseInput(), baseResult({
  pricingMode: "fallback",
  pricePending: true
}));
notes = confidence.generateQuoteReviewNotes(baseInput(), baseResult({
  pricingMode: "fallback",
  pricePending: true
}), result);
assert.strictEqual(notes.filter((note) => /product pricing needs review/i.test(note)).length, 1);

result = confidence.calculateEstimateConfidence(baseInput({
  propertyType: "unit_apartment",
  level: "level_2_plus",
  hasLift: "",
  parkingAccess: "unsure"
}), baseResult());
assert.notStrictEqual(result.status, "high");
notes = confidence.generateQuoteReviewNotes(baseInput({
  propertyType: "unit_apartment",
  level: "level_2_plus",
  hasLift: "",
  parkingAccess: "unsure"
}), baseResult(), result);
assert(notes.some((note) => /apartment site details|site details/i.test(note)));

notes = confidence.generateQuoteReviewNotes(baseInput({
  finishDecision: "not_sure",
  doorDecision: "not_sure",
  furnitureDecision: "not_sure"
}), baseResult(), null);
assert.strictEqual(notes[0], "Needs confirmation before final pricing: skirting/scotia, door trimming and furniture moving.");

result = confidence.calculateEstimateConfidence(baseInput({
  removalDecision: "not_sure",
  underlayDecision: "not_sure"
}), baseResult());
assert.notStrictEqual(result.status, "high");
notes = confidence.generateQuoteReviewNotes(baseInput({
  removalDecision: "not_sure",
  underlayDecision: "not_sure"
}), baseResult(), result);
assert.strictEqual(notes[0], "Needs confirmation before final pricing: removal and underlay.");

notes = confidence.generateQuoteReviewNotes(baseInput({
  stairs: "yes",
  stairWidthKnown: "yes",
  stairWidthMm: "950",
  stairsCount: "10",
  stairDetails: [{ type: "straight_tread", quantity: 10 }],
  removalDecision: "yes",
  removalDisposal: "not_sure",
  floorPrepDecision: "not_sure",
  floorPrepType: "unsure",
  underlayDecision: "not_sure",
  finishDecision: "not_sure",
  doorDecision: "not_sure",
  furnitureDecision: "not_sure"
}), baseResult({
  pricingMode: "fallback",
  pricePending: true
}), null);
assert(notes[0].includes("disposal / take-away"));
assert(notes[0].includes("door trimming"));
assert(notes[0].includes("furniture moving"));
assert(notes.length <= 5);

console.log("quoteConfidence.test.js passed");
