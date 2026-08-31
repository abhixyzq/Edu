'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick } from '@/lib/soundEffects';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser();

  // Hide navbars on focused test taking screen (/test/[id]), auth pages, and admin pages
  if (pathname?.startsWith('/test/') || pathname === '/login' || pathname === '/signup' || pathname?.startsWith('/admin')) {
    return null;
  }

  const bottomTabs = [
    { href: '/', label: 'Learn', icon: 'school' },
    { href: '/tests', label: 'Practice', icon: 'bolt' },
    { href: '/shop', label: 'MAX', icon: 'verified', hasDot: true },
    { href: '/leaderboard', label: 'Leaderboard', icon: 'emoji_events', hasDot: true },
    { href: '/profile', label: 'Profile', icon: 'account_circle' },
  ];

  const handleTabClick = () => {
    playButtonClick();
  };

  return (
    <>
      {/* ─── Top App Header: 3 Pill Boxes ─── */}
      <header className="sticky top-0 z-40 w-full bg-[#f4f5fa] border-b border-[#e2e8f0]/80 shadow-2xs select-none">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2.5">
          {/* Pill 1: Code / Gems Counter */}
          <Link
            href="/shop"
            onClick={handleTabClick}
            className="flex-1 bg-white/90 hover:bg-white border border-[#e2e8f0] rounded-2xl py-2 px-3 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <div className="w-5 h-5 rounded-md bg-amber-400 text-white font-black text-[11px] flex items-center justify-center shadow-2xs">
              &lt;/&gt;
            </div>
            <span className="text-sm font-black text-[#1e293b]">{user.gems * 5 || 798}</span>
          </Link>

          {/* Pill 2: Keys / Passes */}
          <Link
            href="/shop"
            onClick={handleTabClick}
            className="flex-1 bg-white/90 hover:bg-white border border-[#e2e8f0] rounded-2xl py-2 px-3 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span className="text-base leading-none">🔑</span>
            <span className="text-sm font-black text-[#1e293b]">{user.hearts}</span>
          </Link>

          {/* Pill 3: Streak Flame */}
          <Link
            href="/profile"
            onClick={handleTabClick}
            className="flex-1 bg-white/90 hover:bg-white border border-[#e2e8f0] rounded-2xl py-2 px-3 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span className="text-base leading-none">🔥</span>
            <span className="text-sm font-black text-[#1e293b]">{user.streakDays}</span>
          </Link>
        </div>

        {/* ─── Promo / Announcement Banner ─── */}
        <div className="w-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white px-4 py-2.5 shadow-xs flex items-center justify-between">
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-amber-300 text-lg leading-none tracking-tight">
                pro
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-white/95 leading-tight">
                Back-to-school: 60% off until September 1
              </span>
            </div>

            <Link
              href="/shop"
              onClick={handleTabClick}
              className="bg-white hover:bg-amber-50 text-[#7c3aed] text-[11px] font-black px-3 py-1 rounded-full shrink-0 shadow-xs transition-all active:scale-95"
            >
              Get 60% off
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Mobile App Bottom Navigation Dock ─── */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/98 backdrop-blur-md border-t border-[#e2e8f0] pb-safe z-40 shadow-[0_-3px_16px_rgba(0,0,0,0.04)] select-none">
        <div className="max-w-md mx-auto h-15 flex items-center justify-around px-1">
          {bottomTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={handleTabClick}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center justify-center flex-1 h-full py-1 group relative transition-all active:scale-90"
              >
                {/* Notification red dot if applicable */}
                {tab.hasDot && !isActive && (
                  <span className="absolute top-2.5 right-[30%] w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}

                {/* Icon */}
                <div className="relative flex items-center justify-center transition-all duration-200">
                  <span
                    className={`material-symbols-outlined text-[23px] transition-transform duration-200 ${
                      isActive ? 'text-[#1e293b]' : 'text-[#94a3b8] group-hover:text-[#64748b]'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : undefined}
                  >
                    {tab.icon}
                  </span>
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                    isActive ? 'font-black text-[#1e293b]' : 'font-semibold text-[#94a3b8]'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
