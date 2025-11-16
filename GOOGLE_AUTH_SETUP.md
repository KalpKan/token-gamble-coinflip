# Google OAuth Setup Guide

## Overview
This guide will help you configure Google OAuth authentication for Token Gamble.

## What Was Added

### Code Changes
1. ✅ **AuthForm Component** - Added "Continue with Google" button
2. ✅ **OAuth Callback Route** - Created `/app/auth/callback/route.ts` to handle OAuth redirects
3. ✅ **Google Sign-In Handler** - Integrated Supabase OAuth flow

### Visual Changes
- Added divider with "Or continue with" text
- Added Google button with official Google logo
- Button has white background to match Google branding
- Smooth hover and loading states

---

## Supabase Configuration (Required)

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name it: "Token Gamble" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" (unless you have a Google Workspace)
   - Click "Create"
   - Fill in required fields:
     - **App name**: Token Gamble
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Skip "Test users" (click "Save and Continue")
   - Click "Back to Dashboard"

5. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Token Gamble Web Client"
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:3000` (for development)
     - Add: `https://your-production-domain.com` (for production)
   - **Authorized redirect URIs**:
     - Add: `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`
   - Click "Create"
   - **SAVE** the Client ID and Client Secret (you'll need these!)

### Step 2: Configure Supabase

1. **Go to Your Supabase Dashboard**
   - Visit: https://zxjtflnnjxdxiycrdlrv.supabase.co

2. **Navigate to Authentication Settings**
   - Click "Authentication" in the left sidebar
   - Click "Providers"
   - Find "Google" in the list

3. **Enable Google Provider**
   - Toggle "Enable Sign in with Google" to ON
   - Enter your **Google Client ID** (from Step 1)
   - Enter your **Google Client Secret** (from Step 1)
   - Click "Save"

4. **Configure Redirect URLs** (if not already set)
   - Go to "Authentication" → "URL Configuration"
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add these:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**` (wildcard for all routes)
   - Click "Save"

### Step 3: Update Google Cloud Console (Add Supabase Callback)

1. **Go back to Google Cloud Console**
   - Navigate to "APIs & Services" → "Credentials"
   - Click on your OAuth client ID

2. **Add Supabase Callback URL**
   - Under "Authorized redirect URIs", make sure you have:
     - `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`
   - Click "Save"

---

## Testing Google OAuth

### Test Flow

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to Login or Signup**:
   - Go to: http://localhost:3000/login
   - Or: http://localhost:3000/signup

3. **Click "Continue with Google"**:
   - Should redirect to Google sign-in page
   - Select your Google account
   - Grant permissions

4. **Verify Redirect**:
   - Should redirect back to your app
   - Should land on `/lobby` page
   - Should show "Welcome, [your-google-email]!"

5. **Check Database**:
   - Go to Supabase Dashboard → Table Editor → users
   - Your Google account should appear in the users table
   - Email should match your Google email

### Expected Behavior

✅ **On Login Page**:
- See "Continue with Google" button below email/password form
- Button has Google logo and white background

✅ **Click Google Button**:
- Redirects to Google OAuth consent screen
- Shows "Token Gamble wants to access your Google Account"

✅ **After Google Sign-In**:
- Redirects to `/auth/callback`
- Then redirects to `/lobby`
- User is logged in

✅ **In Database**:
- User record created in `public.users` table
- Email matches Google account email
- User ID matches Supabase auth user ID

---

## Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"

**Cause**: The redirect URI in your Google OAuth client doesn't match Supabase's callback URL.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Make sure "Authorized redirect URIs" includes:
   - `https://zxjtflnnjxdxiycrdlrv.supabase.co/auth/v1/callback`
4. Save and wait a few minutes for changes to propagate

### Issue: "Error 401: invalid_client"

**Cause**: Client ID or Client Secret is incorrect in Supabase.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Copy the Client ID and Client Secret again
3. Go to Supabase → Authentication → Providers → Google
4. Re-enter the credentials
5. Save

### Issue: Google button doesn't work

**Cause**: Google provider not enabled in Supabase.

**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Find Google and toggle it ON
3. Enter Client ID and Secret
4. Save

### Issue: Redirects to login with "auth_failed" error

**Cause**: OAuth callback failed to exchange code for session.

**Solution**:
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Check that callback route exists at `/app/auth/callback/route.ts`
4. Try clearing cookies and trying again

### Issue: User created in auth but not in users table

**Cause**: Database trigger might not be working.

**Solution**:
1. Go to Supabase SQL Editor
2. Run this query to check if trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
3. If it doesn't exist, run the `supabase-setup.sql` script again

---

## Security Notes

### Development vs Production

**Development** (localhost):
- Authorized JavaScript origins: `http://localhost:3000`
- Redirect URIs: `http://localhost:3000/auth/callback`

**Production** (when deployed):
- Update Google OAuth client with production URLs
- Update Supabase Site URL to production domain
- Add production redirect URLs

### Best Practices

1. **Never commit** Google Client Secret to version control
2. **Use environment variables** for sensitive data (already configured)
3. **Restrict OAuth scopes** to only what you need (email, profile)
4. **Monitor OAuth usage** in Google Cloud Console

---

## Testing Checklist

- [ ] Google OAuth client created in Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] Client ID and Secret added to Supabase
- [ ] Google provider enabled in Supabase
- [ ] Redirect URLs configured correctly
- [ ] "Continue with Google" button appears on login/signup pages
- [ ] Clicking button redirects to Google
- [ ] Can sign in with Google account
- [ ] Redirects back to /lobby after sign-in
- [ ] User appears in Supabase users table
- [ ] Can log out and log back in with Google

---

## Quick Setup Summary

1. **Google Cloud Console**:
   - Create OAuth client
   - Get Client ID and Secret
   - Add Supabase callback URL

2. **Supabase Dashboard**:
   - Enable Google provider
   - Enter Client ID and Secret
   - Configure redirect URLs

3. **Test**:
   - Click "Continue with Google"
   - Sign in with Google
   - Verify redirect to /lobby

---

## Additional Resources

- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify all URLs match exactly (no trailing slashes)
4. Try in incognito mode to rule out cookie issues
