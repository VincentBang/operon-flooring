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

### Upload Link-Only

Submit:

- Quote flow with an uploaded PDF/JPG/PNG/WEBP.

Verify:

- Upload returns 200.
- Response includes `uploaded_file_id`.
- Response does not include bucket/path/signed URL.
- If quote row has `lead_id`, uploaded file metadata links to the same lead.
- No file-only anonymous lead is created when no quote lead context exists.

## Pass Criteria

- Existing customer flows still pass.
- Lead parent rows are populated for quote/contact/review/operator paths.
- Uploads link only when context exists.
- No public response exposes lead IDs, storage paths, raw OCR, or private pricing fields.
- Customer-facing Function errors return bounded safe messages, and server logs record short reasons rather than raw provider error objects.
- No production deploy happens during preview QA.
- No extra preview deploys are created for non-browser checks that can run locally.
