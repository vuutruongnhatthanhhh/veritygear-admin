-- Business registration info shown as its own footer column on veritygear's
-- client (src/components/Footer.tsx) — bilingual HTML (company name, address,
-- phone/email as clickable links, registration number, date, issuing
-- authority), same storage shape as custom_pages.content_*.
CREATE TABLE IF NOT EXISTS site_business_info (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  content_vi  TEXT NOT NULL DEFAULT '',
  content_en  TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_business_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_business_info_public_read" ON site_business_info;
CREATE POLICY "site_business_info_public_read"
  ON site_business_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_business_info_staff_write" ON site_business_info;
CREATE POLICY "site_business_info_staff_write"
  ON site_business_info FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

INSERT INTO site_business_info (id, content_vi, content_en) VALUES (
  1,
  '<p><strong>HỘ KINH DOANH VERITY GEAR</strong></p><p>Địa chỉ: Số 17, Hẻm 873, đường Phú Riềng Đỏ, khu phố Tân Bình 2, Phường Bình Phước, Thành phố Đồng Nai, Việt Nam.</p><p>Số điện thoại: <a href="tel:+84889560056">0889 560 056</a></p><p>Email: <a href="mailto:giahuy2006dx@gmail.com">giahuy2006dx@gmail.com</a></p><p>Mã số hộ kinh doanh: 070206003845</p><p>Ngày cấp: 19/10/2026</p><p>Nơi cấp: Phòng Kinh tế, Hạ tầng và Đô thị phường Bình Phước.</p>',
  '<p><strong>VERITY GEAR BUSINESS HOUSEHOLD</strong></p><p>Registered Address: No. 17, Alley 873, Phu Rieng Do Street, Tan Binh 2 Residential Quarter, Binh Phuoc Ward, Dong Nai City, Vietnam.</p><p>Telephone Number: <a href="tel:+84889560056">+84 889 560 056</a></p><p>Email Address: <a href="mailto:giahuy2006dx@gmail.com">giahuy2006dx@gmail.com</a></p><p>Business Registration Number: 070206003845</p><p>Date of Issuance: 19 October 2026</p><p>Issuing Authority: Economic, Infrastructure and Urban Development Division of Binh Phuoc Ward.</p>'
) ON CONFLICT (id) DO NOTHING;
