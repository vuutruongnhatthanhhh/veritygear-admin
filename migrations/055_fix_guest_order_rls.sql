-- 054's "auth.role() = 'anon'" check silently evaluates to NULL (not true)
-- on projects using the newer publishable-key format, where an anonymous
-- request has no JWT claims at all — auth.role() reads request.jwt.claims,
-- which is unset, so the comparison never matches and every guest insert
-- gets rejected by RLS. auth.uid() is more robust: it reliably returns NULL
-- for any request with no valid user session, regardless of key format.
DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o WHERE o.id = order_items.order_id
      AND (
        o.user_id = auth.uid()
        OR (auth.uid() IS NULL AND o.user_id IS NULL)
      )
    )
  );
