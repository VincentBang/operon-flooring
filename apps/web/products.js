(function () {
  const STORAGE_KEY = "operon_selected_product";
  const CATEGORY_STORAGE_KEY = "operon_selected_product_category";

  // Update pricePerM2 here when supplier price changes.
  // Do not hardcode product prices across multiple pages.
  // Product pages should read from this central data file.
  // TODO: Replace sample catalogue rows with confirmed supplier ranges and imagery.
  const CATEGORY_META = {
    laminate: {
      id: "laminate",
      label: "Laminate Flooring",
      shortDescription: "Cost-conscious flooring with straightforward installation.",
      pricePerM2: 38,
      installRate: 27,
      pageUrl: "laminate-flooring-sydney.html"
    },
    hybrid: {
      id: "hybrid",
      label: "Hybrid Flooring",
      shortDescription: "Water-friendly plank flooring for broad residential use.",
      pricePerM2: 52,
      installRate: 31,
      pageUrl: "hybrid-flooring-sydney.html"
    },
    engineered: {
      id: "engineered",
      label: "Engineered Timber",
      shortDescription: "Premium timber look with a stronger material allowance.",
      pricePerM2: 88,
      installRate: 39,
      pageUrl: "engineered-timber-flooring-sydney.html"
    }
  };

  const PRODUCTS = {
    laminate: [
      {
        id: "laminate-operon-select-essential-natural-oak",
        category: "laminate",
        brand: "Operon Select",
        range: "Essential 8mm",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#bf9b74",
        pricePerM2: 38,
        installRate: 27,
        image: "",
        description: "A balanced laminate option for bedrooms, living rooms and investment updates.",
        features: ["AC4 wear layer", "Floating installation", "Low-maintenance finish"],
        suitableFor: ["Budget projects", "Apartments", "Dry internal rooms"]
      },
      {
        id: "laminate-operon-select-signature-light-oak",
        category: "laminate",
        brand: "Operon Select",
        range: "Signature 8mm",
        colour: "Light Oak",
        tone: "light oak",
        swatch: "#d4b692",
        pricePerM2: 42,
        installRate: 27,
        image: "",
        description: "A lighter timber-look laminate for customers who want a brighter interior finish.",
        features: ["AC4 wear layer", "Matt texture", "Floating installation"],
        suitableFor: ["Family homes", "Bedrooms", "Living areas"]
      },
      {
        id: "laminate-operon-select-signature-smoked-oak",
        category: "laminate",
        brand: "Operon Select",
        range: "Signature 8mm",
        colour: "Smoked Oak",
        tone: "dark",
        swatch: "#7b634f",
        pricePerM2: 44,
        installRate: 28,
        image: "",
        description: "A deeper laminate colour suited to contrast palettes and more defined interior styling.",
        features: ["AC4 wear layer", "Floating installation", "Low sheen finish"],
        suitableFor: ["Feature interiors", "Living rooms", "Dry internal rooms"]
      }
    ],
    hybrid: [
      {
        id: "hybrid-operon-select-shield-coastal-oak",
        category: "hybrid",
        brand: "Operon Select",
        range: "Hybrid Shield",
        colour: "Coastal Oak",
        tone: "light oak",
        swatch: "#c9ab84",
        pricePerM2: 52,
        installRate: 31,
        image: "",
        description: "A practical hybrid flooring option with a light oak look for everyday Sydney homes.",
        features: ["Water-resistant core", "Floating installation", "Low-maintenance finish"],
        suitableFor: ["Apartments", "Kitchens", "Family homes"]
      },
      {
        id: "hybrid-operon-select-shield-natural-oak",
        category: "hybrid",
        brand: "Operon Select",
        range: "Hybrid Shield",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#b48d66",
        pricePerM2: 56,
        installRate: 31,
        image: "",
        description: "A balanced hybrid range for renovation projects needing durability and moisture resistance.",
        features: ["Water-resistant core", "Floating installation", "Durable wear layer"],
        suitableFor: ["Busy households", "Living areas", "Renovations"]
      },
      {
        id: "hybrid-operon-select-shield-warm-oak",
        category: "hybrid",
        brand: "Operon Select",
        range: "Hybrid Shield",
        colour: "Warm Oak",
        tone: "walnut",
        swatch: "#9b724f",
        pricePerM2: 58,
        installRate: 32,
        image: "",
        description: "A warmer hybrid colour for customers who want more timber character without moving into engineered timber.",
        features: ["Water-resistant core", "Floating installation", "Textured plank finish"],
        suitableFor: ["Family homes", "Apartments", "Kitchens"]
      }
    ],
    engineered: [
      {
        id: "engineered-operon-select-reserve-european-oak",
        category: "engineered",
        brand: "Operon Select",
        range: "Timber Reserve",
        colour: "European Oak",
        tone: "light oak",
        swatch: "#c8a67e",
        pricePerM2: 88,
        installRate: 39,
        image: "",
        description: "A clean engineered timber selection for customers prioritising a natural oak finish.",
        features: ["Real timber veneer", "Multi-layer stability", "Premium visual grade"],
        suitableFor: ["Premium homes", "Living areas", "Bedrooms"]
      },
      {
        id: "engineered-operon-select-reserve-natural-oak",
        category: "engineered",
        brand: "Operon Select",
        range: "Timber Reserve",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#b48961",
        pricePerM2: 94,
        installRate: 39,
        image: "",
        description: "A balanced engineered timber option for customers who want a warm timber look without going too dark.",
        features: ["Real timber veneer", "Multi-layer stability", "Refined timber grain"],
        suitableFor: ["Premium residential", "Hallways", "Open-plan living"]
      },
      {
        id: "engineered-operon-select-reserve-walnut-oak",
        category: "engineered",
        brand: "Operon Select",
        range: "Timber Reserve",
        colour: "Walnut Oak",
        tone: "dark",
        swatch: "#71543f",
        pricePerM2: 102,
        installRate: 41,
        image: "",
        description: "A darker engineered timber look for customers wanting a more defined and premium floor finish.",
        features: ["Real timber veneer", "Multi-layer stability", "Deeper character grain"],
        suitableFor: ["Premium homes", "Feature interiors", "High-end renovations"]
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function listAllProducts() {
    return Object.keys(PRODUCTS).reduce(function (accumulator, category) {
      return accumulator.concat(PRODUCTS[category]);
    }, []);
  }

  function getProductById(id) {
    return listAllProducts().find(function (product) {
      return product.id === id;
    }) || null;
  }

  function getProductsByCategory(category) {
    return clone(PRODUCTS[category] || []);
  }

  function getCategoryMeta(category) {
    return clone(CATEGORY_META[category] || null);
  }

  function getCategoryList() {
    return Object.keys(CATEGORY_META).map(function (key) {
      return getCategoryMeta(key);
    });
  }

  function getEstimateProduct(category) {
    const meta = CATEGORY_META[category] || CATEGORY_META.hybrid;
    return {
      id: meta.id + "-estimate",
      category: meta.id,
      brand: "Operon Estimate",
      range: meta.label,
      colour: "Standard estimate",
      pricePerM2: meta.pricePerM2,
      installRate: meta.installRate,
      image: "",
      description: meta.shortDescription,
      features: [],
      suitableFor: [],
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

    return [product.brand, product.range, product.colour].filter(Boolean).join(" / ");
  }

  function getStoredProduct() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.id) {
        return null;
      }

      const latest = getProductById(parsed.id);
      return latest ? Object.assign({}, latest) : parsed;
    } catch (error) {
      return null;
    }
  }

  function saveSelectedProduct(product) {
    if (!product || !product.id) {
      return;
    }

    const latest = getProductById(product.id) || product;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(latest));
    localStorage.setItem(CATEGORY_STORAGE_KEY, latest.category || "");
  }

  function clearSelectedProduct() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getStoredCategory() {
    return localStorage.getItem(CATEGORY_STORAGE_KEY) || "";
  }

  function saveSelectedCategory(category) {
    if (category) {
      localStorage.setItem(CATEGORY_STORAGE_KEY, category);
    }
  }

  function renderProductCard(product) {
    const features = (product.features || []).slice(0, 2).map(function (feature) {
      return '<span class="catalogue-pill">' + feature + "</span>";
    }).join("");
    const suitability = (product.suitableFor || []).slice(0, 2).join(" · ");

    return (
      '<article class="catalogue-card" data-product-card="' + product.id + '">' +
        '<div class="catalogue-card-top">' +
          '<div class="catalogue-swatch" style="background:' + product.swatch + ';"></div>' +
          '<div class="catalogue-copy">' +
            '<span class="catalogue-brand">' + product.brand + "</span>" +
            "<h3>" + product.range + "</h3>" +
            '<p class="catalogue-colour">' + product.colour + "</p>" +
          "</div>" +
        "</div>" +
        '<p class="catalogue-description">' + product.description + "</p>" +
        '<div class="catalogue-pills">' + features + "</div>" +
        '<div class="catalogue-meta">' +
          '<strong>' + product.pricePerM2.toFixed(0) + " /m²</strong>" +
          "<span>" + suitability + "</span>" +
        "</div>" +
        '<button class="button catalogue-select-button" type="button" data-select-product="' + product.id + '">Select for Quote</button>' +
      "</article>"
    );
  }

  function renderCategoryCatalogue(options) {
    const settings = Object.assign({
      category: "",
      targetId: "",
      statusId: "",
      quoteUrl: "index.html#quoteForm",
      successMessage: "Product selected. Continue to quote."
    }, options || {});

    const target = document.getElementById(settings.targetId);
    if (!target) {
      return;
    }

    const products = getProductsByCategory(settings.category);
    const storedProduct = getStoredProduct();
    const status = settings.statusId ? document.getElementById(settings.statusId) : null;

    target.innerHTML = products.map(function (product) {
      const selectedClass = storedProduct && storedProduct.id === product.id ? " selected" : "";
      return renderProductCard(product).replace('class="catalogue-card"', 'class="catalogue-card' + selectedClass + '"');
    }).join("");

    target.addEventListener("click", function (event) {
      const button = event.target.closest("[data-select-product]");
      if (!button) {
        return;
      }

      const product = getProductById(button.getAttribute("data-select-product"));
      if (!product) {
        return;
      }

      saveSelectedProduct(product);
      if (window.OperonTracking) {
        window.OperonTracking.trackEvent("product_selected", {
          category: product.category,
          brand: product.brand,
          range: product.range,
          colour: product.colour,
          pricePerM2: product.pricePerM2
        });
      }

      if (status) {
        status.textContent = settings.successMessage;
        status.dataset.state = "success";
      }

      window.location.href = settings.quoteUrl;
    });
  }

  function renderSelectionBanner(options) {
    const settings = Object.assign({
      category: "",
      titleId: "",
      textId: "",
      clearButtonId: "",
      quoteUrl: "index.html#quoteForm"
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
      text.textContent = storedProduct.brand + " / " + storedProduct.range + " / " + storedProduct.colour + " · $" + storedProduct.pricePerM2.toFixed(0) + "/m²";
      clearButton.textContent = "Use " + categoryMeta.label.toLowerCase() + " estimate instead";
      clearButton.onclick = function () {
        clearSelectedProduct();
        saveSelectedCategory(settings.category);
        window.location.href = settings.quoteUrl;
      };
      return;
    }

    title.textContent = "No specific " + categoryMeta.label.toLowerCase() + " selected yet";
    text.textContent = "Select a product to carry its price into the quote, or keep the standard category estimate and confirm the final range later.";
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
    CATEGORY_STORAGE_KEY: CATEGORY_STORAGE_KEY,
    categoryMeta: CATEGORY_META,
    getCategoryList: getCategoryList,
    getCategoryMeta: getCategoryMeta,
    getProductsByCategory: getProductsByCategory,
    getProductById: getProductById,
    getEstimateProduct: getEstimateProduct,
    getProductLabel: getProductLabel,
    getStoredProduct: getStoredProduct,
    getStoredCategory: getStoredCategory,
    saveSelectedCategory: saveSelectedCategory,
    saveSelectedProduct: saveSelectedProduct,
    clearSelectedProduct: clearSelectedProduct,
    renderCategoryCatalogue: renderCategoryCatalogue
    ,
    renderSelectionBanner: renderSelectionBanner
  };
}());
