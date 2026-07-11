# Operon Flooring Room Visualiser Master Plan

Date: 2026-07-10
Updated: 2026-07-12

## Current Professional Readiness

Estimated completion toward a professional production tool: **69%**.

This is an evidence-weighted roadmap score, not a time-spent estimate. Original Phase 1 remains 100% complete. The local-only branch is about 99% complete by implementation effort, but it is not merge-ready because native iPhone finger dragging is unverified, no Android device is connected despite verified `adb` tooling, and the catalogue has not received authorised flooring-specialist rights/fidelity approval. Production deployment remains 0% intentionally.

| Workstream | Weight | Current completion | Weighted contribution |
| --- | ---: | ---: | ---: |
| Research, architecture and approval gates | 10% | 100% | 10.0% |
| Public sample-room MVP, SEO and links | 15% | 100% | 15.0% |
| Local photo and manual mask editor | 15% | 92% | 13.8% |
| Realistic rendering and product catalogue | 20% | 60% | 12.0% |
| Genuine assisted masking | 15% | 25% | 3.8% |
| Privacy, security and future handoff readiness | 10% | 60% | 6.0% |
| Device, accessibility and performance QA | 10% | 82% | 8.2% |
| Analytics, pilot and operational readiness | 5% | 5% | 0.3% |

Weighted result from unrounded contributions: 69.0%, rounded to 69%. Table contributions are shown to one decimal place.

### 2026-07-11 Professional Editor Milestone

- Split the feature into explicit catalogue, photo-session, mask-editor, assist, renderer, image utility and type modules.
- Added nine repository-owned product textures across hybrid, laminate and engineered timber categories.
- Added product category tabs, product-aware quote/contact links, texture direction, texture scale and before/after controls.
- Added a fixed sample-room floor treatment with softened mask edges, a room-relative baseline direction and preserved light/shadow blending.
- Added browser-local image validation for supported type, 15 MB size, 32 MP pixel count and minimum usable dimensions.
- Added an aspect-ratio-correct photo stage, zoom/scroll, draggable points, arrow-key nudging, exact percentage inputs, remove point, reset, clear, undo and redo.
- Added explicit local confirmation. Suggested masks remain unconfirmable until at least one point is manually changed.
- Kept the photo and mask out of URL parameters, storage, analytics, quote, contact and lead workflows.
- Completed the full desktop Chrome and desktop Safari matrix with all three repository-owned room images, invalid replacement recovery, valid replacement and cleanup.
- Extracted pure mask-state and photo-validation modules and added deterministic tests for correction gates, confirmation revocation, history branching/bounds, MIME/extension handling and image size/dimension boundaries.
- Added a deterministic catalogue-to-`products.js` contract and corrected the engineered 136 mm Spotted Gum colour to match the source.
- Prepared and technically verified the nine-product catalogue approval packet; authorised rights and visual-fidelity review remains pending.
- Completed the physical iPhone Safari automated matrix across all three images, validation failures, replacement reset, correction, confirmation, history, cleanup and storage/URL inspection.
- Recorded 17-27 ms physical-iPhone canvas observations and preserved a 430 px real-device screenshot; native finger dragging remains a manual gate.
- Installed and verified official Android Platform Tools 37.0.0 locally; no Android handset is connected yet.

## Existing Repo Audit

Operon Flooring currently deploys from `apps/web-tsx` through `netlify.toml`, with `next build` exporting static output to `apps/web-tsx/out`. The public site intentionally preserves `.html` URLs, and `netlify.toml` has explicit extensionless redirects to `.html`.

The repo still contains a legacy `apps/web/visualiser.html` and `apps/web/visualiser-app.js`, but that route is hidden by redirects from `/visualiser` and `/visualiser.html` to `/`. The old visualiser also references upload-style capabilities that are out of scope for Phase 1. The safest move is to leave that hidden legacy route alone and create a new, clearly scoped `/room-visualiser.html` route in `apps/web-tsx`.

Shared integration points:

- Routes: `apps/web-tsx/src/lib/routes.ts`
- Layout/header/footer: `apps/web-tsx/src/components/layout/`
- Global style tokens and SEO card styles: `apps/web-tsx/src/styles/global.css`
- Sitemap: `apps/web-tsx/public/sitemap.xml`
- Redirects: `netlify.toml`
- Static QA: `internal-qa/tests/web/staticOutputContract.test.js`

