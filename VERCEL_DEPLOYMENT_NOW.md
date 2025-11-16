# 🚀 Deploy to Vercel RIGHT NOW

## ❌ Current Issue
You're seeing "DEPLOYMENT_NOT_FOUND" because the Vercel deployment hasn't been created yet.

**Solution**: Deploy to Vercel first, THEN update Supabase with the actual URL.

---

## 📋 Step-by-Step Vercel Deployment

### Step 1: Go to Vercel
Open: **https://vercel.com**

### Step 2: Sign In
- Click "Sign Up" or "Log In"
- Choose **"Continue with GitHub"** (easiest option)
- Authorize Vercel to access your GitHub

### Step 3: Import Your Project
1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"token-gamble-coinflip"**
5. Click **"Import"**

### Step 4: Configure Project
Vercel should auto-detect Next.js. Verify these settings:

**Framework Preset**: Next.js ✅ (should be auto-selected)
**Root Directory**: `./` (leave as default)
**Build Command**: `next build` (auto-filled)
**Output Directory**: `.next` (auto-filled)
**Install Command**: `npm install` (auto-filled)

### Step 5: Add Environment Variables ⚠️ CRITICAL!

Click **"Environment Variables"** section and add these TWO variables:

#### Variable 1:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://zxjtflnnjxdxiycrdlrv.supabase.co
```
**Environments**: Check ALL three boxes:
- ✅ Production
- ✅ Preview
- ✅ Development

#### Variable 2:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4anRmbG5uanhkeGl5Y3JkbHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzEyMzksImV4cCI6MjA3ODg0NzIzOX0.ew97nfCdG7Ai_Nbb0OixMHS5BiyR11SS2gGS2_dXLNQ
```
**Environments**: Check ALL three boxes:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 6: Deploy!
1. Click the **"Deploy"** button
2. Wait 2-3 minutes while Vercel builds your app ☕
3. You'll see a progress screen with logs

### Step 7: Get Your URL
After deployment completes, you'll see:
- **"Congratulations!"** message
- Your live URL (something like `https://token-gamble-coinflip-xxxxx.vercel.app`)
- **Copy this URL!** You'll need it for Supabase

---

## 🔧 After Deployment: Update Supabase

### Step 8: Update Supabase with Your REAL Vercel URL

1. Go to: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration

2. **Update "Redirect URLs"** to include your actual Vercel URL:
   ```
   https://YOUR-ACTUAL-VERCEL-URL.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
   (Replace `YOUR-ACTUAL-VERCEL-URL` with the URL Vercel gave you)

3. **Update "Site URL"**:
   ```
   https://YOUR-ACTUAL-VERCEL-URL.vercel.app
   ```

4. Click **"Save"**

---

## ✅ Test Your Deployment

1. Go to your Vercel URL
2. Click "Sign Up"
3. Create an account
4. **Expected**: You should be able to sign up and be redirected to `/lobby`

---

## 🆘 Troubleshooting

### Build Fails on Vercel
**Check**: 
- Environment variables are added correctly
- Both variables have all 3 environments checked
- No typos in the variable names

**Fix**: 
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Verify both variables are there
- Redeploy: Deployments → Click "..." → Redeploy

### Deployment Succeeds but Site Shows Error
**Check**: 
- Did you add BOTH environment variables?
- Did you check all 3 environment boxes?

**Fix**: 
- Add missing variables
- Redeploy the project

### "Invalid Redirect URL" Error When Signing Up
**Check**: 
- Did you update Supabase with your ACTUAL Vercel URL?
- Did you include `/auth/callback` at the end?

**Fix**: 
- Go back to Supabase URL Configuration
- Add your real Vercel URL with `/auth/callback`
- Save

---

## 📊 What Happens During Deployment

1. **Vercel clones your GitHub repo**
2. **Installs dependencies** (`npm install`)
3. **Builds your Next.js app** (`next build`)
4. **Deploys to their edge network**
5. **Gives you a live URL**

**Time**: 2-3 minutes total

---

## 🎯 Quick Checklist

- [ ] Signed in to Vercel with GitHub
- [ ] Imported `token-gamble-coinflip` repository
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` environment variable
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable
- [ ] Checked all 3 environment boxes for both variables
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete
- [ ] Copied my Vercel URL
- [ ] Updated Supabase redirect URLs with my real Vercel URL
- [ ] Updated Supabase Site URL
- [ ] Tested sign up on my Vercel URL

---

## 💡 Pro Tips

1. **Bookmark your Vercel dashboard**: https://vercel.com/dashboard
2. **Save your Vercel URL**: You'll need it often
3. **Keep localhost in Supabase**: So you can test locally anytime
4. **Check deployment logs**: If something fails, logs show why

---

## 🎉 After Successful Deployment

Your app will be live at your Vercel URL!

**Features that will work**:
- ✅ Sign up / Log in
- ✅ Create prompts
- ✅ Create coinflips
- ✅ Join coinflips
- ✅ Real-time updates
- ✅ OpenAI integration
- ✅ Responsive design

**Next Steps**:
1. Test thoroughly
2. Share with friends
3. Monitor usage in Vercel dashboard
4. (Optional) Add custom domain

---

**Ready?** Go to https://vercel.com and start with Step 2! 🚀

**Estimated Time**: 5 minutes to deploy + 2 minutes to update Supabase = **7 minutes total**
