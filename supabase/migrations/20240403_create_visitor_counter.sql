-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.visitor_counter;
DROP POLICY IF EXISTS "Enable increment for all users" ON public.visitor_counter;

-- Create visitor_counter table if not exists
CREATE TABLE IF NOT EXISTS public.visitor_counter (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  count bigint DEFAULT 0,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Insert initial counter if not exists
INSERT INTO public.visitor_counter (count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM public.visitor_counter);

-- Create or replace function to increment counter
CREATE OR REPLACE FUNCTION increment_visitor_counter()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count bigint;
  counter_id uuid;
BEGIN
  -- Get the ID of the first (and only) counter row
  SELECT id INTO counter_id FROM public.visitor_counter LIMIT 1;
  
  -- Update the counter with proper WHERE clause
  UPDATE public.visitor_counter
  SET count = count + 1,
      last_updated = timezone('utc'::text, now())
  WHERE id = counter_id
  RETURNING count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Enable RLS
ALTER TABLE public.visitor_counter ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON public.visitor_counter
  FOR SELECT USING (true);

CREATE POLICY "Enable increment for all users" ON public.visitor_counter
  FOR UPDATE USING (true);

-- Ensure we have exactly one counter row
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.visitor_counter) THEN
    INSERT INTO public.visitor_counter (count) VALUES (0);
  END IF;
END
$$;