-- Adds future-ready scope clarity fields for quote requests, quote leads, and quote reviews.
-- These fields support structured scope intelligence without changing the frontend
-- calculator, exposing internal rates, or requiring live writes from the browser.

alter table if exists public.quote_requests add column if not exists scope_signals jsonb not null default '{}'::jsonb;
alter table if exists public.quote_requests add column if not exists missing_scope_items jsonb not null default '[]'::jsonb;
alter table if exists public.quote_requests add column if not exists scope_definition_level text not null default 'unknown';
alter table if exists public.quote_requests add column if not exists scope_next_best_action text;

alter table if exists public.quote_leads add column if not exists scope_signals jsonb not null default '{}'::jsonb;
alter table if exists public.quote_leads add column if not exists missing_scope_items jsonb not null default '[]'::jsonb;
alter table if exists public.quote_leads add column if not exists scope_definition_level text not null default 'unknown';
alter table if exists public.quote_leads add column if not exists scope_next_best_action text;

alter table if exists public.quote_reviews add column if not exists scope_definition_level text not null default 'unknown';
alter table if exists public.quote_reviews add column if not exists product_clarity text;
alter table if exists public.quote_reviews add column if not exists area_clarity text;
alter table if exists public.quote_reviews add column if not exists installation_clarity text;
alter table if exists public.quote_reviews add column if not exists site_access_clarity text;
alter table if exists public.quote_reviews add column if not exists prep_risk_clarity text;
alter table if exists public.quote_reviews add column if not exists finishing_clarity text;
alter table if exists public.quote_reviews add column if not exists commercial_clarity text;
alter table if exists public.quote_reviews add column if not exists exclusion_clarity text;
alter table if exists public.quote_reviews add column if not exists next_best_action text;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'quote_requests'
  ) then
    alter table public.quote_requests drop constraint if exists quote_requests_scope_definition_level_check;
    alter table public.quote_requests
      add constraint quote_requests_scope_definition_level_check
      check (scope_definition_level in ('high', 'medium', 'low', 'unknown'));
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'quote_leads'
  ) then
    alter table public.quote_leads drop constraint if exists quote_leads_scope_definition_level_check;
    alter table public.quote_leads
      add constraint quote_leads_scope_definition_level_check
      check (scope_definition_level in ('high', 'medium', 'low', 'unknown'));
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'quote_reviews'
  ) then
    alter table public.quote_reviews drop constraint if exists quote_reviews_scope_definition_level_check;
    alter table public.quote_reviews
      add constraint quote_reviews_scope_definition_level_check
      check (scope_definition_level in ('high', 'medium', 'low', 'unknown'));
  end if;
end $$;

comment on column public.quote_requests.scope_signals is 'Structured scope clarity signals from the quote flow. No internal rates.';
comment on column public.quote_requests.missing_scope_items is 'Missing or unclear customer-facing scope items to confirm before booking.';
comment on column public.quote_requests.scope_definition_level is 'High, medium, low, or unknown scope definition level.';
comment on column public.quote_requests.scope_next_best_action is 'Recommended next operator action based on scope completeness.';

comment on column public.quote_leads.scope_signals is 'Structured scope clarity signals from the quote flow. No internal rates.';
comment on column public.quote_leads.missing_scope_items is 'Missing or unclear customer-facing scope items to confirm before booking.';
comment on column public.quote_leads.scope_definition_level is 'High, medium, low, or unknown scope definition level.';
comment on column public.quote_leads.scope_next_best_action is 'Recommended next operator action based on scope completeness.';

comment on column public.quote_reviews.scope_definition_level is 'Scope definition level for external quote review: high, medium, low, or unknown.';
comment on column public.quote_reviews.next_best_action is 'Calm next step recommendation, such as confirm missing scope or build structured estimate.';
