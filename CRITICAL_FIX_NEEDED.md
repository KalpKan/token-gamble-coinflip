# CRITICAL FIX - Coinflip Result Not Saving

## Problem Identified

The coinflip result and winner_id are NOT being saved to the database due to an RLS (Row Level Security) policy issue.

### Evidence from Logs

```
updateCoinflipResult response: { data: [], error: null }
```

The update returns **empty data** instead of the updated row. This means the RLS policy is blocking the update.

When we fetch the coinflip after updating:
```
updatedResult: null
updatedWinnerId: null  
updatedStatus: 'open'  // Should be 'completed'!
```

## Root Cause

The UPDATE policy for coinflips is missing the `WITH CHECK` clause:

```sql
-- CURRENT (BROKEN)
CREATE POLICY "Users can update own coinflips"
  ON public.coinflips
  FOR UPDATE
  USING (
    creator_id = auth.uid() 
    OR joiner_id = auth.uid()
  );
  -- Missing WITH CHECK!
```

In PostgreSQL RLS:
- `USING` controls which rows you can UPDATE
- `WITH CHECK` controls what values you can SET

Without `WITH CHECK`, the policy blocks setting the `result` and `winner_id` fields.

## Fix Required

**You MUST run this SQL in your Supabase SQL Editor:**

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy and paste the contents of `supabase-fix-coinflip-update.sql`
4. Click "Run"

The SQL will:
- Drop the old policy
- Create a new policy with `WITH CHECK` clause
- Allow updates to save result and winner_id

## After Running the Fix

Test a coinflip and check the logs for:

```
updateCoinflipResult response: { 
  data: [{ 
    result: 'tails',  // ← Should have actual value!
    winner_id: '...',  // ← Should have actual UUID!
    status: 'completed'  // ← Should be 'completed'!
  }], 
  error: null 
}
```

And when fetching:
```
updatedResult: 'tails'  // ← Should match the actual flip result!
updatedWinnerId: '...'  // ← Should have the winner's UUID!
updatedStatus: 'completed'  // ← Should be 'completed'!
```

## What This Will Fix

Once the RLS policy is updated:

1. ✅ Coin animation will show the correct result (heads or tails)
2. ✅ Winner/loser determination will be correct
3. ✅ Completed flips will have status='completed'
4. ✅ Settled flips will appear in the settled section
5. ✅ Both users will see the correct result

## Current Status

- [x] Issue identified
- [x] SQL fix created
- [ ] **SQL fix needs to be run in Supabase** ← YOU NEED TO DO THIS!
- [ ] Test after fix is applied

## Testing After Fix

1. User A creates flip choosing HEADS
2. User B joins
3. Check Vercel logs for `updateCoinflipResult response`
4. Should see `data: [{ result: 'heads' or 'tails', winner_id: '...', status: 'completed' }]`
5. Check browser console - `coinResult` should NOT be null
6. Coin animation should show correct result
7. Winner/loser messages should be correct

---

**IMPORTANT**: The code changes are already deployed. You just need to run the SQL fix in Supabase to enable the updates to work!
