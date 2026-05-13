# Operon Supabase Database Implementation

Supabase is the future editable database layer for Operon Flooring pricing, products, quote leads, and operating-system reporting.

Current production safety rule: the customer quote still uses the local JavaScript fallback files. Supabase should be updated in parallel, but the frontend should not depend on Supabase until private Netlify functions are intentionally switched on and tested.

## Current Local Fallback Architecture

The live quote and catalogue currently load these local files:

- `apps/web/products.js`
- `apps/web/productSelection.js`
- `apps/web/installRates.js`
- `apps/web/underlay.js`
- `apps/web/skirtingScotia.js`
- `apps/web/removalRates.js`
- `apps/web/locationZones.js`
- `apps/web/pricingRules.js`
- `apps/web/stairRates.js`
- `apps/web/quoteCalculator.js`

These files remain the safe browser fallback. They should continue working even if Supabase is unavailable or misconfigured.

## Supabase Schema Files

Core existing files:

- `supabase/schema.sql`
- `supabase/analytics_schema.sql`
- `supabase/pricing_schema.sql`

New canonical migration and seed:

- `supabase/migrations/20260502_operon_pricing_lead_schema.sql`
- `supabase/seed_pricing.sql`
- `supabase/migrations/20260504_stair_pricing_schema.sql`
- `supabase/seed_stair_pricing.sql`
- `supabase/scripts/generate_operon_seed_pricing_sql.js`
- `supabase/migrations/20260504_followup_automation_schema.sql`

The migration is additive. It does not drop existing pricing or lead tables.

## Canonical Pricing Tables

The new canonical pricing model is:

- `product_ranges`: customer-facing product range records. Hybrid and laminate use range selection; engineered can use range then colour.
- `products`: actual colour/SKU records under a range.
- `install_rates`: private labour rate rows by category, install type, install method, and job type.
- `underlay_options`: private underlay options.
- `skirting_scotia_options`: private trim and remove/refit allowance rows.
- `removal_rates`: private removal and disposal pricing.
- `location_zones`: private suburb/postcode zone rules.
- `pricing_rules`: private calculation rules such as wastage, area basis, minimums, and rounding.
- `stair_rates`: private stair pricing by product range, stair type, and width tier.

The old `pricing_*` tables remain for current Netlify helper compatibility:

- `pricing_categories`
- `pricing_products`
- `pricing_install_rates`
- `pricing_underlay_options`
- `pricing_trim_options`
- `pricing_removal_rates`
- `pricing_location_zones`
- `pricing_rules`
- `pricing_stair_rates`

The seed script updates both the new canonical tables and the old compatibility tables.

## Stair Pricing Model

Stair pricing is range-based and private. Customer-facing pages collect scope only:

- stair width known: yes/no
- stair width in mm if known
- quantities for straight stair treads, winder/triangular treads, 1 m² landings, 2 m² landings, one-side open stairs, and two-side open stairs

Every range has 12 price slots:

- 6 stair types x `price_short`
- 6 stair types x `price_long`

Width threshold:

- Hybrid and laminate use `1200 mm` as the guide.
- Engineered timber uses `plank_length_mm / 2`.
- Engineered herringbone and chevron ranges use the matching straight plank range length for this guide, not the shorter herringbone/chevron board length.
- If the customer does not know the stair width, the quote uses the lower/short price tier and warns that final stair price changes if confirmed width is over the guide.

Current local fallback file:

- `apps/web/stairRates.js`

Supabase files:

- `supabase/migrations/20260504_stair_pricing_schema.sql`
- `supabase/seed_stair_pricing.sql`

The seed creates placeholder `0` prices for each range/type/tier so values can be filled in Supabase Table Editor without changing frontend code.

## Product Selection Model

Current product selection rules:

- Hybrid: customer selects a range only. Colour can be confirmed later.
- Laminate: customer selects a range only when real laminate ranges are added.
- Engineered: customer selects range first, then colour/product when real engineered SKU pricing is added.
- Recommend option: uses `is_default_recommendation = true` for that category/range where available.

