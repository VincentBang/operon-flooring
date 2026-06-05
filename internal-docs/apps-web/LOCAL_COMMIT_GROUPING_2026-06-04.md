# Local Commit Grouping - 2026-06-04

Purpose: organize the current local-only Operon Flooring work before any approved commit, push, preview, or production action.

No push or deploy has been run for this grouping.

## Group 1: Customer-Facing CSS Consistency

Files:

- `apps/web-tsx/src/styles/global.css`
- `internal-qa/tests/web/staticOutputContract.test.js`
- `internal-qa/tests/web/footerCssContract.test.js`
- `internal-qa/tests/web/headerCssContract.test.js`
- `internal-qa/tests/web/logoConsistencyContract.test.js`

Purpose:

- Stabilize shared header sizing.
- Make the footer use consistent wrapping and column behavior.
- Prevent footer word overlap.
- Keep logo filename/alt usage consistent across representative output pages.
- Keep logo filename/alt usage consistent across every generated page using the shared header or footer.
- Keep sitemap/noindex/canonical output guardrails in place after local builds.

Required approval before production:

- Visual QA on key desktop and mobile pages.

## Group 2: Stage 3 Lead Schema and Function Plumbing

Files:

- `supabase/migrations/20260604_stage3_lead_operating_system.sql`
- `supabase/migrations/20260604_stage3_lead_fk_indexes.sql`
- `netlify/functions/shared/leadWriter.js`
- `netlify/functions/_security.js`
- `netlify/functions/save-quote-request.js`
- `netlify/functions/contact-enquiry.js`
- `netlify/functions/save-quote-review.js`
- `netlify/functions/send-quote-review-email.js`
- `netlify/functions/operator-chat-request.js`
- `netlify/functions/upload-customer-file.js`
- Stage 3 lead writer tests under `internal-qa/tests/web`

Purpose:

- Add non-blocking lead creation/linking after existing customer actions.
- Keep existing public responses stable.
- Keep upload file leads link-only unless parent quote lead exists.
- Avoid exposing `lead_id`, storage bucket, storage path, or private fields to browser responses.
- Keep public error messages, JSON validation responses, and server log reasons bounded and customer-safe.

Required approval before production:

- Git-based preview or approved equivalent function QA.
- Supabase connector/database verification that real quote/contact/review/operator writes populate `operon_leads` and `operon_lead_events`.

## Group 3: Locked Admin Shell Scaffold

Files:

- `apps/web-tsx/src/app/admin/page.tsx`
- `netlify/functions/lead-dashboard.js`
- `internal-qa/tests/web/adminShellStaticContract.test.js`
- `internal-qa/tests/web/adminAuthPlanContract.test.js`
- `internal-qa/tests/web/leadDashboardFunctionContract.test.js`
- `internal-qa/tests/web/leadDashboardRuntimeContract.test.js`
- `internal-qa/fixtures/adminLeadFixtures.js`
- `internal-docs/apps-web/STAGE3_ADMIN_AUTH_DECISION_MATRIX.md`
- `internal-docs/apps-web/STAGE3_ADMIN_AUTH_FUNCTION_CONTRACT.md`
- `internal-docs/apps-web/STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md`
- `internal-docs/apps-web/STAGE3_ADMIN_DISCOVERABILITY_GUARDRAIL.md`
- `internal-docs/apps-web/STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`
- `internal-docs/apps-web/STAGE3_ADMIN_AUTH_SHELL_PLAN.md`
- `internal-docs/apps-web/TASK_3_4_ADMIN_AUTH_SHELL_IMPLEMENTATION_CHECKLIST.md`

Purpose:

- Reserve `/admin.html` as a locked, noindex shell.
- Render no lead data.
- Use no direct Supabase browser access.
- Keep admin output out of sitemap.
- Keep the locked admin shell out of public header, footer, homepage, blog, sitemap, and CTA links until auth/route behavior is approved.
- Provide a protected, read-only `operon_leads` Function surface for future list/detail/summary dashboard work.
- Keep that read Function unwired from `/admin.html` until the admin UI is approved.

