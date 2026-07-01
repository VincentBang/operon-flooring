"use strict";

const assert = require("assert");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Hybrid = require("../../fixtures/floorplanHybridSelectorCandidates");
const endpoint = require("../../../netlify/functions/admin-floorplan-detection-candidates");
const CandidateRequest = require("../../../netlify/functions/shared/floorplanCandidateRequest");

const SESSION_ID = "11111111-1111-4111-8111-111111111111";
const UPLOAD_ID = "22222222-2222-4222-8222-222222222222";

function event(method, headers, body) {
  return {
    httpMethod: method || "POST",
    headers: Object.assign({ origin: "http://localhost:4180" }, headers || {}),
    body: JSON.stringify(body || {})
  };
}

function withEnv(values, handler) {
  const previous = {
    OPERON_ADMIN_TOKEN: process.env.OPERON_ADMIN_TOKEN,
    OPERON_FLOORPLAN_CANDIDATES_ENABLED: process.env.OPERON_FLOORPLAN_CANDIDATES_ENABLED
  };
  Object.keys(values).forEach(function (key) {
    if (typeof values[key] === "undefined") {
      delete process.env[key];
    } else {
      process.env[key] = values[key];
    }
  });
  return Promise.resolve()
    .then(handler)
    .finally(function () {
      Object.keys(previous).forEach(function (key) {
        if (typeof previous[key] === "undefined") {
          delete process.env[key];
        } else {
          process.env[key] = previous[key];
        }
      });
    });
}

function parse(response) {
  return JSON.parse(response.body || "{}");
}

function assertSafeBody(body) {
  const serialized = JSON.stringify(body);
  [
    "storage_bucket",
    "storage_path",
    "file_path",
    "signed_url",
    "service_role",
    "raw_text",
    "raw_ocr",
    "pricing",
    "internal_rate"
  ].forEach(function (term) {
    assert.equal(serialized.includes(term), false, "Response must not expose `" + term + "`.");
  });
}

async function testAdminRequired() {
  await withEnv({ OPERON_ADMIN_TOKEN: "admin-token" }, async function () {
    const missing = await endpoint.handler(event("POST", {}));
    assert.equal(missing.statusCode, 401);
    assertSafeBody(parse(missing));

    const wrong = await endpoint.handler(event("POST", { authorization: "Bearer wrong-token" }));
    assert.equal(wrong.statusCode, 403);
    assertSafeBody(parse(wrong));
  });
}

async function testDisabledByDefault() {
  await withEnv({
    OPERON_ADMIN_TOKEN: "admin-token",
    OPERON_FLOORPLAN_CANDIDATES_ENABLED: undefined
  }, async function () {
    const response = await endpoint.handler(event("POST", { authorization: "Bearer admin-token" }, {
      measurement_session_id: "11111111-1111-4111-8111-111111111111"
    }));
    const body = parse(response);
    assert.equal(response.statusCode, 501);
    assert.equal(body.ok, false);
    assert.equal(body.status, "disabled");
    assert.equal(body.candidate_count, 0);
    assert.equal(body.review_required, true);
    assertSafeBody(body);
  });
}

async function testEnabledStillNotImplemented() {
  await withEnv({
    OPERON_ADMIN_TOKEN: "admin-token",
    OPERON_FLOORPLAN_CANDIDATES_ENABLED: "true"
  }, async function () {
    const response = await endpoint.handler(event("POST", { "x-operon-admin-token": "admin-token" }, {
      measurement_session_id: SESSION_ID,
      uploaded_file_id: UPLOAD_ID,
      candidate_method: "hybrid_selector_spike",
      plan_quality: "clean_vector",
      page_number: 1
    }));
    const body = parse(response);
    assert.equal(response.statusCode, 501);
    assert.equal(body.ok, false);
    assert.equal(body.status, "not_implemented");
    assert.equal(body.candidate_count, 0);
    assert.equal(body.review_required, true);
    assertSafeBody(body);
  });
}

