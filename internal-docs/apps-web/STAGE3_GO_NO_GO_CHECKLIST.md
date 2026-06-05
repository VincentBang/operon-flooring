# Stage 3 Go/No-Go Checklist

Date: 2026-06-04

Use this before moving from planning/contracts into protected admin dashboard coding.

## Go Conditions

- Stage 2 public conversion engine remains stable.
- Local gates pass:
  - `npm run build --prefix apps/web-tsx`
  - `npm run test:local-gates`
  - `git diff --check`
- Stage 3 lead schema exists in Supabase.
- `operon_leads` and related tables have RLS enabled.
- Public anon access to Stage 3 tables remains revoked.
- Stage 3 lead-write contracts pass locally.
- Preview verifies quote/contact/review/operator lead creation.
- Upload link-only behavior verifies in preview.
- Admin auth approach is approved.
- No unresolved public leak or source-map issue.

## No-Go Conditions

- Quote submit is unstable.
- Contact function is unstable.
- Quote-review save/email/upload/OCR is unstable.
- Direct browser Supabase write removal is in progress and unverified.
- Admin auth approach not approved.
- Response safety contract fails.
- Any admin route appears in sitemap.
- Any admin function returns lead data without auth.

## Current Status

Local readiness:

- Strong.

Preview readiness:

- Pending human approval for Git-based preview because CLI draft deploy upload previously stalled.

Admin coding readiness:

- Blocked until admin auth approach is approved.

Recommended next human decision:

- Choose admin auth approach.
- Approve dev-branch push for Git-based preview of Stage 3 lead writes.
