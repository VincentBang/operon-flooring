(function () {
  const STORAGE_KEY = "operon_selected_product";
  const STORAGE_ID_KEY = "operon_selected_product_id";
  const CATEGORY_STORAGE_KEY = "operon_selected_product_category";
  const RANGE_STORAGE_KEY = "operon_selected_range_id";
  const COLOUR_STORAGE_KEY = "operon_selected_colour";
  const SELECTION_MODE_STORAGE_KEY = "operon_selected_product_selection_mode";
  const RANGE_CONFIG = {
    hybrid: {
      "ETF Hybrid 7.0mm": {
        rangeId: "hybrid-etf-7mm",
        rangeLabel: "ETF 7.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-7mm-hybrid-antique-oak",
        isDefaultRecommendation: true,
        customerLabel: "ETF 7.0mm Waterproof Hybrid Flooring"
      },
      "ETF Hybrid 8.0mm": {
        rangeId: "hybrid-etf-8mm",
        rangeLabel: "ETF 8.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-8mm-hybrid-alaskan-oak",
        customerLabel: "ETF 8.0mm Waterproof Hybrid Flooring"
      },
      "ETF Hybrid 9.0mm": {
        rangeId: "hybrid-etf-9mm",
        rangeLabel: "ETF 9.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-9mm-hybrid-alaskan-oak",
        customerLabel: "ETF 9.0mm Waterproof Hybrid Flooring"
      }
    },
    laminate: {},
    engineered: {}
  };

  // Update pricePerM2 here when supplier price changes.
  // Do not hardcode product prices across multiple pages.
  // Product pages should read from this central data file.
  // TODO: Replace remaining sample catalogue rows with confirmed supplier ranges and imagery.
  const CATEGORY_META = {
    laminate: {
      id: "laminate",
      label: "Laminate Flooring",
      shortDescription: "Cost-conscious flooring with straightforward installation.",
      pricePerM2: 38,
      pageUrl: "laminate-flooring-sydney.html",
      catalogueStatus: "estimate_only"
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
      catalogueStatus: "estimate_only"
    }
  };

  const PRODUCTS = {
    laminate: [],
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
    engineered: []
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
    const imageUrl = product.imageUrl || product.image || "";
    const imageAlt = product.imageAlt || product.alt || [product.brand, product.range, product.colour, "flooring sample"].filter(Boolean).join(" ");
    const galleryImages = normaliseGalleryImages(product, PRODUCT_GALLERY_MAP[product.id] || []);
    const category = product.category || fallbackCategory || "";
    const rangeId = inferRangeId(product, category);
    const rangeLabel = inferRangeLabel(product, category);
    const selectionMode = inferSelectionMode(product, category);
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
    return {
      id: meta.id + "-estimate",
      category: meta.id,
      brand: "Operon Estimate",
      range: meta.label,
      colour: "Standard estimate",
      pricePerM2: meta.pricePerM2,
      installRate: null,
      imageUrl: "",
      image: "",
      description: meta.shortDescription,
      features: [],
      suitableFor: [],
      active: true,
      isEstimate: true,
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

  function openCatalogueLightbox(product) {
    if (!product) {
      return;
    }

    const modal = ensureCatalogueLightbox();
    modal.__product = product;
    modal.__galleryImages = (product.galleryImages || []).length
      ? product.galleryImages.slice()
      : normaliseGalleryImages(product, []);
    modal.__galleryIndex = 0;

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

  function closeCatalogueLightbox() {
    const modal = document.getElementById("catalogueLightbox");
    if (!modal) {
      return;
    }

    modal.hidden = true;
    document.body.classList.remove("catalogue-lightbox-open");
  }

  function renderCategoryCatalogue(options) {
    const settings = Object.assign({
      category: "",
      targetId: "",
      statusId: "",
      limit: 0,
      quoteUrl: "index.html?from=product#quoteForm",
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
      quoteUrl: "index.html?from=product#quoteForm"
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
          : getProductLabel(storedProduct) + " · Price to be confirmed. Standard " + categoryMeta.label.toLowerCase() + " estimate used until review.");
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
    text.textContent = "Choose a product to load it into the quote. If the exact product price is still pending, the quote will use the standard " + categoryMeta.label.toLowerCase() + " estimate until review.";
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
