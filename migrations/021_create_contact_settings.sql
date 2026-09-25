-- Singleton settings row for the "Liên hệ" contact form
-- (src/components/contact/ContactForm.tsx, src/app/api/contact/route.ts).
-- `recipient_email` is where submitted contact-form messages get delivered.
-- Not publicly readable — only staff need to see/edit it; the client's
-- contact-form API route reads it with the service-role client.
CREATE TABLE IF NOT EXISTS contact_settings (
  id               SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  recipient_email  TEXT NOT NULL DEFAULT '',
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_settings_staff_read" ON contact_settings;
CREATE POLICY "contact_settings_staff_read"
  ON contact_settings FOR SELECT USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

DROP POLICY IF EXISTS "contact_settings_staff_write" ON contact_settings;
CREATE POLICY "contact_settings_staff_write"
  ON contact_settings FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO contact_settings (id, recipient_email) VALUES (1, 'hello@veritygear.vn')
ON CONFLICT (id) DO NOTHING;
