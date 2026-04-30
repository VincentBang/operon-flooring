# Operon Quote System Project Memory

Status: quote-system-specific reference memory. Active project direction now lives in `apps/web/PROJECT_MEMORY.md`. Use this file for quote-engine detail, not as the top-level business brief.

Last updated: 2026-04-28  
Primary page: `/apps/web/index.html`  
Primary pricing rules source: `apps/web/OPERON_PRICING_RULES.md`
Primary business / SEO brief: `apps/web/OPERON_BUSINESS_OBJECTIVES_MARKETING_SEO_BRIEF.md`

## Purpose

This file is the working memory for the Operon flooring quote system.  
Its job is to reduce repeated explanation, preserve pricing decisions, and keep changes aligned with the approved quoting engine direction.

## Source Of Truth

Before editing the quote system, always read these first if they exist:

1. `apps/web/PROJECT_MEMORY.md`
2. `apps/web/OPERON_PRICING_RULES.md`
3. `apps/web/OPERON_BUSINESS_OBJECTIVES_MARKETING_SEO_BRIEF.md`
4. `apps/web/index.html`
5. Any pricing / quote / config JavaScript files

If a rule exists in `OPERON_PRICING_RULES.md`, follow it strictly.

## Product Goal

Build a clean, customer-facing flooring quote page that:

1. collects customer details
2. collects property / access / postcode details
3. collects job type and flooring product
4. collects area using one of three methods
5. calculates a quote using approved pricing logic
6. shows a clean customer-friendly summary
7. preserves or connects submit / save / send behaviour if backend exists

This page is for quote conversion, not visual entertainment.

Current marketing direction:

- position Operon as a smarter flooring quote system for Sydney customers
- keep the site practical, premium, and easy for normal homeowners to use
- keep the quote wizard high on the page
- keep SEO content below the tool
- avoid AI hype, generic brochure language, and fake automation claims

Current SEO architecture:

- `index.html` is the primary money page for `flooring quote sydney`
- `floorplan.html` supports quote conversion by helping customers measure area
- product SEO pages exist for laminate, hybrid and engineered timber
- location SEO pages exist for Liverpool, Cabramatta, Parramatta, Miranda and Eastern Suburbs
- blog and education pages live under `apps/web/blog`
- when new SEO pages are added, keep canonical tags, FAQ sections, internal links and sitemap entries aligned

## Current Quote Page State

Current file: `apps/web/index.html`

Note:

`floorplan.html` is the floor plan measurement tool. It should default to Trace Room Mode and output confirmed flooring area for `index.html`.
Quick Room Mode inside `floorplan.html` has its own phased memory file at `apps/web/QUICK_ROOM_MODE_MEMORY.md`.

Current structure is step-based:

1. Customer details
2. Property and access
3. Job type and product
4. Measurement method
5. Add-ons and site conditions
6. Submit quote request + live summary

Current navigation / handoff rules:

- `index.html` is the main customer-facing quote page and should preserve draft state locally while the customer works
- moving from `index.html` to `floorplan.html` should preserve the quote context and return the customer to Step 4
- returning from `floorplan.html` should show the saved measured area without silently overwriting other measurement choices
- once `quote_requests` is saved successfully, child-save issues for rooms, items, or files should be treated as partial success, not a lost lead

Current deployment rule:

- Netlify is the primary static hosting target
- publish directory should stay `apps/web`
- keep redirects and basic headers in `netlify.toml` so deployment behavior is tracked in code, not only in the dashboard
- keep SEO deployment files in `apps/web`, including `robots.txt` and `sitemap.xml`
- if the public domain changes, update canonical paths and `sitemap.xml` domain entries before the next production deploy

Current layout direction:

- clean
- premium
- mobile friendly
- minimal clutter
- no visualiser flow

## Explicitly Removed / Avoided

These are out of scope for the quote page for now:

- visualiser
- AI floor replacement
- AR / photo preview
- tech demo wording
- duplicated marketing blocks
- hype copy
- complex visible pricing logic

## Approved Measurement Methods

The quote page must support exactly these three paths:

### 1. Manual total area

- user enters total area in m²
- `real_area = total_area_m2`

### 2. Room-by-room

Each room has:

- room name
- length
- width
- area = length × width

Total:

- `real_area = sum(room areas)`
- `room_count = number of valid measured rooms`

### 3. Floor plan upload

Current allowed behaviour:

- upload PDF / JPG / PNG
- store and display uploaded file name
- allow confirmed measured area input
- `real_area = confirmed_floorplan_area`

Do not fake automatic floor plan measurement.

Required customer note:

`Upload your floor plan. We will confirm the area before final quote.`

## Core Pricing Logic

These rules come from `OPERON_PRICING_RULES.md` and must stay stable unless the source file changes.

### Real area

- `real_area` = actual measured flooring area

### Wastage

- standard plank / hybrid / laminate / timber = `1.10`
- herringbone / chevron = `1.20`

### Chargeable area

- `chargeable_area = real_area × wastage_factor`

### Quantity basis

- material supply → `chargeable_area`
- installation labour → `real_area`
- installation only → `real_area`
- removal → `real_area`
- floor prep → `real_area`
- moisture barrier → `chargeable_area`
- skirting → `chargeable_area`
- scotia → `chargeable_area`
- furniture handling → `room_count`
- door trimming → `each`

