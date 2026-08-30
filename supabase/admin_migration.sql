-- ========================================================
-- EDUSTRIDE ADMIN MIGRATION
-- Run this in Supabase SQL Editor AFTER the base schema.sql
-- ========================================================

-- 1. Add is_admin column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- 2. Add admin_notes to questions (optional editorial notes)
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT NULL;

-- 3. Helper function: returns true if the calling user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ========================================================
-- ADMIN RLS POLICIES
-- Admins can INSERT / UPDATE / DELETE on content tables.
-- ========================================================

-- Subjects
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;

CREATE POLICY "Admins can insert subjects"  ON public.subjects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update subjects"  ON public.subjects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete subjects"  ON public.subjects FOR DELETE USING (public.is_admin());

-- Chapters
DROP POLICY IF EXISTS "Admins can insert chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can update chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can delete chapters" ON public.chapters;

CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE USING (public.is_admin());

-- Tests
DROP POLICY IF EXISTS "Admins can insert tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can update tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can delete tests" ON public.tests;

CREATE POLICY "Admins can insert tests" ON public.tests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update tests" ON public.tests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete tests" ON public.tests FOR DELETE USING (public.is_admin());

-- Questions
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE USING (public.is_admin());

-- Profiles: admins can view & update all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"  ON public.profiles FOR SELECT USING (public.is_admin() OR auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin() OR auth.uid() = id);

-- user_test_results: admins can view all results
DROP POLICY IF EXISTS "Admins can view all test results" ON public.user_test_results;
CREATE POLICY "Admins can view all test results" ON public.user_test_results FOR SELECT USING (public.is_admin() OR auth.uid() = user_id);

-- ========================================================
-- AFTER RUNNING: Set your first admin manually:
--   UPDATE public.profiles SET is_admin = true WHERE email = 'your@email.com';
-- ========================================================
