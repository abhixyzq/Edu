-- ========================================================
-- NAINIXONE - COMPLETE ALL-CLASSES & BOARD PREP SUPABASE DATABASE SCHEMA
-- Target Engine: PostgreSQL 15+ / Supabase (Classes 9th to 12th & Competitive Prep)
-- Status: 100% Production Ready, Fully Idempotent & Migration-Safe
-- Copy and paste this script directly into Supabase SQL Editor
-- ========================================================

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================
-- 1. PROFILES TABLE (Core Student Profiles & Gamification)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Scholar',
  username TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT DEFAULT NULL,
  target_board TEXT NOT NULL DEFAULT 'cbse',
  class_level TEXT NOT NULL DEFAULT 'Class 12',
  streak_days INT NOT NULL DEFAULT 1,
  xp_points INT NOT NULL DEFAULT 320,
  hearts INT NOT NULL DEFAULT 5,
  max_hearts INT NOT NULL DEFAULT 5,
  gems INT NOT NULL DEFAULT 150,
  level INT NOT NULL DEFAULT 1,
  league_tier TEXT NOT NULL DEFAULT 'Starter League',
  referred_by TEXT DEFAULT NULL,
  streak_freeze_count INT NOT NULL DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  inventory JSONB NOT NULL DEFAULT '{"streakFreeze":1,"infiniteHeartsPass":0,"doubleXpCount":0}'::jsonb,
  unlocked_nodes JSONB NOT NULL DEFAULT '["phy-1","phy-2","chem-1","math-1","bio-1","eng-1"]'::jsonb,
  completed_nodes JSONB NOT NULL DEFAULT '{"phy-1":{"stars":3,"score":95,"completedAt":"2026-08-30"}}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Idempotent Column Additions for Existing Databases
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS target_board TEXT NOT NULL DEFAULT 'cbse',
  ADD COLUMN IF NOT EXISTS class_level TEXT NOT NULL DEFAULT 'Class 12',
  ADD COLUMN IF NOT EXISTS streak_days INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS xp_points INT NOT NULL DEFAULT 320,
  ADD COLUMN IF NOT EXISTS hearts INT NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS max_hearts INT NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS gems INT NOT NULL DEFAULT 150,
  ADD COLUMN IF NOT EXISTS level INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS league_tier TEXT NOT NULL DEFAULT 'Starter League',
  ADD COLUMN IF NOT EXISTS referred_by TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS streak_freeze_count INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS inventory JSONB NOT NULL DEFAULT '{"streakFreeze":1,"infiniteHeartsPass":0,"doubleXpCount":0}'::jsonb,
  ADD COLUMN IF NOT EXISTS unlocked_nodes JSONB NOT NULL DEFAULT '["phy-1","phy-2","chem-1","math-1","bio-1","eng-1"]'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_nodes JSONB NOT NULL DEFAULT '{"phy-1":{"stars":3,"score":95,"completedAt":"2026-08-30"}}'::jsonb;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile or admins view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users and admins can update profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users and admins can update profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ========================================================
-- 2. AUTOMATIC PROFILE CREATION TRIGGER (Supabase Auth Hook)
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_raw_username TEXT;
  v_clean_username TEXT;
  v_referrer_code TEXT;
BEGIN
  -- Extract username or generate a clean handle from email/metadata
  v_raw_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  v_clean_username := lower(regexp_replace(v_raw_username, '[^a-z0-9_]', '', 'g'));
  
  -- Extract referral handle if present
  v_referrer_code := NEW.raw_user_meta_data->>'ref';

  INSERT INTO public.profiles (
    id,
    name,
    username,
    email,
    target_board,
    xp_points,
    gems,
    hearts,
    streak_days,
    referred_by,
    is_admin
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Student'),
    v_clean_username,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'targetBoard', 'cbse'),
    320,
    -- If user was referred, grant 150 + 50 = 200 initial gems!
    CASE WHEN v_referrer_code IS NOT NULL AND v_referrer_code <> '' THEN 200 ELSE 150 END,
    5,
    1,
    v_referrer_code,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

  -- If referred, log the referral reward and award 50 gems to referrer
  IF v_referrer_code IS NOT NULL AND v_referrer_code <> '' THEN
    UPDATE public.profiles
    SET gems = gems + 50
    WHERE username = lower(v_referrer_code);

    INSERT INTO public.referrals (referrer_username, referee_id, reward_gems)
    VALUES (lower(v_referrer_code), NEW.id, 50)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- 3. FRIENDSHIPS / FOLLOWS TABLE (Study Peer Connections)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'accepted', -- 'accepted', 'pending'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can create friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can delete friendships" ON public.friendships;

