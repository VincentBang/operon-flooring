(function () {
  // Source of truth for installation labour rates.
  // Future Google Sheets / Supabase integration can replace this file with fetched data.
  const INSTALL_RATES = [
    { id: "laminate-standard-supply-install", category: "laminate", installType: "standard", installMethod: "floating", jobType: "supply_install", ratePerM2: 27, minimumCharge: 1500, active: true },
    { id: "laminate-standard-install-only", category: "laminate", installType: "standard", installMethod: "floating", jobType: "install_only", ratePerM2: 45, minimumCharge: 1500, active: true },

    { id: "hybrid-standard-supply-install", category: "hybrid", installType: "standard", installMethod: "floating", jobType: "supply_install", ratePerM2: 31, minimumCharge: 1500, active: true },
    { id: "hybrid-standard-install-only", category: "hybrid", installType: "standard", installMethod: "floating", jobType: "install_only", ratePerM2: 45, minimumCharge: 1500, active: true },

    { id: "engineered-standard-supply-install", category: "engineered", installType: "standard", installMethod: "floating", jobType: "supply_install", ratePerM2: 39, minimumCharge: 1500, active: true },
    { id: "engineered-standard-install-only", category: "engineered", installType: "standard", installMethod: "floating", jobType: "install_only", ratePerM2: 45, minimumCharge: 1500, active: true },
    { id: "engineered-standard-direct-glue-supply-install", category: "engineered", installType: "standard", installMethod: "direct_glue", jobType: "supply_install", ratePerM2: 39, minimumCharge: 1500, active: true },
    { id: "engineered-standard-direct-glue-install-only", category: "engineered", installType: "standard", installMethod: "direct_glue", jobType: "install_only", ratePerM2: 45, minimumCharge: 1500, active: true },
    { id: "engineered-herringbone-supply-install", category: "engineered", installType: "herringbone", installMethod: "direct_glue", jobType: "supply_install", ratePerM2: 52, minimumCharge: 1800, active: true },
    { id: "engineered-herringbone-install-only", category: "engineered", installType: "herringbone", installMethod: "direct_glue", jobType: "install_only", ratePerM2: 64, minimumCharge: 1800, active: true }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getInstallRatesData() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("installRates") : null;
    return Array.isArray(source) && source.length ? source : INSTALL_RATES;
  }

  function normaliseInstallType(installType) {
    return installType === "herringbone" || installType === "chevron" ? "herringbone" : "standard";
  }

  function normaliseInstallMethod(category, installType, installMethod) {
    const targetType = normaliseInstallType(installType);
    if (category !== "engineered") {
      return "floating";
    }
    if (targetType === "herringbone") {
      return "direct_glue";
    }
    return installMethod === "direct_glue" ? "direct_glue" : "floating";
  }

  function listActiveRates() {
    return getInstallRatesData().filter(function (rate) {
      return rate.active !== false;
    }).map(clone);
  }

  function getInstallRate(options) {
    const settings = Object.assign({
      category: "hybrid",
      installType: "standard",
      installMethod: "floating",
      jobType: "supply_install"
    }, options || {});

    const targetType = normaliseInstallType(settings.installType);
    const targetMethod = normaliseInstallMethod(settings.category, targetType, settings.installMethod);
    const activeRates = getInstallRatesData().filter(function (rate) {
      return rate.active !== false;
    });

    const exact = activeRates.find(function (rate) {
      const rateMethod = normaliseInstallMethod(rate.category, rate.installType, rate.installMethod);
      return rate.category === settings.category
        && rate.installType === targetType
        && rate.jobType === settings.jobType
        && rateMethod === targetMethod;
    });
    if (exact) {
      return clone(exact);
    }

    const legacyMethodless = activeRates.find(function (rate) {
      return rate.category === settings.category
        && rate.installType === targetType
        && rate.jobType === settings.jobType
        && !rate.installMethod;
    });
    if (legacyMethodless) {
      return clone(legacyMethodless);
    }

    const categoryFallback = activeRates.find(function (rate) {
      const rateMethod = normaliseInstallMethod(rate.category, rate.installType, rate.installMethod);
      return rate.category === settings.category
        && rate.installType === "standard"
        && rate.jobType === settings.jobType
        && rateMethod === targetMethod;
    });
    if (categoryFallback) {
      return clone(categoryFallback);
    }

    const globalFallback = activeRates.find(function (rate) {
      return rate.category === settings.category && rate.installType === "standard";
    });

    return globalFallback ? clone(globalFallback) : null;
  }

  window.OperonInstallRates = {
    list: listActiveRates,
    getInstallRate: getInstallRate,
    normaliseInstallType: normaliseInstallType,
    normaliseInstallMethod: normaliseInstallMethod
  };
}());
