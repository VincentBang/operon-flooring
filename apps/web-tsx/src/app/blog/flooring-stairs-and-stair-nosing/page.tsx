import type { Metadata } from "next";
import { getProductGuideMetadata, ProductGuidePage } from "@/lib/productSeoGuides";

export const metadata: Metadata = getProductGuideMetadata("flooring-stairs-and-stair-nosing");

export default function BlogGuidePage() {
  return <ProductGuidePage slug="flooring-stairs-and-stair-nosing" />;
}
