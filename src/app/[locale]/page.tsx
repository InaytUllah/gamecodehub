import { getTranslations } from "next-intl/server";
import { GameCard } from "@/components/games/GameCard";
import { CodeCard } from "@/components/codes/CodeCard";
import { NewsletterForm } from "@/components/ads/NewsletterForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateWebSiteSchema } from "@/lib/seo/structured-data";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { GAMES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Code, ServerStatus } from "@/types/database";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return generatePageMetadata({
    title: t("homeTitle"),
    description: t("homeDescription"),
    locale,
    path: "",
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let games: { slug: string; name: string; color: string; codesCount: number; status: string }[] = [];
  let latestCodes: Code[] = [];

  try {
    const supabase = await createClient();

    // Get games with active code counts
    const { data: gamesData } = await supabase
      .from("games")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (gamesData) {
      const gamesList = await Promise.all(
        gamesData.map(async (game) => {
          const { count } = await supabase
            .from("codes")
            .select("*", { count: "exact", head: true })
            .eq("game_id", game.id)
            .eq("is_active", true);

          const { data: statusData } = await supabase
            .from("server_status")
            .select("status")
            .eq("game_id", game.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          const gameConst = GAMES.find((g) => g.slug === game.slug);
          return {
            slug: game.slug,
            name: game.name,
            color: gameConst?.color || "#6B7280",
            codesCount: count || 0,
            status: (statusData?.status as string) || "online",
          };
        })
      );
      games = gamesList;
    }

    // Get latest codes across all games
    const { data: codesData } = await supabase
      .from("codes")
      .select("*")
      .eq("is_active", true)
      .order("discovered_at", { ascending: false })
      .limit(6);

    if (codesData) latestCodes = codesData;
  } catch {
    // Use fallback data if Supabase is not configured
    games = GAMES.map((g) => ({
      slug: g.slug,
      name: g.name,
      color: g.color,
      codesCount: 0,
      status: "online",
    }));
  }

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />

      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {t("home.heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {t("home.heroSubtitle")}
        </p>
      </section>

      {/* Games Grid */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {t("home.gamesWeTrack")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard
              key={game.slug}
              slug={game.slug}
              name={game.name}
              color={game.color}
              activeCodesCount={game.codesCount}
              status={game.status as ServerStatus["status"]}
            />
          ))}
        </div>
      </section>

      {/* Latest Codes */}
      {latestCodes.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            {t("home.latestCodes")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {latestCodes.map((code) => (
              <CodeCard key={code.id} code={code} gameSlug="" />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mx-auto max-w-xl">
        <NewsletterForm />
      </section>
    </>
  );
}
