-- Operon Flooring stair pricing schema.
-- Additive and non-destructive. Prices are private and should be read server-side only.
--
-- Pricing model:
-- - Every range has 6 stair types.
-- - Every stair type has 2 price tiers: width within guide and width over guide.
-- - Hybrid / laminate guide width is normally 1200 mm.
-- - Engineered timber guide width is half the board/plank length for that range.
-- - Engineered herringbone / chevron ranges use the matching straight plank length
--   as the stair guide source, not the shorter pattern board length.

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

-- Compatibility table for current Netlify private pricing helper.
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

-- Pricing privacy: no anon select policy is created.
-- Netlify Functions must read these tables with SUPABASE_SERVICE_ROLE_KEY.
grant usage on schema public to anon, authenticated;
grant all on public.stair_rates to service_role;
grant all on public.pricing_stair_rates to service_role;

comment on table public.stair_rates is 'Private stair pricing by flooring range, stair type, and width tier.';
comment on column public.stair_rates.price_short is 'Per-item stair price when stair width is within guide. Hybrid/laminate guide is normally 1200 mm; engineered guide is plank_length_mm / 2.';
comment on column public.stair_rates.price_long is 'Per-item stair price when stair width is over guide.';
comment on column public.stair_rates.plank_length_mm is 'Used for engineered timber threshold. Guide width = plank_length_mm / 2. For herringbone/chevron, store the matching straight plank length.';
