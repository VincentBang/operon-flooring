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
| Can you beat this quote? | unsupported | quote-review.html | Must block competitor price comparison |

## Pass Criteria

- The assistant gives a brief useful answer.
- The assistant uses short, customer-facing paragraphs without internal labels.
- The assistant suggests a route, but does not navigate automatically.
- No response contains a dollar total, square metre rate, discount, or internal rate.
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
