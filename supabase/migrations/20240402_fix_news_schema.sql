-- Fix news table schema
ALTER TABLE IF EXISTS public.news
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Update existing rows to copy image_url to cover_image_url if needed
UPDATE public.news 
SET cover_image_url = image_url 
WHERE cover_image_url IS NULL AND image_url IS NOT NULL;

-- Add not null constraint after data migration
ALTER TABLE public.news
ALTER COLUMN cover_image_url SET NOT NULL;

-- Drop old column if it exists
ALTER TABLE public.news
DROP COLUMN IF EXISTS image_url;