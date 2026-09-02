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
  username: string;
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
  leagueTier: string;
  unlockedNodes: string[];
  completedNodes: Record<string, CompletedNodeData>;
  inventory: UserInventory;
  avatarUrl?: string;
  soundMuted: boolean;
}

interface UserContextType {
  user: UserGamifiedState;
  setTargetBoard: (boardId: string) => void;
  setClassLevel: (classLevel: string) => void;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updateUsername: (username: string) => Promise<{ success: boolean; error?: string }>;
  incrementStreak: () => void;
  addXP: (amount: number) => { newXP: number; leveledUp: boolean; newLevel: number };
  addGems: (amount: number) => void;
  deductHeart: () => boolean; // returns false if ran out of hearts
  refillHearts: () => void;
  activateInfiniteHearts: (durationMinutes: number) => void;
  completeNode: (nodeId: string, stars: number, score: number, nextNodeId?: string) => void;
  buyShopItem: (itemId: 'streak_freeze' | 'heart_refill' | 'infinite_hearts' | 'double_xp', costGems: number) => boolean;
  toggleSound: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, targetBoard?: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export interface LeagueInfo {
  id: string;
  name: string;
  emoji: string;
  badge: string;
  minXp: number;
  color: string;
  glow: string;
  description: string;
}

export const LEAGUES: LeagueInfo[] = [
  { id: 'starter', name: 'Starter League', emoji: '🌱', badge: '🌱 Starter', minXp: 0, color: '#10b981', glow: 'rgba(16,185,129,0.3)', description: 'Begin your academic journey' },
  { id: 'scholar', name: 'Scholar League', emoji: '🪵', badge: '🪵 Scholar', minXp: 400, color: '#b45309', glow: 'rgba(180,83,9,0.3)', description: 'Consistent daily practice' },
  { id: 'achiever', name: 'Achiever League', emoji: '🔷', badge: '🔷 Achiever', minXp: 900, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)', description: 'Outstanding test scores' },
  { id: 'elite', name: 'Elite League', emoji: '🥇', badge: '🥇 Elite', minXp: 1500, color: '#eab308', glow: 'rgba(234,179,8,0.3)', description: 'Top competitive performers' },
  { id: 'master', name: 'Master League', emoji: '💎', badge: '💎 Master', minXp: 2200, color: '#06b6d4', glow: 'rgba(6,182,212,0.3)', description: 'Mastery across all subjects' },
  { id: 'champion', name: 'Champion League', emoji: '👑', badge: '👑 Champion', minXp: 3000, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', description: 'State-level exam topper zone' },
  { id: 'legend', name: 'Legend League', emoji: '⚡', badge: '⚡ Legend', minXp: 4000, color: '#a855f7', glow: 'rgba(168,85,247,0.3)', description: 'Legendary board accuracy' },
  { id: 'nainix', name: 'Nainix League', emoji: '🌟', badge: '🌟 Nainix', minXp: 5500, color: '#ec4899', glow: 'rgba(236,72,153,0.4)', description: 'The pinnacle of academic excellence' },
];

export const getLeagueByXP = (xp: number): LeagueInfo => {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (xp >= LEAGUES[i].minXp) {
      return LEAGUES[i];
    }
  }
  return LEAGUES[0];
};

const DEFAULT_USER: UserGamifiedState = {
  id: '',
  name: '',
  username: '',
  email: '',
  classLevel: 'Class 12',
  streakDays: 0,
  targetBoard: 'cbse',
  isLoggedIn: false,
  isAdmin: false,
  hearts: 5,
  maxHearts: 5,
  infiniteHeartsUntil: null,
  gems: 0,
  xp: 0,
  level: 1,
  leagueTier: 'Starter League',
  unlockedNodes: ['phy-1', 'chem-1', 'math-1', 'bio-1', 'eng-1'],
  completedNodes: {},
  inventory: {
    streakFreeze: 0,
    infiniteHeartsPass: 0,
    doubleXpCount: 0,
  },
  soundMuted: false,
};

export const sanitizeUsername = (raw: string): string => {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20);
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserGamifiedState>(DEFAULT_USER);

