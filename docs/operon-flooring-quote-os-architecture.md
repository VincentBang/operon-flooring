# Operon Flooring Quote OS Architecture

Status: foundation plan only
Scope: Operon Flooring public site, private quoting console, lead operations, site visits, quote versions, proposals and follow-up workflow
Non-goals for this phase: production deploy, Netlify trigger, production Supabase setting changes, pricing formula changes, public route changes, Operon Kitchens implementation

## 1. Current Backend And Public-Site Capabilities

### Public route and app surface

The current TSX app lives under `apps/web-tsx` and preserves the approved public `.html` URL strategy. Core acquisition pages are static-exported Next routes such as:

- `/`
- `/quote.html`
- `/products.html`
- `/quote-review.html`
- `/floorplan.html`
- `/contact.html`
- `/blog/`
- SEO category and suburb pages such as `/hybrid-flooring-sydney.html`, `/laminate-flooring-sydney.html`, `/engineered-timber-flooring-sydney.html` and `/flooring-*.html`

The legacy HTML app remains in `apps/web` and is useful for rollback/reference, but Quote OS should build from `apps/web-tsx`, Netlify Functions, and Supabase service-role writes.

### Quote flow

Relevant files:

- `apps/web-tsx/src/app/quote/page.tsx`
- `apps/web-tsx/src/app/quote/QuoteRuntime.tsx`
- `apps/web-tsx/public/quoteRuntime.js`
- `netlify/functions/calculate-quote.js`
- `netlify/functions/calculate-private-quote.js`
- `netlify/functions/save-quote-request.js`
- `netlify/functions/send-quote-email.js`
- `netlify/functions/_supabasePricing.js`
- `netlify/functions/shared/leadWriter.js`

Current capability:

- Public customer quote wizard collects suburb/postcode, property type, product/category/range, measurement/area, stairs, removal/disposal, floor preparation, trims, underlay, access and contact details.
- `/.netlify/functions/calculate-quote` normalises browser payloads and returns a customer-safe estimate response.
- `_supabasePricing.js` reads pricing-support tables server-side using Supabase service-role credentials.
- `calculate-private-quote.js` exists as a private/admin-oriented calculation endpoint and strips a blocklist of private diagnostic fields before responding.
- `save-quote-request.js` writes quote requests, rooms, items, lead records/events, customer/internal email status, and close-score style metadata through server-side Supabase calls.
- Quote responses are intentionally estimate-first. Unknown scope should create review flags rather than silently becoming a confirmed `No`.

Current boundary:

- The public browser must receive only customer-safe totals, included scope, missing scope, confidence and next action.
- It must not receive private rates, supplier costs, margins, access multipliers, storage paths, raw OCR text or private formulas.

### Quote review

Relevant files:

- `apps/web-tsx/src/app/quote-review/page.tsx`
- `apps/web-tsx/public/quoteReviewReport.js`
- `netlify/functions/quote-review-ocr.js`
- `netlify/functions/save-quote-review.js`
- `netlify/functions/send-quote-review-email.js`

Current capability:

- Public quote-review page supports upload review and quick completeness check.
- OCR extraction is server-side through `quote-review-ocr.js`, with file type and size validation.
- OCR report generation strips raw text fields before returning customer-facing structured output.
- Quick-check output is focused on readiness, missing scope, risks and questions to ask.
- Quote-review can hand off to `/quote.html` as a comparison quote path.

Current boundary:

- Raw quote text and OCR extraction must remain server-side.
- Browser response should expose only structured, customer-safe report fields.
- Quote review should not become a pricing judge or estimator; it should clarify scope and route to an Operon comparison quote.

### Chatbot

Relevant files:

- `apps/web-tsx/public/chatbot/*`
- `apps/web-tsx/src/lib/chatbotLeadQualification.ts`
- `netlify/functions/save-chatbot-lead-event.js`
- `netlify/functions/chatbot-lead-event.js`
- `internal-qa/tests/chatbot/chatbot.test.js`
- `internal-qa/tests/web/saveChatbotLeadEventContract.test.js`

Current capability:

- Chatbot routes customers to quote, quote-review, products, floorplan and contact paths.
- It supports qualification concepts such as intent, suburb, property type, product category, area status, stairs, removal, floorplan status, existing quote status, urgency and next action.
- `save-chatbot-lead-event.js` validates a strict safe payload, rejects raw transcript/quote/OCR/pricing fields, and writes safe lead events/qualification rows server-side.
- Chatbot policies state that it must not calculate prices, mutate quote fields, submit quote forms or expose internal pricing.

Current boundary:

- Chatbot is a routing and qualification assistant, not an AI estimator.
- It should not store raw transcripts by default or collect PII unless the user explicitly requests contact or follow-up.

### Floorplan and upload flow

Relevant files:

