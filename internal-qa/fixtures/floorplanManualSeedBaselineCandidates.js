"use strict";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function centroid(points) {
  const source = Array.isArray(points) ? points : [];
  if (!source.length) return { x: 0.5, y: 0.5 };
  return source.reduce(function (sum, point) {
    return {
      x: sum.x + (Number(point.x) || 0),
      y: sum.y + (Number(point.y) || 0)
    };
  }, { x: 0, y: 0 });
}

function shrinkTowardCentroid(points, factor) {
  const source = Array.isArray(points) ? points : [];
  const center = centroid(source);
  const count = Math.max(1, source.length);
  const cx = center.x / count;
  const cy = center.y / count;
  const shrink = Number(factor) || 0.9;
  return source.map(function (point) {
    return {
      x: Number(clamp(cx + ((Number(point.x) || 0) - cx) * shrink, 0, 1).toFixed(6)),
      y: Number(clamp(cy + ((Number(point.y) || 0) - cy) * shrink, 0, 1).toFixed(6))
    };
  });
}

function seedPointForSection(section) {
  const points = Array.isArray(section && section.points) ? section.points : [];
  const center = centroid(points);
  const count = Math.max(1, points.length);
  return {
    x: Number(clamp(center.x / count, 0, 1).toFixed(6)),
    y: Number(clamp(center.y / count, 0, 1).toFixed(6))
  };
}

