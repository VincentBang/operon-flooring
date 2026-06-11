const assert = require("assert");
const fs = require("fs");
const path = require("path");

const saveChatbotLeadEvent = require("../../../netlify/functions/save-chatbot-lead-event.js");

const repoRoot = path.resolve(__dirname, "../../..");

function setEnv(key, value, originals) {
  originals[key] = process.env[key];
  process.env[key] = value;
}

function restoreEnv(originals) {
  Object.keys(originals).forEach(function (key) {
    if (typeof originals[key] === "undefined") {
      delete process.env[key];
    } else {
      process.env[key] = originals[key];
    }
  });
}

function basePayload(overrides) {
  return Object.assign({
    event_type: "chatbot_qualified",
    chatbot_session_id: "chat_m3abc123456789",
    source_page: "/products.html",
    source_url: "https://operonflooring.com.au/products.html",
    intent: "start_quote",
    suburb: "Parramatta",
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
    handoff_url: "/quote.html?source=chatbot&category=hybrid#quoteForm",
    missing_info: ["removal detail unclear"],
    confidence: "medium",
    device_type: "mobile",
    page_key: "products",
    timestamp: "2026-06-11T10:00:00.000Z"
  }, overrides || {});
}

function runRequest(payload, extra) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return saveChatbotLeadEvent.handler(Object.assign({
    httpMethod: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://operonflooring.com.au",
      "x-forwarded-for": "203.0.113.10"
    },
    body: body
  }, extra || {}));
}

async function testValidPayloadWritesSafeLeadEventAndQualification() {
  const originalFetch = global.fetch;
  const originals = {};
  const requests = [];

  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);

  global.fetch = async function (url, options) {
    requests.push({
      url: String(url),
      method: options && options.method || "GET",
      body: options && options.body ? JSON.parse(options.body) : null
    });

    if (String(url).includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () {
          return { allowed: true, remaining: 12, resetAt: Date.now() + 600000 };
        },
        text: async function () { return JSON.stringify({ allowed: true }); }
      };
    }
    if (String(url).includes("/rest/v1/operon_leads")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{ id: "11111111-1111-4111-8111-111111111111" }]);
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_lead_events")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222" }]);
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_chatbot_qualifications")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{ id: "33333333-3333-4333-8333-333333333333" }]);
        }
      };
    }
    throw new Error("Unexpected fetch URL: " + url);
  };

  try {
    const response = await runRequest(basePayload());
    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.lead_id, "11111111-1111-4111-8111-111111111111");
    assert.equal(body.event_id, "22222222-2222-4222-8222-222222222222");
    assert.equal(body.next_action, "start_quote_form");

    const leadPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_leads");
    });
    assert(leadPost, "expected operon_leads insert");
    assert.equal(leadPost.body.primary_source, "chatbot");
    assert.equal(leadPost.body.source_detail, "quote_prequalification");
    assert.equal(leadPost.body.status, "Waiting customer");
    assert.equal(leadPost.body.suburb, "Parramatta");
    assert.equal(leadPost.body.product_category, "hybrid");
    assert.equal(leadPost.body.area_m2, 60);
    assert.equal(JSON.stringify(leadPost.body).includes("storage_bucket"), false);
    assert.equal(JSON.stringify(leadPost.body).includes("file_path"), false);
    assert.equal(JSON.stringify(leadPost.body).includes("supplier_cost"), false);

    const eventPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_events");
    });
    assert(eventPost, "expected operon_lead_events insert");
    assert.equal(eventPost.body.event_type, "chatbot_qualified");
    assert.equal(eventPost.body.source, "save-chatbot-lead-event");
    assert.equal(eventPost.body.customer_safe, true);

    const qualificationPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_chatbot_qualifications");
    });
    assert(qualificationPost, "expected operon_chatbot_qualifications insert");
    assert.equal(qualificationPost.body.intent, "start_quote");
    assert.equal(qualificationPost.body.event_id, "22222222-2222-4222-8222-222222222222");
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function expectRejected(payload, expectedStatus, message) {
  const response = await runRequest(payload);
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, expectedStatus, message);
  assert.equal(body.ok, false, message);
}