CREATE POLICY "Users can view their friendships" 
  ON public.friendships FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" 
  ON public.friendships FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete friendships" 
  ON public.friendships FOR DELETE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ========================================================
-- 4. REFERRALS TABLE (Refer & Earn 50 Free Gems Tracker)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_username TEXT NOT NULL,
  referee_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reward_gems INT NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view referrals" ON public.referrals;
CREATE POLICY "Users can view referrals" 
  ON public.referrals FOR SELECT 
  USING (true);

-- ========================================================
-- 5. CHEERS / HIGH-FIVES TABLE (Celebratory Micro-interactions)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.user_cheers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  cheer_emoji TEXT NOT NULL DEFAULT '👏',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_cheers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view cheers" ON public.user_cheers;
DROP POLICY IF EXISTS "Users can send cheers" ON public.user_cheers;

CREATE POLICY "Users can view cheers" 
  ON public.user_cheers FOR SELECT 
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

CREATE POLICY "Users can send cheers" 
  ON public.user_cheers FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- ========================================================
-- 6. LIVE ACTIVITY FEED TABLE (Peer Milestones)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL, -- 'mock_completed', 'league_promoted', 'streak_milestone', 'quest_completed'
  action_title TEXT NOT NULL,
  action_detail TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'bolt',
  color TEXT NOT NULL DEFAULT '#7c3aed',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Activity feed is viewable by everyone" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can insert activity events" ON public.activity_feed;

CREATE POLICY "Activity feed is viewable by everyone" 
  ON public.activity_feed FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert activity events" 
  ON public.activity_feed FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 7. SUBJECTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT DEFAULT 'text-[#7c3aed]',
  bg_color TEXT DEFAULT 'bg-[#7c3aed]/10',
  total_chapters INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subjects' AND column_name = 'color') THEN
    ALTER TABLE public.subjects ADD COLUMN color TEXT DEFAULT 'text-[#7c3aed]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subjects' AND column_name = 'bg_color') THEN
    ALTER TABLE public.subjects ADD COLUMN bg_color TEXT DEFAULT 'bg-[#7c3aed]/10';
  END IF;
END $$;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Subjects are viewable by everyone" ON public.subjects;
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;

CREATE POLICY "Subjects are viewable by everyone" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (public.is_admin());

-- ========================================================
-- 8. CHAPTERS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.chapters (
  id SERIAL PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  question_count INT DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Chapters are viewable by everyone" ON public.chapters;
DROP POLICY IF EXISTS "Admins can insert chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can update chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can delete chapters" ON public.chapters;

CREATE POLICY "Chapters are viewable by everyone" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE USING (public.is_admin());

-- ========================================================
-- 9. TESTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  total_questions INT NOT NULL DEFAULT 10,
  total_marks INT NOT NULL DEFAULT 40,
  passing_marks INT NOT NULL DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tests are viewable by everyone" ON public.tests;
DROP POLICY IF EXISTS "Admins can insert tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can update tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can delete tests" ON public.tests;

CREATE POLICY "Tests are viewable by everyone" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Admins can insert tests" ON public.tests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update tests" ON public.tests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete tests" ON public.tests FOR DELETE USING (public.is_admin());

-- ========================================================
-- 10. QUESTIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id SERIAL PRIMARY KEY,
  test_id TEXT REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INT NOT NULL, -- 0 for A, 1 for B, 2 for C, 3 for D
  explanation TEXT NOT NULL,
  admin_notes TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'questions' AND column_name = 'admin_notes') THEN
    ALTER TABLE public.questions ADD COLUMN admin_notes TEXT DEFAULT NULL;
  END IF;
END $$;

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE USING (public.is_admin());

