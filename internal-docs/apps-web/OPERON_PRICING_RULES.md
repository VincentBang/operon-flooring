# OPERON PRICING RULES & ENGINE SPECIFICATION

Source-of-truth status: active pricing logic reference for quote calculations, quantity basis, and customer-facing guardrails.

Version: 1.0  
Purpose: Codex implementation reference  
System: Flooring quoting app / future Operon trade pricing engine  
Business context: Timber / hybrid / laminate / engineered flooring supply, installation, removal, skirting/scotia, floor prep, moisture barrier, furniture handling, door trimming, and related add-ons.

Current frontend runtime implementation:

- `apps/web/products.js`
- `apps/web/installRates.js`
- `apps/web/underlay.js`
- `apps/web/skirtingScotia.js`
- `apps/web/removalRates.js`
- `apps/web/locationZones.js`
- `apps/web/pricingRules.js`
- `apps/web/stairRates.js`
- `apps/web/quoteCalculator.js`

These files are the maintainable runtime layer for the website. Avoid reintroducing duplicated pricing tables or formula branches inside HTML pages.

---

## 1. Core Principle

This pricing engine is not a generic calculator. It is a commercial pricing system designed to protect margin, simplify customer-facing quotes, and create a future SaaS-ready pricing layer for trade businesses.

The system must separate:

1. Measurement logic
2. Pricing logic
3. Risk / access / location adjustment logic
4. Customer-facing quote display logic
5. Internal margin and operational control logic

Do not mix these randomly inside the Streamlit UI. The final implementation should move pricing logic into a dedicated module such as:

```text
pricing_engine.py
pricing_rules.py
quote_schema.py
zone_rules.py
app.py
```

`app.py` should collect inputs and display outputs. It should not contain the core pricing formulas.

---

## 2. Definitions

### 2.1 Real Area

`real_area` means the actual measured flooring area.

Formula:

```python
real_area = sum(room.length * room.width for room in rooms)
```

Use `real_area` for labour-driven work unless otherwise specified.

Examples:

- installation labour
- installation-only quotes
- floor preparation
- removal

---

### 2.2 Wastage Factor

Wastage applies mainly to material quantity, not labour.

Default:

```python
standard_wastage_factor = 1.10
```

Future product/pattern-specific wastage:

```python
standard_flooring = 1.10
herringbone = 1.20
chevron = 1.20
```

Do not expose wastage logic unnecessarily to customers unless the quote format requires it.

---

### 2.3 Chargeable Area / Material Area

`chargeable_area` and `material_area` refer to the same concept in this pricing system.

Formula:

```python
chargeable_area = real_area * wastage_factor
material_area = chargeable_area
```

Use `chargeable_area` for:

- material supply quantity
- moisture barrier quantity
- skirting allowance quantity
- scotia allowance quantity

Do not use `chargeable_area` for installation-only labour unless explicitly intended.

---

### 2.4 Room Count

`room_count` is the number of rooms entered in the measurement section.

Use for room-based items such as:

- furniture handling

Formula:

```python
room_count = len(rooms)
```

---

### 2.5 Each Quantity

Use `each` for count-based items.

Examples:

- door trimming
- trims if selected as individual pieces

---

### 2.6 Stair Quantity And Width Tiers

Stairs are priced as count-based scope, but they are not a simple flat `each` rate.

Customer-facing stair inputs should collect:

- whether the project includes stairs
- whether the customer knows the stair width
- stair width in millimetres if known
- quantities for straight stair treads
- quantities for winder / triangular stair treads
- quantities for landings up to 1 m²
- quantities for landings up to 2 m²
- quantities for one-side open stair treads
- quantities for two-side open stair treads

Internal stair pricing is private and range-based. Each product range needs 12 stair price slots:

```text
6 stair types x short-width price
6 stair types x long-width price
```

Width guide:

- hybrid and laminate use `1200 mm`
- engineered timber uses `plank_length_mm / 2`
- engineered herringbone or chevron ranges use the matching straight plank range length, not the shorter patterned board length

If the customer does not know the width, the estimate uses the short-width stair price and shows a warning that the final stair price changes if confirmed width is over the guide.

Stair line items must be customer-facing totals only. Do not expose the stair unit prices, range price table, width formulas, or installer/material breakdown.

---

## 3. Quote Modes

The app must support at least two main quote modes:

1. Supply & Install
2. Installation Only

---

## 4. Supply & Install Logic

