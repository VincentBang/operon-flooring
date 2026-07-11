import type { Metadata } from "next";
import Link from "next/link";
import { HomeChatbot } from "@/components/HomeChatbot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

const site = "https://operonflooring.com.au";
const image = "/assets/operon-social-preview.png";

type GuideCard = {
  title: string;
  body: string;
};

type GuideExample = {
  title: string;
  body: string;
};

type GuideFaq = {
  question: string;
  answer: string;
};

export type QuoteReviewGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  targetKeyword: string;
  quickAnswer: string;
  sections: GuideCard[];
  examples: GuideExample[];
  checklist: string[];
  questions: string[];
  faqs: GuideFaq[];
  related: Array<{ href: string; title: string; body: string }>;
};

export const quoteReviewGuides: Record<string, QuoteReviewGuide> = {
  "flooring-quote-review-sydney": {
    slug: "flooring-quote-review-sydney",
    title: "Flooring Quote Review Sydney | Check Scope Before Comparing",
    description:
      "Review a Sydney flooring quote for product clarity, measured area, inclusions, exclusions, prep, stairs, trims, warranty and missing scope before deciding.",
    h1: "Flooring quote review Sydney",
    eyebrow: "Quote review guide",
    targetKeyword: "flooring quote review Sydney",
    intro:
      "A useful flooring quote review does not just ask whether the total looks cheap. It checks whether the product, area, installation scope, finishing details and exclusions are clear enough to compare.",
    quickAnswer:
      "A flooring quote is ready to compare when it clearly names the product or category, states the measured or estimated area, separates supply and installation, explains removal and disposal, lists floor preparation assumptions, covers stairs/trims/skirting where relevant, and gives warranty or terms in writing.",
    sections: [
      {
        title: "Start with the written scope, not the total",
        body:
          "Two Sydney flooring quotes can look different because one includes removal, disposal, trims or floor preparation while the other leaves them as assumptions. The review should make the scope visible before you judge price."
      },
      {
        title: "Check whether the product is identifiable",
        body:
          "A stronger quote names the flooring category, range or equivalent specification. A weak quote may only say hybrid, laminate or timber-look flooring without enough detail to compare product quality."
      },
      {
        title: "Treat unsure items as review flags",
        body:
          "If the quote does not show stairs, acoustic requirements, subfloor preparation, skirting or disposal, do not assume they are included. Mark them for review and ask for written confirmation."
      }
    ],
    examples: [
      {
        title: "Apartment example",
        body:
          "A Parramatta apartment quote that includes laminate supply and installation but does not mention acoustic underlay or lift access is not ready to compare against a quote that includes both."
      },
      {
        title: "House example",
        body:
          "A Bankstown house quote for hybrid flooring can look cheaper if carpet removal is included but disposal, trims and floor levelling are left out."
      }
    ],
    checklist: [
      "Product category, range, colour direction or equivalent specification is written down.",
      "Area basis is clear: measured area, estimated area, waste allowance or rounded project area.",
      "Supply and installation are separated or clearly included together.",
      "Removal and disposal are both stated, not bundled vaguely.",
      "Floor preparation assumptions are listed.",
      "Stairs, trims, scotia, skirting and transitions are addressed where relevant.",
      "Warranty, payment terms and quote expiry are visible."
    ],
    questions: [
      "What exact product, range or equivalent specification is included?",
      "Is the area measured from site, floor plan or customer estimate?",
      "Does this include removal and disposal of the existing flooring?",
      "What floor preparation is allowed for, and what would be charged separately?",
      "Are stairs, trims, skirting, transitions and door trimming included?"
    ],
    faqs: [
      {
        question: "Can Operon review another flooring quote?",
        answer:
          "Yes. The quote review tool is designed to help identify clear items, missing items and questions to ask before comparing or accepting a written flooring quote."
      },
      {
        question: "Should I compare flooring quotes by total only?",
        answer:
          "No. Compare the total only after product, area, inclusions, exclusions and assumptions are clear. Otherwise you may be comparing different jobs."
      }
    ],
    related: [
      { href: "/blog/flooring-quote-checklist.html", title: "Flooring quote checklist", body: "Use a practical checklist before accepting a written quote." },
      { href: "/blog/how-to-compare-flooring-quotes.html", title: "How to compare flooring quotes", body: "Compare scope and assumptions before comparing totals." },
      { href: routes.quoteReview, title: "Use the quote review tool", body: "Upload a written quote or run a quick completeness check." }
    ]
  },
  "flooring-quote-checklist": {
    slug: "flooring-quote-checklist",
    title: "Flooring Quote Checklist | What To Check Before Accepting",
    description:
      "Use this flooring quote checklist to check product, area, supply, installation, removal, disposal, floor preparation, trims, stairs and warranty details.",
    h1: "Flooring quote checklist",
    eyebrow: "Checklist",
    targetKeyword: "flooring quote checklist",
    intro:
      "A checklist helps stop vague quote wording becoming a surprise later. Use it before comparing totals or giving approval.",
    quickAnswer:
      "A good flooring quote checklist covers product, area, installation, removal, disposal, floor preparation, stairs, trims, skirting, transitions, access, warranty, payment terms and exclusions.",
    sections: [
      {
        title: "Product and area",
        body:
          "The quote should make it clear what is being installed and how much floor area is being allowed for. If the product is only described generally, ask for the category, range or equivalent specification."
      },
      {
        title: "Installation and site work",
        body:
          "Check whether the quote includes installation only, supply and installation, removal, disposal, preparation, trims, door trimming, furniture handling and stair details."
      },
      {
        title: "Terms and decision points",
        body:
          "Look for quote expiry, warranty notes, deposit/payment expectations, access assumptions and what happens if floor preparation changes after removal."
      }
    ],
    examples: [
      {
        title: "Useful wording",
        body:
          "Supply and install hybrid flooring to living, hallway and bedrooms; removal of existing carpet included; disposal included; trims by installer; floor preparation subject to site review."
      },
      {
        title: "Weak wording",
        body:
          "Flooring job: hybrid installed. This does not tell you product range, area, removal, disposal, prep or finishing scope."
      }
    ],
    checklist: [
      "Product category and range are named or specified.",
      "Rooms or floor plan area are listed.",
      "Measured area and estimated order area are clear.",
      "Supply and install are clear.",
      "Removal and disposal are individually clear.",
      "Floor preparation is included, excluded or flagged for review.",
      "Stairs, nosing, trims, scotia and skirting are addressed.",
      "Warranty and terms are stated."
    ],
    questions: [
      "Can you confirm the exact product or equivalent specification in writing?",
      "What area is the quote based on?",
      "What happens if subfloor preparation is needed after removal?",
      "Are trims, transitions, scotia or skirting included?",
      "What is excluded from this quote?"
    ],
    faqs: [
      {
        question: "Is a flooring quote checklist useful for small jobs?",
        answer:
          "Yes. Small jobs can still have unclear product, trims, removal or access assumptions, especially in apartments or occupied homes."
      },
      {
        question: "Should exclusions be written down?",
        answer:
          "Yes. Written exclusions are better than assumptions because they make the comparison more honest."
      }
    ],
    related: [
      { href: "/blog/what-should-be-included-in-flooring-quote.html", title: "What should be included?", body: "See the core inclusions that should be visible." },
      { href: "/blog/common-flooring-quote-exclusions.html", title: "Common exclusions", body: "Know the items commonly left out." },
      { href: routes.quote, title: "Start a structured quote", body: "Build a quote request with area and scope details." }
    ]
  },
  "how-to-compare-flooring-quotes": {
    slug: "how-to-compare-flooring-quotes",
    title: "How To Compare Flooring Quotes | Product, Area & Scope",
    description:
      "Learn how to compare flooring quotes by checking product, measured area, removal, disposal, floor preparation, stairs, trims, terms and exclusions.",
    h1: "How to compare flooring quotes",
    eyebrow: "Comparison guide",
    targetKeyword: "how to compare flooring quotes",
    intro:
      "The fair way to compare flooring quotes is to line up the same product direction, same area basis and same installation scope before comparing the total.",
    quickAnswer:
      "Compare flooring quotes by normalising the scope: product, area, supply/install, removal, disposal, preparation, stairs, trims, access and exclusions. If those items differ, the totals are not directly comparable.",
    sections: [
      {
        title: "Compare product first",
        body:
          "Hybrid, laminate and engineered timber can sit in different quality bands. Even within one category, range, thickness, finish and warranty can change the comparison."
      },
      {
        title: "Compare area second",
        body:
          "A quote based on customer-estimated area can differ from a quote based on site measure or floor plan trace. Ask whether waste allowance or rounded order area is included."
      },
      {
        title: "Compare scope last",
        body:
          "Removal, disposal, floor preparation, stairs, trims and access often explain why one total looks different from another."
      }
    ],
    examples: [
      {
        title: "Not comparable yet",
        body:
          "Quote A includes laminate flooring for 45m2. Quote B includes laminate, acoustic underlay, carpet removal, disposal and apartment lift access. The totals answer different scopes."
      },
      {
        title: "More comparable",
        body:
          "Both quotes show the same product category, same rooms, same area basis, and both state removal, disposal, trims and prep assumptions."
      }
    ],
    checklist: [
      "Set the same product category or range for each quote.",
      "Use the same measured area or floor plan area.",
      "Confirm removal and disposal separately.",
      "Ask what floor preparation is included or excluded.",
      "Check stairs, trims, skirting, transitions and door trimming.",
      "Check payment, timing, warranty and expiry terms."
    ],
    questions: [
      "Is this quote supply and install, or installation only?",
      "Is the area measured, estimated or rounded?",
      "What would change the final amount after site inspection?",
      "Which parts of the existing floor are being removed?",
      "Which finishing details are included?"
    ],
    faqs: [
      {
        question: "Why are flooring quotes hard to compare?",
        answer:
          "They often use different product assumptions, area bases, removal scopes and preparation allowances. The total is only meaningful after those differences are clear."
      },
      {
        question: "Can I use a floor plan to compare quotes?",
        answer:
          "Yes. A floor plan can help make area assumptions more consistent before final site review."
      }
    ],
    related: [
      { href: "/blog/why-flooring-quotes-vary.html", title: "Why quotes look different", body: "Understand the common reasons totals vary." },
      { href: routes.floorplan, title: "Measure from a floor plan", body: "Trace rooms and send area into the quote flow." },
      { href: routes.quoteReview, title: "Review an existing quote", body: "Check clarity before comparing totals." }
    ]
  },
  "what-should-be-included-in-flooring-quote": {
    slug: "what-should-be-included-in-flooring-quote",
    title: "What Should Be Included In A Flooring Quote? | Sydney Guide",
    description:
      "A Sydney flooring quote should clearly show product, area, supply, installation, removal, disposal, preparation, trims, stairs, warranty and exclusions.",
    h1: "What should be included in a flooring quote?",
    eyebrow: "Scope guide",
    targetKeyword: "what should be included in a flooring quote",
    intro:
      "A flooring quote should explain what the installer is actually agreeing to do. Clear inclusions make it easier to compare, approve and avoid disputes.",
    quickAnswer:
      "A flooring quote should include product details, rooms/area, supply and installation scope, removal, disposal, floor preparation assumptions, trims, skirting/scotia, stairs, access notes, warranty, terms and exclusions.",
    sections: [
      {
        title: "Product details",
        body:
          "The quote should identify the product category and, where possible, the range, finish or equivalent specification. Without this, a cheaper quote may simply be using a different product."
      },
      {
        title: "Work included",
        body:
          "Supply, installation, underlay, removal, disposal, furniture handling, door trimming, trims, scotia, skirting and stairs should be written clearly instead of assumed."
      },
      {
        title: "Site conditions",
        body:
          "Apartment access, stairs, lift booking, occupied-home conditions, moisture concerns and subfloor preparation should be flagged early."
      }
    ],
    examples: [
      {
        title: "Sydney apartment",
        body:
          "The quote should mention product category, acoustic underlay or strata requirements if relevant, lift access, parking/access notes and disposal."
      },
      {
        title: "Older house",
        body:
          "The quote should flag removal type, possible floor preparation, trims/skirting, transitions and whether stairs are included."
      }
    ],
    checklist: [
      "Product category, range and colour direction.",
      "Rooms and area basis.",
      "Supply and installation scope.",
      "Removal and disposal scope.",
      "Underlay and acoustic requirements if relevant.",
      "Floor preparation assumptions.",
      "Stairs, trims, scotia, skirting and transitions.",
      "Warranty, payment terms and exclusions."
    ],
    questions: [
      "Can you list the included rooms and area basis?",
      "Is disposal included after removal?",
      "What preparation is allowed for before installation?",
      "Are stairs or trims included?",
      "What is excluded?"
    ],
    faqs: [
      {
        question: "Does every flooring quote need all of these items?",
        answer:
          "Not every project has stairs or acoustic requirements, but the quote should still make it clear whether those items are included, excluded or not applicable."
      },
      {
        question: "Is an estimate enough before site review?",
        answer:
          "An estimate can be useful, but final installation decisions should be based on confirmed product, area and site conditions."
      }
    ],
    related: [
      { href: "/blog/flooring-quote-checklist.html", title: "Open the checklist", body: "Use the checklist before accepting a quote." },
      { href: routes.products, title: "Browse product categories", body: "Choose a flooring direction before quoting." },
      { href: routes.quote, title: "Start quote", body: "Add product, area and site notes." }
    ]
  },
  "common-flooring-quote-exclusions": {
    slug: "common-flooring-quote-exclusions",
    title: "Common Flooring Quote Exclusions | What May Be Left Out",
    description:
      "Common flooring quote exclusions include disposal, floor preparation, levelling, moisture issues, trims, stairs, door trimming, access and after-hours requirements.",
    h1: "Common flooring quote exclusions",
    eyebrow: "Exclusions guide",
    targetKeyword: "common flooring quote exclusions",
    intro:
      "A flooring quote can look clear on the surface while still excluding important parts of the job. The problem is not exclusion itself; it is an exclusion that is hidden or unclear.",
    quickAnswer:
      "Common exclusions include disposal, floor preparation, levelling, moisture treatment, stair details, trims, scotia, skirting, door trimming, furniture moving, apartment access and unexpected subfloor work.",
    sections: [
      {
        title: "Removal is not always disposal",
        body:
          "Some quotes include lifting existing flooring but not taking it away. Ask whether removal and disposal are both included."
      },
      {
        title: "Floor preparation can sit outside the initial quote",
        body:
          "Levelling, patching, grinding, adhesive removal and moisture-related preparation are often confirmed after the old flooring is removed."
      },
      {
        title: "Finishing details can be vague",
        body:
          "Trims, transitions, scotia, skirting and door trimming should be written clearly because they affect the finished look."
      }
    ],
    examples: [
      {
        title: "Tile removal example",
        body:
          "A quote may include new flooring installation but exclude tile removal, tile disposal and subfloor grinding after tiles come up."
      },
      {
        title: "Stairs example",
        body:
          "A quote may include open floor area but exclude stair treads, nosing and stair finishing details."
      }
    ],
    checklist: [
      "Removal and disposal are both stated.",
      "Floor preparation is included, excluded or subject to review.",
      "Levelling, grinding, patching and moisture items are addressed.",
      "Trims, scotia, skirting and transitions are stated.",
      "Stairs and nosing are clear if relevant.",
      "Access, parking, lift bookings or occupied-home constraints are noted."
    ],
    questions: [
      "Which parts of the job are excluded?",
      "Is disposal included or separately charged?",
      "What preparation is not included until the subfloor is seen?",
      "Are stairs and trims included?",
      "What site conditions could change the final scope?"
    ],
    faqs: [
      {
        question: "Are exclusions always bad?",
        answer:
          "No. Clear exclusions can be honest and useful. The risk is when exclusions are missing or vague and become a surprise later."
      },
      {
        question: "Should floor preparation be excluded?",
        answer:
          "It may be subject to site review, especially after removal. The quote should still explain how preparation will be assessed."
      }
    ],
    related: [
      { href: "/blog/hidden-flooring-costs.html", title: "Hidden flooring costs", body: "Understand what can change the final project scope." },
      { href: "/blog/do-you-need-floor-preparation.html", title: "Floor preparation guide", body: "Learn when prep matters." },
      { href: routes.quoteReview, title: "Check your quote", body: "Review missing inclusions and exclusions." }
    ]
  },
  "why-flooring-quotes-vary": {
    slug: "why-flooring-quotes-vary",
    title: "Why Two Flooring Quotes Look Different | Scope Comparison",
    description:
      "Two flooring quotes can look different because product, area, removal, disposal, preparation, stairs, trims, access and terms are not the same.",
    h1: "Why two flooring quotes look different",
    eyebrow: "Quote comparison",
    targetKeyword: "why two flooring quotes look different",
    intro:
      "When two flooring quotes look different, the total is rarely the whole story. Usually the product, area basis, work included or site assumptions differ.",
    quickAnswer:
      "Two flooring quotes look different when they are not quoting the same product, area, removal/disposal scope, preparation, stairs, trims, access requirements or warranty terms.",
    sections: [
      {
        title: "Product assumptions differ",
        body:
          "Hybrid, laminate and engineered timber are broad categories. A quote that does not name a range or equivalent specification can hide a product difference."
      },
      {
        title: "Area assumptions differ",
        body:
          "One quote may use measured area, another may use floor plan area, and another may include a different order allowance. That changes the comparison."
      },
      {
        title: "Site work assumptions differ",
        body:
          "Removal, disposal, preparation, stairs, trims, access and occupied-home constraints can all move a quote from simple to more involved."
      }
    ],
    examples: [
      {
        title: "Quote A vs Quote B",
        body:
          "Quote A: supply and install hybrid flooring. Quote B: supply and install hybrid flooring, remove carpet, dispose waste, add scotia, and review levelling. The totals are not quoting the same scope."
      },
      {
        title: "Apartment quote difference",
        body:
          "A quote with acoustic underlay and lift access notes is more complete than one that ignores strata and access requirements."
      }
    ],
    checklist: [
      "Same product or equivalent product specification.",
      "Same measured or estimated area basis.",
      "Same removal and disposal assumption.",
      "Same floor preparation assumption.",
      "Same trims, scotia, skirting and stair scope.",
      "Same access and timing requirements.",
      "Same warranty and terms visibility."
    ],
    questions: [
      "Are these quotes based on the same product category and range?",
      "Are they using the same area basis?",
      "Which one includes removal and disposal?",
      "Which one allows for floor preparation?",
      "Which one explains stairs, trims and access clearly?"
    ],
    faqs: [
      {
        question: "Should I choose the cheaper flooring quote?",
        answer:
          "Only after you know the cheaper quote is for the same product, area and scope. If key items are missing, it may not be cheaper for the same job."
      },
      {
        question: "What is the fastest way to compare quotes?",
        answer:
          "Use a quote review checklist: product, area, supply/install, removal/disposal, prep, stairs, trims, access and exclusions."
      }
    ],
    related: [
      { href: "/blog/how-to-compare-flooring-quotes.html", title: "Compare flooring quotes", body: "Normalise scope before comparing totals." },
      { href: "/blog/common-flooring-quote-exclusions.html", title: "Common exclusions", body: "See what may be missing." },
      { href: routes.quoteReview, title: "Review quote", body: "Check an existing quote before deciding." }
    ]
  },
  "hidden-flooring-costs": {
    slug: "hidden-flooring-costs",
    title: "Hidden Costs In Flooring Quotes | What To Ask Before Accepting",
    description:
      "Hidden flooring quote costs can come from removal, disposal, floor preparation, levelling, trims, stairs, access, door trimming and unclear product assumptions.",
    h1: "Hidden costs in flooring quotes",
    eyebrow: "Cost clarity",
    targetKeyword: "hidden costs in flooring quotes",
    intro:
      "A hidden cost is usually a scope item that was not written clearly enough before the job was accepted. The safest fix is not guessing; it is asking better questions early.",
    quickAnswer:
      "Hidden flooring quote costs commonly come from removal, disposal, floor preparation, levelling, moisture issues, stair details, trims, scotia, skirting, door trimming, furniture handling, apartment access and unclear product assumptions.",
    sections: [
      {
        title: "Hidden does not always mean dishonest",
        body:
          "Some items are unknown until the existing floor is removed. The quote should still explain what is included now and what may need review later."
      },
      {
        title: "Preparation is the big uncertainty",
        body:
          "Levelling, patching, grinding, adhesive removal and moisture review can change the job after the subfloor is visible."
      },
      {
        title: "Finishing details create surprises",
        body:
          "Trims, scotia, skirting, stair nosing and door trimming may look minor but affect both finish and labour expectations."
      }
    ],
    examples: [
      {
        title: "Glue-down timber removal",
        body:
          "A quote may allow for installing new flooring but not the extra work required after glue-down timber is removed and adhesive remains on the subfloor."
      },
      {
        title: "Apartment access",
        body:
          "Parking restrictions, lift bookings, strata rules or limited work hours can affect how the job is planned."
      }
    ],
    checklist: [
      "Ask whether removal and disposal are both included.",
      "Ask how preparation is handled if the floor is uneven.",
      "Ask whether trims, scotia, skirting and transitions are included.",
      "Ask whether stairs and nosing are included.",
      "Ask whether door trimming or furniture moving is included.",
      "Ask what site conditions could change the quote."
    ],
    questions: [
      "What could change this quote after installation starts?",
      "Is disposal included after removal?",
      "How will floor preparation be assessed?",
      "Are finishing trims included?",
      "Are there access, timing or strata assumptions?"
    ],
    faqs: [
      {
        question: "Can hidden flooring costs be avoided completely?",
        answer:
          "Not always, because some site conditions are only visible after removal. They can be reduced by making assumptions and exclusions clear before approval."
      },
      {
        question: "Is floor preparation always a hidden cost?",
        answer:
          "No. A good quote will state whether preparation is included, excluded or subject to review."
      }
    ],
    related: [
      { href: "/blog/common-flooring-quote-exclusions.html", title: "Common exclusions", body: "Know what may be left out." },
      { href: "/blog/do-you-need-floor-preparation.html", title: "Floor preparation", body: "Understand the main uncertainty." },
      { href: routes.quoteReview, title: "Review quote", body: "Find missing items before you accept." }
    ]
  },
  "questions-to-ask-before-accepting-flooring-quote": {
    slug: "questions-to-ask-before-accepting-flooring-quote",
    title: "Questions To Ask Before Accepting A Flooring Quote",
    description:
      "Ask these flooring quote questions before accepting: product, area, removal, disposal, floor preparation, stairs, trims, access, warranty, exclusions and timing.",
    h1: "Questions to ask before accepting a flooring quote",
    eyebrow: "Decision guide",
    targetKeyword: "questions to ask before accepting a flooring quote",
    intro:
      "The right questions turn a vague flooring quote into a clearer decision. Ask them before accepting, not after installation details become awkward.",
    quickAnswer:
      "Before accepting a flooring quote, ask what product is included, what area is used, whether removal and disposal are included, what preparation is allowed for, what is excluded, and how stairs, trims, access, warranty and timing are handled.",
    sections: [
      {
        title: "Ask product questions",
        body:
          "Confirm the exact product category, range or equivalent specification. This matters most when comparing hybrid, laminate and engineered timber options."
      },
      {
        title: "Ask scope questions",
        body:
          "Removal, disposal, preparation, stairs, trims and access should be stated clearly. These items often explain quote differences."
      },
      {
        title: "Ask decision questions",
        body:
          "Before paying a deposit or accepting the quote, ask what could change the final scope and how those changes would be confirmed."
      }
    ],
    examples: [
      {
        title: "Better than asking for a discount",
        body:
          "Ask: Is disposal included and what prep is excluded? This gives you a clearer comparison than only asking for a lower total."
      },
      {
        title: "When product is vague",
        body:
          "Ask: What range or equivalent product specification is included? If that cannot be answered, the quote is not ready to compare."
      }
    ],
    checklist: [
      "Ask for product category and range.",
      "Ask for area basis.",
      "Ask whether supply and install are both included.",
      "Ask whether removal and disposal are both included.",
      "Ask what floor preparation is included or excluded.",
      "Ask about stairs, trims, skirting, scotia and transitions.",
      "Ask what may change after site review.",
      "Ask about warranty, timing, terms and expiry."
    ],
    questions: [
      "What exact product or equivalent specification is included?",
      "What rooms and area are included?",
      "Is disposal included after removal?",
      "What preparation is not included?",
      "Are trims, transitions, stairs and door trimming included?"
    ],
    faqs: [
      {
        question: "Should I ask these questions in writing?",
        answer:
          "Yes. Written answers make it easier to compare quotes and reduce misunderstandings later."
      },
      {
        question: "What if the contractor says it depends?",
        answer:
          "That can be reasonable for floor preparation or site conditions, but the quote should still explain what is included now and what needs review later."
      }
    ],
    related: [
      { href: "/blog/flooring-quote-checklist.html", title: "Quote checklist", body: "Turn the questions into a review checklist." },
      { href: "/blog/flooring-quote-review-sydney.html", title: "Quote review Sydney", body: "Review a written quote before deciding." },
      { href: routes.quote, title: "Get comparison quote", body: "Start a structured Operon quote." }
    ]
  }
};

