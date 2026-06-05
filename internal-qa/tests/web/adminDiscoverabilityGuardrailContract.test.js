const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function walkFiles(dir, files) {
  if (!fs.existsSync(dir)) {
    return files;
  }
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

function assertIncludes(content, term, label) {
  assert.ok(content.includes(term), label + " missing `" + term + "`.");
}

function assertNoPublicAdminLinks() {
  const srcRoot = path.join(repoRoot, "apps", "web-tsx", "src");
  const publicSourceFiles = walkFiles(srcRoot, []).filter(function (filePath) {
    return /\.(tsx|ts|jsx|js)$/.test(filePath) && !filePath.includes(path.join("src", "app", "admin"));
  });

  publicSourceFiles.forEach(function (filePath) {
    const relative = path.relative(repoRoot, filePath);
    const content = fs.readFileSync(filePath, "utf8");
    assert.strictEqual(content.includes('href="/admin"'), false, relative + " must not link to /admin.");
    assert.strictEqual(content.includes('href="/admin.html"'), false, relative + " must not link to /admin.html.");
    assert.strictEqual(content.includes("lead-dashboard"), false, relative + " must not expose lead-dashboard calls.");
  });
}

function assertBuiltOutputHasNoPublicAdminLinks() {
  const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");
  if (!fs.existsSync(outRoot)) {
    return;
  }

  walkFiles(outRoot, []).filter(function (filePath) {
    return /\.html$/.test(filePath) && path.basename(filePath) !== "admin.html";
  }).forEach(function (filePath) {
    const relative = path.relative(repoRoot, filePath);
    const content = fs.readFileSync(filePath, "utf8");
    assert.strictEqual(content.includes('href="/admin"'), false, relative + " must not link to /admin.");
    assert.strictEqual(content.includes('href="/admin.html"'), false, relative + " must not link to /admin.html.");
    assert.strictEqual(content.includes("lead-dashboard"), false, relative + " must not expose lead-dashboard.");
  });

  const sitemapPath = path.join(outRoot, "sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    assert.strictEqual(sitemap.includes("/admin"), false, "Sitemap must not include admin routes.");
  }
}

function main() {
  const doc = read("internal-docs/apps-web/STAGE3_ADMIN_DISCOVERABILITY_GUARDRAIL.md");
  [
    "Do not add `/admin.html` to the header, footer, homepage, sitemap, blog, or any public CTA.",
    "Do not add `/admin` to public navigation.",
    "Do not expose admin Function URLs in public HTML.",
    "Do not add `lead-dashboard.js` calls to public browser code.",
    "Admin route references are allowed only in:",
    "Confirm public pages do not link to `/admin.html` or `/admin`.",
    "a public page links to `/admin.html`",
    "`/admin` returns an indexable 200 in preview"
  ].forEach(function (term) {
    assertIncludes(doc, term, "Admin discoverability guardrail doc");
  });

  assertNoPublicAdminLinks();
  assertBuiltOutputHasNoPublicAdminLinks();

  console.log("adminDiscoverabilityGuardrailContract.test.js passed");
}

main();
