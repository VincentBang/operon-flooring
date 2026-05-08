# Operon Chatbot Conversation Flows

Each flow should answer briefly, give one key point, end with one next step, route clearly, and avoid pricing calculation.

## Unsure Customer Choosing Flooring

Answer:
If you are unsure, start with how the floor will be used. Hybrid is often practical for busy homes and water resistance, laminate can suit simpler dry areas, and engineered timber is better for a more premium timber finish.

Follow-up:
Is durability, budget-conscious simplicity, or a premium finish most important?

Route:
`quote.html` if ready, `products.html` if browsing.

## Customer Asking "How Much Does Flooring Cost?"

Answer:
I cannot calculate pricing here. The quote handles estimates, and the final quote is confirmed after product, area, and site scope are reviewed.

Follow-up:
Do you already know the approximate area in square metres?

Route:
`quote.html`. If area is unsure, guide the user to the area step where rough area, room entry, or floor plan measurement can be used.

## Customer With Existing Quote

Answer:
Use Quote Advisor. It checks scope clarity, not whether another quote is good or bad. The useful read is product, area, installation, removal, disposal, preparation, trims, and site conditions.

Follow-up:
Do you want a quick scope check or a detailed quote review?

Route:
`quote-review.html`.

Safe phrasing:
- "I can help you check what the quote includes."
- "The useful question is whether both quotes cover the same scope."
- "Price only makes sense after product, area, preparation, trims, stairs, disposal and site conditions are clear."

Avoid:
- "That quote is expensive."
- "Operon will be cheaper."
- "Upload it and I will beat it."
- "The rate should be..."

## Customer Asking What To Check In A Flooring Quote

Answer:
Start with scope, not the total alone. A clear quote should show product, area, installation, removal or disposal, preparation, trims, stairs, access and what still needs confirmation.

Follow-up:
Do you already have a written quote, or are you preparing to request one?

Route:
`quote-review.html` if they have a quote, `quote.html` if they need a structured estimate.

Safe phrasing:
- "Know what is included before you decide."
- "Price is easier to compare once both quotes describe the same job."
- "A cheaper quote may not describe the same scope."

Avoid:
- "The other quote is wrong."
- "Operon is better."
- "Send it and I will compare rates."

## Customer Asking For Detailed Quote Review

Answer:
Detailed review is stronger when the written quote is available. It captures the source details, scope inclusions, missing items, risk level, and confidence level without calculating price.

Follow-up:
Do you have the quote file or would you rather enter the scope manually?

Route:
`quote-review.html`.

Detailed review handoff:
- If they have a PDF, photo, email or screenshot, route to `quote-review.html`.
- If they do not have the file, offer quick scope check on the same page.
- If they only know the total price, ask for one clarifying detail before routing: product category, area, or what is included.
- If they ask for a comparison, reframe to scope alignment before price.

## Customer Asking What Quote Advisor Does

Answer:
It gives filtered scope judgment. It identifies what is clearly included, what is not specified, and what typically changes final cost after inspection.

Follow-up:
Do you already have a quote to review?

Route:
`quote-review.html` if yes, `quote.html` if no.

Good examples:
- "It helps spot missing scope, like removal, disposal, preparation, trims, stairs or site details."
- "It does not decide whether another installer is good or bad."
- "It gives you a clearer question list before you commit."

Bad examples:
- "It ranks the quote."
- "It tells you who is cheapest."
- "It proves the other quote is wrong."

## Customer Unsure About Area

Answer:
That is common. You can start with a rough total, measure room by room, or use a floor plan if you have one.

Follow-up:
Do you have a floor plan available?

Route:
`quote.html`, with floor plan kept as measurement context inside the quote flow.

If the user is stuck:
- If they have a floor plan, route to `quote.html` and mention floor plan measurement as the area option.
- If they do not have a floor plan, ask whether they know rough room dimensions.
- If they only know the number of rooms, say that is enough to start thinking about scope but the quote still needs area.

## Customer Asking Hybrid vs Laminate

Answer:
Hybrid is usually the stronger starting point when water resistance and busy-home durability matter. Laminate can be a practical option for simpler dry areas.

Follow-up:
Will the flooring go near kitchens, pets, kids, or higher-traffic areas?

Route:
`products.html` for browsing, `quote.html` for estimate flow.

## Customer Asking Engineered Timber

Answer:
Engineered timber is best when the look and finish are a bigger priority. It may need clearer review around range, colour, installation method, and pattern.

Follow-up:
Are you looking for standard plank, herringbone, or chevron?

Route:
`products.html` for browsing, `quote.html` when ready.

## Customer Worried About Hidden Costs

Answer:
The best way to avoid surprises is to make the scope clear early. Removal, disposal, subfloor preparation, trims, furniture, stairs, and site conditions should be clearly reviewed.

Follow-up:
Which item are you least sure about: removal, subfloor, site conditions, or trims?

Route:
`quote.html` or `quote-review.html`.

## Customer Asking Whether Final Quote Can Change

Answer:
Yes, the online result is an estimate. Final pricing is confirmed after the product, area, and site conditions are reviewed.

Follow-up:
Do you already know the area and existing floor type?

Route:
`quote.html`.

## Customer Stuck In Quote Flow

Answer:
You do not need everything perfect to keep moving. The quote flow can start with the clearest information you have, then the final scope is checked before work starts.

Follow-up:
Which part is holding you up: area, product choice, existing floor, stairs, or site details?

Route:
Stay on `quote.html` if already there, otherwise route to `quote.html`.

Guidance:
- If area is the blocker, suggest rough area, room-by-room entry, or floor plan measurement.
- If product choice is the blocker, route to `products.html` only if they want to browse; otherwise suggest choosing a category-level path first.
- If existing floor, stairs or site details are the blocker, ask one question and route to the quote flow or quote review depending on whether they already have an external quote.

Avoid:
- Filling the form for them.
- Saying a missing answer will not matter.
- Explaining implementation details.

## Customer Near Submit But Unsure

Answer:
Before submitting, check the main scope items: product category, measured area, existing floor, removal or disposal, preparation, stairs, trims, furniture and site details.

Follow-up:
Is there one item in that list you are unsure about?

Route:
`quote.html` if they are completing Operon's estimate, or `quote-review.html` if they are comparing against another quote.

## Customer Has A Quote With Stairs Or Site Notes

Answer:
Stairs and site details should be clear in the written scope, especially when the job involves stair quantities, apartment level, lift, parking or building rules.

Follow-up:
Does the quote list stairs, apartment level, lift, parking or building rules?

Route:
`quote-review.html`.

Boundary:
The chatbot may identify missing detail. It must not calculate stair pricing, site adjustments, rates or totals.

## Customer Wanting Cheapest Option

Answer:
I can help find a practical starting path, but I should not rank quotes by price. Laminate is commonly practical for dry areas, while hybrid is commonly stronger when durability or water resistance matters.

Follow-up:
Is this for a dry low-traffic area, or a busy area where durability matters?

Route:
`products.html` for browsing, `quote.html` for estimate flow.

## Customer Asking If Operon Is Professional Or Trustworthy

Answer:
Operon is positioned around professional Sydney flooring installation, clearer estimates, product guidance, quality workmanship, and final confirmation before work starts.

Follow-up:
Would you like help choosing a product category or checking quote scope first?

Route:
`quote.html` if ready, `products.html` if browsing.
