import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { CodeList } from "@/components/codes/CodeList";
import { ExpiredCodes } from "@/components/codes/ExpiredCodes";
import { GameNav } from "@/components/games/GameNav";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema } from "@/lib/seo/structured-data";
import { GAMES, getGameBySlug } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonthYear } from "@/lib/utils/date";
import type { Code } from "@/types/database";

export function generateStaticParams() {
  return GAMES.map((game) => ({ game: game.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameData = getGameBySlug(game);
  if (!gameData) return {};
  const { month, year } = getCurrentMonthYear(locale);

  const t = await getTranslations({ locale, namespace: "seo" });
  return generatePageMetadata({
    title: t("codesTitle", { game: gameData.name, month, year }),
    description: t("codesDescription", { game: gameData.name, month, year }),
    locale,
    path: `/${game}/codes`,
  });
}

export default async function CodesPage({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameConst = getGameBySlug(game);
  if (!gameConst) notFound();

  const t = await getTranslations({ locale });
  const { month, year } = getCurrentMonthYear(locale);

  let activeCodes: Code[] = [];
  let expiredCodes: Code[] = [];
  let howToRedeem = "";

  try {
    const supabase = await createClient();

    const { data: dbGame } = await supabase
      .from("games")
      .select("id")
      .eq("slug", game)
      .single();

    if (dbGame) {
      const { data: active } = await supabase
        .from("codes")
        .select("*")
        .eq("game_id", dbGame.id)
        .eq("is_active", true)
        .order("discovered_at", { ascending: false });

      if (active) activeCodes = active;

      const { data: expired } = await supabase
        .from("codes")
        .select("*")
        .eq("game_id", dbGame.id)
        .eq("is_active", false)
        .order("discovered_at", { ascending: false })
        .limit(20);

      if (expired) expiredCodes = expired;

      const { data: translation } = await supabase
        .from("game_translations")
        .select("how_to_redeem")
        .eq("game_id", dbGame.id)
        .eq("locale", locale)
        .single();

      if (translation?.how_to_redeem) howToRedeem = translation.how_to_redeem;
    }
  } catch {
    // Fallback
  }

  const faqs = [
    {
      question: `How do I redeem ${gameConst.name} codes?`,
      answer: howToRedeem || `Visit the official ${gameConst.name} redemption site, log in, and enter the code to claim your rewards.`,
    },
    {
      question: `How often are new ${gameConst.name} codes released?`,
      answer: `New codes are typically released during special events, livestreams, and on official social media. We check for new codes every 2 hours.`,
    },
    {
      question: `Why isn't my ${gameConst.name} code working?`,
      answer: `Codes may have expired, be region-locked, or be limited to one use per account. Check the expiry date and region restrictions.`,
    },
  ];

  return (
    <>
      <JsonLd data={generateFAQSchema(faqs)} />
      <Breadcrumbs
        locale={locale}
        items={[
          { label: t("common.home"), href: "/" },
          { label: gameConst.name, href: `/${game}` },
          { label: t("common.codes") },
        ]}
      />

      <GameNav gameSlug={game} />

      <div className="mt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("codes.pageTitle", { game: gameConst.name, month, year })}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("codes.pageSubtitle", { game: gameConst.name })}
        </p>

        {gameConst.redeemUrl && (
          <a
            href={gameConst.redeemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("game.redeemOnOfficialSite")}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {t("game.activeCodes")}
        </h2>
        <CodeList
          codes={activeCodes}
          gameSlug={game}
          emptyMessage={t("common.noActiveCodes")}
        />
      </div>

      <ExpiredCodes codes={expiredCodes} gameSlug={game} />

      {/* How to Redeem */}
      {howToRedeem && (
        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("game.howToRedeem")}
          </h2>
          <div className="mt-4 whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
            {howToRedeem}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {t("game.faq")}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <summary className="cursor-pointer p-4 font-medium text-gray-900 dark:text-white">
                {faq.question}
              </summary>
              <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
