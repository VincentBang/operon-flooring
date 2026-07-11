# Operon Flooring Assisted Mask Architecture Comparison

Date: 2026-07-10

Status: design-only comparison. This document does not approve implementation.

## Decision Summary

Recommended next route: keep Phase 3 as a browser-local manual workflow with the existing non-inference geometric starter mask. If assisted masking later moves beyond geometry, the safest candidate to prototype first is browser-side inference behind an explicit user action, with no image upload, no storage and no quote handoff.

Do not proceed to real inference, storage, vendor APIs or handoff design until the privacy/performance review gate is separately approved.

## Options Compared

| Option | Privacy posture | Performance risk | Product fit | Operational risk | Current decision |
| --- | --- | --- | --- | --- | --- |
| Browser-side inference | Strongest if image pixels never leave the browser. Still needs consent, model review and analytics controls. | Medium to high on mobile because model assets, memory and WebGL/WebGPU support vary. | Good fit for assistive suggestions because manual correction can stay mandatory. | Requires model asset governance, fallback states and browser QA. | Candidate for future prototype only after approval. |
| Server-side inference | Weakest unless user explicitly opts in to upload and retention is tightly controlled. | Lower client cost, but queueing, upload timeouts and server cost become material. | Useful only if browser models are not accurate or performant enough. | Requires storage boundary, deletion path, access logs and provider review. | Not approved. Defer until browser-side route is rejected. |
| Vendor visualiser API | Depends on vendor terms, data flow and whether photos leave Operon/customer control. | Usually moderate for client integration but depends on third-party payloads. | Could be strong for catalogue realism, weak for Operon's quote-control and privacy posture. | Highest dependency and commercial risk; may constrain UX, data use and SEO. | Not approved. Evaluate only after demand and privacy review. |

## Browser-Side Inference Candidate

This is the safest future candidate because it can preserve the browser-local default:

- Load model assets only after the customer selects a photo and requests assistance.
- Keep the current manual polygon editor as the source of truth.
- Label output as a suggestion, not automatic detection.
- Require the customer to review or adjust the mask before using the preview.
- Do not send image pixels, mask geometry or inferred labels to analytics, quote, contact or storage flows.
- Provide a manual-only fallback when the model fails, loads slowly or is unsupported.

Open questions before any prototype:

- Which model is small enough for mobile while giving acceptable floor-region suggestions?
- Can the model run without blocking point editing, clear-photo controls or before/after preview controls?
- Can model files be served as public static assets without licensing or supply-chain risk?
- What QA matrix covers iOS Safari, Android Chrome, desktop Safari, low memory and reduced-motion contexts?
- How will the UI explain uncertainty without sounding like a final flooring recommendation?

## Server-Side Inference Candidate

This route should remain blocked unless browser-side inference is not viable and the customer explicitly opts in to upload.

Required before design:

- Upload consent copy and a separate no-upload path.
- File size, type and content validation.
- Defined retention window for original photos, derived masks, logs and backups.
- Deletion and support workflow.
- Access control and audit behaviour for any admin/support view.
- Provider terms review for data training, logging, region and subprocessors.
- Cost and abuse controls for repeated uploads.

This route must not be bundled with lead capture. Quote handoff would need its own consent and data minimisation design.

## Vendor API Candidate

Vendor visualiser APIs may offer polished flooring previews, but they are the least controlled route for Operon's current staged rollout.

Required before design:

- Written data-flow map showing whether customer photos, masks, metadata or product choices leave the browser.
- Vendor privacy, retention, training, logging and regional processing review.
- Commercial terms, uptime dependency and exit plan.
- Catalogue mapping review so product looks do not imply exact SKU availability.
- SEO impact review if third-party scripts render core content or slow the page.
- Fallback plan when the vendor service is blocked, slow or unavailable.

This route should stay behind a demand signal from the current visualiser and quote workflows.

## Performance Review Checklist

Before any assisted-mask prototype:

- Keep initial `/room-visualiser.html` load free of model/vendor assets.
- Lazy-load assist assets only after explicit user action.
- Measure model asset weight, first suggestion time, memory use and main-thread blocking.
- Test on a recent mid-range iPhone, a recent mid-range Android phone and desktop Safari/Chrome.
- Preserve manual point editing, undo, reset and clear-photo responsiveness during assist states.
- Keep a no-assist path fully usable.
- Re-run `npm --prefix apps/web-tsx run build`, `npm --prefix apps/web-tsx run typecheck`, `npm run test:static-output`, `npm run check:public-leaks`, `npm run test:conversion` and mobile visual QA.

## Privacy Review Checklist

Before any assisted-mask prototype:

- Confirm no image pixels or mask data leave the browser for browser-side inference.
- Confirm no analytics event contains filename, image metadata, mask geometry or room attributes.
- Add user-visible labels for local-only processing, uncertainty and mandatory manual correction.
- Define opt-in copy before any upload-capable experiment.
- Confirm no quote, contact or lead workflow receives image state.
- Confirm no model/provider terms allow customer photo training without explicit approval.

## Recommendation

Keep the current non-inference geometric starter mask in production-facing code. Prepare, but do not implement, a browser-side inference spike only after explicit approval of this design comparison and the privacy/performance review gate. Server-side inference and vendor APIs should remain blocked until the browser-side route is proven unsuitable and a separate consent, retention and handoff review is completed.

Status on 2026-07-10: the browser-side inference spike plan is documented in `docs/operon-flooring-room-visualiser-browser-inference-spike-plan.md`. This approves the plan document only, not prototype implementation, model installation, image storage, vendor APIs or quote handoff.
