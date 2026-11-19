-- Lets veritygear's checkout work without an account. Guest orders have
-- user_id = NULL and a random guest_token instead — the client caches
-- {order_code, guest_token} in localStorage and every guest read goes
-- through a server action that checks both match (no RLS SELECT policy ever
-- allows anonymous access, since order_code alone is guessable).
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_token UUID;
CREATE INDEX IF NOT EXISTS orders_guest_token_idx ON orders(guest_token) WHERE guest_token IS NOT NULL;

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT WITH CHECK (
    (auth.role() = 'authenticated' AND auth.uid() = user_id)
    OR (auth.role() = 'anon' AND user_id IS NULL)
  );

DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o WHERE o.id = order_items.order_id
      AND (
        (auth.role() = 'authenticated' AND o.user_id = auth.uid())
        OR (auth.role() = 'anon' AND o.user_id IS NULL)
      )
    )
  );
