import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

type LinkCard = {
  title: string;
  copy: string;
  href?: string;
  track?: string;
};

type LocalFaq = {
  question: string;
  answer: string;
};

type ProductSuggestion = {
  title: string;
  bestFor: string;
  quoteNote: string;
  href: string;
};

type LocalSuburbPage = {
  slug: string;
  suburb: string;
  route: string;
  eyebrow: string;
  title: string;
  description: string;
  hero: string;
  localAngle: string;
  propertyContext: LinkCard[];
  productSuggestions: ProductSuggestion[];
  quoteConsiderations: LinkCard[];
  projectProof: string;
  nearbyLinks: LinkCard[];
  faqs: LocalFaq[];
};

const sharedProductSuggestions: Record<"hybrid" | "laminate" | "engineered", { title: string; href: string }> = {
  hybrid: {
    title: "Hybrid flooring",
    href: routes.hybrid
  },
  laminate: {
    title: "Laminate flooring",
    href: routes.laminate
  },
  engineered: {
    title: "Engineered timber",
    href: routes.engineered
  }
};

export const localSuburbPages: Record<string, LocalSuburbPage> = {
  "flooring-chatswood": {
    slug: "flooring-chatswood",
    suburb: "Chatswood",
    route: routes.chatswood,
    eyebrow: "Chatswood flooring quotes",
    title: "Flooring Chatswood | Apartment & Family Home Quote Help",
    description:
      "Plan a Chatswood flooring quote with product, area, apartment access, acoustic underlay, removal, stairs, trims and floorplan details clear before comparing totals.",
    hero:
      "Chatswood flooring projects often mix apartment upgrades, family homes and investment properties. A useful quote should make product choice, measured area, access, underlay, removal and finishing details clear before the total is compared.",
    localAngle:
      "For Chatswood, the quote risk is often access and approval detail. Apartment projects may need acoustic or lift notes, while homes and townhouses may need stair, trim and removal scope written clearly.",
    propertyContext: [
      { title: "Apartments and units", copy: "Acoustic underlay, lift access, parking and building requirements should be captured before accepting a quote." },
      { title: "Family homes", copy: "Hybrid, laminate or engineered timber can suit different rooms when preparation, trims and staged work are clear." },
      { title: "Investment properties", copy: "Rental-ready upgrades should make removal, disposal and turnaround assumptions visible." }
    ],
    productSuggestions: [
      { ...sharedProductSuggestions.hybrid, bestFor: "busy apartments, family living areas and practical rental upgrades.", quoteNote: "Confirm underlay, access, trims, removal and preparation." },
      { ...sharedProductSuggestions.laminate, bestFor: "dry bedrooms, studies and value-conscious unit refreshes.", quoteNote: "Check acoustic requirements and moisture expectations before comparing." },
      { ...sharedProductSuggestions.engineered, bestFor: "higher-finish homes or feature living spaces.", quoteNote: "Review installation method, range, stairs, trims and subfloor assumptions." }
    ],
    quoteConsiderations: [
      { title: "Acoustic underlay", copy: "Apartment buildings may require acoustic details before installation approval." },
      { title: "Lift and loading", copy: "Access, parking and loading notes can affect installation planning." },
      { title: "Removal and disposal", copy: "Existing carpet, floating floors, vinyl or tile should be identified clearly." },
      { title: "Trims and stairs", copy: "Townhouses and split levels should list stair and transition details." }
    ],
    projectProof:
      "Use real project examples to judge finish, preparation and stairs. Chatswood-specific proof should only be added when a real local project is recorded.",
    nearbyLinks: [
      { title: "Flooring North Sydney", copy: "Apartment and access-focused quote guidance.", href: routes.northSydney },
      { title: "Flooring Killara", copy: "North Shore home quote support.", href: routes.killara },
      { title: "Flooring Pymble", copy: "Family home and timber quote clarity.", href: routes.pymble }
    ],
    faqs: [
      { question: "What should a Chatswood apartment flooring quote include?", answer: "It should show product, area, acoustic underlay assumptions, access, removal, disposal, trims and exclusions." },
      { question: "Can I start from a floor plan?", answer: "Yes. A floor plan can help estimate area before final site review." },
      { question: "Is hybrid or laminate better for a unit?", answer: "It depends on room use, acoustic rules, moisture risk and budget. The quote should make those assumptions clear." },
      { question: "Can Operon review another Chatswood quote?", answer: "Yes. Quote review checks whether written scope is complete enough to compare." }
    ]
  },
  "flooring-north-sydney": {
    slug: "flooring-north-sydney",
    suburb: "North Sydney",
    route: routes.northSydney,
    eyebrow: "North Sydney flooring quotes",
    title: "Flooring North Sydney | Apartment & Office Quote Help",
    description:
      "Start a North Sydney flooring quote with apartment access, office fitout context, product selection, measured area, removal, trims and quote-review checks clear.",
    hero:
      "North Sydney flooring projects can involve apartments, offices and compact renovation sites where access, timing and acoustic detail matter. The quote should separate product, area and site logistics before the total is compared.",
    localAngle:
      "For North Sydney, access and building constraints can matter as much as the flooring category. Lift bookings, loading, acoustic requirements and work timing should be visible in the written scope.",
    propertyContext: [
      { title: "Apartments", copy: "Acoustic requirements, lift booking and parking should be captured early." },
      { title: "Office and commercial spaces", copy: "Durability, timing, staging and access may need clearer scope than a standard home quote." },
      { title: "Compact renovations", copy: "Removal, disposal and working access should be planned before installation is booked." }
    ],
    productSuggestions: [
      { ...sharedProductSuggestions.hybrid, bestFor: "practical apartments or office-adjacent spaces needing durable timber-look finishes.", quoteNote: "Confirm access, acoustic details and removal scope." },
      { ...sharedProductSuggestions.laminate, bestFor: "dry internal rooms where value and tidy presentation matter.", quoteNote: "Check underlay, commercial suitability and exclusions." },
      { ...sharedProductSuggestions.engineered, bestFor: "premium apartments or feature rooms.", quoteNote: "Confirm installation method, prep, range and finish expectations." }
    ],
    quoteConsiderations: [
      { title: "Building access", copy: "Lift, loading, parking and working-hour assumptions should be written clearly." },
      { title: "Acoustic requirements", copy: "Apartment projects may need underlay or strata detail before approval." },
      { title: "Commercial timing", copy: "Office work may need staged access or after-hours assumptions confirmed." },
      { title: "Waste handling", copy: "Removal and disposal should be separated, especially in dense buildings." }
    ],
    projectProof:
      "Use project proof for finish and scope examples. North Sydney-specific commercial or apartment proof should only be added when real details are available.",
    nearbyLinks: [
      { title: "Flooring Chatswood", copy: "North Shore apartment and home guidance.", href: routes.chatswood },
      { title: "Flooring Neutral Bay", copy: "Apartment quote clarity nearby.", href: routes.neutralBay },
      { title: "Flooring Mosman", copy: "Premium home and apartment quote support.", href: routes.mosman }
    ],
    faqs: [
      { question: "What makes North Sydney flooring quotes different?", answer: "Access, lift bookings, acoustic rules and work timing can affect the scope." },
      { question: "Can office flooring be quoted through Operon?", answer: "A structured quote can start the scope, but commercial timing and site requirements should be reviewed clearly." },
      { question: "Should disposal be listed separately?", answer: "Yes. Dense buildings can make waste handling an important scope item." },
      { question: "Can quote review check access assumptions?", answer: "Yes. It flags missing or unclear access, removal and underlay details." }
    ]
  },
  "flooring-newtown": {
    slug: "flooring-newtown",
    suburb: "Newtown",
    route: routes.newtown,
    eyebrow: "Newtown flooring quotes",
    title: "Flooring Newtown | Terrace, Apartment & Renovation Quote Help",
    description:
      "Plan a Newtown flooring quote with terrace access, apartment constraints, old floor removal, timber character, stairs, trims and quote clarity checks.",
    hero:
      "Newtown flooring projects often involve terraces, apartments and older renovation sites where access, stairs, old flooring and subfloor condition can shape the quote. A clear scope helps avoid comparing unlike-for-like totals.",
    localAngle:
      "For Newtown, property age and access can be the biggest quote variables. The quote should record existing flooring, stair details, preparation and room-by-room area before product totals are compared.",
    propertyContext: [
      { title: "Terraces and older homes", copy: "Subfloor condition, narrow access, stairs and trims may need more detailed review." },
      { title: "Apartments", copy: "Underlay, lift or stair access and disposal should be visible in the quote." },
      { title: "Character renovations", copy: "Engineered timber may suit premium rooms, but preparation and finish expectations should be clear." }
    ],
    productSuggestions: [
      { ...sharedProductSuggestions.engineered, bestFor: "character homes and finish-led renovations.", quoteNote: "Confirm subfloor, installation method, stairs and trim details." },
      { ...sharedProductSuggestions.hybrid, bestFor: "practical upgrades in busy rooms or rental properties.", quoteNote: "Check removal, preparation and transition details." },
      { ...sharedProductSuggestions.laminate, bestFor: "dry rooms and budget-conscious updates.", quoteNote: "Confirm underlay and moisture expectations." }
    ],
    quoteConsiderations: [
      { title: "Older subfloors", copy: "Existing floor layers can hide preparation work until removal." },
      { title: "Narrow access", copy: "Loading, parking and waste movement should be considered early." },
      { title: "Stairs and transitions", copy: "Terraces often need stair and threshold details documented." },
      { title: "Finish expectations", copy: "Product range and colour direction should match the renovation intent." }
    ],
    projectProof:
      "Use real project proof to compare preparation, stair and finish detail. Newtown-specific claims should wait for recorded local project data.",
    nearbyLinks: [
      { title: "Flooring Marrickville", copy: "Inner-west quote guidance nearby.", href: routes.marrickville },
      { title: "Flooring Surry Hills", copy: "Terrace and apartment quote support.", href: routes.surryHills },
      { title: "Flooring Balmain", copy: "Character home and renovation quote clarity.", href: routes.balmain }
    ],
    faqs: [
      { question: "What should I check for a Newtown terrace flooring quote?", answer: "Check stairs, existing floor removal, subfloor condition, access, trims and product finish expectations." },
      { question: "Can older floors change the quote?", answer: "Yes. Hidden subfloor or removal issues can become visible after old flooring is removed." },
      { question: "Is engineered timber suitable for character homes?", answer: "It can be, but product, installation method and preparation should be reviewed first." },
      { question: "Can I upload a floor plan?", answer: "Yes. A floor plan can help create a starting area before final site review." }
    ]
  },
  "flooring-surry-hills": {
    slug: "flooring-surry-hills",
    suburb: "Surry Hills",
    route: routes.surryHills,
    eyebrow: "Surry Hills flooring quotes",
    title: "Flooring Surry Hills | Apartment, Terrace & Access Quote Help",
    description:
      "Plan a Surry Hills flooring quote with apartment access, terrace constraints, acoustic underlay, removal, stairs, trims and preparation clearly scoped.",
    hero:
      "Surry Hills flooring projects often involve apartments, terraces and tight access. A useful quote should make product, area, access, acoustic requirements, removal and finishing scope visible before the total is compared.",
    localAngle:
      "For Surry Hills, site logistics can turn a simple-looking flooring job into a more detailed scope. Access, waste, stairs, building requirements and preparation should be written down.",
    propertyContext: [
      { title: "Apartments", copy: "Acoustic underlay, lift or stair access and building requirements should be checked early." },
      { title: "Terraces", copy: "Narrow access, stairs, existing flooring and subfloor condition can affect planning." },
      { title: "Rental and investor refreshes", copy: "Turnaround, removal and disposal clarity helps avoid approval delays." }
    ],
    productSuggestions: [
      { ...sharedProductSuggestions.hybrid, bestFor: "busy apartments and practical upgrades.", quoteNote: "Confirm acoustic, access, trims and preparation notes." },
      { ...sharedProductSuggestions.laminate, bestFor: "dry rooms where value and speed matter.", quoteNote: "Check underlay and building requirements." },
      { ...sharedProductSuggestions.engineered, bestFor: "premium rooms or terrace renovations.", quoteNote: "Review stair, prep and installation method." }
    ],
    quoteConsiderations: [
      { title: "Access constraints", copy: "Parking, loading, lifts and stairs should be recorded." },
      { title: "Acoustic requirements", copy: "Apartment underlay assumptions should be clear." },
      { title: "Removal and waste", copy: "Dense sites need disposal scope written carefully." },
      { title: "Preparation", copy: "Old buildings may need subfloor review before final confirmation." }
    ],
    projectProof:
      "Use real Sydney project proof to check finish and preparation expectations. Add Surry Hills proof only when a real local project is documented.",
    nearbyLinks: [
      { title: "Flooring Newtown", copy: "Terrace and inner-west quote clarity.", href: routes.newtown },
      { title: "Flooring Eastern Suburbs", copy: "Apartment and renovation quote support.", href: routes.easternSuburbs },
      { title: "Flooring Bondi", copy: "Coastal apartment and home guidance.", href: routes.bondi }
    ],
    faqs: [
      { question: "What should a Surry Hills apartment flooring quote include?", answer: "Product, area, access, acoustic underlay, removal, disposal, trims and exclusions should be visible." },
      { question: "Can access affect the quote?", answer: "Yes. Parking, lifts, stairs and waste movement can affect planning and scope." },
      { question: "Can I proceed if I am not sure about underlay?", answer: "Yes. Mark it as not sure so it becomes a review flag." },
      { question: "Can quote review help with a vague Surry Hills quote?", answer: "Yes. It checks missing access, product, preparation and finishing details." }
    ]
  },
  "flooring-bondi": {
    slug: "flooring-bondi",
    suburb: "Bondi",
    route: routes.bondi,
    eyebrow: "Bondi flooring quotes",
    title: "Flooring Bondi | Coastal Apartment & Home Quote Help",
    description:
      "Plan a Bondi flooring quote with coastal suitability, apartment access, acoustic underlay, moisture awareness, removal, trims and floorplan details clear.",
    hero:
      "Bondi flooring projects can involve coastal apartments, rentals and homes where product suitability, access, moisture awareness and finishing details matter. A stronger quote separates product, area, underlay, removal and preparation assumptions.",
    localAngle:
      "For Bondi, product suitability and building access should be clear before comparing quote totals. Coastal settings, apartments and rental use can all change what matters in the written scope.",
    propertyContext: [
      { title: "Coastal apartments", copy: "Acoustic underlay, lift or stair access and product suitability should be reviewed." },
      { title: "Rental upgrades", copy: "Hybrid or laminate may be considered when durability and turnaround matter." },
      { title: "Owner-occupied homes", copy: "Engineered timber may suit premium rooms when moisture and care expectations are understood." }
    ],
    productSuggestions: [
      { ...sharedProductSuggestions.hybrid, bestFor: "practical coastal apartments and rental upgrades.", quoteNote: "Confirm product suitability, underlay, access and preparation." },
      { ...sharedProductSuggestions.engineered, bestFor: "premium living spaces where natural timber character matters.", quoteNote: "Review moisture, care, range and installation method." },
      { ...sharedProductSuggestions.laminate, bestFor: "dry internal rooms with controlled moisture expectations.", quoteNote: "Check suitability and underlay before comparing." }
    ],
    quoteConsiderations: [
      { title: "Coastal suitability", copy: "Product claims should be matched to room use and care expectations." },
      { title: "Apartment access", copy: "Lift, stairs, parking and strata notes should be captured." },
      { title: "Removal and disposal", copy: "Existing flooring type and waste handling should be separated." },
      { title: "Floor preparation", copy: "Moisture or uneven subfloor concerns should be flagged early." }
    ],
    projectProof:
      "Use real project examples to check finish and scope. Bondi-specific project claims should only be added when real local proof is available.",
    nearbyLinks: [
      { title: "Flooring Coogee", copy: "Coastal home and apartment quote guidance.", href: routes.coogee },
      { title: "Flooring Randwick", copy: "Apartment and family home quote support.", href: routes.randwick },
      { title: "Flooring Eastern Suburbs", copy: "Broader eastern suburbs quote clarity.", href: routes.easternSuburbs }
    ],
    faqs: [
      { question: "What flooring should I consider for a Bondi apartment?", answer: "Hybrid, laminate or engineered timber can suit different rooms, but acoustic, access and product suitability should be reviewed." },
      { question: "Do coastal conditions matter?", answer: "They can affect product suitability and maintenance expectations, so moisture awareness should be discussed early." },
      { question: "Should disposal be in the quote?", answer: "Yes. Removal and disposal should be clear before comparing totals." },
      { question: "Can Operon review a Bondi flooring quote?", answer: "Yes. Quote review checks product, area, access, prep, trims and exclusions." }
    ]
  },
  "flooring-bankstown": {
    slug: "flooring-bankstown",
    suburb: "Bankstown",
    route: routes.bankstown,
    eyebrow: "Bankstown flooring quotes",
    title: "Flooring Bankstown | Hybrid, Laminate & Timber Quote Help",
    description:
      "Plan a Bankstown flooring quote with product, area, removal, stairs, trims and floorplan details clear before comparing hybrid, laminate or engineered timber options.",
    hero:
      "Bankstown flooring projects often need practical decisions: family homes, unit refreshes, rental-ready upgrades and replacement jobs where removal and disposal can change the final scope. A useful quote should make the product direction, measured area and main inclusions clear before you compare totals.",
    localAngle:
      "For Bankstown, the first quote risk is usually scope clarity rather than product choice alone. Older floors, mixed property types and rental timelines can make removal, disposal, trims and floor preparation just as important as the flooring category.",
    propertyContext: [
      {
        title: "Family homes and villas",
        copy: "Hybrid or laminate can be practical for busy living areas when removal, doorway trims and furniture staging are written into the scope."
      },
      {
        title: "Units and rental refreshes",
        copy: "Value-focused projects still need clear underlay, disposal and access notes so the quote does not look cheaper by leaving items vague."
      },
      {
        title: "Older floor replacements",
        copy: "Subfloor condition, glue residue, uneven areas or existing tile can require review before a final installation scope is confirmed."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "busy family homes, rental upgrades and areas where water resistance matters.",
        quoteNote: "Ask whether removal, disposal, scotia or skirting work is included."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry internal rooms and budget-conscious rental or unit upgrades.",
        quoteNote: "Check underlay, door clearance and subfloor preparation before comparing totals."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "finish-led living spaces where a more premium timber feel matters.",
        quoteNote: "Confirm range, colour, installation method, trims and preparation before relying on the total."
      }
    ],
    quoteConsiderations: [
      {
        title: "Removal and disposal",
        copy: "Carpet, floating floors, glue-down timber, vinyl or tile should not be bundled vaguely under installation."
      },
      {
        title: "Apartment access",
        copy: "Lift, parking, loading and building access notes can affect timing and final site review."
      },
      {
        title: "Stairs and transitions",
        copy: "Townhouses and split levels should list stair nosing, trims and transition pieces separately enough to review."
      },
      {
        title: "Floor preparation",
        copy: "Older or uneven floors may need patching, levelling, grinding or moisture checks before final confirmation."
      }
    ],
    projectProof:
      "Use recent Sydney project examples as proof of the kind of scope details that matter: product choice, preparation, finishing and quote clarity. Only local project claims should be added when a Bankstown example is actually available.",
    nearbyLinks: [
      { title: "Flooring Auburn", copy: "Nearby quote guidance for Auburn homes and units.", href: routes.auburn },
      { title: "Flooring Parramatta", copy: "Apartment and investor-focused quote clarity.", href: routes.parramatta },
      { title: "Flooring Liverpool", copy: "South-west Sydney flooring quote support.", href: routes.liverpool }
    ],
    faqs: [
      {
        question: "What flooring is usually practical for Bankstown rental upgrades?",
        answer:
          "Hybrid or laminate are often considered for practical rental upgrades, but the right choice depends on room use, subfloor condition, underlay, removal and the written scope."
      },
      {
        question: "Should removal and disposal be listed separately?",
        answer:
          "Yes. Bankstown replacement jobs can involve carpet, floating floors, vinyl, tile or older adhesive, so removal and disposal should be clear before comparing quotes."
      },
      {
        question: "Can I start without exact measurements?",
        answer:
          "Yes. Start with the best area you know, use the floorplan tool if helpful, and treat the online result as a starting estimate before final review."
      },
      {
        question: "Can Operon review another Bankstown flooring quote?",
        answer:
          "Yes. The quote review checks whether product, area, inclusions, exclusions and confirmation items are clear enough to compare."
      }
    ]
  },
  "flooring-liverpool": {
    slug: "flooring-liverpool",
    suburb: "Liverpool",
    route: routes.liverpool,
    eyebrow: "Liverpool flooring quotes",
    title: "Timber Flooring Liverpool | Hybrid, Laminate & Quote Help",
    description:
      "Start a Liverpool timber flooring quote for hybrid, laminate or engineered timber with area, apartment access, removal, stairs and finishing details clear.",
    hero:
      "Liverpool timber flooring projects can range from apartment updates near the centre to townhouses and family homes across the south-west. A stronger quote separates product selection from site scope, so hybrid flooring, laminate flooring or engineered timber can be reviewed alongside area, removal, stairs, trims and access instead of being hidden behind one total.",
    localAngle:
      "In Liverpool, the quote should account for access and property type early. Apartments can need lift or strata notes, while townhouses and homes often need stair, trim, removal and staged-work details before the estimate is useful.",
    propertyContext: [
      {
        title: "Apartments and units",
        copy: "Acoustic underlay, lift access, parking and strata or building requirements should be checked before installation is booked."
      },
      {
        title: "Townhouses with stairs",
        copy: "Stair nosing, stair counts, landings and transition trims need clearer wording than a simple square-metre total."
      },
      {
        title: "Family home replacements",
        copy: "Hybrid and laminate can suit busy living areas when the quote also covers removal, disposal, trims and furniture staging."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "busy households, open-plan living areas and projects that need a practical low-maintenance finish.",
        quoteNote: "Confirm product range, underlay, trims, removal and stair details before comparing."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry internal rooms, rental refreshes and projects where budget control matters.",
        quoteNote: "Compare the underlay, floor preparation and finishing inclusions, not just the headline total."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "feature living spaces or higher-finish renovations.",
        quoteNote: "Colour, grade, installation method and pattern should be reviewed before final scope."
      }
    ],
    quoteConsiderations: [
      {
        title: "Access and building notes",
        copy: "For apartments, quote notes should cover lift booking, parking, loading and any building requirements."
      },
      {
        title: "Stairs and split levels",
        copy: "Townhouse stairs can change labour and finishing scope, so stair counts and nosing should be captured."
      },
      {
        title: "Removal and disposal",
        copy: "Existing carpet, laminate, vinyl, timber or tile should be identified before the quote is compared."
      },
      {
        title: "Measured area",
        copy: "Floor plans or room-by-room measurements help avoid comparing a quote with unclear area assumptions."
      }
    ],
    projectProof:
      "Use recent Sydney project proof to see how product, preparation and finishing details affect a written flooring scope. Liverpool-specific project proof should only be added when a real matching project is available.",
    nearbyLinks: [
      { title: "Flooring Edmondson Park", copy: "Newer-home flooring quote guidance nearby.", href: routes.edmondsonPark },
      { title: "Flooring Leppington", copy: "Nearby growth-area quote support.", href: routes.leppington },
      { title: "Flooring Campbelltown", copy: "South-west Sydney quote clarity.", href: routes.campbelltown }
    ],
    faqs: [
      {
        question: "What should a Liverpool apartment flooring quote include?",
        answer:
          "It should make product, area, underlay, access, removal, disposal, trims and any building requirements clear enough to review."
      },
      {
        question: "Can I use a floor plan for a Liverpool quote?",
        answer:
          "Yes. A floor plan can help create a starting area before final measurement and site details are reviewed."
      },
      {
        question: "Do stairs need to be quoted separately?",
        answer:
          "Stairs should be described clearly, including counts, nosing or trim requirements and whether landings are included."
      },
      {
        question: "Can I compare an existing Liverpool flooring quote?",
        answer:
          "Yes. The quote review tool checks whether the written scope is complete enough before you compare the total."
      }
    ]
  },
  "flooring-parramatta": {
    slug: "flooring-parramatta",
    suburb: "Parramatta",
    route: routes.parramatta,
    eyebrow: "Parramatta flooring quotes",
    title: "Flooring Parramatta | Hybrid, Laminate & Timber Quote Help",
    description:
      "Compare or start a Parramatta flooring quote for hybrid, laminate or engineered timber with area, apartment access, acoustic underlay, removal and finishing details clear.",
    hero:
      "Parramatta flooring decisions often involve apartments, investor properties and busy renovation timelines. A useful quote should show whether the project is leaning toward hybrid flooring, laminate flooring or engineered timber, then connect that product choice to measured area, access, acoustic underlay, removal and finishing details before totals are compared.",
    localAngle:
      "For Parramatta, quote clarity is especially important where apartments or investor properties need fast decisions. The best starting point is a written scope that separates product, area, access, underlay, removal and finishing details.",
    propertyContext: [
      {
        title: "Apartments and strata buildings",
        copy: "Acoustic underlay, lift access, parking and approval requirements should be checked before a final installation scope is accepted."
      },
      {
        title: "Investor and rental upgrades",
        copy: "A practical product can still become unclear if disposal, trims, preparation or exclusions are not written down."
      },
      {
        title: "Family homes and renovations",
        copy: "Larger living areas need measured area, staging, furniture notes and floor preparation reviewed before booking."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "apartments, busy living areas and practical renovations where maintenance matters.",
        quoteNote: "Check acoustic, underlay and building requirements when the project is in an apartment."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry internal spaces, investment properties and cost-conscious refreshes.",
        quoteNote: "Make sure the quote identifies underlay, preparation and exclusions clearly."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "higher-finish apartments or feature rooms where timber feel is important.",
        quoteNote: "Confirm installation method, product range, colour, trims and strata requirements before final approval."
      }
    ],
    quoteConsiderations: [
      {
        title: "Acoustic underlay",
        copy: "Apartment projects should not assume underlay suitability; the quote should identify what is included."
      },
      {
        title: "Lift and parking access",
        copy: "Access limits can affect timing and should be captured before booking."
      },
      {
        title: "Area basis",
        copy: "Room measurements or a floor plan help separate true area from rough assumptions."
      },
      {
        title: "Removal and site preparation",
        copy: "Existing flooring, adhesive, uneven surfaces and disposal should be confirmed before comparing totals."
      }
    ],
    projectProof:
      "Recent Sydney project examples can show how access, preparation and finish details change the practical quote conversation. Add Parramatta-specific proof only when a real project is available.",
    nearbyLinks: [
      { title: "Flooring Auburn", copy: "Nearby mixed-property quote support.", href: routes.auburn },
      { title: "Flooring Bankstown", copy: "Replacement and rental-ready flooring guidance.", href: routes.bankstown },
      { title: "Flooring Liverpool", copy: "South-west Sydney quote clarity.", href: routes.liverpool }
    ],
    faqs: [
      {
        question: "What matters most for Parramatta apartment flooring?",
        answer:
          "Product suitability, acoustic underlay, building access, measured area, removal and finishing details should all be clear before comparing quotes."
      },
      {
        question: "Is hybrid flooring suitable for Parramatta apartments?",
        answer:
          "Hybrid may be suitable for some apartment projects, but underlay, acoustic requirements and building rules need review before final confirmation."
      },
      {
        question: "Can I start with an approximate area?",
        answer:
          "Yes. Use your best known area or upload a floor plan, then treat the estimate as a starting point before final review."
      },
      {
        question: "Can Operon check a quote from another contractor?",
        answer:
          "Yes. The quote review focuses on what is clear, missing or still subject to confirmation."
      }
    ]
  },
  "flooring-auburn": {
    slug: "flooring-auburn",
    suburb: "Auburn",
    route: routes.auburn,
    eyebrow: "Auburn flooring quotes",
    title: "Flooring Auburn | Quote Help for Hybrid, Laminate & Timber",
    description:
      "Start or review an Auburn flooring quote with product, area, removal, floor preparation, access, trims and finishing details clearer before comparing totals.",
    hero:
      "Auburn flooring projects often combine practical product choices with access, removal and preparation questions. A stronger quote explains the product category, measured area, old floor removal, disposal, trims and final confirmation items before a customer compares the total.",
    localAngle:
      "For Auburn, the quote should work for mixed property types: units, older homes, rental refreshes and busy family spaces. The product direction matters, but hidden preparation or removal assumptions can matter just as much.",
    propertyContext: [
      {
        title: "Mixed units and homes",
        copy: "Clarify parking, loading, room access and whether furniture or staged work is needed."
      },
      {
        title: "Older flooring replacements",
        copy: "Old carpet, vinyl, tile or adhesive can affect removal and floor preparation, so the written quote should be specific."
      },
      {
        title: "Rental and budget refreshes",
        copy: "Laminate or hybrid may fit, but exclusions around underlay, trims and disposal should not be left vague."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "family homes, rental upgrades and areas needing a practical, low-maintenance finish.",
        quoteNote: "Confirm removal, disposal, underlay, trims and floor preparation before comparing."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry rooms, rental updates and budget-sensitive internal spaces.",
        quoteNote: "Check the quote for underlay, moisture limits, door clearance and excluded preparation."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "finish-led spaces where timber character is worth the extra review.",
        quoteNote: "Review range, grade, colour, installation method and trims before final approval."
      }
    ],
    quoteConsiderations: [
      {
        title: "Old floor removal",
        copy: "The quote should name the existing floor type where possible, especially tile, vinyl or glue-down timber."
      },
      {
        title: "Disposal",
        copy: "Disposal should be clear so the total does not depend on an unstated assumption."
      },
      {
        title: "Preparation after removal",
        copy: "Uneven areas, adhesive residue or old subfloor issues may need review before final confirmation."
      },
      {
        title: "Apartment or unit access",
        copy: "Lift, stairs, parking and loading notes should be recorded early if access is restricted."
      }
    ],
    projectProof:
      "Recent Sydney projects can help show what a complete flooring scope looks like. Auburn-specific examples should be added only when a real local project is available.",
    nearbyLinks: [
      { title: "Flooring Bankstown", copy: "Replacement and rental-ready flooring guidance.", href: routes.bankstown },
      { title: "Flooring Parramatta", copy: "Apartment and investor quote clarity.", href: routes.parramatta },
      { title: "Flooring Liverpool", copy: "South-west Sydney quote support.", href: routes.liverpool }
    ],
    faqs: [
      {
        question: "What flooring works for Auburn rental properties?",
        answer:
          "Hybrid and laminate are common practical options, but the right quote still needs clear area, underlay, removal, disposal and finishing details."
      },
      {
        question: "Can old tile or vinyl change the quote?",
        answer:
          "Yes. Existing floor type can affect removal, disposal and preparation, so it should be described before final confirmation."
      },
      {
        question: "Can I upload photos or a floor plan?",
        answer:
          "A floor plan can help with area. Photos and extra notes can also help clarify removal, access or preparation before review."
      },
      {
        question: "Can I review a written Auburn flooring quote?",
        answer:
          "Yes. Use quote review to check whether the scope is clear enough to compare with another estimate."
      }
    ]
  },
  "flooring-edmondson-park": {
    slug: "flooring-edmondson-park",
    suburb: "Edmondson Park",
    route: routes.edmondsonPark,
    eyebrow: "Edmondson Park flooring quotes",
    title: "Timber Flooring Edmondson Park | Hybrid, Laminate & Quote Help",
    description:
      "Plan an Edmondson Park timber flooring quote for hybrid, laminate or engineered timber with area, stairs, trims, removal and floorplan details clear.",
    hero:
      "Edmondson Park timber flooring projects often involve newer homes, open-plan living areas, upstairs bedrooms and growing families who need a practical, easy-to-maintain finish. A useful flooring quote should capture whether you are leaning toward hybrid flooring, laminate flooring or engineered timber, then connect that choice to measured area, stairs, trims, removal and any floorplan details before final confirmation.",
    localAngle:
      "For Edmondson Park, the quote should reflect newer-home layouts: larger living areas, bedrooms, stairs, skirting or scotia choices and floorplan-based measurement where plans are available. This is especially useful for timber-look flooring because two quotes can sound similar while allowing for different upstairs areas, stair finishes or trim assumptions.",
    propertyContext: [
      {
        title: "Newer family homes",
        copy: "Open-plan living can make area, waste allowance, furniture staging and trim choices more important than a simple room count."
      },
      {
        title: "Townhouses and stairs",
        copy: "Stair counts, landings, nosing and transitions should be captured before the estimate is treated as complete."
      },
      {
        title: "Floorplan-supported quoting",
        copy: "If you have a plan, tracing rooms can create a clearer starting area before final review."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "open-plan family areas, kids, pets and practical everyday use where a timber-look floor is preferred.",
        quoteNote: "Confirm skirting or scotia, stair details, underlay and room area before final scope."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry bedrooms, studies or cost-conscious internal areas where laminate flooring gives a tidy timber-look finish.",
        quoteNote: "Check underlay, door clearance, trims and whether stairs are included."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "feature spaces where a more premium timber look is important.",
        quoteNote: "Review range, colour, installation method and finishing trims before final approval."
      }
    ],
    quoteConsiderations: [
      {
        title: "Large connected areas",
        copy: "Open-plan layouts should use measured area or a floor plan so the estimate is not based on rough assumptions."
      },
      {
        title: "Stairs and upper levels",
        copy: "Stair nosing, landings and upstairs transitions should be identified early, especially when timber-look flooring continues from living areas to bedrooms."
      },
      {
        title: "Trims, scotia and skirting",
        copy: "Finishing details can change the look and scope, so they should be clear before booking."
      },
      {
        title: "Removal or replacement work",
        copy: "If replacing builder carpet or existing floating floors, removal and disposal should be listed."
      }
    ],
    projectProof:
      "Recent Sydney project proof can help show how product, area and finishing choices are documented. Add Edmondson Park-specific examples only when they are real and available.",
    nearbyLinks: [
      { title: "Flooring Leppington", copy: "Nearby newer-home quote guidance.", href: routes.leppington },
      { title: "Flooring Liverpool", copy: "South-west Sydney flooring quote support.", href: routes.liverpool },
      { title: "Flooring Campbelltown", copy: "Nearby flooring quote clarity.", href: routes.campbelltown }
    ],
    faqs: [
      {
        question: "What flooring suits newer Edmondson Park homes?",
        answer:
          "Hybrid flooring is often a practical starting point for open family areas, while laminate flooring and engineered timber can suit different rooms depending on use, finish, stairs and written scope."
      },
      {
        question: "Can I quote from a builder floor plan?",
        answer:
          "Yes. A floor plan can help create a starting area, especially for open-plan spaces and multiple rooms."
      },
      {
        question: "Should stairs be included in the first quote?",
        answer:
          "Yes, if the project includes stairs. Counts, landings, nosing and transitions should be clear before final confirmation."
      },
      {
        question: "Can Operon check another Edmondson Park flooring quote?",
        answer:
          "Yes. The quote review checks whether product, area, stairs, trims, removal and exclusions are clear enough to compare."
      },
      {
        question: "What should I check in a timber flooring quote for Edmondson Park?",
        answer:
          "Check whether the quote names the product category or range, measured area, upstairs rooms, stairs, trims, removal, disposal and any floor preparation assumptions."
      }
    ]
  },
  "flooring-leppington": {
    slug: "flooring-leppington",
    suburb: "Leppington",
    route: routes.leppington,
    eyebrow: "Leppington flooring quotes",
    title: "Timber Flooring Leppington | Hybrid, Laminate & Quote Help",
    description:
      "Plan a Leppington timber flooring quote for newer homes, open-plan areas, stairs, trims, removal and floorplan measurement with hybrid, laminate or engineered timber options.",
    hero:
      "Leppington timber flooring projects often involve newer homes, open-plan family areas and practical low-maintenance choices. A useful quote should capture whether hybrid, laminate or engineered timber is the right direction, plus measured area, stairs, trims, removal and finishing details before final confirmation.",
    localAngle:
      "For Leppington, the biggest quote risk is assuming a simple square-metre total covers the whole job. Newer layouts can include large connected living areas, stairs, skirting or scotia choices, and room-by-room measurement that should be clear before comparing totals.",
    propertyContext: [
      {
        title: "Newer family homes",
        copy: "Open-plan living areas need measured area, waste allowance and trim choices recorded early."
      },
      {
        title: "Growing households",
        copy: "Hybrid can be a practical starting point where low-maintenance flooring is needed across busy family spaces."
      },
      {
        title: "Townhouses and stairs",
        copy: "Stair nosing, upper-level transitions and landing details should be included before the estimate is treated as complete."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "open-plan living, kids, pets and everyday family use.",
        quoteNote: "Confirm stair details, trims, underlay and area basis before final scope."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry bedrooms, studies and cost-conscious internal rooms.",
        quoteNote: "Check underlay, door clearance, trims and whether stairs are part of the quote."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "feature living areas where a more premium timber finish is preferred.",
        quoteNote: "Review product range, installation method, skirting/scotia and preparation before relying on the total."
      }
    ],
    quoteConsiderations: [
      {
        title: "Large connected areas",
        copy: "Use measured rooms or a floor plan so open-plan spaces are not estimated too roughly."
      },
      {
        title: "Stairs and upper levels",
        copy: "Stair counts, landings and nosing need clearer wording than a general installation line."
      },
      {
        title: "Skirting or scotia",
        copy: "Finishing choices affect both look and scope, so they should be written clearly."
      },
      {
        title: "Replacement work",
        copy: "If builder carpet or older floating floors are being removed, removal and disposal should be listed."
      }
    ],
    projectProof:
      "Recent Sydney project proof can help show how open-plan area, stairs and finishing details are documented. Add Leppington-specific examples only when real local photos and job notes are available.",
    nearbyLinks: [
      { title: "Flooring Edmondson Park", copy: "Nearby newer-home quote guidance.", href: routes.edmondsonPark },
      { title: "Flooring Camden", copy: "Larger-home and premium finish quote support.", href: routes.camden },
      { title: "Flooring Campbelltown", copy: "Practical replacement and family-home quote clarity.", href: routes.campbelltown }
    ],
    faqs: [
      {
        question: "Can I use a floor plan for a Leppington flooring quote?",
        answer:
          "Yes. A floor plan can help create a starting measured area, especially for open-plan spaces and multiple rooms."
      },
      {
        question: "What flooring is practical for newer Leppington homes?",
        answer:
          "Hybrid is often a practical starting point for busy family areas, while laminate and engineered timber can suit different rooms depending on finish and use."
      },
      {
        question: "Should stairs be included from the start?",
        answer:
          "Yes. If the project includes stairs, counts, landings, nosing and transitions should be clear before final confirmation."
      },
      {
        question: "Can Operon check another Leppington flooring quote?",
        answer:
          "Yes. Quote review checks whether product, area, stairs, trims, removal and exclusions are clear enough to compare."
      }
    ]
  },
  "flooring-camden": {
    slug: "flooring-camden",
    suburb: "Camden",
    route: routes.camden,
    eyebrow: "Camden flooring quotes",
    title: "Flooring Camden | Family Home & Timber Quote Help",
    description:
      "Plan a Camden flooring quote for larger homes, multiple rooms, stairs, trims, removal and premium timber or practical hybrid and laminate options.",
    hero:
      "Camden flooring quotes often involve larger family homes, multiple living zones and a stronger interest in premium finishes. A useful quote should separate product, area, stairs, trims, removal and floor preparation so scope is clear before a final decision.",
    localAngle:
      "For Camden, quote quality depends on mapping the whole project rather than one room in isolation. Larger areas, multiple zones, stairs and premium product choices should be written clearly before comparing totals.",
    propertyContext: [
      {
        title: "Larger family homes",
        copy: "Multiple rooms and connected living spaces need a clear area basis and room-by-room scope."
      },
      {
        title: "Feature living areas",
        copy: "Engineered timber can suit finish-led spaces, but product range and installation method need careful review."
      },
      {
        title: "Stairs and trims",
        copy: "Larger homes often need stair, skirting, scotia or transition details captured before final confirmation."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "premium living zones, feature rooms and projects where natural timber character matters.",
        quoteNote: "Confirm range, colour, installation method, stairs, trims and floor preparation."
      },
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "busy family spaces where durability and low maintenance matter.",
        quoteNote: "Check removal, disposal, trims and connected-area measurement."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry bedrooms, studies and budget-controlled rooms.",
        quoteNote: "Confirm underlay, floor prep, door clearance and inclusions before comparing."
      }
    ],
    quoteConsiderations: [
      {
        title: "Multiple zones",
        copy: "Living, hallway, bedroom and stair areas should be separated clearly enough to review."
      },
      {
        title: "Premium product choice",
        copy: "Range, grade, colour and installation method can matter more when finish is the priority."
      },
      {
        title: "Preparation after removal",
        copy: "Existing floor removal may reveal prep work that should not be assumed away."
      },
      {
        title: "Stairs and feature details",
        copy: "Stair nosing, landings, trims and transitions should be included where relevant."
      }
    ],
    projectProof:
      "Recent Sydney engineered timber and stair project examples can help show why pattern, stairs and preparation belong in the quote. Camden-specific proof should only be added when a real local project is confirmed.",
    nearbyLinks: [
      { title: "Flooring Leppington", copy: "Nearby newer-home quote support.", href: routes.leppington },
      { title: "Flooring Campbelltown", copy: "Practical replacement and family-home quote clarity.", href: routes.campbelltown },
      { title: "Flooring Edmondson Park", copy: "Growth-area flooring quote guidance.", href: routes.edmondsonPark }
    ],
    faqs: [
      {
        question: "What should a Camden flooring quote include for a larger home?",
        answer:
          "It should include product direction, area basis, rooms included, stairs, trims, removal, disposal and preparation assumptions."
      },
      {
        question: "Is engineered timber a good option for Camden homes?",
        answer:
          "It can suit feature living areas and premium renovations, but range, installation method, preparation and finishing details should be reviewed."
      },
      {
        question: "Can I start with only some room measurements?",
        answer:
          "Yes. Start with what you know, then use room-by-room or floorplan measurement to improve the area before final review."
      },
      {
        question: "Can Operon compare an existing Camden flooring quote?",
        answer:
          "Yes. Quote review checks whether the written scope is clear enough before comparing totals."
      }
    ]
  },
  "flooring-campbelltown": {
    slug: "flooring-campbelltown",
    suburb: "Campbelltown",
    route: routes.campbelltown,
    eyebrow: "Campbelltown flooring quotes",
    title: "Flooring Campbelltown | Practical Quote & Scope Help",
    description:
      "Start or review a Campbelltown flooring quote with product, area, removal, disposal, stairs, trims and preparation details clear before comparing totals.",
    hero:
      "Campbelltown flooring work often includes practical replacements, investment property refreshes and family home upgrades. Hybrid and laminate can suit value-focused projects, while engineered timber may be reviewed for selected rooms.",
    localAngle:
      "For Campbelltown, the quote should make practical inclusions visible: removal, disposal, underlay, trims, stairs and preparation. That makes it easier to compare a real job scope instead of only comparing the final number.",
    propertyContext: [
      {
        title: "Practical replacements",
        copy: "Existing carpet, floating floors or vinyl should be identified so removal and disposal are clear."
      },
      {
        title: "Family homes",
        copy: "Busy living areas need a product direction that fits use, cleaning expectations and room flow."
      },
      {
        title: "Investment refreshes",
        copy: "Value-focused work still needs written exclusions and inclusions so the quote does not become vague."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "busy living areas, rental refreshes and low-maintenance family spaces.",
        quoteNote: "Confirm removal, disposal, underlay, trims and area measurement."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry internal rooms and budget-conscious updates.",
        quoteNote: "Check underlay, door clearance and subfloor preparation before comparing totals."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "selected rooms where a premium timber look matters.",
        quoteNote: "Review range, colour, installation method and preparation before final approval."
      }
    ],
    quoteConsiderations: [
      {
        title: "Removal type",
        copy: "Carpet, floating floor, vinyl, glue-down timber or tile can each change the review path."
      },
      {
        title: "Disposal",
        copy: "Take-away should be listed clearly instead of assumed."
      },
      {
        title: "Floor preparation",
        copy: "Uneven areas, old adhesive or moisture concerns should be flagged for review."
      },
      {
        title: "Stairs and trims",
        copy: "If included, stair counts, scotia, skirting and transition pieces should be visible in the quote."
      }
    ],
    projectProof:
      "Recent Sydney preparation and hybrid flooring proof can help show why removal and levelling details matter. Add Campbelltown-specific proof only when real job details are confirmed.",
    nearbyLinks: [
      { title: "Flooring Liverpool", copy: "South-west Sydney quote support.", href: routes.liverpool },
      { title: "Flooring Camden", copy: "Larger-home and premium finish guidance.", href: routes.camden },
      { title: "Flooring Leppington", copy: "Nearby newer-home quote clarity.", href: routes.leppington }
    ],
    faqs: [
      {
        question: "What flooring is practical for Campbelltown rental updates?",
        answer:
          "Hybrid and laminate are common practical starting points, but the quote should still list area, removal, disposal, underlay and trims clearly."
      },
      {
        question: "Can removal change the quote?",
        answer:
          "Yes. Carpet, tile, vinyl, floating floor and glue-down timber each have different removal and preparation implications."
      },
      {
        question: "Can I start if I am not sure about floor preparation?",
        answer:
          "Yes. Use the quote flow and mark unsure items for review instead of guessing."
      },
      {
        question: "Can Operon review another Campbelltown quote?",
        answer:
          "Yes. Quote review checks whether the written inclusions and exclusions are clear enough to compare."
      }
    ]
  },
  "flooring-bellevue-hill": {
    slug: "flooring-bellevue-hill",
    suburb: "Bellevue Hill",
    route: routes.bellevueHill,
    eyebrow: "Bellevue Hill flooring quotes",
    title: "Flooring Bellevue Hill | Premium Timber & Apartment Quote Help",
    description:
      "Plan a Bellevue Hill flooring quote with premium timber, apartment access, acoustic underlay, stairs, trims, preparation and quote review details clearly captured.",
    hero:
      "Bellevue Hill flooring projects can involve premium homes, apartments and finish-sensitive rooms where product choice, acoustic requirements, access and preparation need careful review. A clear quote should explain the scope before the finished look is compared.",
    localAngle:
      "For Bellevue Hill, a useful quote should respect both finish quality and practical site detail. Premium timber choices, apartment access, acoustic underlay, stairs, trims and preparation should be clear enough to review before booking.",
    propertyContext: [
      {
        title: "Premium homes",
        copy: "Engineered timber may suit feature rooms, but range, grade, installation method and trims need careful review."
      },
      {
        title: "Apartments and strata",
        copy: "Acoustic underlay, lift access, parking and building requirements should be captured early."
      },
      {
        title: "Renovation work",
        copy: "Existing floor removal and preparation can affect final scope, especially in older or finish-led rooms."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "premium living spaces and finish-led interiors.",
        quoteNote: "Confirm range, colour, grade, method, trims, stairs and preparation."
      },
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "practical apartment or family areas where maintenance matters.",
        quoteNote: "Review acoustic, underlay, access and building requirements where relevant."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry internal rooms where a timber-look finish and cost control matter.",
        quoteNote: "Confirm underlay, suitability, trims and exclusions before comparing."
      }
    ],
    quoteConsiderations: [
      {
        title: "Acoustic and strata requirements",
        copy: "Apartment projects should not assume underlay suitability without checking building requirements."
      },
      {
        title: "Premium finish details",
        copy: "Colour, grade, pattern, skirting/scotia and stair details should be specified clearly."
      },
      {
        title: "Access and parking",
        copy: "Lift, loading, parking and work-hour constraints can affect the project plan."
      },
      {
        title: "Subfloor preparation",
        copy: "Older floors or premium finishes may need preparation reviewed before final confirmation."
      }
    ],
    projectProof:
      "Recent engineered timber, herringbone and stair case studies can help show the detail level expected for premium quote scopes. Bellevue Hill-specific claims should only be added with confirmed local job proof.",
    nearbyLinks: [
      { title: "Flooring Eastern Suburbs", copy: "Broader Eastern Suburbs quote guidance.", href: routes.easternSuburbs },
      { title: "Flooring Drummoyne", copy: "Apartment and renovation quote support.", href: routes.drummoyne },
      { title: "Flooring Balmain", copy: "Inner-harbour renovation quote clarity.", href: routes.balmain }
    ],
    faqs: [
      {
        question: "What should a Bellevue Hill apartment flooring quote include?",
        answer:
          "It should include product, area, acoustic underlay, access, removal, preparation, trims and any building requirements."
      },
      {
        question: "Is engineered timber suitable for premium rooms?",
        answer:
          "It can be, but range, colour, grade, installation method and site conditions should be reviewed before final confirmation."
      },
      {
        question: "Can quote review help with a premium flooring quote?",
        answer:
          "Yes. Quote review checks whether product, area, preparation, stairs, trims and exclusions are clear enough to compare."
      },
      {
        question: "Can I upload a floor plan?",
        answer:
          "Yes. A floor plan can help create a clearer starting area before final measurement or site review."
      }
    ]
  },
  "flooring-manly": {
    slug: "flooring-manly",
    suburb: "Manly",
    route: routes.manly,
    eyebrow: "Manly flooring quotes",
    title: "Flooring Manly | Coastal Home & Apartment Quote Help",
    description:
      "Plan a Manly flooring quote with product suitability, apartment access, moisture considerations, removal, trims, stairs and floorplan details clear before comparing totals.",
    hero:
      "Manly flooring projects can involve apartments, coastal homes and renovation work where product suitability, access, moisture awareness and finishing details matter. A clear quote should separate product choice from area, removal, preparation and trims.",
    localAngle:
      "For Manly, the quote should account for property type and coastal conditions without making unsupported promises. Product suitability, underlay, access, removal and preparation notes should be clear before comparing totals.",
    propertyContext: [
      {
        title: "Apartments and units",
        copy: "Lift access, parking, acoustic underlay and strata notes should be recorded where relevant."
      },
      {
        title: "Coastal homes",
        copy: "Product suitability, moisture awareness and maintenance expectations should be discussed before final selection."
      },
      {
        title: "Renovations and replacements",
        copy: "Existing floor removal, disposal, trims and preparation should be visible in the quote."
      }
    ],
    productSuggestions: [
      {
        ...sharedProductSuggestions.hybrid,
        bestFor: "practical coastal homes or apartment spaces where low maintenance matters.",
        quoteNote: "Confirm suitability, underlay, access, trims and preparation before final scope."
      },
      {
        ...sharedProductSuggestions.engineered,
        bestFor: "premium rooms where natural timber character is the main goal.",
        quoteNote: "Review moisture, maintenance, range, installation method and site details carefully."
      },
      {
        ...sharedProductSuggestions.laminate,
        bestFor: "dry internal rooms where a budget-conscious timber-look finish is enough.",
        quoteNote: "Check suitability, underlay, exclusions and care expectations before comparing."
      }
    ],
    quoteConsiderations: [
      {
        title: "Product suitability",
        copy: "Coastal settings and room use should be considered before selecting the product category."
      },
      {
        title: "Apartment access",
        copy: "Lift, stairs, loading and building rules should be captured early."
      },
      {
        title: "Removal and preparation",
        copy: "Existing floor type, disposal and subfloor condition should not be left vague."
      },
      {
        title: "Trims and finishing",
        copy: "Scotia, skirting, thresholds and door trimming should be listed clearly."
      }
    ],
    projectProof:
      "Recent project proof can help set expectations around finish, preparation and stair details. Add Manly-specific project proof only when real local photos and notes are confirmed.",
    nearbyLinks: [
      { title: "Flooring Bellevue Hill", copy: "Premium home and apartment quote guidance.", href: routes.bellevueHill },
      { title: "Flooring Eastern Suburbs", copy: "Apartment and coastal-adjacent quote support.", href: routes.easternSuburbs },
      { title: "Flooring Drummoyne", copy: "Renovation and apartment quote clarity.", href: routes.drummoyne }
    ],
    faqs: [
      {
        question: "What flooring should I consider for a Manly apartment?",
        answer:
          "Hybrid, laminate or engineered timber may suit different rooms, but acoustic underlay, access, product suitability and building requirements should be reviewed."
      },
      {
        question: "Do coastal conditions affect flooring choice?",
        answer:
          "They can affect product suitability and maintenance expectations, so moisture awareness and room use should be discussed before final selection."
      },
      {
        question: "Can I start with a floor plan?",
        answer:
          "Yes. Uploading a floor plan can help create a starting area before final measurement or site review."
      },
      {
        question: "Can Operon review another Manly flooring quote?",
        answer:
          "Yes. Quote review checks whether product, area, preparation, access, trims and exclusions are clear enough to compare."
      }
    ]
  }
};

