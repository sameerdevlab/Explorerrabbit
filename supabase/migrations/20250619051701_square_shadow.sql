/*
  # Add delete policy for saved_content table

  1. Security
    - Add policy for users to delete their own saved content
*/

CREATE POLICY "Users can delete own saved content"
  ON saved_content
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);