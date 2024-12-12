-- Update storage bucket configuration for larger files
DO $$
BEGIN
  -- First, update the existing bucket if it exists
  UPDATE storage.buckets 
  SET 
    file_size_limit = 26214400,  -- 25MB in bytes
    allowed_mime_types = ARRAY['application/pdf']::text[],
    public = true,
    avif_autodetection = false,
    owner = auth.uid()
  WHERE name = 'pdf-editions';
  
  -- If bucket doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO storage.buckets 
      (id, name, file_size_limit, allowed_mime_types, public, avif_autodetection, owner)
    VALUES 
      (
        'pdf-editions',
        'pdf-editions',
        26214400,  -- 25MB in bytes
        ARRAY['application/pdf']::text[],
        true,
        false,
        auth.uid()
      );
  END IF;

  -- Create RLS policies for the bucket
  DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
  
  CREATE POLICY "Give users access to own folder"
  ON storage.objects FOR ALL
  USING (bucket_id = 'pdf-editions' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'pdf-editions' AND auth.role() = 'authenticated');

  CREATE POLICY "Allow public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdf-editions');

  -- Grant necessary permissions
  GRANT ALL ON storage.buckets TO authenticated;
  GRANT ALL ON storage.objects TO authenticated;
  GRANT ALL ON storage.objects TO anon;
  GRANT ALL ON storage.buckets TO anon;
END $$;