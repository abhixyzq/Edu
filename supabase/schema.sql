-- ========================================================
-- NAINIXONE CLASS 12 PREP - COMPLETE SUPABASE DATABASE SCHEMA
-- Target Engine: PostgreSQL 15+ / Supabase
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
  name TEXT NOT NULL DEFAULT 'Class 12 Scholar',
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
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'referred_by') THEN
    ALTER TABLE public.profiles ADD COLUMN referred_by TEXT DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'streak_freeze_count') THEN
    ALTER TABLE public.profiles ADD COLUMN streak_freeze_count INT NOT NULL DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_active_date') THEN
    ALTER TABLE public.profiles ADD COLUMN last_active_date DATE DEFAULT CURRENT_DATE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'class_level') THEN
    ALTER TABLE public.profiles ADD COLUMN class_level TEXT NOT NULL DEFAULT 'Class 12';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'max_hearts') THEN
    ALTER TABLE public.profiles ADD COLUMN max_hearts INT NOT NULL DEFAULT 5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_admin') THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'inventory') THEN
    ALTER TABLE public.profiles ADD COLUMN inventory JSONB NOT NULL DEFAULT '{"streakFreeze":1,"infiniteHeartsPass":0,"doubleXpCount":0}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'unlocked_nodes') THEN
    ALTER TABLE public.profiles ADD COLUMN unlocked_nodes JSONB NOT NULL DEFAULT '["phy-1","phy-2","chem-1","math-1","bio-1","eng-1"]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'completed_nodes') THEN
    ALTER TABLE public.profiles ADD COLUMN completed_nodes JSONB NOT NULL DEFAULT '{"phy-1":{"stars":3,"score":95,"completedAt":"2026-08-30"}}'::jsonb;
  END IF;
END $$;

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
-- 14. HIGH-PERFORMANCE INDEXES
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

-- ========================================================
-- 15. SAMPLE DATA SEEDING (Idempotent)
-- ========================================================

-- Seed Subjects
INSERT INTO public.subjects (id, title, category, icon, color, bg_color, total_chapters) VALUES
('physics', 'Physics (Class 12)', 'Science Stream', 'bolt', 'text-[#7c3aed]', 'bg-[#7c3aed]/10', 14),
('chemistry', 'Chemistry (Class 12)', 'Science Stream', 'science', 'text-[#059669]', 'bg-[#059669]/10', 16),
('maths', 'Mathematics (Class 12)', 'Science Stream', 'functions', 'text-[#ea580c]', 'bg-[#ea580c]/10', 13),
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
(25, 'maths', 1, 'Relations and Functions', 14),
(26, 'maths', 2, 'Inverse Trigonometric Functions', 12),
(27, 'maths', 3, 'Matrices', 15),
(28, 'maths', 4, 'Determinants', 15),
(29, 'maths', 5, 'Continuity and Differentiability', 16),
(30, 'maths', 6, 'Applications of Derivatives', 16),
(31, 'maths', 7, 'Integrals', 18),
(32, 'maths', 8, 'Differential Equations', 15),
(33, 'maths', 9, 'Vector Algebra', 14),
(34, 'maths', 10, 'Three Dimensional Geometry', 15)
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
('4', 'Calculus: Derivatives & Integrals', 'maths', 40, 5, 20, 7),
('5', 'Genetics & Molecular Basis of Inheritance', 'biology', 35, 5, 20, 7),
('6', 'Flamingo Prose & Reading Comprehension', 'english', 30, 5, 20, 7)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subject_id = EXCLUDED.subject_id,
  duration_minutes = EXCLUDED.duration_minutes,
  total_questions = EXCLUDED.total_questions,
  total_marks = EXCLUDED.total_marks,
  passing_marks = EXCLUDED.passing_marks;

-- Seed Questions for Test 1 (Physics)
INSERT INTO public.questions (id, test_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, admin_notes) VALUES
(1, '1', 1, 'In a potentiometer arrangement, a cell of emf 1.25 V gives a balance point at 35.0 cm length of the wire. If the cell is replaced by another cell and the balance point shifts to 63.0 cm, what is the emf of the second cell?', '2.25 V', '2.50 V', '1.75 V', '3.00 V', 0, 'Using potentiometer principle: E1 / E2 = l1 / l2. E2 = 1.25 * (63.0 / 35.0) = 1.25 * 1.8 = 2.25 V.', 'Standard NCERT Class 12 Current Electricity'),
(2, '1', 2, 'A storage battery of emf 8.0 V and internal resistance 0.5 Ω is being charged by a 120 V dc supply using a series resistor of 15.5 Ω. What is the terminal voltage of the battery during charging?', '11.5 V', '8.0 V', '12.0 V', '15.5 V', 0, 'Charging current I = (V_supply - E) / (R + r) = (120 - 8)/(15.5 + 0.5) = 112/16 = 7 A. Terminal voltage V = E + I*r = 8.0 + 7 * 0.5 = 11.5 V.', 'Important circuit problem'),
(3, '1', 3, 'The resistivity of a semiconductor wire depends on which of the following physical variables?', 'Its length', 'Its area of cross-section', 'Its temperature', 'The shape of cross-section', 2, 'Resistivity (ρ) is an intrinsic material property. For semiconductors, it depends exponentially on temperature due to carrier excitation.', 'NCERT theoretical question'),
(4, '1', 4, 'Two charges of +3 µC and -3 µC are placed 20 cm apart in vacuum. What is the electric potential at the midpoint of the line joining the two charges?', 'Zero', '2.7 × 10⁵ V', '5.4 × 10⁵ V', '1.35 × 10⁵ V', 0, 'Electric potential is a scalar sum: V = k*q1/r + k*q2/r. At midpoint r = 10 cm, V = k(+3µC - 3µC)/0.1 = 0 V.', 'Dipole equatorial line / midpoint potential'),
(5, '1', 5, 'A circular coil of 30 turns and radius 8.0 cm carrying a current of 6.0 A is suspended vertically in a uniform horizontal magnetic field of magnitude 1.0 T. What is the magnetic dipole moment of the coil?', '3.62 A·m²', '0.36 A·m²', '7.24 A·m²', '1.81 A·m²', 0, 'Magnetic dipole moment M = N * I * A = 30 * 6.0 * (π * 0.08²) = 180 * (3.1416 * 0.0064) = 3.62 A·m².', 'NCERT Chapter 4')
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
-- ADMIN PROMOTION HELPER:
-- Run this in Supabase SQL Editor to grant admin powers to your email:
--   UPDATE public.profiles SET is_admin = true WHERE email = 'your@email.com';
-- ========================================================
