"use strict";

const assert = require("assert");

const saveDraft = require("../../../netlify/functions/save-floorplan-review-draft");
const approve = require("../../../netlify/functions/approve-floorplan-measurement");
const linkApproved = require("../../../netlify/functions/link-approved-floorplan-measurement");
const streamDocument = require("../../../netlify/functions/stream-internal-floorplan-document");

const SESSION_ID = "11111111-1111-4111-8111-111111111111";
const CUSTOMER_VERSION_ID = "22222222-2222-4222-8222-222222222222";
const REVIEW_VERSION_ID = "33333333-3333-4333-8333-333333333333";
const APPROVED_VERSION_ID = "44444444-4444-4444-8444-444444444444";
const SECTION_ID = "55555555-5555-4555-8555-555555555555";
const EVENT_ID = "66666666-6666-4666-8666-666666666666";
const LINK_ID = "77777777-7777-4777-8777-777777777777";
const UPLOAD_ID = "88888888-8888-4888-8888-888888888888";

function adminHeaders() {
  return {
    authorization: "Bearer admin-token",
    origin: "http://localhost:4180"
  };
}

function postEvent(body, headers) {
  return {
    httpMethod: "POST",
    headers: headers || adminHeaders(),
    body: JSON.stringify(body || {})
  };
}

function getEvent(rawQuery, headers) {
  return {
    httpMethod: "GET",
    headers: headers || adminHeaders(),
    rawQuery: rawQuery || ""
  };
}

function reviewPayload(overrides) {
  return Object.assign({
    session_id: SESSION_ID,
    parent_version_id: CUSTOMER_VERSION_ID,
    page_width: 100,
    page_height: 100,
    pixels_per_metre: 10,
    confidence_level: "high",
    sections: [
      {
        client_section_id: "living",
        label: "Living",
        section_type: "room",
        selection_state: "include",
        confidence: "high",
        points: [
          { x: 0, y: 0 },
          { x: 0.5, y: 0 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 0.5 }
        ],
        coordinate_space: "normalized_page"
      }
    ]
  }, overrides || {});
}

function responseRowFor(url, options) {
  const method = options && options.method || "GET";
  const textUrl = String(url);

  if (textUrl.includes("operon_floorplan_measurement_sessions")) {
    if (method === "PATCH") return [{ id: SESSION_ID, status: "review_draft" }];
    return [{
      id: SESSION_ID,
      status: "customer_submitted",
      current_customer_version_id: CUSTOMER_VERSION_ID,
      current_review_version_id: null,
      approved_version_id: APPROVED_VERSION_ID,
      quote_request_id: null,
      lead_id: null
    }];
  }
  if (textUrl.includes("operon_floorplan_measurement_versions")) {
    if (method === "POST") {
      const body = JSON.parse(options.body || "{}");
      return [{
        id: body.version_status === "approved" ? APPROVED_VERSION_ID : REVIEW_VERSION_ID,
        measurement_session_id: SESSION_ID,
        selected_area_m2: body.selected_area_m2 || 25,
        measured_area_m2: body.measured_area_m2 || 25,
        adjusted_area_m2: body.adjusted_area_m2 || 25,
        confidence_level: body.confidence_level || "high",
        version_number: body.version_number,
        version_status: body.version_status
      }];
    }
    if (textUrl.includes("select=version_number")) return [{ version_number: 1 }];
    if (textUrl.includes(APPROVED_VERSION_ID)) {
      return [{
        id: APPROVED_VERSION_ID,
        measurement_session_id: SESSION_ID,
        page_width: 100,
        page_height: 100,
        pixels_per_metre: 10,
        selected_area_m2: 25,
        measured_area_m2: 25,
        adjusted_area_m2: 25,
        confidence_level: "high",
        review_required: false,
        metadata: {}
      }];
    }
    return [{
      id: REVIEW_VERSION_ID,
      measurement_session_id: SESSION_ID,
      page_width: 100,
      page_height: 100,
      pixels_per_metre: 10,
      selected_area_m2: 99,
      measured_area_m2: 99,
      adjusted_area_m2: 99,
      confidence_level: "high",
      review_required: true,
      metadata: {}
    }];
  }
  if (textUrl.includes("operon_floorplan_measurement_sections")) {
    if (method === "POST") return [{ id: SECTION_ID }];
    return [{
      id: SECTION_ID,
      measurement_version_id: REVIEW_VERSION_ID,
      client_section_id: "living",
      section_order: 1,
      label: "Living",
      section_type: "room",
      selection_state: "include",
      geometry_json: {
        type: "Polygon",
        coordinate_space: "normalized_page",
        points: [
          { x: 0, y: 0 },
          { x: 0.5, y: 0 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 0.5 }
        ]
      },
      area_m2: 25,
      confidence_level: "high",
      reviewer_notes: null,
      metadata: {}
    }];
  }
  if (textUrl.includes("operon_floorplan_measurement_review_events")) {
    return [{ id: EVENT_ID }];
  }
  if (textUrl.includes("operon_floorplan_quote_links")) {
    return [{
      id: LINK_ID,
      measurement_session_id: SESSION_ID,
      quote_request_id: null,
      approved_area_m2: 25
    }];
  }
  if (textUrl.includes("operon_uploaded_files")) {
    return [{
      id: UPLOAD_ID,
      file_name: "floorplan.pdf",
      file_type: "application/pdf",
      file_size_bytes: 128,
      storage_bucket: "quote-files",
      file_path: "floorplans/private-file.pdf"
    }];
  }
  return [];
}

