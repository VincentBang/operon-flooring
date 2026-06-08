import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("flooring-quote-review-sydney");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="flooring-quote-review-sydney" />;
}
