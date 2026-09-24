-- Singleton content row for the closing call-to-action on the "Giới thiệu"
-- page (src/components/about/AboutCta.tsx). Always exactly one row, id = 1.
CREATE TABLE IF NOT EXISTS about_cta (
  id             SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  heading_line1_vi TEXT NOT NULL DEFAULT '',
  heading_line2_vi TEXT NOT NULL DEFAULT '',
  heading_line1_en TEXT NOT NULL DEFAULT '',
  heading_line2_en TEXT NOT NULL DEFAULT '',

  body_vi        TEXT NOT NULL DEFAULT '',
  body_en        TEXT NOT NULL DEFAULT '',

  cta_label_vi   TEXT NOT NULL DEFAULT '',
  cta_label_en   TEXT NOT NULL DEFAULT '',
  cta_url        TEXT NOT NULL DEFAULT '/san-pham',

  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_cta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_cta_public_read" ON about_cta;
CREATE POLICY "about_cta_public_read"
  ON about_cta FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_cta_staff_write" ON about_cta;
CREATE POLICY "about_cta_staff_write"
  ON about_cta FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in AboutCta.tsx.
INSERT INTO about_cta (id, heading_line1_vi, heading_line2_vi, heading_line1_en, heading_line2_en, body_vi, body_en, cta_label_vi, cta_label_en, cta_url) VALUES (
  1,
  'Sẵn sàng nâng cấp', 'trải nghiệm của bạn?', 'Ready to upgrade', 'your experience?',
  'Khám phá toàn bộ bộ sưu tập VERITY GEAR — được chế tác cho những ai xem game là một môn nghệ thuật.',
  'Explore the full VERITY GEAR collection — crafted for those who see gaming as an art form.',
  'Khám phá bộ sưu tập', 'Explore the collection', '/san-pham'
) ON CONFLICT (id) DO NOTHING;
