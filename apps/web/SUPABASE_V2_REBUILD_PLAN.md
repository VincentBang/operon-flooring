# Supabase V2 Rebuild Plan

Updated: 2026-05-05

Purpose: replace the messy mix of legacy, duplicate, and future Supabase tables with one clean `operon_*` schema while preserving quote flow, pricing rules, email, quote review, tracking, close scoring, and analysis.

## Current Decision

Do not blind-delete live tables first.

Use this sequence instead:

1. Create the clean v2 schema with `supabase/operon_v2_clean_schema.sql`.
2. Enter pricing/product values into the `operon_pricing_*` tables, or run `supabase/operon_v2_copy_from_legacy.sql` to copy the currently working legacy data into v2 first.
3. Set Netlify environment variable `OPERON_SUPABASE_SCHEMA_MODE=v2`.
4. Test quote draft save, review estimate, email quote, quote review, and pricing lookup.
5. Only then run `supabase/operon_v2_drop_legacy_after_verification.sql`.

This avoids breaking the site while the database is being cleaned.

## Canonical V2 Tables

| Area | V2 table |
| --- | --- |
| Product categories | `operon_pricing_categories` |
| Product/range records | `operon_pricing_products` |
| Install rates | `operon_pricing_install_rates` |
| Underlay | `operon_pricing_underlay_options` |
| Trim/skirting/scotia | `operon_pricing_trim_options` |
| Removal/disposal | `operon_pricing_removal_rates` |
| Location zones | `operon_pricing_location_zones` |
| Pricing rules | `operon_pricing_rules` |
| Stair pricing | `operon_pricing_stair_rates` |
| Quote requests | `operon_quote_requests` |
| Quote rooms | `operon_quote_rooms` |
| Quote line items | `operon_quote_items` |
| Uploaded file metadata | `operon_uploaded_files` |
| Tracking events | `operon_quote_events` |
| Funnel sessions | `operon_quote_funnel_sessions` |
| Future lead table | `operon_quote_leads` |
| Quote reviews | `operon_quote_reviews` |
| Follow-up templates | `operon_followup_templates` |
| Follow-up queue | `operon_followup_messages` |
| Close automation log | `operon_close_automation_runs` |
| Pricing outcomes | `operon_quote_pricing_outcomes` |
| Pricing optimisation buckets | `operon_pricing_optimization_buckets` |

## Code Wiring

Netlify Functions now use `netlify/functions/_supabaseTables.js`.

Default mode:

- `OPERON_SUPABASE_SCHEMA_MODE` unset -> clean `operon_*` tables.
- `OPERON_SUPABASE_SCHEMA_MODE=v2` -> clean `operon_*` tables.
- `OPERON_SUPABASE_SCHEMA_MODE=legacy` -> old current tables for rollback.

Updated server-side paths:

- `netlify/functions/_supabasePricing.js`
- `netlify/functions/save-quote-request.js`
- `netlify/functions/save-quote-review.js`
- `netlify/functions/pricing-optimization-insight.js`
- `supabase/functions/create-followup-queue/index.ts`
- `supabase/functions/process-followups/index.ts`
- `supabase/functions/process-leads/index.ts`
- `supabase/functions/calculate-close-score/index.ts`
- `supabase/functions/record-pricing-outcome/index.ts`
- `supabase/functions/calculate-pricing-optimization/index.ts`

Browser-side quote save and tracking now support table aliases through:

```js
window.OPERON_SUPABASE_TABLES = {
  quoteRequests: "operon_quote_requests",
  quoteRooms: "operon_quote_rooms",
  quoteItems: "operon_quote_items",
  uploadedFiles: "operon_uploaded_files",
  quote_events: "operon_quote_events",
  quote_funnel_sessions: "operon_quote_funnel_sessions"
};
```

Do not enable browser aliases until `operon_v2_clean_schema.sql` has been applied and anon insert/update policies are verified.

Current browser quote/tracking fallback defaults now point at the clean `operon_*` quote and tracking tables.

## Old To New Mapping

| Existing table | V2 replacement | Status |
| --- | --- | --- |
| `pricing_categories` | `operon_pricing_categories` | live-wired via table map |
| `pricing_products` | `operon_pricing_products` | live-wired via table map |
| `pricing_install_rates` | `operon_pricing_install_rates` | live-wired via table map |
| `pricing_underlay_options` | `operon_pricing_underlay_options` | live-wired via table map |
| `pricing_trim_options` | `operon_pricing_trim_options` | live-wired via table map |
| `pricing_removal_rates` | `operon_pricing_removal_rates` | live-wired via table map |
| `pricing_location_zones` | `operon_pricing_location_zones` | live-wired via table map |
| `pricing_rules` | `operon_pricing_rules` | live-wired via table map |
| `pricing_stair_rates` | `operon_pricing_stair_rates` | live-wired via table map |
| `stair_rates` | `operon_pricing_stair_rates` | consolidate into one table |
| `quote_requests` | `operon_quote_requests` | live-wired via table map and browser alias support |
| `quote_rooms` | `operon_quote_rooms` | live-wired via table map and browser alias support |
| `quote_items` | `operon_quote_items` | live-wired via table map and browser alias support |
| `uploaded_files` | `operon_uploaded_files` | browser alias support |
| `quote_events` | `operon_quote_events` | browser alias support |
| `quote_funnel_sessions` | `operon_quote_funnel_sessions` | browser alias support |
| `quote_reviews` | `operon_quote_reviews` | live-wired via table map |
| `followup_templates` | `operon_followup_templates` | schema-ready |
| `followup_messages` | `operon_followup_messages` | schema-ready |
| `close_automation_runs` | `operon_close_automation_runs` | schema-ready |
| `quote_pricing_outcomes` | `operon_quote_pricing_outcomes` | schema-ready |
| `pricing_optimization_buckets` | `operon_pricing_optimization_buckets` | live-wired via table map |
| `product_ranges`, `products`, `install_rates`, `underlay_options`, `skirting_scotia_options`, `removal_rates`, `location_zones` | `operon_pricing_*` | archive after v2 verified |

## Tables To Remove Later

Only after v2 is verified:

- empty ops/content tables: `agent_tasks`, `backlink_targets`, `blog_ideas`, `seo_keywords`, `seo_pages`, `seo_rank_snapshots`
- duplicate quote tables: `quote_requests`, `quote_rooms`, `quote_items`, `quote_reviews`, `quote_leads`, `uploaded_files`, `quote_files`, `quote_revenue`
- old pricing tables: `pricing_*`, `stair_rates`
- parallel canonical tables: `product_ranges`, `products`, `install_rates`, `underlay_options`, `skirting_scotia_options`, `removal_rates`, `location_zones`
- historical starter tables: `customers`, `quotes`, `quotes_public_view`

## Verification Checklist

Before deleting legacy tables:

- `operon_v2_clean_schema.sql` runs without error.
- Product categories exist in `operon_pricing_categories`.
- At least one active product/range exists in `operon_pricing_products`.
- Private pricing function loads with `OPERON_SUPABASE_SCHEMA_MODE=v2`.
- Review estimate saves a draft quote row into `operon_quote_requests`.
- Quote rooms and quote items save into v2 child tables.
- Quote review saves into `operon_quote_reviews`.
- Tracking event saves into `operon_quote_events`.
- Funnel session upsert works in `operon_quote_funnel_sessions`.
- No internal rates are exposed through browser-readable tables.
- Quote calculator still remains the single calculation source.

## Important Risk

Supabase service-role REST keys cannot run DDL such as `create table` or `drop table`. The SQL files must be run in Supabase SQL Editor or through a database connection with DDL permission.