Required approval before production:

- Decide `/admin` route behavior.
- Use `STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md` before any deploy that includes the shell.
- Choose admin auth model.
- Enforce admin Function 401/403 and `Cache-Control: no-store` response boundaries before any data reads.
- Verify `lead-dashboard.js` returns only safe list/detail/summary shapes and no storage path, raw OCR, or internal pricing fields.
- Verify `/admin.html` remains locked and `noindex,nofollow`.

## Group 4: Privacy and Leak Guardrails

Files:

- `internal-qa/tests/web/pricingLeakContract.test.js`
- `internal-qa/fixtures/pricingMigrationScenarios.js`
- `internal-qa/tests/web/pricingMigrationScenariosContract.test.js`
- `internal-qa/tests/web/directBrowserSupabaseInventory.test.js`
- `internal-qa/tests/web/publicFunctionResponseSafetyContract.test.js`
- `internal-qa/tests/web/securityPolicyContract.test.js`
- `internal-docs/apps-web/DIRECT_BROWSER_SUPABASE_WRITE_INVENTORY.md`
- `internal-docs/apps-web/TASK_A2_DIRECT_BROWSER_SUPABASE_FUNCTION_ROUTE_PLAN.md`
- `internal-docs/apps-web/TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md`
- `internal-docs/apps-web/TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md`
- `internal-docs/apps-web/TASK_A2_QUOTE_FALLBACK_REMOVAL_READINESS.md`
- `internal-docs/apps-web/TASK_A2_TRACKING_WRITE_DECISION.md`
- `internal-docs/apps-web/LOCAL_VERIFICATION_RUNBOOK.md`
- `internal-docs/apps-web/STAGE4_PRICING_MIGRATION_TEST_PLAN.md`

Purpose:

- Track known public pricing-support exposure until Stage 4 migration.
- Track that no direct browser Supabase write targets remain in the checked public runtimes.
- Keep the runtime removal sequence explicit: quote fallback first, tracking writes second, public Supabase browser config third, strict RLS last.
- Define the inactive no-direct-browser-write acceptance state before flipping the current inventory baseline.
- Pin the server-side quote save capabilities and preview requirements after browser quote fallback removal.
- Pin the tracking decision to remove Supabase browser writes before adding any high-volume tracking Function.
- Guard upload, OCR, and quote response boundaries.
- Guard quote-review email response minimisation and customer-facing Function response/log boundaries.
- Define the parity/leak fixture evidence required before moving pricing-support data server-side.

Required approval before production:

- Confirm upload metadata privacy change is desired in production.
- Confirm no strict RLS migration is applied before direct browser writes are routed or accepted.

## Group 5: Stage 3-5 Planning Docs

Files:

- `internal-docs/apps-web/STAGE3_*`
- `internal-docs/apps-web/TASK_3_*`
- `internal-docs/apps-web/STAGE4_*`
- `internal-docs/apps-web/STAGE5_*`
- `internal-docs/apps-web/OPERON_OS_IMPLEMENTATION_INDEX.md`
- `internal-docs/apps-web/LOCAL_CHANGESET_REVIEW_2026-06-04.md`
- `internal-docs/apps-web/LOCAL_VERIFICATION_RUNBOOK.md`
- `internal-docs/apps-web/OVERNIGHT_TASK_LOG_2026-06-04.md`

Purpose:

- Preserve the approved Stage 3-5 sequence.
- Keep implementation from jumping ahead of lead-write verification, admin auth, or server-side pricing boundaries.

## Suggested Commit Strategy

If approved later, prefer one of these:

1. One local release-prep commit if the user wants a single checkpoint.
2. Separate commits by group if review clarity matters:
   - CSS/header/footer consistency
   - Stage 3 lead schema and function plumbing
   - Locked admin shell scaffold
   - Privacy/leak guardrails
   - Stage 3-5 planning docs

Do not push without explicit approval.
