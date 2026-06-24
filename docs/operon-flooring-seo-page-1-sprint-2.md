# Operon Flooring SEO Page-1 Sprint 2

Status: Implemented locally, not deployed
Date: 2026-06-24

## Goal

Rebuild the three Sydney product authority pages so they can compete more clearly for product-category searches while still supporting quote conversion.

The sprint focused on:

- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`

No new pages were created. No quote, pricing, product catalogue, floorplan, quote-review, chatbot, upload, OCR, backend or Supabase logic was changed.

## Search Intent

| URL | Primary intent | Supporting intent |
| --- | --- | --- |
| `/hybrid-flooring-sydney.html` | hybrid flooring Sydney | apartments, rentals, waterproof claims, quote inclusions |
| `/laminate-flooring-sydney.html` | laminate flooring Sydney | dry-room flooring, rentals, apartments, quote scope |
| `/engineered-timber-flooring-sydney.html` | engineered timber flooring Sydney | premium timber, stairs, feature patterns, quote comparison |

## Pages Changed

### `/hybrid-flooring-sydney.html`

Target queries:

- hybrid flooring Sydney
- hybrid flooring apartments Sydney
- waterproof flooring Sydney
- hybrid flooring quote Sydney

Changes:

- Replaced the legacy SEO wrapper with a purpose-built hybrid flooring authority page.
- Changed title to `Hybrid Flooring Sydney | Ranges, Apartments & Quote Guide`.
- Kept H1 as `Hybrid flooring Sydney`.
- Added clearer sections for where hybrid works best, range directions, quote scope and water-resistant limitations.
- Added visible range examples using existing product images.
- Added CTAs to `/quote.html`, `/products.html` and `/quote-review.html`.
- Added internal links to quote guide, acoustic underlay and hybrid comparison content.
- Added Service, BreadcrumbList and FAQPage JSON-LD.

Generated output check:

- Title: `Hybrid Flooring Sydney | Ranges, Apartments & Quote Guide`
- Canonical: `https://operonflooring.com.au/hybrid-flooring-sydney.html`
- H1 count: 1
- H1: `Hybrid flooring Sydney`

### `/laminate-flooring-sydney.html`

Target queries:

- laminate flooring Sydney
- laminate flooring apartments Sydney
- laminate flooring quote Sydney
- laminate flooring rental property

Changes:

- Tightened title to `Laminate Flooring Sydney | Dry Room Ranges & Quote Guide`.
- Improved meta description around dry rooms, apartments, rentals, underlay, moisture limits and quote scope.
- Strengthened hero copy so laminate is positioned as a dry internal flooring option rather than a generic timber-look product.
- Added a new "Where laminate flooring works best" section.
- Strengthened quote-review and quote-guide links.
- Preserved existing product/range guidance and customer-safe FAQ content.

Generated output check:

- Title: `Laminate Flooring Sydney | Dry Room Ranges & Quote Guide`
- Canonical: `https://operonflooring.com.au/laminate-flooring-sydney.html`
- H1 count: 1
- H1: `Laminate flooring Sydney`

### `/engineered-timber-flooring-sydney.html`

Target queries:

- engineered timber flooring Sydney
- timber flooring Sydney
- engineered timber quote Sydney
- herringbone engineered timber Sydney

Changes:

- Replaced the legacy SEO wrapper with a purpose-built engineered timber authority page.
- Changed title to `Engineered Timber Flooring Sydney | Premium Quote Guide`.
- Kept H1 as `Engineered timber flooring Sydney`.
- Added sections for premium fit, range directions, installation method, stair/pattern scope and project proof.
- Added visible range examples using existing product images.
- Added CTAs to `/quote.html`, `/products.html`, `/quote-review.html` and `/recent-flooring-projects.html`.
- Added Service, BreadcrumbList and FAQPage JSON-LD.

Generated output check:

- Title: `Engineered Timber Flooring Sydney | Premium Quote Guide`
- Canonical: `https://operonflooring.com.au/engineered-timber-flooring-sydney.html`
- H1 count: 1
- H1: `Engineered timber flooring Sydney`