### 4.1 Internal Calculation

For supply and install, internally split material and labour even if the customer-facing quote is bundled.

```python
material_total = chargeable_area * material_rate
installation_total = real_area * installation_rate
```

Then apply labour/access/location multipliers to labour-heavy components only.

### 4.2 Customer-Facing Display

Do not expose material rate and installation rate separately by default.

Customer-facing display should show a bundled package line such as:

```text
Supply & install selected flooring package
```

Reason:

- protects margin
- prevents direct material/labour comparison shopping
- keeps quote cleaner
- avoids customer confusion about wastage vs labour area

The internal system may keep itemised components, but the customer-facing PDF/text quote should be bundled unless admin chooses otherwise.

---

## 5. Installation Only Logic

Installation-only quotes must use real measured area only.

```python
installation_only_total = real_area * installation_only_rate
```

Do not apply wastage to installation-only labour.

Reason:

- labour is based on actual installed area
- customer supplies material separately
- charging labour on wastage would be commercially harder to justify

---

## 6. Material Logic

Material is priced using chargeable area.

```python
material_qty = chargeable_area
material_total = material_qty * material_rate
```

Wastage should be:

```python
if pattern in ["herringbone", "chevron"]:
    wastage_factor = 1.20
else:
    wastage_factor = 1.10
```

Future extension:

- product-specific wastage
- supplier pack-size rounding
- minimum order quantity
- stock availability margin

Do not implement future extensions unless requested.

---

## 7. Skirting Logic

### 7.1 Commercial Rule

Skirting should use chargeable area as the default commercial allowance base.

```python
skirting_qty = chargeable_area
skirting_total = skirting_qty * skirting_rate
```

Important: although skirting is physically related to perimeter, the current business quoting practice uses area-based allowance because exact perimeter is not reliable from simple room inputs.

Reasons perimeter is not reliable:

- doors reduce skirting length
- sliding doors reduce skirting length
- wardrobes may reduce skirting length
- kitchen areas may not need skirting
- openings and transitions vary by site
- builder/customer-specific scope can change
- simple perimeter calculation creates false precision

Therefore, do not replace skirting logic with perimeter logic by default.

### 7.2 Naming Rule

Internally, treat this as:

```text
skirting_area_allowance
```

Not as exact lineal metres.

Customer-facing label may simply say:

```text
Supply & install skirting package
```

or:

```text
Skirting installation allowance
```

Avoid exposing confusing units if not required.

### 7.3 Multipliers

Skirting is labour-heavy, so it should receive access/location multipliers.

```python
adjusted_skirting_total = skirting_total * access_factor * zone_multiplier
```

If implementation groups labour-heavy items into one labour base, skirting should be included in that labour-adjusted group.

---

## 8. Scotia Logic

Scotia should follow the same rule as skirting.

```python
scotia_qty = chargeable_area
scotia_total = scotia_qty * scotia_rate
```

Scotia is also labour/package related and should receive labour-heavy access/location multipliers.

---

## 9. Moisture Barrier Logic

Moisture barrier should use chargeable area.

```python
moisture_barrier_qty = chargeable_area
moisture_barrier_total = moisture_barrier_qty * moisture_barrier_rate
```

Reason:

- it is material coverage related
- wastage/overlap may be required
- it follows material allowance logic more than labour-only area

Do not use real_area for moisture barrier unless explicitly changed later.

---

## 10. Floor Preparation Logic

Floor preparation should use real area.

```python
floor_prep_qty = real_area
floor_prep_total = floor_prep_qty * floor_prep_rate
```

Reason:

- prep is applied to actual floor area
- wastage does not apply
- labour/material usage usually follows actual floor surface needing prep

Floor prep is labour-heavy and should receive access/location multipliers.

```python
adjusted_floor_prep_total = floor_prep_total * access_factor * zone_multiplier
```

---

## 11. Furniture Handling Logic

Furniture handling should use room count.

```python
furniture_qty = room_count
furniture_total = furniture_qty * furniture_rate_per_room
```

Furniture handling is labour-heavy and should receive access/location multipliers.

```python
adjusted_furniture_total = furniture_total * access_factor * zone_multiplier
```

Future improvement:

- light / medium / heavy furniture level
- furnished vs empty property
- piano / heavy cabinet surcharge

Do not implement future improvement unless requested.

---

## 12. Door Trimming Logic

Door trimming should use each quantity.

