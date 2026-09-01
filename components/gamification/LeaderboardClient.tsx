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
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);

  // Mock competitive 15-student league roster
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
      {
        id: 'usr-13',
        rank: 13,
        name: 'Vikas Yadav',
        username: 'vikas_up',
        avatar: 'VY',
        board: 'UP Board',
        specialization: 'Magnetism & Optics',
        xp: 940,
        accuracy: 73.5,
        streak: 2,
        testsCompleted: 9,
        trend: 'down',
        trendValue: 1,
      },
      {
        id: 'usr-14',
        rank: 14,
        name: 'Riya Sen',
        username: 'riya_cbse',
        avatar: 'RS',
        board: 'CBSE Class 12',
        specialization: 'Organic Reactions',
        xp: 860,
        accuracy: 70.0,
        streak: 1,
        testsCompleted: 7,
        trend: 'down',
        trendValue: 2,
      },
      {
        id: 'usr-15',
        rank: 15,
        name: 'Suraj Paswan',
        username: 'suraj_bseb',
        avatar: 'SP',
        board: 'Bihar Board (BSEB)',
        specialization: 'Thermodynamics',
        xp: 750,
        accuracy: 67.5,
        streak: 1,
        testsCompleted: 6,
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

    return list;
  }, [rawRoster, selectedBoard]);

  const top1 = filteredList.find((u) => u.rank === 1);
  const top2 = filteredList.find((u) => u.rank === 2);
  const top3 = filteredList.find((u) => u.rank === 3);
  const remainingPlayers = filteredList.filter((u) => u.rank > 3);

  const currentUserData = useMemo(() => {
    return rawRoster.find((u) => u.isCurrentUser) || rawRoster[3];
  }, [rawRoster]);

  const rank7Player = useMemo(() => {
    return rawRoster.find((u) => u.rank === 7);
  }, [rawRoster]);

  const rank12Player = useMemo(() => {
    return rawRoster.find((u) => u.rank === 12);
  }, [rawRoster]);

  const pointsToPromote = useMemo(() => {
    if (!rank7Player) return 0;
    return Math.max(0, rank7Player.xp - currentUserData.xp + 10);
  }, [rank7Player, currentUserData]);

  const pointsToAvoidDemote = useMemo(() => {
    if (!rank12Player) return 0;
    return Math.max(0, rank12Player.xp - currentUserData.xp + 10);
  }, [rank12Player, currentUserData]);

  return (
    <main className="w-full min-h-screen bg-[#09090b] text-white pb-28 font-sans select-none overflow-x-hidden relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-violet-600/15 via-indigo-600/5 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* ─── 1. Tighter Top Header & Compact Controls ─── */}
      <div className="w-full pt-3 pb-2 px-3.5 sm:px-6">
        <div className="max-w-md mx-auto space-y-2">
          
          {/* Header Row: Title + League Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg sm:text-xl font-black text-white leading-none tracking-tight">
                Rankings
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Top 7 Promote 🟢
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
              <span>⏱️</span>
              <span>2d 14h left</span>
            </div>
          </div>

          {/* Timeframe Tabs (Full-width Segmented Control) */}
          <div className="bg-[#141418] p-0.5 rounded-xl border border-white/10 flex items-center">
            {(['weekly', 'monthly', 'alltime'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  playButtonClick();
                  setTimeframe(tf);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-violet-600 text-white shadow-xs font-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf === 'alltime' ? 'All Time' : tf}
              </button>
            ))}
          </div>

          {/* Board Filter Horizontal Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
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
                className={`px-3 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedBoard === b.id
                    ? 'bg-white/20 text-white border-white/40 font-black'
                    : 'bg-[#141418] text-zinc-400 border-white/5 hover:text-zinc-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-md mx-auto px-3.5 sm:px-6 space-y-2 mt-1">

        {/* ─── 2. Compact Horizontal Micro-Podium Strip (Zero Wasted Space) ─── */}
        {top1 && (
          <div className="bg-[#121216] rounded-2xl p-2.5 sm:p-3 border border-white/10 shadow-xl relative overflow-hidden">
            
            <div className="grid grid-cols-3 gap-1.5 items-end pt-1 pb-0.5">
              
              {/* Rank 2 (Silver) */}
              {top2 && (
                <div
                  onClick={() => {
                    playButtonClick();
                    setSelectedUser(top2);
                  }}
                  className="flex flex-col items-center cursor-pointer active:scale-95 transition-all text-center"
                >
                  <div className="relative mb-1">
                    <div className="w-11 h-11 rounded-xl bg-[#1e2029] border border-slate-400/60 p-0.5 flex items-center justify-center overflow-hidden">
                      {top2.avatarUrl || (top2.isCurrentUser && user.avatarUrl) ? (
                        <img src={top2.avatarUrl || user.avatarUrl} alt={top2.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-xs font-black text-slate-300">{top2.avatar}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-700 border border-slate-400 text-white font-black text-[9px] flex items-center justify-center">
                      2
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-white truncate max-w-[85px] leading-tight">
                    {top2.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-bold text-violet-400 truncate max-w-[85px]">
                    @{top2.username}
                  </p>

                  <div className="w-full mt-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-200">{top2.xp} <span className="text-[8px] text-zinc-500 font-normal">XP</span></span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Champion) - Clean Avatar without crown emoji */}
              <div
                onClick={() => {
                  playButtonClick();
                  setSelectedUser(top1);
                }}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-all text-center"
              >
                <div className="relative mb-1">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-[#2a2212] via-[#1c1810] to-[#12100a] border-2 border-amber-400/80 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center overflow-hidden">
                    {top1.avatarUrl || (top1.isCurrentUser && user.avatarUrl) ? (
                      <img src={top1.avatarUrl || user.avatarUrl} alt={top1.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-sm font-black text-amber-300">{top1.avatar}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border border-amber-300 text-amber-950 font-black text-[10px] flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>

                <p className="text-[11px] font-black text-amber-200 truncate max-w-[90px] leading-tight">
                  {top1.name.split(' ')[0]}
                </p>
                <p className="text-[9px] font-bold text-amber-400 truncate max-w-[90px]">
                  @{top1.username}
                </p>

                <div className="w-full mt-1 py-1 px-1 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-[10px] font-black text-amber-300">{top1.xp} <span className="text-[8px] text-amber-400/70 font-normal">XP</span></span>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              {top3 && (
                <div
                  onClick={() => {
                    playButtonClick();
                    setSelectedUser(top3);
                  }}
                  className="flex flex-col items-center cursor-pointer active:scale-95 transition-all text-center"
                >
                  <div className="relative mb-1">
                    <div className="w-11 h-11 rounded-xl bg-[#1c1510] border border-amber-800/60 p-0.5 flex items-center justify-center overflow-hidden">
                      {top3.avatarUrl || (top3.isCurrentUser && user.avatarUrl) ? (
                        <img src={top3.avatarUrl || user.avatarUrl} alt={top3.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-xs font-black text-amber-400">{top3.avatar}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-900 border border-amber-600 text-amber-200 font-black text-[9px] flex items-center justify-center">
                      3
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-white truncate max-w-[85px] leading-tight">
                    {top3.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-bold text-amber-500 truncate max-w-[85px]">
                    @{top3.username}
                  </p>

                  <div className="w-full mt-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-300">{top3.xp} <span className="text-[8px] text-zinc-500 font-normal">XP</span></span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ─── 3. High-Density Roster Feed with Duolingo-style Promotion & Demotion Zones ─── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              15 Scholars League
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              Top 7 Advance 🟢
            </span>
          </div>

          {remainingPlayers.map((player) => {
            const isUser = player.isCurrentUser;
            const isPromotion = player.rank <= 7;
            const isDemotion = player.rank >= 13;

            return (
              <React.Fragment key={player.id}>
                
                {/* Candidate Row Card */}
                <div
                  onClick={() => {
                    playButtonClick();
                    setSelectedUser(player);
                  }}
                  className={`w-full rounded-xl px-2.5 py-2 flex items-center justify-between gap-2.5 border transition-all cursor-pointer active:scale-98 ${
                    isUser
                      ? 'bg-violet-950/40 border-violet-500/60 shadow-[0_0_15px_rgba(124,58,237,0.2)] ring-1 ring-violet-500/40'
                      : isPromotion
                      ? 'bg-[#121216] border-emerald-500/20 hover:border-emerald-500/40'
                      : isDemotion
                      ? 'bg-[#141010] border-rose-500/20 hover:border-rose-500/40'
                      : 'bg-[#121216] border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  {/* Left: Rank & Avatar & Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank Number with Zone Color */}
                    <div className="w-5 text-center flex flex-col items-center">
                      <span className={`font-heading font-black text-xs ${
                        isUser 
                          ? 'text-violet-400' 
                          : isPromotion 
                          ? 'text-emerald-400' 
                          : isDemotion 
                          ? 'text-rose-400' 
                          : 'text-zinc-400'
                      }`}>
                        #{player.rank}
                      </span>
                    </div>

                    {/* Avatar Thumbnail */}
                    <div className={`w-8 h-8 rounded-lg bg-zinc-800 border flex items-center justify-center font-bold text-[11px] text-zinc-300 overflow-hidden shrink-0 ${
                      isPromotion ? 'border-emerald-500/30' : isDemotion ? 'border-rose-500/30' : 'border-white/10'
                    }`}>
                      {player.avatarUrl || (isUser && user.avatarUrl) ? (
                        <img src={player.avatarUrl || user.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        player.avatar
                      )}
                    </div>

                    {/* Name, Handle & Board */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs font-bold truncate leading-none ${isUser ? 'text-white font-black' : 'text-zinc-200'}`}>
                          {player.name}
                        </h4>
                        {isUser && (
                          <span className="px-1 py-0.2 rounded-sm bg-violet-600 text-white text-[8px] font-black uppercase tracking-tight">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-bold text-violet-400 truncate leading-tight">
                          @{player.username}
                        </span>
                        <span className="text-[8px] text-zinc-600">•</span>
                        <span className="text-[10px] font-medium text-zinc-400 truncate leading-tight">
                          {player.board.replace(' Class 12', '').replace(' (BSEB)', '')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & Trend */}
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="font-heading text-xs font-black text-white leading-tight">
                        {player.xp.toLocaleString()} <span className="text-[9px] font-normal text-zinc-500">XP</span>
                      </span>
                      
                      <div className="flex items-center gap-1 mt-0.5">
                        {player.trend === 'up' && (
                          <span className="text-[9px] font-bold text-emerald-400">▲{player.trendValue}</span>
                        )}
                        {player.trend === 'down' && (
                          <span className="text-[9px] font-bold text-rose-400">▼{player.trendValue}</span>
                        )}
                        {player.trend === 'neutral' && (
                          <span className="text-[9px] text-zinc-500">—</span>
                        )}
                        <span className="text-[8px] font-medium text-zinc-400 bg-white/[0.05] px-1 rounded-xs">
                          {player.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 🟢 Duolingo Green Promotion Zone Divider Line after Rank #7 */}
                {player.rank === 7 && (
                  <div className="my-2 py-1 px-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                      <span className="text-xs">🟢</span>
                      <span>Promotion Zone (Top 7 Advance)</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-sm">
                      Next League ⬆
                    </span>
                  </div>
                )}

                {/* 🔴 Demotion Zone Divider Line before Rank #13 */}
                {player.rank === 12 && (
                  <div className="my-2 py-1 px-3 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-between shadow-[0_0_10px_rgba(244,63,94,0.15)]">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-300 uppercase tracking-wider">
                      <span className="text-xs">🔴</span>
                      <span>Demotion Zone (Bottom 3 Drop)</span>
                    </div>
                    <span className="text-[9px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded-sm">
                      Relegation ⬇
                    </span>
                  </div>
                )}

              </React.Fragment>
            );
          })}
        </div>

      </div>

      {/* ─── 4. Compact Sticky Bottom "Your Standing" Dock ─── */}
      <div className="fixed bottom-16 left-0 w-full px-3.5 pb-1 z-30 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-[#141418]/95 text-white rounded-2xl px-3 py-2.5 shadow-2xl border border-white/15 backdrop-blur-xl flex items-center justify-between gap-2.5">
          
          {/* User Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-[11px] overflow-hidden shrink-0 ${
              currentUserData.rank <= 7
                ? 'bg-emerald-600/30 border-emerald-400/60 text-emerald-300'
                : currentUserData.rank >= 13
                ? 'bg-rose-600/30 border-rose-400/60 text-rose-300'
                : 'bg-zinc-800 border-white/20 text-white'
            }`}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>#{currentUserData.rank}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold text-white truncate">{currentUserData.name}</span>
                <span className="text-[10px] font-bold text-violet-400">@{currentUserData.username}</span>
              </div>
              <p className="text-[10px] truncate mt-0.5">
                {currentUserData.rank <= 7 ? (
                  <span className="text-emerald-400 font-bold">🟢 In Promotion Zone (# {currentUserData.rank})</span>
                ) : currentUserData.rank >= 13 ? (
                  <span className="text-rose-400 font-bold">🔴 Danger • +{pointsToAvoidDemote} XP to safe</span>
                ) : (
                  <span className="text-zinc-300">🔥 +{pointsToPromote} XP to reach Top 7</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <Link
            href="/tests"
            onClick={playButtonClick}
            className={`px-3 py-1.5 rounded-xl text-white font-bold text-xs transition-all active:scale-95 shadow-md shrink-0 flex items-center gap-1 ${
              currentUserData.rank <= 7 ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-violet-600 hover:bg-violet-500'
            }`}
          >
            <span>Practice</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>

        </div>
      </div>

      {/* ─── 5. Candidate Detail Inspection Modal (Dark Sheet) ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-[#141418] rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-white/15 animate-in slide-in-from-bottom-5 duration-200 text-white">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white font-black text-sm flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
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
                  <p className="text-[11px] font-bold text-violet-400">
                    @{selectedUser.username}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {selectedUser.board}
                  </p>
                </div>
              </div>
              
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                selectedUser.rank <= 7
                  ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                  : selectedUser.rank >= 13
                  ? 'text-rose-300 bg-rose-950/60 border-rose-500/40'
                  : 'text-zinc-300 bg-white/10 border-white/15'
              }`}>
                Rank #{selectedUser.rank}
              </span>
            </div>

            {/* Status Zone Banner in Modal */}
            <div className={`my-2 p-2 rounded-xl border text-center ${
              selectedUser.rank <= 7
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : selectedUser.rank >= 13
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                : 'bg-white/[0.03] border-white/[0.06] text-zinc-400'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-wider">
                {selectedUser.rank <= 7 ? '🟢 Promotion Zone • Advancing to Next League' : selectedUser.rank >= 13 ? '🔴 Relegation Zone • Risk of Demotion' : '⚪ Safe Zone • Retaining Current League'}
              </span>
            </div>

            {/* Specialization */}
            <div className="my-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[9px] uppercase font-bold text-zinc-400 block">
                Focus Area
              </span>
              <span className="text-xs font-semibold text-zinc-200 mt-0.5 block">
                {selectedUser.specialization}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center my-2.5">
              <div className="p-2 rounded-xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[9px] text-zinc-400 uppercase font-bold block">XP</span>
                <span className="text-xs font-black text-white mt-0.5 block">{selectedUser.xp.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[9px] text-emerald-400 uppercase font-bold block">Accuracy</span>
                <span className="text-xs font-black text-emerald-400 mt-0.5 block">{selectedUser.accuracy}%</span>
              </div>
              <div className="p-2 rounded-xl bg-[#18181c] border border-white/[0.06]">
                <span className="text-[9px] text-amber-400 uppercase font-bold block">Streak</span>
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
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/10 mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
