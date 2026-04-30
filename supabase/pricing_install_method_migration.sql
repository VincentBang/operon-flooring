-- Operon install method migration
-- Purpose:
-- 1. Add install_method to pricing_install_rates.
-- 2. Preserve your current rate_per_m2 and minimum_charge values.
-- 3. Add engineered standard direct-glue rows as separate editable paths.

begin;

alter table pricing_install_rates
add column if not exists install_method text;

update pricing_install_rates
set install_method = case
  when category_id in ('laminate', 'hybrid') then 'floating'
  when install_type = 'herringbone' then 'direct_glue'
  when category_id = 'engineered' and install_type = 'standard' then 'floating'
  else coalesce(install_method, 'floating')
end
where install_method is null
   or install_method = '';

alter table pricing_install_rates
alter column install_method set default 'floating';

alter table pricing_install_rates
alter column install_method set not null;

insert into pricing_install_rates (
  id,
  category_id,
  install_type,
  install_method,
  job_type,
  rate_per_m2,
  minimum_charge,
  active
)
select
  'engineered-standard-direct-glue-supply-install',
  'engineered',
  'standard',
  'direct_glue',
  'supply_install',
  rate_per_m2,
  minimum_charge,
  active
from pricing_install_rates
where id = 'engineered-standard-supply-install'
on conflict (id) do nothing;

insert into pricing_install_rates (
  id,
  category_id,
  install_type,
  install_method,
  job_type,
  rate_per_m2,
  minimum_charge,
  active
)
select
  'engineered-standard-direct-glue-install-only',
  'engineered',
  'standard',
  'direct_glue',
  'install_only',
  rate_per_m2,
  minimum_charge,
  active
from pricing_install_rates
where id = 'engineered-standard-install-only'
on conflict (id) do nothing;

commit;
