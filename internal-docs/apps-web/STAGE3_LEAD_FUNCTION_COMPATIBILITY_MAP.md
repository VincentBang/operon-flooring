# Stage 3 Lead Function Compatibility Map

Date: 2026-06-04

Purpose: map each public Netlify Function write path into the new `operon_leads` parent model before building the admin dashboard.

## Summary Decision

Create parent leads from:

- `save-quote-request`
- `contact-enquiry`
- `save-quote-review`
- `operator-chat-request`

Link only, do not create anonymous file-only leads by default:

- `upload-customer-file`

Do not create leads directly:

- `quote-review-ocr`
- `calculate-quote`
- `calculate-private-quote`
- `public-catalogue-pricing`
- `runtime-health`

## Contract Rules

These rules apply before any additional function is wired into `operon_leads`:

- Existing customer-facing behavior must stay primary. A lead write must never block a successful email, upload, quote save, or quote-review save.
- Lead writes must use service-role Netlify Function code only; the browser must not write directly to `operon_leads`.
- Function responses must not expose `lead_id`, storage bucket names, storage paths, private pricing fields, raw OCR text, raw uploaded quote text, or admin-only status fields.
- `operon_leads.metadata` must stay dashboard-safe. Store classifications, flags, source labels, counts, and references, not long customer messages, full chatbot transcripts, raw OCR text, supplier costs, margins, or internal rate fields.
- `upload-customer-file` must not create anonymous leads from upload alone. It may only link to an existing lead when quote/review context already exists.
- Every source write should record exactly one lead event for the business action, using an event type stable enough for reporting.
- If Supabase lead writing fails, the function should log a short redacted warning and continue with the legacy success path.
- Any code wiring must have a local contract test before preview or production deployment.

## save-quote-request

Current write:

- Inserts/upserts `operon_quote_requests`
- Replaces `operon_quote_rooms`
- Replaces `operon_quote_items`
- Queues follow-up records on submit
- Sends customer/internal quote email on submit

Lead action:

- Create or update one `operon_leads` row after the quote request is saved.
- Link `operon_quote_requests.lead_id`.
- Record `operon_lead_events.quote_submitted`, `quote_emailed`, or `quote_draft_saved`.

Current implementation status:

- Implemented locally.
- Supabase schema supports it.
- Preview verification blocked by Netlify CLI upload stall.

Key mapping:

- `primary_source`: `quote`
- `source_detail`: `direct_quote_submit`, `direct_quote_draft`, `email_quote`, `product_handoff`, `floorplan_handoff`, or `quote_review_handoff`
- `status`: `Quote sent` when customer quote email succeeds, otherwise `Needs review` or `New`
- `priority`: mapped from existing lead qualification priority/band
- `customer_name`, `email`, `phone`: from quote payload/customer row
- `suburb`, `postcode`: from quote row
- `product_category`, `product_name`: from quote row
- `area_m2`, `estimated_order_area_m2`: from quote row
- `estimate_total_inc_gst`: from quote row
- `confidence_score`, `confidence_level`: from close score/confidence fields
- `missing_info_flags`, `risk_flags`: from existing lead qualification columns

## contact-enquiry

Current write:

- Sends internal contact enquiry email.
- Does not currently write to Supabase.

Current implementation status:

- Implemented locally as a non-blocking Stage 3 lead write.
- Covered by `node internal-qa/tests/web/contactLeadContract.test.js`.
- Not production deployed from this local state.

Lead action:

- Create one `operon_leads` row only after email send succeeds.
- Record `operon_lead_events.contact_submitted`.

Recommended mapping:

- `primary_source`: `contact`
- `source_detail`: `contact_form`
- `status`: `New`
- `priority`: `normal`
- `customer_name`: `name`
- `email`: `email`
- `phone`: `phone`
- `suburb`: `suburb`
- `contact_status`: `internal_notification_sent`
- `next_action`: `Review contact enquiry`
- `metadata`: customer-safe `topic`, `timing`, and message length/category, not raw long message if avoidable

Implementation notes:

- Keep email as the primary behavior.
- Lead write should be non-blocking if Supabase is unavailable.
- Do not add public response fields with lead IDs.

Acceptance checks:

- Valid contact POST still returns `303` to `/contact-thank-you.html`.
- Missing required fields still return customer-safe validation.
- Internal email is still sent before/alongside the lead write.
- Lead write failure does not change the customer response if the email succeeded.
- Lead metadata does not store the full long message body by default.

## save-quote-review

Current write:

- Inserts `operon_quote_reviews`.
- Stores quote-review scope, missing/risk items, advisor summary, and controlled OCR summary.
- May include stored OCR extracted text server-side inside `advisor_summary.document_review.ocr.extracted_text`.

Current implementation status:

- Implemented locally as a non-blocking Stage 3 lead write.
- Covered by `node internal-qa/tests/web/quoteReviewLeadContract.test.js`.
- Not production deployed from this local state.

Lead action:

- Create one `operon_leads` row after quote review insert succeeds.
- Link `operon_quote_reviews.lead_id`.
- Record `operon_lead_events.quote_review_saved`.

Recommended mapping:

- `primary_source`: `quote_review`
- `source_detail`: `quick_check` or `uploaded_quote_review`
- `status`: `Needs review`
- `priority`: `normal` or `high` when risk level is high / quote total is material
- `customer_name`, `email`, `phone`: from quote-review payload
- `suburb`, `postcode`: from payload
- `product_category`: `flooring_type`
- `area_m2`: `area_m2`
- `estimate_total_inc_gst`: `quote_total`
- `confidence_level`: `confidence_level`
- `missing_info_flags`: `missing_items`
- `risk_flags`: `risk_items`
- `quote_review_status`: `saved`
- `next_action`: `Review quote comparison and offer Operon comparison quote`

