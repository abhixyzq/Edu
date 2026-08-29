'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SUBJECTS } from '@/lib/mockData';

export function SubjectDetailClient() {
  const params = useParams();
  const subjectId = params?.subjectId as string;

  const subject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];

  const chapters = [
    { id: 1, title: 'Electric Charges and Fields', status: 'completed', score: '95%', duration: '25 mins' },
    { id: 2, title: 'Electrostatic Potential & Capacitance', status: 'in_progress', score: '--', duration: '30 mins' },
    { id: 3, title: 'Current Electricity', status: 'locked', score: '--', duration: '40 mins' },
    { id: 4, title: 'Moving Charges and Magnetism', status: 'locked', score: '--', duration: '35 mins' },
    { id: 5, title: 'Magnetism and Matter', status: 'locked', score: '--', duration: '20 mins' },
  ];

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#564338] mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-semibold text-[#161d1f]">{subject.name}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-[#161d1f] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9b4500]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="bg-[#ffdbc9] text-[#9b4500] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Class 12 Syllabus
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
              {subject.name} Mastery
            </h1>
            <p className="text-xs text-[#dde4e6] max-w-md">
              Complete chapter-wise practice tests, PYQs, and quick formula revisions tailored for your Board Exams.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#ff8c42]/20 border border-[#ff8c42]/40 flex items-center justify-center text-[#ff8c42] shrink-0">
            <span className="material-symbols-outlined text-[36px]">{subject.icon}</span>
          </div>
        </div>
      </div>

      {/* Chapters Breakdown */}
      <h2 className="font-heading text-lg font-bold text-[#161d1f] mb-4">
        Chapter-wise Test Modules
      </h2>

      <div className="space-y-3">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="bg-white border border-[#ddc1b3]/60 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#9b4500]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                ch.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : ch.status === 'in_progress'
                  ? 'bg-[#ffdbc9] text-[#9b4500]'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {ch.id}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#161d1f]">{ch.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-[#564338]">
                  <span>⏱ {ch.duration}</span>
                  <span>•</span>
                  <span>Score: {ch.score}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-end">
              {ch.status === 'completed' || ch.status === 'in_progress' ? (
                <Link
                  href="/test/1"
                  className="w-full sm:w-auto bg-[#9b4500] hover:bg-[#ff8c42] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs text-center active:scale-95"
                >
                  {ch.status === 'completed' ? 'Retake Test' : 'Continue Test'}
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed text-center"
                >
                  Locked
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
