-- Email capture from veritygear client's homepage newsletter form
-- (src/components/Newsletter.tsx). Public/anon can INSERT their own email
-- (no auth required to subscribe) but cannot read the list back.
CREATE TABLE IF NOT EXISTS home_newsletter_subscribers (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_newsletter_subscribers_public_insert" ON home_newsletter_subscribers;
CREATE POLICY "home_newsletter_subscribers_public_insert"
  ON home_newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "home_newsletter_subscribers_staff_read" ON home_newsletter_subscribers;
CREATE POLICY "home_newsletter_subscribers_staff_read"
  ON home_newsletter_subscribers FOR SELECT USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

DROP POLICY IF EXISTS "home_newsletter_subscribers_service_write" ON home_newsletter_subscribers;
CREATE POLICY "home_newsletter_subscribers_service_write"
  ON home_newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');
