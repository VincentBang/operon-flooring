const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");

const forbiddenPublicPaths = [
  ".env",
  ".env.local",
  ".git/config",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.js",
  "netlify.toml",
  ".next",
  "apps/web-tsx/src",
  "netlify/functions",
  "scripts",
  "supabase/migrations",
  "internal-audits",
  "internal-qa",
  "internal-docs",
  "backups",
  "qa-screenshots",
  "node_modules",
  "private-pricing",
  "pricingRules.js",
  "installRates.js",
  "removalRates.js",
  "stairRates.js",
  "locationZones.js"
];

function main() {
  assert.ok(fs.existsSync(outRoot), "apps/web-tsx/out missing. Run npm run build first.");

  forbiddenPublicPaths.forEach(function (relativePath) {
    assert.equal(
      fs.existsSync(path.join(outRoot, relativePath)),
      false,
      "Forbidden public path exists in static output: " + relativePath
    );
  });

  const nextStatic = path.join(outRoot, "_next", "static");
  if (fs.existsSync(nextStatic)) {
    const sourceMaps = [];
    function walk(directory) {
      fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith(".map")) {
          sourceMaps.push(path.relative(outRoot, fullPath));
        }
      });
    }
    walk(nextStatic);
    assert.deepStrictEqual(sourceMaps, [], "Source maps exposed:\n" + sourceMaps.join("\n"));
  }

  console.log("localPublicProbeContract.test.js passed");
}

main();
