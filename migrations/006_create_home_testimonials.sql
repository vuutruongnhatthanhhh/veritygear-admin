-- Customer/gamer review cards on veritygear client's homepage
-- (src/components/Testimonials.tsx).
CREATE TABLE IF NOT EXISTS home_testimonials (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  quote_vi    TEXT NOT NULL DEFAULT '',
  quote_en    TEXT NOT NULL DEFAULT '',
  name        TEXT NOT NULL DEFAULT '',
  role_vi     TEXT NOT NULL DEFAULT '',
  role_en     TEXT NOT NULL DEFAULT '',
  rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE home_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_testimonials_public_read" ON home_testimonials;
CREATE POLICY "home_testimonials_public_read"
  ON home_testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "home_testimonials_staff_write" ON home_testimonials;
CREATE POLICY "home_testimonials_staff_write"
  ON home_testimonials FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS home_testimonials_sort_idx ON home_testimonials(sort_order);

-- Seed with the reviews already hardcoded in Testimonials.tsx.
INSERT INTO home_testimonials (sort_order, quote_vi, quote_en, name, role_vi, role_en, rating) VALUES
  (1,
   'Switch của VERTEX X1 mượt đến mức tôi giảm hẳn sai số click trong các pha combat tốc độ cao.',
   'The VERTEX X1 switches are so smooth my click errors dropped noticeably in high-speed combat.',
   'Minh Quân', 'Valorant Radiant', 'Valorant Radiant', 5),
  (2,
   'PHANTOM PRO nhẹ và bám tay hơn hẳn con chuột cũ. Cảm biến chuẩn từng pixel.',
   'The PHANTOM PRO is lighter and grips better than my old mouse. Pixel-accurate sensor.',
   'Thảo Vy', 'CS2 Semi-pro', 'CS2 semi-pro', 5),
  (3,
   'AERO ONE tái tạo bước chân đối thủ cực rõ. Đeo cả ngày không mỏi tai.',
   'The AERO ONE reproduces footsteps with amazing clarity. Comfortable all day.',
   'Đức Anh', 'Streamer, 120K followers', 'Streamer, 120K followers', 5)
ON CONFLICT DO NOTHING;
