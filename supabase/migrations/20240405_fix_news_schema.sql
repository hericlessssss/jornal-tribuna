-- First, backup existing data if needed
CREATE TABLE IF NOT EXISTS news_backup AS SELECT * FROM news;

-- Drop existing foreign key constraints
ALTER TABLE IF EXISTS news_images DROP CONSTRAINT IF EXISTS news_images_news_id_fkey;

-- Drop and recreate news table with UUID
DROP TABLE IF EXISTS news CASCADE;
CREATE TABLE news (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text NOT NULL,
  cover_image_url text NOT NULL,
  highlighted boolean DEFAULT false,
  homepage_highlight boolean DEFAULT false,
  author text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies for news table
CREATE POLICY "Enable read access for all users" ON news
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Recreate news_images table with proper UUID foreign key
DROP TABLE IF EXISTS news_images;
CREATE TABLE news_images (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  news_id uuid REFERENCES news(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(news_id, "order")
);

-- Enable RLS on news_images table
ALTER TABLE news_images ENABLE ROW LEVEL SECURITY;

-- Create policies for news_images table
CREATE POLICY "Enable read access for all users" ON news_images
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON news_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON news_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON news_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON news TO authenticated;
GRANT ALL ON news TO service_role;
GRANT ALL ON news_images TO authenticated;
GRANT ALL ON news_images TO service_role;

-- Create indexes for better performance
CREATE INDEX news_created_at_idx ON news(created_at DESC);
CREATE INDEX news_images_news_id_idx ON news_images(news_id);
CREATE INDEX news_images_order_idx ON news_images("order");