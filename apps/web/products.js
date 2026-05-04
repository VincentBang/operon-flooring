(function () {
  const STORAGE_KEY = "operon_selected_product";
  const STORAGE_ID_KEY = "operon_selected_product_id";
  const CATEGORY_STORAGE_KEY = "operon_selected_product_category";
  const RANGE_STORAGE_KEY = "operon_selected_range_id";
  const COLOUR_STORAGE_KEY = "operon_selected_colour";
  const SELECTION_MODE_STORAGE_KEY = "operon_selected_product_selection_mode";
  const ETF_HYBRID_RANGE_DESCRIPTION = [
    "ETF Hybrid Flooring is a premium SPC hybrid range designed for Sydney and NSW homes that want the look of timber with the practicality of a modern waterproof floor.",
    "Hybrid SPC flooring blends the best of laminate and vinyl flooring into a next-generation, multi-layered floating floor system. It is built to handle moisture, heat, and daily wear while staying suitable for most rooms in the house, including kitchens.",
    "This range is made for busy households that want a cost-effective flooring solution with realistic timber visuals, a stable rigid core, and a cleaner installation path."
  ];
  const ETF_HYBRID_RANGE_FEATURES = [
    "100% waterproof performance for bedrooms, living spaces, and kitchens.",
    "Highly resilient against scratches, dents, stains, and everyday family traffic.",
    "Rigid SPC core for dimensional stability and dependable floating-floor performance.",
    "Pre-attached acoustic underlay for softer underfoot comfort and reduced noise.",
    "DIY-friendly click-lock installation with no glue or nails required."
  ];
  const ETF_LAMINATE_RANGE_DESCRIPTION = [
    "ETF Laminate Flooring gives Sydney and NSW projects the look of real timber without the higher maintenance or cost that comes with traditional hardwood.",
    "Laminate flooring uses a stable HDF core with a photographic decorative layer and a tough UV-protected wear surface, creating a durable floor that works well in modern homes.",
    "This 1.2 metre laminate range is built for practical renovations that need strong scratch resistance, straightforward floating-floor installation, and easy day-to-day care."
  ];
  const ETF_LAMINATE_RANGE_FEATURES = [
    "Timber-look finish at a more budget-friendly price point.",
    "Scratch-resistant and fade-resistant surface for busy households.",
    "UV-protected wear layer to help maintain colour in bright interiors.",
    "Click-lock floating floor installation for faster and cleaner installs.",
    "Low-maintenance laminate construction with a stable HDF core."
  ];

  function createEtfHybridRangeContent(technical) {
    return {
      description: ETF_HYBRID_RANGE_DESCRIPTION.slice(),
      featuresIntro: "Why homeowners love ETF Hybrid SPC flooring",
      features: ETF_HYBRID_RANGE_FEATURES.slice(),
      technical: technical.slice()
    };
  }

  function createEtfLaminateRangeContent() {
    return {
      description: ETF_LAMINATE_RANGE_DESCRIPTION.slice(),
      featuresIntro: "Why homeowners choose ETF Laminate flooring",
      features: ETF_LAMINATE_RANGE_FEATURES.slice(),
      technical: [
        { label: "Brand", value: "ETF Flooring" },
        { label: "Total Thickness", value: "12.3 mm" },
        { label: "Board Size", value: "1215mm x 196mm" },
        { label: "Water Resistance", value: "24 Hours Water Resistant" },
        { label: "Wear Resistance", value: "AC4 Heavy Residential" },
        { label: "Range Format", value: "1.2 meter laminate" },
        { label: "Warranty", value: "25 Year Residential Wear Warranty" },
        { label: "Core", value: "HDF core construction" },
        { label: "Installation", value: "Floating click-lock system" }
      ]
    };
  }

  const RANGE_CONFIG = {
    hybrid: {
      "ETF Hybrid 7.0mm": {
        rangeId: "hybrid-etf-7mm",
        rangeLabel: "ETF 7.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-7mm-hybrid-antique-oak",
        isDefaultRecommendation: true,
        customerLabel: "ETF 7.0mm Waterproof Hybrid Flooring",
        rangeContent: createEtfHybridRangeContent([
          { label: "Brand", value: "ETF Flooring" },
          { label: "Total Thickness", value: "7.0 mm with Underlay" },
          { label: "Board Size", value: "1500 mm x 228 mm" },
          { label: "Material", value: "Hybrid SPC (Solid Polymer Core)" },
          { label: "Wear Layer", value: "0.3 mm Melamine Layer" },
          { label: "Warranty", value: "25 Year Hybrid Limited Warranty" },
          { label: "Installation", value: "Floating click-lock system" },
          { label: "Colour Range", value: "15 colours available" }
        ])
      },
      "ETF Hybrid 8.0mm": {
        rangeId: "hybrid-etf-8mm",
        rangeLabel: "ETF 8.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-8mm-hybrid-alaskan-oak",
        customerLabel: "ETF 8.0mm Waterproof Hybrid Flooring",
        rangeContent: createEtfHybridRangeContent([
          { label: "Brand", value: "ETF Flooring" },
          { label: "Total Thickness", value: "8.0 mm with Underlay" },
          { label: "Board Size", value: "1810 mm x 228 mm" },
          { label: "Material", value: "Hybrid SPC (Solid Polymer Core)" },
          { label: "Wear Layer", value: "0.3 mm Melamine Layer" },
          { label: "Warranty", value: "25 Year Hybrid Limited Warranty" },
          { label: "Installation", value: "Floating click-lock system" },
          { label: "Colour Range", value: "12 colours available" }
        ])
      },
      "ETF Hybrid 9.0mm": {
        rangeId: "hybrid-etf-9mm",
        rangeLabel: "ETF 9.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-9mm-hybrid-alaskan-oak",
        customerLabel: "ETF 9.0mm Waterproof Hybrid Flooring",
        rangeContent: createEtfHybridRangeContent([
          { label: "Brand", value: "ETF Flooring" },
          { label: "Total Thickness", value: "9.0 mm with Underlay" },
          { label: "Board Size", value: "Refer to selected colour brochure" },
          { label: "Material", value: "Hybrid SPC (Solid Polymer Core)" },
          { label: "Wear Layer", value: "Melamine wear layer" },
          { label: "Warranty", value: "25 Year Hybrid Limited Warranty" },
          { label: "Installation", value: "Floating click-lock system" },
          { label: "Colour Range", value: "14 colours available" }
        ])
      }
    },
    laminate: {
      "12mm 24hrs Water Resistant Laminate": {
        rangeId: "laminate-12mm-24hr-water-resistant",
        rangeLabel: "ETF 12mm 24hrs Water Resistant Laminate",
        selectionMode: "range_only",
        representativeProductId: "hrt-12mm-laminate-aspen-oak",
        isDefaultRecommendation: true,
        customerLabel: "ETF 12mm 24hrs Water Resistant Laminate",
        rangeContent: createEtfLaminateRangeContent()
      }
    },
    engineered: {
      "Swish Oak Natura": {
        rangeId: "engineered-swish-oak-natura",
        rangeLabel: "Swish Oak Natura",
        selectionMode: "range_then_colour",
        representativeProductId: "eco-swish-oak-natura-ambient-sand",
        isDefaultRecommendation: true,
        customerLabel: "Swish Oak Natura",
        rangeContent: {
          description: [
            "Oak has been a traditional flooring material used for centuries throughout the world. Oak flooring is desired for its longevity lasting more than 100 years.",
            "The Swish Oak Natura Flooring range comprises of multidirectional constructed engineered boards that provide all the benefits of being structurally robust. This assembly increases the boards' resistance to expansion and contraction from changes in humidity and temperature reducing warping or cupping. Hence these engineered boards are superior to solid oak flooring in both durability and stability.",
            "Fabulous attractive wide 190mm planks create the impression of a more spacious interior, whilst adding a sophisticated, warm and inviting feel to your environment.",
            "All Swish Oak Flooring come pre-finished thus there is no messy and timely on-site sanding or staining required.",
            "The top layer, or wear layer, is composed of genuine 3mm French oak. It features a variety of captivating finishes, such as natural, brushed, hand-scraped, or stained, allowing you to choose the aesthetic that best complements your space. The natural finish brings out the inherent warmth and character of the oak, while the brushed finish provide a rustic and textured appearance.",
            "Beneath the wear layer, multiple layers of high-quality plywood are intricately bonded together. This construction creates a stable and robust foundation for the oak veneer, minimizing the expansion and contraction that can occur with solid wood flooring due to changes in humidity and temperature."
          ],
          featuresIntro: "Why choose Swish Oak?",
          features: [
            "Swish Oak flooring is a harmonious fusion of nature's elegance and modern engineering. With its exquisite appearance, durability, and versatility, it is a timeless choice that can elevate the aesthetic appeal of any interior while providing the functionality and convenience desired in today's homes and commercial spaces. Swish Oak flooring not only enhances its stability but also makes it compatible with underfloor heating systems, expanding its versatility and comfort.",
            "A grade commercial quality FSC sustainable raw materials",
            "UV Matt lacquered / Oiled coatings for tough and longer lasting finishes",
            "Ultra low VOCs that meet EO international standards for high indoor air quality",
            "ABCD Genuine French Oak",
            "Comprehensive quality control systems of 23 inspection checks for guarantee of excellence."
          ],
          technical: [
            { label: "Type", value: "Engineered Oak Floor" },
            { label: "Thickness", value: "14/3mm" },
            { label: "Width", value: "190mm" },
            { label: "Length", value: "1900mm" },
            { label: "Edging", value: "Micro-Bevelled Edge" },
            { label: "Profile", value: "Tongue & Groove" },
            { label: "Installation Method", value: "Glue down / Floating" },
            { label: "Pack Size", value: "2.90m2" },
            { label: "Pack Weight", value: "25 kg" },
            { label: "Boards Per Pack", value: "8" },
            { label: "VOC Rating", value: "E1 <5ppm" }
          ]
        }
      },
      "Swish Oak Natura Herringbone": {
        rangeId: "engineered-swish-oak-natura-herringbone",
        rangeLabel: "Swish Oak Natura Herringbone",
        selectionMode: "range_then_colour",
        representativeProductId: "eco-swish-oak-natura-herringbone-french-natural",
        customerLabel: "Swish Oak Natura Herringbone",
        rangeContent: {
          description: [
            "French Oak has been a traditional flooring material used for centuries throughout the world. Oak flooring is desired for its longevity lasting more than 100 years.",
            "The Swish Oak Flooring herringbone range comprises of multidirectional constructed engineered boards that provide all the benefits of being structurally robust. This assembly increases the boards' resistance to expansion and contraction from changes in humidity and temperature reducing warping or cupping.",
            "Fabulous attractive 888mm herringbone planks create a more detailed statement floor while still adding a sophisticated, warm and inviting feel to your environment.",
            "All Swish Oak Flooring come pre-finished thus there is no messy and timely on-site sanding or staining required."
          ],
          featuresIntro: "Why choose Swish Oak?",
          features: [
            "A grade commercial quality FSC sustainable raw materials",
            "UV Matt lacquered / Oiled coatings for tough and longer lasting finishes",
            "Ultra low VOCs that meet E1 international standards for high indoor air quality.",
            "Comprehensive quality control systems of 23 inspection checks for guarantee of excellence."
          ],
          technical: [
            { label: "Type", value: "Engineered Oak Herringbone Floor" },
            { label: "Thickness", value: "14/3mm" },
            { label: "Width", value: "148mm" },
            { label: "Length", value: "888mm" },
            { label: "Edging", value: "Micro-Bevelled Edge" },
            { label: "Profile", value: "Tongue and Groove" },
            { label: "Installation Method", value: "Glue Down" },
            { label: "Pack Size", value: "1.0514m2" },
            { label: "Pack Weight", value: "10kg" },
            { label: "Boards Per Pack", value: "8" },
            { label: "VOC Rating", value: "E1 <5ppm" }
          ]
        }
      }
    }
  };

  // Update pricePerM2 here when supplier price changes.
  // Do not hardcode product prices across multiple pages.
  // Product pages should read from this central data file.
  // If a supplier page exposes range-level Description / Features / Technical tabs,
  // store them in RANGE_CONFIG.<category>.<range>.rangeContent as structured arrays.
  // If a supplier product page exposes extra colour gallery images, save them locally
  // and attach them to the product with galleryImages so the product popup can show them.
  // TODO: Replace remaining sample catalogue rows with confirmed supplier ranges and imagery.
  const CATEGORY_META = {
    laminate: {
      id: "laminate",
      label: "Laminate Flooring",
      shortDescription: "Cost-conscious flooring with straightforward installation.",
      pricePerM2: 38,
      pageUrl: "laminate-flooring-sydney.html",
      catalogueStatus: "live_products"
    },
    hybrid: {
      id: "hybrid",
      label: "Hybrid Flooring",
      shortDescription: "Practical SPC hybrid flooring for apartments, houses, and busy family homes.",
      pricePerM2: 52,
      pageUrl: "hybrid-flooring-sydney.html",
      catalogueStatus: "live_products"
    },
    engineered: {
      id: "engineered",
      label: "Engineered Timber",
      shortDescription: "Premium timber look with a stronger material allowance.",
      pricePerM2: 88,
      pageUrl: "engineered-timber-flooring-sydney.html",
      catalogueStatus: "live_products"
    }
  };

  const PRODUCTS = {
    laminate: [
      {
        id: "hrt-12mm-laminate-aspen-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Aspen Oak",
        tone: "light oak",
        swatch: "#d7c4a2",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/aspen-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Aspen Oak board sample",
        description: "Aspen Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/aspen-oak/"
      },
      {
        id: "hrt-12mm-laminate-barnwood-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Barnwood Oak",
        tone: "mid oak",
        swatch: "#b78e67",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/barnwood-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Barnwood Oak board sample",
        description: "Barnwood Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/barnwood-brown-oak/"
      },
      {
        id: "hrt-12mm-laminate-blackbutt",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Blackbutt",
        tone: "light oak",
        swatch: "#cfb084",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/blackbutt.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Blackbutt board sample",
        description: "Blackbutt is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/blackbutt-2/"
      },
      {
        id: "hrt-12mm-laminate-brushbox",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Brushbox",
        tone: "walnut",
        swatch: "#9f7756",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/brushbox.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Brushbox board sample",
        description: "Brushbox is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/brushbox-2/"
      },
      {
        id: "hrt-12mm-laminate-citi-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Citi Oak",
        tone: "mid oak",
        swatch: "#b69270",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/citi-oak.jpg",
        alt: "12mm 24hrs Water Resistant Laminate Citi Oak board sample",
        description: "Citi Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/citi-oak/"
      },
      {
        id: "hrt-12mm-laminate-classical-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Classical Oak",
        tone: "natural oak",
        swatch: "#c1a07f",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/classical-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Classical Oak board sample",
        description: "Classical Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/classical-oak/"
      },
      {
        id: "hrt-12mm-laminate-coastal-blackbutt-1-5m",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Coastal Blackbutt 1.5m",
        tone: "light oak",
        swatch: "#d1b28d",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/coastal-blackbutt-1-5m.jpg",
        alt: "12mm 24hrs Water Resistant Laminate Coastal Blackbutt 1.5m board sample",
        description: "Coastal Blackbutt 1.5m is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/coastal-blackbutt-1-5m/"
      },
      {
        id: "hrt-12mm-laminate-cocoa-oak-matt",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Cocoa Oak (Matt)",
        tone: "dark oak",
        swatch: "#7c5d44",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/cocoa-oak-matt.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Cocoa Oak Matt board sample",
        description: "Cocoa Oak (Matt) is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/cocoa-oak-matt/"
      },
      {
        id: "hrt-12mm-laminate-cocoa-oak-semi-gloss",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Cocoa Oak (Semi-gloss)",
        tone: "dark oak",
        swatch: "#826148",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/cocoa-oak-semi-gloss.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Cocoa Oak Semi-gloss board sample",
        description: "Cocoa Oak (Semi-gloss) is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/cocoa-oak-semi-gloss/"
      },
      {
        id: "hrt-12mm-laminate-copperwood-pine-matt",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Copperwood Pine (Matt)",
        tone: "warm brown",
        swatch: "#a56d49",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/copperwood-pine-matt.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Copperwood Pine Matt board sample",
        description: "Copperwood Pine (Matt) is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/copperwood-pine-matt1/"
      },
      {
        id: "hrt-12mm-laminate-country-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Country Oak",
        tone: "natural oak",
        swatch: "#be9d74",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/country-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Country Oak board sample",
        description: "Country Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/country-oak-2/"
      },
      {
        id: "hrt-12mm-laminate-driftwood-ash",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Driftwood Ash",
        tone: "grey",
        swatch: "#aaa196",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/driftwood-ash.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Driftwood Ash board sample",
        description: "Driftwood Ash is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/driftwood-ash/"
      },
      {
        id: "hrt-12mm-laminate-earl-grey-1-5m",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Earl Grey 1.5m",
        tone: "grey",
        swatch: "#9f9892",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/earl-grey-1-5m.jpg",
        alt: "12mm 24hrs Water Resistant Laminate Earl Grey 1.5m board sample",
        description: "Earl Grey 1.5m is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/earl-grey-1-5m/"
      },
      {
        id: "hrt-12mm-laminate-frosty-pine",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Frosty Pine",
        tone: "light oak",
        swatch: "#d9d4c8",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/frosty-pine.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Frosty Pine board sample",
        description: "Frosty Pine is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/frosty-pine/"
      },
      {
        id: "hrt-12mm-laminate-grey-dark-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Grey Dark Oak",
        tone: "grey",
        swatch: "#7f736b",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/grey-dark-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Grey Dark Oak board sample",
        description: "Grey Dark Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/grey-dark-oak/"
      }
    ],
    hybrid: [
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-antique-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Antique Oak",
        tone: "natural oak",
        swatch: "#b99572",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-antique-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Antique Oak colour sample",
        description: "Antique Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-baden-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Baden Oak",
        tone: "light oak",
        swatch: "#cab08f",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-baden-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Baden Oak colour sample",
        description: "Baden Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Blackbutt",
        tone: "light oak",
        swatch: "#d0b289",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-blackbutt.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Blackbutt colour sample",
        description: "Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-brushbox",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Brushbox",
        tone: "walnut",
        swatch: "#9e7756",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-brushbox.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Brushbox colour sample",
        description: "Brushbox is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-caramel-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Caramel Oak",
        tone: "natural oak",
        swatch: "#b6865a",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-caramel-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Caramel Oak colour sample",
        description: "Caramel Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-dexter-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Dexter Oak",
        tone: "grey",
        swatch: "#a7a29a",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-dexter-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Dexter Oak colour sample",
        description: "Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-downtown-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Downtown Oak",
        tone: "grey",
        swatch: "#8c837b",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-downtown-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Downtown Oak colour sample",
        description: "Downtown Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Driftwood",
        tone: "grey",
        swatch: "#b0a599",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-driftwood.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Driftwood colour sample",
        description: "Driftwood is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-grey-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Grey Oak",
        tone: "grey",
        swatch: "#929290",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-grey-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Grey Oak colour sample",
        description: "Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-hatton-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Hatton Oak",
        tone: "natural oak",
        swatch: "#b2906e",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-hatton-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Hatton Oak colour sample",
        description: "Hatton Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-helena-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Helena Oak",
        tone: "light oak",
        swatch: "#d4bc99",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-helena-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Helena Oak colour sample",
        description: "Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-holly-hills",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Holly Hills",
        tone: "natural oak",
        swatch: "#c1a583",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-holly-hills.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Holly Hills colour sample",
        description: "Holly Hills is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-jarrah",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Jarrah",
        tone: "dark",
        swatch: "#744d39",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-jarrah.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Jarrah colour sample",
        description: "Jarrah is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-julan",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Julan",
        tone: "walnut",
        swatch: "#8d6549",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-julan.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Julan colour sample",
        description: "Julan is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-lake-oak-light",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Lake Oak Light",
        tone: "light oak",
        swatch: "#d7c4a7",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-lake-oak-light.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Lake Oak Light colour sample",
        description: "Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-alaskan-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Alaskan Oak",
        tone: "light oak",
        swatch: "#c9b28e",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-alaskan-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Alaskan Oak colour sample",
        description: "Alaskan Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-american-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "American Oak",
        tone: "natural oak",
        swatch: "#c09a78",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-american-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring American Oak colour sample",
        description: "American Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-coastal-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Coastal Blackbutt",
        tone: "light oak",
        swatch: "#ccb089",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-coastal-blackbutt.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Coastal Blackbutt colour sample",
        description: "Coastal Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Driftwood",
        tone: "grey",
        swatch: "#b0a599",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-driftwood.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Driftwood colour sample",
        description: "Driftwood is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-french-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "French Oak",
        tone: "natural oak",
        swatch: "#b99976",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-french-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring French Oak colour sample",
        description: "French Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-grey-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Grey Oak",
        tone: "grey",
        swatch: "#929290",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-grey-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Grey Oak colour sample",
        description: "Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-helena-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Helena Oak",
        tone: "light oak",
        swatch: "#d4bc99",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-helena-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Helena Oak colour sample",
        description: "Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-natural-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#d3b48f",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-natural-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Natural Oak colour sample",
        description: "Natural Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-new-zealand-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "New Zealand Blackbutt",
        tone: "natural oak",
        swatch: "#ba9a73",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-new-zealand-blackbutt.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring New Zealand Blackbutt colour sample",
        description: "New Zealand Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-qld-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "QLD Spotted Gum",
        tone: "warm brown",
        swatch: "#9b7454",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-qld-spotted-gum.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring QLD Spotted Gum colour sample",
        description: "QLD Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-riverview",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Riverview",
        tone: "natural oak",
        swatch: "#b49b83",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-riverview.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Riverview colour sample",
        description: "Riverview is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Spotted Gum",
        tone: "warm brown",
        swatch: "#a57d5c",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-spotted-gum.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Spotted Gum colour sample",
        description: "Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-alaskan-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Alaskan Oak",
        tone: "light oak",
        swatch: "#c9b28e",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-alaskan-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Alaskan Oak colour sample",
        description: "Alaskan Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-american-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "American Oak",
        tone: "natural oak",
        swatch: "#c09a78",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-american-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring American Oak colour sample",
        description: "American Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-coastal-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Coastal Blackbutt",
        tone: "light oak",
        swatch: "#ccb089",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-coastal-blackbutt.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Coastal Blackbutt colour sample",
        description: "Coastal Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-dexter-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Dexter Oak",
        tone: "grey",
        swatch: "#a7a29a",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-dexter-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Dexter Oak colour sample",
        description: "Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Driftwood",
        tone: "grey",
        swatch: "#b0a599",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-driftwood.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Driftwood colour sample",
        description: "Driftwood is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-french-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "French Oak",
        tone: "natural oak",
        swatch: "#b99976",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-french-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring French Oak colour sample",
        description: "French Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-grey-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Grey Oak",
        tone: "grey",
        swatch: "#929290",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-grey-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Grey Oak colour sample",
        description: "Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-lake-oak-light",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Lake Oak Light",
        tone: "light oak",
        swatch: "#d7c4a7",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-lake-oak-light.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Lake Oak Light colour sample",
        description: "Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-natural-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#d3b48f",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-natural-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Natural Oak colour sample",
        description: "Natural Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-new-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "New Driftwood",
        tone: "grey",
        swatch: "#a9a096",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-new-driftwood.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring New Driftwood colour sample",
        description: "New Driftwood is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-new-zealand-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "New Zealand Blackbutt",
        tone: "natural oak",
        swatch: "#ba9a73",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-new-zealand-blackbutt.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring New Zealand Blackbutt colour sample",
        description: "New Zealand Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-oslo-oak-grey",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Oslo Oak Grey",
        tone: "grey",
        swatch: "#8f8d8b",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-oslo-oak-grey.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Oslo Oak Grey colour sample",
        description: "Oslo Oak Grey is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-qld-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "QLD Spotted Gum",
        tone: "warm brown",
        swatch: "#9b7454",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-qld-spotted-gum.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring QLD Spotted Gum colour sample",
        description: "QLD Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Spotted Gum",
        tone: "warm brown",
        swatch: "#a57d5c",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-spotted-gum.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Spotted Gum colour sample",
        description: "Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      }
    ],
    engineered: [
      {
        id: "eco-swish-oak-natura-ambient-sand",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Ambient Sand",
        tone: "light beige",
        swatch: "#d8c2ac",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/ambient-sand.jpg",
        alt: "Swish Oak Natura Ambient Sand engineered timber swatch",
        description: "Ambient Sand is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/ambient-sand/"
      },
      {
        id: "eco-swish-oak-natura-belfort-oak",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Belfort Oak",
        tone: "warm oak",
        swatch: "#b18d6b",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/belfort-oak.jpg",
        alt: "Swish Oak Natura Belfort Oak engineered timber swatch",
        description: "Belfort Oak is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/belfort-oak/"
      },
      {
        id: "eco-swish-oak-natura-canyon-oak",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Canyon Oak",
        tone: "mid oak",
        swatch: "#a98059",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/canyon-oak.jpg",
        alt: "Swish Oak Natura Canyon Oak engineered timber swatch",
        description: "Canyon Oak is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/canyon-oak/"
      },
      {
        id: "eco-swish-oak-natura-danish-white",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Danish White",
        tone: "light oak",
        swatch: "#d9d2c3",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/danish-white.jpg",
        alt: "Swish Oak Natura Danish White engineered timber swatch",
        description: "Danish White is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/danish-white/"
      },
      {
        id: "eco-swish-oak-natura-fiano-brown",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Fiano Brown",
        tone: "walnut",
        swatch: "#8b6344",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/fiano-brown.jpg",
        alt: "Swish Oak Natura Fiano Brown engineered timber swatch",
        description: "Fiano Brown is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/fiano-brown/"
      },
      {
        id: "eco-swish-oak-natura-french-carbon",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "French Carbon",
        tone: "charcoal",
        swatch: "#655e57",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/french-carbon.jpg",
        alt: "Swish Oak Natura French Carbon engineered timber swatch",
        description: "French Carbon is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-carbon/"
      },
      {
        id: "eco-swish-oak-natura-french-ghost",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "French Ghost",
        tone: "grey oak",
        swatch: "#a2988f",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/french-ghost.jpg",
        alt: "Swish Oak Natura French Ghost engineered timber swatch",
        description: "French Ghost is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-ghost/"
      },
      {
        id: "eco-swish-oak-natura-french-natural",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "French Natural",
        tone: "natural oak",
        swatch: "#c4a37e",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/french-natural.jpg",
        alt: "Swish Oak Natura French Natural engineered timber swatch",
        description: "French Natural is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-natural/"
      },
      {
        id: "eco-swish-oak-natura-nordic-limed",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Nordic Limed",
        tone: "limed oak",
        swatch: "#d7d0c3",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/nordic-limed.jpg",
        alt: "Swish Oak Natura Nordic Limed engineered timber swatch",
        description: "Nordic Limed is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/nordic-limed/"
      },
      {
        id: "eco-swish-oak-natura-nordic-spring",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Nordic Spring",
        tone: "pale oak",
        swatch: "#d6c9b7",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/nordic-spring.jpg",
        alt: "Swish Oak Natura Nordic Spring engineered timber swatch",
        description: "Nordic Spring is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/nordic-spring/"
      },
      {
        id: "eco-swish-oak-natura-oak-dove-grey",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Oak Dove Grey",
        tone: "dove grey",
        swatch: "#b4ada4",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/oak-dove-grey.jpg",
        alt: "Swish Oak Natura Oak Dove Grey engineered timber swatch",
        description: "Oak Dove Grey is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/oak-dove-grey/"
      },
      {
        id: "eco-swish-oak-natura-oak-grey-harmony",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Oak Grey Harmony",
        tone: "grey brown",
        swatch: "#9f8d7e",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/oak-grey-harmony.jpg",
        alt: "Swish Oak Natura Oak Grey Harmony engineered timber swatch",
        description: "Oak Grey Harmony is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/oak-grey-harmony/"
      },
      {
        id: "eco-swish-oak-natura-odense-grey",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Odense Grey",
        tone: "soft grey",
        swatch: "#b7aea4",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/odense-grey.jpg",
        alt: "Swish Oak Natura Odense Grey engineered timber swatch",
        description: "Odense Grey is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/odense-grey/"
      },
      {
        id: "eco-swish-oak-natura-oyster-grey",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Oyster Grey",
        tone: "light grey",
        swatch: "#c4bdb2",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/oyster-grey.jpg",
        alt: "Swish Oak Natura Oyster Grey engineered timber swatch",
        description: "Oyster Grey is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/oyster-grey/"
      },
      {
        id: "eco-swish-oak-natura-raw-caramel",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Raw Caramel",
        tone: "caramel oak",
        swatch: "#b4855f",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/raw-caramel.jpg",
        alt: "Swish Oak Natura Raw Caramel engineered timber swatch",
        description: "Raw Caramel is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/raw-caramel/"
      },
      {
        id: "eco-swish-oak-natura-raw-leaf",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Raw Leaf",
        tone: "muted brown",
        swatch: "#a28f73",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/raw-leaf.jpg",
        alt: "Swish Oak Natura Raw Leaf engineered timber swatch",
        description: "Raw Leaf is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/raw-leaf/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-ambient-sand",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "Ambient Sand Herringbone",
        tone: "light beige",
        swatch: "#d8c2ac",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/ambient-sand.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/ambient-sand.jpg"
        ],
        alt: "Swish Oak Natura Herringbone Ambient Sand engineered timber swatch",
        description: "Ambient Sand Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/ambient-sand-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-danish-white",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "Danish White Herringbone",
        tone: "light oak",
        swatch: "#d9d2c3",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/danish-white.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/danish-white.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/danish-white-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone Danish White engineered timber swatch",
        description: "Danish White Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/danish-white-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-fiano-brown",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "Fiano Brown Herringbone",
        tone: "walnut",
        swatch: "#8b6344",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/fiano-brown.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/fiano-brown.jpg"
        ],
        alt: "Swish Oak Natura Herringbone Fiano Brown engineered timber swatch",
        description: "Fiano Brown Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/fiano-brown-heringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-french-carbon",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "French Carbon Herringbone",
        tone: "charcoal",
        swatch: "#655e57",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/french-carbon.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-carbon.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-carbon-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone French Carbon engineered timber swatch",
        description: "French Carbon Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-carbon-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-french-ghost",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "French Ghost Herringbone",
        tone: "grey oak",
        swatch: "#a2988f",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/french-ghost.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-ghost.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-ghost-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone French Ghost engineered timber swatch",
        description: "French Ghost Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-ghost-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-french-natural",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "French Natural Herringbone",
        tone: "natural oak",
        swatch: "#c4a37e",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/french-natural.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-natural.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-natural-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone French Natural engineered timber swatch",
        description: "French Natural Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-natural-heringbone/"
      }
    ]
  };

  const ETF_GALLERY_SLUGS_BY_RANGE = {
    "7mm": [
      "antique-oak",
      "baden-oak",
      "blackbutt",
      "brushbox",
      "caramel-oak",
      "dexter-oak",
      "downtown-oak",
      "driftwood",
      "grey-oak",
      "hatton-oak",
      "helena-oak",
      "holly-hills",
      "jarrah",
      "julan",
      "lake-oak-light"
    ],
    "8mm": [
      "alaskan-oak",
      "american-oak",
      "coastal-blackbutt",
      "driftwood",
      "french-oak",
      "grey-oak",
      "helena-oak",
      "natural-oak",
      "new-zealand-blackbutt",
      "qld-spotted-gum",
      "riverview",
      "spotted-gum"
    ],
    "9mm": [
      "alaskan-oak",
      "american-oak",
      "coastal-blackbutt",
      "dexter-oak",
      "driftwood",
      "french-oak",
      "grey-oak",
      "lake-oak-light",
      "natural-oak",
      "new-driftwood",
      "new-zealand-blackbutt",
      "oslo-oak-grey",
      "qld-spotted-gum",
      "spotted-gum"
    ]
  };

  const PRODUCT_GALLERY_MAP = Object.keys(ETF_GALLERY_SLUGS_BY_RANGE).reduce(function (accumulator, rangeKey) {
    ETF_GALLERY_SLUGS_BY_RANGE[rangeKey].forEach(function (slug) {
      const basePath = "images/products/hybrid/hrt-etf-" + rangeKey + "-" + slug;
      accumulator["hrt-etf-" + rangeKey + "-hybrid-" + slug] = [
        basePath + "-gallery-1.jpg",
        basePath + "-gallery-2.jpg",
        basePath + ".jpg"
      ];
    });
    return accumulator;
  }, {});

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getRangeConfigEntry(product, category) {
    const config = RANGE_CONFIG[category || product.category] || {};
    return config[product.brand] || config[product.range] || null;
  }

  function inferRangeId(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.rangeId) {
      return configEntry.rangeId;
    }

    if (product.rangeId) {
      return product.rangeId;
    }

    return [category || product.category, product.brand || product.range || "range"].map(slugify).filter(Boolean).join("-");
  }

  function inferRangeLabel(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.rangeLabel) {
      return configEntry.rangeLabel;
    }

    return product.rangeLabel || product.range || product.brand || "Flooring range";
  }

  function inferSelectionMode(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.selectionMode) {
      return configEntry.selectionMode;
    }

    return product.selectionMode || ((category || product.category) === "engineered" ? "range_then_colour" : "range_only");
  }

  function inferRepresentativeProductId(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.representativeProductId) {
      return configEntry.representativeProductId;
    }

    return product.representativeProductId || product.id;
  }

  function inferDefaultRecommendation(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.isDefaultRecommendation) {
      return true;
    }

    return !!product.isDefaultRecommendation;
  }

  function inferRangeContent(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    return configEntry && configEntry.rangeContent ? clone(configEntry.rangeContent) : null;
  }

  function getCategoryMetaSource() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("categoryMeta") : null;
    if (!source || typeof source !== "object" || Array.isArray(source) || !Object.keys(source).length) {
      return CATEGORY_META;
    }
    return source;
  }

  function getProductsSource() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("products") : null;
    if (!source || typeof source !== "object" || Array.isArray(source) || !Object.keys(source).length) {
      return PRODUCTS;
    }
    return source;
  }

  function normaliseProduct(product, fallbackCategory) {
    const resolvedCategory = product.category || fallbackCategory || "";
    if (resolvedCategory === "laminate" && product.range === "12mm 24hrs Water Resistant Laminate") {
      product = Object.assign({}, product, {
        brand: "ETF Laminate 1.2m"
      });
    }

    const imageUrl = product.imageUrl || product.image || "";
    const imageAlt = product.imageAlt || product.alt || [product.brand, product.range, product.colour, "flooring sample"].filter(Boolean).join(" ");
    const galleryImages = normaliseGalleryImages(product, PRODUCT_GALLERY_MAP[product.id] || []);
    const category = resolvedCategory;
    const rangeId = inferRangeId(product, category);
    const rangeLabel = inferRangeLabel(product, category);
    const selectionMode = inferSelectionMode(product, category);
    const rangeContent = inferRangeContent(product, category);
    const internalSkuLabel = product.internalSkuLabel || [product.brand, product.range, product.colour].filter(Boolean).join(" / ");
    const customerLabel = product.customerLabel || (selectionMode === "range_then_colour"
      ? [rangeLabel, product.colour].filter(Boolean).join(" — ")
      : rangeLabel);
    const pricingStatus = product.pricingStatus || ((Number(product.pricePerM2) || 0) > 0 ? "confirmed" : "pending");
    const catalogueStatus = product.catalogueStatus || (product.active === false ? "inactive" : "live");
    return Object.assign({
      category: category,
      rangeId: rangeId,
      rangeLabel: rangeLabel,
      selectionMode: selectionMode,
      representativeProductId: inferRepresentativeProductId(product, category),
      isDefaultRecommendation: inferDefaultRecommendation(product, category),
      rangeContent: rangeContent,
      customerLabel: customerLabel,
      internalSkuLabel: internalSkuLabel,
      thickness: "",
      imageAlt: imageAlt,
      alt: imageAlt,
      imageUrl: imageUrl,
      image: imageUrl,
      galleryImages: galleryImages,
      features: [],
      active: true,
      pricingStatus: pricingStatus,
      catalogueStatus: catalogueStatus,
      isPlaceholderPricing: pricingStatus !== "confirmed",
      isPublishedProduct: catalogueStatus === "live"
    }, product, {
      category: category,
      rangeId: rangeId,
      rangeLabel: rangeLabel,
      selectionMode: selectionMode,
      representativeProductId: inferRepresentativeProductId(product, category),
      isDefaultRecommendation: inferDefaultRecommendation(product, category),
      rangeContent: rangeContent,
      customerLabel: customerLabel,
      internalSkuLabel: internalSkuLabel,
      imageAlt: imageAlt,
      alt: imageAlt,
      imageUrl: imageUrl,
      image: imageUrl,
      galleryImages: galleryImages,
      active: product.active !== false,
      pricingStatus: pricingStatus,
      catalogueStatus: catalogueStatus,
      isPlaceholderPricing: pricingStatus !== "confirmed",
      isPublishedProduct: catalogueStatus === "live"
    });
  }

  function normaliseGalleryImages(product, fallbackImages) {
    const source = []
      .concat(product.galleryImages || [])
      .concat(fallbackImages || [])
      .concat(product.imageUrl || product.image || []);

    return source.reduce(function (accumulator, imageUrl) {
      if (!imageUrl || accumulator.indexOf(imageUrl) >= 0) {
        return accumulator;
      }
      accumulator.push(imageUrl);
      return accumulator;
    }, []);
  }

  function listAllProducts() {
    const productCollections = getProductsSource();
    return Object.keys(productCollections).reduce(function (accumulator, category) {
      return accumulator.concat((productCollections[category] || []).map(function (product) {
        return normaliseProduct(product, category);
      }));
    }, []);
  }

  function getProductById(id) {
    return listAllProducts().find(function (product) {
      return product.id === id && product.active !== false;
    }) || null;
  }

  function getProductsByCategory(category) {
    return clone(listAllProducts().filter(function (product) {
      return product.category === category && product.active !== false;
    }));
  }

  function getEntryLevelProduct(category) {
    const products = getProductsByCategory(category).filter(function (product) {
      return Number(product.pricePerM2 || 0) > 0;
    });

    products.sort(function (left, right) {
      const priceDifference = Number(left.pricePerM2 || 0) - Number(right.pricePerM2 || 0);
      if (priceDifference !== 0) {
        return priceDifference;
      }
      return getProductLabel(left).localeCompare(getProductLabel(right));
    });

    return products.length ? products[0] : null;
  }

  function getProductsByRangeId(rangeId) {
    return clone(listAllProducts().filter(function (product) {
      return product.rangeId === rangeId && product.active !== false;
    }));
  }

  function getRangesByCategory(category) {
    const products = getProductsByCategory(category);
    const grouped = {};

    products.forEach(function (product) {
      if (!grouped[product.rangeId]) {
        grouped[product.rangeId] = {
          category: product.category,
          rangeId: product.rangeId,
          rangeLabel: product.rangeLabel,
          brand: product.brand,
          thickness: product.thickness,
          productType: product.productType,
          selectionMode: product.selectionMode,
          representativeProductId: product.representativeProductId || product.id,
          isDefaultRecommendation: !!product.isDefaultRecommendation,
          feature: (product.features || [])[0] || "",
          imageUrl: product.imageUrl || product.image || "",
          image: product.imageUrl || product.image || "",
          pricePerM2: product.pricePerM2,
          rangeContent: product.rangeContent || null,
          colours: [],
          colourCount: 0
        };
      }

      grouped[product.rangeId].colours.push(product.colour);
      grouped[product.rangeId].colourCount += 1;
      if (!grouped[product.rangeId].pricePerM2 && product.pricePerM2) {
        grouped[product.rangeId].pricePerM2 = product.pricePerM2;
      }
    });

    return clone(Object.keys(grouped).map(function (rangeId) {
      const item = grouped[rangeId];
      item.colours = Array.from(new Set(item.colours)).filter(Boolean).sort();
      return item;
    }).sort(function (left, right) {
      if (left.isDefaultRecommendation && !right.isDefaultRecommendation) {
        return -1;
      }
      if (!left.isDefaultRecommendation && right.isDefaultRecommendation) {
        return 1;
      }
      return String(left.rangeLabel).localeCompare(String(right.rangeLabel));
    }));
  }

  function getColoursByRange(rangeId) {
    return getProductsByRangeId(rangeId).map(function (product) {
      return {
        id: product.id,
        colour: product.colour,
        customerLabel: product.customerLabel,
        pricePerM2: product.pricePerM2,
        imageUrl: product.imageUrl || product.image || "",
        swatch: product.swatch || "#d1d5db"
      };
    });
  }

  function getRepresentativeProductByRangeId(rangeId) {
    const products = getProductsByRangeId(rangeId);
    if (!products.length) {
      return null;
    }

    const explicitRepresentative = products.find(function (product) {
      return product.id === product.representativeProductId;
    });

    return explicitRepresentative || products[0];
  }

  function getDefaultRecommendation(category) {
    const products = getProductsByCategory(category);
    const explicit = products.find(function (product) {
      return product.isDefaultRecommendation;
    });
    if (explicit) {
      return explicit;
    }

    const ranges = getRangesByCategory(category);
    if (ranges.length) {
      return getRepresentativeProductByRangeId(ranges[0].rangeId);
    }

    return null;
  }

  function getAllProducts() {
    return clone(listAllProducts().filter(function (product) {
      return product.active !== false;
    }));
  }

  function getCategoryMeta(category) {
    const categoryMeta = getCategoryMetaSource();
    return clone(categoryMeta[category] || null);
  }

  function getCategoryList() {
    const categoryMeta = getCategoryMetaSource();
    return Object.keys(categoryMeta).map(function (key) {
      return getCategoryMeta(key);
    });
  }

  function getCategoryStats(category) {
    const products = getProductsByCategory(category);
    const liveProductCount = products.filter(function (product) {
      return product.isPublishedProduct;
    }).length;
    const confirmedPriceCount = products.filter(function (product) {
      return !product.isPlaceholderPricing;
    }).length;

    return {
      liveProductCount: liveProductCount,
      confirmedPriceCount: confirmedPriceCount,
      hasLiveProducts: liveProductCount > 0,
      hasConfirmedPrices: confirmedPriceCount > 0
    };
  }

  function isValidCategory(category) {
    if (!category) {
      return false;
    }

    return !!getCategoryMeta(category);
  }

  function clearStoredSelectionKeys() {
    localStorage.removeItem(STORAGE_ID_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RANGE_STORAGE_KEY);
    localStorage.removeItem(COLOUR_STORAGE_KEY);
    localStorage.removeItem(SELECTION_MODE_STORAGE_KEY);
  }

  function getEstimateProduct(category) {
    const categoryMeta = getCategoryMetaSource();
    const meta = categoryMeta[category] || categoryMeta.hybrid || CATEGORY_META.hybrid;
    const entryLevelProduct = getEntryLevelProduct(meta.id);
    const pricePerM2 = entryLevelProduct && entryLevelProduct.pricePerM2 > 0
      ? entryLevelProduct.pricePerM2
      : meta.pricePerM2;
    const pricingMode = entryLevelProduct && entryLevelProduct.pricePerM2 > 0
      ? "category"
      : "fallback";

    return {
      id: meta.id + "-estimate",
      category: meta.id,
      brand: "Operon Estimate",
      range: meta.label,
      colour: "Standard estimate",
      pricePerM2: pricePerM2,
      installRate: null,
      imageUrl: "",
      image: "",
      description: meta.shortDescription,
      features: [],
      suitableFor: [],
      active: true,
      isEstimate: true,
      pricingMode: pricingMode,
      baselineProductId: entryLevelProduct ? entryLevelProduct.id : "",
      baselineProductLabel: entryLevelProduct ? getProductLabel(entryLevelProduct) : "",
      label: meta.label + " Estimate"
    };
  }

  function getProductLabel(product) {
    if (!product) {
      return "";
    }

    if (product.label) {
      return product.label;
    }

    if (product.isEstimate) {
      return (product.range || product.category || "Flooring") + " Estimate";
    }

    if (product.customerLabel) {
      return product.customerLabel;
    }

    return product.selectionMode === "range_then_colour"
      ? [product.rangeLabel || product.range, product.colour].filter(Boolean).join(" — ")
      : (product.rangeLabel || product.range || product.brand || "Flooring product");
  }

  function getStoredSelectionState() {
    return {
      selectedProductId: localStorage.getItem(STORAGE_ID_KEY) || "",
      selectedRangeId: localStorage.getItem(RANGE_STORAGE_KEY) || "",
      selectedCategory: localStorage.getItem(CATEGORY_STORAGE_KEY) || "",
      selectedColour: localStorage.getItem(COLOUR_STORAGE_KEY) || "",
      productSelectionMode: localStorage.getItem(SELECTION_MODE_STORAGE_KEY) || ""
    };
  }

  function getStoredProduct() {
    try {
      const storedSelection = getStoredSelectionState();
      const storedId = storedSelection.selectedProductId;
      if (storedId) {
        const latestFromId = getProductById(storedId);
        if (latestFromId) {
          if (latestFromId.category) {
            localStorage.setItem(CATEGORY_STORAGE_KEY, latestFromId.category);
          }
          if (latestFromId.rangeId) {
            localStorage.setItem(RANGE_STORAGE_KEY, latestFromId.rangeId);
          }
          localStorage.setItem(SELECTION_MODE_STORAGE_KEY, latestFromId.selectionMode || "");
          localStorage.setItem(COLOUR_STORAGE_KEY, latestFromId.selectionMode === "range_then_colour" ? (latestFromId.colour || "") : "");
          return Object.assign({}, latestFromId);
        }
        clearStoredSelectionKeys();
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const productId = parsed && typeof parsed === "object" ? parsed.id : parsed;
      if (!productId) {
        return null;
      }

      const latest = getProductById(productId);
      if (!latest) {
        clearStoredSelectionKeys();
        return null;
      }

      localStorage.setItem(STORAGE_ID_KEY, latest.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: latest.id }));
      if (latest.category) {
        localStorage.setItem(CATEGORY_STORAGE_KEY, latest.category);
      }
      if (latest.rangeId) {
        localStorage.setItem(RANGE_STORAGE_KEY, latest.rangeId);
      }
      localStorage.setItem(SELECTION_MODE_STORAGE_KEY, latest.selectionMode || "");
      localStorage.setItem(COLOUR_STORAGE_KEY, latest.selectionMode === "range_then_colour" ? (latest.colour || "") : "");
      return Object.assign({}, latest);
    } catch (error) {
      clearStoredSelectionKeys();
      return null;
    }
  }

  function getStoredProductId() {
    const storedProduct = getStoredProduct();
    return storedProduct ? storedProduct.id : "";
  }

  function saveSelectedProduct(product) {
    if (!product || !product.id) {
      return;
    }

    const latest = getProductById(product.id) || product;
    if (!latest.category || !isValidCategory(latest.category)) {
      return;
    }
    const storedProductId = latest.selectionMode === "range_only" && latest.rangeId
      ? ((getRepresentativeProductByRangeId(latest.rangeId) || latest).id)
      : latest.id;

    localStorage.setItem(STORAGE_ID_KEY, storedProductId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: storedProductId }));
    localStorage.setItem(CATEGORY_STORAGE_KEY, latest.category || "");
    localStorage.setItem(RANGE_STORAGE_KEY, latest.rangeId || "");
    localStorage.setItem(COLOUR_STORAGE_KEY, latest.selectionMode === "range_then_colour" ? (latest.colour || "") : "");
    localStorage.setItem(SELECTION_MODE_STORAGE_KEY, latest.selectionMode || "");
  }

  function saveSelectionState(selection) {
    const settings = Object.assign({
      selectedProductId: "",
      selectedRangeId: "",
      selectedCategory: "",
      selectedColour: "",
      productSelectionMode: ""
    }, selection || {});

    if (settings.selectedProductId) {
      localStorage.setItem(STORAGE_ID_KEY, settings.selectedProductId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: settings.selectedProductId }));
    } else {
      localStorage.removeItem(STORAGE_ID_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }

    if (settings.selectedRangeId) {
      localStorage.setItem(RANGE_STORAGE_KEY, settings.selectedRangeId);
    } else {
      localStorage.removeItem(RANGE_STORAGE_KEY);
    }

    if (settings.selectedCategory && isValidCategory(settings.selectedCategory)) {
      localStorage.setItem(CATEGORY_STORAGE_KEY, settings.selectedCategory);
    } else if (!settings.selectedCategory) {
      localStorage.removeItem(CATEGORY_STORAGE_KEY);
    }

    if (settings.selectedColour) {
      localStorage.setItem(COLOUR_STORAGE_KEY, settings.selectedColour);
    } else {
      localStorage.removeItem(COLOUR_STORAGE_KEY);
    }

    if (settings.productSelectionMode) {
      localStorage.setItem(SELECTION_MODE_STORAGE_KEY, settings.productSelectionMode);
    } else {
      localStorage.removeItem(SELECTION_MODE_STORAGE_KEY);
    }
  }

  function clearSelectedProduct() {
    clearStoredSelectionKeys();
  }

  function getStoredCategory() {
    const storedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || "";
    if (!storedCategory) {
      return "";
    }

    if (!isValidCategory(storedCategory)) {
      localStorage.removeItem(CATEGORY_STORAGE_KEY);
      return "";
    }

    return storedCategory;
  }

  function saveSelectedCategory(category) {
    if (isValidCategory(category)) {
      localStorage.setItem(CATEGORY_STORAGE_KEY, category);
    }
  }

  function formatProductRate(product) {
    if (!product || product.isPlaceholderPricing || !(product.pricePerM2 > 0)) {
      return "Price to be confirmed";
    }

    return "$" + product.pricePerM2.toFixed(0) + "/m²";
  }

  function getProductStatusLabel(product) {
    if (!product) {
      return "";
    }

    if (product.isPlaceholderPricing) {
      return "Price pending";
    }

    return "Price confirmed";
  }

  function buildProductImageMarkup(product) {
    const imageUrl = product.imageUrl || product.image || "";
    const altText = product.alt || (getProductLabel(product) + " colour sample");

    if (imageUrl) {
      return (
        '<button class="catalogue-image-frame" type="button" data-open-product-image="' + product.id + '" aria-label="Open larger image for ' + altText + '">' +
          '<img class="catalogue-image" src="' + imageUrl + '" alt="' + altText + '" loading="lazy" onerror="this.hidden=true; this.parentNode.classList.add(\'is-fallback\');">' +
          '<div class="catalogue-swatch-fallback" aria-hidden="true">' +
            '<div class="catalogue-swatch" style="background:' + product.swatch + ';"></div>' +
            '<span>' + product.colour + "</span>" +
          "</div>" +
        "</button>"
      );
    }

    return (
      '<button class="catalogue-image-frame is-fallback" type="button" data-open-product-image="' + product.id + '" aria-label="Open larger image for ' + altText + '">' +
        '<div class="catalogue-swatch-fallback" aria-hidden="true">' +
          '<div class="catalogue-swatch" style="background:' + product.swatch + ';"></div>' +
          '<span>' + product.colour + "</span>" +
        "</div>" +
      "</button>"
    );
  }

  function renderProductCard(product) {
    const specLine = [product.productType, product.thickness].filter(Boolean).join(" · ");

    return (
      '<article class="catalogue-card" data-product-card="' + product.id + '">' +
        buildProductImageMarkup(product) +
        '<div class="catalogue-card-top">' +
          '<div class="catalogue-copy">' +
            '<span class="catalogue-brand">' + product.brand + "</span>" +
            "<h3>" + product.range + "</h3>" +
            '<p class="catalogue-colour">' + product.colour + "</p>" +
            '<p class="catalogue-spec">' + specLine + "</p>" +
          "</div>" +
        "</div>" +
        '<button class="button catalogue-select-button" type="button" data-select-product="' + product.id + '">Get quote</button>' +
      "</article>"
    );
  }

  function ensureCatalogueLightbox() {
    let modal = document.getElementById("catalogueLightbox");
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.className = "catalogue-lightbox";
    modal.id = "catalogueLightbox";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="catalogue-lightbox-backdrop" data-close-catalogue-lightbox="true"></div>' +
      '<div class="catalogue-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Product image preview">' +
        '<button class="catalogue-lightbox-back" type="button" aria-label="Back to colour gallery" hidden>← Back</button>' +
        '<button class="catalogue-lightbox-close" type="button" aria-label="Close image preview" data-close-catalogue-lightbox="true">×</button>' +
        '<div class="catalogue-lightbox-media">' +
          '<img id="catalogueLightboxImage" class="catalogue-lightbox-image" alt="">' +
          '<div id="catalogueLightboxFallback" class="catalogue-lightbox-fallback" hidden>' +
            '<div id="catalogueLightboxSwatch" class="catalogue-swatch"></div>' +
          "</div>" +
        "</div>" +
        '<div id="catalogueLightboxCaption" class="catalogue-lightbox-caption"></div>' +
        '<div id="catalogueLightboxThumbnails" class="catalogue-lightbox-thumbnails" hidden></div>' +
      "</div>";

    document.body.appendChild(modal);

    const backdrop = modal.querySelector(".catalogue-lightbox-backdrop");
    const dialog = modal.querySelector(".catalogue-lightbox-dialog");
    const backButton = modal.querySelector(".catalogue-lightbox-back");
    const closeButton = modal.querySelector(".catalogue-lightbox-close");
    const thumbnails = modal.querySelector("#catalogueLightboxThumbnails");

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeCatalogueLightbox();
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeCatalogueLightbox();
      });
    }

    if (backButton) {
      backButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const onBack = typeof modal.__onBack === "function" ? modal.__onBack : null;
        closeCatalogueLightbox({ preserveBackState: false });
        if (onBack) {
          onBack();
        }
      });
    }

    if (dialog) {
      dialog.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }

    if (thumbnails) {
      thumbnails.addEventListener("click", function (event) {
        const thumbnailButton = event.target.closest("[data-lightbox-image-index]");
        if (!thumbnailButton) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        setCatalogueLightboxSlide(modal, Number(thumbnailButton.getAttribute("data-lightbox-image-index")) || 0);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        closeCatalogueLightbox();
      }
    });

    return modal;
  }

  function openCatalogueLightbox(product, options) {
    if (!product) {
      return;
    }

    const settings = Object.assign({
      onBack: null
    }, options || {});
    const modal = ensureCatalogueLightbox();
    const backButton = modal.querySelector(".catalogue-lightbox-back");
    modal.__product = product;
    modal.__galleryImages = (product.galleryImages || []).length
      ? product.galleryImages.slice()
      : normaliseGalleryImages(product, []);
    modal.__galleryIndex = 0;
    modal.__onBack = typeof settings.onBack === "function" ? settings.onBack : null;

    if (backButton) {
      backButton.hidden = !modal.__onBack;
    }

    renderCatalogueLightboxThumbnails(modal, product);
    setCatalogueLightboxSlide(modal, 0);
    modal.hidden = false;
    document.body.classList.add("catalogue-lightbox-open");
  }

  function renderCatalogueLightboxThumbnails(modal, product) {
    const thumbnails = modal.querySelector("#catalogueLightboxThumbnails");
    const galleryImages = modal.__galleryImages || [];

    if (galleryImages.length < 2) {
      thumbnails.hidden = true;
      thumbnails.innerHTML = "";
      return;
    }

    thumbnails.hidden = false;
    thumbnails.innerHTML = galleryImages.map(function (imageUrl, index) {
      return (
        '<button class="catalogue-lightbox-thumb' + (index === (modal.__galleryIndex || 0) ? " is-active" : "") + '" type="button" data-lightbox-image-index="' + index + '" aria-label="View ' + product.colour + " image " + (index + 1) + '">' +
          '<img src="' + imageUrl + '" alt="' + (product.alt || (getProductLabel(product) + " colour sample")) + " image " + (index + 1) + '" loading="lazy" onerror="this.parentNode.hidden=true;">' +
        "</button>"
      );
    }).join("");
  }

  function setCatalogueLightboxSlide(modal, index) {
    const product = modal.__product;
    const galleryImages = modal.__galleryImages || [];
    const image = modal.querySelector("#catalogueLightboxImage");
    const fallback = modal.querySelector("#catalogueLightboxFallback");
    const swatch = modal.querySelector("#catalogueLightboxSwatch");
    const caption = modal.querySelector("#catalogueLightboxCaption");

    if (!product) {
      return;
    }

    modal.__galleryIndex = index;
    caption.textContent = product.colour || getProductLabel(product);
    swatch.style.background = product.swatch || "#d1d5db";
    fallback.hidden = true;
    image.hidden = false;
    image.alt = product.alt || (getProductLabel(product) + " colour sample");

    if (galleryImages[index]) {
      image.src = galleryImages[index];
      image.onload = function () {
        fallback.hidden = true;
        image.hidden = false;
      };
      image.onerror = function () {
        image.hidden = true;
        fallback.hidden = false;
      };
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      fallback.hidden = false;
    }

    renderCatalogueLightboxThumbnails(modal, product);
  }

  function closeCatalogueLightbox(options) {
    const modal = document.getElementById("catalogueLightbox");
    if (!modal) {
      return;
    }

    const settings = Object.assign({
      preserveBackState: false
    }, options || {});
    const backButton = modal.querySelector(".catalogue-lightbox-back");
    modal.hidden = true;
    modal.__product = null;
    modal.__galleryImages = [];
    modal.__galleryIndex = 0;
    if (!settings.preserveBackState) {
      modal.__onBack = null;
    }
    if (backButton) {
      backButton.hidden = true;
    }
    document.body.classList.remove("catalogue-lightbox-open");
  }

  function renderCategoryCatalogue(options) {
    const settings = Object.assign({
      category: "",
      targetId: "",
      statusId: "",
      limit: 0,
      quoteUrl: "quote.html?from=product",
      successMessage: "Product selected. Continue to quote."
    }, options || {});

    const target = document.getElementById(settings.targetId);
    if (!target) {
      return;
    }

    const products = getProductsByCategory(settings.category);
    const limitedProducts = settings.limit > 0 ? products.slice(0, settings.limit) : products;
    const storedProduct = getStoredProduct();
    const status = settings.statusId ? document.getElementById(settings.statusId) : null;

    if (!limitedProducts.length) {
      target.innerHTML = "";
      if (status) {
        const categoryMeta = getCategoryMeta(settings.category);
        status.textContent = categoryMeta
          ? "Live " + categoryMeta.label.toLowerCase() + " products will be added here when confirmed. You can continue with a " + categoryMeta.label.toLowerCase() + " quote now."
          : "Live product options will appear here when confirmed.";
        status.dataset.state = "info";
      }
      return;
    }

    target.innerHTML = limitedProducts.map(function (product) {
      const selectedClass = storedProduct && storedProduct.id === product.id ? " selected" : "";
      return renderProductCard(product).replace('class="catalogue-card"', 'class="catalogue-card' + selectedClass + '"');
    }).join("");

    target.__operonCatalogueConfig = settings;
    if (target.dataset.catalogueBound === "true") {
      return;
    }

    target.dataset.catalogueBound = "true";
    target.addEventListener("click", function (event) {
      const activeSettings = target.__operonCatalogueConfig || settings;
      const activeStatus = activeSettings.statusId ? document.getElementById(activeSettings.statusId) : null;

      const button = event.target.closest("[data-select-product]");
      if (button) {
        const product = getProductById(button.getAttribute("data-select-product"));
        if (!product) {
          return;
        }

        saveSelectedProduct(product);
        if (window.OperonTracking) {
          const trackingPayload = {
            category: product.category,
            brand: product.brand,
            range: product.range,
            colour: product.colour,
            pricePerM2: product.pricePerM2
          };
          if (typeof window.OperonTracking.trackProductSelect === "function") {
            window.OperonTracking.trackProductSelect(trackingPayload);
          } else {
            window.OperonTracking.trackEvent("product_selected", trackingPayload);
            window.OperonTracking.trackEvent("product_select", trackingPayload);
          }
        }

        if (activeStatus) {
          activeStatus.textContent = activeSettings.successMessage;
          activeStatus.dataset.state = "success";
        }

        window.location.href = activeSettings.quoteUrl;
        return;
      }

      const imageTrigger = event.target.closest("[data-open-product-image]");
      if (imageTrigger) {
        const product = getProductById(imageTrigger.getAttribute("data-open-product-image"));
        openCatalogueLightbox(product);
      }
    });
  }

  function renderSelectionBanner(options) {
    const settings = Object.assign({
      category: "",
      titleId: "",
      textId: "",
      clearButtonId: "",
      quoteUrl: "quote.html?from=product"
    }, options || {});

    const title = document.getElementById(settings.titleId);
    const text = document.getElementById(settings.textId);
    const clearButton = document.getElementById(settings.clearButtonId);
    const storedProduct = getStoredProduct();
    const categoryMeta = getCategoryMeta(settings.category);

    if (!title || !text || !clearButton || !categoryMeta) {
      return;
    }

    if (storedProduct && storedProduct.category === settings.category) {
      title.textContent = "Selected for quote: " + getProductLabel(storedProduct);
      text.textContent = storedProduct.selectionMode === "range_only"
        ? "Using " + getProductLabel(storedProduct) + ". Colour can be confirmed later."
        : (storedProduct.pricePerM2 > 0
          ? getProductLabel(storedProduct) + " · " + formatProductRate(storedProduct)
          : getProductLabel(storedProduct) + " · Product price needs review before final confirmation.");
      clearButton.textContent = "Use " + categoryMeta.label.toLowerCase() + " estimate instead";
      clearButton.onclick = function () {
        clearSelectedProduct();
        saveSelectedCategory(settings.category);
        window.location.href = settings.quoteUrl;
      };
      return;
    }

    if (!getProductsByCategory(settings.category).length) {
      title.textContent = categoryMeta.label + " quote ready";
      text.textContent = "Live " + categoryMeta.label.toLowerCase() + " product listings are not published yet. Continue with the " + categoryMeta.label.toLowerCase() + " estimate and we can confirm the final product during review.";
      clearButton.textContent = "Start " + categoryMeta.label.toLowerCase() + " quote";
      clearButton.onclick = function () {
        clearSelectedProduct();
        saveSelectedCategory(settings.category);
        window.location.href = settings.quoteUrl;
      };
      return;
    }

    title.textContent = "No specific " + categoryMeta.label.toLowerCase() + " selected yet";
    text.textContent = "Choose a product to load selected product pricing into the quote, or continue with entry-level " + categoryMeta.label.toLowerCase() + " product pricing.";
    clearButton.textContent = "Continue with " + categoryMeta.label.toLowerCase() + " estimate";
    clearButton.onclick = function () {
      clearSelectedProduct();
      saveSelectedCategory(settings.category);
      window.location.href = settings.quoteUrl;
    };
  }

  window.OPERON_PRODUCTS = PRODUCTS;
  window.OperonProducts = {
    STORAGE_KEY: STORAGE_KEY,
    STORAGE_ID_KEY: STORAGE_ID_KEY,
    CATEGORY_STORAGE_KEY: CATEGORY_STORAGE_KEY,
    RANGE_STORAGE_KEY: RANGE_STORAGE_KEY,
    COLOUR_STORAGE_KEY: COLOUR_STORAGE_KEY,
    SELECTION_MODE_STORAGE_KEY: SELECTION_MODE_STORAGE_KEY,
    get categoryMeta() {
      return clone(getCategoryMetaSource());
    },
    getCategoryList: getCategoryList,
    getCategoryStats: getCategoryStats,
    getAllProducts: getAllProducts,
    getCategoryMeta: getCategoryMeta,
    getProductsByCategory: getProductsByCategory,
    getEntryLevelProduct: getEntryLevelProduct,
    getProductsByRangeId: getProductsByRangeId,
    getRangesByCategory: getRangesByCategory,
    getColoursByRange: getColoursByRange,
    getRepresentativeProductByRangeId: getRepresentativeProductByRangeId,
    getDefaultRecommendation: getDefaultRecommendation,
    getProductById: getProductById,
    getEstimateProduct: getEstimateProduct,
    getProductLabel: getProductLabel,
    getStoredProduct: getStoredProduct,
    getStoredSelectionState: getStoredSelectionState,
    getStoredProductId: getStoredProductId,
    getStoredCategory: getStoredCategory,
    saveSelectedCategory: saveSelectedCategory,
    saveSelectedProduct: saveSelectedProduct,
    saveSelectionState: saveSelectionState,
    clearSelectedProduct: clearSelectedProduct,
    formatProductRate: formatProductRate,
    getProductStatusLabel: getProductStatusLabel,
    openCatalogueLightbox: openCatalogueLightbox,
    renderCategoryCatalogue: renderCategoryCatalogue
    ,
    renderSelectionBanner: renderSelectionBanner
  };
}());
