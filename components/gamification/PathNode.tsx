'use client';

import React from 'react';
import { playButtonClick } from '@/lib/soundEffects';

export type NodeStatus = 'completed' | 'active' | 'locked';

export interface PathNodeProps {
  id: string;
  code: string; // e.g. "01", "02", "03"
  title: string;
  subtitle?: string;
  status: NodeStatus;
  isBoss?: boolean;
  themeColor: string; // e.g. "#10b981", "#3b82f6", "#8b5cf6"
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

  // Format code to clean level number (e.g. "01" -> "1")
  const levelNumber = code.replace(/^0+/, '') || code;

  return (
    <div className="relative flex items-center select-none group">
      
      {/* ─── 3D Gamified Circular Level Node ─── */}
      <div className="relative flex flex-col items-center">
        
        {/* Floating "READY" or "NEXT" indicator for Active Node */}
        {isActive && (
          <div className="absolute -top-7 z-30 animate-bounce">
            <span className="bg-[#7c3aed] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-violet-300 shadow-md flex items-center gap-0.5">
              <span>START</span>
              <span className="text-[10px]">⚡</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`Level ${levelNumber} ${title} - ${status}`}
          className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
            isLocked
              ? 'bg-[#f1f5f9] border-2 border-b-4 border-slate-300 text-slate-400 cursor-not-allowed opacity-90'
              : isCompleted
              ? 'border-2 border-b-5 border-emerald-700 text-white shadow-emerald-200 active:translate-y-1 active:border-b-2 hover:scale-105'
              : isBoss
              ? 'border-2 border-b-5 border-amber-600 text-white shadow-amber-200 active:translate-y-1 active:border-b-2 hover:scale-105 animate-pulse'
              : 'border-2 border-b-5 border-violet-800 text-white shadow-violet-200 active:translate-y-1 active:border-b-2 hover:scale-105 ring-4 ring-violet-400/30'
          }`}
          style={{
            background: isLocked
              ? '#f1f5f9'
              : isCompleted
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : isBoss
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          }}
        >
          {/* Inner Gloss Highlight Ring */}
          <div className="absolute inset-1 rounded-full border border-white/30 pointer-events-none" />

          {/* Node Center: Level Number & Topic Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {isLocked ? (
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[20px] text-slate-400">lock</span>
                <span className="font-game-num font-bold text-sm text-slate-400 mt-0.5 tracking-tight">
                  {levelNumber}
                </span>
              </div>
            ) : isBoss ? (
              <div className="flex flex-col items-center">
                <span className="text-sm">👑</span>
                <span className="font-game-num font-bold text-xl sm:text-2xl leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tight">
                  {levelNumber}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-game-num font-bold text-2xl sm:text-[28px] leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] tracking-tight">
                  {levelNumber}
                </span>
                {isCompleted && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="text-[11px] text-amber-300 font-black drop-shadow-2xs">★</span>
                    <span className="text-[11px] text-amber-300 font-black drop-shadow-2xs">★</span>
                    <span className="text-[11px] text-amber-300 font-black drop-shadow-2xs">★</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Active Level User Profile Photo Floating Badge ─── */}
          {isActive && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center overflow-hidden z-30 animate-pulse ring-2 ring-violet-200">
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={userName || 'You'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[11px] font-black text-white">
                  {(userName ? userName.charAt(0) : 'U').toUpperCase()}
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* ─── Clean Side Label with Title & XP Pill ─── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col ${
          textSide === 'left'
            ? 'right-full mr-3.5 items-end text-right'
            : 'left-full ml-3.5 items-start text-left'
        }`}
      >
        <div className="max-w-[130px] sm:max-w-[160px] pointer-events-auto bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          
          <div className="flex items-center gap-1 mb-0.5">
            <span
              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : isActive
                  ? 'bg-violet-100 text-violet-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              Level {levelNumber}
            </span>
          </div>

          {/* Lesson Title */}
          <h3
            className={`text-xs font-black leading-tight line-clamp-2 ${
              isLocked ? 'text-slate-400' : 'text-slate-900'
            }`}
          >
            {title}
          </h3>

          {subtitle && (
            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
