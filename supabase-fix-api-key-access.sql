-- ============================================
-- FIX: Allow reading API keys for coinflip opponents
-- ============================================
-- Users need to read opponent's API key when they lose a coinflip

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

-- Create new policy that allows:
-- 1. Users to read their own data
-- 2. Users to read API key of opponents in active/completed coinflips
CREATE POLICY "Users can read accessible user data"
  ON public.users
  FOR SELECT
  USING (
    -- User can read their own data
    auth.uid() = id
    OR
    -- User can read opponent's API key if they're in a coinflip together
    id IN (
      SELECT creator_id FROM public.coinflips 
      WHERE joiner_id = auth.uid() AND status IN ('active', 'completed')
    )
    OR
    id IN (
      SELECT joiner_id FROM public.coinflips 
      WHERE creator_id = auth.uid() AND status IN ('active', 'completed')
    )
  );

-- ============================================
-- DONE! 🎉
-- ============================================
-- Run this in Supabase SQL Editor
