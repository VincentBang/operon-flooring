-- Operon Flooring protective seed/upsert script.
-- Generated from apps/web/*.js local fallback modules.
-- Safe strategy: insert missing rows, update metadata, preserve existing Supabase numeric prices/rates on conflict.
-- Run after supabase/migrations/20260502_operon_pricing_lead_schema.sql.
-- Hybrid currently has confirmed product rows in JS; laminate and engineered remain category estimates until real ranges are added.

begin;

insert into public.product_ranges (range_id, category, brand, range_label, selection_mode, default_product_id, is_default_recommendation, customer_description, features, image_url, active, display_order)
values
  ('hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'range_only', 'hrt-etf-7mm-hybrid-antique-oak', true, 'ETF 7.0mm Waterproof Hybrid Flooring', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'images/products/hybrid/hrt-etf-7mm-antique-oak.jpg', true, 10),
  ('hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'range_only', 'hrt-etf-8mm-hybrid-alaskan-oak', false, 'ETF 8.0mm Waterproof Hybrid Flooring', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'images/products/hybrid/hrt-etf-8mm-alaskan-oak.jpg', true, 20),
  ('hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'range_only', 'hrt-etf-9mm-hybrid-alaskan-oak', false, 'ETF 9.0mm Waterproof Hybrid Flooring', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'images/products/hybrid/hrt-etf-9mm-alaskan-oak.jpg', true, 30)
on conflict (range_id) do update set
  category = excluded.category,
  brand = excluded.brand,
  range_label = excluded.range_label,
  selection_mode = excluded.selection_mode,
  default_product_id = excluded.default_product_id,
  is_default_recommendation = excluded.is_default_recommendation,
  customer_description = excluded.customer_description,
  features = excluded.features,
  image_url = excluded.image_url,
  active = excluded.active,
  display_order = excluded.display_order;

insert into public.products (product_id, range_id, category, brand, range_label, colour, thickness, price_per_m2, image_url, alt_text, features, selection_mode, is_default_recommendation, active, display_order)
values
  ('hrt-etf-7mm-hybrid-antique-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Antique Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-antique-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Antique Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 10),
  ('hrt-etf-7mm-hybrid-baden-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Baden Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-baden-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Baden Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 20),
  ('hrt-etf-7mm-hybrid-blackbutt', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Blackbutt', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-blackbutt.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Blackbutt colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 30),
  ('hrt-etf-7mm-hybrid-brushbox', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Brushbox', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-brushbox.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Brushbox colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 40),
  ('hrt-etf-7mm-hybrid-caramel-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Caramel Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-caramel-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Caramel Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 50),
  ('hrt-etf-7mm-hybrid-dexter-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Dexter Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-dexter-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Dexter Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 60),
  ('hrt-etf-7mm-hybrid-downtown-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Downtown Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-downtown-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Downtown Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 70),
  ('hrt-etf-7mm-hybrid-driftwood', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Driftwood', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-driftwood.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Driftwood colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 80),
  ('hrt-etf-7mm-hybrid-grey-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Grey Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-grey-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Grey Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 90),
  ('hrt-etf-7mm-hybrid-hatton-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Hatton Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-hatton-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Hatton Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 100),
  ('hrt-etf-7mm-hybrid-helena-oak', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Helena Oak', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-helena-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Helena Oak colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 110),
  ('hrt-etf-7mm-hybrid-holly-hills', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Holly Hills', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-holly-hills.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Holly Hills colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 120),
  ('hrt-etf-7mm-hybrid-jarrah', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Jarrah', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-jarrah.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Jarrah colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 130),
  ('hrt-etf-7mm-hybrid-julan', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Julan', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-julan.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Julan colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 140),
  ('hrt-etf-7mm-hybrid-lake-oak-light', 'hybrid-etf-7mm', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Waterproof Hybrid Flooring', 'Lake Oak Light', '7.0mm', 0, 'images/products/hybrid/hrt-etf-7mm-lake-oak-light.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Lake Oak Light colour sample', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', true, true, 150),
  ('hrt-etf-8mm-hybrid-alaskan-oak', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Alaskan Oak', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-alaskan-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Alaskan Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 160),
  ('hrt-etf-8mm-hybrid-american-oak', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'American Oak', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-american-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring American Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 170),
  ('hrt-etf-8mm-hybrid-coastal-blackbutt', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Coastal Blackbutt', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-coastal-blackbutt.jpg', 'HRT ETF 8.0mm Hybrid Flooring Coastal Blackbutt colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 180),
  ('hrt-etf-8mm-hybrid-driftwood', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Driftwood', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-driftwood.jpg', 'HRT ETF 8.0mm Hybrid Flooring Driftwood colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 190),
  ('hrt-etf-8mm-hybrid-french-oak', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'French Oak', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-french-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring French Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 200),
  ('hrt-etf-8mm-hybrid-grey-oak', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Grey Oak', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-grey-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Grey Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 210),
  ('hrt-etf-8mm-hybrid-helena-oak', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Helena Oak', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-helena-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Helena Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 220),
  ('hrt-etf-8mm-hybrid-natural-oak', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Natural Oak', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-natural-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Natural Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 230),
  ('hrt-etf-8mm-hybrid-new-zealand-blackbutt', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'New Zealand Blackbutt', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-new-zealand-blackbutt.jpg', 'HRT ETF 8.0mm Hybrid Flooring New Zealand Blackbutt colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 240),
  ('hrt-etf-8mm-hybrid-qld-spotted-gum', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'QLD Spotted Gum', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-qld-spotted-gum.jpg', 'HRT ETF 8.0mm Hybrid Flooring QLD Spotted Gum colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 250),
  ('hrt-etf-8mm-hybrid-riverview', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Riverview', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-riverview.jpg', 'HRT ETF 8.0mm Hybrid Flooring Riverview colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 260),
  ('hrt-etf-8mm-hybrid-spotted-gum', 'hybrid-etf-8mm', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Waterproof Hybrid Flooring', 'Spotted Gum', '8.0mm', 0, 'images/products/hybrid/hrt-etf-8mm-spotted-gum.jpg', 'HRT ETF 8.0mm Hybrid Flooring Spotted Gum colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 270),
  ('hrt-etf-9mm-hybrid-alaskan-oak', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Alaskan Oak', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-alaskan-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Alaskan Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 280),
  ('hrt-etf-9mm-hybrid-american-oak', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'American Oak', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-american-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring American Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 290),
  ('hrt-etf-9mm-hybrid-coastal-blackbutt', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Coastal Blackbutt', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-coastal-blackbutt.jpg', 'HRT ETF 9.0mm Hybrid Flooring Coastal Blackbutt colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 300),
  ('hrt-etf-9mm-hybrid-dexter-oak', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Dexter Oak', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-dexter-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Dexter Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 310),
  ('hrt-etf-9mm-hybrid-driftwood', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Driftwood', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-driftwood.jpg', 'HRT ETF 9.0mm Hybrid Flooring Driftwood colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 320),
  ('hrt-etf-9mm-hybrid-french-oak', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'French Oak', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-french-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring French Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 330),
  ('hrt-etf-9mm-hybrid-grey-oak', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Grey Oak', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-grey-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Grey Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 340),
  ('hrt-etf-9mm-hybrid-lake-oak-light', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Lake Oak Light', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-lake-oak-light.jpg', 'HRT ETF 9.0mm Hybrid Flooring Lake Oak Light colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 350),
  ('hrt-etf-9mm-hybrid-natural-oak', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Natural Oak', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-natural-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Natural Oak colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 360),
  ('hrt-etf-9mm-hybrid-new-driftwood', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'New Driftwood', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-new-driftwood.jpg', 'HRT ETF 9.0mm Hybrid Flooring New Driftwood colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 370),
  ('hrt-etf-9mm-hybrid-new-zealand-blackbutt', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'New Zealand Blackbutt', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-new-zealand-blackbutt.jpg', 'HRT ETF 9.0mm Hybrid Flooring New Zealand Blackbutt colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 380),
  ('hrt-etf-9mm-hybrid-oslo-oak-grey', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Oslo Oak Grey', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-oslo-oak-grey.jpg', 'HRT ETF 9.0mm Hybrid Flooring Oslo Oak Grey colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 390),
  ('hrt-etf-9mm-hybrid-qld-spotted-gum', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'QLD Spotted Gum', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-qld-spotted-gum.jpg', 'HRT ETF 9.0mm Hybrid Flooring QLD Spotted Gum colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 400),
  ('hrt-etf-9mm-hybrid-spotted-gum', 'hybrid-etf-9mm', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Waterproof Hybrid Flooring', 'Spotted Gum', '9.0mm', 0, 'images/products/hybrid/hrt-etf-9mm-spotted-gum.jpg', 'HRT ETF 9.0mm Hybrid Flooring Spotted Gum colour sample', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, 'range_only', false, true, 410)
on conflict (product_id) do update set
  range_id = excluded.range_id,
  category = excluded.category,
  brand = excluded.brand,
  range_label = excluded.range_label,
  colour = excluded.colour,
  thickness = excluded.thickness,
  price_per_m2 = coalesce(public.products.price_per_m2, excluded.price_per_m2),
  image_url = excluded.image_url,
  alt_text = excluded.alt_text,
  features = excluded.features,
  selection_mode = excluded.selection_mode,
  is_default_recommendation = excluded.is_default_recommendation,
  active = excluded.active,
  display_order = excluded.display_order;

insert into public.install_rates (category, install_type, install_method, job_type, rate_per_m2, minimum_charge, active)
values
  ('laminate', 'standard', 'floating', 'supply_install', 27, 1500, true),
  ('laminate', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('hybrid', 'standard', 'floating', 'supply_install', 31, 1500, true),
  ('hybrid', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('engineered', 'standard', 'floating', 'supply_install', 39, 1500, true),
  ('engineered', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('engineered', 'standard', 'direct_glue', 'supply_install', 39, 1500, true),
  ('engineered', 'standard', 'direct_glue', 'install_only', 45, 1500, true),
  ('engineered', 'herringbone', 'direct_glue', 'supply_install', 52, 1800, true),
  ('engineered', 'herringbone', 'direct_glue', 'install_only', 64, 1800, true)
on conflict (category, install_type, install_method, job_type) do update set
  minimum_charge = coalesce(public.install_rates.minimum_charge, excluded.minimum_charge),
  active = excluded.active;

insert into public.underlay_options (underlay_id, name, suitable_categories, price_per_m2, active)
values
  ('standard-silver-underlay', 'Standard silver underlay', array['laminate', 'engineered']::text[], 4, true),
  ('acoustic-underlay-premium', 'Premium acoustic underlay', array['laminate', 'engineered']::text[], 6, true),
  ('acoustic-rubber-underlay-5mm', 'Acoustic Rubber Underlay 5mm', array['laminate', 'engineered']::text[], 12, true),
  ('acoustic-rubber-underlay-5mm-glued-down', 'Acoustic Rubber Underlay 5mm glued down', array['engineered']::text[], 12, true)
on conflict (underlay_id) do update set
  name = excluded.name,
  suitable_categories = excluded.suitable_categories,
  price_per_m2 = coalesce(public.underlay_options.price_per_m2, excluded.price_per_m2),
  active = excluded.active;

insert into public.skirting_scotia_options (option_id, type, form_value, material, pricing_method, price, active)
values
  ('skirting-supply-install', 'skirting', 'supply_install', 'MDF skirting', 'allowance_per_m2', 12, true),
  ('skirting-remove-refit', 'remove_existing', 'remove_refit', 'Existing skirting remove / refit', 'allowance_per_m2', 12, true),
  ('scotia-standard', 'scotia', 'yes', 'Matching scotia', 'allowance_per_m2', 8, true)
on conflict (option_id) do update set
  type = excluded.type,
  form_value = excluded.form_value,
  material = excluded.material,
  pricing_method = excluded.pricing_method,
  price = coalesce(public.skirting_scotia_options.price, excluded.price),
  active = excluded.active;

insert into public.removal_rates (removal_id, floor_type, aliases, rate_per_m2, disposal_fee, active)
values
  ('remove-carpet', 'carpet', array['carpet']::text[], 10, 0, true),
  ('remove-floating', 'laminate', array['floating', 'laminate', 'hybrid']::text[], 10, 0, true),
  ('remove-glue-down', 'timber', array['glue_down', 'timber']::text[], 10, 0, true),
  ('remove-tile', 'tile', array['tile']::text[], 10, 0, true),
  ('remove-vinyl', 'vinyl', array['vinyl']::text[], 10, 0, true),
  ('remove-unknown', 'unknown', array['unknown', 'other', 'unsure']::text[], 0, 0, true)
on conflict (removal_id) do update set
  floor_type = excluded.floor_type,
  aliases = excluded.aliases,
  rate_per_m2 = coalesce(public.removal_rates.rate_per_m2, excluded.rate_per_m2),
  disposal_fee = coalesce(public.removal_rates.disposal_fee, excluded.disposal_fee),
  active = excluded.active;

insert into public.location_zones (zone_id, zone_name, suburbs, postcodes, distance_from_base_km, travel_fee, minimum_job_fee, surcharge_percent, fallback, active)
values
  ('auburn-service-zone', 'Auburn Service Zone', array['Auburn', 'Lidcombe', 'Berala']::text[], array['2144', '2141', '2140']::text[], 12, 0, 1500, 0, false, true),
  ('parramatta-service-zone', 'Parramatta Service Zone', array['Parramatta', 'Westmead', 'Granville']::text[], array['2150', '2145', '2142']::text[], 18, 0, 1500, 0, false, true),
  ('liverpool-service-zone', 'Liverpool Service Zone', array['Liverpool', 'Casula', 'Moorebank']::text[], array['2170', '2176', '2171']::text[], 28, 35, 1500, 4, false, true),
  ('blacktown-service-zone', 'Blacktown Service Zone', array['Blacktown', 'Seven Hills', 'Kings Park']::text[], array['2148', '2147', '2148']::text[], 33, 55, 1500, 7, false, true),
  ('miranda-service-zone', 'Miranda Service Zone', array['Miranda', 'Gymea', 'Caringbah']::text[], array['2228', '2227', '2229']::text[], 34, 70, 1500, 10, false, true),
  ('default-sydney-zone', 'Default Sydney Zone', array[]::text[], array[]::text[], 25, 25, 1500, 4, true, true)
on conflict (zone_id) do update set
  zone_name = excluded.zone_name,
  suburbs = excluded.suburbs,
  postcodes = excluded.postcodes,
  distance_from_base_km = coalesce(public.location_zones.distance_from_base_km, excluded.distance_from_base_km),
  travel_fee = coalesce(public.location_zones.travel_fee, excluded.travel_fee),
  minimum_job_fee = coalesce(public.location_zones.minimum_job_fee, excluded.minimum_job_fee),
  surcharge_percent = coalesce(public.location_zones.surcharge_percent, excluded.surcharge_percent),
  fallback = excluded.fallback,
  active = excluded.active;

insert into public.pricing_rules (rule_key, rule_value, description, active, value_type, value_numeric, value_boolean, value_text, notes)
values
  ('standardWastagePercent', '10'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 10, null, null, 'Synced from apps/web/pricingRules.js'),
  ('herringboneWastagePercent', '20'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 20, null, null, 'Synced from apps/web/pricingRules.js'),
  ('materialAreaBasis', '"chargeable_area"'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'text', null, null, 'chargeable_area', 'Synced from apps/web/pricingRules.js'),
  ('labourAreaBasis', '"real_area"'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'text', null, null, 'real_area', 'Synced from apps/web/pricingRules.js'),
  ('underlayAreaBasis', '"chargeable_area"'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'text', null, null, 'chargeable_area', 'Synced from apps/web/pricingRules.js'),
  ('moistureBarrierAreaBasis', '"chargeable_area"'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'text', null, null, 'chargeable_area', 'Synced from apps/web/pricingRules.js'),
  ('skirtingAreaBasis', '"chargeable_area_allowance"'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'text', null, null, 'chargeable_area_allowance', 'Synced from apps/web/pricingRules.js'),
  ('exposeInternalRates', 'false'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'boolean', null, false, null, 'Synced from apps/web/pricingRules.js'),
  ('floorPrepRates', '{"basic":8,"levelling":8}'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'json', null, null, '{"basic":8,"levelling":8}', 'Synced from apps/web/pricingRules.js'),
  ('moistureBarrierRatePerM2', '5'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 5, null, null, 'Synced from apps/web/pricingRules.js'),
  ('furnitureRatePerRoom', '50'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 50, null, null, 'Synced from apps/web/pricingRules.js'),
  ('doorTrimmingRate', '40'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 40, null, null, 'Synced from apps/web/pricingRules.js'),
  ('smallJobThresholdM2', '30'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 30, null, null, 'Synced from apps/web/pricingRules.js'),
  ('smallJobFactor', '1.1'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 1.1, null, null, 'Synced from apps/web/pricingRules.js'),
  ('minimumJobFee', '1500'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 1500, null, null, 'Synced from apps/web/pricingRules.js'),
  ('roundingIncrement', '50'::jsonb, 'Synced from apps/web/pricingRules.js', true, 'number', 50, null, null, 'Synced from apps/web/pricingRules.js')
on conflict (rule_key) do update set
  rule_value = excluded.rule_value,
  description = excluded.description,
  active = excluded.active,
  value_type = excluded.value_type,
  value_numeric = excluded.value_numeric,
  value_boolean = excluded.value_boolean,
  value_text = excluded.value_text,
  notes = excluded.notes;

-- Compatibility seed for existing pricing_* tables used by current Netlify helper functions.
insert into public.pricing_categories (id, label, short_description, default_price_per_m2, page_url, active)
values
  ('laminate', 'Laminate Flooring', 'Cost-conscious flooring with straightforward installation.', 38, 'laminate-flooring-sydney.html', true),
  ('hybrid', 'Hybrid Flooring', 'Practical SPC hybrid flooring for apartments, houses, and busy family homes.', 52, 'hybrid-flooring-sydney.html', true),
  ('engineered', 'Engineered Timber', 'Premium timber look with a stronger material allowance.', 88, 'engineered-timber-flooring-sydney.html', true)
on conflict (id) do update set
  label = excluded.label,
  short_description = excluded.short_description,
  default_price_per_m2 = coalesce(public.pricing_categories.default_price_per_m2, excluded.default_price_per_m2),
  page_url = excluded.page_url,
  active = excluded.active;

insert into public.pricing_products (id, category_id, brand, range_name, colour, tone, swatch, thickness, product_type, price_per_m2, install_rate_override, image_url, alt_text, description, features, suitable_for, supplier, supplier_url, active, sort_order)
values
  ('hrt-etf-7mm-hybrid-antique-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Antique Oak', 'natural oak', '#b99572', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-antique-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Antique Oak colour sample', 'Antique Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 10),
  ('hrt-etf-7mm-hybrid-baden-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Baden Oak', 'light oak', '#cab08f', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-baden-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Baden Oak colour sample', 'Baden Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 20),
  ('hrt-etf-7mm-hybrid-blackbutt', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Blackbutt', 'light oak', '#d0b289', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-blackbutt.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Blackbutt colour sample', 'Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 30),
  ('hrt-etf-7mm-hybrid-brushbox', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Brushbox', 'walnut', '#9e7756', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-brushbox.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Brushbox colour sample', 'Brushbox is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 40),
  ('hrt-etf-7mm-hybrid-caramel-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Caramel Oak', 'natural oak', '#b6865a', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-caramel-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Caramel Oak colour sample', 'Caramel Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 50),
  ('hrt-etf-7mm-hybrid-dexter-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Dexter Oak', 'grey', '#a7a29a', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-dexter-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Dexter Oak colour sample', 'Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 60),
  ('hrt-etf-7mm-hybrid-downtown-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Downtown Oak', 'grey', '#8c837b', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-downtown-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Downtown Oak colour sample', 'Downtown Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 70),
  ('hrt-etf-7mm-hybrid-driftwood', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Driftwood', 'grey', '#b0a599', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-driftwood.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Driftwood colour sample', 'Driftwood is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 80),
  ('hrt-etf-7mm-hybrid-grey-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Grey Oak', 'grey', '#929290', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-grey-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Grey Oak colour sample', 'Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 90),
  ('hrt-etf-7mm-hybrid-hatton-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Hatton Oak', 'natural oak', '#b2906e', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-hatton-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Hatton Oak colour sample', 'Hatton Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 100),
  ('hrt-etf-7mm-hybrid-helena-oak', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Helena Oak', 'light oak', '#d4bc99', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-helena-oak.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Helena Oak colour sample', 'Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 110),
  ('hrt-etf-7mm-hybrid-holly-hills', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Holly Hills', 'natural oak', '#c1a583', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-holly-hills.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Holly Hills colour sample', 'Holly Hills is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 120),
  ('hrt-etf-7mm-hybrid-jarrah', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Jarrah', 'dark', '#744d39', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-jarrah.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Jarrah colour sample', 'Jarrah is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 130),
  ('hrt-etf-7mm-hybrid-julan', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Julan', 'walnut', '#8d6549', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-julan.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Julan colour sample', 'Julan is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 140),
  ('hrt-etf-7mm-hybrid-lake-oak-light', 'hybrid', 'ETF Hybrid 7.0mm', 'ETF 7.0mm Hybrid Waterproof Flooring', 'Lake Oak Light', 'light oak', '#d7c4a7', '7.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-7mm-lake-oak-light.jpg', 'HRT ETF 7.0mm Hybrid Waterproof Flooring Lake Oak Light colour sample', 'Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.', '["SPC hybrid core","Waterproof core","Pre-attached acoustic underlay","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/', true, 150),
  ('hrt-etf-8mm-hybrid-alaskan-oak', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Alaskan Oak', 'light oak', '#c9b28e', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-alaskan-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Alaskan Oak colour sample', 'Alaskan Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 160),
  ('hrt-etf-8mm-hybrid-american-oak', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'American Oak', 'natural oak', '#c09a78', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-american-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring American Oak colour sample', 'American Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 170),
  ('hrt-etf-8mm-hybrid-coastal-blackbutt', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Coastal Blackbutt', 'light oak', '#ccb089', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-coastal-blackbutt.jpg', 'HRT ETF 8.0mm Hybrid Flooring Coastal Blackbutt colour sample', 'Coastal Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 180),
  ('hrt-etf-8mm-hybrid-driftwood', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Driftwood', 'grey', '#b0a599', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-driftwood.jpg', 'HRT ETF 8.0mm Hybrid Flooring Driftwood colour sample', 'Driftwood is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 190),
  ('hrt-etf-8mm-hybrid-french-oak', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'French Oak', 'natural oak', '#b99976', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-french-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring French Oak colour sample', 'French Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 200),
  ('hrt-etf-8mm-hybrid-grey-oak', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Grey Oak', 'grey', '#929290', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-grey-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Grey Oak colour sample', 'Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 210),
  ('hrt-etf-8mm-hybrid-helena-oak', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Helena Oak', 'light oak', '#d4bc99', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-helena-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Helena Oak colour sample', 'Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 220),
  ('hrt-etf-8mm-hybrid-natural-oak', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Natural Oak', 'natural oak', '#d3b48f', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-natural-oak.jpg', 'HRT ETF 8.0mm Hybrid Flooring Natural Oak colour sample', 'Natural Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 230),
  ('hrt-etf-8mm-hybrid-new-zealand-blackbutt', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'New Zealand Blackbutt', 'natural oak', '#ba9a73', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-new-zealand-blackbutt.jpg', 'HRT ETF 8.0mm Hybrid Flooring New Zealand Blackbutt colour sample', 'New Zealand Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 240),
  ('hrt-etf-8mm-hybrid-qld-spotted-gum', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'QLD Spotted Gum', 'warm brown', '#9b7454', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-qld-spotted-gum.jpg', 'HRT ETF 8.0mm Hybrid Flooring QLD Spotted Gum colour sample', 'QLD Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 250),
  ('hrt-etf-8mm-hybrid-riverview', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Riverview', 'natural oak', '#b49b83', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-riverview.jpg', 'HRT ETF 8.0mm Hybrid Flooring Riverview colour sample', 'Riverview is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 260),
  ('hrt-etf-8mm-hybrid-spotted-gum', 'hybrid', 'ETF Hybrid 8.0mm', 'ETF 8.0mm Hybrid Flooring', 'Spotted Gum', 'warm brown', '#a57d5c', '8.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-8mm-spotted-gum.jpg', 'HRT ETF 8.0mm Hybrid Flooring Spotted Gum colour sample', 'Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/', true, 270),
  ('hrt-etf-9mm-hybrid-alaskan-oak', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Alaskan Oak', 'light oak', '#c9b28e', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-alaskan-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Alaskan Oak colour sample', 'Alaskan Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 280),
  ('hrt-etf-9mm-hybrid-american-oak', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'American Oak', 'natural oak', '#c09a78', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-american-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring American Oak colour sample', 'American Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 290),
  ('hrt-etf-9mm-hybrid-coastal-blackbutt', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Coastal Blackbutt', 'light oak', '#ccb089', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-coastal-blackbutt.jpg', 'HRT ETF 9.0mm Hybrid Flooring Coastal Blackbutt colour sample', 'Coastal Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 300),
  ('hrt-etf-9mm-hybrid-dexter-oak', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Dexter Oak', 'grey', '#a7a29a', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-dexter-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Dexter Oak colour sample', 'Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 310),
  ('hrt-etf-9mm-hybrid-driftwood', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Driftwood', 'grey', '#b0a599', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-driftwood.jpg', 'HRT ETF 9.0mm Hybrid Flooring Driftwood colour sample', 'Driftwood is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 320),
  ('hrt-etf-9mm-hybrid-french-oak', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'French Oak', 'natural oak', '#b99976', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-french-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring French Oak colour sample', 'French Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 330),
  ('hrt-etf-9mm-hybrid-grey-oak', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Grey Oak', 'grey', '#929290', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-grey-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Grey Oak colour sample', 'Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 340),
  ('hrt-etf-9mm-hybrid-lake-oak-light', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Lake Oak Light', 'light oak', '#d7c4a7', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-lake-oak-light.jpg', 'HRT ETF 9.0mm Hybrid Flooring Lake Oak Light colour sample', 'Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 350),
  ('hrt-etf-9mm-hybrid-natural-oak', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Natural Oak', 'natural oak', '#d3b48f', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-natural-oak.jpg', 'HRT ETF 9.0mm Hybrid Flooring Natural Oak colour sample', 'Natural Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 360),
  ('hrt-etf-9mm-hybrid-new-driftwood', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'New Driftwood', 'grey', '#a9a096', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-new-driftwood.jpg', 'HRT ETF 9.0mm Hybrid Flooring New Driftwood colour sample', 'New Driftwood is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 370),
  ('hrt-etf-9mm-hybrid-new-zealand-blackbutt', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'New Zealand Blackbutt', 'natural oak', '#ba9a73', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-new-zealand-blackbutt.jpg', 'HRT ETF 9.0mm Hybrid Flooring New Zealand Blackbutt colour sample', 'New Zealand Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 380),
  ('hrt-etf-9mm-hybrid-oslo-oak-grey', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Oslo Oak Grey', 'grey', '#8f8d8b', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-oslo-oak-grey.jpg', 'HRT ETF 9.0mm Hybrid Flooring Oslo Oak Grey colour sample', 'Oslo Oak Grey is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 390),
  ('hrt-etf-9mm-hybrid-qld-spotted-gum', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'QLD Spotted Gum', 'warm brown', '#9b7454', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-qld-spotted-gum.jpg', 'HRT ETF 9.0mm Hybrid Flooring QLD Spotted Gum colour sample', 'QLD Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 400),
  ('hrt-etf-9mm-hybrid-spotted-gum', 'hybrid', 'ETF Hybrid 9.0mm', 'ETF 9.0mm Hybrid Flooring', 'Spotted Gum', 'warm brown', '#a57d5c', '9.0mm', 'SPC Hybrid', 0, null, 'images/products/hybrid/hrt-etf-9mm-spotted-gum.jpg', 'HRT ETF 9.0mm Hybrid Flooring Spotted Gum colour sample', 'Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.', '["SPC hybrid core","Waterproof core","Scratch and stain resistant surface","Floating click-lock installation"]'::jsonb, '["Living areas","Bedrooms","Apartments","Rental properties","Family homes"]'::jsonb, 'HRT Timber Flooring', 'https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/', true, 410)
on conflict (id) do update set
  category_id = excluded.category_id,
  brand = excluded.brand,
  range_name = excluded.range_name,
  colour = excluded.colour,
  tone = excluded.tone,
  swatch = excluded.swatch,
  thickness = excluded.thickness,
  product_type = excluded.product_type,
  price_per_m2 = coalesce(public.pricing_products.price_per_m2, excluded.price_per_m2),
  install_rate_override = coalesce(public.pricing_products.install_rate_override, excluded.install_rate_override),
  image_url = excluded.image_url,
  alt_text = excluded.alt_text,
  description = excluded.description,
  features = excluded.features,
  suitable_for = excluded.suitable_for,
  supplier = excluded.supplier,
  supplier_url = excluded.supplier_url,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.pricing_install_rates (id, category_id, install_type, install_method, job_type, rate_per_m2, minimum_charge, active)
values
  ('laminate-standard-supply-install', 'laminate', 'standard', 'floating', 'supply_install', 27, 1500, true),
  ('laminate-standard-install-only', 'laminate', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('hybrid-standard-supply-install', 'hybrid', 'standard', 'floating', 'supply_install', 31, 1500, true),
  ('hybrid-standard-install-only', 'hybrid', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('engineered-standard-supply-install', 'engineered', 'standard', 'floating', 'supply_install', 39, 1500, true),
  ('engineered-standard-install-only', 'engineered', 'standard', 'floating', 'install_only', 45, 1500, true),
  ('engineered-standard-direct-glue-supply-install', 'engineered', 'standard', 'direct_glue', 'supply_install', 39, 1500, true),
  ('engineered-standard-direct-glue-install-only', 'engineered', 'standard', 'direct_glue', 'install_only', 45, 1500, true),
  ('engineered-herringbone-direct-glue-supply-install', 'engineered', 'herringbone', 'direct_glue', 'supply_install', 52, 1800, true),
  ('engineered-herringbone-direct-glue-install-only', 'engineered', 'herringbone', 'direct_glue', 'install_only', 64, 1800, true)
on conflict (id) do update set
  category_id = excluded.category_id,
  install_type = excluded.install_type,
  install_method = excluded.install_method,
  job_type = excluded.job_type,
  rate_per_m2 = coalesce(public.pricing_install_rates.rate_per_m2, excluded.rate_per_m2),
  minimum_charge = coalesce(public.pricing_install_rates.minimum_charge, excluded.minimum_charge),
  active = excluded.active;

insert into public.pricing_underlay_options (id, name, suitable_categories, price_per_m2, active)
values
  ('standard-silver-underlay', 'Standard silver underlay', '["laminate","engineered"]'::jsonb, 4, true),
  ('acoustic-underlay-premium', 'Premium acoustic underlay', '["laminate","engineered"]'::jsonb, 6, true),
  ('acoustic-rubber-underlay-5mm', 'Acoustic Rubber Underlay 5mm', '["laminate","engineered"]'::jsonb, 12, true),
  ('acoustic-rubber-underlay-5mm-glued-down', 'Acoustic Rubber Underlay 5mm glued down', '["engineered"]'::jsonb, 12, true)
on conflict (id) do update set
  name = excluded.name,
  suitable_categories = excluded.suitable_categories,
  price_per_m2 = coalesce(public.pricing_underlay_options.price_per_m2, excluded.price_per_m2),
  active = excluded.active;

insert into public.pricing_trim_options (id, type, form_value, material, pricing_method, price, active)
values
  ('skirting-supply-install', 'skirting', 'supply_install', 'MDF skirting', 'allowance_per_m2', 12, true),
  ('skirting-remove-refit', 'remove_existing', 'remove_refit', 'Existing skirting remove / refit', 'allowance_per_m2', 12, true),
  ('scotia-standard', 'scotia', 'yes', 'Matching scotia', 'allowance_per_m2', 8, true)
on conflict (id) do update set
  type = excluded.type,
  form_value = excluded.form_value,
  material = excluded.material,
  pricing_method = excluded.pricing_method,
  price = coalesce(public.pricing_trim_options.price, excluded.price),
  active = excluded.active;

insert into public.pricing_removal_rates (id, floor_type, aliases, rate_per_m2, disposal_fee, active)
values
  ('remove-carpet', 'carpet', '["carpet"]'::jsonb, 10, 0, true),
  ('remove-floating', 'laminate', '["floating","laminate","hybrid"]'::jsonb, 10, 0, true),
  ('remove-glue-down', 'timber', '["glue_down","timber"]'::jsonb, 10, 0, true),
  ('remove-tile', 'tile', '["tile"]'::jsonb, 10, 0, true),
  ('remove-vinyl', 'vinyl', '["vinyl"]'::jsonb, 10, 0, true),
  ('remove-unknown', 'unknown', '["unknown","other","unsure"]'::jsonb, 0, 0, true)
on conflict (id) do update set
  floor_type = excluded.floor_type,
  aliases = excluded.aliases,
  rate_per_m2 = coalesce(public.pricing_removal_rates.rate_per_m2, excluded.rate_per_m2),
  disposal_fee = coalesce(public.pricing_removal_rates.disposal_fee, excluded.disposal_fee),
  active = excluded.active;

insert into public.pricing_location_zones (id, zone_name, suburbs, postcodes, distance_from_base_km, travel_fee, minimum_job_fee, surcharge_percent, fallback, active)
values
  ('auburn-service-zone', 'Auburn Service Zone', '["Auburn","Lidcombe","Berala"]'::jsonb, '["2144","2141","2140"]'::jsonb, 12, 0, 1500, 0, false, true),
  ('parramatta-service-zone', 'Parramatta Service Zone', '["Parramatta","Westmead","Granville"]'::jsonb, '["2150","2145","2142"]'::jsonb, 18, 0, 1500, 0, false, true),
  ('liverpool-service-zone', 'Liverpool Service Zone', '["Liverpool","Casula","Moorebank"]'::jsonb, '["2170","2176","2171"]'::jsonb, 28, 35, 1500, 4, false, true),
  ('blacktown-service-zone', 'Blacktown Service Zone', '["Blacktown","Seven Hills","Kings Park"]'::jsonb, '["2148","2147","2148"]'::jsonb, 33, 55, 1500, 7, false, true),
  ('miranda-service-zone', 'Miranda Service Zone', '["Miranda","Gymea","Caringbah"]'::jsonb, '["2228","2227","2229"]'::jsonb, 34, 70, 1500, 10, false, true),
  ('default-sydney-zone', 'Default Sydney Zone', '[]'::jsonb, '[]'::jsonb, 25, 25, 1500, 4, true, true)
on conflict (id) do update set
  zone_name = excluded.zone_name,
  suburbs = excluded.suburbs,
  postcodes = excluded.postcodes,
  distance_from_base_km = coalesce(public.pricing_location_zones.distance_from_base_km, excluded.distance_from_base_km),
  travel_fee = coalesce(public.pricing_location_zones.travel_fee, excluded.travel_fee),
  minimum_job_fee = coalesce(public.pricing_location_zones.minimum_job_fee, excluded.minimum_job_fee),
  surcharge_percent = coalesce(public.pricing_location_zones.surcharge_percent, excluded.surcharge_percent),
  fallback = excluded.fallback,
  active = excluded.active;

commit;
