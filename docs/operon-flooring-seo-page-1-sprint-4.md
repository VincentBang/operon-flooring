# Operon Flooring SEO Page-1 Sprint 4

## Scope

Sprint 4 strengthens existing pages that already have Search Console impression signals. It does not create new pages, change route strategy, expose pricing details, or modify quote/runtime logic.

## Pages Updated

- `/flooring-parramatta.html`
- `/flooring-leppington.html`
- `/flooring-bankstown.html`
- `/flooring-auburn.html`
- `/flooring-installation-cost-sydney.html`

## Target Queries

- flooring Parramatta
- flooring Leppington
- timber flooring Leppington
- flooring Bankstown
- flooring Auburn
- flooring installation cost Sydney

## Changes Made

- Tightened suburb page titles, descriptions and H1s for clearer local search intent.
- Added more specific local opening copy where the target phrase needed stronger relevance.
- Added safe internal links from suburb quote considerations to relevant quote clarity, exclusions, stairs, acoustic/floorplan and installation-cost pages.
- Strengthened the installation cost guide with customer-safe scope explanation and links to hybrid, laminate, engineered timber, quote guide, quote, products, floorplan, quote review and project proof pages.
- Added installation-cost FAQs that explain scope drivers without publishing rates, margins, supplier costs or private pricing logic.

## Safety Notes

- No pricing rates, formulas, supplier costs, margins or internal quote rules were added.
- No product catalogue data or product handoff logic was changed.
- No quote, floorplan, quote-review, chatbot, upload/OCR or backend runtime logic was changed.
- No new URLs were created.
- Production deploy remains blocked until preview QA and human approval.

## Verification

Local verification passed:

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks`
- `git diff --check`
- `node internal-qa/tests/web/staticOutputContract.test.js`
- `node internal-qa/tests/web/seoFirstBatchReleaseContract.test.js`
- `node internal-qa/tests/web/pricingLeakContract.test.js`
- `node internal-qa/tests/web/localPublicProbeContract.test.js`
- Generated HTML checks for title, meta description, canonical, one H1 and sitemap inclusion on all five changed pages
- Visible-text leak scan for internal pricing language on all five changed pages
- Local browser QA at desktop and 390px mobile: no horizontal overflow, no broken images, one H1, footer logo present and no console errors
- Netlify redirect rule check for `/blog.html`, `/index.html`, `/blog/index.html` and key extensionless tool/category routes

No draft preview or production deploy was created for this sprint.
