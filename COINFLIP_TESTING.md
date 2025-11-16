# Coinflip Feature Testing Guide

## What's Been Implemented

I've created a complete coinflip creation flow with the following components:

### 1. API Route (`/api/coinflip/create`)
- **Location**: `app/api/coinflip/create/route.ts`
- **Method**: POST
- **Authentication**: Required (uses session cookies)
- **Validation**: 
  - Checks user owns the prompt
  - Verifies prompt is in 'loaded' status
  - Validates depth (short/medium/long) and coinSide (heads/tails)
- **Actions**:
  - Creates coinflip in database
  - Locks the prompt (changes status from 'loaded' to 'locked')
  - Returns coinflip ID on success
- **Error Handling**: Includes rollback if prompt lock fails

### 2. Coinflip Creation Page
- **Location**: `app/(protected)/coinflip/page.tsx`
- **URL**: `/coinflip`
- **Features**:
  - Lists all loaded prompts for selection
  - Depth selector (short/medium/long)
  - Coin side selector (heads/tails)
  - Summary view before creation
  - Real-time feedback with toast notifications
  - Auto-refreshes prompt list after creation

### 3. Navigation Update
- Added "Create Coinflip" link to the main navigation bar

## How to Test

### Prerequisites
1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. Ensure you have:
   - A user account (sign up/login)
   - At least one prompt in 'loaded' status

### Testing Steps

#### Step 1: Create a Prompt
1. Navigate to `/prompts`
2. Add a new prompt (e.g., "What is the meaning of life?")
3. Verify it appears in the "Loaded" tab

#### Step 2: Create a Coinflip
1. Click "Create Coinflip" in the navigation
2. Select a prompt from your loaded prompts
3. Choose a response depth (short/medium/long)
4. Choose your coin side (heads/tails)
5. Review the summary
6. Click "Create Coinflip"

#### Step 3: Verify Success
1. You should see a success toast notification
2. The prompt should disappear from the selection list
3. Go back to `/prompts` and verify:
   - The prompt now shows a "Locked in coinflip" badge
   - The edit/delete buttons are disabled for that prompt

### Expected Behavior

✅ **Success Case**:
- Coinflip is created
- Prompt status changes to 'locked'
- Success message appears
- Prompt list refreshes

❌ **Error Cases**:
- **No prompts**: Shows message to create prompts first
- **Already locked prompt**: Cannot be selected
- **Invalid data**: Shows error message
- **Not authenticated**: Redirects to login

## API Testing (Optional)

You can also test the API directly using curl:

```bash
# First, get your session cookie from the browser dev tools
# Then make a request:

curl -X POST http://localhost:3000/api/coinflip/create \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "promptId": "YOUR_PROMPT_ID",
    "depth": "medium",
    "coinSide": "heads"
  }'
```

## What's Next

This implementation covers task 15 from the spec. The next tasks would be:
- Creating the lobby page to view open coinflips
- Implementing the join coinflip functionality
- Adding the coinflip execution logic
- Displaying results

## Troubleshooting

**Issue**: "Prompt not found" error
- **Solution**: Make sure you're using a valid prompt ID that belongs to your user

**Issue**: "Prompt must be in 'loaded' status" error
- **Solution**: The prompt is already locked or settled. Create a new prompt.

**Issue**: Page shows "No Loaded Prompts"
- **Solution**: Go to `/prompts` and create at least one prompt first

**Issue**: Not authenticated error
- **Solution**: Make sure you're logged in. Check `/login` if needed.
