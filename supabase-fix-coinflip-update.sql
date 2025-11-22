-- ============================================
-- FIX: Allow updating coinflip results
-- ============================================
-- The UPDATE policy needs WITH CHECK clause to allow setting result and winner_id

-- Drop the old policy
DROP POLICY IF EXISTS "Users can update own coinflips" ON public.coinflips;

-- Create new policy with WITH CHECK
CREATE POLICY "Users can update own coinflips"
  ON public.coinflips
  FOR UPDATE
  USING (
    creator_id = auth.uid() 
    OR joiner_id = auth.uid()
  )
  WITH CHECK (
    creator_id = auth.uid() 
    OR joiner_id = auth.uid()
  );

-- ============================================
-- DONE! 🎉
-- ============================================
-- Run this in Supabase SQL Editor
-- Then try joining a coinflip again
-- The result and winner_id should now be saved correctly
