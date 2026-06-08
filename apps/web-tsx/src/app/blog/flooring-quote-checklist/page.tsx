import type { Metadata } from "next";
import { getQuoteReviewGuideMetadata, QuoteReviewGuidePage } from "@/lib/quoteReviewGuides";

export const metadata: Metadata = getQuoteReviewGuideMetadata("flooring-quote-checklist");

export default function BlogGuidePage() {
  return <QuoteReviewGuidePage slug="flooring-quote-checklist" />;
}
