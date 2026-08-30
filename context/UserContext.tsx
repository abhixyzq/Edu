'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface UserContextType {
  user: {
    id?: string;
    name: string;
    email: string;
    classLevel: string;
    streakDays: number;
    targetBoard: string;
    isLoggedIn: boolean;
  };
  setTargetBoard: (boardId: string) => void;
  incrementStreak: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, targetBoard?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    classLevel: 'Class 12',
    streakDays: 7,
    targetBoard: 'cbse',
    isLoggedIn: false,
  });

  // ─── On mount: restore session from localStorage + listen to Supabase auth state ───
  useEffect(() => {
    // 1. Restore from localStorage immediately (so AuthGuard doesn't flash)
    const storedAuth = localStorage.getItem('edustride_logged_in');
    const storedName = localStorage.getItem('edustride_user_name');
    const storedEmail = localStorage.getItem('edustride_user_email');
    const storedBoard = localStorage.getItem('edustride_user_board');

    if (storedAuth === 'true' && storedEmail) {
      setUser((prev) => ({
        ...prev,
        isLoggedIn: true,
        name: storedName || '',
        email: storedEmail,
        targetBoard: storedBoard || 'cbse',
      }));
    }

    if (!isSupabaseConfigured) return;

    // 2. Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndSyncProfile(session.user.id, session.user.email || '');
      }
    });

    // 3. Listen for auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchAndSyncProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        clearLocalSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Fetch profile from Supabase and sync state ───
  const fetchAndSyncProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle won't throw if row missing

      const name = profile?.name || email.split('@')[0] || 'Student';
      const board = profile?.target_board || 'cbse';
      const streak = profile?.streak_days || 7;

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = row not found (expected for new users)
        console.warn('[Auth] Profile fetch warning:', error.message);
      }

      persistLocalSession(name, email, board);
      setUser((prev) => ({
        ...prev,
        id: userId,
        name,
        email,
        targetBoard: board,
        streakDays: streak,
        isLoggedIn: true,
      }));
    } catch (err) {
      console.warn('[Auth] Profile sync error:', err);
    }
  };

  // ─── LocalStorage helpers ───
  const persistLocalSession = (name: string, email: string, board: string) => {
    localStorage.setItem('edustride_logged_in', 'true');
    localStorage.setItem('edustride_user_name', name);
    localStorage.setItem('edustride_user_email', email);
    localStorage.setItem('edustride_user_board', board);
  };

  const clearLocalSession = () => {
    localStorage.removeItem('edustride_logged_in');
    localStorage.removeItem('edustride_user_name');
    localStorage.removeItem('edustride_user_email');
    localStorage.removeItem('edustride_user_board');
    setUser((prev) => ({ ...prev, isLoggedIn: false, id: '', name: '', email: '' }));
  };

  // ─── SIGNUP ───
  const signup = async (name: string, email: string, password: string, targetBoard = 'cbse') => {
    if (!name.trim()) return { success: false, error: 'Name is required.' };
    if (!email.includes('@')) return { success: false, error: 'Invalid email address.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    try {
      if (!isSupabaseConfigured) {
        // Offline / dev mode: just persist locally
        persistLocalSession(name, email, targetBoard);
        setUser((prev) => ({ ...prev, name, email, targetBoard, isLoggedIn: true }));
        return { success: true };
      }

      // 1. Supabase Auth — create account
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name, targetBoard } },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      const userId = data?.user?.id;

      // 2. Insert profile row (auth trigger may handle this too, but we upsert for safety)
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          target_board: targetBoard,
        }, { onConflict: 'id' });
      }

      // 3. Persist locally + update state (onAuthStateChange will also fire)
      persistLocalSession(name.trim(), email.trim().toLowerCase(), targetBoard);
      setUser((prev) => ({
        ...prev,
        id: userId || '',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        targetBoard,
        isLoggedIn: true,
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed. Try again.' };
    }
  };

  // ─── LOGIN ───
  const login = async (email: string, password: string) => {
    if (!email.trim()) return { success: false, error: 'Email is required.' };
    if (!password) return { success: false, error: 'Password is required.' };

    try {
      if (!isSupabaseConfigured) {
        // Offline / dev mode: just persist locally
        const name = email.split('@')[0] || 'Student';
        persistLocalSession(name, email, 'cbse');
        setUser((prev) => ({ ...prev, name, email, isLoggedIn: true }));
        return { success: true };
      }

      // 1. Supabase Auth — sign in with email + password
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      const userId = data?.user?.id;
      if (userId) {
        await fetchAndSyncProfile(userId, data.user?.email || email);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Try again.' };
    }
  };

  // ─── LOGOUT ───
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    clearLocalSession();
  };

  const setTargetBoard = (boardId: string) => {
    setUser((prev) => ({ ...prev, targetBoard: boardId }));
    localStorage.setItem('edustride_user_board', boardId);
  };

  const incrementStreak = () => {
    setUser((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
  };

  return (
    <UserContext.Provider value={{ user, setTargetBoard, incrementStreak, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
