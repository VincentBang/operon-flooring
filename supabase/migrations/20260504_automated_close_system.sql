-- Operon Flooring automated close system.
-- Safe mode: this adds scoring, stage, and queue state only. It does not send
-- SMS/email and does not change quote calculation or pricing logic.

create extension if not exists pgcrypto;

alter table public.quote_requests add column if not exists lead_stage text not null default 'cold';
alter table public.quote_requests add column if not exists engagement_score integer not null default 0;
alter table public.quote_requests add column if not exists last_activity timestamptz not null default now();
alter table public.quote_requests add column if not exists last_action text;
alter table public.quote_requests add column if not exists followup_paused boolean not null default false;
alter table public.quote_requests add column if not exists last_followup_at timestamptz;
alter table public.quote_requests add column if not exists next_followup_at timestamptz;

alter table public.quote_leads add column if not exists lead_stage text not null default 'cold';
alter table public.quote_leads add column if not exists engagement_score integer not null default 0;
alter table public.quote_leads add column if not exists last_activity timestamptz not null default now();
alter table public.quote_leads add column if not exists last_action text;
alter table public.quote_leads add column if not exists followup_paused boolean not null default false;
alter table public.quote_leads add column if not exists last_followup_at timestamptz;
alter table public.quote_leads add column if not exists next_followup_at timestamptz;

create table if not exists public.followup_templates (
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

create table if not exists public.followup_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.quote_leads(id) on delete cascade,
  quote_request_id uuid references public.quote_requests(id) on delete cascade,
  channel text not null check (channel in ('sms', 'email', 'manual_call')),
  template_key text not null references public.followup_templates(template_key) on update cascade on delete restrict,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped', 'cancelled')),
  payload jsonb not null default '{}'::jsonb,
  provider_response jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  constraint followup_messages_lead_reference_check check (lead_id is not null or quote_request_id is not null)
);

do $$
begin
  alter table public.quote_requests drop constraint if exists quote_requests_lead_stage_check;
  alter table public.quote_leads drop constraint if exists quote_leads_lead_stage_check;
  alter table public.followup_templates drop constraint if exists followup_templates_lead_stage_check;

  alter table public.quote_requests
    add constraint quote_requests_lead_stage_check
    check (lead_stage in ('cold', 'warm', 'hot', 'closing', 'unknown')) not valid;

  alter table public.quote_leads
    add constraint quote_leads_lead_stage_check
    check (lead_stage in ('cold', 'warm', 'hot', 'closing', 'unknown')) not valid;

  alter table public.followup_templates
    add constraint followup_templates_lead_stage_check
    check (lead_stage in ('cold', 'warm', 'hot', 'closing', 'unknown', 'all')) not valid;
end $$;

create table if not exists public.close_automation_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  processed_count integer not null default 0,
  queued_count integer not null default 0,
  skipped_count integer not null default 0,
  dry_run boolean not null default true,
  notes jsonb not null default '{}'::jsonb
);

create index if not exists quote_requests_close_stage_idx
on public.quote_requests(lead_stage, engagement_score, last_activity);

create index if not exists quote_requests_close_activity_idx
on public.quote_requests(last_activity, last_action);

create index if not exists quote_leads_close_stage_idx
on public.quote_leads(lead_stage, engagement_score, last_activity);

create index if not exists quote_events_quote_name_created_idx
on public.quote_events(quote_id, event_name, created_at desc);

insert into public.followup_templates (
  template_key,
  channel,
  lead_stage,
  timing_offset_hours,
  subject,
  body,
  active
) values
  (
    'manual_close_call',
    'manual_call',
    'closing',
    0,
    null,
    'Use OPERON_CLOSE_SCRIPTS.md phone close script. Confirm scope, preparation, access, stairs, removal/disposal and next step without pressure.',
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

comment on column public.quote_requests.lead_stage is 'Automated close stage: cold, warm, hot, closing, or unknown.';
comment on column public.quote_requests.engagement_score is 'Behaviour score from quote, CTA, chatbot, and summary events.';
comment on column public.quote_requests.last_activity is 'Most recent quote/customer activity used by process-leads.';
comment on column public.quote_requests.last_action is 'Latest close-system action or customer event.';
comment on column public.quote_leads.lead_stage is 'Automated close stage: cold, warm, hot, closing, or unknown.';
comment on column public.quote_leads.engagement_score is 'Behaviour score from quote, CTA, chatbot, and summary events.';
comment on table public.close_automation_runs is 'Dry-run/audit log for scheduled process-leads runs.';

-- Suggested schedule after deploying the Edge Function:
-- supabase functions deploy process-leads
-- Then schedule an HTTP call every 5-10 minutes from Supabase scheduled jobs,
-- pg_cron + pg_net, or an external cron. Keep ENABLE_CLOSE_AUTOMATION_SEND=false
-- until provider credentials, consent, and opt-out rules are confirmed.
