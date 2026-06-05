# Stage 3 Admin List/Detail Fixture Plan

Date: 2026-06-04

Purpose: define safe fixtures for the first protected lead list and lead detail functions before reading real customer data.

Do not build real admin reads until:

- Stage 3 lead-write preview verification passes.
- Admin auth approach is approved.
- `/admin` route-surface decision is approved.
- Admin response safety contract passes.

## Fixture Principles

- Fixture module: `internal-qa/fixtures/adminLeadFixtures.js`
- Use synthetic names, emails, phone numbers, and IDs only.
- Do not copy customer rows from Supabase.
- Do not include raw OCR text.
- Do not include storage bucket or storage path.
- Do not include signed URLs.
- Do not include supplier costs, margins, private rates, access multipliers, or internal pricing tables.
- Keep output shaped like the future function response so the UI can be built without real data.

## Lead List Fixtures

Create at least these synthetic list rows:

1. Quote lead
   - `primary_source`: `quote`
   - `source_detail`: `direct_quote_submit`
   - `status`: `New`
   - `product_category`: `hybrid`
   - `estimate_total_inc_gst`: customer-safe total only

2. Product handoff lead
   - `primary_source`: `quote`
   - `source_detail`: `product_handoff`
   - `product_category`: `laminate`
   - `next_action`: `Confirm selected product and follow up`

3. Quote-review lead
   - `primary_source`: `quote_review`
   - `status`: `Needs review`
   - `missing_info_count`: greater than zero
   - `risk_flag_count`: greater than zero

4. Contact lead
   - `primary_source`: `contact`
   - `contact_status`: `internal_notification_sent`
   - `next_action`: `Review contact enquiry`

5. Operator/chatbot lead
   - `primary_source`: `chatbot`
   - `source_detail`: `operator_request`
   - `next_action`: `Review operator request`

6. Floorplan lead
   - `primary_source`: `floorplan`
   - `source_detail`: `floorplan_handoff`
   - `floorplan_status`: `needs_review`
   - `next_action`: `Review floorplan area before quoting`

## Lead Detail Fixtures

Create at least these synthetic detail fixtures:

1. Quote detail with events
   - Lead summary
   - Customer-safe quote summary
   - `quote_submitted` event
   - Follow-up status

2. Quote-review detail with missing/risk flags
   - Missing items
   - Risk flags
   - Safe summary only
   - No raw OCR text

3. Upload/file detail
   - `uploaded_file_id`
   - Safe filename
   - MIME type
   - File size
   - `storage_status`
   - No bucket/path/signed URL

4. Notes/status detail
   - Internal note body using synthetic text
   - Status history
   - Next action

5. Floorplan detail
   - Area method/status
   - Measurement confidence
   - Safe uploaded file metadata if present
   - No bucket/path/signed URL

## Filter and Pagination Fixtures

The `admin-leads-list` fixture suite should cover:

- Status filter
- Source filter
- Priority filter
- Product category filter
- Suburb filter
- Date range filter
- Limit capped server-side
- Cursor pagination
- Empty state

## Error Fixtures

Required error fixtures:

- Unauthenticated request: 401 or 403
- Non-admin request: 403
- Missing lead: 404 with customer-safe admin error
- Invalid cursor/filter: 400 with customer-safe admin error
- Temporary data unavailable: 503 or safe 500 without stack trace

## Acceptance

Before real admin reads:

1. Fixture responses pass `adminResponseSafetyContract.test.js`.
2. Fixture responses match `STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md`.
3. Admin list/detail UI can render fixtures without direct Supabase browser reads.
4. Public conversion tests remain green.
5. No real customer data is used in tests.
