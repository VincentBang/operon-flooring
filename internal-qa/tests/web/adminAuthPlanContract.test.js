const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const planPath = path.join(
  repoRoot,
  "internal-docs",
  "apps-web",
  "STAGE3_ADMIN_AUTH_SHELL_PLAN.md"
);
const checklistPath = path.join(
  repoRoot,
  "internal-docs",
  "apps-web",
  "TASK_3_4_ADMIN_AUTH_SHELL_IMPLEMENTATION_CHECKLIST.md"
);
const decisionMatrixPath = path.join(
  repoRoot,
  "internal-docs",
  "apps-web",
  "STAGE3_ADMIN_AUTH_DECISION_MATRIX.md"
);
const routeSurfacePath = path.join(
  repoRoot,
  "internal-docs",
  "apps-web",
  "STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md"
);

function assertIncludesAll(documentText, requiredTerms, label) {
  requiredTerms.forEach(function (term) {
    assert.ok(
      documentText.includes(term),
      label + " should include `" + term + "`."
    );
  });
}

function assertExcludesAll(documentText, forbiddenTerms, label) {
  forbiddenTerms.forEach(function (term) {
    assert.strictEqual(
      documentText.includes(term),
      false,
      label + " should not include stale wording `" + term + "`."
    );
  });
}

function main() {
  const plan = fs.readFileSync(planPath, "utf8");
  const checklist = fs.readFileSync(checklistPath, "utf8");
  const decisionMatrix = fs.readFileSync(decisionMatrixPath, "utf8");
  const routeSurface = fs.readFileSync(routeSurfacePath, "utf8");

  assertIncludesAll(plan, [
    "A locked local admin shell has been scaffolded at `/admin.html`.",
    "This scaffold is not a completed admin auth implementation.",
    "It renders no lead, quote, upload, OCR, contact, or pricing data.",
    "`/admin` behavior must be explicitly accepted, redirected, or blocked before any deploy",
    "`/admin.html` is excluded from sitemap",
    "`/admin` route behavior reviewed so it does not create an unwanted indexable duplicate surface.",
    "STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md"
  ], "Admin auth plan");

  assertIncludesAll(checklist, [
    "Do not connect real admin data until admin auth approach is approved.",
    "A locked `/admin.html` shell has been scaffolded for static safety checks.",
    "This local shell is not the completed admin auth implementation.",
    "Add locked `/admin` route. Status: local scaffold complete.",
    "Decide whether `/admin` should redirect, 404, or remain documented as a non-indexable duplicate surface."
  ], "Admin auth checklist");

  assertIncludesAll(decisionMatrix, [
    "Do not connect `admin-leads-list`, `admin-lead-detail`, status updates, notes, file access, or follow-up actions until one admin auth approach is approved.",
    "Admin routes stay `noindex,nofollow`.",
    "Unauthenticated admin Functions return 401 or 403.",
    "Admin Functions use `Cache-Control: no-store`.",
    "Browser never directly selects `operon_leads` or related lead tables.",
    "Option A: Netlify Identity Invite-Only",
    "Option B: Supabase Auth Admin Claims",
    "Option C: Temporary Environment Admin Token",
    "How Functions validate the role.",
    "Whether `/admin` redirects, 404s, or remains documented separately from `/admin.html`.",
    "Route-surface decision recorded in `STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md`.",
    "Lead write preview verification has not passed."
  ], "Admin auth decision matrix");

  assertIncludesAll(routeSurface, [
    "Static export generates `out/admin.html`.",
    "`netlify.toml` now defines `/admin` -> `/admin.html` as a forced 301 redirect.",
    "`netlify.toml` also defines `/internal/floorplan-measurements` -> `/internal/floorplan-measurements.html` as a forced 301 redirect.",
    "Option A: Redirect `/admin` to `/admin.html`",
    "`/admin` returns an indexable 200.",
    "`/admin.html` appears in sitemap.",
    "The extensionless protected routes return indexable 200 surfaces."
  ], "Admin route surface decision");

  assertExcludesAll(plan, [
    "before coding a protected internal dashboard shell"
  ], "Admin auth plan");

  console.log("adminAuthPlanContract.test.js passed");
}

main();
