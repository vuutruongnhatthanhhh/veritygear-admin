-- Singleton content row for the mission statement on the "Giới thiệu" page
-- (src/components/about/MissionStatement.tsx). Always exactly one row, id = 1.
-- Stored as plain text — the inline bold emphasis on a few words in the
-- original hardcoded copy is dropped for simplicity; admins edit one
-- paragraph per locale.
CREATE TABLE IF NOT EXISTS about_mission (
  id           SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  eyebrow_vi   TEXT NOT NULL DEFAULT '',
  eyebrow_en   TEXT NOT NULL DEFAULT '',

  body_vi      TEXT NOT NULL DEFAULT '',
  body_en      TEXT NOT NULL DEFAULT '',

  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_mission ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_mission_public_read" ON about_mission;
CREATE POLICY "about_mission_public_read"
  ON about_mission FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_mission_staff_write" ON about_mission;
CREATE POLICY "about_mission_staff_write"
  ON about_mission FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

-- Seed with the copy already hardcoded in MissionStatement.tsx (bold spans flattened).
INSERT INTO about_mission (id, eyebrow_vi, eyebrow_en, body_vi, body_en) VALUES (
  1,
  'Sứ mệnh', 'Mission',
  'Chúng tôi tin rằng mỗi mili-giây đều quan trọng. VERITY GEAR sinh ra để loại bỏ mọi rào cản giữa phản xạ của game thủ và kết quả trên màn hình — không thỏa hiệp, không dư thừa, chỉ có sự chính xác thuần khiết.',
  'We believe every millisecond matters. VERITY GEAR exists to remove every barrier between a gamer''s reflex and the result on screen — no compromise, no excess, just pure precision.'
) ON CONFLICT (id) DO NOTHING;
