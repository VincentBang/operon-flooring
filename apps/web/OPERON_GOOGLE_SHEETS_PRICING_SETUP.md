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
