const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");
const logoFileName = "operon-flooring-sydney-brand-logo.png";
const logoPath = "/assets/" + logoFileName;
const logoAlt = "Operon Flooring Sydney logo";

function walk(directory, files) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      return;
    }
    if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  });
  return files;
}

function main() {
  assert.ok(
    fs.existsSync(path.join(repoRoot, "apps", "web-tsx", "public", logoPath)),
    "Canonical TSX logo asset is missing: " + logoPath
  );

  const checkedPages = [];
  walk(outRoot, []).forEach(function (filePath) {
    const relativePath = path.relative(outRoot, filePath);
    const html = fs.readFileSync(filePath, "utf8");
    if (!html.includes("site-header") && !html.includes("site-footer")) return;
    checkedPages.push(relativePath);
    assert.ok(
      html.includes('src="' + logoPath + '"') || html.includes('src="assets/' + logoFileName + '"'),
      relativePath + " should use canonical logo asset filename."
    );
    assert.ok(
      html.includes('alt="' + logoAlt + '"'),
      relativePath + " should use SEO-safe logo alt text."
    );
  });

  assert.ok(checkedPages.length >= 75, "Expected to verify logo consistency across the generated page set.");

  console.log("logoConsistencyContract.test.js passed");
}

main();
