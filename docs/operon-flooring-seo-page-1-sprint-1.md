# Operon Flooring SEO Page-1 Sprint 1

Status: Implemented locally, not deployed
Date: 2026-06-24

## Goal

Recover and strengthen Page-1 relevance for existing Operon Flooring URLs without creating new pages or changing public quote/pricing logic.

The sprint focused on:

- keyword ownership correction
- cannibalisation reduction between `/`, `/quote.html` and `/flooring-quote-sydney.html`
- fast-win upgrades for Miranda, Liverpool and Edmondson Park
- safe internal links toward quote, quote review, products and floorplan paths
- preserving the approved `.html` URL strategy

## Search Console Context

The prompt supplied the working baseline:

- Total impressions: 7,147
- Total clicks: 7
- CTR: 0.10%
- Average position: about 43.5

No fresh Search Console export was found in the repo during this implementation pass, so the query priorities were treated as human-supplied Sprint 1 targets rather than newly re-analysed ranking data.

## URL Ownership Decision

| URL | Ownership decision |
| --- | --- |
| `/quote.html` | Owns instant flooring quote Sydney, floor quote Sydney and flooring quotes online intent. |
| `/flooring-quote-sydney.html` | Owns quote guide, inclusions, scope and comparison education intent. |
| `/` | Owns broad Operon Flooring brand, product choice and quote-clarity platform intent. |
| `/flooring-miranda.html` | Owns Miranda local product/service intent. |
| `/flooring-liverpool.html` | Owns Liverpool local product/service intent. |
| `/flooring-edmondson-park.html` | Protects timber flooring Edmondson Park visibility while linking to quote paths. |

The detailed ownership map is in `docs/operon-flooring-keyword-url-ownership-map.md`.

## Pages Changed

## Before and After Summary

| URL | Before | After |
| --- | --- | --- |
| `/` | Title: `Operon Flooring Sydney | Quotes, Products & Scope Review`; H1: `Get a clear flooring quote in minutes`; broader page still leaned toward quote-tool phrasing. | Title: `Operon Flooring Sydney | Products, Quotes & Scope Review`; H1: `Sydney flooring choices made clearer`; broader platform positioning with natural quote CTA. |
| `/quote.html` | H1: `Start your instant Sydney flooring quote`; intro focused on adding known details. | H1: `Start an instant flooring quote for your Sydney project`; clearer product, area, scope, floorplan and quote-review positioning. |
| `/flooring-quote-sydney.html` | Legacy SEO wrapper used the quote guide title but behaved too close to a generic quote page. | Dedicated guide page with H1 `What should a Sydney flooring quote include?`, scope checklist, comparison sections, questions and schema. |
| `/flooring-miranda.html` | Legacy wrapper plus shorter local add-ons; H1 was generated from the legacy page. | Dedicated Miranda local hub with product sections for hybrid, laminate, timber/engineered timber, property fit, scope details and FAQ. |
| `/flooring-liverpool.html` | Title targeted timber-first Liverpool quote help; generic generated H1. | Title/H1 target Liverpool flooring across hybrid, laminate and timber; FAQ strengthened. |
| `/flooring-edmondson-park.html` | Timber-focused Edmondson Park page already had useful local relevance. | Surgical title/H1 clarification only; existing page structure preserved. |

### `/quote.html`

Target queries:

- instant flooring quote Sydney
- instant floor quote Sydney
- floor quote Sydney
- flooring quotes online

Changes:

- Kept title as `Instant Flooring Quote Sydney | Online Flooring Estimate`.
- Changed H1 to `Start an instant flooring quote for your Sydney project`.
- Reworded hero copy to include product, approximate area and scope.
- Strengthened the "How the instant flooring quote works" section.
- Added a supporting link to `/flooring-quote-sydney.html`.
- Kept quote flow logic untouched.

Generated output check:

- Title: `Instant Flooring Quote Sydney | Online Flooring Estimate`
- Canonical: `https://operonflooring.com.au/quote.html`
- H1 count: 1
- H1: `Start an instant flooring quote for your Sydney project`

### `/flooring-quote-sydney.html`

Target queries:

- flooring quote Sydney guide
- what should be included in a flooring quote
- compare flooring quotes Sydney
- flooring quote exclusions

Changes:

