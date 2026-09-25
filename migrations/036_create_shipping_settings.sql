-- Site-wide shipping fee config, used by veritygear's cart/checkout pages
-- and the placeOrder server action (which recomputes shipping_fee from this
-- table server-side rather than trusting anything submitted by the client).
CREATE TABLE IF NOT EXISTS shipping_settings (
  id                        SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  free_shipping_threshold   INT NOT NULL DEFAULT 1500000,
  shipping_fee              INT NOT NULL DEFAULT 35000,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shipping_settings_public_read" ON shipping_settings;
CREATE POLICY "shipping_settings_public_read"
  ON shipping_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "shipping_settings_staff_write" ON shipping_settings;
CREATE POLICY "shipping_settings_staff_write"
  ON shipping_settings FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO shipping_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