function pointInPolygon(point, points) {
  const x = Number(point && point.x);
  const y = Number(point && point.y);
  const polygon = Array.isArray(points) ? points : [];
  if (!Number.isFinite(x) || !Number.isFinite(y) || polygon.length < 3) return false;
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const current = polygon[index];
    const last = polygon[previous];
    const xi = Number(current.x);
    const yi = Number(current.y);
    const xj = Number(last.x);
    const yj = Number(last.y);
    const intersects = ((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function normalizeSeed(seed) {
  const source = seed || {};
  const x = Number(source.x);
  const y = Number(source.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("Manual seed point must include numeric x and y.");
  }
  return {
    x: Number(clamp(x, 0, 1).toFixed(6)),
    y: Number(clamp(y, 0, 1).toFixed(6))
  };
}

function sectionForSeed(item, seed) {
  const reviewedSections = item && item.reviewed && Array.isArray(item.reviewed.sections)
    ? item.reviewed.sections
    : [];
  const normalized = normalizeSeed(seed);
  const match = reviewedSections.find(function (section) {
    return pointInPolygon(normalized, section.points);
  });
  if (!match) {
    throw new Error("Manual seed " + normalized.x + "," + normalized.y + " does not fall inside a reviewed benchmark section.");
  }
  if (String(match.selection_state || "").toLowerCase() === "exclude") {
    throw new Error("Manual seed " + normalized.x + "," + normalized.y + " falls inside an excluded reviewed benchmark section.");
  }
  return match;
}

function isCandidateEligibleSection(section) {
  return String(section && section.selection_state || "").toLowerCase() !== "exclude";
}

function candidateForSection(item, section, seed, index, settings) {
  const sourceConfidence = String(section.confidence || item.expected_confidence || "medium").toLowerCase();
  return {
    candidate_id: "manual-seed-" + item.id + "-" + (index + 1),
    label: (section.label || "Seeded candidate " + (index + 1)) + " candidate",
    section_type: section.section_type || "room",
    confidence: sourceConfidence === "low" ? "low" : "medium",
    selection_state: "not_sure",
    coordinate_space: section.coordinate_space || "normalized_page",
    seed_point: seed || seedPointForSection(section),
    points: shrinkTowardCentroid(section.points, settings.shrinkFactor)
  };
}

function manualSeedCandidatePayloadForItem(item, options) {
  const settings = Object.assign({ shrinkFactor: 0.98, maxSections: 12 }, options || {});
  const reviewedSections = item && item.reviewed && Array.isArray(item.reviewed.sections)
    ? item.reviewed.sections
    : [];
  const candidateSections = reviewedSections.filter(isCandidateEligibleSection).slice(0, settings.maxSections);
  const candidates = candidateSections.map(function (section, index) {
    return candidateForSection(item, section, seedPointForSection(section), index, settings);
  });

  return {
    method: "manual_seed_spike",
    final: false,
    customer_visible: false,
    benchmark_item_id: item.id,
    candidates: candidates
  };
}

function manualSeedCandidatePayloadForSeeds(item, seeds, options) {
  const settings = Object.assign({ shrinkFactor: 0.98, maxSeeds: 12 }, options || {});
  const normalizedSeeds = Array.isArray(seeds) ? seeds.map(normalizeSeed) : [];
  if (!normalizedSeeds.length) {
    throw new Error("Manual seed experiment requires at least one seed point.");
  }
  if (normalizedSeeds.length > settings.maxSeeds) {
    throw new Error("Manual seed experiment has too many seed points.");
  }
  const candidates = normalizedSeeds.map(function (seed, index) {
    return candidateForSection(item, sectionForSeed(item, seed), seed, index, settings);
  });

  return {
    method: "manual_seed_spike",
    final: false,
    customer_visible: false,
    benchmark_item_id: item.id,
    candidates: candidates
  };
}

function reasonForSeedError(error) {
  const message = error && error.message || "";
  if (/does not fall inside/i.test(message)) return "outside_reviewed_section";
  if (/excluded reviewed benchmark section/i.test(message)) return "excluded_reviewed_section";
  if (/numeric x and y/i.test(message)) return "invalid_coordinates";
  return "unknown_seed_error";
}

function manualSeedCandidatePayloadForSeedsWithQuality(item, seeds, options) {
  const settings = Object.assign({ shrinkFactor: 0.98, maxSeeds: 12 }, options || {});
  const rawSeeds = Array.isArray(seeds) ? seeds : [];
  if (!rawSeeds.length) {
    throw new Error("Manual seed experiment requires at least one seed point.");
  }
  if (rawSeeds.length > settings.maxSeeds) {
    throw new Error("Manual seed experiment has too many seed points.");
  }
  const accepted = [];
  const rejected = [];
  rawSeeds.forEach(function (seed, index) {
    try {
      const normalized = normalizeSeed(seed);
      const section = sectionForSeed(item, normalized);
      accepted.push({
        seed: normalized,
        section: section,
        candidate: candidateForSection(item, section, normalized, accepted.length, settings)
      });
    } catch (error) {
      rejected.push({
        index: index,
        seed: seed,
        reason: reasonForSeedError(error)
      });
    }
  });
  const rejectedByReason = rejected.reduce(function (summary, entry) {
    summary[entry.reason] = (summary[entry.reason] || 0) + 1;
    return summary;
  }, {});
  return {
    payload: {
      method: "manual_seed_spike",
      final: false,
      customer_visible: false,
      benchmark_item_id: item.id,
      candidates: accepted.map(function (entry) {
        return entry.candidate;
      })
    },
    quality_summary: {
      seed_count: rawSeeds.length,
      accepted_seed_count: accepted.length,
      rejected_seed_count: rejected.length,
      rejected_seed_reasons: rejectedByReason,
      accepted_seed_points: accepted.map(function (entry) {
        return entry.seed;
      }),
      rejected_seed_points: rejected.map(function (entry) {
        return {
          index: entry.index,
          reason: entry.reason
        };
      }),
      candidate_section_labels: accepted.map(function (entry) {
        return entry.candidate.label;
      })
    }
  };
}

module.exports = {
  manualSeedCandidatePayloadForItem: manualSeedCandidatePayloadForItem,
  manualSeedCandidatePayloadForSeeds: manualSeedCandidatePayloadForSeeds,
  manualSeedCandidatePayloadForSeedsWithQuality: manualSeedCandidatePayloadForSeedsWithQuality,
  _test: {
    pointInPolygon: pointInPolygon,
    reasonForSeedError: reasonForSeedError,
    seedPointForSection: seedPointForSection,
    isCandidateEligibleSection: isCandidateEligibleSection,
    sectionForSeed: sectionForSeed,
    shrinkTowardCentroid: shrinkTowardCentroid
  }
};
