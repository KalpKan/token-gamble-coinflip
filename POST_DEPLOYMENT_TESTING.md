# ✅ Post-Deployment Testing Checklist

## 🧪 Complete Testing Guide

After deploying to Vercel, follow this checklist to ensure everything works correctly.

---

## 🔐 Authentication Tests

### Test 1: Sign Up
- [ ] Go to your Vercel URL
- [ ] Click "Sign Up"
- [ ] Enter email and password (min 6 characters)
- [ ] Click "Create Account"
- [ ] **Expected**: Redirected to `/lobby`
- [ ] **Expected**: See navigation bar with your email

### Test 2: Log Out
- [ ] Click "Logout" in navigation
- [ ] **Expected**: Redirected to `/login`
- [ ] **Expected**: Cannot access `/lobby` directly

### Test 3: Log In
- [ ] Enter your credentials
- [ ] Click "Sign In"
- [ ] **Expected**: Redirected to `/lobby`
- [ ] **Expected**: Session persists on page refresh

### Test 4: Google OAuth (if enabled)
- [ ] Click "Continue with Google"
- [ ] Select Google account
- [ ] **Expected**: Redirected to `/lobby`
- [ ] **Expected**: Account created in Supabase

---

## 👤 Profile Tests

### Test 5: View Profile
- [ ] Click "Profile" in navigation
- [ ] **Expected**: See your email
- [ ] **Expected**: See account creation date
- [ ] **Expected**: See API key input field

### Test 6: Add API Key
- [ ] Get an OpenAI API key from https://platform.openai.com/api-keys
- [ ] Paste key in Profile (should start with `sk-`)
- [ ] Click "Save API Key"
- [ ] **Expected**: Success toast notification
- [ ] **Expected**: Key saved (refresh page to verify)

---

## 📝 Prompt Management Tests

### Test 7: Create Prompt
- [ ] Click "Prompts" in navigation
- [ ] Enter prompt text: "What is quantum computing?"
- [ ] Click "Add Prompt"
- [ ] **Expected**: Prompt appears in "Loaded" tab
- [ ] **Expected**: Success toast notification

### Test 8: Edit Prompt
- [ ] Click edit icon on a prompt
- [ ] Change text to: "Explain quantum computing simply"
- [ ] Click "Save Changes"
- [ ] **Expected**: Prompt text updated
- [ ] **Expected**: Success toast notification

### Test 9: Delete Prompt
- [ ] Click delete icon on a prompt
- [ ] Confirm deletion
- [ ] **Expected**: Prompt removed from list
- [ ] **Expected**: Success toast notification

### Test 10: Create Multiple Prompts
- [ ] Create 3-5 different prompts
- [ ] **Expected**: All appear in "Loaded" tab
- [ ] **Expected**: Can scroll through list

---

## 🎲 Coinflip Creation Tests

### Test 11: Create Coinflip
- [ ] Go to "Lobby"
- [ ] Click "Create Coinflip"
- [ ] Select a prompt from dropdown
- [ ] Choose depth: "Medium"
- [ ] Choose coin side: "Heads"
- [ ] Click "Create Coinflip"
- [ ] **Expected**: Modal closes
- [ ] **Expected**: Coinflip appears in lobby
- [ ] **Expected**: Prompt is now "locked" (check Prompts page)

### Test 12: Cancel Coinflip
- [ ] Find your coinflip in lobby
- [ ] Click "Cancel" button
- [ ] **Expected**: Coinflip disappears from lobby
- [ ] **Expected**: Prompt is unlocked (check Prompts page)

---

## 🎮 Real-Time & Multiplayer Tests

### Test 13: Real-Time Lobby Updates
**Setup**: Open two browser windows (or use incognito)

**Window 1** (User A):
- [ ] Log in as User A
- [ ] Go to Lobby
- [ ] Create a coinflip

**Window 2** (User B):
- [ ] Log in as User B (different account)
- [ ] Go to Lobby
- [ ] **Expected**: See User A's coinflip appear automatically
- [ ] **Expected**: No page refresh needed

### Test 14: Complete Coinflip Flow
**Window 1** (User A):
- [ ] Create coinflip with "Heads"
- [ ] Wait for opponent

