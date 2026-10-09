-- Singleton content row for veritygear client's "Sản phẩm" (shop) page
-- banner (src/components/shop/ShopHero.tsx). Always exactly one row, id = 1.
-- Reuses the existing product-images storage bucket — no new bucket needed.
CREATE TABLE IF NOT EXISTS shop_hero (
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

ALTER TABLE shop_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_hero_public_read" ON shop_hero;
CREATE POLICY "shop_hero_public_read"
  ON shop_hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "shop_hero_staff_write" ON shop_hero;
CREATE POLICY "shop_hero_staff_write"
  ON shop_hero FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in ShopHero.tsx.
INSERT INTO shop_hero (id, eyebrow_vi, eyebrow_en, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, image_url) VALUES (
  1,
  'Cửa hàng', 'Shop',
  'Toàn bộ', 'bộ sưu tập', 'The entire', 'collection',
  '/images/products/keyboard-2.jpg'
) ON CONFLICT (id) DO NOTHING;
