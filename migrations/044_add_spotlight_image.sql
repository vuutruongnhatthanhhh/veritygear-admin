-- Lets the admin pick the background image for the homepage product
-- spotlight section (src/components/ProductSpotlight.tsx), which used to be
-- a hardcoded file path unrelated to the spotlighted product's own image.
ALTER TABLE home_product_spotlight ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE home_product_spotlight SET image_url = '/images/about/setup-2.jpg' WHERE id = 1 AND image_url IS NULL;
