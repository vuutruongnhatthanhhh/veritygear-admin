-- Footer tagline shown under the logo in veritygear client's Footer.tsx,
-- next to the social links. Singleton row, bilingual, same pattern as every
-- other site-wide text block (site_social_links, home_* sections).
CREATE TABLE IF NOT EXISTS site_footer (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  tagline_vi  TEXT NOT NULL DEFAULT '',
  tagline_en  TEXT NOT NULL DEFAULT '',

  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_footer ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_footer_public_read" ON site_footer;
CREATE POLICY "site_footer_public_read"
  ON site_footer FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_footer_staff_write" ON site_footer;
CREATE POLICY "site_footer_staff_write"
  ON site_footer FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO site_footer (id, tagline_vi, tagline_en) VALUES (
  1,
  'Phụ kiện gaming cao cấp — chế tác cho những game thủ không khoan nhượng. Chính xác. Bền bỉ. Đẳng cấp.',
  'Premium gaming gear — crafted for gamers who refuse to compromise. Precise. Durable. Elite.'
) ON CONFLICT (id) DO NOTHING;
