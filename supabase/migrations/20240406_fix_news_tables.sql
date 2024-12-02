-- Drop existing tables if they exist
DROP TABLE IF EXISTS news_images;
DROP TABLE IF EXISTS news;

-- Create news table
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  highlighted BOOLEAN DEFAULT false,
  homepage_highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON news
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON news TO authenticated;
GRANT ALL ON news TO service_role;