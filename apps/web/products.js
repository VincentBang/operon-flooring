(function () {
  const STORAGE_KEY = "operon_selected_product";
  const STORAGE_ID_KEY = "operon_selected_product_id";
  const CATEGORY_STORAGE_KEY = "operon_selected_product_category";
  const RANGE_STORAGE_KEY = "operon_selected_range_id";
  const COLOUR_STORAGE_KEY = "operon_selected_colour";
  const SELECTION_MODE_STORAGE_KEY = "operon_selected_product_selection_mode";
  const ETF_HYBRID_RANGE_DESCRIPTION = [
    "ETF Hybrid Flooring is a premium SPC hybrid range designed for Sydney and NSW homes that want the look of timber with the practicality of a modern waterproof floor.",
    "Hybrid SPC flooring blends the best of laminate and vinyl flooring into a next-generation, multi-layered floating floor system. It is built to handle moisture, heat, and daily wear while staying suitable for most rooms in the house, including kitchens.",
    "This range is made for busy households that want a cost-effective flooring solution with realistic timber visuals, a stable rigid core, and a cleaner installation path."
  ];
  const ETF_HYBRID_RANGE_FEATURES = [
    "100% waterproof performance for bedrooms, living spaces, and kitchens.",
    "Highly resilient against scratches, dents, stains, and everyday family traffic.",
    "Rigid SPC core for dimensional stability and dependable floating-floor performance.",
    "Pre-attached acoustic underlay for softer underfoot comfort and reduced noise.",
    "DIY-friendly click-lock installation with no glue or nails required."
  ];
  const ETF_LAMINATE_RANGE_DESCRIPTION = [
    "ETF Laminate Flooring gives Sydney and NSW projects the look of real timber without the higher maintenance or cost that comes with traditional hardwood.",
    "Laminate flooring uses a stable HDF core with a photographic decorative layer and a tough UV-protected wear surface, creating a durable floor that works well in modern homes.",
    "This 1.2 metre laminate range is built for practical renovations that need strong scratch resistance, straightforward floating-floor installation, and easy day-to-day care."
  ];
  const ETF_LAMINATE_RANGE_FEATURES = [
    "Timber-look finish at a more budget-friendly price point.",
    "Scratch-resistant and fade-resistant surface for busy households.",
    "UV-protected wear layer to help maintain colour in bright interiors.",
    "Click-lock floating floor installation for faster and cleaner installs.",
    "Low-maintenance laminate construction with a stable HDF core."
  ];

  function createEtfHybridRangeContent(technical) {
    return {
      description: ETF_HYBRID_RANGE_DESCRIPTION.slice(),
      featuresIntro: "Why homeowners love ETF Hybrid SPC flooring",
      features: ETF_HYBRID_RANGE_FEATURES.slice(),
      technical: technical.slice()
    };
  }

  function createEtfLaminateRangeContent() {
    return {
      description: ETF_LAMINATE_RANGE_DESCRIPTION.slice(),
      featuresIntro: "Why homeowners choose ETF Laminate flooring",
      features: ETF_LAMINATE_RANGE_FEATURES.slice(),
      technical: [
        { label: "Brand", value: "ETF Flooring" },
        { label: "Total Thickness", value: "12.3 mm" },
        { label: "Board Size", value: "1215mm x 196mm" },
        { label: "Water Resistance", value: "24 Hours Water Resistant" },
        { label: "Wear Resistance", value: "AC4 Heavy Residential" },
        { label: "Range Format", value: "1.2 meter laminate" },
        { label: "Warranty", value: "25 Year Residential Wear Warranty" },
        { label: "Core", value: "HDF core construction" },
        { label: "Installation", value: "Floating click-lock system" }
      ]
    };
  }

  const RANGE_CONFIG = {
    hybrid: {
      "ETF Hybrid 7.0mm": {
        rangeId: "hybrid-etf-7mm",
        rangeLabel: "ETF 7.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-7mm-hybrid-antique-oak",
        isDefaultRecommendation: true,
        customerLabel: "ETF 7.0mm Waterproof Hybrid Flooring",
        rangeContent: createEtfHybridRangeContent([
          { label: "Brand", value: "ETF Flooring" },
          { label: "Total Thickness", value: "7.0 mm with Underlay" },
          { label: "Board Size", value: "1500 mm x 228 mm" },
          { label: "Material", value: "Hybrid SPC (Solid Polymer Core)" },
          { label: "Wear Layer", value: "0.3 mm Melamine Layer" },
          { label: "Warranty", value: "25 Year Hybrid Limited Warranty" },
          { label: "Installation", value: "Floating click-lock system" },
          { label: "Colour Range", value: "15 colours available" }
        ])
      },
      "ETF Hybrid 8.0mm": {
        rangeId: "hybrid-etf-8mm",
        rangeLabel: "ETF 8.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-8mm-hybrid-alaskan-oak",
        customerLabel: "ETF 8.0mm Waterproof Hybrid Flooring",
        rangeContent: createEtfHybridRangeContent([
          { label: "Brand", value: "ETF Flooring" },
          { label: "Total Thickness", value: "8.0 mm with Underlay" },
          { label: "Board Size", value: "1810 mm x 228 mm" },
          { label: "Material", value: "Hybrid SPC (Solid Polymer Core)" },
          { label: "Wear Layer", value: "0.3 mm Melamine Layer" },
          { label: "Warranty", value: "25 Year Hybrid Limited Warranty" },
          { label: "Installation", value: "Floating click-lock system" },
          { label: "Colour Range", value: "12 colours available" }
        ])
      },
      "ETF Hybrid 9.0mm": {
        rangeId: "hybrid-etf-9mm",
        rangeLabel: "ETF 9.0mm Waterproof Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "hrt-etf-9mm-hybrid-alaskan-oak",
        customerLabel: "ETF 9.0mm Waterproof Hybrid Flooring",
        rangeContent: createEtfHybridRangeContent([
          { label: "Brand", value: "ETF Flooring" },
          { label: "Total Thickness", value: "9.0 mm with Underlay" },
          { label: "Board Size", value: "Refer to selected colour brochure" },
          { label: "Material", value: "Hybrid SPC (Solid Polymer Core)" },
          { label: "Wear Layer", value: "Melamine wear layer" },
          { label: "Warranty", value: "25 Year Hybrid Limited Warranty" },
          { label: "Installation", value: "Floating click-lock system" },
          { label: "Colour Range", value: "14 colours available" }
        ])
      },
      "Grande 9.0": {
        rangeId: "hybrid-eco-grande-9mm",
        rangeLabel: "Grande 9.0 Hybrid Flooring",
        selectionMode: "range_only",
        representativeProductId: "eco-grande-9mm-bella",
        customerLabel: "Grande 9.0 Hybrid Flooring",
        rangeContent: {
          description: [
            "Ornato Grande Hybrid waterproof flooring is designed to give a genuine timber look and feel while keeping the practical performance of a rigid hybrid floating floor.",
            "Eco Flooring describes the surface character as a rustic timber visual with varied knots and grains that work as both a visual and tactile representation of real timber.",
            "The Grande Hybrid collection uses advanced modular plank technology to create a stylish and practical flooring solution for homes and offices, while aiming to reduce maintenance compared with genuine timber.",
            "Within the supplier brochure, Grande 9.0 is grouped into a European Oak collection and a Timber collection across ten colours: Chalk, Bella, Capri, Hawthorn, Raven, Sand, Sparrow, Northern Spotted Gum, Ghost Gum, and Pacific Blackbutt."
          ],
          featuresIntro: "Supplier-listed Grande 9.0 range highlights",
          features: [
            "100% waterproof rigid core board construction designed for interior areas including kitchens, bathrooms, laundries, homes, and commercial spaces.",
            "Patent click floating-floor system intended to reduce adhesive requirements in most spaces and support quicker installation.",
            "0.55mm wear layer with supplier claims for scratch resistance, scuff resistance, easy maintenance, and longer floor life with correct care.",
            "LVT top and balance layers combined with a rigid core and cushion pad for improved product stability and added underfoot comfort.",
            "Slip-resistant, hygienic, quiet, easy to clean, and easy to repair according to the supplier brochure.",
            "Environment-friendly positioning with supplier claim of 100% recyclable construction."
          ],
          technical: [
            { label: "Supplier System", value: "Ornato Grande Hybrid Waterproof Flooring" },
            { label: "Type", value: "Rigid Hybrid Floating Flooring" },
            { label: "Thickness", value: "9.0mm (2mm underlay)" },
            { label: "Board Size", value: "1500 x 230 x 9.0mm" },
            { label: "Surface Finish", value: "UV Coating - Anti bacterial" },
            { label: "Wear Layer", value: "0.55mm" },
            { label: "Edging", value: "Micro-Bevelled Edge" },
            { label: "Profile", value: "Unilin" },
            { label: "Installation Method", value: "Floating" },
            { label: "Construction", value: "Rigid Core; LVT balance layer; Cushion pad" },
            { label: "Pack Size", value: "1.38m2" },
            { label: "Pack Weight", value: "22 kg" },
            { label: "Boards Per Pack", value: "4" },
            { label: "VOC Rating", value: "A+" },
            { label: "Applications", value: "Interior areas of private homes and commercial establishments" },
            { label: "Warranty", value: "25 years private use / 5 years commercial use" },
            { label: "Colour Range", value: "10 colours across European Oak and Timber collections" }
          ]
        }
      },
      "Avala Hybrid Planks": {
        "rangeId": "hybrid-topdeck-avala",
        "rangeLabel": "Avala Hybrid Planks",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-avala-blackbutt",
        "customerLabel": "Avala Hybrid Planks",
        "rangeContent": {
          "description": ["The latest evolution in hybrid flooring, Avala Hybrid Planks feature SPC Rigid Core technology for uncompromising waterproof protection and durability. Designed to elevate modern living, they combine the strength of stone polymer with ultra-realistic timber finishes, delivering a floorboard that\u2019s as beautiful as it is resilient \u2014 ideal for kitchens and high-traffic areas."],
          "featuresIntro": "Supplier-listed highlights for Avala Hybrid Planks",
          "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1524 x 183 or 230 x 6.5mm"
            },
            {
              "label": "Pkg Contains",
              "value": "8 Planks (2.2311m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "10 colours available"
            }
          ]
        }
      },
      "Lumiere Ultra HD Hybrid Plank": {
        "rangeId": "hybrid-topdeck-lumiere-ultra-hd",
        "rangeLabel": "Lumiere Ultra HD Hybrid Plank",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-lumiere-bellevue-avenue",
        "customerLabel": "Lumiere Ultra HD Hybrid Plank",
        "rangeContent": {
          "description": ["Lumi\u00e8re Ultra HD brings elevated realism to hybrid flooring with advanced multi-layer RCP core technology. Its dense, waterproof construction resists movement and indentation, while the ultra-matt PU finish and brushed surface deliver the natural look and feel of timber \u2014 with the durability and comfort of modern innovation."],
          "featuresIntro": "Supplier-listed highlights for Lumiere Ultra HD Hybrid Plank",
          "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1524 x 230 x 7mm"
            },
            {
              "label": "Pkg Contains",
              "value": "6 Planks (2.10312m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Belle Vie Herringbone": {
        "rangeId": "hybrid-topdeck-belle-vie",
        "rangeLabel": "Belle Vie Herringbone",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-belle-vie-bellevue-avenue",
        "customerLabel": "Belle Vie Herringbone",
        "rangeContent": {
          "description": ["Belle Vie fuses natural timber aesthetics with a waterproof core and ultra-matte brushed surface. With 12 elegant designs and non-repeating patterns, it offers elevated realism and effortless installation via Valinge SG Click."],
          "featuresIntro": "Supplier-listed highlights for Belle Vie Herringbone",
          "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
          "technical": [
            {
              "label": "Type",
              "value": "Herringbone"
            },
            {
              "label": "Dimensions",
              "value": "625 x 125 x 7mm"
            },
            {
              "label": "Pkg Contains",
              "value": "18 Planks (1.40625m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Storm Luxury Hybrid Plank": {
        "rangeId": "hybrid-topdeck-storm-luxury",
        "rangeLabel": "Storm Luxury Hybrid Plank",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-storm-askada-grey-wash",
        "customerLabel": "Storm Luxury Hybrid Plank",
        "rangeContent": {
          "description": ["Storm Luxury blends timber visuals with a robust waterproof core, perfect for high-traffic areas. Featuring Negative Ion surface technology, built-in acoustic backing, and a 5-Star AAAC rating, it delivers elevated performance and well-being in one seamless solution."],
          "featuresIntro": "Supplier-listed highlights for Storm Luxury Hybrid Plank",
          "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1880 x 225 x 7mm"
            },
            {
              "label": "Pkg Contains",
              "value": "5 Planks (2.025m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (5G Click System)"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Artisan Hybrid Tile": {
        "rangeId": "hybrid-topdeck-artisan-tile",
        "rangeLabel": "Artisan Hybrid Tile",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-artisan-black-maquina",
        "customerLabel": "Artisan Hybrid Tile",
        "rangeContent": {
          "description": ["Artisan Hybrid Tiles are next-generation hybrid floorboards, crafted with advanced multi-layer composite core technology. They combine the sleek look of tile with the durability, warmth, and easy installation of hybrid flooring \u2014 ideal for modern, stylish interiors."],
          "featuresIntro": "Supplier-listed highlights for Artisan Hybrid Tile",
          "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank (Tile Format)"
            },
            {
              "label": "Dimensions",
              "value": "620 x 310 x 9mm"
            },
            {
              "label": "Pkg Contains",
              "value": "8 Planks (1.5376m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      }
    },
    laminate: {
      "12mm 24hrs Water Resistant Laminate": {
        rangeId: "laminate-12mm-24hr-water-resistant",
        rangeLabel: "ETF 12mm 24hrs Water Resistant Laminate",
        selectionMode: "range_only",
        representativeProductId: "hrt-12mm-laminate-aspen-oak",
        isDefaultRecommendation: true,
        customerLabel: "ETF 12mm 24hrs Water Resistant Laminate",
        rangeContent: createEtfLaminateRangeContent()
      },
      "Pantora Amor Collection": {
        "rangeId": "laminate-topdeck-pantora-amor",
        "rangeLabel": "Pantora Amor Collection",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-amor-amalfi-oak",
        "customerLabel": "Pantora Amor Collection",
        "rangeContent": {
          "description": ["The Amor Collection redefines laminate flooring with ultra-realistic textures and refined finishes. Powered by 4D synchronised technology and nano silent waterproofing, each plank offers quiet, lasting performance \u2014 elevating everyday living with elegance and innovation."],
          "featuresIntro": "Supplier-listed highlights for Pantora Amor Collection",
          "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1515 x 234 x 12mm"
            },
            {
              "label": "Pkg Contains",
              "value": "5 Planks (1.77255m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "5G Licensed Click System"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Pantora Lifestyle Collection": {
        "rangeId": "laminate-topdeck-pantora-lifestyle",
        "rangeLabel": "Pantora Lifestyle Collection",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-almond-oak",
        "customerLabel": "Pantora Lifestyle Collection",
        "rangeContent": {
          "description": ["Our 8mm laminate offers an accessible, budget-friendly flooring solution with dependable durability and style. Enhanced with 4D embossed-in-register technology, it brings added texture and a natural look at a more affordable price point."],
          "featuresIntro": "Supplier-listed highlights for Pantora Lifestyle Collection",
          "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1500 x 196 x 8mm"
            },
            {
              "label": "Pkg Contains",
              "value": "6 Planks (1.764m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Licensed Click System"
            },
            {
              "label": "Colour Range",
              "value": "10 colours available"
            }
          ]
        }
      },
      "Prime Deluxe Edition": {
        "rangeId": "laminate-topdeck-prime-deluxe",
        "rangeLabel": "Prime Deluxe Edition",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-deluxe-birch-wood",
        "customerLabel": "Prime Deluxe Edition",
        "rangeContent": {
          "description": ["The Deluxe Edition offers a graceful introduction to the beauty of laminate flooring, with seamless V-Groove finishes that bring quiet sophistication to any interior. Affordable yet refined, Deluxe is for those who desire elegance made simple, creating comfort and style with effortless ease."],
          "featuresIntro": "Supplier-listed highlights for Prime Deluxe Edition",
          "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1215 x 196 x 8.3mm"
            },
            {
              "label": "Pkg Contains",
              "value": "8 Planks (1.90512m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "8 colours available"
            }
          ]
        }
      },
      "Prime Contemporary Plus Edition": {
        "rangeId": "laminate-topdeck-prime-contemporary-plus",
        "rangeLabel": "Prime Contemporary Plus Edition",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-cp-aspen-oak",
        "customerLabel": "Prime Contemporary Plus Edition",
        "rangeContent": {
          "description": ["Contemporary Plus celebrates modern living with ultra-realistic printed textures and a design that feels as authentic as timber itself. Balancing beauty with practicality, this edition is perfect for homes that embrace sophistication, where every detail enriches both function and atmosphere."],
          "featuresIntro": "Supplier-listed highlights for Prime Contemporary Plus Edition",
          "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1215 x 195 x 12.3mm"
            },
            {
              "label": "Pkg Contains",
              "value": "8 Planks (1.8954m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "11 colours available"
            }
          ]
        }
      },
      "Prime Luxury Edition": {
        "rangeId": "laminate-topdeck-prime-luxury",
        "rangeLabel": "Prime Luxury Edition",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-luxury-grey-oak",
        "customerLabel": "Prime Luxury Edition",
        "rangeContent": {
          "description": ["With wide planks and richly detailed textures, the Luxury Edition transforms spaces with a sense of grandeur and openness. AC4 scratch resistance ensures enduring beauty, up to 40 times tougher than standard finishes. Crafted to mirror the depth and warmth of hardwood, it invites everyday luxury\u2014flooring that feels expansive, refined, and timelessly elegant underfoot."],
          "featuresIntro": "Supplier-listed highlights for Prime Luxury Edition",
          "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "2280 x 192 x 12.3mm"
            },
            {
              "label": "Pkg Contains",
              "value": "5 Planks (2.1888m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "10 colours available"
            }
          ]
        }
      },
      "Prime Legend Collection": {
        "rangeId": "laminate-topdeck-prime-legend",
        "rangeLabel": "Prime Legend Collection",
        "selectionMode": "range_only",
        "representativeProductId": "topdeck-legend-atlantic-oak",
        "customerLabel": "Prime Legend Collection",
        "rangeContent": {
          "description": ["The Legend Collection embodies strength and beauty, combining Aquashield waterproof technology with lifelike hardwood textures for a floor that protects as much as it inspires. AC5-rated durability withstands even the busiest households, while Negative Ion Technology enhances wellbeing. Designed for bold interiors, Legend creates a stable, enduring foundation\u2014an expression of confidence, comfort, and timeless sophistication in every step."],
          "featuresIntro": "Supplier-listed highlights for Prime Legend Collection",
          "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "2200 x 239 x 12.3mm"
            },
            {
              "label": "Pkg Contains",
              "value": "4 Planks (2.1032m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Floating Floor (Licensed Click System)"
            },
            {
              "label": "Colour Range",
              "value": "10 colours available"
            }
          ]
        }
      }
    },
    engineered: {
      "Swish Oak Natura": {
        rangeId: "engineered-swish-oak-natura",
        rangeLabel: "Swish Oak Natura",
        selectionMode: "range_then_colour",
        representativeProductId: "eco-swish-oak-natura-ambient-sand",
        isDefaultRecommendation: true,
        customerLabel: "Swish Oak Natura",
        rangeContent: {
          description: [
            "Oak has been a traditional flooring material used for centuries throughout the world. Oak flooring is desired for its longevity lasting more than 100 years.",
            "The Swish Oak Natura Flooring range comprises of multidirectional constructed engineered boards that provide all the benefits of being structurally robust. This assembly increases the boards' resistance to expansion and contraction from changes in humidity and temperature reducing warping or cupping. Hence these engineered boards are superior to solid oak flooring in both durability and stability.",
            "Fabulous attractive wide 190mm planks create the impression of a more spacious interior, whilst adding a sophisticated, warm and inviting feel to your environment.",
            "All Swish Oak Flooring come pre-finished thus there is no messy and timely on-site sanding or staining required.",
            "The top layer, or wear layer, is composed of genuine 3mm French oak. It features a variety of captivating finishes, such as natural, brushed, hand-scraped, or stained, allowing you to choose the aesthetic that best complements your space. The natural finish brings out the inherent warmth and character of the oak, while the brushed finish provide a rustic and textured appearance.",
            "Beneath the wear layer, multiple layers of high-quality plywood are intricately bonded together. This construction creates a stable and robust foundation for the oak veneer, minimizing the expansion and contraction that can occur with solid wood flooring due to changes in humidity and temperature."
          ],
          featuresIntro: "Why choose Swish Oak?",
          features: [
            "Swish Oak flooring is a harmonious fusion of nature's elegance and modern engineering. With its exquisite appearance, durability, and versatility, it is a timeless choice that can elevate the aesthetic appeal of any interior while providing the functionality and convenience desired in today's homes and commercial spaces. Swish Oak flooring not only enhances its stability but also makes it compatible with underfloor heating systems, expanding its versatility and comfort.",
            "A grade commercial quality FSC sustainable raw materials",
            "UV Matt lacquered / Oiled coatings for tough and longer lasting finishes",
            "Ultra low VOCs that meet EO international standards for high indoor air quality",
            "ABCD Genuine French Oak",
            "Comprehensive quality control systems of 23 inspection checks for guarantee of excellence."
          ],
          technical: [
            { label: "Type", value: "Engineered Oak Floor" },
            { label: "Thickness", value: "14/3mm" },
            { label: "Width", value: "190mm" },
            { label: "Length", value: "1900mm" },
            { label: "Edging", value: "Micro-Bevelled Edge" },
            { label: "Profile", value: "Tongue & Groove" },
            { label: "Installation Method", value: "Glue down / Floating" },
            { label: "Pack Size", value: "2.90m2" },
            { label: "Pack Weight", value: "25 kg" },
            { label: "Boards Per Pack", value: "8" },
            { label: "VOC Rating", value: "E1 <5ppm" }
          ]
        }
      },
      "Swish Oak Natura Herringbone": {
        rangeId: "engineered-swish-oak-natura-herringbone",
        rangeLabel: "Swish Oak Natura Herringbone",
        selectionMode: "range_then_colour",
        representativeProductId: "eco-swish-oak-natura-herringbone-french-natural",
        customerLabel: "Swish Oak Natura Herringbone",
        rangeContent: {
          description: [
            "French Oak has been a traditional flooring material used for centuries throughout the world. Oak flooring is desired for its longevity lasting more than 100 years.",
            "The Swish Oak Flooring herringbone range comprises of multidirectional constructed engineered boards that provide all the benefits of being structurally robust. This assembly increases the boards' resistance to expansion and contraction from changes in humidity and temperature reducing warping or cupping.",
            "Fabulous attractive 888mm herringbone planks create a more detailed statement floor while still adding a sophisticated, warm and inviting feel to your environment.",
            "All Swish Oak Flooring come pre-finished thus there is no messy and timely on-site sanding or staining required."
          ],
          featuresIntro: "Why choose Swish Oak?",
          features: [
            "A grade commercial quality FSC sustainable raw materials",
            "UV Matt lacquered / Oiled coatings for tough and longer lasting finishes",
            "Ultra low VOCs that meet E1 international standards for high indoor air quality.",
            "Comprehensive quality control systems of 23 inspection checks for guarantee of excellence."
          ],
          technical: [
            { label: "Type", value: "Engineered Oak Herringbone Floor" },
            { label: "Thickness", value: "14/3mm" },
            { label: "Width", value: "148mm" },
            { label: "Length", value: "888mm" },
            { label: "Edging", value: "Micro-Bevelled Edge" },
            { label: "Profile", value: "Tongue and Groove" },
            { label: "Installation Method", value: "Glue Down" },
            { label: "Pack Size", value: "1.0514m2" },
            { label: "Pack Weight", value: "10kg" },
            { label: "Boards Per Pack", value: "8" },
            { label: "VOC Rating", value: "E1 <5ppm" }
          ]
        }
      },
      "Wooden-Land Foreign Species": {
        "rangeId": "engineered-topdeck-wooden-land-foreign-species",
        "rangeLabel": "Wooden-Land Foreign Species",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-pacific-blackbutt-ab",
        "customerLabel": "Wooden-Land Foreign Species",
        "rangeContent": {
          "description": ["Our Wooden-Land Foreign species collection introduces internationally admired timbers with tight grains and rich variation. The tongue & groove system ensures refined, easy installation\u2014elevating global aesthetics for Australian spaces."],
          "featuresIntro": "Supplier-listed highlights for Wooden-Land Foreign Species",
          "features": ["International hardwood visuals with tight grain and richer variation.", "Engineered timber construction for a more stable floor than solid boards in changing conditions.", "Tongue and groove profile for traditional installation methods.", "Suitable for premium residential interiors that want a more distinctive hardwood look."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Length",
              "value": "1820mm"
            },
            {
              "label": "Width",
              "value": "122mm"
            },
            {
              "label": "Thickness",
              "value": "3/14mm"
            },
            {
              "label": "Locking",
              "value": "Tongue & Groove System"
            },
            {
              "label": "Colour Range",
              "value": "2 colours available"
            }
          ]
        }
      },
      "Wooden-Land Australian Species 136mm": {
        "rangeId": "engineered-topdeck-wooden-land-australian-136mm",
        "rangeLabel": "Wooden-Land Australian Species 136mm",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-blackbutt-136mm",
        "customerLabel": "Wooden-Land Australian Species 136mm",
        "rangeContent": {
          "description": ["This signature collection features iconic Australian timbers like Blackbutt and Spotted Gum. Each plank is pre-finished with Treffert matt lacquer and cut in Standard & Better grade, offering an elevated blend of grain detail, strength, and quick-click installation."],
          "featuresIntro": "Supplier-listed highlights for Wooden-Land Australian Species 136mm",
          "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Length",
              "value": "1900mm"
            },
            {
              "label": "Width",
              "value": "136mm"
            },
            {
              "label": "Thickness",
              "value": "3/14mm"
            },
            {
              "label": "Locking",
              "value": "5G Licensed Click System"
            },
            {
              "label": "Colour Range",
              "value": "7 colours available"
            }
          ]
        }
      },
      "Wooden-Land Australian Species 190mm": {
        "rangeId": "engineered-topdeck-wooden-land-australian-190mm",
        "rangeLabel": "Wooden-Land Australian Species 190mm",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-blackbutt-190mm",
        "customerLabel": "Wooden-Land Australian Species 190mm",
        "rangeContent": {
          "description": ["This signature collection features iconic Australian timbers like Blackbutt and Spotted Gum. Each plank is pre-finished with Treffert matt lacquer and cut in Standard & Better grade, offering an elevated blend of grain detail, strength, and quick-click installation."],
          "featuresIntro": "Supplier-listed highlights for Wooden-Land Australian Species 190mm",
          "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Length",
              "value": "1900mm"
            },
            {
              "label": "Width",
              "value": "190mm"
            },
            {
              "label": "Thickness",
              "value": "3/14mm"
            },
            {
              "label": "Locking",
              "value": "5G Licensed Click System"
            },
            {
              "label": "Colour Range",
              "value": "6 colours available"
            }
          ]
        }
      },
      "Wooden-Land Herringbone": {
        "rangeId": "engineered-topdeck-wooden-land-herringbone",
        "rangeLabel": "Wooden-Land Herringbone",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-blackbutt-hb",
        "customerLabel": "Wooden-Land Herringbone",
        "rangeContent": {
          "description": ["Classic European design meets Australian hardwoods in this refined herringbone range. With species like Spotted Gum and Blackbutt, it brings warmth, contrast, and elevated geometry to modern interiors."],
          "featuresIntro": "Supplier-listed highlights for Wooden-Land Herringbone",
          "features": ["Australian hardwood species presented in a classic herringbone layout.", "Engineered construction designed for improved dimensional stability over solid timber.", "5G Licensed Click System for a modern floating-floor herringbone installation.", "Statement pattern flooring for premium residential spaces."],
          "technical": [
            {
              "label": "Type",
              "value": "Herringbone"
            },
            {
              "label": "Dimensions",
              "value": "600 x 120 x 3/14mm"
            },
            {
              "label": "Pkg Contains",
              "value": "20 Planks (1.44m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "5G Licensed Click System"
            },
            {
              "label": "Colour Range",
              "value": "2 colours available"
            }
          ]
        }
      },
      "Project Oak": {
        "rangeId": "engineered-topdeck-project-oak",
        "rangeLabel": "Project Oak",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-project-oak-black-amber",
        "customerLabel": "Project Oak",
        "rangeContent": {
          "description": ["Project Oak is inspired by classic European design, showcasing the natural warmth and timeless beauty of oak. Its versatile aesthetic makes it ideal for both traditional interiors and sleek, modern spaces."],
          "featuresIntro": "Supplier-listed highlights for Project Oak",
          "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1900 x 190 x 2/14mm"
            },
            {
              "label": "Pkg Contains",
              "value": "6 Planks (2.166m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Tongue & Groove System"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Castel Nuovo Herringbone": {
        "rangeId": "engineered-topdeck-castel-nuovo-herringbone",
        "rangeLabel": "Castel Nuovo Herringbone",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-castel-nuovo-herringbone-black-amber",
        "customerLabel": "Castel Nuovo Herringbone",
        "rangeContent": {
          "description": ["Castel Nuovo Herringbone is inspired by classic French design, offering timeless oak beauty for both heritage and modern interiors. Each board is brushed to enhance the natural grain, creating a unique texture and finish. Prefinished with a UV ultra-matte lacquer, it features left and right tongue profiles for easy installation."],
          "featuresIntro": "Supplier-listed highlights for Castel Nuovo Herringbone",
          "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
          "technical": [
            {
              "label": "Type",
              "value": "Herringbone"
            },
            {
              "label": "Dimensions",
              "value": "600 x 120 x 3/14mm"
            },
            {
              "label": "Pkg Contains",
              "value": "20 Planks (1.44m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Tongue & Groove System"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Lavanda Oak": {
        "rangeId": "engineered-topdeck-lavanda-oak",
        "rangeLabel": "Lavanda Oak",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-lavanda-oak-amaretti-oak",
        "customerLabel": "Lavanda Oak",
        "rangeContent": {
          "description": ["Lavanda Oak blends classic European style with modern durability. Brushed to enhance its natural grain and finished with a UV ultra-matte lacquer and Sherwin-Williams coating, it offers scratch resistance and 48-hour water protection. The T&G boards feature a stable multi-ply core and are compatible with heated subfloors. Matching accessories complete the look."],
          "featuresIntro": "Supplier-listed highlights for Lavanda Oak",
          "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
          "technical": [
            {
              "label": "Type",
              "value": "Plank"
            },
            {
              "label": "Dimensions",
              "value": "1900 x 190 x 3/14mm"
            },
            {
              "label": "Pkg Contains",
              "value": "6 Planks (2.166m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Tongue & Groove System"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      },
      "Cavallo Bianco Chevron": {
        "rangeId": "engineered-topdeck-cavallo-bianco-chevron",
        "rangeLabel": "Cavallo Bianco Chevron",
        "selectionMode": "range_then_colour",
        "representativeProductId": "topdeck-amaretti-oak",
        "customerLabel": "Cavallo Bianco Chevron",
        "rangeContent": {
          "description": ["Cavallo Bianco Chevron pairs classic French design with the timeless beauty of natural oak. Brushed to highlight the grain and finished in a UV ultra-matte lacquer, each left and right tongue board offers unique texture and elegance \u2014 perfect for both heritage and modern spaces."],
          "featuresIntro": "Supplier-listed highlights for Cavallo Bianco Chevron",
          "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
          "technical": [
            {
              "label": "Type",
              "value": "Chevron"
            },
            {
              "label": "Dimensions",
              "value": "780 x 125 x 3/14mm"
            },
            {
              "label": "Pkg Contains",
              "value": "20 Planks (1.95m\u00b2)"
            },
            {
              "label": "Locking",
              "value": "Tongue & Groove System"
            },
            {
              "label": "Colour Range",
              "value": "12 colours available"
            }
          ]
        }
      }
    }
  };

  // Update pricePerM2 here when supplier price changes.
  // Do not hardcode product prices across multiple pages.
  // Product pages should read from this central data file.
  // If a supplier page exposes range-level Description / Features / Technical tabs,
  // store them in RANGE_CONFIG.<category>.<range>.rangeContent as structured arrays.
  // If a supplier product page exposes extra colour gallery images, save them locally
  // and attach them to the product with galleryImages so the product popup can show them.
  // TODO: Replace remaining sample catalogue rows with confirmed supplier ranges and imagery.
  const CATEGORY_META = {
    laminate: {
      id: "laminate",
      label: "Laminate Flooring",
      shortDescription: "Cost-conscious flooring with straightforward installation.",
      pricePerM2: 38,
      pageUrl: "laminate-flooring-sydney.html",
      catalogueStatus: "live_products"
    },
    hybrid: {
      id: "hybrid",
      label: "Hybrid Flooring",
      shortDescription: "Practical SPC hybrid flooring for apartments, houses, and busy family homes.",
      pricePerM2: 52,
      pageUrl: "hybrid-flooring-sydney.html",
      catalogueStatus: "live_products"
    },
    engineered: {
      id: "engineered",
      label: "Engineered Timber",
      shortDescription: "Premium timber look with a stronger material allowance.",
      pricePerM2: 88,
      pageUrl: "engineered-timber-flooring-sydney.html",
      catalogueStatus: "live_products"
    }
  };

  const PRODUCTS = {
    laminate: [
      {
        id: "hrt-12mm-laminate-aspen-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Aspen Oak",
        tone: "light oak",
        swatch: "#d7c4a2",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/aspen-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Aspen Oak board sample",
        description: "Aspen Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/aspen-oak/"
      },
      {
        id: "hrt-12mm-laminate-barnwood-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Barnwood Oak",
        tone: "mid oak",
        swatch: "#b78e67",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/barnwood-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Barnwood Oak board sample",
        description: "Barnwood Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/barnwood-brown-oak/"
      },
      {
        id: "hrt-12mm-laminate-blackbutt",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Blackbutt",
        tone: "light oak",
        swatch: "#cfb084",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/blackbutt.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Blackbutt board sample",
        description: "Blackbutt is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/blackbutt-2/"
      },
      {
        id: "hrt-12mm-laminate-brushbox",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Brushbox",
        tone: "walnut",
        swatch: "#9f7756",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/brushbox.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Brushbox board sample",
        description: "Brushbox is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/brushbox-2/"
      },
      {
        id: "hrt-12mm-laminate-citi-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Citi Oak",
        tone: "mid oak",
        swatch: "#b69270",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/citi-oak.jpg",
        alt: "12mm 24hrs Water Resistant Laminate Citi Oak board sample",
        description: "Citi Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/citi-oak/"
      },
      {
        id: "hrt-12mm-laminate-classical-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Classical Oak",
        tone: "natural oak",
        swatch: "#c1a07f",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/classical-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Classical Oak board sample",
        description: "Classical Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/classical-oak/"
      },
      {
        id: "hrt-12mm-laminate-coastal-blackbutt-1-5m",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Coastal Blackbutt 1.5m",
        tone: "light oak",
        swatch: "#d1b28d",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/coastal-blackbutt-1-5m.jpg",
        alt: "12mm 24hrs Water Resistant Laminate Coastal Blackbutt 1.5m board sample",
        description: "Coastal Blackbutt 1.5m is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/coastal-blackbutt-1-5m/"
      },
      {
        id: "hrt-12mm-laminate-cocoa-oak-matt",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Cocoa Oak (Matt)",
        tone: "dark oak",
        swatch: "#7c5d44",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/cocoa-oak-matt.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Cocoa Oak Matt board sample",
        description: "Cocoa Oak (Matt) is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/cocoa-oak-matt/"
      },
      {
        id: "hrt-12mm-laminate-cocoa-oak-semi-gloss",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Cocoa Oak (Semi-gloss)",
        tone: "dark oak",
        swatch: "#826148",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/cocoa-oak-semi-gloss.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Cocoa Oak Semi-gloss board sample",
        description: "Cocoa Oak (Semi-gloss) is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/cocoa-oak-semi-gloss/"
      },
      {
        id: "hrt-12mm-laminate-copperwood-pine-matt",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Copperwood Pine (Matt)",
        tone: "warm brown",
        swatch: "#a56d49",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/copperwood-pine-matt.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Copperwood Pine Matt board sample",
        description: "Copperwood Pine (Matt) is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/copperwood-pine-matt1/"
      },
      {
        id: "hrt-12mm-laminate-country-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Country Oak",
        tone: "natural oak",
        swatch: "#be9d74",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/country-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Country Oak board sample",
        description: "Country Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/country-oak-2/"
      },
      {
        id: "hrt-12mm-laminate-driftwood-ash",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Driftwood Ash",
        tone: "grey",
        swatch: "#aaa196",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/driftwood-ash.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Driftwood Ash board sample",
        description: "Driftwood Ash is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/driftwood-ash/"
      },
      {
        id: "hrt-12mm-laminate-earl-grey-1-5m",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Earl Grey 1.5m",
        tone: "grey",
        swatch: "#9f9892",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/earl-grey-1-5m.jpg",
        alt: "12mm 24hrs Water Resistant Laminate Earl Grey 1.5m board sample",
        description: "Earl Grey 1.5m is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/earl-grey-1-5m/"
      },
      {
        id: "hrt-12mm-laminate-frosty-pine",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Frosty Pine",
        tone: "light oak",
        swatch: "#d9d4c8",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/frosty-pine.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Frosty Pine board sample",
        description: "Frosty Pine is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/frosty-pine/"
      },
      {
        id: "hrt-12mm-laminate-grey-dark-oak",
        category: "laminate",
        brand: "12mm 24hrs Water Resistant Laminate",
        range: "12mm 24hrs Water Resistant Laminate",
        colour: "Grey Dark Oak",
        tone: "grey",
        swatch: "#7f736b",
        thickness: "12.0mm",
        productType: "Laminate",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/laminate/grey-dark-oak.jpeg",
        alt: "12mm 24hrs Water Resistant Laminate Grey Dark Oak board sample",
        description: "Grey Dark Oak is a laminate flooring colour from the 12mm 24hrs Water Resistant Laminate range.",
        features: ["12mm laminate board", "24-hour water-resistant surface", "AC4 wear rating", "Floating click-lock installation"],
        suitableFor: ["Bedrooms", "Living areas", "Study rooms", "Rental properties", "Dry internal renovations"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product/grey-dark-oak/"
      },
      {
        "id": "topdeck-amor-amalfi-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Amalfi Oak",
        "tone": "natural oak",
        "swatch": "#bfa281",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-amalfi-oak.webp",
        "alt": "Amalfi Oak laminate flooring swatch",
        "description": "Golden undertones enriched with sun-kissed warmth give Amalfi Oak a radiant and uplifting character. Inspired by Mediterranean landscapes, it fills interiors with a sense of natural vibrancy and effortless elegance.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-amalfi-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-amalfi-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-amalfi-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-amalfi-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-blackbutt",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Blackbutt",
        "tone": "natural oak",
        "swatch": "#c9a376",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-blackbutt.webp",
        "alt": "Blackbutt laminate flooring swatch",
        "description": "Golden honey tones with subtle pinkish notes create a bright and welcoming atmosphere. Blackbutt\u2019s clean grain and timeless finish make it a versatile favourite, suited to both modern and traditional interiors.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-blackbutt",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-blackbutt.webp", "images/products/laminate/topdeck-pantora-amor/amor-blackbutt-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-blackbutt-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-catalina-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Catalina Oak",
        "tone": "light beige",
        "swatch": "#eacfae",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-catalina-oak.webp",
        "alt": "Catalina Oak laminate flooring swatch",
        "description": "Pale sandy hues paired with smooth, even grain give Catalina Oak a relaxed, coastal-inspired look. Its clean finish enhances modern interiors, bringing freshness and clarity into any space.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-catalina-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-catalina-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-catalina-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-catalina-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-coastal-breeze",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Coastal Breeze",
        "tone": "natural oak",
        "swatch": "#b89d7f",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-coastal-breeze.webp",
        "alt": "Coastal Breeze laminate flooring swatch",
        "description": "Driftwood-inspired tones and natural variation bring a sense of ease and openness. Coastal Breeze evokes seaside living, filling interiors with an airy, relaxed spirit.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-coastal-breeze",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-coastal-breeze.webp", "images/products/laminate/topdeck-pantora-amor/amor-coastal-breeze-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-coastal-breeze-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-crystal-white-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Crystal White Oak",
        "tone": "light beige",
        "swatch": "#d2c5bd",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-crystal-white-oak.webp",
        "alt": "Crystal White Oak laminate flooring swatch",
        "description": "Crisp white tones infused with fine oak detail deliver a bright, minimalist aesthetic. Crystal White Oak opens up interiors, creating an atmosphere of purity and contemporary sophistication.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-crystal-white-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-crystal-white-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-crystal-white-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-crystal-white-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-harmony-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Harmony Oak",
        "tone": "natural oak",
        "swatch": "#dbb89e",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-harmony-oak.webp",
        "alt": "Harmony Oak laminate flooring swatch",
        "description": "Soft beige tones and delicate oak grain create a sense of calm and balance. Harmony Oak brings understated elegance to interiors, perfect for spaces designed around light, comfort, and natural warmth.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-harmony-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-harmony-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-harmony-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-harmony-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-ivory-sand-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Ivory Sand Oak",
        "tone": "natural oak",
        "swatch": "#d2b798",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-ivory-sand-oak.webp",
        "alt": "Ivory Sand Oak laminate flooring swatch",
        "description": "Warm ivory shades and gentle timber variation make Ivory Sand Oak feel natural and inviting. Its subtle texture adds depth, evoking a timeless charm well suited to both casual and refined spaces.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-ivory-sand-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-ivory-sand-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-ivory-sand-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-ivory-sand-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-moonstone-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Moonstone Oak",
        "tone": "warm brown",
        "swatch": "#ad9273",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-moonstone-oak.webp",
        "alt": "Moonstone Oak laminate flooring swatch",
        "description": "Cool grey-beige tones with soft grain detail bring sophistication and quiet strength. Moonstone Oak provides a versatile foundation, offering a refined neutral palette that complements contemporary design.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-moonstone-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-moonstone-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-moonstone-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-moonstone-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-silverstone-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Silverstone Oak",
        "tone": "natural oak",
        "swatch": "#ac9a8a",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-silverstone-oak.webp",
        "alt": "Silverstone Oak laminate flooring swatch",
        "description": "Soft silvery greys blended with oak\u2019s natural texture give Silverstone Oak a sophisticated, urban feel. It pairs effortlessly with neutral palettes and adds a touch of understated luxury.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-silverstone-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-silverstone-oak.webp", "images/products/laminate/topdeck-pantora-amor/amor-silverstone-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-silverstone-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-smokey-brown",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Smokey Brown",
        "tone": "warm brown",
        "swatch": "#927b62",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-smokey-brown.webp",
        "alt": "Smokey Brown laminate flooring swatch",
        "description": "Deep brown hues with smoky undertones create warmth and richness underfoot. Smokey Brown adds depth and comfort, ideal for interiors that seek a welcoming yet sophisticated mood.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-smokey-brown",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-smokey-brown.webp", "images/products/laminate/topdeck-pantora-amor/amor-smokey-brown-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-smokey-brown-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-spotted-gum",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#a3794e",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-spotted-gum.webp",
        "alt": "Spotted Gum laminate flooring swatch",
        "description": "Earthy browns combined with striking tonal variation make Spotted Gum a bold statement choice. Its natural movement and character capture the essence of Australian timbers, full of energy and presence.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-spotted-gum",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-spotted-gum.webp", "images/products/laminate/topdeck-pantora-amor/amor-spotted-gum-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-spotted-gum-gallery-3.webp"]
      },
      {
        "id": "topdeck-amor-urban-charcoal",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Amor Collection",
        "colour": "Urban Charcoal",
        "tone": "warm brown",
        "swatch": "#966d4c",
        "thickness": "12mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-amor/amor-urban-charcoal.webp",
        "alt": "Urban Charcoal laminate flooring swatch",
        "description": "Dark charcoal tones with subtle timber detail make Urban Charcoal bold and contemporary. Its dramatic palette adds a modern edge, perfect for creating statement floors that anchor interior design.",
        "features": ["4D synchronised laminate texture for a more realistic timber look.", "Nano Silent waterproofing system with quieter underfoot performance.", "12mm board construction for a more substantial feel underfoot.", "5G Licensed Click System for floating-floor installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amor-urban-charcoal",
        "galleryImages": ["images/products/laminate/topdeck-pantora-amor/amor-urban-charcoal.webp", "images/products/laminate/topdeck-pantora-amor/amor-urban-charcoal-gallery-2.webp", "images/products/laminate/topdeck-pantora-amor/amor-urban-charcoal-gallery-3.webp"]
      },
      {
        "id": "topdeck-almond-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Almond Oak",
        "tone": "natural oak",
        "swatch": "#ae977a",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/almond-oak.webp",
        "alt": "Almond Oak laminate flooring swatch",
        "description": "Golden almond hues with fine grain detail deliver a warm and inviting character. Almond Oak brings natural charm and comfort to interiors, creating a welcoming atmosphere full of depth.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/almond-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/almond-oak.webp", "images/products/laminate/topdeck-pantora-lifestyle/almond-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/almond-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-crown-heritage",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Crown Heritage",
        "tone": "natural oak",
        "swatch": "#c6ac8b",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/crown-heritage.webp",
        "alt": "Crown Heritage laminate flooring swatch",
        "description": "Rich beige and honey undertones highlight the distinctive grain of Crown Heritage. Its warm depth and character bring a sense of tradition while still pairing beautifully with modern styling.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/crown-heritage",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/crown-heritage.webp", "images/products/laminate/topdeck-pantora-lifestyle/crown-heritage-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/crown-heritage-gallery-3.webp"]
      },
      {
        "id": "topdeck-glacial-grey",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Glacial Grey",
        "tone": "natural oak",
        "swatch": "#ae9a83",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/glacial-grey.webp",
        "alt": "Glacial Grey laminate flooring swatch",
        "description": "Cool grey tones blended with soft timber accents create a sleek, refined aesthetic. Glacial Grey introduces an urban sophistication, ideal for interiors seeking a modern, polished edge.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/glacial-grey",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/glacial-grey.webp", "images/products/laminate/topdeck-pantora-lifestyle/glacial-grey-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/glacial-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-goleden-honey",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Golden Honey",
        "tone": "natural oak",
        "swatch": "#baa081",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/goleden-honey.webp",
        "alt": "Golden Honey laminate flooring swatch",
        "description": "Radiant golden tones infused with natural warmth bring vibrancy and life to interiors. Golden Honey creates a welcoming and uplifting atmosphere, adding richness and depth underfoot.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/goleden-honey",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/goleden-honey.webp", "images/products/laminate/topdeck-pantora-lifestyle/goleden-honey-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/goleden-honey-gallery-3.webp"]
      },
      {
        "id": "topdeck-neutral-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Neutral Oak",
        "tone": "natural oak",
        "swatch": "#c4ae85",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/neutral-oak.webp",
        "alt": "Neutral Oak laminate flooring swatch",
        "description": "Warm neutral shades and gentle timber variation make Neutral Oak versatile and enduring. This balanced tone creates a timeless foundation that complements a wide range of interior palettes and styles.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/neutral-oak",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/neutral-oak.webp", "images/products/laminate/topdeck-pantora-lifestyle/neutral-oak-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/neutral-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-raw-blackbutt",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Raw Blackbutt",
        "tone": "warm brown",
        "swatch": "#b18860",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/raw-blackbutt.webp",
        "alt": "Raw Blackbutt laminate flooring swatch",
        "description": "Dynamic earthy browns with striking tonal variation capture the bold, dramatic character of Spotted Gum. Its natural movement and richness make it a standout statement in any interior.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/raw-blackbutt",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/raw-blackbutt.webp", "images/products/laminate/topdeck-pantora-lifestyle/raw-blackbutt-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/raw-blackbutt-gallery-3.webp"]
      },
      {
        "id": "topdeck-pantora-laminate-soft-pale",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Soft Pale",
        "tone": "natural oak",
        "swatch": "#d2b191",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/pantora-laminate-soft-pale.webp",
        "alt": "Soft Pale laminate flooring swatch",
        "description": "Gentle beige hues paired with subtle oak grain give Soft Pale a natural, understated beauty. Its calm tones provide a soothing backdrop, perfect for contemporary spaces that embrace simplicity.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/pantora-laminate-soft-pale",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/pantora-laminate-soft-pale.webp", "images/products/laminate/topdeck-pantora-lifestyle/pantora-laminate-soft-pale-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/pantora-laminate-soft-pale-gallery-3.webp"]
      },
      {
        "id": "topdeck-spotted-gum-2",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#986b3e",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/spotted-gum-2.webp",
        "alt": "Spotted Gum laminate flooring swatch",
        "description": "Dynamic earthy browns with striking tonal variation capture the bold, dramatic character of Spotted Gum. Its natural movement and richness make it a standout statement in any interior.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/spotted-gum-2",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/spotted-gum-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/spotted-gum-2-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/spotted-gum-2-gallery-3.webp"]
      },
      {
        "id": "topdeck-tan-brown",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "Tan Brown",
        "tone": "warm brown",
        "swatch": "#85623b",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/tan-brown.webp",
        "alt": "Tan Brown laminate flooring swatch",
        "description": "Deep tan shades enriched with warm undertones create a grounded, sophisticated look. Tan Brown offers natural depth and strength, providing a refined foundation for elegant, enduring interiors.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/tan-brown",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/tan-brown.webp", "images/products/laminate/topdeck-pantora-lifestyle/tan-brown-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/tan-brown-gallery-3.webp"]
      },
      {
        "id": "topdeck-white-cove",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Pantora Lifestyle Collection",
        "colour": "White Cove",
        "tone": "natural oak",
        "swatch": "#d6c2a5",
        "thickness": "8mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-pantora-lifestyle/white-cove.webp",
        "alt": "White Cove laminate flooring swatch",
        "description": "Soft white tones with delicate grain detailing create a light and refreshing aesthetic. White Cove brightens interiors effortlessly, adding a sense of space and modern elegance that feels timeless.",
        "features": ["Budget-conscious 8mm laminate collection with 4D embossed-in-register surface texture.", "Timber-look plank visuals aimed at practical family and rental upgrades.", "Licensed click system for straightforward floating-floor installation.", "Designed as an accessible laminate option without losing natural-looking detail."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/white-cove",
        "galleryImages": ["images/products/laminate/topdeck-pantora-lifestyle/white-cove.webp", "images/products/laminate/topdeck-pantora-lifestyle/white-cove-gallery-2.webp", "images/products/laminate/topdeck-pantora-lifestyle/white-cove-gallery-3.webp"]
      },
      {
        "id": "topdeck-deluxe-birch-wood",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Birch Wood",
        "tone": "light beige",
        "swatch": "#d2cdc5",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-birch-wood.webp",
        "alt": "Birch Wood laminate flooring swatch",
        "description": "Soft and airy, Birch Wood brings a sense of calm and purity into your space. Its pale tones reflect light beautifully, creating an open, refreshing atmosphere.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-birch-wood",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-birch-wood.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-birch-wood-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-dark-wood",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Dark Wood",
        "tone": "dark brown",
        "swatch": "#3e332e",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-dark-wood.webp",
        "alt": "Dark Wood laminate flooring swatch",
        "description": "Rich and dramatic, Dark Wood lends interiors a sense of sophistication and grounding. Its deep tones create intimacy, warmth, and undeniable character.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-dark-wood",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-dark-wood.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-dark-wood-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-drift-wood",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Drift Wood",
        "tone": "soft grey",
        "swatch": "#66645c",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-drift-wood.webp",
        "alt": "Drift Wood laminate flooring swatch",
        "description": "With its weathered grey hues, Drift Wood captures the spirit of coastal charm and rustic elegance. It evokes the beauty of aged timber shaped by time and tide.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-drift-wood",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-drift-wood.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-drift-wood-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-harvest-ridge-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Harvest Ridge Oak",
        "tone": "warm brown",
        "swatch": "#7b6150",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-harvest-ridge-oak.webp",
        "alt": "Harvest Ridge Oak laminate flooring swatch",
        "description": "Golden-brown with hints of warmth, Harvest Ridge Oak radiates richness and vitality. Its inviting tones bring life, depth, and a welcoming spirit to every room.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-harvest-ridge-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-harvest-ridge-oak.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-harvest-ridge-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-limed-grey-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Limed Grey Oak",
        "tone": "light grey",
        "swatch": "#b2ada6",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-limed-grey-oak.webp",
        "alt": "Limed Grey Oak laminate flooring swatch",
        "description": "With its soft, silvery finish, Limed Grey Oak feels both modern and soothing. It captures a perfect harmony between rustic elegance and contemporary grace.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-limed-grey-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-limed-grey-oak.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-limed-grey-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-southern-brown-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Southern Brown Oak",
        "tone": "warm brown",
        "swatch": "#73655c",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-southern-brown-oak.webp",
        "alt": "Southern Brown Oak laminate flooring swatch",
        "description": "Warm and earthy, Southern Brown Oak carries the charm of heritage and tradition. Its deep oak tones invite comfort while exuding quiet strength.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-southern-brown-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-southern-brown-oak.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-southern-brown-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-stone-wash",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "Stone Wash",
        "tone": "light grey",
        "swatch": "#a59e98",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-stone-wash.webp",
        "alt": "Stone Wash laminate flooring swatch",
        "description": "Stone Wash blends cool greys with natural grain for a look that is both sleek and timeless. It brings a grounded, contemporary calm to any setting.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-stone-wash",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-stone-wash.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-stone-wash-gallery-2.webp"]
      },
      {
        "id": "topdeck-deluxe-white-wash",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Deluxe Edition",
        "colour": "White Wash",
        "tone": "light grey",
        "swatch": "#afb0ad",
        "thickness": "8.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-deluxe/deluxe-white-wash.webp",
        "alt": "White Wash laminate flooring swatch",
        "description": "Crisp and modern, White Wash exudes an effortless brightness that uplifts any room. Its subtle texture balances minimalism with a touch of rustic authenticity.",
        "features": ["Entry Prime laminate range with V-groove styling for a more refined board definition.", "8.3mm plank designed for accessible everyday renovations.", "Floating-floor click system for straightforward installation.", "Timber-look laminate positioned for affordable but polished interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Budget renovations"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/deluxe-white-wash",
        "galleryImages": ["images/products/laminate/topdeck-prime-deluxe/deluxe-white-wash.webp", "images/products/laminate/topdeck-prime-deluxe/deluxe-white-wash-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-aspen-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Aspen Oak",
        "tone": "light oak",
        "swatch": "#bbaf8e",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-aspen-oak.webp",
        "alt": "Aspen Oak laminate flooring swatch",
        "description": "A warm, sandy oak shade with subtle golden notes for a classic finish.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-aspen-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-aspen-oak.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-aspen-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-french-beige-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "French Beige Oak",
        "tone": "warm brown",
        "swatch": "#85725b",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-french-beige-oak.webp",
        "alt": "French Beige Oak laminate flooring swatch",
        "description": "A muted beige-brown with a touch of warmth, balanced and versatile.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-french-beige-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-french-beige-oak.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-french-beige-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-hampton-white-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Hampton White Oak",
        "tone": "pale oak",
        "swatch": "#d8cfba",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-hampton-white-oak.webp",
        "alt": "Hampton White Oak laminate flooring swatch",
        "description": "A pale, creamy oak tone with a gentle warmth, ideal for bright spaces.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-hampton-white-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-hampton-white-oak.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-hampton-white-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-kensington-grey",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Kensington Grey",
        "tone": "mid oak",
        "swatch": "#aca891",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-kensington-grey.webp",
        "alt": "Kensington Grey laminate flooring swatch",
        "description": "A cool-toned grey oak with light grain textures for a modern edge.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-kensington-grey",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-kensington-grey.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-kensington-grey-gallery-2.webp"]
      },
      {
        "id": "topdeck-lime-wash",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Lime Wash",
        "tone": "warm brown",
        "swatch": "#988a73",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/lime-wash.webp",
        "alt": "Lime Wash laminate flooring swatch",
        "description": "A soft grey-beige wash with a subtle weathered effect, giving a clean and airy look.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lime-wash",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/lime-wash.webp", "images/products/laminate/topdeck-prime-contemporary-plus/lime-wash-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-misty-mountain-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Misty Mountain Oak",
        "tone": "soft grey",
        "swatch": "#5f5c53",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-misty-mountain-oak.webp",
        "alt": "Misty Mountain Oak laminate flooring swatch",
        "description": "A deep grey oak with smoky undertones, rustic yet refined.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-misty-mountain-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-misty-mountain-oak.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-misty-mountain-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-misty-mountain-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-cp-new-england-blackbutt",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "New England Blackbutt",
        "tone": "warm brown",
        "swatch": "#8e6e43",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-new-england-blackbutt.webp",
        "alt": "New England Blackbutt laminate flooring swatch",
        "description": "A honey-golden oak with warm undertones and natural grain variation.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-new-england-blackbutt",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-new-england-blackbutt.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-new-england-blackbutt-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-odyssey-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Odyssey Oak",
        "tone": "charcoal",
        "swatch": "#2d2827",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-odyssey-oak.webp",
        "alt": "Odyssey Oak laminate flooring swatch",
        "description": "A dark oak with subtle cool undertones, bold and dramatic.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-odyssey-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-odyssey-oak.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-odyssey-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-qld-spotted-gum",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Queensland Spotted Gum",
        "tone": "warm brown",
        "swatch": "#7b694e",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-qld-spotted-gum.webp",
        "alt": "Queensland Spotted Gum laminate flooring swatch",
        "description": "A rich multi-tonal timber look with striking contrasts of brown and charcoal.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-qld-spotted-gum",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-qld-spotted-gum.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-qld-spotted-gum-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-soft-cavalry-grey",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Soft Cavalry Grey",
        "tone": "warm brown",
        "swatch": "#73573e",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-soft-cavalry-grey.webp",
        "alt": "Soft Cavalry Grey laminate flooring swatch",
        "description": "A muted mid-brown with a faint grey overlay, understated yet warm.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-soft-cavalry-grey",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-soft-cavalry-grey.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-soft-cavalry-grey-gallery-2.webp"]
      },
      {
        "id": "topdeck-cp-verona-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Contemporary Plus Edition",
        "colour": "Verona Oak",
        "tone": "warm brown",
        "swatch": "#95856c",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-contemporary-plus/cp-verona-oak.webp",
        "alt": "Verona Oak laminate flooring swatch",
        "description": "A light natural oak with a soft golden undertone, offering a timeless neutral.",
        "features": ["12.3mm laminate designed for more solid underfoot feel and ultra-realistic printed textures.", "Floating-floor licensed click installation.", "Modern timber-look palette aimed at practical contemporary homes.", "Suitable where buyers want a thicker laminate without stepping into timber pricing."],
        "suitableFor": ["Living areas", "Bedrooms", "Apartments", "Family homes", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cp-verona-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-contemporary-plus/cp-verona-oak.webp", "images/products/laminate/topdeck-prime-contemporary-plus/cp-verona-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-grey-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Grey Oak",
        "tone": "soft grey",
        "swatch": "#867d76",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-grey-oak.webp",
        "alt": "Grey Oak laminate flooring swatch",
        "description": "Grey Oak balances rustic character with modern flair. Its versatile tone evokes calm serenity, adding depth and understated elegance to any space.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-grey-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-grey-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-grey-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-latte-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Latte Oak",
        "tone": "natural oak",
        "swatch": "#ddb58f",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-latte-oak.webp",
        "alt": "Latte Oak laminate flooring swatch",
        "description": "Warm and golden, Latte Oak exudes comfort and coziness. Its soft caramel tones bring a welcoming glow that makes every space feel at home.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-latte-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-latte-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-latte-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-lunar-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Lunar Oak",
        "tone": "natural oak",
        "swatch": "#c5b8af",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-lunar-oak.webp",
        "alt": "Lunar Oak laminate flooring swatch",
        "description": "Pale and ethereal, Lunar Oak captures the tranquility of moonlight on wood. Its soft whitewashed finish adds a touch of airy elegance and modern simplicity.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-lunar-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-lunar-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-lunar-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-natural-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Natural Oak",
        "tone": "warm brown",
        "swatch": "#a18769",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-natural-oak.webp",
        "alt": "Natural Oak laminate flooring swatch",
        "description": "Pure and timeless, Natural Oak highlights the true beauty of wood in its most authentic form. Its golden-brown tones radiate warmth, balance, and organic charm.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-natural-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-natural-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-natural-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-new-england-blackbutt",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "New England Blackbutt",
        "tone": "warm brown",
        "swatch": "#a07748",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-new-england-blackbutt.webp",
        "alt": "New England Blackbutt laminate flooring swatch",
        "description": "Bright and lively, New England Blackbutt shines with golden warmth. Its fresh, sunlit tones evoke vitality and optimism, uplifting any interior with natural radiance.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-new-england-blackbutt",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-new-england-blackbutt.webp", "images/products/laminate/topdeck-prime-luxury/luxury-new-england-blackbutt-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-qld-spotted-gum",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Queensland Spotted Gum",
        "tone": "warm brown",
        "swatch": "#9e7555",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-qld-spotted-gum.webp",
        "alt": "Queensland Spotted Gum laminate flooring swatch",
        "description": "Distinctive and vibrant, Queensland Spotted Gum showcases bold grain patterns with a rich blend of tones. It brings energy and character, turning the floor into a feature of natural artistry.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-qld-spotted-gum",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-qld-spotted-gum.webp", "images/products/laminate/topdeck-prime-luxury/luxury-qld-spotted-gum-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-smoke-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Smoke Oak",
        "tone": "dark brown",
        "swatch": "#503e34",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-smoke-oak.webp",
        "alt": "Smoke Oak laminate flooring swatch",
        "description": "Bold and dramatic, Smoke Oak wraps interiors in moody sophistication. Its dark, smoky hues exude luxury while creating a sense of cozy intimacy.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-smoke-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-smoke-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-smoke-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-stone-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Stone Oak",
        "tone": "soft grey",
        "swatch": "#676666",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-stone-oak.webp",
        "alt": "Stone Oak laminate flooring swatch",
        "description": "Cool and sleek, Stone Oak embodies modern minimalism with natural charm. Its subtle grey grain offers a calm, contemporary backdrop with refined character.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-stone-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-stone-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-stone-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-tobacco-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Tobacco Oak",
        "tone": "warm brown",
        "swatch": "#906746",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-tobacco-oak.webp",
        "alt": "Tobacco Oak laminate flooring swatch",
        "description": "Rich and smoky, Tobacco Oak radiates a deep, timeless elegance. Its earthy brown tones bring a sense of tradition, grounding any interior with sophistication.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-tobacco-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-tobacco-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-tobacco-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-luxury-vanilla-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Luxury Edition",
        "colour": "Vanilla Oak",
        "tone": "natural oak",
        "swatch": "#d3aa7f",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-luxury/luxury-vanilla-oak.webp",
        "alt": "Vanilla Oak laminate flooring swatch",
        "description": "Light and creamy, Vanilla Oak fills a space with warmth and softness. Its gentle tones create an inviting atmosphere that feels fresh, bright, and comforting.",
        "features": ["Wide-board 12.3mm laminate aimed at more expansive timber-look layouts.", "Supplier-backed AC4 scratch resistance claim for tougher day-to-day use.", "Floating-floor licensed click installation.", "Designed to create a larger-format, more luxurious visual effect in living spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Family homes", "Premium renovations", "Large-format interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/luxury-vanilla-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-luxury/luxury-vanilla-oak.webp", "images/products/laminate/topdeck-prime-luxury/luxury-vanilla-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-legend-atlantic-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Atlantic Oak",
        "tone": "natural oak",
        "swatch": "#c4b59f",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-atlantic-oak.webp",
        "alt": "Atlantic Oak laminate flooring swatch",
        "description": "Soft and weathered, Atlantic Oak brings a breezy coastal feel with its sun-washed tones. It evokes relaxation and serenity, perfect for creating a light, airy home.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-atlantic-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-atlantic-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-atlantic-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-atlantic-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-blackbutt",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Blackbutt",
        "tone": "warm brown",
        "swatch": "#af8c65",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-blackbutt.webp",
        "alt": "Blackbutt laminate flooring swatch",
        "description": "Blackbutt\u2019s golden hues evoke warmth and vitality, glowing with natural radiance. Its smooth finish balances strength with inviting charm, making spaces feel alive.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-blackbutt",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-blackbutt.webp", "images/products/laminate/topdeck-prime-legend/legend-blackbutt-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-blackbutt-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-empire-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Empire Oak",
        "tone": "warm brown",
        "swatch": "#a28969",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-empire-oak.webp",
        "alt": "Empire Oak laminate flooring swatch",
        "description": "Empire Oak stands timeless and steady, with classic brown undertones that radiate strength. It brings a sense of heritage and confidence to any space.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-empire-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-empire-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-empire-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-empire-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-ghost-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Ghost Oak",
        "tone": "soft grey",
        "swatch": "#514c48",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-ghost-oak.webp",
        "alt": "Ghost Oak laminate flooring swatch",
        "description": "Mysterious and modern, Ghost Oak carries a smoky elegance with its dark, weathered grey. It evokes bold sophistication, perfect for striking contemporary interiors.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-ghost-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-ghost-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-ghost-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-ghost-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-hudson-grey",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Hudson Grey",
        "tone": "light grey",
        "swatch": "#a49e93",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-hudson-grey.webp",
        "alt": "Hudson Grey laminate flooring swatch",
        "description": "Hudson Grey blends modern sophistication with rustic character. Its cool grey tones ground a space with calm while offering a sleek, contemporary edge.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-hudson-grey",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-hudson-grey.webp", "images/products/laminate/topdeck-prime-legend/legend-hudson-grey-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-hudson-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-mainland-brown-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Mainland Brown Oak",
        "tone": "warm brown",
        "swatch": "#5d5148",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-mainland-brown-oak.webp",
        "alt": "Mainland Brown Oak laminate flooring swatch",
        "description": "Deep and earthy, Mainland Brown Oak anchors a room with grounding richness. Its dark chocolate tones add drama, warmth, and timeless depth.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-mainland-brown-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-mainland-brown-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-mainland-brown-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-mainland-brown-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-sandcastle-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Sandcastle Oak",
        "tone": "warm brown",
        "swatch": "#a68d69",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-sandcastle-oak.webp",
        "alt": "Sandcastle Oak laminate flooring swatch",
        "description": "Golden and inviting, Sandcastle Oak captures the essence of sunlit shores. Its honeyed tones create warmth and happiness, infusing rooms with a welcoming glow.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-sandcastle-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-sandcastle-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-sandcastle-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-sandcastle-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-southport-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Southport Oak",
        "tone": "natural oak",
        "swatch": "#ac9984",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-southport-oak.webp",
        "alt": "Southport Oak laminate flooring swatch",
        "description": "Rustic and relaxed, Southport Oak carries the beauty of driftwood softened by time. Its textured look adds depth and authenticity, evoking comfort and casual elegance.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-southport-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-southport-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-southport-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-southport-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-spotted-gum",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#9b774c",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-spotted-gum.webp",
        "alt": "Spotted Gum laminate flooring swatch",
        "description": "Rich and dynamic, Spotted Gum celebrates the beauty of natural variation. Its bold character adds energy and vibrance, creating interiors alive with texture and warmth.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-spotted-gum",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-spotted-gum.webp", "images/products/laminate/topdeck-prime-legend/legend-spotted-gum-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-spotted-gum-gallery-3.webp"]
      },
      {
        "id": "topdeck-legend-wheaton-oak",
        "category": "laminate",
        "brand": "Topdeck Flooring",
        "range": "Prime Legend Collection",
        "colour": "Wheaton Oak",
        "tone": "natural oak",
        "swatch": "#baa58b",
        "thickness": "12.3mm",
        "productType": "Laminate",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/laminate/topdeck-prime-legend/legend-wheaton-oak.webp",
        "alt": "Wheaton Oak laminate flooring swatch",
        "description": "Warm and gentle, Wheaton Oak radiates natural charm with its golden-beige hue. Its subtle grain adds understated elegance, wrapping interiors in comfort and ease.",
        "features": ["Aquashield waterproof laminate positioned for busier households.", "AC5-rated wear resistance for high-use areas according to the supplier.", "Negative Ion Technology claim from Topdeck for a more wellness-focused range position.", "Large-format 12.3mm boards with floating-floor click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Busy family homes", "Apartments", "Rental properties"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/legend-wheaton-oak",
        "galleryImages": ["images/products/laminate/topdeck-prime-legend/legend-wheaton-oak.webp", "images/products/laminate/topdeck-prime-legend/legend-wheaton-oak-gallery-2.webp", "images/products/laminate/topdeck-prime-legend/legend-wheaton-oak-gallery-3.webp"]
      },
      {
              "id": "eco-eco-villeroy-boch-heritage-blue-leaf",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Heritage Laminate",
              "rangeId": "laminate-eco-villeroy-boch-heritage",
              "rangeLabel": "Villeroy & Boch Heritage Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-heritage-blue-leaf",
              "customerLabel": "Villeroy & Boch Heritage Laminate",
              "colour": "Blue Leaf",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-heritage/blue-leaf.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-heritage/blue-leaf.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-heritage/blue-leaf.webp"
              ],
              "alt": "Blue Leaf Villeroy & Boch Heritage Laminate flooring sample",
              "description": "Blue Leaf is a laminate flooring colour from the Villeroy & Boch Heritage Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber and stone-look designs",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-blue-leaf/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Villeroy & Boch Heritage Laminate is a design-focused laminate range from Eco Flooring Systems.",
                              "Operon quotes this range at product-family level first, then confirms the final colour before installation."
                      ],
                      "featuresIntro": "Heritage range highlights",
                      "features": [
                              "Laminate product family selection",
                              "Decorative timber and stone-look options",
                              "Floating floor installation",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Villeroy & Boch Heritage Laminate"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-villeroy-boch-heritage-travertin-hickory",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Heritage Laminate",
              "rangeId": "laminate-eco-villeroy-boch-heritage",
              "rangeLabel": "Villeroy & Boch Heritage Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-heritage-blue-leaf",
              "customerLabel": "Villeroy & Boch Heritage Laminate",
              "colour": "Travertin Hickory",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-heritage/travertin-hickory.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-heritage/travertin-hickory.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-heritage/travertin-hickory.webp"
              ],
              "alt": "Travertin Hickory Villeroy & Boch Heritage Laminate flooring sample",
              "description": "Travertin Hickory is a laminate flooring colour from the Villeroy & Boch Heritage Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber and stone-look designs",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-travertin-hickory/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-heritage-travertin-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Heritage Laminate",
              "rangeId": "laminate-eco-villeroy-boch-heritage",
              "rangeLabel": "Villeroy & Boch Heritage Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-heritage-blue-leaf",
              "customerLabel": "Villeroy & Boch Heritage Laminate",
              "colour": "Travertin Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-heritage/travertin-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-heritage/travertin-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-heritage/travertin-oak.webp"
              ],
              "alt": "Travertin Oak Villeroy & Boch Heritage Laminate flooring sample",
              "description": "Travertin Oak is a laminate flooring colour from the Villeroy & Boch Heritage Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber and stone-look designs",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-travertin-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-country-castle-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Country Laminate",
              "rangeId": "laminate-eco-villeroy-boch-country",
              "rangeLabel": "Villeroy & Boch Country Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-country-castle-oak",
              "customerLabel": "Villeroy & Boch Country Laminate",
              "colour": "Castle Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-country/castle-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-country/castle-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-country/castle-oak.webp"
              ],
              "alt": "Castle Oak Villeroy & Boch Country Laminate flooring sample",
              "description": "Castle Oak is a laminate flooring colour from the Villeroy & Boch Country Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Warm timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-castle-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Villeroy & Boch Country Laminate is a warm timber-look laminate range for classic interior flooring selections.",
                              "The range is selected first to keep quoting simple, with final colour confirmed before work starts."
                      ],
                      "featuresIntro": "Country range highlights",
                      "features": [
                              "Laminate product family selection",
                              "Warm timber-look options",
                              "Floating floor installation",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Villeroy & Boch Country Laminate"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-villeroy-boch-country-meadow-teak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Country Laminate",
              "rangeId": "laminate-eco-villeroy-boch-country",
              "rangeLabel": "Villeroy & Boch Country Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-country-castle-oak",
              "customerLabel": "Villeroy & Boch Country Laminate",
              "colour": "Meadow Teak",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-country/meadow-teak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-country/meadow-teak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-country/meadow-teak.webp"
              ],
              "alt": "Meadow Teak Villeroy & Boch Country Laminate flooring sample",
              "description": "Meadow Teak is a laminate flooring colour from the Villeroy & Boch Country Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Warm timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-meadow-teak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-country-valley-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Country Laminate",
              "rangeId": "laminate-eco-villeroy-boch-country",
              "rangeLabel": "Villeroy & Boch Country Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-country-castle-oak",
              "customerLabel": "Villeroy & Boch Country Laminate",
              "colour": "Valley Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-country/valley-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-country/valley-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-country/valley-oak.webp"
              ],
              "alt": "Valley Oak Villeroy & Boch Country Laminate flooring sample",
              "description": "Valley Oak is a laminate flooring colour from the Villeroy & Boch Country Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Warm timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-valley-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-cosmopolitan-baltimore-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Cosmopolitan Laminate",
              "rangeId": "laminate-eco-villeroy-boch-cosmopolitan",
              "rangeLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-cosmopolitan-baltimore-oak",
              "customerLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "colour": "Baltimore Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-cosmopolitan/baltimore-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-cosmopolitan/baltimore-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-cosmopolitan/baltimore-oak.webp"
              ],
              "alt": "Baltimore Oak Villeroy & Boch Cosmopolitan Laminate flooring sample",
              "description": "Baltimore Oak is a laminate flooring colour from the Villeroy & Boch Cosmopolitan Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Modern design palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-baltimore-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Villeroy & Boch Cosmopolitan Laminate is a modern laminate range with contemporary timber and design-led finishes.",
                              "Customers choose the product family for the estimate and confirm final colour before installation."
                      ],
                      "featuresIntro": "Cosmopolitan range highlights",
                      "features": [
                              "Laminate product family selection",
                              "Modern design palette",
                              "Floating floor installation",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Villeroy & Boch Cosmopolitan Laminate"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-villeroy-boch-cosmopolitan-dublin-walnut",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Cosmopolitan Laminate",
              "rangeId": "laminate-eco-villeroy-boch-cosmopolitan",
              "rangeLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-cosmopolitan-baltimore-oak",
              "customerLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "colour": "Dublin Walnut",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-cosmopolitan/dublin-walnut.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-cosmopolitan/dublin-walnut.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-cosmopolitan/dublin-walnut.webp"
              ],
              "alt": "Dublin Walnut Villeroy & Boch Cosmopolitan Laminate flooring sample",
              "description": "Dublin Walnut is a laminate flooring colour from the Villeroy & Boch Cosmopolitan Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Modern design palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-dublin-walnut/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-cosmopolitan-pure-elm",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Cosmopolitan Laminate",
              "rangeId": "laminate-eco-villeroy-boch-cosmopolitan",
              "rangeLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-cosmopolitan-baltimore-oak",
              "customerLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "colour": "Pure Elm",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-cosmopolitan/pure-elm.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-cosmopolitan/pure-elm.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-cosmopolitan/pure-elm.webp"
              ],
              "alt": "Pure Elm Villeroy & Boch Cosmopolitan Laminate flooring sample",
              "description": "Pure Elm is a laminate flooring colour from the Villeroy & Boch Cosmopolitan Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Modern design palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-pure-elm/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-cosmopolitan-royal-teak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Cosmopolitan Laminate",
              "rangeId": "laminate-eco-villeroy-boch-cosmopolitan",
              "rangeLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-cosmopolitan-baltimore-oak",
              "customerLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "colour": "Royal Teak",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-cosmopolitan/royal-teak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-cosmopolitan/royal-teak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-cosmopolitan/royal-teak.webp"
              ],
              "alt": "Royal Teak Villeroy & Boch Cosmopolitan Laminate flooring sample",
              "description": "Royal Teak is a laminate flooring colour from the Villeroy & Boch Cosmopolitan Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Modern design palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-royal-teak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-cosmopolitan-wellness-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Cosmopolitan Laminate",
              "rangeId": "laminate-eco-villeroy-boch-cosmopolitan",
              "rangeLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-cosmopolitan-baltimore-oak",
              "customerLabel": "Villeroy & Boch Cosmopolitan Laminate",
              "colour": "Wellness Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-cosmopolitan/wellness-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-cosmopolitan/wellness-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-cosmopolitan/wellness-oak.webp"
              ],
              "alt": "Wellness Oak Villeroy & Boch Cosmopolitan Laminate flooring sample",
              "description": "Wellness Oak is a laminate flooring colour from the Villeroy & Boch Cosmopolitan Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Modern design palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-wellness-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-contemporary-brixton-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Contemporary Laminate",
              "rangeId": "laminate-eco-villeroy-boch-contemporary",
              "rangeLabel": "Villeroy & Boch Contemporary Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-contemporary-brixton-oak",
              "customerLabel": "Villeroy & Boch Contemporary Laminate",
              "colour": "Brixton Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-contemporary/brixton-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-contemporary/brixton-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-contemporary/brixton-oak.webp"
              ],
              "alt": "Brixton Oak Villeroy & Boch Contemporary Laminate flooring sample",
              "description": "Brixton Oak is a laminate flooring colour from the Villeroy & Boch Contemporary Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Contemporary oak-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-brixton-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Villeroy & Boch Contemporary Laminate is a clean modern laminate range for simple, design-led flooring selections.",
                              "Operon keeps quoting at range level so customers are not forced to decide every colour before getting started."
                      ],
                      "featuresIntro": "Contemporary range highlights",
                      "features": [
                              "Laminate product family selection",
                              "Contemporary oak-look options",
                              "Floating floor installation",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Villeroy & Boch Contemporary Laminate"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-villeroy-boch-contemporary-current-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Contemporary Laminate",
              "rangeId": "laminate-eco-villeroy-boch-contemporary",
              "rangeLabel": "Villeroy & Boch Contemporary Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-contemporary-brixton-oak",
              "customerLabel": "Villeroy & Boch Contemporary Laminate",
              "colour": "Current Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-contemporary/current-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-contemporary/current-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-contemporary/current-oak.webp"
              ],
              "alt": "Current Oak Villeroy & Boch Contemporary Laminate flooring sample",
              "description": "Current Oak is a laminate flooring colour from the Villeroy & Boch Contemporary Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Contemporary oak-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-current-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-contemporary-london-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Contemporary Laminate",
              "rangeId": "laminate-eco-villeroy-boch-contemporary",
              "rangeLabel": "Villeroy & Boch Contemporary Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-contemporary-brixton-oak",
              "customerLabel": "Villeroy & Boch Contemporary Laminate",
              "colour": "London Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-contemporary/london-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-contemporary/london-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-contemporary/london-oak.webp"
              ],
              "alt": "London Oak Villeroy & Boch Contemporary Laminate flooring sample",
              "description": "London Oak is a laminate flooring colour from the Villeroy & Boch Contemporary Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Contemporary oak-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-london-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-villeroy-boch-contemporary-pearl-oak",
              "category": "laminate",
              "brand": "Villeroy & Boch",
              "range": "Villeroy & Boch Contemporary Laminate",
              "rangeId": "laminate-eco-villeroy-boch-contemporary",
              "rangeLabel": "Villeroy & Boch Contemporary Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-villeroy-boch-contemporary-brixton-oak",
              "customerLabel": "Villeroy & Boch Contemporary Laminate",
              "colour": "Pearl Oak",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-villeroy-boch-contemporary/pearl-oak.webp",
              "imageUrl": "images/products/laminate/eco-villeroy-boch-contemporary/pearl-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-villeroy-boch-contemporary/pearl-oak.webp"
              ],
              "alt": "Pearl Oak Villeroy & Boch Contemporary Laminate flooring sample",
              "description": "Pearl Oak is a laminate flooring colour from the Villeroy & Boch Contemporary Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Contemporary oak-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/villeroy-boch-pearl-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Blackbutt- Aqua",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/blackbutt-aqua.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/blackbutt-aqua.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/blackbutt-aqua.webp"
              ],
              "alt": "Blackbutt- Aqua Swish Laminate Aqua flooring sample",
              "description": "Blackbutt- Aqua is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/blackbutt-aqua/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Swish Laminate Aqua is an Eco Flooring laminate range designed for customers who want practical timber-look flooring with improved everyday resilience.",
                              "The product range is selected first, then colour is confirmed later if needed."
                      ],
                      "featuresIntro": "Swish Laminate Aqua highlights",
                      "features": [
                              "Water-resistant laminate product family",
                              "Wide timber-look colour palette",
                              "Floating floor installation",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Swish Laminate Aqua"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-swish-laminate-aqua-fendi-oak",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Fendi Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/fendi-oak.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/fendi-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/fendi-oak.webp"
              ],
              "alt": "Fendi Oak Swish Laminate Aqua flooring sample",
              "description": "Fendi Oak is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/fendi-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-hawaii-oak",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Hawaii Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/hawaii-oak.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/hawaii-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/hawaii-oak.webp"
              ],
              "alt": "Hawaii Oak Swish Laminate Aqua flooring sample",
              "description": "Hawaii Oak is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/hawaii-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-madrid-oak",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Madrid Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/madrid-oak.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/madrid-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/madrid-oak.webp"
              ],
              "alt": "Madrid Oak Swish Laminate Aqua flooring sample",
              "description": "Madrid Oak is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/madrid-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-manhattan-oak",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Manhattan Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/manhattan-oak.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/manhattan-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/manhattan-oak.webp"
              ],
              "alt": "Manhattan Oak Swish Laminate Aqua flooring sample",
              "description": "Manhattan Oak is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/manhattan-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-miami-oak",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Miami Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/miami-oak.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/miami-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/miami-oak.webp"
              ],
              "alt": "Miami Oak Swish Laminate Aqua flooring sample",
              "description": "Miami Oak is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/miami-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-montreal-oak",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Montreal Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/montreal-oak.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/montreal-oak.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/montreal-oak.webp"
              ],
              "alt": "Montreal Oak Swish Laminate Aqua flooring sample",
              "description": "Montreal Oak is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/montreal-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-nsw-spotted-gum",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "NSW Spotted Gum",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/nsw-spotted-gum.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/nsw-spotted-gum.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/nsw-spotted-gum.webp"
              ],
              "alt": "NSW Spotted Gum Swish Laminate Aqua flooring sample",
              "description": "NSW Spotted Gum is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/nsw-spotted-gum/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-oak-colonial",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Oak Colonial",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/oak-colonial.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/oak-colonial.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/oak-colonial.webp"
              ],
              "alt": "Oak Colonial Swish Laminate Aqua flooring sample",
              "description": "Oak Colonial is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-colonial/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-oak-fremont",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Oak Fremont",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/oak-fremont.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/oak-fremont.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/oak-fremont.webp"
              ],
              "alt": "Oak Fremont Swish Laminate Aqua flooring sample",
              "description": "Oak Fremont is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-fremont/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-oak-georgia",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Oak Georgia",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/oak-georgia.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/oak-georgia.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/oak-georgia.webp"
              ],
              "alt": "Oak Georgia Swish Laminate Aqua flooring sample",
              "description": "Oak Georgia is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-georgia/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-oak-nashville",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Oak Nashville",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/oak-nashville.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/oak-nashville.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/oak-nashville.webp"
              ],
              "alt": "Oak Nashville Swish Laminate Aqua flooring sample",
              "description": "Oak Nashville is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-nashville/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-oak-ostana",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Oak Ostana",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/oak-ostana.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/oak-ostana.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/oak-ostana.webp"
              ],
              "alt": "Oak Ostana Swish Laminate Aqua flooring sample",
              "description": "Oak Ostana is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-ostana/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-oak-vermont",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Oak Vermont",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/oak-vermont.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/oak-vermont.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/oak-vermont.webp"
              ],
              "alt": "Oak Vermont Swish Laminate Aqua flooring sample",
              "description": "Oak Vermont is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-vermont/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-qld-spotted-gum",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "QLD Spotted Gum",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/qld-spotted-gum.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/qld-spotted-gum.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/qld-spotted-gum.webp"
              ],
              "alt": "QLD Spotted Gum Swish Laminate Aqua flooring sample",
              "description": "QLD Spotted Gum is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/qld-spotted-gum/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-aqua-smooth-blackbutt",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate Aqua",
              "rangeId": "laminate-eco-swish-laminate-aqua",
              "rangeLabel": "Swish Laminate Aqua",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-aqua-blackbutt-aqua",
              "customerLabel": "Swish Laminate Aqua",
              "colour": "Smooth Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate-aqua/smooth-blackbutt.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate-aqua/smooth-blackbutt.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate-aqua/smooth-blackbutt.webp"
              ],
              "alt": "Smooth Blackbutt Swish Laminate Aqua flooring sample",
              "description": "Smooth Blackbutt is a laminate flooring colour from the Swish Laminate Aqua range.",
              "features": [
                      "Water-resistant laminate range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/smooth-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-blackbutt-light",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Blackbutt Light",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/blackbutt-light.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/blackbutt-light.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/blackbutt-light.webp"
              ],
              "alt": "Blackbutt Light Swish Laminate flooring sample",
              "description": "Blackbutt Light is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/blackbutt-light/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Swish Laminate is a practical Eco Flooring laminate range with timber-look colours for everyday residential flooring.",
                              "Operon treats the range as the customer selection and confirms the final colour before installation."
                      ],
                      "featuresIntro": "Swish Laminate highlights",
                      "features": [
                              "Laminate product family selection",
                              "Timber-look colour palette",
                              "Floating floor installation",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Swish Laminate"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-swish-laminate-eggshell",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Eggshell",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/eggshell.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/eggshell.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/eggshell.webp"
              ],
              "alt": "Eggshell Swish Laminate flooring sample",
              "description": "Eggshell is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/eggshell/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-fawn",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Fawn",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/fawn.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/fawn.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/fawn.webp"
              ],
              "alt": "Fawn Swish Laminate flooring sample",
              "description": "Fawn is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/fawn/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-floria",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Floria",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/floria.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/floria.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/floria.webp"
              ],
              "alt": "Floria Swish Laminate flooring sample",
              "description": "Floria is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/floria/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-jarrah",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Jarrah",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/jarrah.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/jarrah.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/jarrah.webp"
              ],
              "alt": "Jarrah Swish Laminate flooring sample",
              "description": "Jarrah is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/jarrah/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-linden",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Linden",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/linden.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/linden.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/linden.webp"
              ],
              "alt": "Linden Swish Laminate flooring sample",
              "description": "Linden is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/linden/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-magnolia",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Magnolia",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/magnolia.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/magnolia.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/magnolia.webp"
              ],
              "alt": "Magnolia Swish Laminate flooring sample",
              "description": "Magnolia is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/magnolia/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-new-england-blackbutt",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "New England Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/new-england-blackbutt.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/new-england-blackbutt.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/new-england-blackbutt.webp"
              ],
              "alt": "New England Blackbutt Swish Laminate flooring sample",
              "description": "New England Blackbutt is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/new-england-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-nutmeg",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Nutmeg",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/nutmeg.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/nutmeg.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/nutmeg.webp"
              ],
              "alt": "Nutmeg Swish Laminate flooring sample",
              "description": "Nutmeg is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-falaise/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-sydney-gum",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Sydney Gum",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/sydney-gum.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/sydney-gum.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/sydney-gum.webp"
              ],
              "alt": "Sydney Gum Swish Laminate flooring sample",
              "description": "Sydney Gum is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/sydney-gum/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-velvet",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Velvet",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/velvet.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/velvet.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/velvet.webp"
              ],
              "alt": "Velvet Swish Laminate flooring sample",
              "description": "Velvet is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/velvet/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-laminate-vivid",
              "category": "laminate",
              "brand": "Swish Laminate",
              "range": "Swish Laminate",
              "rangeId": "laminate-eco-swish-laminate",
              "rangeLabel": "Swish Laminate",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-swish-laminate-blackbutt-light",
              "customerLabel": "Swish Laminate",
              "colour": "Vivid",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "Laminate",
              "productType": "Laminate Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/laminate/eco-swish-laminate/vivid.webp",
              "imageUrl": "images/products/laminate/eco-swish-laminate/vivid.webp",
              "galleryImages": [
                      "images/products/laminate/eco-swish-laminate/vivid.webp"
              ],
              "alt": "Vivid Swish Laminate flooring sample",
              "description": "Vivid is a laminate flooring colour from the Swish Laminate range.",
              "features": [
                      "Laminate flooring range",
                      "Timber-look colour palette",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Bedrooms",
                      "Living areas",
                      "Study rooms",
                      "Dry internal renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/vivid/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      }
    ],
    hybrid: [
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-antique-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Antique Oak",
        tone: "natural oak",
        swatch: "#b99572",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-antique-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Antique Oak colour sample",
        description: "Antique Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-baden-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Baden Oak",
        tone: "light oak",
        swatch: "#cab08f",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-baden-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Baden Oak colour sample",
        description: "Baden Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Blackbutt",
        tone: "light oak",
        swatch: "#d0b289",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-blackbutt.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Blackbutt colour sample",
        description: "Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-brushbox",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Brushbox",
        tone: "walnut",
        swatch: "#9e7756",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-brushbox.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Brushbox colour sample",
        description: "Brushbox is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-caramel-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Caramel Oak",
        tone: "natural oak",
        swatch: "#b6865a",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-caramel-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Caramel Oak colour sample",
        description: "Caramel Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-dexter-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Dexter Oak",
        tone: "grey",
        swatch: "#a7a29a",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-dexter-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Dexter Oak colour sample",
        description: "Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-downtown-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Downtown Oak",
        tone: "grey",
        swatch: "#8c837b",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-downtown-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Downtown Oak colour sample",
        description: "Downtown Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Driftwood",
        tone: "grey",
        swatch: "#b0a599",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-driftwood.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Driftwood colour sample",
        description: "Driftwood is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-grey-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Grey Oak",
        tone: "grey",
        swatch: "#929290",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-grey-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Grey Oak colour sample",
        description: "Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-hatton-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Hatton Oak",
        tone: "natural oak",
        swatch: "#b2906e",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-hatton-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Hatton Oak colour sample",
        description: "Hatton Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-helena-oak",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Helena Oak",
        tone: "light oak",
        swatch: "#d4bc99",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-helena-oak.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Helena Oak colour sample",
        description: "Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-holly-hills",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Holly Hills",
        tone: "natural oak",
        swatch: "#c1a583",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-holly-hills.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Holly Hills colour sample",
        description: "Holly Hills is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-jarrah",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Jarrah",
        tone: "dark",
        swatch: "#744d39",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-jarrah.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Jarrah colour sample",
        description: "Jarrah is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-julan",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Julan",
        tone: "walnut",
        swatch: "#8d6549",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-julan.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Julan colour sample",
        description: "Julan is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-7mm-hybrid-lake-oak-light",
        category: "hybrid",
        brand: "ETF Hybrid 7.0mm",
        range: "ETF 7.0mm Hybrid Waterproof Flooring",
        colour: "Lake Oak Light",
        tone: "light oak",
        swatch: "#d7c4a7",
        thickness: "7.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-7mm-lake-oak-light.jpg",
        alt: "HRT ETF 7.0mm Hybrid Waterproof Flooring Lake Oak Light colour sample",
        description: "Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 7.0mm Hybrid Waterproof Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Pre-attached acoustic underlay", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/7-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-alaskan-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Alaskan Oak",
        tone: "light oak",
        swatch: "#c9b28e",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-alaskan-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Alaskan Oak colour sample",
        description: "Alaskan Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-american-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "American Oak",
        tone: "natural oak",
        swatch: "#c09a78",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-american-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring American Oak colour sample",
        description: "American Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-coastal-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Coastal Blackbutt",
        tone: "light oak",
        swatch: "#ccb089",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-coastal-blackbutt.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Coastal Blackbutt colour sample",
        description: "Coastal Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Driftwood",
        tone: "grey",
        swatch: "#b0a599",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-driftwood.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Driftwood colour sample",
        description: "Driftwood is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-french-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "French Oak",
        tone: "natural oak",
        swatch: "#b99976",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-french-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring French Oak colour sample",
        description: "French Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-grey-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Grey Oak",
        tone: "grey",
        swatch: "#929290",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-grey-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Grey Oak colour sample",
        description: "Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-helena-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Helena Oak",
        tone: "light oak",
        swatch: "#d4bc99",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-helena-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Helena Oak colour sample",
        description: "Helena Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-natural-oak",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#d3b48f",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-natural-oak.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Natural Oak colour sample",
        description: "Natural Oak is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-new-zealand-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "New Zealand Blackbutt",
        tone: "natural oak",
        swatch: "#ba9a73",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-new-zealand-blackbutt.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring New Zealand Blackbutt colour sample",
        description: "New Zealand Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-qld-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "QLD Spotted Gum",
        tone: "warm brown",
        swatch: "#9b7454",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-qld-spotted-gum.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring QLD Spotted Gum colour sample",
        description: "QLD Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-riverview",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Riverview",
        tone: "natural oak",
        swatch: "#b49b83",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-riverview.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Riverview colour sample",
        description: "Riverview is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-8mm-hybrid-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 8.0mm",
        range: "ETF 8.0mm Hybrid Flooring",
        colour: "Spotted Gum",
        tone: "warm brown",
        swatch: "#a57d5c",
        thickness: "8.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-8mm-spotted-gum.jpg",
        alt: "HRT ETF 8.0mm Hybrid Flooring Spotted Gum colour sample",
        description: "Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 8.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/8-0mm-etf-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-alaskan-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Alaskan Oak",
        tone: "light oak",
        swatch: "#c9b28e",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-alaskan-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Alaskan Oak colour sample",
        description: "Alaskan Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-american-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "American Oak",
        tone: "natural oak",
        swatch: "#c09a78",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-american-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring American Oak colour sample",
        description: "American Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-coastal-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Coastal Blackbutt",
        tone: "light oak",
        swatch: "#ccb089",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-coastal-blackbutt.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Coastal Blackbutt colour sample",
        description: "Coastal Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-dexter-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Dexter Oak",
        tone: "grey",
        swatch: "#a7a29a",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-dexter-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Dexter Oak colour sample",
        description: "Dexter Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Driftwood",
        tone: "grey",
        swatch: "#b0a599",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-driftwood.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Driftwood colour sample",
        description: "Driftwood is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-french-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "French Oak",
        tone: "natural oak",
        swatch: "#b99976",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-french-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring French Oak colour sample",
        description: "French Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-grey-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Grey Oak",
        tone: "grey",
        swatch: "#929290",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-grey-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Grey Oak colour sample",
        description: "Grey Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-lake-oak-light",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Lake Oak Light",
        tone: "light oak",
        swatch: "#d7c4a7",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-lake-oak-light.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Lake Oak Light colour sample",
        description: "Lake Oak Light is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-natural-oak",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Natural Oak",
        tone: "natural oak",
        swatch: "#d3b48f",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-natural-oak.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Natural Oak colour sample",
        description: "Natural Oak is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-new-driftwood",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "New Driftwood",
        tone: "grey",
        swatch: "#a9a096",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-new-driftwood.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring New Driftwood colour sample",
        description: "New Driftwood is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-new-zealand-blackbutt",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "New Zealand Blackbutt",
        tone: "natural oak",
        swatch: "#ba9a73",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-new-zealand-blackbutt.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring New Zealand Blackbutt colour sample",
        description: "New Zealand Blackbutt is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-oslo-oak-grey",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Oslo Oak Grey",
        tone: "grey",
        swatch: "#8f8d8b",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-oslo-oak-grey.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Oslo Oak Grey colour sample",
        description: "Oslo Oak Grey is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-qld-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "QLD Spotted Gum",
        tone: "warm brown",
        swatch: "#9b7454",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-qld-spotted-gum.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring QLD Spotted Gum colour sample",
        description: "QLD Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      // TODO: Enter actual sell price per m² for this product.
      {
        id: "hrt-etf-9mm-hybrid-spotted-gum",
        category: "hybrid",
        brand: "ETF Hybrid 9.0mm",
        range: "ETF 9.0mm Hybrid Flooring",
        colour: "Spotted Gum",
        tone: "warm brown",
        swatch: "#a57d5c",
        thickness: "9.0mm",
        productType: "SPC Hybrid",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/hrt-etf-9mm-spotted-gum.jpg",
        alt: "HRT ETF 9.0mm Hybrid Flooring Spotted Gum colour sample",
        description: "Spotted Gum is a timber-look hybrid flooring colour from the HRT ETF 9.0mm Hybrid Flooring range.",
        features: ["SPC hybrid core", "Waterproof core", "Scratch and stain resistant surface", "Floating click-lock installation"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "HRT Timber Flooring",
        supplierUrl: "https://hrttimberflooring.com.au/product-category/hybrid-flooring/9-0mm-hybrid-waterproof-flooring/"
      },
      {
        id: "eco-grande-9mm-bella",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Bella",
        tone: "light oak",
        swatch: "#c8b18e",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-bella.webp",
        alt: "Grande 9.0 Bella hybrid flooring swatch",
        description: "Bella is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/bella/"
      },
      {
        id: "eco-grande-9mm-capri",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Capri",
        tone: "light beige",
        swatch: "#d4c2aa",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-capri.webp",
        galleryImages: [
          "images/products/hybrid/eco-grande-9mm-capri.webp",
          "images/products/hybrid/eco-grande-9mm-capri-gallery-2.webp"
        ],
        alt: "Grande 9.0 Capri hybrid flooring swatch",
        description: "Capri is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/capri/"
      },
      {
        id: "eco-grande-9mm-chalk",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Chalk",
        tone: "pale oak",
        swatch: "#d7cbbc",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-chalk.webp",
        alt: "Grande 9.0 Chalk hybrid flooring swatch",
        description: "Chalk is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/chalk/"
      },
      {
        id: "eco-grande-9mm-ghost-gum",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Ghost Gum",
        tone: "soft grey",
        swatch: "#b6b0a8",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-ghost-gum.webp",
        galleryImages: [
          "images/products/hybrid/eco-grande-9mm-ghost-gum.webp",
          "images/products/hybrid/eco-grande-9mm-ghost-gum-gallery-2.webp"
        ],
        alt: "Grande 9.0 Ghost Gum hybrid flooring swatch",
        description: "Ghost Gum is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/ghost-gum/"
      },
      {
        id: "eco-grande-9mm-hawthorn",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Hawthorn",
        tone: "natural oak",
        swatch: "#b89a78",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-hawthorn.webp",
        alt: "Grande 9.0 Hawthorn hybrid flooring swatch",
        description: "Hawthorn is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/hawthorn/"
      },
      {
        id: "eco-grande-9mm-northen-spotted-gum",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Northen Spotted Gum",
        tone: "warm brown",
        swatch: "#9f7a57",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-northen-spotted-gum.webp",
        galleryImages: [
          "images/products/hybrid/eco-grande-9mm-northen-spotted-gum.webp",
          "images/products/hybrid/eco-grande-9mm-northen-spotted-gum-gallery-2.webp"
        ],
        alt: "Grande 9.0 Northen Spotted Gum hybrid flooring swatch",
        description: "Northen Spotted Gum is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/northen-spotted-gum/"
      },
      {
        id: "eco-grande-9mm-pacific-blackbutt",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Pacific Blackbutt",
        tone: "light oak",
        swatch: "#c5ad84",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-pacific-blackbutt.webp",
        alt: "Grande 9.0 Pacific Blackbutt hybrid flooring swatch",
        description: "Pacific Blackbutt is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/pacific-blackbutt/"
      },
      {
        id: "eco-grande-9mm-raven",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Raven",
        tone: "charcoal",
        swatch: "#635d58",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-raven.webp",
        galleryImages: [
          "images/products/hybrid/eco-grande-9mm-raven.webp",
          "images/products/hybrid/eco-grande-9mm-raven-gallery-2.webp"
        ],
        alt: "Grande 9.0 Raven hybrid flooring swatch",
        description: "Raven is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/raven/"
      },
      {
        id: "eco-grande-9mm-sand",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Sand",
        tone: "light beige",
        swatch: "#d2bfaa",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-sand.webp",
        galleryImages: [
          "images/products/hybrid/eco-grande-9mm-sand.webp",
          "images/products/hybrid/eco-grande-9mm-sand-gallery-2.webp"
        ],
        alt: "Grande 9.0 Sand hybrid flooring swatch",
        description: "Sand is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/sand/"
      },
      {
        id: "eco-grande-9mm-sparrow",
        category: "hybrid",
        brand: "Eco Flooring",
        range: "Grande 9.0",
        colour: "Sparrow",
        tone: "mid brown",
        swatch: "#927257",
        thickness: "9.0mm",
        productType: "Hybrid Flooring",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/hybrid/eco-grande-9mm-sparrow.webp",
        alt: "Grande 9.0 Sparrow hybrid flooring swatch",
        description: "Sparrow is a hybrid flooring colour from the Grande 9.0 range.",
        features: ["Hybrid flooring construction", "Timber-look surface", "Range-only product selection", "Suitable for everyday residential renovations"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Rental properties", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/sparrow/"
      },
      {
        "id": "topdeck-avala-blackbutt",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Blackbutt",
        "tone": "warm brown",
        "swatch": "#a98c72",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-blackbutt.webp",
        "alt": "Blackbutt hybrid flooring swatch",
        "description": "Golden and strong, Blackbutt radiates vitality and timeless beauty. Its natural glow uplifts spaces with warmth and enduring style.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-blackbutt",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-blackbutt.webp", "images/products/hybrid/topdeck-avala/avala-blackbutt-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-blackbutt-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-coastal-beige",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Coastal Beige",
        "tone": "natural oak",
        "swatch": "#b89c75",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-coastal-beige.webp",
        "alt": "Coastal Beige hybrid flooring swatch",
        "description": "Light and breezy, Coastal Beige evokes the serenity of sunlit sands. Its soft warmth makes any space feel fresh, open, and inviting.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-coastal-beige",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-coastal-beige.webp", "images/products/hybrid/topdeck-avala/avala-coastal-beige-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-coastal-beige-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-jarrah",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Jarrah",
        "tone": "dark brown",
        "swatch": "#633931",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-jarrah.webp",
        "alt": "Jarrah hybrid flooring swatch",
        "description": "Rich and distinctive, Jarrah\u2019s deep reddish-brown tones make a dramatic statement. It exudes warmth, passion, and undeniable elegance.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-jarrah",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-jarrah.webp", "images/products/hybrid/topdeck-avala/avala-jarrah-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-jarrah-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-moschino",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Moschino",
        "tone": "charcoal",
        "swatch": "#3f3b38",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-moschino.webp",
        "alt": "Moschino hybrid flooring swatch",
        "description": "Dramatic and bold, Moschino captivates with its deep charcoal finish. It adds instant luxury and striking modern appeal.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-moschino",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-moschino.webp", "images/products/hybrid/topdeck-avala/avala-moschino-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-moschino-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-orchid-ash",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Orchid Ash",
        "tone": "light grey",
        "swatch": "#9a9f98",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-orchid-ash.webp",
        "alt": "Orchid Ash hybrid flooring swatch",
        "description": "Cool and refined, Orchid Ash captures the beauty of weathered timber in soft grey hues. It creates a sleek, contemporary atmosphere with subtle character.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-orchid-ash",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-orchid-ash.webp", "images/products/hybrid/topdeck-avala/avala-orchid-ash-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-orchid-ash-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-pebble-grey",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Pebble Grey",
        "tone": "light grey",
        "swatch": "#a4a291",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-pebble-grey.webp",
        "alt": "Pebble Grey hybrid flooring swatch",
        "description": "Soft and understated, Pebble Grey brings a calm, neutral elegance to any interior. Its gentle tones provide a modern foundation with effortless versatility.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-pebble-grey",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-pebble-grey.webp", "images/products/hybrid/topdeck-avala/avala-pebble-grey-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-pebble-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-prague-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Prague Oak",
        "tone": "natural oak",
        "swatch": "#bca988",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-prague-oak.webp",
        "alt": "Prague Oak hybrid flooring swatch",
        "description": "Classic and elegant, Prague Oak pairs natural grain with golden hues. It strikes the perfect balance of warmth and sophistication.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-prague-oak",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-prague-oak.webp", "images/products/hybrid/topdeck-avala/avala-prague-oak-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-prague-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-spotted-gum",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#988065",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-spotted-gum.webp",
        "alt": "Spotted Gum hybrid flooring swatch",
        "description": "Dynamic and textured, Spotted Gum celebrates the richness of natural variation. Its bold character infuses life and authenticity into interiors.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-spotted-gum",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-spotted-gum.webp", "images/products/hybrid/topdeck-avala/avala-spotted-gum-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-spotted-gum-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-stamford-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Stamford Oak",
        "tone": "light oak",
        "swatch": "#c7bb9e",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-stamford-oak.webp",
        "alt": "Stamford Oak hybrid flooring swatch",
        "description": "Warm and welcoming, Stamford Oak radiates natural charm with its golden undertones. It brings a timeless sense of comfort and homeliness.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-stamford-oak",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-stamford-oak.webp", "images/products/hybrid/topdeck-avala/avala-stamford-oak-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-stamford-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-avala-tas-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Avala Hybrid Planks",
        "colour": "Tasmanian Oak",
        "tone": "warm brown",
        "swatch": "#af8e72",
        "thickness": "6.5mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-avala/avala-tas-oak.webp",
        "alt": "Tasmanian Oak hybrid flooring swatch",
        "description": "Subtle and versatile, Tasmanian Oak carries a soft, natural finish that works beautifully across styles. Its balanced tones bring understated grace and comfort.",
        "features": ["SPC rigid core hybrid flooring designed for waterproof durability.", "Timber-look plank visuals for kitchens and other higher-traffic rooms.", "Floating-floor licensed click installation.", "A practical everyday hybrid range with a broad Australian and oak-look palette."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/avala-tas-oak",
        "galleryImages": ["images/products/hybrid/topdeck-avala/avala-tas-oak.webp", "images/products/hybrid/topdeck-avala/avala-tas-oak-gallery-2.webp", "images/products/hybrid/topdeck-avala/avala-tas-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-bellevue-avenue",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Bellevue Avenue",
        "tone": "warm brown",
        "swatch": "#9d927d",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-bellevue-avenue.webp",
        "alt": "Bellevue Avenue hybrid flooring swatch",
        "description": "Elegant and refined, Bellevue Avenue blends subtle beige and grey hues for a sophisticated balance. It offers a versatile foundation that feels both modern and timeless.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-bellevue-avenue",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-bellevue-avenue.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-bellevue-avenue-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-bellevue-avenue-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-blackbutt",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Blackbutt",
        "tone": "warm brown",
        "swatch": "#9b8369",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-blackbutt.webp",
        "alt": "Blackbutt hybrid flooring swatch",
        "description": "Golden and strong, Blackbutt radiates warmth with a timeless appeal. Its natural glow brings energy and vitality into every room.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-blackbutt",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-blackbutt.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-blackbutt-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-blackbutt-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-cayman-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Cayman Oak",
        "tone": "mid oak",
        "swatch": "#acaa98",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-cayman-oak.webp",
        "alt": "Cayman Oak hybrid flooring swatch",
        "description": "Light and breezy, Cayman Oak embodies coastal relaxation. Its soft, sun-washed tones add freshness and comfort to any setting.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-cayman-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-cayman-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-cayman-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-cayman-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-highland-beige-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Highland Beige Oak",
        "tone": "light grey",
        "swatch": "#9a9c90",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-highland-beige-oak.webp",
        "alt": "Highland Beige Oak hybrid flooring swatch",
        "description": "Calm and neutral, Highland Beige Oak offers a subtle mix of beige and grey tones. It creates a soothing, modern backdrop with natural charm.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-highland-beige-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-highland-beige-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-highland-beige-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-highland-beige-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-lake-view-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Lake View Oak",
        "tone": "warm brown",
        "swatch": "#988770",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lake-view-oak.webp",
        "alt": "Lake View Oak hybrid flooring swatch",
        "description": "Balanced and inviting, Lake View Oak blends warm and cool shades for effortless harmony. Its natural variation adds depth and visual interest.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-lake-view-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lake-view-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lake-view-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lake-view-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-lovanna-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Lovanna Oak",
        "tone": "light oak",
        "swatch": "#b9b7a8",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lovanna-oak.webp",
        "alt": "Lovanna Oak hybrid flooring swatch",
        "description": "Soft and graceful, Lovanna Oak carries a gentle lightness that brightens any room. Its pale tones evoke calm serenity, perfect for open and airy interiors.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-lovanna-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lovanna-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lovanna-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-lovanna-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-manor-ridge-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Manor Ridge Oak",
        "tone": "mid oak",
        "swatch": "#a2987e",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-manor-ridge-oak.webp",
        "alt": "Manor Ridge Oak hybrid flooring swatch",
        "description": "Warm and welcoming, Manor Ridge Oak radiates rustic charm with golden natural hues. It creates a homely atmosphere infused with character and warmth.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-manor-ridge-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-manor-ridge-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-manor-ridge-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-manor-ridge-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-sherwood-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Sherwood Oak",
        "tone": "warm brown",
        "swatch": "#9c8b70",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-sherwood-oak.webp",
        "alt": "Sherwood Oak hybrid flooring swatch",
        "description": "Rich and earthy, Sherwood Oak channels the heart of natural woodlands. Its deep, warm tones bring grounding beauty and enduring strength.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-sherwood-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-sherwood-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-sherwood-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-sherwood-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-south-grove-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "South Grove Oak",
        "tone": "warm brown",
        "swatch": "#7c6952",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-south-grove-oak.webp",
        "alt": "South Grove Oak hybrid flooring swatch",
        "description": "Grounded and classic, South Grove Oak embodies timeless strength. Its rich brown hues create a cozy, intimate atmosphere.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-south-grove-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-south-grove-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-south-grove-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-south-grove-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-spotted-gum",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#846e53",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-spotted-gum.webp",
        "alt": "Spotted Gum hybrid flooring swatch",
        "description": "Bold and full of character, Spotted Gum celebrates natural variation with striking grain. It brings vibrancy and depth, transforming floors into a feature of natural artistry.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-spotted-gum",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-spotted-gum.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-spotted-gum-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-spotted-gum-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-weathered-grey-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Weathered Grey Oak",
        "tone": "soft grey",
        "swatch": "#73716a",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-weathered-grey-oak.webp",
        "alt": "Weathered Grey Oak hybrid flooring swatch",
        "description": "Rustic and dramatic, Weathered Grey Oak captures the beauty of aged timber. Its textured greys evoke character, depth, and contemporary style.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-weathered-grey-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-weathered-grey-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-weathered-grey-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-weathered-grey-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lumiere-winchester-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Lumiere Ultra HD Hybrid Plank",
        "colour": "Winchester Oak",
        "tone": "light grey",
        "swatch": "#999585",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-winchester-oak.webp",
        "alt": "Winchester Oak hybrid flooring swatch",
        "description": "Cool and contemporary, Winchester Oak brings a subtle weathered look with its soft grey undertones. It exudes quiet strength and understated elegance.",
        "features": ["RCP core hybrid flooring with dense waterproof construction.", "Ultra-matt PU finish and brushed surface for a more natural timber feel.", "Built for improved resistance to movement and indentation according to the supplier.", "Floating-floor licensed click installation."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lumiere-winchester-oak",
        "galleryImages": ["images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-winchester-oak.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-winchester-oak-gallery-2.webp", "images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-winchester-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-belle-vie-bellevue-avenue",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Bellevue Avenue",
        "tone": "warm brown",
        "swatch": "#9f947f",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-bellevue-avenue.webp",
        "alt": "Bellevue Avenue hybrid flooring swatch",
        "description": "Elegant and refined, Bellevue Avenue blends subtle beige and grey hues for a sophisticated balance. It offers a versatile foundation that feels both modern and timeless.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-bellevue-avenue"
      },
      {
        "id": "topdeck-belle-vie-blackbutt",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Blackbutt",
        "tone": "warm brown",
        "swatch": "#967c62",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-blackbutt.webp",
        "alt": "Blackbutt hybrid flooring swatch",
        "description": "Golden and strong, Blackbutt radiates warmth with a timeless appeal. Its natural glow brings energy and vitality into every room.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-blackbutt"
      },
      {
        "id": "topdeck-belle-vie-cayman-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Cayman Oak",
        "tone": "light oak",
        "swatch": "#afac9b",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-cayman-oak.webp",
        "alt": "Cayman Oak hybrid flooring swatch",
        "description": "Light and breezy, Cayman Oak embodies coastal relaxation. Its soft, sun-washed tones add freshness and comfort to any setting.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-cayman-oak"
      },
      {
        "id": "topdeck-belle-vie-highland-beige-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Highland Beige Oak",
        "tone": "light grey",
        "swatch": "#9fa094",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-highland-beige-oak.webp",
        "alt": "Highland Beige Oak hybrid flooring swatch",
        "description": "Calm and neutral, Highland Beige Oak offers a subtle mix of beige and grey tones. It creates a soothing, modern backdrop with natural charm.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-highland-beige-oak"
      },
      {
        "id": "topdeck-belle-vie-lake-view-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Lake View Oak",
        "tone": "warm brown",
        "swatch": "#9c8c75",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-lake-view-oak.webp",
        "alt": "Lake View Oak hybrid flooring swatch",
        "description": "Balanced and inviting, Lake View Oak blends warm and cool shades for effortless harmony. Its natural variation adds depth and visual interest.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-lake-view-oak"
      },
      {
        "id": "topdeck-belle-vie-lovanna-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Lovanna Oak",
        "tone": "light oak",
        "swatch": "#bab8aa",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-lovanna-oak.webp",
        "alt": "Lovanna Oak hybrid flooring swatch",
        "description": "Soft and graceful, Lovanna Oak carries a gentle lightness that brightens any room. Its pale tones evoke calm serenity, perfect for open and airy interiors.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-lovanna-oak"
      },
      {
        "id": "topdeck-belle-vie-manor-ridge-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Manor Ridge Oak",
        "tone": "mid oak",
        "swatch": "#a39980",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-manor-ridge-oak.webp",
        "alt": "Manor Ridge Oak hybrid flooring swatch",
        "description": "Warm and welcoming, Manor Ridge Oak radiates rustic charm with golden natural hues. It creates a homely atmosphere infused with character and warmth.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-manor-ridge-oak"
      },
      {
        "id": "topdeck-belle-vie-sherwood-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Sherwood Oak",
        "tone": "warm brown",
        "swatch": "#9c8b71",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-sherwood-oak.webp",
        "alt": "Sherwood Oak hybrid flooring swatch",
        "description": "Rich and earthy, Sherwood Oak channels the heart of natural woodlands. Its deep, warm tones bring grounding beauty and enduring strength.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-sherwood-oak"
      },
      {
        "id": "topdeck-belle-vie-south-grove-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "South Grove Oak",
        "tone": "warm brown",
        "swatch": "#7b6750",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-south-grove-oak.webp",
        "alt": "South Grove Oak hybrid flooring swatch",
        "description": "Grounded and classic, South Grove Oak embodies timeless strength. Its rich brown hues create a cozy, intimate atmosphere.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-south-grove-oak"
      },
      {
        "id": "topdeck-belle-vie-spotted-gum",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#857158",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-spotted-gum.webp",
        "alt": "Spotted Gum hybrid flooring swatch",
        "description": "Bold and full of character, Spotted Gum celebrates natural variation with striking grain. It brings vibrancy and depth, transforming floors into a feature of natural artistry.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-spotted-gum"
      },
      {
        "id": "topdeck-belle-vie-weathered-grey-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Weathered Grey Oak",
        "tone": "soft grey",
        "swatch": "#74726c",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-weathered-grey-oak.webp",
        "alt": "Weathered Grey Oak hybrid flooring swatch",
        "description": "Rustic and dramatic, Weathered Grey Oak captures the beauty of aged timber. Its textured greys evoke character, depth, and contemporary style.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-weathered-grey-oak"
      },
      {
        "id": "topdeck-belle-vie-winchester-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Belle Vie Herringbone",
        "colour": "Winchester Oak",
        "tone": "light grey",
        "swatch": "#999587",
        "thickness": "7mm",
        "productType": "Hybrid Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-belle-vie/belle-vie-winchester-oak.webp",
        "alt": "Winchester Oak hybrid flooring swatch",
        "description": "Cool and contemporary, Winchester Oak brings a subtle weathered look with its soft grey undertones. It exudes quiet strength and understated elegance.",
        "features": ["Waterproof hybrid herringbone with ultra-matte brushed timber-look surface.", "Non-repeating pattern claim for more natural visual variation.", "Floating-floor installation via Valinge SG Click.", "Statement patterned hybrid flooring for premium interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Apartments", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/belle-vie-winchester-oak"
      },
      {
        "id": "topdeck-storm-askada-grey-wash",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Askada Grey Wash",
        "tone": "soft grey",
        "swatch": "#7d7d77",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-askada-grey-wash.webp",
        "alt": "Askada Grey Wash hybrid flooring swatch",
        "description": "Bold and textured, Askada Grey Wash blends dramatic greys with rustic grain. It evokes a raw, industrial edge, perfect for striking contemporary interiors.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-askada-grey-wash",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-askada-grey-wash.webp", "images/products/hybrid/topdeck-storm-luxury/storm-askada-grey-wash-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-askada-grey-wash-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-coastal-blackbutt",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Coastal Blackbutt",
        "tone": "warm brown",
        "swatch": "#95653f",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-coastal-blackbutt.webp",
        "alt": "Coastal Blackbutt hybrid flooring swatch",
        "description": "Golden and radiant, Coastal Blackbutt channels the vitality of sunlit shores. It brings energy and freshness, making interiors feel vibrant and alive.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-coastal-blackbutt",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-coastal-blackbutt.webp", "images/products/hybrid/topdeck-storm-luxury/storm-coastal-blackbutt-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-coastal-blackbutt-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-loft-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Loft Oak",
        "tone": "warm brown",
        "swatch": "#75664e",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-loft-oak.webp",
        "alt": "Loft Oak hybrid flooring swatch",
        "description": "Earthy and grounded, Loft Oak delivers a warm, urban sophistication. Its rich natural tones bring balance and comfort, ideal for modern living.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-loft-oak",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-loft-oak.webp", "images/products/hybrid/topdeck-storm-luxury/storm-loft-oak-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-loft-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-modern-ice-grey",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Modern Ice Grey",
        "tone": "light grey",
        "swatch": "#afaea9",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-modern-ice-grey.webp",
        "alt": "Modern Ice Grey hybrid flooring swatch",
        "description": "Cool and refined, Modern Ice Grey adds sleek sophistication to any space. Its frosty tones evoke modern minimalism while remaining effortlessly versatile.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-modern-ice-grey",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-modern-ice-grey.webp", "images/products/hybrid/topdeck-storm-luxury/storm-modern-ice-grey-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-modern-ice-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-new-england-blackbutt",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "New England Blackbutt",
        "tone": "warm brown",
        "swatch": "#b0895e",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-new-england-blackbutt.webp",
        "alt": "New England Blackbutt hybrid flooring swatch",
        "description": "Bright and contemporary, New England Blackbutt glows with golden warmth. Its fresh tones uplift interiors with vitality and effortless charm.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-new-england-blackbutt",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-new-england-blackbutt.webp", "images/products/hybrid/topdeck-storm-luxury/storm-new-england-blackbutt-gallery-2.webp"]
      },
      {
        "id": "topdeck-storm-nsw-spotted-gum",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "NSW Spotted Gum",
        "tone": "warm brown",
        "swatch": "#896340",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-nsw-spotted-gum.webp",
        "alt": "NSW Spotted Gum hybrid flooring swatch",
        "description": "Richly grained, NSW Spotted Gum radiates strength and natural beauty. Its variation in tone creates a sense of energy and rustic authenticity.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-nsw-spotted-gum",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-nsw-spotted-gum.webp", "images/products/hybrid/topdeck-storm-luxury/storm-nsw-spotted-gum-gallery-2.webp"]
      },
      {
        "id": "topdeck-storm-oxford-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Oxford Oak",
        "tone": "warm brown",
        "swatch": "#b0946e",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-oxford-oak.webp",
        "alt": "Oxford Oak hybrid flooring swatch",
        "description": "Calm and sophisticated, Oxford Oak offers classic appeal with its neutral beige tones. It sets a foundation of comfort and timeless elegance.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-oxford-oak",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-oxford-oak.webp", "images/products/hybrid/topdeck-storm-luxury/storm-oxford-oak-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-oxford-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-royal-white-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Royal White Oak",
        "tone": "natural oak",
        "swatch": "#b6a991",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-royal-white-oak.webp",
        "alt": "Royal White Oak hybrid flooring swatch",
        "description": "Bright and elegant, Royal White Oak brings timeless charm with its soft, creamy tones. It creates an inviting sense of openness, filling interiors with light and warmth.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-royal-white-oak",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-royal-white-oak.webp", "images/products/hybrid/topdeck-storm-luxury/storm-royal-white-oak-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-royal-white-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-spotted-gum",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Spotted Gum",
        "tone": "warm brown",
        "swatch": "#81603b",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-spotted-gum.webp",
        "alt": "Spotted Gum hybrid flooring swatch",
        "description": "Dynamic and full of character, Spotted Gum showcases rich variation and natural texture. It breathes life into interiors with warmth and bold personality.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-spotted-gum",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-spotted-gum.webp", "images/products/hybrid/topdeck-storm-luxury/storm-spotted-gum-gallery-2.webp"]
      },
      {
        "id": "topdeck-storm-vienna-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Vienna Oak",
        "tone": "warm brown",
        "swatch": "#9d7e58",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-vienna-oak.webp",
        "alt": "Vienna Oak hybrid flooring swatch",
        "description": "Warm and golden, Vienna Oak carries an understated European elegance. Its soft tones feel inviting and graceful, perfect for refined interiors.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-vienna-oak",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-vienna-oak.webp", "images/products/hybrid/topdeck-storm-luxury/storm-vienna-oak-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-vienna-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-vintage-cambridge-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Vintage Cambridge Oak",
        "tone": "warm brown",
        "swatch": "#584733",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-vintage-cambridge-oak.webp",
        "alt": "Vintage Cambridge Oak hybrid flooring swatch",
        "description": "Classic and deep, Vintage Cambridge Oak radiates old-world charm. Its dark, timeworn hues bring richness and character to every corner of the home.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-vintage-cambridge-oak",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-vintage-cambridge-oak.webp", "images/products/hybrid/topdeck-storm-luxury/storm-vintage-cambridge-oak-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-vintage-cambridge-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-storm-vintage-evian-oak",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Storm Luxury Hybrid Plank",
        "colour": "Vintage Evian Oak",
        "tone": "warm brown",
        "swatch": "#614730",
        "thickness": "7mm",
        "productType": "SPC Hybrid",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-storm-luxury/storm-vintage-evian-oak.webp",
        "alt": "Vintage Evian Oak hybrid flooring swatch",
        "description": "Elegant and bold, Vintage Evian Oak offers depth and heritage in every grain. Its dark warmth creates intimacy, sophistication, and enduring style.",
        "features": ["Waterproof hybrid flooring with built-in acoustic backing.", "Negative Ion surface technology and 5-Star AAAC rating claims from Topdeck.", "Timber-look plank visuals for high-traffic residential spaces.", "Floating-floor 5G click system."],
        "suitableFor": ["Living areas", "Bedrooms", "Kitchens", "Apartments", "Busy family homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/storm-vintage-evian-oak",
        "galleryImages": ["images/products/hybrid/topdeck-storm-luxury/storm-vintage-evian-oak.webp", "images/products/hybrid/topdeck-storm-luxury/storm-vintage-evian-oak-gallery-2.webp", "images/products/hybrid/topdeck-storm-luxury/storm-vintage-evian-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-black-maquina",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Black Maquina",
        "tone": "charcoal",
        "swatch": "#141412",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-black-maquina.webp",
        "alt": "Black Maquina hybrid flooring swatch",
        "description": "Powerful and dramatic, Black Maquina makes an unapologetic statement of luxury. Its deep black surface with fine veining creates a sleek, high-end aesthetic.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-black-maquina",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-black-maquina.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-black-maquina-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-black-maquina-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-calcatta",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Calacatta",
        "tone": "whitewash",
        "swatch": "#cecdc5",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-calcatta.webp",
        "alt": "Calacatta hybrid flooring swatch",
        "description": "Striking and elegant, Calacatta\u2019s white marble design with bold veining exudes timeless luxury. It transforms any space into a statement of grandeur and refinement.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-calcatta",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-calcatta.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-calcatta-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-calcatta-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-casper-white",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Casper White",
        "tone": "light grey",
        "swatch": "#b5b8af",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-casper-white.webp",
        "alt": "Casper White hybrid flooring swatch",
        "description": "Light and airy, Casper White captures the freshness of soft, pale stone. Its subtle veining adds refinement, making spaces feel open, pure, and elegant.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-casper-white",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-casper-white.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-casper-white-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-casper-white-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-grema-marfil",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Crema Marfil",
        "tone": "light oak",
        "swatch": "#c3bcaa",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-grema-marfil.webp",
        "alt": "Crema Marfil hybrid flooring swatch",
        "description": "Delicate and creamy, Crema Marfil radiates softness and subtle beauty. Its light tones add warmth and sophistication, brightening interiors with a classic touch.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-grema-marfil",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-grema-marfil.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-grema-marfil-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-grema-marfil-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-dover-grey",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Dover Grey",
        "tone": "soft grey",
        "swatch": "#817d79",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-dover-grey.webp",
        "alt": "Dover Grey hybrid flooring swatch",
        "description": "Dynamic and textural, Dover Grey blends cool stone with subtle speckling for a natural effect. It brings energy and depth while remaining timelessly stylish.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-dover-grey",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-dover-grey.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-dover-grey-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-dover-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-grigio",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Grigio",
        "tone": "light grey",
        "swatch": "#a6a7a1",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-grigio.webp",
        "alt": "Grigio hybrid flooring swatch",
        "description": "Soft and versatile, Grigio carries a natural stone look that feels both modern and serene. Its gentle grey tones bring balance and understated sophistication.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-grigio",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-grigio.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-grigio-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-grigio-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-jasper-grey",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Jasper Grey",
        "tone": "light grey",
        "swatch": "#81827d",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-jasper-grey.webp",
        "alt": "Jasper Grey hybrid flooring swatch",
        "description": "Cool and refined, Jasper Grey combines texture with natural variation for a contemporary stone look. Its versatile tone evokes modern calm and enduring elegance.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-jasper-grey",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-jasper-grey.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-jasper-grey-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-jasper-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-madison",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Madison",
        "tone": "warm brown",
        "swatch": "#5f5244",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-madison.webp",
        "alt": "Madison hybrid flooring swatch",
        "description": "Dark and richly textured, Madison creates a sense of drama and sophistication. Its earthy depth adds bold character, grounding interiors with modern style.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-madison",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-madison.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-madison-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-madison-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-monaco-brown",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Monaco Brown",
        "tone": "natural oak",
        "swatch": "#b09b83",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-monaco-brown.webp",
        "alt": "Monaco Brown hybrid flooring swatch",
        "description": "Warm and earthy, Monaco Brown radiates rustic charm with its natural stone appeal. It creates a grounded, inviting atmosphere full of depth and character.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-monaco-brown",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-monaco-brown.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-monaco-brown-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-monaco-brown-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-pietra-grey",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Pietra Grey",
        "tone": "charcoal",
        "swatch": "#4d473f",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-pietra-grey.webp",
        "alt": "Pietra Grey hybrid flooring swatch",
        "description": "Rich and dramatic, Pietra Grey channels the bold elegance of polished stone. Its dark hues add strength and luxury to contemporary interiors.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-pietra-grey",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-pietra-grey.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-pietra-grey-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-pietra-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-valley-beige",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Valley Beige",
        "tone": "natural oak",
        "swatch": "#b7a78e",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-valley-beige.webp",
        "alt": "Valley Beige hybrid flooring swatch",
        "description": "Warm and neutral, Valley Beige brings a soft, organic feel to interiors. Its sandy undertones create a soothing backdrop that feels natural and welcoming.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-valley-beige",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-valley-beige.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-valley-beige-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-valley-beige-gallery-3.webp"]
      },
      {
        "id": "topdeck-artisan-volcano",
        "category": "hybrid",
        "brand": "Topdeck Flooring",
        "range": "Artisan Hybrid Tile",
        "colour": "Volcano",
        "tone": "natural oak",
        "swatch": "#bfa382",
        "thickness": "9mm",
        "productType": "Hybrid Tile",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/hybrid/topdeck-artisan-tile/artisan-volcano.webp",
        "alt": "Volcano hybrid flooring swatch",
        "description": "Bold and fiery in spirit, Volcano carries a unique blend of earthy warmth and striking texture. It evokes the raw beauty of natural stone shaped by time.",
        "features": ["Tile-look hybrid flooring with multi-layer composite core construction.", "Aims to combine the appearance of large-format tiles with warmer hybrid underfoot comfort.", "Floating-floor click installation instead of conventional glued tile laying.", "Suitable for modern interiors that want stone visuals with easier renovation workflow."],
        "suitableFor": ["Living areas", "Kitchens", "Apartments", "Modern renovations", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/artisan-volcano",
        "galleryImages": ["images/products/hybrid/topdeck-artisan-tile/artisan-volcano.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-volcano-gallery-2.webp", "images/products/hybrid/topdeck-artisan-tile/artisan-volcano-gallery-3.webp"]
      },
      {
              "id": "eco-eco-xxl-8mm-coastal-blackbutt",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Coastal Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/coastal-blackbutt.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/coastal-blackbutt.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/coastal-blackbutt.webp"
              ],
              "alt": "Coastal Blackbutt XXL 8.0 Hybrid Flooring sample",
              "description": "Coastal Blackbutt is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/coastal-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "XXL 8.0 Hybrid Flooring is an Eco Flooring range for projects that want a larger timber-look board with the practicality of a waterproof floating floor.",
                              "The range is suitable for Sydney apartments and family homes where durable everyday performance and a clean modern timber look are preferred."
                      ],
                      "featuresIntro": "XXL 8.0 range highlights",
                      "features": [
                              "Waterproof hybrid construction",
                              "Wide timber-look colour palette",
                              "Floating installation system",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "XXL 8.0 Hybrid Flooring"
                              },
                              {
                                      "label": "Thickness",
                                      "value": "8.0mm"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-xxl-8mm-cotton-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Cotton Oak",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/cotton-oak.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/cotton-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/cotton-oak.webp"
              ],
              "alt": "Cotton Oak XXL 8.0 Hybrid Flooring sample",
              "description": "Cotton Oak is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/cotton-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-ebony",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Ebony",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/ebony.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/ebony.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/ebony.webp"
              ],
              "alt": "Ebony XXL 8.0 Hybrid Flooring sample",
              "description": "Ebony is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/ebony/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-oak-atlanta",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Oak Atlanta",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/oak-atlanta.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/oak-atlanta.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/oak-atlanta.webp"
              ],
              "alt": "Oak Atlanta XXL 8.0 Hybrid Flooring sample",
              "description": "Oak Atlanta is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-atlanta/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-oak-saffron",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Oak Saffron",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/oak-saffron.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/oak-saffron.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/oak-saffron.webp"
              ],
              "alt": "Oak Saffron XXL 8.0 Hybrid Flooring sample",
              "description": "Oak Saffron is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-saffron/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-oak-sofia",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Oak Sofia",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/oak-sofia.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/oak-sofia.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/oak-sofia.webp"
              ],
              "alt": "Oak Sofia XXL 8.0 Hybrid Flooring sample",
              "description": "Oak Sofia is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-sofia/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-oak-titanium",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Oak Titanium",
              "tone": "grey oak",
              "swatch": "#a6a7a1",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/oak-titanium.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/oak-titanium.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/oak-titanium.webp"
              ],
              "alt": "Oak Titanium XXL 8.0 Hybrid Flooring sample",
              "description": "Oak Titanium is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-titanium/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-pearl-grey",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Pearl Grey",
              "tone": "grey oak",
              "swatch": "#a6a7a1",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/pearl-grey.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/pearl-grey.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/pearl-grey.webp"
              ],
              "alt": "Pearl Grey XXL 8.0 Hybrid Flooring sample",
              "description": "Pearl Grey is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/pearl-grey/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-royal-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Royal Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/royal-oak.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/royal-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/royal-oak.webp"
              ],
              "alt": "Royal Oak XXL 8.0 Hybrid Flooring sample",
              "description": "Royal Oak is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/royal-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-seashell-white",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Seashell White",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/seashell-white.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/seashell-white.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/seashell-white.webp"
              ],
              "alt": "Seashell White XXL 8.0 Hybrid Flooring sample",
              "description": "Seashell White is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/seashell-white/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-spotted-gum-hybrid",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Spotted Gum Hybrid",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/spotted-gum-hybrid.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/spotted-gum-hybrid.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/spotted-gum-hybrid.webp"
              ],
              "alt": "Spotted Gum Hybrid XXL 8.0 Hybrid Flooring sample",
              "description": "Spotted Gum Hybrid is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/spotted-gum-hybrid/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-xxl-8mm-walnut-brown",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "XXL 8.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-xxl-8mm",
              "rangeLabel": "XXL 8.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-xxl-8mm-coastal-blackbutt",
              "customerLabel": "XXL 8.0 Hybrid Flooring",
              "colour": "Walnut Brown",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "8.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-xxl-8mm/walnut-brown.webp",
              "imageUrl": "images/products/hybrid/eco-xxl-8mm/walnut-brown.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-xxl-8mm/walnut-brown.webp"
              ],
              "alt": "Walnut Brown XXL 8.0 Hybrid Flooring sample",
              "description": "Walnut Brown is a hybrid flooring colour from the XXL 8.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Large-format timber look",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Family homes"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/walnut-brown/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-grande-7-5mm-capri-7-5",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Grande 7.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-grande-7-5mm",
              "rangeLabel": "Grande 7.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-grande-7-5mm-capri-7-5",
              "customerLabel": "Grande 7.5 Hybrid Flooring",
              "colour": "Capri 7.5",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "7.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-grande-7-5mm/capri-7-5.webp",
              "imageUrl": "images/products/hybrid/eco-grande-7-5mm/capri-7-5.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-grande-7-5mm/capri-7-5.webp"
              ],
              "alt": "Capri 7.5 Grande 7.5 Hybrid Flooring sample",
              "description": "Capri 7.5 is a hybrid flooring colour from the Grande 7.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Timber-look surface",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Rental renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/capri-7-5/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Grande 7.5 Hybrid Flooring provides a practical waterproof hybrid option for residential flooring projects.",
                              "It suits customers who want a timber-look floating floor with simple range selection and colour confirmation before installation."
                      ],
                      "featuresIntro": "Grande 7.5 range highlights",
                      "features": [
                              "Waterproof hybrid construction",
                              "Floating installation system",
                              "Practical timber-look colours",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Grande 7.5 Hybrid Flooring"
                              },
                              {
                                      "label": "Thickness",
                                      "value": "7.5mm"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-grande-7-5mm-cream-7-5",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Grande 7.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-grande-7-5mm",
              "rangeLabel": "Grande 7.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-grande-7-5mm-capri-7-5",
              "customerLabel": "Grande 7.5 Hybrid Flooring",
              "colour": "Cream 7.5",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "7.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-grande-7-5mm/cream-7-5.webp",
              "imageUrl": "images/products/hybrid/eco-grande-7-5mm/cream-7-5.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-grande-7-5mm/cream-7-5.webp"
              ],
              "alt": "Cream 7.5 Grande 7.5 Hybrid Flooring sample",
              "description": "Cream 7.5 is a hybrid flooring colour from the Grande 7.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Timber-look surface",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Rental renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/cream-7-5/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-grande-7-5mm-northen-spotted-gum-7-5",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Grande 7.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-grande-7-5mm",
              "rangeLabel": "Grande 7.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-grande-7-5mm-capri-7-5",
              "customerLabel": "Grande 7.5 Hybrid Flooring",
              "colour": "Northen Spotted Gum 7.5",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "7.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-grande-7-5mm/northen-spotted-gum-7-5.webp",
              "imageUrl": "images/products/hybrid/eco-grande-7-5mm/northen-spotted-gum-7-5.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-grande-7-5mm/northen-spotted-gum-7-5.webp"
              ],
              "alt": "Northen Spotted Gum 7.5 Grande 7.5 Hybrid Flooring sample",
              "description": "Northen Spotted Gum 7.5 is a hybrid flooring colour from the Grande 7.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Timber-look surface",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Rental renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/northen-spotted-gum-7-5/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-grande-7-5mm-pacific-blackbutt-7-5",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Grande 7.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-grande-7-5mm",
              "rangeLabel": "Grande 7.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-grande-7-5mm-capri-7-5",
              "customerLabel": "Grande 7.5 Hybrid Flooring",
              "colour": "Pacific Blackbutt 7.5",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "7.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-grande-7-5mm/pacific-blackbutt-7-5.webp",
              "imageUrl": "images/products/hybrid/eco-grande-7-5mm/pacific-blackbutt-7-5.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-grande-7-5mm/pacific-blackbutt-7-5.webp"
              ],
              "alt": "Pacific Blackbutt 7.5 Grande 7.5 Hybrid Flooring sample",
              "description": "Pacific Blackbutt 7.5 is a hybrid flooring colour from the Grande 7.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Timber-look surface",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Rental renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/pacific-blackbutt-7-5/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-grande-7-5mm-raw-spotted-gum-7-5",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Grande 7.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-grande-7-5mm",
              "rangeLabel": "Grande 7.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-grande-7-5mm-capri-7-5",
              "customerLabel": "Grande 7.5 Hybrid Flooring",
              "colour": "Raw Spotted Gum 7.5",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "7.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-grande-7-5mm/raw-spotted-gum-7-5.webp",
              "imageUrl": "images/products/hybrid/eco-grande-7-5mm/raw-spotted-gum-7-5.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-grande-7-5mm/raw-spotted-gum-7-5.webp"
              ],
              "alt": "Raw Spotted Gum 7.5 Grande 7.5 Hybrid Flooring sample",
              "description": "Raw Spotted Gum 7.5 is a hybrid flooring colour from the Grande 7.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Timber-look surface",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Rental renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/raw-spotted-gum-7-5/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-grande-7-5mm-sand-7-5",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Grande 7.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-grande-7-5mm",
              "rangeLabel": "Grande 7.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-grande-7-5mm-capri-7-5",
              "customerLabel": "Grande 7.5 Hybrid Flooring",
              "colour": "Sand 7.5",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "7.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-grande-7-5mm/sand-7-5.webp",
              "imageUrl": "images/products/hybrid/eco-grande-7-5mm/sand-7-5.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-grande-7-5mm/sand-7-5.webp"
              ],
              "alt": "Sand 7.5 Grande 7.5 Hybrid Flooring sample",
              "description": "Sand 7.5 is a hybrid flooring colour from the Grande 7.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Timber-look surface",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Living areas",
                      "Bedrooms",
                      "Rental renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/sand-7-5/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Herringbone 7.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-herringbone-7mm",
              "rangeLabel": "Herringbone 7.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "customerLabel": "Herringbone 7.0 Hybrid Flooring",
              "colour": "Clear Water Beach Herringbone",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "7.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-herringbone-7mm/clear-water-beach-herringbone.webp",
              "imageUrl": "images/products/hybrid/eco-herringbone-7mm/clear-water-beach-herringbone.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-herringbone-7mm/clear-water-beach-herringbone.webp"
              ],
              "alt": "Clear Water Beach Herringbone Herringbone 7.0 Hybrid Flooring sample",
              "description": "Clear Water Beach Herringbone is a hybrid flooring colour from the Herringbone 7.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Herringbone visual style",
                      "Floating floor product range",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Feature areas",
                      "Living rooms",
                      "Apartments",
                      "Renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/clear-water-beach-herringbone/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Herringbone 7.0 Hybrid Flooring gives customers a herringbone-look hybrid product option while keeping the quote selection simple at range level.",
                              "Final installation method and site suitability are confirmed before work starts."
                      ],
                      "featuresIntro": "Herringbone 7.0 range highlights",
                      "features": [
                              "Waterproof hybrid product range",
                              "Herringbone-look colour options",
                              "Designed for feature flooring selections",
                              "Final details confirmed before installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Herringbone 7.0 Hybrid Flooring"
                              },
                              {
                                      "label": "Thickness",
                                      "value": "7.0mm"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-herringbone-7mm-fresco-oak-herringbone",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Herringbone 7.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-herringbone-7mm",
              "rangeLabel": "Herringbone 7.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "customerLabel": "Herringbone 7.0 Hybrid Flooring",
              "colour": "Fresco Oak Herringbone",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "7.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-herringbone-7mm/fresco-oak-herringbone.webp",
              "imageUrl": "images/products/hybrid/eco-herringbone-7mm/fresco-oak-herringbone.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-herringbone-7mm/fresco-oak-herringbone.webp"
              ],
              "alt": "Fresco Oak Herringbone Herringbone 7.0 Hybrid Flooring sample",
              "description": "Fresco Oak Herringbone is a hybrid flooring colour from the Herringbone 7.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Herringbone visual style",
                      "Floating floor product range",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Feature areas",
                      "Living rooms",
                      "Apartments",
                      "Renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/fresco-oak-herringbone/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-herringbone-7mm-natural-blackbutt-herringbone",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Herringbone 7.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-herringbone-7mm",
              "rangeLabel": "Herringbone 7.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "customerLabel": "Herringbone 7.0 Hybrid Flooring",
              "colour": "Natural Blackbutt Herringbone",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "7.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-herringbone-7mm/natural-blackbutt-herringbone.webp",
              "imageUrl": "images/products/hybrid/eco-herringbone-7mm/natural-blackbutt-herringbone.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-herringbone-7mm/natural-blackbutt-herringbone.webp"
              ],
              "alt": "Natural Blackbutt Herringbone Herringbone 7.0 Hybrid Flooring sample",
              "description": "Natural Blackbutt Herringbone is a hybrid flooring colour from the Herringbone 7.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Herringbone visual style",
                      "Floating floor product range",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Feature areas",
                      "Living rooms",
                      "Apartments",
                      "Renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/natural-blackbutt-herringbone/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-herringbone-7mm-oak-saffron-herringbone",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Herringbone 7.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-herringbone-7mm",
              "rangeLabel": "Herringbone 7.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "customerLabel": "Herringbone 7.0 Hybrid Flooring",
              "colour": "Oak Saffron Herringbone",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "7.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-herringbone-7mm/oak-saffron-herringbone.webp",
              "imageUrl": "images/products/hybrid/eco-herringbone-7mm/oak-saffron-herringbone.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-herringbone-7mm/oak-saffron-herringbone.webp"
              ],
              "alt": "Oak Saffron Herringbone Herringbone 7.0 Hybrid Flooring sample",
              "description": "Oak Saffron Herringbone is a hybrid flooring colour from the Herringbone 7.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Herringbone visual style",
                      "Floating floor product range",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Feature areas",
                      "Living rooms",
                      "Apartments",
                      "Renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-saffron-herringbone/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-herringbone-7mm-oak-sofia-herringbone",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Herringbone 7.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-herringbone-7mm",
              "rangeLabel": "Herringbone 7.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "customerLabel": "Herringbone 7.0 Hybrid Flooring",
              "colour": "Oak Sofia Herringbone",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "7.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-herringbone-7mm/oak-sofia-herringbone.webp",
              "imageUrl": "images/products/hybrid/eco-herringbone-7mm/oak-sofia-herringbone.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-herringbone-7mm/oak-sofia-herringbone.webp"
              ],
              "alt": "Oak Sofia Herringbone Herringbone 7.0 Hybrid Flooring sample",
              "description": "Oak Sofia Herringbone is a hybrid flooring colour from the Herringbone 7.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Herringbone visual style",
                      "Floating floor product range",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Feature areas",
                      "Living rooms",
                      "Apartments",
                      "Renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/oak-sofia-herringbone/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-herringbone-7mm-select-spotted-gum-herringbone",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Herringbone 7.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-herringbone-7mm",
              "rangeLabel": "Herringbone 7.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-herringbone-7mm-clear-water-beach-herringbone",
              "customerLabel": "Herringbone 7.0 Hybrid Flooring",
              "colour": "Select Spotted Gum Herringbone",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "7.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-herringbone-7mm/select-spotted-gum-herringbone.webp",
              "imageUrl": "images/products/hybrid/eco-herringbone-7mm/select-spotted-gum-herringbone.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-herringbone-7mm/select-spotted-gum-herringbone.webp"
              ],
              "alt": "Select Spotted Gum Herringbone Herringbone 7.0 Hybrid Flooring sample",
              "description": "Select Spotted Gum Herringbone is a hybrid flooring colour from the Herringbone 7.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Herringbone visual style",
                      "Floating floor product range",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Feature areas",
                      "Living rooms",
                      "Apartments",
                      "Renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/select-spotted-gum-herringbone/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-alpine-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Alpine Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/alpine-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/alpine-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/alpine-oak.webp"
              ],
              "alt": "Alpine Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Alpine Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/alpine-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Urban 6.5 Hybrid Flooring is a practical Eco Flooring hybrid range for everyday residential renovations.",
                              "It keeps product choice simple by selecting the range first, with final colour confirmed before installation."
                      ],
                      "featuresIntro": "Urban 6.5 range highlights",
                      "features": [
                              "Waterproof hybrid construction",
                              "Practical colour palette",
                              "Floating installation system",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Urban 6.5 Hybrid Flooring"
                              },
                              {
                                      "label": "Thickness",
                                      "value": "6.5mm"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-urban-6-5mm-black-forest-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Black Forest Oak",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/black-forest-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/black-forest-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/black-forest-oak.webp"
              ],
              "alt": "Black Forest Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Black Forest Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/black-forest-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-classic-blackbutt",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Classic Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/classic-blackbutt.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/classic-blackbutt.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/classic-blackbutt.webp"
              ],
              "alt": "Classic Blackbutt Urban 6.5 Hybrid Flooring sample",
              "description": "Classic Blackbutt is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/classic-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-cotton-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Cotton Oak",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/cotton-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/cotton-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/cotton-oak.webp"
              ],
              "alt": "Cotton Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Cotton Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/cotton-oak-l/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-highland-spotted-gum",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Highland Spotted Gum",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/highland-spotted-gum.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/highland-spotted-gum.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/highland-spotted-gum.webp"
              ],
              "alt": "Highland Spotted Gum Urban 6.5 Hybrid Flooring sample",
              "description": "Highland Spotted Gum is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/highland-spotted-gum/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-ice-sandy-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Ice Sandy Oak",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/ice-sandy-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/ice-sandy-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/ice-sandy-oak.webp"
              ],
              "alt": "Ice Sandy Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Ice Sandy Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/ice-sandy-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-moonlight-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Moonlight Oak",
              "tone": "grey oak",
              "swatch": "#a6a7a1",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/moonlight-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/moonlight-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/moonlight-oak.webp"
              ],
              "alt": "Moonlight Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Moonlight Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/moonlight-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-murray-river-spotted-gum",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Murray River Spotted Gum",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/murray-river-spotted-gum.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/murray-river-spotted-gum.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/murray-river-spotted-gum.webp"
              ],
              "alt": "Murray River Spotted Gum Urban 6.5 Hybrid Flooring sample",
              "description": "Murray River Spotted Gum is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/murray-river-spotted-gum/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-natural-blackbutt",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Natural Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/natural-blackbutt.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/natural-blackbutt.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/natural-blackbutt.webp"
              ],
              "alt": "Natural Blackbutt Urban 6.5 Hybrid Flooring sample",
              "description": "Natural Blackbutt is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/natural-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-seashell-white",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Seashell White",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/seashell-white.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/seashell-white.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/seashell-white.webp"
              ],
              "alt": "Seashell White Urban 6.5 Hybrid Flooring sample",
              "description": "Seashell White is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/seashell-white-l/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-warm-spring-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Warm Spring Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/warm-spring-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/warm-spring-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/warm-spring-oak.webp"
              ],
              "alt": "Warm Spring Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Warm Spring Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/warm-spring-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-urban-6-5mm-weathered-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Urban 6.5 Hybrid Flooring",
              "rangeId": "hybrid-eco-urban-6-5mm",
              "rangeLabel": "Urban 6.5 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-urban-6-5mm-alpine-oak",
              "customerLabel": "Urban 6.5 Hybrid Flooring",
              "colour": "Weathered Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "6.5mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-urban-6-5mm/weathered-oak.webp",
              "imageUrl": "images/products/hybrid/eco-urban-6-5mm/weathered-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-urban-6-5mm/weathered-oak.webp"
              ],
              "alt": "Weathered Oak Urban 6.5 Hybrid Flooring sample",
              "description": "Weathered Oak is a hybrid flooring colour from the Urban 6.5 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Everyday timber-look colours",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Living areas",
                      "Budget-conscious renovations"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/weathered-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-american-hickory",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "American Hickory",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/american-hickory.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/american-hickory.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/american-hickory.webp"
              ],
              "alt": "American Hickory Elite 6.0 Hybrid Flooring sample",
              "description": "American Hickory is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/american-hickory/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Elite 6.0 Hybrid Flooring is an Eco Flooring hybrid range for practical flooring projects that need a clean timber-look finish.",
                              "The quote flow treats the range as the customer selection and allows colour confirmation later."
                      ],
                      "featuresIntro": "Elite 6.0 range highlights",
                      "features": [
                              "Waterproof hybrid construction",
                              "Practical timber-look palette",
                              "Floating installation system",
                              "Colour can be confirmed before final installation"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Elite 6.0 Hybrid Flooring"
                              },
                              {
                                      "label": "Thickness",
                                      "value": "6.0mm"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-elite-6mm-clear-water-beach",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Clear Water Beach",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/clear-water-beach.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/clear-water-beach.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/clear-water-beach.webp"
              ],
              "alt": "Clear Water Beach Elite 6.0 Hybrid Flooring sample",
              "description": "Clear Water Beach is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/clear-water-beach/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-coffee-berry",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Coffee Berry",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/coffee-berry.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/coffee-berry.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/coffee-berry.webp"
              ],
              "alt": "Coffee Berry Elite 6.0 Hybrid Flooring sample",
              "description": "Coffee Berry is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/coffee-berry/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-french-grey",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "French Grey",
              "tone": "grey oak",
              "swatch": "#a6a7a1",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/french-grey.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/french-grey.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/french-grey.webp"
              ],
              "alt": "French Grey Elite 6.0 Hybrid Flooring sample",
              "description": "French Grey is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/french-grey/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-french-sand",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "French Sand",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/french-sand.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/french-sand.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/french-sand.webp"
              ],
              "alt": "French Sand Elite 6.0 Hybrid Flooring sample",
              "description": "French Sand is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/french-sand/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-fresco-oak",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Fresco Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/fresco-oak.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/fresco-oak.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/fresco-oak.webp"
              ],
              "alt": "Fresco Oak Elite 6.0 Hybrid Flooring sample",
              "description": "Fresco Oak is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/fresco-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-miranda-beige",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Miranda Beige",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/miranda-beige.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/miranda-beige.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/miranda-beige.webp"
              ],
              "alt": "Miranda Beige Elite 6.0 Hybrid Flooring sample",
              "description": "Miranda Beige is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/miranda-beige/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-mont-blanc",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Mont Blanc",
              "tone": "timber look",
              "swatch": "#b99268",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/mont-blanc.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/mont-blanc.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/mont-blanc.webp"
              ],
              "alt": "Mont Blanc Elite 6.0 Hybrid Flooring sample",
              "description": "Mont Blanc is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/mont-blanc/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-select-blackbutt",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Select Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/select-blackbutt.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/select-blackbutt.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/select-blackbutt.webp"
              ],
              "alt": "Select Blackbutt Elite 6.0 Hybrid Flooring sample",
              "description": "Select Blackbutt is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/select-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-select-spotted-gum",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Select Spotted Gum",
              "tone": "australian timber",
              "swatch": "#c49a67",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/select-spotted-gum.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/select-spotted-gum.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/select-spotted-gum.webp"
              ],
              "alt": "Select Spotted Gum Elite 6.0 Hybrid Flooring sample",
              "description": "Select Spotted Gum is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/select-spotted-gum/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-silver-lake",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Silver Lake",
              "tone": "grey oak",
              "swatch": "#a6a7a1",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/silver-lake.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/silver-lake.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/silver-lake.webp"
              ],
              "alt": "Silver Lake Elite 6.0 Hybrid Flooring sample",
              "description": "Silver Lake is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/silver-lake/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-elite-6mm-washed-blackbutt",
              "category": "hybrid",
              "brand": "Ornato Hybrid",
              "range": "Elite 6.0 Hybrid Flooring",
              "rangeId": "hybrid-eco-elite-6mm",
              "rangeLabel": "Elite 6.0 Hybrid Flooring",
              "selectionMode": "range_only",
              "representativeProductId": "eco-eco-elite-6mm-american-hickory",
              "customerLabel": "Elite 6.0 Hybrid Flooring",
              "colour": "Washed Blackbutt",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "6.0mm",
              "productType": "Hybrid Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/hybrid/eco-elite-6mm/washed-blackbutt.webp",
              "imageUrl": "images/products/hybrid/eco-elite-6mm/washed-blackbutt.webp",
              "galleryImages": [
                      "images/products/hybrid/eco-elite-6mm/washed-blackbutt.webp"
              ],
              "alt": "Washed Blackbutt Elite 6.0 Hybrid Flooring sample",
              "description": "Washed Blackbutt is a hybrid flooring colour from the Elite 6.0 Hybrid Flooring range.",
              "features": [
                      "Waterproof hybrid flooring",
                      "Compact board format",
                      "Floating click installation",
                      "Colour can be confirmed later"
              ],
              "suitableFor": [
                      "Apartments",
                      "Bedrooms",
                      "Rental renovations",
                      "Living areas"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/washed-blackbutt/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      }
    ],
    engineered: [
      {
        id: "eco-swish-oak-natura-ambient-sand",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Ambient Sand",
        tone: "light beige",
        swatch: "#d8c2ac",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/ambient-sand.jpg",
        alt: "Swish Oak Natura Ambient Sand engineered timber swatch",
        description: "Ambient Sand is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/ambient-sand/"
      },
      {
        id: "eco-swish-oak-natura-belfort-oak",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Belfort Oak",
        tone: "warm oak",
        swatch: "#b18d6b",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/belfort-oak.jpg",
        alt: "Swish Oak Natura Belfort Oak engineered timber swatch",
        description: "Belfort Oak is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/belfort-oak/"
      },
      {
        id: "eco-swish-oak-natura-canyon-oak",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Canyon Oak",
        tone: "mid oak",
        swatch: "#a98059",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/canyon-oak.jpg",
        alt: "Swish Oak Natura Canyon Oak engineered timber swatch",
        description: "Canyon Oak is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/canyon-oak/"
      },
      {
        id: "eco-swish-oak-natura-danish-white",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Danish White",
        tone: "light oak",
        swatch: "#d9d2c3",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/danish-white.jpg",
        alt: "Swish Oak Natura Danish White engineered timber swatch",
        description: "Danish White is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/danish-white/"
      },
      {
        id: "eco-swish-oak-natura-fiano-brown",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Fiano Brown",
        tone: "walnut",
        swatch: "#8b6344",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/fiano-brown.jpg",
        alt: "Swish Oak Natura Fiano Brown engineered timber swatch",
        description: "Fiano Brown is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/fiano-brown/"
      },
      {
        id: "eco-swish-oak-natura-french-carbon",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "French Carbon",
        tone: "charcoal",
        swatch: "#655e57",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/french-carbon.jpg",
        alt: "Swish Oak Natura French Carbon engineered timber swatch",
        description: "French Carbon is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-carbon/"
      },
      {
        id: "eco-swish-oak-natura-french-ghost",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "French Ghost",
        tone: "grey oak",
        swatch: "#a2988f",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/french-ghost.jpg",
        alt: "Swish Oak Natura French Ghost engineered timber swatch",
        description: "French Ghost is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-ghost/"
      },
      {
        id: "eco-swish-oak-natura-french-natural",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "French Natural",
        tone: "natural oak",
        swatch: "#c4a37e",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/french-natural.jpg",
        alt: "Swish Oak Natura French Natural engineered timber swatch",
        description: "French Natural is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-natural/"
      },
      {
        id: "eco-swish-oak-natura-nordic-limed",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Nordic Limed",
        tone: "limed oak",
        swatch: "#d7d0c3",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/nordic-limed.jpg",
        alt: "Swish Oak Natura Nordic Limed engineered timber swatch",
        description: "Nordic Limed is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/nordic-limed/"
      },
      {
        id: "eco-swish-oak-natura-nordic-spring",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Nordic Spring",
        tone: "pale oak",
        swatch: "#d6c9b7",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/nordic-spring.jpg",
        alt: "Swish Oak Natura Nordic Spring engineered timber swatch",
        description: "Nordic Spring is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/nordic-spring/"
      },
      {
        id: "eco-swish-oak-natura-oak-dove-grey",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Oak Dove Grey",
        tone: "dove grey",
        swatch: "#b4ada4",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/oak-dove-grey.jpg",
        alt: "Swish Oak Natura Oak Dove Grey engineered timber swatch",
        description: "Oak Dove Grey is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/oak-dove-grey/"
      },
      {
        id: "eco-swish-oak-natura-oak-grey-harmony",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Oak Grey Harmony",
        tone: "grey brown",
        swatch: "#9f8d7e",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/oak-grey-harmony.jpg",
        alt: "Swish Oak Natura Oak Grey Harmony engineered timber swatch",
        description: "Oak Grey Harmony is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/oak-grey-harmony/"
      },
      {
        id: "eco-swish-oak-natura-odense-grey",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Odense Grey",
        tone: "soft grey",
        swatch: "#b7aea4",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/odense-grey.jpg",
        alt: "Swish Oak Natura Odense Grey engineered timber swatch",
        description: "Odense Grey is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/odense-grey/"
      },
      {
        id: "eco-swish-oak-natura-oyster-grey",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Oyster Grey",
        tone: "light grey",
        swatch: "#c4bdb2",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/oyster-grey.jpg",
        alt: "Swish Oak Natura Oyster Grey engineered timber swatch",
        description: "Oyster Grey is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/oyster-grey/"
      },
      {
        id: "eco-swish-oak-natura-raw-caramel",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Raw Caramel",
        tone: "caramel oak",
        swatch: "#b4855f",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/raw-caramel.jpg",
        alt: "Swish Oak Natura Raw Caramel engineered timber swatch",
        description: "Raw Caramel is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/raw-caramel/"
      },
      {
        id: "eco-swish-oak-natura-raw-leaf",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura",
        colour: "Raw Leaf",
        tone: "muted brown",
        swatch: "#a28f73",
        thickness: "14/3mm",
        productType: "Engineered Timber",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura/raw-leaf.jpg",
        alt: "Swish Oak Natura Raw Leaf engineered timber swatch",
        description: "Raw Leaf is an engineered timber colour from the Swish Oak Natura range.",
        features: ["Multidirectional constructed engineered board", "French oak veneer", "Pre-finished surface", "Compatible with underfloor heating"],
        suitableFor: ["Living areas", "Bedrooms", "Apartments", "Premium renovations", "Family homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/raw-leaf/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-ambient-sand",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "Ambient Sand Herringbone",
        tone: "light beige",
        swatch: "#d8c2ac",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/ambient-sand.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/ambient-sand.jpg"
        ],
        alt: "Swish Oak Natura Herringbone Ambient Sand engineered timber swatch",
        description: "Ambient Sand Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/ambient-sand-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-danish-white",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "Danish White Herringbone",
        tone: "light oak",
        swatch: "#d9d2c3",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/danish-white.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/danish-white.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/danish-white-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone Danish White engineered timber swatch",
        description: "Danish White Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/danish-white-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-fiano-brown",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "Fiano Brown Herringbone",
        tone: "walnut",
        swatch: "#8b6344",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/fiano-brown.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/fiano-brown.jpg"
        ],
        alt: "Swish Oak Natura Herringbone Fiano Brown engineered timber swatch",
        description: "Fiano Brown Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/fiano-brown-heringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-french-carbon",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "French Carbon Herringbone",
        tone: "charcoal",
        swatch: "#655e57",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/french-carbon.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-carbon.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-carbon-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone French Carbon engineered timber swatch",
        description: "French Carbon Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-carbon-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-french-ghost",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "French Ghost Herringbone",
        tone: "grey oak",
        swatch: "#a2988f",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/french-ghost.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-ghost.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-ghost-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone French Ghost engineered timber swatch",
        description: "French Ghost Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-ghost-herringbone/"
      },
      {
        id: "eco-swish-oak-natura-herringbone-french-natural",
        category: "engineered",
        brand: "Eco Flooring",
        range: "Swish Oak Natura Herringbone",
        colour: "French Natural Herringbone",
        tone: "natural oak",
        swatch: "#c4a37e",
        thickness: "14/3mm",
        productType: "Engineered Timber Herringbone",
        pricePerM2: 0,
        installRate: null,
        image: "images/products/engineered-timber/swish-oak-natura-herringbone/french-natural.jpg",
        galleryImages: [
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-natural.jpg",
          "images/products/engineered-timber/swish-oak-natura-herringbone/french-natural-gallery-2.jpg"
        ],
        alt: "Swish Oak Natura Herringbone French Natural engineered timber swatch",
        description: "French Natural Herringbone is an engineered timber colour from the Swish Oak Natura Herringbone range.",
        features: ["Engineered French oak herringbone construction", "Pre-finished surface", "Glue-down installation", "Premium statement pattern"],
        suitableFor: ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        supplier: "Eco Flooring Systems",
        supplierUrl: "https://ecoflooring.com.au/product/french-natural-heringbone/"
      },
      {
        "id": "topdeck-pacific-blackbutt-ab",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Foreign Species",
        "colour": "Pacific Blackbutt",
        "tone": "warm brown",
        "swatch": "#cd865a",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-blackbutt-ab.webp",
        "alt": "Pacific Blackbutt engineered timber swatch",
        "description": "With golden honey tones touched by subtle pinkish hues, Pacific Blackbutt radiates warmth and natural elegance. Its clean grain and inviting finish create a timeless foundation for bright, open spaces.",
        "features": ["International hardwood visuals with tight grain and richer variation.", "Engineered timber construction for a more stable floor than solid boards in changing conditions.", "Tongue and groove profile for traditional installation methods.", "Suitable for premium residential interiors that want a more distinctive hardwood look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/pacific-blackbutt-ab",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-blackbutt-ab.webp", "images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-blackbutt-ab-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-blackbutt-ab-gallery-3.webp"]
      },
      {
        "id": "topdeck-pacific-spotted-gum-ab",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Foreign Species",
        "colour": "Pacific Spotted Gum",
        "tone": "warm brown",
        "swatch": "#b57342",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-spotted-gum-ab.webp",
        "alt": "Pacific Spotted Gum engineered timber swatch",
        "description": "Blending earthy browns with soft blonde, Pacific Spotted Gum offers striking natural variation in tone and grain. Its rich character brings warmth and depth, making it a standout feature in both modern and traditional interiors.",
        "features": ["International hardwood visuals with tight grain and richer variation.", "Engineered timber construction for a more stable floor than solid boards in changing conditions.", "Tongue and groove profile for traditional installation methods.", "Suitable for premium residential interiors that want a more distinctive hardwood look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Feature interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/pacific-spotted-gum-ab",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-spotted-gum-ab.webp", "images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-spotted-gum-ab-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-foreign-species/pacific-spotted-gum-ab-gallery-3.webp"]
      },
      {
        "id": "topdeck-blackbutt-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Blackbutt (136mm)",
        "tone": "natural oak",
        "swatch": "#d89669",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/blackbutt-136mm.webp",
        "alt": "Blackbutt (136mm) engineered timber swatch",
        "description": "Golden to pale brown tones with a clean, straight grain give Blackbutt a light and contemporary appeal. Its natural warmth makes it an ideal choice for bright, open interiors.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/blackbutt-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/blackbutt-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/blackbutt-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/blackbutt-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-brushbox-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Brushbox (136mm)",
        "tone": "dark brown",
        "swatch": "#935843",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/brushbox-136mm.webp",
        "alt": "Brushbox (136mm) engineered timber swatch",
        "description": "With deep reddish-brown hues and a fine, even texture, Brushbox delivers rich sophistication. Its smooth finish adds a touch of elegance to both modern and classic spaces.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/brushbox-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/brushbox-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/brushbox-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/brushbox-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-grey-iron-bark-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Grey Iron Bark (136mm)",
        "tone": "dark brown",
        "swatch": "#864e38",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/grey-iron-bark-136mm.webp",
        "alt": "Grey Iron Bark (136mm) engineered timber swatch",
        "description": "Strong and striking, Grey Iron Bark blends dark browns with deep reds for a bold, dramatic effect. Its rich variation creates a floor full of strength and character.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/grey-iron-bark-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/grey-iron-bark-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/grey-iron-bark-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/grey-iron-bark-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-jarrah-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Jarrah (136mm)",
        "tone": "dark brown",
        "swatch": "#723225",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/jarrah-136mm.webp",
        "alt": "Jarrah (136mm) engineered timber swatch",
        "description": "Renowned for its vibrant red tones and distinctive grain, Jarrah brings warmth and intensity to interiors. This iconic timber makes a confident design statement.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/jarrah-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/jarrah-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/jarrah-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/jarrah-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-spotted-gum-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Spotted Gum (136mm)",
        "tone": "warm brown",
        "swatch": "#976140",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/spotted-gum-136mm.webp",
        "alt": "Spotted Gum (136mm) engineered timber swatch",
        "description": "Earthy browns and subtle greys combine in Spotted Gum, creating a floor with natural variation and depth. Its dynamic tones make it versatile and full of character.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/spotted-gum-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/spotted-gum-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/spotted-gum-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/spotted-gum-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-sydney-blue-gum-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Sydney Blue Gum (136mm)",
        "tone": "warm brown",
        "swatch": "#efa892",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/sydney-blue-gum-136mm.webp",
        "alt": "Sydney Blue Gum (136mm) engineered timber swatch",
        "description": "Warm pinks and soft reds give Sydney Blue Gum a rich, inviting presence. Its lively colour and natural grain make it a timeless Australian favourite.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/sydney-blue-gum-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/sydney-blue-gum-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/sydney-blue-gum-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/sydney-blue-gum-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-tasmanian-oak-136mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 136mm",
        "colour": "Tasmanian Oak (136mm)",
        "tone": "warm brown",
        "swatch": "#b7805f",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/tasmanian-oak-136mm.webp",
        "alt": "Tasmanian Oak (136mm) engineered timber swatch",
        "description": "Soft, pale hues with subtle grain detail give Tasmanian Oak a gentle and versatile finish. Perfect for light-filled interiors, it adds understated warmth and elegance.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, Sydney Blue Gum, and Tasmanian Oak.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "136mm board format suited to traditional and transitional interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/tasmanian-oak-136mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-136mm/tasmanian-oak-136mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/tasmanian-oak-136mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-136mm/tasmanian-oak-136mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-blackbutt-190mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 190mm",
        "colour": "Blackbutt (190mm)",
        "tone": "natural oak",
        "swatch": "#d89669",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/blackbutt-190mm.webp",
        "alt": "Blackbutt (190mm) engineered timber swatch",
        "description": "Golden to pale brown tones with a clean, straight grain give Blackbutt a light and contemporary appeal. Its natural warmth makes it an ideal choice for bright, open interiors.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/blackbutt-190mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-190mm/blackbutt-190mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/blackbutt-190mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/blackbutt-190mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-brushbox-190mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 190mm",
        "colour": "Brushbox (190mm)",
        "tone": "dark brown",
        "swatch": "#935843",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/brushbox-190mm.webp",
        "alt": "Brushbox (190mm) engineered timber swatch",
        "description": "With deep reddish-brown hues and a fine, even texture, Brushbox delivers rich sophistication. Its smooth finish adds a touch of elegance to both modern and classic spaces.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/brushbox-190mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-190mm/brushbox-190mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/brushbox-190mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/brushbox-190mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-grey-iron-bark-190mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 190mm",
        "colour": "Grey Iron Bark (190mm)",
        "tone": "dark brown",
        "swatch": "#864e38",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/grey-iron-bark-190mm.webp",
        "alt": "Grey Iron Bark (190mm) engineered timber swatch",
        "description": "Strong and striking, Grey Iron Bark blends dark browns with deep reds for a bold, dramatic effect. Its rich variation creates a floor full of strength and character.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/grey-iron-bark-190mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-190mm/grey-iron-bark-190mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/grey-iron-bark-190mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/grey-iron-bark-190mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-jarrah-190mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 190mm",
        "colour": "Jarrah (190mm)",
        "tone": "dark brown",
        "swatch": "#723225",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/jarrah-190mm.webp",
        "alt": "Jarrah (190mm) engineered timber swatch",
        "description": "Renowned for its vibrant red tones and distinctive grain, Jarrah brings warmth and intensity to interiors. This iconic timber makes a confident design statement.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/jarrah-190mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-190mm/jarrah-190mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/jarrah-190mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/jarrah-190mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-spotted-gum-190mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 190mm",
        "colour": "Spotted Gum (190mm)",
        "tone": "warm brown",
        "swatch": "#976140",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/spotted-gum-190mm.webp",
        "alt": "Spotted Gum (190mm) engineered timber swatch",
        "description": "Earthy browns and subtle greys combine in Spotted Gum, creating a floor with natural variation and depth. Its dynamic tones make it versatile and full of character.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/spotted-gum-190mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-190mm/spotted-gum-190mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/spotted-gum-190mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/spotted-gum-190mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-sydney-blue-gum-190mm",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Australian Species 190mm",
        "colour": "Sydney Blue Gum (190mm)",
        "tone": "warm brown",
        "swatch": "#efa892",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/sydney-blue-gum-190mm.webp",
        "alt": "Sydney Blue Gum (190mm) engineered timber swatch",
        "description": "Warm pinks and soft reds give Sydney Blue Gum a rich, inviting presence. Its lively colour and natural grain make it a timeless Australian favourite.",
        "features": ["Classic Australian species including Blackbutt, Brushbox, Grey Iron Bark, Jarrah, Spotted Gum, and Sydney Blue Gum.", "Pre-finished boards with Treffert matt lacquer and Standard & Better grade timber visuals.", "5G Licensed Click System for faster floating-floor installation.", "190mm wide-plank format designed to create a broader, more spacious look."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Family homes", "Designer interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/sydney-blue-gum-190mm",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-australian-190mm/sydney-blue-gum-190mm.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/sydney-blue-gum-190mm-gallery-2.webp", "images/products/engineered-timber/topdeck-wooden-land-australian-190mm/sydney-blue-gum-190mm-gallery-3.webp"]
      },
      {
        "id": "topdeck-blackbutt-hb",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Herringbone",
        "colour": "Blackbutt (Herringbone)",
        "tone": "natural oak",
        "swatch": "#c19773",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-herringbone/blackbutt-hb.webp",
        "alt": "Blackbutt (Herringbone) engineered timber swatch",
        "description": "Blending earthy browns with soft blonde, Pacific Spotted Gum offers striking natural variation in tone and grain. Its rich character brings warmth and depth, making it a standout feature in both modern and traditional interiors.",
        "features": ["Australian hardwood species presented in a classic herringbone layout.", "Engineered construction designed for improved dimensional stability over solid timber.", "5G Licensed Click System for a modern floating-floor herringbone installation.", "Statement pattern flooring for premium residential spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/blackbutt-hb",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-herringbone/blackbutt-hb.webp", "images/products/engineered-timber/topdeck-wooden-land-herringbone/blackbutt-hb-gallery-2.webp"]
      },
      {
        "id": "topdeck-spotted-gum-hb",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Wooden-Land Herringbone",
        "colour": "Spotted Gum (Herringbone)",
        "tone": "warm brown",
        "swatch": "#8b654e",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-wooden-land-herringbone/spotted-gum-hb.webp",
        "alt": "Spotted Gum (Herringbone) engineered timber swatch",
        "description": "Rich earthy browns with subtle grey undertones bring depth and movement to Spotted Gum Herringbone. Its bold variation pairs beautifully with the timeless geometry of the pattern.",
        "features": ["Australian hardwood species presented in a classic herringbone layout.", "Engineered construction designed for improved dimensional stability over solid timber.", "5G Licensed Click System for a modern floating-floor herringbone installation.", "Statement pattern flooring for premium residential spaces."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/spotted-gum-hb",
        "galleryImages": ["images/products/engineered-timber/topdeck-wooden-land-herringbone/spotted-gum-hb.webp", "images/products/engineered-timber/topdeck-wooden-land-herringbone/spotted-gum-hb-gallery-2.webp"]
      },
      {
        "id": "topdeck-project-oak-black-amber",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Black Amber",
        "tone": "charcoal",
        "swatch": "#333333",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-black-amber.webp",
        "alt": "Black Amber engineered timber swatch",
        "description": "Add flair to your home and give your room a luxurious appearance with dark flooring. Contrast this with bright colours on your walls and ceiling to create a strong eye-catching effect.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-black-amber",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-black-amber.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-black-amber-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-black-amber-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-charleston-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Charleston Oak",
        "tone": "warm brown",
        "swatch": "#8d7655",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-charleston-oak.webp",
        "alt": "Charleston Oak engineered timber swatch",
        "description": "Elegant textures flow across each plank, shaping spaces with inviting warmth and effortless style.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-charleston-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-charleston-oak.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-charleston-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-project-oak-chateau",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Chateau",
        "tone": "natural oak",
        "swatch": "#bfa47d",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-chateau.webp",
        "alt": "Chateau engineered timber swatch",
        "description": "Remain traditional with Ch\u00e2teau. A classic and timeless tone that hints subtle luxury.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-chateau",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-chateau.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-chateau-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-chateau-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-florence-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Florence Oak",
        "tone": "warm brown",
        "swatch": "#8b6b4a",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-florence-oak.webp",
        "alt": "Florence Oak engineered timber swatch",
        "description": "Rich earthy tones and subtle grain details infuse interiors with depth, creating a warm and sophisticated atmosphere.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-florence-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-florence-oak.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-florence-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-project-oak-hamilton-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Hamilton Oak",
        "tone": "warm brown",
        "swatch": "#927a68",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-hamilton-oak.webp",
        "alt": "Hamilton Oak engineered timber swatch",
        "description": "Showcasing graceful wood textures, Hamilton Oak blends classic character with contemporary sophistication for versatile interior appeal.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-hamilton-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-hamilton-oak.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-hamilton-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-project-oak-marrone-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Marrone Oak",
        "tone": "warm brown",
        "swatch": "#7a6c5c",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-marrone-oak.webp",
        "alt": "Marrone Oak engineered timber swatch",
        "description": "Exuding a modern feel, this light brown oak gives any space a natural and contemporary feeling.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-marrone-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-marrone-oak.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-marrone-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-marrone-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-pearl-white",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Pearl White",
        "tone": "natural oak",
        "swatch": "#bbafa4",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-pearl-white.webp",
        "alt": "Pearl White engineered timber swatch",
        "description": "Vivacious, pure, & timeless. Add a touch of brightness, space and light to the room with this contemporary tone.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-pearl-white",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-pearl-white.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-pearl-white-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-pearl-white-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-prague-natural",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Prague Natural",
        "tone": "warm brown",
        "swatch": "#aa9879",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-prague-natural.webp",
        "alt": "Prague Natural engineered timber swatch",
        "description": "Opt for a more classic flooring style in your pursuit of a more natural feel.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-prague-natural",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-prague-natural.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-prague-natural-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-prague-natural-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-rome-grey",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Rome Grey",
        "tone": "dark brown",
        "swatch": "#332c27",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-rome-grey.webp",
        "alt": "Rome Grey engineered timber swatch",
        "description": "Inspired by the Loft Style living of New York simultaneous with the Linen finishes of English Manor houses.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-rome-grey",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-rome-grey.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-rome-grey-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-rome-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-vintage-mocha",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Vintage Mocha",
        "tone": "warm brown",
        "swatch": "#6b4f2f",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-vintage-mocha.webp",
        "alt": "Vintage Mocha engineered timber swatch",
        "description": "This deeply smoked brown oak collection radiates warmth and depth, giving a sophisticated feel that expresses imagination.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-vintage-mocha",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-vintage-mocha.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-vintage-mocha-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-vintage-mocha-gallery-3.webp"]
      },
      {
        "id": "topdeck-project-oak-whealdon-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Whealdon Oak",
        "tone": "warm brown",
        "swatch": "#77624d",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-whealdon-oak.webp",
        "alt": "Whealdon Oak engineered timber swatch",
        "description": "Embracing gentle natural hues, Whealdon Oak offers a refined balance of warmth and timeless modern elegance.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-whealdon-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-whealdon-oak.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-whealdon-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-project-oak-winston-hill",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Project Oak",
        "colour": "Winston Hill",
        "tone": "natural oak",
        "swatch": "#bcaf9d",
        "thickness": "14/2mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-project-oak/project-oak-winston-hill.webp",
        "alt": "Winston Hill engineered timber swatch",
        "description": "Balmy, fun & optimistic. Create a peaceful atmosphere whilst illuminating a dark room with light oak flooring.",
        "features": ["European oak plank range designed for both classic and contemporary interiors.", "Plank format with tongue and groove construction for traditional installation methods.", "Warm natural oak visuals across light, mid, grey, and deeper smoked tones.", "Suitable for premium residential and architect-led timber flooring selections."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Architectural interiors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/project-oak-winston-hill",
        "galleryImages": ["images/products/engineered-timber/topdeck-project-oak/project-oak-winston-hill.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-winston-hill-gallery-2.webp", "images/products/engineered-timber/topdeck-project-oak/project-oak-winston-hill-gallery-3.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-black-amber",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Black Amber",
        "tone": "charcoal",
        "swatch": "#333333",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-black-amber.webp",
        "alt": "Black Amber engineered timber swatch",
        "description": "Add flair to your home and give your room a luxurious appearance with dark flooring. Contrast this with bright colours on your walls and ceiling to create a strong eye-catching effect.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-black-amber",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-black-amber.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-black-amber-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-boathouse",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Boathouse",
        "tone": "natural oak",
        "swatch": "#b7987c",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-boathouse.webp",
        "alt": "Boathouse engineered timber swatch",
        "description": "Rich in character, Boathouse blends warm, rustic tones with a natural oak texture. It evokes a welcoming charm, suited to both coastal and country-inspired spaces.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-boathouse",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-boathouse.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-boathouse-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-chateau",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Chateau",
        "tone": "natural oak",
        "swatch": "#c3a881",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-chateau.webp",
        "alt": "Chateau engineered timber swatch",
        "description": "Remain traditional with Ch\u00e2teau. A classic and timeless tone that hints subtle luxury",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-chateau",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-chateau.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-chateau-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-marrone-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Marrone Oak",
        "tone": "warm brown",
        "swatch": "#7a6c5c",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-marrone-oak.webp",
        "alt": "Marrone Oak engineered timber swatch",
        "description": "Exuding a modern feel, this light brown oak gives any space a natural and contemporary feeling.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-marrone-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-marrone-oak.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-marrone-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-monica-grey",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Monica Grey",
        "tone": "warm brown",
        "swatch": "#8d7661",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-monica-grey.webp",
        "alt": "Monica Grey engineered timber swatch",
        "description": "With muted grey undertones, Monica Grey offers a sophisticated balance of modern style and natural oak detail. A versatile choice that complements both bold and neutral palettes.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-monica-grey",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-monica-grey.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-monica-grey-gallery-2.webp"]
      },
      {
        "id": "topdeck-panania-oak-1",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Panania Oak",
        "tone": "natural oak",
        "swatch": "#b3a593",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/panania-oak-1.webp",
        "alt": "Panania Oak engineered timber swatch",
        "description": "A soft, light-toned oak that brightens interiors with a fresh and modern appeal. Its subtle grain creates a calm, airy atmosphere, perfect for contemporary living.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/panania-oak-1",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/panania-oak-1.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/panania-oak-1-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-pearl-white",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Pearl White",
        "tone": "natural oak",
        "swatch": "#b9ada2",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-pearl-white.webp",
        "alt": "Pearl White engineered timber swatch",
        "description": "Vivacious, pure, & timeless. Add a touch of brightness, space and light to the room with this contemporary tone.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-pearl-white",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-pearl-white.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-pearl-white-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-prague-natural",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Prague Natural",
        "tone": "warm brown",
        "swatch": "#aa9779",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-prague-natural.webp",
        "alt": "Prague Natural engineered timber swatch",
        "description": "Opt for a more classic flooring style in your pursuit of a more natural feel.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-prague-natural",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-prague-natural.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-prague-natural-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-rome-grey",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Rome Grey",
        "tone": "dark brown",
        "swatch": "#362f29",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-rome-grey.webp",
        "alt": "Rome Grey engineered timber swatch",
        "description": "Inspired by the Loft Style living of New York simultaneous with the Linen finishes of English Manor houses.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-rome-grey",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-rome-grey.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-rome-grey-gallery-2.webp"]
      },
      {
        "id": "topdeck-soft-pale-oak-1",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Soft Pale Oak",
        "tone": "warm brown",
        "swatch": "#b09c93",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/soft-pale-oak-1.webp",
        "alt": "Soft Pale Oak engineered timber swatch",
        "description": "Delicate and understated, this pale oak finish delivers a natural warmth with timeless versatility. Ideal for interiors seeking a light and relaxed aesthetic.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/soft-pale-oak-1",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/soft-pale-oak-1.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/soft-pale-oak-1-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-vintage-mocha",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Vintage Mocha",
        "tone": "warm brown",
        "swatch": "#6b4f2e",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-vintage-mocha.webp",
        "alt": "Vintage Mocha engineered timber swatch",
        "description": "This deeply smoked brown oak collection radiates warmth and depth, giving a sophisticated feel that expresses imagination.",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-vintage-mocha",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-vintage-mocha.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-vintage-mocha-gallery-2.webp"]
      },
      {
        "id": "topdeck-castel-nuovo-herringbone-winston-hill",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Castel Nuovo Herringbone",
        "colour": "Winston Hill",
        "tone": "natural oak",
        "swatch": "#c1b097",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Herringbone",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-winston-hill.webp",
        "alt": "Winston Hill engineered timber swatch",
        "description": "Balmy, fun & optimistic. Create a peaceful atmosphere whilst illuminating a dark room with light oak flooring",
        "features": ["French-inspired herringbone design in European oak.", "Brushed surface and UV ultra-matte lacquer for a more natural tactile finish.", "Left and right tongue profiles for traditional herringbone layout installation.", "Ideal for premium heritage-style and modern statement interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/castel-nuovo-herringbone-winston-hill",
        "galleryImages": ["images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-winston-hill.webp", "images/products/engineered-timber/topdeck-castel-nuovo-herringbone/castel-nuovo-herringbone-winston-hill-gallery-2.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-amaretti-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Amaretti Oak",
        "tone": "warm brown",
        "swatch": "#9a8c82",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-amaretti-oak.webp",
        "alt": "Amaretti Oak engineered timber swatch",
        "description": "Warm brown shades with a gentle grey undertone give Amaretti Oak a natural, classic elegance that suits every interior.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-amaretti-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-amaretti-oak.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-amaretti-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-amaretti-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-boathouse",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Boathouse",
        "tone": "warm brown",
        "swatch": "#927966",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-boathouse.webp",
        "alt": "Boathouse engineered timber swatch",
        "description": "Light brown with coastal-inspired ashiness, Boathouse evokes laid-back charm and a sense of rustic simplicity.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-boathouse",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-boathouse.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-boathouse-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-boathouse-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-british-oak-natural",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "British Oak Natural",
        "tone": "warm brown",
        "swatch": "#9e8568",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-british-oak-natural.webp",
        "alt": "British Oak Natural engineered timber swatch",
        "description": "Natural honey-brown tones showcase traditional oak character, creating a timeless and welcoming foundation.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-british-oak-natural",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-british-oak-natural.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-british-oak-natural-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-british-oak-natural-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-camden-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Camden Oak",
        "tone": "dark brown",
        "swatch": "#2e251f",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-camden-oak.webp",
        "alt": "Camden Oak engineered timber swatch",
        "description": "Dark chocolate tones with striking grain detail give Camden Oak a dramatic, luxurious presence.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-camden-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-camden-oak.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-camden-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-camden-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-champagne",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Champagne",
        "tone": "warm brown",
        "swatch": "#9f8b69",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-champagne.webp",
        "alt": "Champagne engineered timber swatch",
        "description": "Creamy golden tones brighten interiors with an inviting warmth, adding effortless charm to any setting.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-champagne",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-champagne.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-champagne-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-champagne-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-cromer-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Cromer Oak",
        "tone": "mid oak",
        "swatch": "#a29781",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-cromer-oak.webp",
        "alt": "Cromer Oak engineered timber swatch",
        "description": "A soft blonde oak with subtle grunge undertones, offering a refined yet contemporary look for modern spaces.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-cromer-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-cromer-oak.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-cromer-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-cromer-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-limed-ash",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Limed Ash",
        "tone": "warm brown",
        "swatch": "#795c36",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-limed-ash.webp",
        "alt": "Limed Ash engineered timber swatch",
        "description": "A pale ash tone washed with soft lime accents delivers a relaxed, timeless aesthetic with natural character.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-limed-ash",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-limed-ash.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-limed-ash-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-limed-ash-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-monica-grey",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Monica Grey",
        "tone": "warm brown",
        "swatch": "#85705e",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-monica-grey.webp",
        "alt": "Monica Grey engineered timber swatch",
        "description": "Soft grey oak with muted dark contrasts offers a modern, versatile finish that adapts beautifully to any palette.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-monica-grey",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-monica-grey.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-monica-grey-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-monica-grey-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-oyster-bay",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Oyster Bay",
        "tone": "warm brown",
        "swatch": "#8c7758",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-oyster-bay.webp",
        "alt": "Oyster Bay engineered timber swatch",
        "description": "A rich honey shade that balances warmth with elegance, Oyster Bay complements both modern and classic furnishings.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-oyster-bay",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-oyster-bay.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-oyster-bay-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-oyster-bay-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-panania-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Panania Oak",
        "tone": "natural oak",
        "swatch": "#a69583",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-panania-oak.webp",
        "alt": "Panania Oak engineered timber swatch",
        "description": "Light grey hues lifted with subtle white undertones bring a fresh, airy softness to modern spaces.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-panania-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-panania-oak.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-panania-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-panania-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-soft-pale-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Soft Pale Oak",
        "tone": "warm brown",
        "swatch": "#ab9488",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-soft-pale-oak.webp",
        "alt": "Soft Pale Oak engineered timber swatch",
        "description": "Delicate reddish-brown notes blend with pale warmth, offering a versatile finish that feels both rich and refined.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-soft-pale-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-soft-pale-oak.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-soft-pale-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-soft-pale-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-lavanda-oak-truffle-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Lavanda Oak",
        "colour": "Truffle Oak",
        "tone": "warm brown",
        "swatch": "#675947",
        "thickness": "14/3mm",
        "productType": "Engineered Timber",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-truffle-oak.webp",
        "alt": "Truffle Oak engineered timber swatch",
        "description": "Deep brown hues with distinctive graining bring bold sophistication, ideal for statement interiors.",
        "features": ["Brushed European oak planks with UV ultra-matte lacquer and Sherwin-Williams coating.", "Supplier-backed scratch resistance and 48-hour water protection.", "Stable multi-ply core construction compatible with heated subfloors.", "Matching accessories available for more complete project detailing."],
        "suitableFor": ["Living areas", "Bedrooms", "Premium renovations", "Designer homes", "Heated subfloors"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/lavanda-oak-truffle-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-truffle-oak.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-truffle-oak-gallery-2.webp", "images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-truffle-oak-gallery-3.webp"]
      },
      {
        "id": "topdeck-amaretti-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Amaretti Oak",
        "tone": "warm brown",
        "swatch": "#9c8e83",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/amaretti-oak.webp",
        "alt": "Amaretti Oak engineered timber swatch",
        "description": "Warm brown shades with a gentle grey undertone give Amaretti Oak a natural, classic elegance that suits every interior.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/amaretti-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/amaretti-oak.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/amaretti-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-boathouse",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Boathouse",
        "tone": "warm brown",
        "swatch": "#977f6b",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/boathouse.webp",
        "alt": "Boathouse engineered timber swatch",
        "description": "Light brown with coastal-inspired ashiness, Boathouse evokes laid-back charm and a sense of rustic simplicity.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/boathouse",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/boathouse.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/boathouse-gallery-2.webp"]
      },
      {
        "id": "topdeck-british-oak-natural",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "British Oak Natural",
        "tone": "warm brown",
        "swatch": "#9c8468",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/british-oak-natural.webp",
        "alt": "British Oak Natural engineered timber swatch",
        "description": "Natural honey-brown tones showcase traditional oak character, creating a timeless and welcoming foundation.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/british-oak-natural",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/british-oak-natural.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/british-oak-natural-gallery-2.webp"]
      },
      {
        "id": "topdeck-camden-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Camden Oak",
        "tone": "dark brown",
        "swatch": "#2e251e",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/camden-oak.webp",
        "alt": "Camden Oak engineered timber swatch",
        "description": "Dark chocolate tones with striking grain detail give Camden Oak a dramatic, luxurious presence.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/camden-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/camden-oak.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/camden-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-champagne",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Champagne",
        "tone": "warm brown",
        "swatch": "#a18d6a",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/champagne.webp",
        "alt": "Champagne engineered timber swatch",
        "description": "Creamy golden tones brighten interiors with an inviting warmth, adding effortless charm to any setting.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/champagne",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/champagne.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/champagne-gallery-2.webp"]
      },
      {
        "id": "topdeck-cromer-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Cromer Oak",
        "tone": "mid oak",
        "swatch": "#a59a84",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/cromer-oak.webp",
        "alt": "Cromer Oak engineered timber swatch",
        "description": "A soft blonde oak with subtle grunge undertones, offering a refined yet contemporary look for modern spaces.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/cromer-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/cromer-oak.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/cromer-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-limed-ash",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Limed Ash",
        "tone": "light grey",
        "swatch": "#928a7e",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/limed-ash.webp",
        "alt": "Limed Ash engineered timber swatch",
        "description": "A pale ash tone washed with soft lime accents delivers a relaxed, timeless aesthetic with natural character.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/limed-ash",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/limed-ash.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/limed-ash-gallery-2.webp"]
      },
      {
        "id": "topdeck-monica-grey",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Monica Grey",
        "tone": "warm brown",
        "swatch": "#8e7a67",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/monica-grey.webp",
        "alt": "Monica Grey engineered timber swatch",
        "description": "Soft grey oak with muted dark contrasts offers a modern, versatile finish that adapts beautifully to any palette.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/monica-grey",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/monica-grey.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/monica-grey-gallery-2.webp"]
      },
      {
        "id": "topdeck-oyster-bay",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Oyster Bay",
        "tone": "warm brown",
        "swatch": "#79684e",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/oyster-bay.webp",
        "alt": "Oyster Bay engineered timber swatch",
        "description": "A rich honey shade that balances warmth with elegance, Oyster Bay complements both modern and classic furnishings.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/oyster-bay",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/oyster-bay.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/oyster-bay-gallery-2.webp"]
      },
      {
        "id": "topdeck-panania-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Panania Oak",
        "tone": "natural oak",
        "swatch": "#aa9987",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/panania-oak.webp",
        "alt": "Panania Oak engineered timber swatch",
        "description": "Light grey hues lifted with subtle white undertones bring a fresh, airy softness to modern spaces.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/panania-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/panania-oak.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/panania-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-soft-pale-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Soft Pale Oak",
        "tone": "natural oak",
        "swatch": "#aa9486",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/soft-pale-oak.webp",
        "alt": "Soft Pale Oak engineered timber swatch",
        "description": "Delicate reddish-brown notes blend with pale warmth, offering a versatile finish that feels both rich and refined.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/soft-pale-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/soft-pale-oak.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/soft-pale-oak-gallery-2.webp"]
      },
      {
        "id": "topdeck-truffle-oak",
        "category": "engineered",
        "brand": "Topdeck Flooring",
        "range": "Cavallo Bianco Chevron",
        "colour": "Truffle Oak",
        "tone": "warm brown",
        "swatch": "#8d7759",
        "thickness": "14/3mm",
        "productType": "Engineered Timber Chevron",
        "pricePerM2": 0,
        "installRate": null,
        "image": "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/truffle-oak.webp",
        "alt": "Truffle Oak engineered timber swatch",
        "description": "Deep brown hues with distinctive graining bring bold sophistication, ideal for statement interiors.",
        "features": ["Chevron-format European oak for classic French-inspired layouts.", "Brushed surface with UV ultra-matte lacquer to emphasise natural grain and softness.", "Left and right tongue boards designed for accurate chevron pattern installation.", "High-impact statement range for premium residential interiors."],
        "suitableFor": ["Living areas", "Bedrooms", "Feature rooms", "Premium renovations", "Designer homes"],
        "supplier": "Topdeck Flooring",
        "supplierUrl": "https://topdeckflooring.com.au/products/truffle-oak",
        "galleryImages": ["images/products/engineered-timber/topdeck-cavallo-bianco-chevron/truffle-oak.webp", "images/products/engineered-timber/topdeck-cavallo-bianco-chevron/truffle-oak-gallery-2.webp"]
      },
      {
              "id": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Country Caramel Oak",
              "colour": "Country Caramel Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/country-caramel-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/country-caramel-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/country-caramel-oak.webp"
              ],
              "alt": "Country Caramel Oak Swish Oak Wideboard flooring sample",
              "description": "Country Caramel Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/country-caramel-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Swish Oak Wideboard is an engineered oak range from Eco Flooring Systems for customers who want a wider timber board and premium natural timber finish.",
                              "Because engineered timber colours can affect product pricing, Operon asks customers to choose the range and then the colour."
                      ],
                      "featuresIntro": "Swish Oak Wideboard highlights",
                      "features": [
                              "Engineered oak construction",
                              "Wideboard timber appearance",
                              "Colour-level selection for quote accuracy",
                              "Final site and product details confirmed before work starts"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Swish Oak Wideboard"
                              },
                              {
                                      "label": "Thickness",
                                      "value": "14/4mm"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-swish-oak-wideboard-elegant-sandy-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Elegant Sandy Oak",
              "colour": "Elegant Sandy Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-sandy-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-sandy-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-sandy-oak.webp"
              ],
              "alt": "Elegant Sandy Oak Swish Oak Wideboard flooring sample",
              "description": "Elegant Sandy Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/elegant-sandy-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-wideboard-elegant-walnut-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Elegant Walnut Oak",
              "colour": "Elegant Walnut Oak",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-walnut-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-walnut-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-walnut-oak.webp"
              ],
              "alt": "Elegant Walnut Oak Swish Oak Wideboard flooring sample",
              "description": "Elegant Walnut Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/elegant-walnut-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-wideboard-elegant-white-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Elegant White Oak",
              "colour": "Elegant White Oak",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-white-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-white-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/elegant-white-oak.webp"
              ],
              "alt": "Elegant White Oak Swish Oak Wideboard flooring sample",
              "description": "Elegant White Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/elegant-white-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-wideboard-paris-natural-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Paris Natural Oak",
              "colour": "Paris Natural Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/paris-natural-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/paris-natural-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/paris-natural-oak.webp"
              ],
              "alt": "Paris Natural Oak Swish Oak Wideboard flooring sample",
              "description": "Paris Natural Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/paris-natural-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-wideboard-paris-summer-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Paris Summer Oak",
              "colour": "Paris Summer Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/paris-summer-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/paris-summer-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/paris-summer-oak.webp"
              ],
              "alt": "Paris Summer Oak Swish Oak Wideboard flooring sample",
              "description": "Paris Summer Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/paris-summer-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-wideboard-urban-antique-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Urban Antique Oak",
              "colour": "Urban Antique Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/urban-antique-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/urban-antique-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/urban-antique-oak.webp"
              ],
              "alt": "Urban Antique Oak Swish Oak Wideboard flooring sample",
              "description": "Urban Antique Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/urban-antique-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-wideboard-urban-limewash-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Wideboard",
              "rangeId": "engineered-eco-swish-oak-wideboard",
              "rangeLabel": "Swish Oak Wideboard",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-wideboard-country-caramel-oak",
              "customerLabel": "Swish Oak Wideboard - Urban Limewash Oak",
              "colour": "Urban Limewash Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "14/4mm",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-wideboard/urban-limewash-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-wideboard/urban-limewash-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-wideboard/urban-limewash-oak.webp"
              ],
              "alt": "Urban Limewash Oak Swish Oak Wideboard flooring sample",
              "description": "Urban Limewash Oak is a engineered timber flooring colour from the Swish Oak Wideboard range.",
              "features": [
                      "Engineered oak flooring",
                      "Wideboard timber format",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/urban-limewash-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Contemporary",
              "rangeId": "engineered-eco-swish-oak-contemporary",
              "rangeLabel": "Swish Oak Contemporary",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "customerLabel": "Swish Oak Contemporary - Elegant Milano Oak",
              "colour": "Elegant Milano Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-contemporary/elegant-milano-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-contemporary/elegant-milano-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-contemporary/elegant-milano-oak.webp"
              ],
              "alt": "Elegant Milano Oak Swish Oak Contemporary flooring sample",
              "description": "Elegant Milano Oak is a engineered timber flooring colour from the Swish Oak Contemporary range.",
              "features": [
                      "Engineered oak flooring",
                      "Contemporary timber colours",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/elegant-milano-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Swish Oak Contemporary is an engineered oak range with modern timber colour options for premium residential flooring projects.",
                              "Operon uses range then colour selection so the estimate can reflect the chosen engineered timber product."
                      ],
                      "featuresIntro": "Swish Oak Contemporary highlights",
                      "features": [
                              "Engineered oak product family",
                              "Contemporary timber colour palette",
                              "Colour-level selection for quote accuracy",
                              "Final site and product details confirmed before work starts"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Swish Oak Contemporary"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-swish-oak-contemporary-elegant-natural-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Contemporary",
              "rangeId": "engineered-eco-swish-oak-contemporary",
              "rangeLabel": "Swish Oak Contemporary",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "customerLabel": "Swish Oak Contemporary - Elegant Natural Oak",
              "colour": "Elegant Natural Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-contemporary/elegant-natural-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-contemporary/elegant-natural-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-contemporary/elegant-natural-oak.webp"
              ],
              "alt": "Elegant Natural Oak Swish Oak Contemporary flooring sample",
              "description": "Elegant Natural Oak is a engineered timber flooring colour from the Swish Oak Contemporary range.",
              "features": [
                      "Engineered oak flooring",
                      "Contemporary timber colours",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/elegant-natural-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-contemporary-espresso-piccolo-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Contemporary",
              "rangeId": "engineered-eco-swish-oak-contemporary",
              "rangeLabel": "Swish Oak Contemporary",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "customerLabel": "Swish Oak Contemporary - Espresso Piccolo Oak",
              "colour": "Espresso Piccolo Oak",
              "tone": "dark timber",
              "swatch": "#4a372b",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-contemporary/espresso-piccolo-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-contemporary/espresso-piccolo-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-contemporary/espresso-piccolo-oak.webp"
              ],
              "alt": "Espresso Piccolo Oak Swish Oak Contemporary flooring sample",
              "description": "Espresso Piccolo Oak is a engineered timber flooring colour from the Swish Oak Contemporary range.",
              "features": [
                      "Engineered oak flooring",
                      "Contemporary timber colours",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/espresso-piccolo-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-contemporary-limed-piccolo-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Contemporary",
              "rangeId": "engineered-eco-swish-oak-contemporary",
              "rangeLabel": "Swish Oak Contemporary",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "customerLabel": "Swish Oak Contemporary - Limed Piccolo Oak",
              "colour": "Limed Piccolo Oak",
              "tone": "light oak",
              "swatch": "#d8c7aa",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-contemporary/limed-piccolo-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-contemporary/limed-piccolo-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-contemporary/limed-piccolo-oak.webp"
              ],
              "alt": "Limed Piccolo Oak Swish Oak Contemporary flooring sample",
              "description": "Limed Piccolo Oak is a engineered timber flooring colour from the Swish Oak Contemporary range.",
              "features": [
                      "Engineered oak flooring",
                      "Contemporary timber colours",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/limed-piccolo-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-contemporary-paris-luteous-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Contemporary",
              "rangeId": "engineered-eco-swish-oak-contemporary",
              "rangeLabel": "Swish Oak Contemporary",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "customerLabel": "Swish Oak Contemporary - Paris Luteous Oak",
              "colour": "Paris Luteous Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-contemporary/paris-luteous-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-contemporary/paris-luteous-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-contemporary/paris-luteous-oak.webp"
              ],
              "alt": "Paris Luteous Oak Swish Oak Contemporary flooring sample",
              "description": "Paris Luteous Oak is a engineered timber flooring colour from the Swish Oak Contemporary range.",
              "features": [
                      "Engineered oak flooring",
                      "Contemporary timber colours",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/paris-luteous-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-contemporary-paris-modern-oak",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Contemporary",
              "rangeId": "engineered-eco-swish-oak-contemporary",
              "rangeLabel": "Swish Oak Contemporary",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-contemporary-elegant-milano-oak",
              "customerLabel": "Swish Oak Contemporary - Paris Modern Oak",
              "colour": "Paris Modern Oak",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-contemporary/paris-modern-oak.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-contemporary/paris-modern-oak.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-contemporary/paris-modern-oak.webp"
              ],
              "alt": "Paris Modern Oak Swish Oak Contemporary flooring sample",
              "description": "Paris Modern Oak is a engineered timber flooring colour from the Swish Oak Contemporary range.",
              "features": [
                      "Engineered oak flooring",
                      "Contemporary timber colours",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Apartments with suitable subfloor"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/paris-modern-oak/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-natura-handcrafted-misty-quartz",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Natura Handcrafted",
              "rangeId": "engineered-eco-swish-oak-natura-handcrafted",
              "rangeLabel": "Swish Oak Natura Handcrafted",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-natura-handcrafted-misty-quartz",
              "customerLabel": "Swish Oak Natura Handcrafted - Misty Quartz",
              "colour": "Misty Quartz",
              "tone": "grey oak",
              "swatch": "#a6a7a1",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/misty-quartz.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/misty-quartz.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/misty-quartz.webp"
              ],
              "alt": "Misty Quartz Swish Oak Natura Handcrafted flooring sample",
              "description": "Misty Quartz is a engineered timber flooring colour from the Swish Oak Natura Handcrafted range.",
              "features": [
                      "Engineered oak flooring",
                      "Handcrafted timber character",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Feature spaces"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/mistyquartz/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true,
              "rangeContent": {
                      "description": [
                              "Swish Oak Natura Handcrafted is an engineered oak range with a more crafted timber character and premium finish direction.",
                              "Customers choose the range and then the colour so the quote records the intended engineered timber selection."
                      ],
                      "featuresIntro": "Swish Oak Natura Handcrafted highlights",
                      "features": [
                              "Engineered oak product family",
                              "Handcrafted timber character",
                              "Colour-level selection for quote accuracy",
                              "Final site and product details confirmed before work starts"
                      ],
                      "technical": [
                              {
                                      "label": "Supplier",
                                      "value": "Eco Flooring Systems"
                              },
                              {
                                      "label": "Range",
                                      "value": "Swish Oak Natura Handcrafted"
                              }
                      ]
              }
      },
      {
              "id": "eco-eco-swish-oak-natura-handcrafted-natural-canvas",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Natura Handcrafted",
              "rangeId": "engineered-eco-swish-oak-natura-handcrafted",
              "rangeLabel": "Swish Oak Natura Handcrafted",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-natura-handcrafted-misty-quartz",
              "customerLabel": "Swish Oak Natura Handcrafted - Natural Canvas",
              "colour": "Natural Canvas",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/natural-canvas.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/natural-canvas.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/natural-canvas.webp"
              ],
              "alt": "Natural Canvas Swish Oak Natura Handcrafted flooring sample",
              "description": "Natural Canvas is a engineered timber flooring colour from the Swish Oak Natura Handcrafted range.",
              "features": [
                      "Engineered oak flooring",
                      "Handcrafted timber character",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Feature spaces"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/naturalcanvas/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      },
      {
              "id": "eco-eco-swish-oak-natura-handcrafted-sunlit-sienna",
              "category": "engineered",
              "brand": "Swish Oak",
              "range": "Swish Oak Natura Handcrafted",
              "rangeId": "engineered-eco-swish-oak-natura-handcrafted",
              "rangeLabel": "Swish Oak Natura Handcrafted",
              "selectionMode": "range_then_colour",
              "representativeProductId": "eco-eco-swish-oak-natura-handcrafted-misty-quartz",
              "customerLabel": "Swish Oak Natura Handcrafted - Sunlit Sienna",
              "colour": "Sunlit Sienna",
              "tone": "natural oak",
              "swatch": "#c7a77a",
              "thickness": "Engineered oak",
              "productType": "Engineered Timber Flooring",
              "pricePerM2": 0,
              "installRate": null,
              "image": "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/sunlit-sienna.webp",
              "imageUrl": "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/sunlit-sienna.webp",
              "galleryImages": [
                      "images/products/engineered-timber/eco-swish-oak-natura-handcrafted/sunlit-sienna.webp"
              ],
              "alt": "Sunlit Sienna Swish Oak Natura Handcrafted flooring sample",
              "description": "Sunlit Sienna is a engineered timber flooring colour from the Swish Oak Natura Handcrafted range.",
              "features": [
                      "Engineered oak flooring",
                      "Handcrafted timber character",
                      "Colour selected for final product",
                      "Site confirmation before installation"
              ],
              "suitableFor": [
                      "Living areas",
                      "Bedrooms",
                      "Premium renovations",
                      "Feature spaces"
              ],
              "supplier": "Eco Flooring Systems",
              "supplierUrl": "https://ecoflooring.com.au/product/sunlitsienna/",
              "pricingStatus": "pending",
              "catalogueStatus": "live",
              "active": true
      }
    ]
  };

  const ETF_GALLERY_SLUGS_BY_RANGE = {
    "7mm": [
      "antique-oak",
      "baden-oak",
      "blackbutt",
      "brushbox",
      "caramel-oak",
      "dexter-oak",
      "downtown-oak",
      "driftwood",
      "grey-oak",
      "hatton-oak",
      "helena-oak",
      "holly-hills",
      "jarrah",
      "julan",
      "lake-oak-light"
    ],
    "8mm": [
      "alaskan-oak",
      "american-oak",
      "coastal-blackbutt",
      "driftwood",
      "french-oak",
      "grey-oak",
      "helena-oak",
      "natural-oak",
      "new-zealand-blackbutt",
      "qld-spotted-gum",
      "riverview",
      "spotted-gum"
    ],
    "9mm": [
      "alaskan-oak",
      "american-oak",
      "coastal-blackbutt",
      "dexter-oak",
      "driftwood",
      "french-oak",
      "grey-oak",
      "lake-oak-light",
      "natural-oak",
      "new-driftwood",
      "new-zealand-blackbutt",
      "oslo-oak-grey",
      "qld-spotted-gum",
      "spotted-gum"
    ]
  };

  const PRODUCT_GALLERY_MAP = Object.keys(ETF_GALLERY_SLUGS_BY_RANGE).reduce(function (accumulator, rangeKey) {
    ETF_GALLERY_SLUGS_BY_RANGE[rangeKey].forEach(function (slug) {
      const basePath = "images/products/hybrid/hrt-etf-" + rangeKey + "-" + slug;
      accumulator["hrt-etf-" + rangeKey + "-hybrid-" + slug] = [
        basePath + "-gallery-1.jpg",
        basePath + "-gallery-2.jpg",
        basePath + ".jpg"
      ];
    });
    return accumulator;
  }, {});

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getRangeConfigEntry(product, category) {
    const config = RANGE_CONFIG[category || product.category] || {};
    return config[product.brand] || config[product.range] || null;
  }

  function inferRangeId(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.rangeId) {
      return configEntry.rangeId;
    }

    if (product.rangeId) {
      return product.rangeId;
    }

    return [category || product.category, product.brand || product.range || "range"].map(slugify).filter(Boolean).join("-");
  }

  function inferRangeLabel(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.rangeLabel) {
      return configEntry.rangeLabel;
    }

    return product.rangeLabel || product.range || product.brand || "Flooring range";
  }

  function inferSelectionMode(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.selectionMode) {
      return configEntry.selectionMode;
    }

    return product.selectionMode || ((category || product.category) === "engineered" ? "range_then_colour" : "range_only");
  }

  function inferRepresentativeProductId(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.representativeProductId) {
      return configEntry.representativeProductId;
    }

    return product.representativeProductId || product.id;
  }

  function inferDefaultRecommendation(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    if (configEntry && configEntry.isDefaultRecommendation) {
      return true;
    }

    return !!product.isDefaultRecommendation;
  }

  function inferRangeContent(product, category) {
    const configEntry = getRangeConfigEntry(product, category);
    return configEntry && configEntry.rangeContent ? clone(configEntry.rangeContent) : null;
  }

  function getCategoryMetaSource() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("categoryMeta") : null;
    if (!source || typeof source !== "object" || Array.isArray(source) || !Object.keys(source).length) {
      return CATEGORY_META;
    }
    return source;
  }

  function getProductsSource() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("products") : null;
    if (!source || typeof source !== "object" || Array.isArray(source) || !Object.keys(source).length) {
      return PRODUCTS;
    }
    return source;
  }

  function normaliseProduct(product, fallbackCategory) {
    const resolvedCategory = product.category || fallbackCategory || "";
    if (resolvedCategory === "laminate" && product.range === "12mm 24hrs Water Resistant Laminate") {
      product = Object.assign({}, product, {
        brand: "ETF Laminate 1.2m"
      });
    }

    const imageUrl = product.imageUrl || product.image || "";
    const imageAlt = product.imageAlt || product.alt || [product.brand, product.range, product.colour, "flooring sample"].filter(Boolean).join(" ");
    const galleryImages = normaliseGalleryImages(product, PRODUCT_GALLERY_MAP[product.id] || []);
    const category = resolvedCategory;
    const rangeId = inferRangeId(product, category);
    const rangeLabel = inferRangeLabel(product, category);
    const selectionMode = inferSelectionMode(product, category);
    const rangeContent = inferRangeContent(product, category);
    const internalSkuLabel = product.internalSkuLabel || [product.brand, product.range, product.colour].filter(Boolean).join(" / ");
    const customerLabel = product.customerLabel || (selectionMode === "range_then_colour"
      ? [rangeLabel, product.colour].filter(Boolean).join(" — ")
      : rangeLabel);
    const pricingStatus = product.pricingStatus || ((Number(product.pricePerM2) || 0) > 0 ? "confirmed" : "pending");
    const catalogueStatus = product.catalogueStatus || (product.active === false ? "inactive" : "live");
    return Object.assign({
      category: category,
      rangeId: rangeId,
      rangeLabel: rangeLabel,
      selectionMode: selectionMode,
      representativeProductId: inferRepresentativeProductId(product, category),
      isDefaultRecommendation: inferDefaultRecommendation(product, category),
      rangeContent: rangeContent,
      customerLabel: customerLabel,
      internalSkuLabel: internalSkuLabel,
      thickness: "",
      imageAlt: imageAlt,
      alt: imageAlt,
      imageUrl: imageUrl,
      image: imageUrl,
      galleryImages: galleryImages,
      features: [],
      active: true,
      pricingStatus: pricingStatus,
      catalogueStatus: catalogueStatus,
      isPlaceholderPricing: pricingStatus !== "confirmed",
      isPublishedProduct: catalogueStatus === "live"
    }, product, {
      category: category,
      rangeId: rangeId,
      rangeLabel: rangeLabel,
      selectionMode: selectionMode,
      representativeProductId: inferRepresentativeProductId(product, category),
      isDefaultRecommendation: inferDefaultRecommendation(product, category),
      rangeContent: rangeContent,
      customerLabel: customerLabel,
      internalSkuLabel: internalSkuLabel,
      imageAlt: imageAlt,
      alt: imageAlt,
      imageUrl: imageUrl,
      image: imageUrl,
      galleryImages: galleryImages,
      active: product.active !== false,
      pricingStatus: pricingStatus,
      catalogueStatus: catalogueStatus,
      isPlaceholderPricing: pricingStatus !== "confirmed",
      isPublishedProduct: catalogueStatus === "live"
    });
  }

  function normaliseGalleryImages(product, fallbackImages) {
    const source = []
      .concat(product.galleryImages || [])
      .concat(fallbackImages || [])
      .concat(product.imageUrl || product.image || []);

    return source.reduce(function (accumulator, imageUrl) {
      if (!imageUrl || accumulator.indexOf(imageUrl) >= 0) {
        return accumulator;
      }
      accumulator.push(imageUrl);
      return accumulator;
    }, []);
  }

  function listAllProducts() {
    const productCollections = getProductsSource();
    return Object.keys(productCollections).reduce(function (accumulator, category) {
      return accumulator.concat((productCollections[category] || []).map(function (product) {
        return normaliseProduct(product, category);
      }));
    }, []);
  }

  function getProductById(id) {
    return listAllProducts().find(function (product) {
      return product.id === id && product.active !== false;
    }) || null;
  }

  function getProductsByCategory(category) {
    return clone(listAllProducts().filter(function (product) {
      return product.category === category && product.active !== false;
    }));
  }

  function getEntryLevelProduct(category) {
    const products = getProductsByCategory(category).filter(function (product) {
      return Number(product.pricePerM2 || 0) > 0;
    });

    products.sort(function (left, right) {
      const priceDifference = Number(left.pricePerM2 || 0) - Number(right.pricePerM2 || 0);
      if (priceDifference !== 0) {
        return priceDifference;
      }
      return getProductLabel(left).localeCompare(getProductLabel(right));
    });

    return products.length ? products[0] : null;
  }

  function getProductsByRangeId(rangeId) {
    return clone(listAllProducts().filter(function (product) {
      return product.rangeId === rangeId && product.active !== false;
    }));
  }

  function getRangesByCategory(category) {
    const products = getProductsByCategory(category);
    const grouped = {};

    products.forEach(function (product) {
      if (!grouped[product.rangeId]) {
        grouped[product.rangeId] = {
          category: product.category,
          rangeId: product.rangeId,
          rangeLabel: product.rangeLabel,
          brand: product.brand,
          thickness: product.thickness,
          productType: product.productType,
          selectionMode: product.selectionMode,
          representativeProductId: product.representativeProductId || product.id,
          isDefaultRecommendation: !!product.isDefaultRecommendation,
          feature: (product.features || [])[0] || "",
          imageUrl: product.imageUrl || product.image || "",
          image: product.imageUrl || product.image || "",
          pricePerM2: product.pricePerM2,
          rangeContent: product.rangeContent || null,
          colours: [],
          colourCount: 0
        };
      }

      grouped[product.rangeId].colours.push(product.colour);
      grouped[product.rangeId].colourCount += 1;
      if (!grouped[product.rangeId].pricePerM2 && product.pricePerM2) {
        grouped[product.rangeId].pricePerM2 = product.pricePerM2;
      }
    });

    return clone(Object.keys(grouped).map(function (rangeId) {
      const item = grouped[rangeId];
      item.colours = Array.from(new Set(item.colours)).filter(Boolean).sort();
      return item;
    }).sort(function (left, right) {
      if (left.isDefaultRecommendation && !right.isDefaultRecommendation) {
        return -1;
      }
      if (!left.isDefaultRecommendation && right.isDefaultRecommendation) {
        return 1;
      }
      return String(left.rangeLabel).localeCompare(String(right.rangeLabel));
    }));
  }

  function getColoursByRange(rangeId) {
    return getProductsByRangeId(rangeId).map(function (product) {
      return {
        id: product.id,
        colour: product.colour,
        customerLabel: product.customerLabel,
        pricePerM2: product.pricePerM2,
        imageUrl: product.imageUrl || product.image || "",
        swatch: product.swatch || "#d1d5db"
      };
    });
  }

  function getRepresentativeProductByRangeId(rangeId) {
    const products = getProductsByRangeId(rangeId);
    if (!products.length) {
      return null;
    }

    const explicitRepresentative = products.find(function (product) {
      return product.id === product.representativeProductId;
    });

    return explicitRepresentative || products[0];
  }

  function getDefaultRecommendation(category) {
    const products = getProductsByCategory(category);
    const explicit = products.find(function (product) {
      return product.isDefaultRecommendation;
    });
    if (explicit) {
      return explicit;
    }

    const ranges = getRangesByCategory(category);
    if (ranges.length) {
      return getRepresentativeProductByRangeId(ranges[0].rangeId);
    }

    return null;
  }

  function getAllProducts() {
    return clone(listAllProducts().filter(function (product) {
      return product.active !== false;
    }));
  }

  function getCategoryMeta(category) {
    const categoryMeta = getCategoryMetaSource();
    return clone(categoryMeta[category] || null);
  }

  function getCategoryList() {
    const categoryMeta = getCategoryMetaSource();
    return Object.keys(categoryMeta).map(function (key) {
      return getCategoryMeta(key);
    });
  }

  function getCategoryStats(category) {
    const products = getProductsByCategory(category);
    const liveProductCount = products.filter(function (product) {
      return product.isPublishedProduct;
    }).length;
    const confirmedPriceCount = products.filter(function (product) {
      return !product.isPlaceholderPricing;
    }).length;

    return {
      liveProductCount: liveProductCount,
      confirmedPriceCount: confirmedPriceCount,
      hasLiveProducts: liveProductCount > 0,
      hasConfirmedPrices: confirmedPriceCount > 0
    };
  }

  function isValidCategory(category) {
    if (!category) {
      return false;
    }

    return !!getCategoryMeta(category);
  }

  function clearStoredSelectionKeys() {
    localStorage.removeItem(STORAGE_ID_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RANGE_STORAGE_KEY);
    localStorage.removeItem(COLOUR_STORAGE_KEY);
    localStorage.removeItem(SELECTION_MODE_STORAGE_KEY);
  }

  function getEstimateProduct(category) {
    const categoryMeta = getCategoryMetaSource();
    const meta = categoryMeta[category] || categoryMeta.hybrid || CATEGORY_META.hybrid;
    const entryLevelProduct = getEntryLevelProduct(meta.id);
    const pricePerM2 = entryLevelProduct && entryLevelProduct.pricePerM2 > 0
      ? entryLevelProduct.pricePerM2
      : meta.pricePerM2;
    const pricingMode = entryLevelProduct && entryLevelProduct.pricePerM2 > 0
      ? "category"
      : "fallback";

    return {
      id: meta.id + "-estimate",
      category: meta.id,
      brand: "Operon Estimate",
      range: meta.label,
      colour: "Standard estimate",
      pricePerM2: pricePerM2,
      installRate: null,
      imageUrl: "",
      image: "",
      description: meta.shortDescription,
      features: [],
      suitableFor: [],
      active: true,
      isEstimate: true,
      pricingMode: pricingMode,
      baselineProductId: entryLevelProduct ? entryLevelProduct.id : "",
      baselineProductLabel: entryLevelProduct ? getProductLabel(entryLevelProduct) : "",
      label: meta.label + " Estimate"
    };
  }

  function getProductLabel(product) {
    if (!product) {
      return "";
    }

    if (product.label) {
      return product.label;
    }

    if (product.isEstimate) {
      return (product.range || product.category || "Flooring") + " Estimate";
    }

    if (product.customerLabel) {
      return product.customerLabel;
    }

    return product.selectionMode === "range_then_colour"
      ? [product.rangeLabel || product.range, product.colour].filter(Boolean).join(" — ")
      : (product.rangeLabel || product.range || product.brand || "Flooring product");
  }

  function getStoredSelectionState() {
    return {
      selectedProductId: localStorage.getItem(STORAGE_ID_KEY) || "",
      selectedRangeId: localStorage.getItem(RANGE_STORAGE_KEY) || "",
      selectedCategory: localStorage.getItem(CATEGORY_STORAGE_KEY) || "",
      selectedColour: localStorage.getItem(COLOUR_STORAGE_KEY) || "",
      productSelectionMode: localStorage.getItem(SELECTION_MODE_STORAGE_KEY) || ""
    };
  }

  function getStoredProduct() {
    try {
      const storedSelection = getStoredSelectionState();
      const storedId = storedSelection.selectedProductId;
      if (storedId) {
        const latestFromId = getProductById(storedId);
        if (latestFromId) {
          if (latestFromId.category) {
            localStorage.setItem(CATEGORY_STORAGE_KEY, latestFromId.category);
          }
          if (latestFromId.rangeId) {
            localStorage.setItem(RANGE_STORAGE_KEY, latestFromId.rangeId);
          }
          localStorage.setItem(SELECTION_MODE_STORAGE_KEY, latestFromId.selectionMode || "");
          localStorage.setItem(COLOUR_STORAGE_KEY, latestFromId.selectionMode === "range_then_colour" ? (latestFromId.colour || "") : "");
          return Object.assign({}, latestFromId);
        }
        clearStoredSelectionKeys();
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const productId = parsed && typeof parsed === "object" ? parsed.id : parsed;
      if (!productId) {
        return null;
      }

      const latest = getProductById(productId);
      if (!latest) {
        clearStoredSelectionKeys();
        return null;
      }

      localStorage.setItem(STORAGE_ID_KEY, latest.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: latest.id }));
      if (latest.category) {
        localStorage.setItem(CATEGORY_STORAGE_KEY, latest.category);
      }
      if (latest.rangeId) {
        localStorage.setItem(RANGE_STORAGE_KEY, latest.rangeId);
      }
      localStorage.setItem(SELECTION_MODE_STORAGE_KEY, latest.selectionMode || "");
      localStorage.setItem(COLOUR_STORAGE_KEY, latest.selectionMode === "range_then_colour" ? (latest.colour || "") : "");
      return Object.assign({}, latest);
    } catch (error) {
      clearStoredSelectionKeys();
      return null;
    }
  }

  function getStoredProductId() {
    const storedProduct = getStoredProduct();
    return storedProduct ? storedProduct.id : "";
  }

  function saveSelectedProduct(product) {
    if (!product || !product.id) {
      return;
    }

    const latest = getProductById(product.id) || product;
    if (!latest.category || !isValidCategory(latest.category)) {
      return;
    }
    const storedProductId = latest.selectionMode === "range_only" && latest.rangeId
      ? ((getRepresentativeProductByRangeId(latest.rangeId) || latest).id)
      : latest.id;

    localStorage.setItem(STORAGE_ID_KEY, storedProductId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: storedProductId }));
    localStorage.setItem(CATEGORY_STORAGE_KEY, latest.category || "");
    localStorage.setItem(RANGE_STORAGE_KEY, latest.rangeId || "");
    localStorage.setItem(COLOUR_STORAGE_KEY, latest.selectionMode === "range_then_colour" ? (latest.colour || "") : "");
    localStorage.setItem(SELECTION_MODE_STORAGE_KEY, latest.selectionMode || "");
  }

  function saveSelectionState(selection) {
    const settings = Object.assign({
      selectedProductId: "",
      selectedRangeId: "",
      selectedCategory: "",
      selectedColour: "",
      productSelectionMode: ""
    }, selection || {});

    if (settings.selectedProductId) {
      localStorage.setItem(STORAGE_ID_KEY, settings.selectedProductId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: settings.selectedProductId }));
    } else {
      localStorage.removeItem(STORAGE_ID_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }

    if (settings.selectedRangeId) {
      localStorage.setItem(RANGE_STORAGE_KEY, settings.selectedRangeId);
    } else {
      localStorage.removeItem(RANGE_STORAGE_KEY);
    }

    if (settings.selectedCategory && isValidCategory(settings.selectedCategory)) {
      localStorage.setItem(CATEGORY_STORAGE_KEY, settings.selectedCategory);
    } else if (!settings.selectedCategory) {
      localStorage.removeItem(CATEGORY_STORAGE_KEY);
    }

    if (settings.selectedColour) {
      localStorage.setItem(COLOUR_STORAGE_KEY, settings.selectedColour);
    } else {
      localStorage.removeItem(COLOUR_STORAGE_KEY);
    }

    if (settings.productSelectionMode) {
      localStorage.setItem(SELECTION_MODE_STORAGE_KEY, settings.productSelectionMode);
    } else {
      localStorage.removeItem(SELECTION_MODE_STORAGE_KEY);
    }
  }

  function clearSelectedProduct() {
    clearStoredSelectionKeys();
  }

  function getStoredCategory() {
    const storedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || "";
    if (!storedCategory) {
      return "";
    }

    if (!isValidCategory(storedCategory)) {
      localStorage.removeItem(CATEGORY_STORAGE_KEY);
      return "";
    }

    return storedCategory;
  }

  function saveSelectedCategory(category) {
    if (isValidCategory(category)) {
      localStorage.setItem(CATEGORY_STORAGE_KEY, category);
    }
  }

  function formatProductRate(product) {
    if (!product || product.isPlaceholderPricing || !(product.pricePerM2 > 0)) {
      return "Price to be confirmed";
    }

    return "$" + product.pricePerM2.toFixed(0) + "/m²";
  }

  function getProductStatusLabel(product) {
    if (!product) {
      return "";
    }

    if (product.isPlaceholderPricing) {
      return "Final details confirmed during review";
    }

    return "Ready for quote";
  }

  function buildProductImageMarkup(product) {
    const imageUrl = product.imageUrl || product.image || "";
    const altText = product.alt || (getProductLabel(product) + " colour sample");

    if (imageUrl) {
      return (
        '<button class="catalogue-image-frame" type="button" data-open-product-image="' + product.id + '" aria-label="Open larger image for ' + altText + '">' +
          '<img class="catalogue-image" src="' + imageUrl + '" alt="' + altText + '" loading="lazy" onerror="this.hidden=true; this.parentNode.classList.add(\'is-fallback\');">' +
          '<div class="catalogue-swatch-fallback" aria-hidden="true">' +
            '<div class="catalogue-swatch" style="background:' + product.swatch + ';"></div>' +
            '<span>' + product.colour + "</span>" +
          "</div>" +
        "</button>"
      );
    }

    return (
      '<button class="catalogue-image-frame is-fallback" type="button" data-open-product-image="' + product.id + '" aria-label="Open larger image for ' + altText + '">' +
        '<div class="catalogue-swatch-fallback" aria-hidden="true">' +
          '<div class="catalogue-swatch" style="background:' + product.swatch + ';"></div>' +
          '<span>' + product.colour + "</span>" +
        "</div>" +
      "</button>"
    );
  }

  function renderProductCard(product) {
    const specLine = [product.productType, product.thickness].filter(Boolean).join(" · ");

    return (
      '<article class="catalogue-card" data-product-card="' + product.id + '">' +
        buildProductImageMarkup(product) +
        '<div class="catalogue-card-top">' +
          '<div class="catalogue-copy">' +
            '<span class="catalogue-brand">' + product.brand + "</span>" +
            "<h3>" + product.range + "</h3>" +
            '<p class="catalogue-colour">' + product.colour + "</p>" +
            '<p class="catalogue-spec">' + specLine + "</p>" +
          "</div>" +
        "</div>" +
        '<button class="button catalogue-select-button" type="button" data-select-product="' + product.id + '">Get quote</button>' +
      "</article>"
    );
  }

  function ensureCatalogueLightbox() {
    let modal = document.getElementById("catalogueLightbox");
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.className = "catalogue-lightbox";
    modal.id = "catalogueLightbox";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="catalogue-lightbox-backdrop" data-close-catalogue-lightbox="true"></div>' +
      '<div class="catalogue-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Product image preview">' +
        '<button class="catalogue-lightbox-back" type="button" aria-label="Back to colour gallery" hidden>← Back</button>' +
        '<button class="catalogue-lightbox-close" type="button" aria-label="Close image preview" data-close-catalogue-lightbox="true">×</button>' +
        '<div class="catalogue-lightbox-media">' +
          '<img id="catalogueLightboxImage" class="catalogue-lightbox-image" alt="">' +
          '<div id="catalogueLightboxFallback" class="catalogue-lightbox-fallback" hidden>' +
            '<div id="catalogueLightboxSwatch" class="catalogue-swatch"></div>' +
          "</div>" +
        "</div>" +
        '<div id="catalogueLightboxCaption" class="catalogue-lightbox-caption"></div>' +
        '<div id="catalogueLightboxThumbnails" class="catalogue-lightbox-thumbnails" hidden></div>' +
      "</div>";

    document.body.appendChild(modal);

    const backdrop = modal.querySelector(".catalogue-lightbox-backdrop");
    const dialog = modal.querySelector(".catalogue-lightbox-dialog");
    const backButton = modal.querySelector(".catalogue-lightbox-back");
    const closeButton = modal.querySelector(".catalogue-lightbox-close");
    const thumbnails = modal.querySelector("#catalogueLightboxThumbnails");

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeCatalogueLightbox();
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeCatalogueLightbox();
      });
    }

    if (backButton) {
      backButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const onBack = typeof modal.__onBack === "function" ? modal.__onBack : null;
        closeCatalogueLightbox({ preserveBackState: false });
        if (onBack) {
          onBack();
        }
      });
    }

    if (dialog) {
      dialog.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }

    if (thumbnails) {
      thumbnails.addEventListener("click", function (event) {
        const thumbnailButton = event.target.closest("[data-lightbox-image-index]");
        if (!thumbnailButton) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        setCatalogueLightboxSlide(modal, Number(thumbnailButton.getAttribute("data-lightbox-image-index")) || 0);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        closeCatalogueLightbox();
      }
    });

    return modal;
  }

  function openCatalogueLightbox(product, options) {
    if (!product) {
      return;
    }

    const settings = Object.assign({
      onBack: null
    }, options || {});
    const modal = ensureCatalogueLightbox();
    const backButton = modal.querySelector(".catalogue-lightbox-back");
    modal.__product = product;
    modal.__galleryImages = (product.galleryImages || []).length
      ? product.galleryImages.slice()
      : normaliseGalleryImages(product, []);
    modal.__galleryIndex = 0;
    modal.__onBack = typeof settings.onBack === "function" ? settings.onBack : null;

    if (backButton) {
      backButton.hidden = !modal.__onBack;
    }

    renderCatalogueLightboxThumbnails(modal, product);
    setCatalogueLightboxSlide(modal, 0);
    modal.hidden = false;
    document.body.classList.add("catalogue-lightbox-open");
  }

  function renderCatalogueLightboxThumbnails(modal, product) {
    const thumbnails = modal.querySelector("#catalogueLightboxThumbnails");
    const galleryImages = modal.__galleryImages || [];

    if (galleryImages.length < 2) {
      thumbnails.hidden = true;
      thumbnails.innerHTML = "";
      return;
    }

    thumbnails.hidden = false;
    thumbnails.innerHTML = galleryImages.map(function (imageUrl, index) {
      return (
        '<button class="catalogue-lightbox-thumb' + (index === (modal.__galleryIndex || 0) ? " is-active" : "") + '" type="button" data-lightbox-image-index="' + index + '" aria-label="View ' + product.colour + " image " + (index + 1) + '">' +
          '<img src="' + imageUrl + '" alt="' + (product.alt || (getProductLabel(product) + " colour sample")) + " image " + (index + 1) + '" loading="lazy" onerror="this.parentNode.hidden=true;">' +
        "</button>"
      );
    }).join("");
  }

  function setCatalogueLightboxSlide(modal, index) {
    const product = modal.__product;
    const galleryImages = modal.__galleryImages || [];
    const image = modal.querySelector("#catalogueLightboxImage");
    const fallback = modal.querySelector("#catalogueLightboxFallback");
    const swatch = modal.querySelector("#catalogueLightboxSwatch");
    const caption = modal.querySelector("#catalogueLightboxCaption");

    if (!product) {
      return;
    }

    modal.__galleryIndex = index;
    caption.textContent = product.colour || getProductLabel(product);
    swatch.style.background = product.swatch || "#d1d5db";
    fallback.hidden = true;
    image.hidden = false;
    image.alt = product.alt || (getProductLabel(product) + " colour sample");

    if (galleryImages[index]) {
      image.src = galleryImages[index];
      image.onload = function () {
        fallback.hidden = true;
        image.hidden = false;
      };
      image.onerror = function () {
        image.hidden = true;
        fallback.hidden = false;
      };
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      fallback.hidden = false;
    }

    renderCatalogueLightboxThumbnails(modal, product);
  }

  function closeCatalogueLightbox(options) {
    const modal = document.getElementById("catalogueLightbox");
    if (!modal) {
      return;
    }

    const settings = Object.assign({
      preserveBackState: false
    }, options || {});
    const backButton = modal.querySelector(".catalogue-lightbox-back");
    modal.hidden = true;
    modal.__product = null;
    modal.__galleryImages = [];
    modal.__galleryIndex = 0;
    if (!settings.preserveBackState) {
      modal.__onBack = null;
    }
    if (backButton) {
      backButton.hidden = true;
    }
    document.body.classList.remove("catalogue-lightbox-open");
  }

  function renderCategoryCatalogue(options) {
    const settings = Object.assign({
      category: "",
      targetId: "",
      statusId: "",
      limit: 0,
      quoteUrl: "quote.html?from=product",
      successMessage: "Product selected. Continue to quote."
    }, options || {});

    const target = document.getElementById(settings.targetId);
    if (!target) {
      return;
    }

    const products = getProductsByCategory(settings.category);
    const limitedProducts = settings.limit > 0 ? products.slice(0, settings.limit) : products;
    const storedProduct = getStoredProduct();
    const status = settings.statusId ? document.getElementById(settings.statusId) : null;

    if (!limitedProducts.length) {
      target.innerHTML = "";
      if (status) {
        const categoryMeta = getCategoryMeta(settings.category);
        status.textContent = categoryMeta
          ? "Live " + categoryMeta.label.toLowerCase() + " products will be added here when confirmed. You can continue with a " + categoryMeta.label.toLowerCase() + " quote now."
          : "Live product options will appear here when confirmed.";
        status.dataset.state = "info";
      }
      return;
    }

    target.innerHTML = limitedProducts.map(function (product) {
      const selectedClass = storedProduct && storedProduct.id === product.id ? " selected" : "";
      return renderProductCard(product).replace('class="catalogue-card"', 'class="catalogue-card' + selectedClass + '"');
    }).join("");

    target.__operonCatalogueConfig = settings;
    if (target.dataset.catalogueBound === "true") {
      return;
    }

    target.dataset.catalogueBound = "true";
    target.addEventListener("click", function (event) {
      const activeSettings = target.__operonCatalogueConfig || settings;
      const activeStatus = activeSettings.statusId ? document.getElementById(activeSettings.statusId) : null;

      const button = event.target.closest("[data-select-product]");
      if (button) {
        const product = getProductById(button.getAttribute("data-select-product"));
        if (!product) {
          return;
        }

        saveSelectedProduct(product);
        if (window.OperonTracking) {
          const trackingPayload = {
            category: product.category,
            brand: product.brand,
            range: product.range,
            colour: product.colour,
            pricePerM2: product.pricePerM2
          };
          if (typeof window.OperonTracking.trackProductSelect === "function") {
            window.OperonTracking.trackProductSelect(trackingPayload);
          } else {
            window.OperonTracking.trackEvent("product_selected", trackingPayload);
            window.OperonTracking.trackEvent("product_select", trackingPayload);
          }
        }

        if (activeStatus) {
          activeStatus.textContent = activeSettings.successMessage;
          activeStatus.dataset.state = "success";
        }

        window.location.href = activeSettings.quoteUrl;
        return;
      }

      const imageTrigger = event.target.closest("[data-open-product-image]");
      if (imageTrigger) {
        const product = getProductById(imageTrigger.getAttribute("data-open-product-image"));
        openCatalogueLightbox(product);
      }
    });
  }

  function renderSelectionBanner(options) {
    const settings = Object.assign({
      category: "",
      titleId: "",
      textId: "",
      clearButtonId: "",
      quoteUrl: "quote.html?from=product"
    }, options || {});

    const title = document.getElementById(settings.titleId);
    const text = document.getElementById(settings.textId);
    const clearButton = document.getElementById(settings.clearButtonId);
    const storedProduct = getStoredProduct();
    const categoryMeta = getCategoryMeta(settings.category);

    if (!title || !text || !clearButton || !categoryMeta) {
      return;
    }

    if (storedProduct && storedProduct.category === settings.category) {
      title.textContent = "Selected for quote: " + getProductLabel(storedProduct);
      text.textContent = storedProduct.selectionMode === "range_only"
        ? "Using " + getProductLabel(storedProduct) + ". Colour can be confirmed later."
        : (storedProduct.pricePerM2 > 0
          ? getProductLabel(storedProduct) + " · " + formatProductRate(storedProduct)
          : getProductLabel(storedProduct) + " · Product price needs review before final confirmation.");
      clearButton.textContent = "Use " + categoryMeta.label.toLowerCase() + " estimate instead";
      clearButton.onclick = function () {
        clearSelectedProduct();
        saveSelectedCategory(settings.category);
        window.location.href = settings.quoteUrl;
      };
      return;
    }

    if (!getProductsByCategory(settings.category).length) {
      title.textContent = categoryMeta.label + " quote ready";
      text.textContent = "Live " + categoryMeta.label.toLowerCase() + " product listings are not published yet. Continue with the " + categoryMeta.label.toLowerCase() + " estimate and we can confirm the final product during review.";
      clearButton.textContent = "Start " + categoryMeta.label.toLowerCase() + " quote";
      clearButton.onclick = function () {
        clearSelectedProduct();
        saveSelectedCategory(settings.category);
        window.location.href = settings.quoteUrl;
      };
      return;
    }

    title.textContent = "No specific " + categoryMeta.label.toLowerCase() + " selected yet";
    text.textContent = "Choose a product to load selected product pricing into the quote, or continue with entry-level " + categoryMeta.label.toLowerCase() + " product pricing.";
    clearButton.textContent = "Continue with " + categoryMeta.label.toLowerCase() + " estimate";
    clearButton.onclick = function () {
      clearSelectedProduct();
      saveSelectedCategory(settings.category);
      window.location.href = settings.quoteUrl;
    };
  }

  window.OPERON_PRODUCTS = PRODUCTS;
  window.OperonProducts = {
    STORAGE_KEY: STORAGE_KEY,
    STORAGE_ID_KEY: STORAGE_ID_KEY,
    CATEGORY_STORAGE_KEY: CATEGORY_STORAGE_KEY,
    RANGE_STORAGE_KEY: RANGE_STORAGE_KEY,
    COLOUR_STORAGE_KEY: COLOUR_STORAGE_KEY,
    SELECTION_MODE_STORAGE_KEY: SELECTION_MODE_STORAGE_KEY,
    get categoryMeta() {
      return clone(getCategoryMetaSource());
    },
    getCategoryList: getCategoryList,
    getCategoryStats: getCategoryStats,
    getAllProducts: getAllProducts,
    getCategoryMeta: getCategoryMeta,
    getProductsByCategory: getProductsByCategory,
    getEntryLevelProduct: getEntryLevelProduct,
    getProductsByRangeId: getProductsByRangeId,
    getRangesByCategory: getRangesByCategory,
    getColoursByRange: getColoursByRange,
    getRepresentativeProductByRangeId: getRepresentativeProductByRangeId,
    getDefaultRecommendation: getDefaultRecommendation,
    getProductById: getProductById,
    getEstimateProduct: getEstimateProduct,
    getProductLabel: getProductLabel,
    getStoredProduct: getStoredProduct,
    getStoredSelectionState: getStoredSelectionState,
    getStoredProductId: getStoredProductId,
    getStoredCategory: getStoredCategory,
    saveSelectedCategory: saveSelectedCategory,
    saveSelectedProduct: saveSelectedProduct,
    saveSelectionState: saveSelectionState,
    clearSelectedProduct: clearSelectedProduct,
    formatProductRate: formatProductRate,
    getProductStatusLabel: getProductStatusLabel,
    openCatalogueLightbox: openCatalogueLightbox,
    renderCategoryCatalogue: renderCategoryCatalogue
    ,
    renderSelectionBanner: renderSelectionBanner
  };
}());
