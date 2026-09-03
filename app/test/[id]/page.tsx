import React, { Suspense } from 'react';
import { DuolingoQuizClient } from '@/components/gamification/DuolingoQuizClient';

export function generateStaticParams() {
  const ids = Array.from({ length: 100 }, (_, i) => ({ id: (i + 1).toString() }));
  const slugs = [
    { id: 'physics-1' },
    { id: 'physics-2' },
    { id: 'chemistry-1' },
    { id: 'chemistry-2' },
    { id: 'mathematics-1' },
    { id: 'mathematics-2' },
    { id: 'biology-1' },
    { id: 'biology-2' },
  ];
  return [...ids, ...slugs];
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4fafd]">
          <div className="w-10 h-10 border-4 border-[#ff8c42] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DuolingoQuizClient />
    </Suspense>
  );
}
