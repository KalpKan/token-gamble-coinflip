# 🔧 How to Add Vercel URL to Supabase Redirect URLs

## 📋 Step-by-Step Visual Guide

### Step 1: Get Your Vercel URL

After deploying to Vercel, you'll get a URL that looks like:
```
https://token-gamble-coinflip-xxxxx.vercel.app
```

**Where to find it:**
1. Go to https://vercel.com/dashboard
2. Click on your project "token-gamble-coinflip"
3. You'll see your URL at the top of the page
4. **Copy this URL** (you'll need it in the next steps)

Example URLs:
- `https://token-gamble-coinflip-kalpkans-projects.vercel.app`
- `https://token-gamble-coinflip-git-main-kalpkans-projects.vercel.app`
- `https://token-gamble-coinflip.vercel.app`

---

### Step 2: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Log in if needed
3. You'll see your project: **zxjtflnnjxdxiycrdlrv**
4. Click on it to open the project dashboard

**Direct link to your project:**
https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv

---

### Step 3: Navigate to Authentication Settings

In your Supabase project dashboard:

1. Look at the **left sidebar**
2. Find and click on **"Authentication"** (shield icon)
3. In the Authentication submenu, click on **"URL Configuration"**

**Visual path:**
```
Left Sidebar → Authentication → URL Configuration
```

---

### Step 4: Add Redirect URLs

You'll see a section called **"Redirect URLs"**

#### What to Add:

Add **BOTH** of these URLs (one per line):

```
https://your-vercel-url.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

**Replace `your-vercel-url` with your actual Vercel URL!**

#### Example:
If your Vercel URL is: `https://token-gamble-coinflip-kalpkans-projects.vercel.app`

Add these two lines:
```
https://token-gamble-coinflip-kalpkans-projects.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

#### Why Two URLs?
- **First URL**: For your production deployment
- **Second URL** (`*.vercel.app`): For preview deployments (when you push new code)

---

### Step 5: Set Site URL

In the same page, find **"Site URL"** section

Set it to your main Vercel URL:
```
https://your-vercel-url.vercel.app
```

**Example:**
```
https://token-gamble-coinflip-kalpkans-projects.vercel.app
```

---

### Step 6: Save Changes

1. Scroll down to the bottom of the page
2. Click the **"Save"** button
3. Wait for the success message

---

## 🎯 Complete Example

Let's say your Vercel URL is:
`https://token-gamble-coinflip-kalpkans-projects.vercel.app`

### Redirect URLs (add both):
```
https://token-gamble-coinflip-kalpkans-projects.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

### Site URL:
```
https://token-gamble-coinflip-kalpkans-projects.vercel.app
```

---

## 📸 Visual Reference

### What You'll See in Supabase:

```
┌─────────────────────────────────────────────────────────┐
│  Authentication > URL Configuration                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Site URL                                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ https://token-gamble-coinflip-xxx.vercel.app   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Redirect URLs                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │ https://token-gamble-coinflip-xxx.vercel.app/  │    │
│  │ auth/callback                                   │    │
│  │                                                 │    │
│  │ https://*.vercel.app/auth/callback             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  [Save]                                                  │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After saving, verify:
- [ ] Site URL is set to your Vercel URL
- [ ] Redirect URLs contains your specific Vercel URL with `/auth/callback`
- [ ] Redirect URLs contains `https://*.vercel.app/auth/callback`
- [ ] Changes are saved (you see a success message)

---

## 🧪 Test It Works

1. Go to your Vercel URL
2. Click "Sign Up" or "Log In"
3. Try to create an account
4. **Expected**: You should be able to sign up and be redirected back to `/lobby`
5. **If it fails**: Double-check the redirect URLs are correct

---

## 🆘 Troubleshooting

### Error: "Invalid redirect URL"
**Solution**: Make sure you added `/auth/callback` at the end of your URL

### Error: "Redirect URL not allowed"
**Solution**: 
1. Check for typos in the URL
2. Make sure you saved the changes in Supabase
3. Wait 1-2 minutes for changes to propagate
4. Try clearing your browser cache

### Can't find URL Configuration
**Solution**:
1. Make sure you're in the correct project (zxjtflnnjxdxiycrdlrv)
2. Look for "Authentication" in the left sidebar
3. Click on it to expand the submenu
4. Click "URL Configuration"

### Multiple Vercel URLs?
**Solution**: Add all of them! You can have multiple redirect URLs:
```
https://token-gamble-coinflip-abc123.vercel.app/auth/callback
https://token-gamble-coinflip-def456.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

---

## 🎯 Quick Copy-Paste Template

Replace `YOUR_VERCEL_URL` with your actual URL:

### Redirect URLs:
```
https://YOUR_VERCEL_URL/auth/callback
https://*.vercel.app/auth/callback
```

### Site URL:
```
https://YOUR_VERCEL_URL
```

---

## 📞 Direct Links

- **Your Supabase Project**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv
- **Authentication Settings**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## ⏱️ Time Required

**Total Time**: 2 minutes
- Finding Vercel URL: 30 seconds
- Opening Supabase: 30 seconds
- Adding URLs: 30 seconds
- Saving: 30 seconds

---

## 🎉 Done!

Once you've added the redirect URLs and saved:
1. ✅ Your authentication will work
2. ✅ Users can sign up and log in
3. ✅ Google OAuth will work (if enabled)
4. ✅ Redirects will work properly

**Next Step**: Test your app by signing up at your Vercel URL!

---

**Need more help?** Check POST_DEPLOYMENT_TESTING.md for testing your authentication.
