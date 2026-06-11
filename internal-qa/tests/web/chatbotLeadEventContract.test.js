const assert = require("assert");

const chatbotLeadEvent = require("../../../netlify/functions/chatbot-lead-event.js");

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

async function runRequest(payload, requests) {
  return chatbotLeadEvent.handler({
    httpMethod: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://operonflooring.com.au",
      "x-forwarded-for": "203.0.113.10"
    },
    body: JSON.stringify(payload)
  });
}

async function testQuoteReviewHandoffCreatesSafeDashboardLead() {
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
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
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
          return "";
        }
      };
    }

    throw new Error("Unexpected fetch URL: " + url);
  };

  try {
    const response = await runRequest({
      eventType: "chatbot_handoff",
      chatbotSessionId: "chat_m3abc123456789",
      intent: "existing_quote_review",
      handoffPath: "/quote-review.html?from=chatbot&mode=upload",
      sourcePageKey: "products",
      sourcePage: "/products.html",
      deviceType: "mobile",
      timestamp: "2026-06-11T09:30:00.000Z",
      leadSummary: {
        intent: "existing_quote_review",
        product_category: "hybrid",
        suburb: "Auburn",
        area_status: "not_sure",
        existing_quote_status: "yes"
      },
      missingInfo: [
        "product details unclear",
        "area unclear",
        "Total inc GST $3850 raw quote text",
        "customer@example.com"
      ],
      nextAction: "Review my quote",
      linkedLead: {
        leadId: "33333333-3333-4333-8333-333333333333"
      }
    }, requests);

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.stored, true);

    const leadPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_leads");
    });
    assert(leadPost, "expected operon_leads insert");
    assert.equal(leadPost.body.primary_source, "chatbot");
    assert.equal(leadPost.body.source_detail, "route_handoff");
    assert.equal(leadPost.body.status, "Waiting customer");
    assert.equal(leadPost.body.product_category, "hybrid");
    assert.equal(leadPost.body.suburb, "Auburn");
    assert.equal(leadPost.body.quote_review_status, "chatbot_handoff");
    assert.deepEqual(leadPost.body.missing_info_flags, ["product details unclear", "area unclear"]);
    assert.equal(leadPost.body.metadata.chatbot_session_id, "chat_m3abc123456789");
    assert.equal(leadPost.body.metadata.handoff_path, "/quote-review.html?from=chatbot&mode=upload");
    assert.equal(leadPost.body.metadata.device_type, "mobile");
    assert.equal(JSON.stringify(leadPost.body).includes("$3850"), false);
    assert.equal(JSON.stringify(leadPost.body).includes("customer@example.com"), false);

    const eventPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_events");
    });
    assert(eventPost, "expected operon_lead_events insert");
    assert.equal(eventPost.body.event_type, "chatbot_quote_review_handoff");
    assert.equal(eventPost.body.source, "chatbot-lead-event");
    assert.equal(eventPost.body.customer_safe, true);
    assert.equal(eventPost.body.metadata.linked_lead_id, "33333333-3333-4333-8333-333333333333");
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function testPrequalificationKeepsLegacyContract() {
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
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_leads")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222" }]);
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_lead_events")) {
      return {
        ok: true,
        text: async function () {
          return "";
        }
      };
    }
    throw new Error("Unexpected fetch URL: " + url);
  };

  try {
    const response = await runRequest({
      eventType: "chatbot_quote_prequalification_completed",
      pageKey: "index",
      routeHref: "/quote.html?from=chatbot&prequal=1#quoteForm",
      summary: {
        suburb: "Parramatta",
        property_type: "house",
        product_category: "laminate",
        area_status: "known:45",
        stairs_status: "no",
        removal_status: "not_sure",
        existing_quote_status: "no",
        floorplan_status: "no"
      }
    }, requests);

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);

    const leadPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_leads");
    });
    assert(leadPost, "expected operon_leads insert");
    assert.equal(leadPost.body.source_detail, "quote_prequalification");
    assert.equal(leadPost.body.primary_source, "chatbot");
    assert.equal(leadPost.body.suburb, "Parramatta");
    assert.equal(leadPost.body.product_category, "laminate");
    assert.equal(leadPost.body.area_m2, 45);
    assert.equal(leadPost.body.next_action, "start_quote_form");
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

(async function run() {
  await testQuoteReviewHandoffCreatesSafeDashboardLead();
  await testPrequalificationKeepsLegacyContract();
  console.log("chatbotLeadEventContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
