import { BaseScraper, type ScrapedCode } from "./base";

export class FreeFireScraper extends BaseScraper {
  // Free Fire codes: 12-16 chars, alphanumeric, typically start with uppercase
  // Must contain both letters and numbers to avoid false positives
  private isValidCode(code: string): boolean {
    if (code.length < 10 || code.length > 18) return false;
    if (!/[A-Z]/.test(code)) return false;
    if (!/[0-9]/.test(code)) return false;
    // Exclude common false positives
    const blacklist = [
      "CONFIGURATION", "COOKIEPATH", "DOCTYPE", "CHARSET",
      "JAVASCRIPT", "STYLESHEET", "DOCUMENT", "FUNCTION",
      "UNDEFINED", "PROTOTYPE", "INNERHTML", "CLASSNAME",
    ];
    if (blacklist.some((b) => code.includes(b))) return false;
    // Must not be a hex color
    if (/^[A-F0-9]{6}$/.test(code)) return false;
    return true;
  }

  async scrape(): Promise<ScrapedCode[]> {
    const allCodes = new Map<string, ScrapedCode>();

    // Source 1: ProGameGuides
    await this.scrapeSource(
      "https://progameguides.com/free-fire/free-fire-redeem-codes/",
      "progameguides",
      allCodes
    );

    // Source 2: Game8
    await this.scrapeSource(
      "https://game8.co/games/FREEFIRE/archives/305850",
      "game8",
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

      // Extract potential codes
      const matches = html.match(/\b[A-Z][A-Z0-9]{9,17}\b/g);
      if (!matches) return;

      for (const code of [...new Set(matches)]) {
        if (this.isValidCode(code) && !codes.has(code)) {
          // Try to extract reward text near the code
          const rewardMatch = html.match(
            new RegExp(`${code}[\\s\\S]{0,200}?(Diamond|Gold|Crate|Voucher|Bundle|Skin|Pet|Emote|Loot)[\\s\\S]{0,100}`, "i")
          );

          codes.set(code, {
            code,
            rewards: rewardMatch ? `Free Fire Rewards (${rewardMatch[1]})` : "Free Fire Rewards",
            source: sourceName,
            source_url: url,
            region: "global",
          });
        }
      }
    } catch (error) {
      console.error(`Free Fire scraper error (${sourceName}):`, error);
    }
  }
}
