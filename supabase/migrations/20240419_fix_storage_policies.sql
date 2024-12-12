-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;

-- Create or update news-images bucket
DO $$
BEGIN
  -- First, try to update existing bucket
  UPDATE storage.buckets 
  SET 
    public = true,
    file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif']::text[]
  WHERE id = 'news-images';
  
  -- If bucket doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO storage.buckets (
      id,
      name,
      public,
      file_size_limit,
      allowed_mime_types
    ) VALUES (
      'news-images',
      'news-images',
      true,
      10485760, -- 10MB
      ARRAY['image/png', 'image/jpeg', 'image/gif']::text[]
    );
  END IF;
END $$;

-- Create new storage policies
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'news-images' 
  AND (storage.foldername(name))[1] = 'news-images'
);

CREATE POLICY "Allow authenticated users to update their uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images')
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated users to delete their uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');

CREATE POLICY "Allow public read access to news images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT ON storage.buckets TO anon;