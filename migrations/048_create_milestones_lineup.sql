-- Singleton section text for the "Lineup mới nhất" block on /cot-moc
-- (src/components/milestones/ProductLineup.tsx — eyebrow + heading above the
-- product grid). WHICH products show here is controlled per-product via
-- products.is_lineup (admin > Sản phẩm) — this table only holds the copy.
CREATE TABLE IF NOT EXISTS milestones_lineup (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow_vi  TEXT NOT NULL DEFAULT '',
  eyebrow_en  TEXT NOT NULL DEFAULT '',
  heading_vi  TEXT NOT NULL DEFAULT '',
  heading_en  TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE milestones_lineup ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "milestones_lineup_public_read" ON milestones_lineup;
CREATE POLICY "milestones_lineup_public_read"
  ON milestones_lineup FOR SELECT USING (true);

DROP POLICY IF EXISTS "milestones_lineup_staff_write" ON milestones_lineup;
CREATE POLICY "milestones_lineup_staff_write"
  ON milestones_lineup FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO milestones_lineup (id, eyebrow_vi, eyebrow_en, heading_vi, heading_en) VALUES (
  1,
  'Sản phẩm mới', 'New arrivals',
  'Lineup mới nhất của VERITY GEAR', 'The latest lineup from VERITY GEAR'
) ON CONFLICT (id) DO NOTHING;