## Safest Integration Path

1. Add `routes.roomVisualiser = "/room-visualiser.html"`.
2. Add `apps/web-tsx/src/app/room-visualiser/page.tsx`.
3. Keep the page self-contained with existing brand components and a small client component if interactivity needs React state.
4. Use existing public imagery and CSS-generated flooring overlays; do not add storage or upload flows.
5. Add sitemap inclusion for the canonical `.html` URL.
6. Add an extensionless redirect from `/room-visualiser` to `/room-visualiser.html`.
7. Add contextual links from homepage, products page, product category pages and footer actions.
8. Extend the static output contract to require the generated file, sitemap URL, canonical shape, visible CTAs, and absence of upload/AI/vendor/API claims.

## Phase 1 Acceptance Criteria

The first release is complete only when:

- `/room-visualiser.html` is generated in `apps/web-tsx/out`.
- The canonical URL is `https://operonflooring.com.au/room-visualiser.html`.
- The page is indexable and present in `sitemap.xml`.
- The visualiser has a branded sample room, product/look controls, before/after preview, and quote CTAs.
- Customer upload, AI masking, Supabase storage, lead submission, vendor API, and 3D room-planning UI are absent.
- Internal links point to the visualiser from relevant existing pages.
- Build, typecheck, static output QA, and public leak checks pass locally.
- No production deploy is performed.

## Phase Roadmap

### Phase 1: Sample-Room Visualiser MVP

Use one controlled room preview and a curated set of flooring looks. The user can compare before/after, select product direction, and continue to quote or adjacent workflows.

### Phase 2: Local Upload + Manual Mask

Add customer image upload that stays in the browser by default. Let the user trace the floor area, adjust corners, rotate plank direction, and discard the image. Only add quote handoff once privacy and UX are clear.

Status on 2026-07-11: implemented the professional local-only editor foundation. The customer photo is represented by a temporary browser object URL; validated replacements keep the previous photo until the next image is safe to use. The floor area supports 3 to 8 points, drag/touch-ready pointer handling, keyboard nudging, exact percentage coordinates, zoom/scroll, before/preview reveal, undo/redo, reset, clear and explicit local confirmation. Photo/mask data is not sent into quote, contact, storage, analytics or AI workflows.

### Phase 3: Assisted Masking

Add assisted mask suggestions only. Manual correction remains mandatory, and a separate privacy/performance review is required before any model inference, storage, or quote handoff.

Status on 2026-07-11: the non-inference geometric starter and browser-native canvas/ImageData heuristic are modularised behind the local assist boundary. Both return editable points only. Neither can confirm a floor area, and both require a manual point change before confirmation. No model runtime, model file, worker, network endpoint or hosted inference is present.

### Privacy and Performance Gate

Status on 2026-07-10: added a separate privacy/performance review in `docs/operon-flooring-room-visualiser-privacy-performance-review.md`. It does not approve inference, storage, vendor APIs or quote handoff. It records the consent, retention, browser-side inference, server-side inference, performance budget and handoff questions that must be answered before any real implementation design starts.

Status on 2026-07-10: added the design-only architecture comparison in `docs/operon-flooring-room-visualiser-assisted-mask-architecture-comparison.md`. It compares browser-side inference, server-side inference and vendor API options, recommends only a future browser-side prototype candidate, and keeps real inference, storage and quote handoff blocked until separately approved.

Status on 2026-07-10: added the browser-side inference spike plan in `docs/operon-flooring-room-visualiser-browser-inference-spike-plan.md`. It is a design/spec plan only and does not approve prototype implementation, model packages, model assets, image upload, storage, vendor APIs or quote handoff.

Status on 2026-07-10: created local-only prototype branch `codex/room-visualiser-local-inference-spike` and documented the branch decision in `docs/operon-flooring-room-visualiser-local-prototype-branch.md`. The branch uses browser-native canvas/ImageData only, no model package or model asset, and keeps manual correction mandatory. The prototype adds `Run local assist prototype`, a local runtime status panel and editable suggested points generated from a downscaled in-memory canvas.

