'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SUBJECTS } from '@/lib/mockData';

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = params?.subjectId as string;

  const subject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];

  const chapters = [
    { id: 1, title: 'Electric Charges and Fields', status: 'completed', score: '95%', duration: '25 mins' },
    { id: 2, title: 'Electrostatic Potential and Capacitance', status: 'completed', score: '88%', duration: '30 mins' },
    { id: 3, title: 'Current Electricity', status: 'in-progress', score: '65%', duration: '40 mins' },
    { id: 4, title: 'Moving Charges and Magnetism', status: 'locked', score: '-', duration: '35 mins' },
    { id: 5, title: 'Magnetism and Matter', status: 'locked', score: '-', duration: '20 mins' },
    { id: 6, title: 'Electromagnetic Induction', status: 'locked', score: '-', duration: '45 mins' },
  ];

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#9b4500] hover:underline mb-6">
        <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Dashboard
      </Link>

      {/* Header Banner */}
      <div className="card-outline rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white to-[#f4fafd] border-[#ddc1b3] shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl ${subject.bgColor} flex items-center justify-center ${subject.color} shadow-xs shrink-0`}>
            <span className="material-symbols-outlined text-[36px]">{subject.icon}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#564338] bg-[#e8eff1] px-2.5 py-0.5 rounded-full border border-[#dde4e6]">
              Class 12 Syllabus
            </span>
            <h1 className="font-heading text-3xl font-bold text-[#161d1f] mt-1">
              {subject.name}
            </h1>
            <p className="text-sm text-[#564338] mt-1">
              {subject.chaptersCount} Chapters • {subject.progress}% Overall Mastered
            </p>
          </div>
        </div>

        <Link href="/test/physics-mock">
          <button className="bg-[#9b4500] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#ff8c42] transition-colors shadow-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            Start Subject Mock
          </button>
        </Link>
      </div>

      {/* Chapter List */}
      <div className="card-outline rounded-2xl p-6 bg-white">
        <h2 className="font-heading text-xl font-bold text-[#161d1f] mb-4">
          Chapter-wise Curriculum
        </h2>

        <div className="flex flex-col gap-3">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-xl border border-[#e0e0e0] hover:border-[#9b4500] bg-[#f4fafd] flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#ddc1b3] flex items-center justify-center font-heading font-bold text-sm text-[#9b4500]">
                  {ch.id}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#161d1f] group-hover:text-[#9b4500] transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[#564338]">{ch.duration} • Chapter Notes & Practice</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {ch.status === 'completed' && (
                  <span className="text-xs font-bold text-[#3a6a00] bg-[#6dbf00]/20 px-3 py-1 rounded-full flex items-center gap-1 border border-[#6dbf00]/40">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> {ch.score}
                  </span>
                )}
                {ch.status === 'in-progress' && (
                  <span className="text-xs font-bold text-[#9b4500] bg-[#ffdbc9] px-3 py-1 rounded-full border border-[#ff8c42]">
                    In Progress
                  </span>
                )}
                {ch.status === 'locked' && (
                  <span className="text-xs text-[#564338] bg-gray-100 px-3 py-1 rounded-full">
                    Upcoming
                  </span>
                )}

                <Link href="/test/physics-mock">
                  <button className="p-2 rounded-full hover:bg-white text-[#9b4500] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
