-- Operon Flooring canonical pricing, product-selection, and lead schema.
-- Safe to run after the existing schema.sql / analytics_schema.sql / pricing_schema.sql files.
--
-- Guardrails:
-- - This migration is additive and non-destructive.
-- - Existing pricing_* tables are left in place for current Netlify functions.
-- - New canonical tables use stable text keys plus uuid row ids for future admin editing.
-- - Public anonymous clients should not read private pricing tables directly.
-- - Frontend local JS files remain the safe fallback until Netlify functions explicitly switch data sources.

create extension if not exists pgcrypto;

create or replace function public.operon_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.product_ranges (
  id uuid primary key default gen_random_uuid(),
  range_id text unique not null,
  category text not null check (category in ('laminate', 'hybrid', 'engineered')),
  brand text,
  range_label text not null,
  selection_mode text not null check (selection_mode in ('range_only', 'range_then_colour')),
  default_product_id text,
  is_default_recommendation boolean not null default false,
  customer_description text,
  features jsonb not null default '[]'::jsonb,
  image_url text,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_id text unique not null,
  range_id text references public.product_ranges(range_id) on update cascade on delete restrict,
  category text not null check (category in ('laminate', 'hybrid', 'engineered')),
  brand text,
  range_label text,
  colour text,
  thickness text,
  price_per_m2 numeric,
  image_url text,
  alt_text text,
  features jsonb not null default '[]'::jsonb,
  selection_mode text check (selection_mode in ('range_only', 'range_then_colour')),
  is_default_recommendation boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.install_rates (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('laminate', 'hybrid', 'engineered')),
  install_type text not null,
  install_method text not null default 'floating',
  job_type text not null default 'supply_install',
  rate_per_m2 numeric not null,
  minimum_charge numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, install_type, install_method, job_type)
);

