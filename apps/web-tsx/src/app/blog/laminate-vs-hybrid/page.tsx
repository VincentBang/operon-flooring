import type { Metadata } from "next";
import { getProductGuideMetadata, ProductGuidePage } from "@/lib/productSeoGuides";

export const metadata: Metadata = getProductGuideMetadata("laminate-vs-hybrid");

export default function BlogGuidePage() {
  return <ProductGuidePage slug="laminate-vs-hybrid" />;
}
