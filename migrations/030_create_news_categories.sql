-- News categories (chủ đề) shown as filter chips on veritygear's /tin-tuc page
-- and as the badge on each article. Same list-table pattern as
-- product_categories.
CREATE TABLE IF NOT EXISTS news_categories (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name_vi     TEXT NOT NULL DEFAULT '',
  name_en     TEXT NOT NULL DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_categories_public_read" ON news_categories;
CREATE POLICY "news_categories_public_read"
  ON news_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "news_categories_staff_write" ON news_categories;
CREATE POLICY "news_categories_staff_write"
  ON news_categories FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the categories already hardcoded in src/data/news.ts.
INSERT INTO news_categories (slug, name_vi, name_en, sort_order) VALUES
  ('san-pham-moi', 'Sản phẩm mới', 'New products', 1),
  ('thuong-hieu', 'Thương hiệu', 'Brand', 2),
  ('huong-dan', 'Hướng dẫn', 'Guides', 3),
  ('su-kien', 'Sự kiện', 'Events', 4)
ON CONFLICT (slug) DO NOTHING;
