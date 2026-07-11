# Operon Flooring SEO Master Plan

Last updated: 2026-07-10

## Strategic Goal

Build Operon Flooring into Sydney's leading quote-led flooring authority. SEO should generate qualified flooring quote leads and support the future internal Quote OS.

The public site is the acquisition and qualification layer:

Customer lands on the site -> chooses a product path -> measures floor area or uploads a floorplan -> reviews an existing quote if relevant -> starts a structured quote -> lead data later supports internal review, follow-up, site visit, proposal and job outcome workflows.

## Hard Rules

- Work on Operon Flooring only.
- Do not touch Operon Kitchens, Operon Bathrooms, Oz Timber or unrelated projects.
- Do not overwrite unrelated working-tree changes.
- Do not deploy production, push, trigger Netlify, apply Supabase migrations or modify production Supabase settings unless explicitly approved.
- Do not change quote pricing logic, product IDs, product slugs, supplier data, margins, private rates or pricing formulas.
- Do not change quote/product/floorplan handoff behaviour unless a verified bug exists.
- Do not expose internal rates, margins, supplier costs, rate tables, storage paths, raw OCR text, private formulas, service-role keys or backend secrets.
- Preserve the public `.html` URL strategy.
- Keep `/quote.html` as the main instant quote page.
- Keep `/blog.html` returning 404.
- Avoid duplicate extensionless 200 URLs.
- Do not create thin suburb pages or mass-generate weak AI pages.
- Do not publish the full 111-page expansion blindly.
- Do not create fake project proof or invent review counts, job counts, suburbs, project details, completion dates or product claims.
- Do not keyword-stuff, hide SEO text or add schema for invisible content.
- Do not add FAQ schema unless the FAQ is visible and genuine.
- Manual visual QA is required before production SEO releases.

## Current Technical State

Verified from local generated output and current repository docs:

- Generated sitemap count: 87 URLs.
- `/blog.html` is not present in the generated sitemap.
- Sampled extensionless redirect source `/flooring-edmondson-park` is not present in the generated sitemap.
- Current GSC/GA4/Lighthouse exports are not present in the repo; do not invent current ranking, CTR or performance data.
- Search Console export folder exists at `internal-docs/seo/search-console/`, but currently contains only a README and `.gitkeep`.
- The unrelated untracked file `operon-bathrooms/.next/trace` is outside this plan and should stay untouched.

Reported and documented current state:

- `/blog.html` returns 404.
- Extensionless routes redirect to approved `.html` URLs.
- Core sitemap pages have canonicals, title/meta and one H1.
- Product crawlable fallback and product page performance have recently been improved.
- Quote intent has been separated between `/quote.html`, `/flooring-quote-sydney.html` and `/`.

## URL Ownership Strategy

### `/quote.html`

Primary role: transactional instant quote page.

Owns:

- instant flooring quote Sydney
- instant floor quote Sydney
- floor quote Sydney
- flooring quotes online
- online flooring quote
- flooring quote Sydney
- start flooring quote

Preferred direction:

- Title: `Instant Flooring Quote Sydney | Online Estimate`
- H1: `Start an instant flooring quote for your Sydney project`

The page must clarify that the result is a starting estimate, not a fixed contract price. Product, area, stairs, removal, trims, access and final site details still affect the quote.

### `/flooring-quote-sydney.html`

Primary role: supporting quote education and comparison guide.

Owns:

- flooring quote Sydney guide
- what should be included in a flooring quote
- flooring quote inclusions
- flooring quote exclusions
- flooring quote scope
- how to compare flooring quotes
- questions to ask before accepting a flooring quote

Preferred direction:

- Title: `Flooring Quote Sydney Guide | Scope & Inclusions`
- H1: `What should a Sydney flooring quote include?`

This page must not compete as a second instant quote tool page. It should link strongly to `/quote.html`, `/quote-review.html`, `/floorplan.html`, `/products.html` and relevant category pages.

