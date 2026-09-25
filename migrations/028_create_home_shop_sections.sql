-- Lets the admin curate which categories appear in the homepage
-- CategoryGrid — separate from the full category list still used for
-- shop filtering (src/components/CategoryGrid.tsx only queries
-- `show_on_homepage = true`; the /san-pham filter bar shows every category
-- regardless of this flag).
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN NOT NULL DEFAULT true;

-- Singleton section text for the homepage category grid
-- (src/components/CategoryGrid.tsx). This used to be hardcoded next-intl
-- message strings; moved to the DB so it's editable per-locale from the
-- admin like every other homepage section.
CREATE TABLE IF NOT EXISTS home_category_grid (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow_vi        TEXT NOT NULL DEFAULT '',
  eyebrow_en        TEXT NOT NULL DEFAULT '',
  heading_line1_vi  TEXT NOT NULL DEFAULT '',
  heading_line2_vi  TEXT NOT NULL DEFAULT '',
  heading_line1_en  TEXT NOT NULL DEFAULT '',
  heading_line2_en  TEXT NOT NULL DEFAULT '',
  description_vi    TEXT NOT NULL DEFAULT '',
  description_en    TEXT NOT NULL DEFAULT '',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_category_grid ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_category_grid_public_read" ON home_category_grid;
CREATE POLICY "home_category_grid_public_read"
  ON home_category_grid FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_category_grid_staff_write" ON home_category_grid;
CREATE POLICY "home_category_grid_staff_write"
  ON home_category_grid FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO home_category_grid (id, eyebrow_vi, eyebrow_en, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, description_vi, description_en) VALUES (
  1,
  'Danh mục', 'Categories',
  'Chọn vũ khí', 'của bạn', 'Choose your', 'weapon',
  'Từ bàn phím cơ đến tai nghe âm trường vòm — mỗi sản phẩm đều được kiểm định qua hàng nghìn giờ thi đấu thực tế.',
  'From mechanical keyboards to surround-sound headsets — every product is tested through thousands of hours of real competitive play.'
) ON CONFLICT (id) DO NOTHING;

-- Singleton section text for the homepage featured-products grid
-- (src/components/FeaturedProducts.tsx). Which PRODUCTS show here is
-- controlled per-product via products.is_featured (admin > Sản phẩm) — this
-- table only holds the section's heading copy.
CREATE TABLE IF NOT EXISTS home_featured_products (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow_vi        TEXT NOT NULL DEFAULT '',
  eyebrow_en        TEXT NOT NULL DEFAULT '',
  heading_vi        TEXT NOT NULL DEFAULT '',
  heading_en        TEXT NOT NULL DEFAULT '',
  view_all_label_vi TEXT NOT NULL DEFAULT '',
  view_all_label_en TEXT NOT NULL DEFAULT '',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_featured_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_featured_products_public_read" ON home_featured_products;
CREATE POLICY "home_featured_products_public_read"
  ON home_featured_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_featured_products_staff_write" ON home_featured_products;
CREATE POLICY "home_featured_products_staff_write"
  ON home_featured_products FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO home_featured_products (id, eyebrow_vi, eyebrow_en, heading_vi, heading_en, view_all_label_vi, view_all_label_en) VALUES (
  1,
  'Best sellers', 'Best sellers',
  'Sản phẩm nổi bật', 'Featured products',
  'Xem toàn bộ cửa hàng', 'View the full shop'
) ON CONFLICT (id) DO NOTHING;

-- Singleton section text for the homepage hero product showcase
-- (src/components/ProductSpotlight.tsx). WHICH product shows here is
-- controlled per-product via products.is_spotlight (admin > Sản phẩm) — this
-- table only holds the section's eyebrow/CTA label copy.
CREATE TABLE IF NOT EXISTS home_product_spotlight (
  id             SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow_vi     TEXT NOT NULL DEFAULT '',
  eyebrow_en     TEXT NOT NULL DEFAULT '',
  cta_label_vi   TEXT NOT NULL DEFAULT '',
  cta_label_en   TEXT NOT NULL DEFAULT '',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_product_spotlight ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_product_spotlight_public_read" ON home_product_spotlight;
CREATE POLICY "home_product_spotlight_public_read"
  ON home_product_spotlight FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_product_spotlight_staff_write" ON home_product_spotlight;
CREATE POLICY "home_product_spotlight_staff_write"
  ON home_product_spotlight FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO home_product_spotlight (id, eyebrow_vi, eyebrow_en, cta_label_vi, cta_label_en) VALUES (
  1,
  'Sản phẩm chủ lực', 'Flagship product',
  'Mua ngay', 'Shop now'
) ON CONFLICT (id) DO NOTHING;
