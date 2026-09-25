-- Spec rows for each product (src/components/product/SpecsCard.tsx).
CREATE TABLE IF NOT EXISTS product_specs (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order  INT NOT NULL DEFAULT 0,
  label_vi    TEXT NOT NULL DEFAULT '',
  label_en    TEXT NOT NULL DEFAULT '',
  value_vi    TEXT NOT NULL DEFAULT '',
  value_en    TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_specs_public_read" ON product_specs;
CREATE POLICY "product_specs_public_read"
  ON product_specs FOR SELECT USING (true);

DROP POLICY IF EXISTS "product_specs_staff_write" ON product_specs;
CREATE POLICY "product_specs_staff_write"
  ON product_specs FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS product_specs_product_idx ON product_specs(product_id);

-- Seed with the specs already hardcoded per-product in src/data/products.ts.
INSERT INTO product_specs (product_id, sort_order, label_vi, label_en, value_vi, value_en) VALUES
  ((SELECT id FROM products WHERE slug = 'vertex-x1'), 1, 'Layout', 'Layout', 'Full-size 104 phím', 'Full-size, 104 keys'),
  ((SELECT id FROM products WHERE slug = 'vertex-x1'), 2, 'Switch', 'Switches', 'Linear, hotswap 5-pin', 'Linear, 5-pin hotswap'),
  ((SELECT id FROM products WHERE slug = 'vertex-x1'), 3, 'Khung', 'Frame', 'Nhôm CNC nguyên khối', 'Solid CNC aluminum'),
  ((SELECT id FROM products WHERE slug = 'vertex-x1'), 4, 'Kết nối', 'Connectivity', 'USB-C có dây, polling 8000Hz', 'Wired USB-C, 8000Hz polling'),
  ((SELECT id FROM products WHERE slug = 'vertex-x1'), 5, 'Đèn nền', 'Lighting', 'RGB per-key, 16.8 triệu màu', 'Per-key RGB, 16.8M colors'),
  ((SELECT id FROM products WHERE slug = 'vertex-x1'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'vertex-mini'), 1, 'Layout', 'Layout', '75%, 82 phím', '75%, 82 keys'),
  ((SELECT id FROM products WHERE slug = 'vertex-mini'), 2, 'Switch', 'Switches', 'Linear, hotswap 5-pin', 'Linear, 5-pin hotswap'),
  ((SELECT id FROM products WHERE slug = 'vertex-mini'), 3, 'Khung', 'Frame', 'Gasket-mount, nhôm nguyên khối', 'Gasket-mount, solid aluminum'),
  ((SELECT id FROM products WHERE slug = 'vertex-mini'), 4, 'Kết nối', 'Connectivity', 'USB-C có dây, polling 8000Hz', 'Wired USB-C, 8000Hz polling'),
  ((SELECT id FROM products WHERE slug = 'vertex-mini'), 5, 'Đèn nền', 'Lighting', 'RGB per-key, 16.8 triệu màu', 'Per-key RGB, 16.8M colors'),
  ((SELECT id FROM products WHERE slug = 'vertex-mini'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'phantom-pro'), 1, 'Cảm biến', 'Sensor', 'Quang học 32.000 DPI', '32,000 DPI optical'),
  ((SELECT id FROM products WHERE slug = 'phantom-pro'), 2, 'Trọng lượng', 'Weight', '58g', '58g'),
  ((SELECT id FROM products WHERE slug = 'phantom-pro'), 3, 'Kết nối', 'Connectivity', 'Không dây 2.4GHz + Bluetooth', 'Wireless 2.4GHz + Bluetooth'),
  ((SELECT id FROM products WHERE slug = 'phantom-pro'), 4, 'Pin', 'Battery', 'Lên đến 70 giờ sử dụng', 'Up to 70 hours'),
  ((SELECT id FROM products WHERE slug = 'phantom-pro'), 5, 'Switch', 'Switches', 'Optical, 80 triệu lần nhấn', 'Optical, 80M clicks'),
  ((SELECT id FROM products WHERE slug = 'phantom-pro'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'phantom-air'), 1, 'Cảm biến', 'Sensor', 'Quang học 26.000 DPI', '26,000 DPI optical'),
  ((SELECT id FROM products WHERE slug = 'phantom-air'), 2, 'Trọng lượng', 'Weight', '42g', '42g'),
  ((SELECT id FROM products WHERE slug = 'phantom-air'), 3, 'Kết nối', 'Connectivity', 'Không dây 2.4GHz', 'Wireless 2.4GHz'),
  ((SELECT id FROM products WHERE slug = 'phantom-air'), 4, 'Pin', 'Battery', 'Lên đến 60 giờ sử dụng', 'Up to 60 hours'),
  ((SELECT id FROM products WHERE slug = 'phantom-air'), 5, 'Switch', 'Switches', 'Optical, 80 triệu lần nhấn', 'Optical, 80M clicks'),
  ((SELECT id FROM products WHERE slug = 'phantom-air'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'aero-one'), 1, 'Driver', 'Driver', '50mm Neodymium', '50mm neodymium'),
  ((SELECT id FROM products WHERE slug = 'aero-one'), 2, 'Âm thanh', 'Audio', 'Vòm ảo 7.1', 'Virtual 7.1 surround'),
  ((SELECT id FROM products WHERE slug = 'aero-one'), 3, 'Microphone', 'Microphone', 'Gắp, khử ồn ENC', 'Detachable, ENC noise cancelling'),
  ((SELECT id FROM products WHERE slug = 'aero-one'), 4, 'Kết nối', 'Connectivity', 'USB-C / 3.5mm', 'USB-C / 3.5mm'),
  ((SELECT id FROM products WHERE slug = 'aero-one'), 5, 'Đệm tai', 'Ear cushions', 'Memory foam, bọc vải thoáng khí', 'Memory foam, breathable fabric'),
  ((SELECT id FROM products WHERE slug = 'aero-one'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'aero-silent'), 1, 'Driver', 'Driver', '45mm Neodymium', '45mm neodymium'),
  ((SELECT id FROM products WHERE slug = 'aero-silent'), 2, 'Chống ồn', 'Noise cancelling', 'ANC chủ động', 'Active ANC'),
  ((SELECT id FROM products WHERE slug = 'aero-silent'), 3, 'Microphone', 'Microphone', 'Tích hợp, khử ồn ENC', 'Built-in, ENC noise cancelling'),
  ((SELECT id FROM products WHERE slug = 'aero-silent'), 4, 'Kết nối', 'Connectivity', 'USB-C / Bluetooth 5.3', 'USB-C / Bluetooth 5.3'),
  ((SELECT id FROM products WHERE slug = 'aero-silent'), 5, 'Pin', 'Battery', 'Lên đến 30 giờ (bật ANC)', 'Up to 30 hours (ANC on)'),
  ((SELECT id FROM products WHERE slug = 'aero-silent'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'glide-xl'), 1, 'Kích thước', 'Size', '900 x 400 x 4mm', '900 x 400 x 4mm'),
  ((SELECT id FROM products WHERE slug = 'glide-xl'), 2, 'Bề mặt', 'Surface', 'Vải dệt tốc độ cao', 'High-speed woven fabric'),
  ((SELECT id FROM products WHERE slug = 'glide-xl'), 3, 'Đế', 'Base', 'Cao su tự nhiên chống trượt', 'Non-slip natural rubber'),
  ((SELECT id FROM products WHERE slug = 'glide-xl'), 4, 'Viền', 'Edges', 'May khóa cạnh chống sờn', 'Stitched anti-fray edges'),
  ((SELECT id FROM products WHERE slug = 'glide-xl'), 5, 'Vệ sinh', 'Care', 'Giặt được, chống thấm nước', 'Washable, water-resistant'),
  ((SELECT id FROM products WHERE slug = 'glide-xl'), 6, 'Bảo hành', 'Warranty', '12 tháng chính hãng', '12-month official warranty'),

  ((SELECT id FROM products WHERE slug = 'pulse'), 1, 'Analog & Trigger', 'Analog & triggers', 'Cảm biến Hall-effect', 'Hall-effect sensors'),
  ((SELECT id FROM products WHERE slug = 'pulse'), 2, 'Kết nối', 'Connectivity', 'Không dây 2.4GHz tần số thấp', 'Low-latency 2.4GHz wireless'),
  ((SELECT id FROM products WHERE slug = 'pulse'), 3, 'Pin', 'Battery', 'Lên đến 25 giờ sử dụng', 'Up to 25 hours'),
  ((SELECT id FROM products WHERE slug = 'pulse'), 4, 'Tương thích', 'Compatibility', 'PC / Console', 'PC / Console'),
  ((SELECT id FROM products WHERE slug = 'pulse'), 5, 'Rung phản hồi', 'Haptics', 'Motor kép, tùy chỉnh cường độ', 'Dual motors, adjustable intensity'),
  ((SELECT id FROM products WHERE slug = 'pulse'), 6, 'Bảo hành', 'Warranty', '24 tháng chính hãng', '24-month official warranty')
ON CONFLICT DO NOTHING;
