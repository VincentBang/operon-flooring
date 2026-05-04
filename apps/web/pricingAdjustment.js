(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundMoney(value) {
    return Math.round((Number(value) || 0) / 10) * 10;
  }

  function getAreaBand(area) {
    const value = Number(area) || 0;
    if (value <= 0) return "unknown";
    if (value < 30) return "small";
    if (value < 70) return "medium";
    if (value < 120) return "large";
    return "xlarge";
  }

  function normaliseConfidence(value) {
    const label = String(value || "").toLowerCase();
    if (label.indexOf("high") >= 0) return "high";
    if (label.indexOf("medium") >= 0 || label.indexOf("moderate") >= 0) return "medium";
    return "low";
  }

  function hasComplexity(input, result) {
    const extras = input || {};
    const warnings = Array.isArray(result && result.warnings) ? result.warnings : [];
    return Boolean(
      extras.stairs === "yes" ||
      Number(extras.stairsCount || 0) > 0 ||
      extras.floorPrepType && extras.floorPrepType !== "none" ||
      extras.removalType && extras.removalType !== "none" ||
      extras.parkingAccess && extras.parkingAccess !== "easy" ||
      warnings.length ||
      result && result.manualReviewRequired
    );
  }

  function getRangeWidth(confidence, complexity) {
    if (confidence === "high") return complexity ? 0.08 : 0.05;
    if (confidence === "medium") return complexity ? 0.12 : 0.09;
    return complexity ? 0.18 : 0.14;
  }

  function getMarketFitAdjustment(baseTotal, bucket) {
    if (!bucket || !baseTotal) {
      return { factor: 1, reason: "No historical bucket available yet." };
    }

    const p25 = Number(bucket.p25 || 0);
    const p75 = Number(bucket.p75 || 0);
    if (p75 > 0 && baseTotal > p75) {
      return { factor: 0.98, reason: "Base estimate is above the historical upper quartile for this bucket." };
    }
    if (p25 > 0 && baseTotal < p25) {
      return { factor: 1.02, reason: "Base estimate is below the historical lower quartile for this bucket." };
    }
    return { factor: 1, reason: "Base estimate sits inside the historical market band." };
  }

  function getTargetPrice(baseTotal, bucket, marketFit) {
    const historicalTarget = Number(bucket && (bucket.target_price || bucket.median_winning_price || bucket.median_price) || 0);
    if (historicalTarget > 0) {
      const blended = (baseTotal * 0.72) + (historicalTarget * 0.28);
      return blended * marketFit.factor;
    }
    return baseTotal * marketFit.factor;
  }

  function applyAdjustment(result, context) {
    const settings = context || {};
    const input = settings.input || {};
    const bucket = settings.bucket || null;
    const baseTotal = Number(result && result.totalIncGst) || 0;
    const confidence = normaliseConfidence(settings.confidence || result && result.quoteConfidence);
    const complexity = hasComplexity(input, result);

    if (!baseTotal || result && result.pricePending) {
      return {
        enabled: false,
        base_total: baseTotal,
        display_mode: "pending",
        confidence_level: confidence,
        reason: "Price range is not shown until measurement is available."
      };
    }

    const marketFit = getMarketFitAdjustment(baseTotal, bucket);
    const targetPrice = getTargetPrice(baseTotal, bucket, marketFit);
    const complexityBias = complexity ? 1.015 : 1;
    const adjustedTarget = targetPrice * complexityBias;
    const width = getRangeWidth(confidence, complexity);
    const lower = roundMoney(adjustedTarget * (1 - width));
    const upper = roundMoney(adjustedTarget * (1 + width));

    return {
      enabled: true,
      display_mode: "range",
      base_total: roundMoney(baseTotal),
      target_price: roundMoney(adjustedTarget),
      range_low: Math.min(lower, upper),
      range_high: Math.max(lower, upper),
      confidence_level: confidence,
      area_band: getAreaBand(result.realArea),
      complexity_bias: complexity ? "upward" : "standard",
      market_fit: marketFit,
      bucket: bucket ? {
        suburb_cluster: bucket.suburb_cluster || "",
        flooring_type: bucket.flooring_type || "",
        area_band: bucket.area_band || "",
        stairs_flag: !!bucket.stairs_flag,
        sample_size: Number(bucket.sample_size || 0),
        win_rate: Number(bucket.win_rate || 0),
        p25: Number(bucket.p25 || 0),
        p50: Number(bucket.p50 || 0),
        p75: Number(bucket.p75 || 0),
        target_low: Number(bucket.target_low || 0),
        target_high: Number(bucket.target_high || 0),
        target_price: Number(bucket.target_price || 0)
      } : null,
      reasons: [
        marketFit.reason,
        confidence === "high" ? "High confidence keeps the range tighter." : confidence === "medium" ? "Medium confidence keeps a moderate range." : "Low confidence keeps the range wider.",
        complexity ? "Stairs, prep, access or review flags add an upward complexity bias." : "No major complexity bias detected."
      ]
    };
  }

  window.OperonPricingAdjustment = {
    applyAdjustment: applyAdjustment,
    getAreaBand: getAreaBand
  };
}());