**Window 2** (User B):
- [ ] Click "Join" on User A's coinflip
- [ ] Select a prompt
- [ ] Click "Join & Flip"
- [ ] **Expected**: Coin animation plays
- [ ] **Expected**: Result shown (Heads or Tails)
- [ ] **Expected**: Winner/Loser message displayed

**Winner's Window**:
- [ ] **Expected**: 🎉 Confetti animation
- [ ] **Expected**: "YOU WIN!" message
- [ ] **Expected**: Can view answer
- [ ] **Expected**: Prompt moved to "Settled" tab

**Loser's Window**:
- [ ] **Expected**: "YOU LOSE" message
- [ ] **Expected**: No confetti
- [ ] **Expected**: Prompt unlocked (back to "Loaded")

---

## 🤖 OpenAI Integration Tests

### Test 15: OpenAI API Call (Winner)
**Prerequisites**: Both users must have API keys saved

- [ ] Complete a coinflip (Test 14)
- [ ] Winner clicks "View Answer"
- [ ] **Expected**: See AI-generated response
- [ ] **Expected**: Response length matches depth (short/medium/long)
- [ ] **Expected**: Token count displayed

### Test 16: Check Settled Prompts
- [ ] Go to "Prompts" page
- [ ] Click "Settled" tab
- [ ] **Expected**: See won prompt with answer
- [ ] **Expected**: See response depth
- [ ] **Expected**: See token count
- [ ] **Expected**: See settlement date

### Test 17: Cost Verification
- [ ] Check OpenAI usage dashboard: https://platform.openai.com/usage
- [ ] **Expected**: See API call from coinflip
- [ ] **Expected**: Cost is ~$0.0001-$0.0006 (depending on depth)
- [ ] **Expected**: Loser's key was charged (not winner's)

---

## 🔒 Security Tests

### Test 18: Protected Routes
- [ ] Log out
- [ ] Try to access `/lobby` directly
- [ ] **Expected**: Redirected to `/login`
- [ ] Try to access `/prompts` directly
- [ ] **Expected**: Redirected to `/login`

### Test 19: Prompt Ownership
**Window 1** (User A):
- [ ] Create a prompt
- [ ] Note the prompt ID (from URL or database)

**Window 2** (User B):
- [ ] Try to edit User A's prompt (if possible)
- [ ] **Expected**: Cannot see or edit User A's prompts
- [ ] **Expected**: RLS policies prevent access

### Test 20: API Key Security
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Create/join a coinflip
- [ ] Check API requests
- [ ] **Expected**: API keys NOT visible in requests
- [ ] **Expected**: Keys only used server-side

---

## 📱 Responsive Design Tests

### Test 21: Mobile View (375px)
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Select "iPhone SE" or similar
- [ ] **Expected**: Hamburger menu appears
- [ ] **Expected**: All pages are readable
- [ ] **Expected**: Buttons are tappable
- [ ] **Expected**: Modals fit on screen

### Test 22: Tablet View (768px)
- [ ] Select "iPad" or similar
- [ ] **Expected**: 2-column grid in lobby
- [ ] **Expected**: Navigation shows all links
- [ ] **Expected**: Comfortable spacing

### Test 23: Desktop View (1920px)
- [ ] Select "Responsive" and set to 1920x1080
- [ ] **Expected**: 3-column grid in lobby
- [ ] **Expected**: Full navigation bar
- [ ] **Expected**: Optimal use of space

---

## ⚡ Performance Tests

### Test 24: Page Load Speed
- [ ] Open Vercel Analytics (if enabled)
- [ ] Check page load times
- [ ] **Expected**: < 2 seconds for initial load
- [ ] **Expected**: < 500ms for subsequent navigations

### Test 25: Real-Time Latency
- [ ] Create coinflip in one window
- [ ] Measure time until it appears in another window
- [ ] **Expected**: < 1 second delay
- [ ] **Expected**: Smooth updates, no flickering

### Test 26: Animation Performance
- [ ] Join a coinflip
- [ ] Watch coin animation
- [ ] **Expected**: Smooth 60 FPS animation
- [ ] **Expected**: No stuttering or lag

---

## 🐛 Error Handling Tests

### Test 27: Invalid API Key
- [ ] Go to Profile
- [ ] Enter invalid API key: "invalid-key-123"
- [ ] Save
- [ ] Try to lose a coinflip
- [ ] **Expected**: Error message displayed
- [ ] **Expected**: Coinflip fails gracefully

