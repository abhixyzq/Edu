'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUser, LEAGUES, getLeagueByXP, LeagueInfo } from '@/context/UserContext';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

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
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);

  // Current League info based on user XP
  const currentLeague: LeagueInfo = useMemo(() => {
    return getLeagueByXP(user.xp);
  }, [user.xp]);

  const currentLeagueIndex = useMemo(() => {
    return LEAGUES.findIndex((l) => l.id === currentLeague.id);
  }, [currentLeague]);

  const nextLeague: LeagueInfo | null = useMemo(() => {
    if (currentLeagueIndex < LEAGUES.length - 1) {
      return LEAGUES[currentLeagueIndex + 1];
    }
    return null;
  }, [currentLeagueIndex]);

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
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-32 font-sans select-none overflow-x-hidden">
      
      {/* ─── 1. Header Hero (Clean Light Purple Theme) ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-3 pb-3 px-3.5 sm:px-6">
        <div className="max-w-md mx-auto space-y-2">
          
          {/* Header Row: Title + League Badge (Clickable) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg sm:text-xl font-black text-[#1e293b] leading-none tracking-tight">
                Leaderboard
              </h1>
              
              {/* Clickable League Badge with Emoji */}
              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  setIsLeagueModalOpen(true);
                }}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-violet-50 text-[#6d28d9] border-2 border-[#c4b5fd] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="View All 8 Leagues"
              >
                <span>{currentLeague.emoji}</span>
                <span>{currentLeague.name}</span>
                <span className="text-[9px] text-[#7c3aed]">ℹ️</span>
              </button>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
              <span>⏱️</span>
              <span>2d 14h left</span>
            </div>
          </div>

          {/* Timeframe Tabs (Segmented Control) */}
          <div className="bg-white/90 p-0.5 rounded-2xl border-2 border-[#e2e8f0] shadow-2xs flex items-center">
            {(['weekly', 'monthly', 'alltime'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  playButtonClick();
                  setTimeframe(tf);
                }}
                className={`flex-1 py-1 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#1e293b]'
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
                className={`px-3 py-1 rounded-xl text-[10px] font-black shrink-0 transition-all cursor-pointer border-b-2 active:border-b-0 active:translate-y-0.5 ${
                  selectedBoard === b.id
                    ? 'bg-[#1e1b4b] text-white border-black shadow-xs'
                    : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-slate-50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-md mx-auto px-3.5 sm:px-6 space-y-2.5 mt-1">

        {/* ─── 2. Compact 3D Olympic Micro-Podium Strip (Light Duolingo-Style) ─── */}
        {top1 && (
          <div className="bg-white rounded-3xl p-3 border-2 border-b-4 border-[#e2e8f0] shadow-sm">
            <div className="text-center mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Top 3 Podium
              </span>
            </div>

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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-300 border-2 border-slate-300 p-0.5 flex items-center justify-center overflow-hidden shadow-xs">
                      {top2.avatarUrl || (top2.isCurrentUser && user.avatarUrl) ? (
                        <img src={top2.avatarUrl || user.avatarUrl} alt={top2.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-xs font-black text-slate-700">{top2.avatar}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 border-2 border-white text-slate-800 font-black text-[10px] flex items-center justify-center shadow-2xs">
                      2
                    </span>
                  </div>

                  <p className="text-[11px] font-black text-slate-900 truncate max-w-[85px] leading-tight">
                    {top2.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-bold text-[#7c3aed] truncate max-w-[85px]">
                    @{top2.username}
                  </p>

                  <div className="w-full mt-1 py-0.5 px-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <span className="text-[10px] font-black text-slate-700">{top2.xp} <span className="text-[8px] text-slate-400 font-normal">XP</span></span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Champion) */}
              <div
                onClick={() => {
                  playButtonClick();
                  setSelectedUser(top1);
                }}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-all text-center"
              >
                <div className="relative mb-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-2 border-amber-300 p-0.5 shadow-md shadow-amber-200 flex items-center justify-center overflow-hidden">
                    {top1.avatarUrl || (top1.isCurrentUser && user.avatarUrl) ? (
                      <img src={top1.avatarUrl || user.avatarUrl} alt={top1.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-sm font-black text-amber-950">{top1.avatar}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-amber-400 border-2 border-white text-amber-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>

                <p className="text-[11px] font-black text-amber-950 truncate max-w-[90px] leading-tight">
                  {top1.name.split(' ')[0]}
                </p>
                <p className="text-[9px] font-bold text-amber-700 truncate max-w-[90px]">
                  @{top1.username}
                </p>

                <div className="w-full mt-1 py-0.5 px-1 rounded-xl bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center shadow-2xs">
                  <span className="text-[10px] font-black text-amber-950">{top1.xp} <span className="text-[8px] text-amber-800 font-normal">XP</span></span>
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700/60 to-amber-900/60 border-2 border-amber-600/40 p-0.5 flex items-center justify-center overflow-hidden shadow-xs">
                      {top3.avatarUrl || (top3.isCurrentUser && user.avatarUrl) ? (
                        <img src={top3.avatarUrl || user.avatarUrl} alt={top3.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-xs font-black text-amber-100">{top3.avatar}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 border-2 border-white text-white font-black text-[10px] flex items-center justify-center shadow-2xs">
                      3
                    </span>
                  </div>

                  <p className="text-[11px] font-black text-slate-900 truncate max-w-[85px] leading-tight">
                    {top3.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-bold text-amber-800 truncate max-w-[85px]">
                    @{top3.username}
                  </p>

                  <div className="w-full mt-1 py-0.5 px-1 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <span className="text-[10px] font-black text-amber-900">{top3.xp} <span className="text-[8px] text-amber-700 font-normal">XP</span></span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ─── 3. High-Density Roster Feed with Duolingo-style Promotion & Demotion Zones (Light Theme) ─── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              15 Scholars • {currentLeague.emoji} {currentLeague.name}
            </span>
            <span className="text-[10px] text-emerald-600 font-black">
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
                  className={`w-full rounded-2xl px-3 py-2 flex items-center justify-between gap-2.5 border-2 border-b-4 transition-all cursor-pointer active:scale-98 ${
                    isUser
                      ? 'bg-violet-50 border-[#7c3aed] shadow-sm ring-2 ring-violet-400/30'
                      : isPromotion
                      ? 'bg-white border-emerald-200 hover:border-emerald-300'
                      : isDemotion
                      ? 'bg-white border-rose-200 hover:border-rose-300'
                      : 'bg-white border-[#e2e8f0] hover:border-slate-300'
                  }`}
                >
                  {/* Left: Rank & Avatar & Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank Number with Zone Color */}
                    <div className="w-5 text-center flex flex-col items-center">
                      <span className={`font-heading font-black text-xs ${
                        isUser 
                          ? 'text-[#7c3aed]' 
                          : isPromotion 
                          ? 'text-emerald-600' 
                          : isDemotion 
                          ? 'text-rose-500' 
                          : 'text-slate-400'
                      }`}>
                        #{player.rank}
                      </span>
                    </div>

                    {/* Avatar Thumbnail */}
                    <div className={`w-8 h-8 rounded-xl bg-slate-100 border flex items-center justify-center font-bold text-[11px] text-slate-700 overflow-hidden shrink-0 ${
                      isPromotion ? 'border-emerald-300' : isDemotion ? 'border-rose-300' : 'border-slate-200'
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
                        <h4 className={`text-xs font-black truncate leading-none ${isUser ? 'text-[#6d28d9]' : 'text-slate-900'}`}>
                          {player.name}
                        </h4>
                        {isUser && (
                          <span className="px-1.5 py-0.2 rounded-md bg-[#7c3aed] text-white text-[8px] font-black uppercase tracking-tight">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-bold text-[#7c3aed] truncate leading-tight">
                          @{player.username}
                        </span>
                        <span className="text-[8px] text-slate-300">•</span>
                        <span className="text-[10px] font-medium text-slate-400 truncate leading-tight">
                          {player.board.replace(' Class 12', '').replace(' (BSEB)', '')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & Trend */}
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="font-heading text-xs font-black text-slate-900 leading-tight">
                        {player.xp.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">XP</span>
                      </span>
                      
                      <div className="flex items-center gap-1 mt-0.5">
                        {player.trend === 'up' && (
                          <span className="text-[9px] font-bold text-emerald-600">▲{player.trendValue}</span>
                        )}
                        {player.trend === 'down' && (
                          <span className="text-[9px] font-bold text-rose-500">▼{player.trendValue}</span>
                        )}
                        {player.trend === 'neutral' && (
                          <span className="text-[9px] text-slate-400">—</span>
                        )}
                        <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1 rounded-xs">
                          {player.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 🟢 Duolingo Green Promotion Zone Divider Line after Rank #7 */}
                {player.rank === 7 && (
                  <div className="my-2 py-1.5 px-3 rounded-2xl bg-emerald-100/80 border-2 border-emerald-300 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                      <span className="text-xs">🟢</span>
                      <span>Promotion Zone (Top 7 Advance)</span>
                    </div>
                    <span className="text-[9px] font-black text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                      {nextLeague ? `${nextLeague.emoji} ${nextLeague.name} ⬆` : 'Max League 🌟'}
                    </span>
                  </div>
                )}

                {/* 🔴 Demotion Zone Divider Line before Rank #13 */}
                {player.rank === 12 && (
                  <div className="my-2 py-1.5 px-3 rounded-2xl bg-rose-100/80 border-2 border-rose-300 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-900 uppercase tracking-wider">
                      <span className="text-xs">🔴</span>
                      <span>Demotion Zone (Bottom 3 Drop)</span>
                    </div>
                    <span className="text-[9px] font-black text-rose-800 bg-white/80 px-2 py-0.5 rounded-full border border-rose-300 shadow-2xs">
                      Relegation ⬇
                    </span>
                  </div>
                )}

              </React.Fragment>
            );
          })}
        </div>

      </div>

      {/* ─── 4. Compact Sticky Bottom "Your Standing" Dock (Light Frosted Theme) ─── */}
      <div className="fixed bottom-16 left-0 w-full px-3.5 pb-1 z-30 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-white/95 text-slate-900 rounded-3xl px-3.5 py-2.5 shadow-2xl border-2 border-[#c4b5fd] backdrop-blur-xl flex items-center justify-between gap-2.5">
          
          {/* User Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-[11px] overflow-hidden shrink-0 ${
              currentUserData.rank <= 7
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : currentUserData.rank >= 13
                ? 'bg-rose-100 border-rose-300 text-rose-800'
                : 'bg-violet-100 border-violet-300 text-violet-800'
            }`}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>#{currentUserData.rank}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-black text-slate-900 truncate">{currentUserData.name}</span>
                <span className="text-[10px] font-bold text-[#7c3aed]">@{currentUserData.username}</span>
              </div>
              <p className="text-[10px] truncate mt-0.5">
                {currentUserData.rank <= 7 ? (
                  <span className="text-emerald-700 font-bold">🟢 Promoting to {nextLeague ? nextLeague.name : 'Nainix'} (# {currentUserData.rank})</span>
                ) : currentUserData.rank >= 13 ? (
                  <span className="text-rose-600 font-bold">🔴 Danger • +{pointsToAvoidDemote} XP to safe</span>
                ) : (
                  <span className="text-slate-500 font-semibold">🔥 +{pointsToPromote} XP to reach Top 7</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <Link
            href="/tests"
            onClick={playButtonClick}
            className="px-3.5 py-1.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs transition-all active:scale-95 shadow-md shrink-0 flex items-center gap-1"
          >
            <span>Practice</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>

        </div>
      </div>

      {/* ─── 5. All 8 Leagues Modal (Progression Roadmap) ─── */}
      {isLeagueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-slate-900 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>All 8 Leagues Roadmap</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Top 7 users advance to next league each week
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  setIsLeagueModalOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 8 League Cards List */}
            <div className="space-y-2 my-3.5">
              {LEAGUES.map((league, idx) => {
                const isCurrent = league.id === currentLeague.id;
                const isUnlocked = user.xp >= league.minXp;

                return (
                  <div
                    key={league.id}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-[#ede9fe] border-[#7c3aed] shadow-xs'
                        : isUnlocked
                        ? 'bg-slate-50 border-[#e2e8f0]'
                        : 'bg-slate-50/50 border-[#e2e8f0] opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                        {league.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {league.name}
                          </h4>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#7c3aed] text-white text-[8px] font-black uppercase">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {league.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-black text-amber-700 block">
                        {league.minXp} XP
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase font-black">
                        Tier {idx + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setIsLeagueModalOpen(false);
              }}
              className="w-full py-2.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ─── 6. Candidate Detail Inspection Modal ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-slate-900">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-black text-base flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-xs">
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
                  <h3 className="font-heading font-black text-sm text-slate-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-[11px] font-bold text-[#7c3aed]">
                    @{selectedUser.username}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {selectedUser.board}
                  </p>
                </div>
              </div>
              
              <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                selectedUser.rank <= 7
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
                  : selectedUser.rank >= 13
                  ? 'text-rose-800 bg-rose-100 border-rose-300'
                  : 'text-slate-700 bg-slate-100 border-slate-200'
              }`}>
                Rank #{selectedUser.rank}
              </span>
            </div>

            {/* Status Zone Banner in Modal */}
            <div className={`my-2 p-2 rounded-2xl border text-center ${
              selectedUser.rank <= 7
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : selectedUser.rank >= 13
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-wider">
                {selectedUser.rank <= 7 
                  ? `🟢 Promotion Zone • Advancing to ${nextLeague ? nextLeague.name : 'Nainix League'}` 
                  : selectedUser.rank >= 13 
                  ? '🔴 Relegation Zone • Risk of Demotion' 
                  : '⚪ Safe Zone • Retaining Current League'}
              </span>
            </div>

            {/* Specialization */}
            <div className="my-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[9px] uppercase font-black text-slate-400 block">
                Focus Area
              </span>
              <span className="text-xs font-black text-slate-800 mt-0.5 block">
                {selectedUser.specialization}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center my-2.5">
              <div className="p-2 rounded-xl bg-violet-50/70 border border-violet-200">
                <span className="text-[9px] text-[#7c3aed] uppercase font-black block">XP</span>
                <span className="text-xs font-black text-violet-950 mt-0.5 block">{selectedUser.xp.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[9px] text-emerald-600 uppercase font-black block">Accuracy</span>
                <span className="text-xs font-black text-emerald-950 mt-0.5 block">{selectedUser.accuracy}%</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[9px] text-amber-600 uppercase font-black block">Streak</span>
                <span className="text-xs font-black text-amber-950 mt-0.5 block">{selectedUser.streak} Days</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setSelectedUser(null);
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
