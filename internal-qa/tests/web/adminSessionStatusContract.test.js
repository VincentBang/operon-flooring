"use strict";

const assert = require("assert");
const adminSessionStatus = require("../../../netlify/functions/admin-session-status");
const AdminAuth = require("../../../netlify/functions/shared/adminAuth");

function makeEvent(headers, method) {
  return {
    httpMethod: method || "GET",
    headers: headers || {},
    rawQuery: ""
  };
}

async function withAdminToken(token, callback) {
  const previous = process.env.OPERON_ADMIN_TOKEN;
  if (typeof token === "undefined") {
    delete process.env.OPERON_ADMIN_TOKEN;
  } else {
    process.env.OPERON_ADMIN_TOKEN = token;
  }
  try {
    await callback();
  } finally {
    if (typeof previous === "undefined") {
      delete process.env.OPERON_ADMIN_TOKEN;
    } else {
      process.env.OPERON_ADMIN_TOKEN = previous;
    }
  }
}

function parse(response) {
  return JSON.parse(response.body || "{}");
}

(async function main() {
  assert.strictEqual(AdminAuth._test.safeCompare("abc", "abc"), true);
  assert.strictEqual(AdminAuth._test.safeCompare("abc", "abcd"), false);
  assert.strictEqual(AdminAuth._test.safeCompare("abc", "xyz"), false);

  await withAdminToken(undefined, async function () {
    const response = await adminSessionStatus.handler(makeEvent());
    const payload = parse(response);
    assert.strictEqual(response.statusCode, 503);
    assert.strictEqual(payload.ok, false);
    assert.strictEqual(payload.authenticated, false);
    assert.strictEqual(payload.error, "Admin access is not configured.");
    assert.strictEqual(response.headers["Cache-Control"], "no-store");
  });

  await withAdminToken("test-admin-token", async function () {
    const missing = await adminSessionStatus.handler(makeEvent());
    assert.strictEqual(missing.statusCode, 401);
    assert.strictEqual(parse(missing).error, "Admin authentication required.");

    const wrong = await adminSessionStatus.handler(makeEvent({ authorization: "Bearer wrong-token" }));
    assert.strictEqual(wrong.statusCode, 403);
    assert.strictEqual(parse(wrong).error, "Admin access denied.");

    const validBearer = await adminSessionStatus.handler(makeEvent({ authorization: "Bearer test-admin-token" }));
    const validPayload = parse(validBearer);
    assert.strictEqual(validBearer.statusCode, 200);
    assert.deepStrictEqual(validPayload, {
      ok: true,
      authenticated: true,
      role: "admin",
      access: "admin_shell"
    });

    const validHeader = await adminSessionStatus.handler(makeEvent({ "x-operon-admin-token": "test-admin-token" }));
    assert.strictEqual(validHeader.statusCode, 200);

    const method = await adminSessionStatus.handler(makeEvent({}, "POST"));
    assert.strictEqual(method.statusCode, 405);
    assert.strictEqual(parse(method).error, "Method not allowed.");
  });

  console.log("adminSessionStatusContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
