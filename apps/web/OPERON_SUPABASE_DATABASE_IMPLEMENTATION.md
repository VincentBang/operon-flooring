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

## Future Lead Sync Contract

Status: planning only. No live browser write is enabled by this note.

The current no-email quote submission flow builds a customer-safe lead payload in `apps/web/index.html`, stores a browser backup, and submits through Netlify Forms when running on a deployed Netlify site. A later Supabase write should use the same payload shape so the form, local backup, and database record stay aligned.

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

Recommended Supabase mapping:

- `quote_requests`: customer/contact fields, project address, suburb, postcode, selected product/category summary, real area, chargeable area, quote total, notes, `lead_status = new`
- `quote_items`: bundled customer-facing quote lines only, not raw internal rates
- `quote_rooms`: optional room-level measurements when the floor plan or room-by-room tools provide structured room data
- `quote_events`: `quote_submit`, `quote_submit_success`, and `quote_submit_error` events with quote/session identifiers where available

Implementation guardrails:

- perform Supabase inserts from a Netlify function, not direct browser service-role access
- keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
- insert the lead first, then related rooms/items/events with the returned quote id
- preserve Netlify Forms and localStorage backup as fallback paths
- if Supabase insert fails, the customer should still see the normal recovery path and should not lose the quote payload
- do not enable Resend or outbound email until the email system is explicitly ready

Future function contract:

```json
{
  "name": "Customer name",
  "phone": "Customer phone",
  "email": "Customer email if supplied",
  "address": "Project address",
  "suburb": "Sydney suburb",
  "postcode": "Postcode",
  "selectedProduct": "Customer-facing product or range label",
  "category": "hybrid | laminate | engineered",
  "realArea": 60,
  "chargeableArea": 60,
  "quoteTotal": 1925,
  "quoteLines": [{"label": "Installation labour", "amount": 1500}],
  "notes": "Customer-facing notes only",
  "createdAt": "ISO timestamp",
  "leadStatus": "new"
}
```

The response should return:

```json
{
  "ok": true,
  "quoteId": "database quote id",
  "leadStatus": "new"
}
```

If the insert fails, return a safe error message without exposing Supabase details.

## Future Queue Sync Contract

Status: planning only. The current source of truth remains `apps/web/task_queue.json`.

When task automation moves into Supabase, use `agent_tasks` for queue rows and keep the same task semantics already used by the local 50-task backlog.

Expected queue fields:

- `id`
- `title`
- `category`
- `assigned_agent`
- `impact_score`
- `confidence_score`
- `effort_score`
- `priority_score`
- `dependencies`
- `risk_level`
- `files_likely_affected`
- `validation_checklist`
- `status`
- `notes`
- `created_at`
- `updated_at`

Recommended sync rule:

- local `task_queue.json` remains the readable planning source during local execution
- Supabase can mirror queue state later for dashboard/reporting
- writes should be explicit, not automatic on every local preview
- completed, blocked, and pending tasks must remain separable for unattended run reporting
- no GitHub push, deploy, or Netlify action should be triggered by queue sync itself

## Guardrails

- Do not expose service-role secrets in customer-facing pages
- Public anon configuration must remain limited to allowed client actions
- Keep pricing tables private unless a specific public subset is intentionally created later
- Tracking failure must fail silently
- Quote submission must succeed even if analytics calls fail
- Protect admin pages before treating them as production-ready
