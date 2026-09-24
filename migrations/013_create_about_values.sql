-- Core-values tiles on the "Giới thiệu" page (src/components/about/ValuesGrid.tsx).
-- `icon_key` selects a hardcoded SVG icon component client-side (never raw
-- SVG markup from the DB) — keep this CHECK in sync with the icon map in
-- the client's ValuesGrid.tsx and the admin's value-form.tsx icon picker.
CREATE TABLE IF NOT EXISTS about_values (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  icon_key    TEXT NOT NULL DEFAULT 'precision'
              CHECK (icon_key IN ('precision', 'noCompromise', 'durability', 'community')),
  title_vi    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  desc_vi     TEXT NOT NULL DEFAULT '',
  desc_en     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_values_public_read" ON about_values;
CREATE POLICY "about_values_public_read"
  ON about_values FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_values_staff_write" ON about_values;
CREATE POLICY "about_values_staff_write"
  ON about_values FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS about_values_sort_idx ON about_values(sort_order);

-- Seed with the values already hardcoded in ValuesGrid.tsx.
INSERT INTO about_values (sort_order, icon_key, title_vi, title_en, desc_vi, desc_en) VALUES
  (1, 'precision', 'Chính xác tuyệt đối', 'Absolute precision',
     'Mỗi chi tiết được đo lường và kiểm định trước khi rời xưởng.',
     'Every detail is measured and inspected before it leaves the workshop.'),
  (2, 'noCompromise', 'Không khoan nhượng', 'No compromise',
     'Chúng tôi không phát hành sản phẩm chưa vượt qua thử nghiệm thực chiến.',
     'We never release a product that hasn''t passed real competitive testing.'),
  (3, 'durability', 'Bền vững lâu dài', 'Built to last',
     'Vật liệu cao cấp, thiết kế module dễ sửa chữa và nâng cấp.',
     'Premium materials, modular design that''s easy to repair and upgrade.'),
  (4, 'community', 'Cộng đồng trước tiên', 'Community first',
     'Sản phẩm được phát triển cùng phản hồi trực tiếp từ game thủ.',
     'Products developed with direct feedback from gamers.')
ON CONFLICT DO NOTHING;
