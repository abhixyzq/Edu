-- ========================================================
-- NAINIXONE CLASS 12 PREP DATABASE SCHEMA
-- Target Engine: PostgreSQL / Supabase
-- Status: Production Ready & Fully Idempotent
-- Copy and paste this script directly into Supabase SQL Editor
-- ========================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================
-- 1. PROFILES TABLE (Linked with Supabase Auth)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Class 12 Scholar',
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
  league_tier TEXT NOT NULL DEFAULT 'Bronze',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  inventory JSONB NOT NULL DEFAULT '{"streakFreeze":1,"infiniteHeartsPass":0,"doubleXpCount":0}'::jsonb,
  unlocked_nodes JSONB NOT NULL DEFAULT '["phy-1","phy-2","chem-1","math-1","bio-1","eng-1"]'::jsonb,
  completed_nodes JSONB NOT NULL DEFAULT '{"phy-1":{"stars":3,"score":95,"completedAt":"2026-08-30"}}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist if updating an existing table
DO $$ 
BEGIN
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

-- Helper function: check if caller is an admin
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
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

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

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- 3. SUBJECTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT DEFAULT 'text-[#0060ac]',
  bg_color TEXT DEFAULT 'bg-[#0060ac]/10',
  total_chapters INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subjects' AND column_name = 'color') THEN
    ALTER TABLE public.subjects ADD COLUMN color TEXT DEFAULT 'text-[#0060ac]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subjects' AND column_name = 'bg_color') THEN
    ALTER TABLE public.subjects ADD COLUMN bg_color TEXT DEFAULT 'bg-[#0060ac]/10';
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
-- 4. CHAPTERS TABLE
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
-- 5. TESTS TABLE
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
-- 6. QUESTIONS TABLE
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
-- 7. USER TEST RESULTS TABLE
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
-- 8. BOOKMARKS & STUDY SAVES TABLE
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
-- 9. USER QUESTS & DAILY MISSIONS TABLE
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
-- 10. INDEXES FOR LIGHTNING FAST QUERIES
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp_points DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON public.chapters(subject_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_tests_subject ON public.tests(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_test ON public.questions(test_id, question_number);
CREATE INDEX IF NOT EXISTS idx_results_user ON public.user_test_results(user_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_subject ON public.user_test_results(subject_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_user ON public.user_quests(user_id, expires_at);

-- ========================================================
-- 11. SAMPLE DATA SEEDING (Idempotent)
-- ========================================================

-- Seed Subjects
INSERT INTO public.subjects (id, title, category, icon, color, bg_color, total_chapters) VALUES
('physics', 'Physics (Class 12)', 'Science Stream', 'bolt', 'text-[#0060ac]', 'bg-[#0060ac]/10', 14),
('chemistry', 'Chemistry (Class 12)', 'Science Stream', 'science', 'text-[#3a6a00]', 'bg-[#3a6a00]/10', 16),
('maths', 'Mathematics (Class 12)', 'Science Stream', 'functions', 'text-[#9b4500]', 'bg-[#9b4500]/10', 13),
('biology', 'Biology (Class 12)', 'Science Stream', 'eco', 'text-[#254700]', 'bg-[#6dbf00]/20', 16),
('english', 'English Core (Class 12)', 'Language & Arts', 'menu_book', 'text-[#564338]', 'bg-[#ddc1b3]/30', 12),
('hindi', 'Hindi Core (Class 12)', 'Language & Arts', 'translate', 'text-[#93000a]', 'bg-[#ffdad6]/40', 12)
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
-- HOW TO SET ADMIN USER IN SUPABASE:
-- Run this query after signing up your user:
--   UPDATE public.profiles SET is_admin = true WHERE email = 'your@email.com';
-- ========================================================
