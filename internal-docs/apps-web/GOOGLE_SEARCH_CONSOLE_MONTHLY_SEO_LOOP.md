# Google Search Console Monthly SEO Loop

Purpose: turn real Search Console data into the next monthly Operon Flooring SEO task list.

Status: active workflow, report-only by default.

Hard rule: do not guess rankings, query demand, CTR, indexing, Core Web Vitals or rich result status without Search Console or Google tooling data.

## Inputs

Export these from Google Search Console for the same month/date range:

1. Performance > Search results > Queries
2. Performance > Search results > Pages
3. Pages indexing report
4. Sitemaps report
5. Core Web Vitals report
6. Rich results/enhancements reports, if available

Optional but useful:

- Performance filtered to Australia
- Performance filtered to Web search only
- Performance filtered to important page groups, such as `/quote.html`, `/products.html`, `/quote-review.html`, `/floorplan.html`, `/blog/`, `/projects/` and `/flooring-`

## Export Folder

Create a folder for each month:

```text
internal-docs/seo/search-console/YYYY-MM/
```

Use these filenames where possible:

```text
queries.csv
pages.csv
indexing.csv
sitemaps.csv
core-web-vitals.csv
rich-results.csv
```

The analyzer accepts common Search Console CSV headers such as:

- `Query`, `Top queries`
- `Page`, `Top pages`
- `Clicks`
- `Impressions`
- `CTR`
- `Position`, `Average position`

## Analyzer Command

Run from repo root:

```bash
node scripts/analyze-gsc-seo-loop.js internal-docs/seo/search-console/YYYY-MM
```

The script writes:

```text
internal-docs/seo/search-console/YYYY-MM/monthly-seo-report.md
```

## Monthly Output

The monthly report must include:

- top gaining pages, if a previous month export exists
- pages with impressions but low CTR
- keywords near page 1
- pages to improve
- new content opportunities
- internal linking opportunities
- technical/indexing issues
- next 5 SEO tasks

If previous month files are unavailable, the report should say that gain/loss analysis is unavailable instead of guessing.

## Decision Rules

### Pages With Impressions But Low CTR

Prioritize pages where:

- impressions are meaningful for the site
- CTR is below expected for position
- title/meta can be improved without clickbait
- page already matches the query intent

Action types:

- improve title and meta
- sharpen first-screen copy
- add proof or FAQ matching the query
- add internal links to quote/products/quote-review/floorplan

### Keywords Near Page 1

Prioritize queries with:

- average position from 8 to 20
- impressions above the monthly median
- clear match to an existing page or cluster

Action types:

- improve the ranking page
- add internal links from related pages
- add a focused FAQ or section
- create a new page only when the intent is distinct and useful

### Pages To Improve

Prioritize pages with:

- impressions but weak CTR
- clicks but poor conversion-path support
- rankings near page 1
- important money-page or cluster-page role

Avoid:

- editing pages only because a low-volume query appeared once
- creating thin suburb pages
- writing generic AI content

### New Content Opportunities

Create content only when Search Console shows:

- repeated query patterns
- distinct intent not already served
- useful flooring-specific answer potential
- clear path to quote, quote review, products or floorplan

Examples of valid opportunity types:

- quote comparison questions
- product comparison questions
- apartment/acoustic questions
- floor preparation/removal questions
- suburb searches where a useful local page can be written
- project-proof/case-study searches

### Internal Linking Opportunities

Look for pages receiving impressions for a topic where another page should be supported.

Examples:

- product guide links to `/products.html`
- quote checklist links to `/quote-review.html`
- suburb page links to `/quote.html`, `/floorplan.html`, `/products.html`
- project proof links to related product/category and quote pages

### Technical/Indexing Issues

Use Search Console status only.

Do not infer indexing problems from local files alone.

Monthly checks:

- sitemap submitted and read
- indexed/not indexed movement
- canonical chosen by Google when available
- Core Web Vitals failing URLs
- rich result warnings/errors
- unexpected excluded money pages

## Monthly Review Checklist

1. Export the six Search Console files.
2. Run the analyzer.
3. Read `monthly-seo-report.md`.
4. Check no task violates pricing/privacy rules.
5. Choose the next 5 SEO tasks.
6. Do local implementation only.
7. Build and QA locally.
8. Create draft preview only when browser/runtime verification is needed.
9. Wait for human approval before production deploy.

## Production Guardrails

- Preserve `/blog/` as canonical.
- Keep `/blog.html` 404 unless explicitly approved.
- Keep `.html` URL strategy for public pages.
- Do not create duplicate extensionless 200 pages.
- Do not expose internal pricing, supplier costs, margins, private rate tables or debug fields.
- Do not create fake local project claims.
- Do not publish AI-thin suburb or guide pages.

## First Monthly Task Template

```text
Use Codex as an SEO execution analyst for Operon Flooring.

Input folder:
internal-docs/seo/search-console/YYYY-MM

Run:
node scripts/analyze-gsc-seo-loop.js internal-docs/seo/search-console/YYYY-MM

Report:
- top gaining pages
- pages with impressions but low CTR
- keywords near page 1
- pages to improve
- new content opportunities
- internal linking opportunities
- technical/indexing issues
- next 5 SEO tasks

Do not guess missing Search Console data.
Do not change code unless I approve the selected task list.
```
