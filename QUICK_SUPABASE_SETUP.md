# ⚡ Quick Supabase Redirect Setup (2 Minutes)

## 🎯 What You Need

Your Vercel URL from: https://vercel.com/dashboard

Example: `https://token-gamble-coinflip-kalpkans-projects.vercel.app`

---

## 📝 3 Simple Steps

### Step 1: Open Supabase
Go to: **https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration**

(This is a direct link to the right page!)

---

### Step 2: Add These URLs

#### In "Redirect URLs" box, add:
```
https://YOUR_VERCEL_URL/auth/callback
https://*.vercel.app/auth/callback
```

**Replace `YOUR_VERCEL_URL` with your actual Vercel URL!**

#### Example:
```
https://token-gamble-coinflip-kalpkans-projects.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

---

### Step 3: Set Site URL

#### In "Site URL" box, add:
```
https://YOUR_VERCEL_URL
```

#### Example:
```
https://token-gamble-coinflip-kalpkans-projects.vercel.app
```

---

### Step 4: Save
Click the **"Save"** button at the bottom

---

## ✅ Done!

That's it! Your authentication will now work.

**Test it**: Go to your Vercel URL and try signing up!

---

## 🔗 Quick Links

- **Supabase Auth Settings**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration
- **Your Vercel Dashboard**: https://vercel.com/dashboard

---

## 📋 Visual Checklist

- [ ] Opened Supabase auth settings
- [ ] Added your Vercel URL with `/auth/callback`
- [ ] Added `https://*.vercel.app/auth/callback`
- [ ] Set Site URL to your Vercel URL
- [ ] Clicked Save
- [ ] Tested sign up on your Vercel URL

---

**Time**: 2 minutes ⏱️
**Difficulty**: Easy ⭐☆☆☆☆
