'use client';

import React from 'react';
import { LearningPath } from '@/components/gamification/LearningPath';

export default function HomePage() {
  return (
    <main className="w-full mx-auto pb-24 font-sans bg-[#f4f5fa]">
      <LearningPath initialSubject="physics" />
    </main>
  );
}
