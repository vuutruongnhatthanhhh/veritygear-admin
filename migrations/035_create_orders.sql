-- Orders placed from veritygear's checkout page, managed from this admin's
-- new "Đơn hàng" section. Only COD is processed for now — the "transfer"
-- payment method already exists in the checkout UI but is disabled there
-- until bank-transfer handling is built, so `payment_method` only ever
-- receives 'cod' today even though the column allows both values.
CREATE TABLE IF NOT EXISTS orders (
  id              BIGSERIAL PRIMARY KEY,
  order_code      TEXT UNIQUE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  note            TEXT NOT NULL DEFAULT '',

  payment_method  TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'transfer')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipping', 'completed', 'cancelled')),

  subtotal        INT NOT NULL,
  shipping_fee    INT NOT NULL DEFAULT 0,
  total           INT NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order lines carry a product snapshot (name/image/price at order time),
-- same snapshot-not-reference design as CartProvider's cart lines — an
-- order must keep showing what the customer actually paid for even if the
-- product is later renamed, repriced, or deleted.
CREATE TABLE IF NOT EXISTS order_items (
  id             BIGSERIAL PRIMARY KEY,
  order_id       BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     BIGINT REFERENCES products(id) ON DELETE SET NULL,

  product_slug   TEXT NOT NULL,
  product_name   TEXT NOT NULL,
  product_image  TEXT,
  price          INT NOT NULL,
  qty            INT NOT NULL
);

-- Assigns a sequential, human-friendly order code (VG000001, VG000002, ...)
-- after the id is known — column defaults resolve before BEFORE INSERT
-- triggers run, so NEW.id is already populated here.
CREATE OR REPLACE FUNCTION public.set_order_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.order_code := 'VG' || LPAD(NEW.id::text, 6, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_order_code ON orders;
CREATE TRIGGER trg_set_order_code
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_code();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_staff_select_all" ON orders;
CREATE POLICY "orders_staff_select_all"
  ON orders FOR SELECT USING (public.current_user_role() IN ('admin', 'mod'));

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only staff (via the admin's service-role client) update order status —
-- customers cannot edit an order after placing it.
DROP POLICY IF EXISTS "orders_service_role_all" ON orders;
CREATE POLICY "orders_service_role_all"
  ON orders FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "order_items_select_own" ON order_items;
CREATE POLICY "order_items_select_own"
  ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "order_items_staff_select_all" ON order_items;
CREATE POLICY "order_items_staff_select_all"
  ON order_items FOR SELECT USING (public.current_user_role() IN ('admin', 'mod'));

DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "order_items_service_role_all" ON order_items;
CREATE POLICY "order_items_service_role_all"
  ON order_items FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);
