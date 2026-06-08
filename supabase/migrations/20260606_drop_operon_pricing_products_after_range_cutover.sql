-- Drop old colour-level pricing product table after the range-pricing function cutover is live.
-- Do not apply before the deployed Netlify calculate-quote function no longer reads this table.

drop table if exists public.operon_pricing_products;
