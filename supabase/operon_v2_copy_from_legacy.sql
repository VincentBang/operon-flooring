-- Optional Operon v2 data copy.
-- Run this after supabase/operon_v2_clean_schema.sql if you want the clean
-- operon_* tables to start with the currently working legacy pricing data.
--
-- This is non-destructive:
-- - does not drop old tables
-- - does not delete v2 rows
-- - preserves existing v2 values where possible via upsert

insert into public.operon_pricing_categories (
  id,
  label,
  short_description,
  default_price_per_m2,
  page_url,
  active
)
select
  id,
  label,
  short_description,
  default_price_per_m2,
  page_url,
  active
from public.pricing_categories
on conflict (id) do update set
  label = excluded.label,
  short_description = excluded.short_description,
  default_price_per_m2 = excluded.default_price_per_m2,
  page_url = excluded.page_url,
  active = excluded.active,
  updated_at = now();

insert into public.operon_pricing_products (
  id,
  category_id,
  brand,
  range_name,
  colour,
  tone,
  swatch,
  thickness,
  product_type,
  price_per_m2,
  install_rate_override,
  image_url,
  alt_text,
  description,
  features,
  suitable_for,
  supplier,
  supplier_url,
  active,
  sort_order
)
select
  id,
  category_id,
  brand,
  range_name,
  colour,
  tone,
  swatch,
  thickness,
  product_type,
  price_per_m2,
  install_rate_override,
  image_url,
  alt_text,
  description,
  features,
  suitable_for,
  supplier,
  supplier_url,
  active,
  sort_order
from public.pricing_products
on conflict (id) do update set
  category_id = excluded.category_id,
  brand = excluded.brand,
  range_name = excluded.range_name,
  colour = excluded.colour,
  tone = excluded.tone,
  swatch = excluded.swatch,
  thickness = excluded.thickness,
  product_type = excluded.product_type,
  price_per_m2 = excluded.price_per_m2,
  install_rate_override = excluded.install_rate_override,
  image_url = excluded.image_url,
  alt_text = excluded.alt_text,
  description = excluded.description,
  features = excluded.features,
  suitable_for = excluded.suitable_for,
  supplier = excluded.supplier,
  supplier_url = excluded.supplier_url,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.operon_pricing_install_rates (
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
  id,
  category_id,
  install_type,
  install_method,
  job_type,
  rate_per_m2,
  minimum_charge,
  active
from public.pricing_install_rates
on conflict (id) do update set
  category_id = excluded.category_id,
  install_type = excluded.install_type,
  install_method = excluded.install_method,
  job_type = excluded.job_type,
  rate_per_m2 = excluded.rate_per_m2,
  minimum_charge = excluded.minimum_charge,
  active = excluded.active,
  updated_at = now();

insert into public.operon_pricing_underlay_options (
  id,
  name,
  suitable_categories,
  price_per_m2,
  active
)
select
  id,
  name,
  suitable_categories,
  price_per_m2,
  active
from public.pricing_underlay_options
on conflict (id) do update set
  name = excluded.name,
  suitable_categories = excluded.suitable_categories,
  price_per_m2 = excluded.price_per_m2,
  active = excluded.active,
  updated_at = now();

insert into public.operon_pricing_trim_options (
  id,
  type,
  form_value,
  material,
  pricing_method,
  price,
  active
)
select
  id,
  type,
  form_value,
  material,
  pricing_method,
  price,
  active
from public.pricing_trim_options
on conflict (id) do update set
  type = excluded.type,
  form_value = excluded.form_value,
  material = excluded.material,
  pricing_method = excluded.pricing_method,
  price = excluded.price,
  active = excluded.active,
  updated_at = now();

insert into public.operon_pricing_removal_rates (
  id,
  floor_type,
  aliases,
  rate_per_m2,
  disposal_fee,
  active
)
select
  id,
  floor_type,
  aliases,
  rate_per_m2,
  disposal_fee,
  active
from public.pricing_removal_rates
on conflict (id) do update set
  floor_type = excluded.floor_type,
  aliases = excluded.aliases,
  rate_per_m2 = excluded.rate_per_m2,
  disposal_fee = excluded.disposal_fee,
  active = excluded.active,
  updated_at = now();

insert into public.operon_pricing_location_zones (
  id,
  zone_name,
  suburbs,
  postcodes,
  distance_from_base_km,
  travel_fee,
  minimum_job_fee,
  surcharge_percent,
  fallback,
  active
)
select
  id,
  zone_name,
  suburbs,
  postcodes,
  distance_from_base_km,
  travel_fee,
  minimum_job_fee,
  surcharge_percent,
  fallback,
  active
from public.pricing_location_zones
on conflict (id) do update set
  zone_name = excluded.zone_name,
  suburbs = excluded.suburbs,
  postcodes = excluded.postcodes,
  distance_from_base_km = excluded.distance_from_base_km,
  travel_fee = excluded.travel_fee,
  minimum_job_fee = excluded.minimum_job_fee,
  surcharge_percent = excluded.surcharge_percent,
  fallback = excluded.fallback,
  active = excluded.active,
  updated_at = now();

insert into public.operon_pricing_rules (
  rule_key,
  value_type,
  value_numeric,
  value_boolean,
  value_text,
  notes
)
select
  rule_key,
  case
    when value_type in ('number', 'boolean', 'text', 'json') then value_type
    else 'text'
  end as value_type,
  value_numeric,
  value_boolean,
  value_text,
  notes
from public.pricing_rules
on conflict (rule_key) do update set
  value_type = excluded.value_type,
  value_numeric = excluded.value_numeric,
  value_boolean = excluded.value_boolean,
  value_text = excluded.value_text,
  notes = excluded.notes,
  updated_at = now();

do $$
begin
  if to_regclass('public.pricing_stair_rates') is not null then
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
    from public.pricing_stair_rates
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
  elsif to_regclass('public.stair_rates') is not null then
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
    from public.stair_rates
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
  end if;

  if to_regclass('public.followup_templates') is not null then
    insert into public.operon_followup_templates (
      template_key,
      channel,
      lead_stage,
      timing_offset_hours,
      subject,
      body,
      active
    )
    select
      template_key,
      channel,
      lead_stage,
      timing_offset_hours,
      subject,
      body,
      active
    from public.followup_templates
    on conflict (template_key) do update set
      channel = excluded.channel,
      lead_stage = excluded.lead_stage,
      timing_offset_hours = excluded.timing_offset_hours,
      subject = excluded.subject,
      body = excluded.body,
      active = excluded.active,
      updated_at = now();
  end if;
end $$;

select
  'operon_v2_copy_complete' as status,
  (select count(*) from public.operon_pricing_categories) as categories,
  (select count(*) from public.operon_pricing_products) as products,
  (select count(*) from public.operon_pricing_install_rates) as install_rates,
  (select count(*) from public.operon_pricing_rules) as pricing_rules,
  (select count(*) from public.operon_pricing_stair_rates) as stair_rates;
