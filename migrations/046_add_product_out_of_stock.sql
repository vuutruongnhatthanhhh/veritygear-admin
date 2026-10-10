-- Lets the admin mark a product out of stock without hiding it from the shop
-- entirely (unlike is_active). The client disables the add-to-cart button
-- and shows "Hết hàng" instead when this is true.
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN NOT NULL DEFAULT false;
