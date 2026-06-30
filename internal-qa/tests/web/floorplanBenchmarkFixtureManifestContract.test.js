"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");

const ALLOWED_ORIGINS = new Set(["synthetic", "approved_real_reviewed_sample"]);
const ALLOWED_USAGE = new Set(["approved_for_local_qa", "approved_for_internal_benchmark"]);
const ALLOWED_PRIVACY = new Set(["no_customer_data", "customer_identifiers_removed"]);

(function testEveryFixtureDeclaresPrivacyAndUsageStatus() {
  corpus.forEach(function (item) {
    assert.ok(ALLOWED_ORIGINS.has(item.fixture_origin), item.id + " needs an allowed fixture_origin.");
    assert.ok(ALLOWED_USAGE.has(item.usage_status), item.id + " needs an allowed usage_status.");
    assert.ok(ALLOWED_PRIVACY.has(item.privacy_status), item.id + " needs an allowed privacy_status.");
    assert.equal(item.customer_identifiers_removed, true, item.id + " must confirm customer identifiers are removed.");
  });
})();

(function testSyntheticFixturesDoNotPretendToBeRealReviewedSamples() {
  corpus.forEach(function (item) {
    if (item.fixture_origin === "synthetic") {
      assert.ok(String(item.id).indexOf("synthetic-") === 0, item.id + " synthetic fixture ids should be explicit.");
      assert.ok(String(item.file_type || "").indexOf("synthetic") === 0, item.id + " synthetic fixture file type should be explicit.");
      assert.equal(item.privacy_status, "no_customer_data");
    }
  });
})();

(function testRealReviewedSamplesRequireInternalBenchmarkApproval() {
  const realSamples = corpus.filter(function (item) {
    return item.fixture_origin === "approved_real_reviewed_sample";
  });
  realSamples.forEach(function (item) {
    assert.equal(item.usage_status, "approved_for_internal_benchmark");
    assert.equal(item.privacy_status, "customer_identifiers_removed");
    assert.notEqual(String(item.id).indexOf("synthetic-"), 0, item.id + " real fixture ids must not use synthetic prefix.");
  });
})();

console.log("floorplanBenchmarkFixtureManifestContract.test.js passed");