```python
door_trimming_qty = number_of_doors
 door_trimming_total = door_trimming_qty * door_trimming_rate
```

Door trimming is labour-based. It may receive access/location multipliers if the system treats all labour-heavy add-ons consistently.

Recommended v1:

```python
adjusted_door_trimming_total = door_trimming_total * access_factor * zone_multiplier
```

If this makes small each-items too expensive, allow admin override later.

---

## 13. Removal Logic

Removal should use real area.

```python
removal_qty = real_area
removal_total = removal_qty * removal_rate
```

No wastage applies to removal.

Removal should be separated into sub-items, not one generic removal rate.

Examples:

```text
carpet removal
floating timber removal
glued timber removal
tile removal
vinyl removal
hybrid removal
```

Each removal type should have its own base rate.

Removal is labour-heavy and should receive access/location multipliers.

```python
adjusted_removal_total = removal_total * access_factor * zone_multiplier
```

Future extension:

- disposal fee
- skip bin fee
- asbestos/special handling exclusion
- tile dust/grinding complexity

Do not implement unless requested.

---

## 14. Add-on Quantity Basis Rules

Every add-on must define its own quantity basis.

Do not rely only on generic unit guessing unless necessary.

Recommended field in database/sheet:

```text
quantity_basis
```

Valid values:

```text
real_area
chargeable_area
room_count
each
manual
```

### Recommended defaults

```text
moisture barrier -> chargeable_area
floor prep -> real_area
furniture handling -> room_count
door trimming -> each
skirting -> chargeable_area
scotia -> chargeable_area
removal -> real_area
```

If `quantity_basis` is missing, fallback carefully:

```python
if unit in ["m2", "m²"]:
    qty = real_area
elif unit in ["room", "rooms"]:
    qty = room_count
elif unit in ["each", "ea", "unit"]:
    qty = manual_qty_or_default_1
else:
    qty = manual_qty_or_default_1
```

But preferred implementation is explicit `quantity_basis` per item.

---

## 15. Labour-Heavy Components

The following components are labour-heavy and should receive access and suburb/zone multipliers:

```text
installation
installation-only labour
removal
furniture handling
floor preparation
skirting package/labour
scotia package/labour
door trimming
```

Do not apply access/location multipliers to material supply unless delivery/access cost genuinely increases.

Material supply should generally remain unadjusted by property level or suburb.

Exception later:

- long-distance delivery surcharge
- special delivery into high-rise
- supplier freight issue

Do not implement exceptions unless requested.

---

## 16. Property Type / Unit Access Logic

Add these fields near the top of the quote form:

```text
property_type:
- house
- townhouse
- unit/apartment

level:
- ground
- level 1
- level 2+

has_lift:
- yes
- no
```

### 16.1 Access Factor

Recommended v1:

```python
def get_access_factor(property_type, level, has_lift):
    if property_type in ["house", "townhouse"]:
        return 1.00

    if has_lift:
        return 1.00

    if property_type == "unit/apartment":
        if level == "ground":
            return 1.00
        if level == "level 1":
            return 1.05
        if level == "level 2+":
            return 1.10

    return 1.00
```

### 16.2 Commercial Meaning

This factor compensates for:

- carrying materials upstairs
- slower unloading
- restricted access
- fatigue
- lower daily productivity
- removal/disposal difficulty

It should be applied only to labour-heavy components.

---

## 17. Suburb / Area / Zone Logic

### 17.1 Core Principle

Suburb pricing should not be an obvious customer-facing travel fee by default.

It should be an operational friction factor baked into labour-heavy components.

The purpose is to recover productivity loss from:

- distance
- traffic
- parking difficulty
- crew travel time
- job density
- inefficient scheduling

### 17.2 Base Location

Use Auburn as the operational base/reference point unless changed later.

```python
BASE_LOCATION = "Auburn NSW"
```

### 17.3 Zone-Based Model

Use postcode or suburb-to-zone mapping.

Recommended zones:

```text
Zone A: Core / efficient zone
Zone B: Near / low friction
Zone C: Medium / moderate friction
Zone D: Far / high friction
Zone E: Extreme / manual review
```

### 17.4 Recommended Multipliers

```python
ZONE_MULTIPLIER = {
    "A": 1.00,
    "B": 1.04,
    "C": 1.07,
    "D": 1.10,
    "E": 1.15,
}
```

Default fallback:

```python
DEFAULT_ZONE = "C"
```

