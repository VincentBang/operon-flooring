# Task A2 No Direct Browser Write Acceptance Contract

Date: 2026-06-04

Purpose: define the exact pass condition for Task A2 after the remaining browser Supabase writes are removed. This source contract is now active locally; production still requires approved preview QA proving quote, product, floorplan, quote-review, contact, and upload paths still work.

## Activation Rule

Keep this as a blocking source test because:

- Phase 1 of `TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md` removes quote runtime direct table fallback writes.
- Phase 2 removes or disables tracking direct Supabase writes.
- Local gates pass.

Production still requires approved draft preview QA before deployment.

## Public Runtime Must Not Contain

The public browser runtime must not contain:

- `.from("quote_requests")`
- `.from("quote_rooms")`
- `.from("quote_items")`
- `.from("quote_funnel_sessions")`
- `.from("quote_events")`
- `sendToSupabase("quote_funnel_sessions"`
- `sendToSupabase("quote_events"`
- browser writes to any `operon_` lead/upload/review/event table
- raw storage bucket/path writes
- raw OCR text writes
- internal pricing/rate/margin/access multiplier writes

## Public Supabase Config End State

After quote and tracking writes are removed:

- `window.OPERON_SUPABASE_CONFIG` should not be required by quote, products, quote-review, floorplan, contact, or chatbot customer flows.
- Browser runtime should not initialize a Supabase client for lead, quote, upload, or tracking writes.
- Service-role Supabase writes should remain server-side in Netlify Functions only.

## Allowed Customer-Safe Browser State

These may remain customer-side if still useful:

- product category/range selection labels
- customer-entered quote wizard draft values
- safe upload display metadata: filename/type/size/source
- `uploaded_file_id`
- sanitized analytics event names and non-sensitive metadata
- quote-review safe summary/results, not raw OCR text

## Required Server Paths

These Function paths must remain the source of truth for writes:

- `/.netlify/functions/save-quote-request`
- `/.netlify/functions/contact-enquiry`
- `/.netlify/functions/save-quote-review`
- `/.netlify/functions/send-quote-review-email`
- `/.netlify/functions/upload-customer-file`
- `/.netlify/functions/quote-review-ocr`
- `/.netlify/functions/operator-chat-request`

## Preview QA Required Before Activation

Test in an approved draft preview:

- quote submit/save returns 200
- customer quote email flag remains safe
- internal lead notification flag remains safe
- product handoff to quote works
- floorplan handoff to quote works
- quote-review handoff to quote works
- upload returns only safe metadata and `uploaded_file_id`
- contact form returns 303 to `/contact-thank-you.html`
- quote-review OCR/report path does not expose raw extracted text
- browser storage has no storage bucket/path, raw OCR text, internal pricing/rates, or service tokens
- public leak probes return 404
- source map probes return 404

## Strict RLS Dependency

Strict RLS/GraphQL hardening should happen only after this no-direct-browser-write acceptance contract is active and passing.
