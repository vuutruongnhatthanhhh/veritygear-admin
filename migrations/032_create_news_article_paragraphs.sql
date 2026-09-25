-- Body paragraphs for each news article's detail page, one row per
-- paragraph (same list-table pattern as product_specs / about_story_blocks)
-- so the admin can add/remove/reorder freely.
CREATE TABLE IF NOT EXISTS news_article_paragraphs (
  id          BIGSERIAL PRIMARY KEY,
  article_id  BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  sort_order  INT NOT NULL DEFAULT 0,
  content_vi  TEXT NOT NULL DEFAULT '',
  content_en  TEXT NOT NULL DEFAULT ''
);

ALTER TABLE news_article_paragraphs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_article_paragraphs_public_read" ON news_article_paragraphs;
CREATE POLICY "news_article_paragraphs_public_read"
  ON news_article_paragraphs FOR SELECT USING (true);

DROP POLICY IF EXISTS "news_article_paragraphs_staff_write" ON news_article_paragraphs;
CREATE POLICY "news_article_paragraphs_staff_write"
  ON news_article_paragraphs FOR ALL USING (
    auth.role() = 'service_role' OR public.current_user_role() IN ('admin', 'mod')
  );

CREATE INDEX IF NOT EXISTS news_article_paragraphs_article_idx ON news_article_paragraphs(article_id);

