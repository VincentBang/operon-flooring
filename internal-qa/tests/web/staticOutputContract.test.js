const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");
const productsPageSource = path.join(repoRoot, "apps", "web-tsx", "src", "app", "products", "page.tsx");
const netlifyConfigPath = path.join(repoRoot, "netlify.toml");
const chatbotUiPath = path.join(repoRoot, "apps", "web-tsx", "public", "chatbot", "chatbotUI.js");
const roomVisualiserPrivacyPerformanceReviewPath = path.join(
  repoRoot,
  "docs",
  "operon-flooring-room-visualiser-privacy-performance-review.md"
);
const roomVisualiserAssistedMaskArchitectureComparisonPath = path.join(
  repoRoot,
  "docs",
  "operon-flooring-room-visualiser-assisted-mask-architecture-comparison.md"
);
const roomVisualiserBrowserInferenceSpikePlanPath = path.join(
  repoRoot,
  "docs",
  "operon-flooring-room-visualiser-browser-inference-spike-plan.md"
);
const roomVisualiserLocalPrototypeBranchPath = path.join(
  repoRoot,
  "docs",
  "operon-flooring-room-visualiser-local-prototype-branch.md"
);
const roomVisualiserDeviceQaReportPath = path.join(
  repoRoot,
  "docs",
  "operon-flooring-room-visualiser-device-qa-report.md"
);
const roomVisualiserCatalogueApprovalPacketPath = path.join(
  repoRoot,
  "docs",
  "operon-flooring-room-visualiser-catalogue-approval-packet.md"
);
const roomVisualiserSourceRoot = path.join(repoRoot, "apps", "web-tsx", "src", "app", "room-visualiser");
const roomVisualiserArchitecturePaths = {
  catalogue: path.join(roomVisualiserSourceRoot, "catalogue.ts"),
  localEditor: path.join(roomVisualiserSourceRoot, "LocalRoomEditor.tsx"),
  localPhotoSession: path.join(roomVisualiserSourceRoot, "useLocalPhotoSession.ts"),
  maskState: path.join(roomVisualiserSourceRoot, "maskState.ts"),
  maskEditor: path.join(roomVisualiserSourceRoot, "useMaskEditor.ts"),
  photoValidation: path.join(roomVisualiserSourceRoot, "photoValidation.ts"),
  texture: path.join(roomVisualiserSourceRoot, "FloorTexture.tsx")
};

const requiredOutputFiles = [
  "index.html",
  "quote.html",
  "products.html",
  "quote-review.html",
  "floorplan.html",
  "room-visualiser.html",
  "contact.html",
  "contact-thank-you.html",
  "thank-you.html",
  "blog/index.html",
  "sitemap.xml",
  "robots.txt",
  "googlea11728cf4d174049.html"
];

const requiredSitemapUrls = [
  "https://operonflooring.com.au/",
  "https://operonflooring.com.au/quote.html",
  "https://operonflooring.com.au/products.html",
  "https://operonflooring.com.au/quote-review.html",
  "https://operonflooring.com.au/floorplan.html",
  "https://operonflooring.com.au/room-visualiser.html",
  "https://operonflooring.com.au/blog/",
  "https://operonflooring.com.au/flooring-bankstown.html"
];

const forbiddenSitemapUrls = [
  "https://operonflooring.com.au/index.html",
  "https://operonflooring.com.au/blog.html",
  "https://operonflooring.com.au/blog/index.html",
  "https://operonflooring.com.au/flooring-edmondson-park",
  "https://operonflooring.com.au/auburn-flooring.html",
  "https://operonflooring.com.au/contact-thank-you.html",
  "https://operonflooring.com.au/thank-you.html",
  "https://operonflooring.com.au/admin.html"
];

const redirectSourceUrlFragments = [
  "/index.html",
  "/blog/index.html",
  "/auburn-flooring.html",
  "https://operonflooring.com.au/index.html",
  "https://operonflooring.com.au/blog/index.html",
  "https://operonflooring.com.au/auburn-flooring.html"
];