async function testEnabledPathRejectsUnsafePayloads() {
  await withEnv({
    OPERON_ADMIN_TOKEN: "admin-token",
    OPERON_FLOORPLAN_CANDIDATES_ENABLED: "true"
  }, async function () {
    const badMethod = await endpoint.handler(event("POST", { authorization: "Bearer admin-token" }, {
      measurement_session_id: SESSION_ID,
      candidate_method: "external_ai"
    }));
    assert.equal(badMethod.statusCode, 400);
    assertSafeBody(parse(badMethod));

    const sensitive = await endpoint.handler(event("POST", { authorization: "Bearer admin-token" }, {
      measurement_session_id: SESSION_ID,
      storage_path: "private/value"
    }));
    assert.equal(sensitive.statusCode, 400);
    assertSafeBody(parse(sensitive));
  });
}

async function testEnabledDryRunReturnsSafeSummaryOnly() {
  const item = corpus[0];
  await withEnv({
    OPERON_ADMIN_TOKEN: "admin-token",
    OPERON_FLOORPLAN_CANDIDATES_ENABLED: "true"
  }, async function () {
    const response = await endpoint.handler(event("POST", { authorization: "Bearer admin-token" }, {
      measurement_session_id: SESSION_ID,
      uploaded_file_id: UPLOAD_ID,
      candidate_method: "hybrid_selector_spike",
      plan_quality: item.plan_quality,
      page_number: 1,
      dry_run: true,
      candidate_payload: Hybrid.hybridSelectorCandidatePayloadForItem(item),
      page_context: {
        page_width: item.reviewed.page_width,
        page_height: item.reviewed.page_height,
        pixels_per_metre: item.reviewed.pixels_per_metre,
        coordinate_space: item.reviewed.coordinate_space
      }
    }));
    const body = parse(response);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.status, "dry_run");
    assert.equal(body.measurement_session_id, SESSION_ID);
    assert.ok(body.candidate_count >= 1);
    assert.equal(body.selected_area_m2, 0);
    assert.ok(body.measured_area_m2 > 0);
    assert.equal(body.review_required, true);
    assert.equal(JSON.stringify(body).includes("sections"), false);
    assert.equal(JSON.stringify(body).includes("points"), false);
    assertSafeBody(body);
  });
}

function testCandidateRequestNormalizer() {
  const normalized = CandidateRequest.normalizeCandidateRequest({
    measurement_session_id: SESSION_ID,
    uploaded_file_id: UPLOAD_ID,
    candidate_method: "manual_seed_assisted",
    plan_quality: "mixed_boundary",
    page_number: 2,
    max_candidates: 12
  });
  assert.equal(normalized.measurement_session_id, SESSION_ID);
  assert.equal(normalized.uploaded_file_id, UPLOAD_ID);
  assert.equal(normalized.candidate_method, "manual_seed_assisted");
  assert.equal(normalized.plan_quality, "mixed_boundary");
  assert.equal(normalized.page_number, 2);
  assert.equal(normalized.max_candidates, 12);
  assert.equal(normalized.review_required, true);

  assert.throws(function () {
    CandidateRequest.normalizeCandidateRequest({ measurement_session_id: "bad" });
  }, /valid measurement session/);
  assert.throws(function () {
    CandidateRequest.normalizeCandidateRequest({
      measurement_session_id: SESSION_ID,
      raw_text: "not allowed"
    });
  }, /unsupported sensitive fields/);
}

async function testOptionsAndMethods() {
  await withEnv({ OPERON_ADMIN_TOKEN: "admin-token" }, async function () {
    const options = await endpoint.handler(event("OPTIONS"));
    assert.equal(options.statusCode, 204);
    assert.ok(options.headers["Access-Control-Allow-Methods"].includes("POST"));

    const get = await endpoint.handler(event("GET", { authorization: "Bearer admin-token" }));
    assert.equal(get.statusCode, 405);
    assertSafeBody(parse(get));
  });
}

Promise.resolve()
  .then(testAdminRequired)
  .then(testDisabledByDefault)
  .then(testEnabledStillNotImplemented)
  .then(testEnabledPathRejectsUnsafePayloads)
  .then(testEnabledDryRunReturnsSafeSummaryOnly)
  .then(testOptionsAndMethods)
  .then(testCandidateRequestNormalizer)
  .then(function () {
    console.log("floorplanDetectionCandidateEndpointContract.test.js passed");
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