- `apps/web-tsx/src/app/floorplan/page.tsx`
- `apps/web-tsx/src/app/floorplan/FloorplanRuntime.tsx`
- `apps/web-tsx/public/floorplanRuntime.js`
- `apps/web-tsx/public/floorplanQuickRoom.js`
- `netlify/functions/upload-customer-file.js`

Current capability:

- Floorplan tool can capture area/room data and hand measured real area into the quote flow.
- Public file upload goes through `/.netlify/functions/upload-customer-file`.
- Upload function validates file type, extension, MIME signature, size and Turnstile where configured.
- Uploads are written server-side to a private Supabase storage bucket using service-role credentials.
- Current response returns only safe fields: `ok`, `status`, safe filename, file type, file size, metadata status and `uploaded_file_id`.
- Uploads can be linked to an existing quote lead when a valid quote id exists.

Current boundary:

- Browser should not receive bucket names, storage paths, permanent public URLs or raw uploaded content.
- Signed URLs should be short-lived and generated only for approved internal/admin/email workflows.

### Supabase usage

Relevant files:

- `supabase/migrations/20260502_operon_pricing_lead_schema.sql`
- `supabase/migrations/20260504_stair_pricing_schema.sql`
- `supabase/migrations/20260604_stage3_lead_operating_system.sql`
- `supabase/migrations/20260605_operon_product_ranges_seed.sql`
- `supabase/migrations/20260606_add_preference_floor_product_ranges.sql`
- `supabase/migrations/20260606_drop_operon_pricing_products_after_range_cutover.sql`
- `supabase/migrations/20260611_chatbot_qualification_bridge.sql`
- `netlify/functions/_supabaseTables.js`

Current capability:

- Functions use `OPERON_SUPABASE_SCHEMA_MODE` to choose legacy names or `operon_` prefixed v2 names.
- Existing lead foundation tables include `operon_leads`, `operon_lead_events`, `operon_lead_notes`, `operon_lead_files`, `operon_follow_ups`, `operon_floorplan_reviews`, `operon_lead_status_history` and `operon_chatbot_qualifications`.
- Existing detail tables include quote requests, quote rooms, quote items, quote events, uploaded files and quote reviews in legacy or `operon_` mode.
- `operon_product_ranges` is the current range-level pricing/admin table and is seeded from the public catalogue.
- Stair pricing tables exist as `stair_rates` and compatibility table `pricing_stair_rates`; private pricing helper reads the configured v2/legacy table mapping.
- Stage 3 tables are intended to have RLS enabled, no anon/authenticated grants and service-role-only function access.

Current boundary:

- Public browser should not directly select lead, quote, upload, event, review, pricing, stair, rate-card or dashboard tables.
- Admin dashboard reads should go through protected Netlify Functions, not browser Supabase clients.

### Netlify functions

Customer-facing functions:

- `calculate-quote.js`
- `save-quote-request.js`
- `contact-enquiry.js`
- `upload-customer-file.js`
- `quote-review-ocr.js`
- `save-quote-review.js`
- `send-quote-review-email.js`
- `send-quote-email.js`
- `operator-chat-request.js`
- `save-chatbot-lead-event.js`

Admin/internal functions:

- `admin-session-status.js`
- `lead-dashboard.js`
- `lead-admin.js`
- `lead-status-admin.js`
- `lead-followup-admin.js`
- `followup-admin.js`
- `calculate-private-quote.js`
- `pricing-optimization-insight.js`
- `process-followups.js`

Shared helpers:

- `_security.js`
- `_supabaseTables.js`
- `_supabasePricing.js`
- `shared/adminAuth.js`
- `shared/leadWriter.js`

Current capability:

- Shared security helper controls CORS, method responses, body limits, Turnstile verification and durable rate limits where configured.
- Admin helpers accept an environment-managed admin token via `Authorization: Bearer ...` or `x-operon-admin-token`.
- Lead writer sanitises metadata and strips sensitive keys such as service-role, raw OCR, raw quote, storage bucket/path, signed URL, internal rates, supplier cost, margin, access factor and private pricing table names.

### Product and range data

Relevant files:

- `apps/web-tsx/public/products.js`
- `apps/web-tsx/public/preference-floors-import.js`
- `apps/web-tsx/public/productSelection.js`
- `apps/web-tsx/public/pricingSource.js`
- `apps/web-tsx/public/underlay.js`
- `apps/web-tsx/public/skirtingScotia.js`
- `netlify/functions/public-catalogue-pricing.js`
- `supabase/migrations/20260605_operon_product_ranges_seed.sql`
- `supabase/migrations/20260606_add_preference_floor_product_ranges.sql`

Current capability:

- Public products page has a full colour catalogue and product/range handoff to quote.
- Supabase `operon_product_ranges` is the intended one-row-per-range pricing/admin table.
- Public catalogue endpoint returns customer-safe category/range data but still includes public-facing price-per-m2 fields for the customer estimate flow.

Current boundary:

- Public catalogue may show customer-safe products/ranges, colour names/images and high-level selection metadata.
- It should not expose private margin logic, supplier cost, internal labour/removal/stair/location rules, access multipliers or admin-only pricing notes.

