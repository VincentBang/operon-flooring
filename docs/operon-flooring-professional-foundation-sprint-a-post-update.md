# Operon Flooring Professional Foundation Sprint A - Post-Update Fixes

Audit date: 2026-07-09

Scope: Operon Flooring public-site post-update verification and documentation. No production deploy, no Netlify deploy, no push, no Supabase migration, no pricing logic change, no product ID/slug change and no backend business-logic change were performed in this task.

## Branch And Repo Status

- Branch during audit: `main`.
- Local repo status before this document: clean except unrelated `operon-bathrooms/.next/trace`.
- Unrelated file intentionally excluded: `operon-bathrooms/.next/trace`.
- Post-update implementation status: no executable code changes were required in this pass because the latest pushed Sprint A candidate already resolved the confirmed public-site issues checked here.

## Pages Inspected

- `/`
- `/quote.html`
- `/products.html`
- `/floorplan.html`
- `/quote-review.html`
- `/contact.html`
- `/recent-flooring-projects.html`
- `/flooring-quote-sydney.html`
- `/flooring-miranda.html`
- `/flooring-liverpool.html`
- `/flooring-parramatta.html`
- `/flooring-auburn.html`
- `/auburn-flooring.html`
- `/flooring-edmondson-park.html`
- `/flooring-edmondson-park`
- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`
- `/blog/`
- `/blog.html`
- `/blog/index.html`
- `/index.html`

## Issues Confirmed And Current Outcome

### Quote Step Consistency

Current generated `/quote.html` has six-step support copy:

1. Details
2. Flooring
3. Area
4. Stairs
5. Extras
6. Review

The quote runtime also uses six wizard steps. This is now consistent enough for Sprint A acceptance. The preferred wording in the brief is slightly more descriptive, but the live/generated support copy no longer shows the old four-step flow.

Outcome: fixed before this post-update pass. No quote state-machine, calculation, submit or handoff code changed.

### Product Crawlable Fallback

Current generated `/products.html` no longer relies solely on `Loading flooring products...`. It includes static hybrid, laminate and engineered timber category/range fallback copy, plus customer-safe quote CTAs.

Outcome: fixed before this post-update pass. Product IDs, slugs, supplier data and pricing logic were not changed.

### Edmondson Park Extensionless Duplicate

Live result:

- `/flooring-edmondson-park.html`: `200`, canonical `https://operonflooring.com.au/flooring-edmondson-park.html`
- `/flooring-edmondson-park`: `301` to `/flooring-edmondson-park.html`, final `200`

Repo configuration already contains a permanent redirect in `netlify.toml`.

Outcome: fixed. No new route change required.

### Visible Internal Links Wording

Generated output no longer contains visible `>Internal links<` headings. Local page next-step/link sections use customer-facing labels such as `Next flooring resources` and `Useful next pages`.

Outcome: fixed before this post-update pass.

### Miranda Local Logic

The current Miranda page title, H1 and opening copy are local-specific. The current local expansion work avoids adding new thin Sutherland Shire pages. Any broader nearby-location refinement should wait until approved nearby pages exist.

Outcome: no additional page creation needed. No fake local proof added.

### Quote Cannibalisation

Current generated metadata shows clearer intent separation:

- `/quote.html`
  - Title: `Instant Flooring Quote Sydney | Online Flooring Estimate`
  - H1: `Start an instant flooring quote for your Sydney project`
- `/flooring-quote-sydney.html`
  - Title: `Flooring Quote Sydney Guide | Scope & Inclusions`
  - H1: `What should a Sydney flooring quote include?`
- `/`
  - Title: `Operon Flooring Sydney | Products, Quotes & Scope Review`
  - H1: `Sydney flooring choices made clearer`

Outcome: light intent separation is fixed without redirects, canonical consolidation or keyword stuffing.

### Contact Page

Contact page is professional and conversion-oriented. It directs users to:

- start a flooring quote
- upload a floor plan
- check an existing quote
- browse flooring products
- send a general enquiry

No phone number, response time, staff names or unsupported guarantees were invented.

Outcome: no code change required.

### Quote Review CTA

Quote-review page and guide cluster provide clear comparison-quote pathways, including language around checking written scope and starting an Operon comparison quote.

Outcome: no OCR/upload/backend change required.

### Honeypot And Accessibility

Generated `/quote.html` does not contain the crawler-visible honeypot phrase `Do not fill this out if you are human`. Contact form honeypot is hidden and uses `tabIndex={-1}` and `aria-hidden`.

