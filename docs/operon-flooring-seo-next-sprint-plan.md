# Operon Flooring SEO Next Sprint Plan

Last updated: 2026-07-10

## Current Audit Truth

- Generated sitemap count: 87 URLs.
- `/blog.html` is absent from the generated sitemap and should remain 404.
- Sampled extensionless redirect source `/flooring-edmondson-park` is absent from the generated sitemap.
- Current Search Console/GA4 exports are not available in the repo.
- Recent Sprint A-5 docs show the highest-risk crawl/conversion hygiene issues have been addressed locally or in previous pushed work.
- No full 111-page expansion should be deployed.
- Unrelated `operon-bathrooms/.next/trace` remains untracked and excluded.

## Confirmed Completed Work To Preserve

- `/quote.html` is the owner of instant/online quote intent.
- `/flooring-quote-sydney.html` is the supporting quote guide.
- Homepage remains broader brand/quote-platform positioning.
- Product authority pages have been rebuilt for hybrid, laminate and engineered timber.
- Blog/product/recent-project internal links were strengthened.
- High-impression local pages received title/meta/content tightening.
- Product page crawlable fallback and performance were improved.

## Confirmed Leftovers

No new code blocker was confirmed during this documentation pass. The remaining issues are planning, measurement and content-quality risks:

- Missing real GSC/GA4 export data in the repo.
- Thin/template-like local pages still need upgrade before further expansion.
- Held-back product/range/project pages need rewriting before indexable release.
- Manual visual QA remains required before production SEO releases.
- Mobile product LCP should be checked with fresh Lighthouse/PageSpeed data before another performance sprint.

## Sprint F Recommendation - Thin Local Page Upgrade

Goal: improve existing sitemap pages before creating new URLs.

Scope: local-only content/SEO improvements, no new pages, no pricing/product/quote logic changes.

Priority pages:

1. `/flooring-balmain.html`
2. `/flooring-drummoyne.html`
3. `/flooring-woollahra.html`
4. `/flooring-mosman.html`
5. `/flooring-coogee.html`
6. `/flooring-vaucluse.html`
7. `/flooring-neutral-bay.html`
8. `/flooring-double-bay.html`

For each page:

- keep the existing URL;
- preserve self-canonical;
- improve unique local intro;
- add property-type context;
- add product suggestions with links to category pages;
- add access/removal/stairs considerations;
- add quote CTA;
- add quote-review CTA;
- add floorplan CTA where natural;
- add nearby internal links only where geographically sensible;
- avoid fake project proof;
- avoid internal pricing language;
- add FAQ only if genuinely useful and visible.

## Sprint F Acceptance Criteria

- No new URLs.
- Sitemap count remains stable unless an existing noindex/utility decision is intentionally changed.
- All edited pages have unique title/meta/H1/opening copy.
- No page includes supplier costs, margins, internal rates or private pricing language.
- `/blog.html` remains 404.
- Extensionless duplicates remain redirects, not duplicate 200 pages.
- Static output checks pass.
- Manual visual QA is completed before production deployment.

## Suggested Verification

Run locally after implementation:

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks`
- `git diff --check`
- `node internal-qa/tests/web/staticOutputContract.test.js`
- Route/static checks for changed pages, `/`, `/quote.html`, `/products.html`, `/quote-review.html`, `/floorplan.html`, `/blog/`, `/sitemap.xml`, `/robots.txt`

Do not create a Netlify draft preview unless explicitly approved.

## Later Sprint G - Held-Back Page Rewrite

Only after Sprint F or real GSC evidence:

- rewrite product/range pages to remove internal commercial language;
- rewrite project/case-study pages using only real known facts;
- rewrite thin guides with practical flooring-specific examples;
- keep all held-back pages out of sitemap until QA.

## Later Sprint H - Data-Driven CTR Tests

Only after real GSC exports:

- populate `docs/operon-flooring-seo-ctr-test-log.md`;
- identify page/query pairs with impressions and weak CTR;
- test title/meta on 3-5 pages at a time;
- wait 14-28 days before judging.

## Production Release Rule

Production deployment is blocked until:

- local checks pass;
- draft preview is approved if the change affects layout or conversion paths;
- manual desktop/mobile visual QA passes;
- human explicitly approves deploy.
