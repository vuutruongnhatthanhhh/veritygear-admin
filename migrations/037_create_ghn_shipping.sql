-- GHN (Giao Hàng Nhanh) integration: real shipping-fee quotes, shipping-order
-- creation, and status webhooks, replacing/augmenting the flat fee in
-- shipping_settings. Kept in its own table (not shipping_settings) because
-- it holds a secret API token — shipping_settings is public-read (needed by
-- the client's flat-fee fallback), this table is staff/service-role only.
CREATE TABLE IF NOT EXISTS ghn_settings (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled           BOOLEAN NOT NULL DEFAULT false,
  token             TEXT NOT NULL DEFAULT '',
  shop_id           TEXT NOT NULL DEFAULT '',
  -- GHN service_type_id: 2 = "Hàng nhẹ" (standard), the common default for
  -- small-parcel shops. Verify against the shop's actual GHN service
  -- registration before going live.
  service_type_id   INT NOT NULL DEFAULT 2,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ghn_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ghn_settings_staff_read" ON ghn_settings;
CREATE POLICY "ghn_settings_staff_read"
  ON ghn_settings FOR SELECT USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

DROP POLICY IF EXISTS "ghn_settings_staff_write" ON ghn_settings;
CREATE POLICY "ghn_settings_staff_write"
  ON ghn_settings FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO ghn_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- GHN fee/order-creation calls are billed by weight; each product needs one.
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_grams INT NOT NULL DEFAULT 500;

-- Structured destination address (GHN requires numeric district_id + a
-- ward_code, not free text) plus GHN order tracking fields. `address` and
-- `city` (existing columns) are kept as-is for display; city continues to
-- store the province name for backward compatibility with the current
-- order list/detail UI.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS to_province_id INT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS to_province_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS to_district_id INT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS to_district_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS to_ward_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS to_ward_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_provider TEXT NOT NULL DEFAULT 'manual' CHECK (shipping_provider IN ('manual', 'ghn'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghn_order_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghn_status TEXT;

CREATE INDEX IF NOT EXISTS orders_ghn_order_code_idx ON orders(ghn_order_code);