### Known security and privacy risks

Known risks that remain relevant for Quote OS:

1. Legacy public pricing-support files still exist in public output, including `pricingSource.js`, `underlay.js`, `skirtingScotia.js`, `products.js` and `quoteRuntime.js`. These are not the same as private rate cards, but they are still a public surface that should shrink as server-side pricing matures.
2. Public `products.js` includes customer-safe product catalogue details and some supplier/source fields. This is acceptable for product browsing but should not become the source of private pricing.
3. Browser storage is used for quote draft recovery, product selection, floorplan handoff and tracking. It must continue to exclude raw OCR text, storage paths, service tokens and private pricing data.
4. Floorplan runtime stores image/session draft data locally for usability. Retention and privacy should be revisited before a formal internal operating system depends on customer files.
5. Admin token auth is a workable MVP gate but not a long-term least-privilege auth model.
6. GraphQL/Data API exposure must be kept locked down for lead, quote, upload, review, rate-card and follow-up tables; RLS alone is not enough if role grants expose tables unexpectedly.
7. Existing functions log safe reasons, but future admin/proposal functions must avoid logging customer files, raw OCR, customer notes, full emails, secrets or private pricing diagnostics.
8. Proposal/PDF generation currently exists inside quote save/email paths; Quote OS should separate proposal versioning from customer submission so internal revisions are auditable.

## 2. Proposed Quote OS Architecture

Quote OS should be a private operating layer behind the public acquisition site. The public site continues to generate structured demand; the private console turns that demand into reviewed quotes, site visits, quote versions, proposals and follow-up actions.

### Public acquisition layer

Purpose:

- Capture customer intent and project basics from quote, product, quote-review, floorplan, contact and chatbot paths.
- Route customers to the best next action.
- Return customer-safe estimates and scope clarity only.

Responsibilities:

- Keep existing `.html` route strategy.
- Keep public pages fast, indexable and conversion-focused.
- Submit customer data through Netlify Functions only.
- Store only short-lived, customer-safe browser state.
- Never expose private rates, margins, supplier costs, internal formulas, storage paths, OCR text or raw uploaded contents.

### Private internal quote console

Purpose:

- Give Operon staff a secure workspace to review leads, run internal quote calculations, record site visits, create quote versions, generate proposals and manage follow-up.

Initial modules:

- Lead inbox and lead detail.
- Quote request detail.
- Site visit checklist.
- Internal quote builder.
- Quote version history.
- Proposal generator.
- Follow-up queue.
- Reporting dashboard.

Access:

- Protected route under existing admin shell initially.
- All data fetched through protected Netlify Functions.
- No direct browser Supabase reads.
- No public discoverability or indexability.

### Lead and event system

Core idea:

- `leads` is the parent operating record.
- Every acquisition path creates or links an event.
- Detail records such as quote requests, quote reviews, floorplan reviews and uploads link back to the parent lead.

Lead sources:

- Quote form.
- Contact form.
- Product handoff.
- Quote review.
- Floorplan upload/handoff.
- Chatbot qualification.
- Operator/manual entry later.

Event examples:

- `quote_started`
- `quote_submitted`
- `product_selected`
- `product_to_quote`
- `quote_review_started`
- `quote_review_completed`
- `floorplan_uploaded`
- `floorplan_to_quote`
- `chatbot_qualified`
- `contact_requested`
- `site_visit_booked`
- `site_visit_completed`
- `quote_version_created`
- `proposal_sent`
- `follow_up_created`
- `follow_up_done`
- `job_won`
- `job_lost`

### Site visit checklist

Purpose:

- Turn rough online quote data into reliable internal scope.

Checklist sections:

- Customer/contact confirmation.
- Site address and access.
- Property type, level, lift, parking.
- Room list and measurements.
- Existing floor and removal method.
- Disposal requirement.
- Subfloor condition and prep.
- Moisture/acoustic/strata notes.
- Stairs and stair profiles.
- Skirting/scotia/trims/doors.
- Furniture/occupied-site notes.
- Product/range/colour confirmation.
- Risk notes and photos.
- Customer preference, timing and decision drivers.

Output:

- Structured `site_visits`.
- Room rows in `site_visit_rooms`.
- Private photos in `site_visit_photos`.
- Internal scope flags and quote assumptions.

### Quote versioning

Purpose:

- Preserve every internal revision and customer proposal state.

Model:

- A quote request may have many quote versions.
- Each version has line items, assumptions, exclusions, internal notes, customer-safe summary and status.
- Version numbers should be immutable once sent.
- Revisions should point back to prior version and explain reason.

Example statuses:

- `draft`
- `internal_review`
- `ready_to_send`
- `sent`
- `accepted`
- `declined`
- `superseded`
- `archived`

### Private rate-card model

Purpose:

