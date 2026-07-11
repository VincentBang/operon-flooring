import type { FlooringCategory, FlooringLook } from "./types";

export const categoryLabels: Record<FlooringCategory, string> = {
  hybrid: "Hybrid flooring",
  laminate: "Laminate flooring",
  engineered: "Engineered timber"
};

export const flooringLooks: FlooringLook[] = [
  {
    id: "topdeck-avala-prague-oak",
    category: "hybrid",
    brand: "Topdeck Flooring",
    range: "Avala Hybrid Planks",
    name: "Avala Prague Oak",
    colour: "Prague Oak",
    tone: "Natural golden oak",
    plank: "straight SPC plank",
    thickness: "6.5mm",
    bestFor: "family homes, apartments and practical timber-look renovations",
    textureUrl: "/images/products/hybrid/topdeck-avala/avala-prague-oak.webp",
    swatch: "#bca988",
    defaultTextureScale: 230
  },
  {
    id: "topdeck-avala-spotted-gum",
    category: "hybrid",
    brand: "Topdeck Flooring",
    range: "Avala Hybrid Planks",
    name: "Avala Spotted Gum",
    colour: "Spotted Gum",
    tone: "Varied Australian timber",
    plank: "straight SPC plank",
    thickness: "6.5mm",
    bestFor: "busy rooms that suit stronger grain and natural colour variation",
    textureUrl: "/images/products/hybrid/topdeck-avala/avala-spotted-gum.webp",
    swatch: "#988065",
    defaultTextureScale: 230
  },
  {
    id: "topdeck-storm-coastal-blackbutt",
    category: "hybrid",
    brand: "Topdeck Flooring",
    range: "Storm Luxury Hybrid Plank",
    name: "Storm Coastal Blackbutt",
    colour: "Coastal Blackbutt",
    tone: "Warm golden timber",
    plank: "straight SPC plank",
    thickness: "7mm",
    bestFor: "living areas and brighter interiors that suit a warmer Australian tone",
    textureUrl: "/images/products/hybrid/topdeck-storm-luxury/storm-coastal-blackbutt.webp",
    swatch: "#95653f",
    defaultTextureScale: 230
  },
  {
    id: "range-oak-step-os103-california",
    category: "laminate",
    brand: "Oak Step",
    range: "Oak Step",
    name: "Oak Step California",
    colour: "OS103 California",
    tone: "Soft taupe oak",
    plank: "straight laminate plank",
    thickness: "Confirm selected range",
    bestFor: "dry internal rooms, rentals and understated contemporary interiors",
    textureUrl: "/images/products/laminate/oak-step/os103-california.jpg",
    swatch: "#a9968b",
    defaultTextureScale: 230
  },
  {
    id: "topdeck-cp-kensington-grey",
    category: "laminate",
    brand: "Topdeck Flooring",
    range: "Prime Contemporary Plus Edition",
    name: "Kensington Grey",
    colour: "Kensington Grey",
    tone: "Cool grey oak",
    plank: "textured laminate plank",
    thickness: "12.3mm",
    bestFor: "modern dry rooms, apartments and lighter neutral schemes",
    textureUrl: "/images/products/laminate/topdeck-prime-contemporary-plus/cp-kensington-grey.webp",
    swatch: "#aca891",
    defaultTextureScale: 230
  },
  {
    id: "range-oak-step-os105-nsw-spotted-gum",
    category: "laminate",
    brand: "Oak Step",
    range: "Oak Step",
    name: "Oak Step NSW Spotted Gum",
    colour: "OS105 NSW Spotted Gum",
    tone: "Natural Australian timber",
    plank: "straight laminate plank",
    thickness: "Confirm selected range",
    bestFor: "dry rooms that need a warmer Australian timber-look direction",
    textureUrl: "/images/products/laminate/oak-step/os105-nsw-spotted-gum.jpg",
    swatch: "#a98959",
    defaultTextureScale: 230
  },
  {
    id: "topdeck-project-oak-prague-natural",
    category: "engineered",
    brand: "Topdeck Flooring",
    range: "Project Oak",
    name: "Project Oak Prague Natural",
    colour: "Prague Natural",
    tone: "Light natural oak",
    plank: "European oak plank",
    thickness: "14/2mm",
    bestFor: "premium living areas and restrained natural-oak interiors",
    textureUrl: "/images/products/engineered-timber/topdeck-project-oak/project-oak-prague-natural.webp",
    swatch: "#aa9879",
    defaultTextureScale: 250
  },
  {
    id: "topdeck-spotted-gum-136mm",
    category: "engineered",
    brand: "Topdeck Flooring",
    range: "Wooden-Land Australian Species 136mm",
    name: "Engineered Spotted Gum 136mm",
    colour: "Spotted Gum (136mm)",
    tone: "Rich Australian timber",
    plank: "136mm engineered plank",
    thickness: "14/3mm",
    bestFor: "character-led rooms and premium renovations using Australian timber tones",
    textureUrl: "/images/products/engineered-timber/topdeck-wooden-land-australian-136mm/spotted-gum-136mm.webp",
    swatch: "#976140",
    defaultTextureScale: 235
  },
  {
    id: "topdeck-lavanda-oak-british-oak-natural",
    category: "engineered",
    brand: "Topdeck Flooring",
    range: "Lavanda Oak",
    name: "Lavanda British Oak Natural",
    colour: "British Oak Natural",
    tone: "Honey natural oak",
    plank: "brushed European oak plank",
    thickness: "14/3mm",
    bestFor: "warm premium interiors and timeless natural-oak schemes",
    textureUrl: "/images/products/engineered-timber/topdeck-lavanda-oak/lavanda-oak-british-oak-natural.webp",
    swatch: "#9e8568",
    defaultTextureScale: 250
  }
];

export function getLooksForCategory(category: FlooringCategory) {
  return flooringLooks.filter((look) => look.category === category);
}
