import { BaseScraper, type ScrapedCode } from "./base";

// Known valid Roblox promo codes for validation
const KNOWN_ROBLOX_PATTERNS = [
  // Roblox promo codes tend to be readable words, not random strings
  // They often reference events, brands, or items
];

export class RobloxScraper extends BaseScraper {
  private isValidCode(code: string): boolean {
    // Roblox codes are 3-30 chars, mixed case allowed
    if (code.length < 3 || code.length > 30) return false;

    // Must not be a hex color code (6 chars, only hex chars)
    if (/^[A-Fa-f0-9]{6}$/.test(code)) return false;

    // Must not be all numbers
    if (/^\d+$/.test(code)) return false;

    // Blacklist common HTML/CSS/JS false positives
    const blacklist = [
      "CONFIGURATION", "COOKIEPATH", "DOCTYPE", "CHARSET",
      "JAVASCRIPT", "STYLESHEET", "DOCUMENT", "FUNCTION",
      "UNDEFINED", "PROTOTYPE", "INNERHTML", "CLASSNAME",
      "IMPORTANT", "OVERFLOW", "ABSOLUTE", "RELATIVE",
      "POSITION", "DISPLAY", "CONTENT", "PADDING",
      "BACKGROUND", "TRANSFORM", "ANIMATION", "TRANSITION",
      "FONTSIZE", "FONTFAMILY", "FONTWEIGHT", "TEXTALIGN",
      "MAXWIDTH", "MINWIDTH", "MAXHEIGHT", "MINHEIGHT",
      "FLEXWRAP", "GRIDAREA", "OPACITY", "ZINDEX",
      "VIEWPORT", "WINDOWOPEN", "ADDEVENTLISTENER",
      "QUERYSELECTOR", "GETELEMENTBY", "APPENDCHILD",
      "REMOVECHILD", "CREATEELEMENT", "INNERTEXT",
      "TEXTCONTENT", "SCROLLTOP", "SCROLLHEIGHT",
      "CLIENTWIDTH", "CLIENTHEIGHT", "OFFSETTOP",
      "CONSTRUCTOR", "SETTIMEOUT", "SETINTERVAL",
      "CLEARINTERVAL", "CLEARTIMEOUT", "LOCALSTORAGE",
      "SESSIONSTORAGE", "STRINGIFY", "PARSEINT",
      "PARSEFLOAT", "INDEXOF", "LASTINDEXOF",
      "STARTSWITH", "ENDSWITH", "INCLUDES", "REPLACEA",
      "AUTHOR", "FFFFFF", "FEFEFE", "EBEBEB",
    ];
    if (blacklist.some((b) => code.toUpperCase().includes(b))) return false;
    if (blacklist.some((b) => code.toUpperCase() === b)) return false;

    // Skip if it looks like a CSS color (# followed by hex)
    if (/^[A-Fa-f0-9]{3,8}$/.test(code)) return false;

    return true;
  }

  async scrape(): Promise<ScrapedCode[]> {
    const allCodes = new Map<string, ScrapedCode>();

    // Source 1: ProGameGuides (most reliable for Roblox)
    try {
      const response = await this.fetchWithRetry(
        "https://progameguides.com/roblox/roblox-promo-codes-list/",
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
        }
      );
      const html = await response.text();

      // Roblox codes on ProGameGuides are in <strong> tags within list items
      // Look for codes between specific markers
      const codeSection = html.match(/Active\s*(?:Promo\s*)?Codes[\s\S]*?Expired\s*(?:Promo\s*)?Codes/i);
      const searchArea = codeSection ? codeSection[0] : html;

      // Extract from strong tags — these are most reliable
      const strongMatches = searchArea.match(/<strong>([A-Za-z0-9_]{3,30})<\/strong>/g);
      if (strongMatches) {
        for (const match of strongMatches) {
          const code = match.replace(/<\/?strong>/g, "");
          if (this.isValidCode(code) && !allCodes.has(code)) {
            // Try to find reward description nearby
            const idx = searchArea.indexOf(match);
            const nearby = searchArea.slice(idx, idx + 300);
            const rewardMatch = nearby.match(/(?:free|get|receive|earn|unlock)\s+(?:a\s+)?([^<.!]{5,60})/i);

            allCodes.set(code, {
              code,
              rewards: rewardMatch ? rewardMatch[1].trim() : "Roblox Free Item",
              source: "progameguides",
              source_url: "https://progameguides.com/roblox/roblox-promo-codes-list/",
              region: "global",
            });
          }
        }
      }
    } catch (error) {
      console.error("Roblox scraper error:", error);
    }

    return Array.from(allCodes.values()).slice(0, 15);
  }
}
