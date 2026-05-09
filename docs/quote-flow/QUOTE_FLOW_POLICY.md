# Quote Flow Policy

Created on 2026-05-09 for the customer express quote-flow work.

## Purpose

The quote flow is the main customer acquisition path for Operon Flooring. It must help Sydney customers start a clear flooring estimate while preserving structured scope data for review, margin protection and future internal/SaaS workflows.

## Modes

### Express Customer Path

The express path is the default customer presentation. It should feel fast and clear:

- project basics
- flooring and area
- main scope
- estimate preview
- contact and submit

The express path may hide technical detail, but it must map into the existing full-scope data model.

### Advanced / Full-Scope Path

Advanced scope remains available for serious customers, staff review and future operating workflows. Advanced details are collapsed or optional, not deleted.

## Hard Boundaries

- Online estimates are not final fixed prices.
- Never show `$0` as a normal customer-facing estimate state.
- Do not silently price unknown scope risks as `No`.
- Do not hide uncertainty.
- Final product, area, access and site scope details must be confirmed before fixed pricing.
- Do not expose internal rates, margins, multipliers or pricing formulas in customer UI.
- Do not create a duplicate public quote page.

## Data Model Preservation

The full-scope fields remain available for:

- product/category/range/colour
- measurement method and floorplan handoff
- removal/disposal
- underlay
- skirting/scotia/trims
- floor preparation
- subfloor/moisture risk
- stairs and stair detail
- access/lift/parking
- furniture/door trimming
- quote-review context
- draft recovery and submission payloads

V2 presentation changes should preserve existing IDs and storage keys where practical.

## Risk Handling

`Not sure` means review is required. It must not be treated as a confirmed `No`.

Scope items that should create review flags include:

- stairs or step areas
- apartment access, lift or parking uncertainty
- floor preparation or subfloor uncertainty
- moisture protection uncertainty
- removal or disposal uncertainty
- underlay/acoustic layer uncertainty
- skirting, scotia, trims, doors or furniture uncertainty
- category-only product selection
- unverified floorplan area
- fallback product pricing

## Quote-Review Relationship

The quote page is for new quote acquisition. The quote-review page is for checking an existing written quote.

Quote-review context may attach to a quote request, but it does not replace the quote flow and should not overwrite visible quote fields without explicit customer action.

Normal quote page UI should show only a compact quote-review banner:

`Already have a written quote? Check what it includes before comparing prices.`

CTA:

`Review existing quote`

## Floorplan Relationship

The floorplan tool sends measured real flooring area only. It does not apply wastage, calculate chargeable area, calculate price or submit the quote. The quote system handles pricing, wastage and scope review.

## Chatbot Relationship

The chatbot may read the current quote step and visible status. It must not:

- write quote fields
- mutate localStorage
- calculate prices
- call `quoteCalculator.js`
- submit quote forms
- override product selection

If quote step labels change, chatbot read-only awareness and documentation should be updated.

## Future SaaS Preservation

The full-scope structure should remain usable for internal staff, contractor workflow and future operating-system features. Customer simplification must be a presentation layer over the structured quote data, not a destructive replacement.
