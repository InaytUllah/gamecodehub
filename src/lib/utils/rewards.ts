/**
 * Format raw reward strings from APIs into human-readable text.
 *
 * Input formats:
 *   "Primogem*30;Tattered Warrant*3;Mora*20000"
 *   "60 primogems and five adventurer's experience"
 *   "Stellar Jade x50 + Credits x10000"
 *   "Free Fire Rewards"
 *
 * Output: "30 Primogems + 3 Tattered Warrants + 20,000 Mora"
 */
export function formatRewards(raw: string | null): string {
  if (!raw) return "";

  // If already looks human-readable (no * or ; delimiters), return as-is
  if (!raw.includes("*") && !raw.includes(";")) {
    return raw;
  }

  // Parse "Item*Count;Item*Count" format
  const parts = raw.split(";").map((part) => part.trim()).filter(Boolean);

  const formatted = parts.map((part) => {
    const match = part.match(/^(.+?)\*(\d+)$/);
    if (match) {
      const item = match[1].trim();
      const count = parseInt(match[2], 10);
      return `${formatNumber(count)} ${item}`;
    }
    return part;
  });

  return formatted.join(" + ");
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return num.toLocaleString("en-US");
  }
  return num.toString();
}
