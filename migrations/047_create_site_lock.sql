-- Site-wide maintenance lock for the veritygear client. When is_locked is
-- true, the client's middleware (src/proxy.ts) rewrites every visitor to
-- /coming-soon, except requests carrying bypass_code as a ?vg_key= query
-- param (or an already-granted vg_bypass cookie from a previous visit).
CREATE TABLE IF NOT EXISTS site_lock (
  id           SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_locked    BOOLEAN NOT NULL DEFAULT false,
  bypass_code  TEXT NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_lock ENABLE ROW LEVEL SECURITY;

-- Public read: the client's middleware queries this with the anon key on
-- every request (when not cached), so it must be publicly readable.
DROP POLICY IF EXISTS "site_lock_public_read" ON site_lock;
CREATE POLICY "site_lock_public_read"
  ON site_lock FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_lock_staff_write" ON site_lock;
CREATE POLICY "site_lock_staff_write"
  ON site_lock FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO site_lock (id, is_locked, bypass_code) VALUES (1, false, '')
ON CONFLICT (id) DO NOTHING;
