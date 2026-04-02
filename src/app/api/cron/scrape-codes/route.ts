import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GenshinScraper } from "@/lib/scrapers/genshin";
import { HonkaiScraper } from "@/lib/scrapers/honkai";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results: { game: string; newCodes: number; errors: string[] }[] = [];

  // Scrape Genshin Impact
  try {
    const { data: genshinGame } = await supabase
      .from("games")
      .select("id")
      .eq("slug", "genshin-impact")
      .single();

    if (genshinGame) {
      const scraper = new GenshinScraper();
      const codes = await scraper.scrape();
      let newCount = 0;

      for (const code of codes) {
        const { error } = await supabase.from("codes").upsert(
          {
            game_id: genshinGame.id,
            code: code.code,
            rewards: code.rewards,
            source: code.source,
            source_url: code.source_url,
            region: code.region,
            is_active: true,
            is_verified: true,
          },
          { onConflict: "game_id,code", ignoreDuplicates: true }
        );

        if (!error) newCount++;
      }

      results.push({ game: "genshin-impact", newCodes: newCount, errors: [] });
    }
  } catch (error) {
    results.push({ game: "genshin-impact", newCodes: 0, errors: [String(error)] });
  }

  // Scrape Honkai: Star Rail
  try {
    const { data: honkaiGame } = await supabase
      .from("games")
      .select("id")
      .eq("slug", "honkai-star-rail")
      .single();

    if (honkaiGame) {
      const scraper = new HonkaiScraper();
      const codes = await scraper.scrape();
      let newCount = 0;

      for (const code of codes) {
        const { error } = await supabase.from("codes").upsert(
          {
            game_id: honkaiGame.id,
            code: code.code,
            rewards: code.rewards,
            source: code.source,
            source_url: code.source_url,
            region: code.region,
            is_active: true,
            is_verified: true,
          },
          { onConflict: "game_id,code", ignoreDuplicates: true }
        );

        if (!error) newCount++;
      }

      results.push({ game: "honkai-star-rail", newCodes: newCount, errors: [] });
    }
  } catch (error) {
    results.push({ game: "honkai-star-rail", newCodes: 0, errors: [String(error)] });
  }

  return NextResponse.json({ results, timestamp: new Date().toISOString() });
}
