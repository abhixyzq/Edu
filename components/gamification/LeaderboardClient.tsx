'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Mascot } from './Mascot';

interface LeaguePlayer {
  rank: number;
  name: string;
  avatarLetter: string;
  xp: number;
  isCurrentUser?: boolean;
}

const LEAGUES = [
  { id: 'Bronze', name: 'Bronze League', icon: 'military_tech', color: 'from-[#cd7f32] to-[#8c501e]' },
  { id: 'Silver', name: 'Silver League', icon: 'workspace_premium', color: 'from-[#c0c0c0] to-[#7f7f7f]' },
  { id: 'Gold', name: 'Gold League', icon: 'hotel_class', color: 'from-[#ffd700] to-[#b8860b]' },
  { id: 'Diamond', name: 'Diamond League', icon: 'diamond', color: 'from-[#00b4d8] to-[#0077b6]' },
];

export function LeaderboardClient() {
  const { user } = useUser();
  const [activeLeague, setActiveLeague] = useState<string>(user.leagueTier || 'Silver');

  const players: LeaguePlayer[] = [
    { rank: 1, name: 'Ananya Sharma', avatarLetter: 'A', xp: 580 },
    { rank: 2, name: 'Rohan Gupta', avatarLetter: 'R', xp: 490 },
    { rank: 3, name: 'Priya Verma', avatarLetter: 'P', xp: 440 },
    { rank: 4, name: `${user.name} (You)`, avatarLetter: user.name.charAt(0) || 'S', xp: user.xp, isCurrentUser: true },
    { rank: 5, name: 'Devansh Pandey', avatarLetter: 'D', xp: 310 },
    { rank: 6, name: 'Sneha Kulkarni', avatarLetter: 'S', xp: 270 },
    { rank: 7, name: 'Kavya Nair', avatarLetter: 'K', xp: 230 },
    { rank: 8, name: 'Arjun Singh', avatarLetter: 'A', xp: 190 },
    { rank: 9, name: 'Tanvi Joshi', avatarLetter: 'T', xp: 150 },
    { rank: 10, name: 'Vikram Mehta', avatarLetter: 'V', xp: 110 },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16 font-sans">
      {/* League Header */}
      <div className="bg-gradient-to-r from-[#ffd700] via-[#ff8c42] to-[#ba5600] text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b-6 border-[#823b00]">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ffdbc9]">Weekly Rankings</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black">{activeLeague} League</h1>
          <p className="text-xs sm:text-sm text-[#ffdbc9] mt-1">
            Top 3 advance to the next league! 2 days remaining.
          </p>
        </div>
        <Mascot mood="cheering" size={110} />
      </div>

      {/* League Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {LEAGUES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveLeague(l.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
              activeLeague === l.id
                ? 'bg-[#9b4500] text-white border-[#6a2d00] shadow-md scale-105'
                : 'bg-white text-[#564338] border-[#dde4e6] hover:bg-[#ffdbc9]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{l.icon}</span>
            <span>{l.name}</span>
          </button>
        ))}
      </div>

      {/* Promotion Zone Info */}
      <div className="bg-[#d7ffb8] border border-[#58cc02] text-[#2b6401] rounded-2xl p-3 mb-4 text-xs font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">trending_up</span>
        <span>Promotion Zone: Top 3 advance to the next league + earn 50 Gems!</span>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border-2 border-[#dde4e6] shadow-sm overflow-hidden divide-y divide-[#dde4e6]">
        {players.map((p) => {
          let rankBadge = `${p.rank}`;
          let rankColor = 'text-[#564338]';
          if (p.rank === 1) { rankColor = 'text-[#ffd700] font-black text-base'; }
          if (p.rank === 2) { rankColor = 'text-[#c0c0c0] font-black text-base'; }
          if (p.rank === 3) { rankColor = 'text-[#cd7f32] font-black text-base'; }

          return (
            <div
              key={p.rank}
              className={`p-4 flex items-center justify-between transition-colors ${
                p.isCurrentUser ? 'bg-[#ffdbc9]/40 font-bold border-l-4 border-l-[#ff8c42]' : 'hover:bg-[#f4fafd]'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 text-center font-heading font-extrabold ${rankColor}`}>
                  {rankBadge}
                </span>

                <div className="w-10 h-10 rounded-full border-2 border-[#ff8c42] bg-[#ffdbc9] text-[#6a2d00] font-black text-sm flex items-center justify-center shadow-xs">
                  {p.avatarLetter}
                </div>

                <div>
                  <h4 className={`text-sm font-extrabold ${p.isCurrentUser ? 'text-[#9b4500]' : 'text-[#161d1f]'}`}>
                    {p.name}
                  </h4>
                  {p.isCurrentUser && (
                    <span className="text-[10px] text-[#897266]">Keep learning to reach Top 3!</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-black text-sm text-[#564338]">
                <span className="material-symbols-outlined text-[18px] text-[#ffd700]">bolt</span>
                <span>{p.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
