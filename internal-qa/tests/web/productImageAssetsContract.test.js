const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const productsJsPath = path.join(repoRoot, "apps", "web-tsx", "public", "products.js");
const publicRoot = path.join(repoRoot, "apps", "web-tsx", "public");

function collectImageRefs(value, refs) {
  if (!value) return;
  if (typeof value === "string") {
    if (value.includes("images/products/")) refs.add(value.replace(/^\//, ""));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageRefs(item, refs));
  }
}

function main() {
  const code = fs.readFileSync(productsJsPath, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const api = sandbox.window.OperonProducts;
  assert.ok(api && typeof api.getAllProducts === "function", "OperonProducts API should expose getAllProducts().");

  const products = api.getAllProducts();
  const refs = new Set();

  products.forEach((product) => {
    collectImageRefs(product.image, refs);
    collectImageRefs(product.imageUrl, refs);
    collectImageRefs(product.swatch, refs);
    collectImageRefs(product.swatchImage, refs);
    collectImageRefs(product.gallery, refs);
    collectImageRefs(product.images, refs);
    collectImageRefs(product.galleryImages, refs);
  });

  assert.ok(refs.size > 400, "Expected product catalogue to reference real product colour imagery.");

  const missing = [...refs].filter((ref) => !fs.existsSync(path.join(publicRoot, ref)));
  assert.deepEqual(missing, [], `Missing product image assets:\n${missing.join("\n")}`);

  console.log(`productImageAssetsContract.test.js passed (${refs.size} product image refs checked)`);
}

main();
