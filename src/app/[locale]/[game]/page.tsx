import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { GameHero } from "@/components/games/GameHero";
import { GameNav } from "@/components/games/GameNav";
import { CodeList } from "@/components/codes/CodeList";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { GAMES, getGameBySlug } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import type { Code, ServerStatus } from "@/types/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameData = getGameBySlug(game);
  if (!gameData) return {};

  return generatePageMetadata({
    title: `${gameData.name} - Codes, Status & Banners`,
    description: `Get the latest ${gameData.name} redeem codes, check server status, and view current banners. Updated daily.`,
    locale,
    path: `/${game}`,
  });
}

export default async function GamePage({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameConst = getGameBySlug(game);
  if (!gameConst) notFound();

  const t = await getTranslations({ locale });

  let activeCodes: Code[] = [];
  let status: ServerStatus["status"] = "online";
  let description = "";

  try {
    const supabase = await createClient();

    const { data: dbGame } = await supabase
      .from("games")
      .select("*")
      .eq("slug", game)
      .single();

    if (dbGame) {
      const { data: codes } = await supabase
        .from("codes")
        .select("*")
        .eq("game_id", dbGame.id)
        .eq("is_active", true)
        .order("discovered_at", { ascending: false })
        .limit(5);

      if (codes) activeCodes = codes;

      const { data: statusData } = await supabase
        .from("server_status")
        .select("*")
        .eq("game_id", dbGame.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (statusData) status = statusData.status as ServerStatus["status"];

      const { data: translation } = await supabase
        .from("game_translations")
        .select("*")
        .eq("game_id", dbGame.id)
        .eq("locale", locale)
        .single();

      if (translation) description = translation.description || "";
    }
  } catch {
    // Fallback
  }

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: t("common.home"), href: "/" },
          { label: gameConst.name },
        ]}
      />

      <GameHero
        name={gameConst.name}
        description={description || `Get the latest codes and updates for ${gameConst.name}.`}
        color={gameConst.color}
        status={status}
        activeCodesCount={activeCodes.length}
      />

      <div className="mt-6">
        <GameNav gameSlug={game} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("game.activeCodes")}
            </h2>
            <Link
              href={`/${game}/codes`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t("common.viewAll")} →
            </Link>
          </div>
          <CodeList
            codes={activeCodes}
            gameSlug={game}
            emptyMessage={t("common.noActiveCodes")}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              {t("common.serverStatus")}
            </h3>
            <StatusBadge status={status} size="lg" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {status === "online" ? t("game.serverOnline") : ""}
            </p>
          </div>

          {gameConst.redeemUrl && (
            <a
              href={gameConst.redeemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {t("game.redeemOnOfficialSite")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
