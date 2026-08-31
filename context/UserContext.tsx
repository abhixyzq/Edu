'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { playHeartCrack, playGemDing, playLevelUpFanfare, setSoundMuted, getSoundMuted } from '@/lib/soundEffects';

export interface CompletedNodeData {
  stars: number;
  score: number;
  completedAt: string;
}

export interface UserInventory {
  streakFreeze: number;
  infiniteHeartsPass: number;
  doubleXpCount: number;
}

export interface UserGamifiedState {
  id?: string;
  name: string;
  email: string;
  classLevel: string;
  streakDays: number;
  targetBoard: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  hearts: number;
  maxHearts: number;
  infiniteHeartsUntil: number | null; // timestamp ms
  gems: number;
  xp: number;
  level: number;
  leagueTier: 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Diamond';
  unlockedNodes: string[];
  completedNodes: Record<string, CompletedNodeData>;
  inventory: UserInventory;
  soundMuted: boolean;
}

interface UserContextType {
  user: UserGamifiedState;
  setTargetBoard: (boardId: string) => void;
  incrementStreak: () => void;
  addXP: (amount: number) => { newXP: number; leveledUp: boolean; newLevel: number };
  addGems: (amount: number) => void;
  deductHeart: () => boolean; // returns false if ran out of hearts
  refillHearts: () => void;
  activateInfiniteHearts: (durationMinutes: number) => void;
  completeNode: (nodeId: string, stars: number, score: number, nextNodeId?: string) => void;
  buyShopItem: (itemId: 'streak_freeze' | 'heart_refill' | 'infinite_hearts' | 'double_xp', costGems: number) => boolean;
  toggleSound: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, targetBoard?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const DEFAULT_USER: UserGamifiedState = {
  id: '',
  name: 'Class 12 Scholar',
  email: '',
  classLevel: 'Class 12',
  streakDays: 7,
  targetBoard: 'cbse',
  isLoggedIn: false,
  isAdmin: false,
  hearts: 5,
  maxHearts: 5,
  infiniteHeartsUntil: null,
  gems: 150,
  xp: 320,
  level: 3,
  leagueTier: 'Silver',
  unlockedNodes: ['phy-1', 'phy-2', 'chem-1', 'math-1', 'bio-1', 'eng-1'],
  completedNodes: {
    'phy-1': { stars: 3, score: 95, completedAt: '2026-08-30' },
  },
  inventory: {
    streakFreeze: 1,
    infiniteHeartsPass: 0,
    doubleXpCount: 0,
  },
  soundMuted: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserGamifiedState>(DEFAULT_USER);

  // ─── On Mount: Restore state from localStorage + sync Supabase ───
  useEffect(() => {
    // 1. Restore local storage
    const storedAuth = localStorage.getItem('edustride_logged_in');
    const storedName = localStorage.getItem('edustride_user_name');
    const storedEmail = localStorage.getItem('edustride_user_email');
    const storedBoard = localStorage.getItem('edustride_user_board');
    const storedXP = localStorage.getItem('edustride_user_xp');
    const storedGems = localStorage.getItem('edustride_user_gems');
    const storedHearts = localStorage.getItem('edustride_user_hearts');
    const storedNodes = localStorage.getItem('edustride_unlocked_nodes');
    const storedCompleted = localStorage.getItem('edustride_completed_nodes');
    const storedInv = localStorage.getItem('edustride_inventory');

    const soundMuted = getSoundMuted();

    setUser((prev) => {
      const xpVal = storedXP ? parseInt(storedXP, 10) : prev.xp;
      const levelVal = Math.floor(xpVal / 100) + 1;
      return {
        ...prev,
        isLoggedIn: storedAuth === 'true' && !!storedEmail,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
        targetBoard: storedBoard || prev.targetBoard,
        xp: xpVal,
        level: levelVal,
        gems: storedGems ? parseInt(storedGems, 10) : prev.gems,
        hearts: storedHearts ? parseInt(storedHearts, 10) : prev.hearts,
        unlockedNodes: storedNodes ? JSON.parse(storedNodes) : prev.unlockedNodes,
        completedNodes: storedCompleted ? JSON.parse(storedCompleted) : prev.completedNodes,
        inventory: storedInv ? JSON.parse(storedInv) : prev.inventory,
        soundMuted,
      };
    });

    if (!isSupabaseConfigured) return;

    // 2. Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndSyncProfile(session.user.id, session.user.email || '');
      }
    });

