import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("common-flooring-quote-exclusions");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="common-flooring-quote-exclusions" />;
}
