/*
  # Create saved_content table for storing user's generated content

  1. New Tables
    - `saved_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, short title for the content)
      - `generated_text` (text, the main generated text content)
      - `generated_images` (jsonb, array of image data)
      - `generated_mcqs` (jsonb, array of MCQ data)
      - `generated_social_media_post` (text, social media post content)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `saved_content` table
    - Add policy for users to read their own saved content
    - Add policy for users to insert their own saved content
*/

CREATE TABLE IF NOT EXISTS saved_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  generated_text text NOT NULL DEFAULT '',
  generated_images jsonb DEFAULT '[]'::jsonb,
  generated_mcqs jsonb DEFAULT '[]'::jsonb,
  generated_social_media_post text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved content"
  ON saved_content
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved content"
  ON saved_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS saved_content_user_id_created_at_idx 
  ON saved_content(user_id, created_at DESC);