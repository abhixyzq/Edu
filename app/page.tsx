'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LearningPath = dynamic(
  () => import('@/components/gamification/LearningPath').then((mod) => mod.LearningPath),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-screen bg-[#faf6f0] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#ff6937] animate-spin" />
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <main className="w-full mx-auto pb-24 font-sans bg-[#faf6f0]">
      <LearningPath initialSubject="physics" />
    </main>
  );
}
