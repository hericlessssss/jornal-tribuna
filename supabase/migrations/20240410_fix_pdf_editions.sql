-- Drop existing table if it exists
DROP TABLE IF EXISTS public.pdf_editions;

-- Create pdf_editions table with proper schema
CREATE TABLE public.pdf_editions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  cover_image_url TEXT,
  is_external BOOLEAN DEFAULT false,
  original_filename TEXT,
  file_size BIGINT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.pdf_editions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.pdf_editions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.pdf_editions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.pdf_editions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.pdf_editions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX pdf_editions_created_at_idx ON public.pdf_editions(created_at DESC);
CREATE INDEX pdf_editions_status_idx ON public.pdf_editions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pdf_editions_updated_at
    BEFORE UPDATE ON public.pdf_editions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.pdf_editions TO authenticated;
GRANT ALL ON public.pdf_editions TO service_role;

-- Update storage bucket configuration for larger files
DO $$
BEGIN
  UPDATE storage.buckets
  SET file_size_limit = 26214400  -- 25MB in bytes
  WHERE name = 'pdf-editions';
  
  IF NOT FOUND THEN
    INSERT INTO storage.buckets (id, name, file_size_limit, allowed_mime_types)
    VALUES (
      'pdf-editions',
      'pdf-editions',
      26214400,  -- 25MB in bytes
      ARRAY['application/pdf']::text[]
    );
  END IF;
END $$;