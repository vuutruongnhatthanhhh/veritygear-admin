-- Photo grid on the "Giới thiệu" page (src/components/about/Gallery.tsx).
CREATE TABLE IF NOT EXISTS about_gallery_images (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  image_url   TEXT NOT NULL DEFAULT '',
  alt_vi      TEXT NOT NULL DEFAULT '',
  alt_en      TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_gallery_images_public_read" ON about_gallery_images;
CREATE POLICY "about_gallery_images_public_read"
  ON about_gallery_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_gallery_images_staff_write" ON about_gallery_images;
CREATE POLICY "about_gallery_images_staff_write"
  ON about_gallery_images FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS about_gallery_images_sort_idx ON about_gallery_images(sort_order);

-- Seed with the images already hardcoded in Gallery.tsx.
INSERT INTO about_gallery_images (sort_order, image_url, alt_vi, alt_en) VALUES
  (1, '/images/products/keyboard-1.jpg', 'Chi tiết bàn phím cơ VERITY GEAR', 'VERITY GEAR mechanical keyboard detail'),
  (2, '/images/products/headset-2.jpg', 'Chi tiết tai nghe VERITY GEAR', 'VERITY GEAR headset detail'),
  (3, '/images/products/controller-1.jpg', 'Chi tiết tay cầm VERITY GEAR', 'VERITY GEAR controller detail')
ON CONFLICT DO NOTHING;
