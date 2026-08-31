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
  avatar: string;
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

const TIERS = [
  { id: 'all', name: 'All Tiers', minXp: 0 },
  { id: 'diamond', name: 'Diamond Tier', minXp: 1500, accent: '#38bdf8' },
  { id: 'platinum', name: 'Platinum Tier', minXp: 1000, accent: '#a78bfa' },
  { id: 'gold', name: 'Gold Tier', minXp: 600, accent: '#fbbf24' },
  { id: 'silver', name: 'Silver Tier', minXp: 300, accent: '#94a3b8' },
];

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
        avatar: (user.name ? user.name.slice(0, 2) : 'ME').toUpperCase(),
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
        avatar: 'AS',
        board: 'Bihar Board (BSEB)',
        specialization: 'Coordinate Geometry',
        xp: 1530,
        accuracy: 83.4,
        streak: 8,
        testsCompleted: 19,
        trend: 'down',
        trendValue: 1,
      },
      {
        id: 'usr-9',
        rank: 9,
        name: 'Tanvi Joshi',
        avatar: 'TJ',
        board: 'CBSE Class 12',
        specialization: 'Thermodynamics',
        xp: 1410,
        accuracy: 82.0,
        streak: 6,
        testsCompleted: 16,
        trend: 'neutral',
        trendValue: 0,
      },
      {
        id: 'usr-10',
        rank: 10,
        name: 'Vikram Mehta',
        avatar: 'VM',
        board: 'UP Board',
        specialization: 'Modern Physics',
        xp: 1280,
        accuracy: 79.5,
        streak: 4,
        testsCompleted: 14,
        trend: 'down',
        trendValue: 3,
      },
      {
        id: 'usr-11',
        rank: 11,
        name: 'Aditi Rao',
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
  }, [user.name, user.xp, user.streakDays, user.targetBoard]);

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
          u.board.toLowerCase().includes(q) ||
          u.specialization.toLowerCase().includes(q)
      );
    }

    return list.map((u, i) => ({
      ...u,
      rank: i + 1,
    }));
  }, [rawRoster, selectedBoard, searchQuery]);

  const top1 = filteredList[0];
  const top2 = filteredList[1];
  const top3 = filteredList[2];
  const remainingPlayers = filteredList.slice(3);

  const currentUserData = useMemo(() => {
    return filteredList.find((u) => u.isCurrentUser) || rawRoster[3];
  }, [filteredList, rawRoster]);

  const pointsToPodium = useMemo(() => {
    if (!currentUserData || currentUserData.rank <= 3) return 0;
    const thirdPlayer = filteredList[2];
    if (!thirdPlayer) return 0;
    return Math.max(thirdPlayer.xp - currentUserData.xp + 10, 10);
  }, [currentUserData, filteredList]);

  return (
    <main className="w-full min-h-screen bg-[#09090b] text-[#f4f4f5] pb-32 font-sans selection:bg-violet-900 selection:text-white">
      
      {/* ─── 1. Minimal Header & Meta Bar ─── */}
      <section className="border-b border-white/[0.08] bg-[#0c0c0f]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                  Competitive Season 14 • Live Sync
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <span>Class 12 Global Rankings</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                  Verified
                </span>
              </h1>
            </div>

            {/* Timeframe Selector Segment */}
            <div className="flex items-center bg-[#18181b] border border-white/[0.08] p-1 rounded-xl">
              {[
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'alltime', label: 'All-Time' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    playButtonClick();
                    setTimeframe(t.id as Timeframe);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === t.id
                      ? 'bg-zinc-800 text-white shadow-xs border border-white/10'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Filters & Search ─── */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-4 pt-3 border-t border-white/[0.06]">
            
            {/* Board Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    selectedBoard === b.id
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 sm:ml-auto">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, board..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#121215] border border-white/[0.08] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-violet-500 transition-colors"
              />
            </div>

          </div>

        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6">

        {/* ─── 2. Top 3 Podium Cards (Executive Minimalist) ─── */}
        {top1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* Rank 2 - Silver Card */}
            {top2 && (
              <div
                onClick={() => {
                  playButtonClick();
                  setSelectedUser(top2);
                }}
                className="relative bg-[#121216] border border-slate-700/40 rounded-2xl p-5 hover:border-slate-500 transition-all cursor-pointer flex flex-col justify-between group md:order-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 font-bold text-sm flex items-center justify-center">
                      {top2.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors">
                        {top2.name}
                      </h3>
                      <p className="text-[11px] text-zinc-400">{top2.board}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                    #2
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-medium">Accuracy</span>
                    <span className="font-semibold text-zinc-300">{top2.accuracy}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-medium">Score</span>
                    <span className="font-bold text-white tracking-wide">{top2.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 - Gold Card (Dominant) */}
            <div
              onClick={() => {
                playButtonClick();
                setSelectedUser(top1);
              }}
              className="relative bg-gradient-to-b from-[#1c1811] via-[#14120e] to-[#100f0c] border border-amber-500/40 rounded-2xl p-5 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group md:order-2 shadow-[0_0_30px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/20"
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-amber-950 text-[10px] font-bold tracking-wider uppercase shadow-xs">
                Current Leader
              </div>

              <div className="flex items-start justify-between mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-amber-950 font-black text-base flex items-center justify-center shadow-sm">
                    {top1.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                      {top1.name}
                    </h3>
                    <p className="text-[11px] text-amber-300/80">{top1.board}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">
                  #1
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-400/60 block uppercase font-medium">Accuracy</span>
                  <span className="font-semibold text-amber-200">{top1.accuracy}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-400/60 block uppercase font-medium">Top Score</span>
                  <span className="font-black text-amber-400 tracking-wide text-sm">
                    {top1.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Rank 3 - Bronze Card */}
            {top3 && (
              <div
                onClick={() => {
                  playButtonClick();
                  setSelectedUser(top3);
                }}
                className="relative bg-[#121216] border border-amber-900/40 rounded-2xl p-5 hover:border-amber-700/60 transition-all cursor-pointer flex flex-col justify-between group md:order-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-950/70 border border-amber-700/50 text-amber-200 font-bold text-sm flex items-center justify-center">
                      {top3.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors">
                        {top3.name}
                      </h3>
                      <p className="text-[11px] text-zinc-400">{top3.board}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-900/50">
                    #3
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-medium">Accuracy</span>
                    <span className="font-semibold text-zinc-300">{top3.accuracy}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-medium">Score</span>
                    <span className="font-bold text-white tracking-wide">{top3.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ─── 3. Detailed Data Table / Roster ─── */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-[#16161a] border-b border-white/[0.06] text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-6 sm:col-span-5">Candidate</div>
            <div className="hidden sm:block sm:col-span-3">Focus Area</div>
            <div className="col-span-2 text-center">Accuracy</div>
            <div className="col-span-3 sm:col-span-1 text-right">XP</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/[0.04]">
            {remainingPlayers.map((player) => {
              const isUser = player.isCurrentUser;

              return (
                <div
                  key={player.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedUser(player);
                  }}
                  className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center transition-colors cursor-pointer text-xs ${
                    isUser
                      ? 'bg-violet-950/30 border-l-2 border-l-violet-500 hover:bg-violet-950/40'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Rank Column */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <span className={`font-semibold ${isUser ? 'text-violet-400 font-bold' : 'text-zinc-400'}`}>
                      {player.rank}
                    </span>
                  </div>

                  {/* Candidate Column */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 text-zinc-300 font-semibold text-xs flex items-center justify-center shrink-0">
                      {player.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold truncate ${isUser ? 'text-white font-bold' : 'text-zinc-200'}`}>
                          {player.name}
                        </span>
                        {isUser && (
                          <span className="px-1.5 py-0.2 bg-violet-600 text-white font-bold text-[9px] rounded-sm tracking-wider uppercase shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 block truncate">{player.board}</span>
                    </div>
                  </div>

                  {/* Specialization Column */}
                  <div className="hidden sm:block sm:col-span-3 min-w-0">
                    <span className="text-zinc-400 truncate block">{player.specialization}</span>
                  </div>

                  {/* Accuracy Column */}
                  <div className="col-span-2 text-center">
                    <span className="text-zinc-300 font-medium">{player.accuracy}%</span>
                  </div>

                  {/* XP Column */}
                  <div className="col-span-3 sm:col-span-1 text-right">
                    <span className="font-semibold text-white tracking-wide">
                      {player.xp.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ─── 4. Persistent User Status Bar ─── */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-4 pt-2 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto bg-[#141418]/95 border border-white/15 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* User Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              #{currentUserData.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{currentUserData.name}</span>
                <span className="text-[11px] text-zinc-400">({currentUserData.board})</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {currentUserData.rank <= 3
                  ? 'Podium Position Secured'
                  : `${pointsToPodium} XP required to enter Top 3`}
              </p>
            </div>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-4 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Your Score</span>
                <span className="text-white font-bold">{currentUserData.xp.toLocaleString()} XP</span>
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Accuracy</span>
                <span className="text-emerald-400 font-bold">{currentUserData.accuracy}%</span>
              </div>
            </div>

            <Link
              href="/tests"
              onClick={() => playButtonClick()}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Practice Mock Test
            </Link>
          </div>

        </div>
      </div>

      {/* ─── 5. Professional Student Profile Modal ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-white">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 text-white font-bold text-base flex items-center justify-center">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-zinc-400">{selectedUser.board}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400 bg-white/[0.06] px-2.5 py-1 rounded-md border border-white/10">
                Rank #{selectedUser.rank}
              </span>
            </div>

            <div className="my-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Primary Specialization</span>
              <span className="text-xs font-medium text-zinc-200 mt-0.5 block">{selectedUser.specialization}</span>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-3 gap-2 text-center my-4">
              <div className="p-2.5 rounded-xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 block uppercase font-medium">XP Points</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{selectedUser.xp.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Accuracy</span>
                <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{selectedUser.accuracy}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Tests</span>
                <span className="text-xs font-bold text-zinc-200 mt-0.5 block">{selectedUser.testsCompleted}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setSelectedUser(null);
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors mt-2 cursor-pointer border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
