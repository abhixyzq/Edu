'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SUBJECTS } from '@/lib/mockData';
import { LearningPath } from '@/components/gamification/LearningPath';
import { Mascot } from '@/components/gamification/Mascot';

export function SubjectDetailClient() {
  const params = useParams();
  const subjectId = (params?.subjectId as string) || 'physics';

  const subject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-5 pb-24 md:pb-16 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#564338] mb-4">
        <Link href="/" className="hover:underline font-bold">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-extrabold text-[#161d1f]">{subject.name}</span>
      </div>

      {/* Hero Header with Mascot */}
      <div className="bg-gradient-to-r from-[#9b4500] via-[#ba5600] to-[#ff8c42] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden border-b-6 border-[#6a2d00]">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Board & Competitive Prep • Gamified Path
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-black tracking-tight mt-1">
              {subject.name} Mastery Tree
            </h1>
            <p className="text-xs sm:text-sm text-[#ffdbc9] max-w-md">
              Level up your concepts, beat unit boss checkpoints, and earn gems to prepare for Board & Competitive exams!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Mascot mood="happy" size={90} />
          </div>
        </div>
      </div>

      {/* Visual Learning Path */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#dde4e6] shadow-sm flex flex-col items-center">
        <LearningPath initialSubject={subject.id} />
      </div>
    </main>
  );
}