-- Seed with the body paragraphs already hardcoded in src/data/news.ts.
INSERT INTO news_article_paragraphs (article_id, sort_order, content_vi) VALUES
  ((SELECT id FROM news_articles WHERE slug = 'ra-mat-precision-series-2026'), 0,
   'Sau hơn một năm nghiên cứu và thử nghiệm cùng đội ngũ tuyển thủ chuyên nghiệp, VERITY GEAR chính thức giới thiệu PRECISION SERIES 2026 — bộ sưu tập phụ kiện gaming toàn diện nhất từ trước đến nay của thương hiệu.'),
  ((SELECT id FROM news_articles WHERE slug = 'ra-mat-precision-series-2026'), 1,
   'Bộ sưu tập bao gồm bàn phím cơ VERTEX X1 với khung nhôm CNC nguyên khối, chuột PHANTOM PRO cảm biến 32.000 DPI, và tai nghe AERO ONE tái tạo âm trường vòm ảo 7.1. Mỗi sản phẩm đều trải qua ít nhất 72 giờ kiểm thử liên tục dưới điều kiện thi đấu thực tế trước khi xuất xưởng.'),
  ((SELECT id FROM news_articles WHERE slug = 'ra-mat-precision-series-2026'), 2,
   '"Chúng tôi không muốn ra mắt thêm một sản phẩm — chúng tôi muốn định nghĩa lại tiêu chuẩn chính xác cho ngành phụ kiện gaming", đại diện VERITY GEAR chia sẻ. PRECISION SERIES 2026 hiện đã có mặt tại toàn bộ hệ thống đại lý chính hãng trên 12 quốc gia.'),

  ((SELECT id FROM news_articles WHERE slug = 'ben-trong-xuong-che-tac'), 0,
   'Ẩn mình trong một xưởng sản xuất quy mô vừa, đội ngũ kỹ thuật của VERITY GEAR làm việc theo quy trình khắt khe: mỗi bảng mạch được kiểm tra bằng máy trước khi lắp ráp thủ công, từng switch được bôi trơn riêng lẻ, và mỗi sản phẩm hoàn thiện phải vượt qua bài kiểm thử 72 giờ liên tục.'),
  ((SELECT id FROM news_articles WHERE slug = 'ben-trong-xuong-che-tac'), 1,
   '"Chúng tôi chọn sản xuất theo lô nhỏ thay vì chạy theo số lượng", một kỹ thuật viên chia sẻ. "Điều đó có nghĩa là chúng tôi có thể truy xuất nguồn gốc chính xác của từng sản phẩm, và kiểm soát chất lượng ở mức cao nhất có thể".'),
  ((SELECT id FROM news_articles WHERE slug = 'ben-trong-xuong-che-tac'), 2,
   'Triết lý sản xuất này chính là nền tảng giúp VERITY GEAR duy trì tỷ lệ lỗi cực thấp trong suốt hành trình phát triển, đồng thời xây dựng niềm tin vững chắc từ cộng đồng hơn 50.000 game thủ trên toàn cầu.'),

  ((SELECT id FROM news_articles WHERE slug = 'chon-ban-phim-co-phu-hop'), 0,
   'Không phải bàn phím cơ nào cũng phù hợp với mọi thể loại game. Với các tựa game bắn súng tốc độ cao, switch tuyến tính (linear) thường được ưu tiên nhờ hành trình phím mượt, không có điểm khựng, giúp phản xạ nhanh hơn trong các pha combat.'),
  ((SELECT id FROM news_articles WHERE slug = 'chon-ban-phim-co-phu-hop'), 1,
   'Về layout, bàn phím full-size phù hợp với người dùng cần đầy đủ phím số, trong khi layout 75% hoặc TKL giúp tiết kiệm không gian bàn và đưa chuột lại gần hơn — một lợi thế nhỏ nhưng có thể tạo khác biệt trong thi đấu.'),
  ((SELECT id FROM news_articles WHERE slug = 'chon-ban-phim-co-phu-hop'), 2,
   'Cuối cùng, đừng bỏ qua yếu tố hotswap: khả năng thay switch không cần hàn giúp bạn dễ dàng tùy chỉnh cảm giác gõ theo thời gian mà không cần mua bàn phím mới.'),

  ((SELECT id FROM news_articles WHERE slug = 'dong-hanh-cung-giai-dau-mua-xuan'), 0,
   'Giải đấu Esports mùa Xuân 2026 quy tụ hơn 32 đội tuyển hàng đầu khu vực, với toàn bộ trạm thi đấu được trang bị bàn phím VERTEX X1, chuột PHANTOM PRO và tai nghe AERO ONE từ VERITY GEAR.'),
  ((SELECT id FROM news_articles WHERE slug = 'dong-hanh-cung-giai-dau-mua-xuan'), 1,
   'Đây là lần hợp tác quy mô lớn nhất của thương hiệu với một giải đấu esports, đánh dấu bước tiến quan trọng trong chiến lược đồng hành cùng cộng đồng thi đấu chuyên nghiệp.'),
  ((SELECT id FROM news_articles WHERE slug = 'dong-hanh-cung-giai-dau-mua-xuan'), 2,
   '"Được các tuyển thủ hàng đầu tin dùng ngay trên sân khấu lớn là minh chứng rõ ràng nhất cho chất lượng sản phẩm của chúng tôi", đại diện VERITY GEAR cho biết sau ngày thi đấu đầu tiên.'),

  ((SELECT id FROM news_articles WHERE slug = 'so-sanh-switch-tuyen-tinh-clicky'), 0,
   'Switch tuyến tính (linear) có hành trình phím mượt mà từ đầu đến cuối, không phát ra tiếng click hay điểm khựng (tactile bump). Đây là lựa chọn phổ biến trong các tựa game FPS nhờ độ phản hồi nhanh và nhất quán.'),
  ((SELECT id FROM news_articles WHERE slug = 'so-sanh-switch-tuyen-tinh-clicky'), 1,
   'Ngược lại, switch clicky mang lại phản hồi âm thanh và cảm giác rõ ràng ở điểm kích hoạt, giúp người dùng cảm nhận chính xác thời điểm phím được nhấn — phù hợp với người chơi ưu tiên cảm giác gõ hơn tốc độ thuần túy.'),
  ((SELECT id FROM news_articles WHERE slug = 'so-sanh-switch-tuyen-tinh-clicky'), 2,
   'Với dòng VERTEX, VERITY GEAR cung cấp cả hai tùy chọn switch để người dùng tự do lựa chọn theo phong cách chơi, đồng thời hỗ trợ hotswap để dễ dàng chuyển đổi mà không cần công cụ chuyên dụng.'),

  ((SELECT id FROM news_articles WHERE slug = 'cot-moc-50000-game-thu'), 0,
   'VERITY GEAR chính thức cán mốc 50.000 game thủ tin dùng trên toàn cầu, đánh dấu một chặng đường phát triển đầy ý nghĩa kể từ ngày thành lập năm 2020 với dòng sản phẩm đầu tiên: VERTEX Series bàn phím cơ.'),
  ((SELECT id FROM news_articles WHERE slug = 'cot-moc-50000-game-thu'), 1,
   'Từ một xưởng sản xuất nhỏ, thương hiệu đã mở rộng mạng lưới phân phối tới 12 quốc gia, duy trì mức đánh giá trung bình 4.9/5 từ hơn 3.200 khách hàng — một con số hiếm có trong ngành phụ kiện gaming.'),
  ((SELECT id FROM news_articles WHERE slug = 'cot-moc-50000-game-thu'), 2,
   '"Mỗi con số đều đại diện cho một game thủ đã đặt niềm tin vào chúng tôi", đội ngũ sáng lập chia sẻ. "Đây là động lực để VERITY GEAR tiếp tục theo đuổi triết lý chính xác tuyệt đối trong từng sản phẩm".');
