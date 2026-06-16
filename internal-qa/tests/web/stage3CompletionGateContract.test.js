"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assertIncludesAll(documentText, requiredTerms, label) {
  requiredTerms.forEach(function (term) {
    assert.ok(documentText.includes(term), label + " should include `" + term + "`.");
  });
}

function main() {
  const gate = read("internal-docs/apps-web/STAGE3_COMPLETION_GATE_2026-06-13.md");
  const status = read("internal-docs/apps-web/STAGE3_LEAD_OS_IMPLEMENTATION_STATUS.md");
  const chatbotMigration = read("supabase/migrations/20260611_chatbot_qualification_bridge.sql");

  assertIncludesAll(gate, [
    "Stage 3 is locally implementation-complete for a protected MVP, but not live-complete for operator use.",
    "No production deploy, Netlify deploy, push, Supabase policy change",
    "operon_chatbot_qualifications",
    "The local admin chatbot-qualified lead view reads from `operon_chatbot_qualifications`.",
    "Decide admin route behavior for `/admin` versus `/admin.html`",
    "Configure and verify the approved admin auth environment variable without printing or committing it.",
    "Run a Git-based Netlify branch preview",
    "Verify unauthenticated admin function requests return 401/403",
    "Verify quote, contact, quote-review, upload, product handoff and floorplan handoff still work",
    "Confirm admin pages remain `noindex,nofollow` and absent from sitemap.",
    "Auto-sending follow-up emails or SMS."
  ], "Stage 3 completion gate");

  assertIncludesAll(status, [
    "See `internal-docs/apps-web/STAGE3_COMPLETION_GATE_2026-06-13.md`",
    "Stage 3 is locally implementation-complete for a protected MVP.",
    "Stage 3 is not live-complete for operator use until preview/live verification passes.",
    "supabase/migrations/20260611_chatbot_qualification_bridge.sql",
    "Do not production deploy Stage 3"
  ], "Stage 3 implementation status");

  assertIncludesAll(chatbotMigration, [
    "create table if not exists public.operon_chatbot_qualifications",
    "No raw transcripts, quote text, OCR text, file",
    "references public.operon_leads(id)",
    "alter table public.operon_chatbot_qualifications enable row level security",
    "revoke all on table public.operon_chatbot_qualifications from anon, authenticated",
    "grant all on table public.operon_chatbot_qualifications to service_role"
  ], "Chatbot qualification bridge migration");

  console.log("stage3CompletionGateContract.test.js passed");
}

main();
