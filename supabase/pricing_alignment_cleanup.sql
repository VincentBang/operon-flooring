-- Operon pricing alignment cleanup
-- Purpose:
-- 1. Remove placeholder product rows that are no longer used on the site.
-- 2. Remove invalid laminate/hybrid herringbone install-rate rows.
-- 3. Preserve the prices you already set on all remaining live rows.

begin;

delete from pricing_products
where id in (
  'laminate-operon-select-essential-natural-oak',
  'laminate-operon-select-signature-light-oak',
  'laminate-operon-select-signature-smoked-oak',
  'engineered-operon-select-reserve-european-oak',
  'engineered-operon-select-reserve-natural-oak',
  'engineered-operon-select-reserve-walnut-oak'
);

delete from pricing_install_rates
where id in (
  'laminate-herringbone-supply-install',
  'laminate-herringbone-install-only',
  'hybrid-herringbone-supply-install',
  'hybrid-herringbone-install-only'
);

commit;
