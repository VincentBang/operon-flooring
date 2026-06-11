"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const componentPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminChatbotLeads.tsx");
const authPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminAuthShell.tsx");
const dashboard = require("../../../netlify/functions/lead-dashboard.js");

function event(method, query, headers) {
  return {
    httpMethod: method,
    rawQuery: query || "",
    headers: Object.assign({ "x-forwarded-for": "127.0.0.44" }, headers || {}),
    body: ""
  };
}

function parseBody(response) {
  return JSON.parse(response.body || "{}");
}

async function withEnv(values, fn) {
  const previous = {};
  Object.keys(values).forEach(function (key) {
    previous[key] = process.env[key];
    if (values[key] === null) delete process.env[key];
    else process.env[key] = values[key];
  });
  try {
    await fn();
  } finally {
    Object.keys(values).forEach(function (key) {
      if (typeof previous[key] === "undefined") delete process.env[key];
      else process.env[key] = previous[key];
    });
  }
}

function installFetchMock() {
  const calls = [];
  const originalFetch = global.fetch;
  const qualificationId = "11111111-1111-4111-8111-111111111111";
  const leadId = "22222222-2222-4222-8222-222222222222";
  const eventId = "33333333-3333-4333-8333-333333333333";

  global.fetch = async function (url, options) {
    const target = String(url);
    calls.push({ url: target, method: options && options.method || "GET" });

    if (target.includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () {
          return { allowed: true, remaining: 100, resetAt: Date.now() + 60000 };
        }
      };
    }

    if (target.includes("/rest/v1/operon_chatbot_qualifications")) {
      const row = {
        id: qualificationId,
        lead_id: leadId,
        event_id: eventId,
        created_at: "2026-06-11T01:00:00.000Z",
        chatbot_session_id: "session-safe",
        source_page: "/products.html",
        source_url: "https://operonflooring.com.au/products.html",
        intent: "start_quote",
        suburb: "Auburn",
        property_type: "house",
        product_category: "hybrid",
        area_status: "known",
        approx_area_m2: 60,
        stairs_status: "no",
        removal_status: "not_sure",
        floorplan_status: "no",
        existing_quote_status: "no",
        urgency: "soon",
        next_action: "start_quote_form",
        handoff_url: "/quote.html?source=chatbot",
        missing_info: ["exact_range", "removal_scope"],
        confidence: "high"
      };
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([row]);
        }
      };
    }

    if (target.includes("/rest/v1/operon_leads")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{
            id: leadId,
            created_at: "2026-06-11T01:00:00.000Z",
            updated_at: "2026-06-11T01:00:00.000Z",
            last_activity_at: "2026-06-11T01:00:00.000Z",
            primary_source: "chatbot",
            source_detail: "qualification",
            status: "new",
            priority: "medium",
            customer_name: null,
            email: null,
            phone: null,
            suburb: "Auburn",
            postcode: null,
            product_category: "hybrid",
            product_name: null,
            area_m2: 60,
            estimated_order_area_m2: null,
            estimate_total_inc_gst: null,
            confidence_score: null,
            confidence_level: "high",
            missing_info_flags: ["exact_range"],
            risk_flags: [],
            quote_review_status: "none",
            floorplan_status: "none",
            contact_status: "none",
            follow_up_status: "pending",
            next_action: "start_quote_form"
          }]);
        }
      };
    }

    if (target.includes("/rest/v1/operon_lead_events")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{
            id: eventId,
            created_at: "2026-06-11T01:01:00.000Z",
            event_type: "chatbot_qualified",
            source: "chatbot",
            source_table: "operon_chatbot_qualifications",
            source_id: qualificationId,
            customer_safe: true,
            metadata: {
              intent: "start_quote",
              source_page: "/products.html",
              handoff_url: "/quote.html?source=chatbot",
              next_action: "start_quote_form",
              raw_transcript: "do not expose",
              raw_quote_text: "do not expose",
              extracted_text: "do not expose",
              storage_bucket: "quote-files",
              file_path: "private/path.pdf",
              supplier_cost: "do not expose",
              gross_margin: "do not expose",
              pricingRules: "do not expose"
            }
          }]);
        }
      };
    }

    throw new Error("Unexpected fetch URL in test: " + target);
  };

  return {
    calls,
    ids: { qualificationId, leadId, eventId },
    restore: function () {
      global.fetch = originalFetch;
    }
  };
}

