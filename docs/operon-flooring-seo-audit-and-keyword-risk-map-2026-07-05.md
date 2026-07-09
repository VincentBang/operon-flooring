# Operon Flooring SEO Audit And Keyword Risk Map - 2026-07-05

## Summary

The current production site has a clean technical SEO base:

- 87 canonical sitemap URLs.
- Sitemap excludes known redirect sources.
- `/blog.html` remains 404.
- Extensionless routes redirect to approved `.html` URLs.
- Sampled pages have one H1 and valid canonicals.
- Browser sample found no mobile overflow or console errors.

The main SEO risks are now quality and focus, not basic crawlability:

- Some local pages are thin and template-like.
- Several older local pages expose the customer-facing heading `Internal links`.
- Product catalogue content is mostly hydrated by JavaScript.
- Some page titles/meta descriptions are long.
- Quote intent is split across `/quote.html`, `/flooring-quote-sydney.html`, homepage copy, and quote-review guides; ownership should remain deliberate.

## Keyword Ownership Map

| Keyword cluster | Primary owner | Support pages | Risk |
| --- | --- | --- | --- |
| `instant flooring quote Sydney`, `instant floor quote Sydney` | `/quote.html` | `/flooring-quote-sydney.html`, `/` | Medium cannibalisation risk if homepage or guide titles become too quote-tool focused |
| `flooring quote Sydney`, `flooring quotes online` | `/quote.html` primary, `/flooring-quote-sydney.html` support | quote-review guides | Medium; keep guide educational and quote page transactional |
| `hybrid flooring Sydney` | `/hybrid-flooring-sydney.html` | `/products.html`, hybrid comparison/blog pages | Low; owner is clear |
| `laminate flooring Sydney` | `/laminate-flooring-sydney.html` | `/products.html`, laminate/hybrid guides | Low; owner is clear |
| `engineered timber flooring Sydney` | `/engineered-timber-flooring-sydney.html` | `/products.html`, engineered/laminate guides, recent projects | Low; owner is clear |
| `flooring Miranda`, `laminate flooring Miranda`, `hybrid flooring Miranda` | `/flooring-miranda.html` | product category pages | Medium; internal nearby links are geographically weak |
| `flooring Liverpool`, `timber flooring Liverpool` | `/flooring-liverpool.html` | `/flooring-edmondson-park.html`, `/flooring-leppington.html` | Low/Medium; page is decent but could use stronger product proof |
| `timber flooring Edmondson Park` | `/flooring-edmondson-park.html` | `/flooring-leppington.html`, `/flooring-liverpool.html` | Low; recent optimisation looks strong |
| `flooring Parramatta` | `/flooring-parramatta.html` | `/flooring-auburn.html`, `/flooring-ryde.html` | Medium; continue local-specific depth |
| `flooring Auburn` | `/flooring-auburn.html` | `/flooring-bankstown.html`, `/flooring-parramatta.html` | Low; legacy `/auburn-flooring.html` correctly redirects |

## Sitemap And Canonical Findings

| Check | Status |
| --- | --- |
| Sitemap URL count | 87 |
| Redirect-source URLs in sitemap | Not present |
| `/index.html` | 301 to `/`, not in sitemap |
| `/flooring-edmondson-park` | 301 to `.html`, not in sitemap |
| `/auburn-flooring.html` | 301 to `/flooring-auburn.html`, not in sitemap |
| `/blog/index.html` | 301 to `/blog/`, not in sitemap |
| `/blog.html` | 404 |

The homepage canonical is emitted as `https://operonflooring.com.au` without the trailing slash. It resolves to the same root resource; this is not a redirect-source issue, but aligning it with the sitemap slash is a small future cleanup if desired.

## Metadata Issues

Duplicate title/meta clusters from the crawl were caused by probing redirect-source URLs and their final destinations. Exact sitemap canonicals are not duplicated.

Over-length or near-limit pages to tighten:

- `/apartment-flooring-sydney.html`
- `/flooring-double-bay.html`
- `/flooring-neutral-bay.html`
- `/flooring-balmain.html`
- `/flooring-drummoyne.html`
- multiple maintenance blog posts with 70+ character titles

These are not blockers, but title tightening may improve CTR once Search Console impressions rise.

## Thin Or Template-Like Pages

Indexable pages under roughly 450 words:

- `/flooring-balmain.html`
- `/flooring-woollahra.html`
- `/flooring-mosman.html`
- `/flooring-drummoyne.html`
- `/flooring-coogee.html`
- `/flooring-vaucluse.html`
- `/flooring-wahroonga.html`
- `/flooring-killara.html`
- `/flooring-pymble.html`
- `/flooring-neutral-bay.html`
- `/flooring-double-bay.html`
- `/flooring-rose-bay.html`
- `/apartment-flooring-sydney.html`
- selected shorter guides such as acoustic underlay, stairs/nosing, and cost breakdown

Recommendation: do not add more suburb pages until these are upgraded or proven by Search Console demand.

## Visible SEO-ish Headings

Several older local pages include a customer-visible heading/eyebrow equivalent to `Internal links`. Confirmed affected set includes:

- `/flooring-fairfield.html`
- `/flooring-cabramatta.html`
- `/flooring-blacktown.html`
- `/flooring-strathfield.html`
- `/flooring-burwood.html`
- `/flooring-ryde.html`
- `/flooring-epping.html`
- `/flooring-castle-hill.html`
- `/flooring-baulkham-hills.html`
- `/flooring-marrickville.html`
- `/flooring-randwick.html`

Recommended replacement: `Useful next pages`, `Plan your flooring quote`, or `Compare products and quote scope`.

## Structured Data Opportunities

Existing pages use useful JSON-LD patterns including:

- Service
- BreadcrumbList
- FAQPage
- Article / blog schemas where applicable

Opportunities:

- Add stronger LocalBusiness/service relationship on priority local pages only.
- Keep FAQ schema unique; avoid repeated local FAQ templates.
- Add project/case-study schema only when real project details/photos are known.

## Internal Linking Notes

Good:

- Footer links use canonical `.html` URLs.
- Blog hub and product pages link naturally to quote/review/floorplan.
- Redirect-source URLs are not linked in active generated output.

Needs work:

- Miranda links to Randwick/Marrickville/Bankstown as nearby locations; this is geographically weak.
- Thin local pages need more relevant nearby clusters, product links, floorplan and quote-review pathways.
- Blog hub can better group quote-review, product comparison, maintenance, and cost guides.

## No-Publish / Hold Guidance

Hold or rewrite before publishing more pages:

- Thin suburb expansions without local specificity.
- Product/range pages that mention supplier cost, margin or internal commercial language.
- Project pages with repeated `not recorded` language or no real project proof.
- Comparison/service guides that share the same structure and examples.

## First SEO Fix Recommendations

1. Fix product no-JS/static content weakness.
2. Improve product page performance.
3. Rename `Internal links` headings on older local pages.
4. Tighten long titles/meta on priority pages.
5. Strengthen Miranda local relevance and nearby links.
6. Upgrade 10-12 thin local pages before publishing more.
7. Keep `/quote.html` as the owner of instant/online quote intent.
8. Keep `/flooring-quote-sydney.html` as a supporting guide.
9. Use Search Console after 7-14 days to decide the next local/content batch.
10. Do not publish the full expansion blindly.
