-- Product categories on veritygear client (src/components/CategoryGrid.tsx,
-- the /san-pham shop filter, Footer quick-links). `count` is intentionally
-- NOT stored here — it's computed on read by grouping active products, so
-- it can never drift out of sync with the actual catalog.
CREATE TABLE IF NOT EXISTS product_categories (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name_vi     TEXT NOT NULL DEFAULT '',
  name_en     TEXT NOT NULL DEFAULT '',
  image_url   TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_categories_public_read" ON product_categories;
CREATE POLICY "product_categories_public_read"
  ON product_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "product_categories_staff_write" ON product_categories;
CREATE POLICY "product_categories_staff_write"
  ON product_categories FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS product_categories_sort_idx ON product_categories(sort_order);

-- Seed with the categories already hardcoded in src/data/products.ts.
INSERT INTO product_categories (slug, name_vi, name_en, image_url, sort_order) VALUES
  ('ban-phim', 'Bàn phím cơ', 'Mechanical keyboards', '/images/categories/keyboard.jpg', 1),
  ('chuot', 'Chuột gaming', 'Gaming mice', '/images/categories/mouse.jpg', 2),
  ('tai-nghe', 'Tai nghe', 'Headsets', '/images/categories/headset.jpg', 3),
  ('lot-chuot', 'Lót chuột', 'Mousepads', '/images/categories/mousepad.jpg', 4),
  ('tay-cam', 'Tay cầm', 'Controllers', '/images/categories/controller.jpg', 5)
ON CONFLICT (slug) DO NOTHING;
