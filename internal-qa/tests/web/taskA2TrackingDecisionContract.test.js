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

function main() {
  const tracking = read("apps/web-tsx/public/tracking.js");
  const doc = read("internal-docs/apps-web/TASK_A2_TRACKING_WRITE_DECISION.md");

  [
    "function sanitizeAnalyticsParams",
    "window.operonTrack = function",
    "trackEvent(\"quote_started\"",
    "trackEvent(\"quote_step_completed\"",
    "trackEvent(\"quote_submitted\"",
    "trackEvent(\"floorplan_uploaded\"",
    "trackEvent(\"floorplan_to_quote\""
  ].forEach(function (term) {
    assertIncludes(tracking, term, "tracking.js");
  });

  [
    "function getSupabaseConfig()",
    "async function sendToSupabase(tableName, payload, options)",
    "sendToSupabase(\"quote_funnel_sessions\"",
    "sendToSupabase(\"quote_events\""
  ].forEach(function (term) {
    assert.strictEqual(tracking.includes(term), false, "tracking.js should not include `" + term + "`.");
  });

  [
    "Prefer analytics-only plus server-side revenue events from existing Functions",
    "Do not add a high-volume `track-event` Netlify Function yet.",
    "`quote_funnel_sessions`",
    "`quote_events`",
    "Direct browser Supabase tracking writes have been removed locally in Task A2 Phase 2.",
    "`tracking.js` no longer calls `sendToSupabase(\"quote_funnel_sessions\", ...)`.",
    "`tracking.js` no longer calls `sendToSupabase(\"quote_events\", ...)`.",
    "`sendToSupabase(...)` and `getSupabaseConfig()` are removed from public tracking runtime.",
    "`window.operonTrack(...)` and GA4 event aliases remain customer-safe.",
    "Local funnel state remains if needed for same-device UX",
    "`directBrowserSupabaseInventory.test.js` is updated to expect zero direct browser write targets.",
    "Do not restore broad anon SELECT/GraphQL access for tracking tables."
  ].forEach(function (term) {
    assertIncludes(doc, term, "Task A2 tracking decision doc");
  });

  [
    "raw OCR text",
    "uploaded file contents",
    "storage bucket/path/signed URLs",
    "internal rates, supplier costs, margins, pricing rules, or access multipliers",
    "full customer message bodies",
    "service keys or admin tokens"
  ].forEach(function (term) {
    assertIncludes(doc, term, "Task A2 tracking privacy guardrail");
  });

  console.log("taskA2TrackingDecisionContract.test.js passed");
}

main();
