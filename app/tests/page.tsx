'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { playButtonClick } from '@/lib/soundEffects';

export default function PracticePage() {
  const router = useRouter();

  const [playgrounds, setPlaygrounds] = useState([
    {
      id: 'p-1',
      title: 'Simple website 2',
      techBadges: [
        { icon: 'html', color: 'bg-orange-500 text-white' },
        { icon: 'javascript', color: 'bg-amber-400 text-black' },
        { icon: 'css', color: 'bg-blue-500 text-white' },
      ],
      timeAgo: '6 months ago',
      visibility: 'ONLY ME',
      testId: '1',
    },
    {
      id: 'p-2',
      title: 'Class 12 Physics Mechanics Drill',
      techBadges: [
        { icon: 'bolt', color: 'bg-purple-500 text-white' },
        { icon: 'functions', color: 'bg-indigo-500 text-white' },
      ],
      timeAgo: '2 weeks ago',
      visibility: 'ONLY ME',
      testId: '2',
    },
  ]);

  const pastTopics = [
    {
      id: 't-1',
      duration: '8 min',
      title: 'Incorporating Else If',
      testId: '1',
    },
    {
      id: 't-2',
      duration: '9 min',
      title: 'Coding Else Statements',
      testId: '2',
    },
    {
      id: 't-3',
      duration: '12 min',
      title: 'Gauss Law Flux Drills',
      testId: '3',
    },
    {
      id: 't-4',
      duration: '10 min',
      title: 'Kirchhoff Circuit Rules',
      testId: '4',
    },
  ];

  const handleStartReview = () => {
    playButtonClick();
    router.push('/test/1');
  };

  return (
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-28 font-sans">
      
      {/* ─── 1. Daily Review Hero Card (Purple gradient with Gym Robot) ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-6 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          
          <div className="flex items-start justify-between relative">
            <div className="z-10 max-w-[210px]">
              {/* Daily Review Pill */}
              <span className="inline-block px-3 py-1 rounded-full bg-[#1e1b4b] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                DAILY REVIEW
              </span>
              
              {/* Headline */}
              <h1 className="font-heading text-xl sm:text-2xl font-black text-[#1e293b] mt-2 leading-tight">
                Using Conditions
              </h1>

              {/* Time Indicator */}
              <div className="flex items-center gap-1 text-xs font-bold text-[#64748b] mt-1">
                <span className="text-amber-500 font-black text-sm">⚡</span>
                <span>8 min</span>
              </div>
            </div>

            {/* Gym Robot Illustration */}
            <div className="w-28 h-28 relative shrink-0 -mt-2">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Robot Head / Screen */}
                <rect x="25" y="20" width="70" height="52" rx="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
                <rect x="32" y="27" width="56" height="38" rx="8" fill="#0f172a" />
                
                {/* Blue Digital Eyes */}
                <rect x="40" y="38" width="12" height="7" rx="3" fill="#38bdf8" />
                <rect x="68" y="38" width="12" height="7" rx="3" fill="#38bdf8" />
                {/* Digital Smile */}
                <path d="M 52 53 Q 60 58 68 53" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                
                {/* Green Headband */}
                <rect x="22" y="24" width="76" height="8" rx="4" fill="#86efac" stroke="#22c55e" strokeWidth="1" />

                {/* Robot Body */}
                <rect x="42" y="74" width="36" height="24" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                <circle x="50" y="86" r="3" fill="#60a5fa" />
                <circle x="60" y="86" r="3" fill="#a855f7" />
                <circle x="70" y="86" r="3" fill="#4ade80" />

                {/* Legs */}
                <rect x="48" y="98" width="8" height="12" rx="3" fill="#cbd5e1" />
                <rect x="64" y="98" width="8" height="12" rx="3" fill="#cbd5e1" />

                {/* Dumbbell & Left Arm */}
                <path d="M 28 82 L 18 84" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                <rect x="5" y="74" width="8" height="20" rx="3" fill="#7c3aed" />
                <rect x="13" y="81" width="12" height="6" rx="2" fill="#64748b" />
                <rect x="25" y="74" width="8" height="20" rx="3" fill="#7c3aed" />
              </svg>
            </div>
          </div>

          {/* Start Now Button */}
          <button
            type="button"
            onClick={handleStartReview}
            className="w-full mt-4 py-3 rounded-2xl bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-black text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Start now
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-6">

        {/* ─── 2. Practice Past Topics (Horizontal Scrolling Cards) ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-base font-black text-[#1e293b]">
              Practice Past Topics
            </h2>
            <Link href="/tests" className="text-xs font-black text-[#7c3aed] hover:underline">
              See all
            </Link>
          </div>

          {/* Horizontal Cards Scroll */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4">
            {pastTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/test/${topic.testId}`}
                onClick={playButtonClick}
                className="w-48 shrink-0 bg-white rounded-3xl p-4 border-2 border-[#e2e8f0] shadow-xs hover:border-[#8b5cf6] transition-all active:scale-95 flex flex-col justify-between h-32"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-[#64748b]">
                  <span className="text-amber-500 font-black">⚡</span>
                  <span>{topic.duration}</span>
                </div>
                <h3 className="font-heading text-sm font-black text-[#1e293b] leading-tight">
                  {topic.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── 3. Your Practice Progress (2-Column Stats Card) ─── */}
        <div>
          <h2 className="font-heading text-base font-black text-[#1e293b] mb-3">
            Your Practice Progress
          </h2>

          <div className="bg-white rounded-3xl p-5 border-2 border-[#e2e8f0] shadow-xs grid grid-cols-2 gap-4">
            {/* Stat 1 */}
            <div>
              <p className="font-heading text-2xl sm:text-3xl font-black text-[#4f46e5]">
                12
              </p>
              <span className="text-xs font-bold text-[#64748b] block mt-0.5">
                Activities done
              </span>
            </div>

            {/* Stat 2 */}
            <div className="border-l border-[#e2e8f0] pl-4">
              <p className="font-heading text-2xl sm:text-3xl font-black text-[#4f46e5]">
                1h 13min
              </p>
              <span className="text-xs font-bold text-[#64748b] block mt-0.5">
                Time on tasks
              </span>
            </div>
          </div>
        </div>

        {/* ─── 4. Playgrounds (Drills List with + Create new) ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-base font-black text-[#1e293b]">
              Playgrounds
            </h2>
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                router.push('/test/1');
              }}
              className="text-xs font-black text-[#7c3aed] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="text-sm font-black leading-none">+</span> Create new
            </button>
          </div>

          {/* Playground Cards */}
          <div className="flex flex-col gap-3">
            {playgrounds.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e2e8f0] shadow-xs flex items-center justify-between"
              >
                <div className="flex flex-col gap-1.5">
                  {/* Badge Icons */}
                  <div className="flex items-center gap-1">
                    {p.techBadges.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] uppercase shadow-2xs ${b.color}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">{b.icon}</span>
                      </span>
                    ))}
                  </div>

                  <h3 className="font-heading text-sm sm:text-base font-black text-[#1e293b]">
                    {p.title}
                  </h3>

                  <p className="text-xs text-[#94a3b8] font-semibold">
                    {p.timeAgo}
                  </p>
                </div>

                {/* Right: Options & Visibility Pill */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    type="button"
                    className="text-[#94a3b8] hover:text-[#1e293b] p-1 cursor-pointer"
                    aria-label="Options"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>

                  <span className="px-2.5 py-1 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-[10px] font-black text-[#64748b] flex items-center gap-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[12px]">lock</span> {p.visibility}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footnote */}
          <p className="text-xs font-bold text-[#64748b] text-center mt-6">
            9 free playgrounds left
          </p>
          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="text-xs font-black text-[#7c3aed] hover:underline text-center block mx-auto mt-1 cursor-pointer"
          >
            Upgrade for more
          </button>
        </div>

      </div>
    </main>
  );
}
