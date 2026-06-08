import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("why-flooring-quotes-vary");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="why-flooring-quotes-vary" />;
}
