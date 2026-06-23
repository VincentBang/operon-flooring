-- Read-only verification for Floorplan Phase 2. Do not select customer rows.

with targets(table_name) as (
  values
    ('operon_floorplan_measurement_sessions'),
    ('operon_floorplan_measurement_versions'),
    ('operon_floorplan_measurement_sections'),
    ('operon_floorplan_measurement_review_events'),
    ('operon_floorplan_quote_links')
),
roles(role_name) as (
  values ('anon'), ('authenticated'), ('service_role')
)
select
  'table_privileges' as check_group,
  t.table_name,
  r.role_name,
  has_table_privilege(r.role_name, 'public.' || t.table_name, 'select') as can_select,
  has_table_privilege(r.role_name, 'public.' || t.table_name, 'insert') as can_insert,
  has_table_privilege(r.role_name, 'public.' || t.table_name, 'update') as can_update,
  has_table_privilege(r.role_name, 'public.' || t.table_name, 'delete') as can_delete
from targets t
cross join roles r
order by t.table_name, r.role_name;

select
  'rls_status' as check_group,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'operon_floorplan_measurement_sessions',
    'operon_floorplan_measurement_versions',
    'operon_floorplan_measurement_sections',
    'operon_floorplan_measurement_review_events',
    'operon_floorplan_quote_links'
  )
order by c.relname;

select
  'policies' as check_group,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'operon_floorplan_measurement_sessions',
    'operon_floorplan_measurement_versions',
    'operon_floorplan_measurement_sections',
    'operon_floorplan_measurement_review_events',
    'operon_floorplan_quote_links'
  )
order by tablename, policyname;

select
  'graphql_sensitive_grants' as check_group,
  table_schema,
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
  and table_name in (
    'operon_floorplan_measurement_sessions',
    'operon_floorplan_measurement_versions',
    'operon_floorplan_measurement_sections',
    'operon_floorplan_measurement_review_events',
    'operon_floorplan_quote_links'
  )
order by table_name, grantee, privilege_type;
