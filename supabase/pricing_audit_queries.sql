-- Operon pricing audit queries
-- Purpose:
-- Show which pricing rows are aligned with the current live site logic.

-- Active product rows with expected live status.
select
  id,
  category_id,
  brand,
  range_name,
  colour,
  price_per_m2,
  active,
  case
    when id like 'hrt-etf-7mm-hybrid-%' then 'keep_active'
    when id like 'laminate-operon-select-%' then 'disable_or_delete'
    when id like 'engineered-operon-select-%' then 'disable_or_delete'
    else 'review'
  end as expected_state
from pricing_products
order by
  case
    when id like 'hrt-etf-7mm-hybrid-%' then 0
    when id like 'laminate-operon-select-%' then 1
    when id like 'engineered-operon-select-%' then 2
    else 3
  end,
  category_id,
  sort_order,
  id;

-- Install rates with expected live status.
select
  id,
  category_id,
  install_type,
  coalesce(install_method, '(null)') as install_method,
  job_type,
  rate_per_m2,
  minimum_charge,
  active,
  case
    when id in (
      'laminate-standard-supply-install',
      'laminate-standard-install-only',
      'hybrid-standard-supply-install',
      'hybrid-standard-install-only',
      'engineered-standard-supply-install',
      'engineered-standard-install-only',
      'engineered-standard-direct-glue-supply-install',
      'engineered-standard-direct-glue-install-only',
      'engineered-herringbone-supply-install',
      'engineered-herringbone-install-only'
    ) then 'keep_active'
    when id in (
      'laminate-herringbone-supply-install',
      'laminate-herringbone-install-only',
      'hybrid-herringbone-supply-install',
      'hybrid-herringbone-install-only'
    ) then 'disable_or_delete'
    else 'review'
  end as expected_state
from pricing_install_rates
order by category_id, install_type, job_type, id;

-- Category defaults currently used as fallback estimates.
select
  id,
  label,
  default_price_per_m2,
  active,
  page_url
from pricing_categories
order by id;

-- Quick summary counts by expected action.
with product_audit as (
  select
    case
      when id like 'hrt-etf-7mm-hybrid-%' then 'keep_active'
      when id like 'laminate-operon-select-%' then 'disable_or_delete'
      when id like 'engineered-operon-select-%' then 'disable_or_delete'
      else 'review'
    end as expected_state
  from pricing_products
),
rate_audit as (
  select
    case
      when id in (
        'laminate-standard-supply-install',
        'laminate-standard-install-only',
        'hybrid-standard-supply-install',
        'hybrid-standard-install-only',
        'engineered-standard-supply-install',
        'engineered-standard-install-only',
        'engineered-standard-direct-glue-supply-install',
        'engineered-standard-direct-glue-install-only',
        'engineered-herringbone-supply-install',
        'engineered-herringbone-install-only'
      ) then 'keep_active'
      when id in (
        'laminate-herringbone-supply-install',
        'laminate-herringbone-install-only',
        'hybrid-herringbone-supply-install',
        'hybrid-herringbone-install-only'
      ) then 'disable_or_delete'
      else 'review'
    end as expected_state
  from pricing_install_rates
)
select 'products' as table_name, expected_state, count(*) as row_count
from product_audit
group by expected_state
union all
select 'install_rates' as table_name, expected_state, count(*) as row_count
from rate_audit
group by expected_state
order by table_name, expected_state;
