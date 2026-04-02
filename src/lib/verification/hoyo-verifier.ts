import { HOYO_CODES_API } from "@/lib/constants";

interface HoyoVerifyResult {
  result: "working" | "expired" | "invalid" | "unknown";
  method: string;
  source: string;
  responseData?: Record<string, unknown>;
}

export class HoyoVerifier {
  async verify(code: string, gameSlug: string): Promise<HoyoVerifyResult | null> {
    try {
      const game = gameSlug === "genshin-impact" ? "genshin" : "hkrpg";
      const response = await fetch(`${HOYO_CODES_API}/codes?game=${game}`, {
        headers: { "User-Agent": "GameCodeHub/1.0" },
      });

      if (!response.ok) return null;

      const data = await response.json();

      if (!Array.isArray(data)) return null;

      // Check if the code exists in the active codes list
      const found = data.find(
        (c: { code: string }) => c.code.toUpperCase() === code.toUpperCase()
      );

      if (found) {
        return {
          result: "working",
          method: "api_status",
          source: "hoyo_codes_api",
          responseData: { found: true, rewards: found.rewards },
        };
      }

      // Code not found in active list — could be expired
      return {
        result: "expired",
        method: "api_status",
        source: "hoyo_codes_api",
        responseData: { found: false },
      };
    } catch (error) {
      console.error("HoYo verification error:", error);
      return null;
    }
  }
}
