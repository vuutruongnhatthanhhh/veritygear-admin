-- Site-wide SEO defaults consumed by the client's root layout (metadataBase,
-- default <title>/description, Open Graph image, keywords) and the Organization
-- JSON-LD. Singleton row, bilingual, public-read so the client can render it.
-- Per-page SEO for products / news / custom pages already comes from each item's
-- own title & description fields — this only controls the site-wide fallbacks
-- and the homepage.
CREATE TABLE IF NOT EXISTS seo_settings (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  site_name       TEXT NOT NULL DEFAULT 'VERITY GEAR',

  title_vi        TEXT NOT NULL DEFAULT '',
  title_en        TEXT NOT NULL DEFAULT '',
  description_vi  TEXT NOT NULL DEFAULT '',
  description_en  TEXT NOT NULL DEFAULT '',
  keywords_vi     TEXT NOT NULL DEFAULT '',
  keywords_en     TEXT NOT NULL DEFAULT '',

  og_image_url    TEXT,

  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_settings_public_read" ON seo_settings;
CREATE POLICY "seo_settings_public_read"
  ON seo_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "seo_settings_staff_write" ON seo_settings;
CREATE POLICY "seo_settings_staff_write"
  ON seo_settings FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO seo_settings (id, site_name, title_vi, title_en, description_vi, description_en, keywords_vi, keywords_en) VALUES (
  1,
  'VERITY GEAR',
  'VERITY GEAR — Phụ Kiện Gaming Cao Cấp',
  'VERITY GEAR — Premium Gaming Gear',
  'VERITY GEAR — thương hiệu phụ kiện gaming cao cấp: bàn phím cơ, chuột, tai nghe và lót chuột được chế tác cho những game thủ không khoan nhượng.',
  'VERITY GEAR — a premium gaming accessories brand: mechanical keyboards, mice, headsets, and mousepads crafted for gamers who refuse to compromise.',
  'phụ kiện gaming, bàn phím cơ, chuột gaming, tai nghe gaming, lót chuột, tay cầm, VERITY GEAR',
  'gaming gear, mechanical keyboard, gaming mouse, gaming headset, mousepad, controller, VERITY GEAR'
) ON CONFLICT (id) DO NOTHING;
