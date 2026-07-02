"use strict";

const assert = require("assert");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const template = require("../../templates/floorplanApprovedRealSampleFixtureTemplate");
const batchTemplate = require("../../templates/floorplanApprovedRealSampleBatchTemplate");
const Gate = require("../../lib/floorplanRealSampleIntakeGateReport");
const Validator = require("../../scripts/validateFloorplanRealSampleFixture");
const Geometry = require("../../../netlify/functions/shared/floorplanGeometry");

const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testTemplateHasApprovedRealSampleShape() {
  assert.equal(template.fixture_origin, "approved_real_reviewed_sample");
  assert.equal(template.usage_status, "approved_for_internal_benchmark");
  assert.equal(template.privacy_status, "customer_identifiers_removed");
  assert.equal(template.customer_identifiers_removed, true);
  assert.ok(String(template.id).indexOf("reviewed-sample-") === 0);
  assert.notEqual(String(template.id).indexOf("synthetic-"), 0);
  assert.ok(template.reviewed.sections.length >= 1);
  assertNoSensitiveText(JSON.stringify(template), "real sample template");
})();

(function testTemplateValidatesAsMeasurementButIsNotInCorpus() {
  const normalized = Geometry.validateMeasurementPayload(template.reviewed, { forceReviewRequired: true });
  assert.equal(normalized.review_required, true);
  assert.ok(normalized.measured_area_m2 > 0);
  assert.ok(normalized.sections.every(function (section) {
    return ["room", "wet_area", "outdoor", "void", "other"].includes(section.section_type);
  }));

  const corpusIds = new Set(corpus.map(function (item) { return item.id; }));
  assert.equal(corpusIds.has(template.id), false, "Template must not be imported into the active benchmark corpus.");
})();

(function testTemplateCanCloseOneApprovedSampleGateWhenCopiedIntoBatch() {
  const report = Gate.buildFloorplanRealSampleIntakeGateReport([template]);
  assert.equal(report.real_sample_count, 1);
  assert.equal(report.approved_real_sample_count, 1);
  assert.equal(report.manifest_block_count, 0);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.ok(report.coverage_gap_count >= 1);
  assertNoSensitiveText(JSON.stringify(report), "template intake gate report");
})();

(function testBatchTemplateClosesCoverageButDoesNotEnterCorpus() {
  assert.equal(Array.isArray(batchTemplate), true);
  assert.equal(batchTemplate.length, 5);

  const validation = Validator.validateFixtures(batchTemplate);
  assert.equal(validation.ok, true);

  const report = Gate.buildFloorplanRealSampleIntakeGateReport(batchTemplate);
  assert.equal(report.real_sample_count, 5);
  assert.equal(report.approved_real_sample_count, 5);
  assert.equal(report.manifest_block_count, 0);
  assert.equal(report.coverage_gap_count, 0);
  assert.equal(report.ready_for_real_sample_benchmark_batch, true);
  assert.equal(report.ready_to_add_real_samples_to_training, false);

  const corpusIds = new Set(corpus.map(function (item) { return item.id; }));
  batchTemplate.forEach(function (item) {
    assert.equal(corpusIds.has(item.id), false, item.id + " must not be imported into the active benchmark corpus.");
    assertNoSensitiveText(JSON.stringify(item), item.id + " batch template");
  });
})();

console.log("floorplanRealSampleTemplateContract.test.js passed");
