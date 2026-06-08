"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const queuesPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminReviewQueues.tsx");
const reportingPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminReportingSummary.tsx");
const authPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminAuthShell.tsx");
const queuesSource = fs.readFileSync(queuesPath, "utf8");
const reportingSource = fs.readFileSync(reportingPath, "utf8");
const authSource = fs.readFileSync(authPath, "utf8");

[
  "\"use client\"",
  "source=\"quote_review\"",
  "source=\"floorplan\"",
  "Quote-review queue",
  "Floorplan queue",
  "quote_review_status",
  "floorplan_status",
  "missing_info_count",
  "risk_flag_count",
  "cache: \"no-store\""
].forEach(function (term) {
  assert.ok(queuesSource.includes(term), "Admin review queues missing `" + term + "`.");
});

[
  "\"use client\"",
  "/.netlify/functions/lead-dashboard?action=summary",
  "Lead operating snapshot",
  "Total leads",
  "Quote reviews",
  "Floorplans",
  "High priority",
  "cache: \"no-store\""
].forEach(function (term) {
  assert.ok(reportingSource.includes(term), "Admin reporting summary missing `" + term + "`.");
});

[
  "AdminReviewQueues",
  "AdminReportingSummary"
].forEach(function (term) {
  assert.ok(authSource.includes(term), "Admin auth shell should mount `" + term + "` after auth.");
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
  assert.strictEqual(queuesSource.includes(term), false, "Admin review queues must not include `" + term + "`.");
  assert.strictEqual(reportingSource.includes(term), false, "Admin reporting summary must not include `" + term + "`.");
});

console.log("adminReviewQueuesClientContract.test.js passed");
