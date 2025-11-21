# ✅ Supabase Google OAuth Checklist

## Critical Settings to Verify

### 1. Enable Google Provider in Supabase

**Go to:** https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers

**Steps:**
1. Scroll down to find "Google" in the providers list
2. Click on "Google" to expand the settings
3. **Toggle should be ON/GREEN** (enabled)
4. Fill in these fields:

**Client ID (from Google Cloud Console):**
- Should look like: `xxxxx.apps.googleusercontent.com`
- Copy from: https://console.cloud.google.com/apis/credentials

**Client Secret (from Google Cloud Console):**
- Should be a long random string
- Copy from: https://console.cloud.google.com/apis/credentials

5. Click **Save** at the bottom

---

### 2. Configure Supabase URL Settings

**Go to:** https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration

**Site URL:**
```
https://tokengamblecoinflip.vercel.app
```

**Redirect URLs (add all of these):**
```
https://tokengamblecoinflip.vercel.app/auth/callback
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Click **Save** after adding each URL.

---

### 3. Verify Google Cloud Console Settings

**Go to:** https://console.cloud.google.com/apis/credentials

**Find your OAuth 2.0 Client ID and click on it**

**Authorized JavaScript origins:**
```
https://tokengamblecoinflip.vercel.app
https://zxjtflnnjxdxiycrdlrv.supabase.co
```

**Authorized redirect URIs:**
```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
https://tokengamblecoinflip.vercel.app/auth/callback
```

Click **Save** at the bottom.

---

### 4. Verify Environment Variables in Vercel

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Check these variables exist:**

**NEXT_PUBLIC_SUPABASE_URL:**
```
https://zxjtflnnjxdxiycrdlrv.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4anRmbG5uanhkeGl5Y3JkbHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzEyMzksImV4cCI6MjA3ODg0NzIzOX0.ew97nfCdG7Ai_Nbb0OixMHS5BiyR11SS2gGS2_dXLNQ
```

Make sure both are checked for:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## Common Mistakes

### ❌ Mistake 1: Google Provider Not Enabled
The toggle in Supabase must be ON. If it's off, OAuth won't work.

### ❌ Mistake 2: Wrong Client ID
The Client ID in Supabase must EXACTLY match the one in Google Cloud Console.

### ❌ Mistake 3: Missing Supabase URL in Google Console
You need BOTH your Vercel URL AND Supabase URL in Google's authorized origins.

### ❌ Mistake 4: Wrong Redirect URI Format
The Supabase redirect URI must be:
`https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`

NOT:
- `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/callback` ❌
- `https://zxjtflnnjxdxiycrdlrv.supabase.co/callback` ❌

### ❌ Mistake 5: Forgot to Save
After making changes in Google Cloud Console or Supabase, you MUST click Save!

---

## Testing Steps

1. ✅ Complete all checklist items above
2. ✅ Wait for Vercel deployment to finish
3. ✅ Open incognito/private browser window
4. ✅ Go to: https://tokengamblecoinflip.vercel.app/login
5. ✅ Click "Continue with Google"
6. ✅ Check what error message appears (if any)
7. ✅ Check Vercel logs for detailed error info

---

## If Still Not Working

After completing this checklist, if it still doesn't work:

1. Take a screenshot of your Supabase Google provider settings
2. Take a screenshot of your Google Cloud Console OAuth client settings
3. Tell me what error message appears on the login page
4. Check Vercel logs and tell me what you see

This will help me identify the exact issue!
