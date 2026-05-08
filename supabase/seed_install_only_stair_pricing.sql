-- Operon Flooring installation-only stair pricing seed.
-- Adds category-level stair-rate rows used when quote_mode = install_only.
-- This avoids requiring a product range for installation-only jobs.
--
-- Runtime lookup ids:
-- - installation-only-laminate
-- - installation-only-hybrid
-- - installation-only-engineered

begin;

with range_seed(range_id, category, range_label, guide_width_mm, plank_length_mm, display_base) as (
  values
    ('installation-only-laminate', 'laminate', 'Installation-only laminate stairs', 1200, null, 100),
    ('installation-only-hybrid', 'hybrid', 'Installation-only hybrid stairs', 1200, null, 110),
    ('installation-only-engineered', 'engineered', 'Installation-only engineered timber stairs', 950, 1900, 120)
),
type_seed(stair_type, type_order, laminate_short, laminate_long, hybrid_short, hybrid_long, engineered_short, engineered_long) as (
  values
    ('straight_tread', 1, 70, 70, 70, 70, 130, 185),
    ('winder_tread', 2, 100, 100, 100, 100, 155, 215),
    ('landing_1m2', 3, 100, 100, 100, 100, 160, 220),
    ('landing_2m2', 4, 130, 130, 130, 130, 220, 285),
    ('one_side_open', 5, 100, 100, 100, 100, 155, 215),
    ('two_side_open', 6, 150, 150, 150, 150, 220, 285)
),
seed_rows as (
  select
    range_seed.range_id,
    range_seed.category,
    range_seed.range_label,
    type_seed.stair_type,
    range_seed.guide_width_mm,
    range_seed.plank_length_mm,
    case range_seed.category
      when 'laminate' then type_seed.laminate_short
      when 'hybrid' then type_seed.hybrid_short
      else type_seed.engineered_short
    end::numeric as price_short,
    case range_seed.category
      when 'laminate' then type_seed.laminate_long
      when 'hybrid' then type_seed.hybrid_long
      else type_seed.engineered_long
    end::numeric as price_long,
    true as active,
    range_seed.display_base + type_seed.type_order as display_order
  from range_seed
  cross join type_seed
)
insert into public.operon_pricing_stair_rates (
  range_id,
  category,
  range_label,
  stair_type,
  guide_width_mm,
  plank_length_mm,
  price_short,
  price_long,
  active,
  display_order
)
select
  range_id,
  category,
  range_label,
  stair_type,
  guide_width_mm,
  plank_length_mm,
  price_short,
  price_long,
  active,
  display_order
from seed_rows
on conflict (range_id, stair_type) do update set
  category = excluded.category,
  range_label = excluded.range_label,
  guide_width_mm = excluded.guide_width_mm,
  plank_length_mm = excluded.plank_length_mm,
  price_short = excluded.price_short,
  price_long = excluded.price_long,
  active = excluded.active,
  display_order = excluded.display_order,
  updated_at = now();

commit;

select
  'installation_only_stair_seed_complete' as status,
  count(*) as install_only_stair_rows
from public.operon_pricing_stair_rates
where range_id in (
  'installation-only-laminate',
  'installation-only-hybrid',
  'installation-only-engineered'
);
