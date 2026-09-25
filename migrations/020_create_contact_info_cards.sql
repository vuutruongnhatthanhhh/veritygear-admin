-- Info cards (address/phone/email/hours) on the "Liên hệ" page
-- (src/components/contact/ContactInfoCards.tsx). `icon_key` selects a
-- hardcoded SVG icon component client-side (never raw SVG markup from the
-- DB) — keep this CHECK in sync with the icon map in the client's
-- ContactInfoCards.tsx and the admin's contact-card-form.tsx icon picker.
CREATE TABLE IF NOT EXISTS contact_info_cards (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  icon_key    TEXT NOT NULL DEFAULT 'location'
              CHECK (icon_key IN ('location', 'phone', 'email', 'hours')),
  label_vi    TEXT NOT NULL DEFAULT '',
  label_en    TEXT NOT NULL DEFAULT '',
  value_vi    TEXT NOT NULL DEFAULT '',
  value_en    TEXT NOT NULL DEFAULT '',
  href        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_info_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_info_cards_public_read" ON contact_info_cards;
CREATE POLICY "contact_info_cards_public_read"
  ON contact_info_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "contact_info_cards_staff_write" ON contact_info_cards;
CREATE POLICY "contact_info_cards_staff_write"
  ON contact_info_cards FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS contact_info_cards_sort_idx ON contact_info_cards(sort_order);

-- Seed with the cards already hardcoded in ContactInfoCards.tsx.
INSERT INTO contact_info_cards (sort_order, icon_key, label_vi, label_en, value_vi, value_en, href) VALUES
  (1, 'location', 'Địa chỉ', 'Address',
     '268 Điện Biên Phủ, Phường 7, Quận 3, TP. Hồ Chí Minh', '268 Dien Bien Phu, Ward 7, District 3, Ho Chi Minh City',
     NULL),
  (2, 'phone', 'Điện thoại', 'Phone',
     '(028) 7300 1234', '(028) 7300 1234',
     'tel:+842873001234'),
  (3, 'email', 'Email', 'Email',
     'hello@veritygear.vn', 'hello@veritygear.vn',
     'mailto:hello@veritygear.vn'),
  (4, 'hours', 'Giờ làm việc', 'Business hours',
     'Thứ 2 – Thứ 7: 9:00 – 18:00', 'Mon – Sat: 9:00 AM – 6:00 PM',
     NULL)
ON CONFLICT DO NOTHING;
