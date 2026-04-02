import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCronAuth } from "@/lib/utils/cron-auth";
import { GenshinScraper } from "@/lib/scrapers/genshin";
import { HonkaiScraper } from "@/lib/scrapers/honkai";
import { FreeFireScraper } from "@/lib/scrapers/freefire";
import { RobloxScraper } from "@/lib/scrapers/roblox";
import { PubgMobileScraper } from "@/lib/scrapers/pubg";
import { BaseScraper } from "@/lib/scrapers/base";

export const maxDuration = 60; // Allow up to 60s for scraping all games

interface ScraperConfig {
  slug: string;
  scraper: BaseScraper;
  verified: boolean;
}

const scraperConfigs: ScraperConfig[] = [
  { slug: "genshin-impact", scraper: new GenshinScraper(), verified: true },
  { slug: "honkai-star-rail", scraper: new HonkaiScraper(), verified: true },
  { slug: "free-fire", scraper: new FreeFireScraper(), verified: false },
  { slug: "roblox", scraper: new RobloxScraper(), verified: false },
  { slug: "pubg-mobile", scraper: new PubgMobileScraper(), verified: false },
];

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results: { game: string; newCodes: number; errors: string[] }[] = [];

  for (const config of scraperConfigs) {
    try {
      const { data: game } = await supabase
        .from("games")
        .select("id")
        .eq("slug", config.slug)
        .single();

      if (!game) {
        results.push({ game: config.slug, newCodes: 0, errors: ["Game not found in DB"] });
        continue;
      }

      const codes = await config.scraper.scrape();
      let newCount = 0;

      for (const code of codes) {
        const { error } = await supabase.from("codes").upsert(
          {
            game_id: game.id,
            code: code.code,
            rewards: code.rewards,
            source: code.source,
            source_url: code.source_url,
            region: code.region,
            expires_at: code.expires_at,
            is_active: true,
            is_verified: config.verified,
          },
          { onConflict: "game_id,code", ignoreDuplicates: true }
        );

        if (!error) newCount++;
      }

      results.push({ game: config.slug, newCodes: newCount, errors: [] });
    } catch (error) {
      results.push({ game: config.slug, newCodes: 0, errors: [String(error)] });
    }
  }

  return NextResponse.json({ results, timestamp: new Date().toISOString() });
}