-- ========================================================
-- 11. USER TEST RESULTS TABLE (Mock Exam Analytics)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.user_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  test_id TEXT REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  test_title TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  score INT NOT NULL,
  total_marks INT NOT NULL,
  correct_count INT NOT NULL,
  incorrect_count INT NOT NULL,
  skipped_count INT NOT NULL,
  accuracy_percent NUMERIC(5,2) NOT NULL,
  time_taken_seconds INT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own test results" ON public.user_test_results;
DROP POLICY IF EXISTS "Users can insert their own test results" ON public.user_test_results;
DROP POLICY IF EXISTS "Admins can view all test results" ON public.user_test_results;
DROP POLICY IF EXISTS "Users can view their own test results or admin all" ON public.user_test_results;

CREATE POLICY "Users can view their own test results or admin all" 
  ON public.user_test_results FOR SELECT 
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own test results" 
  ON public.user_test_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 12. BOOKMARKS & STUDY SAVES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  question_id INT REFERENCES public.questions(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage their own bookmarks" 
  ON public.bookmarks FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 13. USER QUESTS & DAILY MISSIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_key TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'star',
  current_count INT NOT NULL DEFAULT 0,
  target_count INT NOT NULL DEFAULT 1,
  reward_xp INT NOT NULL DEFAULT 20,
  reward_gems INT NOT NULL DEFAULT 10,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '1 day') NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own quests" ON public.user_quests;
CREATE POLICY "Users can manage their own quests" 
  ON public.user_quests FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 14. SUPABASE STORAGE BUCKETS & POLICIES (Avatars & Files)
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' OR bucket_id = 'attachments');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- ========================================================
-- 15. RPC FUNCTIONS (Leaderboards & Admin Promotion)
-- ========================================================

-- Fast ranked leaderboard function
CREATE OR REPLACE FUNCTION public.get_leaderboard(p_limit INT DEFAULT 50)
RETURNS TABLE (
  rank BIGINT,
  id UUID,
  name TEXT,
  username TEXT,
  avatar_url TEXT,
  xp_points INT,
  streak_days INT,
  league_tier TEXT,
  target_board TEXT
) AS $$
  SELECT 
    ROW_NUMBER() OVER (ORDER BY p.xp_points DESC, p.streak_days DESC) AS rank,
    p.id,
    p.name,
    p.username,
    p.avatar_url,
    p.xp_points,
    p.streak_days,
    p.league_tier,
    p.target_board
  FROM public.profiles p
  ORDER BY p.xp_points DESC, p.streak_days DESC
  LIMIT p_limit;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ========================================================
