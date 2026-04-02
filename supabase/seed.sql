-- Seed games
INSERT INTO games (slug, name, official_site, redeem_url, sort_order) VALUES
  ('genshin-impact', 'Genshin Impact', 'https://genshin.hoyoverse.com', 'https://genshin.hoyoverse.com/en/gift', 1),
  ('free-fire', 'Free Fire', 'https://ff.garena.com', 'https://reward.ff.garena.com/en', 2),
  ('roblox', 'Roblox', 'https://www.roblox.com', 'https://www.roblox.com/redeem', 3),
  ('pubg-mobile', 'PUBG Mobile', 'https://www.pubgmobile.com', 'https://www.pubgmobile.com/en-US/event/redemption', 4),
  ('honkai-star-rail', 'Honkai: Star Rail', 'https://hsr.hoyoverse.com', 'https://hsr.hoyoverse.com/gift', 5);

-- Seed English translations for games
INSERT INTO game_translations (game_id, locale, name, description, how_to_redeem) VALUES
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'en', 'Genshin Impact',
   'Open-world action RPG by HoYoverse. Explore Teyvat, collect characters, and battle enemies.',
   '1. Go to the official Genshin Impact code redemption page\n2. Log in with your HoYoverse account\n3. Select your server and enter your character nickname\n4. Paste the code and click Redeem\n5. Check your in-game mail for rewards'),
  ((SELECT id FROM games WHERE slug = 'free-fire'), 'en', 'Free Fire',
   'Battle royale mobile game by Garena. Drop in, loot, and be the last one standing.',
   '1. Visit the Free Fire Rewards Redemption site\n2. Log in with your Free Fire account (Facebook, Google, etc.)\n3. Enter the 12-character redemption code\n4. Click Confirm and OK\n5. Collect rewards from the in-game mailbox'),
  ((SELECT id FROM games WHERE slug = 'roblox'), 'en', 'Roblox',
   'Online platform where you can play millions of user-created games and experiences.',
   '1. Go to the Roblox Promo Code Redemption page\n2. Log into your Roblox account\n3. Enter the promo code in the text box\n4. Click Redeem\n5. Check your Avatar inventory for the free item'),
  ((SELECT id FROM games WHERE slug = 'pubg-mobile'), 'en', 'PUBG Mobile',
   'Battle royale mobile game by Krafton. Land, loot, and survive to win.',
   '1. Go to the PUBG Mobile Redemption Center\n2. Enter your Character ID (found in game profile)\n3. Paste the redemption code\n4. Complete the verification\n5. Check your in-game mail for rewards'),
  ((SELECT id FROM games WHERE slug = 'honkai-star-rail'), 'en', 'Honkai: Star Rail',
   'Space fantasy RPG by HoYoverse. Board the Astral Express and explore the stars.',
   '1. Go to the official Honkai: Star Rail code redemption page\n2. Log in with your HoYoverse account\n3. Select your server and enter your character nickname\n4. Paste the code and click Redeem\n5. Check your in-game mail for rewards');

-- Seed sample codes for Genshin Impact
INSERT INTO codes (game_id, code, rewards, source, region, is_active, is_verified, discovered_at, expires_at) VALUES
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'GENSHINGIFT', '50 Primogems + 3 Hero''s Wit', 'social_media', 'global', true, true, now(), now() + interval '30 days'),
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'WABBY5HXYQ9H', '60 Primogems + 5 Adventurer''s Experience', 'livestream', 'global', true, true, now(), now() + interval '24 hours'),
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'NS92PG6DB52M', '100 Primogems + 10 Mystic Enhancement Ore', 'livestream', 'global', true, true, now(), now() + interval '24 hours');

-- Seed sample codes for Honkai: Star Rail
INSERT INTO codes (game_id, code, rewards, source, region, is_active, is_verified, discovered_at, expires_at) VALUES
  ((SELECT id FROM games WHERE slug = 'honkai-star-rail'), 'HSRGIFT2024', '50 Stellar Jade + 10,000 Credits', 'social_media', 'global', true, true, now(), now() + interval '30 days'),
  ((SELECT id FROM games WHERE slug = 'honkai-star-rail'), 'STARRAILGIFT', '60 Stellar Jade + 2 Traveler''s Guide', 'event', 'global', true, true, now(), now() + interval '7 days');

-- Seed sample codes for Free Fire
INSERT INTO codes (game_id, code, rewards, source, region, is_active, is_verified, discovered_at, expires_at) VALUES
  ((SELECT id FROM games WHERE slug = 'free-fire'), 'FFWS2024GLOBAL', 'Weapon Loot Crate + 2x Diamond Royale Voucher', 'event', 'global', true, true, now(), now() + interval '3 days'),
  ((SELECT id FROM games WHERE slug = 'free-fire'), 'X99TK56XDJ4X', 'Winterlands Weapon Loot Crate', 'social_media', 'global', true, false, now(), now() + interval '2 days');

-- Seed sample codes for Roblox
INSERT INTO codes (game_id, code, rewards, source, region, is_active, is_verified, discovered_at, expires_at) VALUES
  ((SELECT id FROM games WHERE slug = 'roblox'), 'TWEETROBLOX', 'The Bird Says Shoulder Pet', 'social_media', 'global', true, true, now() - interval '30 days', null),
  ((SELECT id FROM games WHERE slug = 'roblox'), 'DIY', 'Kinetic Staff', 'event', 'global', true, true, now() - interval '7 days', null);

-- Seed server status (all online)
INSERT INTO server_status (game_id, status, message) VALUES
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'online', 'All servers are operating normally.'),
  ((SELECT id FROM games WHERE slug = 'free-fire'), 'online', 'All servers are operating normally.'),
  ((SELECT id FROM games WHERE slug = 'roblox'), 'online', 'All servers are operating normally.'),
  ((SELECT id FROM games WHERE slug = 'pubg-mobile'), 'online', 'All servers are operating normally.'),
  ((SELECT id FROM games WHERE slug = 'honkai-star-rail'), 'online', 'All servers are operating normally.');
