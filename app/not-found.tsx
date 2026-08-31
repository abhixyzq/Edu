'use client';

import React from 'react';
import Link from 'next/link';
import { Mascot } from '@/components/gamification/Mascot';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center font-sans">
      <div className="max-w-md">
        {/* Mascot sad */}
        <div className="mb-6">
          <Mascot mood="crying_funny" size={130} speechText="Oops! This page is missing!" />
        </div>

        {/* Big 404 */}
        <h1 className="font-heading text-8xl font-black text-[#ff8c42] leading-none mb-2">
          404
        </h1>
        <h2 className="font-heading text-2xl font-extrabold text-[#161d1f] mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-[#564338] mb-8 leading-relaxed">
          Looks like this lesson path leads nowhere! The page you&apos;re looking for
          doesn&apos;t exist or may have been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl bg-[#ff8c42] text-white font-black text-sm border-b-4 border-[#9b4500] hover:bg-[#e66c1f] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Back to Learn
          </Link>
          <Link
            href="/subjects"
            className="px-6 py-3 rounded-2xl bg-white text-[#564338] font-black text-sm border-2 border-[#dde4e6] hover:bg-[#f4fafd] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Browse Subjects
          </Link>
        </div>

        {/* Fun tip */}
        <p className="mt-8 text-xs text-[#897266] font-bold">
          💡 Tip: Use the navigation bar above to explore the app!
        </p>
      </div>
    </main>
  );
}
