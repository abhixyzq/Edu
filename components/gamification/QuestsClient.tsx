'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';
import { Mascot } from './Mascot';
import { playGemDing } from '@/lib/soundEffects';

interface Quest {
  id: string;
  title: string;
  desc: string;
  current: number;
  target: number;
  xpReward: number;
  gemReward: number;
  icon: string;
  completed: boolean;
}

export function QuestsClient() {
  const { user, addXP, addGems } = useUser();

  const quests: Quest[] = [
    {
      id: 'q1',
      title: 'Earn 50 XP Today',
      desc: 'Complete lessons or quick drills to earn XP points',
      current: Math.min(50, user.xp % 100),
      target: 50,
      xpReward: 20,
      gemReward: 10,
      icon: 'bolt',
      completed: (user.xp % 100) >= 50,
    },
    {
      id: 'q2',
      title: 'Maintain 7+ Day Streak',
      desc: 'Practice every single day to build memory retention',
      current: Math.min(7, user.streakDays),
      target: 7,
      xpReward: 30,
      gemReward: 15,
      icon: 'local_fire_department',
      completed: user.streakDays >= 7,
    },
    {
      id: 'q3',
      title: 'Complete 3 Practice Nodes',
      desc: 'Master Class 12 topics in Physics or Chemistry',
      current: Math.min(3, Object.keys(user.completedNodes).length),
      target: 3,
      xpReward: 40,
      gemReward: 20,
      icon: 'school',
      completed: Object.keys(user.completedNodes).length >= 3,
    },
  ];

  const handleClaim = (quest: Quest) => {
    playGemDing();
    addXP(quest.xpReward);
    addGems(quest.gemReward);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16 font-sans">
      {/* Header with Mascot */}
      <div className="bg-gradient-to-r from-[#ff8c42] to-[#ba5600] text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b-6 border-[#823b00]">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ffdbc9]">Daily Challenges</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black">Daily Quests & Chests</h1>
          <p className="text-xs sm:text-sm text-[#ffdbc9] mt-1">
            Complete your 3 daily quests to unlock the Golden Scholar Mystery Chest!
          </p>
        </div>
        <Mascot mood="cheering" size={110} />
      </div>

      {/* Quests List */}
      <div className="flex flex-col gap-4">
        {quests.map((q) => {
          const progress = Math.min(100, Math.round((q.current / q.target) * 100));

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-5 border-2 border-[#dde4e6] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#ff8c42]"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#ffdbc9] text-[#9b4500] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">{q.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-extrabold text-base text-[#161d1f]">{q.title}</h3>
                  <p className="text-xs text-[#564338] mb-2">{q.desc}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#e8eff1] h-3 rounded-full overflow-hidden border border-[#dde4e6] flex items-center">
                    <div
                      className="bg-[#58cc02] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#897266] mt-1 block">
                    {q.current} / {q.target} ({progress}%)
                  </span>
                </div>
              </div>

              {/* Reward / Action */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-1 bg-[#f4fafd] px-3 py-1.5 rounded-xl border border-[#dde4e6] text-xs font-black text-[#0060ac]">
                  <span className="material-symbols-outlined text-[16px]">diamond</span>
                  <span>+{q.gemReward}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleClaim(q)}
                  disabled={!q.completed}
                  className={`px-4 py-2 rounded-xl text-xs font-black border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                    q.completed
                      ? 'bg-[#58cc02] text-white border-[#388401] hover:bg-[#46a302] cursor-pointer shadow-md'
                      : 'bg-[#e5e5e5] text-[#afafaf] border-[#afafaf] cursor-not-allowed'
                  }`}
                >
                  {q.completed ? 'Claim' : 'In Progress'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
