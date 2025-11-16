# Testing Guide - Task 5: Authentication Pages and Flows

## Prerequisites

✅ Supabase project configured (`.env.local` has credentials)
✅ Database tables created (run `supabase-setup.sql` in Supabase SQL Editor if not done)
✅ Development server running (`npm run dev`)

## Testing Checklist

### 1. Initial Setup Verification

**Check Supabase Configuration:**
1. Go to your Supabase project: https://zxjtflnnjxdxiycrdlrv.supabase.co
2. Navigate to **SQL Editor**
3. Verify these tables exist:
   - `public.users`
   - `public.prompts`
   - `public.coinflips`
4. If tables don't exist, run the entire `supabase-setup.sql` script

**Check Email Settings:**
1. In Supabase Dashboard → **Authentication** → **Email Templates**
2. Check if "Confirm signup" is enabled
3. Note: For testing, you can disable email confirmation:
   - Go to **Authentication** → **Providers** → **Email**
   - Toggle OFF "Confirm email"

---

### 2. Home Page Testing

**URL:** `http://localhost:3000/`

**Expected Behavior:**
- [ ] Page loads with dark casino theme
- [ ] "Token Gamble" title displays with gold gradient
- [ ] "Login" button is visible
- [ ] "Sign Up" button is visible
- [ ] Both buttons have hover effects (scale up, color change)

**Test Actions:**
- [ ] Click "Login" → Should navigate to `/login`
- [ ] Click "Sign Up" → Should navigate to `/signup`

---

### 3. Sign Up Page Testing

**URL:** `http://localhost:3000/signup`

#### Visual Tests
- [ ] Page displays "Create Your Account" heading
- [ ] Email input field is visible
- [ ] Password input field is visible
- [ ] "Must be at least 6 characters" hint displays under password
- [ ] "Create Account" button is visible
- [ ] "Already have an account? Sign in" link is visible
- [ ] "← Back to home" link is visible

#### Form Validation Tests

**Test 1: Empty Form Submission**
1. Leave both fields empty
2. Click "Create Account"
3. Expected: Browser shows "Please fill out this field" (HTML5 validation)

**Test 2: Invalid Email Format**
1. Enter: `notanemail`
2. Enter password: `password123`
3. Click "Create Account"
4. Expected: Red error box shows "Please enter a valid email address"

**Test 3: Short Password**
1. Enter email: `test@example.com`
2. Enter password: `12345` (only 5 characters)
3. Click "Create Account"
4. Expected: Red error box shows "Password must be at least 6 characters long"

**Test 4: Valid Sign Up**
1. Enter email: `testuser@example.com` (use a real email you can access)
2. Enter password: `password123`
3. Click "Create Account"
4. Expected:
   - Button shows spinner and "Creating account..."
   - Button is disabled during submission
   - If email confirmation is OFF: Redirects to `/lobby`
   - If email confirmation is ON: May redirect to lobby but won't be fully authenticated until email confirmed

**Test 5: Duplicate Account**
1. Try signing up again with the same email
2. Expected: Error message "An account with this email already exists. Please log in instead."

#### Navigation Tests
- [ ] Click "Sign in" link → Should navigate to `/login`
- [ ] Click "← Back to home" → Should navigate to `/`

---

### 4. Login Page Testing

**URL:** `http://localhost:3000/login`

#### Visual Tests
- [ ] Page displays "Welcome Back" heading
- [ ] Email input field is visible
- [ ] Password input field is visible
- [ ] "Sign In" button is visible
- [ ] "Don't have an account? Sign up" link is visible
- [ ] "← Back to home" link is visible

#### Authentication Tests

**Test 1: Invalid Credentials**
1. Enter email: `wrong@example.com`
2. Enter password: `wrongpassword`
3. Click "Sign In"
4. Expected: Red error box shows "Email or password is incorrect"

**Test 2: Valid Login**
1. Enter the email you signed up with
2. Enter the correct password
3. Click "Sign In"
4. Expected:
   - Button shows spinner and "Signing in..."
   - Redirects to `/lobby`
   - Lobby page shows "Welcome, [your-email]!"

**Test 3: Empty Fields**
1. Leave fields empty
2. Click "Sign In"
3. Expected: Browser validation prevents submission

#### Navigation Tests
- [ ] Click "Sign up" link → Should navigate to `/signup`
- [ ] Click "← Back to home" → Should navigate to `/`

---

### 5. Middleware Protection Testing

