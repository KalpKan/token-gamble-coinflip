# Coinflip Bug Fixes

## Issues Identified

### 1. Joiner Always Sees "You Win"
**Root Cause**: The `isWinner` logic in `/api/coinflip/join/route.ts` was incorrectly calculated.

**Fix Applied**: 
- Changed from `const isWinner = winnerId === user.id` to `const isWinner = !creatorWins`
- Added clearer variable `creatorWins` to make the logic explicit
- The joiner (current user in the join endpoint) wins when the creator doesn't win

### 2. Asymmetric Behavior (User B can't join User A's flips)
**Potential Causes**:
- Random API endpoint might be cached or failing
- CORS or fetch issues
- Database transaction issues

**Investigation Needed**:
- Check browser console for errors when User A tries to join User B's flip
- Check server logs for the random API call
- Verify the random API is being called with cache-busting

### 3. Completed Flips Still Joinable
**Root Cause**: The lobby page real-time subscription should be working, but there might be a race condition.

**Current Behavior**:
- Lobby filters for `status='open'` coinflips
- Real-time subscription removes coinflips when status changes from 'open'
- Settled section shows last 10 completed flips for the user

**Verification Needed**:
- Check if the database is actually updating the status to 'completed'
- Verify real-time subscription is firing

## Testing Steps

1. **Test Winner Logic**:
   - User A creates flip choosing HEADS
   - User B joins
   - If result is HEADS → User A should win
   - If result is TAILS → User B should win

2. **Test Asymmetric Behavior**:
   - User A creates flip
   - User B joins → should work
   - User B creates flip  
   - User A joins → check console for errors

3. **Test Completed Flips**:
   - After flip completes, check if it disappears from lobby
   - Check if it appears in settled section
   - Try to join a completed flip (should not be possible)

## Additional Fixes Needed

### Prompts Page - Settled Section
Currently the prompts page shows settled prompts, but we need to ensure:
- Only the winner sees the answer
- The answer was generated using the loser's API key
- Both participants can see the flip in their settled section

### Database Query for Settled Flips
The `getSettledCoinflips` function correctly filters for:
- `status='completed'`
- User is either creator or joiner
- Ordered by completed_at
- Limited to 10 results
