# Operon Supabase Database Implementation

Source-of-truth status: active implementation note for Supabase schema, analytics tables, and how frontend tracking relates to stored data.

## Purpose

Supabase is the structured data and analytics layer for Operon Flooring.

It supports:

- quote request persistence
- room and line-item storage
- file metadata storage
- quote funnel tracking
- SEO and backlink tracking
- revenue and margin tracking

It must never block the quote form if unavailable.

## Core Schema Files

- `supabase/schema.sql`
- `supabase/analytics_schema.sql`
- `supabase/pricing_schema.sql`

## Primary Data Groups

### Quote capture

Defined in `supabase/schema.sql`:

- `quote_requests`
- `quote_rooms`
- `quote_items`
- `uploaded_files`

These tables support lead capture and quote reconstruction.

### Analytics and operating system

Defined in `supabase/analytics_schema.sql`:

- `quote_events`
- `quote_funnel_sessions`
- `quote_revenue`
- `seo_keywords`
- `seo_pages`
- `seo_rank_snapshots`
- `backlink_targets`
- `agent_tasks`
- `blog_ideas`

### Private pricing foundation

Defined in `supabase/pricing_schema.sql`:

- `pricing_categories`
- `pricing_products`
- `pricing_install_rates`
- `pricing_underlay_options`
- `pricing_trim_options`
- `pricing_removal_rates`
- `pricing_location_zones`
- `pricing_rules`

These tables are intended to keep pricing private.
They should not be exposed to anonymous browser reads.

## Private Quote Runtime

Server-side quote calculation now has a Netlify function foundation:

- `netlify/functions/_supabasePricing.js`
- `netlify/functions/calculate-private-quote.js`

Purpose:

- read private pricing tables using server-side Supabase credentials
- calculate customer-safe quote totals without exposing raw rates
- return bundled quote output only

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not place service-role credentials in frontend code.

## Frontend Tracking Relationship

Frontend tracking lives in:

- `apps/web/tracking.js`

Expected behavior:

- send events to GA4 if configured
- send events to Supabase if config is available
- fall back to localStorage if not
- never block customer actions

Primary funnel events:

- `quote_start`
- `quote_step_view`
- `quote_step_complete`
- `quote_submit`
- `quote_abandon`
- `floorplan_opened`
- `floorplan_area_used`
- `product_selected`

## Revenue Tracking

Revenue tracking is managed through:

- `apps/web/admin-revenue.html`
- `quote_revenue`

Status values:

- `lead`
- `contacted`
- `site_visit_booked`
- `quoted`
- `won`
- `lost`
- `completed`

Margin fields:

- `final_quote_value`
- `material_cost`
- `labour_cost`
- `subcontractor_cost`
- `other_cost`
- `gross_profit`
- `gross_margin_pct`

## Dashboard / Manual Tracker Layer

Current supporting pages:

- `apps/web/dashboard.html`
- `apps/web/seo-rank-tracker.html`
- `apps/web/backlink-tracker.html`

These are decision-support tools. They may read localStorage or manual data until fuller Supabase reads are connected.

## Guardrails

- Do not expose service-role secrets in customer-facing pages
- Public anon configuration must remain limited to allowed client actions
- Keep pricing tables private unless a specific public subset is intentionally created later
- Tracking failure must fail silently
- Quote submission must succeed even if analytics calls fail
- Protect admin pages before treating them as production-ready
