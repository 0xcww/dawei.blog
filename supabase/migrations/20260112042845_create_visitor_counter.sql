/*
  # Create visitor counter functionality

  1. New Tables
    - `visitor_stats`
      - `id` (integer, primary key) - single row with id=1
      - `visit_count` (integer) - total number of visits
      - `updated_at` (timestamptz) - last update timestamp
  
  2. Functions
    - `increment_visitor_count()` - RPC function to atomically increment and return the count
  
  3. Security
    - Enable RLS on `visitor_stats` table
    - Add policy for anyone to read the count
    - Only the RPC function can update the count
  
  4. Initialization
    - Insert initial row with count = 0
*/

CREATE TABLE IF NOT EXISTS visitor_stats (
  id integer PRIMARY KEY DEFAULT 1,
  visit_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitor stats"
  ON visitor_stats
  FOR SELECT
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM visitor_stats WHERE id = 1) THEN
    INSERT INTO visitor_stats (id, visit_count) VALUES (1, 0);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE visitor_stats
  SET visit_count = visit_count + 1,
      updated_at = now()
  WHERE id = 1
  RETURNING visit_count INTO new_count;
  
  RETURN new_count;
END;
$$;
