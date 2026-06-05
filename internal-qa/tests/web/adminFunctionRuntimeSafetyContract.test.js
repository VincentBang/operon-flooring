const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readFunction(fileName) {
  return fs.readFileSync(path.join(repoRoot, "netlify", "functions", fileName), "utf8");
}

function assertAdminFunctionSafe(fileName, fallback) {
  const source = readFunction(fileName);

  [
    "requireAdmin(event)",
    "x-operon-admin-token",
    "authorization, content-type, x-operon-admin-token",
    "Security.safeLogReason(error)",
    "Security.safePublicError(\"" + fallback + "\")",
    "Invalid JSON payload."
  ].forEach(function (term) {
    assert.ok(source.includes(term), fileName + " should include `" + term + "`.");
  });

  assert.strictEqual(
    source.includes("error && error.message ? error.message : \"" + fallback + "\""),
    false,
    fileName + " must not return raw internal error.message in admin 500 responses."
  );
  assert.strictEqual(
    /return jsonResponse\(event,\s*500,[\s\S]*error\.message/.test(source),
    false,
    fileName + " admin 500 response block must not include error.message."
  );
  assert.strictEqual(
    /console\.(warn|error)\([^;\n]*,\s*error\s*\)/.test(source),
    false,
    fileName + " must not log raw error objects."
  );
}

function main() {
  assertAdminFunctionSafe("lead-admin.js", "Lead admin request failed.");
  assertAdminFunctionSafe("followup-admin.js", "Follow-up admin request failed.");
  console.log("adminFunctionRuntimeSafetyContract.test.js passed");
}

main();