Important:

Do not change skirting or scotia to perimeter.  
This is intentionally area-based as a commercial allowance.

## Quote Modes

### Supply & Install

Internal logic:

- material uses `chargeable_area`
- installation uses `real_area`

Customer-facing display:

- bundled flooring package
- do not expose separate material and installation rates by default

### Installation Only

Rules:

- labour uses `real_area`
- no material supply charge
- do not apply wastage to installation labour

## Access Logic

Collect:

- `property_type`
- `level`
- `has_lift`
- `parking_access`

Apply access multiplier only to labour-heavy lines:

- installation
- removal
- furniture
- floor prep
- skirting package
- scotia package
- door trimming

Do not apply access multiplier to material supply.

Approved default access logic:

- house / townhouse = `1.00`
- lift available = `1.00`
- unit ground = `1.00`
- unit level 1 without lift = `1.05`
- unit level 2+ without lift = `1.10`
- unclear / unsure access should trigger manual review

## Zone / Postcode Logic

Use suburb or postcode to match the pricing zone.

Default zone behaviour:

- unknown suburbs/postcodes fall back to the default Sydney zone
- customer should not see raw surcharge formulas
- zone adjustments apply only to labour-heavy lines

Current editable config now lives in:

- `apps/web/locationZones.js`

Base reference location:

- Auburn NSW

## Small Job / Minimum Charge / Rounding

Current implementation follows the rules file:

- small job threshold = `30 m²`
- small job factor = `1.10`
- minimum charge ex GST = `1500`
- rounding increment = nearest `$50`
- GST = `10%`

Minimum charge should only apply when there is a real non-zero subtotal.

## Manual Review Rules

`manualReviewRequired = true` if any of these apply:

- stairs selected
- floor plan uploaded but confirmed area missing
- real area missing or zero
- property / access details unclear
- heavy floor prep selected
- manual floor prep selected
- removal type = other
- heavy furniture selected
- room count missing when furniture handling is selected
- postcode missing
- parking marked unsure

Current note shown to customer when triggered:

`Estimate only — final quote subject to site confirmation.`

## Current Pricing Engine Functions

These now live in the central pricing modules:

- `apps/web/pricingRules.js`
- `apps/web/installRates.js`
- `apps/web/underlay.js`
- `apps/web/skirtingScotia.js`
- `apps/web/removalRates.js`
- `apps/web/locationZones.js`
- `apps/web/quoteCalculator.js`

The quote page should call `quoteCalculator.js` rather than embedding new rate cards or formula branches in the HTML.

## Current Known TODOs

These are already present or implied and should be preserved until confirmed:

1. Confirm install-only rates by product family.
2. Confirm final live production rates in the rate card.
3. Confirm whether limited parking should add a separate labour adjustment.
4. Confirm whether herringbone / chevron need a different installation labour rate, not just 20% wastage.

If unclear, add TODO comments. Do not guess silently.

## Current Commercial Safeguards

The quote page must continue to protect margin by:

- hiding material rate from customer
- hiding installation rate from customer
- hiding access multiplier from customer logic explanation
- hiding zone multiplier from customer logic explanation
- bundling supply & install customer-facing lines
- baking project condition effects into totals instead of naming them aggressively

## Customer-Facing Copy Principles

Use calm, simple wording:

- `Get an estimated flooring quote`
- `Final price confirmed after site check`
- `Upload a floor plan if available`
- `Estimate is enough — we will confirm before installation`
- `Not sure? Choose unsure and we will review`

Avoid:

- surcharge
- penalty
- distance fee
- AI hype
- complex technical explanations

## SEO Direction

The quote page should target Sydney flooring quote intent without becoming a content-heavy blog page.

Recommended compact SEO topics below the tool:

1. Flooring quote Sydney
2. What affects flooring installation cost?
3. Supply and install vs installation only
4. Floor preparation and removal costs
5. Apartment, lift and access considerations
6. Final quote confirmation

Keep these short and conversion-friendly.

## Working Method

When iterating on the quote system, follow these phases:

1. Clean layout and remove distractions
2. Build complete input flow
3. Implement pricing engine from rules
4. Connect all measurement methods
5. Add quote summary and manual review logic
6. Improve SEO without clutter
7. Debug and test all flows
8. Refactor comments and remove dead code

Do not do random redesigns.  
Do not add unrelated features.  
Do not build visualiser on the quote page.

## Debugging Checklist

After each meaningful change, check:

1. page loads without JS errors
2. manual total area works
3. room-by-room total works
4. floor plan upload + confirmed area works
5. supply & install summary works
6. install-only summary works
7. access multiplier flow works
8. postcode / zone flow works
9. add-ons work:
   - removal
   - floor prep
   - moisture barrier
   - skirting
   - scotia
   - furniture
   - door trimming
10. mobile layout still works
11. customer summary updates correctly

## Change Policy

When unsure:

- preserve current behaviour unless obviously broken
- add TODO comments
- document assumptions
- avoid hidden business logic changes

This quote system is the foundation of a future trade pricing engine.  
Optimise for:

- quote conversion
- margin protection
- operational clarity
- future SaaS reuse
