# Operon Product Content Policy

## Purpose
Product content should help customers choose a product direction and continue into a structured flooring quote. It should explain what the range is, who it suits, what needs confirmation, and which technical details matter for scope.

Product pages are not supplier brochure dumps and not price-shopping tables. Internal product rates must stay available for quote calculation, but customer-facing product cards should route users into the quote system.

## Standard Range Content Schema
Use this structure where practical:

```js
rangeContent: {
  description: [
    "Short paragraph explaining what this range is.",
    "Short paragraph explaining best fit and quote watch-out."
  ],
  bestFor: [
    "Family homes",
    "Apartments",
    "Rental upgrades",
    "Premium interiors"
  ],
  notBestFor: [
    "Wet areas unless manufacturer guidance supports it",
    "Customers wanting natural timber feel"
  ],
  featuresIntro: "Range highlights",
  features: [
    "Practical customer benefit.",
    "Practical customer benefit.",
    "Practical customer benefit.",
    "Practical customer benefit."
  ],
  quoteNotes: [
    "Final colour can be confirmed later for most hybrid ranges.",
    "Apartment jobs may need acoustic or strata confirmation.",
    "Wet-area suitability depends on manufacturer requirements and site conditions.",
    "Stairs, trims and floor preparation can materially affect final quote."
  ],
  technical: [
    { label: "Product Type", value: "" },
    { label: "Thickness / Wear Layer", value: "" },
    { label: "Board Size", value: "" },
    { label: "Core / Construction", value: "" },
    { label: "Surface / Finish", value: "" },
    { label: "Installation", value: "" },
    { label: "Water / Acoustic / Wear Rating", value: "" },
    { label: "Warranty", value: "" }
  ]
}
```

## Approved Claim Language
- Use “supplier-listed” when repeating brochure claims that Operon has not independently verified.
- Use “water-resistant positioning” or “supplier-listed waterproof board construction” instead of blanket waterproof promises.
- Use “final wet-area suitability depends on installation, subfloor, trims and manufacturer requirements.”
- Use “apartment acoustic performance depends on building, slab, underlay and strata requirements.”
- Use “confirm warranty terms before final selection.”

## Forbidden Or Risky Claims
Avoid these unless verified and caveated:
- “100% waterproof” as a standalone promise.
- “Ideal for bathrooms/laundries” without manufacturer and installation caveats.
- “DIY-friendly.”
- Wellness or health claims such as “enhances wellbeing.”
- “Superior to solid oak.”
- “Oak lasts more than 100 years.”
- “40 times tougher.”
- “100% recyclable.”
- “Guarantee of excellence.”
- Romantic brochure copy that does not help quote decisions.

## Technical Field Priority
Show customer-useful fields first:

1. Product Type
2. Thickness / Wear Layer
3. Board Size
4. Core / Construction
5. Surface / Finish
6. Installation
7. Water / Acoustic / Wear Rating
8. Warranty
9. Colour Range
10. Carton Coverage
11. Edge / Profile
12. Slip / VOC
13. Pack Weight
14. Product Code

Product Code should normally stay hidden in customer modals. Pack weight should not displace warranty, installation or water/acoustic/wear information.

## Modal Length Rules
- Overview tab: maximum two paragraphs plus short best-for and quote-note sections.
- Features tab: maximum four to five bullets.
- Technical tab: maximum eight decision-useful fields.
- Avoid long brochure paragraphs.

## Product Page Vs SEO Range Pages
Product catalogue content should help customers choose and route into quote. Future SEO range pages may be longer, but they must still include practical sections: best use, apartment notes, quote risks, alternatives, quote CTA, quote review CTA and floorplan CTA.

## Supplier Claims
Supplier brochure claims may be shown only when framed as supplier-listed and where they help customers make a quote decision. Do not turn supplier copy into Operon guarantees.

## Unknown Specs
Do not invent missing details. Use:
- “Confirm with supplier brochure”
- “Varies by colour / range; confirm before final quote”
- “Confirm before final selection”

## Apartment, Acoustic And Wet-Area Claims
- Apartment suitability depends on the building, slab, acoustic requirements, underlay and strata conditions.
- Wet-area suitability depends on manufacturer requirements, installation method, expansion/edge treatment, subfloor and site conditions.
- Hybrid or laminate water resistance does not automatically mean a product is suitable for every wet-area installation.
