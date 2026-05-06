-- Operon Flooring follow-up automation schema.
-- Safe phased mode: queue and templates only. Real SMS/email sending stays disabled
-- until server-side functions are deployed with ENABLE_FOLLOWUP_SEND=true.

create extension if not exists pgcrypto;

create or replace function public.operon_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

alter table public.quote_leads add column if not exists lead_stage text not null default 'unknown';
alter table public.quote_leads add column if not exists followup_status text not null default 'pending';
alter table public.quote_leads add column if not exists last_followup_at timestamptz;
alter table public.quote_leads add column if not exists next_followup_at timestamptz;
alter table public.quote_leads add column if not exists followup_paused boolean not null default false;
alter table public.quote_leads add column if not exists consent_sms boolean not null default false;
alter table public.quote_leads add column if not exists consent_email boolean not null default true;
alter table public.quote_leads add column if not exists source text not null default 'website';

-- Compatibility with the currently used quote_requests save path. Future lead
-- storage should move to quote_leads, but this keeps automation data available
-- for existing quote_requests rows without changing the frontend quote engine.
alter table public.quote_requests add column if not exists lead_stage text not null default 'unknown';
alter table public.quote_requests add column if not exists followup_status text not null default 'pending';
alter table public.quote_requests add column if not exists last_followup_at timestamptz;
alter table public.quote_requests add column if not exists next_followup_at timestamptz;
alter table public.quote_requests add column if not exists followup_paused boolean not null default false;
alter table public.quote_requests add column if not exists consent_sms boolean not null default false;
alter table public.quote_requests add column if not exists consent_email boolean not null default true;
alter table public.quote_requests add column if not exists source text not null default 'website';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quote_leads_lead_stage_check'
  ) then
    alter table public.quote_leads
      add constraint quote_leads_lead_stage_check
      check (lead_stage in ('hot', 'warm', 'cold', 'unknown')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'quote_requests_lead_stage_check'
  ) then
    alter table public.quote_requests
      add constraint quote_requests_lead_stage_check
      check (lead_stage in ('hot', 'warm', 'cold', 'unknown')) not valid;
  end if;
end $$;

create table if not exists public.followup_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text unique not null,
  channel text not null check (channel in ('sms', 'email', 'manual_call')),
  lead_stage text not null default 'unknown' check (lead_stage in ('hot', 'warm', 'cold', 'unknown', 'all')),
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

create unique index if not exists followup_messages_lead_template_unique
on public.followup_messages(lead_id, template_key)
where lead_id is not null;

create unique index if not exists followup_messages_quote_request_template_unique
on public.followup_messages(quote_request_id, template_key)
where quote_request_id is not null;

create index if not exists followup_messages_due_idx
on public.followup_messages(status, scheduled_for)
where status = 'queued';

create index if not exists followup_messages_lead_id_idx
on public.followup_messages(lead_id);

create index if not exists followup_messages_quote_request_id_idx
on public.followup_messages(quote_request_id);

drop trigger if exists followup_templates_set_updated_at on public.followup_templates;
create trigger followup_templates_set_updated_at
before update on public.followup_templates
for each row execute function public.operon_set_updated_at();

alter table public.followup_templates enable row level security;
alter table public.followup_messages enable row level security;

-- Follow-up tables contain customer communication state. No anonymous browser
-- read/write policies are created. Use service-role server functions only.
revoke all on table public.followup_templates from anon;
revoke all on table public.followup_templates from authenticated;
revoke all on table public.followup_messages from anon;
revoke all on table public.followup_messages from authenticated;

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
    'manual_quote_review',
    'manual_call',
    'all',
    0,
    null,
    'Review the submitted quote request. Confirm product, area, preparation, removal/disposal, trims, stairs, site conditions and the best next step before contacting the customer.',
    true
  ),
  (
    'immediate_sms_received',
    'sms',
    'all',
    0.1,
    null,
    'Hi {{name}}, we received your flooring estimate. I''m reviewing your details now to confirm scope and final pricing. You can reply here or call if you want to move faster.',
    true
  ),
  (
    'immediate_email_received',
    'email',
    'all',
    0.1,
    'Your flooring estimate - next steps',
    'Hi {{name}},

We''ve received your estimate request.

Next step:
We review your details and confirm the scope before providing the final quote.

If you have a floor plan, photos, or extra details, you can reply here to speed things up.

Thanks,
Operon Flooring',
    true
  ),
  (
    'day1_sms_checkin',
    'sms',
    'hot',
    24,
    null,
    'Hi {{name}}, just checking - have you had a chance to review your flooring estimate? Happy to clarify scope, products or next steps.',
    true
  ),
  (
    'day3_email_guidance',
    'email',
    'warm',
    72,
    'Quick check on your flooring project',
    'Hi {{name}},

A quick follow-up on your flooring project.

The main details that usually need confirmation are product selection, floor preparation, removal or disposal, trims, and site conditions. If any of those are unclear, we can help check the scope before you decide.

You can reply with questions, send a floor plan, or continue from your saved estimate.

Regards,
Operon Flooring',
    true
  ),
  (
    'day7_sms_soft_reminder',
    'sms',
    'warm',
    168,
    null,
    'Hi {{name}}, if you''re still comparing options, we can help review scope or confirm details. No pressure - just let me know.',
    true
  ),
  (
    'day14_email_planning',
    'email',
    'cold',
    336,
    'Still planning your flooring project?',
    'Hi {{name}},

Just checking whether your flooring project is still being planned.

Your estimate details can still be used as a starting point. If the product, area, site details or timing has changed, we can update the scope before final confirmation.

No pressure. Reply whenever you are ready.

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

comment on table public.followup_templates is 'Server-side follow-up templates for dry-run queue creation. Do not expose to browser clients.';
comment on table public.followup_messages is 'Queued follow-up communication tasks. Real sending is disabled unless server env ENABLE_FOLLOWUP_SEND=true.';
comment on column public.quote_leads.lead_stage is 'hot, warm, cold, or unknown. Captures customer timing after submit.';
comment on column public.quote_leads.consent_sms is 'SMS follow-up consent. Default false; do not queue/send SMS without true.';
comment on column public.quote_leads.consent_email is 'Email follow-up consent. Default true for operational quote follow-up.';
comment on column public.quote_requests.lead_stage is 'Compatibility field for current quote_requests save path.';
