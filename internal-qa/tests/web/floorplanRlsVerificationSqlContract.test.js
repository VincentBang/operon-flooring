"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const verificationPath = path.join(repoRoot, "supabase", "migrations", "drafts", "floorplan_measurement_phase2_rls_verification.sql");
const source = fs.readFileSync(verificationPath, "utf8");

[
  "operon_floorplan_measurement_sessions",
  "operon_floorplan_measurement_versions",
  "operon_floorplan_measurement_sections",
  "operon_floorplan_measurement_review_events",
  "operon_floorplan_quote_links",
  "table_privileges",
  "rls_status",
  "pg_policies",
  "graphql_sensitive_grants",
  "anon",
  "authenticated",
  "service_role",
  "has_table_privilege",
  "information_schema.role_table_grants"
].forEach(function (term) {
  assert.ok(source.includes(term), "Floorplan RLS verification SQL missing `" + term + "`.");
});

[
  "from public.operon_floorplan_measurement_sessions",
  "from public.operon_floorplan_measurement_versions",
  "from public.operon_floorplan_measurement_sections",
  "from public.operon_floorplan_measurement_review_events",
  "from public.operon_floorplan_quote_links",
  "select *",
  "storage.objects"
].forEach(function (term) {
  assert.equal(source.toLowerCase().includes(term.toLowerCase()), false, "Floorplan RLS verification SQL should not dump rows or inspect unrelated storage via `" + term + "`.");
});

console.log("floorplanRlsVerificationSqlContract.test.js passed");
