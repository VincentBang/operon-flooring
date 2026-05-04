(function () {
  const DEFAULT_WIDTH_THRESHOLD_MM = 1200;
  const STAIR_TYPES = [
    { id: "straight_tread", label: "Straight stair treads" },
    { id: "winder_tread", label: "Winder / triangular treads" },
    { id: "landing_1m2", label: "Landings up to 1 m²" },
    { id: "landing_2m2", label: "Landings up to 2 m²" },
    { id: "one_side_open", label: "Stairs with one open side" },
    { id: "two_side_open", label: "Stairs with two open sides" }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function emptyTierPrices() {
    return STAIR_TYPES.reduce(function (accumulator, type) {
      accumulator[type.id] = {
        short: 0,
        long: 0
      };
      return accumulator;
    }, {});
  }

  function createRateSet(config) {
    const threshold = config.category === "engineered"
      ? Math.round(Number(config.plankLengthMm || 0) / 2)
      : Number(config.guideWidthMm || DEFAULT_WIDTH_THRESHOLD_MM);

    return Object.assign({
      guideWidthMm: threshold || DEFAULT_WIDTH_THRESHOLD_MM,
      priceTiers: emptyTierPrices(),
      active: true,
      needsReview: true
    }, config, {
      guideWidthMm: threshold || DEFAULT_WIDTH_THRESHOLD_MM,
      priceTiers: Object.assign(emptyTierPrices(), config.priceTiers || {})
    });
  }

  // Prices are intentionally zero placeholders until the owner enters each range's stair rates.
  // The calculator will warn and keep the quote review-required when a selected stair rate is not configured.
  const LOCAL_STAIR_RATES = {
    "hybrid-etf-7mm": createRateSet({
      rangeId: "hybrid-etf-7mm",
      category: "hybrid",
      rangeLabel: "ETF 7.0mm Waterproof Hybrid Flooring"
    }),
    "hybrid-etf-8mm": createRateSet({
      rangeId: "hybrid-etf-8mm",
      category: "hybrid",
      rangeLabel: "ETF 8.0mm Waterproof Hybrid Flooring"
    }),
    "hybrid-etf-9mm": createRateSet({
      rangeId: "hybrid-etf-9mm",
      category: "hybrid",
      rangeLabel: "ETF 9.0mm Waterproof Hybrid Flooring"
    }),
    "laminate-12mm-24hr-water-resistant": createRateSet({
      rangeId: "laminate-12mm-24hr-water-resistant",
      category: "laminate",
      rangeLabel: "ETF 12mm 24hrs Water Resistant Laminate"
    }),
    "engineered-swish-oak-natura": createRateSet({
      rangeId: "engineered-swish-oak-natura",
      category: "engineered",
      rangeLabel: "Swish Oak Natura",
      plankLengthMm: 1900
    }),
    "engineered-swish-oak-natura-herringbone": createRateSet({
      rangeId: "engineered-swish-oak-natura-herringbone",
      category: "engineered",
      rangeLabel: "Swish Oak Natura Herringbone",
      stairGuideSourceRangeId: "engineered-swish-oak-natura",
      plankLengthMm: 1900
    })
  };

  function parseNumber(value) {
    if (value === "" || value === null || typeof value === "undefined") {
      return 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normaliseSourceRows(rows) {
    return rows.reduce(function (accumulator, row) {
      const rangeId = row.rangeId || row.range_id || "";
      const stairType = row.stairType || row.stair_type || "";
      if (!rangeId || !stairType) {
        return accumulator;
      }

      if (!accumulator[rangeId]) {
        accumulator[rangeId] = createRateSet({
          rangeId: rangeId,
          category: row.category || "",
          rangeLabel: row.rangeLabel || row.range_label || "",
          guideWidthMm: parseNumber(row.guideWidthMm || row.guide_width_mm),
          plankLengthMm: parseNumber(row.plankLengthMm || row.plank_length_mm),
          needsReview: false,
          priceTiers: {}
        });
      }

      accumulator[rangeId].priceTiers[stairType] = {
        short: parseNumber(row.shortPrice || row.short_price || row.price_short || row.price_leq_threshold),
        long: parseNumber(row.longPrice || row.long_price || row.price_long || row.price_gt_threshold)
      };
      accumulator[rangeId].active = row.active !== false && row.active !== "false";
      return accumulator;
    }, {});
  }

  function getRateSource() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("stairRates") : null;
    if (Array.isArray(source) && source.length) {
      return normaliseSourceRows(source);
    }
    if (source && typeof source === "object" && Object.keys(source).length) {
      return source;
    }
    return LOCAL_STAIR_RATES;
  }

  function getStairType(typeId) {
    return STAIR_TYPES.find(function (type) {
      return type.id === typeId;
    }) || null;
  }

  function getRateSet(rangeId) {
    const source = getRateSource();
    const rateSet = rangeId ? source[rangeId] : null;
    return rateSet && rateSet.active !== false ? clone(rateSet) : null;
  }

  function getGuideWidthMm(rateSet) {
    if (!rateSet) {
      return DEFAULT_WIDTH_THRESHOLD_MM;
    }
    if (rateSet.category === "engineered" && Number(rateSet.plankLengthMm || 0) > 0) {
      return Math.round(Number(rateSet.plankLengthMm) / 2);
    }
    return Number(rateSet.guideWidthMm || DEFAULT_WIDTH_THRESHOLD_MM);
  }

  function getTierForWidth(rateSet, widthMm, widthKnown) {
    const guideWidthMm = getGuideWidthMm(rateSet);
    if (!widthKnown || !(Number(widthMm) > 0)) {
      return {
        tier: "short",
        guideWidthMm: guideWidthMm,
        assumed: true
      };
    }
    return {
      tier: Number(widthMm) <= guideWidthMm ? "short" : "long",
      guideWidthMm: guideWidthMm,
      assumed: false
    };
  }

  function getPrice(rateSet, stairType, tier) {
    const typeRates = rateSet && rateSet.priceTiers ? rateSet.priceTiers[stairType] : null;
    return Number((typeRates && typeRates[tier]) || 0);
  }

  window.OperonStairRates = {
    get stairTypes() {
      return clone(STAIR_TYPES);
    },
    getRateSet: getRateSet,
    getStairType: getStairType,
    getGuideWidthMm: getGuideWidthMm,
    getTierForWidth: getTierForWidth,
    getPrice: getPrice
  };
}());
