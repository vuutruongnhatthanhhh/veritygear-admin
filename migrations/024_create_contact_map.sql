-- Singleton content row for the map card on the "Liên hệ" page
-- (src/components/contact/ContactMap.tsx). Always exactly one row, id = 1.
-- `map_embed_url` is the Google Maps *embed* URL (Google Maps → Share →
-- Embed a map → copy the URL inside the iframe's src="..." attribute).
CREATE TABLE IF NOT EXISTS contact_map (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  heading_vi        TEXT NOT NULL DEFAULT '',
  heading_en        TEXT NOT NULL DEFAULT '',

  footer_label_vi   TEXT NOT NULL DEFAULT '',
  footer_label_en   TEXT NOT NULL DEFAULT '',

  map_embed_url     TEXT NOT NULL DEFAULT '',

  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_map_public_read" ON contact_map;
CREATE POLICY "contact_map_public_read"
  ON contact_map FOR SELECT USING (true);

DROP POLICY IF EXISTS "contact_map_staff_write" ON contact_map;
CREATE POLICY "contact_map_staff_write"
  ON contact_map FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the map already hardcoded in ContactMap.tsx.
INSERT INTO contact_map (id, heading_vi, heading_en, footer_label_vi, footer_label_en, map_embed_url) VALUES (
  1,
  'Vị trí cửa hàng', 'Store location',
  'Nhấn để mở chỉ đường', 'Tap to get directions',
  'https://www.google.com/maps?q=268+%C4%90i%E1%BB%87n+Bi%C3%AAn+Ph%E1%BB%A7,+Ph%C6%B0%E1%BB%9Dng+7,+Qu%E1%BA%ADn+3,+TP.+H%E1%BB%93+Ch%C3%AD+Minh&output=embed'
) ON CONFLICT (id) DO NOTHING;
