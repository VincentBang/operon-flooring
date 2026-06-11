"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const detailPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminLeadDetail.tsx");
const listPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminLeadList.tsx");
const detailSource = fs.readFileSync(detailPath, "utf8");
const listSource = fs.readFileSync(listPath, "utf8");

[
  "\"use client\"",
  "/.netlify/functions/lead-dashboard?action=detail&lead_id=",
  "Authorization: `Bearer ${adminToken}`",
  "cache: \"no-store\"",
  "Customer",
  "Project",
  "Quote",
  "Status update",
  "/.netlify/functions/lead-status-admin",
  "lead_id: leadId",
  "window.confirm",
  "Save status",
  "Files",
  "Notes",
  "Event timeline",
  "formatEventMetadata",
  "Intent:",
  "Handoff:",
  "Next:",
  "Device:",
  "Source page:"
].forEach(function (term) {
  assert.ok(detailSource.includes(term), "Admin lead detail client missing `" + term + "`.");
});

[
  "AdminLeadDetail",
  "selectedLeadId",
  "setSelectedLeadId(lead.id)",
  "View"
].forEach(function (term) {
  assert.ok(listSource.includes(term), "Admin lead list missing detail selection term `" + term + "`.");
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
  "internal_rate",
  "pricingRules",
  "installRates",
  "removalRates"
].forEach(function (term) {
  assert.strictEqual(detailSource.includes(term), false, "Admin lead detail client must not include `" + term + "`.");
  assert.strictEqual(listSource.includes(term), false, "Admin lead list must not include `" + term + "`.");
});

console.log("adminLeadDetailClientContract.test.js passed");
