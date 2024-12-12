-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.news_images;
DROP TABLE IF EXISTS public.news;

-- Create news table with proper schema
CREATE TABLE public.news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  highlighted BOOLEAN DEFAULT false,
  homepage_highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create news_images table with proper foreign key
CREATE TABLE public.news_images (
  id SERIAL PRIMARY KEY,
  news_id INTEGER REFERENCES public.news(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(news_id, "order")
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_images ENABLE ROW LEVEL SECURITY;

-- Create policies for news table
CREATE POLICY "Enable read access for all users" ON public.news
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for news_images table
CREATE POLICY "Enable read access for all users" ON public.news_images
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.news_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.news_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.news_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX news_created_at_idx ON public.news(created_at DESC);
CREATE INDEX news_images_news_id_idx ON public.news_images(news_id);
CREATE INDEX news_images_order_idx ON public.news_images("order");

-- Grant permissions
GRANT ALL ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
GRANT ALL ON public.news_images TO authenticated;
GRANT ALL ON public.news_images TO service_role;

-- Create storage bucket for news images if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('news-images', 'news-images', true)
  ON CONFLICT (id) DO NOTHING;
  
  -- Set RLS policies for storage
  CREATE POLICY "Give users access to own folder"
  ON storage.objects FOR ALL
  USING (bucket_id = 'news-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

  CREATE POLICY "Allow public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');
END $$;