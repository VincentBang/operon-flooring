# Operon Flooring Local Prototype Branch Decision

Date: 2026-07-10

Branch: `codex/room-visualiser-local-inference-spike`

## Approval Decision

Approved for a local-only prototype branch. This is not approval for production release, server-side inference, model package installation, model asset hosting, image upload, storage, vendor visualiser APIs or quote handoff.

## Runtime Candidate

Selected runtime candidate for this branch:

- Browser-native `HTMLImageElement`, `canvas` and `ImageData`.
- No ONNX Runtime package.
- No MediaPipe package.
- No WebGPU dependency.
- No WebAssembly model runtime.
- No worker bundle yet.

Reason: the existing app has no vision dependencies and this first branch should prove the browser-local UX, measurement, state cleanup and manual-correction gates before any heavier runtime is considered.

## Model Source

Model source for this branch:

- No external model.
- No downloaded weights.
- No public model asset.
- No vendor model endpoint.
- No customer image training data.

The prototype uses a small local luminance-edge heuristic on a downscaled in-memory canvas to suggest four editable floor points. This is a measurement spike for the local assist flow, not a final segmentation model.

## Testing Devices

Required test targets before this branch is considered reviewable:

- Desktop Chrome on macOS.
- Desktop Safari on macOS.
- Recent mid-range iPhone Safari.
- Recent mid-range Android Chrome.

Minimum test observations:

- Initial `/room-visualiser.html` loads without model assets.
- Local photo selection uses a browser object URL.
- `Run local assist prototype` produces editable numbered points.
- `Manual correction required` remains visible after a prototype suggestion.
- Undo, reset, clear photo and point movement remain responsive.
- Clearing a photo clears the object URL and prototype status.
- No image or mask data appears in URL params, storage, analytics or quote/contact handoff.

## Rollback Path

Rollback is intentionally simple:

1. Stay on or return to the branch before merging.
2. Remove the local canvas prototype command and status state from `apps/web-tsx/src/app/room-visualiser/LocalRoomEditor.tsx`.
3. Remove `inferBrowserLocalFloorMask` from `apps/web-tsx/src/app/room-visualiser/assist.ts`, retaining only the manual geometric starter if desired.
4. Remove `.room-prototype-status` styles from `apps/web-tsx/src/app/room-visualiser/page.tsx`.
5. Remove the branch-decision assertions from `internal-qa/tests/web/staticOutputContract.test.js`.
6. Re-run build, typecheck, static output, public leak, conversion and whitespace checks.
7. If the branch is not needed, delete `codex/room-visualiser-local-inference-spike`.

No database, storage bucket, environment variable, vendor account, hosted model asset or production deploy needs rollback because none is introduced.

## Implementation Boundary

This branch may include:

- Browser-local canvas analysis.
- Downscaled in-memory photo processing.
- Editable suggested polygon points.
- Timing and canvas-size status copy.
- Static QA guards proving no upload/storage/vendor/handoff integration.

This branch must not include:

- Customer image upload to a server.
- Supabase, blob, database or IndexedDB persistence for images or masks.
- ONNX, MediaPipe or other model package installation.
- Public model files.
- Third-party visualiser calls.
- Quote/contact/lead handoff containing photo or mask state.
- Production deployment.

## 2026-07-12 Implementation Status

- Runtime remains browser-native canvas/ImageData with no model source or model asset.
- The assist helper is isolated in `assist.ts`; photo ownership, mask history, catalogue and rendering are separate modules.
- Desktop Chrome and desktop Safari both completed all three permission-safe repository images, invalid replacement recovery, valid replacement and clear-photo cleanup.
- Suggestions remained unconfirmable until a manual correction in both desktop browsers.
- Pure deterministic tests now cover mask confirmation/history rules and photo validation boundaries.
- A deterministic catalogue contract now verifies all nine source records and assets against `products.js`.
- The catalogue approval packet passes technical preflight but remains awaiting authorised rights and visual-fidelity decisions.
- A physical iPhone 15 Pro Max on iOS/Safari 26.5 completed all three image uploads, 17-27 ms canvas observations, correction/confirm/history, replacement recovery, cleanup and storage/URL inspection.
- Safari WebDriver did not dispatch pointer/touch events for synthetic drag actions, so one direct native finger-drag check remains.
- Official Android Platform Tools 37.0.0 are installed and verified locally, but no Android device is connected; the real Android Chrome matrix remains required before merge consideration.