async function withMockedEnvAndFetch(handler) {
  const previousFetch = global.fetch;
  const previousEnv = {
    OPERON_ADMIN_TOKEN: process.env.OPERON_ADMIN_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
  const calls = [];
  global.fetch = async function (url, options) {
    calls.push({ url: String(url), method: options && options.method || "GET" });
    if (String(url).includes("/storage/v1/object/")) {
      return {
        ok: true,
        arrayBuffer: async function () {
          return Buffer.from("private pdf bytes");
        }
      };
    }
    return {
      ok: true,
      text: async function () {
        return JSON.stringify(responseRowFor(url, options || {}));
      }
    };
  };
  process.env.OPERON_ADMIN_TOKEN = "admin-token";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
  try {
    await handler(calls);
  } finally {
    global.fetch = previousFetch;
    Object.keys(previousEnv).forEach(function (key) {
      if (typeof previousEnv[key] === "undefined") {
        delete process.env[key];
      } else {
        process.env[key] = previousEnv[key];
      }
    });
  }
}

function assertSafeJsonResponse(response) {
  const body = JSON.parse(response.body || "{}");
  const serialized = JSON.stringify(body);
  assert.equal(serialized.includes("storage_bucket"), false);
  assert.equal(serialized.includes("file_path"), false);
  assert.equal(serialized.includes("service-role"), false);
  assert.equal(serialized.includes("pricing"), false);
  return body;
}

async function testAdminRequired() {
  await withMockedEnvAndFetch(async function () {
    assert.equal((await saveDraft.handler(postEvent(reviewPayload(), {}))).statusCode, 401);
    assert.equal((await approve.handler(postEvent({ session_id: SESSION_ID, version_id: REVIEW_VERSION_ID }, {}))).statusCode, 401);
    assert.equal((await linkApproved.handler(postEvent({ session_id: SESSION_ID }, {}))).statusCode, 401);
    assert.equal((await streamDocument.handler(getEvent("uploaded_file_id=" + UPLOAD_ID, {}))).statusCode, 401);
  });
}

async function testReviewDraftSafeResponse() {
  await withMockedEnvAndFetch(async function () {
    const response = await saveDraft.handler(postEvent(reviewPayload()));
    assert.equal(response.statusCode, 200);
    const body = assertSafeJsonResponse(response);
    assert.equal(body.ok, true);
    assert.equal(body.status, "review_draft");
    assert.equal(body.measurement_session_id, SESSION_ID);
    assert.equal(body.review_version_id, REVIEW_VERSION_ID);
  });
}

async function testApproveSafeResponse() {
  await withMockedEnvAndFetch(async function () {
    const response = await approve.handler(postEvent({ session_id: SESSION_ID, version_id: REVIEW_VERSION_ID }));
    assert.equal(response.statusCode, 200);
    const body = assertSafeJsonResponse(response);
    assert.equal(body.ok, true);
    assert.equal(body.status, "approved");
    assert.equal(body.approved_version_id, APPROVED_VERSION_ID);
    assert.equal(body.approved_area_m2, 25, "Approval must recalculate area from geometry instead of copying stale stored totals.");
  });
}

async function testLinkSafeResponse() {
  await withMockedEnvAndFetch(async function () {
    const response = await linkApproved.handler(postEvent({ session_id: SESSION_ID }));
    assert.equal(response.statusCode, 200);
    const body = assertSafeJsonResponse(response);
    assert.equal(body.ok, true);
    assert.equal(body.status, "linked");
    assert.equal(body.link_id, LINK_ID);
    assert.equal(body.approved_area_m2, 25);
  });
}

async function testStreamPrivateDocumentDoesNotExposeStorageJson() {
  await withMockedEnvAndFetch(async function () {
    const response = await streamDocument.handler(getEvent("uploaded_file_id=" + UPLOAD_ID));
    assert.equal(response.statusCode, 200);
    assert.equal(response.isBase64Encoded, true);
    assert.equal(response.headers["Content-Type"], "application/pdf");
    assert.equal(String(response.body).includes("quote-files"), false);
    assert.equal(String(response.body).includes("floorplans/private-file.pdf"), false);
  });
}

Promise.resolve()
  .then(testAdminRequired)
  .then(testReviewDraftSafeResponse)
  .then(testApproveSafeResponse)
  .then(testLinkSafeResponse)
  .then(testStreamPrivateDocumentDoesNotExposeStorageJson)
  .then(function () {
    console.log("floorplanInternalAdminFunctionsContract.test.js passed");
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
