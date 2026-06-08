# Task 3.11 Reporting Dashboard Checklist

Date: 2026-06-04

Purpose: define the internal reporting dashboard before implementation.

Local status: first aggregate reporting summary slice implemented.

## MVP Metrics

- Lead volume by day/week
- Lead count by source
- Lead count by status
- Product category mix
- Suburb mix
- Average estimate total
- Quote-review usage
- Floorplan usage
- Contact enquiry volume
- Quote completion rate
- Product-to-quote handoff count

## Data Sources

- `operon_leads`
- `operon_lead_events`
- Existing quote/contact/review/upload detail tables through `lead_id`

## Filters

- Date range
- Lead source
- Status
- Product category
- Suburb

## Privacy Rules

- Reporting uses aggregate data by default.
- No raw OCR text.
- No storage paths.
- No internal rates, supplier costs, margins, or private pricing logic.
- Detail drilldown requires admin auth.

## Non-Goals

- No public analytics dashboard.
- No contractor scorecard yet.
- No revenue recognition or payment reporting.
- No margin reporting in browser.

## Tests Before Preview

- Unauthenticated access blocked.
- Responses use `Cache-Control: no-store`.
- Aggregate responses do not leak PII unless admin detail access is explicitly requested.
- Public conversion paths still pass.

## Local Implementation

Implemented local UI:

- `apps/web-tsx/src/app/admin/AdminReportingSummary.tsx`

Implemented local test:

- `internal-qa/tests/web/adminReviewQueuesClientContract.test.js`

Current behavior:

- Reporting summary appears only after admin token verification.
- Reads use `/.netlify/functions/lead-dashboard?action=summary`.
- Shows total leads, quote-review count, floorplan count, high-priority count, status mix, source mix, product mix and suburb mix.
- Aggregate-only in this slice.
- No raw OCR text.
- No storage paths.
- No internal rates, supplier costs, margins, or private pricing logic.
- Detail drilldown remains through the protected lead detail panel.
