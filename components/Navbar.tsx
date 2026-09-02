'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick } from '@/lib/soundEffects';
import { GemIcon, HeartLifeIcon, StreakFlameIcon, NainixOneLogo } from '@/components/icons/AppIcons';

import { BrandLogo } from '@/components/BrandLogo';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser();

  // Hide navbars on test taking screen, auth pages, standalone legal pages, and admin pages
  if (
    pathname?.startsWith('/test/') || 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname === '/forgot-password' || 
    pathname === '/forgot-pass' || 
    pathname === '/about' || 
    pathname === '/privacy' || 
    pathname === '/terms' || 
    pathname === '/refund' || 
    pathname === '/disclaimer' || 
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  const bottomTabs = [
    { href: '/', label: 'Learn', icon: 'school' },
    { href: '/tests', label: 'Practice', icon: 'bolt' },
    { href: '/friends', label: 'Friends', icon: 'group', hasDot: false },
    { href: '/leaderboard', label: 'Rankings', icon: 'emoji_events' },
    { href: '/profile', label: 'Profile', icon: 'account_circle' },
  ];

  const handleTabClick = () => {
    playButtonClick();
  };

  return (
    <>
      {/* ─── Top Ultra-Premium Header (Hidden on '/' to show dedicated Learn Header) ─── */}
      {pathname !== '/' && (
        <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] select-none transition-all">
          <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
            
            {/* Brand Text Logo */}
            <Link
              href="/"
              onClick={handleTabClick}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <BrandLogo size="md" />
            </Link>

            {/* Gamified Live Stats Capsules */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* 1. Gems Capsule */}
              <Link
                href="/shop"
                onClick={handleTabClick}
                className="px-2.5 py-1 rounded-2xl bg-cyan-50/80 hover:bg-cyan-100/90 border border-cyan-200/80 flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_2px_8px_rgba(6,182,212,0.12)] group"
                title="Your Gems"
              >
                <GemIcon size={18} className="group-hover:scale-115 transition-transform" />
                <span className="text-xs font-black text-cyan-900">{user.gems}</span>
              </Link>

              {/* 2. Lives / Hearts Capsule */}
              <Link
                href="/shop"
                onClick={handleTabClick}
                className="px-2.5 py-1 rounded-2xl bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/80 flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_2px_8px_rgba(244,63,94,0.12)] group"
                title="Your Lives"
              >
                <HeartLifeIcon size={18} className="group-hover:scale-115 transition-transform" />
                <span className="text-xs font-black text-rose-900">
                  {user.infiniteHeartsUntil && Date.now() < user.infiniteHeartsUntil ? '∞' : user.hearts}
                </span>
              </Link>

              {/* 3. Streak Capsule */}
              <Link
                href="/profile"
                onClick={handleTabClick}
                className="px-2.5 py-1 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_2px_8px_rgba(245,158,11,0.12)] group"
                title="Daily Streak"
              >
                <StreakFlameIcon size={18} className="group-hover:scale-115 transition-transform" />
                <span className="text-xs font-black text-amber-900">{user.streakDays}</span>
              </Link>

            </div>

          </div>
        </header>
      )}

      {/* ─── Floating Modern Luxury Bottom Dock ─── */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none pb-safe">
        <nav className="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-2 py-1 select-none">
          <div className="flex items-center justify-around h-14">
            {bottomTabs.map((tab) => {
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={handleTabClick}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex-1 flex flex-col items-center justify-center py-1 h-full rounded-2xl transition-all duration-200 active:scale-90 relative ${
                    isActive ? 'text-[#7c3aed]' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {/* Notification Dot */}
                  {tab.hasDot && !isActive && (
                    <span className="absolute top-1.5 right-[30%] w-2 h-2 rounded-full bg-[#ec4899] ring-2 ring-white" />
                  )}

                  {/* Icon */}
                  {tab.href === '/profile' && user.avatarUrl ? (
                    <div
                      className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                        isActive ? 'border-[#7c3aed] ring-2 ring-violet-200 scale-105' : 'border-slate-300'
                      }`}
                    >
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span
                      className={`material-symbols-outlined text-[24px] transition-transform duration-150 ${
                        isActive ? 'scale-105' : 'scale-100'
                      }`}
                      style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : undefined}
                    >
                      {tab.icon}
                    </span>
                  )}

                  {/* Label */}
                  <span
                    className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                      isActive ? 'font-black text-[#6d28d9]' : 'font-semibold text-slate-500'
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};