async function testInvalidPayloadsRejectBeforeWrite() {
  await expectRejected(basePayload({ intent: "estimate_exact_price" }), 400, "bad enum should reject");
  await expectRejected(basePayload({ pricing_rules: { installRate: 12 } }), 400, "pricing fields should reject");
  await expectRejected(basePayload({ transcript: [{ role: "user", text: "hello" }] }), 400, "raw transcript should reject");
  await expectRejected(basePayload({ raw_quote_text: "Quote total is $3850 inc GST" }), 400, "raw quote text should reject");
  await expectRejected(basePayload({ ocr_text: "extracted quote text" }), 400, "OCR text should reject");
  await expectRejected(basePayload({ handoff_url: "/quote.html?email=test@example.com" }), 400, "URL PII should reject");

  const oversized = JSON.stringify(basePayload({ missing_info: ["x".repeat(30 * 1024)] }));
  await expectRejected(oversized, 413, "oversized payload should reject");
}

async function testNoPiiRequired() {
  const originalFetch = global.fetch;
  const originals = {};
  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);

  global.fetch = async function (url) {
    if (String(url).includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () { return { allowed: true }; },
        text: async function () { return JSON.stringify({ allowed: true }); }
      };
    }
    if (String(url).includes("/operon_leads")) {
      return { ok: true, text: async function () { return JSON.stringify([{ id: "11111111-1111-4111-8111-111111111111" }]); } };
    }
    if (String(url).includes("/operon_lead_events")) {
      return { ok: true, text: async function () { return JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222" }]); } };
    }
    if (String(url).includes("/operon_chatbot_qualifications")) {
      return { ok: true, text: async function () { return JSON.stringify([{ id: "33333333-3333-4333-8333-333333333333" }]); } };
    }
    throw new Error("Unexpected fetch URL: " + url);
  };

  try {
    const response = await runRequest(basePayload({ suburb: "", approx_area_m2: null }));
    assert.equal(response.statusCode, 200);
    assert.equal(JSON.parse(response.body).ok, true);
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function testQualificationTableRolloutIsNonBlocking() {
  const originalFetch = global.fetch;
  const originals = {};
  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);

  global.fetch = async function (url) {
    if (String(url).includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () { return { allowed: true }; },
        text: async function () { return JSON.stringify({ allowed: true }); }
      };
    }
    if (String(url).includes("/operon_leads")) {
      return { ok: true, text: async function () { return JSON.stringify([{ id: "11111111-1111-4111-8111-111111111111" }]); } };
    }
    if (String(url).includes("/operon_lead_events")) {
      return { ok: true, text: async function () { return JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222" }]); } };
    }
    if (String(url).includes("/operon_chatbot_qualifications")) {
      return { ok: false, text: async function () { return "relation does not exist"; } };
    }
    throw new Error("Unexpected fetch URL: " + url);
  };

  try {
    const response = await runRequest(basePayload());
    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.event_id, "22222222-2222-4222-8222-222222222222");
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

function testBrowserContractIsNonBlockingAndStorageFree() {
  const source = fs.readFileSync(path.join(repoRoot, "apps/web-tsx/public/chatbot/chatbot.js"), "utf8");
  assert(source.includes("/.netlify/functions/save-chatbot-lead-event"), "chatbot should call the strict lead event function");
  assert(source.includes("Non-blocking: the customer handoff must continue"), "handoff failure must stay non-blocking");
  assert.strictEqual(/localStorage\.(setItem|removeItem|clear)/.test(source), false, "chatbot lead event must not write localStorage");
  assert.strictEqual(/sessionStorage\.(setItem|removeItem|clear)/.test(source), false, "chatbot lead event must not write sessionStorage");
}

(async function run() {
  await testValidPayloadWritesSafeLeadEventAndQualification();
  await testInvalidPayloadsRejectBeforeWrite();
  await testNoPiiRequired();
  await testQualificationTableRolloutIsNonBlocking();
  testBrowserContractIsNonBlockingAndStorageFree();
  console.log("saveChatbotLeadEventContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
