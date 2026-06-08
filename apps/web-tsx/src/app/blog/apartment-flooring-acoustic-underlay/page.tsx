import type { Metadata } from "next";
import { getProductGuideMetadata, ProductGuidePage } from "@/lib/productSeoGuides";

export const metadata: Metadata = getProductGuideMetadata("apartment-flooring-acoustic-underlay");

export default function BlogGuidePage() {
  return <ProductGuidePage slug="apartment-flooring-acoustic-underlay" />;
}
