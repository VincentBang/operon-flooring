const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const sourcePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "page.tsx");
const changesetReviewPath = path.join(repoRoot, "internal-docs", "apps-web", "LOCAL_CHANGESET_REVIEW_2026-06-04.md");
const routeSurfaceDecisionPath = path.join(repoRoot, "internal-docs", "apps-web", "STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md");
const netlifyConfigPath = path.join(repoRoot, "netlify.toml");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");
const adminOutput = path.join(outRoot, "admin.html");
const adminPayloadOutput = path.join(outRoot, "admin.txt");
const sitemapPath = path.join(outRoot, "sitemap.xml");

function assertSourceShellSafe() {
  const source = fs.readFileSync(sourcePath, "utf8");

  [
    'robots: "noindex,nofollow"',
    'path: "/admin.html"',
    "Admin access required",
    "No lead data is rendered here"
  ].forEach(function (term) {
    assert.ok(source.includes(term), "Admin shell source missing `" + term + "`.");
  });

  [
    "fetch(",
    "createClient",
    "supabase",
    "localStorage",
    "sessionStorage",
    "operon_leads",
    "operon_quote_requests",
    "service_role"
  ].forEach(function (term) {
    assert.strictEqual(source.includes(term), false, "Admin shell source must not include `" + term + "`.");
  });
}

function assertOutputShellSafe() {
  assert.ok(fs.existsSync(adminOutput), "Admin shell output missing. Run npm run build in apps/web-tsx first.");
  assert.ok(fs.existsSync(adminPayloadOutput), "Admin shell RSC payload output missing. Run npm run build in apps/web-tsx first.");
  const html = fs.readFileSync(adminOutput, "utf8");
  const payload = fs.readFileSync(adminPayloadOutput, "utf8");

  [
    '<meta name="robots" content="noindex,nofollow"/>',
    "Admin access required",
    "approved admin token is verified",
    "No lead data is rendered here"
  ].forEach(function (term) {
    assert.ok(html.includes(term), "Admin shell output missing `" + term + "`.");
  });

  [
    "operon_leads",
    "operon_quote_requests",
    "customer@example.com",
    "storage_bucket",
    "file_path",
    "service_role",
    "supplierCost",
    "grossMargin",
    "internalRate"
  ].forEach(function (term) {
    assert.strictEqual(html.includes(term), false, "Admin shell output must not expose `" + term + "`.");
    assert.strictEqual(payload.includes(term), false, "Admin shell RSC payload must not expose `" + term + "`.");
  });

  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  assert.strictEqual(sitemap.includes("https://operonflooring.com.au/admin.html"), false, "Admin shell must stay out of sitemap.");
}

function assertDeployReviewWarningExists() {
  const review = fs.readFileSync(changesetReviewPath, "utf8");
  const routeSurfaceDecision = fs.readFileSync(routeSurfaceDecisionPath, "utf8");
  const netlifyConfig = fs.readFileSync(netlifyConfigPath, "utf8");
  [
    "Before any deploy, verify `/admin.html` is noindex and locked",
    "Verify `/admin` redirects to `/admin.html`",
    "Verify `/internal/floorplan-measurements` redirects to `/internal/floorplan-measurements.html`",
    "Keep `/admin.html` out of sitemap",
    "STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md"
  ].forEach(function (term) {
    assert.ok(review.includes(term), "Local changeset review missing admin deploy warning: " + term);
  });

  [
    "Option A: Redirect `/admin` to `/admin.html`",
    "`netlify.toml` now defines `/admin` -> `/admin.html` as a forced 301 redirect.",
    "`netlify.toml` also defines `/internal/floorplan-measurements` -> `/internal/floorplan-measurements.html` as a forced 301 redirect.",
    "`next build` reports the app route as `/admin`",
    "Verify admin data loads only after the approved token succeeds.",
    "`/admin` returns an indexable 200."
  ].forEach(function (term) {
    assert.ok(routeSurfaceDecision.includes(term), "Admin route surface decision missing: " + term);
  });

  [
    'from = "/admin"',
    'to = "/admin.html"',
    'from = "/internal/floorplan-measurements"',
    'to = "/internal/floorplan-measurements.html"',
    "status = 301",
    "force = true"
  ].forEach(function (term) {
    assert.ok(netlifyConfig.includes(term), "Netlify config missing protected route redirect term: " + term);
  });
}

function main() {
  assertSourceShellSafe();
  assertOutputShellSafe();
  assertDeployReviewWarningExists();
  console.log("adminShellStaticContract.test.js passed");
}

main();
