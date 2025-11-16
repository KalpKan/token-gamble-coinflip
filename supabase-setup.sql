-- ============================================
-- Token Gamble Database Setup Script
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will create all tables, indexes, and security policies

-- ============================================
-- 1. EXTEND USERS TABLE
-- ============================================
-- Add custom column to store OpenAI API keys
-- Note: Supabase Auth manages the base users table (auth.users)
-- We'll create a public.users table that references it

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  openai_api_key TEXT, -- Stored in plain text (MVP only - encrypt in production!)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE PROMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('loaded', 'locked', 'settled')),
  response TEXT, -- NULL until answered
  response_depth TEXT CHECK (response_depth IN ('short', 'medium', 'long')),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompts_user_status ON public.prompts(user_id, status);

-- ============================================
-- 3. CREATE COINFLIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.coinflips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  creator_prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  creator_coin_side TEXT NOT NULL CHECK (creator_coin_side IN ('heads', 'tails')),
  joiner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joiner_prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  depth TEXT NOT NULL CHECK (depth IN ('short', 'medium', 'long')),
  status TEXT NOT NULL CHECK (status IN ('open', 'active', 'completed')),
  result TEXT CHECK (result IN ('heads', 'tails')),
  winner_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_coinflips_status ON public.coinflips(status);
CREATE INDEX IF NOT EXISTS idx_coinflips_creator ON public.coinflips(creator_id);

-- ============================================
-- 4. SET UP ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coinflips ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CREATE SECURITY POLICIES FOR USERS TABLE
-- ============================================
-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own data (for signup)
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 6. CREATE SECURITY POLICIES FOR PROMPTS TABLE
-- ============================================
-- Users can read their own prompts
CREATE POLICY "Users can read own prompts"
  ON public.prompts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own prompts
CREATE POLICY "Users can insert own prompts"
  ON public.prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own prompts
CREATE POLICY "Users can update own prompts"
  ON public.prompts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own prompts
CREATE POLICY "Users can delete own prompts"
  ON public.prompts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. CREATE SECURITY POLICIES FOR COINFLIPS TABLE
-- ============================================
-- Users can read open coinflips OR coinflips they're part of
CREATE POLICY "Users can read relevant coinflips"
  ON public.coinflips
  FOR SELECT
  USING (
    status = 'open' 
    OR creator_id = auth.uid() 
    OR joiner_id = auth.uid()
  );

-- Users can create coinflips (as creator)
CREATE POLICY "Users can create coinflips"
  ON public.coinflips
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Users can update coinflips they're part of
CREATE POLICY "Users can update own coinflips"
  ON public.coinflips
  FOR UPDATE
  USING (
    creator_id = auth.uid() 
    OR joiner_id = auth.uid()
  );

-- Users can delete their own open coinflips (for cancellation)
CREATE POLICY "Users can delete own open coinflips"
  ON public.coinflips
  FOR DELETE
  USING (
    creator_id = auth.uid() 
    AND status = 'open'
  );

-- ============================================
-- 8. CREATE FUNCTION TO AUTO-CREATE USER PROFILE
-- ============================================
-- This function automatically creates a user profile when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- Your database is now ready for Token Gamble
-- Next steps:
-- 1. Copy your Project URL and anon key
-- 2. Add them to your .env.local file
-- 3. Start building!
