/*
  # Create guestbook table

  1. New Tables
    - `guestbook`
      - `id` (uuid, primary key)
      - `name` (text) - visitor's name
      - `message` (text) - the guestbook message
      - `created_at` (timestamptz) - when the entry was created
  
  2. Security
    - Enable RLS on `guestbook` table
    - Add policy for anyone to read entries
    - Add policy for anyone to insert entries
*/

CREATE TABLE IF NOT EXISTS guestbook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook entries"
  ON guestbook
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can sign the guestbook"
  ON guestbook
  FOR INSERT
  WITH CHECK (true);
