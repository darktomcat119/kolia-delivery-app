-- Add optional gallery images (array of URLs) for restaurants.
-- Run this migration before seed.sql if the seed sets gallery_urls.
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.restaurants.gallery_urls IS 'Array of image URLs for restaurant gallery/sub images';
