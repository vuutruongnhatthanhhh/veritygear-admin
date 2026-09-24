-- Singleton content row for the newsletter section heading copy on
-- veritygear client's homepage (src/components/Newsletter.tsx). Actual
-- subscriber emails go in home_newsletter_subscribers (008), not here.
CREATE TABLE IF NOT EXISTS home_newsletter (
  id           SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi   TEXT NOT NULL DEFAULT '',
  eyebrow_en   TEXT NOT NULL DEFAULT '',

  heading_vi   TEXT NOT NULL DEFAULT '',
  heading_en   TEXT NOT NULL DEFAULT '',

  body_vi      TEXT NOT NULL DEFAULT '',
  body_en      TEXT NOT NULL DEFAULT '',

  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_newsletter_public_read" ON home_newsletter;
CREATE POLICY "home_newsletter_public_read"
  ON home_newsletter FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_newsletter_staff_write" ON home_newsletter;
CREATE POLICY "home_newsletter_staff_write"
  ON home_newsletter FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in Newsletter.tsx.
INSERT INTO home_newsletter (id, eyebrow_vi, eyebrow_en, heading_vi, heading_en, body_vi, body_en) VALUES (
  1,
  'Vòng tròn nội bộ', 'Inner circle',
  'Nhận ưu đãi trước tiên', 'Be the first to know',
  'Đăng ký để nhận thông tin drop giới hạn, ưu đãi độc quyền và tin tức mới nhất từ VERITY GEAR.',
  'Sign up for limited drops, exclusive offers, and the latest news from VERITY GEAR.'
) ON CONFLICT (id) DO NOTHING;
