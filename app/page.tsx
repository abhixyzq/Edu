'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { BOARDS } from '@/lib/mockData';
import { LearningPath } from '@/components/gamification/LearningPath';
import { Mascot } from '@/components/gamification/Mascot';

export default function HomePage() {
  const { user, setTargetBoard } = useUser();

  const xpCurrentLevel = user.xp % 100;
  const xpNextLevel = 100;

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 pt-5 pb-24 md:pb-16 font-sans">
      {/* ─── Top Gamified Student Header ─── */}
      <div className="bg-gradient-to-r from-white via-white to-[#ffdbc9]/40 rounded-3xl p-5 sm:p-6 border-2 border-[#dde4e6] shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl border-2 border-[#ff8c42] bg-[#ffdbc9] text-[#6a2d00] font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-black text-[#161d1f]">
                Ready to Learn, {user.name}?
              </h1>
              <span className="bg-[#ffdbc9] text-[#9b4500] text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#ff8c42]/30">
                Level {user.level}
              </span>
            </div>
            <p className="text-xs text-[#564338] mt-0.5">
              Class 12 Board & Competitive Prep • {user.leagueTier} League
            </p>

            {/* XP Progress to next Level */}
            <div className="mt-2.5 max-w-sm flex items-center gap-2">
              <div className="flex-1 bg-[#e8eff1] h-2.5 rounded-full overflow-hidden border border-[#dde4e6]">
                <div
                  className="bg-gradient-to-r from-[#ffd700] to-[#ff8c42] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(xpCurrentLevel / xpNextLevel) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-extrabold text-[#9b4500] shrink-0">
                {xpCurrentLevel} / {xpNextLevel} XP
              </span>
            </div>
          </div>
        </div>

        {/* Mascot & Board Selection */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-extrabold text-[#897266] uppercase mb-1">Target Board</span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {BOARDS.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setTargetBoard(b.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border-b-2 active:border-b-0 ${
                    user.targetBoard === b.id
                      ? 'bg-[#9b4500] text-white border-[#6a2d00]'
                      : 'bg-white text-[#564338] border-[#dde4e6] hover:bg-[#e8eff1]'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <Mascot mood="happy" size={70} />
          </div>
        </div>
      </div>

      {/* ─── Main Grid: Center Quest Learning Path & Right Sidebar Widgets ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left / Center Column: Duolingo Quest Path Tree (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#dde4e6] shadow-sm">
          <div className="w-full flex items-center justify-between mb-4 border-b border-[#dde4e6] pb-3">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-[#161d1f]">
                Mastery Quest Path
              </h2>
              <p className="text-xs text-[#564338]">Tap an active node to begin your gamified lesson drill</p>
            </div>
            <Link
              href="/tests"
              className="text-xs font-black text-[#9b4500] hover:underline flex items-center gap-1"
            >
              Full Mock Exams <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Interactive Winding Learning Path */}
          <LearningPath initialSubject="physics" />
        </div>

        {/* Right Column: Gamification Widgets (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Daily Quests Widget */}
          <div className="bg-white rounded-3xl p-5 border-2 border-[#dde4e6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-base font-extrabold text-[#161d1f]">
                Daily Quests
              </h3>
              <Link href="/quests" className="text-xs font-black text-[#9b4500] hover:underline">
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {/* Quest 1 */}
              <div className="p-3 rounded-2xl bg-[#f4fafd] border border-[#dde4e6] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ffdbc9] text-[#9b4500] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-extrabold text-[#161d1f]">Earn 50 XP Today</p>
                  <div className="w-full bg-[#e8eff1] h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#58cc02] h-full rounded-full"
                      style={{ width: `${Math.min(100, ((user.xp % 100) / 50) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-black text-[#0060ac] shrink-0">+10 💎</span>
              </div>

              {/* Quest 2 */}
              <div className="p-3 rounded-2xl bg-[#f4fafd] border border-[#dde4e6] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-extrabold text-[#161d1f]">Daily 7-Day Streak</p>
                  <div className="w-full bg-[#e8eff1] h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#ff8c42] h-full rounded-full w-full" />
                  </div>
                </div>
                <span className="text-xs font-black text-[#0060ac] shrink-0">+15 💎</span>
              </div>
            </div>
          </div>

          {/* League Standings Widget */}
          <div className="bg-white rounded-3xl p-5 border-2 border-[#dde4e6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#ffd700]">military_tech</span>
                <h3 className="font-heading text-base font-extrabold text-[#161d1f]">
                  {user.leagueTier} League
                </h3>
              </div>
              <Link href="/leaderboard" className="text-xs font-black text-[#9b4500] hover:underline">
                Rankings
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c42]/20 border border-[#ffd700] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#823b00]">Your Current Rank</span>
                <p className="text-sm font-extrabold text-[#161d1f]">#4 in Silver Division</p>
                <p className="text-[10px] text-[#3a6a00] font-bold mt-0.5">Top 3 advance to Gold!</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#9b4500]">{user.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Power-up Shop Promo Widget */}
          <div className="bg-gradient-to-br from-[#0060ac] to-[#004278] text-white rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d4e3ff]">Scholar Shop</span>
              <h4 className="font-heading font-extrabold text-sm mt-0.5">Heart Refills & Boosts</h4>
              <p className="text-[11px] text-[#d4e3ff] mt-0.5">You have {user.gems} Gems available</p>
              <Link
                href="/shop"
                className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-white text-[#0060ac] text-xs font-black hover:bg-[#d4e3ff] transition-colors"
              >
                Open Shop ➔
              </Link>
            </div>
            <span className="material-symbols-outlined text-[44px] text-[#ffd700]">diamond</span>
          </div>
        </div>
      </div>
    </main>
  );
}
