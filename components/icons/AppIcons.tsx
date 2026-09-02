'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/**
 * 💎 Dedicated nainixOne 3D Prismatic Diamond Gem
 */
export const GemIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 drop-shadow-[0_2px_6px_rgba(6,182,212,0.4)] ${className}`}
  >
    <defs>
      <linearGradient id="gemTopGrad" x1="24" y1="4" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A5F3FC" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <linearGradient id="gemLeftGrad" x1="6" y1="18" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="gemCenterGrad" x1="24" y1="18" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="60%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
      <linearGradient id="gemRightGrad" x1="42" y1="18" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="gemFacetGrad" x1="16" y1="4" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Upper Center Facet */}
    <polygon points="14,6 34,6 24,18" fill="url(#gemTopGrad)" />
    {/* Upper Left Facet */}
    <polygon points="6,18 14,6 24,18" fill="url(#gemFacetGrad)" />
    {/* Upper Right Facet */}
    <polygon points="42,18 34,6 24,18" fill="#7DD3FC" />
    {/* Lower Center Facet */}
    <polygon points="24,18 14,18 24,44" fill="url(#gemCenterGrad)" />
    <polygon points="24,18 34,18 24,44" fill="#0284C7" />
    {/* Lower Left Facet */}
    <polygon points="6,18 14,18 24,44" fill="url(#gemLeftGrad)" />
    {/* Lower Right Facet */}
    <polygon points="42,18 34,18 24,44" fill="url(#gemRightGrad)" />
    {/* Specular Highlight Sheen */}
    <polygon points="17,8 24,14 19,16" fill="white" fillOpacity="0.75" />
    {/* Top Edge Rim Light */}
    <line x1="14" y1="6" x2="34" y2="6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

/**
 * ❤️ Dedicated nainixOne 3D Glossy Energy Heart / Life
 */
export const HeartLifeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 drop-shadow-[0_2px_8px_rgba(244,63,94,0.45)] ${className}`}
  >
    <defs>
      <linearGradient id="heartBaseGrad" x1="24" y1="6" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF4B72" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="heartGleamGrad" x1="12" y1="10" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="heartBackGlow" cx="24" cy="20" r="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFA4B6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Heart Base 3D Geometry */}
    <path
      d="M24 42.5C23.2 42.5 22.4 42.2 21.8 41.6C12.5 33.2 5 26.5 5 17.5C5 10.6 10.4 5.5 17.2 5.5C20.8 5.5 23.4 7.2 24 8.5C24.6 7.2 27.2 5.5 30.8 5.5C37.6 5.5 43 10.6 43 17.5C43 26.5 35.5 33.2 26.2 41.6C25.6 42.2 24.8 42.5 24 42.5Z"
      fill="url(#heartBaseGrad)"
      stroke="#BE123C"
      strokeWidth="1"
    />
    {/* Inner Soft Glow */}
    <circle cx="20" cy="16" r="10" fill="url(#heartBackGlow)" />
    {/* Specular Highlight Arch on Left Lobe */}
    <path
      d="M11 15.5C11 11.5 14 8.5 18 8.5C19.5 8.5 20.8 9 21.8 10C19.5 11 13 13.5 11 15.5Z"
      fill="url(#heartGleamGrad)"
    />
    {/* Micro Glint Dot */}
    <circle cx="15" cy="12" r="1.5" fill="white" fillOpacity="0.9" />
  </svg>
);

/**
 * 🔥 Dedicated nainixOne 3D Layered Flame Streak
 */
export const StreakFlameIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 drop-shadow-[0_2px_8px_rgba(249,115,22,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="flameOuterGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="60%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="flameMidGrad" x1="24" y1="14" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="flameCoreGrad" x1="24" y1="24" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FDE047" />
      </linearGradient>
    </defs>
    {/* Outer Fiery Layer */}
    <path
      d="M24 4C24 4 28 10 26 15C32 12 34 18 34 22C34 23.5 33.6 24.8 33 26C35 22 38 24 38 28C38 36.8 31.7 44 24 44C16.3 44 10 36.8 10 28C10 21 14.5 13.5 24 4Z"
      fill="url(#flameOuterGrad)"
    />
    {/* Mid Ember Layer */}
    <path
      d="M24 16C24 16 28.5 21 27 25C31.5 22.5 32 27 32 30C32 36 28.4 41 24 41C19.6 41 16 36 16 30C16 25 18.5 20.5 24 16Z"
      fill="url(#flameMidGrad)"
    />
    {/* Inner White-Hot Core */}
    <path
      d="M24 26C24 26 27 29.5 26 32C28.5 30.5 28 34 28 35.5C28 38.5 26.2 40 24 40C21.8 40 20 38.5 20 35.5C20 32.5 21.5 29 24 26Z"
      fill="url(#flameCoreGrad)"
    />
  </svg>
);

/**
 * ⚡ Dedicated nainixOne Energy XP Bolt
 */
export const XpBoltIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 drop-shadow-[0_2px_8px_rgba(234,179,8,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="boltGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    <path
      d="M28 4L12 25H25L20 44L36 23H23L28 4Z"
      fill="url(#boltGrad)"
      stroke="#CA8A04"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Specular Ridge */}
    <path d="M26 8L16 23H24L21 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

