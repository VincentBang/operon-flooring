# Pricing Logic Protection Plan

Operon currently has useful MVP pricing logic in public frontend scripts. That keeps the quote flow responsive, but it exposes commercial assumptions that should move server-side as the business scales.

## Public Logic Currently Exposed

Customer-loaded scripts include:

- `apps/web/installRates.js`
- `apps/web/removalRates.js`
- `apps/web/pricingRules.js`
- `apps/web/stairRates.js`
- `apps/web/quoteCalculator.js`
- `apps/web/pricingAdjustment.js`
- `apps/web/locationZones.js`
- `apps/web/underlay.js`
- `apps/web/skirtingScotia.js`

These can expose installation assumptions, removal/disposal rules, stair calculations, location adjustments, underlay/trim options and customer-safe estimate logic. Do not treat public JavaScript as private business IP.

## Staged Migration

1. Keep frontend calculator as MVP fallback.
2. Make `/.netlify/functions/calculate-private-quote` the primary calculator for customer-facing estimates. Current quote flow should call this first when available and use the frontend calculator only as fallback.
3. Move labour, removal, stair, underlay, trim, location, margin and risk adjustment logic server-side.
4. Return only customer-safe outputs to the frontend: estimate range, included scope, missing scope, confidence and next action.
5. Remove internal diagnostics, raw calculation payloads, rates and pricing source details from customer UI.

## Guardrails

- Do not change formulas during security-only work.
- Do not expose supplier costs, margins, internal rates or raw pricing tables to GA4.
- Keep quote emails customer-safe and scope-first.
- Admin pricing diagnostics should require authenticated/admin access.
