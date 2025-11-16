# 🎯 Your Supabase Setup - Exact URLs to Use

## ✅ Your Vercel URL
**https://token-coinflip.vercel.app/**

---

## 📝 Copy and Paste These Exact URLs

### Step 1: Open Supabase Auth Settings
**Direct Link**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration

---

### Step 2: Add to "Redirect URLs"

Copy and paste these **TWO** lines (one per line):

```
https://token-coinflip.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

**Visual:**
```
┌─────────────────────────────────────────────────┐
│ Redirect URLs                                    │
├─────────────────────────────────────────────────┤
│ https://token-coinflip.vercel.app/auth/callback│
│ https://*.vercel.app/auth/callback              │
└─────────────────────────────────────────────────┘
```

---

### Step 3: Set "Site URL"

Copy and paste this:

```
https://token-coinflip.vercel.app
```

**Visual:**
```
┌─────────────────────────────────────────────────┐
│ Site URL                                         │
├─────────────────────────────────────────────────┤
│ https://token-coinflip.vercel.app               │
└─────────────────────────────────────────────────┘
```

---

### Step 4: Save
Click the **"Save"** button at the bottom of the page.

---

## ✅ Verification

After saving, your settings should look like this:

**Site URL:**
```
https://token-coinflip.vercel.app
```

**Redirect URLs:**
```
https://token-coinflip.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

---

## 🧪 Test Your Setup

1. Go to: **https://token-coinflip.vercel.app**
2. Click "Sign Up"
3. Create an account with email and password
4. **Expected**: You should be redirected to `/lobby` after signing up
5. **Success**: If you see the lobby page, everything is working! 🎉

---

## 🔗 Quick Links

- **Your App**: https://token-coinflip.vercel.app
- **Supabase Auth Settings**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 📋 Quick Checklist

- [ ] Opened Supabase auth settings
- [ ] Added `https://token-coinflip.vercel.app/auth/callback`
- [ ] Added `https://*.vercel.app/auth/callback`
- [ ] Set Site URL to `https://token-coinflip.vercel.app`
- [ ] Clicked Save
- [ ] Tested sign up at https://token-coinflip.vercel.app

---

## 🎉 You're Done!

Once you save these settings, your app is fully configured and ready to use!

**Your Live App**: https://token-coinflip.vercel.app 🚀
