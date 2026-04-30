-- Operon pricing alignment soft-disable
-- Purpose:
-- 1. Keep old rows in Supabase for reference.
-- 2. Mark rows inactive when they are no longer valid for the live site.
-- 3. Preserve all prices already entered on the remaining active rows.

begin;

update pricing_products
set active = false
where id in (
  'laminate-operon-select-essential-natural-oak',
  'laminate-operon-select-signature-light-oak',
  'laminate-operon-select-signature-smoked-oak',
  'engineered-operon-select-reserve-european-oak',
  'engineered-operon-select-reserve-natural-oak',
  'engineered-operon-select-reserve-walnut-oak'
);

update pricing_install_rates
set active = false
where id in (
  'laminate-herringbone-supply-install',
  'laminate-herringbone-install-only',
  'hybrid-herringbone-supply-install',
  'hybrid-herringbone-install-only'
);

commit;
