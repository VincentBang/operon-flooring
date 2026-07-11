export type FlooringCategory = "hybrid" | "laminate" | "engineered";

export type FlooringLook = {
  id: string;
  category: FlooringCategory;
  brand: string;
  range: string;
  name: string;
  colour: string;
  tone: string;
  plank: string;
  thickness: string;
  bestFor: string;
  textureUrl: string;
  swatch: string;
  defaultTextureScale: number;
};

export type MaskPoint = {
  x: number;
  y: number;
};

export type MaskSource = "manual" | "suggested" | "browser-prototype";

export type MaskSnapshot = {
  points: MaskPoint[];
  source: MaskSource;
  manualAdjustments: number;
  confirmed: boolean;
};

export type LocalPhoto = {
  url: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
};

export type PrototypeResult = {
  points: MaskPoint[];
  width: number;
  height: number;
  analysisMs: number;
};
