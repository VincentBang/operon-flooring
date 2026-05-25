# Chatbot Controlled Knowledge Index

Purpose: give the isolated chatbot approved site knowledge without crawling the live site, reading every page at runtime, or learning automatically.

## What It Contains

- product category summaries for hybrid, laminate, and engineered timber
- current range-level guidance for curated category previews, including hybrid, laminate, and engineered timber shortlist ranges
- quote flow explanation at a high level only
- quote scope explanations for removal, disposal, floor plan measurement, underlay/acoustic layer, floor preparation, trims/scotia/skirting, stairs, site details, moisture, warranty/exclusions, quick quote completeness check, and document-based quote review
- uncertainty explanations for `Not sure` scope items including skirting/scotia, door trimming, furniture moving, disposal, floor preparation, underlay, stairs, and access
- service page summaries for installation guidance, floor plan measurement, and floor care
- suburb page summaries for selected Sydney service areas
- blog guide summaries for measuring, floor preparation, product comparison, maintenance, and common floor issues
- approved do and do-not rules

## Customer Answer Rules

The chatbot may:

- explain product suitability at category level
- explain product range browsing at a high level, including that colour previews are for browsing and final engineered colour is confirmed through the quote flow
- explain quote scope and missing details
- explain that `Not sure` means needs confirmation before final confirmation, not confirmed excluded
- explain why quotes should be compared by scope first, including product definition, area, removal, disposal, prep, underlay/acoustic layer, finishing, site details, warranty and exclusions
- route customers to `products.html`, `quote.html`, `floorplan.html`, `quote-review.html`, service pages, suburb pages, or blog guides
- mention that final confirmation happens after review

The chatbot must not:

- display prices, totals, rates, discounts, formulas, or internal pricing logic
- calculate estimates inside the chatbot
- compare uploaded or existing quotes by cheapest price
- update quote forms, product selections, localStorage, Supabase, lead capture, or submission logic
- expose backend words such as payload, localStorage, Supabase, API key, pricing formula, source of truth, or internal field names in customer answers

## Current Product Guidance Rules

- Product pages use range-first browsing.
- Category SEO pages now include lightweight curated range previews. Treat them as shortlist pages, not the full catalogue.
- Range cards may show `View X colours` previews, but the chatbot should not claim colour selection is completed in chat.
- Hybrid ETF ranges are kept as 7.0mm, 8.0mm, and 9.0mm paths.
- Engineered timber can be browsed by range first. The final colour is confirmed in the quote flow.
- Herringbone engineered timber should be framed as a premium pattern project that needs clear method and site-scope review.
- Use `products.html` when the customer asks for all products, the full catalogue, or deeper colour browsing.
- Use category pages when the customer asks to shortlist by flooring type:
  - `hybrid-flooring-sydney.html` for ETF 7.0mm, ETF 8.0mm, Grande 9.0, Lumiere Ultra HD, and Storm Luxury Hybrid Plank previews.
  - `laminate-flooring-sydney.html` for 12mm water-resistant laminate, Swish Laminate Aqua, Swish Laminate, Villeroy & Boch Heritage, and Villeroy & Boch Contemporary previews.
  - `engineered-timber-flooring-sydney.html` for Swish Oak Wideboard, Swish Oak Contemporary, Swish Oak Natura Handcrafted, Castel Nuovo Herringbone, and Cavallo Bianco Chevron previews.
- Do not expose unit rates, product price fields, formula names, or fallback pricing logic.

## Current Quote Guidance Rules

- The online result is a starting estimate, not a final confirmed quote.
- On `quote.html`, the chatbot may read the current wizard step and suggest the next visible action.
- Quote step awareness must remain read-only. It can identify the active step, likely missing field, and next focus target, but it must not write fields, trigger calculations, submit forms, or move the wizard automatically.
- Removal should be explained as one clear existing floor to remove, such as carpet, floating floor, glue-down timber, tile, vinyl, not sure, or other.
- Disposal or take-away should be explained separately from removal when relevant.
- Skirting/scotia, door trimming, furniture moving, stairs, site details and other extras should remain review items when the customer chooses `Not sure`.
- Review notes should prefer one clear needs-confirmation note over repeated wording for the same scope issue.
- Quick quote completeness check is a no-file scope check based only on customer-entered or ticked information.
- Document-based quote review requires the actual uploaded or written quote before the full report is shown.
- If a document only says category and thickness, such as "Hybrid 7mm", product match should be "Product match not confirmed."
- Email copy is optional and should be described as a customer copy, not as a gate to seeing the estimate.

## Quote Review Coverage Notes

The chatbot can safely explain that Quote Advisor checks:

