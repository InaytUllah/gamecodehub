-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon_url TEXT,
  banner_url TEXT,
  official_site TEXT,
  redeem_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Game translations
CREATE TABLE game_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  how_to_redeem TEXT,
  UNIQUE(game_id, locale)
);

-- Redeem Codes
CREATE TABLE codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  rewards TEXT,
  source TEXT,
  source_url TEXT,
  region TEXT DEFAULT 'global',
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  discovered_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_id, code)
);

-- Code translations
CREATE TABLE code_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id UUID REFERENCES codes(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  rewards TEXT NOT NULL,
  UNIQUE(code_id, locale)
);

-- Server Status
CREATE TABLE server_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'online',
  message TEXT,
  maintenance_start TIMESTAMPTZ,
  maintenance_end TIMESTAMPTZ,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Server status translations
CREATE TABLE server_status_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status_id UUID REFERENCES server_status(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  message TEXT NOT NULL,
  UNIQUE(status_id, locale)
);

-- Banners / Shop rotations
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  banner_type TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  featured_items JSONB,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Banner translations
CREATE TABLE banner_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_id UUID REFERENCES banners(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  featured_items JSONB,
  UNIQUE(banner_id, locale)
);

-- Blog / Guide posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),
  slug TEXT UNIQUE NOT NULL,
  author TEXT DEFAULT 'GameCodeHub',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Post translations
CREATE TABLE post_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(post_id, locale)
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  locale TEXT DEFAULT 'en',
  games TEXT[] DEFAULT '{}',
  is_confirmed BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- Ad placements config
CREATE TABLE ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT UNIQUE NOT NULL,
  ad_code TEXT,
  is_active BOOLEAN DEFAULT true,
  placement_type TEXT DEFAULT 'adsense',
  page_pattern TEXT DEFAULT '*',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_codes_game_active ON codes(game_id, is_active);
CREATE INDEX idx_codes_discovered ON codes(discovered_at DESC);
CREATE INDEX idx_codes_expires ON codes(expires_at);
CREATE INDEX idx_banners_game_active ON banners(game_id, is_active);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_server_status_game ON server_status(game_id);

-- Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
