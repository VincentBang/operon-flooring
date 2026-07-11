# Operon Flooring Room Visualiser Device QA Report

Date: 2026-07-12

Branch: `codex/room-visualiser-local-inference-spike`

## Decision

Merge decision: not ready yet.

Reason: desktop Chrome and Safari pass the complete matrix. A physical iPhone 15 Pro Max on iOS/Safari 26.5 now passes all three repository-image uploads, local suggestions, keyboard correction, confirmation, history, replacement recovery, valid replacement, cleanup and storage/URL checks. Native finger dragging remains a manual iPhone gate because Safari WebDriver did not dispatch pointer/touch action events. No Android device is connected, and catalogue rights/fidelity approval still requires an authorised reviewer.

No production deploy was performed.

## Permission-Safe Test Images

Only these repository-owned project-room images were used:

- `apps/web-tsx/public/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg`
- `apps/web-tsx/public/images/projects/hybrid-floor-levelling-case-study/after-floor-levelling-sydney-hallway.jpg`
- `apps/web-tsx/public/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-sunlit-room-sydney.jpg`

No customer photos were used.

Failure-recovery fixtures:

- `apps/web-tsx/public/assets/mobile-menu-icon.png` at 34 x 34 pixels, below the 320-pixel minimum.
- `apps/web-tsx/public/images/products/hybrid/hrt-etf-8mm-qld-spotted-gum-gallery-2.jpg` at approximately 19 MB, above the 15 MB limit.

## Device Matrix

| Target | Method | Result | Notes |
| --- | --- | --- | --- |
| Desktop Chrome on macOS | Chrome plus native file chooser against the exported static route | Passed | All three permission-safe room images, both rejected replacement fixtures, valid replacement, correction/confirmation, undo/redo, reset and clear passed. |
| Desktop Safari on macOS | Manual Safari UI against exported `/room-visualiser.html` | Passed | All three permission-safe room images, both rejected replacement fixtures, valid replacement, correction/confirmation, undo/redo and clear passed. |
| Desktop Chrome viewport 1440 x 900 | Chrome viewport check | Passed | No horizontal overflow; sample renderer, product controls and local editor remained usable. |
| Tablet proxy 768 x 1024 | Chrome viewport check | Passed as layout proxy | Single-column workspace and product controls fit without horizontal overflow. |
| iPhone Safari size proxy 390 x 844 | Chrome viewport check only | Passed as layout proxy | No horizontal overflow. This is not a real iPhone Safari engine or touch-device result. |
| Android Chrome size proxy 412 x 915 | Chrome viewport check only | Passed as layout proxy | No horizontal overflow. This is not a real Android Chrome device result. |
| Safari WebDriver service | W3C WebDriver through local `safaridriver` | Passed | Service reported ready; iPhone Web Inspector and Remote Automation were enabled and an isolated physical-device session was created. |
| iPhone Safari physical device | CoreDevice, Safari WebDriver and local static server | Passed except native finger drag | All three images, validation recovery, replacement reset, correction/confirm/history and cleanup passed. WebDriver touch actions produced no page pointer/touch events, so one direct finger-drag check remains. |
| Android Chrome physical device | Official Android Platform Tools 37.0.0 and USB inventory | Not run | `adb` is installed and verified, but no Android device is connected or authorised. |

## Desktop Chrome Evidence

The exported route loaded with the expected title, H1, local file input, prototype command, manual-correction gate and no-model/no-upload guardrail copy.

Image workflow results:

| Room image | Result | Analysis canvas | Observed suggestion time |
| --- | --- | --- | ---: |
| Open-plan room | Passed | 180 x 240 | 61 ms |
| Hallway | Passed | 180 x 240 | 67 ms |
| Sunlit chevron room | Passed | 180 x 240 | 37 ms |

These timings are single desktop observations, not performance benchmarks.

Chrome behaviour verified:

- Each valid image produced four editable browser-local points.
- An untouched suggestion could not be confirmed.
- A manual point correction enabled local confirmation.
- Confirm, undo, redo, exact coordinate editing, zoom, reveal and reset returned the expected states.
- Replacing the hallway with the 34 x 34 image showed the minimum-dimension error and preserved the active hallway photo and mask.
- Replacing the hallway with the approximately 19 MB image showed the size-limit error and preserved the active hallway photo and mask.
- Replacing it with the valid chevron room cleared the previous error, reset the point count to zero and returned the prototype to idle before a new suggestion.
- Clear photo removed the image, points and prototype status.
- The URL did not change and no photo or mask identifier appeared in quote or contact links.

The ChatGPT Chrome Extension has file-URL access enabled, but programmatic file-chooser capture still timed out. Native Chrome file selection completed the matrix.

## Desktop Safari Evidence