export function getLocalSuburbMetadata(slug: string): Metadata {
  const page = localSuburbPages[slug];
  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: page.route,
    image: "/assets/operon-social-preview.png"
  });
}

function createJsonLd(page: LocalSuburbPage) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl(page.route)}#service`,
        name: `Flooring quote help in ${page.suburb}`,
        serviceType: "Flooring quote and installation guidance",
        provider: {
          "@type": "LocalBusiness",
          name: "Operon Flooring",
          url: absoluteUrl(routes.home)
        },
        areaServed: [
          {
            "@type": "City",
            name: page.suburb
          },
          {
            "@type": "City",
            name: "Sydney"
          }
        ],
        url: absoluteUrl(page.route)
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home) },
          { "@type": "ListItem", position: 2, name: `Flooring ${page.suburb}`, item: absoluteUrl(page.route) }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    ]
  };
}

function DetailCards({ cards }: { cards: LinkCard[] }) {
  return (
    <div className="link-grid">
      {cards.map((card) =>
        card.href ? (
          <a className="link-card" href={card.href} key={card.title} data-track-cta={card.track}>
            <strong>{card.title}</strong>
            <span>{card.copy}</span>
          </a>
        ) : (
          <div className="link-card" key={card.title}>
            <strong>{card.title}</strong>
            <span>{card.copy}</span>
          </div>
        )
      )}
    </div>
  );
}