## Internal Links Added or Strengthened

- Hybrid page now links to:
  - `/quote.html`
  - `/products.html`
  - `/quote-review.html`
  - `/flooring-quote-sydney.html`
  - `/blog/acoustic-underlay-for-apartments.html`
  - `/blog/hybrid-vs-laminate-flooring.html`
- Laminate page now links more clearly to:
  - `/quote.html`
  - `/products.html`
  - `/quote-review.html`
  - `/flooring-quote-sydney.html`
- Engineered timber page now links to:
  - `/quote.html`
  - `/products.html`
  - `/quote-review.html`
  - `/flooring-quote-sydney.html`
  - `/recent-flooring-projects.html`
  - `/blog/flooring-stairs-and-stair-nosing.html`

## Pricing and Privacy Safety

The changed customer-facing copy avoids:

- supplier costs
- margins
- internal rates
- private pricing rules
- rate tables
- pricing formulas
- access multipliers

The pages discuss quote implications only at a customer-safe level: product selection, measured area, installation method, preparation, stairs, trims, removal, exclusions and final scope review.

## Verification Status

Completed:

- `npm run build` in `apps/web-tsx` passed.
- `npm run check:public-leaks` passed.
- `git diff --check` passed.
- `node internal-qa/tests/web/staticOutputContract.test.js` passed.
- `node internal-qa/tests/web/seoFirstBatchReleaseContract.test.js` passed.
- `node internal-qa/tests/web/pricingLeakContract.test.js` passed against the current known legacy pricing-support inventory baseline.
- `node internal-qa/tests/web/localPublicProbeContract.test.js` passed.
- `node internal-qa/tests/web/quoteCalculator.validation.js` passed.
- `node internal-qa/tests/web/quoteConfidence.test.js` passed.
- `node internal-qa/tests/web/floorplanMeasurement.test.js` passed.
- `node internal-qa/tests/web/floorplanQuickRoom.test.js` passed.
- `node internal-qa/tests/web/quoteReviewParser.test.js` passed.
- `node internal-qa/tests/chatbot/chatbot.test.js` passed.
- Generated sitemap count and category URL inclusion checked.
- Generated title, meta, canonical and H1 checks passed for the three Sprint 2 URLs.
- Generated source map scan found no `.map` files in `apps/web-tsx/out`.
- Generated internal-link grep found no links to `/index.html`, `/blog/index.html`, `/blog.html` or `/auburn-flooring.html` on the three Sprint 2 pages.
- Redirect rules remain present for `/hybrid-flooring-sydney`, `/laminate-flooring-sydney`, `/engineered-timber-flooring-sydney`, `/quote`, `/products`, `/floorplan`, `/quote-review`, `/blog.html`, `/index.html` and `/blog/index.html`.
- Robots output includes the sitemap and does not block the three category pages.
- Browser QA passed for the three category pages at 1440, 1280, 768 and 390 width:
  - no horizontal overflow
  - one visible H1
  - visible footer
  - footer logo loaded
  - visible CTAs
  - no broken loaded images
  - no console errors

Generated output checks passed for:

- title
- meta description
- canonical URL
- one H1
- exported range image existence

Build warning:

- Next.js still reports the existing multiple-lockfile warning. This was present before this sprint and was not changed.

Browser QA note:

- Local static-server extensionless route checks return 404 because the plain Python server does not apply Netlify redirects. The required Netlify redirect rules remain present in `netlify.toml`.

## Production Status

Not deployed.

Not pushed.

No Netlify preview or production deploy was created.

Production deployment should remain blocked until the user approves a deploy.

## Rollback Approach

Because this sprint is local-only and not deployed, rollback is currently a normal git revert or checkout of the changed files before any push/deploy.

If deployed later and a production SEO/layout issue appears, roll back the Netlify production deploy to the prior stable deploy, then revert the Sprint 2 commit before trying a smaller patch.

## Next Recommended Task

After Sprint 2 is reviewed:

Run manual visual QA and, if approved, prepare the combined Sprint 1 and Sprint 2 SEO preview/release candidate.

Do not deploy until human approval is explicit.
