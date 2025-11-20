# 🔧 Fix Google OAuth for New Vercel URL

## 🔍 The Problem
Google OAuth was working before, but now it's broken because:
- Your Vercel URL changed to: `https://tokengamblecoinflip.vercel.app`
- Google Cloud Console still has the OLD redirect URIs
- You need to update Google Cloud Console with the NEW URL

---

## ✅ Solution: Update Google Cloud Console

### Step 1: Go to Google Cloud Console
**https://console.cloud.google.com/apis/credentials**

### Step 2: Find Your OAuth Client
1. Look for your OAuth 2.0 Client ID (probably named "Token Gamble" or similar)
2. Click on it to edit

### Step 3: Update Authorized Redirect URIs

**Add these TWO URIs** (if not already there):

```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
https://tokengamblecoinflip.vercel.app/auth/callback
```

**IMPORTANT**: Make sure the Supabase URI ends with `.co` not just `.supabase`!

### Step 4: Remove Old URIs (Optional)
If you see old Vercel URLs like:
- `https://token-coinflip.vercel.app/auth/callback`
- Any other old URLs

You can remove them (but keep the Supabase one!)

### Step 5: Save
Click **"Save"** at the bottom

---

## 🎯 What Your Google Console Should Look Like

**Authorized redirect URIs:**
```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
https://tokengamblecoinflip.vercel.app/auth/callback
```

**Authorized JavaScript origins** (if asked):
```
https://tokengamblecoinflip.vercel.app
https://zxjtflnnjxdxiycrdlrv.supabase.co
```

---

## 🔍 Double-Check Supabase

Make sure Supabase also has the correct redirect URLs:

Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration**

**Redirect URLs should include:**
```
https://tokengamblecoinflip.vercel.app/auth/callback
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Site URL should be:**
```
https://tokengamblecoinflip.vercel.app
```

---

## ✅ Test Google OAuth

1. Go to: **https://tokengamblecoinflip.vercel.app**
2. Click **"Continue with Google"**
3. Select your Google account
4. **Expected**: You should be redirected back to your app and logged in! ✅

---

## 🆘 Still Not Working?

### Check 1: Verify the Supabase URL
The error mentioned `zxjtflnnjxdxiycrdlrv.supabase` (missing `.co`)

Make sure in Google Cloud Console you have:
```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
```
NOT:
```
https://zxjtflnnjxdxiycrdlrv.supabase/auth/v1/callback
```

### Check 2: Wait a Few Minutes
Google Cloud Console changes can take 1-2 minutes to propagate. Try:
1. Wait 2 minutes
2. Clear your browser cache
3. Try Google OAuth again

### Check 3: Verify Google Provider is Enabled in Supabase
1. Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers**
2. Find **"Google"**
3. Make sure it's **"Enabled"**
4. Verify Client ID and Secret are filled in

---

## 📋 Quick Checklist

- [ ] Opened Google Cloud Console
- [ ] Found OAuth 2.0 Client ID
- [ ] Added `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`
- [ ] Added `https://tokengamblecoinflip.vercel.app/auth/callback`
- [ ] Verified `.co` is at the end of Supabase URL
- [ ] Clicked "Save" in Google Console
- [ ] Waited 2 minutes
- [ ] Tested Google OAuth on site

---

## 🎉 Should Work Now!

After updating Google Cloud Console with your new Vercel URL, Google OAuth should work perfectly!

**Test it**: https://tokengamblecoinflip.vercel.app 🚀

---

**Key Point**: The issue is that Google Cloud Console needs to know about your new Vercel URL. Once you add it, Google OAuth will work again!
