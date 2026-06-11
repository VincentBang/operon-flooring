const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");
const site = "https://operonflooring.com.au";

const approvedFirstBatch = [
  "/blog/flooring-quote-review-sydney.html",
  "/blog/flooring-quote-checklist.html",
  "/blog/how-to-compare-flooring-quotes.html",
  "/blog/what-should-be-included-in-flooring-quote.html",
  "/blog/common-flooring-quote-exclusions.html",
  "/blog/questions-to-ask-before-accepting-flooring-quote.html",
  "/flooring-chatswood.html",
  "/flooring-north-sydney.html",
  "/flooring-newtown.html",
  "/flooring-surry-hills.html",
  "/flooring-bondi.html"
];

const heldBackExpansion = [
  "/products/preference-classic-laminate.html",
  "/products/preference-select-australian-timber.html",
  "/products/preference-fiddleback.html",
  "/products/pronto-engineered-oak.html",
  "/products/aspire-hybrid.html",
  "/projects/engineered-herringbone-timber-stair-sydney.html",
  "/projects/wide-long-engineered-herringbone-flooring-sydney.html",
  "/projects/engineered-chevron-flooring-sydney.html",
  "/projects/hybrid-floor-levelling-case-study-sydney.html",
  "/projects/engineered-straight-plank-direct-stick-stair-sydney.html",
  "/blog/floor-levelling-for-timber-flooring-sydney.html",
  "/blog/flooring-removal-and-disposal-sydney.html",
  "/blog/flooring-stair-cost-scope-sydney.html",
  "/blog/acoustic-underlay-cost-sydney-apartments.html",
  "/blog/apartment-flooring-quote-cost-sydney.html",
  "/blog/floating-floor-vs-direct-stick-engineered-timber.html",
  "/blog/herringbone-chevron-flooring-quote-sydney.html",
  "/blog/hybrid-flooring-for-rental-property-sydney.html",
  "/blog/engineered-timber-stairs-sydney.html",
  "/blog/floor-preparation-before-hybrid-flooring.html"
];

function readSitemap() {
  const sitemapPath = path.join(outRoot, "sitemap.xml");
  assert.ok(fs.existsSync(sitemapPath), "apps/web-tsx/out/sitemap.xml missing. Run npm run build first.");
  return fs.readFileSync(sitemapPath, "utf8");
}

function outputPath(urlPath) {
  if (urlPath === "/") return path.join(outRoot, "index.html");
  if (urlPath.endsWith("/")) return path.join(outRoot, urlPath.slice(1), "index.html");
  return path.join(outRoot, urlPath.slice(1));
}

function walkHtml(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkHtml(fullPath, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function assertApprovedBatchIsLive(sitemap) {
  for (const urlPath of approvedFirstBatch) {
    assert.ok(sitemap.includes(`${site}${urlPath}`), `Approved first-batch URL missing from sitemap: ${urlPath}`);
    assert.ok(fs.existsSync(outputPath(urlPath)), `Approved first-batch URL was not exported: ${urlPath}`);
  }
}

function assertHeldBackPagesStayHeldBack(sitemap) {
  for (const urlPath of heldBackExpansion) {
    assert.strictEqual(sitemap.includes(`${site}${urlPath}`), false, `Held-back URL must not be in sitemap: ${urlPath}`);
    assert.strictEqual(fs.existsSync(outputPath(urlPath)), false, `Held-back URL must not be exported yet: ${urlPath}`);
  }
}

function assertNoInternalLinksToHeldBackPages() {
  const htmlFiles = walkHtml(outRoot);
  const offenders = [];
  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, "utf8");
    for (const urlPath of heldBackExpansion) {
      if (html.includes(`href="${urlPath}"`) || html.includes(`href='${urlPath}'`)) {
        offenders.push(`${path.relative(outRoot, filePath)} -> ${urlPath}`);
      }
    }
  }
  assert.deepStrictEqual(offenders, [], "Generated pages must not link to held-back SEO expansion URLs.");
}

function assertControlledSitemapCount(sitemap) {
  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
  assert.strictEqual(locs.length, 87, "Sitemap should remain the 76-page base plus approved 11-page first batch.");
}

function main() {
  const sitemap = readSitemap();
  assertControlledSitemapCount(sitemap);
  assertApprovedBatchIsLive(sitemap);
  assertHeldBackPagesStayHeldBack(sitemap);
  assertNoInternalLinksToHeldBackPages();
  console.log("seoFirstBatchReleaseContract.test.js passed");
}

main();
