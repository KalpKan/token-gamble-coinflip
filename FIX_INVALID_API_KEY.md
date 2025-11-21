# 🔧 Fix "Invalid API Key" Error

## The Problem
Your Supabase anon key in Vercel is incorrect or missing.

## ✅ Solution

### Step 1: Get Correct Anon Key from Supabase

1. Go to: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/settings/api
2. Find the **"anon public"** key (NOT the service_role key!)
3. Copy the entire key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Update Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Click your project: **token-gamble-coinflip**
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Edit** (or delete and add new)
6. Paste the anon key from Step 1
7. **IMPORTANT:** Check all three boxes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
8. Click **Save**

### Step 3: Wait for Deployment

I just pushed a small change to trigger a new deployment.

1. Wait 2-3 minutes for Vercel to deploy
2. Check deployment status: https://vercel.com/dashboard
3. Once deployed, try Google sign in again

### Step 4: Test

1. Go to: https://tokengamblecoinflip.vercel.app/login
2. Click **"Continue with Google"**
3. Should work now! ✅

---

## Why This Happened

The environment variable was either:
- Not set correctly in Vercel
- Using the wrong key (maybe service_role instead of anon)
- Missing or truncated

The anon key is safe to expose publicly - it's meant for client-side use.

---

## If Still Not Working

After updating the env var and redeploying, if it still doesn't work:

1. Double-check you copied the **anon public** key (not service_role)
2. Make sure there are no extra spaces or characters
3. Verify all three environment checkboxes are checked in Vercel
4. Try redeploying manually from Vercel dashboard

Let me know if you still see any errors!
