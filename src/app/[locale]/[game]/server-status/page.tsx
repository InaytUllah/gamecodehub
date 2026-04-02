import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status/StatusBadge";
import { StatusTimeline } from "@/components/status/StatusTimeline";
import { StatusAlert } from "@/components/status/StatusAlert";
import { GameNav } from "@/components/games/GameNav";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { GAMES, getGameBySlug } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { ServerStatus } from "@/types/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameData = getGameBySlug(game);
  if (!gameData) return {};
  const t = await getTranslations({ locale, namespace: "seo" });

  return generatePageMetadata({
    title: t("statusTitle", { game: gameData.name }),
    description: t("statusDescription", { game: gameData.name }),
    locale,
    path: `/${game}/server-status`,
  });
}

export default async function ServerStatusPage({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameConst = getGameBySlug(game);
  if (!gameConst) notFound();

  const t = await getTranslations({ locale });

  let currentStatus: ServerStatus | null = null;
  let history: ServerStatus[] = [];

  try {
    const supabase = await createClient();

    const { data: dbGame } = await supabase
      .from("games")
      .select("id")
      .eq("slug", game)
      .single();

    if (dbGame) {
      const { data: statusData } = await supabase
        .from("server_status")
        .select("*")
        .eq("game_id", dbGame.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (statusData) currentStatus = statusData as ServerStatus;

      const { data: historyData } = await supabase
        .from("server_status")
        .select("*")
        .eq("game_id", dbGame.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (historyData) history = historyData as ServerStatus[];
    }
  } catch {
    // Fallback
  }

  const status = currentStatus?.status || "online";

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: t("common.home"), href: "/" },
          { label: gameConst.name, href: `/${game}` },
          { label: t("common.serverStatus") },
        ]}
      />

      <GameNav gameSlug={game} />

      <div className="mt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("status.pageTitle", { game: gameConst.name })}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("status.pageSubtitle", { game: gameConst.name })}
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("status.currentStatus")}
        </h2>
        <StatusBadge status={status as ServerStatus["status"]} size="lg" />
        {currentStatus?.message && (
          <p className="mt-3 text-gray-600 dark:text-gray-300">{currentStatus.message}</p>
        )}
      </div>

      {status === "maintenance" && currentStatus?.message && (
        <div className="mt-4">
          <StatusAlert
            message={currentStatus.message}
            maintenanceEnd={currentStatus.maintenance_end}
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("status.statusHistory")}
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <StatusTimeline history={history} />
        </div>
      </div>
    </>
  );
}
