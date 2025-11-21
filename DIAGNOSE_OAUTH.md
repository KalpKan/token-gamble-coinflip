# 🔍 OAuth Diagnosis Steps

## What We Just Did

Added detailed error logging to see exactly what's failing. After Vercel deploys (2-3 minutes), try signing in with Google again.

## What to Check Now

### 1. Check Vercel Deployment
Wait for deployment to complete: https://vercel.com/dashboard

### 2. Try Google Sign In Again
Once deployed, go to: https://tokengamblecoinflip.vercel.app/login

Click "Continue with Google" and see what error message appears.

### 3. Check Vercel Logs
Go to: https://vercel.com/dashboard → Your Project → Logs

Look for console.log messages from the auth callback:
- "Auth callback received"
- "OAuth error"
- "Supabase exchange error"
- "OAuth successful"

## Most Likely Issues

### Issue 1: Google Provider Not Enabled in Supabase
**Check:** https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers

1. Find "Google" in the list
2. Make sure toggle is ON (enabled)
3. Click on Google to expand
4. Verify Client ID and Client Secret are filled in

### Issue 2: Wrong Client ID/Secret
The Client ID in Supabase MUST match the one from Google Cloud Console.

**Google Cloud Console:**
https://console.cloud.google.com/apis/credentials

**Supabase:**
https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers

Compare them - they should be IDENTICAL.

### Issue 3: Redirect URL Mismatch
**In Supabase URL Configuration:**
https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration

**Site URL should be:**
```
https://tokengamblecoinflip.vercel.app
```

**Redirect URLs should include:**
```
https://tokengamblecoinflip.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

## Next Steps

1. ✅ Wait for Vercel deployment (check dashboard)
2. ✅ Try Google sign in again
3. ✅ Read the error message on the login page
4. ✅ Check Vercel logs for detailed error info
5. ✅ Verify Supabase Google provider is enabled
6. ✅ Verify Client ID matches between Google and Supabase

**Tell me what error message you see after the deployment completes!**
