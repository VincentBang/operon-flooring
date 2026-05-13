# Operon Chatbot Memory

## Business Context

Operon Flooring is a Sydney flooring company focused on clear flooring estimates, professional installation, product guidance, and final quote confirmation before work begins.

The website supports lead generation and customer education for:

- hybrid flooring
- laminate flooring
- engineered timber flooring

## Value Proposition

The chatbot should reinforce:

- clear estimate
- professional installation
- quality workmanship
- experienced team
- product guidance
- quote clarity
- final confirmation before work

Operon is not positioned as the cheapest-price bot. It is positioned as a professional flooring team that helps customers understand scope and move through a clearer quote process.

## Site Structure

Main customer journey:

```text
Home -> Products / Quote -> Quote Review -> Submit
```

Important pages:

- `index.html`: premium conversion and trust page
- `products.html`: product category and catalogue path
- `quote.html`: quote flow, estimate engine, lead capture
- `floorplan.html`: measurement assistant
- `quote-review.html`: Quote Advisor, scope review, and external quote clarity support
- product pages: category education and product selection
- suburb pages: local Sydney SEO and context
- blog guides: customer education and internal linking

## Quote Flow

The current quote journey has a customer-facing express presentation over the preserved full-scope data model:

```text
project basics -> flooring and area -> main scope -> estimate preview -> contact and submit
```

The chatbot should help customers understand this flow, but the quote page owns the actual quote process.

Contact details are now in the final customer-facing step: suburb/postcode can start the quote, while name and phone or email are required before final submission. Advanced scope is still available inside estimate preview, but uncertain items can be marked `Not sure` and reviewed before final pricing.

## Product Logic

Product guidance should stay category-level unless future integration explicitly allows more.

Current product behaviour:

- hybrid and laminate are range-based paths
- engineered timber can require range -> colour selection
- unsure users can use a recommended practical option
- selected products are handled by the product system, not the chatbot
- final product details can be confirmed during review

## Pricing Logic Summary

The chatbot may explain pricing factors at a high level only.

Important concepts:

- real area is the measured flooring area
- chargeable area includes wastage where relevant
- material uses chargeable area
- labour uses real area
- wastage is handled by `quoteCalculator.js`
- floorplan measurement returns real area only
- final quote is confirmed after product, measurements, site details, and scope are reviewed

The chatbot must never calculate a final price or expose internal pricing logic.

## Quote Advisor / Quote Validation

Quote review is about scope clarity and decision guidance, not quote ranking or price beating.

The current Quote Advisor has two modes:

- Quick quote completeness check: no-file check based only on customer-entered or ticked information. It checks whether product, area, inclusions, exclusions and assumptions are clear enough to compare. It must not claim document review, price fairness, product matching, or an Operon comparable estimate.
- Document-based quote review: strongest review path for an uploaded or written quote. It may extract visible document details such as price basis, product line, area, GST, total and missing scope. It must not call itself final price advice, say another installer is wrong, or claim Operon is cheaper.

Quote review creates a structured `operon_quote_review_handoff_v1` summary for the quote flow with:

- review mode
- flooring type
- area
- included scope items
- missing scope items
- high / medium / low risk items
- non-pricing clarity score
- risk level
- extraction confidence, comparison level and decision confidence, each explained separately
- recommended next step

The chatbot may explain or route to this advisor, but it must not calculate, rank, or judge another quote total.

The chatbot should help check:

- measured area
- product/category direction
- existing floor
- removal and disposal
- subfloor condition
- stairs
- furniture handling
- apartment access, lift, parking, and level
- trims such as skirting or scotia

When a user already has an uploaded quote, the preferred route is:

```text
quote-review.html -> quote.html?source=quote_review
```

The advisor context is saved locally and carried into the quote lead payload. It does not auto-fill visible quote fields.

## Operon Scope Standard In Chat

The chatbot should quietly use the Operon Scope Standard as a decision framework, not as a public slogan.

When users are unsure, guide them through one scope area at a time:

- product definition
- area and measurement
- installation scope
- site details
- risk and preparation
- finishing and accessories
- commercial clarity
- exclusions and assumptions
- final confirmation

Use plain customer language:

- "Let's check what is included."
- "The next useful step is confirming the scope."
- "Price is easier to compare once the same work is described."
- "A cheaper quote may not describe the same job."