If postcode is unknown, either:

1. Ask user to enter postcode, or
2. Apply Zone C as safe default, or
3. Mark quote as estimate/manual review.

Recommended v1: use Zone C fallback.

### 17.5 Example Postcode Mapping

This is only a starting framework and must be tuned against actual job history.

```python
ZONE_MAP = {
    "A": [2144, 2140, 2150, 2127],
    "B": [2200, 2170, 2165, 2166, 2112, 2113],
    "C": [2148, 2765, 2040, 2041, 2153],
    "D": [2095, 2026, 2230],
}
```

Codex should implement the zone logic in a way that allows easy editing later.

Do not hard-code every Sydney postcode deeply into app logic. Store mapping in a dictionary, config file, Google Sheet tab, or database table.

### 17.6 Application Rule

Apply zone multiplier only to labour-heavy subtotal.

```python
labour_adjusted_total = labour_base_total * access_factor * zone_multiplier
```

Do not apply to material supply by default.

---

## 18. Small Job Protection

Small jobs are margin-dangerous because travel, setup, admin, unloading, and site coordination do not scale down with area.

Recommended v1:

```python
if real_area < 30:
    small_job_factor = 1.10
else:
    small_job_factor = 1.00
```

Apply this to labour-heavy subtotal or final subtotal depending on implementation.

Recommended:

```python
labour_adjusted_total *= small_job_factor
```

Reason: the inefficiency is mainly labour/admin related, not material supply.

Future improvement:

```text
<20 m2 -> 1.20
20-30 m2 -> 1.10
30+ m2 -> 1.00
```

Do not overcomplicate v1 unless requested.

---

## 19. Minimum Charge

A minimum charge protects against unprofitable jobs.

Recommended configurable field:

```python
minimum_charge_ex_gst = 1500
```

or admin-configurable by quote type.

Example:

```python
subtotal_ex_gst = max(subtotal_ex_gst, minimum_charge_ex_gst)
```

This should be applied before GST.

Future improvement:

- different minimums for supply & install vs install only
- different minimums for repair jobs
- different minimums by zone

---

## 20. Rounding Rule

Round final subtotal before GST.

Recommended:

```python
subtotal_ex_gst = round(subtotal_ex_gst / 50) * 50
```

Alternative later:

```python
round to nearest 100
```

Do not expose exact machine-calculated cents to customers.

Rounding improves presentation and pricing psychology.

---

## 21. GST Rule

GST is 10%.

```python
gst = subtotal_ex_gst * 0.10
total_inc_gst = subtotal_ex_gst + gst
```

System must support displaying:

```text
Subtotal ex GST
GST
Total inc GST
```

But user has also requested mobile-friendly text output showing subtotal excluding GST with no GST added in some contexts. Keep quote display configurable.

---

## 22. Customer-Facing Quote Display Rules

### 22.1 Do Not Over-Expose Internal Logic

Do not show:

- material rate separately from install rate by default
- access multiplier
- suburb multiplier
- small job factor
- margin factor

These are internal pricing controls.

### 22.2 Recommended Customer Lines

Supply & Install mode:

```text
Supply & install selected flooring package
Removal / preparation / accessories as selected
Skirting / scotia package if selected
Furniture handling if selected
Door trimming if selected
```

Installation Only mode:

```text
Installation labour
Removal / preparation / accessories as selected
Skirting / scotia package if selected
Furniture handling if selected
Door trimming if selected
```

### 22.3 Avoid Bad Labels

Avoid labels like:

```text
Distance surcharge
Unit surcharge
Difficult access surcharge
```

Use bundled total or neutral wording such as:

```text
Project conditions adjustment
```

Only show this if absolutely necessary.

Recommended default: bake into line totals and do not display separately.

---

## 23. Internal Quote Breakdown

The admin/internal view should show full breakdown:

```text
real_area
wastage_factor
chargeable_area
material_total
installation_total
removal_total
floor_prep_total
moisture_barrier_total
skirting_total
scotia_total
furniture_total
door_trimming_total
zone_multiplier
access_factor
small_job_factor
minimum_charge_applied
rounding_adjustment
subtotal_ex_gst
gst
total_inc_gst
```

This helps debug margin and pricing consistency.

Customer-facing quote should remain cleaner.

---

## 24. Recommended Pricing Engine Flow

