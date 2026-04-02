import { BaseScraper, type ScrapedCode } from "./base";

export class PubgMobileScraper extends BaseScraper {
  async scrape(): Promise<ScrapedCode[]> {
    const codes: ScrapedCode[] = [];

    try {
      // Scrape from Sportskeeda PUBG Mobile codes page
      const response = await this.fetchWithRetry(
        "https://www.sportskeeda.com/pubg-mobile/pubg-mobile-redeem-codes-today"
      );
      const html = await response.text();

      // PUBG Mobile codes are typically alphanumeric, varies in length
      const codeMatches = html.match(/\b[A-Z0-9]{10,20}\b/g);

      if (codeMatches) {
        const uniqueCodes = [...new Set(codeMatches)];
        for (const code of uniqueCodes) {
          if (
            code.length >= 10 &&
            code.length <= 20 &&
            !code.startsWith("HTTP") &&
            !code.startsWith("HTTPS") &&
            // Must contain both letters and numbers (typical for game codes)
            /[A-Z]/.test(code) &&
            /[0-9]/.test(code)
          ) {
            codes.push({
              code,
              rewards: "PUBG Mobile Rewards",
              source: "sportskeeda",
              source_url: "https://www.sportskeeda.com/pubg-mobile/pubg-mobile-redeem-codes-today",
              region: "global",
            });
          }
        }
      }
    } catch (error) {
      console.error("PUBG Mobile scraper error:", error);
    }

    return codes.slice(0, 10); // Limit to 10 codes
  }
}
