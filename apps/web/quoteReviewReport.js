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
    access: "Access/apartment conditions",
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
    access: "Access, parking, lift, strata or apartment conditions are not clearly specified.",
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
    "Are access, parking, lift, strata or apartment restrictions included in the price?"
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

  function hasProductSpecification(fields, primaryLine) {
    return Boolean(
      clean(fields && (fields.productBrand || fields.brand)) ||
      clean(fields && (fields.productRange || fields.range)) ||
      clean(fields && (fields.productColour || fields.colour)) ||
      clean(primaryLine && (primaryLine.brand || primaryLine.range))
    );
  }

  function getMissingScopeItems(fields, primaryLine) {
    const items = [];
    if (!hasProductSpecification(fields, primaryLine)) items.push("product_specification");
    if (!scopeIsClear(fields, "underlay")) items.push("underlay");
    if (!scopeIsClear(fields, "floorPreparation")) items.push("floor_preparation");
    if (!scopeIsClear(fields, "removal")) items.push("removal");
    if (!scopeIsClear(fields, "disposal")) items.push("disposal");
    if (!scopeIsClear(fields, "moistureProtection")) items.push("moisture_protection");
    if (!scopeIsClear(fields, "skirting") && !scopeIsClear(fields, "scotia") && !scopeIsClear(fields, "doorTrimming")) items.push("trims");
    items.push("access");
    if (!scopeIsClear(fields, "stairs")) items.push("stairs");
    return items.map(function (key) {
      return {
        key: key,
        label: SCOPE_LABELS[key],
        note: SCOPE_NOTES[key]
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
    const hasCore = Boolean(
      normalized.documentType &&
      normalized.productScopeLine &&
      normalized.quantityM2 &&
      normalized.unitPriceExGst &&
      (normalized.subtotalExGst || normalized.totalIncGst)
    );
    if (hasCore) return "High";
    if (normalized.quantityM2 || normalized.unitPriceExGst || normalized.totalIncGst) return "Medium";
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
    const missingScopeItems = getMissingScopeItems(fields, primaryLine);
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
      questionsToAsk: QUESTIONS.slice(),
      rawFields: fields
    };
    normalized.extractionConfidence = getExtractionConfidence(normalized);
    normalized.comparisonLevel = getComparisonLevel(normalized);
    normalized.decisionConfidence = getDecisionConfidence(normalized.comparisonLevel, normalized.missingScopeItems);
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
      return "The uploaded document shows a price basis for " +
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
