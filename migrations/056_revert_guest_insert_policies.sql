-- 054/055 opened an anon INSERT policy on orders/order_items for guest
-- checkout, but `.insert().select()` also requires RLS to permit reading
-- the row back (Postgres re-checks SELECT policies for the RETURNING step),
-- and there's intentionally no anon SELECT policy here (order_code is
-- guessable — an anon SELECT policy would let anyone enumerate every guest
-- order's PII via the public anon key). So guest inserts now go through the
-- app's service-role client instead (bypasses RLS entirely), and these two
-- policies are no longer needed for that — revert them to authenticated-only
-- (their original, pre-054 form) to avoid leaving an unused anon write
-- surface on the table.
DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
