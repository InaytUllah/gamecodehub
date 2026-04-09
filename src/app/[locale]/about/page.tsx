import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: "About GameCodeHub",
    description: "What GameCodeHub does, how the scrapers work, and which games we cover.",
    locale,
    path: "/about",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ label: t("home"), href: "/" }, { label: t("about") }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About GameCodeHub</h1>
        <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            GameCodeHub collects redeem codes for mobile games and checks if they still work.
            Scrapers run every 2 hours. The verification system re-checks active codes every 30 minutes.
          </p>
          <p>
            If a code stops working, the site flags it automatically. You can also report broken codes
            yourself using the thumbs up/down buttons on each code.
          </p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Games we cover</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Genshin Impact (codes from HoYoverse API, verified)</li>
            <li>Honkai: Star Rail (codes from HoYoverse API, verified)</li>
            <li>Roblox (promo codes from ProGameGuides)</li>
            <li>Free Fire (codes from Game8 and ProGameGuides)</li>
            <li>PUBG Mobile (codes from Game8 and PocketTactics)</li>
          </ul>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">How it works</h2>
          <p>
            Scrapers pull codes from game APIs and gaming news sites. For Genshin and Honkai,
            we use the hoyo-codes API which is reliable. For other games, we scrape multiple sites
            and cross reference to filter out junk. Codes you see here have been checked against
            at least one source within the last few hours.
          </p>
        </div>
      </div>
    </>
  );
}
