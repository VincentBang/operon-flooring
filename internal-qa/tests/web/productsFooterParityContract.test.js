const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const seoCssPath = path.join(repoRoot, "apps", "web-tsx", "public", "seo-pages.css");
const productsPagePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "products", "page.tsx");

function main() {
  const css = fs.readFileSync(seoCssPath, "utf8");
  const productsPage = fs.readFileSync(productsPagePath, "utf8");

  assert.ok(
    css.includes("Shared footer parity: pages that load seo-pages.css must not get a second footer layout."),
    "seo-pages.css should document the product footer parity override."
  );
  assert.ok(
    css.includes(".site-footer .site-footer-inner") &&
      css.includes(".site-footer .footer-grid") &&
      css.includes("grid-template-columns: minmax(240px, 1.15fr) minmax(0, 1fr)"),
    "seo-pages.css should keep the shared desktop footer grid on pages that load SEO CSS."
  );
  assert.ok(
    css.includes(".site-footer .footer-col a:not(.footer-logo)") &&
      css.includes("white-space: normal") &&
      css.includes("word-break: normal"),
    "Footer links on SEO pages should wrap naturally instead of overlapping adjacent columns."
  );
  assert.ok(
    css.includes(".site-footer .footer-logo img") && css.includes("object-fit: contain"),
    "Footer logo on SEO pages should use contained image sizing."
  );
  assert.ok(
    css.includes("@media (max-width: 1180px)") &&
      css.includes("grid-template-columns: minmax(220px, 1fr) repeat(2, minmax(0, 1fr))"),
    "SEO footer should use a stable intermediate grid before mobile."
  );
  assert.ok(
    css.includes("@media (max-width: 820px)") && css.includes("grid-template-columns: 1fr"),
    "SEO footer should collapse to one column on mobile."
  );
  assert.ok(
    productsPage.includes('from "next/script"') && productsPage.includes('strategy="afterInteractive"'),
    "Products page should load catalogue scripts with Next Script so hydration does not remove the shared footer."
  );

  console.log("productsFooterParityContract.test.js passed");
}

main();
