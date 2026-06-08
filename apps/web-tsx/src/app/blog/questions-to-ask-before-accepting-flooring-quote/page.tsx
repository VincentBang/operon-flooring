import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("questions-to-ask-before-accepting-flooring-quote");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="questions-to-ask-before-accepting-flooring-quote" />;
}
