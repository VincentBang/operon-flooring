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
  const checklist = read("internal-docs/apps-web/TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md");
  const plan = read("internal-docs/apps-web/TASK_A2_DIRECT_BROWSER_SUPABASE_FUNCTION_ROUTE_PLAN.md");
  const index = read("internal-docs/apps-web/OPERON_OS_IMPLEMENTATION_INDEX.md");

  [
    "No production deploy without explicit approval.",
    "No Netlify draft deploy unless browser/runtime verification is explicitly approved.",
    "Do not apply strict RLS/GraphQL hardening until the no-direct-browser-write contract passes.",
    "Do not remove public Supabase browser config until quote fallback writes and tracking writes are both removed or function-routed.",
    ".from(\"quote_requests\")",
    ".from(\"quote_rooms\")",
    ".from(\"quote_items\")",
    "- none in the checked quote/tracking public runtimes",
    "Remove or disable these direct Supabase anon writes:",
    "Status: completed locally, pending preview QA before production.",
    "After Phase 1, `directBrowserSupabaseInventory.test.js` is updated from five known writes to two known tracking writes.",
    "Status: completed locally, pending preview QA before production.",
    "After Phase 2, `directBrowserSupabaseInventory.test.js` is updated from two known tracking writes to a blocking no-direct-browser-write contract.",
    "Remove public runtime dependency on `window.OPERON_SUPABASE_CONFIG`.",
    "Status: completed locally, pending preview QA before production.",
    "`quoteRuntime.js` no longer publishes the Supabase project ref, anon config object, anon key, or quote-files bucket name",
    "Only after no-direct-browser-write contract passes:",
    "Browser/runtime preview QA requires explicit approval before any Netlify draft deploy."
  ].forEach(function (term) {
    assertIncludes(checklist, term, "Task A2 removal checklist");
  });

  [
    "Product page handoff to quote.",
    "Floorplan handoff to quote.",
    "Quote-review handoff to quote.",
    "No raw OCR text, uploaded file contents, storage paths, internal pricing fields, or full customer message bodies enter analytics payloads.",
    "Never apply strict RLS in the same change as fallback removal."
  ].forEach(function (term) {
    assertIncludes(checklist, term, "Task A2 QA/rollback guardrail");
  });

  assertIncludes(
    plan,
    "TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md",
    "Task A2 function-route plan"
  );
  assertIncludes(
    index,
    "TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md",
    "Operon OS implementation index"
  );

  console.log("taskA2DirectWriteRemovalChecklistContract.test.js passed");
}

main();
