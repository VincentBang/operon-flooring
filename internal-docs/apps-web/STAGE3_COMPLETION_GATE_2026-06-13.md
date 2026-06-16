# Stage 3 Completion Gate

Date: 2026-06-13

Scope: Operon Flooring Stage 3 internal lead operating system readiness checkpoint. This is local/source-control evidence only. No production deploy, Netlify deploy, push, Supabase policy change, pricing change, quote logic change, product logic change, floorplan change, quote-review change, chatbot rewrite, upload/OCR change or email/backend change was performed for this gate.

## Current Verdict

Stage 3 is locally implementation-complete for a protected MVP, but not live-complete for operator use.

The local implementation covers:

- Unified lead write contracts for quote, contact, quote-review, operator/chatbot and upload link-only paths.
- Non-blocking lead writes so public conversion paths do not fail if Stage 3 writes fail.
- Protected admin shell at `/admin.html`.
- Read-only lead list and lead detail.
- Lead status pipeline.
- Manual dry-run follow-up queue.
- Quote-review and floorplan review queues.
- Reporting summary.
- Chatbot-qualified lead event read surface and safe detail view.
- Admin response and runtime safety contracts.
- Stage 3 preview QA checklist and Git-based preview checklist.

The remaining blockers are preview/live verification and deployment decisions, not missing local code.

## Local Verification Run

Passed on 2026-06-13:

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks` from repo root
- `git diff --check`
- `npm run test:stage3`
- `node internal-qa/tests/web/chatbotLeadEventContract.test.js`
- `node internal-qa/tests/web/adminResponseSafetyContract.test.js`
- `node internal-qa/tests/web/adminLeadFixturesContract.test.js`
- `node internal-qa/tests/web/adminSessionStatusContract.test.js`
- `node internal-qa/tests/web/adminAuthShellClientContract.test.js`
- `node internal-qa/tests/web/adminLeadListClientContract.test.js`
- `node internal-qa/tests/web/adminLeadDetailClientContract.test.js`
- `node internal-qa/tests/web/leadStatusAdminContract.test.js`
- `node internal-qa/tests/web/leadFollowupAdminContract.test.js`
- `node internal-qa/tests/web/adminFollowUpQueueClientContract.test.js`
- `node internal-qa/tests/web/adminReviewQueuesClientContract.test.js`
- `node internal-qa/tests/web/adminFunctionRuntimeSafetyContract.test.js`
- `node internal-qa/tests/web/adminFunctionGapRegisterContract.test.js`
- `node internal-qa/tests/web/adminDiscoverabilityGuardrailContract.test.js`
- `node internal-qa/tests/web/leadDashboardFunctionContract.test.js`
- `node internal-qa/tests/web/leadDashboardRuntimeContract.test.js`
- `node internal-qa/tests/web/leadStatusContract.test.js`
- `node internal-qa/tests/web/stage3SchemaDocsContract.test.js`
- `node internal-qa/tests/web/stage3PreviewQaContract.test.js`

Note: `npm run check:public-leaks` is not defined inside `apps/web-tsx`; the repo-root command is the valid leak check.

## Supabase Security Readout

Latest read-only Supabase verification supplied from SQL status rows:

- Existing checked private lead/quote/upload/event tables have RLS enabled.
- `anon`/`authenticated` table privileges on checked sensitive tables: pass.
- Public `pg_policies` exposure on checked sensitive tables: pass.
- GraphQL-sensitive table grants: pass.
- `quote-files` bucket is private.
- `storage.objects` anon policy exposure: pass.
- `floorplan-files` bucket appears missing in the checked project and needs a product decision only if future floorplan storage expects a separate bucket.

Important mismatch to resolve before live Stage 3 chatbot dashboard use:

- `operon_chatbot_qualifications` exists in local migration `supabase/migrations/20260611_chatbot_qualification_bridge.sql`.
- The latest live SQL status rows listed `operon_chatbot_qualifications` as missing.
- The local admin chatbot-qualified lead view reads from `operon_chatbot_qualifications`.
- Therefore the chatbot qualification bridge migration must be applied and reverified before enabling that dashboard panel in a live preview/production context.

## Release Blockers

Stage 3 should not be considered complete for live operator use until all of these are done:

1. Apply and verify the chatbot qualification bridge migration, or deliberately disable the `operon_chatbot_qualifications` dashboard panel until it exists.
2. Decide admin route behavior for `/admin` versus `/admin.html` before any deploy containing the admin shell.
3. Configure and verify the approved admin auth environment variable without printing or committing it.
4. Run a Git-based Netlify branch preview because previous CLI draft deploy uploads stalled.
5. Verify preview publishes `apps/web-tsx/out` and uses the expected `netlify/functions`.
6. Verify unauthenticated admin function requests return 401/403 and never return lead data.
7. Verify authenticated admin list/detail/status/follow-up/review/reporting requests against real preview data.
8. Verify quote, contact, quote-review, upload, product handoff and floorplan handoff still work after Stage 3 functions are present.
9. Verify public leak probes and source-map probes on the preview.
10. Confirm admin pages remain `noindex,nofollow` and absent from sitemap.

## Safe Next Task

Task 3 Completion Preview Gate:

1. Keep code unchanged.
2. Apply or confirm the additive `operon_chatbot_qualifications` migration in Supabase after approval.
3. Push a dev branch only after approval so Netlify can create a Git-based preview.
4. Run the Stage 3 preview checklist in `internal-docs/apps-web/STAGE3_LEAD_WRITE_PREVIEW_QA_CHECKLIST.md`.
5. If preview passes, prepare a narrow release commit and a separate production approval request.

## Not In Scope For This Gate

- Backfilling historical leads.
- Auto-sending follow-up emails or SMS.
- Customer login.
- Contractor login.
- Marketplace workflows.
- Server-side pricing migration.
- Logo/asset cleanup.
- Multiple lockfile cleanup.
- Any production deploy.

## 2026-06-17 Local Hardening Update

Additional local hardening completed:

- Added `npm run test:stage3-full`.
- Added `stage3CompletionGateContract.test.js`.
- Added `STAGE3_CHATBOT_LEAD_ENDPOINT_DECISION.md`.
- Added `stage3ChatbotEndpointDecisionContract.test.js`.
- Updated `STAGE3_SUPABASE_VERIFICATION_QUERIES.sql` to include `operon_chatbot_qualifications`.
- Updated preview QA to include admin dashboard and chatbot qualification checks.
- Switched `lead-dashboard.js` to the shared timing-safe admin auth helper.
- Updated admin shell copy so it no longer claims dashboard modules are disconnected after auth.
- Tightened follow-up dry-run-only guardrails.
- Tightened admin/dashboard response leak guardrails for raw transcript, raw quote text and uploaded file text.
- Updated `/admin` versus `/admin.html` route-surface notes against current generated output.

Additional local verification passed:

- `npm run build` in `apps/web-tsx`
- `npm run test:stage3-full`
- `npm run check:public-leaks`
- `npm run test:static-output`
- `npm run test:conversion`
- `node internal-qa/tests/web/localPublicProbeContract.test.js`
- `node internal-qa/tests/web/adminShellStaticContract.test.js`
- `node internal-qa/tests/web/adminDiscoverabilityGuardrailContract.test.js`
- `git diff --check`

Current approval gate remains unchanged:

- Do not deploy or push Stage 3 until human approves a Git-based preview.
- Apply/verify `operon_chatbot_qualifications` or disable the chatbot-qualified lead panel before live admin use.
- Decide `/admin` route behavior before production.
- Configure admin auth env without exposing secrets.
- Run full preview QA against real Netlify Functions and Supabase rows.
