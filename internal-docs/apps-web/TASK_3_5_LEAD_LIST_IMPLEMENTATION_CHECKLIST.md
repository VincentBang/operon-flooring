# Task 3.5 Lead List Implementation Checklist

Date: 2026-06-04

Do not start until Task 3.4 admin auth shell is approved and built.

## Objective

Show a protected internal list of leads with enough context to decide the next action.

## Required Columns

- Created date
- Last activity
- Source
- Status
- Priority
- Name
- Suburb
- Product
- Estimate
- Confidence
- Missing info count
- Risk flag count
- Next action

## Function Contract

Use:

- `admin-leads-list`

Query:

- status/source/priority/product/suburb/date filters
- cursor pagination
- limit capped server-side

Response:

- Match `STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md`.

## UI Rules

- Dense but readable internal operations UI.
- No landing page.
- No marketing hero.
- No nested cards.
- No customer-visible public changes.
- Clear empty state.
- Clear loading state.
- Clear auth error state.

## Security Rules

- No direct browser Supabase reads.
- No private pricing/rate fields.
- No raw OCR text.
- No storage bucket/path.
- No full chatbot transcripts.

## Tests

- Unauthenticated function call fails.
- Authenticated fixture returns list rows.
- Fixture coverage follows `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`.
- Response safety contract passes.
- Pagination parameters are bounded.
- Filters map to safe query parameters.
- Public local gates pass.

## Stop Conditions

Stop if:

- Auth shell is not complete.
- Admin response safety contract fails.
- Any public conversion test fails.
- Lead list needs fields not present in `operon_leads`; update plan first.
