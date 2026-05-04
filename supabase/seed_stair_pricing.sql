-- Operon Flooring stair pricing seed.
-- Safe upsert: creates the 6 x 2 stair price slots for each range, but preserves prices
-- already entered in Supabase by using coalesce(existing price, placeholder).
--
-- Fill price_short and price_long in Supabase Table Editor:
-- - price_short = stair width <= guide_width_mm
-- - price_long = stair width > guide_width_mm
-- - engineered guide width is plank_length_mm / 2
-- - herringbone / chevron engineered ranges use the matching straight plank length,
--   not the shorter pattern board length.

begin;

with range_seed(range_id, category, range_label, guide_width_mm, plank_length_mm, display_base) as (
  values
    ('hybrid-etf-7mm', 'hybrid', 'ETF 7.0mm Waterproof Hybrid Flooring', 1200, null, 10),
    ('hybrid-etf-8mm', 'hybrid', 'ETF 8.0mm Waterproof Hybrid Flooring', 1200, null, 20),
    ('hybrid-etf-9mm', 'hybrid', 'ETF 9.0mm Waterproof Hybrid Flooring', 1200, null, 30),
    ('laminate-12mm-24hr-water-resistant', 'laminate', 'ETF 12mm 24hrs Water Resistant Laminate', 1200, null, 40),
    ('engineered-swish-oak-natura', 'engineered', 'Swish Oak Natura', 950, 1900, 50),
    ('engineered-swish-oak-natura-herringbone', 'engineered', 'Swish Oak Natura Herringbone', 950, 1900, 60)
),
type_seed(stair_type, type_order) as (
  values
    ('straight_tread', 1),
    ('winder_tread', 2),
    ('landing_1m2', 3),
    ('landing_2m2', 4),
    ('one_side_open', 5),
    ('two_side_open', 6)
),
seed_rows as (
  select
    range_seed.range_id,
    range_seed.category,
    range_seed.range_label,
    type_seed.stair_type,
    range_seed.guide_width_mm,
    range_seed.plank_length_mm,
    0::numeric as price_short,
    0::numeric as price_long,
    true as active,
    range_seed.display_base + type_seed.type_order as display_order
  from range_seed
  cross join type_seed
)
insert into public.stair_rates (
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
  price_short = coalesce(public.stair_rates.price_short, excluded.price_short),
  price_long = coalesce(public.stair_rates.price_long, excluded.price_long),
  active = excluded.active,
  display_order = excluded.display_order;

insert into public.pricing_stair_rates (
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
from public.stair_rates
on conflict (range_id, stair_type) do update set
  category = excluded.category,
  range_label = excluded.range_label,
  guide_width_mm = excluded.guide_width_mm,
  plank_length_mm = excluded.plank_length_mm,
  price_short = coalesce(public.pricing_stair_rates.price_short, excluded.price_short),
  price_long = coalesce(public.pricing_stair_rates.price_long, excluded.price_long),
  active = excluded.active,
  display_order = excluded.display_order;

commit;