Outcome: documented as safe. Spam protection preserved.

## Live Route, Redirect And Canonical Findings

| URL | Status | Redirect | Final canonical / notes |
| --- | ---: | --- | --- |
| `/` | 200 | none | `https://operonflooring.com.au` |
| `/quote.html` | 200 | none | `https://operonflooring.com.au/quote.html` |
| `/products.html` | 200 | none | `https://operonflooring.com.au/products.html` |
| `/floorplan.html` | 200 | none | `https://operonflooring.com.au/floorplan.html` |
| `/quote-review.html` | 200 | none | `https://operonflooring.com.au/quote-review.html` |
| `/contact.html` | 200 | none | `https://operonflooring.com.au/contact.html` |
| `/recent-flooring-projects.html` | 200 | none | self-canonical |
| `/flooring-quote-sydney.html` | 200 | none | self-canonical |
| `/flooring-miranda.html` | 200 | none | self-canonical |
| `/flooring-liverpool.html` | 200 | none | self-canonical |
| `/flooring-parramatta.html` | 200 | none | self-canonical |
| `/flooring-auburn.html` | 200 | none | self-canonical |
| `/auburn-flooring.html` | 301 | `/flooring-auburn.html` | final self-canonical Auburn page |
| `/flooring-edmondson-park.html` | 200 | none | self-canonical |
| `/flooring-edmondson-park` | 301 | `/flooring-edmondson-park.html` | final self-canonical Edmondson Park page |
| `/hybrid-flooring-sydney.html` | 200 | none | self-canonical |
| `/laminate-flooring-sydney.html` | 200 | none | self-canonical |
| `/engineered-timber-flooring-sydney.html` | 200 | none | self-canonical |
| `/blog/` | 200 | none | `https://operonflooring.com.au/blog/` |
| `/blog.html` | 404 | none | noindex 404 |
| `/blog/index.html` | 301 | `/blog/` | final blog canonical |
| `/index.html` | 301 | `/` | final homepage canonical |

Auburn decision: `/flooring-auburn.html` is the canonical approved page. `/auburn-flooring.html` is a permanent redirect source and should remain excluded from sitemap/internal links.

## Sitemap Findings

- Generated sitemap count: 87.
- Sitemap includes `/flooring-edmondson-park.html`.
- Sitemap excludes `/flooring-edmondson-park`.
- Sitemap excludes `/blog.html`.
- Sitemap excludes `/blog/index.html`.
- Sitemap excludes `/auburn-flooring.html`.
- No full 111-page expansion was detected in the generated sitemap.

## Privacy And Public Bundle Leak Check

Generated public output was searched for:

- `service_role`
- `SUPABASE_SERVICE_ROLE`
- `storage_bucket`
- `file_path`
- `raw OCR`
- `extractedText`
- `supplier cost`
- `private rate`
- `pricing formula`
- `uploaded file path`
- `sourceMappingURL`

Result: no secret, storage path, raw OCR, source map or private pricing data was found in public output.

One public-output string hit was classified as a false positive:

- `apps/web-tsx/out/pricingSourceConfig.js` contains a customer-safe code comment saying product prices can come from Supabase without exposing private rate tables.

## Lighthouse Performance Baseline

Tool: Lighthouse via `npx lighthouse@latest` against live production URLs using local Google Chrome headless.

