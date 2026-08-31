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
    sm: 'text-[19px]',
    md: 'text-[23px]',
    lg: 'text-[30px]',
    xl: 'text-[38px]',
  };

  const verticalLetterSizes = {
    sm: 'text-[6.5px] leading-[5px] ml-1 tracking-[0.14em]',
    md: 'text-[7.5px] leading-[6px] ml-1.5 tracking-[0.16em]',
    lg: 'text-[9.5px] leading-[7.5px] ml-2 tracking-[0.18em]',
    xl: 'text-[12px] leading-[9.5px] ml-2.5 tracking-[0.2em]',
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" }}
      className={`inline-flex items-center select-none group font-logo ${className}`}
    >
      {/* Base Wordmark 'nainix' */}
      <span
        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" }}
        className={`font-black tracking-[-0.05em] leading-none transition-all duration-200 ${
          sizeClasses[size]
        } ${isDark ? 'text-white' : 'text-slate-900 group-hover:text-slate-800'}`}
      >
        nainix
      </span>

      {/* Vertical 'ONE' Wordmark */}
      <div
        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" }}
        className={`flex flex-col items-center justify-center font-black uppercase select-none transition-all duration-200 group-hover:scale-105 ${verticalLetterSizes[size]}`}
      >
        <span className="bg-gradient-to-b from-violet-600 to-purple-600 bg-clip-text text-transparent">
          O
        </span>
        <span className="bg-gradient-to-b from-purple-600 to-indigo-600 bg-clip-text text-transparent my-[0.5px]">
          N
        </span>
        <span className="bg-gradient-to-b from-indigo-600 to-violet-700 bg-clip-text text-transparent">
          E
        </span>
      </div>
    </div>
  );
};
