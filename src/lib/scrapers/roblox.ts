import { BaseScraper, type ScrapedCode } from "./base";

export class RobloxScraper extends BaseScraper {
  async scrape(): Promise<ScrapedCode[]> {
    const codes: ScrapedCode[] = [];

    try {
      // Scrape from Pro Game Guides Roblox codes page
      const response = await this.fetchWithRetry(
        "https://progameguides.com/roblox/roblox-promo-codes-list/"
      );
      const html = await response.text();

      // Look for promo codes in common HTML patterns
      // Roblox promo codes are typically short strings, often mixed case
      const codeBlockPattern = /<strong>([A-Za-z0-9_]{3,30})<\/strong>/g;
      let match;

      while ((match = codeBlockPattern.exec(html)) !== null) {
        const code = match[1];
        // Filter out common HTML/nav elements
        if (
          code.length >= 3 &&
          code.length <= 30 &&
          !["strong", "div", "span", "class", "href", "http", "https", "www"].includes(
            code.toLowerCase()
          ) &&
          !/^[a-z]+$/.test(code) // Exclude all-lowercase (likely HTML)
        ) {
          codes.push({
            code,
            rewards: "Roblox Free Item",
            source: "progameguides",
            source_url: "https://progameguides.com/roblox/roblox-promo-codes-list/",
            region: "global",
          });
        }
      }
    } catch (error) {
      console.error("Roblox scraper error:", error);
    }

    return codes.slice(0, 15); // Limit to 15 codes
  }
}
