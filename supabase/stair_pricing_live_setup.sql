-- Operon Flooring live stair pricing setup.
-- Run this full file in Supabase SQL Editor.
--
-- Why this exists:
-- - The quote calculator already supports stair pricing.
-- - Netlify private pricing reads `public.pricing_stair_rates`.
-- - The admin/editing table is `public.stair_rates`.
-- - Live Supabase currently returns 404 for both tables, so they must be created.
--
-- Privacy:
-- - No anonymous select policy is created.
-- - These are private pricing tables for server-side reads only.

create extension if not exists pgcrypto;

create or replace function public.operon_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.stair_rates (
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

create table if not exists public.pricing_stair_rates (
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

drop trigger if exists stair_rates_set_updated_at on public.stair_rates;
create trigger stair_rates_set_updated_at
before update on public.stair_rates
for each row execute function public.operon_set_updated_at();

drop trigger if exists pricing_stair_rates_set_updated_at on public.pricing_stair_rates;
create trigger pricing_stair_rates_set_updated_at
before update on public.pricing_stair_rates
for each row execute function public.operon_set_updated_at();

alter table public.stair_rates enable row level security;
alter table public.pricing_stair_rates enable row level security;

grant all on public.stair_rates to service_role;
grant all on public.pricing_stair_rates to service_role;

with range_seed(range_id, category, range_label, guide_width_mm, plank_length_mm, display_base) as (
  values
    ('hybrid-etf-7mm', 'hybrid', 'ETF 7.0mm Waterproof Hybrid Flooring', 1200, null, 10),
    ('hybrid-etf-8mm', 'hybrid', 'ETF 8.0mm Waterproof Hybrid Flooring', 1200, null, 20),
    ('hybrid-etf-9mm', 'hybrid', 'ETF 9.0mm Waterproof Hybrid Flooring', 1200, null, 30),
    ('laminate-12mm-24hr-water-resistant', 'laminate', 'ETF 12mm 24hrs Water Resistant Laminate', 1200, null, 40),
    ('engineered-swish-oak-natura', 'engineered', 'Swish Oak Natura', 950, 1900, 50),
    ('engineered-swish-oak-natura-herringbone', 'engineered', 'Swish Oak Natura Herringbone', 950, 1900, 60)
),
type_seed(stair_type, type_order) as (
  values
    ('straight_tread', 1),
    ('winder_tread', 2),
    ('landing_1m2', 3),
    ('landing_2m2', 4),
    ('one_side_open', 5),
    ('two_side_open', 6)
),
seed_rows as (
  select
    range_seed.range_id,
    range_seed.category,
    range_seed.range_label,
    type_seed.stair_type,
    range_seed.guide_width_mm,
    range_seed.plank_length_mm,
    0::numeric as price_short,
    0::numeric as price_long,
    true as active,
    range_seed.display_base + type_seed.type_order as display_order
  from range_seed
  cross join type_seed
)
insert into public.stair_rates (
  range_id,
  category,
  range_label,
  stair_type,
  guide_width_mm,
  plank_length_mm,
  price_short,
  price_long,
  active,
  display_order
)
select
  range_id,
  category,
  range_label,
  stair_type,
  guide_width_mm,
  plank_length_mm,
  price_short,
  price_long,
  active,
  display_order
from seed_rows
on conflict (range_id, stair_type) do update set
  category = excluded.category,
  range_label = excluded.range_label,
  guide_width_mm = excluded.guide_width_mm,
  plank_length_mm = excluded.plank_length_mm,
  active = excluded.active,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.pricing_stair_rates (
  range_id,
  category,
  range_label,
  stair_type,
  guide_width_mm,
  plank_length_mm,
  price_short,
  price_long,
  active,
  display_order
)
select
  range_id,
  category,
  range_label,
  stair_type,
  guide_width_mm,
  plank_length_mm,
  price_short,
  price_long,
  active,
  display_order
from public.stair_rates
on conflict (range_id, stair_type) do update set
  category = excluded.category,
  range_label = excluded.range_label,
  guide_width_mm = excluded.guide_width_mm,
  plank_length_mm = excluded.plank_length_mm,
  active = excluded.active,
  display_order = excluded.display_order,
  updated_at = now();

comment on table public.stair_rates is 'Private stair pricing by flooring range, stair type, and width tier.';
comment on table public.pricing_stair_rates is 'Compatibility table used by Netlify private pricing runtime.';
comment on column public.stair_rates.price_short is 'Per-item stair price when stair width is within guide.';
comment on column public.stair_rates.price_long is 'Per-item stair price when stair width is over guide.';
comment on column public.pricing_stair_rates.price_short is 'Per-item stair price when stair width is within guide.';
comment on column public.pricing_stair_rates.price_long is 'Per-item stair price when stair width is over guide.';

select
  'stair pricing setup complete' as status,
  (select count(*) from public.stair_rates) as stair_rates_rows,
  (select count(*) from public.pricing_stair_rates) as pricing_stair_rates_rows;
