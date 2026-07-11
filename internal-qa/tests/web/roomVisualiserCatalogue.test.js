const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const typescript = require(path.join(repoRoot, "apps", "web-tsx", "node_modules", "typescript"));

function loadCatalogue() {
  const filePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "room-visualiser", "catalogue.ts");
  const source = fs.readFileSync(filePath, "utf8");
  const result = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2022
    },
    fileName: filePath,
    reportDiagnostics: true
  });
  const errors = (result.diagnostics || []).filter(function (diagnostic) {
    return diagnostic.category === typescript.DiagnosticCategory.Error;
  });
  assert.deepEqual(errors, [], "catalogue.ts must transpile without syntax errors.");

  const module = { exports: {} };
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", result.outputText);
  evaluate(module.exports, function (specifier) {
    throw new Error("Catalogue unexpectedly required runtime dependency: " + specifier);
  }, module, filePath, path.dirname(filePath));
  return module.exports.flooringLooks;
}

function loadProductSource() {
  const filePath = path.join(repoRoot, "apps", "web-tsx", "public", "products.js");
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
  return Object.values(context.window.OPERON_PRODUCTS).flat();
}

const looks = loadCatalogue();
const sourceById = new Map(loadProductSource().map(function (product) {
  return [product.id, product];
}));

assert.equal(looks.length, 9, "the review catalogue must remain limited to nine items before specialist approval.");
assert.equal(new Set(looks.map(function (look) { return look.id; })).size, looks.length, "catalogue IDs must be unique.");

const categoryCounts = looks.reduce(function (counts, look) {
  counts[look.category] = (counts[look.category] || 0) + 1;
  return counts;
}, {});
assert.deepEqual(categoryCounts, { hybrid: 3, laminate: 3, engineered: 3 });

looks.forEach(function (look) {
  const source = sourceById.get(look.id);
  assert.ok(source, "catalogue product must exist in products.js: " + look.id);
  assert.equal(look.category, source.category, look.id + " category must match products.js.");
  assert.equal(look.range, source.range, look.id + " range must match products.js.");
  assert.equal(look.colour, source.colour, look.id + " colour must match products.js.");
  assert.equal(
    look.thickness,
    source.thickness || "Confirm selected range",
    look.id + " thickness policy must match products.js."
  );
  assert.equal(look.textureUrl, "/" + source.image, look.id + " texture path must match products.js.");

  const assetPath = path.join(repoRoot, "apps", "web-tsx", "public", look.textureUrl.slice(1));
  assert.ok(fs.existsSync(assetPath), look.id + " texture asset must exist.");
  assert.ok(fs.statSync(assetPath).size > 0, look.id + " texture asset must not be empty.");
});

console.log("roomVisualiserCatalogue.test.js passed");