- Move private commercial logic behind service-role functions and admin-only views.
- Support flooring first, then reuse the pattern for kitchens.

Rate-card boundaries:

- Public browser can know customer-safe product/range names and broad estimate outputs.
- Private functions own material rates, install rates, stair profiles, removal rates, prep allowances, trims, access/location multipliers, minimums, commercial overrides, margin rules and proposal assumptions.

Recommended model:

- `product_ranges` remains the customer-safe/range-level product catalogue.
- `private_rate_cards` defines named internal rate card versions.
- `stair_pricing_profiles` defines stair-profile templates.
- `stair_profile_prices` stores rate-card-specific stair prices.
- `range_stair_price_overrides` stores exceptional range-specific stair prices.
- Future install/removal/prep/access tables should follow the same versioned rate-card pattern.

### Server-side pricing engine

Purpose:

- Make Netlify Functions the only place where internal pricing calculations happen.

Public function:

- `calculate-public-estimate`
- Accepts customer-safe inputs.
- Returns customer-safe estimate range/total, included scope, missing items, confidence and next action.
- Does not return private diagnostic fields.

Internal function:

- `calculate-internal-quote`
- Requires admin auth.
- Reads private rate cards and site visit scope.
- Returns internal diagnostics only to authenticated/admin console.
- Creates quote versions only when requested by staff.

Migration principle:

- Do not change formulas during the migration.
- First make parity tests prove same customer-safe results.
- Then remove private pricing support from public output in controlled steps.

### Proposal generation

Purpose:

- Generate customer-safe quote PDFs/emails from approved quote versions.

Proposal should include:

- Customer and site details.
- Product/range/colour when confirmed.
- Area and order area assumptions.
- Inclusions.
- Exclusions.
- Site visit assumptions.
- Optional photos if approved.
- Total or estimate range.
- Validity period.
- Next step CTA.
- Terms/warranty notes.

Proposal must not include:

- Internal rates.
- Supplier cost.
- Margin.
- Internal multipliers.
- Private diagnostics.
- Storage paths.
- Raw OCR text.

### Follow-up queue

Purpose:

- Give staff a dry-run operational list before any automation.

Task inputs:

- Lead intent and source.
- Quote confidence.
- Missing info.
- Quote-review status.
- Floorplan status.
- Contact status.
- Site visit status.
- Proposal sent status.
- Last activity date.

Initial follow-up actions:

- Call high-intent quote lead.
- Ask for floor plan or area.
- Ask for product/range choice.
- Recommend quote review.
- Book site visit.
- Send proposal reminder.
- Mark won/lost/archive.

Automation rule:

- No automatic email/SMS until a later explicitly approved phase.

### Dashboard and read-only reporting

Purpose:

- Show operating health without exposing private pricing to public surfaces.

Initial dashboard:

- Lead volume by source.
- New vs needs review vs waiting customer vs quote sent.
- Product mix.
- Suburb mix.
- Average estimate total.
- Quote-review usage.
- Floorplan usage.
- Follow-up due count.
- Proposal sent / won / lost counts.

Reporting should use aggregated values and protected admin functions.

## 3. Proposed Database Tables

Physical naming recommendation: use `operon_` prefixes for all production tables in the public schema, because current migrations/functions already use `operon_` v2 names. The logical names below match the requested model; proposed physical names are listed explicitly.

### leads

Physical table: `operon_leads`

Purpose: parent operating record for every public or manual lead.

Key fields:

- `id uuid primary key`
- `created_at timestamptz`
- `updated_at timestamptz`
- `last_activity_at timestamptz`
- `primary_source text`
- `source_detail text`
- `status text`
- `priority text`
- `customer_name text`
- `email text`
- `phone text`
- `suburb text`
- `postcode text`
- `product_category text`
- `product_range_id text`
- `product_name text`
- `area_m2 numeric`
- `estimated_order_area_m2 numeric`
- `estimate_total_inc_gst numeric`
- `confidence_score numeric`
- `confidence_level text`
- `missing_info_flags jsonb`
- `risk_flags jsonb`
- `quote_review_status text`
- `floorplan_status text`
- `site_visit_status text`
- `proposal_status text`
- `contact_status text`
- `follow_up_status text`
- `next_action text`
- `metadata jsonb`

Notes:

- This table already exists in Stage 3 form, but Quote OS should add `site_visit_status` and `proposal_status` when approved.
- Contact PII belongs here and must be admin-only/service-role-only.

### lead_events

Physical table: `operon_lead_events`

Purpose: append-only timeline for lead activity.

Key fields:

- `id uuid primary key`
- `lead_id uuid references operon_leads(id)`
- `created_at timestamptz`
- `event_type text`
- `source text`
- `source_table text`
- `source_id uuid`
- `customer_safe boolean`
- `metadata jsonb`

Notes:

- Metadata must be sanitised.
- No raw transcripts, OCR text, upload contents or private pricing fields.

### quote_requests

Physical table: `operon_quote_requests`

