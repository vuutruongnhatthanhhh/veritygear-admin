-- News articles shown on veritygear's /tin-tuc list and /tin-tuc/[slug]
-- detail page. Ordered by published_at (not sort_order) since news is
-- naturally reverse-chronological. read_minutes is a plain number — the
-- client renders the "X phút đọc" / "X min read" wording itself via
-- next-intl so the label stays translated without an admin field for it.
CREATE TABLE IF NOT EXISTS news_articles (
  id             BIGSERIAL PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  category_id    BIGINT REFERENCES news_categories(id) ON DELETE SET NULL,

  title_vi       TEXT NOT NULL DEFAULT '',
  title_en       TEXT NOT NULL DEFAULT '',
  excerpt_vi     TEXT NOT NULL DEFAULT '',
  excerpt_en     TEXT NOT NULL DEFAULT '',

  image_url      TEXT,

  published_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  read_minutes   INT NOT NULL DEFAULT 5,

  is_active      BOOLEAN NOT NULL DEFAULT true,

  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_articles_public_read" ON news_articles;
CREATE POLICY "news_articles_public_read"
  ON news_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "news_articles_staff_write" ON news_articles;
CREATE POLICY "news_articles_staff_write"
  ON news_articles FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS news_articles_category_idx ON news_articles(category_id);
CREATE INDEX IF NOT EXISTS news_articles_published_idx ON news_articles(published_at DESC);

-- Storage bucket for admin-uploaded article cover images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "news_images_public_read" ON storage.objects;
CREATE POLICY "news_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'news-images');

DROP POLICY IF EXISTS "news_images_staff_write" ON storage.objects;
CREATE POLICY "news_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'news-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );

-- Seed with the articles already hardcoded in src/data/news.ts. English
-- titles/excerpts are left blank (falls back to Vietnamese on /en) — an
-- admin can fill them in from the Bài viết tab.
INSERT INTO news_articles (
  slug, category_id, title_vi, title_en, excerpt_vi, excerpt_en,
  image_url, published_at, read_minutes
) VALUES
  ('ra-mat-precision-series-2026', (SELECT id FROM news_categories WHERE slug = 'san-pham-moi'),
   'VERITY GEAR ra mắt bộ sưu tập PRECISION SERIES 2026', '',
   'Dòng sản phẩm chủ lực năm 2026 quy tụ bàn phím, chuột và tai nghe được tinh chỉnh cùng các tuyển thủ chuyên nghiệp, hướng tới độ chính xác tuyệt đối.', '',
   '/images/hero/hero-main.jpg', '2026-09-02', 4),
  ('ben-trong-xuong-che-tac', (SELECT id FROM news_categories WHERE slug = 'thuong-hieu'),
   'Bên trong xưởng chế tác VERITY GEAR', '',
   'Ghé thăm nơi mỗi bàn phím cơ VERITY GEAR được lắp ráp thủ công, kiểm định từng linh kiện trước khi đến tay game thủ.', '',
   '/images/about/engineer-circuit.jpg', '2026-08-20', 5),
  ('chon-ban-phim-co-phu-hop', (SELECT id FROM news_categories WHERE slug = 'huong-dan'),
   '5 mẹo chọn bàn phím cơ phù hợp với lối chơi của bạn', '',
   'Switch tuyến tính hay clicky? Layout full-size hay 75%? Đây là những yếu tố quan trọng nhất bạn cần cân nhắc trước khi xuống tiền.', '',
   '/images/products/keyboard-1.jpg', '2026-08-05', 6),
  ('dong-hanh-cung-giai-dau-mua-xuan', (SELECT id FROM news_categories WHERE slug = 'su-kien'),
   'VERITY GEAR đồng hành cùng giải đấu Esports mùa Xuân 2026', '',
   'Toàn bộ thiết bị thi đấu tại giải đấu năm nay được trang bị bởi VERITY GEAR, đánh dấu cột mốc hợp tác lớn nhất của thương hiệu trong lĩnh vực esports.', '',
   '/images/about/setup-2.jpg', '2026-07-18', 3),
  ('so-sanh-switch-tuyen-tinh-clicky', (SELECT id FROM news_categories WHERE slug = 'huong-dan'),
   'So sánh switch tuyến tính và switch clicky: đâu là lựa chọn cho game thủ?', '',
   'Mỗi loại switch mang lại trải nghiệm gõ hoàn toàn khác biệt. Cùng tìm hiểu ưu nhược điểm để chọn đúng loại switch cho nhu cầu của bạn.', '',
   '/images/products/keyboard-2.jpg', '2026-06-27', 5),
  ('cot-moc-50000-game-thu', (SELECT id FROM news_categories WHERE slug = 'thuong-hieu'),
   'Cột mốc 50.000 game thủ tin dùng VERITY GEAR', '',
   'Từ một xưởng nhỏ năm 2020, VERITY GEAR đã cán mốc 50.000 game thủ tin dùng trên 12 quốc gia — một hành trình đầy tự hào.', '',
   '/images/about/setup-1.jpg', '2026-05-14', 3)
ON CONFLICT (slug) DO NOTHING;