const localAuthorityExpansionPages = [
  "flooring-balmain.html",
  "flooring-drummoyne.html",
  "flooring-woollahra.html",
  "flooring-mosman.html",
  "flooring-coogee.html",
  "flooring-neutral-bay.html",
  "flooring-double-bay.html",
  "flooring-rose-bay.html",
  "flooring-vaucluse.html",
  "flooring-wahroonga.html",
  "flooring-killara.html",
  "flooring-pymble.html"
];

const sprintDGuideBridgePages = [
  "blog/flooring-quote-review-sydney.html",
  "blog/how-to-compare-flooring-quotes.html",
  "blog/common-flooring-quote-exclusions.html",
  "blog/laminate-vs-hybrid.html",
  "blog/apartment-flooring-acoustic-underlay.html",
  "blog/flooring-stairs-and-stair-nosing.html"
];

const customerFacingSensitiveTerms = [
  /\bsupplier costs?\b/i,
  /\bsupplier_cost\b/i,
  /\bmargin(s)?\b/i,
  /\binternal rates?\b/i,
  /\binternal_rate\b/i,
  /\bprivate pricing\b/i,
  /\bpricing rules?\b/i,
  /\brate tables?\b/i,
  /\baccess multipliers?\b/i,
  /\bservice_role\b/i,
  /\braw_ocr\b/i,
  /\braw quote text\b/i
];

function walk(directory, files) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      return;
    }
    files.push(fullPath);
  });
  return files;
}

function assertRequiredOutputs() {
  assert.ok(fs.existsSync(outRoot), "apps/web-tsx/out missing. Run npm run build first.");
  requiredOutputFiles.forEach(function (relativePath) {
    assert.ok(fs.existsSync(path.join(outRoot, relativePath)), "Missing generated output: " + relativePath);
  });
}

function assertNoSourceMaps() {
  const maps = walk(outRoot, []).filter(function (filePath) {
    return filePath.endsWith(".map");
  });
  assert.deepStrictEqual(maps, [], "Source maps should not be present in static output.");
}

function assertSitemapContract() {
  const sitemap = fs.readFileSync(path.join(outRoot, "sitemap.xml"), "utf8");
  requiredSitemapUrls.forEach(function (url) {
    assert.ok(sitemap.includes(url), "Sitemap missing canonical URL: " + url);
  });
  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(function (match) { return match[1]; });
  forbiddenSitemapUrls.forEach(function (url) {
    assert.equal(locs.includes(url), false, "Sitemap must exclude URL: " + url);
  });
  locs.forEach(function (url) {
    if (url === "https://operonflooring.com.au/" || url === "https://operonflooring.com.au/blog/") return;
    assert.ok(
      /\.html$/.test(url),
      "Sitemap must not include extensionless non-root URL: " + url
    );
  });
}

function assertRobotsContract() {
  const robots = fs.readFileSync(path.join(outRoot, "robots.txt"), "utf8");
  assert.ok(
    robots.includes("Sitemap: https://operonflooring.com.au/sitemap.xml"),
    "robots.txt should point at production sitemap."
  );
  assert.equal(/Disallow:\s*\/\s*$/m.test(robots), false, "robots.txt must not block the whole site.");
}

function assertNoBlogHtmlOutput() {
  assert.equal(fs.existsSync(path.join(outRoot, "blog.html")), false, "blog.html must not be generated.");
}

function assertNoindexPagesStayNoindex() {
  [
    "admin.html",
    "contact-thank-you.html",
    "thank-you.html"
  ].forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    assert.ok(
      /<meta name="robots" content="noindex,(follow|nofollow)"\/?>/.test(html),
      relativePath + " must remain noindex."
    );
  });
}

