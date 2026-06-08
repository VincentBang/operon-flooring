import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("hidden-flooring-costs");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="hidden-flooring-costs" />;
}
