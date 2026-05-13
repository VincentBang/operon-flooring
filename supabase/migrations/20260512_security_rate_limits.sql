-- Durable rate limiting for Netlify functions.
-- This table stores coarse request buckets only: no names, phones, emails, addresses or payloads.

create table if not exists public.operon_rate_limits (
  key text primary key,
  scope text not null,
  client_hash text not null,
  count integer not null default 0,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.operon_rate_limits enable row level security;

revoke all on table public.operon_rate_limits from anon, authenticated;
grant all on table public.operon_rate_limits to service_role;

create index if not exists operon_rate_limits_scope_reset_idx
  on public.operon_rate_limits(scope, reset_at);

create or replace function public.operon_check_rate_limit(
  p_key text,
  p_scope text,
  p_client_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing public.operon_rate_limits%rowtype;
  next_count integer;
  next_reset timestamptz;
begin
  if p_key is null or p_key = '' then
    raise exception 'rate limit key is required';
  end if;

  select *
  into existing
  from public.operon_rate_limits
  where key = p_key
  for update;

  if not found or existing.reset_at <= now() then
    next_count := 1;
    next_reset := now() + make_interval(secs => greatest(1, p_window_seconds));

    insert into public.operon_rate_limits(key, scope, client_hash, count, reset_at, updated_at)
    values (p_key, p_scope, p_client_hash, next_count, next_reset, now())
    on conflict (key)
    do update set
      scope = excluded.scope,
      client_hash = excluded.client_hash,
      count = excluded.count,
      reset_at = excluded.reset_at,
      updated_at = now();

    return jsonb_build_object(
      'allowed', true,
      'count', next_count,
      'remaining', greatest(0, p_limit - next_count),
      'resetAt', extract(epoch from next_reset) * 1000
    );
  end if;

  next_count := existing.count + 1;
  update public.operon_rate_limits
  set count = next_count,
      updated_at = now()
  where key = p_key;

  return jsonb_build_object(
    'allowed', next_count <= p_limit,
    'count', next_count,
    'remaining', greatest(0, p_limit - next_count),
    'resetAt', extract(epoch from existing.reset_at) * 1000
  );
end;
$$;

revoke all on function public.operon_check_rate_limit(text, text, text, integer, integer) from public;
grant execute on function public.operon_check_rate_limit(text, text, text, integer, integer) to service_role;

comment on table public.operon_rate_limits is 'Server-side rate limit buckets for Netlify functions. Stores hashed client identifiers only.';
