(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.OperonQuoteConfidence = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function number(value) {
    if (value === null || typeof value === "undefined" || value === "") return 0;
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function text(value) {
    return String(value || "").trim();
  }

  function hasMeaningfulCategory(input, result) {
    const category = text(input && (input.selectedProductCategory || input.category || input.productCategory || result && result.productCategory));
    return !!category && category !== "unknown";
  }

  function hasArea(input, result) {
    return number(result && result.realArea) || number(input && (input.realArea || input.totalAreaM2 || input.confirmedFloorplanArea));
  }

  function stairDetailCount(input) {
    if (Array.isArray(input && input.stairDetails)) {
      return input.stairDetails.reduce(function (total, item) {
        return total + Math.max(0, Math.round(number(item && item.quantity)));
      }, 0);
    }
    return Math.max(0, Math.round(number(input && input.stairsCount)));
  }

  function hasStairWidth(input) {
    return text(input && input.stairWidthKnown) === "yes" && number(input && input.stairWidthMm) > 0;
  }

  function isApartmentLike(input) {
    const type = text(input && input.propertyType);
    return type === "unit_apartment" || type === "commercial_other";
  }

  function pushUnique(items, item) {
    if (item && items.indexOf(item) < 0) {
      items.push(item);
    }
  }

  function isNotSure(value) {
    const normalised = text(value);
    return normalised === "not_sure" || normalised === "unsure";
  }

  function joinList(items) {
    if (!items.length) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + " and " + items[1];
    return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
  }

  function getNeedsConfirmationItems(input) {
    const source = input || {};
    const items = [];

    if (isNotSure(source.stairs)) pushUnique(items, "stairs");
    if (isNotSure(source.removalDecision)) pushUnique(items, "removal");
    if (source.removalDecision === "yes" && (!text(source.removalDisposal) || isNotSure(source.removalDisposal))) pushUnique(items, "disposal / take-away");
    if (isNotSure(source.floorPrepDecision)) pushUnique(items, "floor preparation");
    if (source.floorPrepDecision === "yes" && (!text(source.floorPrepType) || source.floorPrepType === "none")) pushUnique(items, "floor preparation detail");
    if (isNotSure(source.subfloorCondition) || source.subfloorCondition === "known_issues") pushUnique(items, "subfloor condition");
    if (source.floorPrepType === "heavy" || source.floorPrepType === "manual" || isNotSure(source.floorPrepType)) pushUnique(items, "floor preparation");
    if (isNotSure(source.moistureBarrier)) pushUnique(items, "moisture protection");
    if (isNotSure(source.underlayDecision)) pushUnique(items, "underlay");
    if (isNotSure(source.finishDecision)) pushUnique(items, "skirting/scotia");
    if (source.finishDecision === "yes" && (!text(source.skirtingType) || source.skirtingType === "no") && source.scotiaType !== "yes") pushUnique(items, "skirting/scotia detail");
    if (isNotSure(source.doorDecision)) pushUnique(items, "door trimming");
    if (isNotSure(source.furnitureDecision)) pushUnique(items, "furniture moving");
    if (isApartmentLike(source) && (!text(source.level) || source.level === "other_unsure" || (source.level === "level_2_plus" && !text(source.hasLift)))) pushUnique(items, "apartment site details");
    if (isApartmentLike(source) && (!text(source.parkingAccess) || isNotSure(source.parkingAccess) || source.parkingAccess === "difficult")) pushUnique(items, "site details");

    return items;
  }

  function buildNeedsConfirmationNotes(input) {
    const source = input || {};
    const items = getNeedsConfirmationItems(source);
    const notes = [];

    if (items.length) {
      notes.push("Needs confirmation before final pricing: " + joinList(items) + ".");
    }
    if (source.stairs === "yes" && !stairDetailCount(source)) {
      notes.push("Stairs are selected, but stair details need confirmation before final pricing.");
    } else if (source.stairs === "yes" && !hasStairWidth(source)) {
      notes.push("Stair allowance is included. Width and stair details should be checked before confirmation.");
    } else if (source.stairs === "yes") {
      notes.push("Stairs are included based on provided width and item count. Final site-sensitive details are still checked before booking.");
    }
    if (source.removalDecision === "yes" && (!text(source.removalDisposal) || isNotSure(source.removalDisposal))) {
      notes.push("Removal is selected. Disposal/take-away still needs confirmation.");
    }
    if (source.floorPrepDecision === "yes" && (!text(source.floorPrepType) || source.floorPrepType === "none")) {
      notes.push("Floor preparation is selected, but the preparation detail still needs confirmation.");
    } else if (source.floorPrepType === "heavy" || source.floorPrepType === "manual" || isNotSure(source.floorPrepType) || isNotSure(source.floorPrepDecision) || source.subfloorCondition === "known_issues" || isNotSure(source.subfloorCondition)) {
      notes.push("Floor preparation needs site confirmation because it can change the final scope.");
    }
    if (isNotSure(source.moistureBarrier)) {
      notes.push("Moisture protection is not confirmed yet. Concrete or ground-floor areas may need checking before final pricing.");
    }
    if (source.finishDecision === "yes" && (!text(source.skirtingType) || source.skirtingType === "no") && source.scotiaType !== "yes") {
      notes.push("Skirting or scotia is selected, but the exact finish detail still needs confirmation.");
    }

    return notes;
  }

  function containsWarning(result, pattern) {
    return Array.isArray(result && result.warnings)
      && result.warnings.some(function (warning) { return pattern.test(text(warning)); });
  }

  function capScore(score, cap, reason, output) {
    if (score > cap) {
      output.maxConfidenceReason = output.maxConfidenceReason || reason;
      return cap;
    }
    return score;
  }

  function getLabel(status) {
    if (status === "high") return "High";
    if (status === "medium") return "Medium";
    if (status === "low") return "Low";
    return "Estimate pending";
  }

  function getMessage(status) {
    if (status === "high") {
      return "High estimate confidence. Product, area and main scope details are clear enough for a strong starting estimate. Final site-sensitive items are still reviewed before booking.";
    }
    if (status === "medium") {
      return "Medium estimate confidence. The estimate is useful for planning, but some scope or site details should be confirmed before relying on the final price.";
    }
    if (status === "low") {
      return "Low estimate confidence. This is not reliable enough for price comparison yet. Confirm the missing product, area or site details first.";
    }
    return "Estimate pending. Add flooring type and area before we calculate a useful estimate.";
  }

  function classify(score, hasMajorUncertainty) {
    if (hasMajorUncertainty || score < 65) return "low";
    if (score < 85) return "medium";
    return "high";
  }

  function calculateEstimateConfidence(input, result) {
    const source = input || {};
    const quote = result || {};
    const output = {
      status: "not_ready",
      score: 0,
      label: "Estimate pending",
      message: getMessage("not_ready"),
      blockers: [],
      assumptions: [],
      maxConfidenceReason: ""
    };

    if (!hasMeaningfulCategory(source, quote)) {
      output.blockers.push("Choose a flooring type or product range.");
    }
    if (!hasArea(source, quote)) {
      output.blockers.push("Add flooring area.");
    }
    if (/calculator is not available|critical/i.test((quote.warnings || []).join(" "))) {
      output.blockers.push("Pricing engine needs review.");
    }
    if (/installation rate requires review/i.test((quote.warnings || []).join(" "))) {
      output.blockers.push("Installation rate needs review.");
    }
    if (output.blockers.length) {
      output.assumptions = output.blockers.slice();
      return output;
    }

    let score = 0;
    const assumptions = [];
    const blockers = [];
    const measurementMethod = text(source.measurementMethod || quote.measurementMethod || quote.measurementSource);
    const pricingMode = text(quote.pricingMode);
    const quoteMode = text(source.quoteMode || source.jobType || quote.quoteMode || "supply_install");
    const needsConfirmationItems = getNeedsConfirmationItems(source);

    if (measurementMethod === "floorplan_upload" || /floor plan/i.test(text(quote.measurementSource))) {
      score += 25;
      assumptions.push("Floor plan area is used as the measurement basis.");
    } else if (measurementMethod === "room_by_room") {
      score += 20;
      assumptions.push("Room-by-room area is suitable for a planning estimate.");
    } else {
      score += 18;
      assumptions.push("Manual area is suitable for a starting estimate.");
    }

    if (pricingMode === "product") {
      score += 20;
      assumptions.push("Selected product pricing is included.");
    } else if (quote.pricePending || pricingMode === "fallback") {
      score += 8;
      blockers.push("Product pricing needs review.");
    } else {
      score += 14;
      assumptions.push("Category-level product pricing is used.");
    }

    let scopeScore = 25;
    if (!text(source.removalDecision) || source.removalDecision === "not_sure") scopeScore -= 5;
    if (source.removalDecision === "yes" && (!text(source.removalDisposal) || source.removalDisposal === "not_sure")) {
      scopeScore -= 6;
      blockers.push("Removal is selected but disposal/take-away needs confirmation.");
    }
    if (!text(source.floorPrepDecision) || isNotSure(source.floorPrepDecision) || source.floorPrepType === "heavy" || source.floorPrepType === "manual" || isNotSure(source.floorPrepType) || isNotSure(source.subfloorCondition) || source.subfloorCondition === "known_issues" || isNotSure(source.moistureBarrier)) {
      scopeScore -= 7;
      assumptions.push("Floor preparation needs site confirmation.");
    }
    if (!text(source.underlayDecision) || isNotSure(source.underlayDecision)) scopeScore -= 4;
    if (!text(source.finishDecision) || isNotSure(source.finishDecision)) scopeScore -= 3;
    if (!text(source.doorDecision) || isNotSure(source.doorDecision)) scopeScore -= 3;
    if (!text(source.furnitureDecision) || isNotSure(source.furnitureDecision)) scopeScore -= 3;
    if (source.stairs === "yes") {
      if (!stairDetailCount(source)) {
        scopeScore -= 10;
        blockers.push("Stairs are selected but stair quantities need confirmation.");
      }
      if (!hasStairWidth(source)) {
        scopeScore -= 7;
        blockers.push("Stair width needs confirmation.");
      }
    } else if (!text(source.stairs) || source.stairs === "not_sure") {
      scopeScore -= 8;
      blockers.push("Stair status needs confirmation.");
    }
    score += Math.max(0, scopeScore);

    let siteScore = 15;
    if (!text(source.parkingAccess) || isNotSure(source.parkingAccess) || source.parkingAccess === "difficult") {
      siteScore -= isApartmentLike(source) ? 8 : 4;
      assumptions.push("Site details should be confirmed before booking.");
    }
    if (isApartmentLike(source) && (!text(source.level) || source.level === "other_unsure" || (source.level === "level_2_plus" && !text(source.hasLift)))) {
      siteScore -= 7;
      blockers.push("Apartment level/lift access needs confirmation.");
    }
    score += Math.max(0, siteScore);

    let complexityScore = 10;
    if ((source.patternType === "herringbone" || source.patternType === "chevron") && source.installMethod && source.installMethod !== "direct_glue") {
      complexityScore -= 8;
      blockers.push("Pattern installation method needs review.");
    }
    if (source.stairs === "yes" || source.floorPrepType === "heavy" || source.floorPrepType === "manual") {
      complexityScore -= 2;
    }
    score += Math.max(0, complexityScore);

    score += containsWarning(quote, /rate requires review|calculator is not available/i) ? 0 : 5;

    if (pricingMode !== "product") {
      score = capScore(score, 84, "Category-level estimate only.", output);
    }
    if (quote.pricePending || pricingMode === "fallback") {
      score = capScore(score, 64, "Product pricing needs review.", output);
    }
    if (quote.manualReviewRequired) {
      score = capScore(score, 84, "Manual review is required before final confirmation.", output);
    }
    if (needsConfirmationItems.length) {
      score = capScore(score, 84, "Scope details need confirmation.", output);
    }
    if (source.stairs === "yes" && (!stairDetailCount(source) || !hasStairWidth(source))) {
      score = capScore(score, 64, "Stair details are incomplete.", output);
    }
    if (source.removalDecision === "yes" && (!text(source.removalDisposal) || source.removalDisposal === "not_sure")) {
      score = capScore(score, 84, "Disposal/take-away needs confirmation.", output);
    }
    if (source.floorPrepType === "heavy" || source.floorPrepType === "manual" || isNotSure(source.floorPrepType) || isNotSure(source.floorPrepDecision) || source.subfloorCondition === "known_issues" || isNotSure(source.subfloorCondition) || isNotSure(source.moistureBarrier)) {
      score = capScore(score, 84, "Floor preparation needs site confirmation.", output);
    }
    if (isApartmentLike(source) && (!text(source.level) || source.level === "other_unsure" || !text(source.parkingAccess) || isNotSure(source.parkingAccess) || source.parkingAccess === "difficult")) {
      score = capScore(score, 84, "Apartment site details need confirmation.", output);
    }

    output.score = Math.max(0, Math.min(100, Math.round(score)));
    output.blockers = blockers;
    output.assumptions = Array.from(new Set(assumptions)).slice(0, 5);
    output.status = classify(output.score, blockers.length > 1 || output.score < 65 || needsConfirmationItems.length > 3);
    output.label = getLabel(output.status);
    output.message = getMessage(output.status);
    return output;
  }

  function generateQuoteReviewNotes(input, result, confidence) {
    const source = input || {};
    const quote = result || {};
    const priorityNotes = buildNeedsConfirmationNotes(source);
    const notes = priorityNotes.slice();

    if (!hasMeaningfulCategory(source, quote)) {
      notes.push("Choose a flooring type or product range before we calculate a useful estimate.");
    }
    if (!hasArea(source, quote)) {
      notes.push("Add flooring area before we calculate a useful estimate.");
    }
    if (source.measurementMethod === "manual_total" || source.measurementMethod === "room_by_room") {
      notes.push("The area is suitable for a starting estimate. Final measurement should be checked before confirmation.");
    }
    if (quote.pricingMode === "category") {
      notes.push("This uses a category-level product estimate. Selecting an exact range will improve confidence.");
    }
    if (quote.pricingMode === "product") {
      notes.push("The selected product is included in the estimate.");
    }
    if (quote.pricePending || quote.pricingMode === "fallback") {
      notes.push("Product has been selected, but final product pricing needs review before confirmation.");
    }
    if (!notes.length) {
      notes.push("Estimate is ready for review. Final site-sensitive items are still checked before booking.");
    }
    if (confidence && confidence.maxConfidenceReason && notes.indexOf(confidence.maxConfidenceReason) < 0) {
      const duplicateProductPricingReason = confidence.maxConfidenceReason === "Product pricing needs review."
        && notes.some(function (note) {
          return /product pricing needs review/i.test(note);
        });
      const duplicateScopeReason = confidence.maxConfidenceReason === "Scope details need confirmation."
        && priorityNotes.length > 0;
      if (!duplicateProductPricingReason && !duplicateScopeReason) {
        notes.push(confidence.maxConfidenceReason);
      }
    }

    return Array.from(new Set(notes)).slice(0, 5);
  }

  return {
    calculateEstimateConfidence: calculateEstimateConfidence,
    generateQuoteReviewNotes: generateQuoteReviewNotes
  };
});
