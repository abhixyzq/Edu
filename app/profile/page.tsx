'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';
import { BOARDS } from '@/lib/mockData';

export default function ProfilePage() {
  const { user, setTargetBoard } = useUser();

  return (
    <main className="max-w-[800px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16">
      {/* Profile Header Card */}
      <div className="card-outline rounded-3xl p-6 md:p-8 bg-white border-[#ddc1b3] shadow-md flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-[#ff8c42] object-cover shadow-md"
          />
          <span className="absolute bottom-0 right-0 bg-[#ff8c42] text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
          </span>
        </div>

        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 bg-[#ffdbc9] text-[#6a2d00] px-3 py-1 rounded-md text-xs font-bold border border-[#ff8c42]/40 mb-2">
            <span className="material-symbols-outlined text-[16px] text-[#9b4500]">verified</span>
            Verified Class 12 Aspirant
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#161d1f]">
            {user.name}
          </h1>
          <p className="text-sm text-[#564338]">
            Target Board: <span className="font-bold uppercase text-[#9b4500]">{user.targetBoard}</span> • Science PCM Stream
          </p>
        </div>
      </div>

      {/* Stats Summary - Background Watermark Icon Design */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8">
        {/* Card 1: Streak */}
        <div className="card-outline rounded-3xl p-5 md:p-6 bg-white text-center flex flex-col items-center justify-center gap-1 shadow-xs border-[#e0e0e0] hover:border-[#9b4500] transition-all relative overflow-hidden group">
          {/* Background Watermark Icon */}
          <span
            className="material-symbols-outlined text-[#9b4500] absolute pointer-events-none select-none transition-transform duration-300 group-hover:scale-110"
            style={{ fontSize: '85px', opacity: 0.2, right: '-10px', bottom: '-10px', lineHeight: 1 }}
          >
            local_fire_department
          </span>
          <div className="relative z-10 flex flex-col items-center">
            <div className="font-heading text-3xl md:text-5xl font-extrabold text-[#161d1f] tracking-tight">
              {user.streakDays}
            </div>
            <div className="font-heading text-lg md:text-2xl font-bold text-[#9b4500] mt-0.5">
              Days
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#564338] mt-1">
              Study Streak
            </p>
          </div>
        </div>

        {/* Card 2: Tests Attempted */}
        <div className="card-outline rounded-3xl p-5 md:p-6 bg-white text-center flex flex-col items-center justify-center gap-1 shadow-xs border-[#e0e0e0] hover:border-[#3a6a00] transition-all relative overflow-hidden group">
          {/* Background Watermark Icon */}
          <span
            className="material-symbols-outlined text-[#3a6a00] absolute pointer-events-none select-none transition-transform duration-300 group-hover:scale-110"
            style={{ fontSize: '85px', opacity: 0.2, right: '-10px', bottom: '-10px', lineHeight: 1 }}
          >
            military_tech
          </span>
          <div className="relative z-10 flex flex-col items-center">
            <div className="font-heading text-3xl md:text-5xl font-extrabold text-[#161d1f] tracking-tight">
              14
            </div>
            <div className="font-heading text-lg md:text-2xl font-bold text-[#3a6a00] mt-0.5">
              Tests
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#564338] mt-1">
              Attempted
            </p>
          </div>
        </div>

        {/* Card 3: Avg Accuracy */}
        <div className="card-outline rounded-3xl p-5 md:p-6 bg-white text-center flex flex-col items-center justify-center gap-1 shadow-xs border-[#e0e0e0] hover:border-[#0060ac] transition-all relative overflow-hidden group">
          {/* Background Watermark Icon */}
          <span
            className="material-symbols-outlined text-[#0060ac] absolute pointer-events-none select-none transition-transform duration-300 group-hover:scale-110"
            style={{ fontSize: '85px', opacity: 0.2, right: '-10px', bottom: '-10px', lineHeight: 1 }}
          >
            menu_book
          </span>
          <div className="relative z-10 flex flex-col items-center">
            <div className="font-heading text-3xl md:text-5xl font-extrabold text-[#161d1f] tracking-tight">
              86%
            </div>
            <div className="font-heading text-lg md:text-2xl font-bold text-[#0060ac] mt-0.5">
              Avg
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#564338] mt-1">
              Accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Preferences & Target Board Selection */}
      <div className="card-outline rounded-2xl p-6 bg-white flex flex-col gap-6">
        <h2 className="font-heading text-xl font-bold text-[#161d1f]">
          Target Exam Preferences
        </h2>

        <div>
          <label className="block text-xs font-bold text-[#564338] mb-2">
            Switch Target Examination Board
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BOARDS.map((board) => {
              const isSelected = user.targetBoard === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => setTargetBoard(board.id)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    isSelected
                      ? 'bg-[#ff8c42] text-white border-[#9b4500] shadow-xs'
                      : 'bg-white text-[#161d1f] border-[#ddc1b3] hover:border-[#9b4500]'
                  }`}
                >
                  {board.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
