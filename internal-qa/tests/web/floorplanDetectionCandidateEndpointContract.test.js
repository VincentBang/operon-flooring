"use strict";

const assert = require("assert");

const endpoint = require("../../../netlify/functions/admin-floorplan-detection-candidates");

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
    const response = await endpoint.handler(event("POST", { "x-operon-admin-token": "admin-token" }));
    const body = parse(response);
    assert.equal(response.statusCode, 501);
    assert.equal(body.ok, false);
    assert.equal(body.status, "not_implemented");
    assert.equal(body.candidate_count, 0);
    assert.equal(body.review_required, true);
    assertSafeBody(body);
  });
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
  .then(testOptionsAndMethods)
  .then(function () {
    console.log("floorplanDetectionCandidateEndpointContract.test.js passed");
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
