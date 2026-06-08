# Task 3.6 Lead Detail Implementation Checklist

Date: 2026-06-04

Do not start until Task 3.4 admin auth shell and Task 3.5 lead list are approved.

Local status: first protected lead-detail slice implemented behind the admin lead list.

## Objective

Show one protected internal lead detail view with quote, contact, quote-review, upload, notes, status, and event timeline context.

## Required Sections

- Customer details
- Project summary
- Quote summary
- Quote-review summary
- File/upload summary
- Missing/risk flags
- Notes
- Status controls
- Event timeline
- Next action

## Data Sources

Parent:

- `operon_leads`

Supporting:

- `operon_lead_events`
- `operon_lead_notes`
- `operon_lead_files`
- `operon_follow_ups`
- `operon_quote_requests`
- `operon_quote_reviews`
- `operon_uploaded_files`

## Function Contract

Use:

- `lead-dashboard?action=detail&lead_id=<uuid>`

Response must match:

- `STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md`

## Security Rules

- No raw OCR text by default.
- No raw uploaded quote text by default.
- No bucket/path.
- No signed URL by default.
- No supplier costs, margins, private rates, access multipliers, or internal pricing tables.

## UI Rules

- Internal operations layout.
- Fast scanning.
- Clear status and next action.
- Event timeline should be chronological and compact.
- Notes must be visibly internal.

## Tests

- Unauthenticated function call fails.
- Fixture coverage follows `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`.
- Valid fixture detail response passes admin response safety contract.
- Missing lead returns 404/customer-safe admin error.
- File section hides bucket/path.
- Event metadata is redacted.
- Public conversion tests still pass.

## Local Implementation

Implemented local files:

- `apps/web-tsx/src/app/admin/AdminLeadDetail.tsx`
- `internal-qa/tests/web/adminLeadDetailClientContract.test.js`

Current behavior:

- Detail panel appears only after a lead is selected from the authenticated lead list.
- Reads use `/.netlify/functions/lead-dashboard?action=detail&lead_id=<uuid>`.
- Reads are protected with `Authorization: Bearer <token>`.
- Customer, project, quote, status, next action, file metadata, notes and event timeline sections render from the safe dashboard response.
- File section displays safe filename/type/size/status only.
- No direct Supabase browser reads.
- No raw OCR text.
- No raw uploaded quote text.
- No storage bucket/path.
- No signed URL.
- No private pricing/rate fields.

Remaining for later slices:

- Status update controls.
- Note creation.
- Follow-up scheduling.
- Protected file reveal/download design if ever approved.

## Stop Conditions

Stop if:

- Admin auth is not approved.
- Detail view needs raw OCR or storage path to be useful; design a separate protected reveal flow first.
- Response safety contract fails.
