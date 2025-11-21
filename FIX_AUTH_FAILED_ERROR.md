# 🔧 Fix "auth_failed" Error

## 🎉 Progress!
The `.co` fix worked! Now we're getting `auth_failed` which means:
- ✅ Supabase URL is correct now
- ❌ Google Cloud Console redirect URIs need to be updated

---

## ✅ Solution: Update Google Cloud Console

### Step 1: Go to Google Cloud Console
**https://console.cloud.google.com/apis/credentials**

### Step 2: Find Your OAuth 2.0 Client ID
1. Look for your OAuth client (might be named "Token Gamble" or "Web client")
2. Click on the **name** to edit it

### Step 3: Update Authorized Redirect URIs

**You need EXACTLY this URI** (copy it exactly):

```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
```

**CRITICAL CHECKS**:
- ✅ Starts with `https://`
- ✅ Has `zxjtflnnjxdxiycrdlrv.supabase.co` (with `.co`)
- ✅ Ends with `/auth/v1/callback`
- ✅ No extra spaces or characters

### Step 4: Also Add Your Vercel URL (Optional but Recommended)

```
https://tokengamblecoinflip.vercel.app/auth/callback
```

### Step 5: Your Final List Should Look Like This

**Authorized redirect URIs:**
```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
https://tokengamblecoinflip.vercel.app/auth/callback
```

### Step 6: Save
Click **"Save"** at the bottom

---

## 🔍 Common Mistakes to Avoid

❌ **WRONG**: `https://zxjtflnnjxdxiycrdlrv.supabase/auth/v1/callback` (missing `.co`)
✅ **CORRECT**: `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`

❌ **WRONG**: `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/callback` (missing `/v1`)
✅ **CORRECT**: `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`

---

## 🎯 Visual Guide

Your Google Cloud Console should show:

```
┌─────────────────────────────────────────────────────────────────┐
│  Authorized redirect URIs                                        │
├─────────────────────────────────────────────────────────────────┤
│  https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback    │
│  https://tokengamblecoinflip.vercel.app/auth/callback          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Test After Saving

1. **Wait 1-2 minutes** for Google to propagate changes
2. **Clear your browser cache** (or use incognito mode)
3. Go to: **https://tokengamblecoinflip.vercel.app**
4. Click **"Continue with Google"**
5. Select your Google account
6. **Expected**: You should be logged in and redirected to `/lobby` ✅

---

## 🆘 Still Getting auth_failed?

### Check 1: Verify Google Provider is Enabled in Supabase
1. Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers**
2. Find **"Google"**
3. Make sure toggle is **ON** (green)
4. Verify **Client ID** and **Client Secret** are filled in

### Check 2: Verify Supabase Redirect URLs
Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration**

Should have:
```
https://tokengamblecoinflip.vercel.app/auth/callback
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### Check 3: Try Incognito Mode
Sometimes browser cache causes issues:
1. Open incognito/private window
2. Go to your site
3. Try Google OAuth again

---

## 📋 Quick Checklist

- [ ] Opened Google Cloud Console credentials page
- [ ] Found OAuth 2.0 Client ID
- [ ] Added `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`
- [ ] Verified `.co` is there (not just `.supabase`)
- [ ] Verified `/v1/` is in the path
- [ ] Clicked "Save"
- [ ] Waited 2 minutes
- [ ] Cleared browser cache
- [ ] Tested in incognito mode

---

## 🎉 Should Work Now!

After adding the correct Supabase callback URL to Google Cloud Console, Google OAuth should work perfectly!

**Test it**: https://tokengamblecoinflip.vercel.app 🚀

---

**Key Point**: The Supabase callback URL MUST be exactly:
`https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`

No typos, no missing parts!
