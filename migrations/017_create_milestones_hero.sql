-- Singleton content row for veritygear client's "Cột mốc" (milestones) page
-- banner (src/components/milestones/MilestonesHero.tsx). Always exactly one
-- row, id = 1.
CREATE TABLE IF NOT EXISTS milestones_hero (
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

ALTER TABLE milestones_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "milestones_hero_public_read" ON milestones_hero;
CREATE POLICY "milestones_hero_public_read"
  ON milestones_hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "milestones_hero_staff_write" ON milestones_hero;
CREATE POLICY "milestones_hero_staff_write"
  ON milestones_hero FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in MilestonesHero.tsx.
INSERT INTO milestones_hero (id, eyebrow_vi, eyebrow_en, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, image_url) VALUES (
  1,
  'Hành trình', 'Our journey',
  'Từng bước', 'khẳng định vị thế', 'Step by step', 'building our standing',
  '/images/about/setup-2.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Storage bucket for admin-uploaded "Cột mốc" page images (banner).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'milestones-images',
  'milestones-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "milestones_images_public_read" ON storage.objects;
CREATE POLICY "milestones_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'milestones-images');

DROP POLICY IF EXISTS "milestones_images_staff_write" ON storage.objects;
CREATE POLICY "milestones_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'milestones-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );
