# Chatbot Knowledge Coverage

Purpose: track whether the isolated assistant covers the main Operon Flooring customer journey without touching quote, pricing, product, form, lead capture, Supabase, or live page logic.

Run:

```sh
node apps/web/chatbot/tests/chatbot.test.js
```

## Coverage Map

| Journey area | Example prompt | Expected behaviour | Route |
| --- | --- | --- | --- |
| Product guidance | Should I choose hybrid or laminate? | Explain suitability and keep product selection untouched | products.html |
| Quote explanation | How does the quote work? | Explain estimate vs final quote without pricing | quote.html |
| Missing area | I don't know my area | Guide to the quote area step for rough area, room entry, or floor plan context | quote.html |
| Stairs/access/furniture | I have stairs | Flag manual scope review | quote-review.html |
| Existing flooring/removal | Replacing carpet in bedrooms | Capture removal/review context as draft only | quote.html |
| Hidden costs | Are there hidden costs? | Explain scope items to check, no scare tactics | quote.html |
| Final quote changes | Can final quote change? | Clarify estimate vs final confirmation | quote.html |
| Cheapest/competitor | I want cheapest / Can you beat this quote? | Avoid cheapest-price claims and competitor comparisons | products.html / quote-review.html |
| Trust/professionalism | Can I trust Operon? | Reinforce quality installation, clear estimate, professional team | quote.html |
| Controlled site knowledge | Tell me about Parramatta flooring | Answer from approved static index and route to the relevant content page | suburb/service/blog page |
| Route suggestions | I am ready | Suggest the next step without auto-navigation | quote.html |
| JSON schema | Draft output | Produce structured draft data only | no write side effect |

## Pass Criteria

- Every journey area has at least one tested prompt.
- Every answer avoids dollar totals, rates, discounts, formulas, and internal pricing.
- The assistant suggests routes but does not navigate automatically.
- Structured output includes intent, route, missing items, and validation flags where useful.
- LocalStorage output remains a returned draft string only; it is not written.
- Product choice stays advisory; product system remains the source of product selection.
- `quoteCalculator.js` remains the only pricing authority.
- Controlled site knowledge comes from `chatbotKnowledgeIndex.js`, not from automatic crawling.

## Current Coverage Status

Automated tests cover all rows in the coverage map. The isolated preview also includes a coverage runner so new prompts can be checked before any future integration work.

## Maintenance Rule

When adding a new chatbot capability, add or update one row here and one matching test in `tests/chatbot.test.js`. Keep the work inside `apps/web/chatbot/` until integration is explicitly approved.
