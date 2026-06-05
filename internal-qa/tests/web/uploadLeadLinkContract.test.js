const assert = require("assert");

const uploadFunction = require("../../../netlify/functions/upload-customer-file.js");

const TINY_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

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

async function testUploadLinksToExistingQuoteLeadWithoutExposingPath() {
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
      body: options && options.body && Buffer.isBuffer(options.body) ? "<buffer>" : options && options.body ? JSON.parse(options.body) : null
    });

    if (String(url).includes("/rpc/operon_check_rate_limit")) {
      return {
        ok: true,
        json: async function () {
          return { allowed: true, remaining: 11, resetAt: Date.now() + 600000 };
        },
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }

    if (String(url).includes("/storage/v1/object/quote-files/")) {
      return {
        ok: true,
        text: async function () {
          return "{}";
        }
      };
    }

    if (String(url).includes("/rest/v1/operon_uploaded_files")) {
      if ((options && options.method || "GET") === "POST") {
        return {
          ok: true,
          text: async function () {
            return JSON.stringify([{ id: "33333333-3333-4333-8333-333333333333" }]);
          }
        };
      }
      return {
        ok: true,
        text: async function () {
          return "";
        }
      };
    }

    if (String(url).includes("/rest/v1/operon_quote_requests")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{ lead_id: "11111111-1111-4111-8111-111111111111" }]);
        }
      };
    }

    if (String(url).includes("/rest/v1/operon_lead_files")) {
      return {
        ok: true,
        text: async function () {
          return "";
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
    const response = await uploadFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://operonflooring.com.au"
      },
      body: JSON.stringify({
        quoteId: "22222222-2222-4222-8222-222222222222",
        source: "quote",
        file: {
          name: "test-floorplan.png",
          type: "image/png",
          dataBase64: TINY_PNG_BASE64
        }
      })
    });

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.uploaded_file_id, "33333333-3333-4333-8333-333333333333");
    assert.equal(Object.prototype.hasOwnProperty.call(body, "storage_bucket"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "file_path"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "signed_url"), false);

    const uploadedFilePatch = requests.find(function (request) {
      return request.method === "PATCH" && request.url.includes("/operon_uploaded_files");
    });
    assert(uploadedFilePatch, "expected uploaded file lead_id link. Requests: " + JSON.stringify(requests, null, 2));
    assert.equal(uploadedFilePatch.body.lead_id, "11111111-1111-4111-8111-111111111111");

    const leadFilePost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_files");
    });
    assert(leadFilePost, "expected lead file row");
    assert.equal(leadFilePost.body.lead_id, "11111111-1111-4111-8111-111111111111");
    assert.equal(leadFilePost.body.file_role, "quote_attachment");
    assert.equal(leadFilePost.body.safe_filename, "test-floorplan.png");
    assert.equal(JSON.stringify(leadFilePost.body).includes("quote-files"), false);
    assert.equal(JSON.stringify(leadFilePost.body).includes("/unassigned/"), false);

    const eventPost = requests.find(function (request) {
      return request.method === "POST" && request.url.includes("/operon_lead_events");
    });
    assert(eventPost, "expected file_uploaded event");
    assert.equal(eventPost.body.event_type, "file_uploaded");
    assert.equal(JSON.stringify(eventPost.body).includes("quote-files"), false);
  } finally {
    console.warn = originalWarn;
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

async function testUploadLeadLinkFailureDoesNotBreakUploadResponse() {
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
          return { allowed: true, remaining: 11, resetAt: Date.now() + 600000 };
        },
        text: async function () {
          return JSON.stringify({ allowed: true });
        }
      };
    }
    if (String(url).includes("/storage/v1/object/quote-files/")) {
      return {
        ok: true,
        text: async function () {
          return "{}";
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_uploaded_files")) {
      if ((options && options.method || "GET") === "POST") {
        return {
          ok: true,
          text: async function () {
            return JSON.stringify([{ id: "33333333-3333-4333-8333-333333333333" }]);
          }
        };
      }
      return {
        ok: false,
        text: async function () {
          return "uploaded file link unavailable";
        }
      };
    }
    if (String(url).includes("/rest/v1/operon_quote_requests")) {
      return {
        ok: true,
        text: async function () {
          return JSON.stringify([{ lead_id: "11111111-1111-4111-8111-111111111111" }]);
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
    const response = await uploadFunction.handler({
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://operonflooring.com.au"
      },
      body: JSON.stringify({
        quoteId: "22222222-2222-4222-8222-222222222222",
        source: "quote",
        file: {
          name: "test-floorplan.png",
          type: "image/png",
          dataBase64: TINY_PNG_BASE64
        }
      })
    });

    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.uploaded_file_id, "33333333-3333-4333-8333-333333333333");
    assert.equal(Object.prototype.hasOwnProperty.call(body, "file_path"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "storage_bucket"), false);
  } finally {
    console.warn = originalWarn;
    global.fetch = originalFetch;
    restoreEnv(originals);
  }
}

(async function run() {
  await testUploadLinksToExistingQuoteLeadWithoutExposingPath();
  await testUploadLeadLinkFailureDoesNotBreakUploadResponse();
  console.log("uploadLeadLinkContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
