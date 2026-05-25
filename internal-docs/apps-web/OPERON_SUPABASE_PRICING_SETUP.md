# Operon Supabase Pricing Setup

Source-of-truth status: active setup guide for moving pricing into private Supabase tables.

## Goal

Keep pricing private.

Google Sheets is convenient, but published browser-readable sheets expose sell prices and rate tables too easily.

Supabase should hold:

- product prices
- install rates
- underlay pricing
- skirting / scotia allowances
- removal pricing
- suburb / zone pricing
- core pricing rules

## Main Files

- `supabase/pricing_schema.sql`
- `apps/web/OPERON_SUPABASE_PRICING_SETUP.md`
- `apps/web/OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`

## Current Privacy Position

Current live quote logic still has a local-file fallback so the website keeps working.

The new Supabase pricing schema is designed so:

- pricing tables are private by default
- no anonymous read policies are created
- prices are managed in Supabase instead of public sheets

## What To Run In Supabase

Run these schema files in order:

1. `supabase/schema.sql`
2. `supabase/analytics_schema.sql`
3. `supabase/pricing_schema.sql`
4. `supabase/pricing_install_method_migration.sql`
5. `supabase/pricing_alignment_cleanup.sql`

If you want to keep old rows for reference instead of removing them:

4. `supabase/pricing_alignment_soft_disable.sql`

If you want to audit the current tables before changing anything:

- `supabase/pricing_audit_queries.sql`

## Pricing Tables Added

`pricing_categories`

- category metadata
- default category estimate price
- category page URL

`pricing_products`

- product rows
- sell price per m²
- optional install rate override
- imagery metadata
- active flag

`pricing_install_rates`

- labour rates by category
- standard / herringbone
- install method:
  - floating
  - direct_glue
- supply & install / install only
- minimum charge

`pricing_underlay_options`

- underlay names
- suitable categories
- price per m²

`pricing_trim_options`

- skirting
- scotia
- remove / refit
- area-allowance pricing

`pricing_removal_rates`

- removal rates by floor type
- disposal fee

`pricing_location_zones`

- suburb / postcode grouping
- travel fee
- minimum job fee
- surcharge percent
- fallback zone

`pricing_rules`

- wastage
- area basis
- moisture barrier
- furniture
- small-job factor
- minimum charge
- rounding

## Seed Data

`supabase/pricing_schema.sql` seeds the current pricing baseline from the local files, including:

- ETF Hybrid 7.0mm colour rows
- install rates
- removal rates
- trim options
- underlay options
- Sydney zone defaults
- base pricing rules

`supabase/pricing_alignment_cleanup.sql` then removes rows that are no longer valid for the current customer flow:

- placeholder laminate product rows
- placeholder engineered product rows
- laminate herringbone install-rate rows
- hybrid herringbone install-rate rows

`supabase/pricing_alignment_soft_disable.sql` is the safer alternative when you want to keep those rows in the database for historical reference, but stop them from being used by the live site.

`supabase/pricing_audit_queries.sql` shows:

- which product rows should remain active
- which product rows should be disabled or deleted
- which install-rate rows should remain active
- which install-rate rows should be disabled or deleted
- current category fallback estimate rows

## How To Edit Prices

After running the schema:

1. Open Supabase Table Editor
2. Open `pricing_products`
3. Update `price_per_m2`
4. If needed, update `install_rate_override`

For labour changes:

1. Open `pricing_install_rates`
2. Update `rate_per_m2`
3. Update `minimum_charge` if needed

For suburb pricing:

1. Open `pricing_location_zones`
2. Update:
   - `travel_fee`
   - `minimum_job_fee`
   - `surcharge_percent`

## Important Privacy Rule

Do not create anonymous `select` policies on these pricing tables.

If the browser can read them directly, your sell prices are no longer private.

## Recommended Runtime Path

Use this staged rollout:

### Stage 1

- Supabase stores the private source of truth
- frontend still uses local JS fallback
- pricing edits are prepared in Supabase

### Stage 2

- move quote calculation to a server-side function
- server reads pricing from Supabase with a protected key
- browser receives only customer-safe quote totals

### Stage 3

- optional admin pricing editor
- optional audit trail
- optional auth roles for who can edit rates

## Why Not Browser-Read Supabase

Even if you use the anon key correctly, public browser reads still expose:

- product sell prices
- labour rates
- suburb adjustments
- commercial quote settings

That is fine for public catalogue data, but not for private pricing control.

## Best Next Technical Step

Build a server-side quote calculation path that:

1. accepts customer quote inputs
2. reads private pricing from Supabase
3. calculates quote totals server-side
4. returns only customer-safe output

That is the correct next step if price privacy is the main concern.
