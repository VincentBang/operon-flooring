# SEO Migration Audit

## Saved source exports

The Search Console exports provided for the old WordPress site have been saved here for reference:

- [Top target pages CSV](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-Top target pages-2026-05-18.csv>)
- [Performance chart PDF](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-Performance-on-Search-2026-05-18 - Chart.pdf>)
- [Top linking sites PDF](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-Top linking sites-2026-05-18 - Table.pdf>)
- [Top target pages PDF](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-Top target pages-2026-05-18 - Table.pdf>)
- [More sample links CSV](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-More sample links-2026-05-18.csv>)
- [Latest links CSV](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-Latest links-2026-05-18.csv>)

## What the old site was carrying

The old `oztimberfloor.com.au` site was not just ranking on the home page and three core category pages. The export shows a broad footprint across:

- category hubs such as `/laminate/`, `/hybrid/`, `/solid-timber/`, `/vinyl/`, `/bamboo/`
- service pages such as `/timber-floor-installation/`, `/timber-floor-removal-and-stripping/`, `/timber-floor-sanding-and-polishing/`, `/floor-levelling/`
- commercial intent pages such as `/commercial-flooring/` and `/office-flooring/`
- many product-category and range URLs such as `/product-category/hybrid/hydroplank-wpc/` and `/product-category/laminate/swish-laminate/`

The old internal link graph was also very dense. Many of those URLs had `335+` internal links from the old site navigation and category structure.

## Current site audit

### 1. Critical: current site is canonically a different domain

The current public files point to `operonflooring.com.au`, not `oztimberfloor.com.au`.

Evidence:

- [apps/web/index.html](/Users/daibang/Documents/New%20project/apps/web/index.html:8)
- [apps/web/products.html](/Users/daibang/Documents/New%20project/apps/web/products.html:9)
- [apps/web/sitemap.xml](/Users/daibang/Documents/New%20project/apps/web/sitemap.xml:3)
- [apps/web/robots.txt](/Users/daibang/Documents/New%20project/apps/web/robots.txt:4)

Why this matters:

- If the migration target is still `oztimberfloor.com.au`, these canonicals, sitemap URLs, Open Graph URLs, and structured data URLs need to be switched before launch.
- If the migration target is truly `operonflooring.com.au`, then this becomes a domain move and must be handled as a full old-domain-to-new-domain migration with 301 redirects and post-launch Search Console monitoring.

### 2. Critical: there is no legacy redirect map yet

The current redirect config only handles a few clean URL variants. It does not include redirects from the old WordPress URLs.

Evidence:

- [netlify.toml](/Users/daibang/Documents/New%20project/netlify.toml:26)

Why this matters:

- Old ranking URLs and backlink targets will 404 unless we add explicit `301` rules.
- Redirecting everything to the home page would waste most of the old relevance and link equity.

### 3. Critical: the new site has collapsed many old indexable range pages into one catalogue page

The current catalogue holds about `49` ranges and `478` product colour records in JS data, but the sitemap only exposes one crawlable catalogue URL: `products.html`.

Evidence:

- [apps/web/products.js](/Users/daibang/Documents/New%20project/apps/web/products.js:1573)
- [apps/web/products.html](/Users/daibang/Documents/New%20project/apps/web/products.html:1)
- [apps/web/sitemap.xml](/Users/daibang/Documents/New%20project/apps/web/sitemap.xml:7)

Why this matters:

- Old high-link range URLs such as `hydroplank-wpc`, `swish-laminate`, `prestige-oak`, `oakleaf-laminate`, `ornato-hybrid`, and `villeroy-boch-aquastop-*` do not currently have matching static destination pages.
- A single dynamic catalogue page is much weaker as a migration target than one dedicated landing page per high-value range.

### 4. High: several old intent pages do not have an equivalent live page

These old URLs were present in the target-page export but do not have a clear like-for-like destination in the current site:

- `/solid-timber/`
- `/vinyl/`
- `/bamboo/`
- `/timber-floor-installation/`
- `/timber-floor-removal-and-stripping/`
- `/timber-floor-sanding-and-polishing/`
- `/floor-levelling/`
- `/commercial-flooring/`
- `/office-flooring/`
- `/faqs/`
- `/services/`
- `/about-us/`

Why this matters:

- For migration safety, each of these should either have a replacement page with similar topic intent or a carefully chosen nearest equivalent.
- Several of these are commercial/service-intent pages, which are often the pages most likely to matter for conversions and keyword relevance.

### 5. Medium: some current pages are SEO-valid but not migration-complete

The current category pages do have title tags, descriptions, canonicals, schema, and internal links.

