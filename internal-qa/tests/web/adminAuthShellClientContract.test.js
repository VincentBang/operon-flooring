"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const sourcePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminAuthShell.tsx");
const source = fs.readFileSync(sourcePath, "utf8");

[
  "\"use client\"",
  "/.netlify/functions/admin-session-status",
  "Authorization: `Bearer ${trimmed}`",
  "cache: \"no-store\"",
  "setToken(\"\")",
  "Lead list",
  "Verify access to load",
  "Protected lead modules are available for preview verification.",
  "Protected module"
].forEach(function (term) {
  assert.ok(source.includes(term), "Admin auth shell client missing `" + term + "`.");
});

[
  "localStorage",
  "sessionStorage",
  "createClient",
  "lead-dashboard",
  "lead-admin",
  "operon_leads",
  "operon_quote_requests",
  "service_role",
  "storage_bucket",
  "file_path"
].forEach(function (term) {
  assert.strictEqual(source.includes(term), false, "Admin auth shell client must not include `" + term + "`.");
});

console.log("adminAuthShellClientContract.test.js passed");
