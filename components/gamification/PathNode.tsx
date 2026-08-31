'use client';

import React from 'react';
import { playButtonClick } from '@/lib/soundEffects';

export type NodeStatus = 'completed' | 'active' | 'locked' | 'boss';

export interface PathNodeProps {
  id: string;
  title: string;
  status: NodeStatus;
  onClick: () => void;
  progressText?: string;
  progressPercent?: number;
}

export const PathNode: React.FC<PathNodeProps> = ({
  title,
  status,
  onClick,
  progressText,
  progressPercent = 33,
}) => {
  const handleClick = () => {
    if (status === 'locked') return;
    playButtonClick();
    onClick();
  };

  // 1. In-progress white tile with radial ring (like the 1/3 card in the reference UI)
  if (status === 'active' && progressText) {
    return (
      <div className="flex flex-col items-center group relative select-none my-3">
        <button
          type="button"
          onClick={handleClick}
          aria-label={`${title} - In Progress`}
          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white border-2 border-[#e2e8f0] border-b-6 border-b-[#cbd5e1] flex items-center justify-center shadow-md active:border-b-2 active:translate-y-1 transition-all duration-150 cursor-pointer hover:scale-105"
        >
          {/* Radial Circular Progress Meter */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-[#e2e8f0]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress arc (yellow/amber) */}
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

        {/* Title Label */}
        <div className="mt-2 text-center max-w-[120px]">
          <p className="text-xs font-bold text-[#1e293b] leading-tight">{title}</p>
        </div>
      </div>
    );
  }

  // 2. Completed / Active / Locked 3D Squircle Tile
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  return (
    <div className="flex flex-col items-center group relative select-none my-3">
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
        {/* Shine highlight */}
        {!isLocked && (
          <div className="absolute top-2 left-3 right-3 h-3.5 bg-white/20 rounded-full blur-[0.5px]" />
        )}

        {/* Icon Inside Tile */}
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

      {/* Title Label */}
      <div className="mt-2 text-center max-w-[120px]">
        <p className={`text-xs font-bold leading-tight ${isLocked ? 'text-[#94a3b8]' : 'text-[#1e293b]'}`}>
          {title}
        </p>
      </div>
    </div>
  );
};
