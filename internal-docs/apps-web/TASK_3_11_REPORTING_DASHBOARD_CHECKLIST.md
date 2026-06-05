# Task 3.11 Reporting Dashboard Checklist

Date: 2026-06-04

Purpose: define the internal reporting dashboard before implementation.

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
