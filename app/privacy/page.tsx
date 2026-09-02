'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick } from '@/lib/soundEffects';

export default function PrivacyPolicyPage() {
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
            <span className="text-[11px] font-black uppercase text-purple-600 tracking-wider bg-purple-50 px-2.5 py-1 rounded-full">
              Legal & Compliance
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: September 02, 2026</p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">1. Information We Collect</h2>
            <p>
              At <strong>nainixOne</strong> (accessible via <code>one.nainix.me</code>), we respect your privacy. When you register an account, solve mock tests, or engage with roadmaps, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li>Account details (Username, Email address, Profile avatar, Target board/exam).</li>
              <li>Learning analytics (Test scores, questions answered, daily streaks, XP and Gems earned).</li>
              <li>Device and browser information for optimal app rendering and security.</li>
            </ul>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">2. How We Use Your Information</h2>
            <p>
              We use your information exclusively to provide a personalized, gamified study experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li>To calculate state rank leaderboards and chapter completion roadmaps.</li>
              <li>To maintain your daily study streaks and deliver customized mock test analytics.</li>
              <li>To protect against cheating, bot abuse, and unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">3. Data Security & Storage</h2>
            <p>
              Your data is stored securely using enterprise-grade database encryption powered by Supabase. We do not sell, rent, or trade your personal information to any third-party advertisers.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">4. Children & Student Privacy</h2>
            <p>
              nainixOne is designed for secondary and senior secondary school students (Classes 9 to 12). We do not collect unnecessary personal data from minors.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">5. Contact Us</h2>
            <p>
              If you have any questions or request account deletion, contact us at:{' '}
              <a href="mailto:support@nainix.me" className="text-purple-600 font-bold hover:underline">
                support@nainix.me
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
