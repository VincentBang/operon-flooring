(() => {
  const VISUALISER_PRODUCT_KEY = "operon-visualiser-product";
  const VISUALISER_STYLE_KEY = "operon-visualiser-style";
  const CUSTOM_SAMPLE_STYLE_ID = "custom-uploaded-sample";
  const DEFAULT_UPLOADED_QUAD = [
    { x: 0.24, y: 0.58 },
    { x: 0.76, y: 0.58 },
    { x: 0.93, y: 0.95 },
    { x: 0.07, y: 0.95 }
  ];
  const CANVAS_PADDING = 22;
  const MIN_GUIDE_GAP = 0.04;
  const MIN_GUIDE_AREA = 0.015;
  const GUIDE_OVERFLOW = 0.14;
  const GUIDE_SNAP_THRESHOLD = 0.012;
  const GUIDE_CORNER_LABELS = ["Back left", "Back right", "Front right", "Front left"];
  const GUIDE_CORNER_SHORT_LABELS = ["BL", "BR", "FR", "FL"];
  const GUIDE_EDGE_LABELS = ["Back wall", "Right wall", "Front edge", "Left wall"];
  const EDGE_POINT_INDEXES = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0]
  ];
  const CORNER_EDGE_INDEXES = [
    [0, 3],
    [0, 1],
    [1, 2],
    [2, 3]
  ];
  const CORNER_HANDLE_RADIUS = 22;
  const EDGE_HANDLE_RADIUS = 16;
  const KEYBOARD_NUDGE = 0.003;
  const KEYBOARD_NUDGE_LARGE = 0.01;

  const dom = {
    canvas: document.getElementById("visualiserCanvas"),
    canvasWrap: document.getElementById("canvasWrap"),
    sceneGrid: document.getElementById("sceneGrid"),
    familyTabs: document.getElementById("familyTabs"),
    styleGrid: document.getElementById("styleGrid"),
    productSwitchRail: document.getElementById("productSwitchRail"),
    recentSwitchRail: document.getElementById("recentSwitchRail"),
    recentSwitchBlock: document.getElementById("recentSwitchBlock"),
    productSwitchMeta: document.getElementById("productSwitchMeta"),
    sampleUpload: document.getElementById("sampleUpload"),
    clearSample: document.getElementById("clearSample"),
    sampleUploadStatus: document.getElementById("sampleUploadStatus"),
    roomUpload: document.getElementById("roomUpload"),
    resetGuides: document.getElementById("resetGuides"),
    togglePreview: document.getElementById("togglePreview"),
    revertPreset: document.getElementById("revertPreset"),
    compareSlider: document.getElementById("compareSlider"),
    blendSlider: document.getElementById("blendSlider"),
    directionTrimSlider: document.getElementById("directionTrimSlider"),
    plankScaleSlider: document.getElementById("plankScaleSlider"),
    saveProduct: document.getElementById("saveProduct"),
    previousStyle: document.getElementById("previousStyle"),
    nextStyle: document.getElementById("nextStyle"),
    holdOriginal: document.getElementById("holdOriginal"),
    straightenBackEdge: document.getElementById("straightenBackEdge"),
    straightenFrontEdge: document.getElementById("straightenFrontEdge"),
    straightenLeftEdge: document.getElementById("straightenLeftEdge"),
    straightenRightEdge: document.getElementById("straightenRightEdge"),
    squareSideEdges: document.getElementById("squareSideEdges"),
    globalStatus: document.getElementById("globalStatus"),
    handoffStatus: document.getElementById("handoffStatus"),
    stageStatusBadge: document.getElementById("stageStatusBadge"),
    stageStatusText: document.getElementById("stageStatusText"),
    canvasStateCard: document.getElementById("canvasStateCard"),
    canvasStateLabel: document.getElementById("canvasStateLabel"),
    canvasStateTitle: document.getElementById("canvasStateTitle"),
    canvasStateCopy: document.getElementById("canvasStateCopy"),
    activeSceneLabel: document.getElementById("activeSceneLabel"),
    activeFamilyLabel: document.getElementById("activeFamilyLabel"),
    activeStyleLabel: document.getElementById("activeStyleLabel"),
    selectedFamilyText: document.getElementById("selectedFamilyText"),
    selectedStyleText: document.getElementById("selectedStyleText"),
    selectedStyleSwatch: document.getElementById("selectedStyleSwatch"),
    selectedStyleNote: document.getElementById("selectedStyleNote"),
    selectedSourceText: document.getElementById("selectedSourceText"),
    sourceNote: document.getElementById("sourceNote"),
    compareValue: document.getElementById("compareValue"),
    compareModeNote: document.getElementById("compareModeNote"),
    blendValue: document.getElementById("blendValue"),
    activeGuideValue: document.getElementById("activeGuideValue"),
    directionValue: document.getElementById("directionValue"),
    directionTrimValue: document.getElementById("directionTrimValue"),
    plankScaleValue: document.getElementById("plankScaleValue"),
    plankScaleReadout: document.getElementById("plankScaleReadout"),
    compareSummary: document.getElementById("compareSummary"),
    guideNote: document.getElementById("guideNote"),
    guideAssistCopy: document.getElementById("guideAssistCopy"),
    canvasOverlayLabel: document.getElementById("canvasOverlayLabel"),
    guideCornerButtons: Array.from(document.querySelectorAll("[data-guide-corner]")),
    directionModeButtons: Array.from(document.querySelectorAll("[data-direction-base]")),
    comparePresetButtons: Array.from(document.querySelectorAll("[data-compare-preset]")),
    nudgeButtons: Array.from(document.querySelectorAll("[data-nudge]"))
  };

  if (!dom.canvas) {
    return;
  }

  const context = dom.canvas.getContext("2d");
  if (!context) {
    return;
  }

  function encodeSvg(svg) {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function hashString(value) {
    let hash = 1779033703 ^ value.length;
    for (let index = 0; index < value.length; index += 1) {
      hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }
    return function () {
      hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      return (hash ^= hash >>> 16) >>> 0;
    };
  }

  function mulberry32(seed) {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, amount) {
    return start + ((end - start) * amount);
  }

  function luminanceFromRgb(r, g, b) {
    return ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;
  }

  function hexToRgb(value) {
    const normalized = value.replace("#", "");
    const safe = normalized.length === 3
      ? normalized.split("").map(function (character) { return character + character; }).join("")
      : normalized;
    return {
      r: parseInt(safe.slice(0, 2), 16),
      g: parseInt(safe.slice(2, 4), 16),
      b: parseInt(safe.slice(4, 6), 16)
    };
  }

  function shiftRgb(color, amount) {
    return {
      r: clamp(Math.round(color.r + amount), 0, 255),
      g: clamp(Math.round(color.g + amount), 0, 255),
      b: clamp(Math.round(color.b + amount), 0, 255)
    };
  }

  function mixRgb(first, second, amount) {
    return {
      r: Math.round(lerp(first.r, second.r, amount)),
      g: Math.round(lerp(first.g, second.g, amount)),
      b: Math.round(lerp(first.b, second.b, amount))
    };
  }

  function rgbToCss(color, alpha) {
    if (typeof alpha === "number") {
      return "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
    }
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
  }

  function componentToHex(value) {
    return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
  }

  function rgbToHex(color) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
  }

  function stripFileExtension(name) {
    return String(name || "").replace(/\.[a-z0-9]+$/i, "");
  }

  function formatSampleFileName(name) {
    const baseName = stripFileExtension(name).trim();
    if (!baseName) {
      return "Uploaded sample";
    }
    return baseName.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function getCoverDrawDimensions(sourceWidth, sourceHeight, targetWidth, targetHeight) {
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = targetWidth / targetHeight;
    let drawWidth = targetWidth;
    let drawHeight = targetHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (sourceRatio > targetRatio) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * sourceRatio;
      offsetX = (targetWidth - drawWidth) / 2;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / sourceRatio;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    return {
      x: offsetX,
      y: offsetY,
      width: drawWidth,
      height: drawHeight
    };
  }

  function drawImageCover(targetContext, image, width, height) {
    const cover = getCoverDrawDimensions(image.width, image.height, width, height);
    targetContext.drawImage(image, cover.x, cover.y, cover.width, cover.height);
  }

  function averageRegionColor(pixels, width, startX, endX, startY, endY) {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const index = ((y * width) + x) * 4;
        totalR += pixels[index];
        totalG += pixels[index + 1];
        totalB += pixels[index + 2];
        count += 1;
      }
    }

    if (!count) {
      return { r: 210, g: 190, b: 170 };
    }

    return {
      r: totalR / count,
      g: totalG / count,
      b: totalB / count
    };
  }

  function buildPaletteFromImage(image) {
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 120;
    sampleCanvas.height = 120;
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    if (!sampleContext) {
      return ["#d8c8b4", "#c5af91", "#e7dbcc", "#b59a79"];
    }

    sampleContext.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
    drawImageCover(sampleContext, image, sampleCanvas.width, sampleCanvas.height);
    const imageData = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
    const bandTop = Math.round(sampleCanvas.height * 0.16);
    const bandBottom = Math.round(sampleCanvas.height * 0.84);
    const slices = [
      [0.05, 0.26],
      [0.27, 0.48],
      [0.49, 0.7],
      [0.71, 0.94]
    ];

    return slices.map(function (slice) {
      const color = averageRegionColor(
        imageData.data,
        sampleCanvas.width,
        Math.round(sampleCanvas.width * slice[0]),
        Math.round(sampleCanvas.width * slice[1]),
        bandTop,
        bandBottom
      );
      return rgbToHex(color);
    });
  }

  function buildSampleTileCanvas(image) {
    const tile = document.createElement("canvas");
    tile.width = 320;
    tile.height = 320;
    const tileContext = tile.getContext("2d");
    if (!tileContext) {
      return null;
    }

    tileContext.clearRect(0, 0, tile.width, tile.height);
    drawImageCover(tileContext, image, tile.width, tile.height);
    return tile;
  }

  function clonePoint(point) {
    return { x: point.x, y: point.y };
  }

  function cloneQuad(quad) {
    return quad.map(clonePoint);
  }

  function cloneGuideLines(lines) {
    return (lines || []).map(function (line) {
      return Object.assign({}, line);
    });
  }

  function createSceneSvg(config) {
    return encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${config.wallTop}"/>
            <stop offset="100%" stop-color="${config.wallBottom}"/>
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${config.floorTop}"/>
            <stop offset="100%" stop-color="${config.floorBottom}"/>
          </linearGradient>
          <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${config.windowTop}"/>
            <stop offset="100%" stop-color="${config.windowBottom}"/>
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity="0.22"/>
          </filter>
        </defs>
        <rect width="1400" height="900" fill="url(#wall)"/>
        <rect x="0" y="520" width="1400" height="380" fill="url(#floor)"/>
        <rect x="120" y="88" width="360" height="300" rx="26" fill="#f8f6f2" opacity="0.84"/>
        <rect x="150" y="114" width="300" height="246" rx="18" fill="url(#window)"/>
        <rect x="195" y="114" width="10" height="246" fill="rgba(255,255,255,0.55)"/>
        <rect x="305" y="114" width="10" height="246" fill="rgba(255,255,255,0.55)"/>
        <rect x="150" y="233" width="300" height="10" fill="rgba(255,255,255,0.55)"/>
        <rect x="1020" y="118" width="210" height="130" rx="20" fill="rgba(255,255,255,0.66)"/>
        <rect x="1060" y="158" width="130" height="16" rx="8" fill="${config.frame}"/>
        <rect x="1060" y="192" width="94" height="12" rx="6" fill="${config.frame}" opacity="0.72"/>
        ${config.hero}
        ${config.accent}
        <ellipse cx="700" cy="700" rx="420" ry="76" fill="rgba(0,0,0,0.08)" opacity="0.36"/>
        <path d="M140 894 L430 588 L970 588 L1260 894 Z" fill="rgba(255,255,255,0.05)"/>
      </svg>
    `);
  }

  const scenePresets = {
    living: {
      id: "living",
      label: "Living room",
      sourceLabel: "Sample living room",
      description: "Open family room with a wide floor area.",
      quad: [
        { x: 0.23, y: 0.57 },
        { x: 0.77, y: 0.57 },
        { x: 0.95, y: 0.95 },
        { x: 0.05, y: 0.95 }
      ],
      image: createSceneSvg({
        wallTop: "#f7efe5",
        wallBottom: "#eadbc7",
        floorTop: "#d2c0aa",
        floorBottom: "#aa927d",
        windowTop: "#dceef5",
        windowBottom: "#b8d4dd",
        frame: "#736250",
        hero: `
          <g filter="url(#shadow)">
            <rect x="450" y="418" width="420" height="170" rx="28" fill="#d7c7b8"/>
            <rect x="488" y="384" width="126" height="80" rx="22" fill="#c7b3a0"/>
            <rect x="705" y="384" width="126" height="80" rx="22" fill="#c7b3a0"/>
            <rect x="470" y="458" width="382" height="94" rx="26" fill="#cfbda9"/>
            <rect x="612" y="540" width="118" height="32" rx="16" fill="#a58d77"/>
          </g>
        `,
        accent: `
          <g filter="url(#shadow)">
            <rect x="985" y="430" width="150" height="124" rx="24" fill="#c9baa8"/>
            <rect x="265" y="444" width="108" height="128" rx="24" fill="#d8c9b8"/>
            <rect x="1120" y="350" width="20" height="220" rx="10" fill="#8e7459"/>
            <ellipse cx="1130" cy="328" rx="44" ry="34" fill="#eadfcf"/>
            <rect x="206" y="360" width="24" height="206" rx="12" fill="#8a765f"/>
            <ellipse cx="218" cy="334" rx="50" ry="38" fill="#e8dece"/>
          </g>
        `
      })
    },
    bedroom: {
      id: "bedroom",
      label: "Bedroom",
      sourceLabel: "Sample bedroom",
      description: "Soft bedroom setup with a slightly narrower floor.",
      quad: [
        { x: 0.28, y: 0.56 },
        { x: 0.72, y: 0.54 },
        { x: 0.88, y: 0.95 },
        { x: 0.12, y: 0.95 }
      ],
      image: createSceneSvg({
        wallTop: "#f4ede7",
        wallBottom: "#eadbce",
        floorTop: "#cfbea8",
        floorBottom: "#a58e77",
        windowTop: "#d8ebf7",
        windowBottom: "#bed7e7",
        frame: "#7d6551",
        hero: `
          <g filter="url(#shadow)">
            <rect x="410" y="318" width="560" height="290" rx="34" fill="#d2c0ae"/>
            <rect x="470" y="250" width="440" height="120" rx="32" fill="#b99f8a"/>
            <rect x="505" y="340" width="156" height="76" rx="20" fill="#f2ede6"/>
            <rect x="720" y="340" width="156" height="76" rx="20" fill="#f2ede6"/>
            <rect x="472" y="432" width="430" height="126" rx="24" fill="#d8c6b4"/>
          </g>
        `,
        accent: `
          <g filter="url(#shadow)">
            <rect x="250" y="404" width="116" height="130" rx="22" fill="#d8cbbc"/>
            <rect x="1045" y="404" width="116" height="130" rx="22" fill="#d8cbbc"/>
            <rect x="272" y="362" width="72" height="54" rx="14" fill="#efe7dd"/>
            <rect x="1067" y="362" width="72" height="54" rx="14" fill="#efe7dd"/>
            <rect x="1110" y="240" width="18" height="300" rx="9" fill="#7c634f"/>
            <ellipse cx="1118" cy="214" rx="42" ry="30" fill="#e6dece"/>
          </g>
        `
      })
    },
    dining: {
      id: "dining",
      label: "Dining room",
      sourceLabel: "Sample dining room",
      description: "Structured dining scene with a broad floor reveal.",
      quad: [
        { x: 0.2, y: 0.59 },
        { x: 0.8, y: 0.59 },
        { x: 0.94, y: 0.95 },
        { x: 0.06, y: 0.95 }
      ],
      image: createSceneSvg({
        wallTop: "#f6efe8",
        wallBottom: "#e5d4bf",
        floorTop: "#cdb89d",
        floorBottom: "#a1886e",
        windowTop: "#dff1f6",
        windowBottom: "#bed5db",
        frame: "#7d6856",
        hero: `
          <g filter="url(#shadow)">
            <rect x="500" y="380" width="398" height="48" rx="22" fill="#a28467"/>
            <rect x="532" y="430" width="334" height="96" rx="26" fill="#b79878"/>
            <rect x="566" y="522" width="24" height="92" rx="12" fill="#86694f"/>
            <rect x="808" y="522" width="24" height="92" rx="12" fill="#86694f"/>
            <rect x="620" y="522" width="24" height="92" rx="12" fill="#86694f"/>
            <rect x="754" y="522" width="24" height="92" rx="12" fill="#86694f"/>
          </g>
        `,
        accent: `
          <g filter="url(#shadow)">
            <rect x="448" y="406" width="48" height="136" rx="18" fill="#ccb6a0"/>
            <rect x="902" y="406" width="48" height="136" rx="18" fill="#ccb6a0"/>
            <rect x="404" y="446" width="40" height="120" rx="16" fill="#d7c2ac"/>
            <rect x="954" y="446" width="40" height="120" rx="16" fill="#d7c2ac"/>
            <rect x="1020" y="360" width="160" height="160" rx="28" fill="#f4ede4"/>
          </g>
        `
      })
    }
  };

  const productFamilies = {
    hybrid: {
      id: "hybrid",
      label: "Hybrid Flooring",
      summary: "Water-friendly, practical, and easy for broad residential selling.",
      styles: [
        {
          id: "hybrid-coastal",
          label: "Coastal Oak",
          note: "Light and clean for airy spaces.",
          colors: ["#dcc2a1", "#c79f70", "#e4cfb7", "#b88859"]
        },
        {
          id: "hybrid-smoked",
          label: "Smoked Oak",
          note: "Mid-tone depth without feeling too dark.",
          colors: ["#8f6747", "#a87d57", "#755338", "#bf9a75"]
        },
        {
          id: "hybrid-sand",
          label: "Sand Ash",
          note: "Soft neutral for broad market appeal.",
          colors: ["#d8c8b4", "#c5af91", "#e7dbcc", "#b59a79"]
        },
        {
          id: "hybrid-toffee",
          label: "Toffee Oak",
          note: "Warmer and more furnished in feel.",
          colors: ["#a26f41", "#c58a59", "#875834", "#d9ab7f"]
        }
      ]
    },
    laminate: {
      id: "laminate",
      label: "Laminate Flooring",
      summary: "Budget-conscious direction with lighter decorative flexibility.",
      styles: [
        {
          id: "laminate-stone",
          label: "Stone Greige",
          note: "Contemporary grey-beige mix.",
          colors: ["#b8ab9b", "#c9bcae", "#978a7a", "#d8cdc2"]
        },
        {
          id: "laminate-beige",
          label: "Soft Beige Oak",
          note: "Safe and versatile for rental updates.",
          colors: ["#d5c2a2", "#bfa17b", "#e1d4bf", "#a88359"]
        },
        {
          id: "laminate-wheat",
          label: "Wheat Timber",
          note: "Brighter and more cheerful in smaller rooms.",
          colors: ["#e0c79d", "#cfaa73", "#f1dfbb", "#b98a54"]
        },
        {
          id: "laminate-urban",
          label: "Urban Taupe",
          note: "Softer modern tone with muted contrast.",
          colors: ["#a69787", "#8c7d6e", "#b7a89a", "#d4c9be"]
        }
      ]
    },
    timber: {
      id: "timber",
      label: "Engineered Timber",
      summary: "Premium finish direction with richer depth and stronger character.",
      styles: [
        {
          id: "timber-euro",
          label: "European Oak",
          note: "Classic premium oak tone.",
          colors: ["#c7a277", "#b58456", "#dec0a0", "#9d6f46"]
        },
        {
          id: "timber-walnut",
          label: "Walnut Brown",
          note: "Richer premium depth for feature spaces.",
          colors: ["#6f4a30", "#8a5d3e", "#5c3b27", "#a57652"]
        },
        {
          id: "timber-limewash",
          label: "Limewashed Oak",
          note: "Soft premium pale timber direction.",
          colors: ["#ddd4c8", "#c2b29c", "#f1ece4", "#a9987f"]
        },
        {
          id: "timber-auburn",
          label: "Auburn Timber",
          note: "Warm and architectural with stronger grain value.",
          colors: ["#8d5934", "#b47446", "#714526", "#c59264"]
        }
      ]
    }
  };

  const state = {
    image: null,
    imageRect: null,
    imageAnalysis: null,
    selectedScene: "living",
    lastPresetScene: "living",
    selectedFamily: "hybrid",
    selectedStyle: "hybrid-coastal",
    compare: Number(dom.compareSlider ? dom.compareSlider.value : 58),
    blend: Number(dom.blendSlider ? dom.blendSlider.value : 84),
    textureRotationBase: 0,
    textureRotationTrim: Number(dom.directionTrimSlider ? dom.directionTrimSlider.value : 0),
    plankScale: Number(dom.plankScaleSlider ? dom.plankScaleSlider.value : 100),
    previewVisible: true,
    dragHandle: -1,
    dragTarget: null,
    hoverTarget: null,
    guideAssistMessage: "",
    guideAssistLines: [],
    selectedCornerIndex: 0,
    currentSourceLabel: "Sample living room",
    sourceType: "preset",
    floorQuadNormalized: cloneQuad(scenePresets.living.quad),
    lastStableFloorQuadNormalized: cloneQuad(scenePresets.living.quad),
    recentStyleIds: [],
    renderFrame: 0,
    needsUiRender: false,
    needsSummaryRender: false,
    needsCanvasRender: false,
    imageLoadId: 0,
    previewHoldRestore: false,
    imageLoadState: "idle",
    imageErrorMessage: "",
    customSample: null
  };

  const renderBuffers = {
    analysisCanvas: document.createElement("canvas"),
    analysisContext: null,
    replacementCanvas: document.createElement("canvas"),
    replacementContext: null,
    replacementImage: null
  };
  renderBuffers.analysisContext = renderBuffers.analysisCanvas.getContext("2d", { willReadFrequently: true });
  renderBuffers.replacementContext = renderBuffers.replacementCanvas.getContext("2d", { willReadFrequently: true });

  const textureCache = new Map();

  const Geometry = {
    quadArea(points) {
      if (!points || points.length !== 4) {
        return 0;
      }
      let area = 0;
      for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        const next = points[(index + 1) % points.length];
        area += (current.x * next.y) - (next.x * current.y);
      }
      return Math.abs(area) / 2;
    },

    isValidQuad(points) {
      return points
        && points.length === 4
        && points.every(function (point) {
          return Number.isFinite(point.x) && Number.isFinite(point.y);
        })
        && this.quadArea(points) >= MIN_GUIDE_AREA;
    },

    stabilizeQuad(quad, fallbackQuad) {
      const fallback = cloneQuad(fallbackQuad || scenePresets.living.quad);
      if (!quad || quad.length !== 4) {
        return fallback;
      }

      const next = cloneQuad(quad);
      next.forEach(function (point) {
        point.x = clamp(point.x, -GUIDE_OVERFLOW, 1 + GUIDE_OVERFLOW);
        point.y = clamp(point.y, -GUIDE_OVERFLOW, 1 + GUIDE_OVERFLOW);
      });

      if (next[1].x - next[0].x < MIN_GUIDE_GAP) {
        const middle = (next[0].x + next[1].x) / 2;
        next[0].x = clamp(middle - (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW, (1 + GUIDE_OVERFLOW) - MIN_GUIDE_GAP);
        next[1].x = clamp(middle + (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
      }

      if (next[2].x - next[3].x < MIN_GUIDE_GAP) {
        const middle = (next[2].x + next[3].x) / 2;
        next[3].x = clamp(middle - (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW, (1 + GUIDE_OVERFLOW) - MIN_GUIDE_GAP);
        next[2].x = clamp(middle + (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
      }

      if (next[3].y - next[0].y < MIN_GUIDE_GAP) {
        const middle = (next[0].y + next[3].y) / 2;
        next[0].y = clamp(middle - (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW, (1 + GUIDE_OVERFLOW) - MIN_GUIDE_GAP);
        next[3].y = clamp(middle + (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
      }

      if (next[2].y - next[1].y < MIN_GUIDE_GAP) {
        const middle = (next[1].y + next[2].y) / 2;
        next[1].y = clamp(middle - (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW, (1 + GUIDE_OVERFLOW) - MIN_GUIDE_GAP);
        next[2].y = clamp(middle + (MIN_GUIDE_GAP / 2), -GUIDE_OVERFLOW + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
      }

      if (!this.isValidQuad(next)) {
        return fallback;
      }

      return next;
    },

    constrainHandleMove(index, point, currentQuad) {
      const next = cloneQuad(currentQuad);
      const target = {
        x: clamp(point.x, -GUIDE_OVERFLOW, 1 + GUIDE_OVERFLOW),
        y: clamp(point.y, -GUIDE_OVERFLOW, 1 + GUIDE_OVERFLOW)
      };

      if (index === 0) {
        target.x = clamp(target.x, -GUIDE_OVERFLOW, next[1].x - MIN_GUIDE_GAP);
        target.y = clamp(target.y, -GUIDE_OVERFLOW, next[3].y - MIN_GUIDE_GAP);
      } else if (index === 1) {
        target.x = clamp(target.x, next[0].x + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
        target.y = clamp(target.y, -GUIDE_OVERFLOW, next[2].y - MIN_GUIDE_GAP);
      } else if (index === 2) {
        target.x = clamp(target.x, next[3].x + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
        target.y = clamp(target.y, next[1].y + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
      } else if (index === 3) {
        target.x = clamp(target.x, -GUIDE_OVERFLOW, next[2].x - MIN_GUIDE_GAP);
        target.y = clamp(target.y, next[0].y + MIN_GUIDE_GAP, 1 + GUIDE_OVERFLOW);
      }

      next[index] = target;
      return this.isValidQuad(next) ? next : cloneQuad(currentQuad);
    },

    translateQuad(currentQuad, delta) {
      const next = cloneQuad(currentQuad);
      const minX = Math.min.apply(null, next.map(function (point) { return point.x; }));
      const maxX = Math.max.apply(null, next.map(function (point) { return point.x; }));
      const minY = Math.min.apply(null, next.map(function (point) { return point.y; }));
      const maxY = Math.max.apply(null, next.map(function (point) { return point.y; }));
      const safeDeltaX = clamp(delta.x, -GUIDE_OVERFLOW - minX, (1 + GUIDE_OVERFLOW) - maxX);
      const safeDeltaY = clamp(delta.y, -GUIDE_OVERFLOW - minY, (1 + GUIDE_OVERFLOW) - maxY);

      next.forEach(function (point) {
        point.x += safeDeltaX;
        point.y += safeDeltaY;
      });

      return this.stabilizeQuad(next, currentQuad);
    },

    translateEdge(currentQuad, edgeIndex, delta) {
      const next = cloneQuad(currentQuad);
      EDGE_POINT_INDEXES[edgeIndex].forEach(function (pointIndex) {
        next[pointIndex].x += delta.x;
        next[pointIndex].y += delta.y;
      });
      return this.stabilizeQuad(next, currentQuad);
    },

    straightenEdge(currentQuad, edgeIndex) {
      const next = cloneQuad(currentQuad);
      const pointIndexes = EDGE_POINT_INDEXES[edgeIndex];
      if (edgeIndex === 0 || edgeIndex === 2) {
        const averageY = (next[pointIndexes[0]].y + next[pointIndexes[1]].y) / 2;
        next[pointIndexes[0]].y = averageY;
        next[pointIndexes[1]].y = averageY;
      } else {
        const averageX = (next[pointIndexes[0]].x + next[pointIndexes[1]].x) / 2;
        next[pointIndexes[0]].x = averageX;
        next[pointIndexes[1]].x = averageX;
      }
      return this.stabilizeQuad(next, currentQuad);
    },

    squareSideEdges(currentQuad) {
      const next = cloneQuad(currentQuad);
      const leftX = (next[0].x + next[3].x) / 2;
      const rightX = (next[1].x + next[2].x) / 2;
      next[0].x = leftX;
      next[3].x = leftX;
      next[1].x = rightX;
      next[2].x = rightX;
      return this.stabilizeQuad(next, currentQuad);
    }
  };

  function getFamilyStyles(familyId) {
    const family = productFamilies[familyId];
    if (!family) {
      return [];
    }

    const styles = family.styles.slice();
    if (state.customSample && state.customSample.familyId === familyId) {
      styles.unshift(state.customSample.style);
    }
    return styles;
  }

  function getCurrentFamily() {
    return productFamilies[state.selectedFamily];
  }

  function getStyleById(styleId) {
    const family = findFamilyByStyleId(styleId);
    if (!family) {
      return null;
    }
    return getFamilyStyles(family.id).find(function (style) {
      return style.id === styleId;
    }) || null;
  }

  function getCurrentStyle() {
    const family = getCurrentFamily();
    const styles = getFamilyStyles(family.id);
    const match = styles.find(function (style) {
      return style.id === state.selectedStyle;
    });
    return match || styles[0];
  }

  function findFamilyByStyleId(styleId) {
    return Object.values(productFamilies).find(function (family) {
      return getFamilyStyles(family.id).some(function (style) {
        return style.id === styleId;
      });
    }) || null;
  }

  function getStyleSwatchBackground(style) {
    const gradient = buildSwatchBackground(style.colors);
    if (style && style.sampleDataUrl) {
      return "center / cover no-repeat url('" + style.sampleDataUrl + "'), " + gradient;
    }
    return gradient;
  }

  function rememberRecentStyle(styleId) {
    if (!findFamilyByStyleId(styleId)) {
      return;
    }
    state.recentStyleIds = [styleId].concat(state.recentStyleIds.filter(function (recentStyleId) {
      return recentStyleId !== styleId;
    })).slice(0, 6);
  }

  function getRecentStyles() {
    return state.recentStyleIds.map(function (styleId) {
      const family = findFamilyByStyleId(styleId);
      if (!family) {
        return null;
      }
      const style = getFamilyStyles(family.id).find(function (candidate) {
        return candidate.id === styleId;
      });
      if (!style) {
        return null;
      }
      return {
        familyId: family.id,
        familyLabel: family.label,
        style: style
      };
    }).filter(Boolean);
  }

  function ensureStyleBelongsToFamily() {
    const family = getCurrentFamily();
    const styles = getFamilyStyles(family.id);
    const exists = styles.some(function (style) {
      return style.id === state.selectedStyle;
    });
    if (!exists && styles.length) {
      state.selectedStyle = styles[0].id;
    }
  }

  function buildCustomSampleStyle(fileName, dataUrl, image) {
    const palette = buildPaletteFromImage(image);
    const family = getCurrentFamily();
    return {
      id: CUSTOM_SAMPLE_STYLE_ID,
      label: "Your sample",
      note: "Matched from " + formatSampleFileName(fileName) + ".",
      colors: palette,
      sampleDataUrl: dataUrl,
      sampleTileCanvas: buildSampleTileCanvas(image),
      isCustom: true,
      familyId: family.id
    };
  }

  function setCustomSample(style) {
    textureCache.delete(CUSTOM_SAMPLE_STYLE_ID);
    state.customSample = {
      familyId: style.familyId,
      fileName: style.note,
      style: style
    };
    state.selectedFamily = style.familyId;
    state.selectedStyle = style.id;
    state.previewVisible = true;
    state.previewHoldRestore = false;
    rememberRecentStyle(style.id);
    if (dom.sampleUploadStatus) {
      dom.sampleUploadStatus.textContent = "Custom sample ready in " + getCurrentFamily().label + ". It is showing on the floor now.";
    }
    if (dom.clearSample) {
      dom.clearSample.disabled = false;
    }
    UI.setGlobalStatus("Custom sample ready. Your floor placement stayed in place.");
    scheduleRender({ ui: true, summary: true, canvas: true });
  }

  function clearCustomSample(options) {
    const removedSample = state.customSample;
    if (!removedSample) {
      if (dom.sampleUploadStatus) {
        dom.sampleUploadStatus.textContent = "No custom sample uploaded yet.";
      }
      if (dom.clearSample) {
        dom.clearSample.disabled = true;
      }
      if (dom.sampleUpload) {
        dom.sampleUpload.value = "";
      }
      return;
    }

    const removedFamilyId = removedSample.familyId;
    state.customSample = null;
    textureCache.delete(CUSTOM_SAMPLE_STYLE_ID);
    state.recentStyleIds = state.recentStyleIds.filter(function (styleId) {
      return styleId !== CUSTOM_SAMPLE_STYLE_ID;
    });

    if (state.selectedStyle === CUSTOM_SAMPLE_STYLE_ID) {
      const fallbackStyles = getFamilyStyles(state.selectedFamily);
      if (fallbackStyles.length) {
        state.selectedStyle = fallbackStyles[0].id;
      }
    }

    if (dom.sampleUploadStatus) {
      dom.sampleUploadStatus.textContent = "No custom sample uploaded yet.";
    }
    if (dom.clearSample) {
      dom.clearSample.disabled = true;
    }
    if (dom.sampleUpload) {
      dom.sampleUpload.value = "";
    }

    if (!options || options.status !== false) {
      const familyLabel = productFamilies[removedFamilyId] ? productFamilies[removedFamilyId].label : "the current family";
      UI.setGlobalStatus("Custom sample removed from " + familyLabel + ".");
    }
    scheduleRender({ ui: true, summary: true, canvas: true });
  }

  function loadCustomSampleFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const image = new Image();
      image.decoding = "async";
      image.onload = function () {
        setCustomSample(buildCustomSampleStyle(file.name || "Uploaded sample", event.target.result, image));
      };
      image.onerror = function () {
        if (dom.sampleUploadStatus) {
          dom.sampleUploadStatus.textContent = "This sample image could not be used. Try another file.";
        }
        UI.setGlobalStatus("Sample image could not be loaded. Try another file.");
      };
      image.src = event.target.result;
    };
    reader.onerror = function () {
      if (dom.sampleUploadStatus) {
        dom.sampleUploadStatus.textContent = "This sample image could not be read. Try another file.";
      }
      UI.setGlobalStatus("Sample image could not be read. Try another file.");
    };
    if (dom.sampleUploadStatus) {
      dom.sampleUploadStatus.textContent = "Preparing your sample...";
    }
    reader.readAsDataURL(file);
    if (dom.sampleUpload) {
      dom.sampleUpload.value = "";
    }
  }

  function getTextureRotationDegrees() {
    return state.textureRotationBase + state.textureRotationTrim;
  }

  function getComparePresentation() {
    if (state.dragTarget) {
      return {
        preset: "after",
        summary: "Editing floor area",
        note: "While dragging, the full floor stays visible so you can cover the whole room."
      };
    }

    if (!state.previewVisible) {
      return {
        preset: "before",
        summary: "Original room only",
        note: "Showing the untouched photo. Tap Split view or New floor to bring the preview back."
      };
    }

    if (state.compare <= 24) {
      return {
        preset: "after",
        summary: "New floor focus · " + state.compare + "%",
        note: "Mostly the new floor is showing."
      };
    }

    if (state.compare >= 76) {
      return {
        preset: "",
        summary: "Mostly original room · " + state.compare + "%",
        note: "Mostly the existing room is showing."
      };
    }

    return {
      preset: "split",
      summary: "Split view · " + state.compare + "%",
      note: "Balanced side-by-side comparison."
    };
  }

  function getStagePresentation() {
    if (state.imageLoadState === "loading") {
      return {
        state: "loading",
        badge: "Loading preview",
        text: "Preparing the room image and controls.",
        showCard: true,
        cardLabel: "Loading",
        cardTitle: "Preparing room preview",
        cardCopy: "This takes a moment while the room image is fitted for editing and comparison."
      };
    }

    if (state.imageLoadState === "error") {
      return {
        state: "error",
        badge: "Image issue",
        text: "Use a clear JPG, PNG, or WebP room photo and try again.",
        showCard: true,
        cardLabel: "Try again",
        cardTitle: "The room image could not be loaded",
        cardCopy: state.imageErrorMessage || "Use a clear room photo and try another upload."
      };
    }

    if (!state.image) {
      return {
        state: "empty",
        badge: "Choose a room",
        text: "Start with a sample room or upload your own photo.",
        showCard: true,
        cardLabel: "Get started",
        cardTitle: "Choose a room to begin",
        cardCopy: "Use a clear room photo or a sample room, then place the floor once and compare finishes."
      };
    }

    if (!state.previewVisible) {
      return {
        state: "paused",
        badge: "Original room",
        text: "The flooring preview is hidden. Turn it back on to compare.",
        showCard: false,
        cardLabel: "",
        cardTitle: "",
        cardCopy: ""
      };
    }

    return {
      state: "ready",
      badge: state.sourceType === "upload" ? "Photo ready" : "Sample ready",
      text: "Switch finishes while keeping the same floor placement.",
      showCard: false,
      cardLabel: "",
      cardTitle: "",
      cardCopy: ""
    };
  }

  function getDefaultUploadedQuad() {
    return cloneQuad(DEFAULT_UPLOADED_QUAD);
  }

  function getCornerAssistConfig(index) {
    if (index === 0) {
      return { rowIndex: 1, wallIndex: 3, rowLabel: "back wall", wallLabel: "left wall" };
    }
    if (index === 1) {
      return { rowIndex: 0, wallIndex: 2, rowLabel: "back wall", wallLabel: "right wall" };
    }
    if (index === 2) {
      return { rowIndex: 3, wallIndex: 1, rowLabel: "front edge", wallLabel: "right wall" };
    }
    return { rowIndex: 2, wallIndex: 0, rowLabel: "front edge", wallLabel: "left wall" };
  }

  function setGuideAssist(message, lines) {
    state.guideAssistMessage = message || "";
    state.guideAssistLines = cloneGuideLines(lines);
  }

  function getCornerSnapPreview(index, point, currentQuad) {
    const config = getCornerAssistConfig(index);
    const snappedPoint = {
      x: point.x,
      y: point.y
    };
    const lines = [];
    const labels = [];

    if (Math.abs(point.y - currentQuad[config.rowIndex].y) <= GUIDE_SNAP_THRESHOLD) {
      snappedPoint.y = currentQuad[config.rowIndex].y;
      lines.push({
        type: "horizontal",
        value: snappedPoint.y
      });
      labels.push(config.rowLabel);
    }

    if (Math.abs(point.x - currentQuad[config.wallIndex].x) <= GUIDE_SNAP_THRESHOLD) {
      snappedPoint.x = currentQuad[config.wallIndex].x;
      lines.push({
        type: "vertical",
        value: snappedPoint.x
      });
      labels.push(config.wallLabel);
    }

    return {
      point: snappedPoint,
      lines: lines,
      message: labels.length
        ? "Wall assist: " + labels.join(" + ") + "."
        : ""
    };
  }

  function isSameGuideTarget(first, second) {
    if (!first && !second) {
      return true;
    }
    if (!first || !second) {
      return false;
    }
    return first.type === second.type && first.index === second.index;
  }

  function getActiveResetQuad() {
    if (state.sourceType === "preset" && state.lastPresetScene && scenePresets[state.lastPresetScene]) {
      return cloneQuad(scenePresets[state.lastPresetScene].quad);
    }
    return getDefaultUploadedQuad();
  }

  function setFloorQuad(quad, rememberStable) {
    const stableQuad = Geometry.stabilizeQuad(quad, state.lastStableFloorQuadNormalized || getActiveResetQuad());
    state.floorQuadNormalized = stableQuad;
    if (rememberStable !== false && Geometry.isValidQuad(stableQuad)) {
      state.lastStableFloorQuadNormalized = cloneQuad(stableQuad);
    }
  }

  function buildSwatchBackground(colors) {
    return "repeating-linear-gradient(90deg,"
      + colors[0] + " 0 18%,"
      + colors[1] + " 18% 31%,"
      + colors[2] + " 31% 48%,"
      + colors[3] + " 48% 64%,"
      + colors[1] + " 64% 82%,"
      + colors[0] + " 82% 100%)";
  }

  function selectStyle(styleId, options) {
    const owningFamily = findFamilyByStyleId(styleId);
    if (!owningFamily) {
      return;
    }

    const nextStyle = getFamilyStyles(owningFamily.id).find(function (style) {
      return style.id === styleId;
    });
    const changed = state.selectedFamily !== owningFamily.id || state.selectedStyle !== styleId;

    state.selectedFamily = owningFamily.id;
    state.selectedStyle = styleId;
    state.previewVisible = true;
    state.previewHoldRestore = false;
    rememberRecentStyle(styleId);

    if (changed && (!options || options.status !== false)) {
      UI.setGlobalStatus(nextStyle.label + " is now showing. The floor placement stayed in place.");
    }

    scheduleRender({ ui: true, summary: true, canvas: true });
  }

  function cycleStyle(direction) {
    const family = getCurrentFamily();
    const styles = getFamilyStyles(family.id);
    const currentIndex = styles.findIndex(function (style) {
      return style.id === state.selectedStyle;
    });

    if (currentIndex === -1 || !styles.length) {
      return;
    }

    const nextIndex = (currentIndex + direction + styles.length) % styles.length;
    selectStyle(styles[nextIndex].id);
  }

  function applyComparePreset(preset) {
    state.previewHoldRestore = false;

    if (preset === "before") {
      state.previewVisible = false;
      UI.setGlobalStatus("Showing the original room photo.");
    } else if (preset === "after") {
      state.previewVisible = true;
      state.compare = 14;
      UI.setGlobalStatus("Showing mostly the new floor.");
    } else {
      state.previewVisible = true;
      state.compare = 58;
      UI.setGlobalStatus("Split view ready for comparison.");
    }

    scheduleRender({ summary: true, canvas: true });
  }

  function setTemporaryOriginal(active) {
    if (active) {
      if (!state.previewVisible || state.previewHoldRestore) {
        return;
      }
      state.previewHoldRestore = true;
      state.previewVisible = false;
      scheduleRender({ summary: true, canvas: true });
      return;
    }

    if (!state.previewHoldRestore) {
      return;
    }

    state.previewHoldRestore = false;
    state.previewVisible = true;
    scheduleRender({ summary: true, canvas: true });
  }

  const UI = {
    renderChoices() {
      dom.sceneGrid.innerHTML = Object.values(scenePresets).map(function (scene) {
        const active = state.sourceType === "preset" && scene.id === state.selectedScene ? "active" : "";
        return `
          <button class="scene-card ${active}" type="button" data-scene="${scene.id}">
            <span class="scene-thumb" style="background-image:url('${scene.image}')"></span>
            <strong>${scene.label}</strong>
            <span>${scene.description}</span>
          </button>
        `;
      }).join("");

      dom.familyTabs.innerHTML = Object.values(productFamilies).map(function (family) {
        const familyStyles = getFamilyStyles(family.id);
        const active = family.id === state.selectedFamily ? "active" : "";
        return `
          <button class="family-tab ${active}" type="button" data-family="${family.id}">
            <span class="family-tab-count">${familyStyles.length} finishes</span>
            <strong>${family.label}</strong>
            <small>${family.summary}</small>
          </button>
        `;
      }).join("");

      const family = getCurrentFamily();
      const familyStyles = getFamilyStyles(family.id);
      dom.productSwitchRail.innerHTML = familyStyles.map(function (style) {
        const active = style.id === state.selectedStyle ? "active" : "";
        return `
          <button class="product-switch-chip ${active}" type="button" data-style="${style.id}" aria-pressed="${active ? "true" : "false"}">
            <span class="product-switch-swatch" style="background:${getStyleSwatchBackground(style)}"></span>
            <span class="product-switch-copy">
              <strong>${style.label}</strong>
              <small>${style.note}</small>
            </span>
          </button>
        `;
      }).join("");

      const recentStyles = getRecentStyles().filter(function (entry) {
        return !(entry.familyId === state.selectedFamily && entry.style.id === state.selectedStyle);
      });
      dom.recentSwitchBlock.hidden = recentStyles.length === 0;
      dom.recentSwitchRail.innerHTML = recentStyles.map(function (entry) {
        return `
          <button class="product-switch-chip recent" type="button" data-style="${entry.style.id}" data-family="${entry.familyId}">
            <span class="product-switch-swatch" style="background:${getStyleSwatchBackground(entry.style)}"></span>
            <span class="product-switch-copy">
              <strong>${entry.style.label}</strong>
              <small>${entry.familyLabel}</small>
            </span>
          </button>
        `;
      }).join("");

      dom.styleGrid.innerHTML = familyStyles.map(function (style) {
        const active = style.id === state.selectedStyle ? "active" : "";
        return `
          <button class="style-card product-style-card ${active}" type="button" data-style="${style.id}" aria-pressed="${active ? "true" : "false"}">
            <div class="product-style-card-top">
              <div class="product-style-card-meta">
                <span class="style-family-pill">${family.label}</span>
                <span class="style-state-pill">${style.isCustom ? "Your sample" : (active ? "Showing now" : "Tap to try")}</span>
              </div>
              <div class="style-swatch product-style-swatch" style="background:${getStyleSwatchBackground(style)}"></div>
            </div>
            <strong>${style.label}</strong>
            <span>${style.note}</span>
            <small>${style.isCustom ? "Your uploaded sample stays on this page only." : "Floor guides stay in place while you change finishes."}</small>
          </button>
        `;
      }).join("");
    },

    updateSummary() {
      const family = getCurrentFamily();
      const style = getCurrentStyle();
      const comparePresentation = getComparePresentation();
      const stagePresentation = getStagePresentation();
      const activeScene = state.sourceType === "preset" && scenePresets[state.selectedScene]
        ? scenePresets[state.selectedScene].label
        : "Uploaded room";

      dom.activeSceneLabel.textContent = activeScene;
      dom.activeFamilyLabel.textContent = family.label;
      dom.activeStyleLabel.textContent = style.label;
      dom.selectedFamilyText.textContent = family.label;
      dom.selectedStyleText.textContent = style.label;
      dom.selectedStyleSwatch.style.background = getStyleSwatchBackground(style);
      dom.selectedStyleNote.textContent = style.note;
      dom.selectedSourceText.textContent = state.currentSourceLabel;
      dom.productSwitchMeta.textContent = getFamilyStyles(family.id).length + " finishes in " + family.label + ". The floor shape stays fixed while you switch.";
      dom.stageStatusBadge.textContent = stagePresentation.badge;
      dom.stageStatusBadge.dataset.state = stagePresentation.state;
      dom.stageStatusText.textContent = stagePresentation.text;
      dom.canvasWrap.dataset.state = stagePresentation.state;
      dom.canvasStateCard.hidden = !stagePresentation.showCard;
      dom.canvasStateLabel.textContent = stagePresentation.cardLabel;
      dom.canvasStateTitle.textContent = stagePresentation.cardTitle;
      dom.canvasStateCopy.textContent = stagePresentation.cardCopy;
      dom.sourceNote.textContent = state.sourceType === "upload"
        ? "Your room photo is ready. Adjust the floor shape, then compare finishes."
        : "Sample room ready. Compare finishes immediately or upload your own photo.";
      dom.compareValue.textContent = state.previewVisible ? state.compare + "%" : "Original";
      dom.compareModeNote.textContent = comparePresentation.note;
      dom.blendValue.textContent = state.blend + "%";
      dom.activeGuideValue.textContent = GUIDE_CORNER_LABELS[state.selectedCornerIndex];
      dom.directionValue.textContent = state.textureRotationBase === 90 ? "Across room" : "Along room";
      dom.directionTrimValue.textContent = (state.textureRotationTrim > 0 ? "+" : "") + state.textureRotationTrim + "°";
      dom.plankScaleValue.textContent = state.plankScale + "%";
      dom.plankScaleReadout.textContent = state.plankScale + "%";
      dom.compareSummary.textContent = comparePresentation.summary;
      dom.guideAssistCopy.textContent = "Selected: " + GUIDE_CORNER_LABELS[state.selectedCornerIndex] + ". Drag it to the room corner, or use the fine move buttons below.";
      dom.guideNote.textContent = state.sourceType === "upload"
        ? "Use corners for shape, edge dots for walls, and fine move only for the last small correction."
        : "Use corners, edge dots, and wall buttons to tidy the shape before comparing finishes.";
      dom.canvasOverlayLabel.textContent = state.previewVisible
        ? (state.dragTarget
          ? "Full floor preview is on while you drag."
          : "Adjust " + GUIDE_CORNER_LABELS[state.selectedCornerIndex] + ", or drag an edge to line up the wall.")
        : "Original room only. Turn the flooring preview back on to compare.";
      dom.togglePreview.textContent = state.previewVisible ? "Show original only" : "Show flooring preview";
      dom.compareSlider.value = String(state.compare);
      dom.compareSlider.disabled = !state.previewVisible;
      dom.blendSlider.value = String(state.blend);
      dom.directionTrimSlider.value = String(state.textureRotationTrim);
      dom.plankScaleSlider.value = String(state.plankScale);
      dom.holdOriginal.disabled = !state.previewVisible;
      dom.previousStyle.disabled = getFamilyStyles(family.id).length <= 1;
      dom.nextStyle.disabled = getFamilyStyles(family.id).length <= 1;
      if (dom.sampleUploadStatus && !state.customSample) {
        dom.sampleUploadStatus.textContent = "No custom sample uploaded yet.";
      }
      if (dom.clearSample) {
        dom.clearSample.disabled = !state.customSample;
      }

      dom.guideCornerButtons.forEach(function (button) {
        button.classList.toggle("active", Number(button.dataset.guideCorner) === state.selectedCornerIndex);
      });

      dom.directionModeButtons.forEach(function (button) {
        button.classList.toggle("active", Number(button.dataset.directionBase) === state.textureRotationBase);
      });

      dom.comparePresetButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.comparePreset === comparePresentation.preset);
      });
    },

    setGlobalStatus(message) {
      dom.globalStatus.textContent = message;
    },

    setHandoffStatus(message) {
      dom.handoffStatus.textContent = message;
    }
  };

  function createRoundedRectPath(x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function pointInPolygon(x, y, points) {
    let inside = false;
    for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
      const xi = points[index].x;
      const yi = points[index].y;
      const xj = points[previous].x;
      const yj = points[previous].y;
      const intersects = ((yi > y) !== (yj > y))
        && (x < (((xj - xi) * (y - yi)) / ((yj - yi) || 1e-8)) + xi);
      if (intersects) {
        inside = !inside;
      }
    }
    return inside;
  }

  function solveLinearSystem(matrix, vector) {
    const size = vector.length;
    const augmented = matrix.map(function (row, index) {
      return row.slice().concat(vector[index]);
    });

    for (let pivot = 0; pivot < size; pivot += 1) {
      let maxRow = pivot;
      for (let row = pivot + 1; row < size; row += 1) {
        if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[maxRow][pivot])) {
          maxRow = row;
        }
      }

      if (Math.abs(augmented[maxRow][pivot]) < 1e-10) {
        return null;
      }

      if (maxRow !== pivot) {
        const temp = augmented[pivot];
        augmented[pivot] = augmented[maxRow];
        augmented[maxRow] = temp;
      }

      const divisor = augmented[pivot][pivot];
      for (let column = pivot; column <= size; column += 1) {
        augmented[pivot][column] /= divisor;
      }

      for (let row = 0; row < size; row += 1) {
        if (row === pivot) {
          continue;
        }
        const factor = augmented[row][pivot];
        for (let column = pivot; column <= size; column += 1) {
          augmented[row][column] -= factor * augmented[pivot][column];
        }
      }
    }

    return augmented.map(function (row) {
      return row[size];
    });
  }

  function buildHomography(sourcePoints, destinationPoints) {
    const matrix = [];
    const vector = [];

    for (let index = 0; index < 4; index += 1) {
      const source = sourcePoints[index];
      const destination = destinationPoints[index];

      matrix.push([
        source.x, source.y, 1,
        0, 0, 0,
        -source.x * destination.x,
        -source.y * destination.x
      ]);
      vector.push(destination.x);

      matrix.push([
        0, 0, 0,
        source.x, source.y, 1,
        -source.x * destination.y,
        -source.y * destination.y
      ]);
      vector.push(destination.y);
    }

    const solved = solveLinearSystem(matrix, vector);
    if (!solved) {
      return null;
    }

    return [
      solved[0], solved[1], solved[2],
      solved[3], solved[4], solved[5],
      solved[6], solved[7], 1
    ];
  }

  function projectPoint(homography, x, y) {
    const denominator = (homography[6] * x) + (homography[7] * y) + homography[8];
    if (Math.abs(denominator) < 1e-8) {
      return null;
    }
    return {
      x: ((homography[0] * x) + (homography[1] * y) + homography[2]) / denominator,
      y: ((homography[3] * x) + (homography[4] * y) + homography[5]) / denominator
    };
  }

  function sampleTexturePixel(texture, x, y) {
    const clampedX = clamp(x, 0, texture.width - 1);
    const clampedY = clamp(y, 0, texture.height - 1);
    const x0 = Math.floor(clampedX);
    const y0 = Math.floor(clampedY);
    const x1 = Math.min(x0 + 1, texture.width - 1);
    const y1 = Math.min(y0 + 1, texture.height - 1);
    const tx = clampedX - x0;
    const ty = clampedY - y0;

    const topLeft = ((y0 * texture.width) + x0) * 4;
    const topRight = ((y0 * texture.width) + x1) * 4;
    const bottomLeft = ((y1 * texture.width) + x0) * 4;
    const bottomRight = ((y1 * texture.width) + x1) * 4;

    function mix(channel) {
      const top = (texture.pixels[topLeft + channel] * (1 - tx)) + (texture.pixels[topRight + channel] * tx);
      const bottom = (texture.pixels[bottomLeft + channel] * (1 - tx)) + (texture.pixels[bottomRight + channel] * tx);
      return (top * (1 - ty)) + (bottom * ty);
    }

    return {
      r: mix(0),
      g: mix(1),
      b: mix(2)
    };
  }

  function wrapCoordinate(value, size) {
    const wrapped = value % size;
    return wrapped < 0 ? wrapped + size : wrapped;
  }

  function distancePointToSegment(pointX, pointY, start, end) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const lengthSquared = (deltaX * deltaX) + (deltaY * deltaY);

    if (!lengthSquared) {
      return Math.hypot(pointX - start.x, pointY - start.y);
    }

    const projection = clamp((((pointX - start.x) * deltaX) + ((pointY - start.y) * deltaY)) / lengthSquared, 0, 1);
    const nearestX = start.x + (deltaX * projection);
    const nearestY = start.y + (deltaY * projection);
    return Math.hypot(pointX - nearestX, pointY - nearestY);
  }

  function distanceToPolygonEdges(pointX, pointY, points) {
    let nearestDistance = Infinity;
    for (let index = 0; index < points.length; index += 1) {
      const start = points[index];
      const end = points[(index + 1) % points.length];
      nearestDistance = Math.min(nearestDistance, distancePointToSegment(pointX, pointY, start, end));
    }
    return nearestDistance;
  }

  function getEdgeMidpoints(points) {
    return EDGE_POINT_INDEXES.map(function (pair) {
      return {
        x: (points[pair[0]].x + points[pair[1]].x) / 2,
        y: (points[pair[0]].y + points[pair[1]].y) / 2
      };
    });
  }

  function getExtendedSegment(start, end, extensionDistance) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const length = Math.hypot(deltaX, deltaY) || 1;
    const unitX = deltaX / length;
    const unitY = deltaY / length;

    return {
      start: {
        x: start.x - (unitX * extensionDistance),
        y: start.y - (unitY * extensionDistance)
      },
      end: {
        x: end.x + (unitX * extensionDistance),
        y: end.y + (unitY * extensionDistance)
      }
    };
  }

  function getGuideAnnotation(points, edgeMidpoints) {
    const activeTarget = state.dragTarget || state.hoverTarget;

    if (state.guideAssistMessage) {
      const point = points[state.selectedCornerIndex];
      return {
        text: state.guideAssistMessage,
        x: point.x,
        y: point.y - 22
      };
    }

    if (activeTarget && activeTarget.type === "corner") {
      const point = points[activeTarget.index];
      return {
        text: GUIDE_CORNER_LABELS[activeTarget.index],
        x: point.x,
        y: point.y - 18
      };
    }

    if (activeTarget && activeTarget.type === "edge") {
      const point = edgeMidpoints[activeTarget.index];
      return {
        text: "Drag " + GUIDE_EDGE_LABELS[activeTarget.index].toLowerCase(),
        x: point.x,
        y: point.y - 20
      };
    }

    if (activeTarget && activeTarget.type === "move") {
      return {
        text: "Move the whole floor shape",
        x: (points[0].x + points[2].x) / 2,
        y: (points[0].y + points[2].y) / 2
      };
    }

    const point = points[state.selectedCornerIndex];
    return {
      text: "Selected: " + GUIDE_CORNER_LABELS[state.selectedCornerIndex],
      x: point.x,
      y: point.y - 18
    };
  }

  const Renderer = {
    ensureAnalysisBuffer(width, height) {
      if (renderBuffers.analysisCanvas.width !== width || renderBuffers.analysisCanvas.height !== height) {
        renderBuffers.analysisCanvas.width = width;
        renderBuffers.analysisCanvas.height = height;
      }
    },

    ensureReplacementBuffer(width, height) {
      if (renderBuffers.replacementCanvas.width !== width || renderBuffers.replacementCanvas.height !== height) {
        renderBuffers.replacementCanvas.width = width;
        renderBuffers.replacementCanvas.height = height;
        renderBuffers.replacementImage = renderBuffers.replacementContext.createImageData(width, height);
      }
      if (!renderBuffers.replacementImage) {
        renderBuffers.replacementImage = renderBuffers.replacementContext.createImageData(width, height);
      }
    },

    getImageFitRect() {
      if (!state.image) {
        return null;
      }
      const maxWidth = dom.canvas.width - (CANVAS_PADDING * 2);
      const maxHeight = dom.canvas.height - (CANVAS_PADDING * 2);
      const scale = Math.min(maxWidth / state.image.width, maxHeight / state.image.height);
      const width = state.image.width * scale;
      const height = state.image.height * scale;
      return {
        x: (dom.canvas.width - width) / 2,
        y: (dom.canvas.height - height) / 2,
        width: width,
        height: height
      };
    },

    getAbsoluteFloorQuad() {
      if (!state.imageRect) {
        return [];
      }
      return state.floorQuadNormalized.map(function (point) {
        return {
          x: state.imageRect.x + (point.x * state.imageRect.width),
          y: state.imageRect.y + (point.y * state.imageRect.height)
        };
      });
    },

    getImageAnalysis() {
      if (!state.image || !state.imageRect) {
        return null;
      }

      const width = Math.max(1, Math.round(state.imageRect.width));
      const height = Math.max(1, Math.round(state.imageRect.height));
      const cacheKey = [state.image.src, width, height].join("|");

      if (state.imageAnalysis && state.imageAnalysis.key === cacheKey) {
        return state.imageAnalysis;
      }

      this.ensureAnalysisBuffer(width, height);
      renderBuffers.analysisContext.clearRect(0, 0, width, height);
      renderBuffers.analysisContext.drawImage(state.image, 0, 0, width, height);

      const imageData = renderBuffers.analysisContext.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const luminance = new Float32Array(width * height);
      const integralWidth = width + 1;
      const integral = new Float32Array((width + 1) * (height + 1));

      for (let y = 1; y <= height; y += 1) {
        for (let x = 1; x <= width; x += 1) {
          const pixelIndex = (((y - 1) * width) + (x - 1)) * 4;
          const lum = ((0.299 * pixels[pixelIndex]) + (0.587 * pixels[pixelIndex + 1]) + (0.114 * pixels[pixelIndex + 2])) / 255;
          const flatIndex = ((y - 1) * width) + (x - 1);
          luminance[flatIndex] = lum;

          const integralIndex = (y * integralWidth) + x;
          integral[integralIndex] = lum
            + integral[integralIndex - 1]
            + integral[integralIndex - integralWidth]
            - integral[integralIndex - integralWidth - 1];
        }
      }

      state.imageAnalysis = {
        key: cacheKey,
        width: width,
        height: height,
        pixels: pixels,
        luminance: luminance,
        integral: integral
      };

      return state.imageAnalysis;
    },

    sampleAverageLuminance(analysis, centerX, centerY, radius) {
      const integralWidth = analysis.width + 1;
      const x0 = Math.max(0, Math.floor(centerX - radius));
      const y0 = Math.max(0, Math.floor(centerY - radius));
      const x1 = Math.min(analysis.width, Math.ceil(centerX + radius + 1));
      const y1 = Math.min(analysis.height, Math.ceil(centerY + radius + 1));

      const sum = analysis.integral[(y1 * integralWidth) + x1]
        - analysis.integral[(y0 * integralWidth) + x1]
        - analysis.integral[(y1 * integralWidth) + x0]
        + analysis.integral[(y0 * integralWidth) + x0];
      const area = Math.max((x1 - x0) * (y1 - y0), 1);
      return sum / area;
    },

    estimateFloorReferenceLuminance(analysis, points) {
      const minX = Math.max(0, Math.floor(Math.min.apply(null, points.map(function (point) { return point.x; })) - state.imageRect.x));
      const maxX = Math.min(analysis.width - 1, Math.ceil(Math.max.apply(null, points.map(function (point) { return point.x; })) - state.imageRect.x));
      const minY = Math.max(0, Math.floor(Math.min.apply(null, points.map(function (point) { return point.y; })) - state.imageRect.y));
      const maxY = Math.min(analysis.height - 1, Math.ceil(Math.max.apply(null, points.map(function (point) { return point.y; })) - state.imageRect.y));
      const sampleColumns = 18;
      const sampleRows = 12;
      let total = 0;
      let count = 0;

      for (let row = 0; row < sampleRows; row += 1) {
        const y = minY + (((row + 0.5) / sampleRows) * (maxY - minY));
        for (let column = 0; column < sampleColumns; column += 1) {
          const x = minX + (((column + 0.5) / sampleColumns) * (maxX - minX));
          const canvasX = state.imageRect.x + x;
          const canvasY = state.imageRect.y + y;
          if (!pointInPolygon(canvasX, canvasY, points)) {
            continue;
          }
          total += this.sampleAverageLuminance(analysis, x, y, Math.max(8, Math.round(analysis.width * 0.02)));
          count += 1;
        }
      }

      return count ? (total / count) : 0.58;
    },

    getIntersectionsForScanline(points, y) {
      const intersections = [];
      for (let index = 0; index < points.length; index += 1) {
        const start = points[index];
        const end = points[(index + 1) % points.length];
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        if (y < minY || y >= maxY || start.y === end.y) {
          continue;
        }
        const ratio = (y - start.y) / (end.y - start.y);
        intersections.push(start.x + ((end.x - start.x) * ratio));
      }
      return intersections.sort(function (a, b) {
        return a - b;
      });
    },

    buildTexture(style) {
      if (textureCache.has(style.id)) {
        return textureCache.get(style.id);
      }

      const texture = document.createElement("canvas");
      texture.width = 2048;
      texture.height = 1152;
      const textureContext = texture.getContext("2d");
      const seedFactory = hashString(style.id);
      const random = mulberry32(seedFactory());
      const palette = style.colors.map(hexToRgb);
      const darkBase = mixRgb(palette[0], { r: 50, g: 40, b: 30 }, 0.18);
      const lightBase = mixRgb(palette[Math.min(1, palette.length - 1)], { r: 255, g: 248, b: 240 }, 0.16);
      const baseWash = textureContext.createLinearGradient(0, 0, 0, texture.height);
      baseWash.addColorStop(0, rgbToCss(lightBase));
      baseWash.addColorStop(1, rgbToCss(darkBase));
      textureContext.fillStyle = baseWash;
      textureContext.fillRect(0, 0, texture.width, texture.height);

      let x = 0;
      let plankIndex = 0;
      while (x < texture.width) {
        const plankWidth = 118 + Math.round(random() * 54);
        const baseColor = shiftRgb(palette[Math.floor(random() * palette.length)], Math.round((random() - 0.5) * 18));
        const outerTone = shiftRgb(baseColor, -16 - Math.round(random() * 6));
        const centerTone = shiftRgb(baseColor, 4 + Math.round(random() * 12));
        const plankGradient = textureContext.createLinearGradient(x, 0, x + plankWidth, 0);
        plankGradient.addColorStop(0, rgbToCss(outerTone));
        plankGradient.addColorStop(0.18, rgbToCss(centerTone));
        plankGradient.addColorStop(0.54, rgbToCss(baseColor));
        plankGradient.addColorStop(0.84, rgbToCss(shiftRgb(baseColor, 8)));
        plankGradient.addColorStop(1, rgbToCss(shiftRgb(baseColor, -12)));
        textureContext.fillStyle = plankGradient;
        textureContext.fillRect(x, 0, plankWidth, texture.height);

        const verticalWash = textureContext.createLinearGradient(0, 0, 0, texture.height);
        verticalWash.addColorStop(0, "rgba(255,255,255,0.08)");
        verticalWash.addColorStop(0.24, "rgba(255,255,255,0.02)");
        verticalWash.addColorStop(0.72, "rgba(0,0,0,0.02)");
        verticalWash.addColorStop(1, "rgba(0,0,0,0.09)");
        textureContext.fillStyle = verticalWash;
        textureContext.fillRect(x, 0, plankWidth, texture.height);

        textureContext.fillStyle = "rgba(255,255,255,0.09)";
        textureContext.fillRect(x + 1, 0, 1, texture.height);
        textureContext.fillStyle = "rgba(0,0,0,0.16)";
        textureContext.fillRect(x + plankWidth - 2, 0, 2, texture.height);

        let jointY = (-110 + (random() * 180)) + ((plankIndex % 3) * 64);
        while (jointY < texture.height) {
          const jointHeight = 2 + Math.floor(random() * 2);
          textureContext.fillStyle = "rgba(0,0,0,0.12)";
          textureContext.fillRect(x + 2, jointY, Math.max(plankWidth - 4, 1), jointHeight);
          textureContext.fillStyle = "rgba(255,255,255,0.05)";
          textureContext.fillRect(x + 2, jointY + jointHeight, Math.max(plankWidth - 4, 1), 1);
          jointY += 340 + Math.round(random() * 280);
        }

        const grainLines = 10 + Math.floor(random() * 9);
        for (let line = 0; line < grainLines; line += 1) {
          const grainX = x + (random() * plankWidth);
          const drift = (random() - 0.5) * 18;
          const segmentCount = 5;
          textureContext.strokeStyle = random() > 0.42 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.065)";
          textureContext.lineWidth = 0.6 + (random() * 1.3);
          textureContext.beginPath();
          textureContext.moveTo(grainX, 0);
          for (let segment = 1; segment <= segmentCount; segment += 1) {
            const ratio = segment / segmentCount;
            const sway = Math.sin((ratio * Math.PI * (1.2 + random())) + (random() * Math.PI)) * drift;
            textureContext.lineTo(grainX + sway, texture.height * ratio);
          }
          textureContext.stroke();
        }

        const streakCount = 4 + Math.floor(random() * 4);
        for (let streak = 0; streak < streakCount; streak += 1) {
          const streakX = x + (random() * plankWidth);
          const streakWidth = 1 + Math.floor(random() * 2);
          textureContext.fillStyle = random() > 0.5 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)";
          textureContext.fillRect(streakX, 0, streakWidth, texture.height);
        }

        x += plankWidth;
        plankIndex += 1;
      }

      for (let row = 0; row < texture.height; row += 3) {
        const rowAlpha = 0.012 + (random() * 0.018);
        textureContext.fillStyle = random() > 0.5
          ? "rgba(255,255,255," + rowAlpha.toFixed(3) + ")"
          : "rgba(0,0,0," + (rowAlpha * 0.8).toFixed(3) + ")";
        textureContext.fillRect(0, row, texture.width, 1);
      }

      if (style.sampleTileCanvas) {
        const samplePattern = textureContext.createPattern(style.sampleTileCanvas, "repeat");
        if (samplePattern) {
          textureContext.save();
          textureContext.globalAlpha = 0.34;
          textureContext.fillStyle = samplePattern;
          textureContext.fillRect(0, 0, texture.width, texture.height);
          textureContext.restore();
        }

        const toneWash = textureContext.createLinearGradient(0, 0, texture.width, 0);
        toneWash.addColorStop(0, "rgba(255,255,255,0.08)");
        toneWash.addColorStop(0.5, "rgba(255,255,255,0)");
        toneWash.addColorStop(1, "rgba(0,0,0,0.07)");
        textureContext.fillStyle = toneWash;
        textureContext.fillRect(0, 0, texture.width, texture.height);
      }

      const gloss = textureContext.createLinearGradient(0, 0, 0, texture.height);
      gloss.addColorStop(0, "rgba(255,255,255,0.16)");
      gloss.addColorStop(0.18, "rgba(255,255,255,0.03)");
      gloss.addColorStop(0.72, "rgba(0,0,0,0.04)");
      gloss.addColorStop(1, "rgba(0,0,0,0.12)");
      textureContext.fillStyle = gloss;
      textureContext.fillRect(0, 0, texture.width, texture.height);

      const textureInfo = {
        width: texture.width,
        height: texture.height,
        pixels: textureContext.getImageData(0, 0, texture.width, texture.height).data
      };

      textureCache.set(style.id, textureInfo);
      return textureInfo;
    },

    mapTextureCoordinates(texture, point) {
      const rotation = (getTextureRotationDegrees() * Math.PI) / 180;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const centerX = texture.width / 2;
      const centerY = texture.height / 2;
      const scale = Math.max(0.25, state.plankScale / 100);
      const localX = (point.x - centerX) / scale;
      const localY = (point.y - centerY) / scale;
      const rotatedX = (localX * cos) - (localY * sin);
      const rotatedY = (localX * sin) + (localY * cos);

      return {
        x: wrapCoordinate(rotatedX + centerX, texture.width),
        y: wrapCoordinate(rotatedY + centerY, texture.height)
      };
    },

    drawPlaceholderScene() {
      const background = context.createLinearGradient(0, 0, 0, dom.canvas.height);
      background.addColorStop(0, "#f4faf9");
      background.addColorStop(1, "#dfeceb");
      context.fillStyle = background;
      context.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

      createRoundedRectPath(dom.canvas.width * 0.12, dom.canvas.height * 0.14, dom.canvas.width * 0.76, dom.canvas.height * 0.72, 34);
      context.fillStyle = "rgba(255,255,255,0.84)";
      context.fill();

      createRoundedRectPath(dom.canvas.width * 0.18, dom.canvas.height * 0.24, 180, 40, 20);
      context.fillStyle = "rgba(24,183,155,0.1)";
      context.fill();
      context.font = "700 14px Manrope, sans-serif";
      context.fillStyle = "#0e8276";
      context.fillText("OPERON VISUALISER", dom.canvas.width * 0.205, dom.canvas.height * 0.268);

      context.fillStyle = "rgba(15,23,40,0.9)";
      context.font = "700 38px Manrope, sans-serif";
      context.fillText("Choose a room to start your preview", dom.canvas.width * 0.18, dom.canvas.height * 0.39);
      context.font = "600 21px Manrope, sans-serif";
      context.fillStyle = "rgba(98,113,129,0.86)";
      context.fillText("Use a sample room or upload a clear photo,", dom.canvas.width * 0.18, dom.canvas.height * 0.46);
      context.fillText("then place the floor once and compare finishes.", dom.canvas.width * 0.18, dom.canvas.height * 0.505);
    },

    drawSceneImage() {
      context.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

      const stageGradient = context.createLinearGradient(0, 0, 0, dom.canvas.height);
      stageGradient.addColorStop(0, "#efe1cf");
      stageGradient.addColorStop(1, "#d8c4ad");
      context.fillStyle = stageGradient;
      context.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

      if (!state.image) {
        state.imageRect = null;
        this.drawPlaceholderScene();
        return;
      }

      const imageRect = this.getImageFitRect();
      state.imageRect = imageRect;

      context.save();
      context.shadowColor = "rgba(31,25,21,0.18)";
      context.shadowBlur = 28;
      context.shadowOffsetY = 12;
      createRoundedRectPath(imageRect.x, imageRect.y, imageRect.width, imageRect.height, 28);
      context.fillStyle = "rgba(255,255,255,0.9)";
      context.fill();
      context.restore();

      context.save();
      createRoundedRectPath(imageRect.x, imageRect.y, imageRect.width, imageRect.height, 28);
      context.clip();
      context.drawImage(state.image, imageRect.x, imageRect.y, imageRect.width, imageRect.height);

      const gloss = context.createLinearGradient(0, imageRect.y, 0, imageRect.y + imageRect.height);
      gloss.addColorStop(0, "rgba(255,255,255,0.1)");
      gloss.addColorStop(0.58, "rgba(255,255,255,0)");
      gloss.addColorStop(1, "rgba(0,0,0,0.08)");
      context.fillStyle = gloss;
      context.fillRect(imageRect.x, imageRect.y, imageRect.width, imageRect.height);
      context.restore();
    },

    drawFloorPreview() {
      if (!state.image || !state.previewVisible || !state.imageRect) {
        return;
      }

      const style = getCurrentStyle();
      const texture = this.buildTexture(style);
      const analysis = this.getImageAnalysis();
      const points = this.getAbsoluteFloorQuad();

      if (points.length !== 4 || !analysis) {
        return;
      }

      const topY = Math.round(Math.min(points[0].y, points[1].y));
      const bottomY = Math.round(Math.max(points[2].y, points[3].y));
      const visibleTopY = Math.max(topY, Math.round(state.imageRect.y));
      const visibleBottomY = Math.min(bottomY, Math.round(state.imageRect.y + state.imageRect.height));
      const revealX = state.dragTarget
        ? state.imageRect.x
        : state.imageRect.x + (state.imageRect.width * (state.compare / 100));
      const lightingInfluence = state.blend / 100;
      const macroRadius = Math.max(10, Math.round(analysis.width * 0.028));
      const referenceLum = this.estimateFloorReferenceLuminance(analysis, points);
      const inverseProjection = buildHomography(
        points,
        [
          { x: 0, y: 0 },
          { x: texture.width - 1, y: 0 },
          { x: texture.width - 1, y: texture.height - 1 },
          { x: 0, y: texture.height - 1 }
        ]
      );

      if (!inverseProjection) {
        return;
      }

      if (visibleTopY >= visibleBottomY) {
        return;
      }

      this.ensureReplacementBuffer(dom.canvas.width, dom.canvas.height);
      const replacementContext = renderBuffers.replacementContext;
      const replacementImage = renderBuffers.replacementImage;
      const replacementPixels = replacementImage.data;
      replacementPixels.fill(0);

      for (let y = Math.max(0, visibleTopY); y <= Math.min(dom.canvas.height - 1, visibleBottomY); y += 1) {
        const intersections = this.getIntersectionsForScanline(points, y);
        if (intersections.length < 2) {
          continue;
        }

        const leftX = intersections[0];
        const rightX = intersections[intersections.length - 1];
        const visibleLeft = Math.max(leftX, revealX, state.imageRect.x);
        const visibleRight = Math.min(rightX, state.imageRect.x + state.imageRect.width);
        if (visibleLeft >= visibleRight) {
          continue;
        }

        const t = clamp((y - topY) / Math.max(bottomY - topY, 1), 0, 1);
        const easedT = Math.pow(t, 1.25);
        const startX = Math.max(0, Math.ceil(visibleLeft));
        const endX = Math.min(dom.canvas.width - 1, Math.floor(visibleRight));

        for (let x = startX; x <= endX; x += 1) {
          const projected = projectPoint(inverseProjection, x, y);
          if (!projected) {
            continue;
          }

          const mappedTexturePoint = this.mapTextureCoordinates(texture, projected);
          const textureSample = sampleTexturePixel(texture, mappedTexturePoint.x, mappedTexturePoint.y);
          const localX = clamp(Math.round(x - state.imageRect.x), 0, analysis.width - 1);
          const localY = clamp(Math.round(y - state.imageRect.y), 0, analysis.height - 1);
          const sourceIndex = ((localY * analysis.width) + localX) * 4;
          const sourceR = analysis.pixels[sourceIndex];
          const sourceG = analysis.pixels[sourceIndex + 1];
          const sourceB = analysis.pixels[sourceIndex + 2];
          const sourceLum = analysis.luminance[(localY * analysis.width) + localX];
          const macroLum = this.sampleAverageLuminance(analysis, localX, localY, macroRadius);
          const luminanceDelta = macroLum - referenceLum;
          const lighting = clamp(0.9 + (luminanceDelta * (1.65 * lightingInfluence)) + (easedT * 0.08), 0.6, 1.14);
          const highlight = Math.max(0, macroLum - referenceLum - 0.04) * (28 + (lightingInfluence * 18));
          const shadow = Math.max(0, referenceLum - macroLum - 0.03) * (18 + (lightingInfluence * 10));
          const horizontalRatio = clamp((x - leftX) / Math.max(rightX - leftX, 1), 0, 1);
          const sheen = (1 - Math.abs((horizontalRatio * 2) - 1)) * Math.max(0, 0.11 - (easedT * 0.07)) * 18;
          const quickEdgeDistance = Math.min(x - leftX, rightX - x, y - topY, bottomY - y);
          const polygonEdgeDistance = quickEdgeDistance > 7
            ? quickEdgeDistance
            : distanceToPolygonEdges(x + 0.5, y + 0.5, points);
          const edgeAlpha = clamp((polygonEdgeDistance - 0.25) / 4.2, 0, 1);
          const microDetail = clamp(0.9 + ((sourceLum - macroLum) * 2.1), 0.74, 1.22);
          const depthBlend = clamp(0.84 + (easedT * 0.12), 0.84, 0.98);
          const textureStrength = 1.06 + (lightingInfluence * 0.12);
          const materialR = clamp((textureSample.r * lighting * textureStrength * microDetail * depthBlend) + highlight + sheen - shadow, 0, 255);
          const materialG = clamp((textureSample.g * lighting * textureStrength * microDetail * depthBlend) + highlight + sheen - shadow, 0, 255);
          const materialB = clamp((textureSample.b * lighting * textureStrength * microDetail * depthBlend) + highlight + sheen - shadow, 0, 255);
          const sourceBlend = clamp(0.05 + (lightingInfluence * 0.06) + ((1 - edgeAlpha) * 0.08), 0.05, 0.18);
          const textureLum = luminanceFromRgb(materialR, materialG, materialB);
          const ambientLift = clamp((sourceLum - textureLum) * 18, -5, 6);
          const overlayOpacity = clamp(0.94 + (lightingInfluence * 0.05) + ((macroLum - 0.5) * 0.03), 0.9, 1);
          const outIndex = ((y * dom.canvas.width) + x) * 4;

          replacementPixels[outIndex] = clamp(lerp(materialR, sourceR, sourceBlend) + ambientLift, 0, 255);
          replacementPixels[outIndex + 1] = clamp(lerp(materialG, sourceG, sourceBlend) + (ambientLift * 0.84), 0, 255);
          replacementPixels[outIndex + 2] = clamp(lerp(materialB, sourceB, sourceBlend) + (ambientLift * 0.68), 0, 255);
          replacementPixels[outIndex + 3] = Math.round(255 * edgeAlpha * overlayOpacity);
        }
      }

      replacementContext.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
      replacementContext.putImageData(replacementImage, 0, 0);
      replacementContext.save();
      replacementContext.beginPath();
      replacementContext.moveTo(points[0].x, points[0].y);
      replacementContext.lineTo(points[1].x, points[1].y);
      replacementContext.lineTo(points[2].x, points[2].y);
      replacementContext.lineTo(points[3].x, points[3].y);
      replacementContext.closePath();
      replacementContext.clip();

      const sheenGradient = replacementContext.createLinearGradient(0, visibleTopY, 0, visibleBottomY);
      sheenGradient.addColorStop(0, "rgba(255,255,255,0.12)");
      sheenGradient.addColorStop(0.2, "rgba(255,255,255,0.035)");
      sheenGradient.addColorStop(0.62, "rgba(255,255,255,0)");
      sheenGradient.addColorStop(1, "rgba(0,0,0,0.05)");
      replacementContext.globalCompositeOperation = "screen";
      replacementContext.fillStyle = sheenGradient;
      replacementContext.fillRect(state.imageRect.x, visibleTopY, state.imageRect.width, visibleBottomY - visibleTopY);

      const edgeShade = replacementContext.createLinearGradient(0, visibleTopY, 0, visibleBottomY);
      edgeShade.addColorStop(0, "rgba(0,0,0,0.12)");
      edgeShade.addColorStop(0.08, "rgba(0,0,0,0.04)");
      edgeShade.addColorStop(0.26, "rgba(0,0,0,0)");
      edgeShade.addColorStop(1, "rgba(0,0,0,0)");
      replacementContext.globalCompositeOperation = "multiply";
      replacementContext.fillStyle = edgeShade;
      replacementContext.fillRect(state.imageRect.x, visibleTopY, state.imageRect.width, visibleBottomY - visibleTopY);
      replacementContext.restore();

      context.drawImage(renderBuffers.replacementCanvas, 0, 0);
    },

    drawCompareDivider() {
      if (!state.imageRect || state.dragTarget) {
        return;
      }
      const revealX = state.imageRect.x + (state.imageRect.width * (state.compare / 100));
      context.save();
      context.strokeStyle = "rgba(255,255,255,0.92)";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(revealX, state.imageRect.y + 10);
      context.lineTo(revealX, state.imageRect.y + state.imageRect.height - 10);
      context.stroke();

      context.fillStyle = "rgba(255,255,255,0.96)";
      context.beginPath();
      context.arc(revealX, state.imageRect.y + (state.imageRect.height * 0.24), 16, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(31,25,21,0.72)";
      context.font = "600 14px Georgia";
      context.fillText("Before", state.imageRect.x + 18, state.imageRect.y + 28);
      context.textAlign = "right";
      context.fillText("After", state.imageRect.x + state.imageRect.width - 18, state.imageRect.y + 28);
      context.textAlign = "start";
      context.restore();
    },

    drawFloorGuides() {
      if (!state.imageRect) {
        return;
      }

      const points = this.getAbsoluteFloorQuad();
      if (points.length !== 4) {
        return;
      }
      const edgeMidpoints = getEdgeMidpoints(points);
      const activeTarget = state.dragTarget || state.hoverTarget;
      const hoveredCornerIndex = state.hoverTarget && state.hoverTarget.type === "corner" ? state.hoverTarget.index : -1;
      const hoveredEdgeIndex = state.hoverTarget && state.hoverTarget.type === "edge" ? state.hoverTarget.index : -1;
      const draggedCornerIndex = state.dragTarget && state.dragTarget.type === "corner" ? state.dragTarget.index : -1;
      const draggedEdgeIndex = state.dragTarget && state.dragTarget.type === "edge" ? state.dragTarget.index : -1;
      const focusCornerIndex = draggedCornerIndex >= 0 ? draggedCornerIndex : state.selectedCornerIndex;
      const focusPoint = points[focusCornerIndex];
      const highlightedEdges = new Set(CORNER_EDGE_INDEXES[state.selectedCornerIndex]);
      const annotation = getGuideAnnotation(points, edgeMidpoints);
      const edgeExtension = Math.max(state.imageRect.width, state.imageRect.height) * 0.45;

      if (activeTarget && activeTarget.type === "corner") {
        CORNER_EDGE_INDEXES[activeTarget.index].forEach(function (edgeIndex) {
          highlightedEdges.add(edgeIndex);
        });
      }
      if (activeTarget && activeTarget.type === "edge") {
        highlightedEdges.add(activeTarget.index);
      }

      context.save();
      context.fillStyle = "rgba(24, 183, 155, 0.08)";
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(function (point) {
        context.lineTo(point.x, point.y);
      });
      context.closePath();
      context.fill();

      EDGE_POINT_INDEXES.forEach(function (pair, edgeIndex) {
        const edge = getExtendedSegment(points[pair[0]], points[pair[1]], edgeExtension);
        const active = highlightedEdges.has(edgeIndex);
        context.setLineDash(active ? [14, 10] : [7, 11]);
        context.lineWidth = active ? 2.5 : 1.5;
        context.strokeStyle = active ? "rgba(24,183,155,0.45)" : "rgba(255,255,255,0.34)";
        context.beginPath();
        context.moveTo(edge.start.x, edge.start.y);
        context.lineTo(edge.end.x, edge.end.y);
        context.stroke();
      });

      context.setLineDash([10, 8]);
      context.lineWidth = 3;
      context.strokeStyle = "rgba(255,255,255,0.9)";
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(function (point) {
        context.lineTo(point.x, point.y);
      });
      context.closePath();
      context.stroke();
      context.setLineDash([]);

      if (focusPoint) {
        context.setLineDash([6, 8]);
        context.lineWidth = 1.2;
        context.strokeStyle = "rgba(24,183,155,0.28)";
        context.beginPath();
        context.moveTo(state.imageRect.x, focusPoint.y);
        context.lineTo(state.imageRect.x + state.imageRect.width, focusPoint.y);
        context.moveTo(focusPoint.x, state.imageRect.y);
        context.lineTo(focusPoint.x, state.imageRect.y + state.imageRect.height);
        context.stroke();
        context.setLineDash([]);
      }

      state.guideAssistLines.forEach(function (line) {
        context.setLineDash([5, 7]);
        context.lineWidth = 2;
        context.strokeStyle = "rgba(24,183,155,0.92)";
        context.beginPath();
        if (line.type === "horizontal") {
          const y = state.imageRect.y + (line.value * state.imageRect.height);
          context.moveTo(state.imageRect.x, y);
          context.lineTo(state.imageRect.x + state.imageRect.width, y);
        } else if (line.type === "vertical") {
          const x = state.imageRect.x + (line.value * state.imageRect.width);
          context.moveTo(x, state.imageRect.y);
          context.lineTo(x, state.imageRect.y + state.imageRect.height);
        }
        context.stroke();
        context.setLineDash([]);
      });

      if (hoveredEdgeIndex >= 0 || draggedEdgeIndex >= 0) {
        const edgeIndex = draggedEdgeIndex >= 0 ? draggedEdgeIndex : hoveredEdgeIndex;
        const pair = EDGE_POINT_INDEXES[edgeIndex];
        context.lineWidth = 4;
        context.strokeStyle = "rgba(24,183,155,0.72)";
        context.beginPath();
        context.moveTo(points[pair[0]].x, points[pair[0]].y);
        context.lineTo(points[pair[1]].x, points[pair[1]].y);
        context.stroke();
      }

      points.forEach(function (point, index) {
        const isSelected = index === state.selectedCornerIndex;
        const isHovered = index === hoveredCornerIndex;
        const isDragged = index === draggedCornerIndex;
        const isActive = isSelected || isHovered || isDragged;

        if (isActive) {
          context.beginPath();
          context.fillStyle = isDragged ? "rgba(24,183,155,0.2)" : "rgba(255,255,255,0.78)";
          context.arc(point.x, point.y, isDragged ? 18 : 15, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = isDragged || isSelected ? "#193f38" : "rgba(255,255,255,0.95)";
        context.strokeStyle = "rgba(31,25,21,0.26)";
        context.lineWidth = isActive ? 3 : 2;
        context.arc(point.x, point.y, isDragged ? 11 : (isHovered ? 10.5 : 10), 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.font = "700 12px Manrope, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = isDragged || isSelected ? "#ffffff" : "#0f1728";
        context.fillText(GUIDE_CORNER_SHORT_LABELS[index], point.x, point.y);
      });

      edgeMidpoints.forEach(function (point, index) {
        const active = index === hoveredEdgeIndex || index === draggedEdgeIndex;
        context.beginPath();
        context.fillStyle = active ? "rgba(24,183,155,0.95)" : "rgba(255,255,255,0.96)";
        context.strokeStyle = active ? "rgba(15,23,40,0.1)" : "rgba(15,23,40,0.24)";
        context.lineWidth = active ? 3 : 2;
        context.arc(point.x, point.y, active ? 8 : 7, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });

      if (annotation && annotation.text) {
        context.font = "600 13px Manrope, sans-serif";
        context.textAlign = "left";
        context.textBaseline = "middle";
        const paddingX = 12;
        const bubbleHeight = 34;
        const bubbleWidth = Math.min(context.measureText(annotation.text).width + (paddingX * 2), state.imageRect.width - 20);
        const bubbleX = clamp(annotation.x - (bubbleWidth / 2), state.imageRect.x + 10, (state.imageRect.x + state.imageRect.width) - bubbleWidth - 10);
        const bubbleY = clamp(annotation.y - (bubbleHeight / 2), state.imageRect.y + 12, (state.imageRect.y + state.imageRect.height) - bubbleHeight - 12);
        createRoundedRectPath(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 16);
        context.fillStyle = "rgba(255,255,255,0.88)";
        context.fill();
        context.strokeStyle = "rgba(15,23,40,0.08)";
        context.lineWidth = 1;
        context.stroke();
        context.fillStyle = "rgba(15,23,40,0.86)";
        context.fillText(annotation.text, bubbleX + paddingX, bubbleY + (bubbleHeight / 2));
      }

      context.restore();
    },

    renderCanvas() {
      this.drawSceneImage();
      this.drawFloorPreview();
      this.drawCompareDivider();
      this.drawFloorGuides();
    }
  };

  function scheduleRender(options) {
    if (options && options.ui) {
      state.needsUiRender = true;
    }
    if (options && options.summary) {
      state.needsSummaryRender = true;
    }
    if (!options || options.canvas !== false) {
      state.needsCanvasRender = true;
    }

    if (state.renderFrame) {
      return;
    }

    state.renderFrame = window.requestAnimationFrame(function () {
      state.renderFrame = 0;

      if (state.needsUiRender) {
        ensureStyleBelongsToFamily();
        UI.renderChoices();
      }

      if (state.needsUiRender || state.needsSummaryRender) {
        UI.updateSummary();
      }

      if (state.needsCanvasRender) {
        Renderer.renderCanvas();
      }

      state.needsUiRender = false;
      state.needsSummaryRender = false;
      state.needsCanvasRender = false;
    });
  }

  function loadImageFromSource(source, sourceLabel, sourceType) {
    const currentLoadId = state.imageLoadId + 1;
    state.imageLoadId = currentLoadId;
    state.dragHandle = -1;
    state.dragTarget = null;
    state.hoverTarget = null;
    setGuideAssist("", []);
    state.image = null;
    state.imageRect = null;
    state.imageAnalysis = null;
    state.imageLoadState = "loading";
    state.imageErrorMessage = "";

    UI.setGlobalStatus("Loading room image...");
    scheduleRender({ summary: true, canvas: true });

    const image = new Image();
    image.decoding = "async";
    image.onload = function () {
      if (state.imageLoadId !== currentLoadId) {
        return;
      }
      state.image = image;
      state.imageAnalysis = null;
      state.imageLoadState = "ready";
      state.currentSourceLabel = sourceLabel;
      state.sourceType = sourceType;
      UI.setGlobalStatus(sourceType === "upload"
        ? "Photo ready. Place the floor once, then compare finishes."
        : sourceLabel + " ready. Compare finishes or refine the guides.");
      scheduleRender({ ui: true, summary: true, canvas: true });
    };
    image.onerror = function () {
      if (state.imageLoadId !== currentLoadId) {
        return;
      }
      state.image = null;
      state.imageRect = null;
      state.imageAnalysis = null;
      state.imageLoadState = "error";
      state.imageErrorMessage = "Image could not be loaded. Try another file.";
      UI.setGlobalStatus("Image could not be loaded. Try another file.");
      scheduleRender({ summary: true, canvas: true });
    };
    image.src = source;
  }

  function setScene(sceneId) {
    const scene = scenePresets[sceneId];
    if (!scene) {
      return;
    }
    setGuideAssist("", []);
    state.selectedScene = sceneId;
    state.lastPresetScene = sceneId;
    setFloorQuad(scene.quad, true);
    loadImageFromSource(scene.image, scene.sourceLabel, "preset");
  }

  function resetFloorGuides() {
    setFloorQuad(getActiveResetQuad(), true);
    setGuideAssist("", []);
    state.dragHandle = -1;
    UI.setGlobalStatus("Guides reset.");
    scheduleRender({ canvas: true });
  }

  function loadUploadedFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      state.selectedScene = "";
      setGuideAssist("", []);
      setFloorQuad(getDefaultUploadedQuad(), true);
      loadImageFromSource(event.target.result, file.name || "Uploaded room", "upload");
    };
    reader.onerror = function () {
      UI.setGlobalStatus("File could not be read. Try another image.");
    };
    reader.readAsDataURL(file);
  }

  function getPointerPosition(event) {
    const rect = dom.canvas.getBoundingClientRect();
    const scaleX = dom.canvas.width / rect.width;
    const scaleY = dom.canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function getNormalizedPointerPosition(event) {
    if (!state.imageRect) {
      return null;
    }
    const point = getPointerPosition(event);
    return {
      x: (point.x - state.imageRect.x) / state.imageRect.width,
      y: (point.y - state.imageRect.y) / state.imageRect.height
    };
  }

  function getGuideTargets() {
    const points = Renderer.getAbsoluteFloorQuad();
    if (points.length !== 4) {
      return { points: [], edges: [] };
    }
    return {
      points: points,
      edges: getEdgeMidpoints(points)
    };
  }

  function getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  function selectGuideCorner(index) {
    state.selectedCornerIndex = clamp(index, 0, GUIDE_CORNER_LABELS.length - 1);
    scheduleRender({ summary: true, canvas: true });
  }

  function getGuideTargetAtPoint(point) {
    const targets = getGuideTargets();

    for (let index = 0; index < targets.points.length; index += 1) {
      if (getDistance(point, targets.points[index]) <= CORNER_HANDLE_RADIUS) {
        return { type: "corner", index: index };
      }
    }

    for (let index = 0; index < targets.edges.length; index += 1) {
      if (getDistance(point, targets.edges[index]) <= EDGE_HANDLE_RADIUS) {
        return { type: "edge", index: index };
      }
    }

    if (targets.points.length === 4 && pointInPolygon(point.x, point.y, targets.points)) {
      return { type: "move", index: -1 };
    }

    return null;
  }

  function updateCanvasCursor(point) {
    if (!state.imageRect) {
      dom.canvas.style.cursor = "crosshair";
      return;
    }

    const previousTarget = state.hoverTarget;
    const target = getGuideTargetAtPoint(point);
    state.hoverTarget = target;
    if (!isSameGuideTarget(previousTarget, target)) {
      scheduleRender({ canvas: true });
    }

    if (!target) {
      dom.canvas.style.cursor = "crosshair";
      return;
    }

    if (target.type === "move") {
      dom.canvas.style.cursor = "grab";
      return;
    }

    dom.canvas.style.cursor = "pointer";
  }

  function applyDrag(event) {
    if (!state.dragTarget || !state.imageRect) {
      return;
    }

    const normalizedPoint = getNormalizedPointerPosition(event);
    if (!normalizedPoint) {
      return;
    }

    if (state.dragTarget.type === "corner") {
      const snapPreview = getCornerSnapPreview(state.dragTarget.index, normalizedPoint, state.dragTarget.startQuad);
      setFloorQuad(
        Geometry.constrainHandleMove(state.dragTarget.index, snapPreview.point, state.dragTarget.startQuad),
        true
      );
      setGuideAssist(snapPreview.message, snapPreview.lines);
    } else if (state.dragTarget.type === "edge") {
      setFloorQuad(
        Geometry.translateEdge(
          state.dragTarget.startQuad,
          state.dragTarget.index,
          {
            x: normalizedPoint.x - state.dragTarget.startPoint.x,
            y: normalizedPoint.y - state.dragTarget.startPoint.y
          }
        ),
        true
      );
      setGuideAssist("", []);
    } else if (state.dragTarget.type === "move") {
      setFloorQuad(
        Geometry.translateQuad(
          state.dragTarget.startQuad,
          {
            x: normalizedPoint.x - state.dragTarget.startPoint.x,
            y: normalizedPoint.y - state.dragTarget.startPoint.y
          }
        ),
        true
      );
      setGuideAssist("", []);
    }

    scheduleRender({ canvas: true });
  }

  function nudgeSelectedCorner(deltaX, deltaY) {
    const currentPoint = state.floorQuadNormalized[state.selectedCornerIndex];
    setGuideAssist("", []);
    setFloorQuad(
      Geometry.constrainHandleMove(
        state.selectedCornerIndex,
        {
          x: currentPoint.x + deltaX,
          y: currentPoint.y + deltaY
        },
        state.floorQuadNormalized
      ),
      true
    );
    scheduleRender({ summary: true, canvas: true });
  }

  function saveSelectionToQuote() {
    localStorage.setItem(VISUALISER_PRODUCT_KEY, state.selectedFamily);
    if (state.selectedStyle === CUSTOM_SAMPLE_STYLE_ID) {
      localStorage.removeItem(VISUALISER_STYLE_KEY);
      UI.setHandoffStatus(getCurrentFamily().label + " saved for quote. Custom sample preview stays on this page.");
      UI.setGlobalStatus("Family saved for quote. Custom sample preview stays inside the visualiser.");
      return;
    }
    localStorage.setItem(VISUALISER_STYLE_KEY, state.selectedStyle);
    UI.setHandoffStatus(getCurrentFamily().label + " saved for quote.");
    UI.setGlobalStatus("Selection saved. Open quote to continue with " + getCurrentFamily().label + ".");
  }

  function wireEvents() {
    dom.sceneGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-scene]");
      if (!button) {
        return;
      }
      setScene(button.dataset.scene);
    });

    dom.familyTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-family]");
      if (!button) {
        return;
      }
      state.selectedFamily = button.dataset.family;
      ensureStyleBelongsToFamily();
      rememberRecentStyle(state.selectedStyle);
      UI.setGlobalStatus(getCurrentFamily().label + " ready. The floor placement stayed locked while you switch finishes.");
      scheduleRender({ ui: true, summary: true, canvas: true });
    });

    dom.styleGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-style]");
      if (!button) {
        return;
      }
      selectStyle(button.dataset.style);
    });

    dom.productSwitchRail.addEventListener("click", function (event) {
      const button = event.target.closest("[data-style]");
      if (!button) {
        return;
      }
      selectStyle(button.dataset.style);
    });

    dom.recentSwitchRail.addEventListener("click", function (event) {
      const button = event.target.closest("[data-style]");
      if (!button) {
        return;
      }
      selectStyle(button.dataset.style);
    });

    dom.roomUpload.addEventListener("change", function (event) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        loadUploadedFile(file);
      }
    });

    if (dom.sampleUpload) {
      dom.sampleUpload.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];
        if (file) {
          loadCustomSampleFile(file);
        }
      });
    }

    if (dom.clearSample) {
      dom.clearSample.addEventListener("click", function () {
        clearCustomSample();
      });
    }

    dom.resetGuides.addEventListener("click", resetFloorGuides);

    dom.togglePreview.addEventListener("click", function () {
      state.previewHoldRestore = false;
      state.previewVisible = !state.previewVisible;
      UI.setGlobalStatus(state.previewVisible ? "Flooring preview is back on." : "Showing the original room only.");
      scheduleRender({ summary: true, canvas: true });
    });

    dom.revertPreset.addEventListener("click", function () {
      setScene(state.lastPresetScene || "living");
    });

    dom.compareSlider.addEventListener("input", function (event) {
      state.compare = Number(event.target.value);
      scheduleRender({ summary: true, canvas: true });
    });

    dom.comparePresetButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyComparePreset(button.dataset.comparePreset);
      });
    });

    dom.holdOriginal.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      setTemporaryOriginal(true);
    });
    ["pointerup", "pointerleave", "pointercancel", "lostpointercapture"].forEach(function (eventName) {
      dom.holdOriginal.addEventListener(eventName, function () {
        setTemporaryOriginal(false);
      });
    });

    dom.previousStyle.addEventListener("click", function () {
      cycleStyle(-1);
    });

    dom.nextStyle.addEventListener("click", function () {
      cycleStyle(1);
    });

    dom.blendSlider.addEventListener("input", function (event) {
      state.blend = Number(event.target.value);
      scheduleRender({ summary: true, canvas: true });
    });

    dom.guideCornerButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        selectGuideCorner(Number(button.dataset.guideCorner));
      });
    });

    dom.nudgeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.dataset.nudge === "left") {
          nudgeSelectedCorner(-KEYBOARD_NUDGE, 0);
        } else if (button.dataset.nudge === "right") {
          nudgeSelectedCorner(KEYBOARD_NUDGE, 0);
        } else if (button.dataset.nudge === "up") {
          nudgeSelectedCorner(0, -KEYBOARD_NUDGE);
        } else if (button.dataset.nudge === "down") {
          nudgeSelectedCorner(0, KEYBOARD_NUDGE);
        }
      });
    });

    dom.directionModeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.textureRotationBase = Number(button.dataset.directionBase);
        scheduleRender({ summary: true, canvas: true });
      });
    });

    dom.directionTrimSlider.addEventListener("input", function (event) {
      state.textureRotationTrim = Number(event.target.value);
      scheduleRender({ summary: true, canvas: true });
    });

    dom.plankScaleSlider.addEventListener("input", function (event) {
      state.plankScale = Number(event.target.value);
      scheduleRender({ summary: true, canvas: true });
    });

    dom.straightenBackEdge.addEventListener("click", function () {
      setFloorQuad(Geometry.straightenEdge(state.floorQuadNormalized, 0), true);
      setGuideAssist("", []);
      UI.setGlobalStatus("Back edge straightened.");
      scheduleRender({ canvas: true, summary: true });
    });

    dom.straightenFrontEdge.addEventListener("click", function () {
      setFloorQuad(Geometry.straightenEdge(state.floorQuadNormalized, 2), true);
      setGuideAssist("", []);
      UI.setGlobalStatus("Front edge straightened.");
      scheduleRender({ canvas: true, summary: true });
    });

    dom.straightenLeftEdge.addEventListener("click", function () {
      setFloorQuad(Geometry.straightenEdge(state.floorQuadNormalized, 3), true);
      setGuideAssist("", []);
      UI.setGlobalStatus("Left wall aligned.");
      scheduleRender({ canvas: true, summary: true });
    });

    dom.straightenRightEdge.addEventListener("click", function () {
      setFloorQuad(Geometry.straightenEdge(state.floorQuadNormalized, 1), true);
      setGuideAssist("", []);
      UI.setGlobalStatus("Right wall aligned.");
      scheduleRender({ canvas: true, summary: true });
    });

    dom.squareSideEdges.addEventListener("click", function () {
      setFloorQuad(Geometry.squareSideEdges(state.floorQuadNormalized), true);
      setGuideAssist("", []);
      UI.setGlobalStatus("Side walls evened up.");
      scheduleRender({ canvas: true, summary: true });
    });

    dom.saveProduct.addEventListener("click", saveSelectionToQuote);

    dom.canvas.addEventListener("pointerdown", function (event) {
      if (!state.imageRect) {
        return;
      }
      const point = getPointerPosition(event);
      const target = getGuideTargetAtPoint(point);
      if (!target) {
        return;
      }

      if (target.type === "corner") {
        selectGuideCorner(target.index);
      }

      setGuideAssist("", []);

      state.dragHandle = target.type === "corner" ? target.index : -1;
      state.dragTarget = {
        type: target.type,
        index: target.index,
        startPoint: getNormalizedPointerPosition(event),
        startQuad: cloneQuad(state.floorQuadNormalized)
      };
      dom.canvas.setPointerCapture(event.pointerId);
      applyDrag(event);
    });

    dom.canvas.addEventListener("pointermove", function (event) {
      if (!state.dragTarget) {
        updateCanvasCursor(getPointerPosition(event));
        return;
      }
      applyDrag(event);
    });

    function releaseDrag(event) {
      if (!state.dragTarget) {
        return;
      }
      setGuideAssist("", []);
      state.dragHandle = -1;
      state.dragTarget = null;
      if (event && typeof event.pointerId === "number") {
        try {
          dom.canvas.releasePointerCapture(event.pointerId);
        } catch (error) {
          // Ignore release failures.
        }
      }
      scheduleRender({ canvas: true });
    }

    dom.canvas.addEventListener("pointerup", releaseDrag);
    dom.canvas.addEventListener("pointercancel", releaseDrag);
    dom.canvas.addEventListener("lostpointercapture", releaseDrag);
    dom.canvas.addEventListener("pointerleave", function () {
      if (!state.dragTarget) {
        state.hoverTarget = null;
        setGuideAssist("", []);
        dom.canvas.style.cursor = "crosshair";
        scheduleRender({ canvas: true });
      }
    });

    window.addEventListener("keydown", function (event) {
      if (!state.imageRect) {
        return;
      }
      if (event.target && /input|textarea|select|button/i.test(event.target.tagName)) {
        return;
      }

      const step = event.shiftKey ? KEYBOARD_NUDGE_LARGE : KEYBOARD_NUDGE;
      let deltaX = 0;
      let deltaY = 0;

      if (event.key === "ArrowLeft") {
        deltaX = -step;
      } else if (event.key === "ArrowRight") {
        deltaX = step;
      } else if (event.key === "ArrowUp") {
        deltaY = -step;
      } else if (event.key === "ArrowDown") {
        deltaY = step;
      } else {
        return;
      }

      event.preventDefault();
      nudgeSelectedCorner(deltaX, deltaY);
    });
  }

  function hydrateSavedSelection() {
    try {
      const savedProduct = localStorage.getItem(VISUALISER_PRODUCT_KEY);
      const savedStyle = localStorage.getItem(VISUALISER_STYLE_KEY);

      if (savedProduct && productFamilies[savedProduct]) {
        state.selectedFamily = savedProduct;
      }

      ensureStyleBelongsToFamily();

      if (savedStyle) {
        const owningFamily = findFamilyByStyleId(savedStyle);

        if (owningFamily) {
          state.selectedFamily = owningFamily.id;
          state.selectedStyle = savedStyle;
        }
      }

      rememberRecentStyle(state.selectedStyle);
    } catch (error) {
      // Ignore local storage read failures.
    }
  }

  function initialise() {
    hydrateSavedSelection();
    wireEvents();
    scheduleRender({ ui: true, summary: true, canvas: true });
    setScene("living");
  }

  initialise();
})();
