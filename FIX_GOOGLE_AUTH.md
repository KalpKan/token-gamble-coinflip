# 🔧 Fix Google Auth "DNS_PROBE_FINISHED_NXDOMAIN" Error

## 🔍 The Problem
The error `zxjtflnnjxdxiycrdlrv.supabase.DNS_PROBE_FINISHED_NXDOMAIN` means:
- It's trying to go to `zxjtflnnjxdxiycrdlrv.supabase` (WRONG - missing `.co`)
- Should be: `zxjtflnnjxdxiycrdlrv.supabase.co` (CORRECT)

This is a Google OAuth configuration issue in Supabase.

---

## ✅ Solution: Configure Google OAuth in Supabase

### Step 1: Go to Supabase Auth Providers
**https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers**

### Step 2: Find Google Provider
Scroll down to find **"Google"** in the list of providers

### Step 3: Check if Google is Enabled
- If Google shows as **"Enabled"**, click on it to edit
- If Google shows as **"Disabled"**, you need to set it up first

---

## 🎯 Quick Fix Option 1: Disable Google Auth (Easiest)

If you don't need Google OAuth right now:

1. Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers**
2. Find **"Google"**
3. Click on it
4. Toggle it to **"Disabled"**
5. Click **"Save"**

**Result**: The "Continue with Google" button will still show, but you can use email/password sign up instead.

---

## 🔧 Option 2: Properly Configure Google OAuth (Recommended)

If you want Google OAuth to work, follow these steps:

### Step 1: Create Google OAuth Credentials

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Create a new project (or select existing)
3. Click **"Create Credentials"** → **"OAuth client ID"**
4. Choose **"Web application"**
5. Name it: "Token Gamble"

### Step 2: Add Authorized Redirect URIs

Add these URIs:
```
https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback
https://tokengamblecoinflip.vercel.app/auth/callback
```

### Step 3: Get Client ID and Secret

After creating, Google will show you:
- **Client ID**: (looks like `xxxxx.apps.googleusercontent.com`)
- **Client Secret**: (random string)

**Copy both!**

### Step 4: Add to Supabase

1. Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/providers**
2. Click on **"Google"**
3. Toggle **"Enable Sign in with Google"** to ON
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **"Save"**

---

## 🚨 Quick Workaround (Use Email/Password Instead)

For now, just use email/password authentication:

1. Go to your site: **https://tokengamblecoinflip.vercel.app**
2. Click **"Sign Up"** (not the Google button)
3. Enter email and password
4. Sign up normally

**This will work perfectly!** Google OAuth is optional.

---

## 🎯 Recommended Action

**For now**: Just use email/password sign up (skip Google button)

**Later**: If you want Google OAuth, follow Option 2 above to set it up properly.

---

## ✅ Test Email/Password Auth

1. Go to: **https://tokengamblecoinflip.vercel.app**
2. Click **"Sign Up"**
3. Email: `test@example.com`
4. Password: `password123`
5. Click **"Create Account"**
6. **Expected**: You should be redirected to `/lobby` ✅

---

## 📋 Summary

**Problem**: Google OAuth not configured properly in Supabase
**Quick Fix**: Use email/password instead (works perfectly)
**Long-term Fix**: Set up Google OAuth credentials (optional)

---

**Bottom Line**: Just use the email/password sign up for now. It works great! 🚀

The Google button is optional - you don't need it for the app to work.