async function testRuntimeContract() {
  const mock = installFetchMock();
  await withEnv({
    OPERON_ADMIN_TOKEN: "local-admin-token",
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-test-key"
  }, async function () {
    const denied = await dashboard.handler(event("GET", "action=chatbot-list"));
    assert.strictEqual(denied.statusCode, 401, "chatbot list must deny public requests");
    assert.strictEqual(parseBody(denied).error, "Admin authentication required.");

    const list = await dashboard.handler(event("GET", "action=chatbot-list&limit=25&intent=start_quote", {
      authorization: "Bearer local-admin-token"
    }));
    assert.strictEqual(list.statusCode, 200);
    const listBody = parseBody(list);
    assert.strictEqual(listBody.ok, true);
    assert.strictEqual(listBody.chatbot_qualifications.length, 1);
    assert.strictEqual(listBody.chatbot_qualifications[0].intent, "start_quote");
    assert.strictEqual(listBody.chatbot_qualifications[0].source_page, "/products.html");

    const detail = await dashboard.handler(event("GET", "action=chatbot-detail&qualification_id=" + mock.ids.qualificationId, {
      authorization: "Bearer local-admin-token"
    }));
    assert.strictEqual(detail.statusCode, 200);
    const detailText = detail.body || "";
    const detailBody = JSON.parse(detailText);
    assert.strictEqual(detailBody.ok, true);
    assert.strictEqual(detailBody.qualification.id, mock.ids.qualificationId);
    assert.strictEqual(detailBody.lead.id, mock.ids.leadId);
    assert.strictEqual(detailBody.events.length, 1);
    assert.strictEqual(detailBody.events[0].metadata.intent, "start_quote");
    assert.strictEqual(detailBody.events[0].metadata.source_page, "/products.html");

    [
      "raw_transcript",
      "raw_quote_text",
      "extracted_text",
      "storage_bucket",
      "file_path",
      "supplier_cost",
      "gross_margin",
      "pricingRules",
      "do not expose",
      "private/path.pdf"
    ].forEach(function (term) {
      assert.strictEqual(detailText.includes(term), false, "chatbot detail response leaked `" + term + "`.");
    });
  });
  mock.restore();
}

function testClientContract() {
  const source = fs.readFileSync(componentPath, "utf8");
  const authSource = fs.readFileSync(authPath, "utf8");

  [
    "\"use client\"",
    "action: \"chatbot-list\"",
    "action=chatbot-detail",
    "Authorization: `Bearer ${adminToken}`",
    "cache: \"no-store\"",
    "Latest chatbot-qualified events",
    "FilterSelect",
    "intent",
    "confidence",
    "next_action",
    "source_page",
    "Event timeline",
    "Follow-up recommendation"
  ].forEach(function (term) {
    assert.ok(source.includes(term), "Admin chatbot lead client missing `" + term + "`.");
  });

  assert.ok(authSource.includes("AdminChatbotLeads"), "Admin auth shell must render the chatbot lead panel only after admin verification.");
  assert.ok(authSource.includes("verifiedToken"), "Admin chatbot panel must receive the verified admin token.");

  [
    "localStorage",
    "sessionStorage",
    "createClient",
    "service_role",
    "storage_bucket",
    "file_path",
    "signed_url",
    "raw_ocr",
    "extracted_text",
    "raw_quote_text",
    "raw_transcript",
    "supplier_cost",
    "gross_margin",
    "internal_rate",
    "pricingRules",
    "installRates",
    "removalRates"
  ].forEach(function (term) {
    assert.strictEqual(source.includes(term), false, "Admin chatbot lead client must not include `" + term + "`.");
  });
}

async function main() {
  await testRuntimeContract();
  testClientContract();
  console.log("adminChatbotLeadsContract.test.js passed");
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
