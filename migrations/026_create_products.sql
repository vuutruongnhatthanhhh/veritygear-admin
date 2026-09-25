-- Product catalog on veritygear client. `name` isn't translated (brand/model
-- names like "VERTEX X1" read the same in both locales). The four boolean
-- flags give the admin explicit control over where a product appears,
-- instead of the client guessing from array order or a hardcoded slug list:
--   is_active    — hidden from the shop/search entirely when false
--   is_featured  — shows in the homepage "Sản phẩm nổi bật" grid
--   is_spotlight — the single hero product on ProductSpotlight (homepage)
--   is_lineup    — shows in the "Lineup mới nhất" strip on /cot-moc
CREATE TABLE IF NOT EXISTS products (
  id                 BIGSERIAL PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL DEFAULT '',
  category_id        BIGINT REFERENCES product_categories(id) ON DELETE SET NULL,

  tagline_vi         TEXT NOT NULL DEFAULT '',
  tagline_en         TEXT NOT NULL DEFAULT '',
  description_vi     TEXT NOT NULL DEFAULT '',
  description_en     TEXT NOT NULL DEFAULT '',

  price              INT NOT NULL DEFAULT 0,
  compare_at_price   INT,

  image_url          TEXT,

  badge_vi           TEXT,
  badge_en           TEXT,

  is_active          BOOLEAN NOT NULL DEFAULT true,
  is_featured        BOOLEAN NOT NULL DEFAULT false,
  is_spotlight       BOOLEAN NOT NULL DEFAULT false,
  is_lineup          BOOLEAN NOT NULL DEFAULT false,

  sort_order         INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "products_staff_write" ON products;
CREATE POLICY "products_staff_write"
  ON products FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_sort_idx ON products(sort_order);

-- Storage bucket for admin-uploaded product/category images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "product_images_staff_write" ON storage.objects;
CREATE POLICY "product_images_staff_write"
  ON storage.objects FOR ALL USING (
    bucket_id = 'product-images'
    AND (auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod'))
  );

-- Seed with the products already hardcoded in src/data/products.ts.
INSERT INTO products (
  slug, name, category_id, tagline_vi, tagline_en, description_vi, description_en,
  price, compare_at_price, image_url, badge_vi, badge_en,
  is_active, is_featured, is_spotlight, is_lineup, sort_order
) VALUES
  ('vertex-x1', 'VERTEX X1', (SELECT id FROM product_categories WHERE slug = 'ban-phim'),
   'Full-size, hotswap, switch tuyến tính siêu mượt', 'Full-size, hotswap, ultra-smooth linear switches',
   'VERTEX X1 là bàn phím cơ full-size với khung nhôm CNC nguyên khối, hệ thống hotswap 5-pin và bộ switch tuyến tính được bôi trơn thủ công từ nhà máy. Được tinh chỉnh cùng các tuyển thủ chuyên nghiệp để đạt độ phản hồi tối ưu trong từng pha combat tốc độ cao.',
   'VERTEX X1 is a full-size mechanical keyboard with a solid CNC aluminum frame, 5-pin hotswap sockets, and factory hand-lubed linear switches. Tuned with professional players for optimal response in high-speed combat.',
   4290000, 4990000, '/images/products/keyboard-1.jpg', 'Bán chạy', 'Best seller',
   true, true, true, true, 1),
  ('vertex-mini', 'VERTEX MINI', (SELECT id FROM product_categories WHERE slug = 'ban-phim'),
   'Layout 75%, nhôm nguyên khối, RGB per-key', '75% layout, solid aluminum, per-key RGB',
   'VERTEX MINI thu gọn layout 75% nhưng không đánh đổi cảm giác gõ. Thân nhôm nguyên khối, gasket-mount giảm rung, phù hợp cho những ai cần không gian bàn tối giản mà vẫn muốn hiệu năng thi đấu đỉnh cao.',
   'VERTEX MINI shrinks to a 75% layout without compromising feel. Solid aluminum body, gasket-mount for reduced vibration — for anyone who wants a minimal desk footprint without sacrificing competitive performance.',
   3690000, NULL, '/images/products/keyboard-2.jpg', 'Mới', 'New',
   true, true, false, false, 2),
  ('phantom-pro', 'PHANTOM PRO', (SELECT id FROM product_categories WHERE slug = 'chuot'),
   'Cảm biến 32.000 DPI, không dây, 58g', '32,000 DPI sensor, wireless, 58g',
   'PHANTOM PRO sở hữu cảm biến quang học 32.000 DPI độ chính xác tuyệt đối, vỏ symmetrical siêu nhẹ chỉ 58g và kết nối không dây độ trễ dưới 1ms — được thiết kế cho những pha flick-shot đòi hỏi độ chuẩn xác cao nhất.',
   'PHANTOM PRO packs a 32,000 DPI optical sensor for absolute precision, an ultra-light 58g symmetrical shell, and sub-1ms wireless latency — built for flick-shots that demand the highest accuracy.',
   1890000, NULL, '/images/products/mouse-1.jpg', 'Bán chạy', 'Best seller',
   true, true, false, true, 3),
  ('phantom-air', 'PHANTOM AIR', (SELECT id FROM product_categories WHERE slug = 'chuot'),
   'Siêu nhẹ 42g, vỏ tổ ong, symmetrical', 'Ultra-light 42g, honeycomb shell, symmetrical',
   'PHANTOM AIR đẩy giới hạn trọng lượng xuống chỉ còn 42g nhờ vỏ tổ ong đục lỗ toàn thân, vẫn giữ độ cứng cáp và cảm giác bám tay symmetrical quen thuộc của dòng PHANTOM.',
   'PHANTOM AIR pushes the weight limit down to just 42g with a full honeycomb shell, while keeping the sturdy, familiar symmetrical grip of the PHANTOM line.',
   1490000, NULL, '/images/products/mouse-2.jpg', NULL, NULL,
   true, true, false, false, 4),
  ('aero-one', 'AERO ONE', (SELECT id FROM product_categories WHERE slug = 'tai-nghe'),
   'Driver 50mm, mic gắp, âm trường vòm ảo 7.1', '50mm driver, detachable mic, virtual 7.1 surround',
   'AERO ONE tái tạo âm trường vòm ảo 7.1 với driver 50mm neodymium, giúp định vị bước chân đối thủ chính xác đến từng góc độ. Đệm memory foam bọc vải thoáng khí cho phép đeo liên tục nhiều giờ không mỏi.',
   'AERO ONE recreates virtual 7.1 surround sound with a 50mm neodymium driver, pinpointing enemy footsteps with precision. Breathable memory foam cushions allow hours of comfortable wear.',
   2590000, 2990000, '/images/products/headset-1.jpg', 'Giảm giá', 'Sale',
   true, true, false, false, 5),
  ('aero-silent', 'AERO SILENT', (SELECT id FROM product_categories WHERE slug = 'tai-nghe'),
   'Closed-back, chống ồn chủ động, đệm memory foam', 'Closed-back, active noise cancelling, memory foam',
   'AERO SILENT trang bị công nghệ chống ồn chủ động (ANC), lý tưởng cho không gian thi đấu ồn ào hoặc phòng net. Thiết kế closed-back giữ âm bass sâu và cách âm tối đa với môi trường xung quanh.',
   'AERO SILENT features active noise cancelling (ANC), ideal for noisy tournament venues or gaming cafes. The closed-back design keeps bass deep and isolates ambient noise.',
   2190000, NULL, '/images/products/headset-2.jpg', NULL, NULL,
   true, true, false, false, 6),
  ('glide-xl', 'GLIDE XL', (SELECT id FROM product_categories WHERE slug = 'lot-chuot'),
   'Kích thước 900x400, bề mặt tốc độ, may viền khóa cạnh', '900x400 size, speed surface, stitched edges',
   'GLIDE XL phủ kín toàn bộ mặt bàn với kích thước 900x400mm, bề mặt dệt tốc độ cao giúp thao tác mượt mà, đế cao su chống trượt và đường may viền khóa cạnh chống sờn theo thời gian.',
   'GLIDE XL covers your entire desk at 900x400mm, with a high-speed woven surface for smooth tracking, a non-slip rubber base, and stitched edges that resist fraying over time.',
   590000, NULL, '/images/categories/mousepad.jpg', NULL, NULL,
   true, true, false, false, 7),
  ('pulse', 'PULSE', (SELECT id FROM product_categories WHERE slug = 'tay-cam'),
   'Không dây tần số thấp, hall-effect trigger', 'Low-latency wireless, hall-effect triggers',
   'PULSE trang bị cần analog và trigger cảm biến hall-effect chống trôi vĩnh viễn, kết nối không dây tần số thấp độ trễ tối thiểu, phù hợp cho cả chơi game trên PC lẫn console.',
   'PULSE features hall-effect analog sticks and triggers that never drift, with low-latency wireless connectivity — great for both PC and console gaming.',
   1990000, NULL, '/images/products/controller-1.jpg', 'Mới', 'New',
   true, true, false, true, 8)
ON CONFLICT (slug) DO NOTHING;
