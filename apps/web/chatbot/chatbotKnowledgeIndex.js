(function () {
  const PRODUCT_SUMMARIES = {
    hybrid: {
      key: "product_hybrid",
      label: "Hybrid flooring",
      summary: "Hybrid is a practical starting point for busy homes, apartments, kitchens, pets, and everyday water resistance. Browse by range first, then confirm the final colour during the quote if needed.",
      suitability: "Good when durability, easy maintenance, and a simple quote path matter. Current hybrid ranges include 7.0mm, 8.0mm, and 9.0mm options.",
      route: { label: "Browse hybrid", href: "hybrid-flooring-sydney.html" },
      terms: ["hybrid", "waterproof", "water resistant", "pets", "busy home", "7mm", "8mm", "9mm", "etf"]
    },
    laminate: {
      key: "product_laminate",
      label: "Laminate flooring",
      summary: "Laminate suits simpler dry areas where the project needs a straightforward floating-floor path. Water-resistant laminate ranges can be previewed by colour before starting the quote.",
      suitability: "Good for bedrooms, living spaces, and practical renovations where water exposure is not the main concern.",
      route: { label: "Browse laminate", href: "laminate-flooring-sydney.html" },
      terms: ["laminate", "dry area", "simple floor", "12mm", "ac4", "water resistant laminate"]
    },
    engineered: {
      key: "product_engineered",
      label: "Engineered timber",
      summary: "Engineered timber suits finish-led projects where timber look, colour, range, and installation method matter. Select the range first; engineered colour is confirmed in the quote flow.",
      suitability: "Good for premium renovations, herringbone projects, and feature areas that need clearer review before final confirmation.",
      route: { label: "Browse engineered", href: "engineered-timber-flooring-sydney.html" },
      terms: ["engineered", "timber", "herringbone", "heringbone", "chevron", "premium finish", "swish oak", "natura"]
    }
  };

  const PRODUCT_RANGES = {
    hybridEtf: {
      key: "range_hybrid_etf",
      label: "ETF hybrid ranges",
      summary: "ETF hybrid is shown as separate 7.0mm, 8.0mm, and 9.0mm ranges. Colours can be previewed from the product page, while the quote keeps the selected range as the main starting point.",
      suitability: "Good when the customer wants a practical waterproof-core product path and can confirm colour later.",
      route: { label: "Browse hybrid ranges", href: "products.html" },
      terms: ["etf hybrid", "etf 7", "etf 8", "etf 9", "hybrid 7.0", "hybrid 8.0", "hybrid 9.0"]
    },
    laminateWaterResistant: {
      key: "range_laminate_water_resistant",
      label: "12mm water-resistant laminate",
      summary: "The 12mm water-resistant AC4 laminate range is a practical laminate path for customers who want a straightforward floating-floor option with colour previews.",
      suitability: "Good for dry interior spaces where laminate is suitable and the customer wants a clean range-first selection.",
      route: { label: "Browse laminate", href: "products.html" },
      terms: ["12mm water resistant", "ac4 laminate", "water resistant ac4", "laminate range"]
    },
    swishOakNatura: {
      key: "range_swish_oak_natura",
      label: "Swish Oak Natura",
      summary: "Swish Oak Natura is an engineered timber range with colour previews on the product page. The customer selects the range first and confirms the exact colour during the quote flow.",
      suitability: "Good for premium engineered timber projects where timber character, colour, and installation method need clear confirmation.",
      route: { label: "Browse engineered", href: "products.html" },
      terms: ["swish oak natura", "ambient sand", "belfort oak", "french natural", "french carbon", "engineered range"]
    },
    swishOakHerringbone: {
      key: "range_swish_oak_herringbone",
      label: "Swish Oak Natura Herringbone",
      summary: "Swish Oak Natura Herringbone is an engineered herringbone range. It should be treated as a premium pattern project, with colour, method, stairs, and site scope confirmed before final booking.",
      suitability: "Good for feature spaces and design-led projects where pattern installation needs careful review.",
      route: { label: "Browse engineered", href: "products.html" },
      terms: ["swish oak herringbone", "swish oak natura herringbone", "herringbone engineered", "heringbone", "fiano brown herringbone", "french ghost herringbone"]
    }
  };

  const QUOTE_FLOW = {
    key: "quote_flow",
    label: "Quote flow",
    summary: "The quote path is a five-step express flow: project basics, flooring and area, main scope, estimate preview, then contact and submit. The online result is a starting estimate, not the final confirmed quote.",
    steps: ["project basics", "flooring and area", "main scope", "estimate preview", "contact and submit"],
    route: { label: "Start quote", href: "quote.html" },
    terms: ["quote flow", "how quote works", "quote process", "project basics", "flooring and area", "main scope", "estimate preview", "contact and submit", "advanced details", "not sure", "estimate", "submit", "email copy", "email me a copy", "quote submitted"]
  };

  const QUOTE_SCOPE = {
    removal: {
      key: "scope_removal_disposal",
      label: "Removal and disposal",
      summary: "Existing floor to remove should be one clear choice such as carpet, floating floor, glue-down timber, tile, vinyl, not sure, or other. Disposal or take-away should be confirmed separately when removal is included.",
      route: { label: "Start quote", href: "quote.html" },
      terms: ["removal", "dispose", "disposal", "take away", "existing floor", "carpet removal", "tile removal", "floating floor removal"]
    },
    quoteReview: {
      key: "scope_quote_review",
      label: "Quote review",
      summary: "Quick quote completeness check uses only customer-entered details. Document-based quote review is stronger when the written quote is uploaded.",
      route: { label: "Upload written quote", href: "quote-review.html" },
      terms: ["quote review", "review my quote", "scope check", "quick check", "quick completeness", "document review", "upload quote", "existing quote"]
    },
    floorplan: {
      key: "scope_floorplan_measurement",
      label: "Floor plan measurement",
      summary: "If the customer already has a floor plan, they can use the measurement tool for area support before quote review.",
      route: { label: "Measure from floor plan", href: "floorplan.html" },
      terms: ["floorplan", "floor plan", "do not know area", "don't know area", "unknown area", "measure"]
    },
    underlay: {
      key: "scope_underlay_acoustic",
      label: "Underlay and acoustic layer",
      summary: "Underlay or acoustic layer should be confirmed when the building, product, or strata requirements depend on it. It is a scope item, not something to assume from the total price.",
      route: { label: "Review quote scope", href: "quote-review.html" },
      terms: ["underlay", "acoustic", "sound rating", "strata acoustic", "soundproof", "noise", "apartment acoustic"]
    },
    floorPrep: {
      key: "scope_floor_preparation",
      label: "Floor preparation",
      summary: "Floor preparation should be checked when the floor is uneven, has old adhesive, moisture concern, movement, or tile removal. This is one of the common reasons final scope changes after review.",
      route: { label: "Review quote scope", href: "quote-review.html" },
      terms: ["floor preparation", "floor prep", "subfloor", "uneven", "levelling", "leveling", "old adhesive", "not flat", "dips"]
    },
    trims: {
      key: "scope_trims_finishing",
      label: "Trims, scotia and skirting",
      summary: "Finishing should say whether trims, scotia, skirting, transition strips, door trims, or stair nosing are included. If it is not written, it should be confirmed before comparing quotes.",
      route: { label: "Review quote scope", href: "quote-review.html" },
      terms: ["trim", "trims", "scotia", "skirting", "transition", "door trim", "door trimming", "stair nosing", "nosing", "edge trim"]
    },
    stairs: {
      key: "scope_stairs",
      label: "Stairs",
      summary: "Stairs should be treated as a separate scope check. Step type, width, nosing, landing, open sides, product type, and site details should be reviewed before final confirmation.",
      route: { label: "Review quote scope", href: "quote-review.html" },
      terms: ["stairs", "staircase", "steps", "landing", "triangle step", "winder", "open side", "stair nosing"]
    },
    access: {
      key: "scope_access_site_details",
      label: "Site details",
      summary: "Site details should capture apartment level, lift, parking, loading, stairs, occupied rooms, and strata rules where relevant. These details help avoid comparing quotes that describe different jobs.",
      route: { label: "Start quote", href: "quote.html" },
      terms: ["access", "parking", "lift", "elevator", "loading", "level", "strata", "apartment access", "site details"]
    },
    moisture: {
      key: "scope_moisture_concrete",
      label: "Moisture and concrete floors",
      summary: "Concrete floors may need moisture awareness before final confirmation. The quote should note moisture protection where the site or product path makes it relevant.",
      route: { label: "Review quote scope", href: "quote-review.html" },
      terms: ["moisture", "concrete", "moisture barrier", "damp", "slab", "vapour", "vapor"]
    },
    warrantyExclusions: {
      key: "scope_warranty_exclusions",
      label: "Warranty and exclusions",
      summary: "Warranty, exclusions, product details, and variation conditions should be written clearly. If they are not listed, ask for confirmation before comparing by total price.",
      route: { label: "Review quote scope", href: "quote-review.html" },
      terms: ["warranty", "warranties", "exclusion", "exclusions", "variation", "variations", "quote validity", "payment terms"]
    },
    quoteComparison: {
      key: "scope_quote_comparison",
      label: "Comparing flooring quotes",
      summary: "Compare flooring quotes by scope first. Product, area, underlay, removal, disposal, prep, trims, stairs, site details, warranty, and exclusions should be clear before total price carries much meaning.",
      route: { label: "Review quote", href: "quote-review.html" },
      terms: ["compare quotes", "compare flooring quotes", "quote comparison", "fair quote", "is this quote fair", "is my quote fair"]
    }
  };

  const SERVICE_PAGES = {
    installGuide: {
      key: "service_install_guide",
      label: "Installation guide",
      summary: "Installation guidance should focus on area, product direction, removal, floor preparation, trims, and review scope.",
      route: { label: "Read install guide", href: "flooring-installation-cost-sydney.html" },
      terms: ["installation guide", "installation", "flooring installation", "install flooring"]
    },
    floorplan: {
      key: "service_floorplan",
      label: "Floor plan measurement",
      summary: "Floor plan measurement helps when the customer does not know the area yet. It supports area clarity before quote review.",
      route: { label: "Measure area", href: "floorplan.html" },
      terms: ["floorplan", "floor plan", "measure", "measurement", "area"]
    },
    care: {
      key: "service_care",
      label: "Floor care",
      summary: "Floor care guidance should stay practical: cleaning, maintenance, scratches, water awareness, and when damage needs review.",
      route: { label: "Read care guide", href: "floor-care-maintenance.html" },
      terms: ["maintenance", "clean", "cleaning", "care", "scratch", "damage"]
    }
  };

  const SUBURB_PAGES = {
    parramatta: {
      key: "suburb_parramatta",
      label: "Parramatta",
      summary: "Parramatta projects often need clear parking, building type, and product selection details.",
      route: { label: "Parramatta flooring", href: "parramatta-flooring.html" },
      terms: ["parramatta"]
    },
    auburn: {
      key: "suburb_auburn",
      label: "Auburn",
      summary: "Auburn jobs can involve apartments, older units, parking, and practical product choice.",
      route: { label: "Auburn flooring", href: "auburn-flooring.html" },
      terms: ["auburn"]
    },
    liverpool: {
      key: "suburb_liverpool",
      label: "Liverpool",
      summary: "Liverpool projects may need staged planning, parking, and a clear product direction.",
      route: { label: "Liverpool flooring", href: "liverpool-flooring.html" },
      terms: ["liverpool"]
    },
    blacktown: {
      key: "suburb_blacktown",
      label: "Blacktown",
      summary: "Blacktown projects often include larger family layouts, staged renovation plans, and site checks.",
      route: { label: "Blacktown flooring", href: "blacktown-flooring.html" },
      terms: ["blacktown"]
    },
    miranda: {
      key: "suburb_miranda",
      label: "Miranda",
      summary: "Miranda projects can include family homes, apartments, moisture awareness, and premium product review.",
      route: { label: "Miranda flooring", href: "miranda-flooring.html" },
      terms: ["miranda"]
    },
    cabramatta: {
      key: "suburb_cabramatta",
      label: "Cabramatta",
      summary: "Cabramatta projects should keep product direction, area, and site scope clear before quote confirmation.",
      route: { label: "Cabramatta flooring", href: "flooring-cabramatta.html" },
      terms: ["cabramatta"]
    },
    easternSuburbs: {
      key: "suburb_eastern_suburbs",
      label: "Eastern Suburbs",
      summary: "Eastern Suburbs projects often benefit from early strata, parking, and finish-level checks.",
      route: { label: "Eastern Suburbs flooring", href: "flooring-eastern-suburbs.html" },
      terms: ["eastern suburbs", "bondi", "randwick", "paddington", "waverley"]
    }
  };

  const BLOG_GUIDES = {
    measureArea: {
      key: "blog_measure_area",
      label: "Measuring floor area",
      summary: "If area is unclear, use a rough total, room-by-room entry, or the floor plan path before review.",
      route: { label: "Measure area", href: "floorplan.html" },
      terms: ["measure area", "unknown area", "don't know area", "floor area"]
    },
    floorPrep: {
      key: "blog_floor_preparation",
      label: "Floor preparation",
      summary: "Uneven floors, old adhesive, moisture concerns, or movement should be flagged for review before final confirmation.",
      route: { label: "Review scope", href: "quote-review.html" },
      terms: ["floor preparation", "floor prep", "uneven", "level", "levelling", "subfloor"]
    },
    hybridProblems: {
      key: "blog_hybrid_problems",
      label: "Hybrid flooring problems",
      summary: "Lifting, gaps, movement, and wear usually need a scope check before deciding whether repair or replacement is better.",
      route: { label: "Review scope", href: "quote-review.html" },
      terms: ["hybrid problem", "lifting", "gaps", "movement", "wear"]
    },
    laminateHybrid: {
      key: "blog_laminate_hybrid",
      label: "Laminate vs hybrid",
      summary: "Laminate suits simpler dry rooms. Hybrid is the stronger path when water resistance and durability matter.",
      route: { label: "Browse products", href: "products.html" },
      terms: ["laminate vs hybrid", "hybrid vs laminate"]
    },
    timberLaminate: {
      key: "blog_timber_laminate",
      label: "Engineered timber vs laminate",
      summary: "Engineered timber is more finish-led. Laminate is more practical for simple dry-area projects.",
      route: { label: "Browse products", href: "products.html" },
      terms: ["engineered timber vs laminate", "engineered vs laminate"]
    },
    maintenance: {
      key: "blog_maintenance",
      label: "Maintenance checklist",
      summary: "Maintenance advice should stay practical: clean regularly, avoid harsh moisture, protect from scratches, and review damage early.",
      route: { label: "Read care guide", href: "floor-care-maintenance.html" },
      terms: ["maintenance checklist", "how to clean", "clean hybrid", "clean laminate"]
    },
    waterDamage: {
      key: "blog_water_damage",
      label: "Water damage and swelling",
      summary: "Water damage, swelling, cupping, or soft boards should be reviewed before choosing repair or replacement. Product type and subfloor condition matter more than a quick surface guess.",
      route: { label: "Review scope", href: "quote-review.html" },
      terms: ["water damage", "swelling", "swollen", "cupping", "soft boards", "wet floor"]
    },
    pets: {
      key: "blog_pet_flooring",
      label: "Flooring for pets",
      summary: "For pets, start with scratch awareness, water resistance, easy cleaning, and product suitability. Hybrid is often the practical category to compare first.",
      route: { label: "Browse products", href: "products.html" },
      terms: ["pets", "dog", "dogs", "cat", "cats", "pet friendly", "scratch resistant"]
    },
    gapsMovement: {
      key: "blog_gaps_movement",
      label: "Gaps, lifting and movement",
      summary: "Gaps, lifting, peaking, or movement usually point to installation conditions, expansion, subfloor, moisture, or product suitability. Treat it as a scope review before deciding repair versus replacement.",
      route: { label: "Review scope", href: "quote-review.html" },
      terms: ["gaps", "lifting", "peaking", "buckling", "movement", "floor moving", "expansion"]
    }
  };

  const APPROVED_RULES = {
    do: [
      "Guide product suitability at category level.",
      "Explain quote scope and missing information.",
      "Route customers to products, quote, floor plan, or quote review.",
      "Build confidence through clarity and professional installation language."
    ],
    dont: [
      "Do not display prices, totals, rates, discounts, formulas, or internal pricing logic.",
      "Do not calculate estimates inside the chatbot.",
      "Do not claim Operon is cheaper than competitors.",
      "Do not update forms, product selection, localStorage, lead capture, or quote submission."
    ]
  };

  function normalise(value) {
    return String(value || "").toLowerCase();
  }

  function values(collection) {
    return Object.keys(collection).map(function (key) {
      return collection[key];
    });
  }

  function termMatches(text, entry) {
    const terms = Array.isArray(entry.terms) ? entry.terms : [];
    return terms.some(function (term) {
      return text.indexOf(term) >= 0;
    });
  }

  function allEntries() {
    return values(PRODUCT_RANGES)
      .concat(values(PRODUCT_SUMMARIES))
      .concat([QUOTE_FLOW])
      .concat(values(QUOTE_SCOPE))
      .concat(values(SERVICE_PAGES))
      .concat(values(SUBURB_PAGES))
      .concat(values(BLOG_GUIDES));
  }

  function findEntry(text) {
    const value = normalise(text);
    if (!value) {
      return null;
    }

    const entries = allEntries();
    let bestEntry = null;
    let bestScore = 0;
    let index = 0;
    for (; index < entries.length; index += 1) {
      const entry = entries[index];
      const terms = Array.isArray(entry.terms) ? entry.terms : [];
      const matchedTerms = terms.filter(function (term) {
        return value.indexOf(term) >= 0;
      });
      if (matchedTerms.length) {
        const score = matchedTerms.reduce(function (total, term) {
          return total + term.length;
        }, 0);
        if (score > bestScore) {
          bestEntry = entry;
          bestScore = score;
        }
      }
    }
    return bestEntry;
  }

  function toAnswer(entry) {
    if (!entry) {
      return null;
    }

    const isProduct = entry.key.indexOf("product_") === 0 || entry.key.indexOf("range_") === 0;
    const isScope = entry.key.indexOf("scope_") === 0;

    return {
      key: entry.key,
      intent: isProduct ? "product_guidance" : isScope ? "scope_validation" : "route_next_step",
      answer: entry.label + ": " + entry.summary,
      insight: entry.suitability || "Keep the scope clear before the final quote is confirmed.",
      nextStep: entry.route && entry.route.label ? entry.route.label + "." : "Choose the next step.",
      route: entry.route || { label: "Start quote", href: "quote.html" }
    };
  }

  function findApprovedAnswer(text) {
    return toAnswer(findEntry(text));
  }

  window.OperonChatbotKnowledgeIndex = {
    productSummaries: PRODUCT_SUMMARIES,
    productRanges: PRODUCT_RANGES,
    quoteFlow: QUOTE_FLOW,
    quoteScope: QUOTE_SCOPE,
    servicePages: SERVICE_PAGES,
    suburbPages: SUBURB_PAGES,
    blogGuides: BLOG_GUIDES,
    approvedRules: APPROVED_RULES,
    allEntries: allEntries,
    findEntry: findEntry,
    findApprovedAnswer: findApprovedAnswer
  };
}());
