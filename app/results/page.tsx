'use client';

import React from 'react';
import Link from 'next/link';
import { RECENT_TESTS } from '@/lib/mockData';

export default function AllResultsPage() {
  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-16">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#161d1f]">
          Your Test Scorecards & Performance
        </h1>
        <p className="text-sm text-[#564338]">
          Review past attempt scores, percentile metrics, and question solutions.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {RECENT_TESTS.map((test, index) => (
          <div
            key={test.id}
            className="card-outline rounded-2xl p-5 md:p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-[#e0e0e0] hover:border-[#9b4500] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdbc9] text-[#6a2d00] flex items-center justify-center font-heading font-bold text-lg shrink-0">
                <span className="material-symbols-outlined text-[24px] text-[#9b4500]">military_tech</span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#0060ac]">{test.subject}</span>
                <h3 className="font-heading text-lg font-bold text-[#161d1f]">
                  {test.title}
                </h3>
                <p className="text-xs text-[#564338]">{test.date} • Duration: {test.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-left md:text-right">
                <span className="font-heading text-2xl font-bold text-[#3a6a00]">
                  {test.scorePercent}%
                </span>
                <p className="text-xs text-[#564338]">{test.score} Marks</p>
              </div>

              <Link href={`/results/${index + 1}`}>
                <button className="px-5 py-2.5 rounded-full border border-[#9b4500] text-[#9b4500] font-bold text-xs hover:bg-[#ffdbc9]/40 transition-colors flex items-center gap-1">
                  View Solutions <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
