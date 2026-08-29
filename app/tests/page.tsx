'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TestsPage() {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const testsList = [
    {
      id: 'physics-mock',
      title: 'Class 12 Physics Full Syllabus Mock Test',
      subject: 'Physics',
      questions: 30,
      duration: '45 mins',
      marks: 120,
      badge: 'High Yield',
    },
    {
      id: 'chemistry-mock',
      title: 'Chemistry Organic & Inorganic Chapter Test',
      subject: 'Chemistry',
      questions: 25,
      duration: '30 mins',
      marks: 100,
      badge: 'Recommended',
    },
    {
      id: 'maths-mock',
      title: 'Mathematics Calculus & Vectors Practice Exam',
      subject: 'Mathematics',
      questions: 35,
      duration: '60 mins',
      marks: 140,
      badge: 'Advanced',
    },
    {
      id: 'biology-mock',
      title: 'Genetics & Biotechnology Unit Evaluation',
      subject: 'Biology',
      questions: 30,
      duration: '45 mins',
      marks: 120,
      badge: 'NCERT Special',
    },
  ];

  const filteredTests = testsList.filter((test) => {
    const matchesSubject = selectedSubject === 'All' || test.subject === selectedSubject;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#161d1f]">
            Mock Tests & Practice Exams
          </h1>
          <p className="text-sm text-[#564338] mt-1">
            Simulate actual Class 12 board exam pattern with AI-timed test series.
          </p>
        </div>

        {/* Search input bar */}
        <div className="w-full md:w-72 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#897266] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ddc1b3] bg-white text-sm text-[#161d1f] placeholder:text-[#897266] outline-none focus:border-[#9b4500] focus:ring-1 focus:ring-[#9b4500] transition-all"
          />
        </div>
      </div>

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {subjects.map((sub) => {
          const isActive = selectedSubject === sub;
          return (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#9b4500] text-white shadow-xs'
                  : 'bg-white text-[#564338] border border-[#ddc1b3] hover:border-[#9b4500] hover:bg-[#eef5f7]'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Test List Container */}
      <div className="flex flex-col gap-4">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <div
              key={test.id}
              className="card-outline rounded-2xl p-5 md:p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-[#e0e0e0] hover:border-[#9b4500] transition-all"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9b4500] bg-[#ffdbc9] px-2.5 py-0.5 rounded-md border border-[#ff8c42]/40">
                    {test.subject}
                  </span>
                  <span className="text-xs text-[#3a6a00] font-bold bg-[#6dbf00]/20 px-2.5 py-0.5 rounded-md border border-[#6dbf00]/30">
                    {test.badge}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#161d1f]">
                  {test.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-[#564338]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#9b4500]">schedule</span> {test.duration}
                  </span>
                  <span>•</span>
                  <span>{test.questions} Questions</span>
                  <span>•</span>
                  <span>{test.marks} Total Marks</span>
                </div>
              </div>

              <Link href={`/test/${test.id}`} className="w-full md:w-auto">
                <button className="w-full md:w-auto bg-[#9b4500] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#ff8c42] transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95 touch-manipulation">
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  Attempt Test
                </button>
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-[#ddc1b3] text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[40px] text-[#897266]">search_off</span>
            <p className="font-bold text-[#161d1f]">No tests found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSelectedSubject('All'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#9b4500] underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
