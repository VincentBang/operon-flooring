"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const consolePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "internal", "floorplan-measurements", "FloorplanMeasurementsConsole.tsx");
const pagePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "internal", "floorplan-measurements", "page.tsx");
const adminQueuesPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminReviewQueues.tsx");

const consoleSource = fs.readFileSync(consolePath, "utf8");
const pageSource = fs.readFileSync(pagePath, "utf8");
const adminQueuesSource = fs.readFileSync(adminQueuesPath, "utf8");

[
  "\"use client\"",
  "/.netlify/functions/admin-session-status",
  "/.netlify/functions/list-internal-floorplan-measurements",
  "/.netlify/functions/get-internal-floorplan-measurement?session_id=",
  "/.netlify/functions/save-floorplan-review-draft",
  "/.netlify/functions/approve-floorplan-measurement",
  "/.netlify/functions/link-approved-floorplan-measurement",
  "Authorization: `Bearer ${verifiedToken}`",
  "cache: \"no-store\"",
  "No storage path or pricing data is shown",
  "Private file linked",
  "Editor JSON is not valid.",
  "server recalculates area",
  "This does not calculate price"
].forEach(function (term) {
  assert.ok(consoleSource.includes(term), "Internal floorplan console missing `" + term + "`.");
});

[
  "robots: \"noindex,nofollow\"",
  "No customer files, storage paths or pricing data are rendered before admin access is verified."
].forEach(function (term) {
  assert.ok(pageSource.includes(term), "Internal floorplan page missing `" + term + "`.");
});

[
  "/internal/floorplan-measurements.html",
  "Floorplan measurement console",
  "Open measurement console"
].forEach(function (term) {
  assert.ok(adminQueuesSource.includes(term), "Admin review queues should expose authenticated floorplan console handoff `" + term + "`.");
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
  assert.strictEqual(consoleSource.includes(term), false, "Internal floorplan console must not include `" + term + "`.");
  assert.strictEqual(adminQueuesSource.includes(term), false, "Admin review queues must not include `" + term + "`.");
});

console.log("floorplanInternalConsoleClientContract.test.js passed");
