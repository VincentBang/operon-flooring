const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const publicRoot = path.join(repoRoot, "apps", "web-tsx", "public");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  assert.equal(buffer.toString("ascii", 1, 4), "PNG", `${filePath} should be a PNG file.`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function assertSquarePng(relativePath, minSize) {
  const filePath = path.join(publicRoot, relativePath);
  assert.ok(fs.existsSync(filePath), `${relativePath} should exist in public root.`);
  const size = readPngSize(filePath);
  assert.equal(size.width, size.height, `${relativePath} should be square for Google favicon eligibility.`);
  assert.ok(size.width >= minSize, `${relativePath} should be at least ${minSize}x${minSize}.`);
}

function main() {
  assert.ok(fs.existsSync(path.join(publicRoot, "favicon.ico")), "favicon.ico should exist at site root.");
  assertSquarePng("operon-flooring-favicon.png", 48);
  assertSquarePng("icon.png", 48);
  assertSquarePng("apple-touch-icon.png", 48);

  const homepage = fs.readFileSync(path.join(outRoot, "index.html"), "utf8");
  assert.ok(homepage.includes('href="/favicon.ico"'), "Generated homepage should link /favicon.ico.");
  assert.ok(
    homepage.includes('href="/operon-flooring-favicon.png"'),
    "Generated homepage should link the stable brand favicon PNG."
  );
  assert.ok(
    homepage.includes('href="/apple-touch-icon.png"'),
    "Generated homepage should link apple-touch-icon."
  );

  console.log("faviconContract.test.js passed");
}

main();
