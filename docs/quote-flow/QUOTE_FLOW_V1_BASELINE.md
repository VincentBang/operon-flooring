# Quote Flow V1 Baseline

Created on 2026-05-09 on branch `feature/quote-flow-v2-customer-express`.

This document preserves the current full-scope/internal/SaaS-style quote system before any customer express quote-flow work. It is a functional baseline, not a public duplicate page. Do not create `/quote-old.html`.

## Preservation Reason

The current quote flow is valuable because it captures a broad flooring scope: customer details, property/access, product selection, measurement source, stairs, removal, underlay, trims, floor preparation, moisture, doors, furniture, customer notes, quote-review context and floorplan handoff. It also contains the current calculation, submission, fallback and email-copy behavior. Any V2 customer express flow must be added without destructively replacing this full-scope baseline until the replacement is tested.

## Baseline Files

- `apps/web/quote.html`: current quote page, wizard UI, handoffs, summary, local draft, submission and Netlify/Supabase integration.
- `apps/web/quoteCalculator.js`: local quote calculation engine used by `quote.html`.
- `apps/web/products.js`: product catalogue, stored product/category/range handoff, product labels and product pricing data.
- `apps/web/productSelection.js`: range/category/product selection helper used by quote and products pages.
- `apps/web/pricingSourceConfig.js` and `apps/web/pricingSource.js`: optional pricing source/bootstrap layer.
- `apps/web/installRates.js`, `apps/web/underlay.js`, `apps/web/skirtingScotia.js`, `apps/web/removalRates.js`, `apps/web/locationZones.js`, `apps/web/pricingRules.js`, `apps/web/stairRates.js`, `apps/web/pricingAdjustment.js`: pricing/support data modules loaded before the calculator.
- `apps/web/floorplan.html` and `apps/web/floorplanQuickRoom.js`: floorplan measurement and area handoff into quote.
- `apps/web/quote-review.html` and `apps/web/quoteReviewReport.js`: quote-review capture/reporting and quote-review-to-quote context.
- `apps/web/chatbot/chatbotSiteState.js`, `apps/web/chatbot/chatbotStateMapper.js`, `apps/web/chatbot/chatbotLogic.js`: read-only chatbot awareness of quote state.
- Netlify functions listed below under "Netlify Functions".

Note: the working tree already contains uncommitted changes. A git tag would only capture committed `HEAD`, not this full workspace baseline. Recommended tag after committing a known-good baseline: `quote-flow-v1-full-scope-baseline`.

## Current Quote Step Order

The current quote wizard is rendered by `apps/web/quote.html` with sections using `data-quote-step` and metadata from `getQuoteStepMeta()`.

1. `Customer details` / `1 Details` / `customer_details`
2. `Property details` / `2 Property` / `property`
3. `Job type & flooring` / `3 Flooring` / `flooring_type`
4. `Area measurement` / `4 Area` / `area`
5. `Stairs` / `5 Stairs` / `stairs`
6. `Extras` / `6 Extras` / `extras`
7. `Quote summary` / `7 Summary` / `summary`

The progress UI uses:
- `quoteStepCounter`
- `quoteStepTitle`
- `quoteStepLabels`
- `.quote-step[data-quote-step="0".."6"]`
- `wizardBackButton`
- `wizardNextButton`
- `wizardSubmitButton`

## Current Customer-Facing Labels

The V1 customer-facing wizard labels before express-flow work are:

