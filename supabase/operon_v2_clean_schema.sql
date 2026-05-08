-- Operon Flooring clean Supabase v2 schema.
-- Purpose: create one clear operon_* database set for the live site, pricing,
-- quote review, follow-up automation, close scoring, and pricing analysis.
--
-- Safe rollout:
-- 1. Run this file in Supabase SQL Editor.
-- 2. Re-enter or import pricing data into the operon_pricing_* tables.
-- 3. Set Netlify env OPERON_SUPABASE_SCHEMA_MODE=v2.
-- 4. Configure browser table aliases only after RLS/policies are verified.
-- 5. Drop legacy tables only with operon_v2_drop_legacy_after_verification.sql.

create extension if not exists pgcrypto;

create or replace function public.operon_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create sequence if not exists public.operon_quote_reference_seq
  start with 352
  increment by 1
  no maxvalue
  cache 1;

create table if not exists public.operon_pricing_categories (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  label text not null,
  short_description text,
  default_price_per_m2 numeric not null default 0,
  page_url text,
  active boolean not null default true
);

create table if not exists public.operon_pricing_products (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  category_id text not null references public.operon_pricing_categories(id) on delete restrict,
  brand text not null,
  range_name text not null,
  colour text not null default '',
  tone text,
  swatch text,
  thickness text,
  product_type text,
  price_per_m2 numeric not null default 0,
  install_rate_override numeric,
  image_url text,
  alt_text text,
  description text,
  features jsonb not null default '[]'::jsonb,
  suitable_for jsonb not null default '[]'::jsonb,
  supplier text,
  supplier_url text,
  active boolean not null default true,
  sort_order integer not null default 100
);

create table if not exists public.operon_pricing_install_rates (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  category_id text not null references public.operon_pricing_categories(id) on delete restrict,
  install_type text not null default 'standard',
  install_method text not null default 'floating',
  job_type text not null default 'standard',
  rate_per_m2 numeric not null default 0,
  minimum_charge numeric not null default 0,
  active boolean not null default true
);

create table if not exists public.operon_pricing_underlay_options (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  suitable_categories jsonb not null default '[]'::jsonb,
  price_per_m2 numeric not null default 0,
  active boolean not null default true
);

create table if not exists public.operon_pricing_trim_options (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  type text not null,
  form_value text not null,
  material text,
  pricing_method text not null default 'allowance_per_m2',
  price numeric not null default 0,
  active boolean not null default true
);

create table if not exists public.operon_pricing_removal_rates (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  floor_type text not null,
  aliases jsonb not null default '[]'::jsonb,
  rate_per_m2 numeric not null default 0,
  disposal_fee numeric not null default 0,
  active boolean not null default true
);

create table if not exists public.operon_pricing_location_zones (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  zone_name text not null,
  suburbs jsonb not null default '[]'::jsonb,
  postcodes jsonb not null default '[]'::jsonb,
  distance_from_base_km numeric not null default 0,
  travel_fee numeric not null default 0,
  minimum_job_fee numeric not null default 0,
  surcharge_percent numeric not null default 0,
  fallback boolean not null default false,
  active boolean not null default true
);

create table if not exists public.operon_pricing_rules (
  rule_key text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  value_type text not null check (value_type in ('number', 'boolean', 'text', 'json')),
  value_numeric numeric,
  value_boolean boolean,
  value_text text,
  notes text
);

create table if not exists public.operon_pricing_stair_rates (
  id uuid primary key default gen_random_uuid(),
  range_id text not null,
  category text not null check (category in ('laminate', 'hybrid', 'engineered')),
  range_label text,
  stair_type text not null check (stair_type in (
    'straight_tread',
    'winder_tread',
    'landing_1m2',
    'landing_2m2',
    'one_side_open',
    'two_side_open'
  )),
  guide_width_mm numeric not null default 1200,
  plank_length_mm numeric,
  price_short numeric not null default 0,
  price_long numeric not null default 0,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (range_id, stair_type)
);

