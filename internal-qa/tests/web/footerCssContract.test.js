const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const cssPath = path.join(repoRoot, "apps", "web-tsx", "src", "styles", "global.css");

function main() {
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(
    css.includes(".footer-col a") && css.includes("overflow-wrap: anywhere"),
    "Footer links should allow wrapping to prevent column overlap."
  );
  assert.ok(
    css.includes(".site-footer .site-footer-inner") && css.includes("minmax(150px, 1fr)"),
    "Footer grid should keep stable desktop columns."
  );
  assert.ok(
    css.includes(".site-footer .footer-grid") && css.includes("grid-template-columns: 1fr"),
    "Footer grid should collapse to one column on mobile."
  );
  assert.ok(
    css.includes(".footer-logo img") && css.includes("width: 168px") && css.includes("object-fit: contain"),
    "Footer logo image should use the shared fixed-width contained asset treatment."
  );
  assert.ok(
    css.includes(".footer-logo") && css.includes("width: 216px") && css.includes("min-height: 70px"),
    "Footer logo wrapper should keep consistent whitespace across pages."
  );

  const footerLinkRule = css.match(/\.site-footer a\s*\{[\s\S]*?\}/);
  assert.ok(footerLinkRule, "Expected a dedicated .site-footer a rule.");
  assert.equal(
    footerLinkRule[0].includes("white-space: nowrap"),
    false,
    "Footer links must not inherit nowrap."
  );

  console.log("footerCssContract.test.js passed");
}

main();
