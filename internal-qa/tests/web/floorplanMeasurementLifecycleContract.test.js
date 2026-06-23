"use strict";

const assert = require("assert");

const saveSession = require("../../../netlify/functions/save-floorplan-measurement-session");
const listInternal = require("../../../netlify/functions/list-internal-floorplan-measurements");
const getInternal = require("../../../netlify/functions/get-internal-floorplan-measurement");
const saveDraft = require("../../../netlify/functions/save-floorplan-review-draft");
const approve = require("../../../netlify/functions/approve-floorplan-measurement");
const linkApproved = require("../../../netlify/functions/link-approved-floorplan-measurement");

const SESSION_ID = "11111111-1111-4111-8111-111111111111";
const CUSTOMER_VERSION_ID = "22222222-2222-4222-8222-222222222222";
const REVIEW_VERSION_ID = "33333333-3333-4333-8333-333333333333";
const APPROVED_VERSION_ID = "44444444-4444-4444-8444-444444444444";
const LINK_ID = "55555555-5555-4555-8555-555555555555";

function adminHeaders() {
  return { authorization: "Bearer admin-token", origin: "http://localhost:4180" };
}

function publicPost(body) {
  return {
    httpMethod: "POST",
    headers: { origin: "http://localhost:4180", "x-nf-client-connection-ip": "127.0.0.1" },
    body: JSON.stringify(body || {})
  };
}

function adminPost(body) {
  return {
    httpMethod: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(body || {})
  };
}

function adminGet(query) {
  return {
    httpMethod: "GET",
    headers: adminHeaders(),
    rawQuery: query || ""
  };
}

