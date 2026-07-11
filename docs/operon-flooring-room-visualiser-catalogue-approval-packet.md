# Operon Flooring Room Visualiser Catalogue Approval Packet

Date prepared: 2026-07-11
Updated: 2026-07-12

Status: awaiting flooring-specialist decision

Branch: `codex/room-visualiser-local-inference-spike`

## Purpose

This packet converts the visualiser catalogue review into an explicit product and asset sign-off. It does not approve production release, pricing, supplier claims, texture rights, model inference, storage, telemetry or photo handoff.

The specialist should compare each row with the current supplier catalogue, Operon's approved product source and the rendered visualiser. Do not infer approval from the product already appearing in the local prototype.

## Source Boundary

- Visualiser catalogue: `apps/web-tsx/src/app/room-visualiser/catalogue.ts`
- Existing product source: `apps/web-tsx/public/products.js`
- Local preview route: `/room-visualiser.html`
- No pricing fields are part of this review.
- Repository presence alone does not prove that an image is licensed for a public visualiser transformation.

## Technical Preflight Result

Technical preflight completed on 2026-07-11:

- All nine visualiser IDs exist in `products.js`.
- Category, range, colour, thickness policy and texture path match the repository source for all nine items.
- The two Oak Step records have no source thickness; `Confirm selected range` is therefore the correct non-claiming display.
- All nine texture assets exist, are non-empty and decode as JPEG or WebP.
- Source dimensions are 933 x 1400 for seven assets and 674 x 1013 for the two Oak Step assets.
- Desktop Chrome and Safari completed technical rendering QA for the catalogue controls and room preview.
- Physical iPhone Safari completed a 430 px technical visual/rendering check; evidence is stored at `docs/qa-evidence/operon-room-visualiser-iphone-safari-2026-07-12.png`.
- `internal-qa/tests/web/roomVisualiserCatalogue.test.js` now enforces the source-data and asset-path contract.

Technical preflight is not flooring-specialist approval. No repository document was found that grants public visualiser transformation rights for these supplier images. iPhone technical rendering has evidence; Android rendering and specialist fidelity remain unverified.

## External Supplier Preflight

Primary supplier pages reviewed on 2026-07-11:

- Topdeck Prague Oak product record: `https://topdeckflooring.com.au/products/avala-prague-oak`
- Topdeck hybrid ranges, including Avala and Storm Luxury: `https://topdeckflooring.com.au/pages/hybrid-planks-topdeck-flooring-au`
- Topdeck Project Oak Prague Natural record: `https://topdeckflooring.com.au/products/project-oak-prague-natural`
- Topdeck engineered ranges, including Project Oak and Lavanda Oak: `https://topdeckflooring.com.au/pages/euro-oak-engineered-flooring-topdeck-flooring-australia`
- Bass Timber Oak Step range, including OS103 and OS105: `https://basstimber.com.au/index.php/oak-step/`
- Oak Step brochure: `https://basstimber.com.au/wp-content/uploads/2024/10/OskstepOakstep_PLUS.pdf`

These sources support the product/range naming and relevant dimensions. The Oak Step brochure states that imagery is reference-only and physical products or samples take precedence. No reviewed supplier page provides explicit permission to copy, repeat, transform or blend the images in a public room visualiser. That is an evidence-based absence finding, not a legal conclusion; written supplier/rights-holder authorization is still required.

## Product Decisions

