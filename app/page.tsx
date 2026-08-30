'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { SUBJECTS, RECENT_TESTS, BOARDS } from '@/lib/mockData';
import { SubjectCard } from '@/components/SubjectCard';

export default function HomePage() {
  const { user, setTargetBoard } = useUser();

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16">
      {/* Unified Responsive Greeting Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#161d1f]">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-xs md:text-sm text-[#564338] mt-1">
            Let's continue your Class 12 board exam preparation.
          </p>
        </div>
      </div>

      {/* Board Selector Chips */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 mb-8 pb-1">
        {BOARDS.map((board) => {
          const isSelected = user.targetBoard === board.id;
          return (
            <button
              key={board.id}
              onClick={() => setTargetBoard(board.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                isSelected
                  ? 'bg-[#ff8c42] text-white border-[#9b4500] shadow-xs scale-102'
                  : 'bg-white text-[#161d1f] border-[#ddc1b3] hover:border-[#9b4500] hover:bg-[#eef5f7]'
              }`}
            >
              {board.name}
            </button>
          );
        })}
      </div>

      {/* Grid Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column (Main Focus - 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Start Test CTA Card */}
          <div className="card-outline rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-[#ffdbc9]/30 border-[#ff8c42]">
            <div className="z-10 flex flex-col items-start gap-3 max-w-md">
              <span className="inline-flex items-center gap-1.5 bg-[#6dbf00]/20 text-[#254700] px-3 py-1 rounded-md text-xs font-bold border border-[#6dbf00]/30">
                <span className="material-symbols-outlined text-[16px] text-[#3a6a00]">trending_up</span>
                Recommended for Today
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#161d1f]">
                Full Syllabus Physics Mock Test
              </h2>
              <p className="text-sm md:text-base text-[#564338]">
                Evaluate your readiness with our AI-curated Class 12 practice exam.
              </p>
              <Link href="/test/1" className="w-full md:w-auto mt-2">
                <button className="w-full md:w-auto bg-[#9b4500] text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-full hover:bg-[#ff8c42] transition-colors shadow-md flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  Start Test Now
                </button>
              </Link>
            </div>

            {/* Illustration graphic */}
            <div className="w-full md:w-60 h-44 md:h-full mt-6 md:mt-0 rounded-xl overflow-hidden shrink-0 relative bg-[#ffdbc9]/40 border border-[#ff8c42]/30 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff8c42]/20 to-transparent" />
              <div className="flex flex-col items-center text-center p-4 z-10">
                <div className="w-16 h-16 rounded-full bg-white p-3 shadow-md mb-2 flex items-center justify-center text-[#9b4500]">
                  <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
                </div>
                <span className="font-heading text-sm font-bold text-[#6a2d00]">30 Questions • 45 Mins</span>
                <span className="text-xs text-[#564338] mt-1">+4 Marks per question</span>
              </div>
            </div>
          </div>

          {/* Subject Bento Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-[#161d1f]">
                Your Subjects
              </h3>
              <span className="text-xs text-[#564338] font-medium">Class 12 Science Stream</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {SUBJECTS.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Secondary Info - 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Continue Learning Progress */}
          <div className="card-outline rounded-2xl p-5 flex flex-col gap-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-[#161d1f]">
                Continue Learning
              </h3>
              <span className="text-xs text-[#0060ac] font-bold">Physics</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-12 bg-[#d4e3ff] rounded-lg border border-[#0060ac]/30 flex items-center justify-center shrink-0 text-[#0060ac]">
                <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-[#161d1f] line-clamp-1">
                  Electromagnetic Induction - Chapter 6
                </h4>
                <p className="text-xs text-[#564338] mt-0.5 mb-2">
                  Notes & Formulas • 12 mins left
                </p>
                <div className="w-full bg-[#e8eff1] h-2 rounded-full overflow-hidden border border-[#dde4e6]">
                  <div className="bg-[#9b4500] h-full w-[65%] rounded-full" />
                </div>
              </div>
            </div>

            <Link href="/subjects/physics">
              <button className="w-full py-2.5 rounded-full border border-[#9b4500] text-[#9b4500] font-bold text-xs hover:bg-[#ffdbc9]/30 transition-colors">
                Resume Reading
              </button>
            </Link>
          </div>

          {/* Recent Tests List */}
          <div className="card-outline rounded-2xl p-5 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-base font-bold text-[#161d1f]">
                Recent Test History
              </h3>
              <Link href="/results" className="text-xs font-bold text-[#9b4500] hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {RECENT_TESTS.map((test) => (
                <Link key={test.id} href={`/results/${RECENT_TESTS.indexOf(test) + 1}`}>
                  <div className="p-3 rounded-xl border border-[#e0e0e0] hover:border-[#9b4500] hover:bg-[#f4fafd] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#e8eff1] flex items-center justify-center text-[#564338] group-hover:bg-[#ffdbc9] group-hover:text-[#6a2d00] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">quiz</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#161d1f] line-clamp-1">
                          {test.title}
                        </h4>
                        <p className="text-[11px] text-[#564338]">{test.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-heading font-bold ${
                          test.scorePercent >= 75
                            ? 'text-[#3a6a00]'
                            : test.scorePercent >= 50
                            ? 'text-[#0060ac]'
                            : 'text-[#ba1a1a]'
                        }`}
                      >
                        {test.scorePercent}%
                      </span>
                      <p className="text-[10px] text-[#564338]">{test.score}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
