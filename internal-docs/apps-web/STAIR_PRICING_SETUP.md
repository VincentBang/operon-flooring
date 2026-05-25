# Stair Pricing Setup

This note explains how Operon stair pricing is stored and edited.

## Current Rule

Stair pricing is private, range-based, and width-tiered.

The quote form collects:

- whether stairs are included
- whether the customer knows the stair width
- stair width in mm if known
- quantity for each stair type

The customer only sees a clean stair total in the quote summary. Internal stair prices and formulas are not exposed.

## Stair Types

Use these stable IDs in Supabase and local fallback files:

- `straight_tread`: straight stair tread
- `winder_tread`: winder / triangular stair tread
- `landing_1m2`: landing up to 1 m²
- `landing_2m2`: landing up to 2 m²
- `one_side_open`: one-side open stair tread
- `two_side_open`: two-side open stair tread

## Width Tier Rule

Each product range needs 12 stair prices:

- 6 stair types x `price_short`
- 6 stair types x `price_long`

Tier guide:

- Hybrid and laminate: `1200 mm`
- Engineered timber: `plank_length_mm / 2`
- Engineered herringbone and chevron: use the matching straight plank range length, not the shorter patterned board length

If the customer does not know the stair width, the estimate uses the short-width price and warns that the final stair allowance changes if confirmed width is over the guide.

## Supabase Files

Run these in Supabase SQL Editor when ready:

1. `supabase/migrations/20260504_stair_pricing_schema.sql`
2. `supabase/seed_stair_pricing.sql`

The seed uses placeholder `0` prices so you can fill real values in Supabase Table Editor. It uses upserts and preserves any existing manually entered prices.

If the live Supabase project is missing the stair tables completely, run this single combined setup file instead:

- `supabase/stair_pricing_live_setup.sql`

That file creates both required tables and inserts the editable placeholder rows in one SQL Editor run.

## Tables To Edit

Primary table:

- `stair_rates`

Netlify compatibility table:

- `pricing_stair_rates`

Fill these columns:

- `range_id`
- `stair_type`
- `guide_width_mm`
- `plank_length_mm` for engineered ranges
- `price_short`
- `price_long`
- `active`

For Netlify private pricing, keep `pricing_stair_rates` populated. For future admin/database work, keep `stair_rates` populated.

## Local Fallback

The browser fallback file is:

- `apps/web/stairRates.js`

Only edit this file if you need localhost or static fallback pricing before Supabase/private Netlify pricing is enabled.

## Pricing Safety

- Do not put stair unit rates in HTML.
- Do not expose stair rates to public JavaScript once private Supabase pricing is the live source.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
- Customer-facing output should show “Stairs” as a bundled total, not per-step prices.
