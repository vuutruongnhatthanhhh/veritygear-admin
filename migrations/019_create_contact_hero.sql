-- Singleton content row for veritygear client's "Liên hệ" (contact) page
-- banner (src/components/contact/ContactHero.tsx). Always exactly one row, id = 1.
CREATE TABLE IF NOT EXISTS contact_hero (
  id               SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi       TEXT NOT NULL DEFAULT '',
  eyebrow_en       TEXT NOT NULL DEFAULT '',

  heading_line1_vi TEXT NOT NULL DEFAULT '',
  heading_line2_vi TEXT NOT NULL DEFAULT '',
  heading_line1_en TEXT NOT NULL DEFAULT '',
  heading_line2_en TEXT NOT NULL DEFAULT '',

  body_vi          TEXT NOT NULL DEFAULT '',
  body_en          TEXT NOT NULL DEFAULT '',

  image_url        TEXT,

  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_hero_public_read" ON contact_hero;
CREATE POLICY "contact_hero_public_read"
  ON contact_hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "contact_hero_staff_write" ON contact_hero;
CREATE POLICY "contact_hero_staff_write"
  ON contact_hero FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in ContactHero.tsx.
INSERT INTO contact_hero (id, eyebrow_vi, eyebrow_en, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, body_vi, body_en, image_url) VALUES (
  1,
  'Liên hệ', 'Contact',
  'Chúng tôi', 'luôn lắng nghe', 'We are', 'always listening',
  'Có câu hỏi về sản phẩm, đơn hàng hay hợp tác? Đội ngũ VERITY GEAR phản hồi trong vòng 24 giờ.',
  'Questions about products, orders, or partnerships? The VERITY GEAR team replies within 24 hours.',
  '/images/about/setup-1.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Storage bucket for admin-uploaded "Liên hệ" page images (banner).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contact-images',
  'contact-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "contact_images_public_read" ON storage.objects;
CREATE POLICY "contact_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'contact-images');

DROP POLICY IF EXISTS "contact_images_staff_write" ON storage.objects;
CREATE POLICY "contact_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'contact-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );
