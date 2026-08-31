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
 * Clean SVG Topic Illustrations matching modern course progress aesthetics
 */
export const TopicIcon: React.FC<{ type?: string; color: string; isLocked?: boolean }> = ({
  type = 'atom',
  color,
  isLocked = false,
}) => {
  if (isLocked) {
    return (
      <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    );
  }

  switch (type) {
    case 'brain': // Psychology / Deep Concept
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 6C11 6 7 10 7 15C7 19 9.5 22.5 13 23.6V26H19V23.6C22.5 22.5 25 19 25 15C25 10 21 6 16 6Z"
            fill="#FED7AA"
          />
          <path
            d="M12 14C12 11.8 13.8 10 16 10C18.2 10 20 11.8 20 14C20 16.5 17 18 16 20"
            stroke="#EA580C"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="23" r="1.2" fill="#EA580C" />
          <path d="M10 27H22" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'atom': // Physics / Electrostatics
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1.8" transform="rotate(-30 16 16)" />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1.8" transform="rotate(30 16 16)" />
          <circle cx="16" cy="16" r="4.5" fill={color} />
          <circle cx="16" cy="16" r="2" fill="white" />
        </svg>
      );

    case 'flask': // Chemistry
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M13 5H19M14 5V11L8 23C7.2 24.5 8.3 26.5 10 26.5H22C23.7 26.5 24.8 24.5 24 23L18 11V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 21L22 21" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="13" cy="23.5" r="1.2" fill="#F59E0B" />
          <circle cx="18" cy="23.5" r="1.5" fill="#F59E0B" />
        </svg>
      );

    case 'circuit': // Current & Electricity
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="7" y="7" width="18" height="18" rx="4" stroke={color} strokeWidth="2" />
          <path d="M16 4V7M16 25V28M4 16H7M25 16H28" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 16H20M16 12L20 16L16 20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'math': // Calculus / Integrals
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M10 24C10 24 12 25 14 23C16 21 16 11 18 9C20 7 22 8 22 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 15H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="9" r="1.5" fill="#3B82F6" />
        </svg>
      );

    case 'dna': // Biology / Genetics
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M10 7C12 11 20 13 22 17C24 21 18 24 16 26" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M22 7C20 11 12 13 10 17C8 21 14 24 16 26" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="10" x2="20" y2="10" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="11" y1="16" x2="21" y2="16" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="12" y1="22" x2="20" y2="22" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      );

    case 'trophy': // Boss / Exam
    default:
      return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
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

  // Ring & Circle styling matching the exact screenshot:
  // Completed / Active: Thick vibrant color border with white fill
  // Locked: Soft ice-blue / grey border with white fill
  const borderColor = isLocked ? '#e2e8f0' : themeColor;
  const codeColor = isLocked ? '#94a3b8' : themeColor;

  return (
    <div className="relative flex items-center select-none group">
      
      {/* ─── Node Circular Ring Button ─── */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLocked}
        aria-label={`${code} ${title} - ${status}`}
        style={{
          borderColor: borderColor,
          backgroundColor: '#ffffff',
        }}
        className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-[5px] flex items-center justify-center transition-transform duration-150 shadow-sm ${
          isLocked
            ? 'cursor-not-allowed opacity-80'
            : 'cursor-pointer hover:scale-105 active:scale-95'
        }`}
      >
        {/* Topic Vector Illustration */}
        <div className="flex items-center justify-center">
          <TopicIcon type={iconType} color={themeColor} isLocked={isLocked} />
        </div>

        {/* ─── Active Level User Profile Photo Floating Badge ─── */}
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

      {/* ─── Clean Side Label (Exact Screenshot Typography) ─── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col ${
          textSide === 'left'
            ? 'right-full mr-4 items-end text-right'
            : 'left-full ml-4 items-start text-left'
        }`}
      >
        <div className="max-w-[130px] sm:max-w-[160px] pointer-events-auto">
          {/* Module Code (e.g. 101, 102, 201) */}
          <span
            style={{ color: codeColor }}
            className="font-heading font-black text-sm sm:text-base leading-none tracking-tight block"
          >
            {code}
          </span>

          {/* Lesson Title Underneath */}
          <h3
            className={`text-xs sm:text-sm font-bold leading-tight mt-1 line-clamp-2 ${
              isLocked ? 'text-slate-400' : 'text-slate-800'
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
