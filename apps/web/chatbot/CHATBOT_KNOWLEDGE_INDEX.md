# Chatbot Controlled Knowledge Index

Purpose: give the isolated chatbot approved site knowledge without crawling the live site, reading every page at runtime, or learning automatically.

## What It Contains

- product category summaries for hybrid, laminate, and engineered timber
- current range-level guidance for ETF hybrid, 12mm water-resistant laminate, Swish Oak Natura, and Swish Oak Natura Herringbone
- quote flow explanation at a high level only
- quote scope explanations for removal, disposal, floor plan measurement, quick quote review, and document-based quote review
- service page summaries for installation guidance, floor plan measurement, and floor care
- suburb page summaries for selected Sydney service areas
- blog guide summaries for measuring, floor preparation, product comparison, maintenance, and common floor issues
- approved do and do-not rules

## Customer Answer Rules

The chatbot may:

- explain product suitability at category level
- explain product range browsing at a high level, including that colour previews are for browsing and final engineered colour is confirmed through the quote flow
- explain quote scope and missing details
- route customers to `products.html`, `quote.html`, `floorplan.html`, `quote-review.html`, service pages, suburb pages, or blog guides
- mention that final confirmation happens after review

The chatbot must not:

- display prices, totals, rates, discounts, formulas, or internal pricing logic
- calculate estimates inside the chatbot
- compare competitors by cheapest price
- update quote forms, product selections, localStorage, Supabase, lead capture, or submission logic
- expose backend words such as payload, localStorage, Supabase, API key, pricing formula, source of truth, or internal field names in customer answers

## Current Product Guidance Rules

- Product pages use range-first browsing.
- Range cards may show `View X colours` previews, but the chatbot should not claim colour selection is completed in chat.
- Hybrid ETF ranges are kept as 7.0mm, 8.0mm, and 9.0mm paths.
- Engineered timber can be browsed by range first. The final colour is confirmed in the quote flow.
- Herringbone engineered timber should be framed as a premium pattern project that needs clear method and site-scope review.
- Do not expose unit rates, product price fields, formula names, or fallback pricing logic.

## Current Quote Guidance Rules

- The online result is a starting estimate, not a final confirmed quote.
- Removal should be explained as one clear existing floor to remove, such as carpet, floating floor, glue-down timber, tile, vinyl, not sure, or other.
- Disposal or take-away should be explained separately from removal when relevant.
- Quick quote review is a scope check from structured inputs.
- Document-based quote review requires the actual uploaded quote before the full report is shown.
- Email copy is optional and should be described as a customer copy, not as a gate to seeing the estimate.

## Runtime Boundary

`chatbotKnowledgeIndex.js` is a static approved index. It does not crawl the site and does not pull page content dynamically. Any new knowledge should be added manually and tested before use.
