# Chatbot Response Guardrails

Purpose: keep assistant answers useful, controlled, and conversion-supportive while the chatbot remains isolated.

## Required Response Shape

Each useful assistant response should:

- answer the user briefly
- use clean customer-facing paragraphs
- avoid internal labels like `Key point:` and `Next step:`
- avoid dollar totals, rates, discounts, formulas, and internal pricing logic
- avoid claiming Operon is always cheaper
- avoid pressuring the user
- suggest a route through the structured funnel
- ask no more than one practical follow-up when it helps clarify scope
- keep product advice advisory, not a product-system override

## Forbidden Copy Patterns

Do not use:

- dollar totals or square metre rates
- "always cheaper"
- "guaranteed cheapest"
- "we will beat"
- "limited time"
- "book now or lose"
- internal rate, margin, multiplier, or formula language

## Route-Oriented Answers

Responses should gently move toward:

- `products.html` for browsing and product category help
- `quote.html` when the user is ready or area is unclear
- `quote-review.html` for existing quotes, competitor comparisons, stairs, access, or scope risk

## Test Coverage

The automated tests check representative responses for:

- no pricing output
- no pressure language
- no competitor-cheapest claims
- non-empty route suggestion
- concise answer length
- clean customer-facing paragraph structure

Keep this file and the tests inside `apps/web/chatbot/` until integration is explicitly approved.
