'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick } from '@/lib/soundEffects';

export default function TermsOfServicePage() {
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
            <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2.5 py-1 rounded-full">
              Legal Agreement
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-2">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: September 02, 2026</p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">1. Acceptance of Terms</h2>
            <p>
              By accessing or using <strong>nainixOne</strong> (<code>one.nainix.me</code>), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">2. Educational Content & Mock Tests</h2>
            <p>
              All sample questions, mock tests, subject roadmaps, and solutions provided on nainixOne are strictly for educational preparation and self-assessment purposes. While we strive for 100% curriculum accuracy aligned with CBSE, BSEB, UP Board, and ICSE standards, questions do not represent official leaked exam papers.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">3. User Conduct & Fair Play</h2>
            <p>
              Users must not employ automated scripts, bots, hacks, or multiple duplicate accounts to artificially manipulate leaderboard rankings or test timers. Violation of fair play rules will result in immediate account termination.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">4. Intellectual Property</h2>
            <p>
              The nainixOne brand, parrot mascot illustrations, UI design tokens, gamification roadmaps, and custom software code are the intellectual property of nainixOne Education.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">5. Contact Information</h2>
            <p>
              For legal inquiries regarding these terms, please email:{' '}
              <a href="mailto:support@nainix.me" className="text-blue-600 font-bold hover:underline">
                support@nainix.me
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
