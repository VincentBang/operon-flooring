import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { legacyBlogPages } from "@/lib/legacyBlogPages";

const page = legacyBlogPages["scotia-vs-skirting"];

export const metadata: Metadata = createPageMetadata({
  title: page.title,
  description: page.description,
  path: page.canonicalPath,
  image: page.image,
  robots: page.robots
});

export default function BlogGuidePage() {
  return (
    <Layout>
      {page.jsonLd ? <JsonLd data={page.jsonLd} /> : null}
      <div className="legacy-seo-content" dangerouslySetInnerHTML={{ __html: page.html }} />
    </Layout>
  );
}
