# Operon Flooring Full Site Audit - 2026-07-05

## Scope

Audit target: `https://operonflooring.com.au`

Repo target: `/Users/daibang/Documents/New project`

This was an audit-first pass. No production deploy, no push, no Supabase changes, and no pricing/product/quote logic changes were made.

Raw local audit artifacts were written outside the repo:

- `/tmp/operon-audit-2026-07-05/crawl.json`
- `/tmp/operon-audit-2026-07-05/lighthouse-summary.json`
- `/tmp/operon-audit-2026-07-05/lighthouse/*.json`

## Coverage

| Area | Result |
| --- | --- |
| Sitemap URLs crawled | 87 |
| Total requested URLs crawled | 92 |
| Required route probes | Covered |
| Desktop Lighthouse pages | 8 |
| Mobile Lighthouse pages | 8 |
| Browser viewport QA | 1440, 1280, 768, 390 |
| Public leak/source-map probes | Passed |
| Existing conversion tests | Passed |
| Existing floorplan tests | Passed |

## Live Route Status Summary

| URL | Observed behaviour |
| --- | --- |
| `/` | 200 |
| `/index.html` | 301 to `/`, final 200 |
| `/quote.html` | 200 |
| `/products.html` | 200 |
| `/floorplan.html` | 200 |
| `/quote-review.html` | 200 |
| `/contact.html` | 200 |
| `/blog/` | 200 |
| `/blog.html` | 404 as approved |
| `/blog/index.html` | 301 to `/blog/`, final 200 |
| `/flooring-edmondson-park.html` | 200 |
| `/flooring-edmondson-park` | 301 to `.html`, final 200 |
| `/flooring-auburn.html` | 200 |
| `/auburn-flooring.html` | 301 to `/flooring-auburn.html`, final 200 |

Extensionless checked routes redirect to `.html` and did not expose duplicate 200 surfaces:

- `/quote`
- `/products`
- `/floorplan`
- `/quote-review`
- `/contact`
- `/flooring-edmondson-park`
- `/flooring-miranda`
- `/flooring-liverpool`
- `/laminate-flooring-sydney`
- `/hybrid-flooring-sydney`
- `/engineered-timber-flooring-sydney`

## Metadata And Crawl Findings

| Check | Result |
| --- | --- |
| Sitemap count | 87 canonical URLs |
| Sitemap redirect-source exclusions | Passed for `/index.html`, `/flooring-edmondson-park`, `/auburn-flooring.html`, `/blog/index.html` |
| H1 count | One H1 on sampled/crawled 200 indexable pages |
| Missing image alt | None found by crawler |
| Browser console sample | No console errors on sampled key pages |
| Browser horizontal overflow | None found at 1440, 1280, 768, or 390 on sampled key pages |
| Broken real DOM links | None confirmed in browser sample |

Crawler note: a simple static regex flagged three malformed quote-review links, but browser DOM inspection showed the visible anchors are clean. The flags came from escaped JavaScript string templates inside the generated page, not clickable `<a>` tags.

## Confirmed Bugs And Issues

| Issue | Status | Severity | Business impact | Recommended fix | Effort |
| --- | --- | --- | --- | --- | --- |
| Quote page wizard has six active steps, but the explainer says four steps | Confirmed | Medium | Trust/clarity issue on a revenue page | Update explainer to match six-step flow or rename it to a simplified overview | Small |
| Products page static/no-JS output says `Loading flooring products...` | Confirmed | Medium | Search/crawler and no-JS users see weak catalogue content | Add server-rendered category/range fallback or static featured products before hydration | Medium |
| Liverpool, Parramatta, Auburn status codes | Passed | Low | No routing bug found | Keep current canonical `.html` strategy | None |
| Visible heading `Internal links` on local pages | Confirmed on multiple older local pages | Medium | Looks template-like and customer-unfriendly | Rename to customer-facing copy such as `Useful next pages` or `Plan your flooring quote` | Small |
| Quote page honeypot text | Confirmed in crawled text | Low/Medium | May be visible to crawlers or assistive tech depending markup | Ensure honeypot is hidden with `aria-hidden`, `tabindex=-1`, and non-indexable helper text | Small |
| Category/local pages repeated FAQ patterns | Confirmed on older local pages | Medium SEO | Template footprint may limit local ranking gains | Rewrite thin/repeated pages in batches based on Search Console demand | Medium |
| Miranda page nearby links | Confirmed as weak geographically | Low/Medium SEO | Internal link relevance could be improved | Replace with Sutherland/Shire-adjacent or service/product links where available | Small |
| Footer/location crawl noise | Partially confirmed | Low | Footer links point to canonical pages; some are thin | Keep canonical links but improve thin pages before expanding more locations | Medium |
| Floorplan lacks full operational review/versioning layer | Partially mitigated | Medium Quote OS | Internal review foundation exists, but operational gate needs real reviewed samples | Finish live/staging admin QA and real sample corpus | Medium/Large |
| Mobile product filters/handoffs/upload flows | Partially tested | Medium | Browser sample had no overflow/errors; full side-effect form/upload QA was not run | Run preview/staging runtime QA before production changes | Medium |