- Hero H1: `Start your flooring quote`
- Hero subcopy: `Add the product, area and scope details you know. Approximate information is okay to start.`
- Primary hero CTA: `Start 2-minute quote`
- Quote form title: `Request a flooring quote`
- Quote form intro: `Approximate information is okay to start. Final site details are confirmed before installation.`
- Step 1 heading: `Customer details`
- Step 1 helper: `Basic contact and site location are enough to begin.`
- Step 2 heading: `Property details`
- Step 2 helper: `Access details help us confirm the scope.`
- Step 3 heading: `Job type and product`
- Step 3 helper: `Choose how this job should be priced.`
- Step 4 area paths: `Enter total area`, `Room by room`, `Use floor plan`, `Not sure yet`
- Step 5 heading: `Stairs`
- Step 5 helper: `Stairs or step areas can affect labour, trims and nosing details. Add them now if known.`
- Step 6 heading: `Extras and site conditions`
- Step 6 helper: `We include standard scope where required. You can adjust anything here if you already know.`
- Step 7 heading: `Review your estimate`
- Step 7 helper: `Review the estimate, then submit it for follow-up and confirmation.`
- Submit CTA: `Submit quote request`
- Default estimate text: `Your estimate will appear after flooring type and area are added.`

The V1 page also contains an inline optional quote-review module with labels such as `Already have a flooring quote?`, `Document-based quote review`, and `Quick scope clarity check`. V2 should remove this module from the normal quote page presentation and link users to `quote-review.html` instead.

## Quote State Object Structure

The current inline quote script stores runtime-only UI and handoff state in a `state` object with these top-level fields:

- `rooms`: manual room rows used by room-by-room measurement.
- `floorplanFileName`: display/support value for uploaded or handed-off floorplan data.
- `submitState`: quote submission UI state such as `idle`, success or failure variants.
- `lastQuoteId`: most recent persisted quote id when available.
- `lastSavedDraftSignature`: de-duplicates draft persistence.
- `floorplanSource`: source marker from the floorplan tool.
- `floorplanMeasurementMode`: floorplan mode such as manual trace, quick room or suggest all.
- `floorplanRooms`: room breakdown received from floorplan handoff.
- `pendingHandoffMessage`: visible page status message for floorplan/product/quote-review handoff.
- `productHandoffActive`: whether product catalogue selection was loaded into quote.
- `lastQuoteCalculationSignature`: de-duplicates quote calculation tracking.
- `lastTrackedZoneName`: de-duplicates location zone tracking.
- `productSelectionLoadedFromCatalogue`: marks product catalogue source.
- `currentQuoteResult`: latest local/private quote calculation result.
- `lastSummaryViewSignature`: de-duplicates summary view tracking.
- `quoteRefreshToken`: guards async quote refresh rendering.
- `pricingOptimizationCache`: local cache for pricing optimization endpoint responses.
- `privateQuoteRuntimeAvailable`: tracks whether the private quote runtime can be used.
- `privateQuoteFallbackLogged`: prevents repeated fallback logging.
- `lastPropertyType`: used to preserve/reset apartment access fields when property type changes.
- `quoteRuntimeHealth`: object with `checked`, `quoteSaveReady`, and `emailReady` flags.

Form state itself is saved through `operon-quote-v3` by serializing every form element with an id, plus `rooms`, floorplan source fields and quote id metadata. This means V2 should preserve field IDs wherever practical so draft recovery, handoff payloads, Netlify form fields and chatbot read-only awareness keep working.

## Key Field IDs

### Hidden Lead / Submission Fields

- `leadCreatedAt`
- `leadStatus`
- `leadStage`
- `leadConsentSms`
- `leadConsentEmail`
- `leadName`
- `leadAddress`
- `leadSelectedProduct`
- `leadCategory`
- `leadRealArea`
- `leadChargeableArea`
- `leadQuoteTotal`
- `leadQuoteLines`
- `leadNotes`
- `leadMeasurementStatus`
- `leadEstimateReady`
- `leadQuoteConfidence`
- `leadNextStepRequired`
- `leadPriority`
- `leadQuoteReviewPayload`
- `leadPayloadJson`

### Quote Review Inline Context

- `quoteAdvisorHandoffCard`
- `quoteAdvisorHandoffText`
- `quoteAdvisorHandoffMeta`
- `quoteReview`
- `quoteReviewMode`
- `quoteReviewModeChoices`
- `reviewQuoteFile`
- `reviewQuoteNotes`
- `reviewQuoteArea`
- `reviewQuoteFlooringType`
- `reviewQuoteInclusions`
- `quoteReviewInclusionChoices`
- `reviewQuoteManualNotes`
- `quoteReviewGate`
- `quoteReviewUploadCta`
- `quoteReviewOutput`
- `quoteReviewHeadline`
- `quoteReviewOverview`
- `quoteReviewSummaryGrid`
- `quoteReviewHints`

