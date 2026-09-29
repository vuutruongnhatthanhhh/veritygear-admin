-- PayOS bank-transfer payments (veritygear checkout). `orders.id` doubles as
-- the numeric PayOS orderCode passed to their API, so no extra column is
-- needed to link the two — payment_status just tracks what PayOS confirmed.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'cancelled')),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
