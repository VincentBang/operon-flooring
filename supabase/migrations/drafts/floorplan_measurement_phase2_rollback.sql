-- Rollback draft for Operon Flooring Floorplan Phase 2 additive schema.
-- Review before applying. This drops only the Phase 2 tables/triggers/functions.

drop trigger if exists operon_floorplan_measurement_version_immutable_guard
  on public.operon_floorplan_measurement_versions;
drop trigger if exists operon_floorplan_sessions_set_updated_at
  on public.operon_floorplan_measurement_sessions;

drop table if exists public.operon_floorplan_quote_links;
drop table if exists public.operon_floorplan_measurement_review_events;
drop table if exists public.operon_floorplan_measurement_sections;
drop table if exists public.operon_floorplan_measurement_versions;
drop table if exists public.operon_floorplan_measurement_sessions;

drop function if exists public.operon_floorplan_measurement_version_immutable_guard();
drop function if exists public.operon_floorplan_sessions_set_updated_at();