### Homepage `/`

Primary role: broad brand and quote-platform positioning.

Owns:

- Operon Flooring
- Sydney flooring quotes
- flooring product guidance
- flooring quote clarity
- flooring quote tools
- hybrid, laminate and engineered timber quote support

The homepage may link to `/quote.html` with `Start an instant flooring quote`, but should remain broader than the exact transactional quote cluster.

### Product Authority Pages

Primary category pages:

- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`

Each owns its category keyword and supports quote conversion. These pages should link to `/products.html`, `/quote.html`, `/quote-review.html`, `/floorplan.html`, relevant suburb pages and genuine recent projects.

### Local Suburb Pages

Priority local pages:

- `/flooring-miranda.html`
- `/flooring-liverpool.html`
- `/flooring-edmondson-park.html`
- `/flooring-parramatta.html`
- `/flooring-leppington.html`
- `/flooring-bankstown.html`
- `/flooring-auburn.html`

Each suburb page should include unique suburb context, property type relevance, product recommendations, access/removal/stairs considerations, quote CTA, quote-review CTA and links to products/floorplan. Do not create product-suburb pages such as `hybrid-flooring-miranda.html` unless there is enough unique content and a clear strategic reason later.

## Completed Sprint History

### Sprint A - Technical/Crawl Hygiene

Reported completed and current docs indicate fixed:

- Product no-JS/static fallback.
- Product page performance and layout stability.
- Customer-facing `Internal links` wording cleanup.
- Crawler-facing output hardening.
- Static output contracts.

Outstanding verification: manual visual QA is still required before production release candidates.

### Sprint 1 - Quote Intent Recovery

Optimised:

- `/`
- `/quote.html`
- `/flooring-quote-sydney.html`
- `/flooring-miranda.html`
- `/flooring-liverpool.html`
- `/flooring-edmondson-park.html`

Goal: recover and clarify relevance for instant quote and local quote queries.

### Sprint 2 - Product Authority Pages

Rebuilt:

- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`

Added stronger product use cases, apartment/rental/home guidance, quote implications, internal links and safe FAQ/schema patterns.

### Sprint 3 - Internal Link Strengthening

Improved links from:

- `/blog/`
- `/products.html`
- `/recent-flooring-projects.html`

Goal: pass more authority to quote, quote-review, product category and local pages.

### Sprint 4 - More Impression Page Optimisation

Improved:

- `/flooring-parramatta.html`
- `/flooring-leppington.html`
- `/flooring-bankstown.html`
- `/flooring-auburn.html`
- `/flooring-installation-cost-sydney.html`

### Sprint 5 - Title/Meta Tightening

Improved title/meta targeting for:

