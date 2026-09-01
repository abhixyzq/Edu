'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { playButtonClick } from '@/lib/soundEffects';

type Timeframe = 'weekly' | 'monthly' | 'alltime';
type BoardCategory = 'all' | 'cbse' | 'bseb' | 'up' | 'icse';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatar: string;
  avatarUrl?: string;
  board: string;
  specialization: string;
  xp: number;
  accuracy: number;
  streak: number;
  testsCompleted: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  isCurrentUser?: boolean;
}

export function LeaderboardClient() {
  const { user } = useUser();
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [selectedBoard, setSelectedBoard] = useState<BoardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);

  // Mock competitive roster with realistic student performance
  const rawRoster: LeaderboardUser[] = useMemo(() => {
    return [
      {
        id: 'usr-1',
        rank: 1,
        name: 'Aarav Sharma',
        username: 'aarav_cbse',
        avatar: 'AS',
        board: 'CBSE Class 12',
        specialization: 'Physics & Mathematics',
        xp: 2840,
        accuracy: 97.4,
        streak: 24,
        testsCompleted: 48,
        trend: 'up',
        trendValue: 2,
      },
      {
        id: 'usr-2',
        rank: 2,
        name: 'Rohan Gupta',
        username: 'rohan_bseb',
        avatar: 'RG',
        board: 'Bihar Board (BSEB)',
        specialization: 'Mathematics & Chemistry',
        xp: 2610,
        accuracy: 94.8,
        streak: 19,
        testsCompleted: 42,
        trend: 'neutral',
        trendValue: 0,
      },
      {
        id: 'usr-3',
        rank: 3,
        name: 'Priya Verma',
        username: 'priya_cbse',
        avatar: 'PV',
        board: 'CBSE Class 12',
        specialization: 'Organic Chemistry',
        xp: 2490,
        accuracy: 95.2,
        streak: 18,
        testsCompleted: 39,
        trend: 'up',
        trendValue: 1,
      },
      {
        id: 'usr-4',
        rank: 4,
        name: user.name || 'You',
        username: user.username || 'scholar_12',
        avatar: (user.name ? user.name.slice(0, 2) : 'ME').toUpperCase(),
        avatarUrl: user.avatarUrl,
        board: user.targetBoard === 'bseb' ? 'Bihar Board (BSEB)' : 'CBSE Class 12',
        specialization: 'Electrodynamics & Calculus',
        xp: Math.max(user.xp, 2180),
        accuracy: 89.6,
        streak: Math.max(user.streakDays || 0, 7),
        testsCompleted: 28,
        trend: 'up',
        trendValue: 3,
        isCurrentUser: true,
      },
      {
        id: 'usr-5',
        rank: 5,
        name: 'Devansh Pandey',
        username: 'devansh_up',
        avatar: 'DP',
        board: 'UP Board',
        specialization: 'Optics & Mechanics',
        xp: 1940,
        accuracy: 88.1,
        streak: 12,
        testsCompleted: 26,
        trend: 'down',
        trendValue: 1,
      },
      {
        id: 'usr-6',
        rank: 6,
        name: 'Sneha Kulkarni',
        username: 'sneha_k',
        avatar: 'SK',
        board: 'CBSE Class 12',
        specialization: 'Physical Chemistry',
        xp: 1820,
        accuracy: 87.5,
        streak: 11,
        testsCompleted: 24,
        trend: 'neutral',
        trendValue: 0,
      },
      {
        id: 'usr-7',
        rank: 7,
        name: 'Kavya Nair',
        username: 'kavya_isc',
        avatar: 'KN',
        board: 'ICSE / ISC',
        specialization: 'Genetics & Biology',
        xp: 1690,
        accuracy: 86.0,
        streak: 9,
        testsCompleted: 21,
        trend: 'down',
        trendValue: 2,
      },
      {
        id: 'usr-8',
        rank: 8,
        name: 'Arjun Singh',
        username: 'arjun_bseb',
        avatar: 'AS',
        board: 'Bihar Board (BSEB)',
        specialization: 'Inorganic Chemistry',
        xp: 1540,
        accuracy: 84.3,
        streak: 8,
        testsCompleted: 19,
        trend: 'up',
        trendValue: 1,
      },
      {
        id: 'usr-9',
        rank: 9,
        name: 'Ananya Roy',
        username: 'ananya_cbse',
        avatar: 'AR',
        board: 'CBSE Class 12',
        specialization: 'Integral Calculus',
        xp: 1410,
        accuracy: 82.7,
        streak: 7,
        testsCompleted: 17,
        trend: 'neutral',
        trendValue: 0,
      },
      {
        id: 'usr-10',
        rank: 10,
        name: 'Mohit Sharma',
        username: 'mohit_up',
        avatar: 'MS',
        board: 'UP Board',
        specialization: 'Modern Physics',
        xp: 1280,
        accuracy: 81.0,
        streak: 5,
        testsCompleted: 15,
        trend: 'down',
        trendValue: 3,
      },
      {
        id: 'usr-11',
        rank: 11,
        name: 'Aditi Rao',
        username: 'aditi_cbse',
        avatar: 'AR',
        board: 'CBSE Class 12',
        specialization: 'Inorganic Chemistry',
        xp: 1150,
        accuracy: 78.2,
        streak: 3,
        testsCompleted: 12,
        trend: 'neutral',
        trendValue: 0,
      },
      {
        id: 'usr-12',
        rank: 12,
        name: 'Manish Kumar',
        username: 'manish_bseb',
        avatar: 'MK',
        board: 'Bihar Board (BSEB)',
        specialization: 'Differential Equations',
        xp: 1020,
        accuracy: 76.0,
        streak: 2,
        testsCompleted: 10,
        trend: 'down',
        trendValue: 1,
      },
    ];
  }, [user.name, user.username, user.xp, user.streakDays, user.targetBoard, user.avatarUrl]);

  // Filtering
  const filteredList = useMemo(() => {
    let list = [...rawRoster];

    if (selectedBoard !== 'all') {
      if (selectedBoard === 'cbse') list = list.filter((u) => u.board.includes('CBSE'));
      if (selectedBoard === 'bseb') list = list.filter((u) => u.board.includes('Bihar'));
      if (selectedBoard === 'up') list = list.filter((u) => u.board.includes('UP'));
      if (selectedBoard === 'icse') list = list.filter((u) => u.board.includes('ICSE'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.board.toLowerCase().includes(q) ||
          u.specialization.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rawRoster, selectedBoard, searchQuery]);

  const top1 = filteredList.find((u) => u.rank === 1);
  const top2 = filteredList.find((u) => u.rank === 2);
  const top3 = filteredList.find((u) => u.rank === 3);
  const remainingPlayers = filteredList.filter((u) => u.rank > 3);

  const currentUserData = useMemo(() => {
    return rawRoster.find((u) => u.isCurrentUser) || rawRoster[3];
  }, [rawRoster]);

  const pointsToPodium = useMemo(() => {
    if (!top3) return 0;
    return Math.max(0, top3.xp - currentUserData.xp + 10);
  }, [top3, currentUserData]);

  return (
    <main className="w-full min-h-screen bg-[#09090b] text-white pb-36 font-sans select-none overflow-x-hidden relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-violet-600/15 via-indigo-600/5 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* ─── 1. Header Hero (Executive Obsidian Dark Palette) ─── */}
      <div className="w-full pt-4 pb-4 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          
          {/* Header Title & League Info */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-black uppercase tracking-wider">
                  {user.leagueTier || 'Silver'} League
                </span>
                <span className="text-[10px] font-black text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                  ⏱️ 2d 14h left
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-white mt-1 leading-tight tracking-tight">
                State Rankings & Leaders
              </h1>
            </div>

            {/* Glowing Trophy Icon */}
            <div className="w-11 h-11 rounded-2xl bg-[#141418] border border-white/10 shadow-[0_0_20px_rgba(124,58,237,0.2)] flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
          </div>

          {/* Timeframe Filter Tabs (Dark Segmented Control) */}
          <div className="bg-[#121216] p-1 rounded-2xl border border-white/10 flex items-center mb-3">
            {(['weekly', 'monthly', 'alltime'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  playButtonClick();
                  setTimeframe(tf);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-violet-600 text-white shadow-md font-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf === 'alltime' ? 'All Time' : tf}
              </button>
            ))}
          </div>

          {/* Board Quick Scroll Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Boards' },
              { id: 'cbse', label: 'CBSE' },
              { id: 'bseb', label: 'Bihar (BSEB)' },
              { id: 'up', label: 'UP Board' },
              { id: 'icse', label: 'ISC / ICSE' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  playButtonClick();
                  setSelectedBoard(b.id as BoardCategory);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedBoard === b.id
                    ? 'bg-white/15 text-white border-white/30 shadow-xs font-black'
                    : 'bg-[#121216] text-zinc-400 border-white/5 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mt-2.5">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, @handle or board..."
              className="w-full pl-9 pr-3 py-2 bg-[#121216] rounded-2xl border border-white/10 text-xs font-medium text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-hidden transition-colors"
            />
          </div>

        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-4">

        {/* ─── 2. 3D Olympic Podium (Mobile Black Obsidian Aesthetics) ─── */}
        {top1 && (
          <div className="bg-[#121216] rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Top subtle golden reflection */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/10 blur-xl pointer-events-none" />

            <div className="text-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Top 3 Scholars Podium
              </span>
            </div>

            <div className="flex items-end justify-center gap-2 sm:gap-3 pt-4 pb-1">
              
              {/* Rank 2 (Silver) - Left */}
              {top2 && (
                <div
                  onClick={() => {
                    playButtonClick();
                    setSelectedUser(top2);
                  }}
                  className="flex-1 flex flex-col items-center cursor-pointer group active:scale-95 transition-all"
                >
                  <div className="relative mb-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1e2029] border-2 border-slate-400/60 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
                      {top2.avatarUrl || (top2.isCurrentUser && user.avatarUrl) ? (
                        <img src={top2.avatarUrl || user.avatarUrl} alt={top2.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-sm font-black text-slate-300">{top2.avatar}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-700 border border-slate-400 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                      2
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white truncate max-w-[90px] text-center">
                    {top2.name}
                  </p>
                  <p className="text-[10px] font-bold text-violet-400 truncate max-w-[90px]">
                    @{top2.username}
                  </p>

                  <div className="w-full mt-2 pt-3 pb-2 px-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center">
                    <span className="text-[11px] font-bold text-slate-200">{top2.xp} XP</span>
                    <span className="text-[9px] font-medium text-zinc-500 uppercase">{top2.accuracy}%</span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Champion) - Center (Higher Height & Crown) */}
              <div
                onClick={() => {
                  playButtonClick();
                  setSelectedUser(top1);
                }}
                className="flex-1 flex flex-col items-center cursor-pointer group active:scale-95 transition-all -mt-4"
              >
                <div className="relative mb-2">
                  {/* Glowing Crown */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg animate-bounce">
                    👑
                  </div>
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b from-[#2a2212] via-[#1c1810] to-[#12100a] border-2 border-amber-400/70 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-400/20 flex items-center justify-center overflow-hidden">
                    {top1.avatarUrl || (top1.isCurrentUser && user.avatarUrl) ? (
                      <img src={top1.avatarUrl || user.avatarUrl} alt={top1.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="text-lg font-black text-amber-300">{top1.avatar}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-500 border border-amber-300 text-amber-950 font-black text-xs flex items-center justify-center shadow-md">
                    1
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-black text-amber-200 truncate max-w-[100px] text-center">
                  {top1.name}
                </p>
                <p className="text-[10px] font-bold text-amber-400 truncate max-w-[100px]">
                  @{top1.username}
                </p>

                <div className="w-full mt-2 pt-4 pb-2.5 px-1 rounded-2xl bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col items-center shadow-xs">
                  <span className="text-xs font-black text-amber-300">{top1.xp} XP</span>
                  <span className="text-[10px] font-bold text-amber-400/80 uppercase">{top1.accuracy}% Acc</span>
                </div>
              </div>

              {/* Rank 3 (Bronze) - Right */}
              {top3 && (
                <div
                  onClick={() => {
                    playButtonClick();
                    setSelectedUser(top3);
                  }}
                  className="flex-1 flex flex-col items-center cursor-pointer group active:scale-95 transition-all"
                >
                  <div className="relative mb-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1c1510] border-2 border-amber-800/60 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
                      {top3.avatarUrl || (top3.isCurrentUser && user.avatarUrl) ? (
                        <img src={top3.avatarUrl || user.avatarUrl} alt={top3.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-sm font-black text-amber-400">{top3.avatar}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-900 border border-amber-600 text-amber-200 font-black text-[11px] flex items-center justify-center shadow-xs">
                      3
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white truncate max-w-[90px] text-center">
                    {top3.name}
                  </p>
                  <p className="text-[10px] font-bold text-amber-500 truncate max-w-[90px]">
                    @{top3.username}
                  </p>

                  <div className="w-full mt-2 pt-3 pb-2 px-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center">
                    <span className="text-[11px] font-bold text-amber-300">{top3.xp} XP</span>
                    <span className="text-[9px] font-medium text-zinc-500 uppercase">{top3.accuracy}%</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ─── 3. Mobile Roster Feed Cards in Sleek Dark Obsidian (#4 to #12) ─── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Candidates ({filteredList.length})
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">
              Tap to inspect
            </span>
          </div>

          {remainingPlayers.map((player) => {
            const isUser = player.isCurrentUser;

            return (
              <div
                key={player.id}
                onClick={() => {
                  playButtonClick();
                  setSelectedUser(player);
                }}
                className={`w-full rounded-2xl p-3.5 flex items-center justify-between gap-3 border transition-all cursor-pointer active:scale-98 ${
                  isUser
                    ? 'bg-violet-950/40 border-violet-500/60 shadow-[0_0_20px_rgba(124,58,237,0.2)] ring-1 ring-violet-500/40'
                    : 'bg-[#121216] border-white/[0.06] hover:border-white/20'
                }`}
              >
                {/* Left: Rank & Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Number */}
                  <span className={`w-6 text-center font-heading font-black text-sm ${isUser ? 'text-violet-400' : 'text-zinc-400'}`}>
                    #{player.rank}
                  </span>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-300 overflow-hidden shrink-0">
                    {player.avatarUrl || (isUser && user.avatarUrl) ? (
                      <img src={player.avatarUrl || user.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                      player.avatar
                    )}
                  </div>

                  {/* Name, Handle & Board */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-bold truncate ${isUser ? 'text-white font-black' : 'text-zinc-200'}`}>
                        {player.name}
                      </h4>
                      {isUser && (
                        <span className="px-1.5 py-0.2 rounded-md bg-violet-600 text-white text-[9px] font-black uppercase tracking-tight">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold text-violet-400 truncate">
                        @{player.username}
                      </span>
                      <span className="text-[10px] text-zinc-600">•</span>
                      <span className="text-[10px] font-medium text-zinc-400 truncate">
                        {player.board.replace(' Class 12', '').replace(' (BSEB)', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & Trend */}
                <div className="text-right shrink-0 flex flex-col items-end">
                  <span className="font-heading text-xs sm:text-sm font-black text-white">
                    {player.xp.toLocaleString()} <span className="text-[10px] font-normal text-zinc-500">XP</span>
                  </span>
                  
                  <div className="flex items-center gap-1 mt-0.5">
                    {player.trend === 'up' && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                        ▲ {player.trendValue}
                      </span>
                    )}
                    {player.trend === 'down' && (
                      <span className="text-[10px] font-bold text-rose-400 flex items-center">
                        ▼ {player.trendValue}
                      </span>
                    )}
                    {player.trend === 'neutral' && (
                      <span className="text-[10px] text-zinc-500 font-bold">—</span>
                    )}
                    <span className="text-[9px] font-medium text-zinc-400 bg-white/[0.05] px-1 rounded-sm">
                      {player.accuracy}%
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ─── 4. Mobile Sticky Bottom "Your Standing" Dark Dock ─── */}
      <div className="fixed bottom-16 left-0 w-full px-4 pb-2 z-30 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-[#141418]/95 text-white rounded-3xl p-3.5 shadow-2xl border border-white/15 backdrop-blur-xl flex items-center justify-between gap-3">
          
          {/* User Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 border border-violet-400/40 flex items-center justify-center font-black text-xs overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>#{currentUserData.rank}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">{currentUserData.name}</span>
                <span className="text-[10px] font-bold text-violet-400">@{currentUserData.username}</span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate">
                {currentUserData.rank <= 3
                  ? '🏅 Podium Position Secured!'
                  : `🔥 +${pointsToPodium} XP to reach Top 3`}
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <Link
            href="/tests"
            onClick={playButtonClick}
            className="px-3.5 py-2 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md shrink-0 flex items-center gap-1"
          >
            <span>Practice</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>

        </div>
      </div>

      {/* ─── 5. Candidate Detail Inspection Modal (Dark Bottom Sheet) ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-[#141418] rounded-t-3xl sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/15 animate-in slide-in-from-bottom-5 duration-200 text-white">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-white font-black text-base flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                  {selectedUser.avatarUrl || (selectedUser.isCurrentUser && user.avatarUrl) ? (
                    <img
                      src={selectedUser.avatarUrl || user.avatarUrl}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedUser.avatar
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs font-bold text-violet-400">
                    @{selectedUser.username}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {selectedUser.board}
                  </p>
                </div>
              </div>
              
              <span className="text-xs font-bold text-zinc-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                Rank #{selectedUser.rank}
              </span>
            </div>

            {/* Specialization */}
            <div className="my-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Primary Strength / Focus Area
              </span>
              <span className="text-xs font-semibold text-zinc-200 mt-0.5 block">
                {selectedUser.specialization}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center my-3.5">
              <div className="p-3 rounded-2xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">XP Points</span>
                <span className="text-xs font-black text-white mt-0.5 block">{selectedUser.xp.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Accuracy</span>
                <span className="text-xs font-black text-emerald-400 mt-0.5 block">{selectedUser.accuracy}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Streak</span>
                <span className="text-xs font-black text-amber-300 mt-0.5 block">{selectedUser.streak} Days</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setSelectedUser(null);
              }}
              className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/10 mt-1"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
