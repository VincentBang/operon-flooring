# Operon Flooring SEO Page-1 Sprint 3

Status: Implemented locally, not deployed
Date: 2026-06-24

## Goal

Strengthen internal links toward the highest-priority Page-1 Sprint URLs without creating new pages or changing revenue-path logic.

This sprint focused on hub-to-authority links from:

- `/blog/`
- `/products.html`
- `/recent-flooring-projects.html`

## Pages Changed

### `/blog/`

Added a local quote paths section linking to:

- `/flooring-miranda.html`
- `/flooring-liverpool.html`
- `/flooring-edmondson-park.html`
- `/flooring-quote-sydney.html`

Purpose:

- reinforce Search Console-tested local pages
- connect blog guide traffic back to quote intent
- keep suburb SEO supported without creating new thin pages

### `/products.html`

Added guide links from the product decision cards:

- hybrid card to `/hybrid-flooring-sydney.html`
- laminate card to `/laminate-flooring-sydney.html`
- engineered timber card to `/engineered-timber-flooring-sydney.html`

Added scope-cluster links to:

- `/flooring-quote-sydney.html`
- `/recent-flooring-projects.html`

Purpose:

- help products page pass authority to the three category pages
- give users a deeper education path before quote submission
- strengthen product to quote guide to project proof flow

### `/recent-flooring-projects.html`

Added links to:

- `/hybrid-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`
- `/flooring-quote-sydney.html`

Purpose:

- connect project proof back to category intent
- support quote clarity from project-style browsing

## Safety

No new pages were created.

No sitemap changes were intended.

No pricing logic, quote calculation logic, product data logic, floorplan logic, quote-review logic, chatbot logic, upload/OCR logic, backend logic, Supabase settings or Netlify configuration were changed.

Customer-facing copy avoids internal pricing, margins, supplier costs, private rate tables and pricing formulas.

## Verification Status

Completed:

- `npm run build` in `apps/web-tsx` passed.
- `npm run check:public-leaks` passed.
- `git diff --check` passed.
- `node internal-qa/tests/web/staticOutputContract.test.js` passed.
- `node internal-qa/tests/web/seoFirstBatchReleaseContract.test.js` passed.
- `node internal-qa/tests/web/pricingLeakContract.test.js` passed against the current known legacy pricing-support inventory baseline.
- `node internal-qa/tests/web/localPublicProbeContract.test.js` passed.
- Generated output checks passed for `/blog/`, `/products.html` and `/recent-flooring-projects.html`.
- Sitemap count remains `87`.
- Each changed hub page has one H1.
- New internal links are present in generated output.
- Customer-facing sensitive phrase scan found no internal pricing language. The only product page match was the existing JavaScript variable name `imageMarkup`, which is not customer-facing pricing copy.
- Browser QA passed for `/blog/`, `/products.html` and `/recent-flooring-projects.html` at desktop and 390px mobile:
  - no horizontal overflow
  - one visible H1
  - visible footer
  - footer logo loaded
  - no broken loaded images
  - no console errors

Build warning:

- Next.js still reports the existing multiple-lockfile warning. This was present before this sprint and was not changed.

Browser QA note:

- The local Python static server does not serve Netlify Functions, so `/.netlify/functions/public-catalogue-pricing` returned 404 locally while checking `/products.html`. This is a local static-server limitation, not a products page regression.

## Production Status

Not deployed.

Not pushed.

No Netlify preview or production deploy was created for this sprint.