  // ─── On Mount: Restore state from localStorage + sync Supabase ───
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('edustride_logged_in');
      const storedName = localStorage.getItem('edustride_user_name');
      const storedUsername = localStorage.getItem('edustride_user_username');
      const storedEmail = localStorage.getItem('edustride_user_email');
      const storedBoard = localStorage.getItem('edustride_user_board');
      const storedXP = localStorage.getItem('edustride_user_xp');
      const storedGems = localStorage.getItem('edustride_user_gems');
      const storedHearts = localStorage.getItem('edustride_user_hearts');
      const storedNodes = localStorage.getItem('edustride_unlocked_nodes');
      const storedCompleted = localStorage.getItem('edustride_completed_nodes');
      const storedInv = localStorage.getItem('edustride_inventory');
      const storedAvatar = localStorage.getItem('edustride_user_avatar');

      const soundMuted = getSoundMuted();

      setUser((prev) => {
        const xpVal = storedXP ? parseInt(storedXP, 10) : prev.xp;
        const levelVal = Math.floor(xpVal / 100) + 1;
        const cleanName = storedName || prev.name;
        const cleanUser = storedUsername || sanitizeUsername(cleanName.replace(/\s+/g, '_')) || 'scholar_12';

        return {
          ...prev,
          isLoggedIn: storedAuth === 'true' && !!storedEmail,
          name: cleanName,
          username: cleanUser,
          email: storedEmail || prev.email,
          targetBoard: storedBoard || prev.targetBoard,
          xp: xpVal,
          level: levelVal,
          leagueTier: getLeagueByXP(xpVal).name,
          gems: storedGems ? parseInt(storedGems, 10) : prev.gems,
          hearts: storedHearts ? parseInt(storedHearts, 10) : prev.hearts,
          unlockedNodes: storedNodes ? JSON.parse(storedNodes) : prev.unlockedNodes,
          completedNodes: storedCompleted ? JSON.parse(storedCompleted) : prev.completedNodes,
          inventory: storedInv ? JSON.parse(storedInv) : prev.inventory,
          avatarUrl: storedAvatar || prev.avatarUrl || '',
          soundMuted,
        };
      });