**Test 1: Access Protected Route Without Auth**
1. Open a new incognito/private browser window
2. Navigate to: `http://localhost:3000/lobby`
3. Expected: Automatically redirects to `/login`

**Test 2: Access Auth Pages While Logged In**
1. Log in successfully
2. Try to navigate to `/login`
3. Expected: Automatically redirects to `/lobby`
4. Try to navigate to `/signup`
5. Expected: Automatically redirects to `/lobby`

**Test 3: Session Persistence**
1. Log in successfully
2. Close the browser tab
3. Open a new tab and go to `http://localhost:3000/lobby`
4. Expected: Still logged in (no redirect to login)

---

### 6. Lobby Page Testing

**URL:** `http://localhost:3000/lobby` (requires authentication)

**Expected Behavior:**
- [ ] Page displays "Lobby" heading with gold gradient
- [ ] Shows "Welcome, [your-email]!"
- [ ] Shows "Lobby page coming soon..." message
- [ ] Cannot access without being logged in

---

### 7. Responsive Design Testing

**Desktop (1920x1080):**
- [ ] Forms are centered and properly sized
- [ ] All text is readable
- [ ] Buttons are appropriately sized

**Tablet (768x1024):**
- [ ] Layout adjusts properly
- [ ] Forms remain usable
- [ ] No horizontal scrolling

**Mobile (375x667):**
- [ ] Forms are full-width with padding
- [ ] Text is readable
- [ ] Buttons are touch-friendly
- [ ] No content overflow

**How to Test:**
- Use browser DevTools (F12)
- Click the device toolbar icon
- Select different device sizes

---

### 8. Loading States Testing

**Test 1: Slow Network Simulation**
1. Open DevTools (F12)
2. Go to Network tab
3. Change throttling to "Slow 3G"
4. Try to sign up or log in
5. Expected:
   - Button shows spinner immediately
   - Button text changes to "Creating account..." or "Signing in..."
   - Button is disabled (can't click again)
   - Input fields are disabled

---

### 9. Error Handling Testing

**Test 1: Network Error**
1. Turn off your internet connection
2. Try to log in
3. Expected: Error message displays

**Test 2: Supabase Service Down**
1. Temporarily change `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` to invalid URL
2. Restart dev server
3. Try to log in
4. Expected: Error message displays

---

### 10. Database Verification

**After Successful Sign Up:**
1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → **users**
3. Verify:
   - [ ] New user row exists
   - [ ] `id` matches the auth user ID
   - [ ] `email` is correct
   - [ ] `created_at` is populated
   - [ ] `openai_api_key` is NULL (will be set later)

**Check Auth Users:**
1. Navigate to **Authentication** → **Users**
2. Verify:
   - [ ] User appears in the list
   - [ ] Email is correct
   - [ ] Last sign in time updates after login

---

## Quick Test Script

Run these commands in order for a quick smoke test:

```bash
# 1. Start the dev server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Test flow:
# - Click "Sign Up"
# - Create account with: test@example.com / password123
# - Should redirect to /lobby
# - Close tab
# - Open new tab to http://localhost:3000/lobby
# - Should still be logged in
# - Try to go to /login
# - Should redirect back to /lobby
```

---

## Common Issues & Solutions

### Issue: "Invalid API key" error
**Solution:** Check that `.env.local` has correct Supabase credentials

### Issue: Sign up succeeds but can't log in
**Solution:** Check if email confirmation is enabled in Supabase. Either:
- Disable it in Supabase settings, OR
- Check your email and click the confirmation link

### Issue: Redirects to login but immediately redirects back
**Solution:** Session cookie issue. Clear browser cookies and try again

### Issue: "User already exists" but can't log in
**Solution:** The user might be in Supabase Auth but not in the `users` table. Check if the database trigger is working:
```sql
-- Run in Supabase SQL Editor
SELECT * FROM auth.users;
SELECT * FROM public.users;
-- Both should have the same user
```

### Issue: Build errors
**Solution:** Run `npm run build` to check for TypeScript errors

---

## Success Criteria

✅ All tests pass
✅ Can sign up new users
✅ Can log in with correct credentials
✅ Cannot log in with wrong credentials
✅ Protected routes redirect to login
✅ Auth pages redirect to lobby when logged in
✅ Error messages display correctly
✅ Loading states work properly
✅ Responsive design works on all screen sizes
✅ User data appears in Supabase database

---

## Next Steps After Testing

Once all tests pass, you're ready to move on to the next task in the implementation plan!
