"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const webRoot = path.resolve(__dirname, "..", "..", "..", "apps", "web");
const html = fs.readFileSync(path.resolve(webRoot, "index.html"), "utf8");

function listHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(function (entry) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listHtmlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

[
  "Proof before promises",
  "Operon should earn trust",
  "Finished-room proof should show",
  "Future proof should show",
  "Project proof will be added",
  "04XX XXX XXX",
  "tel:04XXXXXXXX"
].forEach(function (phrase) {
  assert(!html.includes(phrase), "homepage should not include placeholder trust/phone copy: " + phrase);
});

assert(html.includes("Starting estimate first. Product, area and final scope are reviewed before booking."));
assert(html.includes("Add product, area and key scope."));
assert(html.includes("Use the written scope to compare clearly."));

listHtmlFiles(webRoot).forEach(function (file) {
  const source = fs.readFileSync(file, "utf8");
  [
    "04XX XXX XXX",
    "tel:04XXXXXXXX",
    "Proof before promises",
    "Future proof should show",
    "Project proof will be added"
  ].forEach(function (phrase) {
    assert(!source.includes(phrase), path.relative(webRoot, file) + " should not include trust/phone placeholder: " + phrase);
  });
});

console.log("homepageTrust.test.js passed");