      if (!isSupabaseConfigured) return;

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncUserProfile(session.user.id, session.user.email || '');
        }
      });
    } catch (e) {
      console.warn('[UserContext] Failed to load local storage:', e);
    }
  }, []);

  // ─── Sync Supabase Profile ───
  const syncUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const name = profile?.name || email.split('@')[0] || 'Student';
      const username = profile?.username || sanitizeUsername(name.replace(/\s+/g, '_')) || 'scholar_12';
      const board = profile?.target_board || 'cbse';
      const streak = profile?.streak_days || 7;
      const xpVal = profile?.xp_points || 320;
      const gemsVal = profile?.gems || 150;
      const heartsVal = profile?.hearts || 5;
      const isAdmin = profile?.is_admin === true;

      persistLocalSession(name, email, board, xpVal, gemsVal, heartsVal, username);

      setUser((prev) => ({
        ...prev,
        id: userId,
        name,
        username,
        email,
        targetBoard: board,
        streakDays: streak,
        xp: xpVal,
        level: Math.floor(xpVal / 100) + 1,
        leagueTier: getLeagueByXP(xpVal).name,
        gems: gemsVal,
        hearts: heartsVal,
        isLoggedIn: true,
        isAdmin,
      }));
    } catch (err) {
      console.warn('[Auth] Profile sync error:', err);
    }
  };

  const persistLocalSession = (name: string, email: string, board: string, xp?: number, gems?: number, hearts?: number, username?: string) => {
    localStorage.setItem('edustride_logged_in', 'true');
    localStorage.setItem('edustride_user_name', name);
    if (username) localStorage.setItem('edustride_user_username', username);
    localStorage.setItem('edustride_user_email', email);
    localStorage.setItem('edustride_user_board', board);
    if (xp !== undefined) localStorage.setItem('edustride_user_xp', xp.toString());
    if (gems !== undefined) localStorage.setItem('edustride_user_gems', gems.toString());
    if (hearts !== undefined) localStorage.setItem('edustride_user_hearts', hearts.toString());
  };

  const clearLocalSession = () => {
    localStorage.removeItem('edustride_logged_in');
    localStorage.removeItem('edustride_user_name');
    localStorage.removeItem('edustride_user_username');
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
      const updated = { 
        ...prev, 
        xp: newXP, 
        level: newLevel,
        leagueTier: getLeagueByXP(newXP).name 
      };
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

  const setClassLevel = (classLevel: string) => {
    setUser((prev) => ({ ...prev, classLevel }));
    localStorage.setItem('edustride_user_class', classLevel);
    if (isSupabaseConfigured && user.id) {
      supabase.from('profiles').update({ class_level: classLevel }).eq('id', user.id).then();
    }
  };

  // ─── Auth (Signup / Login / Logout) ───
  const signup = async (name: string, email: string, password: string, targetBoard = 'cbse', username?: string) => {
    if (!name.trim()) return { success: false, error: 'Name is required.' };
    if (!email.includes('@')) return { success: false, error: 'Invalid email address.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const cleanUsername = sanitizeUsername(username || name.replace(/\s+/g, '_')) || 'scholar_12';

    try {
      if (!isSupabaseConfigured) {
        persistLocalSession(name.trim(), email.trim().toLowerCase(), targetBoard, 320, 150, 5, cleanUsername);
        setUser((prev) => ({ ...prev, name: name.trim(), username: cleanUsername, email: email.trim().toLowerCase(), targetBoard, isLoggedIn: true }));
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
          username: cleanUsername,
          email: email.trim().toLowerCase(),
          target_board: targetBoard,
          xp_points: 320,
          gems: 150,
          hearts: 5,
        }, { onConflict: 'id' });
      }

      persistLocalSession(name.trim(), email.trim().toLowerCase(), targetBoard, 320, 150, 5, cleanUsername);
      setUser((prev) => ({
        ...prev,
        id: userId || '',
        name: name.trim(),
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        targetBoard,
        isLoggedIn: true,
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed.' };
    }
  };

  const login = async (identifier: string, password: string) => {
    const rawId = identifier.trim().toLowerCase().replace(/^@/, '');
    if (!rawId) return { success: false, error: 'Email or @username is required.' };
    if (!password) return { success: false, error: 'Password is required.' };

    try {
      if (!isSupabaseConfigured) {
        const name = rawId.includes('@') ? rawId.split('@')[0] : rawId;
        const cleanUser = sanitizeUsername(name);
        persistLocalSession(name, rawId.includes('@') ? rawId : `${cleanUser}@nainixone.prep`, 'cbse', 320, 150, 5, cleanUser);
        setUser((prev) => ({ ...prev, name, username: cleanUser, email: rawId, isLoggedIn: true }));
        return { success: true };
      }

      // If user typed a username without @, find their email from profiles
      let authEmail = rawId;
      if (!rawId.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', rawId)
          .maybeSingle();

        if (profile?.email) {
          authEmail = profile.email;
        }
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (authError) return { success: false, error: authError.message };

      const userId = data?.user?.id;
      if (userId) {
        await syncUserProfile(userId, data.user?.email || authEmail);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const updateUsername = async (newUsername: string) => {
    const clean = sanitizeUsername(newUsername);
    if (clean.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters (letters, numbers, underscore).' };
    }

    // Check if taken in Supabase
    if (isSupabaseConfigured && user.id) {
      try {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', clean)
          .neq('id', user.id)
          .maybeSingle();

        if (existing) {
          return { success: false, error: `@${clean} is already taken. Try another unique handle.` };
        }

        await supabase.from('profiles').update({ username: clean }).eq('id', user.id);
      } catch (e) {
        console.warn('Could not sync username to Supabase:', e);
      }
    }

    setUser((prev) => ({ ...prev, username: clean }));
    localStorage.setItem('edustride_user_username', clean);
    return { success: true };
  };

  const updateAvatar = async (avatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatarUrl }));
    localStorage.setItem('edustride_user_avatar', avatarUrl);
    if (isSupabaseConfigured && user.id) {
      try {
        await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
      } catch (e) {
        console.warn('Could not sync avatar to Supabase:', e);
      }
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
        setClassLevel,
        updateAvatar,
        updateUsername,
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