Purpose: public quote request submission and initial estimate snapshot.

Key fields:

- `id uuid primary key`
- `lead_id uuid references operon_leads(id)`
- `quote_reference bigint or text`
- `created_at timestamptz`
- `updated_at timestamptz`
- `status text`
- `customer_name text`
- `email text`
- `phone text`
- `site_address text`
- `suburb text`
- `postcode text`
- `property_type text`
- `product_category text`
- `product_range_id text`
- `product_colour text`
- `quote_mode text`
- `measurement_source text`
- `area_m2 numeric`
- `estimated_order_area_m2 numeric`
- `estimate_total_inc_gst numeric`
- `confidence_level text`
- `missing_scope_items jsonb`
- `risk_flags jsonb`
- `customer_safe_summary jsonb`
- `metadata jsonb`

Notes:

- Existing function writes should remain backward-compatible.
- Future Quote OS should separate public submission snapshot from internal quote version.

### quote_versions

Physical table: `operon_quote_versions`

Purpose: immutable internal/customer proposal revisions.

Key fields:

- `id uuid primary key`
- `lead_id uuid references operon_leads(id)`
- `quote_request_id uuid references operon_quote_requests(id)`
- `site_visit_id uuid references operon_site_visits(id)`
- `version_number integer`
- `status text`
- `created_at timestamptz`
- `created_by text`
- `supersedes_quote_version_id uuid`
- `rate_card_id uuid references operon_private_rate_cards(id)`
- `product_range_id text`
- `product_category text`
- `area_m2 numeric`
- `order_area_m2 numeric`
- `subtotal_ex_gst numeric`
- `gst numeric`
- `total_inc_gst numeric`
- `customer_summary text`
- `assumptions jsonb`
- `exclusions jsonb`
- `internal_notes text`
- `sent_at timestamptz`
- `accepted_at timestamptz`
- `metadata jsonb`

Notes:

- Internal diagnostics can be stored here or in a private child table, but never returned to public browser.
- Once `status = sent`, the version should be immutable except status fields.

### quote_line_items

Physical table: `operon_quote_line_items`

Purpose: line items for a quote version.

Key fields:

- `id uuid primary key`
- `quote_version_id uuid references operon_quote_versions(id)`
- `line_order integer`
- `line_type text`
- `customer_label text`
- `internal_label text`
- `quantity numeric`
- `unit text`
- `unit_basis text`
- `amount_ex_gst numeric`
- `gst numeric`
- `amount_inc_gst numeric`
- `cost_basis jsonb`
- `customer_visible boolean`
- `metadata jsonb`

Notes:

- `cost_basis` must be admin-only and excluded from public proposal APIs unless explicitly redacted.

### site_visits

Physical table: `operon_site_visits`

Purpose: structured site inspection record.

Key fields:

