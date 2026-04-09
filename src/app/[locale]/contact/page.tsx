import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: "Contact Us",
    description: "Get in touch with GameCodeHub. Report issues, suggest features, or submit codes.",
    locale,
    path: "/contact",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ label: t("home"), href: "/" }, { label: t("contact") }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
        <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
          <p>Found a broken code or have one we're missing? Let us know.</p>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Email</h2>
            <p className="mt-1">contact@gamecodehub.com</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Submit a code</h2>
            <p className="mt-1">
              If you have a working code we haven't listed, email it to us. We'll test it and add it if it checks out.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
