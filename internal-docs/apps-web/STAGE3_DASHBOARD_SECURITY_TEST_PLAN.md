# Stage 3 Dashboard Security Test Plan

Date: 2026-06-04

Purpose: define the minimum security checks before any admin dashboard preview or production release.

## Admin Route Protection

Tests:

- `/admin` unauthenticated shows locked state, not lead data.
- `/admin/leads` unauthenticated shows locked state or redirects to auth.
- `/admin/leads/[id]` unauthenticated shows locked state or redirects to auth.
- Admin pages include `noindex,nofollow`.
- Admin pages are excluded from sitemap.

## Admin Function Protection

For each admin function:

- Unauthenticated request returns 401/403.
- Invalid/expired session returns 401/403.
- Non-admin authenticated user returns 403.
- Valid admin request succeeds.
- CORS allows only approved origins.
- Response uses `Cache-Control: no-store`.
- Malformed JSON returns `400` with a fixed safe validation message.
- Server logs contain short failure reasons rather than raw provider/database error objects.

Functions:

- `lead-dashboard`
- `lead-admin`
- `followup-admin`
- `admin-leads-list`
- `admin-lead-detail`
- `admin-lead-events`
- `admin-lead-files`
- `admin-update-lead-status`
- `admin-create-lead-note`
- `admin-update-next-action`
- `admin-schedule-follow-up`

Current read implementation:

- `lead-dashboard` covers list/detail/summary reads from `operon_leads`.
- `/admin.html` is not wired to `lead-dashboard` until the admin UI is approved.

## Response Leak Tests

Block response fields/terms:

- `service_role`
- `SUPABASE_SERVICE_ROLE`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `storage_bucket`
- `file_path`
- `signed_url`
- `raw_ocr`
- `extracted_text`
- `supplier_cost`
- `gross_margin`
- `internal_rate`
- `pricingRules`
- `installRates`
- `removalRates`
- `stairRates`
- `locationZones`
- `accessFactor`
- raw provider/database error text

## Supabase Access Tests

Public anon probes should fail:

- `operon_leads`
- `operon_lead_events`
- `operon_lead_notes`
- `operon_lead_files`
- `operon_follow_ups`
- `operon_floorplan_reviews`
- `operon_lead_status_history`

Storage probes should fail:

- Anonymous list bucket.
- Anonymous read arbitrary file.
- Anonymous write object.

## Browser Storage Tests

Admin UI should not store:

- Service tokens
- Raw OCR text
- Storage paths
- Full lead row dumps
- Internal pricing data

Allowed:

- Short-lived admin session/token if auth approach requires it.
- UI filter preferences.

## Audit Trail Tests

Status/priority/note/follow-up writes should create:

- An updated lead row.
- A lead event.
- Status history where applicable.

## Production Safety Checks

Before any admin production deploy:

- Public quote flow still works.
- Contact form still works.
- Quote-review save/email still works.
- Upload still works.
- Public leak probes pass.
- Source map probes pass.
- Admin routes excluded from sitemap.
- Admin functions inaccessible without auth.
