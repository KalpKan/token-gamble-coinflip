# 🚀 YOUR Personal Deployment Guide

## ✅ Step 1: GitHub - COMPLETE! ✅

Your code is now live on GitHub:
**Repository**: https://github.com/KalpKan/token-gamble-coinflip

---

## 📋 Step 2: Deploy to Vercel (5 minutes)

### 2.1 Go to Vercel
1. Open: https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find **"token-gamble-coinflip"** in your repo list
3. Click **"Import"**

### 2.3 Configure Project
Vercel should auto-detect Next.js. If not:
- Framework Preset: **Next.js**
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

### 2.4 Add Environment Variables ⚠️ IMPORTANT

Click **"Environment Variables"** and add these TWO variables:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://zxjtflnnjxdxiycrdlrv.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4anRmbG5uanhkeGl5Y3JkbHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzEyMzksImV4cCI6MjA3ODg0NzIzOX0.ew97nfCdG7Ai_Nbb0OixMHS5BiyR11SS2gGS2_dXLNQ
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### 2.5 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes ☕
3. You'll get a URL like: `https://token-gamble-coinflip-xxxxx.vercel.app`

---

## 🔧 Step 3: Configure Supabase (2 minutes)

### 3.1 Update Redirect URLs
1. Go to: https://supabase.com/dashboard
2. Select your project: **zxjtflnnjxdxiycrdlrv**
3. Go to **Authentication** → **URL Configuration**
4. Add these to **Redirect URLs**:
   ```
   https://your-vercel-url.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   ```
   (Replace `your-vercel-url` with your actual Vercel URL)

5. Set **Site URL** to:
   ```
   https://your-vercel-url.vercel.app
   ```

6. Click **"Save"**

---

## ✅ Step 4: Test Your App!

### 4.1 Visit Your App
Go to your Vercel URL (from Step 2.5)

### 4.2 Quick Test
1. **Sign Up**: Create a new account
2. **Profile**: Add an OpenAI API key (get one from https://platform.openai.com/api-keys)
3. **Prompts**: Create a prompt like "What is quantum computing?"
4. **Lobby**: Create a coinflip
5. **Test**: Open incognito window, sign up as second user, join the coinflip
6. **Verify**: Winner should see answer, loser's prompt unlocks

---

## 🎯 Your Credentials Summary

### GitHub
- **Repository**: https://github.com/KalpKan/token-gamble-coinflip
- **Username**: KalpKan

### Supabase
- **Project URL**: https://zxjtflnnjxdxiycrdlrv.supabase.co
- **Project ID**: zxjtflnnjxdxiycrdlrv
- **Dashboard**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Your URL**: (will be provided after deployment)

---

## 💰 Cost Reminder

### Your Costs
- **Vercel**: $0/month (Free tier)
- **Supabase**: $0/month (Free tier)
- **OpenAI**: $0/month (users provide their own keys)

**Total: $0/month** 🎉

### User Costs (Per Coinflip Loss)
- **Short**: ~$0.0001 (1/100th penny)
- **Medium**: ~$0.0003 (3/100th penny)
- **Long**: ~$0.0006 (6/100th penny)

Using **GPT-4o-mini** - the most cost-effective model!

---

## 🛡️ Security Notes

✅ Your `.env.local` file is NOT on GitHub (protected by .gitignore)
✅ Supabase anon key is safe to use in Vercel (designed for client-side)
✅ User API keys are stored securely in Supabase
✅ OpenAI calls are made server-side only

---

## 🆘 Troubleshooting

### Build Fails on Vercel
- **Check**: Environment variables are added correctly
- **Check**: Both variables have all 3 environments checked
- **Try**: Redeploy from Vercel dashboard

### Can't Login After Deployment
- **Check**: Supabase redirect URLs include your Vercel URL
- **Check**: Site URL is set in Supabase
- **Try**: Clear browser cache and try again

### OpenAI Errors
- **Check**: User has added API key in Profile page
- **Check**: API key starts with `sk-`
- **Check**: API key has credits available

---

## 📊 Monitoring

### Vercel
- **Logs**: Dashboard → Your Project → Functions → View Logs
- **Analytics**: Dashboard → Your Project → Analytics

### Supabase
- **Database**: Dashboard → Database → Tables
- **Logs**: Dashboard → Logs
- **Auth**: Dashboard → Authentication → Users

### OpenAI
- **Usage**: https://platform.openai.com/usage
- **Costs**: Track daily/monthly usage

---

## 🎉 Next Steps

1. **Deploy to Vercel** (follow Step 2 above)
2. **Configure Supabase** (follow Step 3 above)
3. **Test thoroughly** (use POST_DEPLOYMENT_TESTING.md)
4. **Share with friends** for beta testing
5. **Monitor usage** in dashboards
6. **(Optional)** Add custom domain
7. **(Optional)** Implement rate limiting

---

## 📞 Quick Links

- **Your GitHub Repo**: https://github.com/KalpKan/token-gamble-coinflip
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv
- **OpenAI Platform**: https://platform.openai.com

---

## 🎯 Deployment Checklist

- [x] Code pushed to GitHub ✅
- [ ] Imported to Vercel
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Supabase redirect URLs updated
- [ ] Tested sign up/login
- [ ] Tested coinflip flow
- [ ] Verified OpenAI integration

---

**Ready to deploy?** Start with Step 2 above! 🚀

**Questions?** Check the other documentation files:
- `DEPLOYMENT_GUIDE.md` - Detailed instructions
- `POST_DEPLOYMENT_TESTING.md` - Testing checklist
- `OPENAI_COST_PROTECTION.md` - Cost information

---

**Deployment Date**: _____________
**Vercel URL**: _____________
**Status**: Ready to Deploy! 🎉
