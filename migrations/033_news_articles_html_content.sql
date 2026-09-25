-- Switch article body from a per-paragraph list table to a single rich-text
-- HTML column per locale, matching the TipTap editor pattern used in
-- pulsegear-club-demo / pulsegearclub-admin: content_vi/content_en TEXT
-- holds admin-authored HTML, rendered on the client via
-- dangerouslySetInnerHTML — no sanitization needed since only staff
-- (gated by RLS) can write it.
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS content_vi TEXT NOT NULL DEFAULT '';
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS content_en TEXT NOT NULL DEFAULT '';

-- Backfill from the paragraph rows seeded in 032, wrapping each in <p>.
UPDATE news_articles a
SET content_vi = sub.html
FROM (
  SELECT article_id, string_agg('<p>' || content_vi || '</p>', '') AS html
  FROM news_article_paragraphs
  GROUP BY article_id
) sub
WHERE a.id = sub.article_id;

DROP TABLE IF EXISTS news_article_paragraphs;
