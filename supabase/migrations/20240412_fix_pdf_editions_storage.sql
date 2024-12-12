-- Update storage bucket configuration for larger files
DO $$
BEGIN
  -- First, update the existing bucket if it exists
  UPDATE storage.buckets 
  SET 
    file_size_limit = 26214400,  -- 25MB in bytes
    allowed_mime_types = ARRAY['application/pdf']::text[],
    public = true
  WHERE name = 'pdf-editions';
  
  -- If bucket doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO storage.buckets 
      (id, name, file_size_limit, allowed_mime_types, public)
    VALUES 
      (
        'pdf-editions',
        'pdf-editions',
        26214400,  -- 25MB in bytes
        ARRAY['application/pdf']::text[],
        true
      );
  END IF;

  -- Ensure proper permissions are set
  GRANT ALL ON storage.buckets TO authenticated;
  GRANT ALL ON storage.objects TO authenticated;
  
  -- Update bucket policy to allow public access
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES
    (
      'Public Read Access',
      'pdf-editions',
      'read',
      '(bucket_id = ''pdf-editions''::text)'::text
    )
  ON CONFLICT (name, bucket_id, operation) DO NOTHING;
END $$;