const quoteReviewAuthorityLinks = [
  {
    href: routes.quoteReview,
    title: "Run the quote review tool",
    body: "Upload a written quote or use the no-file completeness check before deciding."
  },
  {
    href: `${routes.quote}?from=quote_review_guide`,
    title: "Start an Operon comparison quote",
    body: "Turn the clearer scope into a structured flooring estimate."
  },
  {
    href: routes.floorplan,
    title: "Measure area from a floor plan",
    body: "Use floorplan area when the quote does not show a reliable measurement."
  },
  {
    href: routes.products,
    title: "Compare flooring products",
    body: "Check hybrid, laminate and engineered timber direction before comparing written quotes."
  },
  {
    href: routes.flooringQuoteSydney,
    title: "Flooring quote Sydney guide",
    body: "Use the main Sydney quote guide for product, area, inclusions and final scope."
  },
  {
    href: "/flooring-installation-cost-sydney.html",
    title: "Installation cost scope guide",
    body: "Understand the customer-safe scope items that can make flooring quotes look different."
  }
];

const localQuoteAuthorityLinks = [
  {
    href: routes.edmondsonPark,
    title: "Flooring Edmondson Park",
    body: "Local quote clarity for timber, hybrid and laminate projects."
  },
  {
    href: routes.miranda,
    title: "Flooring Miranda",
    body: "Local product and quote scope guidance for Miranda projects."
  },
  {
    href: routes.liverpool,
    title: "Flooring Liverpool",
    body: "Liverpool flooring quote support for product, access, removal and trims."
  },
  {
    href: routes.parramatta,
    title: "Flooring Parramatta",
    body: "Parramatta apartment and home flooring quote guidance."
  }
];

