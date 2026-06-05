# Task 3.4 Admin Auth Shell Implementation Checklist

Date: 2026-06-04

Do not connect real admin data until admin auth approach is approved.

Current local status:

- A locked `/admin.html` shell has been scaffolded for static safety checks.
- It renders no lead data.
- It makes no admin Function requests.
- It uses no direct Supabase browser client.
- It is `noindex,nofollow` and must remain excluded from sitemap.

This local shell is not the completed admin auth implementation.

## Pre-Implementation Decisions

Choose one:

- Netlify Identity invite-only users
- Supabase Auth with admin claims
- Temporary env-token proof only

Recommended for production:

- Netlify Identity or Supabase Auth.

## Files Likely Needed

Frontend:

- `apps/web-tsx/src/app/admin/page.tsx`
- `apps/web-tsx/src/app/admin/leads/page.tsx`
- `apps/web-tsx/src/app/admin/layout.tsx`
- `apps/web-tsx/src/app/admin/admin.css` or existing style module

Functions:

- `netlify/functions/admin-session-status.js`
- `netlify/functions/admin-leads-list.js`

Shared helper:

- `netlify/functions/shared/adminAuth.js`
- `netlify/functions/shared/adminResponse.js`

Tests:

- `internal-qa/tests/web/adminAuthContract.test.js`
- `internal-qa/tests/web/adminLeadsListContract.test.js`

## Non-Negotiable Behaviors

- Admin routes use `noindex,nofollow`.
- Admin routes are excluded from sitemap.
- Unauthenticated admin Functions return 401/403.
- Admin Functions use `Cache-Control: no-store`.
- Admin Function malformed JSON returns fixed safe 400 responses.
- Admin Function failures return fixed safe errors and log only bounded reasons.
- Public website routes remain unchanged.
- No service-role or private pricing fields in browser output.

## First Coding Slice

1. Add locked `/admin` route. Status: local scaffold complete.
2. Add tests proving locked state/noindex. Status: local scaffold contract complete.
3. Add auth status Function returning unauthenticated by default. Status: not started.
4. Run local gates after each slice.

Do not add real lead data reads in the first slice.

Before any preview/deploy that includes the scaffold:

1. Confirm `/admin.html` is locked and `noindex,nofollow`.
2. Confirm `/admin.html` is excluded from sitemap.
3. Decide whether `/admin` should redirect, 404, or remain documented as a non-indexable duplicate surface.
4. Confirm no lead/customer/upload/quote table names appear in generated admin HTML.

## Second Coding Slice

1. Add admin auth helper.
2. Add `admin-leads-list` with mocked/fixture tests.
3. Return only the list contract fields.
4. Keep Supabase query server-side only.

## Stop Conditions

Stop and report if:

- Auth choice is not approved.
- Admin route appears in sitemap.
- Public pages change unexpectedly.
- Function response leak contract fails.
- Any customer-facing conversion test fails.
