'use client';

import React from 'react';
import Link from 'next/link';
import { Mascot } from '@/components/gamification/Mascot';

const SUBJECT_CARDS = [
  {
    id: 'physics',
    name: 'Physics',
    icon: 'bolt',
    desc: 'Electrostatics, Current Electricity, Optics & Modern Physics',
    units: 9,
    color: 'from-[#ff8c42] to-[#ba5600]',
    border: 'border-[#ff8c42]',
    badge: 'bg-[#ffdbc9] text-[#9b4500]',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'science',
    desc: 'Physical, Organic & Inorganic Chemistry — NCERT Deep Dive',
    units: 5,
    color: 'from-[#0060ac] to-[#004278]',
    border: 'border-[#a2c5ff]',
    badge: 'bg-[#d4e3ff] text-[#0060ac]',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'calculate',
    desc: 'Calculus, Algebra, Vectors, Probability & Linear Programming',
    units: 4,
    color: 'from-[#3a6a00] to-[#275200]',
    border: 'border-[#b8f07c]',
    badge: 'bg-[#ccff90] text-[#1e4400]',
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'biotech',
    desc: 'Reproduction, Genetics, Ecology & Biotechnology',
    units: 3,
    color: 'from-[#b5008c] to-[#810065]',
    border: 'border-[#ffaee0]',
    badge: 'bg-[#ffd8ef] text-[#8b005d]',
  },
];

export default function SubjectsPage() {
  return (
    <main className="max-w-[900px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16 font-sans">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#ff8c42] to-[#ba5600] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b-6 border-[#823b00]">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ffdbc9]">
            Class 12 Board Prep
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black mt-1">
            Subject Mastery Paths
          </h1>
          <p className="text-xs sm:text-sm text-[#ffdbc9] mt-1">
            Pick a subject and start climbing through chapters, one node at a time!
          </p>
        </div>
        <Mascot mood="cheering" size={110} />
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SUBJECT_CARDS.map((s) => (
          <Link
            key={s.id}
            href={`/subjects/${s.id}`}
            className={`group bg-white rounded-3xl border-2 ${s.border} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden`}
          >
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${s.color} text-white p-5 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">{s.icon}</span>
                </div>
                <div>
                  <h2 className="font-heading text-xl font-extrabold">{s.name}</h2>
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${s.badge} mt-0.5 inline-block`}>
                    {s.units} units
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[28px] opacity-80 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>

            {/* Card Body */}
            <div className="p-5">
              <p className="text-sm text-[#564338] font-medium leading-relaxed">{s.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#58cc02]">
                  check_circle
                </span>
                <span className="text-xs font-bold text-[#564338]">
                  Gamified lesson nodes with XP rewards
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ffd700]">
                  military_tech
                </span>
                <span className="text-xs font-bold text-[#564338]">
                  Unit boss exams &amp; mastery badges
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
