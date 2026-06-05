# Stage 3 Admin Discoverability Guardrail

Date: 2026-06-04

Purpose: keep the locked admin shell from becoming a public navigation surface before admin authentication and route behavior are approved.

## Current Local State

- `/admin.html` exists only as a locked shell.
- `/admin.html` is `noindex,nofollow`.
- `/admin.html` is excluded from sitemap.
- `/admin.html` renders no lead data.
- `/admin.html` is not connected to `lead-dashboard.js`.
- `/admin` behavior is still a pre-deploy decision.

## Guardrail

Until admin auth is approved:

- Do not add `/admin.html` to the header, footer, homepage, sitemap, blog, or any public CTA.
- Do not add `/admin` to public navigation.
- Do not expose admin Function URLs in public HTML.
- Do not add `lead-dashboard.js` calls to public browser code.
- Do not render lead, quote, upload, OCR, storage, pricing, or customer data in the admin shell.

## Allowed References

Admin route references are allowed only in:

- internal docs
- internal QA tests
- the locked admin source route itself
- Netlify/admin Function source files

## Pre-Deploy Check

Before any preview or production deploy containing the admin shell:

1. Confirm `/admin.html` is still `noindex,nofollow`.
2. Confirm `/admin.html` is excluded from sitemap.
3. Confirm public pages do not link to `/admin.html` or `/admin`.
4. Confirm `/admin` is blocked, redirected, or explicitly documented for the preview.
5. Confirm admin output contains no lead/customer/upload/storage/OCR/pricing data.

## Stop Conditions

Stop and report before deploy if:

- a public page links to `/admin.html`
- a public page links to `/admin`
- `/admin.html` appears in sitemap
- `/admin` returns an indexable 200 in preview
- admin output contains customer or internal data
