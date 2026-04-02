import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { locales } from "@/i18n/routing";

interface MetadataParams {
  title: string;
  description: string;
  locale: string;
  path: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  noIndex = false,
}: MetadataParams): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  const alternates: Record<string, string> = {};
  for (const l of locales) {
    alternates[l] = `${SITE_URL}/${l}${path}`;
  }

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
