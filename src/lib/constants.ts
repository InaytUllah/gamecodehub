export const SITE_NAME = "GameCodeHub";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gamecodehub.com";

export const GAMES = [
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    color: "#5B8AF5",
    redeemUrl: "https://genshin.hoyoverse.com/en/gift",
    officialSite: "https://genshin.hoyoverse.com",
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    color: "#FF6B35",
    redeemUrl: "https://reward.ff.garena.com/en",
    officialSite: "https://ff.garena.com",
  },
  {
    slug: "roblox",
    name: "Roblox",
    color: "#E2231A",
    redeemUrl: "https://www.roblox.com/redeem",
    officialSite: "https://www.roblox.com",
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    color: "#F2A900",
    redeemUrl: "https://www.pubgmobile.com/en-US/event/redemption",
    officialSite: "https://www.pubgmobile.com",
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    color: "#7B68EE",
    redeemUrl: "https://hsr.hoyoverse.com/gift",
    officialSite: "https://hsr.hoyoverse.com",
  },
] as const;

export type GameSlug = (typeof GAMES)[number]["slug"];

export const GAME_SLUGS = GAMES.map((g) => g.slug);

export const getGameBySlug = (slug: string) =>
  GAMES.find((g) => g.slug === slug);

export const AD_SLOTS = {
  HEADER_BANNER: "header_banner",
  SIDEBAR: "sidebar",
  IN_CONTENT: "in_content",
  FOOTER: "footer",
  BETWEEN_CODES: "between_codes",
} as const;

export const STATUS_COLORS = {
  online: "bg-green-500",
  maintenance: "bg-yellow-500",
  issues: "bg-orange-500",
  offline: "bg-red-500",
} as const;

export const HOYO_CODES_API = "https://hoyo-codes.seria.moe";
