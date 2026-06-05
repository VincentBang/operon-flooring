const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const docsRoot = path.join(repoRoot, "internal-docs", "apps-web");

function assertIncludesAll(documentText, requiredTerms, label) {
  requiredTerms.forEach(function (term) {
    assert.ok(
      documentText.includes(term),
      label + " should include `" + term + "`."
    );
  });
}

function main() {
  const previewChecklist = fs.readFileSync(
    path.join(docsRoot, "STAGE3_LEAD_WRITE_PREVIEW_QA_CHECKLIST.md"),
    "utf8"
  );
  const gitPreviewChecklist = fs.readFileSync(
    path.join(docsRoot, "GIT_BASED_PREVIEW_DEPLOY_CHECKLIST.md"),
    "utf8"
  );

  assertIncludesAll(previewChecklist, [
    "Do not create a CLI draft deploy unless the human explicitly approves it.",
    "Do not use `--prod`.",
    "Confirm preview publishes `apps/web-tsx/out`.",
    "Confirm local gates passed immediately before the preview",
    "Capture preview URL, deploy ID, deploy timestamp, and any build warnings.",
    "STAGE3 PREVIEW QUOTE LEAD TEST",
    "`save-quote-request` returns 200.",
    "`operon_quote_requests.lead_id` is populated.",
    "`operon_lead_events.event_type = quote_submitted`.",
    "Public response does not include `lead_id`.",
    "STAGE3 PREVIEW CONTACT LEAD TEST",
    "Contact function returns 303 to `/contact-thank-you.html`.",
    "`operon_lead_events.event_type = contact_submitted`.",
    "Lead metadata stores message length, not full message.",
    "STAGE3 PREVIEW QUOTE REVIEW LEAD TEST",
    "Quote-review email returns `{ ok: true }` without echoing the submitted email address.",
    "`operon_quote_reviews.lead_id` is populated.",
    "`operon_lead_events.event_type = quote_review_saved`.",
    "Parent lead metadata does not contain raw OCR text.",
    "STAGE3 PREVIEW OPERATOR LEAD TEST",
    "`operon_lead_events.event_type = operator_request_submitted`.",
    "Parent lead metadata stores transcript count, not full transcript.",
    "Response includes `uploaded_file_id`.",
    "Response does not include bucket/path/signed URL.",
    "No file-only anonymous lead is created when no quote lead context exists.",
    "Customer-facing Function errors return bounded safe messages",
    "server logs record short reasons rather than raw provider error objects.",
    "No extra preview deploys are created for non-browser checks that can run locally."
  ], "Stage 3 preview QA checklist");

  assertIncludesAll(gitPreviewChecklist, [
    "Use this only after human approval to push a dev branch.",
    "For checks that can run locally without consuming Netlify deploy minutes.",
    "npm run build --prefix apps/web-tsx",
    "npm run test:local-gates",
    "git diff --check",
    "codex/stage3-lead-writes-preview",
    "Customer-facing Function errors are safe and bounded.",
    "Quote-review email responses do not echo customer email addresses.",
    "Do not use `--prod`."
  ], "Git-based preview checklist");

  console.log("stage3PreviewQaContract.test.js passed");
}

main();
