const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");
const productsPageSource = path.join(repoRoot, "apps", "web-tsx", "src", "app", "products", "page.tsx");

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
  "https://operonflooring.com.au/index.html",
  "https://operonflooring.com.au/blog.html",
  "https://operonflooring.com.au/blog/index.html",
  "https://operonflooring.com.au/flooring-edmondson-park",
  "https://operonflooring.com.au/auburn-flooring.html",
  "https://operonflooring.com.au/contact-thank-you.html",
  "https://operonflooring.com.au/thank-you.html",
  "https://operonflooring.com.au/admin.html"
];

const redirectSourceUrlFragments = [
  "/index.html",
  "/blog/index.html",
  "/auburn-flooring.html",
  "https://operonflooring.com.au/index.html",
  "https://operonflooring.com.au/blog/index.html",
  "https://operonflooring.com.au/auburn-flooring.html"
];

const localAuthorityExpansionPages = [
  "flooring-balmain.html",
  "flooring-drummoyne.html",
  "flooring-woollahra.html",
  "flooring-mosman.html",
  "flooring-coogee.html",
  "flooring-neutral-bay.html",
  "flooring-double-bay.html",
  "flooring-rose-bay.html",
  "flooring-vaucluse.html",
  "flooring-wahroonga.html",
  "flooring-killara.html",
  "flooring-pymble.html"
];

const sprintDGuideBridgePages = [
  "blog/flooring-quote-review-sydney.html",
  "blog/how-to-compare-flooring-quotes.html",
  "blog/common-flooring-quote-exclusions.html",
  "blog/laminate-vs-hybrid.html",
  "blog/apartment-flooring-acoustic-underlay.html",
  "blog/flooring-stairs-and-stair-nosing.html"
];