create table if not exists public.underlay_options (
  id uuid primary key default gen_random_uuid(),
  underlay_id text unique not null,
  name text not null,
  suitable_categories text[] not null default '{}',
  price_per_m2 numeric not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skirting_scotia_options (
  id uuid primary key default gen_random_uuid(),
  option_id text unique not null,
  type text not null check (type in ('skirting', 'scotia', 'remove_existing')),
  form_value text,
  material text,
  pricing_method text not null check (pricing_method in ('allowance_per_m2', 'per_lm', 'fixed')),
  price numeric not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.removal_rates (
  id uuid primary key default gen_random_uuid(),
  removal_id text unique not null,
  floor_type text not null,
  aliases text[] not null default '{}',
  rate_per_m2 numeric not null,
  disposal_fee numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.location_zones (
  id uuid primary key default gen_random_uuid(),
  zone_id text unique not null,
  zone_name text not null,
  suburbs text[] not null default '{}',
  postcodes text[] not null default '{}',
  distance_from_base_km numeric,
  travel_fee numeric not null default 0,
  minimum_job_fee numeric not null default 0,
  surcharge_percent numeric not null default 0,
  fallback boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Existing projects may already have pricing_rules from pricing_schema.sql with a legacy shape.
-- Add the new canonical columns without dropping the legacy value_* columns.
create table if not exists public.pricing_rules (
  rule_key text unique not null,
  rule_value jsonb,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricing_rules add column if not exists id uuid default gen_random_uuid();
alter table public.pricing_rules add column if not exists rule_value jsonb;
alter table public.pricing_rules add column if not exists description text;
alter table public.pricing_rules add column if not exists active boolean not null default true;
alter table public.pricing_rules add column if not exists created_at timestamptz not null default now();
alter table public.pricing_rules add column if not exists updated_at timestamptz not null default now();
alter table public.pricing_rules add column if not exists value_type text;
alter table public.pricing_rules add column if not exists value_numeric numeric;
alter table public.pricing_rules add column if not exists value_boolean boolean;
alter table public.pricing_rules add column if not exists value_text text;
alter table public.pricing_rules add column if not exists notes text;
create unique index if not exists pricing_rules_id_unique on public.pricing_rules(id);

create table if not exists public.quote_leads (
  id uuid primary key default gen_random_uuid(),
  lead_status text not null default 'new',
  customer_name text,
  phone text,
  email text,
  site_address text,
  suburb text,
  postcode text,
  quote_mode text,
  property_type text,
  selected_category text,
  selected_range_id text,
  selected_product_id text,
  selected_colour text,
  product_selection_mode text,
  measurement_method text,
  real_area numeric,
  chargeable_area numeric,
  quote_total numeric,
  quote_payload jsonb,
  customer_notes text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Existing schema.sql already creates quote_items with quote_id. Keep it and add the future quote_leads columns.
create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_lead_id uuid references public.quote_leads(id) on delete cascade,
  item_type text,
  item_label text,
  quantity numeric,
  unit_label text,
  customer_visible_total numeric,
  internal_payload jsonb,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.quote_items add column if not exists quote_lead_id uuid references public.quote_leads(id) on delete cascade;
alter table public.quote_items add column if not exists item_label text;
alter table public.quote_items add column if not exists unit_label text;
alter table public.quote_items add column if not exists customer_visible_total numeric;
alter table public.quote_items add column if not exists internal_payload jsonb;
alter table public.quote_items add column if not exists display_order integer not null default 0;
-- Existing schema.sql used quote_items.quote_id for quote_requests. Future lead storage can use
-- quote_lead_id instead, so quote_id must be nullable for the new path.
alter table public.quote_items add column if not exists quote_id uuid;
alter table public.quote_items alter column quote_id drop not null;

drop trigger if exists product_ranges_set_updated_at on public.product_ranges;
create trigger product_ranges_set_updated_at
before update on public.product_ranges
for each row execute function public.operon_set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.operon_set_updated_at();

drop trigger if exists install_rates_set_updated_at on public.install_rates;
create trigger install_rates_set_updated_at
before update on public.install_rates
for each row execute function public.operon_set_updated_at();

drop trigger if exists underlay_options_set_updated_at on public.underlay_options;
create trigger underlay_options_set_updated_at
before update on public.underlay_options
for each row execute function public.operon_set_updated_at();

drop trigger if exists skirting_scotia_options_set_updated_at on public.skirting_scotia_options;
create trigger skirting_scotia_options_set_updated_at
before update on public.skirting_scotia_options
for each row execute function public.operon_set_updated_at();

drop trigger if exists removal_rates_set_updated_at on public.removal_rates;
create trigger removal_rates_set_updated_at
before update on public.removal_rates
for each row execute function public.operon_set_updated_at();

drop trigger if exists location_zones_set_updated_at on public.location_zones;
create trigger location_zones_set_updated_at
before update on public.location_zones
for each row execute function public.operon_set_updated_at();

drop trigger if exists pricing_rules_set_updated_at on public.pricing_rules;
create trigger pricing_rules_set_updated_at
before update on public.pricing_rules
for each row execute function public.operon_set_updated_at();

drop trigger if exists quote_leads_set_updated_at on public.quote_leads;
create trigger quote_leads_set_updated_at
before update on public.quote_leads
for each row execute function public.operon_set_updated_at();

alter table public.product_ranges enable row level security;
alter table public.products enable row level security;
alter table public.install_rates enable row level security;
alter table public.underlay_options enable row level security;
alter table public.skirting_scotia_options enable row level security;
alter table public.removal_rates enable row level security;
alter table public.location_zones enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.quote_leads enable row level security;
alter table public.quote_items enable row level security;

grant usage on schema public to anon, authenticated;

-- Explicit privacy posture:
-- No anon SELECT policies are created for pricing/product tables in this migration.
-- No anon INSERT policy is created for quote_leads; future lead writes should go through a Netlify function.
-- Service role credentials must stay server-side in Netlify environment variables only.
revoke all on table public.product_ranges from anon;
revoke all on table public.products from anon;
revoke all on table public.install_rates from anon;
revoke all on table public.underlay_options from anon;
revoke all on table public.skirting_scotia_options from anon;
revoke all on table public.removal_rates from anon;
revoke all on table public.location_zones from anon;
revoke all on table public.pricing_rules from anon;
revoke all on table public.quote_leads from anon;

comment on table public.product_ranges is 'Future editable product range catalogue. Hybrid/laminate select ranges; engineered can select range then colour.';
comment on table public.products is 'Actual colour/SKU rows. Access through Netlify functions only until a public-safe catalogue endpoint is intentionally exposed.';
comment on table public.install_rates is 'Private labour rates. Do not expose directly to anonymous browser clients.';
comment on table public.underlay_options is 'Private accessory pricing source for future admin editing.';
comment on table public.skirting_scotia_options is 'Private trim pricing source. Current instant quote logic uses allowance_per_m2 against chargeable area.';
comment on table public.removal_rates is 'Private removal and disposal pricing source.';
comment on column public.removal_rates.rate_per_m2 is 'Removal labour per m².';
comment on column public.removal_rates.disposal_fee is 'Treated as per-m² disposal rate in current quote logic. Future migration should rename to disposal_rate_per_m2 for clarity.';
comment on table public.location_zones is 'Private travel/minimum/surcharge configuration by suburb zone.';
comment on table public.pricing_rules is 'Private quote rule settings. rule_value is canonical JSON; legacy value_* columns may exist for older functions.';
comment on table public.quote_leads is 'Future quote lead persistence target. Insert through a server-side Netlify function, not browser service-role access.';
comment on column public.quote_items.internal_payload is 'Internal diagnostic payload. Never expose this field through public APIs.';