Safari loaded the generated static `/room-visualiser.html` route and repository assets. Native Safari upload completed the same image and replacement matrix used in Chrome.

| Room image | Result | Analysis canvas | Observed suggestion time |
| --- | --- | --- | ---: |
| Open-plan room | Passed | 180 x 240 | 47 ms |
| Hallway | Passed | 180 x 240 | 28 ms |
| Sunlit chevron room | Passed | 180 x 240 | 12 ms |

These timings are single desktop observations, not performance benchmarks.

Safari behaviour verified:

- Each valid image produced four editable browser-local points.
- Untouched suggestions remained unconfirmable and a manual point correction enabled confirmation.
- Confirm, undo and redo passed.
- The 34 x 34 and approximately 19 MB invalid replacements showed the expected errors while preserving the active hallway photo and mask.
- A valid chevron replacement cleared the error, reset points and returned the prototype to idle.
- Clear photo removed the image, points and prototype status.
- Static server evidence contained GET-only page and asset requests; no photo upload request appeared.

### Safari WebDriver Status

`safaridriver` reported ready on 2026-07-12. After enabling Web Inspector and Remote Automation on the phone, it created an isolated W3C session against the physical iPhone. The session capability report identified iPhone, iOS/Safari 26.5 and UDID `00008130-00066D503498001C`.

## Physical iPhone Safari Evidence

Device and viewport:

- Physical iPhone 15 Pro Max, iOS/Safari 26.5.
- Browser viewport: 430 x 770 CSS pixels.
- Document width: 430 CSS pixels; no horizontal overflow.
- Route, JavaScript, CSS, room image, logo and initial product textures returned HTTP 200.

| Room image | Decode result | Analysis canvas | Observed suggestion time |
| --- | --- | --- | ---: |
| Open-plan room | 1125 x 1500, 329 KB | 180 x 240 | 27 ms |
| Hallway | 1125 x 1500, 216 KB | 180 x 240 | 24 ms |
| Sunlit chevron room | 1125 x 1500, 428 KB | 180 x 240 | 17 ms first run; 24 ms screenshot rerun |

These are isolated physical-device observations, not performance benchmarks.

Verified iPhone behaviour:

- All three permission-safe files were transferred through the real iOS Safari file input and decoded browser-locally.
- Each assist run produced four editable points and left confirmation disabled.
- A focused point accepted an ArrowRight correction from 13% to 13.3%, enabling confirmation.
- Local confirm, undo and redo passed.
- The 34 x 34 invalid replacement showed the minimum-dimension error while preserving the active 1125 x 1500 photo, corrected polygon and confirmed state.
- The approximately 19 MB invalid replacement showed the 15 MB error while preserving the same state.
- Valid hallway and chevron replacements cleared prior errors, reset points to zero and returned the prototype to idle.
- Clear photo removed the image and all points, disabled photo commands and returned the prototype to idle.
- `localStorage` and `sessionStorage` were empty after cleanup.
- The URL remained `/room-visualiser.html` with no photo or mask state.
- Static server evidence contained GET-only route/asset requests; no photo POST or upload request appeared.
- A real-device screenshot passed visual inspection at `docs/qa-evidence/operon-room-visualiser-iphone-safari-2026-07-12.png`.

Touch limitation:

- W3C touch and pointer action sequences were accepted by Safari WebDriver but did not dispatch `pointerdown`, `pointermove`, `pointerup`, `touchstart`, `touchmove` or `touchend` events to the point control.
- Native finger dragging therefore remains unverified and must be checked directly on the phone outside the isolated automation window.

## Physical Device Gate

Physical mobile QA remains incomplete only in these device areas:

- Run one direct native finger drag on the iPhone and confirm the point moves, confirmation unlocks and page scrolling does not steal the gesture.
- Connect a real Android phone with USB debugging authorised and run the complete image, correction, history, replacement, cleanup and storage/URL matrix. The verified `adb` binary is `/Users/daibang/.codex/tools/android-sdk/platform-tools/adb`.
- Layout proxies do not replace the missing Android engine/device result.

## Catalogue Gate

`docs/operon-flooring-room-visualiser-catalogue-approval-packet.md` is prepared and remains at `Status: awaiting flooring-specialist decision`. Technical preflight passes all nine source records/assets, and physical iPhone visual rendering now has screenshot evidence. No supplier image-transformation authorization was found. Preparing and technically verifying the packet is not specialist approval.

## Current Recommendation

Do not merge the local prototype branch yet. Desktop browsers and the automated physical iPhone Safari matrix are complete except native finger drag. Android tooling is ready, but a real Android Chrome matrix and authorised catalogue rights/fidelity sign-off remain required. Any real model/runtime, storage, telemetry or handoff still requires a separate explicit approval.
