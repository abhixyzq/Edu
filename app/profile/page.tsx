'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { BOARDS } from '@/lib/mockData';
import { Mascot } from '@/components/gamification/Mascot';
import { playButtonClick } from '@/lib/soundEffects';

export default function ProfilePage() {
  const { user, setTargetBoard, logout } = useUser();

  const completedCount = Object.keys(user.completedNodes).length;

  return (
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-28 font-sans">
      
      {/* ─── Profile Header Hero ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-6 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#e2e8f0] shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                  {user.name.charAt(0)}
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-1 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="bg-[#ede9fe] text-[#6d28d9] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-[#c4b5fd]">
                    Level {user.level}
                  </span>
                  <span className="bg-[#e0f2fe] text-[#0369a1] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-[#bae6fd]">
                    {user.leagueTier} League
                  </span>
                </div>
                <h1 className="font-heading text-lg sm:text-xl font-black text-[#1e293b] leading-tight">
                  {user.name}
                </h1>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {user.email || 'student@edustride.prep'}
                </p>
              </div>
            </div>

            <div className="hidden xs:block shrink-0">
              <Mascot mood="happy" size={70} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-6">

        {/* ─── Official App Download Banner Card ─── */}
        <div className="bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#9333ea] text-white rounded-3xl p-5 shadow-md border-b-6 border-[#5521b5] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                OFFICIAL ANDROID APP
              </span>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                v1.0.2 APK
              </span>
            </div>

            <h3 className="font-heading text-lg font-black leading-tight text-white">
              Install EduStride on Android
            </h3>
            <p className="text-xs text-[#ede9fe] mt-1 leading-relaxed">
              Experience ultra-smooth practice sessions, offline tests, and fast gamified sound effects on your phone.
            </p>

            {/* Direct Download Button */}
            <a
              href="/EduStride_Class12_v1.0.2.apk?v=1.0.2"
              download="EduStride_Class12_v1.0.2.apk"
              onClick={playButtonClick}
              className="mt-4 w-full py-3 px-4 rounded-2xl bg-white hover:bg-amber-50 text-[#6d28d9] font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#6d28d9]">download</span>
              <span>Download APK (Direct Install)</span>
            </a>
          </div>

          {/* Decorative background shape */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* ─── Gamified Stats Grid ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Streak */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">🔥</span>
            <span className="font-heading text-xl font-black text-[#1e293b]">{user.streakDays}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Day Streak</span>
          </div>

          {/* Total XP */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">⚡</span>
            <span className="font-heading text-xl font-black text-[#1e293b]">{user.xp}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Total XP</span>
          </div>

          {/* Gems */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">💎</span>
            <span className="font-heading text-xl font-black text-[#1e293b]">{user.gems}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Gems</span>
          </div>

          {/* Completed Nodes */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">✅</span>
            <span className="font-heading text-xl font-black text-[#1e293b]">{completedCount}</span>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Mastered</span>
          </div>
        </div>

        {/* ─── Inventory & Power-ups ─── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-black text-[#1e293b]">
              Inventory & Items
            </h2>
            <Link
              href="/shop"
              onClick={playButtonClick}
              className="text-xs font-black text-[#7c3aed] hover:underline"
            >
              Shop Items
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-2.5">
              <span className="text-xl">🧊</span>
              <div>
                <p className="text-xs font-black text-[#1e293b]">Streak Freeze</p>
                <span className="text-[10px] text-[#64748b] font-bold">{user.inventory.streakFreeze} Equipped</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-2.5">
              <span className="text-xl">❤️</span>
              <div>
                <p className="text-xs font-black text-[#1e293b]">Hearts</p>
                <span className="text-[10px] text-[#64748b] font-bold">{user.hearts}/5 Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Target Examination Board ─── */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-xs">
          <h2 className="font-heading text-sm font-black text-[#1e293b] mb-3">
            Target Examination Board
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {BOARDS.map((board) => {
              const isSelected = user.targetBoard === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => {
                    playButtonClick();
                    setTargetBoard(board.id);
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-black border-b-3 active:border-b-0 active:translate-y-0.5 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#7c3aed] text-white border-[#5b21b6] shadow-xs'
                      : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-slate-50'
                  }`}
                >
                  {board.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Sign Out ─── */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              playButtonClick();
              logout();
            }}
            className="w-full py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-600 font-black text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out of EduStride
          </button>
        </div>

      </div>
    </main>
  );
}
