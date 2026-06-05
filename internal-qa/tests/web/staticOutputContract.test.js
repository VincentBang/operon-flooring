const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");

const requiredOutputFiles = [
  "index.html",
  "quote.html",
  "products.html",
  "quote-review.html",
  "floorplan.html",
  "contact.html",
  "contact-thank-you.html",
  "thank-you.html",
  "blog/index.html",
  "sitemap.xml",
  "robots.txt",
  "googlea11728cf4d174049.html"
];

const requiredSitemapUrls = [
  "https://operonflooring.com.au/",
  "https://operonflooring.com.au/quote.html",
  "https://operonflooring.com.au/products.html",
  "https://operonflooring.com.au/quote-review.html",
  "https://operonflooring.com.au/floorplan.html",
  "https://operonflooring.com.au/blog/",
  "https://operonflooring.com.au/flooring-bankstown.html"
];

const forbiddenSitemapUrls = [
  "https://operonflooring.com.au/blog.html",
  "https://operonflooring.com.au/blog/index.html",
  "https://operonflooring.com.au/contact-thank-you.html",
  "https://operonflooring.com.au/thank-you.html",
  "https://operonflooring.com.au/admin.html"
];

function walk(directory, files) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      return;
    }
    files.push(fullPath);
  });
  return files;
}

function assertRequiredOutputs() {
  assert.ok(fs.existsSync(outRoot), "apps/web-tsx/out missing. Run npm run build first.");
  requiredOutputFiles.forEach(function (relativePath) {
    assert.ok(fs.existsSync(path.join(outRoot, relativePath)), "Missing generated output: " + relativePath);
  });
}

function assertNoSourceMaps() {
  const maps = walk(outRoot, []).filter(function (filePath) {
    return filePath.endsWith(".map");
  });
  assert.deepStrictEqual(maps, [], "Source maps should not be present in static output.");
}

function assertSitemapContract() {
  const sitemap = fs.readFileSync(path.join(outRoot, "sitemap.xml"), "utf8");
  requiredSitemapUrls.forEach(function (url) {
    assert.ok(sitemap.includes(url), "Sitemap missing canonical URL: " + url);
  });
  forbiddenSitemapUrls.forEach(function (url) {
    assert.equal(sitemap.includes(url), false, "Sitemap must exclude URL: " + url);
  });
  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(function (match) { return match[1]; });
  locs.forEach(function (url) {
    if (url === "https://operonflooring.com.au/" || url === "https://operonflooring.com.au/blog/") return;
    assert.ok(
      /\.html$/.test(url),
      "Sitemap must not include extensionless non-root URL: " + url
    );
  });
}

function assertRobotsContract() {
  const robots = fs.readFileSync(path.join(outRoot, "robots.txt"), "utf8");
  assert.ok(
    robots.includes("Sitemap: https://operonflooring.com.au/sitemap.xml"),
    "robots.txt should point at production sitemap."
  );
  assert.equal(/Disallow:\s*\/\s*$/m.test(robots), false, "robots.txt must not block the whole site.");
}

function assertNoBlogHtmlOutput() {
  assert.equal(fs.existsSync(path.join(outRoot, "blog.html")), false, "blog.html must not be generated.");
}

function assertNoindexPagesStayNoindex() {
  [
    "admin.html",
    "contact-thank-you.html",
    "thank-you.html"
  ].forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    assert.ok(
      /<meta name="robots" content="noindex,(follow|nofollow)"\/?>/.test(html),
      relativePath + " must remain noindex."
    );
  });
}

function assertCanonicalShape() {
  [
    ["index.html", "https://operonflooring.com.au"],
    ["quote.html", "https://operonflooring.com.au/quote.html"],
    ["products.html", "https://operonflooring.com.au/products.html"],
    ["quote-review.html", "https://operonflooring.com.au/quote-review.html"],
    ["floorplan.html", "https://operonflooring.com.au/floorplan.html"],
    ["blog/index.html", "https://operonflooring.com.au/blog/"]
  ].forEach(function (entry) {
    const html = fs.readFileSync(path.join(outRoot, entry[0]), "utf8");
    assert.ok(
      new RegExp('<link rel="canonical" href="' + entry[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s*/?>').test(html),
      entry[0] + " must use approved canonical " + entry[1]
    );
  });
}

function main() {
  assertRequiredOutputs();
  assertNoSourceMaps();
  assertSitemapContract();
  assertRobotsContract();
  assertNoBlogHtmlOutput();
  assertNoindexPagesStayNoindex();
  assertCanonicalShape();
  console.log("staticOutputContract.test.js passed");
}

main();
