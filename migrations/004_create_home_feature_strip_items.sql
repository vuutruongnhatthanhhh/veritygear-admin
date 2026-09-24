-- The 4-tile feature strip on veritygear client's homepage
-- (src/components/FeatureStrip.tsx). `icon_key` selects a hardcoded SVG icon
-- component client-side (never raw SVG markup from the DB, to avoid an
-- injection vector) — keep this CHECK in sync with the icon map in the
-- client's FeatureStrip.tsx and the admin's feature-form.tsx icon picker.
CREATE TABLE IF NOT EXISTS home_feature_strip_items (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  icon_key    TEXT NOT NULL DEFAULT 'precision'
              CHECK (icon_key IN ('precision', 'warranty', 'shipping', 'community')),
  title_vi    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  desc_vi     TEXT NOT NULL DEFAULT '',
  desc_en     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_feature_strip_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_feature_strip_items_public_read" ON home_feature_strip_items;
CREATE POLICY "home_feature_strip_items_public_read"
  ON home_feature_strip_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_feature_strip_items_staff_write" ON home_feature_strip_items;
CREATE POLICY "home_feature_strip_items_staff_write"
  ON home_feature_strip_items FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS home_feature_strip_items_sort_idx ON home_feature_strip_items(sort_order);

-- Seed with the items already hardcoded in FeatureStrip.tsx.
INSERT INTO home_feature_strip_items (sort_order, icon_key, title_vi, title_en, desc_vi, desc_en) VALUES
  (1, 'precision', 'Chế tác chính xác', 'Precision-engineered',
     'Dung sai gia công 0.02mm, kiểm định từng lô hàng.',
     '0.02mm manufacturing tolerance, every batch inspected.'),
  (2, 'warranty', 'Bảo hành 24 tháng', '24-month warranty',
     'Đổi mới miễn phí nếu lỗi kỹ thuật từ nhà sản xuất.',
     'Free replacement for manufacturing defects.'),
  (3, 'shipping', 'Giao hàng toàn quốc', 'Nationwide shipping',
     'Miễn phí vận chuyển cho đơn từ 1.500.000₫.',
     'Free shipping on orders over 1,500,000₫.'),
  (4, 'community', 'Cộng đồng game thủ', 'Gamer community',
     'Hơn 50.000 game thủ đang tin dùng VERITY GEAR.',
     'Trusted by over 50,000 gamers.')
ON CONFLICT DO NOTHING;