- `/flooring-miranda.html`
- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`

## Known SEO Risks

1. Some local pages may still be thin or template-like.
2. Some suburb pages need more unique local/property/product depth.
3. Product/range pages should not go live until rewritten to remove internal commercial language.
4. Project/case-study pages must not invent unknown details.
5. Mobile product-page LCP may still need improvement.
6. Quote intent can cannibalise if `/`, `/quote.html` and `/flooring-quote-sydney.html` are not kept distinct.
7. Search Console monitoring is needed before expanding aggressively.
8. Some extensionless routes need periodic verification.
9. Some location pages need more unique proof and tighter local logic.

## Held-Back Page Guidance

Do not publish:

- weak product/range pages;
- thin comparison/service guides;
- project pages with unknown details;
- pages mentioning supplier costs, margins, internal rates or private pricing;
- generated pages with repeated structure;
- unverified case studies;
- suburb pages without unique local value;
- pages without meaningful internal links;
- pages without a clear owner query.

Release criteria for a held-back page:

- clear owner keyword;
- unique search intent;
- non-duplicated title and meta description;
- one clear H1;
- real customer usefulness;
- no internal commercial language;
- no private pricing data;
- at least 3 strong contextual internal links;
- clear quote/floorplan/quote-review CTA;
- visible proof if project-based;
- self-referencing canonical;
- sitemap inclusion only after QA.

## Measurement Plan

Use Search Console and GA4. Current exact exports are not available in the repo, so current clicks, CTR, query-level ranking and GA4 conversion data must be exported before analysis.

Track:

- clicks;
- impressions;
- CTR;
- average position;
- ranking page per query;
- quote starts;
- quote submissions;
- quote-review uploads;
- quote-review-to-quote clicks;
- floorplan uploads;
- floorplan-to-quote clicks;
- product-to-quote clicks;
- suburb-page quote clicks;
- contact submissions.

Review windows:

- 7 days vs previous 7;
- 14 days vs previous 14;
- 28 days vs previous 28.

Ranking buckets:

- 1-3;
- 4-10;
- 11-20;
- 21-30;
- 31-50;
- 51+.

Do not overreact to sitewide average position. Prioritise pages and queries already receiving impressions.

## 90-Day Execution Roadmap

### Days 1-14

- Finish the current truth audit.
- Keep `quote.html` as the instant quote owner.
- Recheck `/blog.html`, extensionless redirects and sitemap count after each release.
- Monitor GSC for Sprint 1-5 page responses.
- Fix only confirmed leftovers from generated output or GSC.

### Days 15-45

- Upgrade thin local pages before adding more suburbs.
- Tighten titles/meta on pages with impressions but weak CTR.
- Improve internal linking from blog and local pages into quote/product/quote-review/floorplan paths.
- Rewrite held-back product/range/project pages without private commercial language.
- Keep new URLs out of sitemap until they pass release criteria.

### Days 46-90

- Prepare a controlled Batch 2 only from rewritten, reviewed pages.
- Expand project proof only from real photos/details.
- Use GSC data to decide new guide topics.
- Connect SEO conversion metrics to Quote OS lead/event reporting where safe.

## Page Release Criteria

A page can be released only when:

- it has one primary owner query;
- it is not a duplicate of an existing page;
- it has a unique title, meta description and H1;
- it has useful opening copy;
- it has contextual internal links;
- it has a quote CTA and an appropriate secondary CTA;
- it has no private pricing, supplier cost, margin, storage path or raw OCR references;
- it has visible FAQ content before FAQ schema is added;
- it has a self-canonical URL;
- it is in sitemap only after QA;
- desktop and 390px mobile visual QA pass.

## Monitoring Process

After every approved production SEO release:

1. Confirm sitemap count and `/sitemap.xml` status.
2. Confirm `/robots.txt`.
3. Confirm `/blog.html` remains 404.
4. Confirm extensionless routes redirect to `.html`.
5. Inspect new/changed URLs in Search Console.
6. Record changes in the CTR test log.
7. Recheck 7-day, 14-day and 28-day results.
8. Decide keep, improve, hold or roll back based on data and conversion behaviour.

## Rollback And QA Rules

- No production SEO deployment without preview QA and human approval.
- No new page batch without manual desktop/mobile review.
- If a page exposes private pricing, internal commercial terms or fake proof, remove it from sitemap or revert it before release.
- If a release creates duplicate 200 URL surfaces, broken quote/product/review/floorplan paths or source leaks, block production deployment.
- If a production SEO release harms conversion-critical paths, rollback before continuing SEO work.

## Current Next Priorities

1. Export real GSC Queries, Pages, Devices, Countries and Dates data.
2. Monitor Sprint 1-5 pages over 7, 14 and 28 days.
3. Improve pages with impressions but weak CTR.
4. Upgrade thin suburb pages already in sitemap before publishing new local pages.
5. Rewrite held-back product/range/project pages before any Batch 2 release.
6. Improve mobile product-page LCP only if visual/performance evidence confirms it remains a problem.
7. Keep `/quote.html`, `/flooring-quote-sydney.html` and `/` in separate intent lanes.
