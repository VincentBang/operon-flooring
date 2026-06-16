# Stage 3 Lead Write Preview QA Checklist

Date: 2026-06-04

Purpose: define the exact preview checks needed before shipping Stage 3 lead writes.

## Preview Setup

- Use a Git-based Netlify branch preview if CLI draft upload continues to stall.
- Do not create a CLI draft deploy unless the human explicitly approves it.
- Do not use `--prod`.
- Confirm preview publishes `apps/web-tsx/out`.
- Confirm Functions are available.
- Confirm local gates passed immediately before the preview: `npm run build --prefix apps/web-tsx`, `npm run test:local-gates`, `git diff --check`, and local Functions packaging.
- Confirm `/admin.html` returns 200, stays `noindex,nofollow`, and remains absent from `/sitemap.xml`.
- Confirm `/admin` behavior is approved and documented as redirect, 404/403, or otherwise blocked from indexable duplicate access before production.
- Confirm unauthenticated admin Functions return 401/403 and do not return lead data.
- Capture preview URL, deploy ID, deploy timestamp, and any build warnings.
- Use clearly named synthetic submissions.

## Required Synthetic Tests

### Quote Submit

Submit:

- Name: `STAGE3 PREVIEW QUOTE LEAD TEST`
- Valid email/phone
- Auburn or another valid Sydney suburb
- Hybrid
- Known area

Verify:

- `save-quote-request` returns 200.
- Quote row is created.
- `operon_quote_requests.lead_id` is populated.
- `operon_leads.primary_source = quote`.
- `operon_lead_events.event_type = quote_submitted`.
- Public response does not include `lead_id`.

### Contact Enquiry

Submit:

- Name: `STAGE3 PREVIEW CONTACT LEAD TEST`

Verify:

- Contact function returns 303 to `/contact-thank-you.html`.
- Internal contact email is sent.
- `operon_leads.primary_source = contact`.
- `operon_lead_events.event_type = contact_submitted`.
- Lead metadata stores message length, not full message.

### Quote Review Save

Submit:

- Name: `STAGE3 PREVIEW QUOTE REVIEW LEAD TEST`
- Quick check and/or uploaded quote path.

Verify:

- Review save returns existing response shape.
- Quote-review email returns `{ ok: true }` without echoing the submitted email address.
- `operon_quote_reviews.lead_id` is populated.
- `operon_leads.primary_source = quote_review`.
- `operon_lead_events.event_type = quote_review_saved`.
- Parent lead metadata does not contain raw OCR text.

### Operator Request

Submit:

- Name: `STAGE3 PREVIEW OPERATOR LEAD TEST`

Verify:

- Operator request returns existing response shape.
- Internal notification behavior unchanged.
- `operon_leads.primary_source = chatbot`.
- `operon_lead_events.event_type = operator_request_submitted`.
- Parent lead metadata stores transcript count, not full transcript.

### Chatbot Qualification Event

Submit:

- Complete a chatbot qualification on `/`, `/products.html`, or `/quote.html`.
- Use safe answers only, no phone/email/name unless explicitly testing contact intent.

Verify:

- `save-chatbot-lead-event` returns 200 for a safe payload.
- Invalid payloads containing raw transcript, raw quote text, OCR text, pricing/rate/margin fields, bucket/path or oversized data are rejected.
- `operon_leads.primary_source = chatbot`.
- `operon_lead_events.event_type` is a safe chatbot event type.
- If `operon_chatbot_qualifications` exists, the qualification row is created.
- If `operon_chatbot_qualifications` is not applied yet, the event write remains non-blocking and the preview decision is to apply the migration or disable the chatbot dashboard panel before live use.
- Browser storage does not contain raw transcript, raw quote text, OCR text, phone/email/name, bucket/path, signed URL, private pricing or internal rates.

### Upload Link-Only

Submit:

- Quote flow with an uploaded PDF/JPG/PNG/WEBP.

Verify:

- Upload returns 200.
- Response includes `uploaded_file_id`.
- Response does not include bucket/path/signed URL.
- If quote row has `lead_id`, uploaded file metadata links to the same lead.
- No file-only anonymous lead is created when no quote lead context exists.

## Admin Dashboard MVP Preview Checks

Verify with the approved admin token:

- `admin-session-status` returns authenticated access only for the approved token.
- `lead-dashboard?action=list` returns safe lead list rows only.
- `lead-dashboard?action=detail&lead_id=<uuid>` returns safe lead detail, events, notes and file metadata.
- `lead-dashboard?action=summary` returns aggregate counts only.
- `lead-dashboard?action=chatbot-list` either returns safe chatbot qualification rows or fails safely if the migration is not applied.
- `lead-dashboard?action=chatbot-detail&qualification_id=<uuid>` redacts raw transcript, raw quote text, OCR text, bucket/path, signed URL, supplier cost, margin and internal pricing terms.
- `lead-status-admin` can update a synthetic test lead status and create status history/event rows.
- `lead-followup-admin` can list, generate dry-run tasks, mark done, snooze and archive without sending email or SMS.

## Pass Criteria

- Existing customer flows still pass.
- Lead parent rows are populated for quote/contact/review/operator paths.
- Chatbot lead/event writes are safe and non-blocking.
- Admin dashboard requests are denied without auth and safe with auth.
- Uploads link only when context exists.
- No public response exposes lead IDs, storage paths, raw OCR, or private pricing fields.
- No admin response exposes storage paths, raw OCR, raw quote text, supplier costs, margins, internal rates, private pricing fields or service credentials.
- Customer-facing Function errors return bounded safe messages, and server logs record short reasons rather than raw provider error objects.
- No production deploy happens during preview QA.
- No extra preview deploys are created for non-browser checks that can run locally.