create table if not exists public.operon_quote_requests (
  id uuid primary key default gen_random_uuid(),
  quote_reference bigint not null default nextval('public.operon_quote_reference_seq'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text,
  phone text,
  email text,
  site_address text,
  suburb text,
  postcode text,
  property_type text,
  property_level text,
  has_lift text,
  parking_access text,
  quote_mode text,
  product_category text,
  product_name text,
  flooring_pattern text,
  measurement_method text,
  real_area numeric,
  chargeable_area numeric,
  room_count integer,
  subtotal_ex_gst numeric,
  gst numeric,
  total_inc_gst numeric,
  manual_review_required boolean not null default false,
  status text not null default 'new',
  source_page text not null default 'index.html',
  lead_stage text not null default 'cold',
  engagement_score integer not null default 0,
  last_activity timestamptz not null default now(),
  last_action text,
  followup_status text not null default 'pending',
  followup_paused boolean not null default false,
  last_followup_at timestamptz,
  next_followup_at timestamptz,
  consent_sms boolean not null default false,
  consent_email boolean not null default true,
  source text not null default 'website',
  close_score integer not null default 0,
  close_probability numeric(5,4) not null default 0,
  close_band text not null default 'very_low',
  close_reasons jsonb not null default '{}'::jsonb,
  next_action text,
  priority_rank integer,
  raw_payload jsonb not null default '{}'::jsonb,
  constraint operon_quote_requests_lead_stage_check check (lead_stage in ('cold', 'warm', 'hot', 'closing', 'unknown')),
  constraint operon_quote_requests_close_band_check check (close_band in ('high', 'medium', 'low', 'very_low'))
);

create table if not exists public.operon_quote_rooms (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.operon_quote_requests(id) on delete cascade,
  created_at timestamptz not null default now(),
  room_name text,
  length_m numeric,
  width_m numeric,
  area_m2 numeric,
  included boolean not null default true,
  source text,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.operon_quote_requests(id) on delete cascade,
  created_at timestamptz not null default now(),
  item_type text,
  label text,
  quantity numeric,
  unit text,
  unit_basis text,
  amount_ex_gst numeric,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_uploaded_files (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.operon_quote_requests(id) on delete cascade,
  created_at timestamptz not null default now(),
  file_name text,
  file_path text,
  file_type text,
  file_size_bytes bigint,
  storage_bucket text not null default 'quote-files',
  source text,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_quote_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  quote_id uuid references public.operon_quote_requests(id) on delete set null,
  event_name text not null,
  step_number integer,
  step_name text,
  page_url text,
  device_type text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_quote_funnel_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null unique,
  landing_page text,
  traffic_source text,
  device_type text,
  started_quote boolean not null default false,
  completed_quote boolean not null default false,
  last_step_completed integer,
  last_step_viewed integer,
  current_step_name text,
  quote_id uuid references public.operon_quote_requests(id) on delete set null,
  estimated_quote_value numeric,
  abandoned_at_step integer,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_quote_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text,
  phone text,
  email text,
  site_address text,
  suburb text,
  postcode text,
  selected_category text,
  real_area numeric,
  chargeable_area numeric,
  quote_total numeric,
  quote_payload jsonb not null default '{}'::jsonb,
  lead_stage text not null default 'unknown',
  engagement_score integer not null default 0,
  last_activity timestamptz not null default now(),
  last_action text,
  followup_status text not null default 'pending',
  followup_paused boolean not null default false,
  last_followup_at timestamptz,
  next_followup_at timestamptz,
  consent_sms boolean not null default false,
  consent_email boolean not null default true,
  source text not null default 'website',
  close_score integer not null default 0,
  close_probability numeric(5,4) not null default 0,
  close_band text not null default 'very_low',
  close_reasons jsonb not null default '{}'::jsonb,
  next_action text,
  priority_rank integer,
  constraint operon_quote_leads_lead_stage_check check (lead_stage in ('cold', 'warm', 'hot', 'closing', 'unknown')),
  constraint operon_quote_leads_close_band_check check (close_band in ('high', 'medium', 'low', 'very_low'))
);

create table if not exists public.operon_quote_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  review_mode text not null default 'quick' check (review_mode in ('quick', 'detailed')),
  customer_name text,
  phone text,
  email text,
  suburb text,
  postcode text,
  flooring_type text,
  area_m2 numeric,
  uploaded_quote_url text,
  quote_total numeric,
  quote_provider_name text,
  included_items jsonb not null default '[]'::jsonb,
  missing_items jsonb not null default '[]'::jsonb,
  risk_items jsonb not null default '[]'::jsonb,
  clarity_score numeric,
  risk_level text,
  confidence_level text,
  advisor_summary jsonb not null default '{}'::jsonb,
  next_step_taken text,
  converted_to_quote boolean not null default false,
  linked_quote_lead_id uuid references public.operon_quote_leads(id) on delete set null
);

create table if not exists public.operon_followup_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text unique not null,
  channel text not null check (channel in ('sms', 'email', 'manual_call')),
  lead_stage text not null default 'unknown' check (lead_stage in ('hot', 'warm', 'cold', 'closing', 'unknown', 'all')),
  timing_offset_hours numeric not null default 0,
  subject text,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.operon_followup_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_quote_leads(id) on delete cascade,
  quote_request_id uuid references public.operon_quote_requests(id) on delete cascade,
  channel text not null check (channel in ('sms', 'email', 'manual_call')),
  template_key text not null references public.operon_followup_templates(template_key) on update cascade on delete restrict,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped', 'cancelled')),
  payload jsonb not null default '{}'::jsonb,
  provider_response jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  constraint operon_followup_messages_reference_check check (lead_id is not null or quote_request_id is not null)
);

