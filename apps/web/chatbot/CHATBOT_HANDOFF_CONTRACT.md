# Chatbot Handoff Contract

Purpose: define when chatbot draft data is safe for future integration while keeping the current module read-only and isolated.

This contract does not integrate with the quote form. It only describes and returns readiness information.

## Non-Negotiable Boundaries

- Do not write to quote fields.
- Do not write to product selection.
- Do not write to live `localStorage`.
- Do not call `quoteCalculator.js`.
- Do not call pricing modules.
- Do not submit lead forms.
- Do not auto-navigate.

## Allowed Future Routes

Only these routes may be suggested:

- `quote.html`
- `products.html`
- `quote-review.html`

## Handoff Status Values

`blocked`
: The assistant should not hand off any draft data. Used for unsupported requests, competitor-price requests, product browsing, or missing critical quote fields.

`needs_review`
: Draft data may be useful, but quote review should happen first. Used when validation flags are present, stairs are involved, access is unclear, subfloor is unsure/heavy prep, or the recommended route is `quote-review.html`.

`ready`
: Draft data has enough basic quote context for a future handoff proposal. This still does not write anything. A future integration must ask for explicit implementation approval before applying it.

## Required Fields Before Ready

For `ready`, draft data must include:

- category
- area
- measurement method
- existing floor
- subfloor condition
- stairs
- access
- furniture
- quote mode

## Fields Allowed To Map Later

Future integration may consider mapping:

- `quoteMode`
- `selectedProductCategory`
- `productChoiceMode`
- `totalAreaM2`
- `measurementMethod`
- `removalType`
- `removalDisposal`
- `floorPrepType`
- `stairs`
- `furnitureType`
- `parkingAccess`
- `propertyType`
- `level`
- `hasLift`

## Fields That Must Never Auto-Map

- prices
- totals
- discounts
- internal rates
- margins
- quote submission fields
- customer contact fields
- Supabase fields
- lead form status
- selected product IDs that override the product system

## Review Flags

Any of these should force `needs_review`:

- `stairs_require_manual_review`
- `subfloor_review_recommended`
- `access_review_recommended`
- `apartment_lift_not_confirmed`
- `removal_disposal_not_confirmed`
- `area_missing_for_ready_state`

## Returned Contract Shape

```json
{
  "status": "needs_review",
  "safe_to_apply": false,
  "reason": "validation flags require quote review",
  "next_step": "quote-review.html",
  "required_missing": ["area"],
  "review_flags": ["stairs_require_manual_review"],
  "allowed_quote_fields": ["quoteMode", "selectedProductCategory"],
  "blocked_fields": ["prices", "totals", "discounts", "customer contact fields"]
}
```

`safe_to_apply` must remain `false` until future integration is explicitly approved and implemented separately.