- Replaced the legacy wrapper with a purpose-built quote scope guide.
- Changed title to `Flooring Quote Sydney Guide | Scope & Inclusions`.
- Changed H1 to `What should a Sydney flooring quote include?`.
- Added sections for inclusions, quote comparison, floorplan support and five questions to ask.
- Added CTAs to `/quote.html`, `/quote-review.html`, `/floorplan.html` and `/products.html`.
- Added Service, BreadcrumbList and FAQPage JSON-LD.

Generated output check:

- Title: `Flooring Quote Sydney Guide | Scope & Inclusions`
- Canonical: `https://operonflooring.com.au/flooring-quote-sydney.html`
- H1 count: 1
- H1: `What should a Sydney flooring quote include?`

### `/`

Target intent:

- broad Operon Flooring Sydney brand and quote-clarity platform

Changes:

- Changed title to `Operon Flooring Sydney | Products, Quotes & Scope Review`.
- Changed H1 to `Sydney flooring choices made clearer`.
- Reworded opening copy away from narrow "instant quote" ownership.
- Added natural links to Miranda, Liverpool and Edmondson Park pages.
- Kept the quote CTA but reduced homepage competition with `/quote.html`.

Generated output check:

- Title: `Operon Flooring Sydney | Products, Quotes & Scope Review`
- Canonical: `https://operonflooring.com.au`
- H1 count: 1
- H1: `Sydney flooring choices made clearer`

### `/flooring-miranda.html`

Target queries:

- flooring Miranda
- laminate flooring Miranda
- hybrid flooring Miranda
- timber flooring Miranda

Changes:

- Replaced the legacy wrapper with a local/product page.
- Changed title to `Flooring Miranda | Hybrid, Laminate & Timber Installation`.
- Changed H1 to `Flooring Miranda - Hybrid, Laminate & Timber Installation`.
- Added specific sections for hybrid, laminate, engineered timber, property fit, preparation/removal/trims/stairs and quote scope.
- Added links to category pages, products, quote, quote review, floorplan and quote clarity guides.
- Added Service, BreadcrumbList and FAQPage JSON-LD.

Generated output check:

- Title: `Flooring Miranda | Hybrid, Laminate & Timber Installation`
- Canonical: `https://operonflooring.com.au/flooring-miranda.html`
- H1 count: 1
- H1: `Flooring Miranda - Hybrid, Laminate & Timber Installation`

### `/flooring-liverpool.html`

Target queries:

- flooring Liverpool
- timber flooring Liverpool

Changes:

- Changed title to `Flooring Liverpool | Hybrid, Laminate & Timber Installation`.
- Changed H1 to `Flooring Liverpool - Hybrid, Laminate & Timber Installation`.
- Improved meta description to include hybrid, laminate, engineered timber, apartment access, removal, stairs, trims and quote review.
- Added a Liverpool FAQ about comparing hybrid, laminate and timber flooring.

Generated output check:

- Title: `Flooring Liverpool | Hybrid, Laminate & Timber Installation`
- Canonical: `https://operonflooring.com.au/flooring-liverpool.html`
- H1 count: 1
- H1: `Flooring Liverpool - Hybrid, Laminate & Timber Installation`

### `/flooring-edmondson-park.html`

Target queries:

- timber flooring Edmondson Park
- flooring Edmondson Park

Changes:

- Changed title to `Timber Flooring Edmondson Park | Hybrid & Flooring Quote Help`.
- Changed H1 to `Timber Flooring Edmondson Park - Hybrid & Flooring Quote Help`.
- Preserved the existing page content and quote path links.

Generated output check:

- Title: `Timber Flooring Edmondson Park | Hybrid & Flooring Quote Help`
- Canonical: `https://operonflooring.com.au/flooring-edmondson-park.html`
- H1 count: 1
- H1: `Timber Flooring Edmondson Park - Hybrid & Flooring Quote Help`

## Internal Links Added or Strengthened

- Homepage now links to:
  - `/flooring-miranda.html`
  - `/flooring-liverpool.html`
  - `/flooring-edmondson-park.html`
- Quote page now links to:
  - `/flooring-quote-sydney.html`
- Quote guide now links to:
  - `/quote.html`
  - `/quote-review.html`
  - `/floorplan.html`
  - `/products.html`
  - relevant quote clarity guides
- Miranda page now links to:
  - `/quote.html`
  - `/quote-review.html`
  - `/floorplan.html`
  - `/products.html`
  - `/hybrid-flooring-sydney.html`
  - `/laminate-flooring-sydney.html`
  - `/engineered-timber-flooring-sydney.html`
  - relevant quote/trims/stairs guides
