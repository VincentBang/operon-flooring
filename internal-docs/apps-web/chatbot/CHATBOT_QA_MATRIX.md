# Chatbot QA Matrix

Purpose: keep assistant behaviour testable while the chatbot remains isolated from the live quote, pricing, product, form, and submission systems.

Run:

```sh
node apps/web/chatbot/tests/chatbot.test.js
```

## Current Required Scenarios

| User prompt | Expected intent | Expected route | Pricing rule |
| --- | --- | --- | --- |
| I want cheapest | product_guidance | products.html | Must not claim cheaper pricing or compare by lowest price |
| I have stairs | scope_validation | quote-review.html | Must flag scope review without calculating price |
| I don't know my area | missing_info_collection | quote.html | Must guide to the quote area step without updating quote fields |
| I have a floor plan | floorplan_help | floorplan.html | Must route to measurement help only, without calculating area |
| Can you beat this quote? | unsupported | quote-review.html | Must block competitor price comparison |
| Is this quote expensive? | unsupported | quote-review.html | Must reframe to scope completeness, not price judgment |
| I have Hybrid 7mm quote | document_quote_review | quote-review.html | Must route to upload written quote and not show product match as confirmed |
| My quote only says supply and install | quick_quote_completeness | quote-review.html | Must explain no-file quick check and avoid document-report claims |
| I want a human to call me | operator_handoff | quote.html?from=chatbot&support=operator | Must show explicit follow-up flow, not live chat |
| Can you give final price? | quote_explanation | quote.html | Must explain estimate vs confirmation without prices |
| What does this quote review mean? | quote_review_result_explanation | quote-review.html or quote.html?source=quote_review | Must explain visible scope result only |
| It says product match 35% | quote_review_result_explanation | quote-review.html | Must say low match is not confirmed, without exposing internal match labels |
| I live in an apartment no lift | scope_validation | quote-review.html | Must flag apartment site details without pricing |
| Can you calculate my quote if I tell you the rooms? | quote_explanation | quote.html | Must refuse chat calculation and route to the quote flow |
| Work out the area from this floor plan | floorplan_help | floorplan.html | Must refuse chat area calculation and route to measurement help only |
| What should I do next? | scope_triage | quote.html | Must ask one scope-first question and route by product, area, existing quote, or site uncertainty |
| My quote looks cheaper but has no prep listed | quick_quote_completeness | quote-review.html | Must reframe to scope completeness and avoid price judgment |

## Pass Criteria

- The assistant gives a brief useful answer.
- The assistant uses short, customer-facing paragraphs without internal labels.
- The assistant suggests a route, but does not navigate automatically.
- No response contains a dollar total, square metre rate, discount, or internal rate.
- No response claims price fairness, cheapest comparison, or quote beating.
- Quick mode never mentions document extraction, product match, or Operon comparable estimate.
- Document mode never claims final price advice or says another installer is wrong.
- Floorplan help never calculates area, applies wastage, or turns measurement guidance into pricing.
- Scope triage asks one useful question at a time and does not auto-fill or submit any quote data.
- No test reads or writes live `localStorage`.
- No test calls product selection, quote calculation, lead capture, Supabase, or form submission code.

## Extend Carefully

Add one scenario at a time. Each scenario should define:

- input prompt
- expected intent
- expected route
- forbidden pricing or competitor language
- any expected structured fields

Keep the matrix inside `apps/web/chatbot/` until integration is explicitly approved.
