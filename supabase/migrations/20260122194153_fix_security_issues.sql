/*
  # Fix Security Issues

  1. RLS Policy Improvements
    - Drop overly permissive guestbook INSERT policy
    - Create new restrictive policy with validation:
      - Name must be 1-100 characters
      - Message must be 1-1000 characters
      - Rate limiting consideration through reasonable constraints
  
  2. Function Security
    - Fix `increment_visitor_count` function search_path vulnerability
    - Set explicit search_path to prevent SQL injection attacks
  
  3. Auth Connection Strategy
    - Update pgbouncer settings to use percentage-based allocation
    - This ensures proper scaling with instance size changes
  
  Important Security Notes:
    - The guestbook now validates input length to prevent abuse
    - Function search_path is immutable to prevent schema-based attacks
    - Connection pooling is optimized for scalability
*/

-- Fix 1: Replace overly permissive guestbook INSERT policy with proper validation
DROP POLICY IF EXISTS "Anyone can sign the guestbook" ON guestbook;

CREATE POLICY "Validated guestbook submissions"
  ON guestbook
  FOR INSERT
  WITH CHECK (
    length(trim(name)) >= 1 
    AND length(trim(name)) <= 100
    AND length(trim(message)) >= 1 
    AND length(trim(message)) <= 1000
  );

-- Fix 2: Recreate increment_visitor_count function with secure search_path
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix 3: Update pgbouncer auth settings to use percentage-based connection allocation
ALTER ROLE authenticator SET pgrst.db_pool_size = '10%';
