import { BaseScraper, type ScrapedCode } from "./base";

export class FreeFireScraper extends BaseScraper {
  private readonly codePattern = /^[A-Z0-9]{12,16}$/;

  async scrape(): Promise<ScrapedCode[]> {
    const codes: ScrapedCode[] = [];

    try {
      // Scrape from Sportskeeda Free Fire codes page
      const response = await this.fetchWithRetry(
        "https://www.sportskeeda.com/free-fire/free-fire-redeem-code-today"
      );
      const html = await response.text();

      // Extract codes using regex pattern for 12-16 char alphanumeric strings
      // Free Fire codes are typically 12 characters, all uppercase alphanumeric
      const codeMatches = html.match(/\b[A-Z0-9]{12,16}\b/g);

      if (codeMatches) {
        const uniqueCodes = [...new Set(codeMatches)];
        for (const code of uniqueCodes) {
          // Filter out common false positives
          if (
            this.codePattern.test(code) &&
            !code.startsWith("HTTP") &&
            !code.startsWith("HTTPS") &&
            !code.startsWith("UUID") &&
            code.length >= 12
          ) {
            codes.push({
              code,
              rewards: "Free Fire Rewards",
              source: "sportskeeda",
              source_url: "https://www.sportskeeda.com/free-fire/free-fire-redeem-code-today",
              region: "global",
            });
          }
        }
      }
    } catch (error) {
      console.error("Free Fire scraper error:", error);
    }

    return codes.slice(0, 10); // Limit to 10 codes
  }
}
