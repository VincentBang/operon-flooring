# Quick Room Mode Release Checklist

Use this checklist before making Quick Room Mode and Suggest areas public.

## Measurement Modes

- [ ] Manual Trace still works after uploading a JPG, PNG or PDF plan.
- [ ] Quick Room Mode click-to-suggest still shows a preview before saving.
- [ ] Suggest areas creates candidate zones without using AI or external services.
- [ ] Suggested areas are labelled as suggested areas, not final calculated area.
- [ ] Low-confidence areas remain visible and are not hidden from the customer.
- [ ] Uncertain areas are not included by default.
- [ ] High-confidence suggested areas are still reviewable and editable.

## Scale And Geometry

- [ ] Scale calibration works from two clicked points and a real wall distance.
- [ ] Short calibration distances under 2 m show a verification recommendation.
- [ ] Close calibration points show a verification recommendation.
- [ ] Verify scale with another wall can mark the scale verified or needs review.
- [ ] Included and excluded rooms update the selected measured area.
- [ ] Clear/reset works without leaving stale suggestions.
- [ ] Saved measurement resume restores rooms and scale status where available.

## Quote Handoff Safety

- [ ] Use selected measured area in quote sends real measured area only.
- [ ] No wastage is applied.
- [ ] No final price is calculated.
- [ ] No quoteCalculator.js or pricing module is called from the floor plan tool.
- [ ] Existing quote area is not replaced without confirmation on the quote page.
- [ ] Quote page shows that the area came from the floor plan tool and site details may still be confirmed.

## Mobile And Production Polish

- [ ] Canvas is usable on mobile.
- [ ] Suggested overlays remain visible.
- [ ] Room list is readable and checkboxes are easy to tap.
- [ ] Sticky CTAs and chatbot do not block the final area button.
- [ ] Scale modal fits the mobile viewport.
- [ ] No debug, experimental, payload, localStorage or final price wording is visible.
