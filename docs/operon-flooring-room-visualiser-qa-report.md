# Operon Flooring Room Visualiser QA Report

Date: 2026-07-10
Updated: 2026-07-12

## Scope Verified

Implemented Phase 1 plus the approved local-only editor/prototype work:

- Public static route: `/room-visualiser.html`
- Branded sample-room visualiser MVP
- Nine repository-owned product textures across hybrid, laminate and engineered timber
- Product-aware quote/contact links, before/after reveal, texture direction and preview scale
- Browser-local customer room photo preview using a temporary object URL
- Manual 3-to-8-point floor polygon with pointer, keyboard and exact-coordinate correction
- Zoom/scroll, reset, clear, local confirmation and bounded undo/redo history
- File type, 15 MB, 32 MP and minimum-dimension validation
- Valid replacement reset and invalid replacement preservation
- Non-model browser canvas/ImageData suggestion prototype
- Mandatory manual correction before a suggested mask can be confirmed
- Pure deterministic mask-state and photo-validation modules with focused tests
- Deterministic nine-item catalogue source and asset contract
- Privacy copy and source guards excluding upload, persistence, telemetry and handoff
- SEO metadata, canonical, Open Graph, JSON-LD, sitemap, redirect and contextual links
- Catalogue sign-off packet prepared for an authorised flooring specialist
- Desktop Chrome and Safari QA with all three permission-safe room images
- Physical iPhone Safari automated QA with all three images, replacement recovery, cleanup and storage/URL inspection

Confirmed still out of scope:

- No real model/runtime or AI segmentation
- No Supabase, browser database or server storage
- No telemetry containing photo or mask data
- No lead, quote or contact handoff containing photo or mask data
- No vendor visualiser API
- No 3D room planner
- No merge, push or production deploy

## Review Scope Isolation

The room visualiser review scope is limited to the following files. Existing SEO work and the separate `operon-bathrooms/` tree visible in the dirty worktree are unrelated user work and were not reverted or widened.

Application and integration files:

- `apps/web-tsx/src/app/room-visualiser/FloorTexture.tsx`
- `apps/web-tsx/src/app/room-visualiser/LocalRoomEditor.tsx`
- `apps/web-tsx/src/app/room-visualiser/RoomVisualiserClient.tsx`
- `apps/web-tsx/src/app/room-visualiser/assist.ts`
- `apps/web-tsx/src/app/room-visualiser/catalogue.ts`
- `apps/web-tsx/src/app/room-visualiser/imageUtils.ts`
- `apps/web-tsx/src/app/room-visualiser/maskState.ts`
- `apps/web-tsx/src/app/room-visualiser/page.tsx`
- `apps/web-tsx/src/app/room-visualiser/photoValidation.ts`
- `apps/web-tsx/src/app/room-visualiser/types.ts`
- `apps/web-tsx/src/app/room-visualiser/useLocalPhotoSession.ts`
- `apps/web-tsx/src/app/room-visualiser/useMaskEditor.ts`
- `apps/web-tsx/public/sitemap.xml`
- `apps/web-tsx/src/app/engineered-timber-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/hybrid-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/laminate-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/page.tsx`
- `apps/web-tsx/src/components/layout/Footer.tsx`
- `apps/web-tsx/src/components/layout/Header.tsx`
- `apps/web-tsx/src/lib/routes.ts`
- `internal-qa/tests/web/roomVisualiserEditor.test.js`
- `internal-qa/tests/web/roomVisualiserCatalogue.test.js`
- `internal-qa/tests/web/staticOutputContract.test.js`
- `netlify.toml`
- `package.json`

Planning and evidence files:

- `docs/operon-flooring-room-visualiser-research.md`
- `docs/operon-flooring-room-visualiser-master-plan.md`
- `docs/operon-flooring-room-visualiser-qa-report.md`
- `docs/operon-flooring-room-visualiser-privacy-performance-review.md`
- `docs/operon-flooring-room-visualiser-assisted-mask-architecture-comparison.md`
- `docs/operon-flooring-room-visualiser-browser-inference-spike-plan.md`
- `docs/operon-flooring-room-visualiser-local-prototype-branch.md`
- `docs/operon-flooring-room-visualiser-device-qa-report.md`
- `docs/operon-flooring-room-visualiser-catalogue-approval-packet.md`
- `docs/qa-evidence/operon-room-visualiser-iphone-safari-2026-07-12.png`

## Commands Run

