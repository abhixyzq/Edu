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
  userAvatarUrl,
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
    <div className="relative flex items-center select-none group">
      
      {/* ─── Smart Game Quest Node ─── */}
      <div className="relative flex flex-col items-center">
        
        {/* Active Node: Pulsing Radar Aura & Scholar Avatar Pin */}
        {isActive && (
          <>
            {/* Ambient Energy Halo */}
            <div className="absolute -inset-3 rounded-full bg-violet-500/25 blur-md animate-pulse pointer-events-none" />
            <div className="absolute -inset-1 rounded-full border-2 border-violet-400/50 animate-ping pointer-events-none opacity-40" />

            {/* Scholar Avatar Pin Pointer */}
            <div className="absolute -top-13 z-30 flex flex-col items-center animate-bounce">
              <div className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest shadow-md border border-violet-400/60 mb-0.5 whitespace-nowrap">
                Next Quest
              </div>
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border-2 border-[#7c3aed] shadow-xl flex items-center justify-center overflow-hidden ring-2 ring-violet-200">
                <img
                  src={userAvatarUrl || '/images/trophy_cat.png'}
                  alt="Scholar"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Pointer Arrow */}
              <div className="w-2 h-2 bg-white border-r-2 border-b-2 border-[#7c3aed] rotate-45 -mt-1 shadow-xs" />
            </div>
          </>
        )}

        {/* 3D Smart Game Disc Button */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`Stage ${levelNumber} - ${title}`}
          className={`relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full p-1.5 transition-all duration-200 flex items-center justify-center ${
            isLocked
              ? 'cursor-not-allowed opacity-75'
              : 'cursor-pointer hover:scale-105 active:scale-95'
          }`}
        >
          {/* Outer Ring Pedestal */}
          <div
            className={`w-full h-full rounded-full p-1 flex items-center justify-center transition-all ${
              isActive
                ? 'bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] shadow-[0_8px_20px_rgba(124,58,237,0.35)] ring-4 ring-violet-400/30'
                : isCompleted
                ? 'bg-gradient-to-b from-[#10b981] to-[#047857] shadow-[0_6px_16px_rgba(16,185,129,0.25)] ring-2 ring-emerald-300/40'
                : isBoss
                ? 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-gradient-to-b from-slate-200 to-slate-300 shadow-inner'
            }`}
          >
            {/* Inner Core Stepping Surface */}
            <div
              className={`w-full h-full rounded-full flex items-center justify-center relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] text-white'
                  : isCompleted
                  ? 'bg-gradient-to-b from-[#059669] to-[#065f46] text-white'
                  : isBoss
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {/* Gloss Arc Top Highlight */}
              <div className="absolute top-1 left-2 right-2 h-3.5 rounded-full bg-white/30 blur-[0.5px] pointer-events-none" />

              {/* Core Icon / Stage Number */}
              {isCompleted ? (
                <div className="flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] sm:text-[28px] font-black leading-none text-white drop-shadow-xs">
                    check
                  </span>
                  <div className="flex gap-0.5 text-[8px] text-amber-300 leading-none mt-0.5">
                    ★
                  </div>
                </div>
              ) : isLocked ? (
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-slate-400">
                  lock
                </span>
              ) : isBoss ? (
                <span className="material-symbols-outlined text-[28px] sm:text-[32px] text-amber-200 drop-shadow-sm animate-pulse">
                  emoji_events
                </span>
              ) : (
                <span className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight leading-none drop-shadow-sm">
                  {levelNumber}
                </span>
              )}
            </div>
          </div>

          {/* Level Complete Star Crown Badge */}
          {isCompleted && (
            <div className="absolute -bottom-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[11px] font-black z-20">
              ✓
            </div>
          )}
        </button>
      </div>

      {/* ─── Smart Floating Quest Card ─── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col ${
          textSide === 'left'
            ? 'right-full mr-3.5 items-end text-right'
            : 'left-full ml-3.5 items-start text-left'
        }`}
      >
        <div
          className={`max-w-[135px] sm:max-w-[165px] p-2.5 rounded-2xl border backdrop-blur-md transition-all ${
            isActive
              ? 'bg-white/95 border-violet-300/80 shadow-[0_8px_25px_rgba(124,58,237,0.12)] ring-1 ring-violet-400/20'
              : isCompleted
              ? 'bg-white/90 border-slate-200 shadow-xs'
              : 'bg-white/60 border-slate-200/50 opacity-55'
          }`}
        >
          {/* Stage Pill */}
          <div className={`flex items-center gap-1 mb-1 ${textSide === 'left' ? 'justify-end' : 'justify-start'}`}>
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-violet-100 text-[#7c3aed]'
                  : isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              Stage {levelNumber}
            </span>
          </div>

          {/* Topic Title */}
          <h3 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
            {title}
          </h3>

          {/* Subtitle / MCQ count */}
          {subtitle && (
            <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
