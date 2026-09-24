-- Scrolling marquee strip under the hero on veritygear client's homepage
-- (src/components/Marquee.tsx).
CREATE TABLE IF NOT EXISTS home_marquee_items (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  text_vi     TEXT NOT NULL DEFAULT '',
  text_en     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_marquee_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_marquee_items_public_read" ON home_marquee_items;
CREATE POLICY "home_marquee_items_public_read"
  ON home_marquee_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_marquee_items_staff_write" ON home_marquee_items;
CREATE POLICY "home_marquee_items_staff_write"
  ON home_marquee_items FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS home_marquee_items_sort_idx ON home_marquee_items(sort_order);

-- Seed with the items already hardcoded in Marquee.tsx.
INSERT INTO home_marquee_items (sort_order, text_vi, text_en) VALUES
  (1, 'Miễn phí vận chuyển toàn quốc', 'Free nationwide shipping'),
  (2, 'Bảo hành chính hãng 24 tháng', '24-month official warranty'),
  (3, 'Đổi trả trong 30 ngày', '30-day returns'),
  (4, 'Chế tác giới hạn số lượng', 'Limited-run craftsmanship'),
  (5, 'Hỗ trợ kỹ thuật 24/7', '24/7 technical support')
ON CONFLICT DO NOTHING;
