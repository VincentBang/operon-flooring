# Operon Status

Last updated: 2026-05-19

## Funnel Status

- Homepage CTA, quote review CTA, quote wizard, floorplan handoff and product-selection paths remain active.
- Quote flow remains the existing 6-step wizard: Property, Flooring, Area, Stairs, Extras, Summary.
- Pricing formulas, product calculation logic and floorplan measurement logic were not changed in this pass.
- Quote result remains visible before submit; email is a follow-up layer, not a gate.

## Tracking Status

The quote acquisition funnel now has explicit tracking coverage for:

- `quote_start`
- `quote_step_complete`
- `quote_result_view`
- `quote_submit`
- `quote_email_send_attempt`
- `quote_email_send_success`
- `quote_email_send_failed`
- `product_selected`
- `quote_review_start`
- `quote_review_to_quote`
- `floorplan_upload_start`
- `floorplan_to_quote`

Historical alias events are still emitted for continuity where they already existed.

## Email Status

- Customer quote summaries are sent only through Netlify Functions when Resend is configured.
- Internal lead notifications are attempted on quote submit when `OPERON_INTERNAL_EMAIL` is configured.
- Customer emails show totals only and do not expose unit rates, margins or raw pricing formulas.
- Quote submission is not blocked if customer or internal email sending fails.

## Remaining External QA

- Verify a live Netlify deploy with real `RESEND_API_KEY`, `OPERON_FROM_EMAIL` and `OPERON_INTERNAL_EMAIL`.
- Confirm customer quote email delivery in Resend logs.
- Confirm internal lead notification delivery.
- Confirm GA4 DebugView receives the expected funnel events on the production domain.
