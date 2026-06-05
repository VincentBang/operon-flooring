# Stage 4 Pricing Migration Test Plan

Date: 2026-06-04

Purpose: define the proof required before moving pricing-support data out of public frontend JavaScript and into server-side Netlify Functions.

Do not change pricing formulas during this migration. Any total difference must be treated as a bug unless separately approved and explained.

## Parity Fixtures

Create fixtures for these quote scenarios before moving data:

Fixture seed module:

- `internal-qa/fixtures/pricingMigrationScenarios.js`
- `internal-qa/tests/web/pricingMigrationScenariosContract.test.js`

- House, hybrid, 60m2, no stairs, no removal.
- Apartment, laminate, 45m2, access notes, lift uncertain.
- Engineered timber, 80m2, stairs yes.
- Hybrid, carpet removal yes, disposal yes.
- Floating floor removal yes, disposal not sure.
- Glue-down timber removal yes.
- Tile removal yes.
- Product not sure, area known.
- Area not sure, review-required estimate.
- Product handoff from `/products.html`.
- Floorplan handoff into `/quote.html`.
- Quote-review handoff into `/quote.html`.

Each fixture must compare:

- Customer-safe total estimate.
- Estimate range if present.
- Confidence level.
- Review flags.
- Assumptions.
- Customer-safe line item labels.
- Submit/save response shape.

## Allowed Public Catalogue Fields

Public catalogue fixtures may include:

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

Public catalogue fixtures must not include:

- `pricePerM2`
- `installRate`
- `supplierUrl`
- `supplierCost`
- `underlayAllowance`
- `skirtingScotiaAllowance`
- `margin`
- `markup`
- `accessFactor`
- raw supplier identifiers that are not customer-facing

## Function Response Leak Tests

Test `calculate-quote`, `save-quote-request`, and any future shared quote function response for absence of:

- Unit rates
- Internal rates
- Supplier costs
- Margins
- Markups
- Private pricing rules
- Private rule names
- Access multipliers
- Raw pricing table rows
- Server module paths
- Environment variable names

## Static Output Leak Tests

After each migration slice, inspect:

- `apps/web-tsx/out`
- generated JS chunks
- public runtime files
- browser localStorage/sessionStorage after quote/product flows

Fail if private pricing fields appear in customer-visible output or browser storage.

## Public URL Probes

Private pricing modules must return 404 or be unavailable at:

- `/private-pricing/`
- `/pricingRules.js`
- `/installRates.js`
- `/removalRates.js`
- `/stairRates.js`
- `/locationZones.js`
- any future server-only pricing module path

## Rollback Criteria

Rollback the migration slice if:

- Any fixture total changes without an approved bug-fix explanation.
- Quote submit/save fails.
- Product, floorplan, or quote-review handoff breaks.
- Customer-safe line item labels disappear.
- A private pricing field appears in static output, browser storage, or function responses.

## Approval Gate

Do not remove legacy public pricing-support files until:

1. Fixture parity passes.
2. Static leak tests pass.
3. Function response leak tests pass.
4. Browser storage leak tests pass.
5. Preview quote-flow QA passes.
6. Human approves the migration slice.
