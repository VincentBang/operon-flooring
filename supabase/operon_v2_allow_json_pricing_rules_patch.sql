-- Patch for clean v2 schemas created before JSON pricing rules were allowed.
-- Run this once if operon_v2_copy_from_legacy.sql fails on
-- operon_pricing_rules_value_type_check with value_type = 'json'.

alter table public.operon_pricing_rules
  drop constraint if exists operon_pricing_rules_value_type_check;

alter table public.operon_pricing_rules
  add constraint operon_pricing_rules_value_type_check
  check (value_type in ('number', 'boolean', 'text', 'json'));
