import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { LocalAuthorityExpansion } from "@/components/seo/LocalAuthorityExpansion";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";

const page = legacySeoPages["flooring-mosman"];

export const metadata: Metadata = createPageMetadata({
  title: page.title,
  description: page.description,
  path: page.canonicalPath,
  image: page.image,
  robots: page.robots
});

export default function Page() {
  return (
    <LegacySeoPageView page={page}>
      <LocalAuthorityExpansion slug="flooring-mosman" />
    </LegacySeoPageView>
  );
}