- `id uuid primary key`
- `lead_id uuid references operon_leads(id)`
- `quote_request_id uuid references operon_quote_requests(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `scheduled_at timestamptz`
- `completed_at timestamptz`
- `status text`
- `inspector_name text`
- `site_address text`
- `property_type text`
- `access_notes text`
- `parking_notes text`
- `lift_notes text`
- `subfloor_condition text`
- `moisture_notes text`
- `acoustic_notes text`
- `removal_scope text`
- `disposal_scope text`
- `floor_preparation_scope text`
- `stairs_summary text`
- `trim_summary text`
- `risk_flags jsonb`
- `customer_preferences jsonb`
- `internal_notes text`
- `metadata jsonb`

### site_visit_photos

Physical table: `operon_site_visit_photos`

Purpose: private photo references for site visits.

Key fields:

- `id uuid primary key`
- `site_visit_id uuid references operon_site_visits(id)`
- `lead_id uuid references operon_leads(id)`
- `uploaded_file_id uuid`
- `photo_role text`
- `safe_filename text`
- `caption text`
- `room_label text`
- `storage_status text`
- `created_at timestamptz`
- `metadata jsonb`

Notes:

- Store file id and safe metadata, not public URLs.
- Signed access should be admin-only and short-lived.

### site_visit_rooms

Physical table: `operon_site_visit_rooms`

Purpose: room measurements and scope captured during inspection.

Key fields:

- `id uuid primary key`
- `site_visit_id uuid references operon_site_visits(id)`
- `room_order integer`
- `room_name text`
- `length_m numeric`
- `width_m numeric`
- `area_m2 numeric`
- `included_in_quote boolean`
- `existing_floor text`
- `removal_required text`
- `subfloor_notes text`
- `prep_required text`
- `stairs_or_transitions text`
- `photo_count integer`
- `metadata jsonb`

### product_ranges

Physical table: `operon_product_ranges`

Purpose: customer-safe product/range catalogue and editable range price anchor.

Current fields already include:

- `id`
- `category_id`
- `brand`
- `range_name`
- `selection_mode`
- `thickness`
- `product_type`
- `representative_product_id`
- `representative_image_url`
- `alt_text`
- `supplier`
- `supplier_url`
- `colour_count`
- `colours`
- `technical_summary`
- `price_per_m2`
- `install_rate_override`
- `price_notes`
- `pricing_status`
- `active`
- `sort_order`

Recommended Quote OS additions:

- `public_visibility text`
- `admin_notes text`
- `default_rate_card_id uuid`
- `pricing_reviewed_at timestamptz`
- `pricing_reviewed_by text`

Boundary:

- Product names, ranges, colours and customer-safe specs can support public catalogue.
- Private rate cards should not live in public product payloads.

### private_rate_cards

Physical table: `operon_private_rate_cards`

Purpose: versioned private pricing context.

Key fields:

- `id uuid primary key`
- `trade text default 'flooring'`
- `name text`
- `version text`
- `status text`
- `effective_from date`
- `effective_to date`
- `created_at timestamptz`
- `created_by text`
- `notes text`
- `metadata jsonb`

### stair_pricing_profiles

Physical table: `operon_stair_pricing_profiles`

Purpose: named stair pricing templates.

Key fields:

- `id uuid primary key`
- `trade text default 'flooring'`
- `profile_name text`
- `category text`
- `description text`
- `default_guide_width_mm numeric`
- `active boolean`
- `metadata jsonb`

### stair_profile_prices

Physical table: `operon_stair_profile_prices`

Purpose: rate-card-specific prices for stair profiles.

Key fields:

- `id uuid primary key`
- `rate_card_id uuid references operon_private_rate_cards(id)`
- `stair_profile_id uuid references operon_stair_pricing_profiles(id)`
- `stair_type text`
- `width_tier text`
- `price_ex_gst numeric`
- `active boolean`
- `metadata jsonb`

### range_stair_price_overrides

Physical table: `operon_range_stair_price_overrides`

Purpose: exceptional stair prices for specific product ranges.

Key fields:

- `id uuid primary key`
- `rate_card_id uuid references operon_private_rate_cards(id)`
- `range_id text references operon_product_ranges(id)`
- `stair_type text`
- `guide_width_mm numeric`
- `price_short_ex_gst numeric`
- `price_long_ex_gst numeric`
- `reason text`
- `active boolean`
- `metadata jsonb`

### follow_up_tasks

Physical table: `operon_follow_up_tasks` or continue with existing `operon_follow_ups`

Purpose: dry-run then controlled task queue.

Key fields:

- `id uuid primary key`
- `lead_id uuid references operon_leads(id)`
- `quote_version_id uuid references operon_quote_versions(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `due_at timestamptz`
- `status text`
- `priority text`
- `task_type text`
- `channel text`
- `reason text`
- `suggested_message text`
- `assigned_to text`
- `completed_at timestamptz`
- `metadata jsonb`

Notes:

- Existing `operon_follow_ups` can be retained if the name is already wired. If a new table is created, add compatibility views/functions carefully.
- No auto-send until approved.

### job_outcomes

Physical table: `operon_job_outcomes`

Purpose: close the loop for revenue, conversion, loss reasons and future rate-card calibration.

Key fields:

- `id uuid primary key`
- `lead_id uuid references operon_leads(id)`
- `quote_version_id uuid references operon_quote_versions(id)`
- `created_at timestamptz`
- `outcome text`
- `won_at timestamptz`
- `lost_at timestamptz`
- `lost_reason text`
- `accepted_total_inc_gst numeric`
- `final_total_inc_gst numeric`
- `gross_margin_band text`
- `job_start_date date`
- `job_completed_date date`
- `customer_feedback text`
- `internal_notes text`
- `metadata jsonb`

Boundary:

- Margin bands may be useful internally, but exact supplier costs/margins should never be exposed outside protected admin endpoints.

## 4. Permission Model

### Public users can submit

Public users may submit customer-safe inputs through Netlify Functions:

- Quote request.
- Contact enquiry.
- Quote-review upload or quick check.
- Floorplan upload/handoff.
- Product selection handoff.
- Chatbot qualification.
- Customer file upload.

Public users may receive:

- Customer-safe estimate output.
- Quote reference.
- Confirmation status.
- Upload status and `uploaded_file_id`.
- Quote-review readiness/report output.
- Handoff URLs.

### Browser must never receive

The browser must never receive:

- Supabase service-role keys or secret keys.
- Admin tokens.
- Storage bucket names or raw storage paths.
- Permanent public file URLs for customer uploads.
- Raw uploaded file contents.
- Raw OCR/extracted quote text.
- Full chatbot transcripts by default.
- Internal rates.
- Supplier costs.
- Margins.
- Access multipliers.
- Private pricing formulas.
- Private rate-card rows.
- Internal quote diagnostics.
- GraphQL/REST access to lead/upload/quote/admin tables.

### Admin can see

Admin users may see, through protected functions:

- Lead list and detail.
- Customer contact details.
- Quote requests and quote versions.
- Site visit checklist and photos through short-lived signed URLs.
- Quote-review structured report.
- Floorplan review records.
- Follow-up tasks.
- Proposal history.
- Job outcomes.
- Internal quote diagnostics and private pricing only in dedicated admin views.

Admin should not see secrets, service-role keys, raw provider responses or unnecessary raw OCR/file content unless a specific support workflow requires short-lived access.

### Service-role functions handle

Service-role Netlify Functions should handle:

- Validated public writes.
- Private storage uploads.
- Server-side quote calculations.
- Lead/event creation and dedupe.
- Admin reads.
- Admin writes.
- Quote version creation.
- Proposal generation.
- Signed URL creation.
- Follow-up task creation.

### Avoiding anon SELECT and GraphQL exposure

Rules:

- Enable RLS on every table in the exposed `public` schema.
- Revoke `anon` and `authenticated` grants for lead, quote, upload, review, rate-card, proposal, follow-up and job-outcome tables unless a very specific browser need is approved.
- Prefer no direct browser Supabase client for lead data.
- Do not create anon SELECT policies for operating tables.
- Remove anon direct storage select/list/update/delete policies.
- If GraphQL is enabled, make sure anon roles cannot access operating tables via grants.
- Keep service-role writes in Netlify Functions and keep the service-role key out of browser-readable config.

## 5. Server Functions Required

### upload-customer-file hardening

Current function exists: `netlify/functions/upload-customer-file.js`.

Required future hardening:

- Keep response limited to `ok`, `status`, safe filename/type/size, metadata status and `uploaded_file_id`.
- Keep bucket/path server-side only.
- Add optional admin-only signed URL function instead of returning signed URLs to public browser.
- Link uploads to leads only when context exists.
- Add retention metadata.
- Add file role support for quote attachment, floorplan upload, quote-review upload and site-visit photo.

### calculate-public-estimate

Current equivalent: `calculate-quote.js`.

Target:

- Public customer-safe endpoint.
- Reads private pricing server-side.
- Returns only estimate, included scope, review flags, confidence, assumptions and next action.
- Rejects debug/private field requests.
- Does not return rate-card ids unless customer-safe and not commercially sensitive.

### calculate-internal-quote

Current partial equivalent: `calculate-private-quote.js`.

Target:

- Admin-only endpoint.
- Reads quote request, site visit, product range and private rate card.
- Returns internal calculation diagnostics to the admin console only.
- Can produce a draft quote version when explicitly requested.
- Should not be used by public pages.

### save-site-visit

New function.

Responsibilities:

- Admin-only.
- Create/update `operon_site_visits`.
- Save rooms to `operon_site_visit_rooms`.
- Link site-visit photos to `operon_site_visit_photos`.
- Record lead events.
- Update lead next action/status.

### create-quote-version

New function.

Responsibilities:

- Admin-only.
- Validate quote request/lead exists.
- Run or accept a previously calculated internal quote.
- Create immutable quote version plus line items.
- Record lead event.
- Keep internal notes/private diagnostics admin-only.

### generate-quote-proposal

New function.

Responsibilities:

- Admin-only.
- Generate customer-safe PDF/email payload from a quote version.
- Store generated proposal metadata.
- Optionally send via approved email function later.
- Never include private rates/margins/supplier costs/storage paths/raw OCR.

### create-follow-up-task

Current partial equivalent: `lead-followup-admin.js` and `followup-admin.js`.

Target:

- Admin-only or server-side event-driven.
- Dry-run first.
- Creates task reason, priority, due date and suggested internal message.
- Does not auto-send messages until explicitly approved.

## 6. Rollout Sequence

### Phase 1: security and architecture

Goal:

- Confirm boundaries before building more operating surface.

Tasks:

1. Keep this architecture document as the source of truth.
2. Verify existing RLS, grants and storage policies in Supabase without changing production settings.
3. Confirm no direct browser writes remain for lead/quote/upload/event tables.
4. Keep upload response path/bucket hidden.
5. Add or maintain contract tests for public function response safety.
6. Define migration SQL for new Quote OS tables, but do not apply until approved.

Exit criteria:

- Architecture approved.
- Strict RLS/storage/GraphQL plan approved.
- No public route or pricing behaviour changed.

### Phase 2: private quote console skeleton

Goal:

- Give staff a protected shell without new pricing behaviour.

Tasks:

1. Use existing admin shell.
2. Add read-only quote request list/detail view.
3. Add read-only lead/event timeline.
4. Add site visit checklist UI in draft/local mode.
5. Add tests for public denial and no private field exposure.

Exit criteria:

- Admin-only access works.
- Public users cannot view internal data.
- Quote/product/floorplan/quote-review flows unchanged.

### Phase 3: server-side pricing

Goal:

- Move pricing support fully behind functions while preserving customer output.

Tasks:

1. Create parity fixtures for major quote scenarios.
2. Make `calculate-public-estimate` the primary quote endpoint.
3. Create `private_rate_cards` and stair profile models.
4. Wire `calculate-internal-quote` for admin only.
5. Remove public dependency on private pricing-support files in stages.

Exit criteria:

- Customer quote results match approved baseline.
- Public frontend does not expose private pricing support.
- Admin console can inspect internal quote inputs safely.

### Phase 4: proposal generator

Goal:

- Turn reviewed quote versions into customer-safe proposals.

Tasks:

1. Create quote version and line item tables.
2. Create proposal template contract.
3. Generate PDF/email preview from quote version.
4. Add manual-send approval workflow.
5. Log proposal sent/accepted/declined events.

Exit criteria:

- Proposals are versioned.
- Customer-facing output is polished and safe.
- No private pricing diagnostics leak.

### Phase 5: dashboard and follow-up dry-run

Goal:

- Make operating work visible without automation risk.

Tasks:

1. Expand dashboard reporting.
2. Add dry-run follow-up queue.
3. Add job outcome capture.
4. Add lead source and conversion reports.
5. Prepare controlled automation proposal for later.

Exit criteria:

- Operators can see leads, quote status, site visit status, follow-up actions and outcomes.
- No auto-send exists.
- Follow-up rules are reviewable and reversible.

## 7. Reuse Plan For Operon Kitchens Later

Quote OS should be flooring-first but trade-aware.

### Shared lead model

Reuse:

- `leads`
- `lead_events`
- `lead_notes`
- `lead_files`
- `follow_up_tasks`
- `lead_status_history`
- `job_outcomes`

Add:

- `trade text` or `vertical text` on shared parent tables before Kitchens joins.
- Source domains and brand ids.

### Separate trade-specific rate cards

Reuse:

- `private_rate_cards` as a shared table with `trade`.

Separate:

- Flooring product ranges.
- Kitchen product/material catalogues.
- Flooring stair/profile pricing.
- Kitchen cabinet/benchtop/trade-specific rate tables.
- Trade-specific quote calculators.

### Separate public domains

Rules:

- Operon Flooring public site remains `operonflooring.com.au`.
- Operon Kitchens should have separate public pages/domain/app routing.
- Shared admin can show both, but public assets, SEO and conversion paths remain separate.

### Shared admin/dashboard infrastructure

Reuse:

- Admin auth/session pattern.
- Lead list/detail.
- Event timeline.
- Follow-up queue.
- Upload/file safety model.
- Proposal versioning shell.
- Reporting dashboard.

Separate:

- Public quote forms.
- Trade-specific calculator functions.
- Trade-specific site visit checklist sections.
- Trade-specific proposal templates.
- Trade-specific rate cards.

## 8. Implementation Risks And Guardrails

### Main risks

1. Pricing leakage: moving too fast could expose private rate-card fields in public APIs.
2. Behaviour regression: changing quote calculation while building admin tools could break revenue paths.
3. Admin exposure: static admin route exists publicly, so all data must remain behind functions.
4. RLS/GraphQL drift: Supabase grants can expose tables even when RLS exists.
5. Upload privacy: site visit photos and customer files need private storage and short-lived signed access.
6. Proposal leakage: customer PDFs must not include internal labels, costs, margins or diagnostics.
7. Duplicate data model: legacy/v2 table modes can create confusion unless the function table mapping remains explicit.
8. Over-automation: follow-up automation before operational review can create spam or poor customer experience.

### Guardrails

- No pricing formula changes in architecture/security/admin shell tasks.
- No public route changes without route QA.
- No production Supabase policy changes without approved SQL, rollback SQL and tests.
- No direct browser Supabase reads/writes for operating data.
- No raw OCR/quote/file content in browser storage, analytics or lead event metadata.
- No automatic follow-up messages until dry-run has been reviewed.
- Preserve rollback/reference value of `apps/web`.

## 9. Recommended Next Implementation Task

Recommended next task:

**Quote OS Task 1.1 - Schema Gap And Migration Draft**

Report first, no database changes.

Scope:

1. Compare this architecture against current migrations.
2. Identify which tables already exist and which are new:
   - likely existing: `operon_leads`, `operon_lead_events`, `operon_lead_notes`, `operon_lead_files`, `operon_follow_ups`, `operon_floorplan_reviews`, `operon_lead_status_history`, `operon_chatbot_qualifications`, `operon_product_ranges`
   - likely new: `operon_quote_versions`, `operon_quote_line_items`, `operon_site_visits`, `operon_site_visit_photos`, `operon_site_visit_rooms`, `operon_private_rate_cards`, `operon_stair_pricing_profiles`, `operon_stair_profile_prices`, `operon_range_stair_price_overrides`, `operon_job_outcomes`
3. Draft additive SQL migration and rollback SQL.
4. Include RLS/grant plan.
5. Include verification queries.
6. Do not apply migration until approved.

This is the safest next move because it turns the plan into a reviewed schema contract before any runtime/admin UI changes.
