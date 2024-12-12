-- Increase file size limit for pdf-editions bucket
DO $$
BEGIN
  -- Update the file size limit for the pdf-editions bucket
  UPDATE storage.buckets
  SET file_size_limit = 26214400  -- 25MB in bytes
  WHERE name = 'pdf-editions';
  
  -- If the bucket doesn't exist, create it with the new limit
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

-- Grant appropriate permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;