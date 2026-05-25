(function () {
  // Source of truth for Operon location / suburb zone pricing.
  // Future Google Sheets / Supabase integration can replace this file with fetched data.
  const LOCATION_ZONES = [
    {
      zoneName: "Auburn Service Zone",
      suburbs: ["Auburn", "Lidcombe", "Berala"],
      postcodes: ["2144", "2141", "2140"],
      distanceFromBaseKm: 12,
      travelFee: 0,
      minimumJobFee: 1500,
      surchargePercent: 0,
      active: true
    },
    {
      zoneName: "Parramatta Service Zone",
      suburbs: ["Parramatta", "Westmead", "Granville"],
      postcodes: ["2150", "2145", "2142"],
      distanceFromBaseKm: 18,
      travelFee: 0,
      minimumJobFee: 1500,
      surchargePercent: 0,
      active: true
    },
    {
      zoneName: "Liverpool Service Zone",
      suburbs: ["Liverpool", "Casula", "Moorebank"],
      postcodes: ["2170", "2176", "2171"],
      distanceFromBaseKm: 28,
      travelFee: 35,
      minimumJobFee: 1500,
      surchargePercent: 4,
      active: true
    },
    {
      zoneName: "Blacktown Service Zone",
      suburbs: ["Blacktown", "Seven Hills", "Kings Park"],
      postcodes: ["2148", "2147", "2148"],
      distanceFromBaseKm: 33,
      travelFee: 55,
      minimumJobFee: 1500,
      surchargePercent: 7,
      active: true
    },
    {
      zoneName: "Miranda Service Zone",
      suburbs: ["Miranda", "Gymea", "Caringbah"],
      postcodes: ["2228", "2227", "2229"],
      distanceFromBaseKm: 34,
      travelFee: 70,
      minimumJobFee: 1500,
      surchargePercent: 10,
      active: true
    },
    {
      zoneName: "Default Sydney Zone",
      suburbs: [],
      postcodes: [],
      distanceFromBaseKm: 25,
      travelFee: 25,
      minimumJobFee: 1500,
      surchargePercent: 4,
      active: true,
      fallback: true
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getLocationZonesData() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("locationZones") : null;
    return Array.isArray(source) && source.length ? source : LOCATION_ZONES;
  }

  function normalise(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function listActive() {
    return getLocationZonesData().filter(function (zone) {
      return zone.active !== false;
    }).map(clone);
  }

  function matchZone(options) {
    const settings = Object.assign({ suburb: "", postcode: "" }, options || {});
    const suburb = normalise(settings.suburb);
    const postcode = String(settings.postcode || "").replace(/\D/g, "");
    const activeZones = getLocationZonesData().filter(function (zone) {
      return zone.active !== false;
    });

    const suburbMatch = activeZones.find(function (zone) {
      return (zone.suburbs || []).map(normalise).indexOf(suburb) >= 0;
    });
    if (suburbMatch) {
      return clone(suburbMatch);
    }

    const postcodeMatch = activeZones.find(function (zone) {
      return (zone.postcodes || []).indexOf(postcode) >= 0;
    });
    if (postcodeMatch) {
      return clone(postcodeMatch);
    }

    const fallback = activeZones.find(function (zone) {
      return zone.fallback;
    });
    return fallback ? clone(fallback) : clone(activeZones[0] || null);
  }

  window.OperonLocationZones = {
    list: listActive,
    matchZone: matchZone
  };
}());
