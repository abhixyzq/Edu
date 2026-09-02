'use client';

import React from 'react';
import { playButtonClick } from '@/lib/soundEffects';

export type NodeStatus = 'completed' | 'active' | 'locked';

export interface PathNodeProps {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  status: NodeStatus;
  isBoss?: boolean;
  themeColor: string;
  iconType?: string;
  userAvatarUrl?: string;
  userName?: string;
  onClick: () => void;
  textSide?: 'left' | 'right';
  unitTitle?: string;
  xpReward?: number;
}

export const PathNode: React.FC<PathNodeProps> = ({
  code,
  title,
  subtitle,
  status,
  isBoss = false,
  userAvatarUrl,
  onClick,
  textSide = 'right',
}) => {
  const handleClick = () => {
    playButtonClick();
    onClick();
  };

  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  const levelNumber = code.replace(/^0+/, '') || code;

  // Visual avatars / poses
  const imageSrc = userAvatarUrl || '/images/trophy_cat.png';

  return (
    <div className="relative flex items-center select-none w-full max-w-[340px] mx-auto justify-between px-1">
      
      {/* ─── Circular Graphic Node ─── */}
      <div className={`relative flex flex-col items-center ${textSide === 'left' ? 'order-2' : 'order-1'}`}>
        
        {/* Circular Node Button */}
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Stage ${levelNumber} - ${title}`}
          className={`relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full p-1 transition-all duration-200 flex items-center justify-center bg-white cursor-pointer hover:scale-105 active:scale-95 ${
            isActive
              ? 'ring-4 ring-orange-300 border-2 border-orange-400 shadow-lg shadow-orange-200/50'
              : isCompleted
              ? 'ring-4 ring-emerald-200 border-2 border-emerald-400 shadow-md shadow-emerald-100'
              : 'ring-4 ring-slate-200 border-2 border-slate-300 shadow-xs opacity-75'
          }`}
        >
          {/* Inner Disc with Bold Number 1, 2, 3... */}
          <div
            className={`w-full h-full rounded-full flex items-center justify-center relative shadow-inner ${
              isActive
                ? 'bg-gradient-to-br from-[#ff7a45] to-[#ff5222] text-white'
                : isCompleted
                ? 'bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {/* Top Gloss Highlight */}
            <div className="absolute top-1 left-2 right-2 h-3.5 rounded-full bg-white/30 blur-[0.5px] pointer-events-none" />

            <span className="font-heading font-black text-2xl sm:text-3xl leading-none select-none drop-shadow-xs">
              {levelNumber}
            </span>
          </div>

          {/* Completed Green Checkmark Badge */}
          {isCompleted && (
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#22c55e] border-2 border-white shadow-xs flex items-center justify-center text-white z-20">
              <span className="material-symbols-outlined text-[14px] font-black">check</span>
            </div>
          )}
        </button>
      </div>

      {/* ─── Side Content Information (Exact Reference) ─── */}
      <div
        className={`flex-1 flex flex-col ${
          textSide === 'left' ? 'order-1 items-end text-right pr-4' : 'order-2 items-start text-left pl-4'
        }`}
      >
        {/* Title */}
        <h3 className="font-heading text-base font-black text-slate-800 leading-tight mb-2">
          {title}
        </h3>

        {/* Action Button Strip */}
        {isActive ? (
          <button
            type="button"
            onClick={handleClick}
            className="px-4 py-1 rounded-full bg-[#ff6937] text-white font-black text-[10px] tracking-widest uppercase shadow-xs flex items-center gap-1 hover:bg-[#e85a2b] transition-colors cursor-pointer animate-pulse"
          >
            <span>IN PROGRESS</span>
          </button>
        ) : isCompleted ? (
          <button
            type="button"
            onClick={handleClick}
            className="px-4 py-1 rounded-full bg-[#22c55e] text-white font-black text-[10px] tracking-widest uppercase shadow-xs flex items-center gap-1 hover:bg-[#16a34a] transition-colors cursor-pointer"
          >
            <span>COMPLETED</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="px-4 py-1 rounded-full bg-slate-200/90 text-slate-600 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            <span>LOCKED</span>
          </button>
        )}
      </div>

    </div>
  );
};
