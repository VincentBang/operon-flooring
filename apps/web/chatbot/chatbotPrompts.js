(function () {
  const CATEGORY_GUIDANCE = {
    hybrid: {
      label: "Hybrid",
      reasons: [
        "Best when water resistance and low-fuss maintenance matter.",
        "Usually the easiest fit for busy family homes and apartments.",
        "A practical range-first path when you want durability first."
      ]
    },
    laminate: {
      label: "Laminate",
      reasons: [
        "Best when you want a straightforward category for dry, practical areas.",
        "Good for dry areas where a simple floating-floor path suits the job.",
        "A clean option when you want the quote to start with the essentials."
      ]
    },
    engineered: {
      label: "Engineered Timber",
      reasons: [
        "Best when finish and timber look matter most.",
        "Useful when the project is more design-led or premium in feel.",
        "A stronger fit when colour, method, or herringbone pattern needs a clear review."
      ]
    }
  };

  const ACTIONS = {
    welcome: [
      { id: "ready_for_quote", label: "Start flooring quote" },
      { id: "review_existing_quote", label: "Upload written quote" },
      { id: "quick_completeness_check", label: "Quick completeness check" },
      { id: "start_product_guide", label: "Choose flooring type" },
      { id: "route_floorplan", label: "Measure from floor plan" },
      { id: "request_operator", label: "Request human follow-up" }
    ],
    productGuide: [
      { id: "context_apartment", label: "Apartment" },
      { id: "context_family_home", label: "House" },
      { id: "need_waterproof", label: "Need waterproof" },
      { id: "want_premium", label: "Want a premium finish" },
      { id: "browse_products", label: "Browse products" }
    ],
    projectContext: [
      { id: "context_family_home", label: "Family home" },
      { id: "context_apartment", label: "Apartment project" },
      { id: "context_design_led", label: "Design-led renovation" },
      { id: "context_quick_turnaround", label: "Need the simplest path" }
    ],
    quoteHelp: [
      { id: "what_affects_price", label: "What affects price?" },
      { id: "collect_project_details", label: "Check missing details" },
      { id: "set_supply_install", label: "Need supply and install" },
      { id: "set_install_only", label: "Installation only" },
      { id: "route_floorplan", label: "Measure from floor plan" },
      { id: "ready_for_quote", label: "I am ready to start" },
      { id: "request_operator", label: "Request follow-up" }
    ],
    detailCollection: [
      { id: "existing_floor_carpet", label: "Existing floor: Carpet" },
      { id: "existing_floor_floating", label: "Existing floor: Floating floor" },
      { id: "existing_floor_tile", label: "Existing floor: Tile" },
      { id: "existing_floor_vinyl", label: "Existing floor: Vinyl" },
      { id: "existing_floor_unsure", label: "Existing floor: Unsure" }
    ],
    subfloorCollection: [
      { id: "subfloor_good", label: "Subfloor looks good" },
      { id: "subfloor_minor", label: "May need levelling" },
      { id: "subfloor_poor", label: "Likely needs prep" },
      { id: "subfloor_unsure", label: "Subfloor unsure" }
    ],
    accessCollection: [
      { id: "access_easy", label: "Site details are straightforward" },
      { id: "access_limited", label: "Parking or site details need review" },
      { id: "access_apartment", label: "Apartment project" },
      { id: "access_unsure", label: "Site details unsure" }
    ],
    stairsCollection: [
      { id: "stairs_none", label: "No stairs" },
      { id: "stairs_some", label: "There are stairs" },
      { id: "stairs_unsure", label: "Not sure yet" }
    ],
    furnitureCollection: [
      { id: "furniture_none", label: "No furniture handling" },
      { id: "furniture_some", label: "Some furniture to move" },
      { id: "furniture_unsure", label: "Furniture handling unsure" }
    ],
    nextSteps: [
      { id: "ready_for_quote", label: "Start quote" },
      { id: "browse_products", label: "Browse products" },
      { id: "route_floorplan", label: "Measure from floor plan" },
      { id: "review_scope", label: "Upload written quote" },
      { id: "quick_completeness_check", label: "Run quick check" },
      { id: "request_operator", label: "Request follow-up" },
      { id: "restart_chatbot", label: "Start over" }
    ],
    postSubmit: [
      { id: "post_submit_ready_soon", label: "Ready soon" },
      { id: "post_submit_comparing", label: "Comparing" },
      { id: "post_submit_planning", label: "Planning" }
    ]
  };

  const COPY = {
    welcomeTitle: "Operon Assistant",
    welcomeText: "Get clear guidance on flooring type, quote scope, and the details worth preparing before review.",
    guidanceOnly: "I can guide product choice and scope, but I will not calculate pricing here.",
    productGuideIntro: "Start with the priority that matters most for this floor.",
    productGuideContext: "Understood. Which setting best describes the project?",
    quoteExplain: "The quote has six steps: Property, Flooring, Area, Stairs, Extras, and Summary. The online result is a starting estimate before Operon reviews the scope.",
    priceFactors: "The main scope items are product path, area, stairs, existing floor removal, disposal, floor preparation, underlay, skirting or scotia, moisture protection, door trimming, furniture, and notes.",
    detailIntro: "A few optional details can make the quote scope clearer before review.",
    detailExistingFloor: "What existing floor needs to be removed, if any?",
    detailSubfloor: "How does the subfloor look from what you know so far?",
    detailAccess: "What site details should be noted?",
    detailStairs: "Any stairs involved in the project?",
    detailFurniture: "Will furniture handling likely be part of the job?",
    installOnlyExplain: "If you already have the flooring materials, the next step is usually installation only. The quote can still check prep, trims, removal, disposal, and stairs.",
    reviewScope: "A scope review helps catch common gaps: product detail, existing floor removal, disposal, prep, stairs, and site details.",
    routeProducts: "Review the product catalogue first. Range cards show colour previews, then the quote confirms the final selection where needed.",
    routeQuote: "Start with the details you know. Use Not sure where scope needs review, then check the Summary before submitting.",
    routeReview: "Review the quote scope and any unclear site details before submitting.",
    routeUnsure: "You do not need every answer now. The assistant can recommend a category and the quote can still start with unsure items.",
    areaCaptured: "I will keep that as a draft area note for this conversation.",
    costQuestion: "I cannot calculate pricing here. Start the quote with product direction, area, removal, floor preparation, and extras, then Operon confirms the final quote after review.",
    existingQuote: "Use quote review to check scope, not to argue cheapest price. Product, area, removal, disposal, preparation, trims, and site details should all be clear.",
    hiddenCosts: "Clear scope is the best protection against surprises. Removal, disposal, floor preparation, trims, furniture, stairs, and site details are the main items worth checking.",
    finalQuoteChange: "Yes, the final quote can change after review if product, measurements, or site conditions differ from the estimate. The estimate is there to make that review clearer, not to lock an unconfirmed total.",
    practicalOption: "Choose by suitability and scope, not by cheapest-price comparison. Laminate can suit simpler dry areas; hybrid is often better when durability or water resistance matters.",
    trustAnswer: "Operon is positioned around professional Sydney flooring installation, clear estimates, product guidance, quality workmanship, and final confirmation before work starts.",
    operatorHandoff: "Send your contact details and project note so Operon can follow up. This is not a live chat. Your message and recent chat context may be sent to support this follow-up request.",
    hybridLaminate: "Hybrid is usually the stronger starting point when water resistance and busy-home durability matter. Laminate can be practical for simpler dry areas where the scope is straightforward.",
    engineeredAnswer: "Engineered timber suits a more finish-led project. Select the range first, then confirm colour, installation method, and pattern clearly in the quote flow because engineered colours may vary in price.",
    areaUnsure: "That is common. Start with a rough total, measure room by room, or use a floor plan if one is available.",
    stairsAnswer: "Stairs should be flagged for quote review because they need clear installation scope. The quote flow captures the detail, and Operon review confirms the final scope.",
    tileStairsAnswer: "Tiles plus stairs should be treated as a scope-review item. Removal, disposal, trims, prep, and stair details should be checked before the quote is submitted.",
    apartmentNoLiftAnswer: "Apartment work with no lift should be reviewed for site details, level, parking, and strata rules. The assistant can flag it, but Operon review should confirm the final scope.",
    unevenFloorAnswer: "An uneven floor should be reviewed before final quote confirmation because preparation or levelling may be needed. The quote flow can capture the concern, but final scope should be checked by Operon.",
    quickCompleteness: "The quick quote completeness check uses only what you enter or tick. It can create questions, but it is not a full review of the written quote.",
    documentReview: "Upload the written quote for the strongest review. The document-based review can read visible quote details and flag unclear scope.",
    reviewMissingPrefix: "Still to confirm:",
    reviewReady: "You have covered the main scope questions.",
    validationPrefix: "Worth checking before you submit:"
  };

  window.OperonChatbotPrompts = {
    categoryGuidance: CATEGORY_GUIDANCE,
    actions: ACTIONS,
    copy: COPY
  };
}());
