-- Operon Flooring Quote Advisor data engine
-- Purpose: store quote review intelligence without exposing internal pricing.
-- Public browser clients must not insert directly. Use a server-side Netlify
-- function with SUPABASE_SERVICE_ROLE_KEY.

create extension if not exists pgcrypto;

create or replace function public.operon_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.quote_reviews (
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
  linked_quote_lead_id uuid references public.quote_leads(id) on delete set null
);

create index if not exists quote_reviews_created_at_idx on public.quote_reviews(created_at desc);
create index if not exists quote_reviews_review_mode_idx on public.quote_reviews(review_mode);
create index if not exists quote_reviews_flooring_type_idx on public.quote_reviews(flooring_type);
create index if not exists quote_reviews_suburb_idx on public.quote_reviews(suburb);
create index if not exists quote_reviews_risk_level_idx on public.quote_reviews(risk_level);
create index if not exists quote_reviews_converted_idx on public.quote_reviews(converted_to_quote);

drop trigger if exists quote_reviews_set_updated_at on public.quote_reviews;
create trigger quote_reviews_set_updated_at
before update on public.quote_reviews
for each row execute function public.operon_set_updated_at();

alter table public.quote_reviews enable row level security;

-- No anonymous policies are created. Quote review rows contain customer details,
-- competitor quote context, and market/scope intelligence. Writes must go
-- through server-side functions only.
revoke all on table public.quote_reviews from anon;
revoke all on table public.quote_reviews from authenticated;

comment on table public.quote_reviews is 'Quote Advisor intelligence table. Stores scope completeness and market quote context only; no internal Operon pricing rates.';
comment on column public.quote_reviews.review_mode is 'quick or detailed advisor mode.';
comment on column public.quote_reviews.uploaded_quote_url is 'Future storage URL for uploaded quote file. Browser currently stores only a local file reference.';
comment on column public.quote_reviews.quote_total is 'Customer-provided external quote total for context. Not used for quote ranking or internal rate exposure.';
comment on column public.quote_reviews.included_items is 'Customer-selected scope items listed in the external quote.';
comment on column public.quote_reviews.missing_items is 'Scope completeness gaps calculated without internal pricing.';
comment on column public.quote_reviews.risk_items is 'High/medium/low risk items with consequence text. No internal rates.';
comment on column public.quote_reviews.clarity_score is 'Non-pricing completeness score from 0 to 100.';
comment on column public.quote_reviews.advisor_summary is 'Rendered advisor summary and decision guidance.';
comment on column public.quote_reviews.converted_to_quote is 'True once user clicks into quote.html from Quote Advisor.';