### Step 1: Customer Details

- `fullName`
- `phone`
- `email`
- `siteAddress`
- `suburb`
- `postcode`

### Step 2: Property Details

- `propertyType`
- `propertyLevelField`
- `level`
- `hasLiftField`
- `hasLift`
- `parkingAccess`

### Step 3: Job Type And Flooring

- `quoteModeChoices`
- `quoteMode`
- `productGrid`
- `selectedProductCategory`
- `selectedProduct`
- `selectedRangeId`
- `selectedColour`
- `productSelectionMode`
- `productChoiceMode`
- `productChoiceModeChoices`
- `productRangeField`
- `productRangeSelect`
- `productColourField`
- `productColourSelect`
- `productOptionSelect`
- `selectedProductHeadline`
- `selectedProductSummary`
- `browseCategoryLink`
- `clearSelectedProductButton`
- `patternType`
- `installMethod`
- `installationPathHelper`

### Step 4: Area Measurement

- `measurementChoices`
- `measurementMethod`
- `unknownMeasurementNextStep`
- `manual_total_panel`
- `totalAreaM2`
- `manualRoomCountField`
- `manualRoomCount`
- `room_by_room_panel`
- `roomList`
- `addRoomButton`
- Dynamic room fields: `room-name-{id}`, `room-length-{id}`, `room-width-{id}`
- `floorplan_upload_panel`
- `confirmedFloorplanArea`
- `floorplanRoomCountField`
- `floorplanRoomCount`
- `unknown_panel`
- `unknownMeasurementChoices`
- `unknownAddressField`
- `floorplanLookupAddress`
- `siteAssessmentValueBlock`
- `unknownMeasurementStatus`
- `measurementMetricGrid`
- `measurementSourceLabel`
- `realAreaMetric`
- `chargeableAreaMetricCard`
- `chargeableAreaMetric`
- `chargeableAreaMetricLabel`

### Step 5: Stairs

- `stairsChoiceButtons`
- `stairs`
- `stairsCount`
- `stairsCountRange`
- `stairsRequiresReview`
- `stairsCountDetail`
- `stairWidthKnownButtons`
- `stairWidthKnown`
- `stairWidthField`
- `stairWidthMm`
- `stairQuantityFields`
- `stairStraightTreadCount`
- `stairWinderTreadCount`
- `stairLandingSmallCount`
- `stairLandingLargeCount`
- `stairOneSideOpenCount`
- `stairTwoSideOpenCount`
- `stairsStatusMessage`

### Step 6: Extras

- `extrasScopePreviewList`
- `removalDecisionButtons`
- `removalDecision`
- `existingFloorType`
- `removalDetail`
- `removalType`
- `removalDisposal`
- `removalDecisionStatus`
- `underlayDecisionButtons`
- `underlayDecision`
- `underlayDetail`
- `underlayId`
- `underlayDecisionStatus`
- `finishDecisionButtons`
- `finishDecision`
- `finishDetail`
- `skirtingType`
- `scotiaType`
- `finishDecisionStatus`
- `floorPrepDecisionButtons`
- `floorPrepDecision`
- `floorPrepDetail`
- `floorPrepType`
- `subfloorCondition`
- `floorPrepDecisionStatus`
- `moistureBarrierButtons`
- `moistureBarrier`
- `moistureBarrierStatus`
- `doorDecisionButtons`
- `doorDecision`
- `doorDetail`
- `doorTrimming`
- `doorCountField`
- `doorCount`
- `doorDecisionStatus`
- `furnitureDecisionButtons`
- `furnitureDecision`
- `furnitureDetail`
- `furnitureType`
- `furnitureRoomCountField`
- `furnitureRoomCount`
- `furnitureDecisionStatus`
- `siteNotes`

