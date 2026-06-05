const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

const tables = [
  "operon_leads",
  "operon_lead_events",
  "operon_lead_notes",
  "operon_lead_files",
  "operon_follow_ups",
  "operon_floorplan_reviews",
  "operon_lead_status_history"
];

const docs = [
  "internal-docs/apps-web/STAGE3_LEAD_OS_IMPLEMENTATION_STATUS.md",
  "internal-docs/apps-web/STAGE3_ADMIN_DASHBOARD_MVP_PLAN.md",
  "internal-docs/apps-web/STAGE3_LEAD_DATA_DICTIONARY.md",
  "internal-docs/apps-web/STAGE3_SUPABASE_SCHEMA_VERIFICATION_2026-06-05.md",
  "supabase/migrations/20260604_stage3_lead_operating_system.sql"
];

const checklistDocs = [
  {
    path: "internal-docs/apps-web/TASK_3_7_STATUS_PIPELINE_CHECKLIST.md",
    terms: ["operon_lead_status_history", "operon_lead_events", "admin-update-lead-status", "No auto-email"]
  },
  {
    path: "internal-docs/apps-web/TASK_3_9_QUOTE_REVIEW_QUEUE_CHECKLIST.md",
    terms: ["operon_quote_reviews", "raw OCR text", "storage bucket/path", "Quote-review public page still works"]
  },
  {
    path: "internal-docs/apps-web/TASK_3_10_FLOORPLAN_REVIEW_QUEUE_CHECKLIST.md",
    terms: ["operon_floorplan_reviews", "operon_uploaded_files", "No public bucket/path exposure", "Quote handoff remains intact"]
  },
  {
    path: "internal-docs/apps-web/TASK_3_11_REPORTING_DASHBOARD_CHECKLIST.md",
    terms: ["Lead volume", "Product category mix", "No internal rates", "No public analytics dashboard"]
  },
  {
    path: "internal-docs/apps-web/TASK_3_12_SECURITY_AUDIT_CHECKLIST.md",
    terms: ["noindex,nofollow", "`anon` has no SELECT", "quote-files", "Source map probes pass"]
  }
];

function main() {
  docs.forEach(function (relativePath) {
    const content = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
    tables.forEach(function (table) {
      assert.ok(content.includes(table), relativePath + " missing Stage 3 table: " + table);
    });
  });

  checklistDocs.forEach(function (doc) {
    const content = fs.readFileSync(path.join(repoRoot, doc.path), "utf8");
    doc.terms.forEach(function (term) {
      assert.ok(content.includes(term), doc.path + " missing checklist guardrail: " + term);
    });
  });

  const migration = fs.readFileSync(
    path.join(repoRoot, "supabase/migrations/20260604_stage3_lead_operating_system.sql"),
    "utf8"
  );
  const fkIndexMigration = fs.readFileSync(
    path.join(repoRoot, "supabase/migrations/20260604_stage3_lead_fk_indexes.sql"),
    "utf8"
  );
  [
    "alter table public.operon_leads enable row level security",
    "revoke all on table public.operon_leads from anon, authenticated",
    "grant all on table public.operon_leads to service_role"
  ].forEach(function (snippet) {
    assert.ok(migration.includes(snippet), "Migration missing security snippet: " + snippet);
  });

  const verification = fs.readFileSync(
    path.join(repoRoot, "internal-docs/apps-web/STAGE3_SUPABASE_SCHEMA_VERIFICATION_2026-06-05.md"),
    "utf8"
  );
  [
    "No customer rows were dumped",
    "anon and authenticated have zero table grants",
    "operon_leads: 0 rows",
    "Backfill remains a separate approval step",
    "Stage 3 Function write integrations are local-only and have not been deployed"
  ].forEach(function (snippet) {
    assert.ok(verification.includes(snippet), "Supabase verification note missing safeguard/snippet: " + snippet);
  });

  [
    "operon_floorplan_reviews_lead_id_idx",
    "operon_follow_ups_lead_id_idx",
    "operon_lead_files_lead_id_idx",
    "operon_lead_notes_lead_id_idx"
  ].forEach(function (snippet) {
    assert.ok(fkIndexMigration.includes(snippet), "FK index migration missing snippet: " + snippet);
  });

  const backfill = fs.readFileSync(
    path.join(repoRoot, "internal-docs/apps-web/STAGE3_LEAD_BACKFILL_SQL_DRAFT.sql"),
    "utf8"
  );
  [
    "Do not run without a fresh backup and approval.",
    "rollback;",
    "insert into public.operon_leads",
    "update public.operon_quote_requests qr",
    "update public.operon_quote_reviews qrv",
    "update public.operon_uploaded_files uf",
    "insert into public.operon_lead_events"
  ].forEach(function (snippet) {
    assert.ok(backfill.includes(snippet), "Backfill draft missing safeguard/snippet: " + snippet);
  });

  const rollback = fs.readFileSync(
    path.join(repoRoot, "internal-docs/apps-web/STAGE3_LEAD_SCHEMA_ROLLBACK_SQL_DRAFT.sql"),
    "utf8"
  );
  [
    "Do not run unless an approved rollback is required.",
    "drop table if exists public.operon_leads",
    "drop column if exists lead_id",
    "rollback;"
  ].forEach(function (snippet) {
    assert.ok(rollback.includes(snippet), "Rollback draft missing safeguard/snippet: " + snippet);
  });

  console.log("stage3SchemaDocsContract.test.js passed");
}

main();