Status on 2026-07-12: expanded device QA in `docs/operon-flooring-room-visualiser-device-qa-report.md`. A physical iPhone 15 Pro Max on iOS/Safari 26.5 passed the automated file-input, assist, correction, confirm, undo/redo, failure recovery, valid replacement, cleanup and storage/URL matrix for all three permission-safe images. WebDriver touch actions did not dispatch page pointer/touch events, so one direct finger-drag check remains. No Android device is connected. The branch is not ready for merge.

### Phase 4: Commercial Integrations or 3D

Evaluate Roomvo-style vendor integration, supplier catalogue mapping, or Three.js room planning only after Phase 1 and Phase 2 prove user demand and quote-quality improvement.

## Professional Tool Roadmap

| Phase | Outcome | Current status | Exit gate |
| --- | --- | --- | --- |
| 0. Branch stabilisation | Isolate the visualiser scope and finish available browser QA | Desktop complete; physical iPhone automated matrix nearly complete; Android pending | Physical device matrix passes and review scope is accepted |
| 1. Professional manual editor | Reliable pointer, touch, keyboard, zoom, precision, history, validation and failure recovery | Implemented; iPhone keyboard/editor state passed, native finger drag pending | Native iPhone drag and real Android editor checks pass |
| 2. Product rendering | 12-24 licensed products, calibrated plank scale/direction, perspective mapping and preserved lighting/shadow | Nine-product CSS renderer and approval packet implemented; specialist decision pending | Flooring specialist signs off fidelity, rights and product metadata |
| 3. Architecture hardening | Explicit workflow modules, state boundaries, feature flags and deterministic tests | Pure state/validation tests and static contracts pass; browser interaction evidence is partly manual | Physical editor workflow and remaining browser interactions are repeatably testable |
| 4. Privacy/performance gate | Memory cleanup, telemetry allowlist, performance budgets, unsupported-device fallback | Source guardrails and reviews exist; approval still limited | Updated review is explicitly approved |
| 5. Assisted-mask R&D | Named licensed model/runtime, worker isolation and 50-100 permission-safe evaluation images | Design/spike plus non-model heuristic only | Assist reduces correction effort and meets mobile budgets |
| 6. Controlled pilot | Non-sensitive events, funnel measurement, error monitoring and manual fallback | Not started | Pilot improves quote intent without unacceptable abandonment |
| 7. Optional handoff/storage | Explicit opt-in, retention, deletion, access control and separate photo consent | Blocked by design | Independent approval before implementation |
| 8. Vendor or 3D evaluation | Compare commercial value against the proven 2D workflow | Not started | Conversion evidence justifies the added cost and complexity |

Target architecture remains `LocalPhotoSession -> MaskEditor -> Renderer`, entirely browser-local. `AssistEngine` may suggest points but can never confirm them. `ProductCatalogue` may pass only non-sensitive product identifiers to the quote flow. Photo pixels and mask coordinates remain excluded.

## Next Safest Phase

1. Perform one direct native finger drag on the iPhone outside WebDriver and record whether the point moves without page-scroll conflict.
2. Connect a real Android phone with USB debugging authorised, then complete the same Chrome workflow using the verified local `adb` installation.
3. Have an authorised flooring specialist confirm public texture rights and complete the fidelity/sign-off fields in `docs/operon-flooring-room-visualiser-catalogue-approval-packet.md`, using the new physical-iPhone screenshot as mobile evidence; then apply corrections and rerun local QA.
4. Add repeatable browser interaction coverage where it can reduce the current manual regression burden without weakening the physical-device gate.
5. Keep the branch local and do not merge or deploy until the mobile matrix and catalogue decision are accepted.
6. Hold a separate approval decision before any named model/runtime, model asset, worker inference, storage, telemetry, photo handoff, vendor API or production deployment.

## Risk Controls

- Do not expose pricing internals, supplier costs, storage paths, OCR text, admin tools, or private Quote OS logic.
- Do not make thin visualiser subpages for colour, suburb, or product variants.
- Keep `/quote.html` as the primary instant quote destination.
- Keep `/blog.html` returning 404.
- Keep extensionless URLs as redirects only.
- Keep visualiser copy honest: this is a product-look preview, not a final colour guarantee.
