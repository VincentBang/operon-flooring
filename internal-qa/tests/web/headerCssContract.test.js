const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const cssPath = path.join(repoRoot, "apps", "web-tsx", "src", "styles", "global.css");

function main() {
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(css.includes(".site-header"), "Header styles should be present.");
  assert.ok(
    css.includes("position: sticky"),
    "Header should stay stable at the top of the viewport."
  );
  assert.ok(
    css.includes("grid-template-columns: minmax(220px, 300px) minmax(0, 1fr) auto"),
    "Desktop header should use stable logo/nav/action columns."
  );
  assert.ok(
    css.includes("width: clamp(232px, 22vw, 300px)") && css.includes("max-width: 300px"),
    "Desktop header logo should use shared stable dimensions."
  );
  assert.ok(
    css.includes("white-space: nowrap"),
    "Desktop nav/header actions should avoid text jumps."
  );
  assert.ok(
    css.includes(".site-header.mobile-nav-open .site-nav"),
    "Mobile nav open state should be explicitly controlled."
  );
  assert.ok(
    css.includes("grid-template-columns: minmax(0, 1fr) auto"),
    "Mobile header should collapse to logo and menu toggle columns."
  );
  assert.ok(
    css.includes("width: clamp(188px, 62vw, 250px)") && css.includes("max-width: 260px"),
    "Mobile header logo should stay inside the available first row."
  );

  console.log("headerCssContract.test.js passed");
}

main();
