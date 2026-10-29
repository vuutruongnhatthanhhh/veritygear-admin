-- Splits the "Đội ngũ" grid (src/components/about/Team.tsx) into two groups
-- (Vietnam / Global) and lets each member's card link out to their social
-- profile.
ALTER TABLE about_team_members
  ADD COLUMN IF NOT EXISTS region TEXT NOT NULL DEFAULT 'vn' CHECK (region IN ('vn', 'global')),
  ADD COLUMN IF NOT EXISTS social_url TEXT NOT NULL DEFAULT '';
