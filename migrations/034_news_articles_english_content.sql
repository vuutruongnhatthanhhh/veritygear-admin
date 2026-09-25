-- Fill in the English title/excerpt/content that were left blank when the
-- articles were seeded in 031/033 (client was silently falling back to
-- Vietnamese on /en until an admin filled these in from the Bài viết tab).
UPDATE news_articles SET
  title_en = 'VERITY GEAR launches the PRECISION SERIES 2026 collection',
  excerpt_en = 'The 2026 flagship lineup brings together keyboards, mice, and headsets fine-tuned with professional players, built for absolute precision.',
  content_en =
    '<p>After more than a year of research and testing with a team of professional players, VERITY GEAR officially unveils PRECISION SERIES 2026 — the brand''s most comprehensive gaming gear collection to date.</p>' ||
    '<p>The collection includes the VERTEX X1 mechanical keyboard with a solid CNC aluminum frame, the PHANTOM PRO mouse with a 32,000 DPI sensor, and the AERO ONE headset recreating virtual 7.1 surround sound. Every product undergoes at least 72 hours of continuous testing under real competitive conditions before shipping.</p>' ||
    '<p>"We didn''t want to launch just another product — we wanted to redefine the precision standard for the gaming accessories industry," a VERITY GEAR representative shared. PRECISION SERIES 2026 is now available across the brand''s authorized dealer network in 12 countries.</p>'
WHERE slug = 'ra-mat-precision-series-2026';

UPDATE news_articles SET
  title_en = 'Inside the VERITY GEAR workshop',
  excerpt_en = 'Step inside where every VERITY GEAR mechanical keyboard is hand-assembled, with each component inspected before it reaches gamers'' hands.',
  content_en =
    '<p>Tucked inside a mid-sized production workshop, VERITY GEAR''s technical team follows a strict process: every circuit board is machine-tested before hand assembly, each switch is individually lubricated, and every finished product must pass a continuous 72-hour test.</p>' ||
    '<p>"We choose to manufacture in small batches instead of chasing volume," a technician shared. "That means we can trace the exact origin of every product and maintain the highest possible level of quality control."</p>' ||
    '<p>This manufacturing philosophy is the foundation that has helped VERITY GEAR maintain an extremely low defect rate throughout its growth, while building solid trust with a global community of over 50,000 gamers.</p>'
WHERE slug = 'ben-trong-xuong-che-tac';

UPDATE news_articles SET
  title_en = '5 tips for choosing the right mechanical keyboard for your playstyle',
  excerpt_en = 'Linear or clicky switches? Full-size or 75% layout? Here are the most important factors to weigh before you buy.',
  content_en =
    '<p>Not every mechanical keyboard suits every game genre. For fast-paced shooters, linear switches are usually preferred for their smooth keystroke with no tactile bump, enabling quicker reflexes in combat.</p>' ||
    '<p>As for layout, full-size keyboards suit users who need a full number pad, while 75% or TKL layouts save desk space and bring your mouse closer — a small edge that can make a difference in competition.</p>' ||
    '<p>Finally, don''t overlook hotswap capability: the ability to swap switches without soldering lets you easily fine-tune your typing feel over time without buying a new keyboard.</p>'
WHERE slug = 'chon-ban-phim-co-phu-hop';

UPDATE news_articles SET
  title_en = 'VERITY GEAR partners with the 2026 Spring Esports Tournament',
  excerpt_en = 'Every competition station at this year''s tournament is equipped with VERITY GEAR gear, marking the brand''s biggest esports partnership to date.',
  content_en =
    '<p>The 2026 Spring Esports Tournament brought together more than 32 top regional teams, with every competition station equipped with the VERTEX X1 keyboard, PHANTOM PRO mouse, and AERO ONE headset from VERITY GEAR.</p>' ||
    '<p>This is the brand''s largest-scale partnership with an esports tournament yet, marking a major step in its strategy of standing alongside the professional competitive community.</p>' ||
    '<p>"Being trusted by top players on such a big stage is the clearest proof of our product quality," a VERITY GEAR representative said after the first day of competition.</p>'
WHERE slug = 'dong-hanh-cung-giai-dau-mua-xuan';

UPDATE news_articles SET
  title_en = 'Linear vs. clicky switches: which is right for gamers?',
  excerpt_en = 'Each switch type delivers a completely different typing feel. Here''s a look at the pros and cons to help you pick the right switch for your needs.',
  content_en =
    '<p>Linear switches have a smooth keystroke from top to bottom, with no click sound or tactile bump. This makes them a popular choice for FPS titles thanks to their fast, consistent response.</p>' ||
    '<p>Clicky switches, on the other hand, provide audible and tactile feedback at the actuation point, letting users feel exactly when a key registers — ideal for players who value typing feel over pure speed.</p>' ||
    '<p>With the VERTEX line, VERITY GEAR offers both switch options so users can freely choose based on their playstyle, with hotswap support for easy switching without specialized tools.</p>'
WHERE slug = 'so-sanh-switch-tuyen-tinh-clicky';

UPDATE news_articles SET
  title_en = 'Milestone: 50,000 gamers trust VERITY GEAR',
  excerpt_en = 'From a small workshop in 2020, VERITY GEAR has reached 50,000 gamers trusting the brand across 12 countries — a journey worth celebrating.',
  content_en =
    '<p>VERITY GEAR has officially reached 50,000 gamers trusting the brand worldwide, marking a meaningful milestone since its founding in 2020 with its first product line: the VERTEX mechanical keyboard series.</p>' ||
    '<p>From a small production workshop, the brand has expanded its distribution network to 12 countries, maintaining an average rating of 4.9/5 from over 3,200 customers — a rare figure in the gaming accessories industry.</p>' ||
    '<p>"Every number represents a gamer who placed their trust in us," the founding team shared. "This is the drive behind VERITY GEAR''s continued pursuit of absolute precision in every product."</p>'
WHERE slug = 'cot-moc-50000-game-thu';