Evidence:

- [apps/web/hybrid-flooring-sydney.html](/Users/daibang/Documents/New%20project/apps/web/hybrid-flooring-sydney.html:1)
- [apps/web/engineered-timber-flooring-sydney.html](/Users/daibang/Documents/New%20project/apps/web/engineered-timber-flooring-sydney.html:1)
- [apps/web/laminate-flooring-sydney.html](/Users/daibang/Documents/New%20project/apps/web/laminate-flooring-sydney.html:1)

That is good groundwork, but it does not solve the migration by itself because the old site had a much broader URL footprint and intent mix.

### 6. Medium: backlink profile still needs redirect protection even if quality is mixed

The sample links export shows many links from directories, local listings, syndicated articles, and low-to-medium quality external pages. Even when the link quality is not ideal, those URLs still need working redirects if they point to old ranking pages.

Evidence:

- [More sample links CSV](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-More sample links-2026-05-18.csv>)
- [Latest links CSV](</Users/daibang/Documents/New project/docs/seo-migration/source/https___oztimberfloor.com.au_-Latest links-2026-05-18.csv>)

## Coverage check for the most important old URLs

### Old URL groups with a reasonable current destination

- `/` -> `/`
- `/laminate/` -> `/laminate-flooring-sydney.html`
- `/hybrid/` -> `/hybrid-flooring-sydney.html`
- `/engineered-timber-flooring/` -> `/engineered-timber-flooring-sydney.html`
- `/blogs/` -> `/blog/`
- `/contact-us/` -> `/contact.html`

### Old URL groups that need either a new page or a dedicated redirect decision

- all old range URLs under `/product-category/.../`
- all old single-product URLs under `/product/.../`
- `/solid-timber/`
- `/vinyl/`
- `/bamboo/`
- `/timber-floor-installation/`
- `/timber-floor-removal-and-stripping/`
- `/timber-floor-sanding-and-polishing/`
- `/floor-levelling/`
- `/commercial-flooring/`
- `/office-flooring/`
- `/faqs/`
- `/services/`
- `/about-us/`

## Migration-safe recommendation

### Before launch

1. Decide the final public domain first.
   If the migrated site will live on `oztimberfloor.com.au`, update all canonicals, sitemap URLs, structured data URLs, and robots references away from `operonflooring.com.au`.

2. Build a full old-to-new `301` redirect map.
   This should cover every old category page, service page, range page, and product page that had real internal links, rankings, or backlinks.

3. Restore high-value landing pages before redirecting.
   The biggest content gaps are the range pages and missing service/category hubs. Redirecting those old URLs to a generic catalogue page is a weak fallback, not the preferred end state.

4. Create dedicated static destinations for the strongest old ranges.
   Start with the old high-link ranges in the Search Console export:
   `hydroplank-wpc`, `ornato-hybrid`, `swish-laminate`, `kronoswiss-aquastop-*`, `villeroy-boch-aquastop-*`, `prestige-oak`, `fiddleback`, `oakleaf-laminate`, `artisan-oak`, `storm-luxury-hybrid-planks`, `topdeck-pre-finished-solid-timber`.

5. Preserve intent, not just topic.
   Service pages should map to service pages. Product/range pages should map to product/range pages. Commercial pages should map to commercial pages. Avoid broad home-page redirects.

### Immediately after launch

1. Submit the new sitemap in Search Console.
2. Crawl the old top URLs and confirm they return `301` to the correct destination.
3. Check for `404`, `soft 404`, `redirect error`, and `alternate page with proper canonical` issues in Search Console.
4. Compare impressions and clicks for old top pages weekly for the first month.

## Priority actions for this repo

1. Update domain references if `oztimberfloor.com.au` is the migration target.
2. Add redirect rules for old WordPress URLs in [netlify.toml](/Users/daibang/Documents/New%20project/netlify.toml:26) or a dedicated `_redirects` file.
3. Add missing high-intent service/category pages.
4. Add static range landing pages for the strongest migrated range URLs instead of relying only on [apps/web/products.html](/Users/daibang/Documents/New%20project/apps/web/products.html:1).
5. Expand the sitemap after those pages exist.

## Bottom line

The current site is a decent SEO base for a new brochure-and-quote site, but it is not yet safe for a full migration from the old WordPress site without ranking loss.

The two biggest blockers are:

- the domain/canonical mismatch between `oztimberfloor.com.au` and `operonflooring.com.au`
- the missing redirect and page-level replacement plan for the old range and service URLs

Until those are fixed, migrating the old site would carry a high risk of losing category, service, and long-tail range visibility.
