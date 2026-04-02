import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: "Privacy Policy",
    description: "Privacy policy for GameCodeHub.",
    locale,
    path: "/privacy",
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ label: t("home"), href: "/" }, { label: t("privacy") }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Last updated:</strong> April 2026</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">Information We Collect</h2>
          <p>We collect minimal information to provide our service: email addresses for newsletter subscribers and anonymous analytics data via Google Analytics.</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">Cookies</h2>
          <p>We use cookies for analytics (Google Analytics) and advertising (Google AdSense). You can opt out through your browser settings.</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">Third-Party Services</h2>
          <p>We use Google Analytics for traffic analysis, Google AdSense for advertising, and Supabase for data storage. Each has their own privacy policy.</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">Contact</h2>
          <p>For privacy concerns, contact us at contact@gamecodehub.com.</p>
        </div>
      </div>
    </>
  );
}