```python
# 1. Measurements
real_area = calculate_real_area(rooms)
wastage_factor = get_wastage_factor(product_pattern)
chargeable_area = real_area * wastage_factor
room_count = len(rooms)

# 2. Factors
access_factor = get_access_factor(property_type, level, has_lift)
zone = get_zone(postcode)
zone_multiplier = get_zone_multiplier(zone)
small_job_factor = get_small_job_factor(real_area)

# 3. Material
material_total = chargeable_area * material_rate

# 4. Labour-heavy components
installation_total = real_area * installation_rate
removal_total = real_area * removal_rate
floor_prep_total = real_area * floor_prep_rate
skirting_total = chargeable_area * skirting_rate
scotia_total = chargeable_area * scotia_rate
furniture_total = room_count * furniture_rate
 door_trimming_total = door_count * door_trimming_rate

labour_base_total = (
    installation_total
    + removal_total
    + floor_prep_total
    + skirting_total
    + scotia_total
    + furniture_total
    + door_trimming_total
)

labour_adjusted_total = labour_base_total * access_factor * zone_multiplier * small_job_factor

# 5. Material/accessory items not labour-adjusted
moisture_barrier_total = chargeable_area * moisture_barrier_rate

# 6. Other non-labour or manual add-ons
other_addons_total = sum(other_addons)

# 7. Subtotal
subtotal_ex_gst = material_total + labour_adjusted_total + moisture_barrier_total + other_addons_total

# 8. Minimum charge
subtotal_ex_gst = max(subtotal_ex_gst, minimum_charge_ex_gst)

# 9. Rounding
subtotal_ex_gst = round(subtotal_ex_gst / 50) * 50

# 10. GST
gst = subtotal_ex_gst * 0.10
total_inc_gst = subtotal_ex_gst + gst
```

Important implementation note:

If supply & install product rate in the existing database already includes both material and installation bundled together, Codex must not double-count installation. In that case, either:

1. Keep current bundled product rate and apply access/zone only to separately identified labour-heavy add-ons, or
2. Refactor database to split internal material_rate and installation_rate.

Preferred long-term architecture: split internal material and labour rates, but bundle customer display.

---

## 25. Existing App Compatibility Rule

If the current Google Sheet `products` tab only has one price column such as `sell_price`, `sell_per_m2`, or `price`, treat it as the current product/package rate unless explicitly split later.

Do not silently assume it is material-only.

Codex must inspect the current app and avoid double-counting.

Migration strategy:

### Phase 1: Preserve current behaviour

- Keep existing product package pricing
- Add access/property/zone logic only where safe
- Add explicit quantity basis for add-ons
- Improve customer/internal output

### Phase 2: Split internal pricing

Add columns later:

```text
material_rate
install_rate
bundle_display_name
quote_mode
```

Then internal engine can calculate true material/labour split while customer still sees bundled price.

---

## 26. Database / Google Sheet Recommendations

### 26.1 products tab

Recommended future columns:

```text
product_id
brand
product_name
category
pattern_type
material_rate
install_rate
package_rate
wastage_factor
active
```

For now, keep compatibility with existing columns.

### 26.2 install_only tab

Recommended columns:

```text
install_id
install_name
install_rate
category
active
```

### 26.3 removal tab

Recommended columns:

```text
removal_id
removal_type
removal_rate
quantity_basis
labour_heavy
active
```

Quantity basis for removal:

```text
real_area
```

### 26.4 skirting tab

Recommended columns:

```text
skirting_id
skirting_name
skirting_rate
quantity_basis
labour_heavy
active
```

Quantity basis:

```text
chargeable_area
```

### 26.5 addons tab

Recommended columns:

```text
addon_id
addon_name
unit
rate
quantity_basis
labour_heavy
active
customer_display_group
```

Examples:

```text
moisture barrier | m2 | chargeable_area | false or partial
floor prep | m2 | real_area | true
furniture handling | room | room_count | true
door trimming | each | each | true
```

### 26.6 zone_rules tab

Optional future tab:

```text
postcode
suburb
zone
zone_multiplier
active
```

---

## 27. Implementation Tasks for Codex

Codex should implement this in phases.

### Phase 1: Create pricing module

Create:

```text
pricing_engine.py
```

Include pure functions:

```python
calculate_real_area(rooms)
get_wastage_factor(pattern_type)
get_access_factor(property_type, level, has_lift)
get_zone(postcode)
get_zone_multiplier(zone)
get_small_job_factor(real_area)
calculate_quote(input_data)
```

Functions must be testable without Streamlit.

