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

/**
 * Topic Vectors matching Duolingo / Khan gamified style
 */
export const TopicIcon: React.FC<{ type?: string; color: string; isLocked?: boolean }> = ({
  type = 'atom',
  color,
  isLocked = false,
}) => {
  if (isLocked) {
    return (
      <svg className="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    );
  }

  switch (type) {
    case 'brain':
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path d="M16 6C11 6 7 10 7 15C7 19 9.5 22.5 13 23.6V26H19V23.6C22.5 22.5 25 19 25 15C25 10 21 6 16 6Z" fill="#FED7AA" />
          <path d="M12 14C12 11.8 13.8 10 16 10C18.2 10 20 11.8 20 14C20 16.5 17 18 16 20" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="23" r="1.2" fill="#EA580C" />
          <path d="M10 27H22" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'atom':
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke={color} strokeWidth="1.8" transform="rotate(-30 16 16)" />
          <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke={color} strokeWidth="1.8" transform="rotate(30 16 16)" />
          <circle cx="16" cy="16" r="3.5" fill={color} />
          <circle cx="16" cy="16" r="1.5" fill="white" />
        </svg>
      );

    case 'flask':
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path d="M13 5H19M14 5V11L8 23C7.2 24.5 8.3 26.5 10 26.5H22C23.7 26.5 24.8 24.5 24 23L18 11V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 21L22 21" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="13" cy="23.5" r="1.2" fill="#F59E0B" />
          <circle cx="18" cy="23.5" r="1.5" fill="#F59E0B" />
        </svg>
      );

    case 'circuit':
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <rect x="7" y="7" width="18" height="18" rx="4" stroke={color} strokeWidth="2" />
          <path d="M16 4V7M16 25V28M4 16H7M25 16H28" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 16H20M16 12L20 16L16 20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'math':
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path d="M10 24C10 24 12 25 14 23C16 21 16 11 18 9C20 7 22 8 22 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 15H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="9" r="1.5" fill="#3B82F6" />
        </svg>
      );

    case 'dna':
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path d="M10 7C12 11 20 13 22 17C24 21 18 24 16 26" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M22 7C20 11 12 13 10 17C8 21 14 24 16 26" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="10" x2="20" y2="10" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="11" y1="16" x2="21" y2="16" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      );

    case 'trophy':
    default:
      return (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path d="M9 7H23V14C23 18 19.8 21 16 21C12.2 21 9 18 9 14V7Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
          <path d="M9 10H6C4.9 10 4 10.9 4 12C4 14.5 6 16.5 8.5 16.5H9" stroke="#CA8A04" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M23 10H26C27.1 10 28 10.9 28 12C28 14.5 26 16.5 23.5 16.5H23" stroke="#CA8A04" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 21V25M11 25H21" stroke="#CA8A04" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
};

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

  // 3D Shadow and Bevel Colors
  const shadowColor = isLocked
    ? '#cbd5e1'
    : isCompleted
    ? '#047857'
    : isBoss
    ? '#b45309'
    : '#5b21b6';

  const ringBg = isLocked
    ? '#e2e8f0'
    : isCompleted
    ? themeColor
    : isBoss
    ? '#f59e0b'
    : themeColor;

  return (
    <div className="relative flex items-center select-none group">
      
      {/* ─── 3D Gamified Circular Level Token ─── */}
      <div className="relative flex flex-col items-center">
        
        {/* Floating Level Number Pill Badge on Top of the Ring */}
        <div
          className={`absolute -top-3 z-30 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tight shadow-md flex items-center gap-1 border ${
            isLocked
              ? 'bg-slate-200 text-slate-500 border-slate-300'
              : isCompleted
              ? 'bg-emerald-600 text-white border-emerald-400'
              : isActive
              ? 'bg-violet-600 text-white border-violet-300 ring-2 ring-violet-200 animate-pulse'
              : 'bg-white text-slate-800 border-slate-200'
          }`}
        >
          {isBoss ? (
            <span>👑 Boss</span>
          ) : isCompleted ? (
            <span className="flex items-center gap-0.5">
              <span>{levelNumber}</span>
              <span className="text-[9px]">✓</span>
            </span>
          ) : (
            <span className="font-heading font-black">Level {levelNumber}</span>
          )}
        </div>

        {/* 3D Button Outer Ring */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`Level ${levelNumber} ${title} - ${status}`}
          style={{
            backgroundColor: ringBg,
            boxShadow: `0 6px 0 ${shadowColor}`,
          }}
          className={`relative w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-full flex items-center justify-center transition-all duration-150 ${
            isLocked
              ? 'cursor-not-allowed opacity-90'
              : 'cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-none'
          } ${isActive ? 'ring-4 ring-violet-400/40 ring-offset-2' : ''}`}
        >
          {/* Inner Recessed Coin Base Plate */}
          <div
            className={`w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] rounded-full flex flex-col items-center justify-center shadow-inner transition-transform ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700'
                : isLocked
                ? 'bg-slate-100 text-slate-400'
                : 'bg-white'
            }`}
          >
            {isCompleted ? (
              <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-emerald-600 font-black">
                  check_circle
                </span>
                <span className="text-[9px] font-black text-emerald-800 -mt-0.5">Done</span>
              </div>
            ) : isBoss ? (
              <div className="flex flex-col items-center justify-center">
                <TopicIcon type="trophy" color="#d97706" isLocked={isLocked} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <TopicIcon type={iconType} color={themeColor} isLocked={isLocked} />
              </div>
            )}
          </div>

          {/* ─── Active User Avatar Badge on the Ring ─── */}
          {isActive && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center overflow-hidden z-30 animate-bounce ring-2 ring-violet-200">
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
            ? 'right-full mr-4 items-end text-right'
            : 'left-full ml-4 items-start text-left'
        }`}
      >
        <div className="max-w-[130px] sm:max-w-[160px] pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all">
          
          <div className="flex items-center gap-1 mb-1">
            <span
              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : isActive
                  ? 'bg-violet-100 text-violet-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              Step {levelNumber}
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
