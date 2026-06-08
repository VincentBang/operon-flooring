import type { Metadata } from "next";
import { getLocalSuburbMetadata, LocalSuburbPageView } from "@/lib/localSuburbPages";

const slug = "flooring-campbelltown";

export const metadata: Metadata = getLocalSuburbMetadata(slug);

export default function Page() {
  return <LocalSuburbPageView slug={slug} />;
}
