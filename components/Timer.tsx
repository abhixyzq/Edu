'use client';

import React from 'react';
import { useTest } from '@/context/TestContext';

export const Timer: React.FC = () => {
  const { timeRemaining } = useTest();

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isWarning = timeRemaining < 300;

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs transition-colors ${
        isWarning
          ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a] animate-pulse'
          : 'bg-[#e2e9ec] text-[#9b4500] border-[#161d1f]'
      }`}
    >
      <span className="material-symbols-outlined text-[18px] text-[#9b4500]">timer</span>
      <span className="font-heading font-bold text-sm md:text-base tracking-wider font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
