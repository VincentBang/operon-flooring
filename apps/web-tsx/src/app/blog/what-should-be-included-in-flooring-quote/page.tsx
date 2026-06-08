import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("what-should-be-included-in-flooring-quote");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="what-should-be-included-in-flooring-quote" />;
}
