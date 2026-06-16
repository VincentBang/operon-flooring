const assert = require("assert");

const dashboard = require("../../../netlify/functions/lead-dashboard.js");

function event(method, query, headers) {
  return {
    httpMethod: method,
    rawQuery: query || "",
    headers: Object.assign({ "x-forwarded-for": "127.0.0.1" }, headers || {}),
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

async function main() {
  await withEnv({
    OPERON_ADMIN_TOKEN: null,
    OPERON_LEAD_ADMIN_TOKEN: null,
    SUPABASE_URL: null,
    OPERON_SUPABASE_URL: null,
    SUPABASE_SERVICE_ROLE_KEY: null,
    OPERON_SUPABASE_SERVICE_ROLE_KEY: null
  }, async function () {
    const response = await dashboard.handler(event("GET", "action=list"));
    assert.strictEqual(response.statusCode, 503);
    assert.strictEqual(response.headers["Cache-Control"], "no-store");
    assert.deepStrictEqual(parseBody(response), {
      ok: false,
      error: "Admin access is not configured."
    });
  });

  await withEnv({
    OPERON_ADMIN_TOKEN: "local-admin-token",
    SUPABASE_URL: null,
    OPERON_SUPABASE_URL: null,
    SUPABASE_SERVICE_ROLE_KEY: null,
    OPERON_SUPABASE_SERVICE_ROLE_KEY: null
  }, async function () {
    const unauthorized = await dashboard.handler(event("GET", "action=list"));
    assert.strictEqual(unauthorized.statusCode, 401);
    assert.strictEqual(unauthorized.headers["Cache-Control"], "no-store");
    assert.deepStrictEqual(parseBody(unauthorized), {
      ok: false,
      error: "Admin authentication required."
    });

    const method = await dashboard.handler(event("POST", "", { "x-operon-admin-token": "local-admin-token" }));
    assert.strictEqual(method.statusCode, 405);
    assert.strictEqual(method.headers["Cache-Control"], "no-store");
    assert.deepStrictEqual(parseBody(method), {
      ok: false,
      error: "Method not allowed."
    });

    const unknown = await dashboard.handler(event("GET", "action=unknown", { "x-operon-admin-token": "local-admin-token" }));
    assert.strictEqual(unknown.statusCode, 400);
    assert.strictEqual(unknown.headers["Cache-Control"], "no-store");
    assert.deepStrictEqual(parseBody(unknown), {
      ok: false,
      error: "Unknown dashboard action."
    });
  });

  console.log("leadDashboardRuntimeContract.test.js passed");
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