| Page/device | Perf | A11y | Best | SEO | FCP | LCP | CLS | TBT | Size |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| Home desktop | 100 | 92 | 96 | 100 | 0.3s | 0.3s | 0 | 0ms | 1,638 KiB |
| Home mobile | 98 | 96 | 96 | 100 | 0.9s | 1.6s | 0 | 10ms | 1,638 KiB |
| Quote desktop | 80 | 95 | 96 | 100 | 1.6s | 1.6s | 0.043 | 160ms | 993 KiB |
| Quote mobile | 61 | 95 | 96 | 100 | 2.6s | 2.6s | 0.083 | 1,120ms | 994 KiB |
| Products desktop | 45 | 93 | 96 | 100 | 1.1s | 2.2s | 0.158 | 3,790ms | 726 KiB |
| Products mobile | 41 | 96 | 96 | 100 | 1.7s | 5.5s | 0.008 | 15,860ms | 727 KiB |
| Floorplan desktop | 93 | 91 | 96 | 100 | 1.2s | 1.2s | 0 | 0ms | 809 KiB |
| Floorplan mobile | 93 | 95 | 96 | 100 | 2.4s | 2.4s | 0.045 | 50ms | 809 KiB |
| Quote-review desktop | 80 | 89 | 96 | 100 | 2.0s | 2.0s | 0 | 0ms | 849 KiB |
| Quote-review mobile | 71 | 89 | 96 | 100 | 3.8s | 4.8s | 0.003 | 80ms | 849 KiB |
| Contact desktop | 100 | 93 | 96 | 100 | 0.2s | 0.3s | 0 | 0ms | 552 KiB |
| Contact mobile | 100 | 96 | 96 | 100 | 0.9s | 0.9s | 0 | 20ms | 541 KiB |
| Miranda desktop | 99 | 91 | 96 | 100 | 0.6s | 0.8s | 0 | 0ms | 490 KiB |
| Miranda mobile | 100 | 96 | 96 | 100 | 1.3s | 1.3s | 0 | 20ms | 491 KiB |
| Hybrid desktop | 98 | 91 | 96 | 100 | 0.9s | 0.9s | 0 | 0ms | 682 KiB |
| Hybrid mobile | 99 | 96 | 96 | 100 | 1.1s | 1.1s | 0 | 20ms | 682 KiB |

Performance risk: `/products.html` has poor Lighthouse performance, especially mobile total blocking time. This should be a separate focused performance sprint because broad catalogue/runtime optimisation is outside this post-update fix scope.

## Products Performance Follow-Up

Follow-up date: 2026-07-10

The first local SEO/performance follow-up reduced the `/products.html` catalogue blocking risk without changing product catalogue data, product IDs, product slugs, pricing logic, quote logic or backend behaviour.

Changes made:

- Heavy catalogue-support scripts on `/products.html` now load with `lazyOnload` instead of `afterInteractive`.
- Product-page layout CSS now also targets the static `.products-page-content` wrapper, so the hero layout applies before hydration.
- The products page body class is applied `beforeInteractive` to preserve mobile sticky CTA/page-specific layout state.
- `staticOutputContract.test.js` now locks the products performance contract.

Local Lighthouse result against the generated static output after the follow-up:

| Page/device | Perf | A11y | Best | SEO | FCP | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| Products desktop | 98 | 93 | 96 | 100 | 0.5s | 1.1s | 0.001 | 0ms |
| Products mobile | 76 | 96 | 96 | 100 | 2.0s | 6.1s | 0 | 20ms |

Remaining performance opportunity: mobile LCP is still worth a later image/critical-rendering pass, but that should be handled separately from this no-data-change catalogue script deferral.

## Tests Run

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks` from repo root
- `git diff --check`
- `node internal-qa/tests/web/staticOutputContract.test.js`
- `npm run test:conversion`
- Live route/canonical checks for the priority URL set.
- Generated sitemap and public-output leak inspection.
- Lighthouse mobile and desktop baseline for the eight requested pages.

## Browser QA Status

Automated Lighthouse executed in headless Chrome. Manual visual QA at 1440px, 1280px, 768px and 390px was not performed in this task. Production deployment remains blocked until a human or browser QA pass confirms no layout overlap, no horizontal overflow, and no sticky CTA/chatbot collision.

## Files Changed In This Post-Update Pass

- `docs/operon-flooring-professional-foundation-sprint-a-post-update.md`

No executable site code was changed in this post-update pass.

## Rollback Notes

This pass is documentation-only. Rollback would be removal of this document. The already-pushed Sprint A candidate can be reverted by reverting commit `6801799` if needed.

## Deployment Notes

- No production deploy performed.
- No Netlify draft deploy performed.
- No push performed in this task.

## Known Limitations And Risks

- Products page performance is the largest current technical risk.
- Manual layout QA is still needed before approving another production-facing release.
- Existing broader pricing/data privacy architecture remains governed by the separate server-side pricing migration plan.
- The unrelated `operon-bathrooms/.next/trace` remains untouched and out of scope.

## Next Recommended Sprint

Sprint B - Conversion Data and Quote OS Foundation:

- organic/conversion event tracking
- lead readiness score
- quote-review-to-comparison-quote context handoff
- floorplan measurement session persistence
- quote versioning foundation
- internal follow-up queue dry-run

Before Sprint B, consider a narrow products performance sprint because Lighthouse shows `/products.html` as the weakest current public page.
