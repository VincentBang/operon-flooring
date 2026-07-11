# Operon Flooring Room Visualiser Privacy and Performance Review

Date: 2026-07-10

## Review Decision

This review does not approve real inference, storage, quote handoff, vendor API use, or production AI features.

Current decision:

- No inference approval.
- No storage approval.
- No handoff approval.
- Manual correction remains mandatory for every assisted mask path.
- Browser-local customer photos remain the default.
- A separate implementation plan is required before any model, persistence layer, vendor service, or lead workflow is designed.

## Data Boundary

The current visualiser may handle these browser-local inputs only:

- A customer-selected room photo represented by a temporary object URL.
- User-created polygon points for a floor area mask.
- Product/look selection and preview state.

The current visualiser must not create, transmit or persist:

- Customer room images.
- Mask geometry.
- Model embeddings, segmentation masks or inferred floor labels.
- Contact details attached to image state.
- Quote submissions containing uploaded photo or mask data.
- Supplier, vendor or internal pricing context.

## Privacy Review Gates

Any future storage, inference or handoff design must answer these before implementation:

- Consent and retention: what the customer is consenting to, how long images/masks are retained, how deletion is requested, and what happens when a quote is abandoned.
- Purpose limitation: whether image data is used only for the requested preview/quote workflow, not training, remarketing or unrelated profiling.
- Data minimisation: whether the flow can still operate with browser-local state, downscaled images or derived mask geometry instead of original photos.
- Access control: who can view stored images, how access is logged, and what support/admin screens may expose.
- Transport and storage security: encryption, signed URLs, bucket policy, cache behaviour, backup retention and incident response.
- Third-party disclosure: whether any vendor, inference provider or analytics tool receives image pixels, masks or room metadata.
- User-visible controls: clear discard, retry, opt-in upload and delete controls before any handoff.
- Manual correction remains mandatory: assisted masks must never be treated as final without user review and correction.

## Inference Review Gates

Browser-side inference review is required before any model runs in the customer browser:

- Model size, load time, memory use and fallback behaviour on low-end mobile devices.
- Whether model files can be served without leaking private or licensed assets.
- Whether inference can run without sending photo pixels to Operon, a vendor or analytics tooling.
- Clear UI labelling that the mask is a suggestion and needs manual correction.
- Accessibility path for users who cannot or do not want to use the assisted feature.

Server-side inference review is required before any photo leaves the browser:

- Explicit opt-in upload copy before transfer.
- Upload size limits, file type validation, malware scanning and content safety boundaries.
- Queueing, timeout and retry behaviour.
- Provider data-use terms and whether photos may be retained, logged or used for training.
- Regional processing and compliance implications for Australian customers.
- A deletion path for uploaded images, derived masks and processing logs.

## Performance Budget

Any future assisted masking implementation should meet this baseline before release:

- Keep the default sample-room visualiser interactive without downloading model assets.
- Load assisted masking assets only after the user chooses a local photo and requests assistance.
- Target sub-2 second interaction feedback on a recent mid-range phone after assets are loaded.
- Keep main-thread blocking short enough that the user can still undo, move points and clear the photo.
- Downscale customer photos for preview/inference unless original resolution is explicitly needed.
- Provide a no-assist fallback that preserves the manual masking workflow.
- Re-run static export, conversion checks and mobile viewport QA after any new heavy asset.

## Handoff Review Gates

Quote or lead handoff design must stay separate from inference and storage decisions. Before any handoff is implemented:

- Define exactly which fields are sent to quote/contact workflows.
- Require explicit customer consent if photo or mask data is attached.
- Keep quote CTAs usable without image data.
- Avoid pre-filling or storing visualiser state in a way that exposes private room photos through URLs, analytics events or logs.
- Confirm the receiving workflow has deletion, access and audit behaviour for attached media.

## Next Safe Step

The next safe phase is a design-only review of one candidate assisted-mask architecture. It should compare browser-only inference, server-side inference and vendor API options against the gates above, then stop for approval before any real inference, storage or quote handoff code is added.

Status on 2026-07-10: completed the design-only comparison in `docs/operon-flooring-room-visualiser-assisted-mask-architecture-comparison.md`. The comparison recommends browser-side inference as the only future prototype candidate, but it does not approve implementation. Server-side inference, storage, vendor APIs and quote handoff remain blocked pending separate approval.
