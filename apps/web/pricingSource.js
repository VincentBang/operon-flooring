(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function parseBoolean(value) {
    const text = String(value || "").trim().toLowerCase();
    if (text === "" || text === "null" || text === "undefined") {
      return false;
    }
    return text === "true" || text === "1" || text === "yes" || text === "y";
  }

  function parseNumber(value) {
    if (value === "" || value === null || typeof value === "undefined") {
      return 0;
    }
    const parsed = Number(String(value).replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function splitList(value) {
    return String(value || "")
      .split("|")
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (inQuotes) {
        if (char === '"' && next === '"') {
          value += '"';
          index += 1;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          value += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(value);
        value = "";
      } else if (char === "\n") {
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      } else if (char === "\r") {
        // Ignore CR. LF handles the row ending.
      } else {
        value += char;
      }
    }

    if (value !== "" || row.length) {
      row.push(value);
      rows.push(row);
    }

    return rows.filter(function (currentRow) {
      return currentRow.some(function (cell) {
        return String(cell || "").trim() !== "";
      });
    });
  }

  function rowsToObjects(csvText) {
    const rows = parseCsv(csvText);
    if (!rows.length) {
      return [];
    }

    const headers = rows.shift().map(function (header) {
      return String(header || "").trim();
    });

    return rows.map(function (row) {
      return headers.reduce(function (accumulator, header, index) {
        accumulator[header] = row[index] || "";
        return accumulator;
      }, {});
    });
  }

  function buildSheetUrl(spreadsheetId, sheetName) {
    return "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(spreadsheetId) + "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheetName);
  }

  function normaliseCategoryMeta(rows) {
    return rows.reduce(function (accumulator, row) {
      const id = row.id || row.category || "";
      if (!id) {
        return accumulator;
      }

      accumulator[id] = {
        id: id,
        label: row.label || row.name || id,
        shortDescription: row.shortDescription || row.short_description || "",
        pricePerM2: parseNumber(row.pricePerM2 || row.price_per_m2),
        pageUrl: row.pageUrl || row.page_url || ""
      };
      return accumulator;
    }, {});
  }

  function normaliseProducts(rows) {
    return rows.reduce(function (accumulator, row) {
      const category = row.category || "hybrid";
      if (!accumulator[category]) {
        accumulator[category] = [];
      }

      accumulator[category].push({
        id: row.id || "",
        category: category,
        brand: row.brand || "",
        range: row.range || "",
        colour: row.colour || "",
        tone: row.tone || "",
        swatch: row.swatch || "",
        thickness: row.thickness || "",
        productType: row.productType || row.product_type || "",
        pricePerM2: parseNumber(row.pricePerM2 || row.price_per_m2),
        installRate: (row.installRate || row.install_rate) === "" ? null : parseNumber(row.installRate || row.install_rate),
        imageUrl: row.imageUrl || row.image_url || row.image || "",
        image: row.image || row.imageUrl || row.image_url || "",
        alt: row.alt || "",
        description: row.description || "",
        features: splitList(row.features),
        suitableFor: splitList(row.suitableFor || row.suitable_for),
        supplier: row.supplier || "",
        supplierUrl: row.supplierUrl || row.supplier_url || "",
        active: row.active === "" ? true : parseBoolean(row.active)
      });

      return accumulator;
    }, {});
  }

  function normaliseInstallRates(rows) {
    return rows.map(function (row) {
      return {
        id: row.id || "",
        category: row.category || "",
        installType: row.installType || row.install_type || "standard",
        jobType: row.jobType || row.job_type || "supply_install",
        ratePerM2: parseNumber(row.ratePerM2 || row.rate_per_m2),
        minimumCharge: parseNumber(row.minimumCharge || row.minimum_charge),
        active: row.active === "" ? true : parseBoolean(row.active)
      };
    });
  }

  function normaliseUnderlay(rows) {
    return rows.map(function (row) {
      return {
        id: row.id || "",
        name: row.name || "",
        suitableCategories: splitList(row.suitableCategories || row.suitable_categories),
        pricePerM2: parseNumber(row.pricePerM2 || row.price_per_m2),
        active: row.active === "" ? true : parseBoolean(row.active)
      };
    });
  }

  function normaliseSkirtingScotia(rows) {
    return rows.map(function (row) {
      return {
        id: row.id || "",
        type: row.type || "",
        formValue: row.formValue || row.form_value || "",
        material: row.material || "",
        pricingMethod: row.pricingMethod || row.pricing_method || "allowance_per_m2",
        price: parseNumber(row.price),
        active: row.active === "" ? true : parseBoolean(row.active)
      };
    });
  }

  function normaliseRemovalRates(rows) {
    return rows.map(function (row) {
      return {
        id: row.id || "",
        floorType: row.floorType || row.floor_type || "",
        aliases: splitList(row.aliases),
        ratePerM2: parseNumber(row.ratePerM2 || row.rate_per_m2),
        disposalFee: parseNumber(row.disposalFee || row.disposal_fee),
        active: row.active === "" ? true : parseBoolean(row.active)
      };
    });
  }

  function normaliseLocationZones(rows) {
    return rows.map(function (row) {
      return {
        zoneName: row.zoneName || row.zone_name || "",
        suburbs: splitList(row.suburbs),
        postcodes: splitList(row.postcodes),
        distanceFromBaseKm: parseNumber(row.distanceFromBaseKm || row.distance_from_base_km),
        travelFee: parseNumber(row.travelFee || row.travel_fee),
        minimumJobFee: parseNumber(row.minimumJobFee || row.minimum_job_fee),
        surchargePercent: parseNumber(row.surchargePercent || row.surcharge_percent),
        active: row.active === "" ? true : parseBoolean(row.active),
        fallback: parseBoolean(row.fallback)
      };
    });
  }

  function normalisePricingRules(rows) {
    const rules = {};
    rows.forEach(function (row) {
      const key = row.key || row.name || "";
      if (!key) {
        return;
      }

      const declaredType = String(row.type || row.value_type || "").trim().toLowerCase();
      const rawValue = row.value;

      if (declaredType === "number") {
        rules[key] = parseNumber(rawValue);
      } else if (declaredType === "boolean") {
        rules[key] = parseBoolean(rawValue);
      } else {
        const numericCandidate = String(rawValue || "").trim();
        if (numericCandidate !== "" && !Number.isNaN(Number(numericCandidate))) {
          rules[key] = parseNumber(rawValue);
        } else if (/^(true|false|yes|no|1|0)$/i.test(numericCandidate)) {
          rules[key] = parseBoolean(rawValue);
        } else {
          rules[key] = rawValue;
        }
      }
    });
    return rules;
  }

  const TABLE_NORMALISERS = {
    categoryMeta: normaliseCategoryMeta,
    products: normaliseProducts,
    installRates: normaliseInstallRates,
    underlay: normaliseUnderlay,
    skirtingScotia: normaliseSkirtingScotia,
    removalRates: normaliseRemovalRates,
    locationZones: normaliseLocationZones,
    pricingRules: normalisePricingRules
  };

  const config = window.OPERON_PRICING_SOURCE_CONFIG || { mode: "local", googleSheets: {}, netlifyCatalogue: {} };
  const state = {
    mode: config.mode || "local",
    ready: config.mode === "local",
    sourceLabel: config.mode === "google_sheets"
      ? "Google Sheets"
      : (config.mode === "netlify_catalogue" ? "Supabase Catalogue" : "Local JS files"),
    tables: {},
    error: "",
    loadedAt: ""
  };

  let loadPromise = Promise.resolve(state);

  function dispatch(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function getTable(name) {
    const table = state.tables[name];
    return table ? clone(table) : null;
  }

  function getStatus() {
    return clone({
      mode: state.mode,
      ready: state.ready,
      sourceLabel: state.sourceLabel,
      loadedAt: state.loadedAt,
      error: state.error
    });
  }

  async function fetchSheet(spreadsheetId, sheetName) {
    const response = await fetch(buildSheetUrl(spreadsheetId, sheetName), {
      credentials: "omit",
      mode: "cors"
    });

    if (!response.ok) {
      throw new Error("Failed to load sheet: " + sheetName);
    }

    return response.text();
  }

  async function loadGoogleSheetsData() {
    const googleSheetsConfig = config.googleSheets || {};
    const spreadsheetId = googleSheetsConfig.spreadsheetId || "";
    const sheetMap = googleSheetsConfig.sheets || {};

    if (!spreadsheetId) {
      state.ready = false;
      state.error = "Google Sheets pricing mode is enabled, but spreadsheetId is missing.";
      dispatch("operon-pricing-source-error", getStatus());
      return state;
    }

    const tableNames = Object.keys(TABLE_NORMALISERS);
    const nextTables = {};

    await Promise.all(tableNames.map(async function (tableName) {
      const sheetName = sheetMap[tableName];
      if (!sheetName) {
        return;
      }
      const csvText = await fetchSheet(spreadsheetId, sheetName);
      const rows = rowsToObjects(csvText);
      nextTables[tableName] = TABLE_NORMALISERS[tableName](rows);
    }));

    state.tables = nextTables;
    state.ready = true;
    state.error = "";
    state.loadedAt = new Date().toISOString();
    dispatch("operon-pricing-source-ready", getStatus());
    return state;
  }

  async function loadNetlifyCatalogueData() {
    const netlifyConfig = config.netlifyCatalogue || {};
    const endpoint = netlifyConfig.endpoint || "/.netlify/functions/public-catalogue-pricing";

    const response = await fetch(endpoint, {
      credentials: "same-origin",
      headers: {
        Accept: "application/json"
      }
    });

    const payload = await response.json().catch(function () {
      return null;
    });

    if (!response.ok || !payload || !payload.ok) {
      throw new Error(payload && payload.error ? payload.error : "Public catalogue pricing load failed.");
    }

    state.tables = {
      categoryMeta: payload.categoryMeta || {},
      products: payload.products || {}
    };
    state.ready = true;
    state.error = "";
    state.sourceLabel = netlifyConfig.sourceLabel || "Supabase Catalogue";
    state.loadedAt = new Date().toISOString();
    dispatch("operon-pricing-source-ready", getStatus());
    return state;
  }

  if (config.mode === "google_sheets") {
    loadPromise = loadGoogleSheetsData().catch(function (error) {
      state.ready = false;
      state.error = error && error.message ? error.message : "Google Sheets pricing load failed.";
      dispatch("operon-pricing-source-error", getStatus());
      return state;
    });
  } else if (config.mode === "netlify_catalogue") {
    loadPromise = loadNetlifyCatalogueData().catch(function (error) {
      state.ready = false;
      state.error = error && error.message ? error.message : "Supabase catalogue pricing load failed.";
      dispatch("operon-pricing-source-error", getStatus());
      return state;
    });
  }

  window.OperonPricingSource = {
    getTable: getTable,
    getStatus: getStatus,
    whenReady: function () { return loadPromise; }
  };
}());
