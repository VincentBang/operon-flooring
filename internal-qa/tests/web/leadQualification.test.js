const assert = require("assert");
const qualification = require("../../../internal-docs/lead-scoring/leadQualification.js");

function baseLead(overrides) {
  return Object.assign({
    suburb: "Parramatta",
    postcode: "2150",
    quoteMode: "supply_install",
    category: "hybrid",
    realArea: 68,
    measurementMethod: "manual_total",
    measurementStatus: "measured",
    removalStatus: "no",
    stairsStatus: "no",
    floorPrepRisk: "flat",
    timeframe: "warm",
    quoteTotal: 8500,
    quoteConfidence: "Medium",
    reviewRequired: false,
    leadSource: "quote.html"
  }, overrides || {});
}

function testSiteConfirmationPriority() {
  const result = qualification.qualifyLead(baseLead({ timeframe: "hot" }));
  assert.equal(result.status, qualification.STATUSES.SITE_CONFIRMATION_ELIGIBLE);
  assert.equal(result.priority, qualification.PRIORITIES.A);
  assert.equal(result.nextAction, qualification.NEXT_ACTIONS.BOOK_SITE_CONFIRMATION);
  assert.equal(result.analyticsEvent, qualification.ANALYTICS_EVENTS.A);
}

function testMissingInfoWhenAreaMissing() {
  const result = qualification.qualifyLead(baseLead({
    realArea: 0,
    measurementStatus: "unknown",
    measurementMethod: "unknown",
    nextStepRequired: ""
  }));
  assert.equal(result.status, qualification.STATUSES.NEEDS_MISSING_INFO);
  assert.equal(result.priority, qualification.PRIORITIES.B);
  assert(result.missingFields.includes("area or floorplan"));
  assert.equal(result.nextAction, qualification.NEXT_ACTIONS.REQUEST_FLOOR_PLAN);
}

function testManualFounderReviewForRisk() {
  const result = qualification.qualifyLead(baseLead({
    stairsStatus: "yes",
    floorPrepRisk: "moisture",
    reviewRequired: true
  }));
  assert.equal(result.status, qualification.STATUSES.MANUAL_REVIEW_REQUIRED);
  assert.equal(result.priority, qualification.PRIORITIES.D);
  assert(result.riskFlags.includes("stairs"));
  assert(result.riskFlags.includes("floor prep"));
  assert.equal(result.analyticsEvent, qualification.ANALYTICS_EVENTS.D);
}

function testLowPriorityBelowMinimum() {
  const result = qualification.qualifyLead(baseLead({ realArea: 14 }));
  assert.equal(result.status, qualification.STATUSES.LOW_PRIORITY);
  assert.equal(result.priority, qualification.PRIORITIES.C);
  assert.equal(result.nextAction, qualification.NEXT_ACTIONS.MARK_LOW_PRIORITY);
}

function testComeLookRequestNeedsInfo() {
  const result = qualification.qualifyLead(baseLead({
    suburb: "",
    postcode: "",
    category: "",
    realArea: 0,
    removalStatus: "",
    stairsStatus: "",
    timeframe: "",
    quoteTotal: 0,
    notes: "Can you just come have a look?"
  }));
  assert.equal(result.status, qualification.STATUSES.NEEDS_MISSING_INFO);
  assert.equal(result.priority, qualification.PRIORITIES.B);
  assert(result.missingFields.includes("site visit request without enough details"));
}

testSiteConfirmationPriority();
testMissingInfoWhenAreaMissing();
testManualFounderReviewForRisk();
testLowPriorityBelowMinimum();
testComeLookRequestNeedsInfo();

console.log("leadQualification.test.js passed");