Current data status:

- Hybrid ETF 7.0mm, 8.0mm, and 9.0mm ranges exist in `products.js`.
- Hybrid product sell prices in `products.js` are still `0` because final supplier sell prices are pending/admin-confirmed.
- Laminate and engineered currently remain category-estimate paths until real ranges/SKUs are added.

The seed script preserves existing Supabase numeric values on conflict, so any prices already manually set in Supabase are not overwritten by local `0` placeholders.

Removal pricing convention:

- `removal_rates.rate_per_m2` is removal labour per m².
- `removal_rates.disposal_fee` is treated as disposal per m² in current quote logic.
- Future migration should rename `disposal_fee` to `disposal_rate_per_m2` for clarity, but existing data should not be wiped.

## Quote Lead Tables

Future lead persistence targets:

- `quote_leads`: one row per customer quote request.
- `quote_items`: customer-visible line items plus private internal payload for diagnostics.
- `quote_reviews`: one row per Quote Advisor review, storing scope completeness and external quote context without internal pricing.
- `followup_templates`: server-side SMS/email/manual-call message templates.
- `followup_messages`: queued follow-up tasks. Sending is disabled by default.

Expected lead payload fields:

- `name`
- `phone`
- `email`
- `address`
- `suburb`
- `postcode`
- `selectedProduct`
- `category`
- `realArea`
- `chargeableArea`
- `quoteTotal`
- `quoteLines`
- `notes`
- `createdAt`
- `leadStatus`

Recommended mapping:

- `quote_leads.customer_name`: `name`
- `quote_leads.phone`: `phone`
- `quote_leads.email`: `email`
- `quote_leads.site_address`: `address`
- `quote_leads.suburb`: `suburb`
- `quote_leads.postcode`: `postcode`
- `quote_leads.selected_category`: `category`
- `quote_leads.real_area`: `realArea`
- `quote_leads.chargeable_area`: `chargeableArea`
- `quote_leads.quote_total`: `quoteTotal`
- `quote_leads.quote_payload`: full safe lead payload
- `quote_items.customer_visible_total`: customer-safe totals only
- `quote_items.internal_payload`: private diagnostics only, never public API output

## Follow-Up Automation Layer

Follow-up automation is designed as a safe phased backend engine:

1. Lead is submitted and stored in Supabase.
2. A server-side queue function creates follow-up tasks.
3. A scheduled processor dry-runs by default.
4. Real SMS/email sending is only allowed when `ENABLE_FOLLOWUP_SEND=true`.

Migration:

1. `supabase/migrations/20260504_followup_automation_schema.sql`

Supabase function stubs:

- `supabase/functions/create-followup-queue/index.ts`
- `supabase/functions/process-followups/index.ts`

Current frontend preparation:

- `quote.html` includes `lead_stage`, `consent_sms`, and `consent_email` in the lead payload.
- `thank-you.html` lets the customer choose project timing after submit:
  - ready soon -> `hot`
  - comparing -> `warm`
  - planning -> `cold`
- SMS consent defaults to `false`; email consent defaults to `true` for operational quote follow-up.

Follow-up table privacy:

- Anonymous clients must not read or write `followup_templates`.
- Anonymous clients must not read or write `followup_messages`.
- Queue creation and sending must run server-side with the service role key only.

See `apps/web/FOLLOWUP_AUTOMATION_SETUP.md` and `apps/web/POST_SUBMIT_CONVERSION_SYSTEM.md`.

## Quote Review Data Engine

Quote Advisor is a separate scope-intelligence layer. It does not calculate final prices and does not rank external quote totals.

Migration:

1. `supabase/migrations/20260504_quote_review_data_engine.sql`

Frontend capture:

- `apps/web/quote-review.html` saves quote-review state under `operon_quote_review_*` localStorage keys.
- Clicking `Get structured estimate` routes to `quote.html?source=quote_review`.
- `quote.html` reads only the compact `operon_quote_review_handoff_v1` summary into the hidden `quote_review_payload_json` lead field without rendering the full quote-review UI or auto-filling customer-visible form fields.

