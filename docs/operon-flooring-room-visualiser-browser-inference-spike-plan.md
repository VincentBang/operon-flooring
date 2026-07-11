# Operon Flooring Browser-Side Inference Spike Plan

Date: 2026-07-10

Status: approved to write this design/spec plan only. Prototype implementation is not approved.

## Approval Boundary

This plan defines how a future browser-side assisted-mask spike should be evaluated. It does not approve:

- Real model inference in the live visualiser.
- Model package installation.
- Model asset downloads or public model hosting.
- Customer image upload.
- Supabase, blob or database storage.
- Vendor visualiser APIs.
- Quote, contact, lead or handoff integration.
- Production deployment.

The existing manual polygon editor remains the source of truth. Any future model output must be a suggestion that requires manual correction before use.

## Spike Goal

Determine whether browser-side inference can suggest a useful starter floor mask while keeping customer photos browser-local, preserving the manual masking workflow and staying within mobile performance limits.

The spike should answer:

- Can a browser-side model identify likely floor regions well enough to reduce manual clicks?
- Can it run after explicit user action without slowing the initial `/room-visualiser.html` load?
- Can it work without sending image pixels, mask geometry or inferred labels to Operon servers, analytics, storage or quote workflows?
- Can the UI explain uncertainty clearly and require manual correction?

## Non-Goals

- No server-side inference.
- No vendor API comparison implementation.
- No image persistence.
- No lead capture or quote handoff.
- No exact product SKU rendering.
- No 3D room planning.
- No automatic final mask acceptance.
- No production release.

## Candidate Technical Shape

The safest spike shape is an isolated local branch or throwaway prototype that can be deleted without affecting production-facing code:

1. Keep the current `/room-visualiser.html` experience unchanged by default.
2. Add a hidden or local-only experiment flag for assisted inference evaluation.
3. Lazy-load the model only after a customer selects a local photo and presses an assist control.
4. Downscale the photo in memory before inference.
5. Convert the model output into editable polygon points or an editable mask overlay.
6. Mark the generated shape as `suggested`, not `manual`.
7. Require the user to adjust or confirm the mask before preview use.
8. Clear all image, canvas, tensor and mask state when the customer clears the photo.

Candidate runtimes to evaluate:

- ONNX Runtime Web with WASM first, WebGPU only if it improves performance without narrowing browser support too far.
- MediaPipe-style browser vision runtime if model size and licensing fit the use case.
- A very small custom floor/indoor segmentation model only if licensing, asset governance and mobile performance are clear.

Do not choose a runtime until model terms, asset size and browser support have been reviewed.

## Privacy Requirements

The spike must preserve these rules:

- No photo pixels leave the browser.
- No mask geometry leaves the browser.
- No filename, EXIF data, dimensions, inferred room attributes or mask coordinates are sent to analytics.
- No model output is stored in localStorage, sessionStorage, IndexedDB, cookies, URL params or server logs.
- No quote/contact workflow receives image or mask state.
- No third-party script receives the customer photo.
- User-facing copy must state that assistance is local, uncertain and requires manual correction.

The spike must include a privacy test checklist before any user-facing demo.

## Performance Requirements

The spike should measure:

- Model asset weight.
- Time to load model after explicit assist request.
- Time from assist request to first suggested mask.
- Main-thread blocking during model load and inference.
- Peak memory while processing a typical phone photo.
- Behaviour on unsupported browsers.
- Responsiveness of undo, reset, clear photo and point editing after inference.

Initial targets:

- No model assets on initial page load.
- First assisted suggestion in under 2 seconds after model warmup on a recent mid-range phone.
- Manual editing remains responsive after suggestion.
- A complete fallback to manual masking when model load or inference fails.

## UX Requirements

The assisted flow should feel like help, not automation:

- The primary control should say `Suggest starter mask`, not `Detect floor`.
- The result state should say `Manual correction required`.
- The UI should keep numbered editable points visible.
- Users must be able to undo, move points, reset the mask and clear the photo.
- The before/after preview should not imply colour, scale or installation certainty.
- The manual-only path should remain equally available.

## Evaluation Dataset

Use a local-only test set with permission-safe images:

- Empty room with clear floor/wall boundary.
- Furnished room with rug.
- Kitchen or hallway with cabinets.
- Low-light room.
- Reflective or dark flooring.
- Stairs visible in frame.
- Oblique camera angle.
- Large window or bright glare.

Do not use customer photos unless explicit permission, retention and deletion terms are documented for the test.

## QA Gates Before Any Prototype Merge

The spike cannot merge into the main visualiser unless a later approval explicitly permits prototype implementation and these checks pass:

- Initial page bundle still excludes model assets.
- Manual masking works with inference disabled.
- Clearing a photo releases object URL and clears generated state.
- No storage APIs are used for image or mask state.
- Public leak checks pass.
- Static contract blocks server-side inference, vendor API and handoff claims.
- Mobile viewport QA confirms controls do not overlap.
- Performance notes include model weight, load time, inference time and fallback behaviour.

Expected commands for an approved prototype branch:

- `npm --prefix apps/web-tsx run build`
- `npm --prefix apps/web-tsx run typecheck`
- `npm run test:static-output`
- `npm run check:public-leaks`
- `npm run test:conversion`
- `git diff --check`

## Stop Conditions

Stop the spike and do not proceed toward implementation if:

- Model assets materially slow initial page load.
- The model requires image upload or third-party processing.
- Mobile memory use causes reloads, tab crashes or unusable editing.
- The mask suggestion is frequently misleading and increases correction effort.
- Licensing or model terms are unclear.
- Any analytics, logs or storage capture photo or mask data.
- The UX cannot make manual correction mandatory.

## Next Approval Needed

The next approval would be for a local-only prototype branch that evaluates one browser-side runtime with a permission-safe local test image set. That approval should name the runtime candidate, model source, testing devices and rollback path.

Status on 2026-07-10: local-only prototype branch approval is documented in `docs/operon-flooring-room-visualiser-local-prototype-branch.md`. The selected runtime candidate is browser-native canvas/ImageData, with no external model source and no model weights. Testing targets and rollback path are documented there.
