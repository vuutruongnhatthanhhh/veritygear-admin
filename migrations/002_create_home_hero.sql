-- Singleton content row for veritygear client's homepage hero section
-- (src/components/Hero.tsx). Always exactly one row, id = 1, upserted from
-- the admin panel's trang-chu/hero page — never inserted/deleted by the app.
CREATE TABLE IF NOT EXISTS home_hero (
  id                 SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi         TEXT NOT NULL DEFAULT '',
  eyebrow_en         TEXT NOT NULL DEFAULT '',

  heading_line1_vi   TEXT NOT NULL DEFAULT '',
  heading_line2_vi   TEXT NOT NULL DEFAULT '',
  heading_line1_en   TEXT NOT NULL DEFAULT '',
  heading_line2_en   TEXT NOT NULL DEFAULT '',

  body_vi            TEXT NOT NULL DEFAULT '',
  body_en            TEXT NOT NULL DEFAULT '',

  cta1_label_vi      TEXT NOT NULL DEFAULT '',
  cta1_label_en      TEXT NOT NULL DEFAULT '',
  cta1_url           TEXT NOT NULL DEFAULT '#',

  cta2_label_vi      TEXT NOT NULL DEFAULT '',
  cta2_label_en      TEXT NOT NULL DEFAULT '',
  cta2_url           TEXT NOT NULL DEFAULT '#',

  image_url          TEXT,

  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_hero_public_read" ON home_hero;
CREATE POLICY "home_hero_public_read"
  ON home_hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_hero_staff_write" ON home_hero;
CREATE POLICY "home_hero_staff_write"
  ON home_hero FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in Hero.tsx, so switching to DB-driven
-- content doesn't change what visitors see until an admin/mod edits it.
INSERT INTO home_hero (
  id, eyebrow_vi, eyebrow_en,
  heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en,
  body_vi, body_en,
  cta1_label_vi, cta1_label_en, cta1_url,
  cta2_label_vi, cta2_label_en, cta2_url,
  image_url
) VALUES (
  1, 'Bộ sưu tập 2026 — Precision Series', '2026 Collection — Precision Series',
  'Unleash Your', 'Precision', 'Unleash Your', 'Precision',
  'Phụ kiện gaming cao cấp được chế tác cho những game thủ không khoan nhượng — chính xác đến từng khung hình.',
  'Premium gaming gear crafted for gamers who refuse to compromise — precise down to every frame.',
  'Khám phá bộ sưu tập', 'Explore the collection', '#san-pham',
  'Câu chuyện thương hiệu', 'Our brand story', '/gioi-thieu',
  '/images/hero/hero-main.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Storage bucket for admin-uploaded homepage images (hero + brand story).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'home-images',
  'home-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "home_images_public_read" ON storage.objects;
CREATE POLICY "home_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'home-images');

DROP POLICY IF EXISTS "home_images_staff_write" ON storage.objects;
CREATE POLICY "home_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'home-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );
