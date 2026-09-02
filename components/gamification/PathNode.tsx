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
        
        {/* Scholar Mini Avatar Pin on Outer Track Loop (Active State) */}
        {isActive && (
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="w-7 h-7 rounded-full bg-white p-0.5 border-2 border-[#ff6937] shadow-md flex items-center justify-center overflow-hidden ring-2 ring-orange-100">
              <img
                src={imageSrc}
                alt="Scholar"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Circular Node Button */}
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Stage ${levelNumber} - ${title}`}
          className={`relative w-[82px] h-[82px] sm:w-[90px] sm:h-[90px] rounded-full p-1 transition-all duration-200 flex items-center justify-center bg-white cursor-pointer hover:scale-105 active:scale-95 ${
            isActive
              ? 'ring-4 ring-pink-300 border-2 border-pink-400 shadow-lg shadow-pink-200/50'
              : isCompleted
              ? 'ring-4 ring-purple-200 border-2 border-purple-400 shadow-md shadow-purple-100'
              : 'ring-4 ring-amber-200 border-2 border-amber-300 shadow-sm opacity-90'
          }`}
        >
          {/* Inner Illustration Disc */}
          <div
            className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden p-2.5 relative ${
              isActive
                ? 'bg-gradient-to-br from-pink-50 to-orange-50'
                : isCompleted
                ? 'bg-gradient-to-br from-purple-50 to-blue-50'
                : 'bg-gradient-to-br from-amber-50 to-orange-50'
            }`}
          >
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-contain hover:scale-110 transition-transform"
            />
          </div>

          {/* Completed Green Checkmark Badge (Exact Screenshot) */}
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
        <h3 className="font-heading text-base font-black text-slate-800 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs font-bold text-slate-400 mt-0.5 mb-2">
          {subtitle || '10 minutes'}
        </p>

        {/* Action Button Strip (Exact Reference Screenshot) */}
        {isActive ? (
          <div className="flex items-center gap-1.5">
            {/* List Icon Button */}
            <button
              type="button"
              onClick={handleClick}
              className="w-8 h-8 rounded-xl bg-[#ff6937] hover:bg-[#e85a2b] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-orange-300/40 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">menu</span>
            </button>
            {/* Start Pill Button */}
            <button
              type="button"
              onClick={handleClick}
              className="px-5 py-1.5 rounded-xl bg-[#ff6937] hover:bg-[#e85a2b] text-white font-black text-xs shadow-md shadow-orange-300/60 flex items-center gap-1 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <span>START</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
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