- Local page reusable copy now uses "Start an instant flooring quote" as the quote link label.

## Sitemap and URL Contract

Generated sitemap check:

- Sitemap URL count: 87
- Included:
  - `/`
  - `/quote.html`
  - `/flooring-quote-sydney.html`
  - `/flooring-miranda.html`
  - `/flooring-liverpool.html`
  - `/flooring-edmondson-park.html`
- Excluded:
  - `/index.html`
  - `/blog/index.html`
  - `/blog.html`
  - `/auburn-flooring.html`

No new pages were created. This sprint only optimised existing URLs already present in the export.

## Pricing and Privacy Safety

No pricing calculation code, product data logic, Netlify functions, Supabase settings, upload logic, floorplan logic, chatbot logic or quote-review runtime logic were changed.

Customer-facing copy avoids:

- supplier costs
- margins
- internal rates
- private pricing rules
- rate tables

Exact sensitive-phrase grep across the six Sprint pages found no matches for storage paths, service-role terms, raw OCR text, supplier-cost language, margins, internal-rate language or private pricing formula wording.

## Verification Status

Completed:

- `npm run build` in `apps/web-tsx` passed.
- `npm run check:public-leaks` passed.
- `git diff --check` passed.
- `node internal-qa/tests/web/staticOutputContract.test.js` passed.
- `node internal-qa/tests/web/seoFirstBatchReleaseContract.test.js` passed.
- `node internal-qa/tests/web/pricingLeakContract.test.js` passed.
- `node internal-qa/tests/web/localPublicProbeContract.test.js` passed.
- `node internal-qa/tests/web/quoteCalculator.validation.js` passed.
- `node internal-qa/tests/web/quoteConfidence.test.js` passed.
- `node internal-qa/tests/web/floorplanMeasurement.test.js` passed.
- `node internal-qa/tests/web/floorplanQuickRoom.test.js` passed.
- `node internal-qa/tests/web/quoteReviewParser.test.js` passed.
- `node internal-qa/tests/chatbot/chatbot.test.js` passed.
- Generated sitemap count and priority URL inclusion checked.
- Generated title, meta, canonical and H1 checks passed for the six Sprint 1 URLs.
- Generated source map scan found no `.map` files in `apps/web-tsx/out`.
- Generated internal-link grep found no links to `/index.html`, `/blog/index.html`, `/blog.html` or `/auburn-flooring.html`.
- Redirect rules remain present for `/quote`, `/flooring-quote-sydney`, `/flooring-miranda`, `/flooring-liverpool`, `/flooring-edmondson-park`, `/blog.html`, `/index.html` and `/blog/index.html`.
- Robots output includes the sitemap and does not block the six priority pages.
- Browser QA passed for the six priority URLs at 1440, 1280, 768 and 390 width:
  - no horizontal overflow
  - one visible H1
  - visible footer
  - footer logo loaded
  - visible CTAs
  - visible FAQ where expected
  - no console errors

Build warning:

- Next.js still reports the existing multiple-lockfile warning. This was present before this sprint and was not changed.

Browser QA note:

- A first automated image check flagged lazy-loaded homepage images before scroll. The referenced files exist in `apps/web-tsx/out` and return 200 from the local server, so this was treated as a lazy-load false positive rather than a broken asset.

Pages intentionally left unchanged:

- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`
- held-back product/range pages
- held-back project pages
- held-back thin guide pages

Those belong to the next authority-page sprint, not this cannibalisation and fast-win sprint.

## Production Status

Not deployed.

Not pushed.

No Netlify preview or production deploy was created.

Production deployment should remain blocked until the user approves a deploy. The local browser QA passed, but the release discipline still requires human approval before triggering Netlify.

## Rollback Approach

Because this sprint is local-only and not deployed, rollback is currently a normal git revert or checkout of the changed files before any push/deploy.

If deployed later and a production SEO/layout issue appears, roll back the Netlify production deploy to the prior stable deploy, then revert the Sprint 1 commit before trying a smaller patch.

## Next Recommended Task

After Sprint 1 is approved:

SEO Page-1 Sprint 2 - rebuild the Sydney hybrid, laminate and engineered-timber authority pages.

Do not begin Sprint 2 until Sprint 1 is reviewed and approved.
