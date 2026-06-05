# Task 3.12 Security Audit Checklist

Date: 2026-06-04

Purpose: define the Stage 3 security gate before any internal dashboard production release.

## Admin Surface

- `/admin` protected.
- `/admin/leads` protected.
- `/admin/leads/[id]` protected.
- Admin pages include `noindex,nofollow`.
- Admin pages excluded from sitemap.
- Admin pages do not render lead data in unauthenticated HTML.

## Function Surface

- Every admin function requires admin auth.
- Invalid/expired auth returns 401/403.
- Non-admin auth returns 403.
- Responses use `Cache-Control: no-store`.
- CORS limited to approved origins.

## Supabase

- RLS enabled on all Stage 3 lead tables.
- `anon` has no SELECT on lead/upload/quote/event tables.
- Public browser does not write directly to lead tables.
- Service-role writes stay server-side only.
- GraphQL anon exposure removed for private tables.

## Storage

- `quote-files` bucket remains private.
- No anon list/read.
- No anon direct insert once uploads are fully function-routed.
- Signed URLs are admin-only, short-lived, and audited if approved later.

## Response Leak Checks

Block:

- service-role keys
- raw OCR text
- storage bucket/path
- signed URLs by default
- supplier costs
- margins
- internal rates
- private pricing rules

## Operational Checks

- Quote submit works.
- Contact form works.
- Quote-review upload/OCR/email works.
- Floorplan handoff works.
- Product handoff works.
- Public leak probes pass.
- Source map probes pass.

## Release Decision

Stage 3 admin production release is blocked until all checks above pass in preview.
