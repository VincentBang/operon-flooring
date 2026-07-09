# Operon Flooring Site Improvement Master Plan - 2026-07-05

## Guiding Principle

Protect the public conversion engine first, then expand SEO and Quote OS capability. Do not add broad features or publish more pages while crawl, product, quote, and local-page quality issues remain.

## Foundation Phase

| Priority | Recommendation | Severity | Business impact | SEO impact | Conversion impact | Quote OS impact | Effort | Likely files | Risk | Rollback |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Fix quote six-step vs four-step copy inconsistency | Medium | Improves trust | Low | Medium | Low | Small | `apps/web-tsx/src/app/quote/page.tsx` | Low | Revert copy |
| 2 | Add product no-JS/static fallback | Medium | Better product discovery | Medium | High | Medium | Medium | `apps/web-tsx/src/app/products/page.tsx`, product data helpers | Medium | Revert fallback block |
| 3 | Reduce products page TBT/CLS | High | Product page feels faster | Medium | High | Medium | Medium/Large | product page/runtime JS/CSS | Medium | Revert perf patch |
| 4 | Rename visible `Internal links` headings | Medium | Less template-like | Medium | Medium | Low | Small | local page source data/components | Low | Revert copy |
| 5 | Harden quote honeypot visibility | Low/Medium | Accessibility/crawler clarity | Low | Low | Low | Small | quote/contact form markup | Low | Revert attributes |
| 6 | Keep redirect-source sitemap guards | Medium | Protects GSC validation | High | Low | Low | Done locally | static output tests | Low | Revert test/generator patch |
| 7 | Fix or document escaped quote-review link-string crawler noise | Low | Cleaner crawl | Low/Medium | Low | Low | Small | `quoteReviewReport.js` string builders | Low | Revert string change |

## Leverage Phase

| Priority | Recommendation | Severity | Business impact | SEO impact | Conversion impact | Quote OS impact | Effort | Likely files | Risk | Rollback |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8 | Upgrade thin suburb pages under 450 words | Medium | More qualified local leads | High | Medium | Low | Medium | local page data/components | Medium | Remove/revert page edits |
| 9 | Strengthen Miranda/Liverpool/Parramatta internal links | Medium | Better local relevance | High | Medium | Low | Small/Medium | local page data | Low | Revert links |
| 10 | Tighten long page titles/meta | Low/Medium | Better CTR | Medium | Low | Low | Small | metadata/page data | Low | Revert metadata |
| 11 | Re-cluster blog index by intent | Medium | Better guide navigation | Medium | Medium | Low | Medium | blog index page | Low/Medium | Revert layout/content |
| 12 | Keep `/quote.html` as instant quote owner | High | Protect ranking recovery | High | High | Low | Small | quote/flooring quote guide/home copy | Medium | Revert metadata/copy |
| 13 | Add stronger static product/category proof | Medium | Product confidence | High | High | Medium | Medium | products/category pages | Medium | Revert content |
| 14 | Continue project proof distribution | Medium | Trust and SEO moat | High | Medium | Medium | Medium/Large | project pages/recent projects | Medium | Hold unpublished pages |

## Scale Phase

| Priority | Recommendation | Severity | Business impact | SEO impact | Conversion impact | Quote OS impact | Effort | Likely files | Risk | Rollback |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 15 | Finish real floorplan sample corpus | High | Better measurement confidence | Low | Medium | High | Medium | `internal-qa`, docs, fixtures | Low | Remove fixtures |
| 16 | Complete floorplan reviewer QA | High | Internal review reliability | Low | Medium | High | Medium | admin/floorplan functions | Medium | Revert admin changes |
| 17 | Verify lead-event writes across all sources | High | Dashboard completeness | Low | Medium | High | Medium | Netlify functions/tests | Medium | Revert function changes |
| 18 | Build quote version schema/functions | High | Internal quote control | Low | Medium | High | Large | Supabase migrations/functions/admin | High | Migration rollback |
| 19 | Move private pricing support server-side | High | Security/margin control | Low | Medium | High | Large | pricing functions/product data | High | Feature flag/fallback |
| 20 | Build site visit checklist | Medium | Operational leverage | Low | Low | High | Medium | admin UI/functions/schema | Medium | Revert additive tables/UI |
| 21 | Build proposal generator | Medium | Follow-up speed | Low | High | High | Large | functions/templates/admin | High | Disable generator |
| 22 | Build follow-up queue dry-run | Medium | Sales discipline | Low | Medium | High | Medium | admin/functions/schema | Medium | Disable queue |

## Sprint A Recommendation

Sprint A should be narrow and preview-first:

1. Quote step consistency.
2. Product no-JS fallback.
3. Product page performance triage.
4. Visible `Internal links` heading cleanup.
5. Honeypot accessibility/crawler hardening.
6. Keep static output redirect-source tests.

Do not include:

- private pricing migration;
- broad content rewrites;
- new SEO page expansion;
- floorplan detection algorithm changes;
- automated follow-up messaging.

## Preview Requirement

Preview is required before production because Sprint A touches revenue pages:

- `/quote.html`
- `/products.html`
- local pages

Manual visual QA should cover:

- 1440 desktop
- 1280 laptop
- 768 tablet
- 390 mobile

Runtime QA should cover:

- product search/filter/clear;
- product to quote handoff;
- quote step progression;
- quote submit in preview/staging if approved;
- floorplan and quote-review smoke if shared layout changes are touched.
