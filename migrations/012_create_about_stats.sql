-- Stat tiles on the "Giới thiệu" page (src/components/about/StatsRow.tsx).
-- `value` isn't translated (numbers/symbols read the same in both locales).
CREATE TABLE IF NOT EXISTS about_stats (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  value       TEXT NOT NULL DEFAULT '',
  label_vi    TEXT NOT NULL DEFAULT '',
  label_en    TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_stats_public_read" ON about_stats;
CREATE POLICY "about_stats_public_read"
  ON about_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_stats_staff_write" ON about_stats;
CREATE POLICY "about_stats_staff_write"
  ON about_stats FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS about_stats_sort_idx ON about_stats(sort_order);

-- Seed with the stats already hardcoded in StatsRow.tsx.
INSERT INTO about_stats (sort_order, value, label_vi, label_en) VALUES
  (1, '2020', 'Năm thành lập', 'Year founded'),
  (2, '50K+', 'Game thủ tin dùng', 'Gamers trust us'),
  (3, '12', 'Quốc gia phân phối', 'Countries distributed'),
  (4, '4.9/5', 'Đánh giá trung bình', 'Average rating')
ON CONFLICT DO NOTHING;
