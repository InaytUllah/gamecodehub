import type { Locale } from "@/i18n/routing";

export interface PageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export interface GamePageProps {
  params: Promise<{
    locale: Locale;
    game: string;
  }>;
}

export interface SlugPageProps {
  params: Promise<{
    locale: Locale;
    game: string;
    slug: string;
  }>;
}
