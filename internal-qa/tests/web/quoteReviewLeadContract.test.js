const assert = require("assert");

const quoteReviewFunction = require("../../../netlify/functions/save-quote-review.js");

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

async function testQuoteReviewLeadWriteKeepsSaveContract() {
  const requests = [];
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originals = {};

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
          return { allowed: true, remaining: 29, resetAt: Date.now() + 600000 };
        },
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }

    if (String(url).includes("/rest/v1/operon_quote_reviews")) {
      if ((options && options.method || "GET") === "POST") {
        return {
          ok: true,
          json: async function () {
            return [{ id: "22222222-2222-4222-8222-222222222222" }];
          },
          text: async function () {
            return JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222" }]);
          }
        };
      }
      if ((options && options.method || "GET") === "PATCH") {
        return {
          ok: true,
          text: async function () {
            return "";
          }
        };
      }
      return {
        ok: true,
        text: async function () {
          return "[]";
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
    const response = await quoteReviewFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://operonflooring.com.au"
      },
      body: JSON.stringify({
        review_mode: "detailed",
        customer_name: "Review Customer",
        email: "REVIEW@EXAMPLE.COM",
        phone: "0400000000",
        suburb: "Auburn",
        postcode: "2144",
        flooring_type: "hybrid",
        area_m2: 60,
        quote_total: 3850,
        quote_provider_name: "TestCo",
        missing_items: ["warranty"],
        risk_items: ["floor preparation unclear"],
        risk_level: "high",
        confidence_level: "medium",
        ocr_extracted_text: "Raw OCR text must stay out of operon_leads metadata.",
        advisor_summary: {
          questions_to_ask: ["What underlay is included?"]
        }
      })
    });

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.review_id, "22222222-2222-4222-8222-222222222222");
    assert.equal(Object.prototype.hasOwnProperty.call(body, "lead_id"), false);

    const leadPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_leads");
    });
    assert(leadPost, "expected quote-review lead insert");
    assert.equal(leadPost.body.primary_source, "quote_review");
    assert.equal(leadPost.body.source_detail, "uploaded_quote_review");
    assert.equal(leadPost.body.status, "Needs review");
    assert.equal(leadPost.body.priority, "high");
    assert.equal(leadPost.body.email, "review@example.com");
    assert.equal(leadPost.body.product_category, "hybrid");
    assert.deepEqual(leadPost.body.missing_info_flags, ["warranty"]);
    assert.deepEqual(leadPost.body.risk_flags, ["floor preparation unclear"]);
    assert.equal(JSON.stringify(leadPost.body.metadata).includes("Raw OCR text"), false);
    assert.equal(JSON.stringify(leadPost.body.metadata).includes("ocr_extracted_text"), false);

    const linkPatch = requests.find(function (request) {
      return request.method === "PATCH" && request.url.includes("/operon_quote_reviews");
    });
    assert(linkPatch, "expected quote review lead_id link");
    assert.equal(linkPatch.body.lead_id, "11111111-1111-4111-8111-111111111111");

    const eventPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_events");
    });
    assert(eventPost, "expected quote review lead event");
    assert.equal(eventPost.body.event_type, "quote_review_saved");
  } finally {
    console.warn = originalWarn;
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function testQuoteReviewLeadFailureDoesNotBreakSaveResponse() {
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originals = {};

  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);
  delete process.env.OPERON_TURNSTILE_SECRET;
  delete process.env.TURNSTILE_SECRET_KEY;

  global.fetch = async function (url, options) {
    if (String(url).includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () {
          return { allowed: true, remaining: 29, resetAt: Date.now() + 600000 };
        },
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_quote_reviews")) {
      if ((options && options.method || "GET") === "POST") {
        return {
          ok: true,
          json: async function () {
            return [{ id: "22222222-2222-4222-8222-222222222222" }];
          },
          text: async function () {
            return JSON.stringify([{ id: "22222222-2222-4222-8222-222222222222" }]);
          }
        };
      }
      return {
        ok: true,
        text: async function () {
          return "[]";
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
    const response = await quoteReviewFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://operonflooring.com.au"
      },
      body: JSON.stringify({
        review_mode: "quick",
        customer_name: "Review Lead Failure",
        email: "review-failure@example.com",
        flooring_type: "hybrid",
        missing_items: ["area"],
        risk_items: [],
        confidence_level: "medium"
      })
    });

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.review_id, "22222222-2222-4222-8222-222222222222");
  } finally {
    console.warn = originalWarn;
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

(async function run() {
  await testQuoteReviewLeadWriteKeepsSaveContract();
  await testQuoteReviewLeadFailureDoesNotBreakSaveResponse();
  console.log("quoteReviewLeadContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