export function getQuoteReviewGuideMetadata(slug: string): Metadata {
  const guide = quoteReviewGuides[slug];

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/blog/${guide.slug}.html`,
    image,
    robots: "index,follow"
  });
}

function getGuideJsonLd(guide: QuoteReviewGuide) {
  const url = `${site}/blog/${guide.slug}.html`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.h1,
      description: guide.description,
      mainEntityOfPage: url,
      author: {
        "@type": "Organization",
        name: "Operon Flooring",
        url: site
      },
      publisher: {
        "@type": "Organization",
        name: "Operon Flooring",
        logo: {
          "@type": "ImageObject",
          url: `${site}/assets/operon-flooring-sydney-brand-logo.webp`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${site}/blog/` },
        { "@type": "ListItem", position: 3, name: guide.h1, item: url }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ];
}

export function QuoteReviewGuidePage({ slug }: { slug: string }) {
  const guide = quoteReviewGuides[slug];

  return (
    <Layout>
      <JsonLd data={getGuideJsonLd(guide)} />
      <article className="legacy-seo-content">
        <section className="hero">
          <div className="shell">
            <div className="hero-card">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <a href={routes.blog}>Guides</a>
                <span>/</span>
                <span>{guide.h1}</span>
              </nav>
              <span className="eyebrow">{guide.eyebrow}</span>
              <h1>{guide.h1}</h1>
              <p>{guide.intro}</p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button" href={`${routes.quoteReview}?from=guide&guide=${guide.slug}`} data-track-cta="quote_review_cluster_primary">
                  Check an existing quote
                </Link>
                <Link className="button-secondary" href={`${routes.quote}?from=guide&guide=${guide.slug}`} data-track-cta="quote_review_cluster_quote">
                  Start a comparison quote
                </Link>
                <Link className="button-quiet" href={routes.floorplan}>
                  Measure from floor plan
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="section-card">
              <span className="eyebrow">Quick answer</span>
              <h2 style={{ marginTop: 18 }}>What to check first</h2>
              <p>{guide.quickAnswer}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-3">
            {guide.sections.map((section) => (
              <div className="mini-card" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <div className="section-card">
              <span className="eyebrow">Flooring-specific examples</span>
              <h2 style={{ marginTop: 18 }}>How this shows up in real quote wording</h2>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {guide.examples.map((example) => (
                  <div className="link-card" key={example.title}>
                    <strong>{example.title}</strong>
                    <span>{example.body}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="section-card">
              <span className="eyebrow">Checklist</span>
              <h2 style={{ marginTop: 18 }}>Before you accept or compare</h2>
              <ul className="check-list">
                {guide.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="section-card">
              <span className="eyebrow">Questions to ask</span>
              <h2 style={{ marginTop: 18 }}>Send these back before deciding</h2>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {guide.questions.map((question) => (
                  <div className="link-card" key={question}>
                    <strong>{question}</strong>
                    <span>Ask for a written answer so the quote can be compared against the same scope.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="section-card">
              <span className="eyebrow">Next step</span>
              <h2 style={{ marginTop: 18 }}>Turn the guide into a clearer flooring decision</h2>
              <p>
                If you already have a quote, use quote review to check missing scope. If you are starting fresh, use the structured quote flow so product,
                area and site details are captured together.
              </p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button" href={`${routes.quoteReview}?from=guide&guide=${guide.slug}`} data-track-cta="quote_review_cluster_review_cta">
                  Get an Operon quote review
                </Link>
                <Link className="button-secondary" href={`${routes.quote}?from=guide&guide=${guide.slug}`} data-track-cta="quote_review_cluster_quote_cta">
                  Start an Operon comparison quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <div className="section-card">
              <span className="eyebrow">Quote tools</span>
              <h2 style={{ marginTop: 18 }}>Move from guide reading to a clearer quote path</h2>
              <p>
                Use this guide as a decision checkpoint, then move into the tool that matches what you know: written quote review, a new comparison quote,
                floorplan area support or product selection.
              </p>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {quoteReviewAuthorityLinks.map((link) => (
                  <Link className="link-card" href={link.href} key={link.href}>
                    <strong>{link.title}</strong>
                    <span>{link.body}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="section-card">
              <span className="eyebrow">Local quote examples</span>
              <h2 style={{ marginTop: 18 }}>Apply the checklist to Sydney suburb pages</h2>
              <p>
                Local flooring pages keep suburb intent connected to the same quote checks: product, area, removal, preparation, access, stairs and
                written exclusions.
              </p>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {localQuoteAuthorityLinks.map((link) => (
                  <Link className="link-card" href={link.href} key={link.href}>
                    <strong>{link.title}</strong>
                    <span>{link.body}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <div className="section-card">
              <span className="eyebrow">Related guides</span>
              <h2 style={{ marginTop: 18 }}>Keep comparing the written scope</h2>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {guide.related.map((link) => (
                  <Link className="link-card" href={link.href} key={link.href}>
                    <strong>{link.title}</strong>
                    <span>{link.body}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="section-card">
              <span className="eyebrow">FAQs</span>
              <h2 style={{ marginTop: 18 }}>Common questions</h2>
              <div className="faq-accordion">
                {guide.faqs.map((faq) => (
                  <details className="faq-toggle" key={faq.question}>
                    <summary>{faq.question}</summary>
                    <div className="faq-toggle-body">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </article>
      <HomeChatbot pageKey="blog" />
    </Layout>
  );
}
