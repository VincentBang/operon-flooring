-- Operon Flooring close probability system.
-- Adds explainable close scoring fields. This does not affect quote
-- calculation, pricing rules, product data, or customer-facing estimates.

alter table public.quote_requests add column if not exists close_score integer not null default 0;
alter table public.quote_requests add column if not exists close_probability numeric(5,4) not null default 0;
alter table public.quote_requests add column if not exists close_band text not null default 'very_low';
alter table public.quote_requests add column if not exists close_reasons jsonb not null default '{}'::jsonb;
alter table public.quote_requests add column if not exists next_action text;
alter table public.quote_requests add column if not exists priority_rank integer;

alter table public.quote_leads add column if not exists close_score integer not null default 0;
alter table public.quote_leads add column if not exists close_probability numeric(5,4) not null default 0;
alter table public.quote_leads add column if not exists close_band text not null default 'very_low';
alter table public.quote_leads add column if not exists close_reasons jsonb not null default '{}'::jsonb;
alter table public.quote_leads add column if not exists next_action text;
alter table public.quote_leads add column if not exists priority_rank integer;

do $$
begin
  alter table public.quote_requests drop constraint if exists quote_requests_close_band_check;
  alter table public.quote_leads drop constraint if exists quote_leads_close_band_check;

  alter table public.quote_requests
    add constraint quote_requests_close_band_check
    check (close_band in ('high', 'medium', 'low', 'very_low')) not valid;

  alter table public.quote_leads
    add constraint quote_leads_close_band_check
    check (close_band in ('high', 'medium', 'low', 'very_low')) not valid;
end $$;

create index if not exists quote_requests_close_priority_idx
on public.quote_requests(close_band, priority_rank, close_score desc, last_activity desc);

create index if not exists quote_leads_close_priority_idx
on public.quote_leads(close_band, priority_rank, close_score desc, last_activity desc);

comment on column public.quote_requests.close_score is '0-100 explainable close score: intent + engagement + completeness - friction.';
comment on column public.quote_requests.close_probability is 'Estimated close probability from close_score, stored as 0-1 decimal.';
comment on column public.quote_requests.close_band is 'high, medium, low, or very_low.';
comment on column public.quote_requests.close_reasons is 'JSON explanation of intent, engagement, completeness, friction, and signal reasons.';
comment on column public.quote_requests.next_action is 'Recommended next operator or automation action.';
comment on column public.quote_requests.priority_rank is 'Lower number means higher priority in operator dashboard.';

comment on column public.quote_leads.close_score is '0-100 explainable close score: intent + engagement + completeness - friction.';
comment on column public.quote_leads.close_probability is 'Estimated close probability from close_score, stored as 0-1 decimal.';
comment on column public.quote_leads.close_band is 'high, medium, low, or very_low.';
comment on column public.quote_leads.close_reasons is 'JSON explanation of intent, engagement, completeness, friction, and signal reasons.';
comment on column public.quote_leads.next_action is 'Recommended next operator or automation action.';
comment on column public.quote_leads.priority_rank is 'Lower number means higher priority in operator dashboard.';
