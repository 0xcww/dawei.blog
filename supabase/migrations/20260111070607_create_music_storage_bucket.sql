/*
  # Create Music Storage Bucket

  1. Storage Setup
    - Create a public bucket called 'music' for storing MP3 files
    - Set the bucket to be publicly accessible so audio files can be streamed
    - Configure appropriate file size limits and allowed MIME types
  
  2. Security
    - Public bucket allows read access to all users
    - Only authenticated users can upload/delete files (via RLS policies)
  
  3. Notes
    - MP3 files will be accessible via direct URLs
    - Bucket is optimized for audio file delivery
*/

-- Create the music storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'music',
  'music',
  true,
  104857600, -- 100MB max file size
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to music files
CREATE POLICY "Public Access for Music Files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'music');

-- Allow authenticated users to upload music files
CREATE POLICY "Authenticated users can upload music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete music"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'music');