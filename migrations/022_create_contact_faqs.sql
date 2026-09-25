-- FAQ entries on the "Liên hệ" page (src/components/contact/ContactFaq.tsx).
CREATE TABLE IF NOT EXISTS contact_faqs (
  id            BIGSERIAL PRIMARY KEY,
  sort_order    INT NOT NULL DEFAULT 0,
  question_vi   TEXT NOT NULL DEFAULT '',
  question_en   TEXT NOT NULL DEFAULT '',
  answer_vi     TEXT NOT NULL DEFAULT '',
  answer_en     TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_faqs_public_read" ON contact_faqs;
CREATE POLICY "contact_faqs_public_read"
  ON contact_faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "contact_faqs_staff_write" ON contact_faqs;
CREATE POLICY "contact_faqs_staff_write"
  ON contact_faqs FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS contact_faqs_sort_idx ON contact_faqs(sort_order);

-- Seed with the FAQs already hardcoded in ContactFaq.tsx.
INSERT INTO contact_faqs (sort_order, question_vi, question_en, answer_vi, answer_en) VALUES
  (1, 'Thời gian giao hàng mất bao lâu?', 'How long does shipping take?',
     'Đơn hàng nội thành giao trong 1–2 ngày làm việc. Các tỉnh thành khác từ 2–5 ngày làm việc.',
     'Orders within the city arrive in 1–2 business days. Other provinces take 2–5 business days.'),
  (2, 'Tôi có thể đổi trả sản phẩm không?', 'Can I return or exchange a product?',
     'Có, chúng tôi hỗ trợ đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng, không cần lý do.',
     'Yes, we offer free returns/exchanges within 30 days of delivery, no reason needed.'),
  (3, 'Làm sao để theo dõi đơn hàng?', 'How do I track my order?',
     'Sau khi đơn hàng được xác nhận, bạn sẽ nhận mã vận đơn qua email để theo dõi trực tiếp.',
     'Once your order is confirmed, you''ll receive a tracking code by email.'),
  (4, 'VERITY GEAR có cửa hàng offline không?', 'Does VERITY GEAR have a physical store?',
     'Hiện tại chúng tôi có showroom tại TP. Hồ Chí Minh, xem vị trí chi tiết ở bản đồ phía trên.',
     'We currently have a showroom in Ho Chi Minh City — see the map above for the exact location.')
ON CONFLICT DO NOTHING;