| Product ID | Visualiser display | Source category / range / colour | Thickness shown | Texture asset | Metadata | Texture rights | Visual fidelity | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `topdeck-avala-prague-oak` | Avala Prague Oak | Hybrid / Avala Hybrid Planks / Prague Oak | 6.5mm | `/images/products/hybrid/topdeck-avala/avala-prague-oak.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `topdeck-avala-spotted-gum` | Avala Spotted Gum | Hybrid / Avala Hybrid Planks / Spotted Gum | 6.5mm | `/images/products/hybrid/topdeck-avala/avala-spotted-gum.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `topdeck-storm-coastal-blackbutt` | Storm Coastal Blackbutt | Hybrid / Storm Luxury Hybrid Plank / Coastal Blackbutt | 7mm | `/images/products/hybrid/topdeck-storm-luxury/storm-coastal-blackbutt.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `range-oak-step-os103-california` | Oak Step California | Laminate / Oak Step / OS103 California | Confirm selected range | `/images/products/laminate/oak-step/os103-california.jpg` | Source-aligned; thickness intentionally unverified | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `topdeck-cp-kensington-grey` | Kensington Grey | Laminate / Prime Contemporary Plus Edition / Kensington Grey | 12.3mm | `/images/products/laminate/topdeck-prime-contemporary-plus/cp-kensington-grey.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `range-oak-step-os105-nsw-spotted-gum` | Oak Step NSW Spotted Gum | Laminate / Oak Step / OS105 NSW Spotted Gum | Confirm selected range | `/images/products/laminate/oak-step/os105-nsw-spotted-gum.jpg` | Source-aligned; thickness intentionally unverified | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `topdeck-project-oak-prague-natural` | Project Oak Prague Natural | Engineered timber / Project Oak / Prague Natural | 14/2mm | `/images/products/engineered-timber/topdeck-project-oak/project-oak-prague-natural.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `topdeck-spotted-gum-136mm` | Engineered Spotted Gum 136mm | Engineered timber / Wooden-Land Australian Species 136mm / Spotted Gum (136mm) | 14/3mm | `/images/products/engineered-timber/topdeck-wooden-land-australian-136mm/spotted-gum-136mm.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |
| `topdeck-lavanda-oak-british-oak-natural` | Lavanda British Oak Natural | Engineered timber / Lavanda Oak / British Oak Natural | 14/3mm | `/images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-british-oak-natural.webp` | Source-aligned | No rights evidence in repo | Desktop/iPhone technical pass; specialist pending | Pending |

## Required Checks

For every row, record one of `Approved`, `Correct`, or `Block` in each review column.

1. Confirm the product ID maps to the intended current range and colour.
2. Confirm the customer-facing name is commercially accurate and unambiguous.
3. Confirm thickness and product category. The two Oak Step entries intentionally avoid an unverified thickness.
4. Confirm the texture may be displayed, repeated, transformed and blended in a public room visualiser.
5. Confirm the swatch is representative enough for directional comparison and does not imply a final colour guarantee.
6. Check the default texture scale and direction in the fixed sample room at desktop and mobile widths.
7. Check that the tone and best-for copy do not overstate wet-area suitability, availability, performance or installation outcome.
8. Identify products that should be removed, replaced or held pending a better licensed texture.

## Global Release Decisions

| Gate | Decision | Notes |
| --- | --- | --- |
| All nine product identities are accurate | Technical pass; specialist pending | All IDs, categories, ranges and colours match `products.js`. |
| All displayed thicknesses are accurate or explicitly unverified | Technical pass; specialist pending | Seven values match; two source-null Oak Step entries use `Confirm selected range`. |
| Public visualiser texture rights are confirmed | Blocked | No rights authorization was found in the repository. |
| Fixed-room visual fidelity is acceptable as a directional preview | Desktop/iPhone technical pass; specialist pending | Chrome, Safari and physical iPhone rendering passed; specialist judgment is still required. |
| Mobile visual fidelity is acceptable | iPhone technical pass; Android/specialist pending | Physical iPhone screenshot is available; Android and specialist checks remain. |
| Product copy is customer-safe | Technical pass; specialist pending | Copy avoids pricing and installed-colour guarantees. |
| Approved set may expand from 9 toward 12-24 products | Blocked | Requires completed rights, specialist and mobile gates. |

## Sign-Off

Reviewer name: Pending

Reviewer role: Pending

Review date: Pending

Decision: `Approved` / `Approved with corrections` / `Blocked`

Corrections or removals required: Pending

No catalogue item should be treated as production-approved until this section is completed by an authorised flooring specialist and the resulting corrections pass the local build and QA gates.
