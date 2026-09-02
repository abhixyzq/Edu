'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick } from '@/lib/soundEffects';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 pb-20 font-sans select-none">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="cursor-pointer active:scale-95 transition-transform">
            <BrandLogo size="md" />
          </Link>
          <Link
            href="/login"
            onClick={playButtonClick}
            className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
              Notice
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-2">
              Disclaimer & Non-Affiliation
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: September 02, 2026</p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">1. Non-Affiliation Notice</h2>
            <p>
              <strong>nainixOne</strong> is an independent EdTech platform and is not affiliated with, endorsed by, or officially connected to the <em>Central Board of Secondary Education (CBSE)</em>, <em>Bihar School Examination Board (BSEB)</em>, <em>UP Madhyamik Shiksha Parishad (UPMSP)</em>, <em>CISCE/ICSE/ISC</em>, or any other government authority.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">2. Purpose of Content</h2>
            <p>
              All sample model papers, practice tests, and syllabus summaries are created independently for student practice and revision purposes only.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">3. Official Inquiries</h2>
            <p>
              For queries, copyright notices, or general questions, reach out to our team at:{' '}
              <a href="mailto:support@nainix.me" className="text-emerald-700 font-bold hover:underline">
                support@nainix.me
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
