export interface Game {
  id: string;
  slug: string;
  name: string;
  icon_url: string | null;
  banner_url: string | null;
  official_site: string | null;
  redeem_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GameTranslation {
  id: string;
  game_id: string;
  locale: string;
  name: string;
  description: string | null;
  how_to_redeem: string | null;
}

export interface Code {
  id: string;
  game_id: string;
  code: string;
  rewards: string | null;
  source: string | null;
  source_url: string | null;
  region: string;
  is_active: boolean;
  is_verified: boolean;
  discovered_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CodeTranslation {
  id: string;
  code_id: string;
  locale: string;
  rewards: string;
}

export interface ServerStatus {
  id: string;
  game_id: string;
  status: "online" | "maintenance" | "issues" | "offline";
  message: string | null;
  maintenance_start: string | null;
  maintenance_end: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  game_id: string;
  banner_type: string;
  title: string;
  image_url: string | null;
  featured_items: FeaturedItem[] | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedItem {
  name: string;
  image_url?: string;
  rarity?: string;
}

export interface BannerTranslation {
  id: string;
  banner_id: string;
  locale: string;
  title: string;
  featured_items: FeaturedItem[] | null;
}

export interface Post {
  id: string;
  game_id: string | null;
  slug: string;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostTranslation {
  id: string;
  post_id: string;
  locale: string;
  title: string;
  excerpt: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
}

export interface Subscriber {
  id: string;
  email: string;
  locale: string;
  games: string[];
  is_confirmed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface AdPlacement {
  id: string;
  slot_name: string;
  ad_code: string | null;
  is_active: boolean;
  placement_type: string;
  page_pattern: string;
  created_at: string;
}

// Joined types for convenience
export interface GameWithTranslation extends Game {
  translation?: GameTranslation;
}

export interface CodeWithGame extends Code {
  game?: Game;
}
