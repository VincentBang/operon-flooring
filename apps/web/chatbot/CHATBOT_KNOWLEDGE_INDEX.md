# Chatbot Controlled Knowledge Index

Purpose: give the isolated chatbot approved site knowledge without crawling the live site, reading every page at runtime, or learning automatically.

## What It Contains

- product category summaries for hybrid, laminate, and engineered timber
- quote flow explanation at a high level only
- service page summaries for installation guidance, floor plan measurement, and floor care
- suburb page summaries for selected Sydney service areas
- blog guide summaries for measuring, floor preparation, product comparison, maintenance, and common floor issues
- approved do and do-not rules

## Customer Answer Rules

The chatbot may:

- explain product suitability at category level
- explain quote scope and missing details
- route customers to `products.html`, `quote.html`, `floorplan.html`, `quote-review.html`, service pages, suburb pages, or blog guides
- mention that final confirmation happens after review

The chatbot must not:

- display prices, totals, rates, discounts, formulas, or internal pricing logic
- calculate estimates inside the chatbot
- compare competitors by cheapest price
- update quote forms, product selections, localStorage, Supabase, lead capture, or submission logic

## Runtime Boundary

`chatbotKnowledgeIndex.js` is a static approved index. It does not crawl the site and does not pull page content dynamically. Any new knowledge should be added manually and tested before use.