- product/category clarity
- measured area
- supply and installation inclusions
- removal and disposal
- subfloor preparation
- trims, skirting or scotia
- stairs and stair quantities
- furniture handling
- apartment level, lift, parking and site details
- extraction confidence, comparison level, decision confidence, and recommended next step

Additional approved scope topics:

- underlay and acoustic requirements
- concrete moisture awareness
- floor preparation and levelling
- trims, scotia, skirting, transition strips, door trimming and stair nosing
- stair type, width, landing, open sides and site details
- warranty, exclusions, payment terms, quote validity and variation conditions

The chatbot must not:

- say another quote is good or bad based on total price alone
- rank quotes by cheapest
- must not rank external quotes by price
- claim Operon is better because another quote is incomplete
- infer missing prices, rates or margins
- expose OCR, payload, API, Supabase, localStorage or internal status labels in customer answers
- show document extraction, product match, or Operon comparable estimate in quick-mode language
- show high comparison confidence when the comparison level is category-level only

Preferred route when a customer already has an uploaded quote:

```text
quote-review.html -> quote.html?source=quote_review
```

Use plain language:

- "scope completeness"
- "quote clarity"
- "comparison readiness"
- "missing inclusions"
- "questions to confirm"
- "final scope review"

Avoid internal language:

- "OCR extraction"
- "structured payload"
- "comparison status"
- "backend endpoint"
- "internal confidence flag"

## Product Page Refresh Coverage Notes

Recent product SEO refreshes strengthened the hybrid, laminate and engineered timber pathways. Chatbot guidance should stay aligned with these page roles:

- hybrid: practical waterproof-core category, busy homes, apartments where product and acoustic requirements fit
- laminate: value-led timber-look category, mainly dry internal rooms
- engineered timber: premium real-timber finish, clearer method and pattern review
- category pages: curated range previews with short "Use in quote" paths
- products page: full interactive catalogue and broader range/colour browsing

The chatbot may route to:

- `products.html` for browsing product categories and ranges
- `quote.html` when the user is ready to estimate
- `quote-review.html` when the user has another quote or unclear scope

The chatbot should not claim that a colour, range or final product has been selected inside chat.

## Friction Handling Coverage Notes

When a user seems stuck, the chatbot should identify one blocker and ask one question. Common blockers:

- area is unknown
- product category is unclear
- existing floor type is unknown
- removal or disposal is unclear
- stairs are present
- apartment site details are uncertain
- another quote has missing inclusions
- underlay, acoustic, trims, warranty, or exclusions are unclear

The safest pattern is:

```text
Brief reassurance.
One practical scope point.
One question or one route.
```

Do not use labels like `Key point:` or `Next step:` in the customer-facing answer.

## Scope-First Knowledge Pattern

When the customer asks whether a quote is fair, whether a lower total is safe, or why two quotes differ, use this pattern:

```text
Total price is only useful when the scope is clear.
Check product, area, main inclusions, finishing, stairs, final project details and exclusions.
Use quote review if anything is unclear.
```

Keep this calm. Do not imply another contractor is wrong, and do not claim Operon is cheaper or better from price alone.

## Quote Advisor Result Awareness

On `quote-review.html`, the chatbot may read the visible quote-review result panel as read-only context.

It may use:

- visible status text
- visible extracted quote details
- visible missing or unclear scope items
- visible contractor questions
- visible decision guidance

It must translate those into short customer guidance:

```text
The result is mainly about scope clarity.
One item to confirm is [visible missing scope item].
Ask the contractor one direct question, or build a structured Operon estimate.
```

It must not use hidden backend fields, calculate price, compare cheapest options, or treat missing items as excluded unless the review clearly says so.

## Runtime Boundary

`chatbotKnowledgeIndex.js` is a static approved index. It does not crawl the site and does not pull page content dynamically. Any new knowledge should be added manually and tested before use.

## Refreshed Guide Coverage Candidates - 2026-05-08

Future chatbot knowledge updates can safely include these guide routes as static destinations:

- `blog/how-to-clean-laminate-flooring.html` for low-moisture laminate cleaning and swelling warnings.
- `blog/how-to-clean-hybrid-flooring.html` for hybrid cleaning, spill response and movement warnings.
- `blog/flooring-maintenance-checklist.html` for routine care across laminate, hybrid and engineered timber.
- `blog/flooring-gaps-and-expansion.html` for floating floor movement, gaps and expansion pressure.
- `blog/flooring-cost-sydney.html` and `blog/flooring-installation-cost-breakdown.html` for cost-scope education.
- `blog/engineered-timber-vs-laminate.html` for premium finish versus value-led product comparison.

Routing rule: answer briefly, then send users to one useful page or one primary conversion path. Do not list many guides in one chatbot answer unless the user asks for reading options.
