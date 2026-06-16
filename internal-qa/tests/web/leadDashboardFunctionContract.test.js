const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const source = fs.readFileSync(path.join(repoRoot, "netlify/functions/lead-dashboard.js"), "utf8");
const adminAuthSource = fs.readFileSync(path.join(repoRoot, "netlify/functions/shared/adminAuth.js"), "utf8");

function assertIncludes(term) {
  assert.ok(source.includes(term), "lead-dashboard.js missing required term: " + term);
}

function assertNotIncludes(term) {
  assert.strictEqual(source.includes(term), false, "lead-dashboard.js must not include forbidden term: " + term);
}

function main() {
  [
    "const AdminAuth = require(\"./shared/adminAuth\")",
    "AdminAuth.requireAdmin(event)",
    "AdminAuth.ADMIN_ALLOW_HEADERS",
    "Security.checkDurableRateLimit",
    "Security.safeLogReason(error)",
    "Security.safePublicError(\"Lead dashboard request failed.\")",
    "operon_leads",
    "operon_lead_events",
    "operon_lead_notes",
    "operon_lead_files",
    "action === \"list\"",
    "action === \"detail\"",
    "action === \"summary\"",
    "missing_info_count",
    "risk_flag_count",
    "next_cursor: null",
    "A valid lead_id is required.",
    "Lead not found."
  ].forEach(assertIncludes);

  [
    "x-operon-admin-token",
    "authorization, content-type, x-operon-admin-token",
    "timingSafeEqual"
  ].forEach(function (term) {
    assert.ok(adminAuthSource.includes(term), "shared adminAuth helper missing required term: " + term);
  });

  [
    "storage_bucket",
    "file_path",
    "signed_url",
    "publicUrl",
    "raw_transcript",
    "raw_quote_text",
    "uploaded_file_text",
    "extracted_text",
    "raw_ocr",
    "supplier_cost",
    "gross_margin",
    "internal_rate",
    "installRates",
    "removalRates",
    "stairRates",
    "locationZones",
    "pricingRules"
  ].forEach(assertNotIncludes);

  const adminShell = fs.readFileSync(path.join(repoRoot, "apps/web-tsx/src/app/admin/page.tsx"), "utf8");
  [
    "lead-dashboard",
    "fetch(",
    "localStorage",
    "createClient"
  ].forEach(function (term) {
    assert.strictEqual(
      adminShell.includes(term),
      false,
      "Static admin shell must not call dashboard API before UI approval: " + term
    );
  });

  console.log("leadDashboardFunctionContract.test.js passed");
}

main();
