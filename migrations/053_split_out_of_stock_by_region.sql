-- Splits "out of stock" into separate Vietnam/Global flags — a product can
-- be sold out domestically while still available internationally (or vice
-- versa). The client reads whichever flag matches the viewer's locale
-- (vi -> is_out_of_stock_vn, en -> is_out_of_stock_global).
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_out_of_stock_vn BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_out_of_stock_global BOOLEAN NOT NULL DEFAULT false;

UPDATE products SET is_out_of_stock_vn = is_out_of_stock, is_out_of_stock_global = is_out_of_stock;

ALTER TABLE products DROP COLUMN IF EXISTS is_out_of_stock;
