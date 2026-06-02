import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import type { LegacySeoPage } from "@/lib/legacySeoPages";

type LegacySeoPageViewProps = {
  page: LegacySeoPage;
};

function normalizeLegacyLinks(html: string) {
  return html
    .replace(/href=(["'])\/?index\.html#top\1/g, 'href=$1/#top$1')
    .replace(/href=(["'])\/?index\.html\1/g, 'href=$1/$1')
    .replace(/href=(["'])\/?blog\/index\.html\1/g, 'href=$1/blog/$1')
    .replace(/href=(["'])\/?blog\.html\1/g, 'href=$1/blog/$1');
}

export function LegacySeoPageView({ page }: LegacySeoPageViewProps) {
  return (
    <Layout>
      {page.jsonLd ? <JsonLd data={page.jsonLd} /> : null}
      <div className="legacy-seo-content" dangerouslySetInnerHTML={{ __html: normalizeLegacyLinks(page.html) }} />
    </Layout>
  );
}
