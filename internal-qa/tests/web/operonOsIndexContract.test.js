const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const indexPath = path.join(repoRoot, "internal-docs", "apps-web", "OPERON_OS_IMPLEMENTATION_INDEX.md");

function main() {
  const content = fs.readFileSync(indexPath, "utf8");

  [
    "No production deploy",
    "npm run test:local-gates",
    "LOCAL_COMMIT_GROUPING_2026-06-04.md",
    "STAGE3_ADMIN_DASHBOARD_MVP_PLAN.md",
    "STAGE3_ADMIN_AUTH_DECISION_MATRIX.md",
    "STAGE3_ADMIN_AUTH_FUNCTION_CONTRACT.md",
    "STAGE3_ADMIN_FUNCTION_GAP_REGISTER.md",
    "STAGE3_ADMIN_DISCOVERABILITY_GUARDRAIL.md",
    "STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md",
    "STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md",
    "STAGE3_DASHBOARD_SECURITY_TEST_PLAN.md",
    "STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md",
    "STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md",
    "STAGE3_SUPABASE_SCHEMA_VERIFICATION_2026-06-05.md",
    "20260604_stage3_lead_operating_system.sql",
    "TASK_3_4_ADMIN_AUTH_SHELL_IMPLEMENTATION_CHECKLIST.md",
    "STAGE4_SERVER_SIDE_PRICING_MIGRATION_PLAN.md",
    "STAGE4_OPERON_KITCHENS_INTEGRATION_PLAN.md",
    "STAGE5_PARTNER_NETWORK_CRITERIA.md",
    "No direct browser Supabase write targets remain in the checked public runtimes.",
    "TASK_A2_DIRECT_BROWSER_SUPABASE_FUNCTION_ROUTE_PLAN.md",
    "TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md",
    "TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md",
    "TASK_A2_QUOTE_FALLBACK_REMOVAL_READINESS.md",
    "TASK_A2_TRACKING_WRITE_DECISION.md",
    "Quote fallback writes have been removed locally from `quoteRuntime.js`; approved preview proof is still required before production.",
    "Tracking direct browser writes have been removed locally from `tracking.js`; approved preview proof is still required before production.",
    "Strict RLS/GraphQL hardening should wait until no-direct-browser-write contracts pass.",
    "Netlify draft deploys should be minimized"
  ].forEach(function (term) {
    assert.ok(content.includes(term), "Operon OS index missing `" + term + "`.");
  });

  console.log("operonOsIndexContract.test.js passed");
}

main();
