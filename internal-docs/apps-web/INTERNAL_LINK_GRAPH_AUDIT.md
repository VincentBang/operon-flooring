# Operon Internal Link Graph Audit

Source-of-truth status: working audit for crawl graph density and conversion pathways.

## Link Graph Goals

Every important page should link:

- upward to a parent commercial page
- sideways to related comparison, problem, or maintenance pages
- downward to suburb, guide, or project proof pages where relevant
- toward conversion paths: `quote.html`, `quote-review.html`, `products.html`, and `floorplan.html`

## Scope Standard Link Policy

Use internal links to help the customer move from uncertainty to the right next decision.

Scope Standard link triggers:

- product unclear -> link to `products.html` or the relevant product category page
- area unclear -> link to `floorplan.html` or the measurement guide
- quote scope unclear -> link to `quote-review.html`
- final estimate needed -> link to `quote.html`
- preparation or subfloor risk -> link to `blog/do-you-need-floor-preparation.html`
- product comparison uncertainty -> link to the relevant comparison guide
- local access/apartment uncertainty -> link to the relevant suburb or apartment-supporting guide

Do not add quote-review links mechanically. Add them when the page is already discussing quote comparison, unclear inclusions, preparation, access, stairs, apartment requirements, or external quote confidence.

## Completed Link Improvements

- Product SEO pages now cross-link between hybrid, laminate, and engineered timber category pages.
- Product SEO pages now include visible quote-review CTAs.
- Product SEO pages now include checklist sections that connect education to quote and validation paths.
- Hybrid page now links to guide content for hybrid vs laminate, hybrid problems, and measuring floor area.
- 2026-05-08 SEO audit: homepage, quote page, quote-review page, thank-you page, and product SEO pages have visible quote-review pathways.
- 2026-05-08 SEO audit: selected comparison/problem guides now include quote-review pathways where scope comparison is part of the reader intent.

## Next Link Opportunities

- Add natural product-page links from high-performing maintenance/problem guides.
- Add guide links from suburb pages where they answer a local customer concern.
- Add floorplan links only where measurement uncertainty is part of the page intent.
- Add quote-review links where the page helps compare or validate scope.
- Add quote-review links to local/suburb pages only where quote comparison, apartment access, stairs, preparation, or unclear inclusions are discussed.
- Add quote-review links to remaining maintenance/problem guides when the page helps users decide whether a repair, replacement, or external quote is missing scope.

## 2026-05-08 Entry-Point Audit

| Path type | Strongest current coverage | Gaps to revisit |
| --- | --- | --- |
| Quote review | Homepage, quote page, quote-review page, thank-you page, product SEO pages, selected comparison/problem guides | Suburb pages and many maintenance guides currently rely on quote/product/floorplan paths instead of quote-review links. |
| Floor plan | Product pages, cost guides, suburb pages, measurement guide, quote flow | Keep floorplan links tied to measurement uncertainty; avoid adding them to every page by default. |
| Products | Product SEO pages, suburb pages, blog guides, quote flow | Dynamic catalogue interaction remains the product-system owner; SEO pages should link into it without changing product state. |
| Contact/help | Most public pages include a footer contact path | `quote.html` and `floorplan.html` prioritize task completion over contact links, which is acceptable unless support friction appears in analytics. |

## 2026-05-08 Queue 002 Link Gap Refresh

| Area | Audit result | Next action |
| --- | --- | --- |
| Product SEO pages | Hybrid, laminate and engineered timber pages have quote, product, floorplan, quote-review and guide destinations, and static link targets resolve locally. | Keep product pages as commercial owners; do not change catalogue/runtime interaction during SEO passes. |
| Measurement utility paths | Floorplan links are strongest on product pages, suburb pages, cost guides, measurement guide and quote flow. | Add floorplan links only when measurement uncertainty is part of the reader intent. |
| Maintenance/problem cluster | Many guides already link to products, quote or floor care, but quote-review should remain selective. | Use quote-review only when the page discusses repair-vs-replace, unclear external quotes, missing scope, access, preparation, stairs or apartment requirements. |
| Suburb pages | Priority suburb pages have footer, quote, product and neighbour/location pathways. Current audit found no need for blanket quote-review links. | Add local links only when they answer a real local concern, and wait for project proof before expanding local proof copy. |
| Blog hub | The hub now includes quote, quote-review, products, floorplan and floor-care paths in the `Use the Site` group. | Consider category grouping if more guides are added. |

## Quote-Review Link Policy

Quote-review links are strongest when the reader is comparing scope or deciding whether an existing estimate is complete. They should not be added mechanically to every guide or suburb page. Strong triggers include stairs, subfloor preparation, removal, apartment rules, missing inclusions, repair-vs-replace decisions and conflicting product/category recommendations.

## 2026-05-08 Queue 002 Closeout Link Audit

| Area | Result | Action |
| --- | --- | --- |
| Maintenance cluster | Maintenance/problem guides are connected through `floor-care-maintenance.html`, product pages, quote paths and selected repair-vs-replace links. | Keep adding sideways links only where they answer the reader's next maintenance or replacement question. |
| Blog orphan audit | Static link graph found no blog pages with zero inbound links or too few outbound local links. | No link dump needed. |
| Suburb orphan audit | Parramatta, Liverpool, Auburn, Blacktown and Miranda had strong inbound coverage. Cabramatta and Eastern Suburbs were indexed but had no inbound path from the crawl graph. | Added homepage local links to `flooring-cabramatta.html` and `flooring-eastern-suburbs.html`. |
| Footer consistency | Most SEO templates carry quote, product, floorplan, contact, privacy and terms pathways. | Added missing legal footer links on homepage and quote-review footer; leave quote/floorplan task pages focused on completion. |
| Quote URL parameters | Category-specific quote URLs are concentrated on product and suburb pages using `category=hybrid`, `category=laminate`, or `category=engineered`; quote-review handoff uses `source=quote_review`. | Do not alter quote parameter handling without a quote-flow task. |

## Guardrails

- Avoid random link dumping.
- Avoid repeated exact-match anchors.
- Avoid footer-only linking as the primary strategy.
- Do not add links that distract from quote start or quote validation.
