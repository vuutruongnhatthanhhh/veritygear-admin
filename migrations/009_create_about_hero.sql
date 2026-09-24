-- Singleton content row for veritygear client's "Giới thiệu" (about) page
-- banner (src/components/about/AboutHero.tsx). Always exactly one row, id = 1.
CREATE TABLE IF NOT EXISTS about_hero (
  id             SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi     TEXT NOT NULL DEFAULT '',
  eyebrow_en     TEXT NOT NULL DEFAULT '',

  heading_line1_vi TEXT NOT NULL DEFAULT '',
  heading_line2_vi TEXT NOT NULL DEFAULT '',
  heading_line1_en TEXT NOT NULL DEFAULT '',
  heading_line2_en TEXT NOT NULL DEFAULT '',

  image_url      TEXT,

  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_hero_public_read" ON about_hero;
CREATE POLICY "about_hero_public_read"
  ON about_hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_hero_staff_write" ON about_hero;
CREATE POLICY "about_hero_staff_write"
  ON about_hero FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in AboutHero.tsx.
INSERT INTO about_hero (id, eyebrow_vi, eyebrow_en, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, image_url) VALUES (
  1,
  'Về chúng tôi', 'About us',
  'Chính xác là', 'ngôn ngữ của chúng tôi', 'Precision is', 'our language',
  '/images/about/setup-1.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Storage bucket for admin-uploaded "Giới thiệu" page images (banner, story
-- blocks, gallery, team). Separate from home-images so the media picker's
-- folder switcher keeps homepage vs about-page uploads apart.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-images',
  'about-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "about_images_public_read" ON storage.objects;
CREATE POLICY "about_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'about-images');

DROP POLICY IF EXISTS "about_images_staff_write" ON storage.objects;
CREATE POLICY "about_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'about-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );
