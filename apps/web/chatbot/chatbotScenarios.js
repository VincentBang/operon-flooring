(function () {
  const SCENARIOS = {
    apartment_renovation: {
      id: "apartment_renovation",
      label: "Apartment renovation",
      summary: "Apartment projects need access details early: lift, level, parking, loading rules, and any building constraints.",
      route: "quote",
      keywords: ["apartment", "unit", "strata", "lift", "level", "loading dock"],
      initialPatch: {
        access: "apartment",
        property_type: "unit_apartment",
        parking_access: "limited"
      },
      flags: ["apartment_access_review"],
      steps: [
        {
          id: "apartment_lift",
          question: "First apartment detail: is there lift access?",
          actions: [
            { id: "scenario_apartment_lift_yes", label: "Lift available", patch: { has_lift: "yes" } },
            { id: "scenario_apartment_lift_no", label: "No lift", patch: { has_lift: "no" }, flags: ["manual_access_review"] },
            { id: "scenario_apartment_lift_unsure", label: "Lift unsure", patch: { has_lift: "" }, flags: ["lift_not_confirmed"] }
          ]
        },
        {
          id: "apartment_level",
          question: "Which level is the work on?",
          actions: [
            { id: "scenario_apartment_level_ground", label: "Ground", patch: { level: "ground" } },
            { id: "scenario_apartment_level_1", label: "Level 1", patch: { level: "level_1" } },
            { id: "scenario_apartment_level_2_plus", label: "Level 2+", patch: { level: "level_2_plus" }, flags: ["upper_level_access_review"] },
            { id: "scenario_apartment_level_unsure", label: "Unsure", patch: { level: "other_unsure" }, flags: ["level_not_confirmed"] }
          ]
        },
        {
          id: "apartment_parking",
          question: "How does parking or loading access look?",
          actions: [
            { id: "scenario_access_easy", label: "Easy access", patch: { parking_access: "easy" } },
            { id: "scenario_access_limited", label: "Limited access", patch: { parking_access: "limited" }, flags: ["parking_access_review"] },
            { id: "scenario_access_unsure", label: "Access unsure", patch: { parking_access: "unsure" }, flags: ["access_not_confirmed"] }
          ]
        }
      ]
    },
    replacing_carpet: {
      id: "replacing_carpet",
      label: "Replacing carpet",
      summary: "Carpet replacement usually needs removal, disposal, furniture, and subfloor condition checked before submit.",
      route: "quote",
      keywords: ["carpet", "replace carpet", "old carpet"],
      initialPatch: {
        existing_floor: "carpet",
        removal_disposal: "unsure"
      },
      flags: ["removal_scope_review"],
      steps: [
        {
          id: "carpet_disposal",
          question: "Will removed carpet disposal need to be included?",
          actions: [
            { id: "scenario_disposal_yes", label: "Include disposal", patch: { removal_disposal: "yes" } },
            { id: "scenario_disposal_no", label: "Customer handles disposal", patch: { removal_disposal: "no" } },
            { id: "scenario_disposal_unsure", label: "Disposal unsure", patch: { removal_disposal: "unsure" }, flags: ["disposal_not_confirmed"] }
          ]
        },
        {
          id: "carpet_subfloor",
          question: "What do you know about the subfloor after the carpet comes up?",
          actions: [
            { id: "scenario_subfloor_good", label: "Looks good", patch: { subfloor_condition: "good", floor_prep_type: "none" } },
            { id: "scenario_subfloor_minor", label: "May need levelling", patch: { subfloor_condition: "minor_prep", floor_prep_type: "levelling" }, flags: ["floor_prep_review"] },
            { id: "scenario_subfloor_unsure", label: "Unsure", patch: { subfloor_condition: "unsure", floor_prep_type: "unsure" }, flags: ["subfloor_not_confirmed"] }
          ]
        },
        {
          id: "carpet_furniture",
          question: "Will furniture need to be moved?",
          actions: [
            { id: "scenario_furniture_none", label: "No furniture", patch: { furniture: "none" } },
            { id: "scenario_furniture_some", label: "Some furniture", patch: { furniture: "some" }, flags: ["furniture_scope_review"] },
            { id: "scenario_furniture_unsure", label: "Furniture unsure", patch: { furniture: "unsure" }, flags: ["furniture_not_confirmed"] }
          ]
        }
      ]
    },
    install_only: {
      id: "install_only",
      label: "Installation only",
      summary: "Installation-only jobs should capture materials, access, trims, and site conditions while leaving pricing to the quote system.",
      route: "quote",
      keywords: ["install only", "already bought", "already have flooring", "my own flooring", "own materials"],
      initialPatch: {
        quote_mode: "install_only",
        selection_mode: "decide_later"
      },
      flags: ["install_only_path"],
      steps: [
        {
          id: "install_only_category",
          question: "What type of flooring will be installed?",
          actions: [
            { id: "scenario_category_hybrid", label: "Hybrid", patch: { category: "hybrid" } },
            { id: "scenario_category_laminate", label: "Laminate", patch: { category: "laminate" } },
            { id: "scenario_category_engineered", label: "Engineered timber", patch: { category: "engineered" }, flags: ["engineered_install_review"] },
            { id: "scenario_category_unsure", label: "Unsure", patch: {}, flags: ["category_not_confirmed"] }
          ]
        },
        {
          id: "install_only_existing_floor",
          question: "Is any existing flooring being removed first?",
          actions: [
            { id: "scenario_existing_none", label: "No removal", patch: { existing_floor: "none", removal_disposal: "no" } },
            { id: "scenario_existing_carpet", label: "Carpet removal", patch: { existing_floor: "carpet", removal_disposal: "unsure" }, flags: ["removal_scope_review"] },
            { id: "scenario_existing_floating", label: "Floating floor removal", patch: { existing_floor: "floating", removal_disposal: "unsure" }, flags: ["removal_scope_review"] },
            { id: "scenario_existing_unsure", label: "Removal unsure", patch: { existing_floor: "unsure", removal_disposal: "unsure" }, flags: ["removal_not_confirmed"] }
          ]
        },
        {
          id: "install_only_access",
          question: "How would you describe access for the installers?",
          actions: [
            { id: "scenario_install_access_easy", label: "Easy access", patch: { access: "easy", parking_access: "easy" } },
            { id: "scenario_install_access_limited", label: "Limited access", patch: { access: "limited", parking_access: "limited" }, flags: ["access_review_recommended"] },
            { id: "scenario_install_access_unsure", label: "Access unsure", patch: { access: "unsure", parking_access: "unsure" }, flags: ["access_not_confirmed"] }
          ]
        }
      ]
    },
    unknown_area: {
      id: "unknown_area",
      label: "Unknown area",
      summary: "If area is unknown, keep the quote path moving with a rough manual total, room-by-room entry, or floor plan upload.",
      route: "quote",
      keywords: ["do not know area", "don't know area", "unknown area", "not measured", "measure", "floor plan", "floorplan"],
      initialPatch: {},
      flags: ["area_capture_needed"],
      steps: [
        {
          id: "unknown_area_method",
          question: "How would you like to capture the area in the quote?",
          actions: [
            { id: "scenario_area_manual", label: "Rough total", patch: { measurement_method: "manual_total" } },
            { id: "scenario_area_rooms", label: "Room by room", patch: { measurement_method: "room_by_room" } },
            { id: "scenario_area_floorplan", label: "Use floor plan", patch: { measurement_method: "floorplan_upload" }, flags: ["floorplan_area_needed"] }
          ]
        }
      ]
    },
    water_resistance_needed: {
      id: "water_resistance_needed",
      label: "Water resistance needed",
      summary: "When water resistance matters, hybrid is usually the safest starting category for the assistant to recommend.",
      route: "quote",
      keywords: ["water", "waterproof", "kitchen", "pet", "pets", "kids", "durable", "durability"],
      initialPatch: {
        category: "hybrid",
        selection_mode: "recommend"
      },
      flags: ["hybrid_recommended_for_durability"],
      steps: [
        {
          id: "water_area_context",
          question: "Where is water resistance most important?",
          actions: [
            { id: "scenario_water_kitchen", label: "Kitchen or living", patch: {}, flags: ["wet_area_context"] },
            { id: "scenario_water_pets", label: "Pets or kids", patch: {}, flags: ["busy_home_context"] },
            { id: "scenario_water_general", label: "Whole home", patch: {}, flags: ["whole_home_context"] }
          ]
        }
      ]
    },
    premium_finish: {
      id: "premium_finish",
      label: "Premium finish",
      summary: "A premium finish usually points toward engineered timber, with final review for method, pattern, and site conditions.",
      route: "products",
      keywords: ["premium", "engineered", "timber", "herringbone", "chevron", "feature floor", "high end"],
      initialPatch: {
        category: "engineered",
        selection_mode: "recommend"
      },
      flags: ["engineered_review_path"],
      steps: [
        {
          id: "premium_pattern",
          question: "Is the project likely to use a special pattern?",
          actions: [
            { id: "scenario_pattern_standard", label: "Standard plank", patch: {} },
            { id: "scenario_pattern_herringbone", label: "Herringbone or chevron", patch: {}, flags: ["pattern_manual_review"] },
            { id: "scenario_pattern_unsure", label: "Pattern unsure", patch: {}, flags: ["pattern_not_confirmed"] }
          ]
        }
      ]
    },
    ready_to_submit_check: {
      id: "ready_to_submit_check",
      label: "Ready to submit check",
      summary: "A final check should confirm area, existing floor, subfloor, access, stairs, and furniture before the quote is submitted.",
      route: "quoteReview",
      keywords: ["ready to submit", "submit", "final check", "check quote", "ready"],
      initialPatch: {
        readiness: "review"
      },
      flags: ["submission_scope_check"],
      steps: [
        {
          id: "ready_check_area",
          question: "Is the flooring area known?",
          actions: [
            { id: "scenario_ready_area_known", label: "Area known", patch: { measurement_method: "manual_total" } },
            { id: "scenario_ready_area_unknown", label: "Area unknown", patch: {}, flags: ["area_missing_for_ready_state"] }
          ]
        },
        {
          id: "ready_check_risks",
          question: "Any stairs, difficult access, or uncertain subfloor?",
          actions: [
            { id: "scenario_ready_risks_none", label: "No obvious risks", patch: {} },
            { id: "scenario_ready_risks_yes", label: "There are risks", patch: { readiness: "review" }, flags: ["manual_scope_review"] },
            { id: "scenario_ready_risks_unsure", label: "Unsure", patch: { readiness: "review" }, flags: ["scope_not_confirmed"] }
          ]
        }
      ]
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function includesAny(value, words) {
    return words.some(function (word) {
      return value.indexOf(word) >= 0;
    });
  }

  function getScenario(id) {
    return SCENARIOS[id] ? clone(SCENARIOS[id]) : null;
  }

  function getScenarioList() {
    return Object.keys(SCENARIOS).map(getScenario);
  }

  function detectScenario(text) {
    const value = String(text || "").toLowerCase();
    const ids = Object.keys(SCENARIOS);
    let index = 0;

    for (; index < ids.length; index += 1) {
      const scenario = SCENARIOS[ids[index]];
      if (includesAny(value, scenario.keywords || [])) {
        return getScenario(scenario.id);
      }
    }

    return null;
  }

  function getScenarioAction(actionId) {
    const ids = Object.keys(SCENARIOS);
    let scenarioIndex = 0;

    for (; scenarioIndex < ids.length; scenarioIndex += 1) {
      const scenario = SCENARIOS[ids[scenarioIndex]];
      const steps = scenario.steps || [];
      let stepIndex = 0;

      for (; stepIndex < steps.length; stepIndex += 1) {
        const actions = steps[stepIndex].actions || [];
        const match = actions.find(function (action) {
          return action.id === actionId;
        });

        if (match) {
          return {
            scenario: getScenario(scenario.id),
            stepIndex: stepIndex,
            action: clone(match)
          };
        }
      }
    }

    return null;
  }

  function getStep(scenarioId, stepIndex) {
    const scenario = SCENARIOS[scenarioId];
    const index = Number(stepIndex || 0);

    if (!scenario || !scenario.steps || !scenario.steps[index]) {
      return null;
    }

    return clone(scenario.steps[index]);
  }

  function buildStepMessage(scenario, step) {
    return scenario.label + ": " + step.question;
  }

  function buildIntroMessage(scenario) {
    return scenario.label + ". " + scenario.summary;
  }

  function getRouteKey(scenarioId) {
    const scenario = SCENARIOS[scenarioId];
    return scenario ? scenario.route : "quote";
  }

  window.OperonChatbotScenarios = {
    getScenario: getScenario,
    getScenarioList: getScenarioList,
    detectScenario: detectScenario,
    getScenarioAction: getScenarioAction,
    getStep: getStep,
    buildIntroMessage: buildIntroMessage,
    buildStepMessage: buildStepMessage,
    getRouteKey: getRouteKey
  };
}());
