-- Singleton content for the 3 trust badges on the product detail page
-- (src/app/[locale]/san-pham/[slug]/page.tsx — warranty/return/shipping).
-- These used to be hardcoded next-intl message strings; moved to the DB so
-- they're editable per-locale from the admin like every other section.
CREATE TABLE IF NOT EXISTS product_guarantees (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  warranty_label_vi TEXT NOT NULL DEFAULT '',
  warranty_label_en TEXT NOT NULL DEFAULT '',
  warranty_desc_vi  TEXT NOT NULL DEFAULT '',
  warranty_desc_en  TEXT NOT NULL DEFAULT '',
  return_label_vi   TEXT NOT NULL DEFAULT '',
  return_label_en   TEXT NOT NULL DEFAULT '',
  return_desc_vi    TEXT NOT NULL DEFAULT '',
  return_desc_en    TEXT NOT NULL DEFAULT '',
  shipping_label_vi TEXT NOT NULL DEFAULT '',
  shipping_label_en TEXT NOT NULL DEFAULT '',
  shipping_desc_vi  TEXT NOT NULL DEFAULT '',
  shipping_desc_en  TEXT NOT NULL DEFAULT '',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE product_guarantees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_guarantees_public_read" ON product_guarantees;
CREATE POLICY "product_guarantees_public_read"
  ON product_guarantees FOR SELECT USING (true);

DROP POLICY IF EXISTS "product_guarantees_staff_write" ON product_guarantees;
CREATE POLICY "product_guarantees_staff_write"
  ON product_guarantees FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO product_guarantees (
  id,
  warranty_label_vi, warranty_label_en, warranty_desc_vi, warranty_desc_en,
  return_label_vi, return_label_en, return_desc_vi, return_desc_en,
  shipping_label_vi, shipping_label_en, shipping_desc_vi, shipping_desc_en
) VALUES (
  1,
  'Bảo hành 24 tháng', '24-month warranty', 'Đổi mới nếu lỗi kỹ thuật', 'Free replacement for manufacturing defects',
  'Đổi trả 30 ngày', '30-day returns', 'Không cần lý do', 'No reason needed',
  'Giao hàng toàn quốc', 'Nationwide delivery', 'Miễn phí từ 1.500.000₫', 'Free from 1,500,000₫'
) ON CONFLICT (id) DO NOTHING;
