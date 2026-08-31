# Supabase Database Setup & Migration Guide

This directory contains the database schema scripts for **nainixOne (Class 12 Prep)**.

---

## 🚀 Quick Setup (1-Step Setup)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** (`/project/_/sql`).
3. Click **New Query**.
4. Copy the entire contents of [`schema.sql`](./schema.sql) and paste it into the editor.
5. Click **Run** (or press `Ctrl + Enter` / `Cmd + Enter`).

Everything will be set up automatically:
- ✅ **`profiles`** table with gamification state (XP, Gems, Hearts, Streak, Level, Inventory, Nodes).
- ✅ **Auth Hook Trigger (`on_auth_user_created`)** that automatically provisions user profiles on signup.
- ✅ **`subjects`**, **`chapters`**, **`tests`**, **`questions`**, **`user_test_results`**, **`bookmarks`**, **`user_quests`** tables.
- ✅ **Row Level Security (RLS)** configured for both public students and administrators.
- ✅ **Optimized indexes** for query performance.
- ✅ **Full seed data** for Class 12 Subjects (Physics, Chemistry, Maths, Biology, English, Hindi), chapters, and mock tests.

---

## 👑 Granting Administrator Access

To make any user an administrator (giving full access to `/admin` dashboard, question editor, subject/chapter managers, and analytics):

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

---

## ⚙️ Environment Variables Configuration

Make sure your `.env.local` file contains your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 🔄 Incremental Migration (`admin_migration.sql`)

If you previously executed an older version of `schema.sql` and just want to update existing tables with admin permissions and new columns without wiping data, run [`admin_migration.sql`](./admin_migration.sql).
