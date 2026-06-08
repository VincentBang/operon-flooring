# Stage 3 Lead OS Implementation Status

Date: 2026-06-04

## Current State

The additive Stage 3 lead schema has been applied to the Operon Flooring Supabase project.

Applied migrations:

- `stage3_lead_operating_system`
- `stage3_lead_fk_indexes`

New tables:

- `operon_leads`
- `operon_lead_events`
- `operon_lead_notes`
- `operon_lead_files`
- `operon_follow_ups`
- `operon_floorplan_reviews`
- `operon_lead_status_history`

Existing table links added:

- `operon_quote_requests.lead_id`
- `operon_quote_reviews.lead_id`
- `operon_uploaded_files.lead_id`

Security posture:

- RLS enabled on all new Stage 3 tables.
- `anon` and `authenticated` table grants revoked for new Stage 3 tables.
- `service_role` has table access.
- Public website reads/writes should continue through Netlify Functions, not direct browser Supabase access.

## Verified

Supabase schema contract was verified with a synthetic SQL probe:

- Inserted a temporary quote row.
- Inserted a temporary parent lead row.
- Linked `operon_quote_requests.lead_id` to `operon_leads.id`.
- Inserted an `operon_lead_events` row.
- Deleted the temporary rows.

No customer rows were dumped or printed.

