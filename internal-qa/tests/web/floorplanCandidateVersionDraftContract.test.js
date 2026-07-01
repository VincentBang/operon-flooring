"use strict";

const assert = require("assert");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Hybrid = require("../../fixtures/floorplanHybridSelectorCandidates");
const Draft = require("../../../netlify/functions/shared/floorplanCandidateVersionDraft");

const SESSION_ID = "11111111-1111-4111-8111-111111111111";
const UPLOAD_ID = "22222222-2222-4222-8222-222222222222";
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

function requestFor(item, overrides) {
  return Object.assign({
    measurement_session_id: SESSION_ID,
    uploaded_file_id: UPLOAD_ID,
    page_key: item.id + "-candidate",
    candidate_method: "hybrid_selector_spike",
    plan_quality: item.plan_quality,
    page_number: 1,
    max_candidates: 40
  }, overrides || {});
}

function contextFor(item) {
  return {
    page_width: item.reviewed.page_width,
    page_height: item.reviewed.page_height,
    pixels_per_metre: item.reviewed.pixels_per_metre,
    coordinate_space: item.reviewed.coordinate_space
  };
}

(function testHybridCandidatesBecomeReviewOnlyDrafts() {
  corpus.forEach(function (item) {
    const result = Draft.buildCandidateVersionDraftPayload(
      requestFor(item),
      Hybrid.hybridSelectorCandidatePayloadForItem(item),
      contextFor(item)
    );
    assert.equal(result.request.measurement_session_id, SESSION_ID);
    assert.equal(result.request.uploaded_file_id, UPLOAD_ID);
    assert.equal(result.payload.source, "floorplan_detection_candidate");
    assert.equal(result.payload.measurement_mode, "candidate_review");
    assert.equal(result.payload.version_source, "system");
    assert.equal(result.payload.review_required, true);
    assert.equal(result.payload.selected_area_m2, 0);
    assert.ok(result.payload.measured_area_m2 > 0);
    assert.ok(result.payload.sections.length >= 1);
    assert.ok(result.payload.sections.every(function (section) {
      return section.selection_state === "not_sure"
        && ["low", "medium"].includes(section.confidence_level);
    }));
    assert.equal(result.safe_summary.selected_area_m2, 0);
    assert.equal(result.safe_summary.review_required, true);
    assertNoSensitiveText(JSON.stringify(result), "candidate draft result");
  });
})();

(function testCandidateDraftRejectsUnsafeInput() {
  const item = corpus[0];
  assert.throws(function () {
    Draft.buildCandidateVersionDraftPayload(requestFor(item), {
      candidates: [],
      publish_to_customer: true
    }, contextFor(item));
  }, /unsupported fields/);

  assert.throws(function () {
    Draft.buildCandidateVersionDraftPayload(requestFor(item, { max_candidates: 1 }), {
      candidates: Hybrid.hybridSelectorCandidatePayloadForItem(item).candidates.concat([
        Hybrid.hybridSelectorCandidatePayloadForItem(item).candidates[0]
      ])
    }, contextFor(item));
  }, /requested limit/);

  assert.throws(function () {
    Draft.buildCandidateVersionDraftPayload(requestFor(item), {
      candidates: [{ label: "Broken" }]
    }, contextFor(item));
  }, /usable outline/);

  assert.throws(function () {
    Draft.buildCandidateVersionDraftPayload(requestFor(item), Hybrid.hybridSelectorCandidatePayloadForItem(item), {
      page_width: 1000
    });
  }, /context is incomplete/);
})();

console.log("floorplanCandidateVersionDraftContract.test.js passed");
