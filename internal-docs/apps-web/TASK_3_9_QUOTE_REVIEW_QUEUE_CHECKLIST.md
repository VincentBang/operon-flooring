# Task 3.9 Quote Review Queue Checklist

Date: 2026-06-04

Purpose: define the internal quote-review queue before implementation.

Local status: first read-only quote-review queue slice implemented.

## Scope

Show internal quote-review leads where a customer used:

- Quick completeness check
- Uploaded quote review
- Quote-review email
- Quote-review to quote handoff

## Data Sources

- `operon_leads`
- `operon_quote_reviews`
- `operon_lead_events`
- `operon_lead_files`

## List Fields

- Created date
- Customer name
- Suburb
- Product category
- Review mode
- Readiness score
- Confidence level
- Missing item count
- Risk flag count
- Uploaded file status
- Next action
- Lead status

## Detail Fields

- Safe quote-review summary
- Missing items
- Risk flags
- Top questions
- Customer-safe extracted fields
- Upload metadata
- Handoff to comparison quote status
- Timeline events

## Privacy Rules

- Do not show raw OCR text by default.
- Do not return storage bucket/path to the browser.
- Signed file access, if ever added, must be admin-only and short-lived.
- Do not expose pricing internals or supplier costs.

## First Version Actions

- Mark review as needs follow-up.
- Add internal note.
- Schedule follow-up.
- Link to related quote lead if available.

## Non-Goals

- No customer login.
- No public quote-review archive.
- No automatic contractor messaging.
- No OCR infrastructure changes.

## Tests Before Preview

- Queue excludes unrelated contact-only leads.
- Unauthenticated access blocked.
- Response blocks raw OCR, storage paths, and pricing internals.
- Quote-review public page still works.

## Local Implementation

Implemented local UI:

- `apps/web-tsx/src/app/admin/AdminReviewQueues.tsx`

Implemented local test:

- `internal-qa/tests/web/adminReviewQueuesClientContract.test.js`

Current behavior:

- Queue appears only after admin token verification.
- Reads use `/.netlify/functions/lead-dashboard?action=list&source=quote_review&limit=25`.
- Shows customer name, suburb, source detail, product category, quote-review status, confidence, missing count, risk count and next action.
- Read-only in this slice.
- Follow-up and status actions are handled through the lead detail/status/follow-up controls.
- No raw OCR text.
- No storage bucket/path.
- No signed URLs.
- No private pricing fields.