### Step 7: Summary And Submission

- `customerNotes`
- `resetQuoteButton`
- `wizardValidationMessage`
- `emailQuoteCopyControls`
- `emailQuoteCopy`
- `quoteDeliveryEmailField`
- `quoteDeliveryEmail`
- `requestStatusBox`
- `requestStatus`
- `quoteSummaryCard`
- `summaryHeadline`
- `summaryTotal`
- `summaryCaption`
- `summaryPricingRangeNote`
- `summarySelectedProduct`
- `summaryScope`
- `summaryMeasurement`
- `summaryRealArea`
- `summaryChargeableAreaRow`
- `summaryChargeableAreaLabel`
- `summaryChargeableArea`
- `summaryConfidence`
- `summaryConfidenceText`
- `summaryIncludedScopeList`
- `summarySubtotal`
- `summaryTotalSecondary`
- `warningsCard`
- `warningsList`
- `summaryNextStepText`
- `summaryEditButton`
- Hidden summary spans: `summaryGst`, `summaryCoverage`, `summaryQuotePath`, `summaryProductPricing`, `summaryNextStep`
- Local-only debug: `debugPanel`, `debugGrid`

## Storage And Handoff Keys

### Quote Draft / Submission

- `operon-quote-v3`: current quote draft, saved by `saveDraft()` and restored by `loadDraft()`.
- `operon_last_submitted_lead_v1`: last lead payload backup.
- `operon_last_submitted_lead_result_v1`: last submission result backup, used by the recovery banner.
- `operon_last_quote_value`: last submitted quote total.
- `operon_last_quote_type`: last submitted quote mode.

### Floorplan Handoff

- `operon-floorplan-area`: legacy floorplan area key; removed when structured handoff is normalized.
- `operon_confirmed_floorplan_area`: confirmed floorplan area.
- `operon_floorplan_rooms`: room breakdown from floorplan tool.
- `operon_floorplan_source`: floorplan source/mode marker such as `trace_room_mode`, `quick_room_mode`, or `suggest_all_mode`.
- `operon_floorplan_quote_handoff_v1`: structured floorplan payload with `realArea`, `rooms`, `measurementSource`, `measurementMode`, `source`, and `savedAt`.
- Floorplan-only supporting keys: `operon-floorplan-trace-v2`, `operon-floorplan-draft-v1`, `operon-floorplan-image-session-v1`.

### Product Handoff

Defined in `apps/web/products.js`:

- `operon_selected_product`
- `operon_selected_product_id`
- `operon_selected_product_category`
- `operon_selected_range_id`
- `operon_selected_colour`
- `operon_selected_product_selection_mode`

`quote.html?from=product` reads stored product/category/range state through `window.OperonProducts` and `window.OperonProductSelection`.

### Quote Review Handoff

- `operon-quote-review-v2`: quote-review page state.
- `latestQuoteReview`: latest quote-review/advisor payload used by `quote.html`.
- `operon-quote-intelligence-v1`: quote-review intelligence payload used by `quote.html`.
- `operonQuoteReviewPrefill`: quote-review prefill object saved for future user-confirmed prefill.

## Pricing Modules Used

`quote.html` loads pricing/product scripts in this order before the inline quote script:

1. `tracking.js`
2. `pricingSourceConfig.js`
3. `pricingSource.js`
4. `products.js`
5. `productSelection.js`
6. `installRates.js`
7. `underlay.js`
8. `skirtingScotia.js`
9. `removalRates.js`
10. `locationZones.js`
11. `pricingRules.js`
12. `stairRates.js`
13. `quoteCalculator.js`
14. `pricingAdjustment.js`

The main local calculation call is `QUOTE_CALCULATOR.calculateQuote(buildQuoteCalculationInput(input))`.

Important pricing behavior to preserve:

