(function () {
  const PRODUCT_LIBRARY = window.OperonProducts;

  if (!PRODUCT_LIBRARY) {
    return;
  }

  function getCategories() {
    return PRODUCT_LIBRARY.getCategoryList();
  }

  function getRangesByCategory(category) {
    return PRODUCT_LIBRARY.getRangesByCategory(category).filter(function (range) {
      return range && range.category === category;
    });
  }

  function getColoursByRange(rangeId) {
    return PRODUCT_LIBRARY.getColoursByRange(rangeId);
  }

  function getDefaultRecommendation(category) {
    const product = PRODUCT_LIBRARY.getDefaultRecommendation(category);
    if (product) {
      return product;
    }

    const products = PRODUCT_LIBRARY.getProductsByCategory(category);
    return products.length ? products[0] : PRODUCT_LIBRARY.getEstimateProduct(category);
  }

  function getStoredSelection() {
    return PRODUCT_LIBRARY.getStoredSelectionState();
  }

  function saveSelection(selection) {
    const resolved = resolveSelectedProduct(selection);
    PRODUCT_LIBRARY.saveSelectionState({
      selectedProductId: resolved.product ? resolved.product.id : "",
      selectedRangeId: resolved.rangeId || "",
      selectedCategory: resolved.category || "",
      selectedColour: resolved.selectionMode === "range_then_colour" ? (resolved.selectedColour || "") : "",
      productSelectionMode: resolved.selectionMode || ""
    });
    return resolved;
  }

  function resolveSelectedProduct(selection) {
    const settings = Object.assign({
      category: "",
      choiceMode: "",
      rangeId: "",
      productId: "",
      selectedColour: "",
      selectionMode: ""
    }, selection || {});

    const category = settings.category || "hybrid";
    const explicitProduct = settings.productId ? PRODUCT_LIBRARY.getProductById(settings.productId) : null;
    const choiceMode = settings.choiceMode || (explicitProduct ? "choose_range" : "decide_later");

    if (choiceMode === "decide_later") {
      return {
        category: category,
        choiceMode: choiceMode,
        selectionMode: settings.selectionMode || "",
        rangeId: "",
        selectedColour: "",
        product: null,
        productId: ""
      };
    }

    if (choiceMode === "recommend") {
      const recommendation = getDefaultRecommendation(category);
      return {
        category: category,
        choiceMode: choiceMode,
        selectionMode: recommendation.selectionMode || "range_only",
        rangeId: recommendation.rangeId || "",
        selectedColour: recommendation.selectionMode === "range_then_colour" ? (recommendation.colour || "") : "",
        product: recommendation.isEstimate ? null : recommendation,
        productId: recommendation.isEstimate ? "" : recommendation.id,
        usedFallbackEstimate: !!recommendation.isEstimate
      };
    }

    const selectedRangeId = settings.rangeId || (explicitProduct ? explicitProduct.rangeId : "");
    const selectedRangeProducts = selectedRangeId ? PRODUCT_LIBRARY.getProductsByRangeId(selectedRangeId) : [];
    const representativeProduct = selectedRangeId ? PRODUCT_LIBRARY.getRepresentativeProductByRangeId(selectedRangeId) : null;
    const mode = settings.selectionMode
      || (representativeProduct ? representativeProduct.selectionMode : "")
      || (category === "engineered" ? "range_then_colour" : "range_only");

    if (!selectedRangeId || !selectedRangeProducts.length || !representativeProduct) {
      return {
        category: category,
        choiceMode: "decide_later",
        selectionMode: mode,
        rangeId: "",
        selectedColour: "",
        product: null,
        productId: ""
      };
    }

    if (mode === "range_only") {
      return {
        category: category,
        choiceMode: choiceMode,
        selectionMode: mode,
        rangeId: selectedRangeId,
        selectedColour: "",
        product: representativeProduct,
        productId: representativeProduct.id
      };
    }

    const selectedColour = settings.selectedColour || (explicitProduct ? explicitProduct.colour : "");
    const selectedColourProduct = selectedRangeProducts.find(function (product) {
      return product.colour === selectedColour || product.id === settings.productId;
    });

    if (selectedColourProduct) {
      return {
        category: category,
        choiceMode: choiceMode,
        selectionMode: mode,
        rangeId: selectedRangeId,
        selectedColour: selectedColourProduct.colour || "",
        product: selectedColourProduct,
        productId: selectedColourProduct.id
      };
    }

    return {
      category: category,
      choiceMode: choiceMode,
      selectionMode: mode,
      rangeId: selectedRangeId,
      selectedColour: "",
      product: null,
      productId: ""
    };
  }

  window.OperonProductSelection = {
    getCategories: getCategories,
    getRangesByCategory: getRangesByCategory,
    getColoursByRange: getColoursByRange,
    getDefaultRecommendation: getDefaultRecommendation,
    getStoredSelection: getStoredSelection,
    saveSelection: saveSelection,
    resolveSelectedProduct: resolveSelectedProduct
  };
}());
