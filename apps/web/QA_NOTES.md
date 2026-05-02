# QA Notes

Date: 2026-05-02
Scope: safe non-core SEO, content structure, internal links, sitemap consistency, and content QA only.

## Checks Completed

- Broken-link audit across the homepage, products page, three money pages, five suburb pages, and blog hub: no broken links found in the audited set.
- Title tag, meta description, canonical, and H1 presence checked on:
  - `hybrid-flooring-sydney.html`
  - `laminate-flooring-sydney.html`
  - `engineered-timber-flooring-sydney.html`
  - `blog/index.html`
  - maintenance blog articles reviewed in this pass
- FAQ schema checked against visible FAQ content on:
  - `hybrid-flooring-sydney.html`
  - `laminate-flooring-sydney.html`
  - `engineered-timber-flooring-sydney.html`
- Suburb page uniqueness and CTA paths reviewed on:
  - `parramatta-flooring.html`
  - `liverpool-flooring.html`
  - `auburn-flooring.html`
  - `blacktown-flooring.html`
  - `miranda-flooring.html`
- Sitemap and crawl directives reviewed in:
  - `sitemap.xml`
  - `robots.txt`
- Canonical alignment reviewed for active sitemap pages, suburb handoff pages, and policy pages:
  - active sitemap targets exist locally
  - old `flooring-[suburb].html` pages remain `noindex,follow` handoffs to the new `[suburb]-flooring.html` pages
  - privacy and terms canonicals now point to `operonflooring.com.au`
- Quote lead-capture fallback reviewed in `index.html`:
  - Netlify Forms remains the live submit path.
  - Simple localhost/static preview now builds and saves the quote payload locally before showing the runtime warning.
  - Failed submit attempts show recovery guidance only when a saved failed quote request exists.
- Active supplier catalogue image alt text reviewed:
  - each active hybrid product has unique descriptive alt text
  - `products.js` now exposes a normalised `imageAlt` alias while preserving the existing `alt` field used by current cards and galleries
- Product placeholder messaging reviewed:
  - pending product prices show `Price to be confirmed` / `Price pending`
  - selected pending products continue to explain that the standard category estimate is used until review
  - no internal rates or formulas are exposed on catalogue cards
- Maintenance blog conversion paths reviewed:
  - `how-to-clean-hybrid-flooring.html` links to hybrid flooring, product browsing, floor plan measurement, and quote CTAs
  - `laminate-floor-water-damage.html` links replacement-ready users to laminate products, floor plan measurement, and quote CTAs
  - `flooring-gaps-and-expansion.html` keeps diagnosis first, then offers product, floor plan, and quote next steps
  - `why-is-my-floor-lifting.html` links repair-versus-replace decisions into product categories, floor plan measurement, and quote CTAs
  - `floor-repair-or-replace.html` provides product-category, floor plan, and quote pathways without repetitive filler
- Schema coverage reviewed:
  - homepage FAQ schema now matches the visible homepage FAQ questions
  - product money pages, cost pages, floor care page, and core blog guides were checked for valid JSON-LD
  - visible FAQ blocks on the checked pages have FAQPage schema coverage with no invalid JSON-LD detected
- Dashboard task queue rollup reviewed:
  - `dashboard.html` now reads `task_queue.json` as a read-only backlog source
  - the dashboard shows total, completed, pending, completion rate, status counts, and completed categories
  - inline dashboard scripts parse cleanly, and the current local queue count is 50 total / 41 done / 9 pending before this status note is applied
- Agent task helper reviewed:
  - `agent-task-engine.js` now exposes run limits for default, long, and overnight modes
  - execution batches filter out completed tasks and sort pending work by priority score
  - generated placeholder tasks no longer overwrite a loaded source queue unless the local queue is empty or already generated
- Backlink preparation reviewed:
  - `OPERON_SEO_STRATEGY.md` now maps backlink assets to supplier, product, suburb, maintenance, and floor plan destinations
  - `backlink-tracker.html` now includes an internal asset map and citation checklist for consistent manual tracking
  - no live outreach, external account access, or citation submission was performed
- Suburb internal linking reviewed:
  - Parramatta, Liverpool, Auburn, Blacktown, and Miranda pages now include suburb-specific guide links alongside product and quote paths
  - local validation confirmed the linked guide, product, floor plan, and quote targets exist
  - anchor text varies by suburb context rather than repeating one template

## Issues Found

### Safe fixes completed in this pass

- Product money pages now have clearer SEO titles and descriptions, stronger quote CTA wording, and more relevant internal links into maintenance/problem guides.
- Blog hub now surfaces the five maintenance/problem topics more clearly:
  - cleaning hybrid flooring
  - laminate water damage
  - floating floor gaps
  - floorboards lifting
  - repair vs replace flooring
- Priority suburb pages now use more specific local CTA language and direct category/product links without relying on catalogue edits.
- Internal SEO support files had stale suburb URL patterns corrected to match the live suburb page naming structure.

### Deferred because they touch core areas

- Any change to live category/product rendering on money pages that depends on `products.js` or `products.html`.
- Any quote-flow changes tied to `index.html` product selection, `productSelection.js`, `quoteCalculator.js`, `pricingRules.js`, or localStorage product carry-over logic.
- Any pricing presentation change that would require editing quote calculation or pricing rules.

## SEO / Content Risks To Revisit

- `hybrid-flooring-sydney.html` still includes a featured-product section driven by `products.js`. Content around that module should be reviewed again after the catalogue upload finishes so the live catalogue state and supporting copy stay aligned.
- `laminate-flooring-sydney.html` and `engineered-timber-flooring-sydney.html` still reference category-filtered product browsing while the broader catalogue upload is in progress. Re-check category landing expectations after the upload is complete.
- Visual mobile QA is still pending. This pass was structural and content-focused, not browser-render verified.
- Duplicate-content risk across suburb pages is improved, but each suburb page should still get another post-upload review once product/category content stabilises and more local proof points are available.
- Live Netlify form submission still needs deployed runtime testing because plain localhost and direct file mode cannot submit Netlify Forms.

## Mobile Layout Notes

- No browser rendering issues were detected from static review alone.
- A visual pass is still recommended on:
  - money page hero sections
  - suburb page FAQ sections
  - blog hub link grids

## Recommended Post-Upload Follow-Up

- Reconnect money-page product sections to the final uploaded catalogue state.
- Review category filters and selected-product carry-over on the product pages after the other Codex session finishes.
- Run a visual browser QA pass across mobile breakpoints once catalogue work is complete.

## Quote Submit Event QA Checklist

- Success path to test on Netlify runtime: complete the quote wizard, press `Submit quote request`, confirm `quote_submit` fires before submission, confirm `quote_submit_success` fires once after a successful form response, and confirm the page redirects to `thank-you.html`.
- Error path to test on simple localhost/static preview: complete the quote wizard, press `Submit quote request`, confirm the lead payload is saved to `operon_last_submitted_lead_result_v1`, confirm `quote_submit_error` fires once, and confirm the recovery banner appears.
- Error path to test on Netlify runtime with form failure: block the form endpoint or inspect a failed response, confirm the saved recovery payload remains available, and confirm no duplicate success/error events fire.