- Real area is derived from measurement method.
- Chargeable area is produced by the quote calculator/rules path.
- Product pricing can be product-specific, range/category based, or fallback.
- Underlay, removal, disposal, floor prep, moisture barrier, skirting, scotia, furniture, door trimming, stairs, access/location and minimum charge logic are part of the existing calculation path.
- If `QUOTE_CALCULATOR` is missing, `quote.html` returns a manual-review fallback result with zero totals and warning `Quote calculator is not available.`
- `calculate-private-quote` may supply private/Supabase pricing when runtime is available; otherwise the local calculator remains the baseline fallback.
- `pricing-optimization-insight` can supply an adjustment bucket used by `pricingAdjustment.js`.

## Netlify Functions Used

Directly referenced by the current quote/review flow:

- `/.netlify/functions/calculate-private-quote`: private quote calculation endpoint.
- `/.netlify/functions/save-quote-request`: draft and submit quote persistence endpoint.
- `/.netlify/functions/send-quote-email`: email copy/internal notification endpoint.
- `/.netlify/functions/runtime-health`: runtime readiness endpoint.
- `/.netlify/functions/pricing-optimization-insight`: optional pricing adjustment insight endpoint.
- `/.netlify/functions/quote-review-ocr`: document quote-review OCR endpoint.
- `/.netlify/functions/save-quote-review`: quote-review payload persistence endpoint.

Supporting Netlify files in the repo include:

- `netlify/functions/_supabasePricing.js`
- `netlify/functions/_supabaseTables.js`
- `netlify/functions/public-catalogue-pricing.js`
- `netlify/functions/operator-chat-request.js`
- `netlify/functions/process-followups.js`
- `netlify/functions/followup-admin.js`

## Quote Review Context / Handoff Behavior

`quote-review.html` supports document-based and quick quote completeness/review paths, stores review payloads, and routes to quote with `quote.html?source=quote_review` or related quote-review links.

Current quote-review handoff behavior:

- `quote.html` checks `source=quote_review`.
- `readLatestQuoteReviewPayload()` reads `latestQuoteReview` and `operon-quote-intelligence-v1`.
- `renderQuoteAdvisorHandoff()` shows an advisor handoff card when payload is available.
- Quote-review context is attached to lead payload through `buildQuoteReviewPayload()` and hidden field `leadQuoteReviewPayload`.
- The current copy says quote review details are attached but no visible fields are changed automatically.
- The quote page does not automatically overwrite quote fields from quote review.

## Floorplan Area Handoff Behavior

Current floorplan flow:

- `floorplan.html` returns to `quote.html?quoteStep=3&from=floorplan`.
- `saveQuoteHandoff(realArea, rooms, source)` stores structured handoff in `operon_floorplan_quote_handoff_v1`.
- It also stores `operon_confirmed_floorplan_area`, `operon_floorplan_rooms`, and `operon_floorplan_source`, then removes the legacy `operon-floorplan-area`.
- Measurement modes currently include `manual_trace`, `quick_room`, and `suggest_all`.
- `quote.html` reads the structured handoff first, falls back to legacy keys, normalizes the payload, and sets `state.floorplanRooms`, `state.floorplanSource`, and `state.floorplanMeasurementMode`.
- When `from=floorplan` and area exists, quote prompts before replacing a different existing area.
- If accepted, quote sets `measurementMethod` to `floorplan_upload`, fills `confirmedFloorplanArea`, moves the wizard to Step 4 Area, and shows a page status.
- Build payload maps floorplan measurement to `measurement.method = "floorplan"` when saved area exists.

## Chatbot Page-State Dependencies

The chatbot must remain read-only against the quote page.

Current dependencies:

- `chatbotSiteState.js` reads `[data-quote-step]` to infer active quote step.
- It reads IDs such as `selectedProductCategory`, `selectedProduct`, `measurementMethod`, `totalAreaM2`, `confirmedFloorplanArea`, `floorplanLookupAddress`, `quoteMode`, stairs fields and summary/result visibility.
- It uses product storage keys from `products.js` to infer stored category/product/range where relevant.
- It returns a snapshot with `pageKey: "quote"`, `flow`, `stepIndex`, `stepTitle`, `missing`, `next`, and quote-related read-only context.
- `chatbotStateMapper.js` only produces draft/structured fields and explicitly keeps `safe_to_apply` false. Allowed quote draft fields are limited to `quoteMode`, `selectedProductCategory`, product range/category helpers and `measurementMethod`.
- Chatbot policy/contract forbids writing quote fields, submitting forms, calling `quoteCalculator.js`, writing product selection, or writing live quote localStorage.

