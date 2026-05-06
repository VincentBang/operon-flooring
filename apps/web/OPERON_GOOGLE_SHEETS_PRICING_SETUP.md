# Operon Google Sheets Pricing Setup

Source-of-truth status: setup guide for moving runtime pricing from local JS files to published Google Sheets tabs.

## Goal

Use Google Sheets as the editable pricing source for:

- products
- install rates
- underlay
- skirting / scotia
- removal
- location zones
- pricing rules

The website keeps a safe fallback:

- if Google Sheets is not configured or fails to load, the local JS files are still used

## Files Involved

- `apps/web/pricingSourceConfig.js`
- `apps/web/pricingSource.js`
- `apps/web/products.js`
- `apps/web/installRates.js`
- `apps/web/underlay.js`
- `apps/web/skirtingScotia.js`
- `apps/web/removalRates.js`
- `apps/web/locationZones.js`
- `apps/web/pricingRules.js`

## How It Works

Default mode:

- `mode: "local"`

To switch the site to Google Sheets:

1. Create a Google Sheet
2. Add the tabs listed below
3. Publish the sheet tabs so they are readable by the website
4. Put the Google Sheet ID into `apps/web/pricingSourceConfig.js`
5. Change:
   - `mode: "local"`
   to
   - `mode: "google_sheets"`
6. Deploy

## Required Sheet Tabs

Use these exact tab names unless you also update `pricingSourceConfig.js`:

- `category_meta`
- `products`
- `install_rates`
- `underlay`
- `skirting_scotia`
- `removal_rates`
- `location_zones`
- `pricing_rules`

## Tab Columns

### `category_meta`

Required columns:

- `id`
- `label`
- `shortDescription`
- `pricePerM2`
- `pageUrl`

Example:

| id | label | shortDescription | pricePerM2 | pageUrl |
|---|---|---|---:|---|
| hybrid | Hybrid Flooring | Practical SPC hybrid flooring for apartments, houses, and busy family homes. | 52 | hybrid-flooring-sydney.html |

### `products`

Required columns:

- `id`
- `category`
- `brand`
- `range`
- `colour`
- `pricePerM2`

Useful optional columns:

- `tone`
- `swatch`
- `thickness`
- `productType`
- `installRate`
- `imageUrl`
- `alt`
- `description`
- `features`
- `suitableFor`
- `supplier`
- `supplierUrl`
- `active`

Multi-value fields:

- `features`
- `suitableFor`

Use pipe separators:

- `feature 1|feature 2|feature 3`

### `install_rates`

Required columns:

- `id`
- `category`
- `installType`
- `jobType`
- `ratePerM2`
- `minimumCharge`
- `active`

### `underlay`

Required columns:

- `id`
- `name`
- `suitableCategories`
- `pricePerM2`
- `active`

Use pipe separators for `suitableCategories`.

### `skirting_scotia`

Required columns:

- `id`
- `type`
- `formValue`
- `material`
- `pricingMethod`
- `price`
- `active`

Important:

- instant quote logic should continue using `allowance_per_m2`
- do not switch customer quoting to perimeter unless perimeter data becomes reliable

### `removal_rates`

Required columns:

- `id`
- `floorType`
- `aliases`
- `ratePerM2`
- `disposalFee`
- `active`

Use pipe separators for `aliases`.

### `location_zones`

Required columns:

- `zoneName`
- `suburbs`
- `postcodes`
- `distanceFromBaseKm`
- `travelFee`
- `minimumJobFee`
- `surchargePercent`
- `active`
- `fallback`

Use pipe separators for:

- `suburbs`
- `postcodes`

### `pricing_rules`

Required columns:

- `key`
- `value`

Optional column:

- `type`

Recommended `type` values:

- `number`
- `boolean`
- `string`

Example:

| key | value | type |
|---|---:|---|
| standardWastagePercent | 10 | number |
| herringboneWastagePercent | 20 | number |
| exposeInternalRates | false | boolean |

## Publishing Requirement

The website is static on Netlify, so the sheet must be publicly readable in published form for the browser to fetch it directly.

Recommended approach:

## Product Upload Policy

For supplier catalogue uploads, keep commercial pricing and catalogue media separate from richer range information.

- product/range IDs, categories, colours, thickness, pricing, and supplier URLs stay in the structured product data source
- if a supplier range page or product page exposes shared `Description`, `Features`, and `Technical` content for the whole range, store that as range-level metadata in `apps/web/products.js`
- if the range page itself is sparse, inspect the supplier brochure PDF and representative product page excerpts before writing range-level copy; use the richest supplier-backed source available instead of leaving placeholder summaries
- use `RANGE_CONFIG.<category>.<range>.rangeContent` for this shared supplier information instead of duplicating it across every colour
- if a supplier colour page exposes second or third gallery images, download them locally and attach them to that product via `galleryImages` in `apps/web/products.js`
- the first local image should stay as the main catalogue image and any extra local images should be saved as additional gallery images for the lightbox / popup
- before closing a product upload task, verify every supplier colour page in that range for extra gallery images; a range is not complete until those local gallery assets and `galleryImages` links are in place
- before closing a product upload task, verify the range-level `description`, `features`, and `technical` sections against the supplier category page, brochure, and a representative product page so the range modal is materially complete
- if the supplier website runs on Shopify, inspect the collection/range landing page plus the `/products/<handle>.js` payload for each colour so supplier descriptions and every gallery image are captured before import completion
- customer-facing catalogue UI should show this content from the range thumbnail or range information popup, not inside every colour-selection drawer
- all range cards on `products.html` should use the same colour-preview pattern:
  - show `View X colours` on the card
  - open a compact popup preview for colour browsing
  - do not use long inline colour drawers on the catalogue page
- if a customer opens a single colour image from the range preview popup, the image lightbox should include a back button that returns to the full `View X colours` popup
- range selection and colour browsing should stay separate:
  - `Select this range` and `Continue to quote` save the range
  - colour preview popup is for browsing only
  - if a category requires final colour choice later, enforce that in the quote flow rather than the catalogue card
- keep this content informational only; do not mix it into pricing logic, quote formulas, or hidden lead field behavior

1. In Google Sheets, keep the file owned by the business account
2. Publish the tabs needed for the website
3. Use the spreadsheet ID in `pricingSourceConfig.js`

## Enable Google Sheets Mode

Edit:

- `apps/web/pricingSourceConfig.js`

Set:

```js
mode: "google_sheets",
googleSheets: {
  spreadsheetId: "YOUR_GOOGLE_SHEET_ID",
  sourceLabel: "Google Sheets"
}
```

## Safe Fallback

If the sheet is unavailable:

- quote logic still runs
- catalogue still loads
- the site falls back to the local JS pricing files

## Current Limitation

This is browser-side fetching from a published Google Sheet.

That means:

- pricing is easier for you to edit
- but it is not secure admin-only pricing storage

Longer term, Supabase is still the stronger option for:

- role-based editing
- audit history
- protected admin changes
- operational workflows
