"use strict";

const assert = require("assert");
const { _test } = require("../../../netlify/functions/quote-review-ocr");
const quoteReviewReport = require("../../../apps/web/quoteReviewReport");

const invoiceText = [
  "Sample Flooring Co",
  "Tax invoice",
  "Invoice number Issue date Due date",
  "IV00000000944 28/02/2026 07/03/2026",
  "Nu Ton and Khac Le",
  "Description UoM Qty Unit price ($) Tax Amount ($)",
  "Supply and install Hybrid 7mm 73 48.00 GST 3,504.00",
  "Notes",
  "Address: 7 Church Road, Yagoona",
  "Subtotal (exc. tax) $3,504.00",
  "Tax $350.40",
  "Total Amount (inc. tax) $3,854.40"
].join("\n");

const fields = _test.extractFieldsWithRules(invoiceText);
const scopeComparison = _test.compareScopeAgainstRules(fields);
const missingScope = scopeComparison
  .filter((item) => item.status === "unknown" || item.status === "subject_to_confirmation")
  .map((item) => item.key);

assert.strictEqual(fields.supplierName, "Sample Flooring Co");
assert.strictEqual(fields.documentType, "invoice");
assert.strictEqual(fields.invoiceOrQuoteNumber, "IV00000000944");
assert.strictEqual(fields.issueDate, "28/02/2026");
assert.strictEqual(fields.dueDate, "07/03/2026");
assert.strictEqual(fields.customerName, "Nu Ton and Khac Le");
assert.strictEqual(fields.jobAddress, "7 Church Road, Yagoona");
assert.strictEqual(fields.flooringType, "hybrid");
assert.strictEqual(fields.thicknessMm, 7);
assert.strictEqual(fields.quotedAreaM2, 73);
assert.strictEqual(fields.lineItems[0].rawDescription, "Supply and install Hybrid 7mm");
assert.strictEqual(fields.lineItems[0].unit, "m2");
assert.strictEqual(fields.lineItems[0].unitPriceExGst, 48);
assert.strictEqual(fields.lineItems[0].lineTotalExGst, 3504);
assert.strictEqual(fields.quoteTotalExGst, 3504);
assert.strictEqual(fields.gstAmount, 350.4);
assert.strictEqual(fields.quoteTotalIncGst, 3854.4);
assert.strictEqual(fields.comparisonStatus, "COMPARABLE_WITH_CAUTION");
assert.ok(missingScope.includes("underlay"));
assert.ok(missingScope.includes("removal"));
assert.ok(missingScope.includes("disposal"));
assert.ok(missingScope.includes("floorPreparation"));
assert.ok(missingScope.includes("scotia"));
assert.ok(missingScope.includes("stairs"));

(async function runComparisonCheck() {
  const comparison = await _test.compareAgainstOperonDatabase(fields, { extractedText: invoiceText });
  const scopeClassification = _test.buildScopeClassification(fields, comparison);
  const operonComparison = _test.buildOperonComparison(fields, comparison, scopeClassification);
  const decisionReport = _test.buildDecisionReport(fields, scopeClassification, operonComparison);
  const normalizedReport = quoteReviewReport.normalizeQuoteReview({
    mode: "detailed",
    extractedQuoteFields: fields,
    databaseComparison: comparison,
    operonComparison: operonComparison,
    decisionReport: decisionReport
  });
  assert.notStrictEqual(comparison.status, "not_ready");
  assert.notStrictEqual(comparison.notes, "Readable uploaded quote text is not available for Operon comparison.");
  assert.strictEqual(comparison.priceGuide.quotedAreaM2, 73);
  assert.strictEqual(comparison.priceGuide.quotedUnitPriceExGstPerM2, 48);
  assert.strictEqual(comparison.comparisonLevel, "category_level_only");
  assert.strictEqual(scopeClassification.stage, "scope_classification");
  assert.ok(scopeClassification.known.some((item) => item.key === "area"));
  assert.ok(scopeClassification.missing.some((item) => item.key === "underlay"));
  assert.strictEqual(operonComparison.stage, "operon_comparison_mapping");
  assert.strictEqual(operonComparison.status, "OPERON_CATEGORY_ESTIMATE_ONLY");
  assert.strictEqual(operonComparison.operonEstimateAvailable, false);
  assert.strictEqual(decisionReport.stage, "decision_report");
  assert.strictEqual(decisionReport.executiveSummary.status, "Comparable with caution");
  assert.strictEqual(decisionReport.executiveSummary.extractionConfidence, "High");
  assert.ok(decisionReport.riskDimensions.some((item) => item.key === "variation_risk"));
  assert.ok(decisionReport.likelyVariationRisks.some((item) => item.key === "underlay"));
  assert.ok(decisionReport.visualScopeComparison.competitorQuote.unclear.includes("Underlay/acoustic layer"));
  assert.ok(decisionReport.scopeConfidence.missing.includes("Underlay/acoustic layer"));
  assert.ok(decisionReport.priceDifferenceInterpretation.includes("scope"));
  assert.strictEqual(normalizedReport.quantityM2, 73);
  assert.strictEqual(normalizedReport.unitPriceExGst, 48);
  assert.strictEqual(normalizedReport.subtotalExGst, 3504);
  assert.strictEqual(normalizedReport.gstAmount, 350.4);
  assert.strictEqual(normalizedReport.totalIncGst, 3854.4);
  assert.strictEqual(normalizedReport.flooringType, "hybrid");
  assert.strictEqual(normalizedReport.thicknessMm, 7);
  assert.strictEqual(normalizedReport.comparisonLevel, "Category-level only");
  assert.strictEqual(normalizedReport.decisionConfidence, "Low to medium");
  assert.strictEqual(normalizedReport.productMatchStatus, "not_confirmed");
  assert.strictEqual(normalizedReport.statusHeadline, "Readable, but not fully comparable yet");
  assert.ok(normalizedReport.summary.includes("73 m²"));
  assert.ok(normalizedReport.summary.includes("$48.00/m² ex GST"));
  assert.ok(normalizedReport.missingScopeItems.some((item) => item.key === "underlay"));
  assert.ok(normalizedReport.missingScopeItems.some((item) => item.key === "floor_preparation"));
  assert.ok(!normalizedReport.missingScopeItems.some((item) => item.key === "stairs"), "standard house-style quote should not treat stairs as a major missing item without stair context");
  assert.ok(normalizedReport.confirmIfApplicableItems.some((item) => item.key === "stairs"));
  assert.strictEqual(normalizedReport.confidenceDimensions.extractionConfidence, "High");

  const apartmentReport = quoteReviewReport.normalizeQuoteReview({
    extractedQuoteFields: Object.assign({}, fields, {
      jobAddress: "Unit 12, 8 Example Street, Parramatta"
    }),
    databaseComparison: comparison
  });
  assert.ok(apartmentReport.missingScopeItems.some((item) => item.key === "access"), "apartment context should make access a material scope gap");

  const stairReport = quoteReviewReport.normalizeQuoteReview({
    extractedQuoteFields: Object.assign({}, fields, {
      lineItems: [{ rawDescription: "Supply and install hybrid flooring including stairs", quantity: 73, unitPriceExGst: 48, lineTotalExGst: 3504 }]
    }),
    databaseComparison: comparison
  });
  assert.ok(stairReport.missingScopeItems.some((item) => item.key === "stairs"), "stair context should make stair detail a material scope gap");
  console.log("quoteReviewParser.test.js passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