### Phase 2: Add quantity basis logic

Create function:

```python
get_quantity_for_item(quantity_basis, context, manual_qty=None)
```

Where context includes:

```python
{
    "real_area": real_area,
    "chargeable_area": chargeable_area,
    "room_count": room_count,
    "door_count": door_count,
}
```

### Phase 3: Integrate into Streamlit UI

Add fields:

```text
postcode
property_type
level
has_lift
product_pattern
```

Use these fields to calculate factors.

### Phase 4: Internal/admin breakdown

Show an optional internal breakdown panel in Streamlit.

Must include:

```text
real_area
chargeable_area
zone
zone_multiplier
access_factor
small_job_factor
labour_base_total
labour_adjusted_total
material_total
subtotal_ex_gst
gst
total_inc_gst
```

### Phase 5: Customer quote output

Keep customer quote clean and bundled.

Do not expose internal multipliers by default.

---

## 28. Important Constraints for Codex

1. Do not redesign business logic without instruction.
2. Do not replace skirting with perimeter-based calculation.
3. Do not apply wastage to installation-only labour.
4. Do not apply suburb/access multipliers to material supply by default.
5. Do not expose internal multipliers on customer-facing quote unless explicitly enabled.
6. Do not double-count installation if existing product price already includes supply & install package pricing.
7. Preserve current app functionality while refactoring.
8. Keep formulas simple, explicit, and easy to adjust.
9. Keep pricing logic outside the Streamlit UI where possible.
10. Prefer configurable dictionaries or tables over hard-coded scattered conditions.

---

## 29. Suggested Data Structure for calculate_quote

```python
quote_input = {
    "quote_mode": "supply_install",  # or "install_only"
    "rooms": [
        {"name": "Bedroom 1", "length": 3.0, "width": 4.0},
        {"name": "Living", "length": 5.0, "width": 4.0},
    ],
    "postcode": "2144",
    "property_type": "unit/apartment",
    "level": "level 2+",
    "has_lift": False,
    "product_pattern": "standard",
    "material_rate": 50.0,
    "installation_rate": 35.0,
    "installation_only_rate": 45.0,
    "removal_rate": 10.0,
    "floor_prep_rate": 8.0,
    "moisture_barrier_rate": 5.0,
    "skirting_rate": 12.0,
    "scotia_rate": 8.0,
    "furniture_rate_per_room": 50.0,
    "door_trimming_rate": 40.0,
    "door_count": 3,
    "minimum_charge_ex_gst": 1500,
    "rounding_increment": 50,
}
```

---

## 30. Suggested Output Structure

```python
quote_output = {
    "measurements": {
        "real_area": 50.0,
        "wastage_factor": 1.10,
        "chargeable_area": 55.0,
        "room_count": 3,
    },
    "factors": {
        "zone": "B",
        "zone_multiplier": 1.04,
        "access_factor": 1.10,
        "small_job_factor": 1.00,
    },
    "internal_breakdown": {
        "material_total": 2750.0,
        "installation_total": 1750.0,
        "removal_total": 500.0,
        "floor_prep_total": 400.0,
        "moisture_barrier_total": 275.0,
        "skirting_total": 660.0,
        "scotia_total": 0.0,
        "furniture_total": 150.0,
        "door_trimming_total": 120.0,
        "labour_base_total": 3580.0,
        "labour_adjusted_total": 4095.52,
        "other_addons_total": 0.0,
        "minimum_charge_applied": False,
        "rounding_adjustment": 4.48,
    },
    "totals": {
        "subtotal_ex_gst": 7125.0,
        "gst": 712.5,
        "total_inc_gst": 7837.5,
    },
    "customer_lines": [
        {"description": "Supply & install selected flooring package", "total": 4500.0},
        {"description": "Floor preparation", "total": 450.0},
        {"description": "Skirting package", "total": 750.0},
    ],
}
```

Values above are examples only. Codex must calculate actual values from input.

---

## 31. Strategic Direction

This pricing engine is the foundation for future Operon vertical trade OS.

The objective is not simply to generate a quote. The objective is to create a repeatable pricing intelligence layer that can later support:

- contractor SaaS
- job margin tracking
- quote conversion tracking
- suburb profitability analysis
- installer productivity analysis
- customer self-quote tools
- site inspection tools
- AI-assisted pricing recommendations

Therefore, pricing rules must be explicit, configurable, testable, and separated from UI code.