| Command | Result |
| --- | --- |
| `npm --prefix apps/web-tsx run build` | Passed from a clean `.next` cache. Next generated 95/95 static pages. `/room-visualiser` is 10.7 kB with 113 kB first-load JavaScript. |
| `npm --prefix apps/web-tsx run typecheck` | Passed after the production build. |
| `npm run test:room-visualiser` | Passed deterministic mask-state, photo-validation and catalogue-source tests. |
| `npm run test:static-output` | Passed generated route, metadata, sitemap, redirects, catalogue, architecture, privacy, device-report and approval-packet contracts. This command also runs both deterministic visualiser test files. |
| `npm run check:public-leaks` | Passed. |
| `npm run test:conversion` | Passed. Quote, floorplan, quote review and chatbot conversion contracts stayed green. |
| `git diff --check` | Passed. |
| Chrome responsive/visual QA | Passed at 1440 x 900, 768 x 1024, 390 x 844 and the earlier 412 x 915 layout proxy, with no page-level horizontal overflow. |
| Chrome repository-image matrix | Passed all three room images. Observed 180 x 240 suggestion times were 61 ms, 67 ms and 37 ms. |
| Safari repository-image matrix | Passed all three room images. Observed 180 x 240 suggestion times were 47 ms, 28 ms and 12 ms. |
| Chrome and Safari replacement recovery | Passed. The 34 x 34 and approximately 19 MB invalid fixtures preserved the active valid image/mask; a valid replacement reset the editor and cleared the error. |
| Chrome and Safari cleanup | Passed. Clear photo removed the image, polygon and prototype state. Static server evidence showed GET-only page/asset traffic. |
| Safari remote automation | Passed. Local `safaridriver` reported ready; iPhone Web Inspector and Remote Automation were enabled and an isolated physical-device session was created. |
| Physical iPhone Safari | Passed except native finger drag. All three images, 17-27 ms assist observations, correction/confirm/history, invalid/valid replacements, cleanup and storage/URL inspection passed on iPhone 15 Pro Max with iOS/Safari 26.5. WebDriver touch actions did not dispatch page pointer/touch events. |
| Physical Android Chrome | Not run. Official Android Platform Tools 37.0.0 were installed and verified, but no Android device was connected or authorised. |
| `CI=1 npm --prefix apps/web-tsx run lint` | Not run. The repository's deprecated `next lint` command requires interactive ESLint setup and is not a deterministic gate. |

The browser timings above are single observations, not performance benchmarks. Physical iPhone detail is recorded in the device QA report.

## Deterministic Editor Coverage

`internal-qa/tests/web/roomVisualiserEditor.test.js` exercises the pure TypeScript modules without adding a new runtime or test dependency. It covers:

- Coordinate clamping and deterministic rounding
- Manual 3-point confirmation
- Eight-point polygon limit
- Untouched suggestion rejection
- Manual correction enabling confirmation
- Subsequent editing revoking confirmation
- Undo, redo, redo-branch clearing and bounded history
- Supported MIME and extension handling
- Exact 15 MB and 32 MP boundaries
- Minimum 320-pixel dimensions

The source contract separately pins stale-decode invalidation ordering and forbids photo-session use of `localStorage`, `sessionStorage`, `indexedDB` and `fetch`.

`internal-qa/tests/web/roomVisualiserCatalogue.test.js` loads the visualiser catalogue and authoritative `products.js` source. It verifies all nine IDs, categories, ranges, colours, thickness policies, texture paths and non-empty assets. The first run detected and then corrected the engineered 136 mm Spotted Gum colour mismatch.

## Build Result

Build passed locally with `next build` and generated `/room-visualiser` as static output.

Verified output:

- `apps/web-tsx/out/room-visualiser.html` exists
- `apps/web-tsx/out/sitemap.xml` includes `https://operonflooring.com.au/room-visualiser.html`
- The generated canonical is `https://operonflooring.com.au/room-visualiser.html`
- The exported route and repository assets returned HTTP 200 from a local static server
- Next development uses `/room-visualiser`; the `.html` path is validated through static export

## Known Limitations

- The sample room uses a fixed floor region and CSS texture projection, not homography, depth estimation or photorealistic relighting.
- Manual customer-photo masking is an editable polygon with CSS rendering, not perspective-correct texture mapping.
- Customer photos are temporary browser object URLs and do not persist across sessions.
- There is no explicit EXIF normalization or rotate-photo control.
- The canvas/ImageData helper is a non-model heuristic running on the main thread. It is not floor detection or AI segmentation.
- Main-thread responsiveness and cleanup passed on the available iPhone 15 Pro Max, but remain unverified on a mid-range Android phone.
- Product looks are nine directional repository references, not a fully licensed 12-to-24-product release set or an installed-colour guarantee.
- `docs/operon-flooring-room-visualiser-catalogue-approval-packet.md` passes technical preflight but is awaiting authorised texture-rights and visual-fidelity decisions; the packet itself is not approval.
- Physical iPhone Safari passed the automated matrix, but one direct native finger-drag check remains because WebDriver did not dispatch pointer/touch events.
- No physical Android device is connected; verified `adb` tooling is ready at `/Users/daibang/.codex/tools/android-sdk/platform-tools/adb`.
- Physical iPhone runtime inspection found empty `localStorage` and `sessionStorage` after cleanup; source contracts continue to forbid storage and transmission calls.
- The physical iPhone screenshot is technical visual evidence, not flooring-specialist fidelity approval.
- The privacy/performance documents do not approve a model/runtime, storage, telemetry, vendor API or handoff.
- Lint remains unavailable because of the repository's deprecated interactive `next lint` setup.

## Next Safest Phase

1. Perform and record one direct native finger drag on the iPhone outside the isolated WebDriver window.
2. Connect an Android phone with USB debugging authorised, then run the equivalent real Chrome matrix using the verified local `adb` installation.
3. Have an authorised flooring specialist complete texture-rights and visual-fidelity decisions in the catalogue packet using the physical-iPhone screenshot, apply corrections and rerun local build/QA.
4. Add repeatable browser interaction coverage where it reduces manual desktop regression work without treating a viewport proxy as physical-device evidence.
5. Keep the branch local and do not merge, push or deploy until those gates are accepted.
6. Require a separate explicit approval before any real model/runtime, model asset, worker inference, storage, telemetry, vendor API or photo/mask handoff.
