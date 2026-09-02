'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick } from '@/lib/soundEffects';
import { GemIcon, HeartLifeIcon, StreakFlameIcon, XpBoltIcon } from '@/components/icons/AppIcons';

export default function AboutPage() {
  return (
    <div
      className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col items-center pb-24 font-sans select-none"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ─── Top Header ─── */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="cursor-pointer active:scale-95 transition-transform">
            <BrandLogo size="md" />
          </Link>

          <Link
            href="/profile"
            onClick={playButtonClick}
            className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="w-full max-w-md px-4 py-6 flex flex-col gap-6">

        {/* ─── Hero Brand Card ─── */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
          <div className="flex justify-center mb-3">
            <BrandLogo size="xl" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-[#7c3aed] text-xs font-black uppercase tracking-wider mb-2">
            Class 12 Board Prep Master
          </span>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            Gamified, high-yield learning platform designed specifically for Class 12 CBSE & State Board scholars to score 95%+ with confidence.
          </p>
        </div>

        {/* ─── OFFICIAL ANDROID APP DOWNLOAD CARD (Primary Call to Action) ─── */}
        <div className="bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#9333ea] text-white rounded-3xl p-6 shadow-xl border-b-6 border-[#5521b5] relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-3">
            
            {/* Badges */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">android</span>
                Official Android App
              </span>
              <span className="text-[11px] bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full shadow-xs">
                v1.0.3 Latest
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="font-heading text-xl font-black text-white leading-tight">
                Download nainixOne APK
              </h2>
              <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                Install directly on any Android phone or tablet for offline practice, instant notifications, haptic sounds, and full-screen test simulations.
              </p>
            </div>

            {/* App Specs Pill */}
            <div className="grid grid-cols-3 gap-2 bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs text-center text-white my-1">
              <div>
                <span className="text-[10px] text-purple-200 block font-bold">Size</span>
                <span className="text-xs font-black">~109 MB</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-[10px] text-purple-200 block font-bold">Android</span>
                <span className="text-xs font-black">8.0+</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-200 block font-bold">License</span>
                <span className="text-xs font-black">Free</span>
              </div>
            </div>

            {/* Direct Download Button */}
            <a
              href="/nainixOne_Class12_Latest.apk"
              download="nainixOne_Class12_Latest.apk"
              onClick={playButtonClick}
              className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-purple-50 text-[#6d28d9] font-black text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-[24px] text-[#6d28d9]">download</span>
              <span>Download APK (Direct Install)</span>
            </a>

            <p className="text-[10px] text-purple-200 text-center font-medium">
              100% Secure • Direct Package • No Ads • No Play Store Needed
            </p>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* ─── How to Install APK Guide ─── */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <h3 className="font-heading text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7c3aed] text-[18px]">install_mobile</span>
            Quick Installation Guide
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#7c3aed] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p><strong className="text-slate-800">Download APK:</strong> Tap the download button above to save <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">nainixOne_Class12_Latest.apk</code>.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#7c3aed] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p><strong className="text-slate-800">Allow Unknown Sources:</strong> If prompted by Android, tap <em>Settings</em> and enable <em>Allow from this source</em>.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#7c3aed] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p><strong className="text-slate-800">Open & Study:</strong> Launch nainixOne and start mastering your chapters with gamified quizzes!</p>
            </div>
          </div>
        </div>

        {/* ─── Key Features Showcase ─── */}
        <div className="space-y-3">
          <h3 className="font-heading text-xs font-black text-slate-400 uppercase tracking-widest px-1">
            Why Class 12 Scholars Love nainixOne
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <GemIcon size={20} />
              </div>
              <h4 className="font-heading text-xs font-black text-slate-900">Gamified Roadmaps</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Duolingo-style chapter paths with XP & Gem rewards.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <StreakFlameIcon size={20} />
              </div>
              <h4 className="font-heading text-xs font-black text-slate-900">Daily Streaks</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Build unstoppable study consistency every single day.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <XpBoltIcon size={20} />
              </div>
              <h4 className="font-heading text-xs font-black text-slate-900">All 6 Subjects</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Physics, Chem, Math, Bio, English & Hindi Core.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <HeartLifeIcon size={20} />
              </div>
              <h4 className="font-heading text-xs font-black text-slate-900">Rough Sheet Canvas</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Draw diagrams and solve formulas directly on phone.</p>
            </div>
          </div>
        </div>

        {/* ─── Back to Learning ─── */}
        <div className="text-center pt-2">
          <Link
            href="/"
            onClick={playButtonClick}
            className="inline-flex items-center gap-2 text-xs font-black text-[#7c3aed] hover:underline"
          >
            <span>Back to Learning Dashboard</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

      </main>

      {/* Footer copyright */}
      <footer className="w-full shrink-0 text-center text-[10px] font-bold text-slate-400 py-4">
        © 2026 nainixOne • Version 1.0.3 (Build 103)
      </footer>
    </div>
  );
}
