(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.OperonQuoteReviewReport = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SCOPE_LABELS = {
    product_specification: "Product brand/range/specification",
    underlay: "Underlay/acoustic layer",
    floor_preparation: "Floor preparation or levelling",
    removal: "Existing floor removal",
    disposal: "Take-away disposal",
    moisture_protection: "Moisture/subfloor checks",
    trims: "Skirting/scotia/trims",
    access: "Site/apartment conditions",
    stairs: "Stairs/stair nosing"
  };

  const SCOPE_NOTES = {
    product_specification: "The uploaded document does not clearly show brand, range, colour and full specification.",
    underlay: "Underlay or acoustic layer is not clearly specified.",
    floor_preparation: "Floor preparation or levelling is not clearly specified.",
    removal: "Existing floor removal is not clearly specified.",
    disposal: "Take-away disposal is not clearly specified.",
    moisture_protection: "Moisture or subfloor checks are not clearly specified.",
    trims: "Skirting, scotia, trims and transitions are not clearly specified.",
    access: "Site, lift, strata or apartment conditions are not clearly specified.",
    stairs: "Not mentioned. Relevant only if stairs or step areas are part of the project."
  };

  const QUESTIONS = [
    "What exact product brand, range, colour and specification is included?",
    "Is underlay included, and does it meet any apartment/acoustic requirement?",
    "Is existing floor removal included?",
    "Is take-away disposal included?",
    "Is floor preparation or levelling included?",
    "Are moisture checks or subfloor checks included where needed?",
    "Are skirting, scotia, trims and transitions included or priced separately?",
    "Are stairs, stair nosings or step trims included if the job has stairs?",
    "Are site, lift, strata or apartment requirements clearly listed?"
  ];

  const TOP_PRIORITY_KEYS = [
    "product_specification",
    "area_basis",
    "installation_scope",
    "removal",
    "disposal",
    "underlay",
    "stairs",
    "floor_preparation",
    "trims",
    "gst_status",
    "access"
  ];

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function number(value) {
    if (value === null || typeof value === "undefined" || value === "") return null;
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function firstValue() {
    for (let index = 0; index < arguments.length; index += 1) {
      const value = arguments[index];
      if (value !== null && typeof value !== "undefined" && clean(value)) return value;
    }
    return "";
  }

  function getLineItems(fields) {
    if (!fields) return [];
    if (Array.isArray(fields.lineItems)) return fields.lineItems;
    if (Array.isArray(fields.line_items)) return fields.line_items;
    return [];
  }

  function getPrimaryLine(fields) {
    return getLineItems(fields)[0] || null;
  }

  function inferFlooringType(text) {
    const lower = clean(text).toLowerCase();
    if (/hybrid|spc|stone plastic|solid polymer/.test(lower)) return "hybrid";
    if (/laminate/.test(lower)) return "laminate";
    if (/engineered|timber|oak|herringbone|chevron/.test(lower)) return "engineered";
    return "";
  }

  function normaliseFlooringType(value, fallbackText) {
    const raw = clean(value).toLowerCase().replace(/engineered_timber/g, "engineered");
    if (raw === "hybrid" || raw === "laminate" || raw === "engineered") return raw;
    return inferFlooringType(fallbackText || "");
  }

  function displayFlooringType(value) {
    const map = {
      hybrid: "Hybrid",
      laminate: "Laminate",
      engineered: "Engineered timber"
    };
    return map[value] || "Not clearly shown";
  }

  function scopeValue(fields, key) {
    const scope = fields && fields.scope ? fields.scope : {};
    return clean(scope[key]).toLowerCase();
  }

  function scopeIsClear(fields, key) {
    const value = scopeValue(fields, key);
    return value === "included" || value === "excluded";
  }

  function allFieldText(fields, primaryLine) {
    const values = [];
    (function collect(value) {
      if (value === null || typeof value === "undefined") return;
      if (typeof value === "string" || typeof value === "number") {
        values.push(String(value));
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      if (typeof value === "object") {
        Object.keys(value).forEach(function (key) {
          collect(value[key]);
        });
      }
    })(fields || {});
    return clean([
      values.join(" "),
      primaryLine && (primaryLine.rawDescription || primaryLine.raw_description || primaryLine.label)
    ].filter(Boolean).join(" ")).toLowerCase();
  }

  function hasStairsContext(fields, primaryLine) {
    const combined = allFieldText(fields, primaryLine);
    return scopeIsClear(fields, "stairs") || /stairs?|staircase|steps?|nosing/.test(combined);
  }

  function hasAccessContext(fields, primaryLine) {
    const combined = allFieldText(fields, primaryLine);
    return scopeIsClear(fields, "access")
      || /apartment|unit|strata|body corporate|lift|elevator|parking|loading|access|commercial/.test(combined);
  }

  function hasProductSpecification(fields, primaryLine) {
    return Boolean(
      clean(fields && (fields.productBrand || fields.brand)) ||
      clean(fields && (fields.productRange || fields.range)) ||
      clean(fields && (fields.productColour || fields.colour)) ||
      clean(primaryLine && (primaryLine.brand || primaryLine.range))
    );
  }

  function getScopeReviewItems(fields, primaryLine) {
    const items = [];
    function push(key, status) {
      items.push({
        key: key,
        label: SCOPE_LABELS[key],
        note: SCOPE_NOTES[key],
        status: status || "missing"
      });
    }

    if (!hasProductSpecification(fields, primaryLine)) push("product_specification", "missing");
    if (!scopeIsClear(fields, "underlay")) push("underlay", "missing");
    if (!scopeIsClear(fields, "floorPreparation")) push("floor_preparation", "missing");
    if (!scopeIsClear(fields, "removal")) push("removal", "unclear");
    if (!scopeIsClear(fields, "disposal")) push("disposal", "unclear");
    if (!scopeIsClear(fields, "moistureProtection")) push("moisture_protection", "confirm_if_applicable");
    if (!scopeIsClear(fields, "skirting") && !scopeIsClear(fields, "scotia") && !scopeIsClear(fields, "doorTrimming")) push("trims", "unclear");
    if (!scopeIsClear(fields, "access")) {
      push("access", hasAccessContext(fields, primaryLine) ? "missing" : "confirm_if_applicable");
    }
    if (!scopeIsClear(fields, "stairs")) {
      push("stairs", hasStairsContext(fields, primaryLine) ? "missing" : "confirm_if_applicable");
    }
    return items;
  }

  function getMissingScopeItems(fields, primaryLine) {
    return getScopeReviewItems(fields, primaryLine).filter(function (item) {
      return item.status === "missing" || item.status === "unclear";
    }).map(function (item) {
      return {
        key: item.key,
        label: item.label,
        note: item.note,
        status: item.status
      };
    });
  }

  function getProductMatch(databaseComparison) {
    const matches = databaseComparison && Array.isArray(databaseComparison.productMatches)
      ? databaseComparison.productMatches
      : [];
    return matches[0] || null;
  }

  function getProductMatchStatus(match) {
    const score = number(match && match.matchScore) || 0;
    if (!match || score < 50) {
      return {
        status: "not_confirmed",
        label: "Product match not confirmed",
        customerText: "Uploaded document only lists category/specification. Brand, colour, range and full product specification are not shown.",
        visibleMatch: null
      };
    }
    if (score < 70) {
      return {
        status: "category_only",
        label: "Possible category match only",
        customerText: "The uploaded document is not specific enough for a product-level match.",
        visibleMatch: null
      };
    }
    if (score < 85) {
      return {
        status: "possible_product_match",
        label: "Possible product match",
        customerText: "Product match still needs brand, range and colour confirmed.",
        visibleMatch: match
      };
    }
    return {
      status: "likely_product_match",
      label: "Likely product match",
      customerText: "Product match appears likely, but final confirmation is still required.",
      visibleMatch: match
    };
  }

  function getExtractionConfidence(normalized) {
    const hasCompletePriceBasis = Boolean(
      normalized.quantityM2 &&
      normalized.unitPriceExGst &&
      normalized.subtotalExGst &&
      normalized.gstAmount &&
      normalized.totalIncGst
    );
    if (hasCompletePriceBasis) return "High";
    if (normalized.quantityM2 || normalized.unitPriceExGst || normalized.subtotalExGst || normalized.totalIncGst) return "Medium";
    return "Low";
  }

  function getComparisonLevel(normalized) {
    if (!normalized.quantityM2 || (!normalized.unitPriceExGst && !normalized.totalIncGst)) {
      return "Not comparable";
    }
    if (!normalized.flooringType || normalized.flooringType === "unknown") {
      return "Not comparable";
    }
    if (!normalized.productSpecificationConfirmed || normalized.missingScopeItems.length >= 4) {
      return "Category-level only";
    }
    if (normalized.productSpecificationConfirmed && normalized.missingScopeItems.length >= 2) {
      return "Product-level";
    }
    return "Scope-level";
  }

  function getDecisionConfidence(comparisonLevel, missingScopeItems) {
    if (comparisonLevel === "Scope-level") return "High";
    if (comparisonLevel === "Product-level") return "Medium";
    if (comparisonLevel === "Category-level only" && missingScopeItems.length <= 4) return "Medium";
    if (comparisonLevel === "Category-level only") return "Low to medium";
    return "Low";
  }

  function getQuoteReadiness(normalized) {
    if (!normalized.quantityM2 || (!normalized.unitPriceExGst && !normalized.totalIncGst)) {
      return "not_ready_to_compare";
    }
    if (normalized.comparisonLevel === "Not comparable") {
      return "not_ready_to_compare";
    }
    if (normalized.comparisonLevel === "Category-level only" || normalized.missingScopeItems.length >= 3) {
      return "partly_clear";
    }
    return "clear_enough_to_compare";
  }

  function getReportConfidence(normalized) {
    const hasUpload = Boolean(normalized && normalized.rawFields && Object.keys(normalized.rawFields).length);
    const hasArea = Boolean(normalized && normalized.quantityM2);
    const hasTotal = Boolean(normalized && normalized.totalIncGst);
    const hasProduct = Boolean(normalized && normalized.flooringType && normalized.flooringType !== "unknown");
    const hasInclusions = Array.isArray(normalized && normalized.scopeReviewItems)
      && normalized.scopeReviewItems.length > normalized.missingScopeItems.length;

    if (hasUpload && hasArea && hasTotal && hasProduct && hasInclusions) {
      return "High";
    }
    if (hasUpload && (hasArea || hasTotal || hasProduct)) {
      return "Medium";
    }
    return "Low";
  }

  function countClearScopeItems(fields) {
    return [
      "supply",
      "installation",
      "underlay",
      "removal",
      "disposal",
      "floorPreparation",
      "moistureProtection",
      "skirting",
      "scotia",
      "doorTrimming",
      "access",
      "stairs"
    ].filter(function (key) {
      return scopeIsClear(fields, key);
    }).length;
  }

  function hasTaxBasis(fields, normalized, primaryLine) {
    const combined = allFieldText(fields, primaryLine);
    return Boolean(
      normalized.gstAmount ||
      normalized.totalIncGst ||
      clean(fields && (fields.gstStatus || fields.gst_status || fields.taxBasis || fields.tax_basis)) ||
      /gst|tax invoice|inc gst|ex gst|inclusive of gst|includes gst/.test(combined)
    );
  }

  function hasTermsOrExpiry(fields, normalized, primaryLine) {
    const combined = allFieldText(fields, primaryLine);
    return Boolean(
      normalized.dueDate ||
      clean(fields && (
        fields.expiryDate ||
        fields.expiry_date ||
        fields.quoteExpiry ||
        fields.quote_expiry ||
        fields.quoteExpiryDate ||
        fields.quote_expiry_date ||
        fields.paymentTerms ||
        fields.payment_terms ||
        fields.terms
      )) ||
      /expiry|expires|valid until|payment terms|deposit|due date|balance due/.test(combined)
    );
  }

  function getBusinessDetailChecks(normalized, fields, primaryLine) {
    const combined = allFieldText(fields, primaryLine);
    const abnValue = clean(firstValue(
      fields && fields.abn,
      fields && fields.ABN,
      fields && fields.businessAbn,
      fields && fields.business_abn,
      fields && fields.supplierAbn,
      fields && fields.supplier_abn,
      fields && fields.abnNumber,
      fields && fields.abn_number
    ));
    return [
      {
        label: "Business name",
        shown: Boolean(normalized.businessShownOnDocument),
        value: normalized.businessShownOnDocument || "Not clearly shown"
      },
      {
        label: "ABN",
        shown: Boolean(abnValue || /\babn\b/.test(combined)),
        value: abnValue || (/\babn\b/.test(combined) ? "Shown in document text" : "Not clearly shown")
      },
      {
        label: "GST status",
        shown: hasTaxBasis(fields, normalized, primaryLine),
        value: hasTaxBasis(fields, normalized, primaryLine) ? "Shown or inferable from the quote" : "Not clearly shown"
      },
      {
        label: "Expiry or terms",
        shown: hasTermsOrExpiry(fields, normalized, primaryLine),
        value: hasTermsOrExpiry(fields, normalized, primaryLine) ? "Shown or referenced" : "Not clearly shown"
      }
    ];
  }

  function getDocumentQuality(normalized, fields, primaryLine) {
    const hasBusiness = Boolean(normalized.businessShownOnDocument);
    const hasArea = Boolean(normalized.quantityM2);
    const hasTotal = Boolean(normalized.totalIncGst);
    const hasProductLine = Boolean(normalized.productScopeLine && normalized.flooringType !== "unknown");
    const clearScopeCount = countClearScopeItems(fields);
    const hasTax = hasTaxBasis(fields, normalized, primaryLine);

    if (hasBusiness && hasArea && hasTotal && hasTax && hasProductLine && clearScopeCount >= 3) {
      return {
        label: "Strong",
        key: "strong",
        summary: "The document shows the main business, price, product and scope details needed for a stronger review."
      };
    }

    if ((hasArea || hasTotal) && (hasProductLine || clearScopeCount > 0 || hasBusiness)) {
      return {
        label: "Partial",
        key: "partial",
        summary: "The document has useful quote detail, but some product, scope or business details still need confirmation."
      };
    }

    return {
      label: "Weak",
      key: "weak",
      summary: "The document has limited written detail, so the review can only give high-level guidance."
    };
  }

  function getTopItemsToConfirm(normalized) {
    const items = [];

    function push(key, label, note) {
      if (items.some(function (item) { return item.key === key; })) {
        return;
      }
      items.push({
        key: key,
        label: label,
        note: note
      });
    }

    if (!normalized.productSpecificationConfirmed) {
      push("product_specification", "Product brand, range, colour and specification", "The written quote does not clearly identify the exact product.");
    }
    if (!normalized.quantityM2) {
      push("area_basis", "Area basis", "The measured area is not clearly shown on the written quote.");
    }
    if (!normalized.rawFields || !scopeIsClear(normalized.rawFields, "installation")) {
      push("installation_scope", "Installation scope", "The written quote does not clearly confirm the installation allowance.");
    }
    if (!normalized.gstAmount && !normalized.totalIncGst) {
      push("gst_status", "GST status", "The quote does not clearly show whether the total includes GST.");
    }

    normalized.missingScopeItems.forEach(function (item) {
      if (item.key === "underlay") {
        push("underlay", "Underlay or acoustic layer", "Underlay or acoustic requirements are not clearly shown.");
      } else if (item.key === "removal") {
        push("removal", "Existing floor removal", "Removal is not clearly shown.");
      } else if (item.key === "disposal") {
        push("disposal", "Take-away disposal", "Disposal is not clearly shown.");
      } else if (item.key === "floor_preparation") {
        push("floor_preparation", "Floor preparation or levelling", "Preparation allowances are not clearly shown.");
      } else if (item.key === "trims") {
        push("trims", "Trims, skirting or scotia", "Finishing items are not clearly shown.");
      } else if (item.key === "stairs") {
        push("stairs", "Stairs or stair nosing", "Stair work is not clearly shown.");
      } else if (item.key === "access") {
        push("access", "Site, lift or apartment conditions", "Site or access conditions are not clearly shown.");
      }
    });

    items.sort(function (a, b) {
      return TOP_PRIORITY_KEYS.indexOf(a.key) - TOP_PRIORITY_KEYS.indexOf(b.key);
    });

    return items.slice(0, 3);
  }

  function getQuestionsToAsk(scopeReviewItems) {
    const active = (scopeReviewItems || []).filter(function (item) {
      return item.status === "missing" || item.status === "unclear";
    }).map(function (item) { return item.key; });
    const questions = [];
    function add(key, question) {
      if (active.indexOf(key) >= 0 && questions.indexOf(question) < 0) {
        questions.push(question);
      }
    }

    add("product_specification", "What exact product brand, range, colour and specification is included?");
    add("underlay", "Is underlay included, and does it meet any apartment/acoustic requirement?");
    add("removal", "Is existing floor removal included?");
    add("disposal", "Is take-away disposal included?");
    add("floor_preparation", "Is floor preparation or levelling included?");
    add("moisture_protection", "Are moisture checks or subfloor checks included where needed?");
    add("trims", "Are skirting, scotia, trims and transitions included or priced separately?");
    add("stairs", "Are stairs, stair nosings or step trims included for the stair areas?");
    add("access", "Are site, lift, strata or apartment requirements clearly listed?");

    if (!questions.length) {
      questions.push("Which items are still subject to site inspection before the final price is confirmed?");
    }
    return questions;
  }

  function getConfidenceDimensions(normalized) {
    const missingCount = normalized.missingScopeItems.length;
    const productStatus = normalized.productMatchStatus || "";
    const siteRiskItems = (normalized.scopeReviewItems || []).filter(function (item) {
      return (item.key === "access" || item.key === "stairs" || item.key === "moisture_protection")
        && (item.status === "missing" || item.status === "unclear");
    });

    const extraction = normalized.extractionConfidence;
    const scope = missingCount <= 1 ? "High" : missingCount <= 4 ? "Medium" : "Low";
    const product = productStatus === "likely_product_match"
      ? "High"
      : productStatus === "possible_product_match" || normalized.productSpecificationConfirmed
        ? "Medium"
        : "Low";
    const comparison = normalized.comparisonLevel === "Scope-level"
      ? "High"
      : normalized.comparisonLevel === "Product-level" || normalized.comparisonLevel === "Category-level only"
        ? "Medium"
        : "Low";
    const site = siteRiskItems.length ? (siteRiskItems.length >= 2 ? "Low" : "Medium") : "High";
    const order = { Low: 1, Medium: 2, High: 3 };
    const decision = [extraction, scope, product, comparison, site].sort(function (a, b) {
      return order[a] - order[b];
    })[0] || "Low";

    return {
      extractionConfidence: extraction,
      scopeConfidence: scope,
      productMatchConfidence: product,
      comparisonConfidence: comparison,
      siteRiskConfidence: site,
      decisionReadiness: decision
    };
  }

  function getStatusHeadline(normalized) {
    if (normalized.comparisonLevel === "Category-level only" && normalized.extractionConfidence === "High") {
      return "Readable, but not fully comparable yet";
    }
    if (normalized.comparisonLevel === "Product-level" || normalized.comparisonLevel === "Scope-level") {
      return "Comparable with caution";
    }
    return "Insufficient detail for price comparison";
  }

  function normalizeQuoteReview(state) {
    const fields = state && state.extractedQuoteFields ? state.extractedQuoteFields : {};
    const databaseComparison = state && state.databaseComparison ? state.databaseComparison : {};
    const primaryLine = getPrimaryLine(fields);
    const rawLine = clean(firstValue(
      primaryLine && (primaryLine.rawDescription || primaryLine.raw_description || primaryLine.label),
      fields.productScopeLine,
      fields.productRange,
      fields.flooringType
    ));
    const flooringType = normaliseFlooringType(
      firstValue(fields.flooringType, fields.flooring_type, primaryLine && (primaryLine.productType || primaryLine.product_type)),
      rawLine
    );
    const quantityM2 = number(firstValue(
      primaryLine && primaryLine.quantity,
      fields.quotedAreaM2,
      fields.areaM2,
      fields.area_m2
    ));
    const unitPriceExGst = number(firstValue(
      primaryLine && (primaryLine.unitPriceExGst || primaryLine.unit_price_ex_gst),
      fields.unitPriceExGst,
      fields.unit_price_ex_gst
    ));
    const subtotalExGst = number(firstValue(
      fields.quoteTotalExGst,
      fields.subtotalExGst,
      fields.subtotal_ex_gst,
      primaryLine && (primaryLine.lineTotalExGst || primaryLine.line_total_ex_gst)
    ));
    const gstAmount = number(firstValue(fields.gstAmount, fields.gstTotal, fields.gst_total, primaryLine && primaryLine.gst));
    const totalIncGst = number(firstValue(
      fields.quoteTotalIncGst,
      fields.totalIncGst,
      fields.total_inc_gst,
      primaryLine && (primaryLine.lineTotalIncGst || primaryLine.line_total_inc_gst)
    ));
    const balanceDue = number(firstValue(fields.balanceDue, fields.balance_due));
    const productSpecificationConfirmed = hasProductSpecification(fields, primaryLine);
    const scopeReviewItems = getScopeReviewItems(fields, primaryLine);
    const missingScopeItems = scopeReviewItems.filter(function (item) {
      return item.status === "missing" || item.status === "unclear";
    });
    const productMatch = getProductMatch(databaseComparison);
    const productMatchState = getProductMatchStatus(productMatch);
    const normalized = {
      documentType: clean(firstValue(fields.documentType, fields.document_type)) || "unknown",
      businessShownOnDocument: clean(firstValue(fields.supplierName, fields.supplier_name, fields.contractorName)),
      invoiceOrQuoteNumber: clean(firstValue(fields.invoiceOrQuoteNumber, fields.invoice_or_quote_number, fields.quoteNumber)),
      issueDate: clean(firstValue(fields.issueDate, fields.issue_date, fields.quoteDate)),
      dueDate: clean(firstValue(fields.dueDate, fields.due_date)),
      customerName: clean(firstValue(fields.customerName, fields.customer_name)),
      jobAddress: clean(firstValue(fields.jobAddress, fields.job_address, fields.siteAddress)),
      productScopeLine: rawLine,
      flooringType: flooringType || "unknown",
      flooringTypeLabel: displayFlooringType(flooringType),
      thicknessMm: number(firstValue(fields.thicknessMm, fields.thickness_mm, primaryLine && (primaryLine.thicknessMm || primaryLine.thickness_mm))),
      quantityM2: quantityM2,
      unitPriceExGst: unitPriceExGst,
      unitPriceIncGst: unitPriceExGst ? Math.round(unitPriceExGst * 1.1 * 100) / 100 : null,
      subtotalExGst: subtotalExGst,
      gstAmount: gstAmount,
      totalIncGst: totalIncGst,
      balanceDue: balanceDue,
      productSpecificationConfirmed: productSpecificationConfirmed,
      missingScopeItems: missingScopeItems,
      scopeReviewItems: scopeReviewItems,
      confirmIfApplicableItems: scopeReviewItems.filter(function (item) { return item.status === "confirm_if_applicable"; }),
      knownScopeItems: [
        flooringType ? "Product category identified" : "",
        quantityM2 ? "Area identified" : "",
        scopeValue(fields, "supply") === "included" ? "Flooring supply included" : "",
        scopeValue(fields, "installation") === "included" ? "Installation included" : ""
      ].filter(Boolean),
      productMatchStatus: productMatchState.status,
      productMatchLabel: productMatchState.label,
      productMatchText: productMatchState.customerText,
      productMatch: productMatchState.visibleMatch,
      questionsToAsk: getQuestionsToAsk(scopeReviewItems),
      rawFields: fields
    };
    normalized.extractionConfidence = getExtractionConfidence(normalized);
    normalized.comparisonLevel = getComparisonLevel(normalized);
    normalized.decisionConfidence = getDecisionConfidence(normalized.comparisonLevel, normalized.missingScopeItems);
    normalized.quoteReadiness = getQuoteReadiness(normalized);
    normalized.reportConfidence = getReportConfidence(normalized);
    normalized.documentQuality = getDocumentQuality(normalized, fields, primaryLine);
    normalized.businessDetailChecks = getBusinessDetailChecks(normalized, fields, primaryLine);
    normalized.confidenceDimensions = getConfidenceDimensions(normalized);
    normalized.topItemsToConfirm = getTopItemsToConfirm(normalized);
    normalized.statusHeadline = getStatusHeadline(normalized);
    normalized.recommendation = normalized.comparisonLevel === "Category-level only"
      ? "Confirm inclusions before comparing on total price alone."
      : "Use the review to confirm the remaining scope before deciding.";
    normalized.summary = buildSummary(normalized);
    return normalized;
  }

  function money(value, options) {
    const parsed = number(value);
    if (!parsed) return "";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: options && options.noCents ? 0 : 2,
      maximumFractionDigits: options && options.noCents ? 0 : 2
    }).format(parsed);
  }

  function buildSummary(normalized) {
    if (normalized.quantityM2 && normalized.unitPriceExGst && normalized.totalIncGst) {
      const basisText = normalized.extractionConfidence === "High" ? "shows a price basis" : "shows a partial price basis";
      return "The uploaded document " + basisText + " for " +
        normalized.flooringTypeLabel + (normalized.thicknessMm ? " " + normalized.thicknessMm + "mm" : "") +
        " flooring at " + normalized.quantityM2 + " m² × " + money(normalized.unitPriceExGst) +
        "/m² ex GST, with a total of " + money(normalized.totalIncGst) +
        " inc GST. However, brand/range and key scope inclusions are not clearly specified, so this should not be compared on total price only.";
    }
    return "The uploaded document has been reviewed, but the price basis is not complete enough for a reliable comparison. Confirm product, area, price and scope before comparing totals.";
  }

  return {
    normalizeQuoteReview: normalizeQuoteReview,
    money: money,
    _test: {
      getProductMatchStatus: getProductMatchStatus,
      normaliseFlooringType: normaliseFlooringType
    }
  };
});