### Test 28: Empty Prompt
- [ ] Try to create prompt with empty text
- [ ] **Expected**: Button disabled or error shown
- [ ] **Expected**: Cannot submit

### Test 29: Network Error Simulation
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to create a coinflip
- [ ] **Expected**: Error message displayed
- [ ] **Expected**: App doesn't crash

### Test 30: Concurrent Coinflip Join
**Setup**: Three browser windows

**Window 1** (User A):
- [ ] Create coinflip

**Window 2** (User B) & **Window 3** (User C):
- [ ] Both try to join at the same time
- [ ] **Expected**: Only one succeeds
- [ ] **Expected**: Other gets error message
- [ ] **Expected**: No duplicate joins

---

## 📊 Monitoring Tests

### Test 31: Vercel Function Logs
- [ ] Go to Vercel Dashboard
- [ ] Click your project → "Functions"
- [ ] View logs for `/api/openai/answer`
- [ ] **Expected**: See log entries with token counts
- [ ] **Expected**: See estimated costs
- [ ] **Expected**: No error logs (unless testing errors)

### Test 32: Supabase Logs
- [ ] Go to Supabase Dashboard
- [ ] Click "Logs"
- [ ] Filter by table: `coinflips`
- [ ] **Expected**: See INSERT/UPDATE operations
- [ ] **Expected**: See real-time events

### Test 33: OpenAI Usage Dashboard
- [ ] Go to https://platform.openai.com/usage
- [ ] Check today's usage
- [ ] **Expected**: See API calls from your tests
- [ ] **Expected**: Costs match expectations (~$0.0003 per medium request)

---

## 🎯 User Experience Tests

### Test 34: Complete User Journey
**New User Perspective**:
- [ ] Sign up
- [ ] Add API key
- [ ] Create 2-3 prompts
- [ ] Create a coinflip
- [ ] Wait for opponent (or join own coinflip from incognito)
- [ ] Complete coinflip
- [ ] View result
- [ ] Check settled prompts
- [ ] **Expected**: Smooth, intuitive flow
- [ ] **Expected**: Clear instructions at each step

### Test 35: Returning User
- [ ] Log out
- [ ] Log back in
- [ ] **Expected**: All prompts still there
- [ ] **Expected**: Settled prompts preserved
- [ ] **Expected**: API key still saved

---

## ✅ Final Checklist

### Critical Tests (Must Pass)
- [ ] Authentication works
- [ ] Can create and manage prompts
- [ ] Can create and join coinflips
- [ ] Real-time updates work
- [ ] OpenAI integration works
- [ ] Winner gets answer
- [ ] Loser's prompt unlocks

### Important Tests (Should Pass)
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Security measures work
- [ ] Performance is acceptable

### Nice to Have (Optional)
- [ ] Animations are smooth
- [ ] UI is polished
- [ ] Monitoring is set up

---

## 🐛 Bug Reporting Template

If you find issues, document them like this:

```
**Bug**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari]
**Device**: [Desktop/Mobile/Tablet]
**Screenshot**: [If applicable]
```

---

## 📈 Success Metrics

### Minimum Viable Product (MVP)
- ✅ Users can sign up and log in
- ✅ Users can create and manage prompts
- ✅ Users can create and join coinflips
- ✅ Winners receive AI-generated answers
- ✅ Real-time updates work

### Production Ready
- ✅ All MVP features work
- ✅ Responsive design works on all devices
- ✅ Error handling is robust
- ✅ Security measures are in place
- ✅ Performance is acceptable

### Polished Product
- ✅ All Production Ready features
- ✅ Animations are smooth
- ✅ UI is beautiful and intuitive
- ✅ Monitoring and analytics set up
- ✅ Rate limiting implemented

---

## 🎉 Congratulations!

If all tests pass, your app is **production ready**! 🚀

**Next Steps**:
1. Share with friends for beta testing
2. Monitor usage and costs
3. Implement rate limiting (optional)
4. Add custom domain (optional)
5. Celebrate! 🎊

---

**Testing Time**: ~30-45 minutes
**Tests**: 35 total
**Critical Tests**: 15
**Status**: Ready to Test! ✅
