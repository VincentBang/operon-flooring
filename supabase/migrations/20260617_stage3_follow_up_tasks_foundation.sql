-- Stage 3 follow-up task foundation.
-- Additive only: creates the future Quote OS follow-up task table without
-- changing the existing operon_follow_ups runtime path.
--
-- Do not auto-send customer emails or SMS from this table. It is service-role
-- only until the admin workflow is explicitly approved.

create table if not exists public.operon_follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete cascade,
  quote_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  due_at timestamptz,
  status text not null default 'open'
    check (status in ('open', 'done', 'snoozed', 'cancelled', 'archived')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  task_type text not null default 'manual_follow_up',
  channel text
    check (channel is null or channel in ('phone', 'email', 'sms', 'manual')),
  reason text,
  suggested_message text,
  next_action text,
  assigned_to text,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists operon_follow_up_tasks_status_due_idx
  on public.operon_follow_up_tasks (status, due_at);

create index if not exists operon_follow_up_tasks_lead_status_idx
  on public.operon_follow_up_tasks (lead_id, status, due_at);

create or replace function public.operon_follow_up_tasks_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists operon_follow_up_tasks_set_updated_at on public.operon_follow_up_tasks;
create trigger operon_follow_up_tasks_set_updated_at
before update on public.operon_follow_up_tasks
for each row execute function public.operon_follow_up_tasks_set_updated_at();

alter table public.operon_follow_up_tasks enable row level security;

revoke all on table public.operon_follow_up_tasks from anon, authenticated;
grant all on table public.operon_follow_up_tasks to service_role;

comment on table public.operon_follow_up_tasks is
  'Future Quote OS dry-run follow-up task model. Service-role only. Existing runtime functions continue to use operon_follow_ups until migration is explicitly approved.';

comment on column public.operon_follow_up_tasks.quote_version_id is
  'Nullable future link to operon_quote_versions. No foreign key yet because quote versioning is not applied in this phase.';

comment on column public.operon_follow_up_tasks.suggested_message is
  'Internal suggested message only. Do not auto-send without explicit approval.';