## Conversion Path Audit

| Path | Status | Friction / risk |
| --- | --- | --- |
| Homepage to quote | Works; clear CTA | Mobile sticky CTA exists; no collision found in sample |
| Homepage to quote review | Works | Strong enough, but quote-review report content remains a conversion asset to keep improving |
| Homepage to floorplan | Works | Floorplan tool is heavier and needs review/versioning completion |
| Products to quote | Works conceptually | Product catalogue is JS-dependent and Lighthouse TBT is high |
| Floorplan to quote | Existing tests pass | Live side-effect handoff not re-submitted in this audit |
| Quote review to comparison quote | Visible CTA present | Escaped JS string templates can confuse naive crawlers; real DOM anchors are clean |
| Contact to enquiry | Page loads; contact function not side-effect tested | Needs staging-safe submission check if changing contact |
| Blog guide to quote/review/floorplan | Works through internal links | Blog index can better cluster guides by quote/product/local intent |
| Local page to quote | Works | Older local pages have template-like headings and thin content |
| Category page to quote/products/floorplan | Works | Some category/product pages need stronger static product proof |

## Browser QA Snapshot

Sampled pages:

- `/`
- `/quote.html`
- `/products.html`
- `/floorplan.html`
- `/quote-review.html`
- `/blog/`
- `/flooring-miranda.html`
- `/hybrid-flooring-sydney.html`

At 1440, 1280, 768 and 390 widths:

- No horizontal overflow detected.
- No broken images detected.
- One H1 detected on every sampled page.
- No console errors captured.
- No relevant localStorage/sessionStorage keys were present on fresh page loads.

## Lighthouse Summary

| Page | Desktop perf | Mobile perf | Main concern |
| --- | ---: | ---: | --- |
| `/` | 99 | 90 | Mobile LCP around 3.6s; homepage image weight |
| `/quote.html` | 81 | 75 | JS/TBT and unused JS from quote runtime |
| `/products.html` | 54 | 51 | Severe TBT, product catalogue hydration, desktop CLS |
| `/floorplan.html` | 100 | 93 | Unused JS; acceptable but tool is heavier |
| `/quote-review.html` | 72 | 95 | Desktop LCP and unused JS |
| `/blog/` | 100 | 100 | Healthy |
| `/flooring-miranda.html` | 100 | 100 | Healthy |
| `/hybrid-flooring-sydney.html` | 100 | 100 | Healthy |

Largest performance risk: `/products.html`.

## Security / Privacy Snapshot

No public source maps or obvious private files were exposed:

- `/_next/static/chunks/main-app.js.map` -> 404
- `/_next/static/css/app.css.map` -> 404
- `/.env` -> 404
- `/.git/config` -> 404
- `/package.json` -> 404
- `/netlify.toml` -> 404
- `/internal-qa/` -> 404

Public leak check passed.

See the separate security/privacy audit for details.

## Tests Run

- `npm run build` in `apps/web-tsx` - passed with known multiple-lockfile warning.
- `npm run test:conversion` - passed.
- `npm run test:static-output` - passed.
- `npm run test:floorplan-full` - passed.
- `npm run check:public-leaks` - passed.
- `git diff --check` - passed.
- Live route/status checks - passed.
- Lighthouse desktop/mobile on eight pages - completed.
- Browser QA sample across four viewport widths - completed.

## Top 10 Fixes By Priority

1. Fix quote page six-step vs four-step inconsistency.
2. Add no-JS/static product catalogue fallback for `/products.html`.
3. Fix product page performance/TBT and catalogue hydration cost.
4. Rename visible `Internal links` headings on older local pages.
5. Harden quote honeypot visibility for crawlers/screen readers.
6. Improve thin local pages under 450 words before expanding more suburb pages.
7. Tighten long titles/meta descriptions on over-length pages.
8. Clean up quote-review escaped JS link strings if they keep confusing crawlers.
9. Continue server-side/private pricing migration so public JS does not carry pricing-support internals.
10. Finish floorplan operational review/versioning QA with real approved sample corpus.

## Recommended Next Sprint

Sprint A: technical bugs and crawl/conversion hygiene.

Scope:

- quote step copy consistency
- product no-JS fallback
- product performance triage
- local page `Internal links` heading rename
- honeypot visibility hardening
- redirect-source and sitemap guards already added

Preview is required before production deployment because product/quote page behavior and layout are revenue-sensitive.
