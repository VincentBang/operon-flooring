# Task 3.6 Lead Detail Implementation Checklist

Date: 2026-06-04

Do not start until Task 3.4 admin auth shell and Task 3.5 lead list are approved.

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

- `admin-lead-detail`

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

## Stop Conditions

Stop if:

- Admin auth is not approved.
- Detail view needs raw OCR or storage path to be useful; design a separate protected reveal flow first.
- Response safety contract fails.
