-- ========================================================
-- NAINIXONE ADMIN & GAMIFICATION MIGRATION
-- Run this in Supabase SQL Editor if you already have the initial schema.sql
-- (If you are starting fresh, schema.sql has everything included)
-- ========================================================

-- 1. Ensure all columns exist on public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS class_level TEXT NOT NULL DEFAULT 'Class 12',
  ADD COLUMN IF NOT EXISTS max_hearts INT NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS inventory JSONB NOT NULL DEFAULT '{"streakFreeze":1,"infiniteHeartsPass":0,"doubleXpCount":0}'::jsonb,
  ADD COLUMN IF NOT EXISTS unlocked_nodes JSONB NOT NULL DEFAULT '["phy-1","phy-2","chem-1","math-1","bio-1","eng-1"]'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_nodes JSONB NOT NULL DEFAULT '{"phy-1":{"stars":3,"score":95,"completedAt":"2026-08-30"}}'::jsonb;

-- 2. Add admin_notes to questions
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT NULL;

-- 3. Add color and bg_color to subjects
ALTER TABLE public.subjects
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'text-[#0060ac]',
  ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT 'bg-[#0060ac]/10';

-- 4. Helper function: returns true if the calling user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. Auto user trigger (creates profile automatically when a user signs up)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    target_board,
    xp_points,
    gems,
    hearts,
    streak_days,
    is_admin
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Student'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'targetBoard', 'cbse'),
    320,
    150,
    5,
    1,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Update Row Level Security (RLS) policies

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users and admins can update profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users and admins can update profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());

-- Subjects
DROP POLICY IF EXISTS "Subjects are viewable by everyone" ON public.subjects;
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;

CREATE POLICY "Subjects are viewable by everyone"  ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can insert subjects"  ON public.subjects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update subjects"  ON public.subjects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete subjects"  ON public.subjects FOR DELETE USING (public.is_admin());

-- Chapters
DROP POLICY IF EXISTS "Chapters are viewable by everyone" ON public.chapters;
DROP POLICY IF EXISTS "Admins can insert chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can update chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can delete chapters" ON public.chapters;

CREATE POLICY "Chapters are viewable by everyone" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE USING (public.is_admin());

-- Tests
DROP POLICY IF EXISTS "Tests are viewable by everyone" ON public.tests;
DROP POLICY IF EXISTS "Admins can insert tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can update tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can delete tests" ON public.tests;

CREATE POLICY "Tests are viewable by everyone" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Admins can insert tests" ON public.tests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update tests" ON public.tests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete tests" ON public.tests FOR DELETE USING (public.is_admin());

-- Questions
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE USING (public.is_admin());

-- user_test_results
DROP POLICY IF EXISTS "Users can view their own test results" ON public.user_test_results;
DROP POLICY IF EXISTS "Users can insert their own test results" ON public.user_test_results;
DROP POLICY IF EXISTS "Users can view their own test results or admin all" ON public.user_test_results;
DROP POLICY IF EXISTS "Admins can view all test results" ON public.user_test_results;

CREATE POLICY "Users can view their own test results or admin all" ON public.user_test_results FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own test results" ON public.user_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Create Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp_points DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON public.chapters(subject_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_tests_subject ON public.tests(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_test ON public.questions(test_id, question_number);
CREATE INDEX IF NOT EXISTS idx_results_user ON public.user_test_results(user_id, attempted_at DESC);

-- ========================================================
-- AFTER RUNNING: Set your first admin user:
--   UPDATE public.profiles SET is_admin = true WHERE email = 'your@email.com';
-- ========================================================
