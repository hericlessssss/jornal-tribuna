-- Drop existing table if it exists
DROP TABLE IF EXISTS public.pdf_editions;

-- Create simplified pdf_editions table
CREATE TABLE public.pdf_editions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  is_external BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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

-- Create index
CREATE INDEX pdf_editions_created_at_idx ON public.pdf_editions(created_at DESC);

-- Grant permissions
GRANT ALL ON public.pdf_editions TO authenticated;
GRANT ALL ON public.pdf_editions TO service_role;