Privacy notes:

- Do not copy raw OCR text into `operon_leads.metadata`.
- Keep `operon_leads` customer-safe enough for dashboard list views.
- Detailed review remains in `operon_quote_reviews`.

Acceptance checks:

- Save still returns the existing `{ ok, review_id }` shape.
- Quick-check and detailed upload reviews both create the same parent lead shape.
- High-risk or low-confidence reviews can increase priority, but only through status metadata, not pricing logic.
- Raw OCR text remains in the protected quote-review detail row only if required by existing server behavior.
- Lead metadata contains missing/risk item labels, confidence, mode, and safe summary fields only.

## upload-customer-file

Current write:

- Uploads file through service-role Supabase Storage.
- Inserts `operon_uploaded_files` metadata.
- Returns customer-safe fields only: upload status, safe filename/type/size, metadata flag, `uploaded_file_id`.

Current implementation status:

- Implemented locally as link-only behavior when a valid quote context already has a parent lead.
- Does not create anonymous file-only leads.
- Covered by `node internal-qa/tests/web/uploadLeadLinkContract.test.js`.
- Not production deployed from this local state.

Lead action:

- Do not create a lead from file upload alone.
- If `quoteId` is present and the referenced quote already has `lead_id`, link `operon_uploaded_files.lead_id` to it.
- If future quote-review upload context has a review/lead ID, link to that context.
- Optionally insert `operon_lead_files` when a parent lead exists.
- Record `operon_lead_events.file_uploaded` only when linked to a lead.

Recommended mapping:

- `operon_uploaded_files.lead_id`: linked parent lead ID
- `operon_lead_files.uploaded_file_id`: metadata row ID
- `file_role`: `quote_attachment`, `quote_review_upload`, or `floorplan_upload`
- `safe_filename`, `file_type`, `file_size_bytes`: from upload function

Privacy notes:

- Do not return `storage_bucket`.
- Do not return `file_path`.
- Do not create anonymous file-only leads by default.

Acceptance checks:

- Upload response contains `uploaded_file_id` and safe display metadata only.
- Upload response never contains bucket/path/signed URL unless a future explicit short-lived signed URL path is approved.
- If `quoteId` has no linked lead yet, upload still succeeds and metadata remains unlinked.
- If `quoteId` has a linked lead, `operon_uploaded_files.lead_id` can be linked without changing the browser response.

## operator-chat-request

Current write:

- Sends internal operator request email.
- Sends optional customer acknowledgement email.
- Does not write to Supabase.

Current implementation status:

- Implemented locally as a non-blocking Stage 3 lead write.
- Covered by `node internal-qa/tests/web/operatorLeadContract.test.js`.
- Not production deployed from this local state.

Lead action:

- Create one `operon_leads` row after internal email succeeds.
- Record `operon_lead_events.operator_request_submitted`.

Recommended mapping:

- `primary_source`: `chatbot`
- `source_detail`: `operator_request`
- `status`: `New`
- `priority`: `normal`
- `customer_name`, `email`, `phone`: from payload customer
- `contact_status`: `customer_and_internal_email_sent` or `internal_notification_sent`
- `next_action`: `Review operator request`
- `metadata`: page URL, structured intent labels, transcript length only

Privacy notes:

- Do not copy full chatbot transcript into `operon_leads`.
- If transcript storage is needed later, use a separate protected detail table.

Acceptance checks:

- Internal operator email remains the primary success path.
- Customer acknowledgement behavior is unchanged.
- Lead write failure does not change the response if email delivery succeeded.
- Lead metadata stores page URL, intent labels, and transcript/message length only.

## quote-review-ocr

Current write:

- No lead write.
- Runs OCR/review analysis and returns customer-safe result.

Lead action:

- None directly.
- Parent lead creation should happen when the user saves or emails the quote review.

## Floorplan Handoff

Current behavior:

- Floorplan state is passed into quote flow by browser handoff.
- Quote submit can detect floorplan source through quote payload and map `source_detail` to `floorplan_handoff`.

Lead action:

- No separate floorplan lead unless a future `floorplan_review` save function is added.
- Quote-created lead should carry `floorplan_status = attached` when the quote payload indicates floorplan usage.

## Product Handoff

Current behavior:

- Product page stores/passes selected product/category into quote flow.
- Quote submit can detect product source through quote payload and map `source_detail` to `product_handoff`.

Lead action:

- No separate product lead by default.
- Quote-created lead should carry product category/name and source detail.

## Implementation Order

1. Verify `save-quote-request` through a Git-based Netlify preview or approved local service env.
2. Wire `contact-enquiry` with non-blocking lead write.
3. Wire `save-quote-review` with non-blocking lead write.
4. Wire `operator-chat-request` with non-blocking lead write.
5. Add link-only upload behavior when `quoteId` maps to a lead.
6. Add backfill SQL after live writes are verified.
7. Build admin auth shell.

## Verification Order

Run locally before any preview:

1. `node internal-qa/tests/web/leadWriterContract.test.js`
2. `node internal-qa/tests/web/pricingLeakContract.test.js`
3. `node internal-qa/tests/web/quoteCalculator.validation.js`
4. `node internal-qa/tests/web/quoteConfidence.test.js`
5. `node internal-qa/tests/web/quoteReviewParser.test.js`
6. `node internal-qa/tests/web/floorplanMeasurement.test.js`
7. `node internal-qa/tests/web/floorplanQuickRoom.test.js`
8. `node internal-qa/tests/chatbot/chatbot.test.js`
9. `npm run build` in `apps/web-tsx`
10. `npm run check:public-leaks`
11. `git diff --check`

Preview or production deploys still require explicit human approval.
