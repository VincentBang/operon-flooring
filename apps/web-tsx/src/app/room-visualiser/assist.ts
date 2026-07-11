import { loadLocalImage } from "./imageUtils";
import { roundMaskPoint } from "./maskState";
import type { MaskPoint, PrototypeResult } from "./types";

export const suggestedStarterMask: MaskPoint[] = [
  { x: 22, y: 58 },
  { x: 78, y: 58 },
  { x: 93, y: 94 },
  { x: 7, y: 94 }
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function inferBrowserLocalFloorMask(src: string): Promise<PrototypeResult> {
  const startedAt = performance.now();
  const image = await loadLocalImage(src);
  const maxWidth = 180;
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(80, Math.round(image.naturalWidth * scale));
  const height = Math.max(60, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas analysis is not available in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;

  function luminanceAt(x: number, y: number) {
    const index = (y * width + x) * 4;
    return (pixels[index] * 0.299) + (pixels[index + 1] * 0.587) + (pixels[index + 2] * 0.114);
  }

  function findBoundary(leftRatio: number, rightRatio: number) {
    const xStart = Math.round(width * leftRatio);
    const xEnd = Math.round(width * rightRatio);
    const top = Math.round(height * 0.38);
    const bottom = Math.round(height * 0.82);
    let bestY = Math.round(height * 0.58);
    let bestScore = -Infinity;

    for (let y = top + 3; y < bottom; y += 1) {
      let score = 0;
      let samples = 0;
      for (let x = xStart; x < xEnd; x += 4) {
        score += Math.abs(luminanceAt(x, y + 3) - luminanceAt(x, y - 3));
        samples += 1;
      }
      const normalizedScore = samples ? score / samples : 0;
      if (normalizedScore > bestScore) {
        bestScore = normalizedScore;
        bestY = y;
      }
    }
    return (bestY / height) * 100;
  }

  const leftBoundary = findBoundary(0.12, 0.34);
  const centerBoundary = findBoundary(0.34, 0.66);
  const rightBoundary = findBoundary(0.66, 0.88);
  const topY = clamp((leftBoundary + centerBoundary + rightBoundary) / 3, 44, 76);
  const slope = clamp((rightBoundary - leftBoundary) * 0.25, -6, 6);

  return {
    points: [
      roundMaskPoint(13, topY - slope),
      roundMaskPoint(87, topY + slope),
      roundMaskPoint(96, 96),
      roundMaskPoint(4, 96)
    ],
    width,
    height,
    analysisMs: Math.round(performance.now() - startedAt)
  };
}
