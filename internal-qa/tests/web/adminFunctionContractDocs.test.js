const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const docsRoot = path.join(repoRoot, "internal-docs", "apps-web");

const writeContract = fs.readFileSync(
  path.join(docsRoot, "STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md"),
  "utf8"
);
const readContract = fs.readFileSync(
  path.join(docsRoot, "STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md"),
  "utf8"
);
const securityPlan = fs.readFileSync(
  path.join(docsRoot, "STAGE3_DASHBOARD_SECURITY_TEST_PLAN.md"),
  "utf8"
);
const authFunctionContract = fs.readFileSync(
  path.join(docsRoot, "STAGE3_ADMIN_AUTH_FUNCTION_CONTRACT.md"),
  "utf8"
);
const fixturePlan = fs.readFileSync(
  path.join(docsRoot, "STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md"),
  "utf8"
);
const leadListChecklist = fs.readFileSync(
  path.join(docsRoot, "TASK_3_5_LEAD_LIST_IMPLEMENTATION_CHECKLIST.md"),
  "utf8"
);
const leadDetailChecklist = fs.readFileSync(
  path.join(docsRoot, "TASK_3_6_LEAD_DETAIL_IMPLEMENTATION_CHECKLIST.md"),
  "utf8"
);

function assertIncludesAll(documentText, requiredTerms, label) {
  requiredTerms.forEach(function (term) {
    assert.ok(
      documentText.includes(term),
      label + " should include `" + term + "`."
    );
  });
}

function main() {
  assertIncludesAll(writeContract, [
    "admin-update-lead-status",
    "admin-update-lead-priority",
    "admin-create-lead-note",
    "admin-update-next-action",
    "admin-schedule-follow-up",
    "Validate admin",
    "operon_lead_status_history",
    "operon_lead_events",
    "Service-role keys",
    "Private pricing fields",
    "Raw OCR text"
  ], "Admin write contract");

  assertIncludesAll(readContract, [
    "admin-leads-list",
    "admin-lead-detail",
    "admin-lead-events",
    "admin-lead-files",
    "admin-reports-summary",
    "netlify/functions/lead-dashboard.js",
    "/.netlify/functions/lead-dashboard?action=list",
    "/.netlify/functions/lead-dashboard?action=detail&lead_id=<uuid>",
    "/.netlify/functions/lead-dashboard?action=summary",
    "Admin authentication required.",
    "Expected source coverage:",
    "`floorplan`",
    "`floorplan_handoff`",
    "\"floorplan\": {",
    "Storage paths",
    "Raw OCR text",
    "Internal pricing/rate fields",
    "STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md"
  ], "Admin read contract");

  assertIncludesAll(securityPlan, [
    "/admin",
    "noindex,nofollow",
    "401/403",
    "Cache-Control: no-store",
    "Malformed JSON returns `400` with a fixed safe validation message.",
    "Server logs contain short failure reasons rather than raw provider/database error objects.",
    "`lead-dashboard`",
    "`lead-admin`",
    "`followup-admin`",
    "`lead-dashboard` covers list/detail/summary reads from `operon_leads`.",
    "`/admin.html` is not wired to `lead-dashboard` until the admin UI is approved.",
    "storage_bucket",
    "file_path",
    "signed_url",
    "raw_ocr",
    "supplier_cost",
    "operon_leads",
    "Anonymous list bucket"
  ], "Dashboard security test plan");

  assertIncludesAll(authFunctionContract, [
    "admin-session-status",
    "admin-leads-list",
    "admin-lead-detail",
    "admin-update-lead-status",
    "Validate admin access before any Supabase query.",
    "Return `401` or `403` for unauthenticated or unauthorized requests.",
    "Set `Cache-Control: no-store`.",
    "Return `400` with `Invalid JSON payload.` for malformed admin POST bodies.",
    "Log only short failure reasons, not raw provider/database error objects.",
    "Use service-role Supabase credentials server-side only.",
    "{ \"ok\": false, \"error\": \"Admin authentication required.\" }",
    "{ \"ok\": false, \"error\": \"Admin access denied.\" }",
    "Temporary Admin Token Guardrail",
    "It must never be printed in logs.",
    "storage_bucket",
    "file_path",
    "raw OCR text",
    "raw provider/database error text",
    "Admin auth approach has not been approved.",
    "`/admin` route behavior is unresolved."
  ], "Admin auth function contract");

  assertIncludesAll(fixturePlan, [
    "Use synthetic names, emails, phone numbers, and IDs only.",
    "Do not copy customer rows from Supabase.",
    "Lead List Fixtures",
    "Product handoff lead",
    "Quote-review lead",
    "Operator/chatbot lead",
    "Floorplan lead",
    "`source_detail`: `floorplan_handoff`",
    "Lead Detail Fixtures",
    "No bucket/path/signed URL",
    "Floorplan detail",
    "Status filter",
    "Cursor pagination",
    "Unauthenticated request: 401 or 403",
    "No real customer data is used in tests."
  ], "Admin list/detail fixture plan");

  assertIncludesAll(leadListChecklist, [
    "Fixture coverage follows `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`.",
    "Pagination parameters are bounded.",
    "Filters map to safe query parameters."
  ], "Lead list checklist");

  assertIncludesAll(leadDetailChecklist, [
    "Fixture coverage follows `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`.",
    "File section hides bucket/path.",
    "Event metadata is redacted."
  ], "Lead detail checklist");

  console.log("adminFunctionContractDocs.test.js passed");
}

main();