If the quote flow step order, step labels, or field IDs change, chatbot quote-step awareness may need updating.

## Current Submission / Fallback / Email-Copy Behavior

Current submit path:

1. `submitQuoteRequest()` validates form input and summary consistency.
2. `buildQuotePayload()` refreshes the quote estimate and constructs structured payload.
3. `buildLeadPayloadFromQuotePayload()` creates Netlify form-compatible lead payload.
4. `saveLastSubmittedLeadBackup()` stores a browser backup before network submission.
5. `saveQuoteDraftToNetlify()` attempts `save-quote-request` with `mode: "draft"`.
6. `markQuoteSubmittedToNetlify()` attempts `save-quote-request` with `mode: "submit_quote"` and optional customer email copy.
7. `submitLeadToNetlifyForm()` posts the Netlify form as backup lead capture.
8. If Netlify save succeeds but customer email does not, the request still shows a saved/follow-up message.
9. If runtime is unavailable in local static/file mode, the quote is saved locally and the recovery banner remains available.
10. On success, the user is redirected to `thank-you.html`.

Do not remove this fallback chain without replacement tests.

## Current Tracking Events

Tracking is defined mainly in `apps/web/tracking.js` and quote-page inline calls. Current events include:

- `quote_start`
- `quote_abandon`
- `quote_step_view`
- `step_view`
- `quote_step_complete`
- `step_complete`
- `step_error`
- `quote_submit`
- `quote_submit_success`
- `quote_submit_error`
- `summary_view`
- `quote_calculate`
- `location_zone_applied`
- `quote_email_send_attempt`
- `quote_email_send_success`
- `quote_email_send_failed`
- `internal_quote_notification_sent`
- `quote_start_from_product`
- Floorplan events including `floorplan_opened`, `floorplan_uploaded`, `floorplan_scale_set`, `floorplan_room_added`, `floorplan_area_used`, and `floorplan_usage`
- Product events including `product_catalogue_view`, `product_filter_change`, `product_selected`, and `product_select`
- Generic CTA events through `data-track-cta`, including header/mobile quote and quote-review CTAs.

Payloads should stay free of customer name, phone, email, full address, raw notes, internal rates and pricing formulas.

## Known Current Issues / Risks

- The current wizard is powerful but heavy for a first-time customer; it feels closer to an internal/SaaS full-scope quote intake than a fast customer express quote.
- Step 5 stairs and Step 6 extras collect detailed scope and can feel overwhelming.
- Current quote calculation depends on several global modules loaded in script order; missing modules fall back but can degrade estimate quality.
- Runtime behavior differs between static local preview, Netlify dev, and deployed Netlify functions.
- There is a dirty worktree with many uncommitted changes; a git tag cannot fully preserve the current workspace until those changes are committed.
- Product data and quote data are coupled through localStorage handoff keys.
- Quote-review context is intentionally read/attached but not applied to visible quote fields; changing this needs explicit user confirmation.
- Chatbot awareness depends on current DOM IDs and step structure, so quote-step UI changes can break read-only assistance even if quote logic still works.

## V2 Customer Express Guardrails

- Preserve the current calculation path until the replacement is tested.
- Preserve submission, fallback, lead backup, email-copy and `thank-you.html` redirect behavior.
- Preserve floorplan handoff and quote-review handoff.
- Preserve product catalogue logic and product selection storage unless explicitly required.
- Preserve chatbot read-only quote awareness or update it deliberately if IDs/steps change.
- Do not change pricing formulas in the quote-flow improvement task unless explicitly required.
- Do not create a public old quote page.
