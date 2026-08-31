import React, { Suspense } from 'react';
import { DuolingoQuizClient } from '@/components/gamification/DuolingoQuizClient';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
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
