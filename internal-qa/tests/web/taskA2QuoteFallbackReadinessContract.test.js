const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assertIncludes(content, term, label) {
  assert.ok(content.includes(term), label + " missing `" + term + "`.");
}

function assertNotIncludes(content, term, label) {
  assert.strictEqual(content.includes(term), false, label + " should not include `" + term + "`.");
}

function main() {
  const runtime = read("apps/web-tsx/public/quoteRuntime.js");
  const saveFunction = read("netlify/functions/save-quote-request.js");
  const doc = read("internal-docs/apps-web/TASK_A2_QUOTE_FALLBACK_REMOVAL_READINESS.md");

  [
    "const SAVE_QUOTE_REQUEST_ENDPOINT = \"/.netlify/functions/save-quote-request\"",
    "async function saveQuoteDraftToNetlify(payload)",
    "mode: \"draft\"",
    "async function submitLeadToNetlifyForm(leadPayload, submitPayload)",
    "mode: \"submit_quote\"",
    "async function sendQuoteEmailCopy(payload, emailTo)",
    "mode: \"email_quote\""
  ].forEach(function (term) {
    assertIncludes(runtime, term, "quoteRuntime.js");
  });

  [
    "async function saveQuoteRequest(payload)",
    ".from(\"quote_requests\")",
    "async function saveQuoteRooms(quoteId, rooms)",
    ".from(\"quote_rooms\")",
    "async function saveQuoteItems(quoteId, items)",
    ".from(\"quote_items\")",
    "operonSupabase",
    "createClient("
  ].forEach(function (term) {
    assertNotIncludes(runtime, term, "quoteRuntime.js");
  });

  [
    "const mode = allowedMode === \"email_quote\" || allowedMode === \"submit_quote\" ? allowedMode : \"draft\"",
    "if (mode === \"draft\" || mode === \"submit_quote\")",
    "on_conflict: \"id\"",
    "Prefer: \"resolution=merge-duplicates,return=representation\"",
    "await replaceChildRows(",
    "mode === \"submit_quote\"",
    "await safelySendQuoteEmails(",
    "await safelyRecordQuoteLead({",
    "return jsonResponse(event, 200, {",
    "quoteReference: quoteReference",
    "customerEmailSent: emailResult.customerEmailSent",
    "internalNotificationSent: emailResult.internalNotificationSent"
  ].forEach(function (term) {
    assertIncludes(saveFunction, term, "save-quote-request.js");
  });

  [
    "Public responses must not return `lead_id`",
    "Removed locally: `saveQuoteRequest(payload)` direct browser write to `quote_requests`.",
    "Removed locally: `saveQuoteRooms(quoteId, rooms)` direct browser write to `quote_rooms`.",
    "Removed locally: `saveQuoteItems(quoteId, items)` direct browser write to `quote_items`.",
    "`directBrowserSupabaseInventory.test.js` now blocks direct browser write targets in the checked quote/tracking public runtimes.",
    "Public `window.OPERON_SUPABASE_CONFIG` was removed locally in Phase 3.",
    "Confirm public runtime does not expose `OPERON_SUPABASE_CONFIG`, public Supabase project ref, anon key, or quote-files bucket name.",
    "Do not apply strict RLS/GraphQL hardening until the no-direct-browser-write contract passes."
  ].forEach(function (term) {
    assertIncludes(doc, term, "Task A2 quote fallback readiness doc");
  });

  console.log("taskA2QuoteFallbackReadinessContract.test.js passed");
}

main();
