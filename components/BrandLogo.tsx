'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  className = '',
}) => {
  const isDark = variant === 'dark';

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-[22px]',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const verticalLetterSizes = {
    sm: 'text-[6.5px] leading-[6px]',
    md: 'text-[7.5px] leading-[7px]',
    lg: 'text-[9.5px] leading-[9px]',
    xl: 'text-[12px] leading-[11px]',
  };

  const badgePadding = {
    sm: 'px-1 py-0.5 rounded-[5px] ml-1',
    md: 'px-1.5 py-1 rounded-[6px] ml-1.5',
    lg: 'px-2 py-1.5 rounded-[8px] ml-2',
    xl: 'px-2.5 py-2 rounded-[10px] ml-2.5',
  };

  return (
    <div className={`inline-flex items-center select-none group font-heading ${className}`}>
      {/* Base Wordmark 'nainix' */}
      <span
        className={`font-black tracking-[-0.04em] leading-none transition-all duration-200 ${
          sizeClasses[size]
        } ${isDark ? 'text-white' : 'text-slate-900 group-hover:text-slate-800'}`}
      >
        nainix
      </span>

      {/* Designer Vertical 'ONE' Stamped Micro-Insignia */}
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] text-white shadow-[0_2px_8px_rgba(124,58,237,0.35)] transition-transform duration-200 group-hover:scale-105 select-none ${
          badgePadding[size]
        }`}
      >
        <span className={`font-black tracking-widest uppercase ${verticalLetterSizes[size]}`}>
          O
        </span>
        <span className={`font-black tracking-widest uppercase my-[1px] ${verticalLetterSizes[size]}`}>
          N
        </span>
        <span className={`font-black tracking-widest uppercase ${verticalLetterSizes[size]}`}>
          E
        </span>
      </div>
    </div>
  );
};
