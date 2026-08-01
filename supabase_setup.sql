-- =========================================================================
-- REDJOB SUPABASE PRODUCTION DATABASE SCHEMA & SECURITY SCRIPT
-- Copy and run this entire script in your Supabase SQL Editor:
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- =========================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro')),
  credits_remaining INT DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE JOB SCANS TABLE
CREATE TABLE IF NOT EXISTS public.job_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT,
  company_name TEXT,
  score INT NOT NULL,
  summary TEXT NOT NULL,
  flags JSONB DEFAULT '[]'::jsonb,
  signals JSONB DEFAULT '[]'::jsonb,
  resume_match_score INT,
  full_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure full_data column exists on pre-existing tables
ALTER TABLE public.job_scans ADD COLUMN IF NOT EXISTS full_data JSONB DEFAULT '{}'::jsonb;

-- 4. CREATE INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_job_scans_user_id ON public.job_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_job_scans_created_at ON public.job_scans(created_at DESC);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_scans ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 7. RLS POLICIES FOR JOB SCANS
DROP POLICY IF EXISTS "Users can view own job scans" ON public.job_scans;
CREATE POLICY "Users can view own job scans"
  ON public.job_scans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own job scans" ON public.job_scans;
CREATE POLICY "Users can insert own job scans"
  ON public.job_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own job scans" ON public.job_scans;
CREATE POLICY "Users can delete own job scans"
  ON public.job_scans FOR DELETE
  USING (auth.uid() = user_id);

-- 8. AUTOMATIC NEW USER PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier, credits_remaining)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'free',
    3
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- SUCCESS: Your Supabase database is now 100% production ready!
-- =========================================================================
