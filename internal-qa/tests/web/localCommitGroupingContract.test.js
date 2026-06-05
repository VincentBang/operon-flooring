const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const groupingPath = path.join(
  repoRoot,
  "internal-docs",
  "apps-web",
  "LOCAL_COMMIT_GROUPING_2026-06-04.md"
);

function main() {
  const content = fs.readFileSync(groupingPath, "utf8");

  [
    "No push or deploy has been run for this grouping.",
    "Group 1: Customer-Facing CSS Consistency",
    "Group 2: Stage 3 Lead Schema and Function Plumbing",
    "Group 3: Locked Admin Shell Scaffold",
    "Group 4: Privacy and Leak Guardrails",
    "Group 5: Stage 3-5 Planning Docs",
    "apps/web-tsx/src/styles/global.css",
    "internal-qa/tests/web/staticOutputContract.test.js",
    "netlify/functions/shared/leadWriter.js",
    "netlify/functions/_security.js",
    "netlify/functions/send-quote-review-email.js",
    "apps/web-tsx/src/app/admin/page.tsx",
    "netlify/functions/lead-dashboard.js",
    "leadDashboardFunctionContract.test.js",
    "leadDashboardRuntimeContract.test.js",
    "STAGE3_ADMIN_AUTH_FUNCTION_CONTRACT.md",
    "STAGE3_ADMIN_DISCOVERABILITY_GUARDRAIL.md",
    "Enforce admin Function 401/403 and `Cache-Control: no-store` response boundaries",
    "Keep the locked admin shell out of public header, footer, homepage, blog, sitemap, and CTA links until auth/route behavior is approved.",
    "Keep that read Function unwired from `/admin.html`",
    "internal-qa/fixtures/pricingMigrationScenarios.js",
    "pricingMigrationScenariosContract.test.js",
    "TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md",
    "Keep the runtime removal sequence explicit: quote fallback first, tracking writes second, public Supabase browser config third, strict RLS last.",
    "TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md",
    "Define the inactive no-direct-browser-write acceptance state before flipping the current inventory baseline.",
    "TASK_A2_QUOTE_FALLBACK_REMOVAL_READINESS.md",
    "TASK_A2_TRACKING_WRITE_DECISION.md",
    "Track that no direct browser Supabase write targets remain in the checked public runtimes.",
    "Pin the server-side quote save capabilities and preview requirements after browser quote fallback removal.",
    "Pin the tracking decision to remove Supabase browser writes before adding any high-volume tracking Function.",
    "LOCAL_VERIFICATION_RUNBOOK.md",
    "customer-facing Function response/log boundaries",
    "STAGE4_PRICING_MIGRATION_TEST_PLAN.md",
    "Do not push without explicit approval."
  ].forEach(function (term) {
    assert.ok(content.includes(term), "Local commit grouping missing `" + term + "`.");
  });

  console.log("localCommitGroupingContract.test.js passed");
}

main();
