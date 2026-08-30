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
  login: (email: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string, targetBoard?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    id: '',
    name: 'Abhishek',
    email: 'abhishek@edustride.prep',
    classLevel: 'Class 12',
    streakDays: 7,
    targetBoard: 'cbse',
    isLoggedIn: false,
  });

  // Sync Supabase Auth & Profiles table
  useEffect(() => {
    // 1. LocalStorage Fallback Initialization
    const storedAuth = localStorage.getItem('edustride_logged_in');
    const storedName = localStorage.getItem('edustride_user_name');
    const storedEmail = localStorage.getItem('edustride_user_email');
    const storedBoard = localStorage.getItem('edustride_user_board');

    if (storedAuth === 'true') {
      setUser((prev) => ({
        ...prev,
        isLoggedIn: true,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
        targetBoard: storedBoard || prev.targetBoard,
      }));
    }

    // 2. Supabase Real-Time Auth Listener
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || '');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await fetchSupabaseProfile(session.user.id, session.user.email || '');
        } else if (_event === 'SIGNED_OUT') {
          clearLocalSession();
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchSupabaseProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const name = profile?.name || email.split('@')[0] || 'Abhishek';
      const board = profile?.target_board || 'cbse';

      persistLocalSession(true, name, email, board);

      setUser((prev) => ({
        ...prev,
        id: userId,
        name,
        email,
        targetBoard: board,
        streakDays: profile?.streak_days || prev.streakDays,
        isLoggedIn: true,
      }));
    } catch (err) {
      console.warn('Supabase profile fetch error, using cached session:', err);
    }
  };

  const persistLocalSession = (isLoggedIn: boolean, name: string, email: string, board: string) => {
    if (isLoggedIn) {
      localStorage.setItem('edustride_logged_in', 'true');
      localStorage.setItem('edustride_user_name', name);
      localStorage.setItem('edustride_user_email', email);
      localStorage.setItem('edustride_user_board', board);
    } else {
      clearLocalSession();
    }
  };

  const clearLocalSession = () => {
    localStorage.removeItem('edustride_logged_in');
    localStorage.removeItem('edustride_user_name');
    localStorage.removeItem('edustride_user_email');
    localStorage.removeItem('edustride_user_board');
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  };

  // Real Supabase Signup with Auth & Profiles Table Insert
  const signup = async (name: string, email: string, password = 'Password@123', targetBoard = 'cbse') => {
    try {
      if (isSupabaseConfigured) {
        // 1. Supabase Auth SignUp
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, targetBoard },
          },
        });

        if (error) {
          console.warn('Supabase Auth error, saving to local profile:', error.message);
        }

        const userId = data?.user?.id;

        // 2. Insert into Supabase 'profiles' table
        if (userId) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: userId,
            name,
            email,
            target_board: targetBoard,
          });

          if (profileError) {
            console.error('Error saving profile to Supabase:', profileError.message);
          }
        }
      }

      // Update State & LocalStorage
      persistLocalSession(true, name, email, targetBoard);
      setUser((prev) => ({
        ...prev,
        name,
        email,
        targetBoard,
        isLoggedIn: true,
      }));

      return { success: true };
    } catch (err: any) {
      console.error('Signup Exception:', err);
      return { success: false, error: err.message };
    }
  };

  // Real Supabase Login
  const login = async (email: string, name?: string) => {
    try {
      let userName = name || email.split('@')[0] || 'Abhishek';

      if (isSupabaseConfigured) {
        // Fetch profile from Supabase profiles table
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email);

        if (profiles && profiles.length > 0) {
          userName = profiles[0].name;
        } else {
          // Insert profile if doesn't exist yet
          await supabase.from('profiles').insert([
            { name: userName, email, target_board: 'cbse' }
          ]);
        }
      }

      persistLocalSession(true, userName, email, 'cbse');
      setUser((prev) => ({
        ...prev,
        name: userName,
        email,
        isLoggedIn: true,
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

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
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
