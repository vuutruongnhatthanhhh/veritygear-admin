-- Admin-authored static pages (e.g. "Chính sách bảo mật", "Điều khoản dịch
-- vụ") rendered at /trang/[slug] on the client and linked from the "Công ty"
-- column of the footer. Ordered by sort_order like every other manually
-- curated list (unlike news_articles, which is reverse-chronological).
CREATE TABLE IF NOT EXISTS custom_pages (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,

  title_vi    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  content_vi  TEXT NOT NULL DEFAULT '',
  content_en  TEXT NOT NULL DEFAULT '',

  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "custom_pages_public_read" ON custom_pages;
CREATE POLICY "custom_pages_public_read"
  ON custom_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "custom_pages_staff_write" ON custom_pages;
CREATE POLICY "custom_pages_staff_write"
  ON custom_pages FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS custom_pages_sort_idx ON custom_pages(sort_order);

-- Storage bucket for images inserted into a custom page via the rich-text editor.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-pages-images',
  'custom-pages-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "custom_pages_images_public_read" ON storage.objects;
CREATE POLICY "custom_pages_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'custom-pages-images');

DROP POLICY IF EXISTS "custom_pages_images_staff_write" ON storage.objects;
CREATE POLICY "custom_pages_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'custom-pages-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );
