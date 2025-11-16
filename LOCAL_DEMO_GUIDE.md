# 🖥️ Run Token Gamble Locally (Demo Without Deployment)

## 🎯 Quick Start (5 Minutes)

### Step 1: Update Supabase for Local Development (2 minutes)

1. Go to: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration

2. **Add localhost to Redirect URLs** (add these lines):
   ```
   http://localhost:3000/auth/callback
   https://token-coinflip.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   ```

3. **Update Site URL to**:
   ```
   http://localhost:3000
   ```
   (You can change it back to your Vercel URL later)

4. Click **"Save"**

---

### Step 2: Start the Development Server (1 minute)

Open your terminal in the project folder and run:

```bash
npm run dev
```

**Expected output:**
```
> token-gamble-coinflip@0.1.0 dev
> next dev

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

---

### Step 3: Open Your Browser

Go to: **http://localhost:3000**

You should see your Token Gamble app running locally! 🎉

---

## 🎮 Demo the Full Flow

### 1. Sign Up (User 1)
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account: `user1@test.com` / `password123`
4. You'll be redirected to the lobby

### 2. Add API Key
1. Click "Profile" in navigation
2. Add your OpenAI API key (get one from https://platform.openai.com/api-keys)
3. Click "Save API Key"

### 3. Create Prompts
1. Click "Prompts" in navigation
2. Create a prompt: "What is quantum computing?"
3. Create another: "Explain blockchain technology"

### 4. Create a Coinflip
1. Go to "Lobby"
2. Click "Create Coinflip"
3. Select your first prompt
4. Choose depth: "Medium"
5. Choose side: "Heads"
6. Click "Create Coinflip"

### 5. Join as Second User (Incognito Window)
1. Open a **new incognito/private window**
2. Go to http://localhost:3000
3. Sign up as: `user2@test.com` / `password123`
4. Add an OpenAI API key in Profile
5. Create a prompt: "What is machine learning?"
6. Go to Lobby
7. Click "Join" on User 1's coinflip
8. Select your prompt
9. Click "Join & Flip"

### 6. Watch the Magic! ✨
- Coin animation plays
- Winner sees confetti and answer
- Loser's prompt unlocks
- Real-time updates in both windows

---

## 🛑 Stop the Server

When you're done demoing, press:
```
Ctrl + C
```
in the terminal to stop the server.

---

## 📊 What You Can Demo

### ✅ Features to Show
- **Authentication**: Sign up, log in, logout
- **Responsive Design**: Resize browser to see mobile/tablet/desktop views
- **Prompt Management**: Create, edit, delete prompts
- **Coinflip Creation**: Different depths (short/medium/long)
- **Real-time Lobby**: See coinflips appear instantly
- **Coin Animation**: Smooth 3D flip animation
- **Winner Experience**: Confetti, answer display
- **Loser Experience**: Prompt unlocks
- **Cost Tracking**: See token usage in settled prompts

### 🎨 UI/UX to Highlight
- Dark theme with gambling aesthetic
- Smooth animations (Framer Motion)
- Mobile-friendly navigation (hamburger menu)
- Toast notifications
- Loading states
- Error handling

---

## 🔧 Troubleshooting

### Port 3000 Already in Use?
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```
Then go to http://localhost:3001

### Can't Sign Up?
**Check**: Did you add `http://localhost:3000/auth/callback` to Supabase redirect URLs?

### OpenAI Errors?
**Check**: Did both users add their API keys in Profile?

### Real-time Not Working?
**Check**: Make sure both browser windows are open and logged in

---

## 💡 Demo Tips

### For Presentations
1. **Prepare ahead**: Create 2 accounts and some prompts before the demo
2. **Use two screens**: Show both users simultaneously
3. **Explain as you go**: Talk about the tech stack and features
4. **Show mobile view**: Use browser DevTools to demonstrate responsive design

### Key Talking Points
- "Built with Next.js 14, React 18, and TypeScript"
- "Real-time multiplayer using Supabase"
- "Cost-effective AI integration with GPT-4o-mini"
- "Fully responsive - works on any device"
- "Users provide their own API keys - no cost to platform"
- "Conservative token limits prevent excessive costs"

### Impressive Features to Highlight
- Real-time lobby updates (no refresh needed)
- Smooth coin flip animation
- Confetti effect for winners
- Locked prompt protection
- Token usage tracking
- Mobile-friendly design

---

## 🎬 Demo Script (5 Minutes)

### Minute 1: Introduction
"This is Token Gamble - a coinflip wagering system for OpenAI API tokens. Users can wager their prompts against each other, and the winner gets their question answered by AI."

### Minute 2: User Flow
- Sign up as User 1
- Add API key
- Create a prompt
- Create a coinflip

### Minute 3: Multiplayer
- Open incognito window
- Sign up as User 2
- Join the coinflip

### Minute 4: The Flip
- Watch the coin animation
- Show winner's confetti and answer
- Show loser's unlocked prompt

### Minute 5: Features
- Show responsive design (resize browser)
- Show prompt management
- Show settled prompts with answers
- Explain cost protection

---

## 🔄 Switch Back to Production

When you're done demoing locally, remember to:

1. Go to Supabase: https://supabase.com/dashboard/project/zxjtflnnjxdxiycrdlrv/auth/url-configuration

2. **Change Site URL back to**:
   ```
   https://token-coinflip.vercel.app
   ```

3. **Keep all Redirect URLs** (including localhost for future local testing):
   ```
   http://localhost:3000/auth/callback
   https://token-coinflip.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   ```

4. Click **"Save"**

---

## 📋 Quick Checklist

- [ ] Added localhost to Supabase redirect URLs
- [ ] Changed Site URL to localhost
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:3000
- [ ] Created two test accounts
- [ ] Added API keys for both users
- [ ] Created prompts
- [ ] Completed a coinflip
- [ ] Demoed all features
- [ ] Stopped the server (Ctrl+C)
- [ ] Changed Supabase Site URL back to production

---

## 🎉 You're Ready to Demo!

**Start Command**: `npm run dev`
**URL**: http://localhost:3000
**Time**: 5 minutes to set up, unlimited demo time!

---

**Pro Tip**: Keep localhost in your Supabase redirect URLs permanently so you can easily test locally anytime!
