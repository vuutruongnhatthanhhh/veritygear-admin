-- Terms & Conditions link shown at checkout (veritygear's /thanh-toan page
-- links out to this URL and requires the customer to accept it before
-- placing an order). Points at an existing page (e.g. one already created
-- via "Trang tùy chỉnh") rather than storing its own content — one link per
-- locale since the vi/en pages may live at different URLs.
CREATE TABLE IF NOT EXISTS order_terms_settings (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  url_vi      TEXT NOT NULL DEFAULT '',
  url_en      TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE order_terms_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_terms_settings_public_read" ON order_terms_settings;
CREATE POLICY "order_terms_settings_public_read"
  ON order_terms_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "order_terms_settings_staff_write" ON order_terms_settings;
CREATE POLICY "order_terms_settings_staff_write"
  ON order_terms_settings FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO order_terms_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