create table if not exists public.operon_close_automation_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  processed_count integer not null default 0,
  queued_count integer not null default 0,
  skipped_count integer not null default 0,
  dry_run boolean not null default true,
  notes jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_quote_pricing_outcomes (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid references public.operon_quote_requests(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  suburb text,
  postcode text,
  suburb_cluster text not null default 'sydney_general',
  flooring_type text not null default 'unknown',
  area_band text not null default 'unknown',
  stairs_flag boolean not null default false,
  extras_flags jsonb not null default '{}'::jsonb,
  quote_total numeric not null default 0,
  breakdown_totals jsonb not null default '{}'::jsonb,
  confidence_level text not null default 'low',
  close_status text not null default 'no_response',
  final_price numeric,
  close_time_hours numeric,
  lost_reason text,
  raw_payload jsonb not null default '{}'::jsonb,
  constraint operon_quote_pricing_outcomes_area_band_check check (area_band in ('unknown', 'small', 'medium', 'large', 'xlarge')),
  constraint operon_quote_pricing_outcomes_close_status_check check (close_status in ('won', 'lost', 'no_response')),
  constraint operon_quote_pricing_outcomes_confidence_check check (confidence_level in ('low', 'medium', 'high'))
);

create table if not exists public.operon_pricing_optimization_buckets (
  id uuid primary key default gen_random_uuid(),
  suburb_cluster text not null,
  flooring_type text not null,
  area_band text not null,
  stairs_flag boolean not null default false,
  sample_size integer not null default 0,
  won_count integer not null default 0,
  lost_count integer not null default 0,
  no_response_count integer not null default 0,
  win_rate numeric not null default 0,
  avg_price numeric not null default 0,
  median_price numeric not null default 0,
  p25 numeric not null default 0,
  p40 numeric not null default 0,
  p50 numeric not null default 0,
  p65 numeric not null default 0,
  p75 numeric not null default 0,
  avg_winning_price numeric not null default 0,
  median_winning_price numeric not null default 0,
  target_low numeric not null default 0,
  target_high numeric not null default 0,
  target_price numeric not null default 0,
  confidence_level text not null default 'low',
  updated_at timestamptz not null default now(),
  unique (suburb_cluster, flooring_type, area_band, stairs_flag)
);

create index if not exists operon_quote_requests_status_idx on public.operon_quote_requests(status, created_at desc);
create unique index if not exists operon_quote_requests_reference_idx on public.operon_quote_requests(quote_reference);
create index if not exists operon_quote_requests_close_priority_idx on public.operon_quote_requests(close_band, priority_rank, close_score desc, last_activity desc);
create index if not exists operon_quote_rooms_quote_id_idx on public.operon_quote_rooms(quote_id);
create index if not exists operon_quote_items_quote_id_idx on public.operon_quote_items(quote_id);
create index if not exists operon_quote_events_quote_name_idx on public.operon_quote_events(quote_id, event_name, created_at desc);
create index if not exists operon_quote_events_session_idx on public.operon_quote_events(session_id, created_at desc);
create index if not exists operon_quote_reviews_created_idx on public.operon_quote_reviews(created_at desc);
create index if not exists operon_followup_messages_due_idx on public.operon_followup_messages(status, scheduled_for) where status = 'queued';
create index if not exists operon_quote_pricing_outcomes_bucket_idx on public.operon_quote_pricing_outcomes(suburb_cluster, flooring_type, area_band, stairs_flag);
create unique index if not exists operon_quote_pricing_outcomes_quote_unique_idx on public.operon_quote_pricing_outcomes(quote_request_id) where quote_request_id is not null;
create index if not exists operon_pricing_optimization_buckets_lookup_idx on public.operon_pricing_optimization_buckets(suburb_cluster, flooring_type, area_band, stairs_flag);

drop trigger if exists operon_pricing_categories_updated_at on public.operon_pricing_categories;
create trigger operon_pricing_categories_updated_at before update on public.operon_pricing_categories for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_products_updated_at on public.operon_pricing_products;
create trigger operon_pricing_products_updated_at before update on public.operon_pricing_products for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_install_rates_updated_at on public.operon_pricing_install_rates;
create trigger operon_pricing_install_rates_updated_at before update on public.operon_pricing_install_rates for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_underlay_options_updated_at on public.operon_pricing_underlay_options;
create trigger operon_pricing_underlay_options_updated_at before update on public.operon_pricing_underlay_options for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_trim_options_updated_at on public.operon_pricing_trim_options;
create trigger operon_pricing_trim_options_updated_at before update on public.operon_pricing_trim_options for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_removal_rates_updated_at on public.operon_pricing_removal_rates;
create trigger operon_pricing_removal_rates_updated_at before update on public.operon_pricing_removal_rates for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_location_zones_updated_at on public.operon_pricing_location_zones;
create trigger operon_pricing_location_zones_updated_at before update on public.operon_pricing_location_zones for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_rules_updated_at on public.operon_pricing_rules;
create trigger operon_pricing_rules_updated_at before update on public.operon_pricing_rules for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_pricing_stair_rates_updated_at on public.operon_pricing_stair_rates;
create trigger operon_pricing_stair_rates_updated_at before update on public.operon_pricing_stair_rates for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_quote_requests_updated_at on public.operon_quote_requests;
create trigger operon_quote_requests_updated_at before update on public.operon_quote_requests for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_quote_leads_updated_at on public.operon_quote_leads;
create trigger operon_quote_leads_updated_at before update on public.operon_quote_leads for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_quote_reviews_updated_at on public.operon_quote_reviews;
create trigger operon_quote_reviews_updated_at before update on public.operon_quote_reviews for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_followup_templates_updated_at on public.operon_followup_templates;
create trigger operon_followup_templates_updated_at before update on public.operon_followup_templates for each row execute function public.operon_set_updated_at();
drop trigger if exists operon_quote_pricing_outcomes_updated_at on public.operon_quote_pricing_outcomes;
create trigger operon_quote_pricing_outcomes_updated_at before update on public.operon_quote_pricing_outcomes for each row execute function public.operon_set_updated_at();

alter table public.operon_pricing_categories enable row level security;
alter table public.operon_pricing_products enable row level security;
alter table public.operon_pricing_install_rates enable row level security;
alter table public.operon_pricing_underlay_options enable row level security;
alter table public.operon_pricing_trim_options enable row level security;
alter table public.operon_pricing_removal_rates enable row level security;
alter table public.operon_pricing_location_zones enable row level security;
alter table public.operon_pricing_rules enable row level security;
alter table public.operon_pricing_stair_rates enable row level security;
alter table public.operon_quote_requests enable row level security;
alter table public.operon_quote_rooms enable row level security;
alter table public.operon_quote_items enable row level security;
alter table public.operon_uploaded_files enable row level security;
alter table public.operon_quote_events enable row level security;
alter table public.operon_quote_funnel_sessions enable row level security;
alter table public.operon_quote_leads enable row level security;
alter table public.operon_quote_reviews enable row level security;
alter table public.operon_followup_templates enable row level security;
alter table public.operon_followup_messages enable row level security;
alter table public.operon_close_automation_runs enable row level security;
alter table public.operon_quote_pricing_outcomes enable row level security;
alter table public.operon_pricing_optimization_buckets enable row level security;

grant usage on schema public to anon, authenticated;

grant insert on table public.operon_quote_requests to anon, authenticated;
grant insert on table public.operon_quote_rooms to anon, authenticated;
grant insert on table public.operon_quote_items to anon, authenticated;
grant insert on table public.operon_uploaded_files to anon, authenticated;
grant insert on table public.operon_quote_events to anon, authenticated;
grant insert, update on table public.operon_quote_funnel_sessions to anon, authenticated;

drop policy if exists "operon_quote_requests_public_insert" on public.operon_quote_requests;
create policy "operon_quote_requests_public_insert" on public.operon_quote_requests for insert to public with check (true);
drop policy if exists "operon_quote_rooms_public_insert" on public.operon_quote_rooms;
create policy "operon_quote_rooms_public_insert" on public.operon_quote_rooms for insert to public with check (true);
drop policy if exists "operon_quote_items_public_insert" on public.operon_quote_items;
create policy "operon_quote_items_public_insert" on public.operon_quote_items for insert to public with check (true);
drop policy if exists "operon_uploaded_files_public_insert" on public.operon_uploaded_files;
create policy "operon_uploaded_files_public_insert" on public.operon_uploaded_files for insert to public with check (true);
drop policy if exists "operon_quote_events_public_insert" on public.operon_quote_events;
create policy "operon_quote_events_public_insert" on public.operon_quote_events for insert to public with check (true);
drop policy if exists "operon_quote_funnel_sessions_public_insert" on public.operon_quote_funnel_sessions;
create policy "operon_quote_funnel_sessions_public_insert" on public.operon_quote_funnel_sessions for insert to public with check (true);
drop policy if exists "operon_quote_funnel_sessions_public_update" on public.operon_quote_funnel_sessions;
create policy "operon_quote_funnel_sessions_public_update" on public.operon_quote_funnel_sessions for update to public using (true) with check (true);

revoke all on table public.operon_pricing_install_rates from anon, authenticated;
revoke all on table public.operon_pricing_underlay_options from anon, authenticated;
revoke all on table public.operon_pricing_trim_options from anon, authenticated;
revoke all on table public.operon_pricing_removal_rates from anon, authenticated;
revoke all on table public.operon_pricing_location_zones from anon, authenticated;
revoke all on table public.operon_pricing_rules from anon, authenticated;
revoke all on table public.operon_pricing_stair_rates from anon, authenticated;
revoke all on table public.operon_quote_reviews from anon, authenticated;
revoke all on table public.operon_followup_templates from anon, authenticated;
revoke all on table public.operon_followup_messages from anon, authenticated;
revoke all on table public.operon_close_automation_runs from anon, authenticated;
revoke all on table public.operon_quote_pricing_outcomes from anon, authenticated;
revoke all on table public.operon_pricing_optimization_buckets from anon, authenticated;

insert into public.operon_pricing_categories (id, label, short_description, default_price_per_m2, page_url, active)
values
  ('laminate', 'Laminate Flooring', 'Cost-conscious flooring with straightforward installation.', 0, 'laminate-flooring-sydney.html', true),
  ('hybrid', 'Hybrid Flooring', 'Practical SPC hybrid flooring for apartments, houses, and busy family homes.', 0, 'hybrid-flooring-sydney.html', true),
  ('engineered', 'Engineered Timber', 'Premium timber look with a stronger material allowance.', 0, 'engineered-timber-flooring-sydney.html', true)
on conflict (id) do update set
  label = excluded.label,
  short_description = excluded.short_description,
  page_url = excluded.page_url,
  active = excluded.active,
  updated_at = now();

insert into public.operon_followup_templates (
  template_key,
  channel,
  lead_stage,
  timing_offset_hours,
  subject,
  body,
  active
) values
  (
    'manual_quote_review',
    'manual_call',
    'all',
    0,
    null,
    'Review the submitted quote request. Confirm product, measured area, preparation, removal/disposal, trims, stairs, access and the best next step before contacting the customer.',
    true
  ),
  (
    'immediate_email_received',
    'email',
    'all',
    0,
    'Your flooring estimate - next steps',
    'Hi {{name}},

Thanks for sending your flooring estimate through Operon Flooring.

We will review the product, measured area and scope details before final confirmation. If anything needs clarification, we will contact you before work is booked.

Regards,
Operon Flooring',
    true
  ),
  (
    'day1_sms_checkin',
    'sms',
    'hot',
    24,
    null,
    'Hi {{name}}, just checking if you had any questions about your Operon flooring estimate. We can confirm scope before you make a decision.',
    true
  ),
  (
    'day3_email_guidance',
    'email',
    'warm',
    72,
    'Flooring quote clarity',
    'Hi {{name}},

A quick follow-up on your flooring estimate.

The main items worth checking before booking are product range, measured area, floor preparation, removal/disposal, trims and access. These are the details that usually affect final scope.

If you would like us to review anything, reply to this email and we can help clarify the next step.

Regards,
Operon Flooring',
    true
  ),
  (
    'day7_sms_soft_reminder',
    'sms',
    'all',
    168,
    null,
    'Hi {{name}}, if your flooring project is still moving ahead, we can help confirm scope and next steps from your Operon estimate.',
    true
  ),
  (
    'day14_email_planning',
    'email',
    'cold',
    336,
    'Planning your flooring project',
    'Hi {{name}},

Just checking in while you are planning your flooring project.

When you are ready, the next useful step is to confirm area, product direction and any site details such as access, preparation or removal.

Regards,
Operon Flooring',
    true
  )
on conflict (template_key) do update set
  channel = excluded.channel,
  lead_stage = excluded.lead_stage,
  timing_offset_hours = excluded.timing_offset_hours,
  subject = excluded.subject,
  body = excluded.body,
  active = excluded.active,
  updated_at = now();

comment on table public.operon_pricing_categories is 'Clean v2 pricing category table. Private pricing is read server-side.';
comment on table public.operon_pricing_products is 'Clean v2 product/range source used by Netlify pricing functions when OPERON_SUPABASE_SCHEMA_MODE=v2.';
comment on table public.operon_quote_requests is 'Clean v2 website quote requests with close scoring and follow-up fields.';
comment on table public.operon_quote_reviews is 'Clean v2 quote review intelligence. Scope clarity only; no internal rates.';
comment on table public.operon_pricing_optimization_buckets is 'Clean v2 aggregated pricing optimisation buckets. Service-role only.';
