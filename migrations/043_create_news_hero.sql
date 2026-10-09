-- Singleton content row for veritygear client's "Tin tức" (news) page
-- banner (src/components/news/NewsHero.tsx). Always exactly one row, id = 1.
-- Reuses the existing news-images storage bucket — no new bucket needed.
CREATE TABLE IF NOT EXISTS news_hero (
  id               SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi       TEXT NOT NULL DEFAULT '',
  eyebrow_en       TEXT NOT NULL DEFAULT '',

  heading_line1_vi TEXT NOT NULL DEFAULT '',
  heading_line2_vi TEXT NOT NULL DEFAULT '',
  heading_line1_en TEXT NOT NULL DEFAULT '',
  heading_line2_en TEXT NOT NULL DEFAULT '',

  image_url        TEXT,

  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE news_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_hero_public_read" ON news_hero;
CREATE POLICY "news_hero_public_read"
  ON news_hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "news_hero_staff_write" ON news_hero;
CREATE POLICY "news_hero_staff_write"
  ON news_hero FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in NewsHero.tsx.
INSERT INTO news_hero (id, eyebrow_vi, eyebrow_en, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, image_url) VALUES (
  1,
  'Tin tức', 'News',
  'Chuyện của', 'VERITY GEAR', 'Stories from', 'VERITY GEAR',
  '/images/about/setup-2.jpg'
) ON CONFLICT (id) DO NOTHING;
