-- Timeline entries on the "Cột mốc" page (src/components/milestones/Timeline.tsx).
-- `year` isn't translated (a year reads the same in both locales).
CREATE TABLE IF NOT EXISTS milestones_timeline (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  year        TEXT NOT NULL DEFAULT '',
  title_vi    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  desc_vi     TEXT NOT NULL DEFAULT '',
  desc_en     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE milestones_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "milestones_timeline_public_read" ON milestones_timeline;
CREATE POLICY "milestones_timeline_public_read"
  ON milestones_timeline FOR SELECT USING (true);

DROP POLICY IF EXISTS "milestones_timeline_staff_write" ON milestones_timeline;
CREATE POLICY "milestones_timeline_staff_write"
  ON milestones_timeline FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS milestones_timeline_sort_idx ON milestones_timeline(sort_order);

-- Seed with the milestones already hardcoded in Timeline.tsx.
INSERT INTO milestones_timeline (sort_order, year, title_vi, title_en, desc_vi, desc_en) VALUES
  (1, '2020', 'Khởi đầu tại Việt Nam', 'Founded in Vietnam',
     'VERITY GEAR ra đời trong một xưởng nhỏ với dòng sản phẩm đầu tiên: VERTEX Series bàn phím cơ.',
     'VERITY GEAR was born in a small workshop with its first product line: the VERTEX Series mechanical keyboards.'),
  (2, '2021', 'Ra mắt dòng PHANTOM', 'Launched the PHANTOM line',
     'Bộ đôi chuột gaming không dây đầu tiên — sản phẩm định hình tên tuổi thương hiệu.',
     'Our first pair of wireless gaming mice — the products that defined our brand.'),
  (3, '2022', 'Mở rộng khu vực Đông Nam Á', 'Expanded across Southeast Asia',
     'VERITY GEAR có mặt tại hơn 8 quốc gia, mở rộng mạng lưới đại lý và nhà phân phối chính hãng.',
     'VERITY GEAR reached over 8 countries, expanding our network of authorized dealers and distributors.'),
  (4, '2024', '50.000 game thủ tin dùng', '50,000 gamers trust us',
     'Cộng đồng VERITY GEAR cán mốc 50.000 game thủ trên toàn cầu, cùng dòng tai nghe AERO ra mắt.',
     'The VERITY GEAR community reached 50,000 gamers worldwide, alongside the launch of the AERO headset line.'),
  (5, '2026', '12 quốc gia và tiếp tục phát triển', '12 countries and still growing',
     'Hôm nay, VERITY GEAR hiện diện tại 12 quốc gia với đánh giá trung bình 4.9/5 từ hơn 3.200 khách hàng.',
     'Today, VERITY GEAR is present in 12 countries with an average rating of 4.9/5 from over 3,200 customers.')
ON CONFLICT DO NOTHING;
