# Token Gamble - Vercel Deployment Guide

## 🚀 Complete Step-by-Step Deployment Instructions

### Prerequisites
- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Supabase project set up with database tables
- [ ] Git installed on your computer

---

## PART 1: Push Code to GitHub

### Step 1.1: Initialize Git Repository (if not already done)
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - Token Gamble app"
```

### Step 1.2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `token-gamble-coinflip` (or your preferred name)
3. Description: "Coinflip wagering system for OpenAI API tokens"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 1.3: Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/token-gamble-coinflip.git
git branch -M main
git push -u origin main
```

---

## PART 2: Prepare Supabase

### Step 2.1: Get Supabase Credentials
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** (gear icon) → **API**
4. Copy these values (you'll need them for Vercel):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 2.2: Verify Database Tables
Make sure you've run the SQL setup script (`supabase-setup.sql`) in your Supabase SQL Editor:
- [ ] `users` table exists
- [ ] `prompts` table exists
- [ ] `coinflips` table exists
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Real-time is enabled for `coinflips` table

### Step 2.3: Configure Authentication
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google** provider if you want OAuth:
   - Follow the Google OAuth setup guide in `GOOGLE_AUTH_SETUP.md`
   - Add authorized redirect URLs:
     - `https://your-project.vercel.app/auth/callback`
     - `https://*.vercel.app/auth/callback` (for preview deployments)

---

## PART 3: Deploy to Vercel

### Step 3.1: Sign Up / Log In to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. **Choose "Continue with GitHub"** (recommended for easy integration)
4. Authorize Vercel to access your GitHub account

### Step 3.2: Import Your Project
1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find `token-gamble-coinflip` (or your repo name)
4. Click **"Import"**

### Step 3.3: Configure Project Settings

#### Framework Preset
- Vercel should auto-detect **Next.js** ✅
- If not, select "Next.js" from the dropdown

#### Root Directory
- Leave as `.` (root)

#### Build and Output Settings
- **Build Command**: `next build` (should be auto-filled)
- **Output Directory**: `.next` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

### Step 3.4: Add Environment Variables
This is **CRITICAL** - click "Environment Variables" section:

Add these variables:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase Project URL (from Step 2.1)
   - Example: `https://xxxxx.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon/public key (from Step 2.1)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### Step 3.5: Deploy!
1. Click **"Deploy"**
2. Wait 2-5 minutes for the build to complete
3. You'll see a success screen with your live URL!

---

## PART 4: Post-Deployment Configuration

### Step 4.1: Update Supabase Redirect URLs
1. Go back to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Add your Vercel URLs to **Redirect URLs**:
   ```
   https://your-project-name.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   ```
4. Add to **Site URL**:
   ```
   https://your-project-name.vercel.app
   ```

### Step 4.2: Test Your Deployment
1. Visit your Vercel URL (e.g., `https://your-project-name.vercel.app`)
2. Test the following:
   - [ ] Sign up with a new account
   - [ ] Log in
   - [ ] Add your OpenAI API key in Profile
   - [ ] Create a prompt
   - [ ] Create a coinflip
   - [ ] Join a coinflip (use incognito window for second user)
   - [ ] Verify real-time updates work

---

## PART 5: Custom Domain (Optional)

### Step 5.1: Add Custom Domain
1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `tokengamble.com`)
4. Follow Vercel's instructions to:
   - Add DNS records to your domain provider
   - Wait for DNS propagation (can take up to 48 hours)

### Step 5.2: Update Supabase URLs
Don't forget to add your custom domain to Supabase redirect URLs!

---

## 🔧 Troubleshooting

### Build Fails
**Error: "Module not found"**
- Solution: Make sure all dependencies are in `package.json`
- Run locally: `npm install` then `npm run build`

**Error: "Environment variables not found"**
- Solution: Double-check environment variables in Vercel dashboard
- Make sure they're added to all environments (Production, Preview, Development)

### App Loads But Features Don't Work
**Can't sign up/login**
- Check Supabase URL and anon key are correct
- Verify Supabase redirect URLs include your Vercel domain

**Real-time updates not working**
- Check Supabase real-time is enabled for `coinflips` table
- Verify RLS policies are set up correctly

**OpenAI API calls fail**
- Users need to add their own API keys in Profile page
- This is by design - each user uses their own key

### Database Errors
**"relation does not exist"**
- Run the `supabase-setup.sql` script in Supabase SQL Editor
- Verify all tables are created

---

## 📊 Monitoring Your Deployment

### Vercel Analytics
1. Go to your project in Vercel Dashboard
2. Click **"Analytics"** tab
3. View real-time traffic, performance metrics

### Vercel Logs
1. Go to your project in Vercel Dashboard
2. Click **"Deployments"** tab
3. Click on any deployment → **"View Function Logs"**
4. Monitor API route errors and performance

### Supabase Monitoring
1. Supabase Dashboard → **Database** → **Logs**
2. Monitor database queries and errors

---

## 🔄 Updating Your Deployment

### Automatic Deployments
Every time you push to GitHub, Vercel automatically:
1. Builds your app
2. Runs tests (if configured)
3. Deploys to a preview URL
4. Deploys to production (if pushed to `main` branch)

### Manual Deployment
```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically detect the push and redeploy!

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables configured
- [ ] Supabase redirect URLs updated
- [ ] Can sign up and log in
- [ ] Can create and manage prompts
- [ ] Can create and join coinflips
- [ ] Real-time updates work
- [ ] OpenAI API integration works
- [ ] (Optional) Custom domain configured

---

## 📞 Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Support**: https://vercel.com/support

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - it's in `.gitignore` for a reason
2. **Supabase anon key is safe to expose** - it's designed for client-side use
3. **User API keys are stored in Supabase** - protected by RLS policies
4. **OpenAI calls are made server-side** - API keys never exposed to client

---

## 💰 Cost Considerations

### Vercel
- **Hobby Plan**: FREE
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless function execution

### Supabase
- **Free Tier**:
  - 500MB database
  - 2GB bandwidth
  - 50,000 monthly active users

### OpenAI
- **Users provide their own API keys**
- **You are NOT charged** - each user pays for their own usage
- See next section for rate limiting implementation

---

## 🎯 Next Steps After Deployment

1. Share your app URL with friends for testing
2. Monitor usage in Vercel and Supabase dashboards
3. Set up rate limiting (see OpenAI section below)
4. Add more features!

---

**Deployment Date**: _____________
**Production URL**: _____________
**GitHub Repo**: _____________