const customerFacingSensitiveTerms = [
  /\bsupplier costs?\b/i,
  /\bsupplier_cost\b/i,
  /\bmargin(s)?\b/i,
  /\binternal rates?\b/i,
  /\binternal_rate\b/i,
  /\bprivate pricing\b/i,
  /\bpricing rules?\b/i,
  /\brate tables?\b/i,
  /\baccess multipliers?\b/i,
  /\bservice_role\b/i,
  /\braw_ocr\b/i,
  /\braw quote text\b/i
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
  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(function (match) { return match[1]; });
  forbiddenSitemapUrls.forEach(function (url) {
    assert.equal(locs.includes(url), false, "Sitemap must exclude URL: " + url);
  });
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

function assertNoRedirectSourceSignals() {
  const files = walk(outRoot, []).filter(function (filePath) {
    return /\.(html|xml)$/.test(filePath);
  });
  files.forEach(function (filePath) {
    const html = fs.readFileSync(filePath, "utf8");
    redirectSourceUrlFragments.forEach(function (fragment) {
      assert.equal(
        html.includes(fragment),
        false,
        path.relative(outRoot, filePath) + " must not contain redirect-source URL signal: " + fragment
      );
    });
    assert.equal(
      /href="\/flooring-edmondson-park(?:[?#"]|$)/.test(html),
      false,
      path.relative(outRoot, filePath) + " must not link to extensionless Edmondson Park URL."
    );
    assert.equal(
      /https:\/\/operonflooring\.com\.au\/flooring-edmondson-park(?:[?#"<]|$)/.test(html),
      false,
      path.relative(outRoot, filePath) + " must not contain absolute extensionless Edmondson Park URL."
    );
  });
}

function assertCrawlerVisibleCopyContract() {
  const productsHtml = fs.readFileSync(path.join(outRoot, "products.html"), "utf8");
  assert.equal(
    productsHtml.includes("Loading flooring products"),
    false,
    "products.html must include useful static catalogue copy before JS loads."
  );
  assert.ok(
    productsHtml.includes("Hybrid ranges") && productsHtml.includes("Laminate ranges") && productsHtml.includes("Engineered timber ranges"),
    "products.html must include static category/range fallback content."
  );

  const quoteHtml = fs.readFileSync(path.join(outRoot, "quote.html"), "utf8");
  assert.equal(
    quoteHtml.includes("Do not fill this out if you are human"),
    false,
    "quote.html honeypot must not expose crawler-visible instruction copy."
  );
  assert.ok(
    quoteHtml.includes("4. Stairs") && quoteHtml.includes("5. Extras") && quoteHtml.includes("6. Review"),
    "quote.html explainer must match the six-step quote flow."
  );

  const htmlFiles = walk(outRoot, []).filter(function (filePath) {
    return filePath.endsWith(".html");
  });
  htmlFiles.forEach(function (filePath) {
    const html = fs.readFileSync(filePath, "utf8");
    assert.equal(
      html.includes(">Internal links<"),
      false,
      path.relative(outRoot, filePath) + " must not expose generic internal-link labelling."
    );
  });
}

function assertProductsPerformanceContract() {
  const source = fs.readFileSync(productsPageSource, "utf8");
  assert.ok(
    /<Script id="products-page-body-class" strategy="beforeInteractive">/.test(source),
    "Products page body class must be applied before hydration to avoid hero layout shift."
  );
  [
    "/pricingSourceConfig.js",
    "/pricingSource.js",
    "/preference-floors-import.js",
    "/products.js",
    "/productSelection.js"
  ].forEach(function (scriptPath) {
    const pattern = new RegExp('src="' + scriptPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s+strategy="lazyOnload"');
    assert.ok(pattern.test(source), "Heavy products catalogue script must lazy-load: " + scriptPath);
  });
  assert.ok(
    /<Script id="products-catalogue-runtime" strategy="lazyOnload">/.test(source),
    "Inline products catalogue runtime must lazy-load."
  );
}

function assertLocalAuthorityExpansionContract() {
  localAuthorityExpansionPages.forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ");
    assert.ok(
      html.includes("Local quote depth") &&
      html.includes("Product options to compare before quoting") &&
      html.includes("What to check before comparing totals") &&
      html.includes("Start flooring quote") &&
      html.includes("Check an existing quote") &&
      html.includes("Measure from floor plan"),
      relativePath + " must include Sprint B local authority, product, quote and CTA content."
    );
    customerFacingSensitiveTerms.forEach(function (pattern) {
      assert.equal(pattern.test(visibleText), false, relativePath + " must not expose sensitive commercial/privacy language: " + pattern);
    });
  });
}

function assertSprintDGuideBridgeContract() {
  const blogIndex = fs.readFileSync(path.join(outRoot, "blog", "index.html"), "utf8");
  [
    "Start instant flooring quote",
    "Check an existing quote",
    "Measure from a floor plan",
    "Browse flooring products",
    "Flooring quote review Sydney",
    "Hybrid flooring Sydney",
    "Flooring Miranda"
  ].forEach(function (copy) {
    assert.ok(blogIndex.includes(copy), "blog/index.html must include Sprint D hub link copy: " + copy);
  });

  sprintDGuideBridgePages.forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    assert.ok(
      html.includes("quote.html") &&
      html.includes("quote-review.html") &&
      html.includes("floorplan.html") &&
      html.includes("products.html"),
      relativePath + " must bridge guide readers to quote, quote review, floorplan and products."
    );
  });

  [
    "blog/flooring-quote-review-sydney.html",
    "blog/how-to-compare-flooring-quotes.html",
    "blog/common-flooring-quote-exclusions.html"
  ].forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    assert.ok(
      html.includes("flooring-edmondson-park.html") &&
      html.includes("flooring-miranda.html") &&
      html.includes("flooring-liverpool.html") &&
      html.includes("flooring-parramatta.html"),
      relativePath + " must connect quote-review guides to local authority pages."
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
  assertNoRedirectSourceSignals();
  assertCrawlerVisibleCopyContract();
  assertProductsPerformanceContract();
  assertLocalAuthorityExpansionContract();
  assertSprintDGuideBridgeContract();
  console.log("staticOutputContract.test.js passed");
}

main();
