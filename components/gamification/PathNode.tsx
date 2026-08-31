'use client';

import React from 'react';
import { playButtonClick } from '@/lib/soundEffects';

export type NodeStatus = 'completed' | 'active' | 'locked' | 'boss';

export interface PathNodeProps {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  status: NodeStatus;
  isBoss?: boolean;
  xpReward: number;
  gemsReward: number;
  onClick: () => void;
  side?: 'left' | 'right' | 'center';
}

export const PathNode: React.FC<PathNodeProps> = ({
  number,
  title,
  subtitle,
  status,
  isBoss = false,
  xpReward,
  gemsReward,
  onClick,
  side = 'right',
}) => {
  const handleClick = () => {
    if (status === 'locked') return;
    playButtonClick();
    onClick();
  };

  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  if (isBoss) {
    return (
      <div className="relative flex flex-col items-center justify-center select-none group">
        {/* Boss Milestone Capsule */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          className={`relative w-22 h-22 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            isLocked
              ? 'bg-slate-800/80 border-2 border-slate-700/60 text-slate-500 cursor-not-allowed opacity-75'
              : isCompleted
              ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-2 border-amber-300 text-amber-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95'
              : 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 border-2 border-violet-300 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] ring-4 ring-violet-500/30 hover:scale-105 active:scale-95 animate-pulse'
          }`}
        >
          {/* Boss Crown / Star */}
          <div className="flex items-center justify-center">
            {isCompleted ? (
              <span className="material-symbols-outlined text-[32px] font-black text-amber-950">
                workspace_premium
              </span>
            ) : isLocked ? (
              <span className="material-symbols-outlined text-[28px] text-slate-500">
                lock
              </span>
            ) : (
              <span className="material-symbols-outlined text-[32px] text-white">
                military_tech
              </span>
            )}
          </div>
          <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">
            {isBoss ? 'Exam Drill' : `L${number}`}
          </span>
        </button>

        {/* Boss Label & XP Pill */}
        <div className="mt-2.5 flex flex-col items-center text-center max-w-[160px] pointer-events-auto">
          <span className="text-xs font-black text-slate-900 leading-tight">
            {title}
          </span>
          <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
            +{xpReward} XP • +{gemsReward} 💎
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center select-none group">
      
      {/* ─── Node Interactive Orb ─── */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLocked}
        aria-label={`${title} - ${status}`}
        className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
          isLocked
            ? 'bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed'
            : isCompleted
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-emerald-400 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 cursor-pointer'
            : 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 border-2 border-violet-300 text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] ring-4 ring-violet-400/30 hover:scale-108 active:scale-95 cursor-pointer animate-pulse'
        }`}
      >
        {/* Top glossy sheen */}
        {!isLocked && (
          <div className="absolute top-1.5 left-3 right-3 h-2.5 bg-white/25 rounded-full blur-[0.5px]" />
        )}

        {/* Icon & Level */}
        {isCompleted ? (
          <span className="material-symbols-outlined text-[28px] font-black text-white">
            check
          </span>
        ) : isLocked ? (
          <span className="material-symbols-outlined text-[22px] text-slate-400">
            lock
          </span>
        ) : (
          <span className="material-symbols-outlined text-[30px] text-white">
            play_arrow
          </span>
        )}

        <span
          className={`text-[9px] font-black uppercase tracking-wider ${
            isLocked ? 'text-slate-400' : 'text-white/90'
          }`}
        >
          Lvl {number}
        </span>
      </button>

      {/* ─── Integrated Side Label Card ─── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col ${
          side === 'left'
            ? 'right-full mr-3.5 items-end text-right'
            : 'left-full ml-3.5 items-start text-left'
        }`}
      >
        <div
          className={`px-3 py-2 rounded-2xl border shadow-sm max-w-[130px] sm:max-w-[150px] pointer-events-auto transition-all ${
            isLocked
              ? 'bg-slate-50/90 border-slate-200 text-slate-400'
              : isCompleted
              ? 'bg-white/95 border-emerald-200 text-slate-800 shadow-[0_2px_10px_rgba(16,185,129,0.12)]'
              : 'bg-white border-violet-300 text-slate-900 shadow-[0_4px_14px_rgba(124,58,237,0.18)] ring-2 ring-violet-100'
          }`}
        >
          <div className="flex items-center gap-1 mb-0.5">
            {isCompleted && (
              <span className="text-[10px] font-black text-emerald-600 uppercase">
                Mastered
              </span>
            )}
            {isActive && (
              <span className="text-[10px] font-black text-violet-700 uppercase flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-ping" />
                Current
              </span>
            )}
            {isLocked && (
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Locked
              </span>
            )}
          </div>

          <p className="text-xs font-black leading-snug line-clamp-2">
            {title}
          </p>

          {subtitle && (
            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
