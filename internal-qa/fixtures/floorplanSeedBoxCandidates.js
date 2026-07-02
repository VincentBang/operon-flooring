"use strict";

const ManualSeed = require("./floorplanManualSeedBaselineCandidates");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeSeed(seed) {
  const source = seed || {};
  const x = Number(source.x);
  const y = Number(source.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("Seed box point must include numeric x and y.");
  }
  return {
    x: Number(clamp(x, 0, 1).toFixed(6)),
    y: Number(clamp(y, 0, 1).toFixed(6))
  };
}

function sectionForSeed(item, seed) {
  return ManualSeed._test.sectionForSeed(item, seed);
}

function reasonForSeedError(error) {
  const message = error && error.message || "";
  if (/does not fall inside/i.test(message)) return "outside_reviewed_section";
  if (/excluded reviewed benchmark section/i.test(message)) return "excluded_reviewed_section";
  if (/numeric x and y/i.test(message)) return "invalid_coordinates";
  return "unknown_seed_error";
}

function normalizedAreaForM2(item, areaM2) {
  const reviewed = item && item.reviewed || {};
  const pageWidth = Math.max(1, Number(reviewed.page_width) || 1000);
  const pageHeight = Math.max(1, Number(reviewed.page_height) || 1000);
  const pixelsPerMetre = Math.max(1, Number(reviewed.pixels_per_metre) || 100);
  return Math.max(0.0004, (Number(areaM2) || 9) * pixelsPerMetre * pixelsPerMetre / (pageWidth * pageHeight));
}

function squareAroundSeed(seed, normalizedArea, options) {
  const settings = Object.assign({ minHalfSize: 0.06, maxHalfSize: 0.22 }, options || {});
  const half = clamp(Math.sqrt(Math.max(0.0004, normalizedArea)) / 2, settings.minHalfSize, settings.maxHalfSize);
  const left = clamp(seed.x - half, 0, 1);
  const right = clamp(seed.x + half, 0, 1);
  const top = clamp(seed.y - half, 0, 1);
  const bottom = clamp(seed.y + half, 0, 1);
  return [
    { x: Number(left.toFixed(6)), y: Number(top.toFixed(6)) },
    { x: Number(right.toFixed(6)), y: Number(top.toFixed(6)) },
    { x: Number(right.toFixed(6)), y: Number(bottom.toFixed(6)) },
    { x: Number(left.toFixed(6)), y: Number(bottom.toFixed(6)) }
  ];
}

function seedBoxCandidateForSeed(item, seed, index, options) {
  const settings = Object.assign({ areaScale: 0.9 }, options || {});
  const section = sectionForSeed(item, seed);
  const reviewedSectionCount = Math.max(1, (item.reviewed.sections || []).filter(function (candidate) {
    return String(candidate.selection_state || "").toLowerCase() !== "exclude";
  }).length);
  const areaPerSection = (Number(item.expected_reviewed_area_m2) || 12) / reviewedSectionCount * settings.areaScale;
  return {
    candidate_id: "seed-box-" + item.id + "-" + (index + 1),
    label: (section.label || "Seeded area " + (index + 1)) + " seed-box candidate",
    section_type: section.section_type || "room",
    confidence: "low",
    selection_state: "not_sure",
    coordinate_space: "normalized_page",
    seed_point: seed,
    points: squareAroundSeed(seed, normalizedAreaForM2(item, areaPerSection), settings)
  };
}

function seedBoxCandidatePayloadForSeedsWithQuality(item, seeds, options) {
  const settings = Object.assign({ maxSeeds: 12 }, options || {});
  const rawSeeds = Array.isArray(seeds) ? seeds : [];
  if (!rawSeeds.length) {
    throw new Error("Seed-box experiment requires at least one seed point.");
  }
  if (rawSeeds.length > settings.maxSeeds) {
    throw new Error("Seed-box experiment has too many seed points.");
  }

  const accepted = [];
  const rejected = [];
  rawSeeds.forEach(function (seed, index) {
    try {
      const normalized = normalizeSeed(seed);
      const candidate = seedBoxCandidateForSeed(item, normalized, accepted.length, settings);
      accepted.push({
        seed: normalized,
        candidate: candidate
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
      method: "seed_box_spike",
      final: false,
      customer_visible: false,
      benchmark_item_id: item.id,
      selected_method_key: "seed_box_spike",
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
      candidate_section_labels: accepted.map(function (entry) {
        return entry.candidate.label;
      })
    }
  };
}

function seedBoxCandidatePayloadForItem(item, options) {
  const sections = item && item.reviewed && Array.isArray(item.reviewed.sections) ? item.reviewed.sections : [];
  const seeds = sections.filter(function (section) {
    return String(section.selection_state || "").toLowerCase() !== "exclude";
  }).map(function (section) {
    return ManualSeed._test.seedPointForSection(section);
  });
  return seedBoxCandidatePayloadForSeedsWithQuality(item, seeds, options).payload;
}

module.exports = {
  seedBoxCandidatePayloadForItem: seedBoxCandidatePayloadForItem,
  seedBoxCandidatePayloadForSeedsWithQuality: seedBoxCandidatePayloadForSeedsWithQuality,
  _test: {
    normalizeSeed: normalizeSeed,
    normalizedAreaForM2: normalizedAreaForM2,
    squareAroundSeed: squareAroundSeed
  }
};
