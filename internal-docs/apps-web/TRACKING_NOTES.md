# Operon Tracking Notes

Last updated: 2026-05-19

## Primary Funnel Events

| Event | Where it fires | Purpose |
| --- | --- | --- |
| `quote_start` | Quote wizard start | Counts quote-flow entry. |
| `quote_step_complete` | Wizard step progression | Measures step-level completion. |
| `quote_result_view` | First calculated quote result per unique estimate signature | Measures when a customer sees a usable quote result. |
| `quote_submit` | Final quote submit attempt | Measures submit intent before backend response. |
| `quote_email_send_attempt` | Submit/email-copy path | Measures customer-email follow-up attempts. |
| `quote_email_send_success` | Submit/email-copy path | Measures customer/internal email send success. |
| `quote_email_send_failed` | Submit/email-copy path | Measures non-blocking email failure. |
| `product_selected` | Catalogue/quote product selection | Measures product intent. |
| `quote_review_start` | Quote review start CTA | Measures quote-review entry. |
| `quote_review_to_quote` | Quote review to quote CTA | Measures review-to-estimate handoff. |
| `floorplan_upload_start` | Floorplan upload helper | Measures floorplan tool engagement. |
| `floorplan_to_quote` | Floorplan area sent to quote | Measures floorplan-to-quote conversion. |

## Tracking Rules

- Tracking must never block quote, review or floorplan UX.
- GA4 receives sanitized event parameters only.
- Local tracking state keeps richer metadata in `localStorage` and optional Supabase event logging.
- Legacy alias events remain where already used, so historical reporting does not break.

## QA Checks

- Use `?debug_tracking=1` on the URL to log tracking calls in the browser console.
- Complete the homepage-to-quote path and confirm `quote_start`, step events, `quote_result_view`, `quote_submit`, and email events.
- Complete quote-review-to-quote and confirm `quote_review_start` and `quote_review_to_quote`.
- Complete floorplan-to-quote and confirm `floorplan_upload_start` and `floorplan_to_quote`.
