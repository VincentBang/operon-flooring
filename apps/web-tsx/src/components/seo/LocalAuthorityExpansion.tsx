type AuthorityCard = {
  title: string;
  copy: string;
  href?: string;
};

type AuthorityPage = {
  suburb: string;
  intro: string;
  propertyNotes: AuthorityCard[];
  productNotes: AuthorityCard[];
  quoteNotes: AuthorityCard[];
  nearbyLinks: AuthorityCard[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

const authorityPages: Record<string, AuthorityPage> = {
  "flooring-balmain": {
    suburb: "Balmain",
    intro:
      "Balmain flooring projects often involve terraces, apartments and older homes where access, stairs, existing floor layers and finish expectations should be made clear before a quote is compared.",
    propertyNotes: [
      {
        title: "Terraces and character homes",
        copy: "Stair counts, narrow access, thresholds and skirting or scotia decisions should be written into the scope rather than assumed."
      },
      {
        title: "Apartments and compact sites",
        copy: "Lift or stair access, parking, waste movement and acoustic underlay details can affect the practical installation plan."
      },
      {
        title: "Renovation replacements",
        copy: "Existing carpet, floating floors, vinyl or glue residue should be identified so removal and preparation are not vague."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber for finish-led rooms",
        copy: "Useful where timber character matters, but installation method, range, stairs and trims should be reviewed before final confirmation.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring for practical living areas",
        copy: "A common direction for busy homes and rentals when durability, maintenance and product suitability are part of the discussion.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring for dry internal rooms",
        copy: "Can suit budget-conscious rooms when underlay, moisture expectations and exclusions are clearly written.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Measure room-by-room",
        copy: "Terraces and older layouts can have irregular room shapes, so a floor plan or room-by-room area helps avoid rough assumptions.",
        href: "/floorplan.html"
      },
      {
        title: "Check stair and trim wording",
        copy: "If the project includes stairs, transitions, scotia or skirting changes, those details should be visible before comparing totals.",
        href: "/blog/flooring-stairs-and-stair-nosing.html"
      },
      {
        title: "Review written inclusions",
        copy: "Use quote review if an existing Balmain flooring quote does not clearly list product, area, removal, preparation and exclusions.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Drummoyne", copy: "Nearby Inner West quote support for apartments and homes.", href: "/flooring-drummoyne.html" },
      { title: "Flooring Newtown", copy: "Terrace and older-home flooring quote guidance.", href: "/flooring-newtown.html" },
      { title: "Flooring Marrickville", copy: "Inner West renovation and subfloor quote clarity.", href: "/flooring-marrickville.html" }
    ],
    faq: [
      {
        question: "What should a Balmain flooring quote make clear?",
        answer: "It should show product type, measured area, removal, disposal, preparation, stairs, trims and any access assumptions."
      },
      {
        question: "Can I start if I only have a rough area?",
        answer: "Yes. Start with the best area you know, or use a floor plan to create a clearer area before final review."
      },
      {
        question: "Should old floor removal be separated?",
        answer: "Yes. Removal and disposal should be visible so the quote is easier to compare."
      }
    ]
  },
  "flooring-drummoyne": {
    suburb: "Drummoyne",
    intro:
      "Drummoyne flooring quotes can involve apartments, townhouses and family homes where access, old flooring, stairs and product direction should be confirmed before the project is booked.",
    propertyNotes: [
      {
        title: "Townhouses and split levels",
        copy: "Stairs, landings and transitions should be counted clearly, especially when comparing engineered timber or hybrid scopes."
      },
      {
        title: "Waterfront and apartment settings",
        copy: "Apartment access, underlay expectations and moisture-aware product selection should be discussed early."
      },
      {
        title: "Family home updates",
        copy: "Busy living areas need product suitability, removal, furniture staging and finishing details written down."
      }
    ],
    productNotes: [
      {
        title: "Hybrid flooring",
        copy: "Often practical for busy internal areas when underlay, trims, preparation and installation scope are clear.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Engineered timber",
        copy: "A stronger fit for premium rooms when the range, colour, installation method and stair details are reviewed.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Can work for dry rooms and value-focused refreshes when moisture expectations and exclusions are understood.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Access and waste handling",
        copy: "Parking, loading, lift access or stair access should be visible in the scope where relevant.",
        href: "/flooring-installation-cost-sydney.html"
      },
      {
        title: "Removal and preparation",
        copy: "Existing flooring type, adhesive residue and subfloor condition can affect final review.",
        href: "/blog/why-flooring-quotes-vary.html"
      },
      {
        title: "Written quote review",
        copy: "If another quote bundles inclusions into one total, check whether the scope is complete enough to compare.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Balmain", copy: "Inner West terrace and apartment quote guidance.", href: "/flooring-balmain.html" },
      { title: "Flooring Burwood", copy: "Apartment and investor flooring quote support.", href: "/flooring-burwood.html" },
      { title: "Flooring Strathfield", copy: "Nearby apartment and family-home flooring guidance.", href: "/flooring-strathfield.html" }
    ],
    faq: [
      {
        question: "What makes Drummoyne flooring quotes easier to compare?",
        answer: "Clear area, product category, removal, disposal, access, stairs, trims and exclusions make the quote easier to review."
      },
      {
        question: "Is engineered timber suitable for Drummoyne homes?",
        answer: "It can be suitable for finish-led rooms, but product range, installation method, stairs and care expectations should be confirmed."
      },
      {
        question: "Can Operon review an existing Drummoyne quote?",
        answer: "Yes. Quote review checks whether the written scope is ready to compare."
      }
    ]
  },
  "flooring-woollahra": {
    suburb: "Woollahra",
    intro:
      "Woollahra flooring projects are often finish-led, so the written quote should connect the selected product, installation method, preparation, trims and access details before the total is treated as comparable.",
    propertyNotes: [
      {
        title: "Premium homes and apartments",
        copy: "Higher-finish spaces need clear range, colour, board format and installation notes rather than a generic timber allowance."
      },
      {
        title: "Older property preparation",
        copy: "Subfloor condition, levelling, existing floor removal and moisture checks should be treated as review items."
      },
      {
        title: "Apartment requirements",
        copy: "Acoustic underlay, lift access, parking and building rules should be identified early."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "Usually the key product discussion for premium Woollahra rooms, especially where direct-stick, stair or feature-pattern scope matters.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Can suit practical secondary rooms or rental updates when the finish and product limitations are understood.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Best treated as a dry-room, value-focused option where underlay and moisture expectations are clearly stated.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Product and finish clarity",
        copy: "Make sure the quote identifies range direction, installation method, trims, stairs and exclusions.",
        href: "/flooring-quote-sydney.html"
      },
      {
        title: "Preparation scope",
        copy: "Premium finishes can depend heavily on subfloor condition, so preparation should not be left vague.",
        href: "/blog/floor-preparation-costs.html"
      },
      {
        title: "Compare the written scope",
        copy: "Use quote review before comparing totals if the product or inclusions are unclear.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Double Bay", copy: "Premium apartment and home quote guidance nearby.", href: "/flooring-double-bay.html" },
      { title: "Flooring Rose Bay", copy: "Coastal and apartment quote considerations.", href: "/flooring-rose-bay.html" },
      { title: "Flooring Eastern Suburbs", copy: "Broader eastern suburbs flooring quote support.", href: "/flooring-eastern-suburbs.html" }
    ],
    faq: [
      {
        question: "What should a Woollahra engineered timber quote include?",
        answer: "It should identify product range, installation method, area, preparation, trims, stairs and exclusions clearly."
      },
      {
        question: "Should preparation be confirmed before booking?",
        answer: "Yes. Subfloor condition can affect the final scope, especially for premium timber finishes."
      },
      {
        question: "Can I compare a premium quote online?",
        answer: "You can use quote review to check completeness, then request an Operon comparison quote with clearer assumptions."
      }
    ]
  },
  "flooring-mosman": {
    suburb: "Mosman",
    intro:
      "Mosman flooring projects often involve premium homes, apartments and renovation work where product finish, access, stairs and preparation need clearer wording than a simple square-metre total.",
    propertyNotes: [
      {
        title: "Premium homes",
        copy: "Engineered timber, board format, finish direction and stair details should be considered together."
      },
      {
        title: "Apartments",
        copy: "Acoustic underlay, lift access, building rules and disposal requirements should be visible in the quote."
      },
      {
        title: "Renovations",
        copy: "Existing floor condition and subfloor preparation can shape the final installation scope."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "Useful for premium living spaces when the quote explains installation method, preparation and finishing.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Practical for family zones or lower-maintenance rooms when product suitability is clear.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "A dry-room option for selected spaces where underlay, durability and moisture limits are understood.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Stairs and trims",
        copy: "Stair nosing, trims and transitions should be written clearly where the layout includes levels.",
        href: "/blog/flooring-stairs-and-stair-nosing.html"
      },
      {
        title: "Apartment access",
        copy: "Lift, parking and acoustic requirements can affect the practical installation plan.",
        href: "/blog/apartment-flooring-acoustic-underlay.html"
      },
      {
        title: "Start a structured quote",
        copy: "Begin with product direction, area and site details so the estimate is reviewed in context.",
        href: "/quote.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Neutral Bay", copy: "Nearby apartment and townhouse quote guidance.", href: "/flooring-neutral-bay.html" },
      { title: "Flooring North Sydney", copy: "Apartment and access-focused quote support.", href: "/flooring-north-sydney.html" },
      { title: "Flooring Manly", copy: "Coastal home and apartment flooring guidance.", href: "/flooring-manly.html" }
    ],
    faq: [
      {
        question: "What should be checked for Mosman timber flooring?",
        answer: "Product range, area, installation method, stairs, trims, preparation and access should be reviewed before booking."
      },
      {
        question: "Can apartment requirements affect the quote?",
        answer: "Yes. Underlay, lift access, parking and disposal can affect the written scope."
      },
      {
        question: "Should I use quote review for a Mosman flooring quote?",
        answer: "Yes, especially if the written quote does not explain product, preparation, inclusions and exclusions."
      }
    ]
  },
  "flooring-neutral-bay": {
    suburb: "Neutral Bay",
    intro:
      "Neutral Bay flooring quotes often need apartment access, acoustic underlay and product suitability explained clearly before the total can be compared.",
    propertyNotes: [
      {
        title: "Apartments and units",
        copy: "Acoustic underlay, lift access, building approvals and waste handling should be included where relevant."
      },
      {
        title: "Townhouses",
        copy: "Stairs, landings, trims and transition pieces should be itemised enough to review."
      },
      {
        title: "Owner-occupied renovations",
        copy: "Product finish, installation method and preparation should align with the room use."
      }
    ],
    productNotes: [
      {
        title: "Hybrid flooring",
        copy: "Can suit practical apartment living areas when underlay and building requirements are clear.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Engineered timber",
        copy: "Can suit premium rooms when the installation method and preparation are carefully reviewed.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Can suit dry internal rooms when moisture and underlay limits are understood.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Acoustic details",
        copy: "Apartment quotes should identify whether acoustic underlay or approval detail is included.",
        href: "/blog/apartment-flooring-acoustic-underlay.html"
      },
      {
        title: "Area and floor plan",
        copy: "Floor plans can help create a clearer area before a final site review.",
        href: "/floorplan.html"
      },
      {
        title: "Quote review",
        copy: "Check whether an existing quote is clear on product, area, access, removal and exclusions.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring North Sydney", copy: "Dense-building flooring quote guidance.", href: "/flooring-north-sydney.html" },
      { title: "Flooring Mosman", copy: "Premium home and apartment quote support.", href: "/flooring-mosman.html" },
      { title: "Flooring Chatswood", copy: "North Shore apartment and home guidance.", href: "/flooring-chatswood.html" }
    ],
    faq: [
      {
        question: "What matters in a Neutral Bay apartment flooring quote?",
        answer: "Acoustic underlay, access, product selection, measured area, removal, disposal and exclusions should be clear."
      },
      {
        question: "Can I start with a floor plan?",
        answer: "Yes. Use the floorplan tool if room measurements are not easy to confirm."
      },
      {
        question: "Is the online quote final?",
        answer: "No. It is a starting estimate and final scope is reviewed before booking."
      }
    ]
  },
  "flooring-double-bay": {
    suburb: "Double Bay",
    intro:
      "Double Bay flooring projects can be product- and finish-sensitive, so the quote should clearly explain range direction, preparation, access and finishing scope before the total is compared.",
    propertyNotes: [
      {
        title: "Premium apartments",
        copy: "Acoustic underlay, lift access, building rules and product finish should be reviewed together."
      },
      {
        title: "Homes and renovations",
        copy: "Engineered timber, stairs, trims and subfloor preparation may need more detailed written scope."
      },
      {
        title: "Investment updates",
        copy: "Practical product choices still need removal, disposal and exclusions stated clearly."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "Often the key finish-led option when range, installation method and preparation are made clear.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Can suit practical upgrades where low maintenance and product suitability matter.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "A dry-room option where budget, underlay and durability expectations are clear.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Compare written scope",
        copy: "Do not compare totals until product, area, preparation, trims and exclusions are clear.",
        href: "/blog/how-to-compare-flooring-quotes.html"
      },
      {
        title: "Preparation and finish",
        copy: "Premium finishes can depend on subfloor condition and installation method.",
        href: "/blog/floor-preparation-costs.html"
      },
      {
        title: "Start a quote",
        copy: "Add product direction, area and known site details to create a structured starting estimate.",
        href: "/quote.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Woollahra", copy: "Premium home and apartment quote clarity.", href: "/flooring-woollahra.html" },
      { title: "Flooring Rose Bay", copy: "Coastal apartment and home quote support.", href: "/flooring-rose-bay.html" },
      { title: "Flooring Bellevue Hill", copy: "Premium Eastern Suburbs quote guidance.", href: "/flooring-bellevue-hill.html" }
    ],
    faq: [
      {
        question: "What should a Double Bay flooring quote include?",
        answer: "It should show product range, area, preparation, access, trims, stairs if relevant and exclusions."
      },
      {
        question: "Can engineered timber quotes vary widely?",
        answer: "Yes. Product range, installation method, preparation and finishing scope can make quotes look different."
      },
      {
        question: "Can Operon review another quote?",
        answer: "Yes. The quote review flow checks whether the written scope is ready to compare."
      }
    ]
  },
  "flooring-rose-bay": {
    suburb: "Rose Bay",
    intro:
      "Rose Bay flooring decisions often need product suitability, apartment access, coastal moisture awareness and finishing detail recorded before a quote is treated as ready.",
    propertyNotes: [
      {
        title: "Coastal apartments",
        copy: "Product suitability, underlay, lift or stair access and disposal should be checked early."
      },
      {
        title: "Homes near the coast",
        copy: "Care expectations, preparation and product limitations should be discussed before final confirmation."
      },
      {
        title: "Renovation replacements",
        copy: "Existing flooring and subfloor condition should be separated from the product discussion."
      }
    ],
    productNotes: [
      {
        title: "Hybrid flooring",
        copy: "Often considered for practical internal spaces, with suitability and underlay reviewed before booking.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Engineered timber",
        copy: "Can suit premium rooms when moisture awareness, care and installation method are clear.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Should be limited to suitable dry internal areas with clear underlay and maintenance expectations.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Coastal suitability",
        copy: "The quote should not rely on broad product claims; room use and care expectations matter.",
        href: "/products.html"
      },
      {
        title: "Access and area",
        copy: "Apartment access and measured area should be clear before comparing totals.",
        href: "/floorplan.html"
      },
      {
        title: "Quote exclusions",
        copy: "Check whether preparation, removal, disposal, trims and stairs are included or excluded.",
        href: "/blog/common-flooring-quote-exclusions.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Bondi", copy: "Coastal apartment and home flooring guidance.", href: "/flooring-bondi.html" },
      { title: "Flooring Double Bay", copy: "Premium apartment and home quote support.", href: "/flooring-double-bay.html" },
      { title: "Flooring Vaucluse", copy: "Coastal and premium home quote clarity.", href: "/flooring-vaucluse.html" }
    ],
    faq: [
      {
        question: "Do coastal conditions matter for Rose Bay flooring?",
        answer: "They can affect product suitability and care expectations, so they should be reviewed before final confirmation."
      },
      {
        question: "What should be in an apartment quote?",
        answer: "Product, area, underlay, access, removal, disposal, trims and exclusions should be visible."
      },
      {
        question: "Can I use quote review first?",
        answer: "Yes. Use quote review if you already have a written quote and want to check completeness."
      }
    ]
  },
  "flooring-coogee": {
    suburb: "Coogee",
    intro:
      "Coogee flooring projects often involve coastal homes, apartments and rental upgrades where product suitability, underlay, access and removal should be written clearly.",
    propertyNotes: [
      {
        title: "Coastal apartments",
        copy: "Acoustic underlay, access, product suitability and waste handling should be included where relevant."
      },
      {
        title: "Rental upgrades",
        copy: "Hybrid or laminate can be practical, but removal, disposal, trims and exclusions should be visible."
      },
      {
        title: "Owner-occupied homes",
        copy: "Engineered timber can suit selected rooms when care, moisture expectations and preparation are clear."
      }
    ],
    productNotes: [
      {
        title: "Hybrid flooring",
        copy: "Practical for many internal coastal spaces when product suitability and underlay are reviewed.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Suitable mainly for dry rooms where maintenance and moisture limitations are understood.",
        href: "/laminate-flooring-sydney.html"
      },
      {
        title: "Engineered timber",
        copy: "A premium option when preparation, care and installation method are specified.",
        href: "/engineered-timber-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Moisture-aware product choice",
        copy: "Coastal settings make it important to match product category with room use and care expectations.",
        href: "/products.html"
      },
      {
        title: "Apartment scope",
        copy: "Lift, stair, acoustic and disposal details should be written down before comparison.",
        href: "/blog/apartment-flooring-acoustic-underlay.html"
      },
      {
        title: "Compare another quote",
        copy: "Use quote review if another written quote leaves exclusions or inclusions unclear.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Randwick", copy: "Apartment and family-home quote guidance nearby.", href: "/flooring-randwick.html" },
      { title: "Flooring Bondi", copy: "Coastal apartment and home quote support.", href: "/flooring-bondi.html" },
      { title: "Flooring Eastern Suburbs", copy: "Broader Eastern Suburbs flooring guidance.", href: "/flooring-eastern-suburbs.html" }
    ],
    faq: [
      {
        question: "What should a Coogee flooring quote include?",
        answer: "It should show product, area, access, underlay, removal, disposal, preparation, trims and exclusions."
      },
      {
        question: "Is hybrid flooring suitable near the coast?",
        answer: "It can be suitable for many internal spaces, but product suitability, room use and care expectations should be reviewed."
      },
      {
        question: "Can I start with a floor plan?",
        answer: "Yes. A floor plan can help estimate area before final site review."
      }
    ]
  },
  "flooring-vaucluse": {
    suburb: "Vaucluse",
    intro:
      "Vaucluse flooring projects often involve premium homes, coastal conditions and finish-led rooms where product suitability, preparation, stairs and access should be clear before a quote is compared.",
    propertyNotes: [
      {
        title: "Premium homes and renovations",
        copy: "Engineered timber, feature stairs, large living spaces and trim decisions should be scoped in plain language."
      },
      {
        title: "Coastal considerations",
        copy: "Product suitability, room use, care expectations and moisture awareness should be discussed before final confirmation."
      },
      {
        title: "Access and staging",
        copy: "Parking, material movement, staged work and waste handling can matter on larger or more complex properties."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "A strong fit for premium living areas when range, installation method, preparation and stairs are reviewed together.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Can suit practical internal areas where durability and lower maintenance are important.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Best kept to suitable dry rooms where budget, underlay and moisture expectations are clear.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Finish and installation method",
        copy: "Premium flooring quotes should identify range, installation method, preparation and finishing items.",
        href: "/flooring-quote-sydney.html"
      },
      {
        title: "Stairs, trims and transitions",
        copy: "Large homes and split levels need stair and transition wording clear enough to review.",
        href: "/blog/flooring-stairs-and-stair-nosing.html"
      },
      {
        title: "Compare scope before price",
        copy: "Use quote review if another written quote does not explain product, area, preparation or exclusions.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Rose Bay", copy: "Coastal apartment and home quote considerations.", href: "/flooring-rose-bay.html" },
      { title: "Flooring Bellevue Hill", copy: "Premium Eastern Suburbs quote support.", href: "/flooring-bellevue-hill.html" },
      { title: "Flooring Woollahra", copy: "Finish-led flooring quote clarity nearby.", href: "/flooring-woollahra.html" }
    ],
    faq: [
      {
        question: "What should a Vaucluse flooring quote include?",
        answer: "Product range, area, installation method, preparation, stairs, trims, access and exclusions should be clear."
      },
      {
        question: "Does coastal location affect product choice?",
        answer: "It can affect suitability and care expectations, so product choice should be reviewed against room use and conditions."
      },
      {
        question: "Can I review a premium timber quote first?",
        answer: "Yes. Quote review helps check whether product, preparation and finishing scope are clear enough to compare."
      }
    ]
  },
  "flooring-wahroonga": {
    suburb: "Wahroonga",
    intro:
      "Wahroonga flooring quotes often involve larger family homes, timber-led renovations and multiple living zones where area, stairs, trims and preparation need careful review.",
    propertyNotes: [
      {
        title: "Large family homes",
        copy: "Open-plan areas, bedrooms, stairs and staged installation should be separated so the quote is easier to compare."
      },
      {
        title: "Timber-led renovations",
        copy: "Engineered timber can suit premium rooms when product range, installation method and preparation are stated clearly."
      },
      {
        title: "Subfloor and preparation",
        copy: "Older or larger homes can have uneven areas, old floor layers or preparation assumptions that need review."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "Often the main option for finish-led family homes where timber character matters.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Useful for practical family zones where low maintenance and everyday durability matter.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Can suit dry bedrooms or studies when underlay, durability and exclusions are clear.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Measured area",
        copy: "Larger homes benefit from room-by-room measurements or a floor plan before final review.",
        href: "/floorplan.html"
      },
      {
        title: "Preparation and old flooring",
        copy: "Subfloor condition, old floor removal and disposal should not be hidden inside one total.",
        href: "/blog/why-flooring-quotes-vary.html"
      },
      {
        title: "Installation cost guide",
        copy: "Understand the main customer-safe scope drivers before comparing written quotes.",
        href: "/flooring-installation-cost-sydney.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Killara", copy: "North Shore timber and family-home quote support.", href: "/flooring-killara.html" },
      { title: "Flooring Pymble", copy: "Premium home and timber flooring quote guidance.", href: "/flooring-pymble.html" },
      { title: "Flooring Chatswood", copy: "Apartment and family-home quote clarity nearby.", href: "/flooring-chatswood.html" }
    ],
    faq: [
      {
        question: "What matters for Wahroonga timber flooring quotes?",
        answer: "Product range, measured area, stairs, trims, installation method, preparation and exclusions should be visible."
      },
      {
        question: "Can I use a floor plan for a larger home?",
        answer: "Yes. A floor plan can create a clearer starting area before final site confirmation."
      },
      {
        question: "Should preparation be confirmed before booking?",
        answer: "Yes. Preparation can affect the final scope, especially for larger or older homes."
      }
    ]
  },
  "flooring-killara": {
    suburb: "Killara",
    intro:
      "Killara flooring projects often centre on family homes, premium timber finishes and practical room-by-room upgrades where product choice and preparation should be connected to the quote scope.",
    propertyNotes: [
      {
        title: "Family homes",
        copy: "Living rooms, bedrooms, stairs and transitions should be measured and described clearly."
      },
      {
        title: "Premium finishes",
        copy: "Engineered timber may suit feature rooms, but range, colour, installation method and preparation need review."
      },
      {
        title: "Renovation replacements",
        copy: "Existing flooring, disposal, furniture staging and subfloor condition should be noted before comparing totals."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "Best suited to finish-led spaces when the quote includes preparation and installation method.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Can suit practical family areas when durability, underlay and trims are clearly scoped.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Can suit dry internal rooms and budget-conscious updates when exclusions are clear.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Room-by-room area",
        copy: "Large homes are easier to quote when room areas or a floor plan are available.",
        href: "/floorplan.html"
      },
      {
        title: "Stairs and finishing",
        copy: "Stair nosing, trims, scotia or skirting choices should be written down.",
        href: "/blog/flooring-stairs-and-stair-nosing.html"
      },
      {
        title: "Quote completeness",
        copy: "Use quote review if product, preparation, removal or finishing details are unclear.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Pymble", copy: "Nearby family-home and timber quote guidance.", href: "/flooring-pymble.html" },
      { title: "Flooring Wahroonga", copy: "North Shore premium home flooring support.", href: "/flooring-wahroonga.html" },
      { title: "Flooring Chatswood", copy: "Apartment and family-home quote clarity.", href: "/flooring-chatswood.html" }
    ],
    faq: [
      {
        question: "What should a Killara flooring quote include?",
        answer: "It should include product, measured area, removal, disposal, preparation, stairs, trims and exclusions where relevant."
      },
      {
        question: "Is engineered timber suitable for Killara homes?",
        answer: "It can be suitable for premium spaces, but product range, installation method and preparation should be reviewed."
      },
      {
        question: "Can I start without exact measurements?",
        answer: "Yes. Start with the best known area or use a floor plan, then confirm final details before booking."
      }
    ]
  },
  "flooring-pymble": {
    suburb: "Pymble",
    intro:
      "Pymble flooring quotes often involve larger homes, timber finishes and staged renovation work where area, product selection, preparation and stairs should be clear from the start.",
    propertyNotes: [
      {
        title: "Larger homes",
        copy: "Multiple rooms, living zones and stair areas should be captured so area assumptions are not vague."
      },
      {
        title: "Premium timber direction",
        copy: "Engineered timber can suit feature spaces when installation method, subfloor condition and trims are written clearly."
      },
      {
        title: "Family practicality",
        copy: "Hybrid or laminate can suit selected rooms when maintenance, durability and exclusions are understood."
      }
    ],
    productNotes: [
      {
        title: "Engineered timber",
        copy: "A strong choice for premium rooms when scope, preparation and finishing details are clear.",
        href: "/engineered-timber-flooring-sydney.html"
      },
      {
        title: "Hybrid flooring",
        copy: "Useful for low-maintenance areas when product suitability and underlay are reviewed.",
        href: "/hybrid-flooring-sydney.html"
      },
      {
        title: "Laminate flooring",
        copy: "Can suit dry rooms and secondary spaces when budget and scope clarity matter.",
        href: "/laminate-flooring-sydney.html"
      }
    ],
    quoteNotes: [
      {
        title: "Floor plan support",
        copy: "A floor plan can help map larger rooms and reduce area uncertainty before final review.",
        href: "/floorplan.html"
      },
      {
        title: "Preparation scope",
        copy: "Subfloor, removal and disposal details should be separated from product selection.",
        href: "/blog/floor-preparation-costs.html"
      },
      {
        title: "Compare written quotes",
        copy: "Check whether another quote includes product, area, preparation, stairs, trims and exclusions.",
        href: "/quote-review.html"
      }
    ],
    nearbyLinks: [
      { title: "Flooring Killara", copy: "Nearby North Shore family-home quote clarity.", href: "/flooring-killara.html" },
      { title: "Flooring Wahroonga", copy: "Premium home and timber flooring support.", href: "/flooring-wahroonga.html" },
      { title: "Flooring Epping", copy: "Family home and townhouse quote guidance.", href: "/flooring-epping.html" }
    ],
    faq: [
      {
        question: "What should I check for a Pymble flooring quote?",
        answer: "Check area, product range, installation method, preparation, stairs, trims, removal, disposal and exclusions."
      },
      {
        question: "Should I measure room-by-room?",
        answer: "Room-by-room measurements or a floor plan can make the starting estimate clearer."
      },
      {
        question: "Can quote review help with timber quotes?",
        answer: "Yes. Quote review can flag missing product, preparation, stair or finishing details before you compare totals."
      }
    ]
  }
};

export function LocalAuthorityExpansion({ slug }: { slug: string }) {
  const page = authorityPages[slug];

  if (!page) return null;

  return (
    <>
      <section className="section" aria-label={`${page.suburb} flooring quote authority`}>
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Local quote depth</span>
            <h2>{page.suburb} flooring quotes with clearer scope</h2>
            <p>{page.intro}</p>
            <div className="trust-card-grid" style={{ marginTop: 22 }}>
              {page.propertyNotes.map((note) => (
                <article className="trust-card" key={note.title}>
                  <h3>{note.title}</h3>
                  <p>{note.copy}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section" aria-label={`${page.suburb} flooring product guidance`}>
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Product fit</span>
            <h2>Product options to compare before quoting</h2>
            <p>
              Product choice should be reviewed alongside room use, measured area, installation method and written inclusions. These links help keep the
              product decision connected to the quote path.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {page.productNotes.map((note) => (
                <a className="link-card" href={note.href} key={note.title}>
                  <strong>{note.title}</strong>
                  <span>{note.copy}</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section" aria-label={`${page.suburb} quote clarity checklist`}>
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Quote clarity</span>
            <h2>What to check before comparing totals</h2>
            <p>
              A useful flooring quote should make the known details visible before anyone compares totals. For {page.suburb}, that means checking the
              product category, approximate area, old flooring removal, disposal, preparation, stairs, trims, access notes and any exclusions. If one of
              those items is still unknown, it should be treated as a review item rather than hidden inside a broad allowance.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {page.quoteNotes.map((note) => (
                <a className="link-card" href={note.href} key={note.title}>
                  <strong>{note.title}</strong>
                  <span>{note.copy}</span>
                </a>
              ))}
            </div>
          </article>

          <article className="section-card">
            <span className="eyebrow">Nearby context</span>
            <h2>Compare nearby Sydney flooring pages</h2>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {page.nearbyLinks.map((note) => (
                <a className="link-card" href={note.href} key={note.title}>
                  <strong>{note.title}</strong>
                  <span>{note.copy}</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section" aria-label={`${page.suburb} flooring quote FAQs`}>
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQ</span>
            <h2>{page.suburb} flooring quote questions</h2>
            <div className="faq-accordion">
              {page.faq.map((item, index) => (
                <details className="faq-toggle" key={item.question} open={index === 0}>
                  <summary>{item.question}</summary>
                  <div className="faq-toggle-body">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
            <div className="hero-actions" style={{ marginTop: 24 }}>
              <a className="button" href="/quote.html">
                Start flooring quote
              </a>
              <a className="button-secondary" href="/quote-review.html">
                Check an existing quote
              </a>
              <a className="button-secondary" href="/floorplan.html">
                Measure from floor plan
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
