'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { playButtonClick } from '@/lib/soundEffects';
import { XpBoltIcon, GemIcon } from '@/components/icons/AppIcons';

interface LeaguePlayer {
  rank: number;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  xp: number;
  change?: 'up' | 'down' | 'same';
  changeAmount?: number;
  isCurrentUser?: boolean;
}

const LEAGUES = [
  { id: 'Bronze', name: 'Bronze', icon: '🥉', color: 'from-amber-600 to-amber-700' },
  { id: 'Silver', name: 'Silver', icon: '🥈', color: 'from-slate-400 to-slate-500' },
  { id: 'Gold', name: 'Gold', icon: '🥇', color: 'from-amber-400 to-amber-500' },
  { id: 'Diamond', name: 'Diamond', icon: '💎', color: 'from-cyan-400 to-blue-600' },
];

export function LeaderboardClient() {
  const { user } = useUser();
  const [activeLeague, setActiveLeague] = useState<string>(user.leagueTier || 'Silver');

  const players: LeaguePlayer[] = [
    { rank: 1, name: 'Ananya Sharma', avatarLetter: 'A', avatarBg: 'bg-amber-400 text-amber-950', xp: 620, change: 'up', changeAmount: 2 },
    { rank: 2, name: 'Rohan Gupta', avatarLetter: 'R', avatarBg: 'bg-indigo-400 text-white', xp: 540, change: 'same' },
    { rank: 3, name: 'Priya Verma', avatarLetter: 'P', avatarBg: 'bg-rose-400 text-white', xp: 480, change: 'up', changeAmount: 1 },
    { rank: 4, name: `${user.name} (You)`, avatarLetter: user.name.charAt(0) || 'U', avatarBg: 'bg-[#8b5cf6] text-white', xp: Math.max(user.xp, 380), change: 'up', changeAmount: 3, isCurrentUser: true },
    { rank: 5, name: 'Devansh Pandey', avatarLetter: 'D', avatarBg: 'bg-teal-400 text-white', xp: 320, change: 'down', changeAmount: 1 },
    { rank: 6, name: 'Sneha Kulkarni', avatarLetter: 'S', avatarBg: 'bg-emerald-400 text-white', xp: 270, change: 'same' },
    { rank: 7, name: 'Kavya Nair', avatarLetter: 'K', avatarBg: 'bg-purple-400 text-white', xp: 230, change: 'down', changeAmount: 2 },
    { rank: 8, name: 'Arjun Singh', avatarLetter: 'A', avatarBg: 'bg-sky-400 text-white', xp: 190, change: 'down', changeAmount: 1 },
    { rank: 9, name: 'Tanvi Joshi', avatarLetter: 'T', avatarBg: 'bg-pink-400 text-white', xp: 150, change: 'same' },
    { rank: 10, name: 'Vikram Mehta', avatarLetter: 'V', avatarBg: 'bg-slate-400 text-white', xp: 110, change: 'down', changeAmount: 3 },
  ];

  const top1 = players[0];
  const top2 = players[1];
  const top3 = players[2];
  const otherPlayers = players.slice(3);

  const currentUserData = players.find((p) => p.isCurrentUser) || players[3];

  return (
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-28 font-sans">
      
      {/* ─── 1. Header Banner & Season Info ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-4 px-4 sm:px-6">
        <div className="max-w-md mx-auto flex flex-col items-center text-center">
          
          {/* League Season Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#e2e8f0] text-xs font-black text-[#6d28d9] shadow-2xs mb-2">
            <span className="material-symbols-outlined text-[15px] text-[#6d28d9]">timer</span>
            <span>Season ends in 2d 14h</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1e293b]">
            {activeLeague} League
          </h1>
          <p className="text-xs font-semibold text-[#64748b] mt-0.5">
            Top 3 advance to Gold League + earn 50 💎
          </p>

          {/* League Switcher Tabs */}
          <div className="w-full flex items-center justify-between gap-1.5 bg-white/80 p-1 rounded-2xl border border-[#e2e8f0] mt-4 shadow-2xs">
            {LEAGUES.map((l) => {
              const isSel = activeLeague === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    playButtonClick();
                    setActiveLeague(l.id);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    isSel
                      ? 'bg-[#7c3aed] text-white shadow-xs scale-102'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span>{l.icon}</span>
                  <span className="hidden xs:inline">{l.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-6">

        {/* ─── 2. Top 3 Winners Podium ─── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-sm">
          <div className="flex items-end justify-center gap-2 sm:gap-4 pt-4">
            
            {/* Rank 2 (Left) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-13 h-13 rounded-2xl bg-slate-200 border-2 border-slate-300 text-slate-700 font-black text-base flex items-center justify-center shadow-xs">
                  {top2.avatarLetter}
                </div>
                <span className="absolute -bottom-2 -right-1 w-5 h-5 rounded-full bg-slate-400 text-white font-black text-[10px] flex items-center justify-center ring-2 ring-white">
                  2
                </span>
              </div>
              <p className="font-heading text-xs font-black text-[#1e293b] truncate max-w-[85px] text-center">
                {top2.name}
              </p>
              <span className="text-[11px] font-extrabold text-[#7c3aed] mt-0.5">
                {top2.xp} XP
              </span>
              <div className="w-full h-16 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-2 border-t-2 border-slate-300 flex items-center justify-center text-slate-400 font-black text-xl">
                🥈
              </div>
            </div>

            {/* Rank 1 (Center - Tallest) */}
            <div className="flex-1 flex flex-col items-center -mt-4">
              <div className="relative mb-2">
                {/* Crown */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl leading-none animate-bounce">
                  👑
                </span>
                <div className="w-16 h-16 rounded-2xl bg-amber-100 border-3 border-amber-400 text-amber-700 font-black text-lg flex items-center justify-center shadow-md">
                  {top1.avatarLetter}
                </div>
                <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center ring-2 ring-white shadow-xs">
                  1
                </span>
              </div>
              <p className="font-heading text-xs font-black text-[#1e293b] truncate max-w-[95px] text-center">
                {top1.name}
              </p>
              <span className="text-xs font-black text-[#7c3aed] mt-0.5">
                {top1.xp} XP
              </span>
              <div className="w-full h-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl mt-2 border-t-2 border-amber-300 flex items-center justify-center text-amber-500 font-black text-2xl shadow-xs">
                🥇
              </div>
            </div>

            {/* Rank 3 (Right) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-13 h-13 rounded-2xl bg-amber-700/10 border-2 border-amber-600/30 text-amber-800 font-black text-base flex items-center justify-center shadow-xs">
                  {top3.avatarLetter}
                </div>
                <span className="absolute -bottom-2 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-black text-[10px] flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              </div>
              <p className="font-heading text-xs font-black text-[#1e293b] truncate max-w-[85px] text-center">
                {top3.name}
              </p>
              <span className="text-[11px] font-extrabold text-[#7c3aed] mt-0.5">
                {top3.xp} XP
              </span>
              <div className="w-full h-12 bg-gradient-to-t from-amber-700/20 to-amber-700/10 rounded-t-2xl mt-2 border-t-2 border-amber-700/30 flex items-center justify-center text-amber-700 font-black text-xl">
                🥉
              </div>
            </div>

          </div>
        </div>

        {/* ─── 3. Promotion Zone Notice ─── */}
        <div className="bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#065f46] rounded-2xl px-3.5 py-2.5 text-xs font-black flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#059669]">trending_up</span>
            <span>Promotion Zone: Rank 1 - 3</span>
          </div>
          <span className="text-[10px] bg-[#059669] text-white px-2 py-0.5 rounded-full">
            +50 💎
          </span>
        </div>

        {/* ─── 4. Remaining Player List ─── */}
        <div className="bg-white rounded-3xl border-2 border-[#e2e8f0] shadow-sm overflow-hidden divide-y divide-[#f1f5f9]">
          {otherPlayers.map((p) => {
            const isDemotion = p.rank >= 8;

            return (
              <div
                key={p.rank}
                className={`p-3.5 flex items-center justify-between transition-colors ${
                  p.isCurrentUser
                    ? 'bg-[#ede9fe] border-l-4 border-l-[#7c3aed]'
                    : 'hover:bg-[#f8fafc]'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-heading font-black text-sm text-[#64748b]">
                    {p.rank}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shadow-2xs ${p.avatarBg}`}
                  >
                    {p.avatarLetter}
                  </div>

                  <div>
                    <h4 className={`text-xs sm:text-sm font-black ${p.isCurrentUser ? 'text-[#6d28d9]' : 'text-[#1e293b]'}`}>
                      {p.name}
                    </h4>
                    {p.isCurrentUser && (
                      <span className="text-[10px] text-[#7c3aed] font-bold block">
                        {p.rank <= 3 ? '🎉 In Promotion Zone!' : '100 XP to Top 3'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: XP Score */}
                <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-[#1e293b]">
                  <XpBoltIcon size={18} />
                  <span>{p.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demotion notice at bottom */}
        <div className="bg-[#fff1f2] border border-[#fecdd3] text-[#9f1239] rounded-2xl px-3.5 py-2 text-[11px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#e11d48]">trending_down</span>
          <span>Demotion Zone: Rank 8 - 10 will drop to Bronze League</span>
        </div>

      </div>

      {/* ─── 5. Sticky Floating Current User Rank Bar ─── */}
      <div className="fixed bottom-18 left-0 w-full px-4 z-30 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-[#1e1b4b] text-white rounded-2xl p-3 shadow-xl border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white font-black text-xs flex items-center justify-center shadow-2xs">
              #{currentUserData.rank}
            </span>
            <div>
              <p className="text-xs font-black">{currentUserData.name}</p>
              <p className="text-[10px] text-[#c4b5fd]">You are in {activeLeague} League</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-black text-xs bg-white/10 px-3 py-1.5 rounded-xl">
            <XpBoltIcon size={16} />
            <span>{currentUserData.xp} XP</span>
          </div>
        </div>
      </div>

    </main>
  );
}