function measurementPayload(overrides) {
  return Object.assign({
    idempotency_key: "lifecycle-contract",
    source: "floorplan_tool",
    measurement_mode: "manual_trace",
    page_width: 100,
    page_height: 100,
    pixels_per_metre: 10,
    confidence_level: "high",
    client_selected_area_m2: 25,
    sections: [
      {
        client_section_id: "living",
        label: "Living",
        selection_state: "include",
        section_type: "room",
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

function createMemoryStore() {
  return {
    sessions: [],
    versions: [],
    sections: [],
    events: [],
    links: []
  };
}

function decodeBody(options) {
  return JSON.parse(options && options.body || "{}");
}

function queryValue(url, key) {
  const parsed = new URL(String(url));
  return parsed.searchParams.get(key) || "";
}

function valueAfterEq(value) {
  return String(value || "").replace(/^eq\./, "");
}

function response(rows) {
  return {
    ok: true,
    text: async function () {
      return JSON.stringify(rows);
    },
    json: async function () {
      return rows;
    }
  };
}

function routeRestRequest(store, url, options) {
  const method = options && options.method || "GET";
  const textUrl = String(url);
  const body = method === "POST" || method === "PATCH" ? decodeBody(options) : null;

  if (textUrl.includes("/rpc/operon_check_rate_limit")) {
    return response({ allowed: true, remaining: 19, resetAt: Date.now() + 600000 });
  }

  if (textUrl.includes("operon_floorplan_measurement_sessions")) {
    if (method === "POST") {
      const row = Object.assign({
        id: SESSION_ID,
        current_customer_version_id: null,
        current_review_version_id: null,
        approved_version_id: null,
        status: "customer_submitted"
      }, body || {});
      store.sessions.push(row);
      return response([row]);
    }
    if (method === "PATCH") {
      const id = valueAfterEq(queryValue(url, "id"));
      const row = store.sessions.find(function (session) { return session.id === id; });
      Object.assign(row, body || {});
      return response([row]);
    }
    const id = valueAfterEq(queryValue(url, "id"));
    const hash = valueAfterEq(queryValue(url, "idempotency_key_hash"));
    if (id) return response(store.sessions.filter(function (row) { return row.id === id; }));
    if (hash) return response(store.sessions.filter(function (row) { return row.idempotency_key_hash === hash; }));
    return response(store.sessions.slice().reverse());
  }

  if (textUrl.includes("operon_floorplan_measurement_versions")) {
    if (method === "POST") {
      const id = body.version_status === "approved"
        ? APPROVED_VERSION_ID
        : body.version_status === "review_draft"
          ? REVIEW_VERSION_ID
          : CUSTOMER_VERSION_ID;
      const row = Object.assign({ id: id }, body || {});
      store.versions.push(row);
      return response([row]);
    }
    const id = valueAfterEq(queryValue(url, "id"));
    const sessionId = valueAfterEq(queryValue(url, "measurement_session_id"));
    if (queryValue(url, "select") === "version_number") {
      const rows = store.versions
        .filter(function (row) { return row.measurement_session_id === sessionId; })
        .sort(function (a, b) { return Number(b.version_number) - Number(a.version_number); })
        .slice(0, 1)
        .map(function (row) { return { version_number: row.version_number }; });
      return response(rows);
    }
    if (id) return response(store.versions.filter(function (row) { return row.id === id; }));
    return response(store.versions.filter(function (row) { return row.measurement_session_id === sessionId; }));
  }

  if (textUrl.includes("operon_floorplan_measurement_sections")) {
    if (method === "POST") {
      const rows = (Array.isArray(body) ? body : [body]).map(function (row, index) {
        return Object.assign({ id: "66666666-6666-4666-8666-" + String(index + 1).padStart(12, "0") }, row);
      });
      store.sections = store.sections.concat(rows);
      return response(rows);
    }
    const versionId = valueAfterEq(queryValue(url, "measurement_version_id"));
    return response(store.sections.filter(function (row) { return row.measurement_version_id === versionId; }));
  }

  if (textUrl.includes("operon_floorplan_measurement_review_events")) {
    if (method === "POST") {
      const row = Object.assign({ id: "77777777-7777-4777-8777-" + String(store.events.length + 1).padStart(12, "0") }, body || {});
      store.events.push(row);
      return response([row]);
    }
    const sessionId = valueAfterEq(queryValue(url, "measurement_session_id"));
    return response(store.events.filter(function (row) { return row.measurement_session_id === sessionId; }));
  }

  if (textUrl.includes("operon_floorplan_quote_links")) {
    if (method === "POST") {
      const row = Object.assign({ id: LINK_ID }, body || {});
      store.links.push(row);
      return response([row]);
    }
  }

  return response([]);
}

async function withLifecycleFetch(handler) {
  const store = createMemoryStore();
  const previousFetch = global.fetch;
  const previousEnv = {
    OPERON_ADMIN_TOKEN: process.env.OPERON_ADMIN_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
  global.fetch = async function (url, options) {
    return routeRestRequest(store, url, options || {});
  };
  process.env.OPERON_ADMIN_TOKEN = "admin-token";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
  try {
    await handler(store);
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

function bodyOf(response) {
  return JSON.parse(response.body || "{}");
}

function assertNoPrivateFields(payload) {
  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes("storage_bucket"), false);
  assert.equal(serialized.includes("file_path"), false);
  assert.equal(serialized.includes("service-role"), false);
  assert.equal(serialized.includes("pricing"), false);
}

async function testLifecycle() {
  await withLifecycleFetch(async function (store) {
    const saveResponse = await saveSession.handler(publicPost(measurementPayload()));
    assert.equal(saveResponse.statusCode, 200);
    const saved = bodyOf(saveResponse);
    assert.equal(saved.ok, true);
    assert.equal(saved.measurement_session_id, SESSION_ID);
    assert.equal(saved.customer_version_id, CUSTOMER_VERSION_ID);
    assert.equal(saved.selected_area_m2, 25);
    assertNoPrivateFields(saved);

    const listResponse = await listInternal.handler(adminGet(""));
    assert.equal(listResponse.statusCode, 200);
    const listed = bodyOf(listResponse);
    assert.equal(listed.sessions.length, 1);
    assert.equal(listed.sessions[0].id, SESSION_ID);
    assertNoPrivateFields(listed);

    const detailResponse = await getInternal.handler(adminGet("session_id=" + SESSION_ID));
    assert.equal(detailResponse.statusCode, 200);
    const detail = bodyOf(detailResponse);
    assert.equal(detail.session.id, SESSION_ID);
    assert.equal(detail.versions.length, 1);
    assert.equal(detail.versions[0].sections.length, 1);

    const draftResponse = await saveDraft.handler(adminPost(Object.assign(measurementPayload({
      session_id: SESSION_ID,
      parent_version_id: CUSTOMER_VERSION_ID
    }), { client_selected_area_m2: 25 })));
    assert.equal(draftResponse.statusCode, 200);
    const draft = bodyOf(draftResponse);
    assert.equal(draft.review_version_id, REVIEW_VERSION_ID);
    assert.equal(store.sessions[0].status, "review_draft");

    const approveResponse = await approve.handler(adminPost({ session_id: SESSION_ID, version_id: REVIEW_VERSION_ID }));
    assert.equal(approveResponse.statusCode, 200);
    const approved = bodyOf(approveResponse);
    assert.equal(approved.approved_version_id, APPROVED_VERSION_ID);
    assert.equal(store.sessions[0].status, "approved");
    assert.equal(store.sessions[0].review_required, false);

    const linkResponse = await linkApproved.handler(adminPost({ session_id: SESSION_ID }));
    assert.equal(linkResponse.statusCode, 200);
    const linked = bodyOf(linkResponse);
    assert.equal(linked.link_id, LINK_ID);
    assert.equal(linked.status, "linked");
    assert.equal(store.links.length, 1);

    assert.equal(store.events.map(function (event) { return event.event_type; }).join(","), "customer_submitted,review_draft_saved,approved,linked_to_quote_os");
  });
}

testLifecycle()
  .then(function () {
    console.log("floorplanMeasurementLifecycleContract.test.js passed");
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
