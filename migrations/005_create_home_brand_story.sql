-- Singleton content row for veritygear client's homepage brand-story teaser
-- (src/components/BrandStoryTeaser.tsx). Always exactly one row, id = 1.
CREATE TABLE IF NOT EXISTS home_brand_story (
  id             SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi     TEXT NOT NULL DEFAULT '',
  eyebrow_en     TEXT NOT NULL DEFAULT '',

  heading_vi     TEXT NOT NULL DEFAULT '',
  heading_en     TEXT NOT NULL DEFAULT '',

  body_vi        TEXT NOT NULL DEFAULT '',
  body_en        TEXT NOT NULL DEFAULT '',

  cta_label_vi   TEXT NOT NULL DEFAULT '',
  cta_label_en   TEXT NOT NULL DEFAULT '',
  cta_url        TEXT NOT NULL DEFAULT '/gioi-thieu',

  image_url      TEXT,

  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_brand_story ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_brand_story_public_read" ON home_brand_story;
CREATE POLICY "home_brand_story_public_read"
  ON home_brand_story FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_brand_story_staff_write" ON home_brand_story;
CREATE POLICY "home_brand_story_staff_write"
  ON home_brand_story FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in BrandStoryTeaser.tsx.
INSERT INTO home_brand_story (
  id, eyebrow_vi, eyebrow_en, heading_vi, heading_en, body_vi, body_en,
  cta_label_vi, cta_label_en, cta_url, image_url
) VALUES (
  1,
  'Câu chuyện của chúng tôi', 'Our story',
  'Chế tác cho những kẻ không khoan nhượng', 'Crafted for the uncompromising',
  'VERITY GEAR ra đời từ nỗi ám ảnh với sự chính xác. Mỗi sản phẩm là kết quả của hàng trăm giờ thử nghiệm cùng các tuyển thủ chuyên nghiệp — không thỏa hiệp giữa hiệu năng và vẻ đẹp tối giản.',
  'VERITY GEAR was born from an obsession with precision. Every product is the result of hundreds of hours of testing with professional players — no compromise between performance and minimalist design.',
  'Đọc câu chuyện thương hiệu →', 'Read our brand story →', '/gioi-thieu',
  '/images/about/engineer-circuit.jpg'
) ON CONFLICT (id) DO NOTHING;
