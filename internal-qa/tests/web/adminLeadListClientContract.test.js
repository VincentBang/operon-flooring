"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const listPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminLeadList.tsx");
const authPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminAuthShell.tsx");
const listSource = fs.readFileSync(listPath, "utf8");
const authSource = fs.readFileSync(authPath, "utf8");

[
  "\"use client\"",
  "/.netlify/functions/lead-dashboard?action=list&limit=50",
  "Authorization: `Bearer ${adminToken}`",
  "cache: \"no-store\"",
  "Latest website leads",
  "Quote, contact, quote-review, floorplan, product handoff and operator leads",
  "formatMoney",
  "formatDate"
].forEach(function (term) {
  assert.ok(listSource.includes(term), "Admin lead list client missing `" + term + "`.");
});

[
  "AdminLeadList",
  "verifiedToken",
  "setVerifiedToken(trimmed)",
  "setToken(\"\")",
  "Lock admin shell"
].forEach(function (term) {
  assert.ok(authSource.includes(term), "Admin auth shell missing lead-list auth handoff term `" + term + "`.");
});

[
  "localStorage",
  "sessionStorage",
  "createClient",
  "service_role",
  "storage_bucket",
  "file_path",
  "signed_url",
  "raw_ocr",
  "extracted_text",
  "supplier_cost",
  "gross_margin",
  "internal_rate"
].forEach(function (term) {
  assert.strictEqual(listSource.includes(term), false, "Admin lead list client must not include `" + term + "`.");
  assert.strictEqual(authSource.includes(term), false, "Admin auth shell must not include `" + term + "`.");
});

console.log("adminLeadListClientContract.test.js passed");
