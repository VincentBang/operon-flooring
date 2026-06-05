# Stage 3 Admin Auth Function Contract

Date: 2026-06-04

Purpose: define the shared authentication boundary for future Operon OS admin Netlify Functions before any lead data reads or writes are implemented.

This is a planning and test contract only. No production admin data access is approved by this document.

## Scope

Applies to future admin-only Functions:

- `lead-admin` (legacy/local admin proof endpoint)
- `followup-admin` (legacy/local admin proof endpoint)
- `admin-session-status`
- `admin-leads-list`
- `admin-lead-detail`
- `admin-lead-events`
- `admin-lead-files`
- `admin-reports-summary`
- `admin-update-lead-status`
- `admin-update-lead-priority`
- `admin-create-lead-note`
- `admin-update-next-action`
- `admin-schedule-follow-up`

## Required Boundary

Every admin Function must:

- Validate admin access before any Supabase query.
- Return `401` or `403` for unauthenticated or unauthorized requests.
- Set `Cache-Control: no-store`.
- Use service-role Supabase credentials server-side only.
- Never expose service-role keys, storage bucket/path, signed URLs by default, raw OCR text, supplier costs, margins, internal rates, access multipliers, or pricing rules.
- Return customer-safe/admin-safe error messages only.
- Return `400` with `Invalid JSON payload.` for malformed admin POST bodies.
- Log only short failure reasons, not raw provider/database error objects.
- Avoid returning full database row dumps.

## Unauthenticated Response

HTTP status:

- `401`

Response body:

```json
{ "ok": false, "error": "Admin authentication required." }
```

Required headers:

- `Cache-Control: no-store`
- `Content-Type: application/json`

## Unauthorized Response

HTTP status:

- `403`

Response body:

```json
{ "ok": false, "error": "Admin access denied." }
```

Required headers:

- `Cache-Control: no-store`
- `Content-Type: application/json`

## Temporary Admin Token Guardrail

If a temporary environment admin token is approved for a private proof:

- It must be stored only in Netlify environment variables.
- It must never be committed.
- It must never be printed in logs.
- It must never be returned to the browser.
- It must be rotated before any wider production admin access.
- Browser storage must not persist the raw token longer than necessary.

## Success Response Rules

Successful admin responses may include only the safe fields defined in:

- `STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md`
- `STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md`
- `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`

Successful responses must not include:

- `storage_bucket`
- `file_path`
- `signed_url` unless explicitly requested and short-lived in a separately approved file action
- raw OCR text
- full chatbot transcripts
- private pricing fields
- service-role terms or environment variable names
- raw provider/database error text

## Stop Conditions

Do not implement admin data reads or writes if:

- Admin auth approach has not been approved.
- `/admin` route behavior is unresolved.
- Unauthenticated response shape cannot be tested locally.
- Lead write preview verification has not passed.
- Any public quote/contact/review/upload path is failing.