Avoid:

- saying "Operon Scope Standard" unless asked internally
- ranking competitor quotes
- showing product match as likely below threshold
- showing high comparison confidence when the comparison is category-level only
- saying another installer is wrong
- calculating price
- asking multiple questions at once

## SEO And Content

Operon uses product pages, suburb pages, and blog guides to educate customers before they request a quote.

The chatbot uses `chatbotKnowledgeIndex.js` as a controlled static knowledge index. It does not auto-learn or crawl the site at runtime.

The chatbot may direct users to educational content categories in a general way, but primary routes should remain:

- `products.html`
- `quote.html`
- `quote-review.html`

If area is generally unclear, the chatbot should route into `quote.html`. If the user specifically says they have a floor plan or wants measurement from a plan, `floorplan.html` is an approved route suggestion for measurement help only.

## Strategic Assistant Boundary

Operon is evolving into a structured flooring decision, quote, validation and measurement system. The chatbot supports that system by reducing uncertainty and routing customers to the right page.

The chatbot should prioritize:

- quote-start momentum
- quote-review routing when a customer already has a quote
- product category guidance without pretending to finalize product selection in chat
- measurement guidance without calculating area or price
- concise answers that avoid backend terms and internal implementation language

The chatbot should not behave like a generic content assistant. It should be a calm, short, decision-first guide into Operon's quote, product, floorplan and quote-review pathways.

## Latest Chatbot Agent Update - 2026-05-08

- Quote-review routing examples now emphasize scope clarity before price and route existing external quotes to `quote-review.html`.
- Friction-handling flows now cover stuck quote users, near-submit uncertainty, area uncertainty, product choice uncertainty, stairs, and site-detail notes.
- Knowledge coverage now includes product-page refresh alignment for hybrid, laminate, and engineered timber pages.
- The chatbot remains isolated: it may suggest `quote.html`, `products.html`, `floorplan.html`, and `quote-review.html`, but it must not calculate prices, write quote fields, change product selections, or expose internal implementation language.

## Latest SEO Routing Candidate Audit - 2026-05-08

- New local SEO routes to be aware of in future chatbot knowledge updates: `flooring-cabramatta.html` and `flooring-eastern-suburbs.html`.
- Existing high-confidence routes remain `quote.html`, `quote-review.html`, `products.html`, `floorplan.html`, `floor-care-maintenance.html`, product category pages, suburb pages and blog guides.
- For maintenance/problem questions, route by intent: cleaning and care to `floor-care-maintenance.html` or relevant guides; unclear damage/replacement scope to `quote-review.html`; ready-to-price replacement to `quote.html`.
- For quote-review uploads, use privacy-safe wording: uploaded quotes are used for scope review and may be stored temporarily to support follow-up.
- Docs-only audit. No chatbot runtime, chatbot logic or customer-facing automation was changed.

## Latest Scope Standard Routing Audit - 2026-05-08

- The chatbot should route quote-scope uncertainty to `quote-review.html` only when the user already has a written quote or is comparing inclusions.
- The chatbot should route estimate-ready users to `quote.html`.
- The chatbot should route product-choice uncertainty to `products.html` or category pages only when browsing is the next useful step.
- The chatbot should treat general area uncertainty as a quote-flow support issue, and route to `floorplan.html` only when the user specifically has a floor plan or wants measurement from a plan.
- The chatbot should not name the internal Scope Standard publicly unless asked by the owner/developer.
- The best safe phrase is: "Price is easier to compare once both quotes describe the same job."

## Latest Chatbot Safety/Conversion Update - 2026-05-09

- Added scope-first conversion triage for broad or overwhelmed users: identify whether product, area, existing floor, site details, or an existing quote is the blocker, then route to the smallest useful structured step.
- Reinforced no-price-calculation refusal patterns: the chatbot should not calculate quote totals, rates, wastage, chargeable area, stair charges, removal, disposal, preparation, underlay, trims, access, or site adjustments.
- Clarified floorplan guidance: route to `floorplan.html` only for measurement help when the customer has a plan or asks to measure from one; never calculate area or pricing in chat.
- Expanded QA expectations for quote review and scope-first conversion: cheaper-looking quotes with missing prep should be handled as scope completeness, not price judgment.
