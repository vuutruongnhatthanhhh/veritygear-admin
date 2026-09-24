-- Alternating image/text story sections on the "Giới thiệu" page
-- (src/components/about/StoryBlock.tsx, rendered as a list on the page).
CREATE TABLE IF NOT EXISTS about_story_blocks (
  id          BIGSERIAL PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  reverse     BOOLEAN NOT NULL DEFAULT false,
  eyebrow_vi  TEXT NOT NULL DEFAULT '',
  eyebrow_en  TEXT NOT NULL DEFAULT '',
  title_vi    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  desc_vi     TEXT NOT NULL DEFAULT '',
  desc_en     TEXT NOT NULL DEFAULT '',
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_story_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_story_blocks_public_read" ON about_story_blocks;
CREATE POLICY "about_story_blocks_public_read"
  ON about_story_blocks FOR SELECT USING (true);

DROP POLICY IF EXISTS "about_story_blocks_staff_write" ON about_story_blocks;
CREATE POLICY "about_story_blocks_staff_write"
  ON about_story_blocks FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS about_story_blocks_sort_idx ON about_story_blocks(sort_order);

-- Seed with the 3 story blocks already hardcoded in gioi-thieu/page.tsx.
INSERT INTO about_story_blocks (sort_order, reverse, eyebrow_vi, eyebrow_en, title_vi, title_en, desc_vi, desc_en, image_url) VALUES
  (1, false,
   '2020 — Khởi nguồn', '2020 — The beginning',
   'Bắt đầu từ một chiếc bàn phím không hoàn hảo', 'It started with an imperfect keyboard',
   'VERITY GEAR ra đời trong một căn phòng nhỏ, khi những người sáng lập — đều là game thủ thi đấu — nhận ra không một sản phẩm nào trên thị trường thỏa mãn cả hai tiêu chí: hiệu năng đỉnh cao và thiết kế tối giản. Chúng tôi quyết định tự chế tác.',
   'VERITY GEAR was born in a small room, when its founders — all competitive gamers — realized no product on the market satisfied both criteria: peak performance and minimalist design. So we decided to craft our own.',
   '/images/about/hands-typing.jpg'),
  (2, true,
   'Ám ảnh với chi tiết', 'Obsessed with detail',
   'Từng linh kiện đều trải qua kiểm định khắt khe', 'Every component goes through rigorous testing',
   'Đội ngũ kỹ thuật của chúng tôi kiểm tra từng bảng mạch, từng switch trước khi lắp ráp. Không có sản phẩm nào rời xưởng nếu chưa vượt qua 72 giờ kiểm thử liên tục dưới điều kiện thi đấu thực tế.',
   'Our engineering team inspects every board, every switch before assembly. No product leaves the workshop without passing 72 hours of continuous testing under real competitive conditions.',
   '/images/about/engineer-circuit.jpg'),
  (3, false,
   'Từ xưởng đến tay bạn', 'From workshop to you',
   'Sản xuất giới hạn, chất lượng không giới hạn', 'Limited production, unlimited quality',
   'Chúng tôi chọn sản xuất theo lô nhỏ để đảm bảo kiểm soát chất lượng tuyệt đối, thay vì chạy theo số lượng. Mỗi lô sản phẩm đều được đánh số và truy xuất nguồn gốc rõ ràng.',
   'We choose small-batch production to ensure absolute quality control, rather than chasing volume. Every batch is numbered and fully traceable.',
   '/images/about/production-line.jpg')
ON CONFLICT DO NOTHING;
