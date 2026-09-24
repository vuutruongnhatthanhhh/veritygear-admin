-- Team member cards on the "Giới thiệu" page (src/components/about/Team.tsx).
-- `name` isn't translated (personal names read the same in both locales).
CREATE TABLE IF NOT EXISTS about_team_members (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  name        TEXT NOT NULL DEFAULT '',
  role_vi     TEXT NOT NULL DEFAULT '',
  role_en     TEXT NOT NULL DEFAULT '',
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_team_members_public_read" ON about_team_members;
CREATE POLICY "about_team_members_public_read"
  ON about_team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_team_members_staff_write" ON about_team_members;
CREATE POLICY "about_team_members_staff_write"
  ON about_team_members FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS about_team_members_sort_idx ON about_team_members(sort_order);

-- Seed with the team already hardcoded in Team.tsx.
INSERT INTO about_team_members (sort_order, name, role_vi, role_en, image_url) VALUES
  (1, 'Đăng Khoa', 'Nhà sáng lập & CEO', 'Founder & CEO', '/images/about/team-1.jpg'),
  (2, 'Linh Chi', 'Trưởng phòng thiết kế', 'Head of Design', '/images/about/team-2.jpg'),
  (3, 'Quang Huy', 'Trưởng phòng sản phẩm', 'Head of Product', '/images/about/team-3.jpg'),
  (4, 'Bảo Trân', 'Quản lý cộng đồng', 'Community Manager', '/images/about/team-4.jpg')
ON CONFLICT DO NOTHING;
