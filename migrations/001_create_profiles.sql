-- Central identity table for EVERY account in the shared Supabase project —
-- customers who sign up on the veritygear client site, and staff (mod/admin)
-- created from this admin panel. `role` is the single source of truth for
-- authorization; `auth.users.app_metadata.role` is kept as a fast-path mirror
-- (set by the app whenever this column changes) so proxy.ts can gate the
-- dashboard from the JWT alone, without a DB round-trip on every request.
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  address     TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'mod', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECURITY DEFINER so it bypasses RLS on its own lookup — letting policies
-- below reference a user's role without querying `profiles` directly from
-- within a `profiles` policy (which would recurse into itself).
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

-- Defense in depth: even if a bug ever let a non-service-role request reach
-- an UPDATE on profiles, this trigger stops a user from promoting themselves
-- by editing their own row directly. Role changes must go through the
-- service-role client in the employee-management server actions.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_self_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role <> OLD.role AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Không thể tự thay đổi vai trò tài khoản';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_self_update ON profiles;
CREATE TRIGGER trg_prevent_profile_role_self_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_self_update();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_staff_read_all" ON profiles;
CREATE POLICY "profiles_staff_read_all"
  ON profiles FOR SELECT USING (public.current_user_role() IN ('admin', 'mod'));

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_service_role_all" ON profiles;
CREATE POLICY "profiles_service_role_all"
  ON profiles FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
