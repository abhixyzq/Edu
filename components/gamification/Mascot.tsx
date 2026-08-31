'use client';

import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'cheering' | 'thinking' | 'crying_funny';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  speechText?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 120,
  className = '',
  speechText,
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble (if text provided) */}
      {speechText && (
        <div className="mb-2 bg-white px-3.5 py-1.5 rounded-2xl shadow-md border-2 border-[#ff8c42] text-xs font-bold text-[#161d1f] relative animate-bounce max-w-[200px] text-center">
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-[#ff8c42]" />
        </div>
      )}

      {/* SVG Animated Mascot Graphic */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 transform hover:scale-105"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="55" ry="12" fill="#000000" fillOpacity="0.12" />

        {/* Body (Emerald/Teal Feather Gradient) */}
        <circle cx="100" cy="115" r="62" fill="url(#body_grad)" stroke="#2b825b" strokeWidth="6" />
        <ellipse cx="100" cy="130" rx="40" ry="36" fill="#f7fbf8" />

        {/* Graduation Cap (Scholar Touch) */}
        <path d="M40 75 L100 45 L160 75 L100 95 Z" fill="#9b4500" stroke="#6a2d00" strokeWidth="4" />
        <rect x="75" y="80" width="50" height="16" rx="4" fill="#6a2d00" />
        <circle cx="100" cy="70" r="5" fill="#ffd700" />
        {/* Tassel */}
        <path d="M100 70 Q135 75 145 98" stroke="#ffd700" strokeWidth="4" strokeLinecap="round" />
        <circle cx="145" cy="100" r="5" fill="#ffd700" />

        {/* Wings */}
        {mood === 'cheering' || mood === 'happy' ? (
          <>
            {/* Raised celebration wings */}
            <path d="M45 105 C20 80 15 55 35 60 C55 65 55 100 50 120 Z" fill="#38a169" stroke="#2b825b" strokeWidth="4" />
            <path d="M155 105 C180 80 185 55 165 60 C145 65 145 100 150 120 Z" fill="#38a169" stroke="#2b825b" strokeWidth="4" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <path d="M42 110 C28 125 30 155 46 148 C58 142 55 125 50 115 Z" fill="#38a169" stroke="#2b825b" strokeWidth="4" />
            {/* Wing scratching chin */}
            <path d="M155 120 C140 95 115 110 125 125 C135 140 150 145 155 120 Z" fill="#38a169" stroke="#2b825b" strokeWidth="4" />
          </>
        ) : (
          <>
            {/* Resting wings */}
            <path d="M42 110 C28 125 30 155 46 148 C58 142 55 125 50 115 Z" fill="#38a169" stroke="#2b825b" strokeWidth="4" />
            <path d="M158 110 C172 125 170 155 154 148 C142 142 145 125 150 115 Z" fill="#38a169" stroke="#2b825b" strokeWidth="4" />
          </>
        )}

        {/* Eyes & Glasses (Big Duolingo-style smart eyes) */}
        {mood === 'crying_funny' ? (
          <>
            {/* Crying eyes */}
            <path d="M72 105 Q85 92 98 105" stroke="#161d1f" strokeWidth="6" strokeLinecap="round" />
            <path d="M102 105 Q115 92 128 105" stroke="#161d1f" strokeWidth="6" strokeLinecap="round" />
            {/* Funny cartoon tears */}
            <path d="M70 118 Q60 140 70 150 Q80 140 70 118" fill="#60a5fa" />
            <path d="M130 118 Q140 140 130 150 Q120 140 130 118" fill="#60a5fa" />
          </>
        ) : mood === 'happy' || mood === 'cheering' ? (
          <>
            {/* Joyful curved happy eye arcs */}
            <path d="M70 110 Q85 95 100 110" stroke="#161d1f" strokeWidth="6" strokeLinecap="round" />
            <path d="M100 110 Q115 95 130 110" stroke="#161d1f" strokeWidth="6" strokeLinecap="round" />
            {/* Blush cheeks */}
            <circle cx="68" cy="122" r="8" fill="#f87171" fillOpacity="0.6" />
            <circle cx="132" cy="122" r="8" fill="#f87171" fillOpacity="0.6" />
          </>
        ) : mood === 'thinking' ? (
          <>
            {/* Thinking / Curious eyes looking up */}
            <circle cx="82" cy="108" r="16" fill="white" stroke="#161d1f" strokeWidth="4" />
            <circle cx="118" cy="108" r="16" fill="white" stroke="#161d1f" strokeWidth="4" />
            <circle cx="85" cy="102" r="7" fill="#161d1f" />
            <circle cx="121" cy="102" r="7" fill="#161d1f" />
          </>
        ) : (
          <>
            {/* Default Bright Intelligent Eyes */}
            <circle cx="82" cy="108" r="16" fill="white" stroke="#161d1f" strokeWidth="4" />
            <circle cx="118" cy="108" r="16" fill="white" stroke="#161d1f" strokeWidth="4" />
            <circle cx="84" cy="108" r="7" fill="#161d1f" />
            <circle cx="116" cy="108" r="7" fill="#161d1f" />
            <circle cx="87" cy="105" r="2.5" fill="white" />
            <circle cx="119" cy="105" r="2.5" fill="white" />
          </>
        )}

        {/* Orange Beak */}
        <polygon points="90,118 110,118 100,136" fill="#ff8c42" stroke="#d96500" strokeWidth="3" />

        {/* Feet / Talons */}
        <ellipse cx="82" cy="176" rx="12" ry="7" fill="#ff8c42" stroke="#d96500" strokeWidth="3" />
        <ellipse cx="118" cy="176" rx="12" ry="7" fill="#ff8c42" stroke="#d96500" strokeWidth="3" />

        {/* Gradient Defs */}
        <defs>
          <linearGradient id="body_grad" x1="100" y1="53" x2="100" y2="177" gradientUnits="userSpaceOnUse">
            <stop stopColor="#48bb78" />
            <stop offset="1" stopColor="#2f855a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
