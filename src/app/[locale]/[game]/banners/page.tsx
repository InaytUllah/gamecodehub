import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { BannerCard } from "@/components/banners/BannerCard";
import { GameNav } from "@/components/games/GameNav";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { GAMES, getGameBySlug } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/types/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameData = getGameBySlug(game);
  if (!gameData) return {};
  const t = await getTranslations({ locale, namespace: "seo" });

  return generatePageMetadata({
    title: t("bannersTitle", { game: gameData.name }),
    description: t("bannersDescription", { game: gameData.name }),
    locale,
    path: `/${game}/banners`,
  });
}

export default async function BannersPage({ params }: { params: Promise<{ locale: string; game: string }> }) {
  const { locale, game } = await params;
  const gameConst = getGameBySlug(game);
  if (!gameConst) notFound();

  const t = await getTranslations({ locale });

  let banners: Banner[] = [];

  try {
    const supabase = await createClient();

    const { data: dbGame } = await supabase
      .from("games")
      .select("id")
      .eq("slug", game)
      .single();

    if (dbGame) {
      const { data: bannersData } = await supabase
        .from("banners")
        .select("*")
        .eq("game_id", dbGame.id)
        .eq("is_active", true)
        .order("starts_at", { ascending: false });

      if (bannersData) banners = bannersData as Banner[];
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
          { label: gameConst.name, href: `/${game}` },
          { label: t("common.banners") },
        ]}
      />

      <GameNav gameSlug={game} />

      <div className="mt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("banners.pageTitle", { game: gameConst.name })}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("banners.pageSubtitle")}
        </p>
      </div>

      <div className="mt-8">
        {banners.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {banners.map((banner) => (
              <BannerCard key={banner.id} banner={banner} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">{t("banners.noBanners")}</p>
          </div>
        )}
      </div>
    </>
  );
}
