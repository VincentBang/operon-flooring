-- Operon Flooring pricing optimisation layer.
-- Uses historical quote/outcome data to create explainable target ranges.
-- This does not modify quoteCalculator.js or any internal pricing rules.

create extension if not exists pgcrypto;

create table if not exists public.quote_pricing_outcomes (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid references public.quote_requests(id) on delete set null,
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
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.pricing_optimization_buckets (
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

do $$
begin
  alter table public.quote_pricing_outcomes drop constraint if exists quote_pricing_outcomes_area_band_check;
  alter table public.quote_pricing_outcomes drop constraint if exists quote_pricing_outcomes_close_status_check;
  alter table public.quote_pricing_outcomes drop constraint if exists quote_pricing_outcomes_confidence_check;

  alter table public.quote_pricing_outcomes
    add constraint quote_pricing_outcomes_area_band_check
    check (area_band in ('unknown', 'small', 'medium', 'large', 'xlarge')) not valid;

  alter table public.quote_pricing_outcomes
    add constraint quote_pricing_outcomes_close_status_check
    check (close_status in ('won', 'lost', 'no_response')) not valid;

  alter table public.quote_pricing_outcomes
    add constraint quote_pricing_outcomes_confidence_check
    check (confidence_level in ('low', 'medium', 'high')) not valid;
end $$;

create index if not exists quote_pricing_outcomes_bucket_idx
on public.quote_pricing_outcomes(suburb_cluster, flooring_type, area_band, stairs_flag);

create index if not exists quote_pricing_outcomes_status_idx
on public.quote_pricing_outcomes(close_status, created_at desc);

create unique index if not exists quote_pricing_outcomes_quote_unique_idx
on public.quote_pricing_outcomes(quote_request_id)
where quote_request_id is not null;

create index if not exists pricing_optimization_buckets_lookup_idx
on public.pricing_optimization_buckets(suburb_cluster, flooring_type, area_band, stairs_flag);

alter table public.quote_pricing_outcomes enable row level security;
alter table public.pricing_optimization_buckets enable row level security;

revoke all on table public.quote_pricing_outcomes from anon;
revoke all on table public.quote_pricing_outcomes from authenticated;
revoke all on table public.pricing_optimization_buckets from anon;
revoke all on table public.pricing_optimization_buckets from authenticated;

comment on table public.quote_pricing_outcomes is 'Historical pricing/outcome data for optimisation. Service-role only.';
comment on table public.pricing_optimization_buckets is 'Aggregated bucket metrics for pricing range guidance. Service-role only.';
comment on column public.pricing_optimization_buckets.target_low is 'Target range lower bound, currently p40 where enough data exists.';
comment on column public.pricing_optimization_buckets.target_high is 'Target range upper bound, currently p65 where enough data exists.';
comment on column public.pricing_optimization_buckets.target_price is 'Preferred target, currently median winning price with fallback to median price.';
