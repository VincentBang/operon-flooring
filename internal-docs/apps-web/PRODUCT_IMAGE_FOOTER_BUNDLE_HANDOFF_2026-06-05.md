# Product Image And Footer Bundle Handoff - 2026-06-05

## Scope

Local-only TSX product page quality bundle.

This bundle fixes two customer-facing product page issues:

- Product colour visuals were falling back to placeholder swatches because the referenced legacy product image assets were missing from `apps/web-tsx/public/images/products`.
- `products.html` loaded page-specific CSS/runtime in a way that made the footer differ from the shared TSX footer and could allow footer link overlap.

## Intended Commit Group

Stage only these paths for this bundle:

- `apps/web-tsx/src/app/products/page.tsx`
- `apps/web-tsx/public/seo-pages.css`
- `apps/web-tsx/public/images/products/**`
- `internal-qa/tests/web/productImageAssetsContract.test.js`
- `internal-qa/tests/web/productsFooterParityContract.test.js`
- `internal-qa/tests/web/footerCssContract.test.js`
- `internal-docs/apps-web/PRODUCT_IMAGE_FOOTER_BUNDLE_HANDOFF_2026-06-05.md`

Do not include unrelated Stage 3/admin/security/function work in this commit.

## Verification Completed Locally

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks`
- `git diff --check` for product/footer/image paths
- `node internal-qa/tests/web/productImageAssetsContract.test.js`
- `node internal-qa/tests/web/productsFooterParityContract.test.js`
- `node internal-qa/tests/web/footerCssContract.test.js`
- `node internal-qa/tests/web/logoConsistencyContract.test.js`
- `node internal-qa/tests/web/quoteCalculator.validation.js`
- `node internal-qa/tests/web/quoteConfidence.test.js`
- `node internal-qa/tests/web/floorplanMeasurement.test.js`
- `node internal-qa/tests/web/floorplanQuickRoom.test.js`
- `node internal-qa/tests/web/quoteReviewParser.test.js`
- `node internal-qa/tests/chatbot/chatbot.test.js`

## Local Browser QA Completed

`http://localhost:4180/products.html`

- Desktop `1440px`: no horizontal overflow, no broken catalogue images, no footer link overlap.
- Mobile `390px`: no horizontal overflow, no broken catalogue images, no footer link overlap.
- Product cards rendered: `67`.
- Catalogue images rendered: `67`.
- Broken image count: `0`.

## Product Image Inventory

- Product rows checked: `478`.
- Referenced product image paths: `1278`.
- Missing referenced images: `0`.
- Product image files in `apps/web-tsx/public/images/products`: `1280`.
- Approximate product image tree size: `285.13 MB`.
- Unused copied images: `2`, approximately `0.28 MB`.

## Caution

The image bundle is large because the current catalogue references gallery images directly. Trimming unused images will not meaningfully reduce the bundle. A future approved optimization task should compress or resize the largest referenced product images rather than delete catalogue assets.

Largest referenced optimization candidates:

- `images/products/hybrid/hrt-etf-8mm-qld-spotted-gum-gallery-1.jpg` - `24.29 MB`
- `images/products/hybrid/hrt-etf-9mm-qld-spotted-gum-gallery-1.jpg` - `24.29 MB`
- `images/products/hybrid/hrt-etf-8mm-qld-spotted-gum-gallery-2.jpg` - `18.66 MB`
- `images/products/hybrid/hrt-etf-9mm-qld-spotted-gum-gallery-2.jpg` - `18.66 MB`
- `images/products/hybrid/hrt-etf-7mm-helena-oak-gallery-1.jpg` - `1.10 MB`
- `images/products/hybrid/hrt-etf-8mm-helena-oak-gallery-1.jpg` - `1.10 MB`
- `images/products/hybrid/hrt-etf-7mm-grey-oak-gallery-1.jpg` - `1.05 MB`
- `images/products/hybrid/hrt-etf-8mm-grey-oak-gallery-1.jpg` - `1.05 MB`
- `images/products/hybrid/hrt-etf-9mm-grey-oak-gallery-1.jpg` - `1.05 MB`

## Deploy Status

- No Netlify draft deploy was created for this bundle.
- No production deploy was performed.
- No push was performed.
