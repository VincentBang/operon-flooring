"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const migrationPath = path.join(repoRoot, "supabase", "migrations", "20260623_floorplan_measurement_phase2.sql");
const rollbackPath = path.join(repoRoot, "supabase", "migrations", "drafts", "floorplan_measurement_phase2_rollback.sql");
const verificationPath = path.join(repoRoot, "supabase", "migrations", "drafts", "floorplan_measurement_phase2_rls_verification.sql");

const migration = fs.readFileSync(migrationPath, "utf8");
const rollback = fs.readFileSync(rollbackPath, "utf8");
const verification = fs.readFileSync(verificationPath, "utf8");
const migrationLower = migration.toLowerCase();

const requiredTables = [
  "operon_floorplan_measurement_sessions",
  "operon_floorplan_measurement_versions",
  "operon_floorplan_measurement_sections",
  "operon_floorplan_measurement_review_events",
  "operon_floorplan_quote_links"
];

requiredTables.forEach(function (table) {
  assert.ok(migration.includes("create table if not exists public." + table), "Phase 2 migration must create `" + table + "`.");
  assert.ok(migration.includes("alter table public." + table + " enable row level security"), "`" + table + "` must enable RLS.");
  assert.ok(migration.includes("revoke all on table public." + table + " from anon, authenticated"), "`" + table + "` must revoke anon/authenticated.");
  assert.ok(migration.includes("grant all on table public." + table + " to service_role"), "`" + table + "` must grant service_role writes.");
  assert.ok(rollback.includes("drop table if exists public." + table), "Rollback must drop `" + table + "`.");
  assert.ok(verification.includes("'" + table + "'"), "Verification SQL must include `" + table + "`.");
});

[
  "lead_id uuid references public.operon_leads(id) on delete set null",
  "quote_request_id uuid references public.operon_quote_requests(id) on delete set null",
  "uploaded_file_id uuid references public.operon_uploaded_files(id) on delete set null",
  "current_customer_version_id uuid",
  "current_review_version_id uuid",
  "approved_version_id uuid",
  "selected_area_m2 numeric(10, 3) not null default 0 check (selected_area_m2 >= 0)",
  "measured_area_m2 numeric(10, 3) not null default 0 check (measured_area_m2 >= 0)",
  "adjusted_area_m2 numeric(10, 3) not null default 0 check (adjusted_area_m2 >= 0)",
  "unique (measurement_session_id, version_number)",
  "geometry_json jsonb not null",
  "event_type text not null check",
  "approved_area_m2 numeric(10, 3) not null default 0 check (approved_area_m2 >= 0)"
].forEach(function (term) {
  assert.ok(migration.includes(term), "Phase 2 migration missing required schema term `" + term + "`.");
});

[
  "operon_floorplan_sessions_set_updated_at",
  "set search_path = public",
  "operon_floorplan_measurement_version_immutable_guard",
  "Immutable floorplan measurement versions cannot be updated",
  "Immutable floorplan measurement versions cannot be deleted",
  "revoke execute on function public.operon_floorplan_sessions_set_updated_at() from public",
  "revoke execute on function public.operon_floorplan_measurement_version_immutable_guard() from public"
].forEach(function (term) {
  assert.ok(migration.includes(term), "Phase 2 migration missing trigger/security term `" + term + "`.");
});

[
  "operon_floorplan_measurement_sessions_status_idx",
  "operon_floorplan_measurement_sessions_lead_idx",
  "operon_floorplan_measurement_sessions_quote_idx",
  "operon_floorplan_measurement_sessions_upload_idx",
  "operon_floorplan_measurement_versions_session_idx",
  "operon_floorplan_measurement_sections_version_idx",
  "operon_floorplan_measurement_events_session_idx",
  "operon_floorplan_quote_links_quote_idx"
].forEach(function (term) {
  assert.ok(migration.includes(term), "Phase 2 migration missing index `" + term + "`.");
});

[
  "policy ",
  "grant all on table public.operon_floorplan_measurement_sessions to anon",
  "grant all on table public.operon_floorplan_measurement_sessions to authenticated",
  "storage_bucket",
  "file_path",
  "signed_url",
  "supplier_cost",
  "gross_margin",
  "internal_rate",
  "pricing_rules"
].forEach(function (term) {
  assert.equal(migrationLower.includes(term.toLowerCase()), false, "Phase 2 migration must not expose public policy or sensitive field `" + term + "`.");
});

[
  "table_privileges",
  "rls_status",
  "policies",
  "graphql_sensitive_grants",
  "has_table_privilege",
  "information_schema.role_table_grants"
].forEach(function (term) {
  assert.ok(verification.includes(term), "Phase 2 verification SQL missing `" + term + "`.");
});

console.log("floorplanMeasurementPhase2SchemaContract.test.js passed");
