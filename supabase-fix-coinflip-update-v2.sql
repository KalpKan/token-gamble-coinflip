-- ============================================
-- FIX V2: Use database function to bypass RLS
-- ============================================
-- Create a function that runs with elevated privileges to update coinflip results

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_coinflip_result(UUID, TEXT, UUID);

-- Create function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION update_coinflip_result(
  p_coinflip_id UUID,
  p_result TEXT,
  p_winner_id UUID
)
RETURNS TABLE (
  id UUID,
  result TEXT,
  winner_id UUID,
  status TEXT,
  completed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the coinflip
  UPDATE coinflips
  SET 
    result = p_result,
    winner_id = p_winner_id,
    status = 'completed',
    completed_at = NOW()
  WHERE coinflips.id = p_coinflip_id;
  
  -- Return the updated row
  RETURN QUERY
  SELECT 
    coinflips.id,
    coinflips.result,
    coinflips.winner_id,
    coinflips.status,
    coinflips.completed_at
  FROM coinflips
  WHERE coinflips.id = p_coinflip_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_coinflip_result(UUID, TEXT, UUID) TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================
-- You can test this function with:
-- SELECT * FROM update_coinflip_result(
--   'your-coinflip-id'::UUID,
--   'heads',
--   'your-winner-id'::UUID
-- );

-- ============================================
-- DONE! 🎉
-- ============================================
-- Run this in Supabase SQL Editor
-- The code will automatically use this function
