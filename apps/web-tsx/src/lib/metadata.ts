import type { Metadata } from "next";
import { absoluteUrl } from "./site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: string;
  openGraphDescription?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image,
  robots = "index,follow",
  openGraphDescription
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : undefined;
  const socialDescription = openGraphDescription || description;
  return {
    title,
    description,
    robots,
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      title,
      description: socialDescription,
      url: canonical,
      images: imageUrl ? [imageUrl] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: socialDescription,
      images: imageUrl ? [imageUrl] : undefined
    }
  };
}
