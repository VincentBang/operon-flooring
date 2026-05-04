# Supabase Table Audit

Updated: 2026-05-04

Purpose: classify current Supabase tables into:

- `live-wired`
- `future/parallel`
- `candidate for archive/remove`

Important:

- This audit is based on the current repo wiring and schema files.
- Row counts were checked on 2026-05-04 with local `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- The local `.env.local` file is covered by repo `.gitignore` via `.env.*`.
- Non-empty candidate tables were exported on 2026-05-04 to `apps/web/supabase-audit-exports/2026-05-04/`.
- A safe SQL cleanup script was prepared at `apps/web/supabase-audit-exports/2026-05-04/supabase_safe_cleanup.sql`.
- Do not delete any table until row counts and dependency checks are confirmed inside Supabase Table Editor or via a server-side credentialed script.

## Live-Wired

These tables are referenced by current site code or Netlify functions.

### Quote save / request flow

- `quote_requests`
  - Used by `apps/web/quote.html`
  - Used by `netlify/functions/save-quote-request.js`
- `quote_rooms`
  - Used by `apps/web/quote.html`
  - Used by `netlify/functions/save-quote-request.js`
- `quote_items`
  - Used by `apps/web/quote.html`
  - Used by `netlify/functions/save-quote-request.js`
- `uploaded_files`
  - Used by `apps/web/quote.html` for browser-side Supabase file metadata path

### Analytics / tracking

- `quote_events`
  - Used by `apps/web/tracking.js`
- `quote_funnel_sessions`
  - Used by `apps/web/tracking.js`

### Current Netlify pricing source

- `pricing_categories`
  - Used by `netlify/functions/_supabasePricing.js`
  - Used indirectly by `netlify/functions/public-catalogue-pricing.js`
- `pricing_products`
  - Used by `netlify/functions/_supabasePricing.js`
- `pricing_install_rates`
  - Used by `netlify/functions/_supabasePricing.js`
- `pricing_underlay_options`
  - Used by `netlify/functions/_supabasePricing.js`
- `pricing_trim_options`
  - Used by `netlify/functions/_supabasePricing.js`
- `pricing_removal_rates`
  - Used by `netlify/functions/_supabasePricing.js`
- `pricing_location_zones`
  - Used by `netlify/functions/_supabasePricing.js`
- `pricing_rules`
  - Used by `netlify/functions/_supabasePricing.js`

### Quote review intelligence

- `quote_reviews`
  - Used by `netlify/functions/save-quote-review.js`

## Future / Parallel

These tables appear to be the newer canonical model or planned admin model, but they are not the current live source for the customer-facing site today.

- `product_ranges`
- `products`
- `install_rates`
- `underlay_options`
- `skirting_scotia_options`
- `removal_rates`
- `location_zones`

Notes:

- Repo docs explicitly describe these as the newer canonical pricing/product model.
- Current live Netlify pricing reads the `pricing_*` compatibility tables, not these tables.
- `pricing_rules` is a special case: it is both live-wired and also part of the newer model, so keep it.

## Candidate For Archive / Remove

These tables do not appear to be wired into the current site code paths. They may still contain useful business or historical data, so treat them as archive candidates first, not direct delete targets.

- `quote_leads`
  - Mentioned in planning/docs, but not current live write target
  - Keep temporarily because `quote_reviews` migration currently references it
- `quotes`
  - No active site wiring found
- `quote_files`
  - Current site uses `uploaded_files` instead
- `quote_revenue`
  - Present in analytics schema, but not site-wired
- `customers`
  - No active site wiring found
- `quotes_public_view`
  - No repo wiring found
- `seo_keywords`
  - Internal ops/reporting only
- `seo_pages`
  - Internal ops/reporting only
- `seo_rank_snapshots`
  - Internal ops/reporting only
- `backlink_targets`
  - Internal ops/reporting only
- `blog_ideas`
  - Internal ops/reporting only
- `agent_tasks`
  - Internal ops/reporting only

## Row Count Status

Read-only count check completed via Supabase REST `HEAD` requests.

### Live-Wired Counts

| Table | Count | Recommendation |
| --- | ---: | --- |
| `quote_requests` | 6 | Keep. Current quote draft/save target. |
| `quote_rooms` | 0 | Keep. Child table for quote room measurements. |
| `quote_items` | 20 | Keep. Child table for quote line items. |
| `uploaded_files` | 0 | Keep for now. Current browser-side file metadata target. |
| `quote_events` | 2 | Keep. Active analytics tracking target. |
| `quote_funnel_sessions` | 0 | Keep. Active analytics session target. |
| `pricing_categories` | 3 | Keep. Current Netlify pricing source. |
| `pricing_products` | 41 | Keep. Current Netlify pricing/catalogue source. |
| `pricing_install_rates` | 12 | Keep. Current Netlify pricing source. |
| `pricing_underlay_options` | 3 | Keep. Current Netlify pricing source. |
| `pricing_trim_options` | 3 | Keep. Current Netlify pricing source. |
| `pricing_removal_rates` | 6 | Keep. Current Netlify pricing source. |
| `pricing_location_zones` | 6 | Keep. Current Netlify pricing source. |
| `pricing_rules` | 16 | Keep. Current Netlify pricing source. |
| `quote_reviews` | missing / 404 | Migration appears not applied in live Supabase. Keep code path, but create table before relying on Quote Advisor persistence. |

### Future / Parallel Counts

| Table | Count | Recommendation |
| --- | ---: | --- |
| `product_ranges` | 3 | Keep for now. Future canonical catalogue model. |
| `products` | 41 | Keep for now. Mirrors current catalogue count. |
| `install_rates` | 10 | Keep for now. Future canonical pricing model. |
| `underlay_options` | 2 | Keep for now. Future canonical pricing model. |
| `skirting_scotia_options` | 3 | Keep for now. Future canonical pricing model. |
| `removal_rates` | 6 | Keep for now. Future canonical pricing model. |
| `location_zones` | 6 | Keep for now. Future canonical pricing model. |

### Candidate Counts

| Table | Count | Recommendation |
| --- | ---: | --- |
| `agent_tasks` | 0 | Safe archive/remove candidate after final confirmation. |
| `backlink_targets` | 0 | Safe archive/remove candidate after final confirmation. |
| `blog_ideas` | 0 | Safe archive/remove candidate after final confirmation. |
| `seo_keywords` | 0 | Safe archive/remove candidate after final confirmation. |
| `seo_pages` | 0 | Safe archive/remove candidate after final confirmation. |
| `seo_rank_snapshots` | 0 | Safe archive/remove candidate after final confirmation. |
| `quote_files` | 0 | Safe archive/remove candidate after confirming `uploaded_files` is the chosen file table. |
| `quote_leads` | 0 | Keep temporarily. `quote_reviews` migration currently references this table. |
| `quote_revenue` | 0 | Safe archive/remove candidate unless a future CRM/revenue workflow is planned soon. |
| `customers` | 2 | Archive/export before any delete. Contains data. |
| `quotes` | 2 | Archive/export before any delete. Contains data. |
| `quotes_public_view` | 2 | Likely view over `quotes`; inspect definition before removing. |

### Export Status

Read-only exports were saved before any proposed cleanup:

| Table | Rows exported | File |
| --- | ---: | --- |
| `customers` | 2 | `apps/web/supabase-audit-exports/2026-05-04/customers.json` |
| `quotes` | 2 | `apps/web/supabase-audit-exports/2026-05-04/quotes.json` |
| `quotes_public_view` | 2 | `apps/web/supabase-audit-exports/2026-05-04/quotes_public_view.json` |

No customer rows are printed in this audit file.

## Safest Next Action

Before removing anything:

1. Export non-empty candidate tables first: `customers`, `quotes`, and `quotes_public_view` definition/data.
2. Compare `pricing_*` tables against the newer non-`pricing_` equivalents before deciding which pricing model wins.
3. Archive or export `candidate for archive/remove` tables first.
4. Only delete after confirming:
   - no Netlify function reads the table
   - no browser code references the table
   - no operational workflow still depends on the data

Immediate safe cleanup candidates by row count and repo wiring:

- `agent_tasks`
- `backlink_targets`
- `blog_ideas`
- `seo_keywords`
- `seo_pages`
- `seo_rank_snapshots`
- `quote_files`
- `quote_revenue`

Do not remove yet:

- `pricing_*` tables, because they are live-wired today.
- `products` / `product_ranges` / canonical pricing tables, because they are the future model and contain synced data.
- `customers`, `quotes`, `quotes_public_view`, because they contain rows and may be historical data.
- `quote_leads`, because the missing `quote_reviews` table migration currently has a foreign key reference to it.

## Prepared Cleanup Script

`apps/web/supabase-audit-exports/2026-05-04/supabase_safe_cleanup.sql` has been prepared for Supabase SQL Editor or a database connection with DDL access.

The script:

- creates missing `quote_reviews`
- removes only empty, unwired archive candidates
- avoids `cascade`
- does not touch live `pricing_*`, `products`, `quote_requests`, `quote_items`, `quote_rooms`, `uploaded_files`, `quote_events`, or `quote_funnel_sessions`
