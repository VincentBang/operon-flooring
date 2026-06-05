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
  const doc = read("internal-docs/apps-web/TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md");
  const checklist = read("internal-docs/apps-web/TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md");
  const index = read("internal-docs/apps-web/OPERON_OS_IMPLEMENTATION_INDEX.md");
  const publicRuntimes = [
    "apps/web-tsx/public/quoteRuntime.js",
    "apps/web-tsx/public/tracking.js"
  ];

  [
    "This source contract is now active locally",
    "Production still requires approved draft preview QA before deployment.",
    ".from(\"quote_requests\")",
    ".from(\"quote_rooms\")",
    ".from(\"quote_items\")",
    "sendToSupabase(\"quote_funnel_sessions\"",
    "sendToSupabase(\"quote_events\"",
    "browser writes to any `operon_` lead/upload/review/event table",
    "raw storage bucket/path writes",
    "raw OCR text writes",
    "internal pricing/rate/margin/access multiplier writes",
    "`window.OPERON_SUPABASE_CONFIG` should not be required",
    "Service-role Supabase writes should remain server-side in Netlify Functions only.",
    "uploaded_file_id",
    "`/.netlify/functions/save-quote-request`",
    "`/.netlify/functions/upload-customer-file`",
    "Strict RLS/GraphQL hardening should happen only after this no-direct-browser-write acceptance contract is active and passing."
  ].forEach(function (term) {
    assertIncludes(doc, term, "Task A2 no-direct-write acceptance contract");
  });

  [
    "product handoff to quote works",
    "floorplan handoff to quote works",
    "quote-review handoff to quote works",
    "browser storage has no storage bucket/path, raw OCR text, internal pricing/rates, or service tokens",
    "source map probes return 404"
  ].forEach(function (term) {
    assertIncludes(doc, term, "Task A2 acceptance preview QA");
  });

  assertIncludes(
    checklist,
    "After Phase 2, `directBrowserSupabaseInventory.test.js` is updated from two known tracking writes to a blocking no-direct-browser-write contract.",
    "Task A2 removal checklist"
  );
  assertIncludes(
    index,
    "TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md",
    "Operon OS implementation index"
  );

  publicRuntimes.forEach(function (relativePath) {
    const content = read(relativePath);
    [
      "OPERON_SUPABASE_CONFIG",
      "OPERON_SUPABASE_PROJECT_REF",
      "anonKey",
      "quoteFilesBucket",
      "supabase.createClient",
      "sendToSupabase",
      "quote_funnel_sessions",
      "quote_events",
      ".from(\"quote_",
      ".from(\"operon_"
    ].forEach(function (term) {
      assert.ok(!content.includes(term), relativePath + " should not contain `" + term + "`.");
    });
  });

  console.log("taskA2NoDirectWriteAcceptanceContract.test.js passed");
}

main();
