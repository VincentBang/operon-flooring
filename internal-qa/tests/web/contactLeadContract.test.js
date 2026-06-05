const assert = require("assert");

const contactFunction = require("../../../netlify/functions/contact-enquiry.js");

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

async function testContactLeadWriteKeepsRedirectContract() {
  const requests = [];
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originals = {};

  setEnv("RESEND_API_KEY", "test-resend-key", originals);
  setEnv("OPERON_FROM_EMAIL", "quotes@example.com", originals);
  setEnv("OPERON_INTERNAL_EMAIL", "internal@example.com", originals);
  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);

  global.fetch = async function (url, options) {
    requests.push({
      url: String(url),
      method: options && options.method || "GET",
      body: options && options.body ? JSON.parse(options.body) : null
    });

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
    const response = await contactFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "TSX Contact Lead",
        email: "CONTACT@EXAMPLE.COM",
        phone: "0400000000",
        suburb: "Auburn",
        topic: "Quote help",
        timing: "Soon",
        message: "This is a realistic customer message that must not be copied wholesale into lead metadata."
      })
    });

    assert.equal(response.statusCode, 303);
    assert.equal(response.headers.Location, "/contact-thank-you.html");
    assert.equal(String(response.body || "").includes("lead"), false);

    const leadPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_leads");
    });
    assert(leadPost, "expected contact lead insert");
    assert.equal(leadPost.body.primary_source, "contact");
    assert.equal(leadPost.body.source_detail, "contact_form");
    assert.equal(leadPost.body.email, "contact@example.com");
    assert.equal(leadPost.body.customer_name, "TSX Contact Lead");
    assert.equal(leadPost.body.suburb, "Auburn");
    assert.equal(leadPost.body.contact_status, "internal_notification_sent");
    assert.equal(leadPost.body.metadata.topic, "Quote help");
    assert.equal(leadPost.body.metadata.timing, "Soon");
    assert.equal(typeof leadPost.body.metadata.message_length, "number");
    assert.equal(leadPost.body.metadata.message, undefined);

    const eventPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_events");
    });
    assert(eventPost, "expected contact lead event insert");
    assert.equal(eventPost.body.event_type, "contact_submitted");
    assert.equal(eventPost.body.metadata.message, undefined);
  } finally {
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function testContactValidationStillBlocksMissingMessage() {
  const originalFetch = global.fetch;
  let fetchCalled = false;
  global.fetch = async function () {
    fetchCalled = true;
    throw new Error("fetch should not be called");
  };

  try {
    const response = await contactFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Missing Message",
        email: "missing@example.com"
      })
    });

    assert.equal(response.statusCode, 400);
    assert.equal(fetchCalled, false);
  } finally {
    global.fetch = originalFetch;
  }
}

async function testContactLeadFailureDoesNotBreakRedirect() {
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originals = {};

  setEnv("RESEND_API_KEY", "test-resend-key", originals);
  setEnv("OPERON_FROM_EMAIL", "quotes@example.com", originals);
  setEnv("OPERON_INTERNAL_EMAIL", "internal@example.com", originals);
  setEnv("SUPABASE_URL", "https://example.supabase.co", originals);
  setEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key", originals);

  global.fetch = async function (url) {
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
    const response = await contactFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Lead Failure Contact",
        email: "lead-failure@example.com",
        message: "Email should still redirect even if Stage 3 lead write fails."
      })
    });

    assert.equal(response.statusCode, 303);
    assert.equal(response.headers.Location, "/contact-thank-you.html");
  } finally {
    console.warn = originalWarn;
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

(async function run() {
  await testContactLeadWriteKeepsRedirectContract();
  await testContactValidationStillBlocksMissingMessage();
  await testContactLeadFailureDoesNotBreakRedirect();
  console.log("contactLeadContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
