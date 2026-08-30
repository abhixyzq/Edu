-- ========================================================
-- EDUSTRIDE (NAINIX EDU) CLASS 12 PREP DATABASE SCHEMA
-- Target Engine: PostgreSQL / Supabase
-- ========================================================

-- 1. Create Profiles Table (Syncs with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  target_board TEXT DEFAULT 'CBSE Board (Class 12)',
  streak_days INT DEFAULT 1,
  xp_points INT DEFAULT 240,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  total_chapters INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects FOR SELECT USING (true);

-- 3. Create Chapters Table
CREATE TABLE IF NOT EXISTS public.chapters (
  id SERIAL PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  question_count INT DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Chapters
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are viewable by everyone" ON public.chapters FOR SELECT USING (true);

-- 4. Create Tests Table
CREATE TABLE IF NOT EXISTS public.tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL DEFAULT 30,
  total_questions INT NOT NULL DEFAULT 10,
  total_marks INT NOT NULL DEFAULT 40,
  passing_marks INT NOT NULL DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Tests
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tests are viewable by everyone" ON public.tests FOR SELECT USING (true);

-- 5. Create Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id SERIAL PRIMARY KEY,
  test_id TEXT REFERENCES public.tests(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INT NOT NULL, -- 0 for A, 1 for B, 2 for C, 3 for D
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);

-- 6. Create User Test Results Table
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

-- Enable RLS for User Test Results
ALTER TABLE public.user_test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own test results" ON public.user_test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own test results" ON public.user_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- SAMPLE DATA SEEDING
-- ========================================================
INSERT INTO public.subjects (id, title, category, icon, total_chapters) VALUES
('physics', 'Physics (Class 12)', 'Science Stream', 'bolt', 14),
('chemistry', 'Chemistry (Class 12)', 'Science Stream', 'science', 16),
('maths', 'Mathematics (Class 12)', 'Science Stream', 'functions', 13),
('biology', 'Biology (Class 12)', 'Science Stream', 'eco', 16),
('english', 'English Core (Class 12)', 'Language & Arts', 'menu_book')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tests (id, title, subject_id, duration_minutes, total_questions, total_marks, passing_marks) VALUES
('1', 'Electric Charges & Fields Mock Test', 'physics', 30, 10, 40, 14),
('2', 'Electrostatic Potential & Capacitance', 'physics', 25, 10, 40, 14),
('3', 'Organic Chemistry Functional Groups', 'chemistry', 30, 10, 40, 14),
('4', 'Calculus: Derivatives & Integrals', 'maths', 40, 10, 40, 14)
ON CONFLICT (id) DO NOTHING;
