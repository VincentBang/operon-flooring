-- Add Preference Floors range-level pricing placeholders.
-- One row represents one range; colours normally share range pricing.
-- Pricing columns are intentionally preserved on conflict.

insert into public.operon_product_ranges (
  id, category_id, brand, range_name, colour_count, active, sort_order
) values
  ('engineered-preference-de-marque-oak', 'engineered', 'De Marque Oak', 'De Marque Oak', 35, true, 1000),
  ('engineered-preference-elk-falls-hickory', 'engineered', 'Elk Falls Hickory', 'Elk Falls Hickory', 12, true, 1001),
  ('engineered-preference-fiddleback-australian-hardwood', 'engineered', 'Fiddleback Australian Hardwood', 'Fiddleback Australian Hardwood', 6, true, 1002),
  ('engineered-preference-hardwood-collection', 'engineered', 'Hardwood Collection', 'Hardwood Collection', 12, true, 1003),
  ('engineered-preference-prestige-oak', 'engineered', 'Prestige Oak', 'Prestige Oak', 55, true, 1004),
  ('engineered-preference-pronto-engineered-oak-flooring', 'engineered', 'Pronto Engineered Oak Flooring', 'Pronto Engineered Oak Flooring', 17, true, 1005),
  ('engineered-preference-select-australian-timber', 'engineered', 'Select Australian Timber', 'Select Australian Timber', 2, true, 1006),
  ('engineered-preference-village-oak', 'engineered', 'Village Oak', 'Village Oak', 22, true, 1007),
  ('hybrid-preference-aspire-rcb', 'hybrid', 'Aspire RCB', 'Aspire RCB', 14, true, 1008),
  ('hybrid-preference-easi-plank-spc', 'hybrid', 'Easi-Plank SPC', 'Easi-Plank SPC', 30, true, 1009),
  ('hybrid-preference-hydroplank-wpc', 'hybrid', 'Hydroplank WPC', 'Hydroplank WPC', 12, true, 1010),
  ('hybrid-preference-iconic-wpc', 'hybrid', 'Iconic WPC', 'Iconic WPC', 14, true, 1011),
  ('hybrid-preference-lifestyle-collection-epc', 'hybrid', 'Lifestyle Collection EPC', 'Lifestyle Collection EPC', 9, true, 1012),
  ('laminate-preference-aquastop-kronoswiss', 'laminate', 'Aquastop - Kronoswiss', 'Aquastop - Kronoswiss', 20, true, 1013),
  ('laminate-preference-aspect', 'laminate', 'Aspect', 'Aspect', 14, true, 1014),
  ('laminate-preference-oakleaf-hd-plus', 'laminate', 'Oakleaf HD PLUS', 'Oakleaf HD PLUS', 12, true, 1015),
  ('laminate-preference-oakleaf-laminate', 'laminate', 'Oakleaf Laminate', 'Oakleaf Laminate', 14, true, 1016),
  ('laminate-preference-preference-classic-laminate', 'laminate', 'Preference Classic Laminate', 'Preference Classic Laminate', 9, true, 1017)
on conflict (id) do update set
  category_id = excluded.category_id,
  brand = excluded.brand,
  range_name = excluded.range_name,
  colour_count = excluded.colour_count,
  active = excluded.active,
  sort_order = excluded.sort_order;

select category_id, count(*) as preference_range_count
from public.operon_product_ranges
where id like '%preference%'
group by category_id
order by category_id;