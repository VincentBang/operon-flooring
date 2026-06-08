"use strict";

const assert = require("assert");
const statusAdmin = require("../../../netlify/functions/lead-status-admin");

const validLeadId = "11111111-1111-4111-8111-111111111111";

function event(body, headers, method) {
  return {
    httpMethod: method || "POST",
    headers: Object.assign({ "x-forwarded-for": "127.0.0.1" }, headers || {}),
    body: typeof body === "string" ? body : JSON.stringify(body || {}),
    rawQuery: ""
  };
}

function parse(response) {
  return JSON.parse(response.body || "{}");
}

async function withEnv(values, callback) {
  const previous = {};
  Object.keys(values).forEach(function (key) {
    previous[key] = process.env[key];
    if (values[key] === null) delete process.env[key];
    else process.env[key] = values[key];
  });
  try {
    await callback();
  } finally {
    Object.keys(values).forEach(function (key) {
      if (typeof previous[key] === "undefined") delete process.env[key];
      else process.env[key] = previous[key];
    });
  }
}

function installFetchMock(calls) {
  global.fetch = async function (url, options) {
    calls.push({ url: String(url), options: options || {} });
    const parsed = new URL(String(url));
    const table = parsed.pathname.split("/").pop();

    if (table === "operon_check_rate_limit") {
      return {
        ok: true,
        async json() {
          return { allowed: true, remaining: 119, resetAt: Date.now() + 600000 };
        },
        async text() {
          return JSON.stringify({ allowed: true, remaining: 119, resetAt: Date.now() + 600000 });
        }
      };
    }

    if (table === "operon_leads" && (!options || options.method === "GET")) {
      return {
        ok: true,
        async text() {
          return JSON.stringify([{ id: validLeadId, status: "New" }]);
        }
      };
    }

    if (table === "operon_leads" && options.method === "PATCH") {
      return {
        ok: true,
        async text() {
          return JSON.stringify([{ id: validLeadId, status: "Needs review", last_activity_at: "2026-06-06T00:00:00.000Z" }]);
        }
      };
    }

    if (table === "operon_lead_status_history" || table === "operon_lead_events") {
      return {
        ok: true,
        async text() {
          return "";
        }
      };
    }

    return {
      ok: false,
      async text() {
        return JSON.stringify({ error: "Unexpected table " + table });
      }
    };
  };
}

(async function main() {
  assert.deepStrictEqual(statusAdmin._test.STATUS_OPTIONS, [
    "New",
    "Needs review",
    "Waiting customer",
    "Quote sent",
    "Site measure booked",
    "Won",
    "Lost",
    "Archived"
  ]);
  assert.strictEqual(statusAdmin._test.sanitizeReason("  too   many\nspaces  "), "too many spaces");
  assert.strictEqual(statusAdmin._test.validatePayload({ lead_id: validLeadId, status: "Needs review" }).ok, true);
  assert.strictEqual(statusAdmin._test.validatePayload({ lead_id: "bad", status: "Needs review" }).error, "A valid lead_id is required.");
  assert.strictEqual(statusAdmin._test.validatePayload({ lead_id: validLeadId, status: "Missing info" }).error, "A valid lead status is required.");

  await withEnv({
    OPERON_ADMIN_TOKEN: "admin-token",
    SUPABASE_URL: "https://fixture.supabase.test",
    SUPABASE_SERVICE_ROLE_KEY: "fixture-service-key"
  }, async function () {
    const unauthorized = await statusAdmin.handler(event({ lead_id: validLeadId, status: "Needs review" }));
    assert.strictEqual(unauthorized.statusCode, 401);
    assert.strictEqual(parse(unauthorized).error, "Admin authentication required.");

    const method = await statusAdmin.handler(event({}, { "x-operon-admin-token": "admin-token" }, "GET"));
    assert.strictEqual(method.statusCode, 405);

    const invalidJson = await statusAdmin.handler(event("{", { "x-operon-admin-token": "admin-token" }));
    assert.strictEqual(invalidJson.statusCode, 400);
    assert.strictEqual(parse(invalidJson).error, "Invalid JSON payload.");

    const calls = [];
    installFetchMock(calls);
    const response = await statusAdmin.handler(event({
      lead_id: validLeadId,
      status: "Needs review",
      reason: "Missing stairs and disposal details"
    }, { "x-operon-admin-token": "admin-token" }));
    const payload = parse(response);
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(payload.ok, true);
    assert.strictEqual(payload.lead.status, "Needs review");
    assert.ok(calls.some(function (call) { return call.url.includes("/operon_lead_status_history"); }), "status history insert missing");
    assert.ok(calls.some(function (call) { return call.url.includes("/operon_lead_events"); }), "lead event insert missing");
    const serialized = JSON.stringify(payload);
    ["service_role", "storage_bucket", "file_path", "raw_ocr", "internal_rate"].forEach(function (term) {
      assert.strictEqual(serialized.includes(term), false, "status response leaked " + term);
    });
  });

  console.log("leadStatusAdminContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
