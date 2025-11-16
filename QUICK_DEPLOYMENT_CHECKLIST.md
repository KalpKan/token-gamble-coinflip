# ⚡ Quick Deployment Checklist

## 🚀 Deploy to Vercel in 10 Minutes

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/token-gamble-coinflip.git
git push -u origin main
```

### Step 2: Get Supabase Credentials (1 min)
1. Go to https://supabase.com/dashboard
2. Click your project → Settings → API
3. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: `eyJ...`

### Step 3: Deploy to Vercel (5 min)
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Click "Deploy"
6. Wait 2-3 minutes ☕

### Step 4: Update Supabase (2 min)
1. Back to Supabase → Authentication → URL Configuration
2. Add Redirect URLs:
   ```
   https://your-project.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   ```
3. Save

### ✅ Done! Test Your App
Visit: `https://your-project.vercel.app`

---

## 🔐 Security Checklist
- [x] `.env.local` in `.gitignore` ✅
- [x] Using GPT-4o-mini (most cost-effective) ✅
- [x] Token limits enforced ✅
- [x] Request validation ✅
- [x] Users provide own API keys ✅

---

## 💰 Cost Protection Summary
- **Model**: GPT-4o-mini (cheapest available)
- **Max cost per request**: $0.0006 (less than a penny)
- **Your cost**: $0 (users provide their own keys)
- **Protection**: Token limits, validation, timeouts

---

## 📊 Monitor Your App
- **Vercel Logs**: Dashboard → Functions → View Logs
- **Supabase**: Dashboard → Logs
- **OpenAI**: platform.openai.com/usage

---

## 🆘 Troubleshooting

**Build fails?**
- Check environment variables are set
- Verify Supabase credentials

**Can't login?**
- Update Supabase redirect URLs
- Check environment variables

**OpenAI errors?**
- Users need to add API key in Profile
- Verify key starts with `sk-`

---

## 📞 Quick Links
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Cost Protection**: `OPENAI_COST_PROTECTION.md`
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**Deployment Time**: ~10 minutes
**Cost**: $0 (Free tier)
**Difficulty**: Easy ⭐⭐☆☆☆
