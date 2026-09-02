'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick } from '@/lib/soundEffects';

export default function RefundPolicyPage() {
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
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider bg-amber-50 px-2.5 py-1 rounded-full">
              Billing & Refunds
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-2">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: September 02, 2026</p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">1. Free Access Platform</h2>
            <p>
              nainixOne provides free access to core chapter roadmaps, practice questions, and board exam mock tests for all students across India.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">2. Digital Goods & Passes</h2>
            <p>
              If any optional digital purchases (such as Scholar VIP Passes, custom avatar cosmetics, or premium test series) are introduced:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li>Digital items unlocked instantly upon purchase are generally non-refundable once consumed.</li>
              <li>In the case of accidental duplicate payment or technical delivery failures, we issue a 100% refund within 5–7 business days upon verification.</li>
            </ul>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">3. Cancellation Requests</h2>
            <p>
              You may cancel any active subscription at any time directly through your account dashboard. Upon cancellation, you retain access until the end of your current billing period.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading font-black text-slate-900 text-sm sm:text-base">4. Contact Billing Support</h2>
            <p>
              For refund or payment inquiries, email our support team at:{' '}
              <a href="mailto:support@nainix.me" className="text-amber-700 font-bold hover:underline">
                support@nainix.me
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
