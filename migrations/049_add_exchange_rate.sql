-- Exchange rate used to show USD-equivalent prices on veritygear's English
-- locale. PayOS only settles in VND and GHN fees are VND, so orders.subtotal/
-- shipping_fee/total stay VND — this is a display-only conversion layer.
CREATE TABLE IF NOT EXISTS exchange_rate_settings (
  id               SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  usd_to_vnd_rate  NUMERIC NOT NULL DEFAULT 25000,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE exchange_rate_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exchange_rate_settings_public_read" ON exchange_rate_settings;
CREATE POLICY "exchange_rate_settings_public_read"
  ON exchange_rate_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "exchange_rate_settings_staff_write" ON exchange_rate_settings;
CREATE POLICY "exchange_rate_settings_staff_write"
  ON exchange_rate_settings FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO exchange_rate_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Records which currency the customer was viewing prices in at checkout
-- (en locale -> USD, vi -> VND) and the rate active at that moment, purely
-- for admin display — not the amount actually charged/settled.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'VND' CHECK (currency IN ('VND', 'USD')),
  ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC;
