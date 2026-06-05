# Stage 4 Server-Side Pricing Migration Plan

Date: 2026-06-04

Purpose: move commercially sensitive pricing-support data out of public frontend JavaScript without breaking quote conversion.

## Current Exposure

Known public pricing-support files:

- `/pricingSource.js`
- `/pricingSourceConfig.js`
- `/products.js`
- `/underlay.js`
- `/skirtingScotia.js`
- `/preference-floors-import.js`
- `/quoteRuntime.js`

Known non-public raw rate files:

- `/installRates.js` returns 404
- `/removalRates.js` returns 404
- `/stairRates.js` returns 404
- `/locationZones.js` returns 404
- `/pricingRules.js` returns 404

## Target Architecture

Frontend:

- Collects customer inputs.
- Shows sanitized public product catalogue.
- Sends quote request to Netlify Functions.
- Receives customer-safe estimate summary only.

Server:

- Owns private pricing support modules.
- Calculates estimate.
- Returns customer-safe totals, assumptions, exclusions, confidence, and next step.

## Public Catalogue Schema

Allowed fields:

- `id`
- `category`
- `brand`
- `range`
- `colour`
- `finish`
- `image`
- `alt`
- `water_resistant`
- `pet_friendly`
- `apartment_suitable`
- `warranty_label`
- `display_badges`
- `quote_category`

Forbidden fields:

- `pricePerM2`
- `supplierUrl`
- `supplierCost`
- `installRate`
- `underlay allowance`
- `skirting/scotia allowance`
- `margin`
- `markup`
- `accessFactor`
- internal rates
- private pricing rules
- internal rule IDs

## Private Server Module Location

Recommended:

- `netlify/functions/private-pricing/`

Do not place private pricing modules under:

- `apps/web-tsx/public`
- `apps/web-tsx/out`
- `apps/web`
- any statically published folder

## Function Contract

`calculate-quote` request:

- Customer-safe inputs only.
- Product/category IDs.
- Area/stairs/extras/location inputs.

`calculate-quote` response:

- `ok`
- `estimate_total_inc_gst`
- `estimate_range_low`
- `estimate_range_high`
- `confidence`
- `assumptions`
- `exclusions`
- `review_flags`
- `line_items` with customer-safe labels only

Do not return:

- Unit rates
- Internal rates
- Supplier costs
- Margins
- Markups
- Private pricing rules
- Private rule names
- Access multipliers
- Internal table names

## Migration Phases

### Phase A: Contract Tests

- Keep `pricingLeakContract.test.js`.
- Add response-field tests for calculate/save quote.
- Add public catalogue schema tests.
- Add parity fixtures from `STAGE4_PRICING_MIGRATION_TEST_PLAN.md`.
- Treat any estimate drift as a bug unless a separate approved pricing bug fix explains it.

### Phase B: Sanitized Catalogue

- Generate or author a public catalogue without pricing-support fields.
- Update products page and quote product selector to use sanitized catalogue.
- Preserve product IDs/category labels/handoff behavior.

### Phase C: Private Pricing Modules

- Move pricing support data into server-only function modules.
- Ensure Netlify includes private modules with Functions but not static output.
- Keep formula parity with existing quote engine.

### Phase D: Quote Runtime Simplification

- Frontend stops needing pricing support fields.
- Frontend receives server-calculated summary only.
- Quote save submits customer-safe summary plus server quote reference.

### Phase E: Leak Audit

- Confirm private pricing fields absent from `apps/web-tsx/out`.
- Confirm public URLs return 404 for private modules.
- Confirm function responses do not expose private fields.

## Rollback

- Keep old public catalogue/runtime branch available until parity verified.
- If server pricing fails, rollback to current production deploy.
- Do not delete legacy files until production has been stable for 24-72 hours.

## First Implementation Task

Task A2 remains the next safe prerequisite:

- Function-route remaining direct browser Supabase writes.
- Keep/add pricing leak contract tests.
- Only then sanitize public catalogue and move private pricing support server-side.

Before Phase B, create the parity fixture suite described in:

- `STAGE4_PRICING_MIGRATION_TEST_PLAN.md`
