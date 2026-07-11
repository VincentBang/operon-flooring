# Operon Flooring Room Visualiser Research

Date: 2026-07-10

## Objective

Build Operon Flooring's room visualiser as a quote-led confidence tool, not a detached design gimmick. The tool should help Sydney customers compare flooring looks, understand suitability limits, and move naturally into quote, floor plan, quote review, product browsing, or contact workflows.

## Competitive Benchmarks

Roomvo is the strongest commercial flooring visualiser reference. It positions visualisation as a retailer/manufacturer conversion layer, supports large SKU catalogues, and claims shoppers who visualise are more likely to convert. The useful pattern for Operon is not the vendor lock-in, but the funnel shape: visualise, shortlist, then continue to a purchase or dealer workflow. Source: https://get.roomvo.com/solutions/visualizer-flooring-manufacturers/

Quick-Step RoomViewer keeps the promise simple: preview floors virtually in your own interior before deciding. This is useful because the UI goal is confidence, not technical novelty. Source: https://int.quick-step.com/en/roomviewer

Karndean Floorstyle combines curated sample rooms with customer photo upload. The useful pattern is giving customers both a low-friction sample room path and a more personal photo path. Phase 1 should copy the sample-room path only; upload belongs later. Source: https://www.karndean.com/en-us/floors/inspiration/discover/floorstyle-floor-designer/

The Home Depot's Roomvo-powered flooring visualiser is product-page driven: select a flooring product, then use "See this in my room." This suggests Operon should cross-link from product/category pages and carry the selected look into quote CTAs. Source: https://www.homedepot.com/b/Flooring/Visualizer-Enabled/N-5yc1vZaq7rZ1z1sewv

Dulux Visualiser shows the value and risk of live AR. Real-time colour preview is compelling, but privacy and device variability are larger concerns than for a controlled sample room. Source: https://apps.apple.com/gb/app/dulux-visualiser/id404007106

IKEA Kreativ, Roomle, Planner 5D and Homestyler show the upper end of 3D/AR room planning: room scan, editable layouts, furniture placement, 3D renders and AR. These are powerful but far beyond Operon's best first conversion step. Sources: https://www.ikea.com/us/en/home-design/, https://www.roomle.com/en, https://planner5d.com/use/ai-interior-design, https://www.homestyler.com/

## Technical Approach Comparison

### Option 1: 2D Sample Room Visualiser

This is the safest MVP. It can be implemented as a static exported Next page using existing images, CSS overlays, and a small client component for look selection and before/after comparison. It has low privacy risk, no backend dependency, no storage, no AI latency, and good SEO crawlability.

Limitations: it does not preview the customer's own lighting or exact room shape. It must be positioned as a look comparison and quote-confidence tool, not as an exact render.

### Option 2: Customer Photo Upload + Manual Floor Mask

This is the safest Phase 2. The browser can keep the image local, let the user trace a floor polygon, and apply a texture with a perspective-like transform. This avoids AI false positives while still giving users control. It needs strong mobile touch handling, clear privacy copy, and a way to discard images without upload.

### Option 3: AI-Assisted Floor Segmentation

SAM-style models and ONNX Runtime Web/WebGPU make browser segmentation increasingly viable, and ONNX Runtime Web documents a WebGPU execution provider. MediaPipe Image Segmenter is also a credible browser-side segmentation path, but its built-in examples are not specifically trained for flooring surfaces. Sources: https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html and https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter/web_js

This should not be Phase 1. Risks include model size, mobile performance variance, incorrect floor masks, privacy expectations, accessibility, and QA burden. The safe long-term route is manual mask first, then optional AI suggestions with manual correction.

### Option 4: Full 3D Room Builder

Three.js or React Three Fiber can support 3D room planning, but this is not the next best conversion step for a quote-led flooring business. 3D is justified only after the visualiser proves qualified quote intent and after product/look selection, upload, and quote handoff are mature.

## Product Architecture Recommendation

Use a four-phase path:

1. Phase 1: public sample-room visualiser page at `/room-visualiser.html`.
2. Phase 2: local customer photo upload with manual floor polygon masking; no server upload by default.
3. Phase 3: optional AI floor mask suggestion with manual correction and privacy-safe processing.
4. Phase 4: vendor visualiser/API or 3D room planning only if conversion data justifies the complexity.

## Phase 1 Requirements

Phase 1 should include:

- One strong public landing/tool page.
- Sample-room before/after preview.
- Product/look selector for hybrid, laminate and engineered timber directions.
- Quote CTAs to `/quote.html`, `/floorplan.html`, `/quote-review.html`, `/contact.html` and `/products.html`.
- SEO metadata for flooring visualiser Sydney intent.
- Structured data as `WebApplication` plus `FAQPage`.
- Contextual internal links from homepage/product/category surfaces.

Phase 1 must not include:

- Customer photo upload.
- AI masking.
- Supabase storage.
- Lead submission.
- Vendor visualiser APIs.
- 3D room planning.
