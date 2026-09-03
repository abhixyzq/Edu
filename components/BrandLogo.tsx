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

  const heightClasses = {
    sm: 'h-[22px]',
    md: 'h-[28px]',
    lg: 'h-[38px]',
    xl: 'h-[48px] sm:h-[54px]',
  };

  return (
    <div className={`inline-flex items-center select-none group ${className}`}>
      <img
        src="/images/nainix_logo.png"
        alt="nainixONE Logo"
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105 active:scale-95 drop-shadow-2xs`}
        style={{
          filter: isDark ? 'invert(1) hue-rotate(180deg)' : 'none',
        }}
      />
    </div>
  );
};
