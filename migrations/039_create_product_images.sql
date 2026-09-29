-- Extra gallery photos per product (src/components/product/ProductGallery.tsx
-- on the client). `products.image_url` stays the single cover image used on
-- cards/grids/cart; these are additional photos shown only on the product
-- detail page, appended after the cover image.
CREATE TABLE IF NOT EXISTS product_images (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order  INT NOT NULL DEFAULT 0,
  image_url   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_images_public_read" ON product_images;
CREATE POLICY "product_images_public_read"
  ON product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "product_images_staff_write" ON product_images;
CREATE POLICY "product_images_staff_write"
  ON product_images FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images(product_id);