export function LocalSuburbPageView({ slug }: { slug: string }) {
  const page = localSuburbPages[slug];
  return (
    <Layout>
      <JsonLd data={createJsonLd(page)} />
      <section className="hero">
        <div className="shell">
          <article className="hero-card">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href={routes.home}>Home</a>
              <span>/</span>
              <span>Flooring {page.suburb}</span>
            </nav>
            <span className="eyebrow">{page.eyebrow}</span>
            <h1>Flooring quote help in {page.suburb}</h1>
            <p>{page.hero}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={`${routes.quote}?from=suburb&suburb=${encodeURIComponent(page.suburb)}#quoteForm`} data-track-cta="suburb_page_quote_click">
                Start {page.suburb} quote
              </a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="suburb_page_quote_review_click">
                Check an existing quote
              </a>
              <a className="button button-secondary" href={routes.floorplan} data-track-cta="suburb_page_floorplan_click">
                Upload a floor plan
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Local quote clarity</span>
            <h2>What matters for flooring quotes in {page.suburb}</h2>
            <p>{page.localAngle}</p>
            <div className="link-grid">
              <a className="link-card" href={routes.products}>
                <strong>Browse product ranges</strong>
                <span>Shortlist hybrid, laminate or engineered timber before quoting.</span>
              </a>
              <a className="link-card" href={routes.quote}>
                <strong>Start a structured quote</strong>
                <span>Add product, area, stairs, removal and site details in one flow.</span>
              </a>
              <a className="link-card" href={routes.quoteReview}>
                <strong>Review another quote</strong>
                <span>Check whether a written quote is ready to compare.</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Property types</span>
            <h2>Property context in {page.suburb}</h2>
            <DetailCards cards={page.propertyContext} />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Product direction</span>
            <h2>Flooring options to compare first</h2>
            <div className="link-grid">
              {page.productSuggestions.map((product) => (
                <a className="link-card" href={product.href} key={product.title}>
                  <strong>{product.title}</strong>
                  <span>
                    <strong>Best for:</strong> {product.bestFor}
                  </span>
                  <span>
                    <strong>Quote note:</strong> {product.quoteNote}
                  </span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Scope checks</span>
            <h2>Details that should be clear before comparing quotes</h2>
            <DetailCards cards={page.quoteConsiderations} />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Project proof</span>
            <h2>Use real project detail, not vague promises</h2>
            <p>{page.projectProof}</p>
            <a className="button button-secondary" href={routes.recentProjects}>
              View recent flooring projects
            </a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Nearby locations</span>
            <h2>Related local quote pages</h2>
            <DetailCards cards={page.nearbyLinks} />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Useful next steps</span>
            <h2>Choose the path that matches where you are</h2>
            <div className="link-grid">
              <a className="link-card" href={routes.floorplan}>
                <strong>Need a better area?</strong>
                <span>Use a floor plan to trace rooms before starting or updating the quote.</span>
              </a>
              <a className="link-card" href="/blog/flooring-quote-checklist.html">
                <strong>Use the quote checklist</strong>
                <span>Check product, area, removal, trims and exclusions before accepting a quote.</span>
              </a>
              <a className="link-card" href="/blog/how-to-compare-flooring-quotes.html">
                <strong>Compare quotes properly</strong>
                <span>Learn why two totals can look different even when the job seems similar.</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQs</span>
            <h2>Questions people ask before quoting in {page.suburb}</h2>
            <div className="faq">
              {page.faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card text-center">
            <span className="eyebrow">Ready to compare clearly?</span>
            <h2>Start with product, area and scope in one place</h2>
            <p>Use the quote flow for a structured starting estimate, or review an existing written quote before comparing totals.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={`${routes.quote}?from=suburb&suburb=${encodeURIComponent(page.suburb)}#quoteForm`}>
                Start flooring quote
              </a>
              <a className="button button-secondary" href={routes.quoteReview}>
                Review existing quote
              </a>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