Server-side save path:

- `netlify/functions/save-quote-review.js`
- Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` server-side only.
- Inserts allowed fields into `quote_reviews`.
- Fails safely; users still continue to `quote.html` if Supabase or Netlify Functions are unavailable.

`quote_reviews` stores:

- review mode
- optional customer contact/location fields
- flooring type and area
- uploaded quote reference or future file URL
- external quote total for context only
- included items
- missing items
- risk items
- non-pricing clarity score
- risk level
- confidence level
- advisor summary
- conversion handoff to quote

See `apps/web/QUOTE_REVIEW_DATA_ENGINE.md` for the detailed payload contract and future intelligence use cases.

## Security / RLS Posture

Pricing privacy matters. The migration enables RLS and does not create anonymous read policies for private pricing tables.

Anonymous browser users should not be able to read:

- `install_rates`
- `pricing_rules`
- `removal_rates`
- `skirting_scotia_options`
- `underlay_options`
- `location_zones`
- `quote_reviews`
- internal quote payloads

Quote lead and quote review inserts should go through Netlify functions using server-side Supabase credentials. Do not put `SUPABASE_SERVICE_ROLE_KEY` in frontend HTML or public JavaScript.

Required server-side Netlify environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Seed / Upsert Strategy

Run order:

1. `supabase/schema.sql`
2. `supabase/analytics_schema.sql`
3. `supabase/pricing_schema.sql`
4. `supabase/migrations/20260502_operon_pricing_lead_schema.sql`
5. `supabase/migrations/20260504_quote_review_data_engine.sql`
6. `supabase/migrations/20260504_followup_automation_schema.sql`
7. `supabase/migrations/20260504_stair_pricing_schema.sql`
8. `supabase/seed_pricing.sql`
9. `supabase/seed_stair_pricing.sql`

The seed is generated from current local JS modules:

```bash
node supabase/scripts/generate_operon_seed_pricing_sql.js
```

The seed uses stable keys:

- `range_id` for `product_ranges`
- `product_id` for `products`
- `underlay_id` for `underlay_options`
- `option_id` for `skirting_scotia_options`
- `removal_id` for `removal_rates`
- `zone_id` for `location_zones`
- `rule_key` for `pricing_rules`

Important: numeric rates/prices are preserved on conflict using `coalesce(existing, generated)`. This keeps manual Supabase pricing edits safe while allowing new rows and metadata to be appended.

## Future Netlify Function Path

Existing foundation:

- `netlify/functions/_supabasePricing.js`
- `netlify/functions/calculate-private-quote.js`

Future functions:

- `calculate-private-quote.js`: reads private pricing and returns only customer-safe quote totals.
- `save-quote-lead.js`: inserts into `quote_leads` and `quote_items`.
- `save-quote-review.js`: inserts into `quote_reviews` and returns `review_id`.
- `create-followup-queue`: creates follow-up queue rows after lead save.
- `process-followups`: processes due messages in dry-run mode until sending is explicitly enabled.
- `_supabasePricing.js`: can later map canonical tables into the quote calculator data shape.

Until the switch is deliberately made, `quoteCalculator.js` continues using local JS fallback modules.

## Guardrails

- Do not expose service-role secrets in customer-facing pages.
- Do not expose raw install rates, material costs, margin, or internal formulas to customers.
- Do not replace local JS fallback until private function calculation is fully tested.
- Do not wipe Supabase pricing tables to apply updates; use UPSERT.
- Quote submission should never lose the customer payload. Keep Netlify Forms and localStorage backup until Supabase lead insert is proven.
- Email/Resend should remain disconnected until the email system is explicitly ready.
- SMS/email follow-up sending must remain disabled until consent, opt-out, provider, and webhook handling are approved.

## Next Recommended Step

Run the migration and seed in Supabase SQL Editor, then verify row counts and spot-check manually edited prices. After that, build a private read-only Netlify function that maps Supabase data into the same shape as the local JS modules, without changing the browser quote flow yet.
