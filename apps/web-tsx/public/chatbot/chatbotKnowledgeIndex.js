(function () {
  const PRODUCT_SUMMARIES = {
    hybrid: {
      key: "product_hybrid",
      label: "Hybrid flooring",
      summary: "Hybrid is a practical starting point for busy homes, apartments, kitchens, pets, and everyday water resistance. The hybrid page shows a curated range preview; the full catalogue stays on the products page.",
      suitability: "Good when durability, easy maintenance, and a simple quote path matter. Final project details are reviewed before booking.",
      route: { label: "Browse hybrid", href: "/hybrid-flooring-sydney.html" },
      terms: ["hybrid", "waterproof", "water resistant", "pets", "busy home", "7mm", "8mm", "9mm", "etf", "hybrid range preview"]
    },
    laminate: {
      key: "product_laminate",
      label: "Laminate flooring",
      summary: "Laminate suits simpler dry areas where the project needs a straightforward floating-floor path. Water-resistant laminate ranges can be previewed by colour before starting the quote.",
      suitability: "Good for bedrooms, living spaces, and practical renovations where water exposure is not the main concern.",
      route: { label: "Browse laminate", href: "/laminate-flooring-sydney.html" },
      terms: ["laminate", "dry area", "simple floor", "12mm", "ac4", "water resistant laminate"]
    },
    engineered: {
      key: "product_engineered",
      label: "Engineered timber",
      summary: "Engineered timber suits finish-led projects where timber look, colour, range, and installation method matter. The engineered page previews selected premium directions before the customer starts a quote.",
      suitability: "Good for premium renovations, herringbone projects, and feature areas that need clearer review before final confirmation.",
      route: { label: "Browse engineered", href: "/engineered-timber-flooring-sydney.html" },
      terms: ["engineered", "timber", "herringbone", "heringbone", "chevron", "premium finish", "swish oak", "natura", "engineered range preview"]
    }
  };

  const PRODUCT_RANGES = {
    hybridEtf: {
      key: "range_hybrid_etf",
      label: "ETF hybrid ranges",
      summary: "ETF hybrid is shown as separate 7.0mm, 8.0mm, and 9.0mm ranges. Colours can be previewed from the product page, while the quote keeps the selected range as the main starting point.",
      suitability: "Good when the customer wants a practical waterproof-core product path and can confirm colour later.",
      route: { label: "Browse hybrid ranges", href: "/products.html" },
      terms: ["etf hybrid", "etf 7", "etf 8", "etf 9", "hybrid 7.0", "hybrid 8.0", "hybrid 9.0"]
    },
    hybridGrande: {
      key: "range_hybrid_grande",
      label: "Grande 9.0 Hybrid Flooring",
      summary: "Grande 9.0 is one of the curated hybrid preview ranges for family living spaces and low-maintenance renovations.",
      suitability: "Good when the customer wants a thicker hybrid shortlist before starting the quote.",
      route: { label: "Preview hybrid ranges", href: "/hybrid-flooring-sydney.html" },
      terms: ["grande hybrid", "grande 9", "grande 9.0", "eco grande", "bella hybrid"]
    },
    hybridLumiere: {
      key: "range_hybrid_lumiere",
      label: "Lumiere Ultra HD Hybrid Plank",
      summary: "Lumiere Ultra HD is a curated hybrid preview range for a more refined timber-look hybrid direction.",
      suitability: "Good for customers comparing a premium timber-look hybrid before using the quote.",
      route: { label: "Preview hybrid ranges", href: "/hybrid-flooring-sydney.html" },
      terms: ["lumiere", "lumiere ultra", "lumiere ultra hd", "bellevue avenue"]
    },
    hybridStorm: {
      key: "range_hybrid_storm",
      label: "Storm Luxury Hybrid Plank",
      summary: "Storm Luxury Hybrid Plank is a curated hybrid preview range for durable everyday rooms with a cleaner timber-look finish.",
      suitability: "Good for busy homes where the customer wants a strong hybrid shortlist.",
      route: { label: "Preview hybrid ranges", href: "/hybrid-flooring-sydney.html" },
      terms: ["storm hybrid", "storm luxury", "storm luxury hybrid", "royal white oak"]
    },
    laminateWaterResistant: {
      key: "range_laminate_water_resistant",
      label: "12mm water-resistant laminate",
      summary: "The 12mm water-resistant AC4 laminate range is a practical laminate path for customers who want a straightforward floating-floor option with colour previews.",
      suitability: "Good for dry interior spaces where laminate is suitable and the customer wants a clean range-first selection.",
      route: { label: "Browse laminate", href: "/products.html" },
      terms: ["12mm water resistant", "ac4 laminate", "water resistant ac4", "laminate range"]
    },
    laminateSwishAqua: {
      key: "range_laminate_swish_aqua",
      label: "Swish Laminate Aqua",
      summary: "Swish Laminate Aqua is a curated laminate preview range for practical dry-area renovations where water-resistant laminate is preferred.",
      suitability: "Good for bedrooms and living areas that need a neat laminate shortlist.",
      route: { label: "Preview laminate ranges", href: "/laminate-flooring-sydney.html" },
      terms: ["swish laminate aqua", "laminate aqua", "blackbutt aqua"]
    },
    laminateSwish: {
      key: "range_laminate_swish",
      label: "Swish Laminate",
      summary: "Swish Laminate is a curated laminate preview range for straightforward dry internal spaces.",
      suitability: "Good for rentals, bedrooms, and practical everyday upgrades.",
      route: { label: "Preview laminate ranges", href: "/laminate-flooring-sydney.html" },
      terms: ["swish laminate", "oak step", "spotted gum laminate", "practical laminate"]
    },
    laminateVilleroyHeritage: {
      key: "range_laminate_villeroy_heritage",
      label: "Villeroy & Boch Heritage Laminate",
      summary: "Villeroy & Boch Heritage Laminate is a curated laminate preview range for a more classic timber-look direction.",
      suitability: "Good for customers who want laminate with a more refined heritage look.",
      route: { label: "Preview laminate ranges", href: "/laminate-flooring-sydney.html" },
      terms: ["villeroy heritage", "villeroy boch heritage", "heritage laminate", "travertin oak"]
    },
    laminateVilleroyContemporary: {
      key: "range_laminate_villeroy_contemporary",
      label: "Villeroy & Boch Contemporary Laminate",
      summary: "Villeroy & Boch Contemporary Laminate is a curated laminate preview range for a cleaner modern timber-look finish.",
      suitability: "Good for customers comparing a contemporary laminate shortlist.",
      route: { label: "Preview laminate ranges", href: "/laminate-flooring-sydney.html" },
      terms: ["villeroy contemporary", "villeroy boch contemporary", "contemporary laminate", "current oak"]
    },
    engineeredWideboard: {
      key: "range_engineered_wideboard",
      label: "Swish Oak Wideboard",
      summary: "Swish Oak Wideboard is a curated engineered timber preview range for wider-board premium timber projects.",
      suitability: "Good for feature living spaces and higher-end renovations where board width matters.",
      route: { label: "Preview engineered ranges", href: "/engineered-timber-flooring-sydney.html" },
      terms: ["swish oak wideboard", "wideboard engineered", "wide board engineered", "urban antique oak"]
    },
    engineeredContemporary: {
      key: "range_engineered_contemporary",
      label: "Swish Oak Contemporary",
      summary: "Swish Oak Contemporary is a curated engineered timber preview range for a clean modern timber finish.",
      suitability: "Good for premium homes where the customer wants a refined engineered timber shortlist.",
      route: { label: "Preview engineered ranges", href: "/engineered-timber-flooring-sydney.html" },
      terms: ["swish oak contemporary", "contemporary engineered", "elegant natural oak"]
    },
    swishOakNatura: {
      key: "range_swish_oak_natura",
      label: "Swish Oak Natura Handcrafted",
      summary: "Swish Oak Natura Handcrafted is a curated engineered timber preview range with a more textured timber character.",
      suitability: "Good for premium engineered timber projects where timber character and finish quality matter.",
      route: { label: "Preview engineered ranges", href: "/engineered-timber-flooring-sydney.html" },
      terms: ["swish oak natura", "swish oak natura handcrafted", "natura handcrafted", "natural canvas", "ambient sand", "belfort oak", "french natural", "french carbon", "engineered range"]
    },
    engineeredCastelNuovo: {
      key: "range_engineered_castel_nuovo",
      label: "Castel Nuovo Herringbone",
      summary: "Castel Nuovo Herringbone is a curated engineered timber preview range for a premium patterned floor.",
      suitability: "Good for feature spaces where the customer wants herringbone visual impact.",
      route: { label: "Preview engineered ranges", href: "/engineered-timber-flooring-sydney.html" },
      terms: ["castel nuovo", "castel nuovo herringbone", "panania oak herringbone", "herringbone preview"]
    },
    engineeredCavalloBianco: {
      key: "range_engineered_cavallo_bianco",
      label: "Cavallo Bianco Chevron",
      summary: "Cavallo Bianco Chevron is a curated engineered timber preview range for a clean chevron pattern.",
      suitability: "Good for design-led projects where pattern detail is part of the finish.",
      route: { label: "Preview engineered ranges", href: "/engineered-timber-flooring-sydney.html" },
      terms: ["cavallo bianco", "cavallo bianco chevron", "chevron engineered", "amaretti oak"]
    },
    swishOakHerringbone: {
      key: "range_swish_oak_herringbone",
      label: "Swish Oak Natura Herringbone",
      summary: "Swish Oak Natura Herringbone is an engineered herringbone range. It should be treated as a premium pattern project, with colour, method, stairs, and site scope confirmed before final booking.",
      suitability: "Good for feature spaces and design-led projects where pattern installation needs careful review.",
      route: { label: "Browse engineered", href: "/products.html" },
      terms: ["swish oak herringbone", "swish oak natura herringbone", "herringbone engineered", "heringbone", "fiano brown herringbone", "french ghost herringbone"]
    }
  };

  const QUOTE_FLOW = {
    key: "quote_flow",
    label: "Quote flow",
    summary: "The customer quote path is a six-step guided flow: Property, Flooring/product, Area, Stairs, Extras, then Summary/review. The online result is a starting estimate before Operon reviews the scope.",
    steps: ["property", "flooring_product", "area", "stairs", "extras", "summary_review"],
    route: { label: "Start quote", href: "/quote.html" },
    terms: ["quote flow", "how quote works", "quote process", "property", "flooring product", "flooring and product", "area", "stairs", "extras", "summary review", "not sure", "estimate", "submit", "email copy", "email me a copy", "quote submitted"]
  };

  const QUOTE_SCOPE = {
    removal: {
      key: "scope_removal_disposal",
      label: "Removal and disposal",
      summary: "Existing floor to remove should be one clear choice such as carpet, floating floor, glue-down timber, tile, vinyl, not sure, or other. Disposal or take-away should be confirmed separately when removal is included.",
      route: { label: "Start quote", href: "/quote.html" },
      terms: ["removal", "dispose", "disposal", "take away", "existing floor", "carpet removal", "tile removal", "floating floor removal"]
    },
    quoteReview: {
      key: "scope_quote_review",
      label: "Quote review",
      summary: "Quote review should explain quote readiness first: Not ready to compare, Partly clear - confirm missing items, or Clear enough to compare. Quick quote completeness uses only customer-entered details; document-based quote review is stronger when the written quote is uploaded.",
      route: { label: "Upload written quote", href: "/quote-review.html" },
      terms: ["quote review", "review my quote", "scope check", "quick check", "quick completeness", "document review", "upload quote", "existing quote", "quote readiness", "not ready to compare", "partly clear", "clear enough to compare", "top 3 items"]
    },
    floorplan: {
      key: "scope_floorplan_measurement",
      label: "Floor plan measurement",
      summary: "If the customer already has a floor plan, they can use the measurement tool for area support before quote review.",
      route: { label: "Measure from floor plan", href: "/floorplan.html" },
      terms: ["floorplan", "floor plan", "do not know area", "don't know area", "unknown area", "measure"]
    },
    underlay: {
      key: "scope_underlay_acoustic",
      label: "Underlay and acoustic layer",
      summary: "Underlay or acoustic layer should be confirmed when the building, product, or strata requirements depend on it. Current options include Standard silver underlay, Premium acoustic underlay, Acoustic Rubber Underlay 5mm, and Acoustic Rubber Underlay 5mm glued down where relevant.",
      route: { label: "Review quote scope", href: "/quote-review.html" },
      terms: ["underlay", "acoustic", "sound rating", "strata acoustic", "soundproof", "noise", "apartment acoustic", "standard silver underlay", "premium acoustic underlay", "rubber underlay", "acoustic rubber underlay"]
    },
    floorPrep: {
      key: "scope_floor_preparation",
      label: "Floor preparation",
      summary: "Floor preparation should be checked when the floor is uneven, has old adhesive, moisture concern, movement, or tile removal. This is one of the common reasons final scope changes after review.",
      route: { label: "Review quote scope", href: "/quote-review.html" },
      terms: ["floor preparation", "floor prep", "subfloor", "uneven", "levelling", "leveling", "old adhesive", "not flat", "dips"]
    },
    trims: {
      key: "scope_trims_finishing",
      label: "Trims, scotia and skirting",
      summary: "Finishing should say whether trims, scotia, skirting, transition strips, door trimming, or stair nosing are included. If the customer is not sure, treat it as needs confirmation rather than a confirmed no.",
      route: { label: "Review quote scope", href: "/quote-review.html" },
      terms: ["trim", "trims", "scotia", "skirting", "transition", "door trim", "door trimming", "door trimming not sure", "stair nosing", "nosing", "edge trim"]
    },
    furniture: {
      key: "scope_furniture_moving",
      label: "Furniture moving",
      summary: "Furniture moving should be written as included, not included, or needs confirmation. If the customer is not sure, it should stay as a review item rather than silently becoming excluded.",
      route: { label: "Start quote", href: "/quote.html" },
      terms: ["furniture", "furniture moving", "move furniture", "furnished rooms", "furniture not sure", "furniture unsure"]
    },
    uncertainExtras: {
      key: "scope_uncertain_extras",
      label: "Uncertain extras",
      summary: "Not sure answers for removal, disposal, preparation, underlay, skirting or scotia, door trimming, furniture, stairs, or site details should be treated as needs confirmation before final confirmation.",
      route: { label: "Start quote", href: "/quote.html" },
      terms: ["not sure", "unsure extras", "needs confirmation", "review note", "review notes", "why not included", "selected not sure"]
    },
    stairs: {
      key: "scope_stairs",
      label: "Stairs",
      summary: "Stairs should be treated as a separate scope check. Step type, width, nosing, landing, open sides, product type, and site details should be reviewed before final confirmation.",
      route: { label: "Review quote scope", href: "/quote-review.html" },
      terms: ["stairs", "staircase", "steps", "landing", "triangle step", "winder", "open side", "stair nosing"]
    },
    access: {
      key: "scope_access_site_details",
      label: "Site details",
      summary: "Site details should capture apartment level, lift, parking, loading, stairs, occupied rooms, and strata rules where relevant. These details help avoid comparing quotes that describe different jobs.",
      route: { label: "Start quote", href: "/quote.html" },
      terms: ["access", "parking", "lift", "elevator", "loading", "level", "strata", "apartment access", "site details"]
    },
    moisture: {
      key: "scope_moisture_concrete",
      label: "Moisture and concrete floors",
      summary: "Concrete floors may need moisture awareness before final confirmation. The quote should note moisture protection where the site or product path makes it relevant.",
      route: { label: "Review quote scope", href: "/quote-review.html" },
      terms: ["moisture", "concrete", "moisture barrier", "damp", "slab", "vapour", "vapor"]
    },
    warrantyExclusions: {
      key: "scope_warranty_exclusions",
      label: "Warranty and exclusions",
      summary: "Warranty, exclusions, product details, and variation conditions should be written clearly. If they are not listed, ask for confirmation before comparing by total price.",
      route: { label: "Review quote scope", href: "/quote-review.html" },
      terms: ["warranty", "warranties", "exclusion", "exclusions", "variation", "variations", "quote validity", "payment terms"]
    },
    quoteComparison: {
      key: "scope_quote_comparison",
      label: "Comparing flooring quotes",
      summary: "Compare flooring quotes by scope first. Product, area, underlay, removal, disposal, prep, trims, stairs, site details, warranty, and exclusions should be clear before total price carries much meaning.",
      route: { label: "Review quote", href: "/quote-review.html" },
      terms: ["compare quotes", "compare flooring quotes", "quote comparison", "fair quote", "is this quote fair", "is my quote fair"]
    }
  };

  const SERVICE_PAGES = {
    installGuide: {
      key: "service_install_guide",
      label: "Installation guide",
      summary: "Installation guidance should focus on area, flooring choice, main inclusions, finishing details, and final scope review.",
      route: { label: "Read install guide", href: "/flooring-installation-cost-sydney.html" },
      terms: ["installation guide", "installation", "flooring installation", "install flooring"]
    },
    floorplan: {
      key: "service_floorplan",
      label: "Floor plan measurement",
      summary: "Floor plan measurement helps when the customer does not know the area yet. It supports area clarity before quote review.",
      route: { label: "Measure area", href: "/floorplan.html" },
      terms: ["floorplan", "floor plan", "measure", "measurement", "area"]
    },
    care: {
      key: "service_care",
      label: "Floor care",
      summary: "Floor care guidance should stay practical: cleaning, maintenance, scratches, water awareness, and when damage needs review.",
      route: { label: "Read care guide", href: "/floor-care-maintenance.html" },
      terms: ["maintenance", "clean", "cleaning", "care", "scratch", "damage"]
    }
  };

  const SUBURB_PAGES = {
    parramatta: {
      key: "suburb_parramatta",
      label: "Parramatta",
      summary: "Parramatta projects often need clear parking, building type, and product selection details.",
      route: { label: "Parramatta flooring", href: "/flooring-parramatta.html" },
      terms: ["parramatta"]
    },
    auburn: {
      key: "suburb_auburn",
      label: "Auburn",
      summary: "Auburn jobs can involve apartments, older units, parking, and practical product choice.",
      route: { label: "Auburn flooring", href: "/flooring-auburn.html" },
      terms: ["auburn"]
    },
    liverpool: {
      key: "suburb_liverpool",
      label: "Liverpool",
      summary: "Liverpool projects may need staged planning, clear product choice, and final project detail review.",
      route: { label: "Liverpool flooring", href: "/flooring-liverpool.html" },
      terms: ["liverpool"]
    },
    blacktown: {
      key: "suburb_blacktown",
      label: "Blacktown",
      summary: "Blacktown projects often include larger family layouts, staged renovation plans, and site checks.",
      route: { label: "Blacktown flooring", href: "/flooring-blacktown.html" },
      terms: ["blacktown"]
    },
    miranda: {
      key: "suburb_miranda",
      label: "Miranda",
      summary: "Miranda projects can include family homes, apartments, moisture awareness, and premium product review.",
      route: { label: "Miranda flooring", href: "/flooring-miranda.html" },
      terms: ["miranda"]
    },
    cabramatta: {
      key: "suburb_cabramatta",
      label: "Cabramatta",
      summary: "Cabramatta projects should keep flooring choice, area, and main project details clear before quote confirmation.",
      route: { label: "Cabramatta flooring", href: "/flooring-cabramatta.html" },
      terms: ["cabramatta"]
    },
    easternSuburbs: {
      key: "suburb_eastern_suburbs",
      label: "Eastern Suburbs",
      summary: "Eastern Suburbs projects often benefit from early strata, parking, and finish-level checks.",
      route: { label: "Randwick flooring", href: "/flooring-randwick.html" },
      terms: ["eastern suburbs", "bondi", "paddington", "waverley"]
    },
    randwick: {
      key: "suburb_randwick",
      label: "Randwick",
      summary: "Randwick flooring quote support is framed around apartments, units, family homes, and renovation work. The page now guides product direction, area basis, main inclusions, floor plan upload, quote review, and nearby Coogee/Woollahra links without claiming unconfirmed Randwick project proof.",
      route: { label: "Flooring Randwick", href: "/flooring-randwick.html" },
      terms: ["randwick", "randwick flooring", "flooring randwick", "randwick apartment", "randwick apartments", "randwick unit", "randwick quote", "flooring-randwick"]
    }
  };

  const BLOG_GUIDES = {
    measureArea: {
      key: "blog_measure_area",
      label: "Measuring floor area",
      summary: "If area is unclear, use a rough total, room-by-room entry, or the floor plan path before review.",
      route: { label: "Measure area", href: "/floorplan.html" },
      terms: ["measure area", "unknown area", "don't know area", "floor area"]
    },
    floorPrep: {
      key: "blog_floor_preparation",
      label: "Floor preparation",
      summary: "Uneven floors, old adhesive, moisture concerns, or movement should be flagged for review before final confirmation.",
      route: { label: "Review scope", href: "/quote-review.html" },
      terms: ["floor preparation", "floor prep", "uneven", "level", "levelling", "subfloor"]
    },
    hybridProblems: {
      key: "blog_hybrid_problems",
      label: "Hybrid flooring problems",
      summary: "Lifting, gaps, movement, and wear usually need a scope check before deciding whether repair or replacement is better.",
      route: { label: "Review scope", href: "/quote-review.html" },
      terms: ["hybrid problem", "lifting", "gaps", "movement", "wear"]
    },
    laminateHybrid: {
      key: "blog_laminate_hybrid",
      label: "Laminate vs hybrid",
      summary: "Laminate suits simpler dry rooms. Hybrid is the stronger path when water resistance and durability matter.",
      route: { label: "Browse products", href: "/products.html" },
      terms: ["laminate vs hybrid", "hybrid vs laminate"]
    },
    timberLaminate: {
      key: "blog_timber_laminate",
      label: "Engineered timber vs laminate",
      summary: "Engineered timber is more finish-led. Laminate is more practical for simple dry-area projects.",
      route: { label: "Browse products", href: "/products.html" },
      terms: ["engineered timber vs laminate", "engineered vs laminate"]
    },
    maintenance: {
      key: "blog_maintenance",
      label: "Maintenance checklist",
      summary: "Maintenance advice should stay practical: clean regularly, avoid harsh moisture, protect from scratches, and review damage early.",
      route: { label: "Read care guide", href: "/floor-care-maintenance.html" },
      terms: ["maintenance checklist", "how to clean", "clean hybrid", "clean laminate"]
    },
    waterDamage: {
      key: "blog_water_damage",
      label: "Water damage and swelling",
      summary: "Water damage, swelling, cupping, or soft boards should be reviewed before choosing repair or replacement. Product type and subfloor condition matter more than a quick surface guess.",
      route: { label: "Review scope", href: "/quote-review.html" },
      terms: ["water damage", "swelling", "swollen", "cupping", "soft boards", "wet floor"]
    },
    pets: {
      key: "blog_pet_flooring",
      label: "Flooring for pets",
      summary: "For pets, start with scratch awareness, water resistance, easy cleaning, and product suitability. Hybrid is often the practical category to compare first.",
      route: { label: "Browse products", href: "/products.html" },
      terms: ["pets", "dog", "dogs", "cat", "cats", "pet friendly", "scratch resistant"]
    },
    gapsMovement: {
      key: "blog_gaps_movement",
      label: "Gaps, lifting and movement",
      summary: "Gaps, lifting, peaking, or movement usually point to installation conditions, expansion, subfloor, moisture, or product suitability. Treat it as a scope review before deciding repair versus replacement.",
      route: { label: "Review scope", href: "/quote-review.html" },
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
      route: entry.route || { label: "Start quote", href: "/quote.html" }
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