function assertCanonicalShape() {
  [
    ["index.html", "https://operonflooring.com.au"],
    ["quote.html", "https://operonflooring.com.au/quote.html"],
    ["products.html", "https://operonflooring.com.au/products.html"],
    ["quote-review.html", "https://operonflooring.com.au/quote-review.html"],
    ["floorplan.html", "https://operonflooring.com.au/floorplan.html"],
    ["room-visualiser.html", "https://operonflooring.com.au/room-visualiser.html"],
    ["blog/index.html", "https://operonflooring.com.au/blog/"]
  ].forEach(function (entry) {
    const html = fs.readFileSync(path.join(outRoot, entry[0]), "utf8");
    assert.ok(
      new RegExp('<link rel="canonical" href="' + entry[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s*/?>').test(html),
      entry[0] + " must use approved canonical " + entry[1]
    );
  });
}

function assertNoRedirectSourceSignals() {
  const files = walk(outRoot, []).filter(function (filePath) {
    return /\.(html|xml)$/.test(filePath);
  });
  files.forEach(function (filePath) {
    const html = fs.readFileSync(filePath, "utf8");
    redirectSourceUrlFragments.forEach(function (fragment) {
      assert.equal(
        html.includes(fragment),
        false,
        path.relative(outRoot, filePath) + " must not contain redirect-source URL signal: " + fragment
      );
    });
    assert.equal(
      /href="\/flooring-edmondson-park(?:[?#"]|$)/.test(html),
      false,
      path.relative(outRoot, filePath) + " must not link to extensionless Edmondson Park URL."
    );
    assert.equal(
      /https:\/\/operonflooring\.com\.au\/flooring-edmondson-park(?:[?#"<]|$)/.test(html),
      false,
      path.relative(outRoot, filePath) + " must not contain absolute extensionless Edmondson Park URL."
    );
  });
}

function assertSeoCanonicalRedirectContract() {
  const netlifyConfig = fs.readFileSync(netlifyConfigPath, "utf8");
  const redirects = [
    ["/blog", "/blog/"],
    ["/blog/flooring-quote-review-sydney", "/blog/flooring-quote-review-sydney.html"],
    ["/blog/flooring-quote-checklist", "/blog/flooring-quote-checklist.html"],
    ["/blog/how-to-compare-flooring-quotes", "/blog/how-to-compare-flooring-quotes.html"],
    ["/blog/what-should-be-included-in-flooring-quote", "/blog/what-should-be-included-in-flooring-quote.html"],
    ["/blog/common-flooring-quote-exclusions", "/blog/common-flooring-quote-exclusions.html"],
    ["/blog/questions-to-ask-before-accepting-flooring-quote", "/blog/questions-to-ask-before-accepting-flooring-quote.html"]
  ];

  redirects.forEach(function ([source, target]) {
    const block = [
      "[[redirects]]",
      '  from = "' + source + '"',
      '  to = "' + target + '"',
      "  status = 301",
      "  force = true"
    ].join("\n");
    assert.ok(netlifyConfig.includes(block), source + " must permanently redirect in one hop to " + target);
  });

  const generatedFiles = walk(outRoot, []).filter(function (filePath) {
    return /\.(html|xml)$/.test(filePath);
  });
  const duplicateLinkPatterns = redirects.map(function ([source]) {
    return new RegExp('href="' + source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '(?:[?#"]|$)');
  });
  generatedFiles.forEach(function (filePath) {
    const html = fs.readFileSync(filePath, "utf8");
    duplicateLinkPatterns.forEach(function (pattern) {
      assert.equal(pattern.test(html), false, path.relative(outRoot, filePath) + " must not link to a duplicate extensionless guide URL.");
    });
  });
}

function assertSeoSprintContentContract() {
  const quoteReview = fs.readFileSync(path.join(outRoot, "quote-review.html"), "utf8");
  [
    "flooring-quote-checklist.html",
    "what-should-be-included-in-flooring-quote.html",
    "common-flooring-quote-exclusions.html",
    "flooring-installation-cost-sydney.html"
  ].forEach(function (href) {
    assert.ok(quoteReview.includes(href), "quote-review.html must link to supporting scope guide: " + href);
  });

  const floorplan = fs.readFileSync(path.join(outRoot, "floorplan.html"), "utf8");
  assert.ok(floorplan.includes("apartment-flooring-sydney.html"), "floorplan.html must connect measured area to apartment project planning.");

  const apartment = fs.readFileSync(path.join(outRoot, "apartment-flooring-sydney.html"), "utf8");
  ["lift bookings", "loading access", "working-hour limits", "building manager or strata contact"].forEach(function (copy) {
    assert.ok(apartment.includes(copy), "apartment-flooring-sydney.html must include verified planning copy: " + copy);
  });

  const costGuide = fs.readFileSync(path.join(outRoot, "flooring-installation-cost-sydney.html"), "utf8");
  ["Usually itemised", "Often left unclear", "May require site review"].forEach(function (copy) {
    assert.ok(costGuide.includes(copy), "installation-cost guide must separate scope certainty: " + copy);
  });

  const blogHub = fs.readFileSync(path.join(outRoot, "blog", "index.html"), "utf8");
  [
    "how-to-measure-floor-area.html",
    "flooring-maintenance-checklist.html",
    "engineered-timber-floor-maintenance.html",
    "floor-repair-or-replace.html"
  ].forEach(function (href) {
    assert.ok(blogHub.includes(href), "blog hub must link contextually to practical guide: " + href);
  });
}

function assertMobileChatbotCollisionContract() {
  const source = fs.readFileSync(chatbotUiPath, "utf8");
  assert.ok(
    source.includes('body.has-mobile-sticky-cta #') && source.includes("calc(100dvh - 294px)"),
    "Mobile chatbot panel must reserve vertical space for the sticky quote CTA."
  );
}

function assertOptimisedBrandAssetContract() {
  const brandWebp = path.join(outRoot, "assets", "operon-flooring-sydney-brand-logo.webp");
  assert.ok(fs.existsSync(brandWebp), "Optimised brand logo WebP must be exported.");
  assert.ok(fs.statSync(brandWebp).size < 50000, "Optimised brand logo should remain under 50 KB.");

  walk(outRoot, []).filter(function (filePath) {
    return /\.(html|css)$/.test(filePath);
  }).forEach(function (filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    assert.equal(
      content.includes("operon-flooring-sydney-brand-logo.png"),
      false,
      path.relative(outRoot, filePath) + " must use the lighter brand logo delivery asset."
    );
  });
}

function assertCrawlerVisibleCopyContract() {
  const productsHtml = fs.readFileSync(path.join(outRoot, "products.html"), "utf8");
  assert.equal(
    productsHtml.includes("Loading flooring products"),
    false,
    "products.html must include useful static catalogue copy before JS loads."
  );
  assert.ok(
    productsHtml.includes("Hybrid ranges") && productsHtml.includes("Laminate ranges") && productsHtml.includes("Engineered timber ranges"),
    "products.html must include static category/range fallback content."
  );

  const quoteHtml = fs.readFileSync(path.join(outRoot, "quote.html"), "utf8");
  assert.equal(
    quoteHtml.includes("Do not fill this out if you are human"),
    false,
    "quote.html honeypot must not expose crawler-visible instruction copy."
  );
  assert.ok(
    quoteHtml.includes("4. Stairs") && quoteHtml.includes("5. Extras") && quoteHtml.includes("6. Review"),
    "quote.html explainer must match the six-step quote flow."
  );

  const htmlFiles = walk(outRoot, []).filter(function (filePath) {
    return filePath.endsWith(".html");
  });
  htmlFiles.forEach(function (filePath) {
    const html = fs.readFileSync(filePath, "utf8");
    assert.equal(
      html.includes(">Internal links<"),
      false,
      path.relative(outRoot, filePath) + " must not expose generic internal-link labelling."
    );
  });
}

function assertRoomVisualiserContract() {
  const html = fs.readFileSync(path.join(outRoot, "room-visualiser.html"), "utf8");
  [
    "Flooring Room Visualiser Sydney",
    "Get instant flooring quote",
    "Upload floorplan",
    "Request quote review",
    "Ask us to match this product",
    "Compare real product textures before you quote",
    "Avala Prague Oak",
    "Nine browser-safe catalogue swatches",
    "Plank direction",
    "Preview grain scale",
    "Choose room photo",
    "Suggest starter mask",
    "Confirm floor area",
    "Redo",
    "Local manual editor",
    "Local image only",
    "Validated input",
    "Geometric starter only",
    "Browser canvas prototype",
    "Run local assist prototype",
    "Prototype runtime candidate",
    "No model package, no model asset, no upload, no storage and no quote handoff",
    "Manual correction required",
    "Suggested masks cannot be confirmed until at least one point is adjusted.",
    "Accessible correction",
    "Repository-owned product swatches",
    "No handoff data",
    "The image and points are not uploaded or stored.",
    "not AI inference or automatic floor detection"
  ].forEach(function (copy) {
    assert.ok(html.includes(copy), "room-visualiser.html must include visible room visualiser copy: " + copy);
  });
  [
    "Supabase",
    "Segment Anything",
    "Roomvo",
    "vendor API",
    "3D room planner",
    "AI masking"
  ].forEach(function (copy) {
    assert.equal(html.includes(copy), false, "room-visualiser.html must not expose out-of-scope visualiser feature: " + copy);
  });
}

function assertRoomVisualiserArchitectureContract() {
  Object.entries(roomVisualiserArchitecturePaths).forEach(function ([name, filePath]) {
    assert.ok(fs.existsSync(filePath), "room visualiser architecture module must exist: " + name);
  });

  const catalogue = fs.readFileSync(roomVisualiserArchitecturePaths.catalogue, "utf8");
  const localEditor = fs.readFileSync(roomVisualiserArchitecturePaths.localEditor, "utf8");
  const localPhotoSession = fs.readFileSync(roomVisualiserArchitecturePaths.localPhotoSession, "utf8");
  const maskState = fs.readFileSync(roomVisualiserArchitecturePaths.maskState, "utf8");
  const maskEditor = fs.readFileSync(roomVisualiserArchitecturePaths.maskEditor, "utf8");
  const photoValidation = fs.readFileSync(roomVisualiserArchitecturePaths.photoValidation, "utf8");
  const texture = fs.readFileSync(roomVisualiserArchitecturePaths.texture, "utf8");

  assert.equal(
    (catalogue.match(/textureUrl:/g) || []).length,
    9,
    "room visualiser catalogue must expose nine curated repository texture entries."
  );
  [
    "/images/products/hybrid/",
    "/images/products/laminate/",
    "/images/products/engineered-timber/"
  ].forEach(function (assetRoot) {
    assert.ok(catalogue.includes(assetRoot), "room visualiser catalogue must use repository product assets: " + assetRoot);
  });
  [
    "Avala Prague Oak",
    "Kensington Grey",
    "Project Oak Prague Natural"
  ].forEach(function (productName) {
    assert.ok(catalogue.includes(productName), "room visualiser catalogue must include representative product: " + productName);
  });
  [
    "onPointerDown",
    "onPointerMove",
    "ArrowLeft",
    "ArrowRight",
    "Horizontal position (%)",
    "Vertical position (%)",
    "Confirm floor area",
    "Editor zoom",
    "Suggested masks cannot be confirmed until at least one point is adjusted.",
    "data-testid=\"local-mask-stage\""
  ].forEach(function (copy) {
    assert.ok(localEditor.includes(copy), "local room editor must include professional interaction contract: " + copy);
  });
  [
    "LOCAL_PHOTO_MAX_BYTES",
    "LOCAL_PHOTO_MAX_PIXELS",
    "URL.createObjectURL",
    "URL.revokeObjectURL"
  ].forEach(function (copy) {
    assert.ok(localPhotoSession.includes(copy), "local photo session must include browser-local lifecycle contract: " + copy);
  });
  ["localStorage", "sessionStorage", "indexedDB", "fetch("].forEach(function (copy) {
    assert.equal(localPhotoSession.includes(copy), false, "local photo session must not persist or transmit data: " + copy);
  });
  assert.ok(
    localPhotoSession.indexOf("const requestId = requestIdRef.current + 1") < localPhotoSession.indexOf("const fileError = getLocalPhotoFileError"),
    "a new photo selection must invalidate any older decode before synchronous validation can return."
  );
  assert.ok(
    (localPhotoSession.match(/setIsReading\(false\)/g) || []).length >= 4,
    "local photo validation and decode exits must settle the local reading state."
  );
  ["past:", "future:", "confirmMask", "beginDrag", "previewDrag"].forEach(function (copy) {
    assert.ok(maskEditor.includes(copy), "mask editor must include history and correction contract: " + copy);
  });
  [
    "MASK_HISTORY_LIMIT",
    "commitMaskHistory",
    "undoMaskHistory",
    "redoMaskHistory",
    "manualAdjustments",
    "canConfirmMask",
    "confirmMaskSnapshot"
  ].forEach(function (copy) {
    assert.ok(maskState.includes(copy), "pure mask state must include deterministic editor contract: " + copy);
  });
  [
    "LOCAL_PHOTO_MAX_BYTES",
    "LOCAL_PHOTO_MAX_PIXELS",
    "getLocalPhotoFileError",
    "getLocalPhotoDimensionError"
  ].forEach(function (copy) {
    assert.ok(photoValidation.includes(copy), "photo validation must include deterministic failure contract: " + copy);
  });
  ["--floor-texture-image", "--floor-texture-angle", "--floor-texture-size"].forEach(function (copy) {
    assert.ok(texture.includes(copy), "floor texture renderer must expose controlled rendering variable: " + copy);
  });
}

function assertRoomVisualiserPrivacyPerformanceReviewContract() {
  assert.ok(
    fs.existsSync(roomVisualiserPrivacyPerformanceReviewPath),
    "room visualiser privacy/performance review must exist before inference, storage or handoff design."
  );
  const review = fs.readFileSync(roomVisualiserPrivacyPerformanceReviewPath, "utf8");
  [
    "No inference approval",
    "No storage approval",
    "No handoff approval",
    "Manual correction remains mandatory",
    "Browser-side inference review",
    "Server-side inference review",
    "Consent and retention",
    "Performance Budget",
    "Handoff Review Gates"
  ].forEach(function (copy) {
    assert.ok(review.includes(copy), "privacy/performance review must include gate language: " + copy);
  });
  [
    "Approved for production inference",
    "Approved Supabase storage",
    "Approved lead handoff",
    "inference is approved",
    "storage is approved"
  ].forEach(function (copy) {
    assert.equal(review.includes(copy), false, "privacy/performance review must not approve gated work: " + copy);
  });
}

function assertRoomVisualiserAssistedMaskArchitectureComparisonContract() {
  assert.ok(
    fs.existsSync(roomVisualiserAssistedMaskArchitectureComparisonPath),
    "room visualiser assisted-mask architecture comparison must exist before inference, storage or vendor design."
  );
  const comparison = fs.readFileSync(roomVisualiserAssistedMaskArchitectureComparisonPath, "utf8");
  [
    "design-only comparison",
    "Browser-side inference",
    "Server-side inference",
    "Vendor visualiser API",
    "manual polygon editor as the source of truth",
    "no image upload, no storage and no quote handoff",
    "Performance Review Checklist",
    "Privacy Review Checklist",
    "does not approve implementation"
  ].forEach(function (copy) {
    assert.ok(comparison.includes(copy), "assisted-mask architecture comparison must include gate language: " + copy);
  });
  [
    "implementation approved",
    "server-side inference is approved",
    "vendor API is approved",
    "storage is approved",
    "quote handoff is approved"
  ].forEach(function (copy) {
    assert.equal(comparison.includes(copy), false, "assisted-mask architecture comparison must not approve gated work: " + copy);
  });
}

function assertRoomVisualiserBrowserInferenceSpikePlanContract() {
  assert.ok(
    fs.existsSync(roomVisualiserBrowserInferenceSpikePlanPath),
    "room visualiser browser-side inference spike plan must exist before prototype implementation approval."
  );
  const plan = fs.readFileSync(roomVisualiserBrowserInferenceSpikePlanPath, "utf8");
  [
    "design/spec plan only",
    "Prototype implementation is not approved",
    "No photo pixels leave the browser",
    "No mask geometry leaves the browser",
    "manual polygon editor remains the source of truth",
    "No model assets on initial page load",
    "Suggest starter mask",
    "Manual correction required",
    "Stop Conditions",
    "Next Approval Needed"
  ].forEach(function (copy) {
    assert.ok(plan.includes(copy), "browser-side inference spike plan must include guardrail language: " + copy);
  });
  [
    "prototype implementation is approved",
    "model installation is approved",
    "image upload is approved",
    "storage is approved",
    "quote handoff is approved",
    "vendor API is approved"
  ].forEach(function (copy) {
    assert.equal(plan.includes(copy), false, "browser-side inference spike plan must not approve gated work: " + copy);
  });
}

function assertRoomVisualiserLocalPrototypeBranchContract() {
  assert.ok(
    fs.existsSync(roomVisualiserLocalPrototypeBranchPath),
    "room visualiser local prototype branch decision must exist before prototype branch review."
  );
  const branchDecision = fs.readFileSync(roomVisualiserLocalPrototypeBranchPath, "utf8");
  [
    "codex/room-visualiser-local-inference-spike",
    "Browser-native `HTMLImageElement`, `canvas` and `ImageData`",
    "No external model",
    "No downloaded weights",
    "Desktop Chrome on macOS",
    "Desktop Safari on macOS",
    "Recent mid-range iPhone Safari",
    "Recent mid-range Android Chrome",
    "Rollback Path",
    "No database, storage bucket, environment variable, vendor account, hosted model asset or production deploy needs rollback"
  ].forEach(function (copy) {
    assert.ok(branchDecision.includes(copy), "local prototype branch decision must include approval boundary: " + copy);
  });
  [
    "production release approved",
    "model package installation approved",
    "image upload approved",
    "storage approved",
    "vendor visualiser approved",
    "quote handoff approved"
  ].forEach(function (copy) {
    assert.equal(branchDecision.includes(copy), false, "local prototype branch decision must not approve gated work: " + copy);
  });
}

function assertRoomVisualiserDeviceQaReportContract() {
  assert.ok(
    fs.existsSync(roomVisualiserDeviceQaReportPath),
    "room visualiser device QA report must exist before merge decision."
  );
  const report = fs.readFileSync(roomVisualiserDeviceQaReportPath, "utf8");
  [
    "Merge decision: not ready yet",
    "Desktop Chrome on macOS",
    "Desktop Safari on macOS",
    "iPhone Safari physical device",
    "Android Chrome physical device",
    "All three permission-safe room images",
    "34 x 34",
    "approximately 19 MB",
    "iPhone 15 Pro Max on iOS/Safari 26.5",
    "17 ms first run; 24 ms screenshot rerun",
    "localStorage",
    "native finger drag",
    "Android Platform Tools 37.0.0",
    "docs/qa-evidence/operon-room-visualiser-iphone-safari-2026-07-12.png",
    "Status: awaiting flooring-specialist decision",
    "Safari WebDriver Status",
    "reported ready",
    "Do not merge the local prototype branch yet"
  ].forEach(function (copy) {
    assert.ok(report.includes(copy), "device QA report must include merge-gate language: " + copy);
  });
  [
    "Merge decision: ready",
    "physical iPhone Safari passed",
    "physical Android Chrome passed",
    "production deploy completed"
  ].forEach(function (copy) {
    assert.equal(report.includes(copy), false, "device QA report must not claim unverified readiness: " + copy);
  });
}

function assertRoomVisualiserCatalogueApprovalPacketContract() {
  assert.ok(
    fs.existsSync(roomVisualiserCatalogueApprovalPacketPath),
    "room visualiser catalogue approval packet must exist before specialist sign-off."
  );
  const packet = fs.readFileSync(roomVisualiserCatalogueApprovalPacketPath, "utf8");
  [
    "Status: awaiting flooring-specialist decision",
    "Texture rights",
    "Visual fidelity",
    "Approved with corrections",
    "No pricing fields are part of this review",
    "Technical preflight completed on 2026-07-11",
    "roomVisualiserCatalogue.test.js",
    "docs/qa-evidence/operon-room-visualiser-iphone-safari-2026-07-12.png",
    "No repository document was found that grants public visualiser transformation rights",
    "topdeck-avala-prague-oak",
    "topdeck-avala-spotted-gum",
    "topdeck-storm-coastal-blackbutt",
    "range-oak-step-os103-california",
    "topdeck-cp-kensington-grey",
    "range-oak-step-os105-nsw-spotted-gum",
    "topdeck-project-oak-prague-natural",
    "topdeck-spotted-gum-136mm",
    "topdeck-lavanda-oak-british-oak-natural"
  ].forEach(function (copy) {
    assert.ok(packet.includes(copy), "catalogue approval packet must include review gate: " + copy);
  });
  assert.equal(
    packet.includes("Status: approved"),
    false,
    "catalogue approval packet must not claim specialist approval before sign-off."
  );
}

function assertProductsPerformanceContract() {
  const source = fs.readFileSync(productsPageSource, "utf8");
  assert.ok(
    /<Script id="products-page-body-class" strategy="beforeInteractive">/.test(source),
    "Products page body class must be applied before hydration to avoid hero layout shift."
  );
  [
    "/pricingSourceConfig.js",
    "/pricingSource.js",
    "/preference-floors-import.js",
    "/products.js",
    "/productSelection.js"
  ].forEach(function (scriptPath) {
    const pattern = new RegExp('src="' + scriptPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s+strategy="lazyOnload"');
    assert.ok(pattern.test(source), "Heavy products catalogue script must lazy-load: " + scriptPath);
  });
  assert.ok(
    /<Script id="products-catalogue-runtime" strategy="lazyOnload">/.test(source),
    "Inline products catalogue runtime must lazy-load."
  );
}

function assertLocalAuthorityExpansionContract() {
  localAuthorityExpansionPages.forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ");
    assert.ok(
      html.includes("Local quote depth") &&
      html.includes("Product options to compare before quoting") &&
      html.includes("What to check before comparing totals") &&
      html.includes("Start flooring quote") &&
      html.includes("Check an existing quote") &&
      html.includes("Measure from floor plan"),
      relativePath + " must include Sprint B local authority, product, quote and CTA content."
    );
    customerFacingSensitiveTerms.forEach(function (pattern) {
      assert.equal(pattern.test(visibleText), false, relativePath + " must not expose sensitive commercial/privacy language: " + pattern);
    });
  });
}

function assertSprintDGuideBridgeContract() {
  const blogIndex = fs.readFileSync(path.join(outRoot, "blog", "index.html"), "utf8");
  [
    "Start instant flooring quote",
    "Check an existing quote",
    "Measure from a floor plan",
    "Browse flooring products",
    "Flooring quote review Sydney",
    "Hybrid flooring Sydney",
    "Flooring Miranda"
  ].forEach(function (copy) {
    assert.ok(blogIndex.includes(copy), "blog/index.html must include Sprint D hub link copy: " + copy);
  });

  sprintDGuideBridgePages.forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    assert.ok(
      html.includes("quote.html") &&
      html.includes("quote-review.html") &&
      html.includes("floorplan.html") &&
      html.includes("products.html"),
      relativePath + " must bridge guide readers to quote, quote review, floorplan and products."
    );
  });

  [
    "blog/flooring-quote-review-sydney.html",
    "blog/how-to-compare-flooring-quotes.html",
    "blog/common-flooring-quote-exclusions.html"
  ].forEach(function (relativePath) {
    const html = fs.readFileSync(path.join(outRoot, relativePath), "utf8");
    assert.ok(
      html.includes("flooring-edmondson-park.html") &&
      html.includes("flooring-miranda.html") &&
      html.includes("flooring-liverpool.html") &&
      html.includes("flooring-parramatta.html"),
      relativePath + " must connect quote-review guides to local authority pages."
    );
  });
}

function main() {
  assertRequiredOutputs();
  assertNoSourceMaps();
  assertSitemapContract();
  assertRobotsContract();
  assertRoomVisualiserPrivacyPerformanceReviewContract();
  assertRoomVisualiserAssistedMaskArchitectureComparisonContract();
  assertRoomVisualiserBrowserInferenceSpikePlanContract();
  assertRoomVisualiserLocalPrototypeBranchContract();
  assertRoomVisualiserDeviceQaReportContract();
  assertRoomVisualiserCatalogueApprovalPacketContract();
  assertNoBlogHtmlOutput();
  assertNoindexPagesStayNoindex();
  assertCanonicalShape();
  assertNoRedirectSourceSignals();
  assertSeoCanonicalRedirectContract();
  assertCrawlerVisibleCopyContract();
  assertSeoSprintContentContract();
  assertMobileChatbotCollisionContract();
  assertOptimisedBrandAssetContract();
  assertRoomVisualiserContract();
  assertRoomVisualiserArchitectureContract();
  assertProductsPerformanceContract();
  assertLocalAuthorityExpansionContract();
  assertSprintDGuideBridgeContract();
  console.log("staticOutputContract.test.js passed");
}

main();
