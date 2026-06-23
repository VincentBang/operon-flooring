"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const Geometry = require("../../../netlify/functions/shared/floorplanGeometry");
const saveSession = require("../../../netlify/functions/save-floorplan-measurement-session");
const listInternal = require("../../../netlify/functions/list-internal-floorplan-measurements");
const getInternal = require("../../../netlify/functions/get-internal-floorplan-measurement");

function validPayload(overrides) {
  return Object.assign({
    idempotency_key: "phase2-test-key",
    source: "floorplan_tool",
    measurement_mode: "manual_trace",
    page_width: 100,
    page_height: 100,
    pixels_per_metre: 10,
    client_selected_area_m2: 25,
    confidence_level: "high",
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

function makeEvent(body, headers) {
  return {
    httpMethod: "POST",
    headers: Object.assign({ origin: "http://localhost:4180" }, headers || {}),
    body: JSON.stringify(body || {})
  };
}

async function withMockedFetch(handler) {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async function (url, options) {
    calls.push({ url: String(url), options: options || {} });
    if (String(url).includes("operon_check_rate_limit")) {
      return { ok: false, text: async () => "" };
    }
    if (String(url).includes("operon_floorplan_measurement_sessions") && options && options.method === "POST") {
      return { ok: true, text: async () => JSON.stringify([{ id: "11111111-1111-4111-8111-111111111111" }]) };
    }
    if (String(url).includes("operon_floorplan_measurement_versions") && options && options.method === "POST") {
      return { ok: true, text: async () => JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222", selected_area_m2: 25 }]) };
    }
    if (String(url).includes("operon_floorplan_measurement_sections") && options && options.method === "POST") {
      return { ok: true, text: async () => JSON.stringify([{ id: "33333333-3333-4333-8333-333333333333" }]) };
    }
    if (String(url).includes("operon_floorplan_measurement_review_events") && options && options.method === "POST") {
      return { ok: true, text: async () => JSON.stringify([{ id: "44444444-4444-4444-8444-444444444444" }]) };
    }
    return { ok: true, text: async () => JSON.stringify([]) };
  };
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  process.env.OPERON_ADMIN_TOKEN = "test-admin-token";
  try {
    await handler(calls);
  } finally {
    global.fetch = originalFetch;
  }
}

(function testGeometryRecalculatesArea() {
  const result = Geometry.validateMeasurementPayload(validPayload());
  assert.equal(result.selected_area_m2, 25, "Server geometry should calculate selected area from normalized coordinates.");
  assert.equal(result.sections[0].area_m2, 25, "Section area should be calculated server-side.");
})();

(function testGeometryRejectsSensitiveFields() {
  assert.throws(function () {
    Geometry.validateMeasurementPayload(validPayload({ supplier_cost: 12 }));
  }, /unsupported sensitive fields/i);
  assert.throws(function () {
    Geometry.validateMeasurementPayload(validPayload({ sections: [{ label: "Bad", points: [{ x: 0, y: 0 }, { x: 1, y: 1 }], storage_path: "quote-files/raw" }] }));
  }, /unsupported sensitive fields/i);
})();

(function testGeometryRejectsSelfIntersection() {
  assert.throws(function () {
    Geometry.validateMeasurementPayload(validPayload({
      sections: [
        {
          label: "Bow tie",
          points: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 }
          ]
        }
      ]
    }));
  }, /intersects itself/i);
})();

async function testPublicFunctionSafeResponse() {
  await withMockedFetch(async function () {
    const response = await saveSession.handler(makeEvent(validPayload()));
    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.ok, true);
    assert.equal(body.measurement_session_id, "11111111-1111-4111-8111-111111111111");
    assert.equal(Object.prototype.hasOwnProperty.call(body, "storage_bucket"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "file_path"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "pricing"), false);
  });
}

async function testAdminFunctionsRequireAuth() {
  const listResponse = await listInternal.handler({ httpMethod: "GET", headers: {}, rawQuery: "" });
  assert.equal(listResponse.statusCode, 401);
  const detailResponse = await getInternal.handler({
    httpMethod: "GET",
    headers: {},
    rawQuery: "session_id=11111111-1111-4111-8111-111111111111"
  });
  assert.equal(detailResponse.statusCode, 401);
}

(function testInternalRouteNoindexAndSitemapGuard() {
  const routePath = path.join(repoRoot, "apps/web-tsx/src/app/internal/floorplan-measurements/page.tsx");
  const source = fs.readFileSync(routePath, "utf8");
  assert.ok(source.includes('robots: "noindex,nofollow"'), "Internal floorplan route must be noindex,nofollow.");
  const sitemapPath = path.join(repoRoot, "apps/web-tsx/public/sitemap.xml");
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  assert.equal(sitemap.includes("floorplan-measurements"), false, "Internal floorplan route must not appear in sitemap.");
})();

Promise.resolve()
  .then(testPublicFunctionSafeResponse)
  .then(testAdminFunctionsRequireAuth)
  .then(function () {
    console.log("floorplanMeasurementPhase2Contract.test.js passed");
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
