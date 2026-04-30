create extension if not exists pgcrypto;

create table if not exists pricing_categories (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  label text not null,
  short_description text,
  default_price_per_m2 numeric default 0,
  page_url text,
  active boolean not null default true
);

create table if not exists pricing_products (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  category_id text not null references pricing_categories(id) on delete restrict,
  brand text not null,
  range_name text not null,
  colour text not null,
  tone text,
  swatch text,
  thickness text,
  product_type text,
  price_per_m2 numeric default 0,
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

create table if not exists pricing_install_rates (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  category_id text not null references pricing_categories(id) on delete restrict,
  install_type text not null,
  install_method text not null default 'floating',
  job_type text not null,
  rate_per_m2 numeric not null default 0,
  minimum_charge numeric not null default 0,
  active boolean not null default true
);

create table if not exists pricing_underlay_options (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  suitable_categories jsonb not null default '[]'::jsonb,
  price_per_m2 numeric not null default 0,
  active boolean not null default true
);

create table if not exists pricing_trim_options (
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

create table if not exists pricing_removal_rates (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  floor_type text not null,
  aliases jsonb not null default '[]'::jsonb,
  rate_per_m2 numeric not null default 0,
  disposal_fee numeric not null default 0,
  active boolean not null default true
);

create table if not exists pricing_location_zones (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  zone_name text not null,
  suburbs jsonb not null default '[]'::jsonb,
  postcodes jsonb not null default '[]'::jsonb,
  distance_from_base_km numeric default 0,
  travel_fee numeric not null default 0,
  minimum_job_fee numeric not null default 0,
  surcharge_percent numeric not null default 0,
  fallback boolean not null default false,
  active boolean not null default true
);

create table if not exists pricing_rules (
  rule_key text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  value_type text not null,
  value_numeric numeric,
  value_boolean boolean,
  value_text text,
  notes text
);

create or replace function set_pricing_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_pricing_categories_updated_at on pricing_categories;
create trigger set_pricing_categories_updated_at
before update on pricing_categories
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_products_updated_at on pricing_products;
create trigger set_pricing_products_updated_at
before update on pricing_products
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_install_rates_updated_at on pricing_install_rates;
create trigger set_pricing_install_rates_updated_at
before update on pricing_install_rates
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_underlay_options_updated_at on pricing_underlay_options;
create trigger set_pricing_underlay_options_updated_at
before update on pricing_underlay_options
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_trim_options_updated_at on pricing_trim_options;
create trigger set_pricing_trim_options_updated_at
before update on pricing_trim_options
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_removal_rates_updated_at on pricing_removal_rates;
create trigger set_pricing_removal_rates_updated_at
before update on pricing_removal_rates
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_location_zones_updated_at on pricing_location_zones;
create trigger set_pricing_location_zones_updated_at
before update on pricing_location_zones
for each row
execute function set_pricing_updated_at();

drop trigger if exists set_pricing_rules_updated_at on pricing_rules;
create trigger set_pricing_rules_updated_at
before update on pricing_rules
for each row
execute function set_pricing_updated_at();

alter table pricing_categories enable row level security;
alter table pricing_products enable row level security;
alter table pricing_install_rates enable row level security;
alter table pricing_underlay_options enable row level security;
alter table pricing_trim_options enable row level security;
alter table pricing_removal_rates enable row level security;
alter table pricing_location_zones enable row level security;
alter table pricing_rules enable row level security;

grant usage on schema public to anon, authenticated;

-- Privacy guardrail:
-- No anonymous or broad authenticated read policies are created here.
-- Until an admin auth layer exists, pricing should be treated as service-role-only data.
-- This keeps sell prices, install rates, and suburb pricing private.

insert into pricing_categories (id, label, short_description, default_price_per_m2, page_url, active)
values
  ('laminate', 'Laminate Flooring', 'Cost-conscious flooring with straightforward installation.', 38, 'laminate-flooring-sydney.html', true),
  ('hybrid', 'Hybrid Flooring', 'Practical SPC hybrid flooring for apartments, houses, and busy family homes.', 52, 'hybrid-flooring-sydney.html', true),
  ('engineered', 'Engineered Timber', 'Premium timber look with a stronger material allowance.', 88, 'engineered-timber-flooring-sydney.html', true)
on conflict (id) do update set
  label = excluded.label,
  short_description = excluded.short_description,
  default_price_per_m2 = excluded.default_price_per_m2,
  page_url = excluded.page_url,
  active = excluded.active;

insert into pricing_products (
  id, category_id, brand, range_name, colour, tone, swatch, thickness, product_type,
  price_per_m2, install_rate_override, image_url, alt_text, description, features,
  suitable_for, supplier, supplier_url, active, sort_order
)
values
  ('hrt-etf-7mm-hybrid-antique-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Antique Oak', 'natural oak', '#b99572', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-antique-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Antique Oak colour sample', 'Antique Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 10),
  ('hrt-etf-7mm-hybrid-baden-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Baden Oak', 'light oak', '#cab08f', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-baden-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Baden Oak colour sample', 'Baden Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 20),
  ('hrt-etf-7mm-hybrid-blackbutt', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Blackbutt', 'light oak', '#d0b289', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-blackbutt.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Blackbutt colour sample', 'Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 30),
  ('hrt-etf-7mm-hybrid-brushbox', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Brushbox', 'walnut', '#9e7756', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-brushbox.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Brushbox colour sample', 'Brushbox is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 40),
  ('hrt-etf-7mm-hybrid-caramel-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Caramel Oak', 'natural oak', '#b6865a', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-caramel-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Caramel Oak colour sample', 'Caramel Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 50),
  ('hrt-etf-7mm-hybrid-dexter-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Dexter Oak', 'grey', '#a7a29a', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-dexter-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Dexter Oak colour sample', 'Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 60),
  ('hrt-etf-7mm-hybrid-downtown-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Downtown Oak', 'grey', '#8c837b', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-downtown-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Downtown Oak colour sample', 'Downtown Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 70),
  ('hrt-etf-7mm-hybrid-driftwood', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Driftwood', 'grey', '#b0a599', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-driftwood.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Driftwood colour sample', 'Driftwood is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 80),
  ('hrt-etf-7mm-hybrid-grey-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Grey Oak', 'grey', '#929290', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-grey-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Grey Oak colour sample', 'Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 90),
  ('hrt-etf-7mm-hybrid-hatton-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Hatton Oak', 'natural oak', '#b2906e', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-hatton-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Hatton Oak colour sample', 'Hatton Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 100),
  ('hrt-etf-7mm-hybrid-helena-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Helena Oak', 'light oak', '#d4bc99', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-helena-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Helena Oak colour sample', 'Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 110),
  ('hrt-etf-7mm-hybrid-holly-hills', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Holly Hills', 'natural oak', '#c1a583', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-holly-hills.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Holly Hills colour sample', 'Holly Hills is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 120),
  ('hrt-etf-7mm-hybrid-jarrah', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Jarrah', 'dark', '#744d39', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-jarrah.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Jarrah colour sample', 'Jarrah is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 130),
  ('hrt-etf-7mm-hybrid-julan', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Julan', 'walnut', '#8d6549', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-julan.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Julan colour sample', 'Julan is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 140),
  ('hrt-etf-7mm-hybrid-lake-oak-light', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Lake Oak Light', 'light oak', '#d7c4a7', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-lake-oak-light.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Lake Oak Light colour sample', 'Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 150)
on conflict (id) do update set
  category_id = excluded.category_id,
  brand = excluded.brand,
  range_name = excluded.range_name,
  colour = excluded.colour,
  tone = excluded.tone,
  swatch = excluded.swatch,
  thickness = excluded.thickness,
  product_type = excluded.product_type,
  price_per_m2 = excluded.price_per_m2,
  install_rate_override = excluded.install_rate_override,
  image_url = excluded.image_url,
  alt_text = excluded.alt_text,
  description = excluded.description,
  features = excluded.features,
  suitable_for = excluded.suitable_for,
  supplier = excluded.supplier,
  supplier_url = excluded.supplier_url,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into pricing_install_rates (id, category_id, install_type, install_method, job_type, rate_per_m2, minimum_charge, active)
values
  ('laminate-standard-supply-install', 'laminate', 'standard', 'floating', 'supply_install', 27, 1500, true),
  ('laminate-standard-install-only', 'laminate', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('hybrid-standard-supply-install', 'hybrid', 'standard', 'floating', 'supply_install', 31, 1500, true),
  ('hybrid-standard-install-only', 'hybrid', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('engineered-standard-supply-install', 'engineered', 'standard', 'floating', 'supply_install', 39, 1500, true),
  ('engineered-standard-install-only', 'engineered', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('engineered-standard-direct-glue-supply-install', 'engineered', 'standard', 'direct_glue', 'supply_install', 39, 1500, true),
  ('engineered-standard-direct-glue-install-only', 'engineered', 'standard', 'direct_glue', 'install_only', 45, 1500, true),
  ('engineered-herringbone-supply-install', 'engineered', 'herringbone', 'direct_glue', 'supply_install', 52, 1800, true),
  ('engineered-herringbone-install-only', 'engineered', 'herringbone', 'direct_glue', 'install_only', 64, 1800, true)
on conflict (id) do update set
  category_id = excluded.category_id,
  install_type = excluded.install_type,
  install_method = excluded.install_method,
  job_type = excluded.job_type,
  rate_per_m2 = excluded.rate_per_m2,
  minimum_charge = excluded.minimum_charge,
  active = excluded.active;

insert into pricing_underlay_options (id, name, suitable_categories, price_per_m2, active)
values
  ('acoustic-underlay-standard', 'Standard Acoustic Underlay', '["laminate","engineered"]'::jsonb, 4, true),
  ('acoustic-underlay-premium', 'Premium Acoustic Underlay', '["laminate","engineered"]'::jsonb, 6, true),
  ('hybrid-additional-acoustic-layer', 'Additional Acoustic Layer', '["hybrid"]'::jsonb, 5, false)
on conflict (id) do update set
  name = excluded.name,
  suitable_categories = excluded.suitable_categories,
  price_per_m2 = excluded.price_per_m2,
  active = excluded.active;

insert into pricing_trim_options (id, type, form_value, material, pricing_method, price, active)
values
  ('skirting-supply-install', 'skirting', 'supply_install', 'MDF skirting', 'allowance_per_m2', 12, true),
  ('skirting-remove-refit', 'remove_existing', 'remove_refit', 'Existing skirting remove / refit', 'allowance_per_m2', 12, true),
  ('scotia-standard', 'scotia', 'yes', 'Matching scotia', 'allowance_per_m2', 8, true)
on conflict (id) do update set
  type = excluded.type,
  form_value = excluded.form_value,
  material = excluded.material,
  pricing_method = excluded.pricing_method,
  price = excluded.price,
  active = excluded.active;

insert into pricing_removal_rates (id, floor_type, aliases, rate_per_m2, disposal_fee, active)
values
  ('remove-carpet', 'carpet', '["carpet"]'::jsonb, 10, 0, true),
  ('remove-floating', 'laminate', '["floating","laminate","hybrid"]'::jsonb, 10, 0, true),
  ('remove-glue-down', 'timber', '["glue_down","timber"]'::jsonb, 10, 0, true),
  ('remove-tile', 'tile', '["tile"]'::jsonb, 10, 0, true),
  ('remove-vinyl', 'vinyl', '["vinyl"]'::jsonb, 10, 0, true),
  ('remove-unknown', 'unknown', '["unknown","other","unsure"]'::jsonb, 0, 0, true)
on conflict (id) do update set
  floor_type = excluded.floor_type,
  aliases = excluded.aliases,
  rate_per_m2 = excluded.rate_per_m2,
  disposal_fee = excluded.disposal_fee,
  active = excluded.active;

insert into pricing_location_zones (id, zone_name, suburbs, postcodes, distance_from_base_km, travel_fee, minimum_job_fee, surcharge_percent, fallback, active)
values
  ('auburn-service-zone', 'Auburn Service Zone', '["Auburn","Lidcombe","Berala"]'::jsonb, '["2144","2141","2140"]'::jsonb, 12, 0, 1500, 0, false, true),
  ('parramatta-service-zone', 'Parramatta Service Zone', '["Parramatta","Westmead","Granville"]'::jsonb, '["2150","2145","2142"]'::jsonb, 18, 0, 1500, 0, false, true),
  ('liverpool-service-zone', 'Liverpool Service Zone', '["Liverpool","Casula","Moorebank"]'::jsonb, '["2170","2176","2171"]'::jsonb, 28, 35, 1500, 4, false, true),
  ('blacktown-service-zone', 'Blacktown Service Zone', '["Blacktown","Seven Hills","Kings Park"]'::jsonb, '["2148","2147"]'::jsonb, 33, 55, 1500, 7, false, true),
  ('miranda-service-zone', 'Miranda Service Zone', '["Miranda","Gymea","Caringbah"]'::jsonb, '["2228","2227","2229"]'::jsonb, 34, 70, 1500, 10, false, true),
  ('default-sydney-zone', 'Default Sydney Zone', '[]'::jsonb, '[]'::jsonb, 25, 25, 1500, 4, true, true)
on conflict (id) do update set
  zone_name = excluded.zone_name,
  suburbs = excluded.suburbs,
  postcodes = excluded.postcodes,
  distance_from_base_km = excluded.distance_from_base_km,
  travel_fee = excluded.travel_fee,
  minimum_job_fee = excluded.minimum_job_fee,
  surcharge_percent = excluded.surcharge_percent,
  fallback = excluded.fallback,
  active = excluded.active;

insert into pricing_rules (rule_key, value_type, value_numeric, value_boolean, value_text, notes)
values
  ('standardWastagePercent', 'number', 10, null, null, 'Default wastage percent for standard board layouts.'),
  ('herringboneWastagePercent', 'number', 20, null, null, 'Default wastage percent for herringbone and chevron layouts.'),
  ('materialAreaBasis', 'text', null, null, 'chargeable_area', 'Material uses chargeable area.'),
  ('labourAreaBasis', 'text', null, null, 'real_area', 'Labour uses real area.'),
  ('underlayAreaBasis', 'text', null, null, 'chargeable_area', 'Underlay currently uses chargeable area.'),
  ('moistureBarrierAreaBasis', 'text', null, null, 'chargeable_area', 'Moisture barrier uses chargeable area.'),
  ('skirtingAreaBasis', 'text', null, null, 'chargeable_area_allowance', 'Skirting and scotia use area allowance, not perimeter.'),
  ('exposeInternalRates', 'boolean', null, false, null, 'Customer output must not expose internal rates.'),
  ('moistureBarrierRatePerM2', 'number', 5, null, null, 'Default moisture barrier charge per chargeable square metre.'),
  ('furnitureRatePerRoom', 'number', 50, null, null, 'Default furniture handling charge per room.'),
  ('doorTrimmingRate', 'number', 40, null, null, 'Default door trimming charge per door.'),
  ('smallJobThresholdM2', 'number', 30, null, null, 'Threshold where small-job factor begins.'),
  ('smallJobFactor', 'number', 1.10, null, null, 'Labour-heavy subtotal adjustment for small jobs.'),
  ('minimumJobFee', 'number', 1500, null, null, 'Default minimum project charge ex GST.'),
  ('roundingIncrement', 'number', 50, null, null, 'Rounding increment for subtotal ex GST.')
on conflict (rule_key) do update set
  value_type = excluded.value_type,
  value_numeric = excluded.value_numeric,
  value_boolean = excluded.value_boolean,
  value_text = excluded.value_text,
  notes = excluded.notes;

-- Pricing privacy notes:
-- 1. These tables are intended for private operational pricing, not public browser reads.
-- 2. Use the Supabase Table Editor or a protected admin layer to update prices.
-- 3. The current frontend can keep using local fallback data until a server-side quote path is connected.
-- 4. Do not add anonymous select policies to these tables if sell-rate privacy matters.
