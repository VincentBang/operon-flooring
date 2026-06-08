import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("how-to-compare-flooring-quotes");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="how-to-compare-flooring-quotes" />;
}
