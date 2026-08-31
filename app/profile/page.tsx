'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { BOARDS } from '@/lib/mockData';
import { Mascot } from '@/components/gamification/Mascot';

export default function ProfilePage() {
  const { user, setTargetBoard, logout } = useUser();

  const completedCount = Object.keys(user.completedNodes).length;

  return (
    <main className="max-w-[850px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16 font-sans">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#dde4e6] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#ff8c42] bg-gradient-to-br from-[#ffdbc9] to-[#ff8c42] text-[#6a2d00] font-black text-3xl md:text-4xl flex items-center justify-center shadow-md">
              {user.name.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 bg-[#ff8c42] text-white p-1 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#ffdbc9] text-[#9b4500] text-xs font-black px-3 py-0.5 rounded-full uppercase border border-[#ff8c42]/40">
                Level {user.level} Scholar
              </span>
              <span className="bg-[#d4e3ff] text-[#0060ac] text-xs font-black px-3 py-0.5 rounded-full uppercase border border-[#a2c5ff]">
                {user.leagueTier} League
              </span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-[#161d1f]">
              {user.name}
            </h1>
            <p className="text-xs text-[#564338] mt-0.5">
              {user.email || 'student@edustride.prep'} • Class 12 Board Prep
            </p>
          </div>
        </div>

        <div className="hidden sm:block">
          <Mascot mood="happy" size={85} />
        </div>
      </div>

      {/* Gamified Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Streak */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#dde4e6] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-[32px] text-[#9b4500] mb-1">
            local_fire_department
          </span>
          <span className="font-heading text-2xl font-black text-[#161d1f]">{user.streakDays}</span>
          <span className="text-[11px] font-bold text-[#897266] uppercase">Day Streak</span>
        </div>

        {/* Total XP */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#dde4e6] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-[32px] text-[#ffd700] mb-1">
            bolt
          </span>
          <span className="font-heading text-2xl font-black text-[#161d1f]">{user.xp}</span>
          <span className="text-[11px] font-bold text-[#897266] uppercase">Total XP</span>
        </div>

        {/* Gems */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#dde4e6] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-[32px] text-[#0060ac] mb-1">
            diamond
          </span>
          <span className="font-heading text-2xl font-black text-[#161d1f]">{user.gems}</span>
          <span className="text-[11px] font-bold text-[#897266] uppercase">Gems</span>
        </div>

        {/* Completed Nodes */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#dde4e6] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-[32px] text-[#58cc02] mb-1">
            check_circle
          </span>
          <span className="font-heading text-2xl font-black text-[#161d1f]">{completedCount}</span>
          <span className="text-[11px] font-bold text-[#897266] uppercase">Nodes Mastered</span>
        </div>
      </div>

      {/* Inventory & Power-ups */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#dde4e6] shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-extrabold text-[#161d1f]">
            Inventory & Equipped Power-Ups
          </h2>
          <Link href="/shop" className="text-xs font-black text-[#0060ac] hover:underline">
            Shop Power-Ups
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#f4fafd] border border-[#dde4e6] flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#0060ac]">ac_unit</span>
            <div>
              <p className="text-xs font-extrabold text-[#161d1f]">Streak Freeze</p>
              <span className="text-[11px] text-[#564338] font-bold">{user.inventory.streakFreeze} Equipped</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f4fafd] border border-[#dde4e6] flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#ffd700]">bolt</span>
            <div>
              <p className="text-xs font-extrabold text-[#161d1f]">2x XP Boosters</p>
              <span className="text-[11px] text-[#564338] font-bold">{user.inventory.doubleXpCount} Available</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f4fafd] border border-[#dde4e6] flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#ba1a1a]">favorite</span>
            <div>
              <p className="text-xs font-extrabold text-[#161d1f]">Current Lives</p>
              <span className="text-[11px] text-[#564338] font-bold">{user.hearts}/5 Hearts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Board Switcher */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#dde4e6] shadow-xs mb-8">
        <h2 className="font-heading text-lg font-extrabold text-[#161d1f] mb-3">
          Target Examination Board
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BOARDS.map((board) => {
            const isSelected = user.targetBoard === board.id;
            return (
              <button
                key={board.id}
                onClick={() => setTargetBoard(board.id)}
                className={`p-3 rounded-2xl text-xs font-extrabold border-b-4 active:border-b-0 active:translate-y-1 transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff8c42] text-white border-[#9b4500] shadow-sm'
                    : 'bg-white text-[#161d1f] border-[#dde4e6] hover:bg-[#ffdbc9]/30'
                }`}
              >
                {board.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Logout */}
      <div className="flex justify-end">
        <button
          onClick={logout}
          className="py-2.5 px-6 rounded-2xl border-2 border-[#ba1a1a] text-[#ba1a1a] font-black text-xs hover:bg-[#ffdad6] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out of EduStride
        </button>
      </div>
    </main>
  );
}
