# Operon Flooring SEO Data Export Requirements

Status: provider data required for the next optimisation cycle

This document defines the minimum evidence needed before making ranking, CTR or local-search decisions. Local code and crawl evidence can confirm technical implementation, but they cannot prove search demand or business outcomes.

## Google Search Console

Export the same comparison period for each report: last 28 days versus previous 28 days, plus a separate last-3-month view.

### Performance exports

Provide CSV or Google Sheets exports for:

- Queries: clicks, impressions, CTR and average position
- Pages: clicks, impressions, CTR and average position
- Queries filtered by each priority page
- Pages filtered by priority query groups
- Devices
- Countries
- Dates

Priority query groups:

- instant flooring quote Sydney and close variants
- flooring quote review Sydney and quote checklist variants
- upload floorplan for flooring quote and floor-area variants
- hybrid, laminate and engineered timber Sydney terms
- existing suburb-page terms

Do not export or infer search volume, CPC or keyword difficulty from Search Console. Those metrics are not present there.

### Indexing evidence

Provide:

- Page indexing summary and reason counts
- URLs for each non-indexed reason
- Indexed URL export where available
- Sitemap detail for `/sitemap.xml`, including submitted date, last read, status and discovered pages
- URL Inspection screenshots or exports for the homepage, quote, quote review, floorplan and any page with an unexpected indexing state
- Core Web Vitals mobile and desktop summaries
- HTTPS and rich-result issue summaries

## Google Analytics 4

Use aggregated reports only. Do not export names, emails, phone numbers, addresses, uploaded filenames, free text, quote values or document content.

Provide:

- Landing page report: sessions, engaged sessions, engagement rate and key events
- Page path report for quote, quote review, floorplan, products, category pages, guides and suburb pages
- Event counts for quote start/completion, quote-review start/completion, floorplan start/handoff, product-to-quote and contact submission
- Traffic acquisition by default channel group
- Device category
- Funnel exploration screenshots or export showing page entry to safe conversion events
- Date comparison matching the Search Console periods

Any event parameter export must be reviewed for personal or commercially sensitive fields before sharing.

## Google Business Profile

Provide aggregated monthly exports or screenshots for:

- Search views and map views
- Website clicks
- Calls
- Direction requests
- Search terms, where the account exposes them
- Profile completeness and verification state
- Review count and average rating only if the business approves public use and the values can be verified at implementation time

Do not export reviewer contact details or private message content.

## Evidence handling

- Store exports outside public web roots.
- Do not add customer-level exports to Git.
- Redact account identifiers that are not needed for analysis.
- Record export date, property/account, date range, comparison range and active filters.
- Treat screenshots as time-bound evidence, not permanent truth.

## Next analysis deliverable

With these exports, produce a page-and-query opportunity map covering:

1. pages with rising impressions and weak CTR;
2. queries in positions 4-10 and 11-30;
3. owner-page cannibalisation;
4. indexed URLs outside the sitemap;
5. pages that need stronger internal links or clearer snippets;
6. conversion paths with traffic but weak safe-event completion.