    // 3. Listen to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchAndSyncProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        clearLocalSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Sync Supabase Profile ───
  const fetchAndSyncProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const name = profile?.name || email.split('@')[0] || 'Student';
      const board = profile?.target_board || 'cbse';
      const streak = profile?.streak_days || 7;
      const xpVal = profile?.xp_points || 320;
      const gemsVal = profile?.gems || 150;
      const heartsVal = profile?.hearts || 5;
      const isAdmin = profile?.is_admin === true;

      persistLocalSession(name, email, board, xpVal, gemsVal, heartsVal);

      setUser((prev) => ({
        ...prev,
        id: userId,
        name,
        email,
        targetBoard: board,
        streakDays: streak,
        xp: xpVal,
        level: Math.floor(xpVal / 100) + 1,
        gems: gemsVal,
        hearts: heartsVal,
        isLoggedIn: true,
        isAdmin,
      }));
    } catch (err) {
      console.warn('[Auth] Profile sync error:', err);
    }
  };

  const persistLocalSession = (name: string, email: string, board: string, xp?: number, gems?: number, hearts?: number) => {
    localStorage.setItem('edustride_logged_in', 'true');
    localStorage.setItem('edustride_user_name', name);
    localStorage.setItem('edustride_user_email', email);
    localStorage.setItem('edustride_user_board', board);
    if (xp !== undefined) localStorage.setItem('edustride_user_xp', xp.toString());
    if (gems !== undefined) localStorage.setItem('edustride_user_gems', gems.toString());
    if (hearts !== undefined) localStorage.setItem('edustride_user_hearts', hearts.toString());
  };

  const clearLocalSession = () => {
    localStorage.removeItem('edustride_logged_in');
    localStorage.removeItem('edustride_user_name');
    localStorage.removeItem('edustride_user_email');
    setUser(DEFAULT_USER);
  };

  // ─── Gamification Actions ───

  const addXP = (amount: number) => {
    let leveledUp = false;
    let newLevel = user.level;
    let newXP = user.xp + amount;

    const calculatedLevel = Math.floor(newXP / 100) + 1;
    if (calculatedLevel > user.level) {
      leveledUp = true;
      newLevel = calculatedLevel;
      playLevelUpFanfare();
    }

    setUser((prev) => {
      const updated = { ...prev, xp: newXP, level: newLevel };
      localStorage.setItem('edustride_user_xp', newXP.toString());
      return updated;
    });

    return { newXP, leveledUp, newLevel };
  };

  const addGems = (amount: number) => {
    playGemDing();
    setUser((prev) => {
      const updatedGems = prev.gems + amount;
      localStorage.setItem('edustride_user_gems', updatedGems.toString());
      return { ...prev, gems: updatedGems };
    });
  };

  const deductHeart = () => {
    // Check if infinite hearts is active
    if (user.infiniteHeartsUntil && Date.now() < user.infiniteHeartsUntil) {
      return true;
    }

    if (user.hearts <= 0) {
      return false;
    }

    playHeartCrack();
    const newHearts = Math.max(0, user.hearts - 1);
    setUser((prev) => {
      localStorage.setItem('edustride_user_hearts', newHearts.toString());
      return { ...prev, hearts: newHearts };
    });
    return newHearts > 0;
  };

  const refillHearts = () => {
    setUser((prev) => {
      localStorage.setItem('edustride_user_hearts', prev.maxHearts.toString());
      return { ...prev, hearts: prev.maxHearts };
    });
  };

  const activateInfiniteHearts = (durationMinutes: number) => {
    const until = Date.now() + durationMinutes * 60 * 1000;
    setUser((prev) => ({ ...prev, infiniteHeartsUntil: until, hearts: prev.maxHearts }));
  };

  const completeNode = (nodeId: string, stars: number, score: number, nextNodeId?: string) => {
    setUser((prev) => {
      const nextCompleted = {
        ...prev.completedNodes,
        [nodeId]: { stars, score, completedAt: new Date().toISOString() },
      };

      const nextUnlocked = [...prev.unlockedNodes];
      if (nextNodeId && !nextUnlocked.includes(nextNodeId)) {
        nextUnlocked.push(nextNodeId);
      }

      localStorage.setItem('edustride_completed_nodes', JSON.stringify(nextCompleted));
      localStorage.setItem('edustride_unlocked_nodes', JSON.stringify(nextUnlocked));

      return {
        ...prev,
        completedNodes: nextCompleted,
        unlockedNodes: nextUnlocked,
      };
    });
  };

  const buyShopItem = (itemId: 'streak_freeze' | 'heart_refill' | 'infinite_hearts' | 'double_xp', costGems: number) => {
    if (user.gems < costGems) return false;

    playGemDing();
    setUser((prev) => {
      const updatedGems = prev.gems - costGems;
      localStorage.setItem('edustride_user_gems', updatedGems.toString());

      const nextInv = { ...prev.inventory };
      let newHearts = prev.hearts;
      let nextInfUntil = prev.infiniteHeartsUntil;

      if (itemId === 'heart_refill') {
        newHearts = prev.maxHearts;
        localStorage.setItem('edustride_user_hearts', prev.maxHearts.toString());
      } else if (itemId === 'streak_freeze') {
        nextInv.streakFreeze += 1;
      } else if (itemId === 'infinite_hearts') {
        nextInfUntil = Date.now() + 120 * 60 * 1000; // 2 hours
        newHearts = prev.maxHearts;
      } else if (itemId === 'double_xp') {
        nextInv.doubleXpCount += 1;
      }

      localStorage.setItem('edustride_inventory', JSON.stringify(nextInv));

      return {
        ...prev,
        gems: updatedGems,
        hearts: newHearts,
        infiniteHeartsUntil: nextInfUntil,
        inventory: nextInv,
      };
    });

    return true;
  };

  const toggleSound = () => {
    const nextMuted = !user.soundMuted;
    setSoundMuted(nextMuted);
    setUser((prev) => ({ ...prev, soundMuted: nextMuted }));
  };

  const incrementStreak = () => {
    setUser((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
  };

  const setTargetBoard = (boardId: string) => {
    setUser((prev) => ({ ...prev, targetBoard: boardId }));
    localStorage.setItem('edustride_user_board', boardId);
  };

  // ─── Auth (Signup / Login / Logout) ───
  const signup = async (name: string, email: string, password: string, targetBoard = 'cbse') => {
    if (!name.trim()) return { success: false, error: 'Name is required.' };
    if (!email.includes('@')) return { success: false, error: 'Invalid email address.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    try {
      if (!isSupabaseConfigured) {
        persistLocalSession(name, email, targetBoard);
        setUser((prev) => ({ ...prev, name, email, targetBoard, isLoggedIn: true }));
        return { success: true };
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name, targetBoard } },
      });

      if (authError) return { success: false, error: authError.message };

      const userId = data?.user?.id;
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          target_board: targetBoard,
          xp_points: 320,
          gems: 150,
          hearts: 5,
        }, { onConflict: 'id' });
      }

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
      return { success: false, error: err.message || 'Signup failed.' };
    }
  };

  const login = async (email: string, password: string) => {
    if (!email.trim()) return { success: false, error: 'Email is required.' };
    if (!password) return { success: false, error: 'Password is required.' };

    try {
      if (!isSupabaseConfigured) {
        const name = email.split('@')[0] || 'Student';
        persistLocalSession(name, email, 'cbse');
        setUser((prev) => ({ ...prev, name, email, isLoggedIn: true }));
        return { success: true };
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) return { success: false, error: authError.message };

      const userId = data?.user?.id;
      if (userId) {
        await fetchAndSyncProfile(userId, data.user?.email || email);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    clearLocalSession();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setTargetBoard,
        incrementStreak,
        addXP,
        addGems,
        deductHeart,
        refillHearts,
        activateInfiniteHearts,
        completeNode,
        buyShopItem,
        toggleSound,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
