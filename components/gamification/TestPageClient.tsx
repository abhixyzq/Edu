'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DuolingoQuizClient = dynamic(
  () => import('@/components/gamification/DuolingoQuizClient').then((mod) => mod.DuolingoQuizClient),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
        <div className="w-10 h-10 border-4 border-[#ff8c42] border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export function TestPageClient() {
  return <DuolingoQuizClient />;
}
