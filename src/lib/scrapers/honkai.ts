import { BaseScraper, type ScrapedCode } from "./base";
import { HOYO_CODES_API } from "@/lib/constants";
import { formatRewards } from "@/lib/utils/rewards";

interface HoyoCode {
  code: string;
  rewards: string;
  status: string;
}

interface HoyoResponse {
  codes: HoyoCode[];
  game: string;
}

export class HonkaiScraper extends BaseScraper {
  async scrape(): Promise<ScrapedCode[]> {
    try {
      const response = await this.fetchWithRetry(
        `${HOYO_CODES_API}/codes?game=hkrpg`
      );
      const data: HoyoResponse = await response.json();

      const codes = data.codes || (Array.isArray(data) ? data : []);
      if (!Array.isArray(codes)) return [];

      return codes
        .filter((item) => item.status === "OK")
        .map((item) => ({
          code: item.code,
          rewards: formatRewards(item.rewards) || "Honkai: Star Rail Rewards",
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
