# Operon Flooring SEO Monitoring Template

Use this after every approved production SEO release and as the monthly SEO operating rhythm.

## Required Exports

Save exports under `internal-docs/seo/search-console/` when available.

Search Console:

- Performance -> Queries, last 3 months.
- Performance -> Pages, last 3 months.
- Performance -> Devices, last 3 months.
- Performance -> Countries, last 3 months.
- Performance -> Dates, last 3 months.
- Page indexing -> Not indexed reasons and affected URLs.
- Page indexing -> Indexed URL list if available.
- Sitemaps -> `/sitemap.xml` status.
- Core Web Vitals/Page Experience screenshots or exports if available.

GA4:

- Pages and screens.
- Events.
- Key events/conversions.
- Landing page report if available.

## 7-Day Check

Purpose: catch obvious technical/indexing problems.

- Confirm `/sitemap.xml` loads.
- Confirm `/robots.txt` loads.
- Confirm `/blog.html` remains 404.
- Confirm changed URLs return 200.
- Confirm extensionless duplicates redirect to `.html`.
- Confirm source map/public leak probes remain blocked.
- In GSC, inspect changed priority URLs if access is available.
- Record whether sitemap was last read after deployment.
- Do not judge SEO success yet unless there is a clear technical failure.

## 14-Day Check

Purpose: identify early ranking and CTR movement.

For each changed priority page:

- clicks;
- impressions;
- CTR;
- average position;
- top queries;
- ranking URL for owner query;
- whether the intended URL is ranking.

Interpretation:

- Impressions up, CTR low: prepare title/meta test.
- Position 11-30: improve internal links and page depth.
- Wrong URL ranking: fix ownership and anchors.
- No impressions: check indexing and internal links before creating more content.

## 28-Day Check

Purpose: decide keep, improve, hold or expand.

For each changed page:

- compare 28 days after release vs previous 28 days;
- record query movement;
- record clicks and assisted conversions;
- check quote starts, quote submissions, quote-review uploads, floorplan use and product-to-quote clicks.

Decision options:

- Keep: impressions/clicks/conversions improved or page supports cluster.
- Improve: impressions exist but CTR/content depth is weak.
- Hold: indexed but no meaningful movement yet; wait if low crawl time.
- Consolidate/noindex later: sustained no impressions/clicks and no strategic value.

## Priority Query Groups

- instant flooring quote Sydney
- instant floor quote Sydney
- floor quote Sydney
- flooring quotes online
- flooring quote Sydney
- hybrid flooring Sydney
- laminate flooring Sydney
- engineered timber flooring Sydney
- flooring Miranda
- flooring Liverpool
- flooring Parramatta
- flooring Edmondson Park
- flooring Leppington
- flooring Bankstown
- flooring Auburn
- flooring quote review
- compare flooring quotes

## Conversion Events To Review

- quote_started
- quote_submitted
- quote_review_started
- quote_review_generated
- floorplan_file_uploaded
- floorplan_area_sent_to_quote
- product_continue_to_quote
- suburb_page_quote_click
- guide_to_quote_click
- phone_click
- email_click
- contact_submitted

## Monthly Output

Each monthly review should produce:

1. Top gaining pages.
2. Pages with impressions but weak CTR.
3. Queries in positions 4-10.
4. Queries in positions 11-30.
5. Pages that need internal links.
6. Pages that need title/meta tests.
7. Pages that need content depth.
8. New content opportunities backed by real query evidence.
9. Pages to hold back.
10. Next 5 SEO tasks.

## Data Integrity Rules

- Do not invent search volume, ranking, CTR or click data.
- Do not use sitewide average position as the main success metric.
- Use page/query pairs, not only page totals.
- Separate SEO traffic from conversion performance.
- Record unavailable exports as unavailable instead of estimating.