-- 16. HIGH-PERFORMANCE INDEXES
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_board ON public.profiles(target_board);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_username);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON public.chapters(subject_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_tests_subject ON public.tests(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_test ON public.questions(test_id, question_number);
CREATE INDEX IF NOT EXISTS idx_results_user ON public.user_test_results(user_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_subject ON public.user_test_results(subject_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_user ON public.user_quests(user_id, expires_at);

-- Enable Realtime for live peer feeds & gamification
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profiles') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'activity_feed') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_feed;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_cheers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_cheers;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Realtime publication might not exist in all self-hosted environments
END $$;

-- ========================================================
-- 17. COMPLETE ALL-SUBJECTS SAMPLE SEEDING (Idempotent)
-- ========================================================

-- Seed All 6 Class 12 Core Subjects
INSERT INTO public.subjects (id, title, category, icon, color, bg_color, total_chapters) VALUES
('physics', 'Physics (Class 12)', 'Science Stream', 'bolt', 'text-[#7c3aed]', 'bg-[#7c3aed]/10', 14),
('chemistry', 'Chemistry (Class 12)', 'Science Stream', 'science', 'text-[#059669]', 'bg-[#059669]/10', 16),
('mathematics', 'Mathematics (Class 12)', 'Science Stream', 'functions', 'text-[#ea580c]', 'bg-[#ea580c]/10', 13),
('maths', 'Mathematics (Alias)', 'Science Stream', 'functions', 'text-[#ea580c]', 'bg-[#ea580c]/10', 13),
('biology', 'Biology (Class 12)', 'Science Stream', 'eco', 'text-[#16a34a]', 'bg-[#16a34a]/10', 16),
('english', 'English Core (Class 12)', 'Language & Arts', 'menu_book', 'text-[#475569]', 'bg-[#475569]/10', 12),
('hindi', 'Hindi Core (Class 12)', 'Language & Arts', 'translate', 'text-[#dc2626]', 'bg-[#dc2626]/10', 12)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  total_chapters = EXCLUDED.total_chapters;

-- Seed Chapters
INSERT INTO public.chapters (id, subject_id, chapter_number, title, question_count) VALUES
(1, 'physics', 1, 'Electric Charges and Fields', 15),
(2, 'physics', 2, 'Electrostatic Potential and Capacitance', 15),
(3, 'physics', 3, 'Current Electricity', 15),
(4, 'physics', 4, 'Moving Charges and Magnetism', 15),
(5, 'physics', 5, 'Magnetism and Matter', 12),
(6, 'physics', 6, 'Electromagnetic Induction', 15),
(7, 'physics', 7, 'Alternating Current', 14),
(8, 'physics', 8, 'Electromagnetic Waves', 10),
(9, 'physics', 9, 'Ray Optics and Optical Instruments', 18),
(10, 'physics', 10, 'Wave Optics', 15),
(11, 'physics', 11, 'Dual Nature of Radiation and Matter', 14),
(12, 'physics', 12, 'Atoms', 12),
(13, 'physics', 13, 'Nuclei', 12),
(14, 'physics', 14, 'Semiconductor Electronics', 16),
(15, 'chemistry', 1, 'Solutions', 15),
(16, 'chemistry', 2, 'Electrochemistry', 16),
(17, 'chemistry', 3, 'Chemical Kinetics', 15),
(18, 'chemistry', 4, 'd- and f-Block Elements', 14),
(19, 'chemistry', 5, 'Coordination Compounds', 15),
(20, 'chemistry', 6, 'Haloalkanes and Haloarenes', 15),
(21, 'chemistry', 7, 'Alcohols, Phenols and Ethers', 15),
(22, 'chemistry', 8, 'Aldehydes, Ketones and Carboxylic Acids', 16),
(23, 'chemistry', 9, 'Amines', 14),
(24, 'chemistry', 10, 'Biomolecules', 12),
(25, 'mathematics', 1, 'Relations and Functions', 14),
(26, 'mathematics', 2, 'Inverse Trigonometric Functions', 12),
(27, 'mathematics', 3, 'Matrices', 15),
(28, 'mathematics', 4, 'Determinants', 15),
(29, 'mathematics', 5, 'Continuity and Differentiability', 16),
(30, 'mathematics', 6, 'Applications of Derivatives', 16),
(31, 'mathematics', 7, 'Integrals', 18),
(32, 'mathematics', 8, 'Differential Equations', 15),
(33, 'mathematics', 9, 'Vector Algebra', 14),
(34, 'mathematics', 10, 'Three Dimensional Geometry', 15),
(35, 'biology', 1, 'Sexual Reproduction in Flowering Plants', 16),
(36, 'biology', 2, 'Human Reproduction', 16),
(37, 'biology', 3, 'Reproductive Health', 12),
(38, 'biology', 4, 'Principles of Inheritance and Variation', 18),
(39, 'biology', 5, 'Molecular Basis of Inheritance', 18),
(40, 'english', 1, 'The Last Lesson (Flamingo)', 12),
(41, 'english', 2, 'Lost Spring (Flamingo)', 12),
(42, 'english', 3, 'Deep Water (Flamingo)', 12),
(43, 'hindi', 1, 'Aatmparichay (Harivansh Rai Bachchan)', 12),
(44, 'hindi', 2, 'Patang (Alok Dhanwa)', 12)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  chapter_number = EXCLUDED.chapter_number,
  title = EXCLUDED.title,
  question_count = EXCLUDED.question_count;

-- Seed Tests
INSERT INTO public.tests (id, title, subject_id, duration_minutes, total_questions, total_marks, passing_marks) VALUES
('1', 'Electric Charges & Fields Mock Test', 'physics', 30, 5, 20, 7),
('2', 'Electrostatic Potential & Capacitance', 'physics', 25, 5, 20, 7),
('3', 'Organic Chemistry Functional Groups', 'chemistry', 30, 5, 20, 7),
('4', 'Calculus: Derivatives & Integrals', 'mathematics', 40, 5, 20, 7),
('5', 'Genetics & Molecular Basis of Inheritance', 'biology', 35, 5, 20, 7),
('6', 'Flamingo Prose & Reading Comprehension', 'english', 30, 5, 20, 7)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subject_id = EXCLUDED.subject_id,
  duration_minutes = EXCLUDED.duration_minutes,
  total_questions = EXCLUDED.total_questions,
  total_marks = EXCLUDED.total_marks,
  passing_marks = EXCLUDED.passing_marks;

-- Seed Questions for Test 1 (Physics - Current Electricity & Potentiometer)
INSERT INTO public.questions (id, test_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, admin_notes) VALUES
(1, '1', 1, 'In a potentiometer arrangement, a cell of emf 1.25 V gives a balance point at 35.0 cm length of the wire. If the cell is replaced by another cell and the balance point shifts to 63.0 cm, what is the emf of the second cell?', '2.25 V', '2.50 V', '1.75 V', '3.00 V', 0, 'Using potentiometer principle: E1 / E2 = l1 / l2. E2 = 1.25 * (63.0 / 35.0) = 1.25 * 1.8 = 2.25 V.', 'Standard NCERT Class 12 Current Electricity'),
(2, '1', 2, 'A storage battery of emf 8.0 V and internal resistance 0.5 Ω is being charged by a 120 V dc supply using a series resistor of 15.5 Ω. What is the terminal voltage of the battery during charging?', '11.5 V', '8.0 V', '12.0 V', '15.5 V', 0, 'Charging current I = (V_supply - E) / (R + r) = (120 - 8)/(15.5 + 0.5) = 112/16 = 7 A. Terminal voltage V = E + I*r = 8.0 + 7 * 0.5 = 11.5 V.', 'Important circuit problem'),
(3, '1', 3, 'The resistivity of a semiconductor wire depends on which of the following physical variables?', 'Its length', 'Its area of cross-section', 'Its temperature', 'The shape of cross-section', 2, 'Resistivity (ρ) is an intrinsic material property. For semiconductors, it depends exponentially on temperature due to carrier excitation.', 'NCERT theoretical question'),
(4, '1', 4, 'Two charges of +3 µC and -3 µC are placed 20 cm apart in vacuum. What is the electric potential at the midpoint of the line joining the two charges?', 'Zero', '2.7 × 10⁵ V', '5.4 × 10⁵ V', '1.35 × 10⁵ V', 0, 'Electric potential is a scalar sum: V = k*q1/r + k*q2/r. At midpoint r = 10 cm, V = k(+3µC - 3µC)/0.1 = 0 V.', 'Dipole equatorial line / midpoint potential'),
(5, '1', 5, 'A circular coil of 30 turns and radius 8.0 cm carrying a current of 6.0 A is suspended vertically in a uniform horizontal magnetic field of magnitude 1.0 T. What is the magnetic dipole moment of the coil?', '3.62 A·m²', '0.36 A·m²', '7.24 A·m²', '1.81 A·m²', 0, 'Magnetic dipole moment M = N * I * A = 30 * 6.0 * (π * 0.08²) = 180 * (3.1416 * 0.0064) = 3.62 A·m².', 'NCERT Chapter 4'),

-- Seed Questions for Test 2 (Physics - Electrostatics & Capacitance)
(6, '2', 1, 'A 600 pF capacitor is charged by a 200 V supply. It is then disconnected from the supply and connected to another uncharged 600 pF capacitor. How much electrostatic energy is lost in the process?', '6.0 × 10⁻⁶ J', '12.0 × 10⁻⁶ J', '3.0 × 10⁻⁶ J', 'Zero', 0, 'Energy loss ΔU = 0.5 * (C1 * C2 / (C1 + C2)) * (V1 - V2)² = 0.5 * (600 * 600 / 1200) * 10⁻¹² * (200 - 0)² = 150 * 10⁻¹² * 40000 = 6.0 × 10⁻⁶ J.', 'Capacitor energy sharing problem'),
(7, '2', 2, 'What is the capacitance of a parallel plate capacitor if the area of each plate is 6 × 10⁻³ m² and the distance between plates is 3 mm in air? (ε₀ = 8.85 × 10⁻¹² F/m)', '17.7 pF', '35.4 pF', '8.85 pF', '1.77 pF', 0, 'C = ε₀ * A / d = (8.854 × 10⁻¹² * 6 × 10⁻³) / (3 × 10⁻³) = 17.7 × 10⁻¹² F = 17.7 pF.', 'Formula: C = ε0*A/d'),
(8, '2', 3, 'When a dielectric slab of dielectric constant K is inserted completely between the plates of an isolated charged capacitor, the electrostatic potential difference across the plates:', 'Increases by factor K', 'Decreases by factor K', 'Remains unchanged', 'Becomes zero', 1, 'Since the capacitor is isolated, charge Q remains constant. Capacitance becomes K*C0, therefore voltage V = Q/(K*C0) = V0/K (decreases by factor K).', 'Dielectric theory'),

-- Seed Questions for Test 3 (Chemistry - Solutions & Kinetics)
(9, '3', 1, 'Which colligative property is widely preferred for determining the molar mass of polymers, proteins, and biomolecules?', 'Elevation in boiling point', 'Depression in freezing point', 'Osmotic pressure', 'Relative lowering of vapour pressure', 2, 'Osmotic pressure measurement is carried out at room temperature and the molarity of the solution is used instead of molality. It provides significant values even for dilute macromolecular solutions.', 'Class 12 Solutions NCERT'),
(10, '3', 2, 'The rate constant of a first order reaction is 0.005 min⁻¹. What is its half-life (t₁/₂)?', '138.6 min', '69.3 min', '277.2 min', '13.86 min', 0, 'For first order reaction, t₁/₂ = 0.693 / k = 0.693 / 0.005 = 138.6 min.', 'Chemical Kinetics rate calculation'),

-- Seed Questions for Test 4 (Mathematics - Calculus)
(11, '4', 1, 'What is the derivative of f(x) = sin⁻¹(2x / (1 + x²)) with respect to x for |x| < 1?', '2 / (1 + x²)', '1 / (1 + x²)', '2x / (1 + x²)', '-2 / (1 + x²)', 0, 'Substitute x = tan θ, then 2x/(1+x²) = sin(2θ). So f(x) = 2θ = 2 tan⁻¹(x). Derivative d/dx [2 tan⁻¹(x)] = 2 / (1 + x²).', 'Standard inverse trigonometric substitution'),
(12, '4', 2, 'Evaluate the definite integral ∫ from 0 to π/2 of (sin⁴ x / (sin⁴ x + cos⁴ x)) dx:', 'π / 4', 'π / 2', 'π', '0', 0, 'Using property ∫_0^a f(x)dx = ∫_0^a f(a-x)dx, I + I = ∫_0^(π/2) 1 dx = π/2 => 2I = π/2 => I = π/4.', 'Classic King Property of Definite Integrals'),

-- Seed Questions for Test 5 (Biology - Genetics)
(13, '5', 1, 'Which principle of Mendelian inheritance cannot be applied to genes that exhibit complete genetic linkage on the same chromosome?', 'Law of Segregation', 'Law of Dominance', 'Law of Independent Assortment', 'Law of Purity of Gametes', 2, 'The Law of Independent Assortment applies only to genes located on different non-homologous chromosomes or far apart on the same chromosome.', 'Mendelian Genetics'),

-- Seed Questions for Test 6 (English Core - Flamingo)
(14, '6', 1, 'In the story "The Last Lesson" by Alphonse Daudet, what did M. Hamel write on the blackboard in large letters at the conclusion of his class?', '"Vive La France!"', '"Adieu Mes Amis"', '"Courage et Honneur"', '"Liberté, Égalité, Fraternité"', 0, 'At the end of the lesson, M. Hamel turned to the blackboard, took a piece of chalk, and wrote as large as he could: "Vive La France!" (Long Live France!).', 'Chapter 1 Flamingo')
ON CONFLICT (id) DO UPDATE SET
  test_id = EXCLUDED.test_id,
  question_number = EXCLUDED.question_number,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;

-- Adjust sequence for questions and chapters serial IDs
SELECT setval(pg_get_serial_sequence('public.chapters', 'id'), COALESCE((SELECT MAX(id) FROM public.chapters), 1));
SELECT setval(pg_get_serial_sequence('public.questions', 'id'), COALESCE((SELECT MAX(id) FROM public.questions), 1));

-- ========================================================
-- ADMIN PROMOTION INSTRUCTIONS:
-- To grant administrator privileges to any user account:
--   UPDATE public.profiles SET is_admin = true WHERE email = 'your-email@example.com';
-- ========================================================
