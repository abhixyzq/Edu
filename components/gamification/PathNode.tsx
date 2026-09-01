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
}

export const PathNode: React.FC<PathNodeProps> = ({
  code,
  title,
  subtitle,
  status,
  isBoss = false,
  themeColor,
  iconType,
  userAvatarUrl,
  userName,
  onClick,
  textSide = 'right',
}) => {
  const handleClick = () => {
    if (status === 'locked') return;
    playButtonClick();
    onClick();
  };

  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  const levelNumber = code.replace(/^0+/, '') || code;

  return (
    <div className="relative flex items-center select-none">
      
      {/* ─── 3D Stepping Stone Pedestal (Matching Exact Reference Screenshot) ─── */}
      <div className="relative flex flex-col items-center">
        
        {/* Active Node: Golden Radiant Glow & Sparkles */}
        {isActive && (
          <>
            <div className="absolute -inset-4 rounded-full bg-yellow-300/40 blur-lg animate-pulse pointer-events-none" />
            <div className="absolute -inset-2 rounded-full border-2 border-yellow-200/80 shadow-[0_0_20px_rgba(253,224,71,0.6)] animate-spin-slow pointer-events-none" />
            
            {/* Mascot Pin Pointer Above Active Node */}
            <div className="absolute -top-13 z-30 flex flex-col items-center animate-bounce">
              <div className="w-12 h-12 rounded-full bg-white p-1 border-2 border-yellow-400 shadow-xl flex items-center justify-center overflow-hidden ring-2 ring-white">
                <img
                  src={userAvatarUrl || '/images/trophy_cat.png'}
                  alt="Scholar"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Pointer Triangle */}
              <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-yellow-400 rotate-45 -mt-1.5 shadow-2xs" />
            </div>
          </>
        )}

        {/* 3D Pedestal Button */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`Level ${levelNumber} - ${title}`}
          className={`relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full p-[6px] transition-transform duration-150 flex items-center justify-center ${
            isLocked
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:scale-105 active:scale-95'
          }`}
          style={{
            // 3D White/Ice-Blue Pedestal Base
            background: isActive
              ? 'linear-gradient(180deg, #ffffff 0%, #fff9c4 40%, #e1f5fe 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #edf4fa 50%, #d3e5f5 100%)',
            boxShadow: isActive
              ? '0 8px 0 #d7ccc8, 0 12px 18px rgba(0,0,0,0.22)'
              : isCompleted
              ? '0 8px 0 #a7d7c5, 0 12px 18px rgba(0,0,0,0.2)'
              : '0 8px 0 #9cbcd9, 0 12px 18px rgba(0,0,0,0.2)',
          }}
        >
          {/* Inner 3D Stepping Disc */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center shadow-inner relative overflow-hidden"
            style={{
              background: isActive
                ? 'linear-gradient(180deg, #fff176 0%, #fbc02d 60%, #f57f17 100%)'
                : isCompleted
                ? 'linear-gradient(180deg, #6ee7b7 0%, #10b981 60%, #047857 100%)'
                : 'linear-gradient(180deg, #c4d4e6 0%, #9cb3ce 60%, #7d96b4 100%)',
              boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.8), inset 0 -3px 4px rgba(0,0,0,0.2)',
            }}
          >
            {/* Top Gloss Arc Highlight */}
            <div className="absolute top-1 left-2 right-2 h-4 rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />

            {/* Embossed Level Number */}
            <span
              className="font-game-num font-bold text-2xl sm:text-[30px] leading-none text-white tracking-tight relative z-10 select-none"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.45)',
              }}
            >
              {levelNumber}
            </span>
          </div>

          {/* Locked Ice-Blue Padlock Attached to Pedestal Lip */}
          {isLocked && (
            <div className="absolute -bottom-2 w-7 h-7 rounded-full bg-gradient-to-b from-[#e0f2fe] to-[#bae6fd] border-2 border-white shadow-md flex items-center justify-center text-[#0284c7] z-20">
              <span className="material-symbols-outlined text-[15px] font-black">lock</span>
            </div>
          )}

          {/* Completed Checkmark on Pedestal Lip */}
          {isCompleted && (
            <div className="absolute -bottom-2 w-7 h-7 rounded-full bg-gradient-to-b from-[#a7f3d0] to-[#10b981] border-2 border-white shadow-md flex items-center justify-center text-white z-20">
              <span className="material-symbols-outlined text-[15px] font-black">check</span>
            </div>
          )}
        </button>
      </div>

      {/* ─── Clean Floating Topic Name (Direct Text Without Card Box or Level Badge) ─── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col ${
          textSide === 'left'
            ? 'right-full mr-3.5 items-end text-right'
            : 'left-full ml-3.5 items-start text-left'
        }`}
      >
        <div className="max-w-[130px] sm:max-w-[160px] pointer-events-auto">
          {/* Topic Title */}
          <h3
            className={`text-xs sm:text-sm font-black leading-tight line-clamp-2 select-none ${
              isLocked
                ? 'text-white/55'
                : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
            }`}
          >
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-[10px] sm:text-[11px] font-bold truncate mt-0.5 select-none ${
                isLocked ? 'text-white/40' : 'text-purple-100/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
