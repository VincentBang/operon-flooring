"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const followupAdmin = require("../../../netlify/functions/lead-followup-admin");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const leadId = "11111111-1111-4111-8111-111111111111";
const followUpId = "22222222-2222-4222-8222-222222222222";

function event(method, rawQuery, body, headers) {
  return {
    httpMethod: method,
    rawQuery: rawQuery || "",
    headers: Object.assign({ "x-forwarded-for": "127.0.0.1" }, headers || {}),
    body: typeof body === "string" ? body : JSON.stringify(body || {})
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

function makeResponse(payload, ok) {
  return {
    ok: ok !== false,
    async text() {
      return typeof payload === "string" ? payload : JSON.stringify(payload);
    },
    async json() {
      return payload;
    }
  };
}

function installFetchMock(calls) {
  global.fetch = async function (url, options) {
    calls.push({ url: String(url), options: options || {} });
    const parsed = new URL(String(url));
    const table = parsed.pathname.split("/").pop();

    if (table === "operon_check_rate_limit") {
      return makeResponse({ allowed: true, remaining: 119, resetAt: Date.now() + 600000 });
    }

    if (table === "operon_follow_ups" && (!options || options.method === "GET")) {
      return makeResponse([{
        id: followUpId,
        lead_id: leadId,
        due_at: "2026-06-06T09:00:00.000Z",
        status: "open",
        channel: "phone",
        next_action: "Call customer",
        assigned_to: "operator",
        created_at: "2026-06-06T00:00:00.000Z",
        updated_at: "2026-06-06T00:00:00.000Z",
        metadata: {
          dry_run_only: true,
          task_type: "quote_intent_follow_up",
          reason: "High-confidence quote intent from chatbot.",
          priority: "high",
          suggested_message: "Review manually."
        }
      }]);
    }

    if (table === "operon_chatbot_qualifications") {
      return makeResponse([{
        id: "33333333-3333-4333-8333-333333333333",
        lead_id: leadId,
        event_id: "44444444-4444-4444-8444-444444444444",
        created_at: "2026-06-06T00:00:00.000Z",
        source_page: "/quote.html",
        intent: "start_quote",
        suburb: "Auburn",
        property_type: "house",
        product_category: "not_sure",
        area_status: "unknown",
        stairs_status: "no",
        removal_status: "not_sure",
        floorplan_status: "no",
        existing_quote_status: "no",
        urgency: "asap",
        next_action: "start_quote_form",
        handoff_url: "/quote.html",
        missing_info: ["product_category", "area"],
        confidence: "high"
      }]);
    }

    if (table === "operon_leads") {
      return makeResponse([{
        id: leadId,
        customer_name: "Synthetic Customer",
        primary_source: "quote",
        source_detail: "quote_form",
        status: "New",
        priority: "normal",
        suburb: "Auburn",
        product_category: "hybrid",
        estimate_total_inc_gst: 5000,
        last_activity_at: "2026-06-06T00:00:00.000Z",
        next_action: "Call customer"
      }]);
    }

    if (table === "operon_follow_ups" && options.method === "PATCH") {
      return makeResponse("");
    }

    if (table === "operon_follow_ups" && options.method === "POST") {
      return makeResponse("");
    }

    if (table === "operon_lead_events") {
      return makeResponse("");
    }

    return makeResponse({ error: "Unexpected table " + table }, false);
  };
}

(async function main() {
  const functionSource = fs.readFileSync(path.join(repoRoot, "netlify", "functions", "lead-followup-admin.js"), "utf8");
  [
    "send-quote-email",
    "send-email",
    "send-sms",
    "resend.emails.send",
    "twilio",
    "fetch(\"https://api.resend.com",
    "fetch('https://api.resend.com"
  ].forEach(function (forbidden) {
    assert.strictEqual(
      functionSource.toLowerCase().includes(forbidden.toLowerCase()),
      false,
      "lead-followup-admin must remain dry-run/manual only and must not include `" + forbidden + "`."
    );
  });

  assert.strictEqual(followupAdmin._test.isUuid(leadId), true);
  assert.strictEqual(followupAdmin._test.isUuid("bad"), false);
    assert.strictEqual(followupAdmin._test.sanitizeText(" hello\nthere ", 20), "hello there");
    assert.strictEqual(followupAdmin._test.parseLimit(200), 100);
    const derived = followupAdmin._test.deriveDryRunTask({
      intent: "start_quote",
      confidence: "high",
      product_category: "not_sure",
      area_status: "unknown",
      existing_quote_status: "has_quote",
      floorplan_status: "has_floorplan",
      urgency: "asap"
    });
    assert.strictEqual(derived.priority, "high");
    assert.strictEqual(derived.task_type, "floorplan_review_follow_up");
    assert.ok(derived.reason.includes("High-confidence quote intent"));
    assert.ok(derived.reason.includes("Product category is unknown"));
    assert.ok(derived.reason.includes("Floor area is unknown"));

  await withEnv({
    OPERON_ADMIN_TOKEN: "admin-token",
    SUPABASE_URL: "https://fixture.supabase.test",
    SUPABASE_SERVICE_ROLE_KEY: "fixture-service-key"
  }, async function () {
    const unauthorized = await followupAdmin.handler(event("GET", "status=open", null));
    assert.strictEqual(unauthorized.statusCode, 401);
    assert.strictEqual(parse(unauthorized).error, "Admin authentication required.");

    const calls = [];
    installFetchMock(calls);
    const list = await followupAdmin.handler(event("GET", "status=open", null, { "x-operon-admin-token": "admin-token" }));
    const listPayload = parse(list);
    assert.strictEqual(list.statusCode, 200);
    assert.strictEqual(listPayload.ok, true);
    assert.strictEqual(listPayload.follow_ups.length, 1);
    assert.strictEqual(listPayload.follow_ups[0].lead.customer_name, "Synthetic Customer");
    assert.strictEqual(listPayload.follow_ups[0].metadata.dry_run_only, true);
    assert.strictEqual(listPayload.follow_ups[0].metadata.task_type, "quote_intent_follow_up");

    const generated = await followupAdmin.handler(event("POST", "", {
      action: "generate_dry_run"
    }, { "x-operon-admin-token": "admin-token" }));
    assert.strictEqual(generated.statusCode, 200);
    assert.strictEqual(parse(generated).ok, true);
    assert.ok(calls.some(function (call) {
      return call.url.includes("/operon_chatbot_qualifications");
    }), "chatbot qualification read missing");
    const generatedInsert = calls.find(function (call) {
      return call.url.includes("/operon_follow_ups") && call.options.method === "POST" && Array.isArray(JSON.parse(call.options.body || "[]"));
    });
    assert.ok(generatedInsert, "dry-run follow-up insert missing");
    const generatedBody = JSON.parse(generatedInsert.options.body);
    assert.strictEqual(generatedBody[0].channel, "manual");
    assert.strictEqual(generatedBody[0].metadata.dry_run_only, true);
    assert.strictEqual(generatedBody[0].metadata.priority, "high");

    const done = await followupAdmin.handler(event("POST", "", {
      action: "mark_done",
      follow_up_id: followUpId,
      lead_id: leadId
    }, { "x-operon-admin-token": "admin-token" }));
    assert.strictEqual(done.statusCode, 200);
    assert.strictEqual(parse(done).ok, true);
    assert.ok(calls.some(function (call) { return call.url.includes("/operon_lead_events"); }), "follow-up event insert missing");

    const archived = await followupAdmin.handler(event("POST", "", {
      action: "archive",
      follow_up_id: followUpId,
      lead_id: leadId
    }, { "x-operon-admin-token": "admin-token" }));
    assert.strictEqual(archived.statusCode, 200);
    assert.strictEqual(parse(archived).ok, true);

    const serialized = JSON.stringify(listPayload);
    [
      "service_role",
      "storage_bucket",
      "file_path",
      "signed_url",
      "raw_ocr",
      "send-email",
      "send-sms"
    ].forEach(function (term) {
      assert.strictEqual(serialized.includes(term), false, "follow-up response leaked or implied side effect: " + term);
    });
  });

  console.log("leadFollowupAdminContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
