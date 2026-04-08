import { BaseScraper, type ScrapedCode } from "./base";

export class PubgMobileScraper extends BaseScraper {
  private isValidCode(code: string): boolean {
    if (code.length < 10 || code.length > 20) return false;
    if (!/[A-Z]/.test(code)) return false;
    if (!/[0-9]/.test(code)) return false;
    const blacklist = [
      "CONFIGURATION", "COOKIEPATH", "DOCTYPE", "CHARSET",
      "JAVASCRIPT", "STYLESHEET", "DOCUMENT", "FUNCTION",
      "UNDEFINED", "PROTOTYPE", "INNERHTML", "CLASSNAME",
    ];
    if (blacklist.some((b) => code.includes(b))) return false;
    if (/^[A-F0-9]{6}$/.test(code)) return false;
    return true;
  }

  async scrape(): Promise<ScrapedCode[]> {
    const allCodes = new Map<string, ScrapedCode>();

    // Source 1: Game8
    await this.scrapeSource(
      "https://game8.co/games/PUBG-Mobile/archives/396728",
      "game8",
      allCodes
    );

    // Source 2: ProGameGuides
    await this.scrapeSource(
      "https://progameguides.com/pubg-mobile/pubg-mobile-codes/",
      "progameguides",
      allCodes
    );

    // Source 3: PocketTactics
    await this.scrapeSource(
      "https://www.pockettactics.com/pubg-mobile/redeem-codes",
      "pockettactics",
      allCodes
    );

    return Array.from(allCodes.values()).slice(0, 10);
  }

  private async scrapeSource(url: string, sourceName: string, codes: Map<string, ScrapedCode>) {
    try {
      const response = await this.fetchWithRetry(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      });
      const html = await response.text();

      const matches = html.match(/\b[A-Z][A-Z0-9]{9,19}\b/g);
      if (!matches) return;

      for (const code of [...new Set(matches)]) {
        if (this.isValidCode(code) && !codes.has(code)) {
          const rewardMatch = html.match(
            new RegExp(`${code}[\\s\\S]{0,200}?(Silver|UC|BP|Crate|Skin|Outfit|Helmet|Parachute|AG|Fragment)[\\s\\S]{0,100}`, "i")
          );

          codes.set(code, {
            code,
            rewards: rewardMatch ? `PUBG Mobile Rewards (${rewardMatch[1]})` : "PUBG Mobile Rewards",
            source: sourceName,
            source_url: url,
            region: "global",
          });
        }
      }
    } catch (error) {
      console.error(`PUBG scraper error (${sourceName}):`, error);
    }
  }
}
