-- ============================================
-- FIX: Allow reading prompts in coinflips
-- ============================================
-- This fixes the "creator prompt not found" error
-- Users need to be able to read prompts that are part of coinflips they're joining

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can read own prompts" ON public.prompts;

-- Create new policy that allows:
-- 1. Users to read their own prompts
-- 2. Users to read prompts that are part of coinflips they can see
CREATE POLICY "Users can read accessible prompts"
  ON public.prompts
  FOR SELECT
  USING (
    -- User owns the prompt
    auth.uid() = user_id
    OR
    -- Prompt is part of an open coinflip (anyone can see)
    id IN (
      SELECT creator_prompt_id FROM public.coinflips WHERE status = 'open'
    )
    OR
    -- Prompt is part of a coinflip the user is involved in
    id IN (
      SELECT creator_prompt_id FROM public.coinflips 
      WHERE creator_id = auth.uid() OR joiner_id = auth.uid()
    )
    OR
    id IN (
      SELECT joiner_prompt_id FROM public.coinflips 
      WHERE creator_id = auth.uid() OR joiner_id = auth.uid()
    )
  );

-- ============================================
-- DONE! 🎉
-- ============================================
-- Run this in Supabase SQL Editor
-- Then try joining a coinflip again
