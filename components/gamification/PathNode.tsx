'use client';

import React from 'react';
import { playButtonClick } from '@/lib/soundEffects';

export type NodeStatus = 'completed' | 'active' | 'locked' | 'boss';

export interface PathNodeProps {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  icon?: string;
  status: NodeStatus;
  stars?: number; // 0-3
  xpReward?: number;
  gemsReward?: number;
  onClick: () => void;
  isBoss?: boolean;
}

export const PathNode: React.FC<PathNodeProps> = ({
  number,
  title,
  subtitle,
  icon = 'school',
  status,
  stars = 0,
  xpReward = 20,
  gemsReward = 10,
  onClick,
  isBoss = false,
}) => {
  const handleClick = () => {
    if (status === 'locked') return;
    playButtonClick();
    onClick();
  };

  // Node color theming
  const getTheme = () => {
    if (status === 'locked') {
      return {
        btnBg: 'bg-[#e5e5e5] border-[#afafaf] text-[#afafaf]',
        ring: '',
        icon: 'lock',
      };
    }
    if (isBoss) {
      return {
        btnBg: 'bg-gradient-to-b from-[#ffd700] to-[#e6a800] border-[#b38300] text-[#594100]',
        ring: 'ring-4 ring-[#ffd700]/50 animate-pulse',
        icon: 'military_tech',
      };
    }
    if (status === 'completed') {
      return {
        btnBg: 'bg-gradient-to-b from-[#58cc02] to-[#46a302] border-[#388401] text-white',
        ring: '',
        icon: 'check',
      };
    }
    // Active
    return {
      btnBg: 'bg-gradient-to-b from-[#ff8c42] to-[#e66c1f] border-[#b84e0c] text-white',
      ring: 'ring-6 ring-[#ff8c42]/40 animate-pulse',
      icon,
    };
  };

  const theme = getTheme();

  return (
    <div className="flex flex-col items-center group relative select-none my-3">
      {/* Node Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'locked'}
        aria-label={`${title} - ${status}`}
        className={`relative ${isBoss ? 'w-22 h-22 sm:w-24 sm:h-24' : 'w-18 h-18 sm:w-20 sm:h-20'} rounded-full flex flex-col items-center justify-center border-b-6 active:border-b-0 active:translate-y-1.5 transition-all duration-150 shadow-lg ${
          theme.btnBg
        } ${theme.ring} ${status !== 'locked' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-80'}`}
      >
        {/* Shine Highlight Effect */}
        <div className="absolute top-2 left-3 right-3 h-4 bg-white/25 rounded-full blur-[1px]" />

        {/* Icon */}
        <span className={`material-symbols-outlined ${isBoss ? 'text-[36px]' : 'text-[28px]'} font-extrabold`}>
          {theme.icon}
        </span>

        {/* Lesson Number pill */}
        {status !== 'locked' && !isBoss && (
          <span className="text-[10px] font-extrabold tracking-wider opacity-90 -mt-0.5">
            L{number}
          </span>
        )}
      </button>

      {/* Star Rating Badge (Completed Nodes) */}
      {status === 'completed' && (
        <div className="flex gap-0.5 mt-1 bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-[#dde4e6]">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`material-symbols-outlined text-[13px] ${
                s <= stars ? 'text-[#ffd700] fill-current font-bold' : 'text-gray-300'
              }`}
            >
              star
            </span>
          ))}
        </div>
      )}

      {/* Floating Active "START" Indicator Pill */}
      {status === 'active' && (
        <div className="absolute -top-3.5 bg-[#9b4500] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md border-2 border-white animate-bounce tracking-widest">
          Start
        </div>
      )}

      {/* Title Label below node */}
      <div className="mt-1.5 text-center max-w-[130px]">
        <p className={`text-xs font-bold leading-tight ${status === 'locked' ? 'text-gray-400' : 'text-[#161d1f]'}`}>
          {title}
        </p>
        {subtitle && (
          <span className="text-[10px] text-[#897266] font-medium block mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
