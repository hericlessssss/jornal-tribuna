-- Drop existing news_images table if it exists
DROP TABLE IF EXISTS public.news_images;

-- Create news_images table with proper constraints
CREATE TABLE public.news_images (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  news_id uuid REFERENCES public.news(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(news_id, "order")
);

-- Enable RLS
ALTER TABLE public.news_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.news_images
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.news_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.news_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.news_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON public.news_images TO authenticated;
GRANT ALL ON public.news_images TO service_role;