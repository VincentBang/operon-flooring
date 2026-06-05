const assert = require("assert");

const operatorFunction = require("../../../netlify/functions/operator-chat-request.js");

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

async function testOperatorRequestLeadWriteKeepsResponseContract() {
  const requests = [];
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originals = {};

  setEnv("RESEND_API_KEY", "test-resend-key", originals);
  setEnv("OPERON_FROM_EMAIL", "quotes@example.com", originals);
  setEnv("OPERON_INTERNAL_EMAIL", "internal@example.com", originals);
  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);
  delete process.env.OPERON_TURNSTILE_SECRET;
  delete process.env.TURNSTILE_SECRET_KEY;

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
          return { allowed: true, remaining: 7, resetAt: Date.now() + 600000 };
        },
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }

    if (String(url).includes("api.resend.com/emails")) {
      return {
        ok: true,
        json: async function () {
          return { id: "email_123" };
        },
        text: async function () {
          return "";
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
    const response = await operatorFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://operonflooring.com.au"
      },
      body: JSON.stringify({
        customer: {
          name: "Operator Customer",
          email: "OPERATOR@EXAMPLE.COM",
          phone: "0400000000"
        },
        pageUrl: "https://operonflooring.com.au/products.html",
        message: "Please call me about a hybrid flooring quote.",
        transcript: [
          { role: "user", text: "I need a quote for hybrid." },
          { role: "assistant", text: "I can help." }
        ],
        structuredOutput: {
          intent: "quote_request",
          productCategory: "hybrid"
        }
      })
    });

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.internalNotificationSent, true);
    assert.equal(body.customerEmailSent, true);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "lead_id"), false);

    const leadPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_leads");
    });
    assert(leadPost, "expected operator lead insert");
    assert.equal(leadPost.body.primary_source, "chatbot");
    assert.equal(leadPost.body.source_detail, "operator_request");
    assert.equal(leadPost.body.email, "operator@example.com");
    assert.equal(leadPost.body.contact_status, "customer_and_internal_email_sent");
    assert.equal(leadPost.body.metadata.transcript_message_count, 2);
    assert.deepEqual(leadPost.body.metadata.structured_output_keys, ["intent", "productCategory"]);
    assert.equal(JSON.stringify(leadPost.body.metadata).includes("I need a quote"), false);
    assert.equal(JSON.stringify(leadPost.body.metadata).includes("Please call me"), false);

    const eventPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_events");
    });
    assert(eventPost, "expected operator lead event");
    assert.equal(eventPost.body.event_type, "operator_request_submitted");
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function testOperatorLeadFailureDoesNotBreakEmailSuccessResponse() {
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originals = {};

  setEnv("RESEND_API_KEY", "test-resend-key", originals);
  setEnv("OPERON_FROM_EMAIL", "quotes@example.com", originals);
  setEnv("OPERON_INTERNAL_EMAIL", "internal@example.com", originals);
  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);
  delete process.env.OPERON_TURNSTILE_SECRET;
  delete process.env.TURNSTILE_SECRET_KEY;

  global.fetch = async function (url) {
    if (String(url).includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () {
          return { allowed: true, remaining: 7, resetAt: Date.now() + 600000 };
        },
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }
    if (String(url).includes("api.resend.com/emails")) {
      return {
        ok: true,
        json: async function () {
          return { id: "email_123" };
        },
        text: async function () {
          return "";
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_leads")) {
      return {
        ok: false,
        text: async function () {
          return "lead table unavailable";
        }
      };
    }
    return {
      ok: true,
      text: async function () {
        return "";
      }
    };
  };
  console.warn = function () {};

  try {
    const response = await operatorFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://operonflooring.com.au"
      },
      body: JSON.stringify({
        customer: {
          name: "Operator Lead Failure",
          email: "operator-failure@example.com"
        },
        message: "Please call back."
      })
    });

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.internalNotificationSent, true);
    assert.equal(body.customerEmailSent, true);
  } finally {
    console.warn = originalWarn;
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

(async function run() {
  await testOperatorRequestLeadWriteKeepsResponseContract();
  await testOperatorLeadFailureDoesNotBreakEmailSuccessResponse();
  console.log("operatorLeadContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