Local checks passed after the function changes:

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks`
- `git diff --check`
- `node internal-qa/tests/web/quoteCalculator.validation.js`
- `node internal-qa/tests/web/quoteConfidence.test.js`
- `node internal-qa/tests/web/floorplanMeasurement.test.js`
- `node internal-qa/tests/web/floorplanQuickRoom.test.js`
- `node internal-qa/tests/web/quoteReviewParser.test.js`
- `node internal-qa/tests/chatbot/chatbot.test.js`
- `node internal-qa/tests/web/leadQualification.test.js`
- `node internal-qa/tests/web/leadWriterContract.test.js`
- `node internal-qa/tests/web/contactLeadContract.test.js`
- `node internal-qa/tests/web/quoteReviewLeadContract.test.js`
- `node internal-qa/tests/web/operatorLeadContract.test.js`
- `node internal-qa/tests/web/uploadLeadLinkContract.test.js`
- `npm run test:stage3`

## Local Function Work

The following functions now have local Stage 3 lead-write plumbing:

- `save-quote-request`
- `contact-enquiry`
- `save-quote-review`
- `operator-chat-request`
- `upload-customer-file` link-only behavior when a quote already has a parent lead

`save-quote-request` derives a parent lead after the existing quote save/email/follow-up path completes.

`contact-enquiry` derives a parent lead after the internal contact email succeeds.

`save-quote-review` derives a parent lead after the existing quote-review row is saved.

`operator-chat-request` derives a parent lead after the existing email success path completes.

`upload-customer-file` does not create anonymous file-only leads. It links uploaded file metadata to an existing quote lead only when a valid quote context already has `lead_id`.

The lead write is non-blocking:

- Quote save remains the primary customer path.
- If an additive lead write fails, the customer response still follows the existing success path.
- No public response fields were added.
- Pricing logic, quote calculation, product data, floorplan, quote-review, chatbot, upload, OCR, and email behavior were not changed.

The lead writer helper lives at:

- `netlify/functions/shared/leadWriter.js`

It intentionally does not live at the Netlify function root, so it is not packaged as a standalone public function endpoint.

The consolidated local Stage 3 contract command is:

- `npm run test:stage3`

Additional local finding:

- `upload-customer-file` had a malformed UUID validator that treated valid quote IDs as invalid and placed uploads under `unassigned`. This was fixed locally so quote-scoped uploads can link to existing quote leads. The browser response remains privacy-safe and still does not expose bucket/path/signed URL fields.

## Local Admin Shell Scaffold

A locked local admin shell has been scaffolded at:

- `apps/web-tsx/src/app/admin/page.tsx`

Current behavior:

- Generated route target: `/admin.html`
- Metadata path: `/admin.html`
- Robots: `noindex,nofollow`
- Rendered state: locked message only
- Lead data rendered: none
- Direct Supabase browser access: none
- Admin function calls: none
- Customer-facing public routes changed by this shell: none

This is not a completed admin auth implementation. It is only a safe placeholder for the future Stage 3 admin surface.

## Local Admin Auth Status Function

The first admin-auth Function slice has been added locally:

- `netlify/functions/shared/adminAuth.js`
- `netlify/functions/admin-session-status.js`
- `internal-qa/tests/web/adminSessionStatusContract.test.js`

Purpose:

- Provide a safe admin session probe for later UI work.
- Keep the admin token server-side.
- Return only authentication state, never lead data.
- Avoid Supabase reads until the admin UI and read path are explicitly approved.

Current local behavior:

- Missing configured admin token returns `503`.
- Missing request token returns `401`.
- Invalid request token returns `403`.
- Valid request token returns `{ ok: true, authenticated: true, role: "admin", access: "admin_shell" }`.
- Responses use `Cache-Control: no-store`.

The `/admin.html` shell remains locked and makes no Function calls.

Local auth-shell UI has also been added:

- `apps/web-tsx/src/app/admin/AdminAuthShell.tsx`
- `internal-qa/tests/web/adminAuthShellClientContract.test.js`

The shell now checks `/.netlify/functions/admin-session-status`, but still renders no lead/customer data and does not call `lead-dashboard`.

## Local Lead List Slice

The first protected lead-list UI slice has been added locally:

- `apps/web-tsx/src/app/admin/AdminLeadList.tsx`
- `internal-qa/tests/web/adminLeadListClientContract.test.js`

Current behavior:

- Lead list appears only after a successful admin token check.
- It reads through `/.netlify/functions/lead-dashboard?action=list&limit=50`.
- It does not use direct browser Supabase reads.
- It renders only safe list columns from the unified `operon_leads` parent model.
- It does not render lead detail, file paths, storage buckets, raw OCR text, private pricing, notes, or follow-up controls yet.

## Local Lead Detail Slice

The first protected lead-detail UI slice has been added locally:

- `apps/web-tsx/src/app/admin/AdminLeadDetail.tsx`
- `internal-qa/tests/web/adminLeadDetailClientContract.test.js`

Current behavior:

- Detail appears only after selecting a row from the authenticated lead list.
- It reads through `/.netlify/functions/lead-dashboard?action=detail&lead_id=<uuid>`.
- It renders customer, project, quote, missing/risk flags, linked statuses, safe file metadata, notes and event timeline.
- It does not render storage bucket/path, signed URLs, raw OCR text, raw uploaded quote text, private pricing, or internal rates.
- Status update controls, note creation, and follow-up scheduling are not connected yet.

## Local Status Pipeline Slice

The first protected lead status pipeline slice has been added locally:

- `netlify/functions/lead-status-admin.js`
- `internal-qa/tests/web/leadStatusAdminContract.test.js`
- Status update form in `apps/web-tsx/src/app/admin/AdminLeadDetail.tsx`

Current behavior:

- Status changes require admin token auth.
- Valid statuses match the existing `operon_leads.status` check constraint.
- The server updates `operon_leads.status`, `updated_at`, and `last_activity_at`.
- The server inserts `operon_lead_status_history`.
- The server inserts `operon_lead_events` with `event_type = lead_status_changed`.
- Terminal statuses require browser confirmation.
- No customer-facing public flow or pricing logic is changed.

Preview/live verification is still required before real operator use.

## Local Follow-Up Queue Slice

The first protected dry-run/manual follow-up queue slice has been added locally:

- `netlify/functions/lead-followup-admin.js`
- `apps/web-tsx/src/app/admin/AdminFollowUpQueue.tsx`
- `internal-qa/tests/web/leadFollowupAdminContract.test.js`
- `internal-qa/tests/web/adminFollowUpQueueClientContract.test.js`

Current behavior:

- Queue appears only after admin token verification.
- It lists open follow-ups from `operon_follow_ups` with safe linked lead summaries.
- It supports manual mark done, snooze two days, and cancel actions.
- It inserts admin events for follow-up actions.
- It does not send email or SMS.
- It does not perform bulk outreach or contractor dispatch.
- It does not expose private pricing, storage paths, signed URLs, or raw OCR/upload text.

Preview/live verification is still required before real operator use.

## Local Review Queues And Reporting Slice

The first read-only queue/reporting slice has been added locally:

- `apps/web-tsx/src/app/admin/AdminReviewQueues.tsx`
- `apps/web-tsx/src/app/admin/AdminReportingSummary.tsx`
- `internal-qa/tests/web/adminReviewQueuesClientContract.test.js`

Current behavior:

- Quote-review queue reads `lead-dashboard?action=list&source=quote_review&limit=25`.
- Floorplan queue reads `lead-dashboard?action=list&source=floorplan&limit=25`.
- Reporting summary reads `lead-dashboard?action=summary`.
- All panels appear only after admin token verification.
- Panels are read-only and aggregate/safe-list oriented.
- No raw OCR text, storage paths, signed URLs, private pricing, margins, supplier costs, or internal rates are rendered.

Preview/live verification is still required before real operator use.

Before any deploy or preview that includes this shell, verify:

1. `/admin.html` remains locked and `noindex,nofollow`.
2. `/admin.html` is not present in `sitemap.xml`.
3. `/admin` behavior is explicitly accepted, redirected, or blocked so it does not create an unintended indexable duplicate surface.
4. No lead/customer/upload/quote table names or private fields appear in the generated admin output.

## Netlify Preview Verification Blocker

Draft deploy verification is not complete.

Observed behavior:

- Netlify CLI authenticated and linked to the `operonflooring` site.
- Full draft deploys stalled during local function upload.
- A reduced draft deploy with only `save-quote-request.zip` also stalled.
- Draft records were created but did not become `ready`.
- The stuck draft records were cancelled and now show `error`.

Most likely cause:

- Local Netlify CLI upload path or network stream stall, not schema or function syntax.

Additional finding:

- `netlify env:list --json` masks secret values, so production function env cannot be used for local function execution from this shell.

## Safe Next Verification Options

Preferred:

1. Commit these local changes to a dev branch.
2. Push the dev branch only after approval.
3. Let Netlify perform a normal Git-based branch/deploy-preview build.
4. Submit one preview quote.
5. Verify:
   - `operon_quote_requests` row exists.
   - `operon_quote_requests.lead_id` is populated.
   - `operon_leads` row exists.
   - `operon_lead_events` contains a `quote_submitted` event.
6. Delete or mark the synthetic preview lead as a test record.

Fallback:

- Provide a temporary local shell export for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then run the function locally with a synthetic payload and email sending disabled.

Current connector note:

- A read-only Supabase verification attempt on 2026-06-04 was blocked because the Supabase app connection requires reauthentication.
- No customer data was returned.
- Reauthenticate the Supabase connector before running `STAGE3_SUPABASE_VERIFICATION_QUERIES.sql` from this workspace.

Do not:

- Production deploy.
- Use `--prod`.
- Push without explicit approval.
- Change pricing, product, quote, floorplan, quote-review, chatbot, OCR, upload, or email logic to solve this verification blocker.

## Remaining Stage 3 Work

Next approved implementation candidates:

1. Verify the local function write paths in a Git-based Netlify branch preview after human approval.
2. Add backfill SQL for existing quote/contact/review/upload rows.
3. Add dashboard read-function contracts.
4. Choose and approve the admin auth model.
5. Connect the locked admin shell to protected admin functions only after lead write paths and auth are verified.
