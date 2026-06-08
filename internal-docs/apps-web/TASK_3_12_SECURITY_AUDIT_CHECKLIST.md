# Task 3.12 Security Audit Checklist

Date: 2026-06-04

Purpose: define the Stage 3 security gate before any internal dashboard production release.

Local status: local source/output/security contract audit completed for the first admin MVP slices.

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

## Local Audit Result

Date: 2026-06-06

Local slices audited:

- Admin auth status function.
- Admin auth shell.
- Lead list.
- Lead detail.
- Status pipeline.
- Manual follow-up queue.
- Quote-review queue.
- Floorplan queue.
- Aggregate reporting summary.

Local checks passed:

- `npm run build` in `apps/web-tsx`.
- `npm run test:local-gates`.
- `git diff --check`.
- Admin source scan for forbidden client APIs and private fields.
- Generated `out/admin.html` and `out/admin.txt` scan for private table names and private fields.
- Admin response safety contracts.
- Public function response safety contracts.
- Admin function runtime safety contracts.
- Admin discoverability guardrail contracts.

Confirmed local behavior:

- `/admin.html` has `noindex,nofollow`.
- `/admin.html` is not included in `sitemap.xml`.
- Unauthenticated generated HTML renders no lead/customer/upload/quote/OCR records.
- Admin client components do not use `localStorage`, `sessionStorage`, direct Supabase clients, or service-role credentials.
- Admin Functions require admin token auth.
- Admin Function responses use `Cache-Control: no-store`.
- Lead list/detail/reporting reads go through protected Netlify Functions.
- Status/follow-up writes go through protected Netlify Functions.
- No admin UI displays storage bucket/path, signed URLs, raw OCR text, raw uploaded quote text, internal rates, supplier costs, margins, or private pricing tables.
- Follow-up queue remains manual/dry-run only and does not send email or SMS.

Known local caveats:

- `/admin` route behavior remains governed by the existing static export and route-surface decision document. No production Netlify redirect/config change was made.
- Preview verification has not been run in this slice.
- Supabase RLS/storage/GraphQL live verification was not rerun in this slice.
- Real admin token and real lead data were not exercised locally.

Release decision:

- Stage 3 admin production release remains blocked until a controlled preview verifies admin auth, list/detail reads, status writes, follow-up writes, public conversion paths, RLS/storage probes, and function logs.
