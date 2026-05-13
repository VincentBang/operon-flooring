-- Shared lead qualification controls for quote triage.
-- Additive only. Supports both legacy quote_requests and operon_quote_requests.
-- This stores operational qualification metadata without changing pricing formulas.

do $$
declare
  target_table text;
begin
  foreach target_table in array array['quote_requests', 'operon_quote_requests', 'quote_leads']
  loop
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = target_table
    ) then
      execute format('alter table public.%I add column if not exists lead_status text not null default %L', target_table, 'New');
      execute format('alter table public.%I add column if not exists lead_priority text not null default %L', target_table, 'B');
      execute format('alter table public.%I add column if not exists lead_qualification jsonb not null default %L::jsonb', target_table, '{}');
      execute format('alter table public.%I add column if not exists lead_qualification_fields jsonb not null default %L::jsonb', target_table, '{}');
      execute format('alter table public.%I add column if not exists lead_risk_flags jsonb not null default %L::jsonb', target_table, '[]');
      execute format('alter table public.%I add column if not exists lead_missing_fields jsonb not null default %L::jsonb', target_table, '[]');
      execute format('alter table public.%I add column if not exists lead_next_action text', target_table);
      execute format('alter table public.%I add column if not exists lead_followup_template_key text', target_table);
      execute format('alter table public.%I add column if not exists customer_accepted_range boolean not null default false', target_table);
      execute format('alter table public.%I add column if not exists floorplan_attached boolean not null default false', target_table);
      execute format('alter table public.%I add column if not exists quote_review_attached boolean not null default false', target_table);
      execute format('alter table public.%I add column if not exists estimated_job_size numeric', target_table);
      execute format('alter table public.%I add column if not exists confidence_level text', target_table);
      execute format('alter table public.%I add column if not exists review_required boolean not null default false', target_table);
      execute format('alter table public.%I add column if not exists site_confirmation_booked_at timestamptz', target_table);
      execute format('alter table public.%I add column if not exists lead_status_updated_at timestamptz not null default now()', target_table);
      execute format('alter table public.%I alter column lead_status set default %L', target_table, 'New');
      execute format(
        'update public.%I set lead_status = case lower(lead_status)
          when %L then %L
          when %L then %L
          when %L then %L
          when %L then %L
          when %L then %L
          when %L then %L
          when %L then %L
          else lead_status
        end',
        target_table,
        'new', 'New',
        'lead', 'New',
        'contacted', 'Remote estimate sent',
        'site_visit_booked', 'Site confirmation booked',
        'manual_review_required', 'Manual review required',
        'won', 'Won',
        'lost', 'Lost'
      );

      execute format('alter table public.%I drop constraint if exists %I', target_table, target_table || '_lead_status_check');
      execute format(
        'alter table public.%I add constraint %I check (lead_status in (%L,%L,%L,%L,%L,%L,%L,%L,%L,%L))',
        target_table,
        target_table || '_lead_status_check',
        'New',
        'Needs missing info',
        'Remote estimate sent',
        'Site confirmation eligible',
        'Site confirmation booked',
        'Manual review required',
        'Quoted',
        'Won',
        'Lost',
        'Low priority'
      );

      execute format('alter table public.%I drop constraint if exists %I', target_table, target_table || '_lead_priority_check');
      execute format(
        'alter table public.%I add constraint %I check (lead_priority in (%L,%L,%L,%L))',
        target_table,
        target_table || '_lead_priority_check',
        'A',
        'B',
        'C',
        'D'
      );

      execute format(
        'create index if not exists %I on public.%I(lead_priority, lead_status, lead_status_updated_at desc)',
        target_table || '_lead_qualification_idx',
        target_table
      );
    end if;
  end loop;
end $$;

do $$
declare
  target_table text;
begin
  foreach target_table in array array['quote_requests', 'operon_quote_requests', 'quote_leads']
  loop
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = target_table
    ) then
      execute format('comment on column public.%I.lead_status is %L', target_table, 'Operational lead status for triage. Site confirmation is not automatic.');
      execute format('comment on column public.%I.lead_priority is %L', target_table, 'A site confirmation priority, B missing info/remote review, C low priority, D founder review.');
      execute format('comment on column public.%I.lead_qualification is %L', target_table, 'Full lead qualification decision snapshot from the website/backend.');
      execute format('comment on column public.%I.lead_qualification_fields is %L', target_table, 'Structured qualification fields used to make the triage decision.');
      execute format('comment on column public.%I.lead_risk_flags is %L', target_table, 'Risk flags such as stairs, access, floor prep, moisture or review required.');
      execute format('comment on column public.%I.lead_missing_fields is %L', target_table, 'Missing lead fields to request before site confirmation.');
      execute format('comment on column public.%I.lead_next_action is %L', target_table, 'Suggested next operator action.');
    end if;
  end loop;
end $$;
