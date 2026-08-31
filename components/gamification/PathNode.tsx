'use client';

import React from 'react';
import { playButtonClick } from '@/lib/soundEffects';

export type NodeStatus = 'completed' | 'active' | 'locked' | 'boss';

export interface PathNodeProps {
  id: string;
  title: string;
  subtitle?: string;
  status: NodeStatus;
  onClick: () => void;
  progressText?: string;
  progressPercent?: number;
  side?: 'left' | 'right';
}

export const PathNode: React.FC<PathNodeProps> = ({
  title,
  status,
  onClick,
  progressText,
  progressPercent = 33,
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

  return (
    <div className="relative select-none flex items-center justify-center">
      {/* ─── Level Button ─── */}
      {status === 'active' && progressText ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label={`${title} - In Progress`}
          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white border-2 border-[#e2e8f0] border-b-6 border-b-[#cbd5e1] flex items-center justify-center shadow-md active:border-b-2 active:translate-y-1 transition-all duration-150 cursor-pointer hover:scale-105"
        >
          {/* Radial Circular Progress Meter */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#e2e8f0]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#f59e0b]"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#1e293b]">
              {progressText}
            </span>
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`${title} - ${status}`}
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex items-center justify-center transition-all duration-150 shadow-md ${
            isLocked
              ? 'bg-[#f1f5f9] border-2 border-[#e2e8f0] border-b-6 border-b-[#cbd5e1] text-[#94a3b8] cursor-not-allowed opacity-85'
              : isCompleted
              ? 'bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] border-2 border-[#8b5cf6] border-b-6 border-b-[#6d28d9] text-white cursor-pointer hover:scale-105 active:border-b-2 active:translate-y-1'
              : 'bg-gradient-to-b from-[#9061f9] to-[#7e3af2] border-2 border-[#7e3af2] border-b-6 border-b-[#5521b5] text-white cursor-pointer hover:scale-105 active:border-b-2 active:translate-y-1 ring-4 ring-[#8b5cf6]/40'
          }`}
        >
          {!isLocked && (
            <div className="absolute top-2 left-3 right-3 h-3.5 bg-white/20 rounded-full blur-[0.5px]" />
          )}

          {isCompleted ? (
            <span className="material-symbols-outlined text-[34px] font-black text-white">
              check
            </span>
          ) : isLocked ? (
            <span className="material-symbols-outlined text-[28px] text-[#94a3b8]">
              lock
            </span>
          ) : (
            <span className="material-symbols-outlined text-[32px] text-white font-black animate-pulse">
              bolt
            </span>
          )}
        </button>
      )}

      {/* ─── Side Topic Heading Pill (Clean Side Positioning) ─── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col ${
          side === 'left'
            ? 'right-full mr-3.5 items-end text-right'
            : 'left-full ml-3.5 items-start text-left'
        }`}
      >
        <div
          className={`px-3 py-1.5 rounded-2xl border shadow-sm max-w-[125px] sm:max-w-[140px] pointer-events-auto transition-all ${
            isLocked
              ? 'bg-slate-100/95 border-slate-200 text-slate-400'
              : isCompleted
              ? 'bg-white/95 backdrop-blur-md border-purple-200 text-slate-900 shadow-[0_2px_8px_rgba(139,92,246,0.12)]'
              : 'bg-white border-purple-300 text-purple-950 font-black shadow-[0_4px_12px_rgba(124,58,237,0.18)] ring-2 ring-purple-100'
          }`}
        >
          <p className="text-xs font-black leading-tight line-clamp-2">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};
