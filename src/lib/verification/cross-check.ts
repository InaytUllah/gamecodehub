interface CrossCheckResult {
  result: "working" | "expired" | "unknown";
  method: string;
  source: string;
  responseData?: Record<string, unknown>;
}

export class CrossChecker {
  async verify(code: string, gameSlug: string): Promise<CrossCheckResult | null> {
    const sources = this.getSourcesForGame(gameSlug);
    let foundCount = 0;
    let checkedCount = 0;

    for (const source of sources) {
      try {
        const found = await this.checkSource(source.url, code);
        checkedCount++;
        if (found) foundCount++;
      } catch {
        // Skip failed sources
      }
    }

    if (checkedCount === 0) return null;

    // If found on 2+ sources, consider verified
    if (foundCount >= 2) {
      return {
        result: "working",
        method: "scraper_cross_check",
        source: `${foundCount}/${checkedCount} sources`,
        responseData: { foundCount, checkedCount },
      };
    }

    // If checked 2+ sources and found on none, likely expired
    if (checkedCount >= 2 && foundCount === 0) {
      return {
        result: "expired",
        method: "scraper_cross_check",
        source: `0/${checkedCount} sources`,
        responseData: { foundCount: 0, checkedCount },
      };
    }

    return null;
  }

  private getSourcesForGame(gameSlug: string): { url: string; name: string }[] {
    const sources: Record<string, { url: string; name: string }[]> = {
      "genshin-impact": [
        { url: "https://game8.co/games/Genshin-Impact/archives/304759", name: "game8" },
        { url: "https://www.pockettactics.com/genshin-impact/codes", name: "pockettactics" },
      ],
      "free-fire": [
        { url: "https://www.sportskeeda.com/free-fire/free-fire-redeem-code-today", name: "sportskeeda" },
      ],
      "roblox": [
        { url: "https://progameguides.com/roblox/roblox-promo-codes-list/", name: "progameguides" },
      ],
      "pubg-mobile": [
        { url: "https://www.sportskeeda.com/pubg-mobile/pubg-mobile-redeem-codes-today", name: "sportskeeda" },
      ],
      "honkai-star-rail": [
        { url: "https://game8.co/games/Honkai-Star-Rail/archives/410296", name: "game8" },
        { url: "https://www.pockettactics.com/honkai-star-rail/codes", name: "pockettactics" },
      ],
    };

    return sources[gameSlug] || [];
  }

  private async checkSource(url: string, code: string): Promise<boolean> {
    const response = await fetch(url, {
      headers: { "User-Agent": "GameCodeHub/1.0 (code verification)" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return false;

    const html = await response.text();
    return html.includes(code);
  }
}
