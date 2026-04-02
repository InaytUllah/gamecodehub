import { BaseScraper, type ScrapedCode } from "./base";
import { HOYO_CODES_API } from "@/lib/constants";

interface HoyoCode {
  code: string;
  rewards: string[];
}

export class HonkaiScraper extends BaseScraper {
  async scrape(): Promise<ScrapedCode[]> {
    try {
      const response = await this.fetchWithRetry(
        `${HOYO_CODES_API}/codes?game=hkrpg`
      );
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      return data.map((item: HoyoCode) => ({
        code: item.code,
        rewards: Array.isArray(item.rewards) ? item.rewards.join(" + ") : String(item.rewards || ""),
        source: "hoyo_codes_api",
        source_url: `${HOYO_CODES_API}/codes?game=hkrpg`,
        region: "global",
      }));
    } catch (error) {
      console.error("Honkai scraper error:", error);
      return [];
    }
  }
}
