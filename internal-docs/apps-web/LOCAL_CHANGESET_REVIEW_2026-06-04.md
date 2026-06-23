# Local Changeset Review - 2026-06-04

Purpose: summarize the current local-only work before any future commit, push, preview, or production action.

## Deployment Status

- No production deploy was run.
- No Netlify draft deploy was run after the user asked to minimize Netlify credits.
- No push was run.
- Local static server QA used `apps/web-tsx/out` only.

## Production-Affecting Code Changes

These files require careful preview verification before any production deploy:

- `netlify/functions/contact-enquiry.js`
- `netlify/functions/_security.js`
- `netlify/functions/operator-chat-request.js`
- `netlify/functions/save-quote-request.js`
- `netlify/functions/save-quote-review.js`
- `netlify/functions/send-quote-review-email.js`
- `netlify/functions/upload-customer-file.js`
- `netlify/functions/shared/leadWriter.js`

Purpose:

- Add non-blocking Stage 3 lead creation/linking.
- Preserve existing customer responses.
- Keep failures non-blocking for public flows.
- Remove unnecessary upload bucket/path exposure from browser response.
- Keep customer-facing Function error responses and server log reasons bounded.
- Avoid echoing customer email addresses from quote-review email responses.

## Frontend/CSS Changes

- `apps/web-tsx/src/styles/global.css`
- `apps/web-tsx/src/app/admin/page.tsx`

Purpose:

- Make footer columns and links consistent.
- Prevent footer link overlap/wrapping issues.
- Keep header sizing stable.
- Add a locked, noindex admin shell with no lead data or direct Supabase reads.

Preview requirement:

- Before any deploy, verify `/admin.html` is noindex and locked.
- Verify `/admin` redirects to `/admin.html` so it does not create an indexable duplicate surface.
- Verify `/internal/floorplan-measurements` redirects to `/internal/floorplan-measurements.html`.
- Keep `/admin.html` out of sitemap.

## Test/Guardrail Changes

New and expanded tests under `internal-qa/tests/web` cover:

- Stage 3 lead writer behavior.
- Contact/quote-review/operator/upload lead compatibility.
- Direct browser Supabase write inventory.
- Task A2 quote fallback removal readiness.
- Task A2 tracking write decision.
- Admin response safety.
- Admin auth plan and shell safety.
- Public function response safety.
- Stage 3/4/5 docs guardrails.
- Static output contracts.
- Local public leak/source-map probes.
- Header/footer/logo consistency.

## Documentation Changes

New internal docs cover:

- Stage 3 admin dashboard plan.
- Stage 3 schema/backfill/rollback and Supabase verification.
- Stage 3 implementation checklists.
- Stage 4 shared OS/pricing/upload/Kitchens/internal alpha plans.
- Stage 5 controlled contractor-network planning.
- Local verification and preview runbooks.

## Verification Already Run Locally

Passing:

- `npm run build` in `apps/web-tsx`
- `npm run test:local-gates`
- `git diff --check`
- `npx netlify functions:build --src netlify/functions --functions /tmp/operon-functions-build --debug`
- Local Netlify dev route sweep for key pages, extensionless redirects, `/blog.html` 404, source-map probes, and public leak probes.
- Local Netlify dev malformed-request sweep for upload, operator request, quote-review OCR, contact, quote save, and quote-review save Functions.

Not run in this shell:

- Playwright/browser responsive QA, because Playwright is not installed in this workspace shell and no draft deploy was approved for browser/runtime QA.

## Known External Verification Blockers

- Supabase connector needs reauthentication for direct table verification.
- Task A2 quote fallback writes, tracking writes, and public browser Supabase config have been removed locally from checked quote/tracking public runtimes.
- Task A2 still requires approved preview QA before production.
- Stage 3 lead writes need Netlify preview/function verification before production.
- The locked admin shell needs preview verification for `/admin.html`, `/admin`, noindex, and sitemap exclusion.
- The admin auth model is still not selected or connected.
- Local `netlify.toml` now redirects `/admin` to `/admin.html`; do not production deploy until this route decision is preview-verified.
- Admin route-surface options are documented in `STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md`.
- Git-based preview remains preferred over repeated CLI draft deploys if the user approves a push.

## Explicit Non-Changes

- No pricing/rate formulas changed.
- No product catalogue data changed.
- No quote calculation logic changed.
- No floorplan geometry logic changed.
- No quote-review OCR/email infrastructure changed.
- No chatbot runtime behavior changed.
- No production Netlify config change was made in this session.
