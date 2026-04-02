import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: "About GameCodeHub",
    description: "Learn about GameCodeHub - your daily source for game redeem codes, server status, and more.",
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
            GameCodeHub is your one-stop destination for the latest game redeem codes, server status updates,
            and banner rotations for the most popular mobile and cross-platform games.
          </p>
          <p>
            We automatically check for new codes every 2 hours and verify them to make sure they work.
            Our goal is simple: help you never miss a free reward.
          </p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Games We Cover</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Genshin Impact</li>
            <li>Free Fire / Free Fire MAX</li>
            <li>Roblox</li>
            <li>PUBG Mobile</li>
            <li>Honkai: Star Rail</li>
          </ul>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">How It Works</h2>
          <p>
            Our automated systems scan official sources, social media, and community channels for new
            redeem codes. Each code is verified before being listed on our site. You can copy any code
            with one click and use the direct link to the official redemption page.
          </p>
        </div>
      </div>
    </>
  );
}
