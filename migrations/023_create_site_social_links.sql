-- Site-wide social media links, shared by veritygear client's Footer,
-- "Liên hệ" page map card, and the mobile header sidebar (all render
-- src/components/SocialLinks.tsx with these URLs passed in as props).
-- Fixed set of 4 platforms as columns (not a list table) since the icons
-- themselves stay hardcoded per-platform in the client — there's nothing to
-- add/remove, only URLs to fill in and toggle on/off.
CREATE TABLE IF NOT EXISTS site_social_links (
  id                 SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  facebook_url       TEXT NOT NULL DEFAULT '',
  facebook_active    BOOLEAN NOT NULL DEFAULT true,

  instagram_url      TEXT NOT NULL DEFAULT '',
  instagram_active   BOOLEAN NOT NULL DEFAULT true,

  tiktok_url         TEXT NOT NULL DEFAULT '',
  tiktok_active      BOOLEAN NOT NULL DEFAULT true,

  youtube_url        TEXT NOT NULL DEFAULT '',
  youtube_active     BOOLEAN NOT NULL DEFAULT true,

  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_social_links_public_read" ON site_social_links;
CREATE POLICY "site_social_links_public_read"
  ON site_social_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_social_links_staff_write" ON site_social_links;
CREATE POLICY "site_social_links_staff_write"
  ON site_social_links FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO site_social_links (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
