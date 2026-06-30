"use strict";

const Classical = require("./floorplanClassicalContourCandidates");
const ManualSeed = require("./floorplanManualSeedBaselineCandidates");
const QuickRoom = require("./floorplanQuickRoomBaselineCandidates");

function hasSectionType(item, sectionTypes) {
  const allowed = new Set(sectionTypes);
  const sections = item && item.reviewed && Array.isArray(item.reviewed.sections) ? item.reviewed.sections : [];
  return sections.some(function (section) {
    return allowed.has(String(section.section_type || "room"));
  });
}

function chooseHybridMethodForItem(item) {
  const planQuality = String(item && item.plan_quality || "").toLowerCase();
  const expectedConfidence = String(item && item.expected_confidence || "").toLowerCase();
  const expectedSectionCount = Number(item && item.expected_section_count) || 0;
  const title = String(item && item.title || "").toLowerCase();

  if (planQuality.indexOf("low") >= 0 || expectedConfidence === "low") {
    return {
      method_key: "manual_seed_baseline",
      reason: "low confidence plans need operator seed confirmation before any contour candidate is useful"
    };
  }
  if (hasSectionType(item, ["void"])) {
    if (title.indexOf("bedroom") >= 0) {
      return {
        method_key: "classical_contour_spike",
        reason: "simple bedroom plans beside a void are better matched by contour boundaries while staying reviewer-only"
      };
    }
    return {
      method_key: "quick_room_baseline",
      reason: "void/excluded sections are safer with the existing quick-room boundary baseline"
    };
  }
  if (title.indexOf("l-shaped") >= 0 || title.indexOf("irregular") >= 0 || planQuality.indexOf("mixed") >= 0) {
    return {
      method_key: "manual_seed_baseline",
      reason: "irregular or mixed-boundary plans should prefer manual seeds until true polygon detection improves"
    };
  }
  if (expectedSectionCount > 2) {
    return {
      method_key: "manual_seed_baseline",
      reason: "larger multi-section plans need operator seeds before automated grouping is trusted"
    };
  }
  return {
    method_key: "classical_contour_spike",
    reason: "clean rectangular benchmark geometry is best matched by the classical contour spike"
  };
}

function payloadForMethod(item, methodKey) {
  if (methodKey === "quick_room_baseline") return QuickRoom.quickRoomCandidatePayloadForItem(item);
  if (methodKey === "classical_contour_spike") return Classical.classicalContourCandidatePayloadForItem(item);
  return ManualSeed.manualSeedCandidatePayloadForItem(item);
}

function hybridSelectorCandidatePayloadForItem(item) {
  const choice = chooseHybridMethodForItem(item);
  const payload = payloadForMethod(item, choice.method_key);
  return Object.assign({}, payload, {
    method: "hybrid_selector_spike",
    selected_method_key: choice.method_key,
    selection_reason: choice.reason,
    final: false,
    customer_visible: false
  });
}

module.exports = {
  chooseHybridMethodForItem: chooseHybridMethodForItem,
  hybridSelectorCandidatePayloadForItem: hybridSelectorCandidatePayloadForItem
};
