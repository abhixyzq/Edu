'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, toggleSound } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbars on focused auth pages (login/signup), exam environment, and admin pages
  if (pathname?.startsWith('/test') || pathname === '/login' || pathname === '/signup' || pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Learn', icon: 'map' },
    { href: '/leaderboard', label: 'Leagues', icon: 'military_tech' },
    { href: '/quests', label: 'Quests', icon: 'flag' },
    { href: '/shop', label: 'Shop', icon: 'storefront' },
    { href: '/tests', label: 'Exams', icon: 'quiz' },
    { href: '/profile', label: 'Profile', icon: 'person' },
  ];

  const adminLink = user.isAdmin ? { href: '/admin', label: 'Admin', icon: 'admin_panel_settings' } : null;

  const sidebarExtraLinks = [
    { href: '/subjects/physics', label: 'Physics Mastery Path', icon: 'bolt' },
    { href: '/subjects/chemistry', label: 'Chemistry Lab & MCQs', icon: 'science' },
    { href: '/subjects/mathematics', label: 'Maths Calculus Drills', icon: 'calculate' },
    { href: '/subjects/biology', label: 'Biology High-Yield Tree', icon: 'biotech' },
  ];

  return (
    <>
      {/* Universal TopAppBar (Mobile & Desktop) */}
      <header className="flex justify-between items-center px-3 sm:px-6 py-2.5 w-full bg-[#f4fafd] border-b border-[#ddc1b3] sticky top-0 z-40 shadow-xs backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 3-Line Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group p-2 rounded-2xl bg-[#ffdbc9]/60 hover:bg-[#ffdbc9] border border-[#ff8c42]/30 flex flex-col justify-center gap-1 transition-all duration-300 active:scale-95 shadow-xs cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            <span
              className={`h-0.5 bg-[#9b4500] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? 'w-5 translate-y-1.5 rotate-45' : 'w-5'
              }`}
            />
            <span
              className={`h-0.5 bg-[#9b4500] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? 'w-5 opacity-0' : 'w-3.5 group-hover:w-5'
              }`}
            />
            <span
              className={`h-0.5 bg-[#9b4500] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? 'w-5 -translate-y-1.5 -rotate-45' : 'w-4'
              }`}
            />
          </button>

          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#ff8c42]/40 p-0.5 shadow-xs overflow-hidden group-hover:scale-105 transition-transform bg-white">
              <img src="/logo.png" alt="EduStride Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-heading text-xl sm:text-2xl text-[#9b4500] font-black tracking-tight">
              EduStride
            </span>
          </Link>
        </div>

        {/* Desktop Header Navigation Links */}
        <nav className="hidden lg:flex gap-1 font-bold text-xs uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-150 border-b-3 active:border-b-0 active:translate-y-0.5 ${
                  isActive
                    ? 'bg-[#ff8c42] text-white border-[#9b4500] shadow-xs'
                    : 'text-[#564338] border-transparent hover:bg-[#e8eff1] hover:text-[#9b4500]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
          {adminLink && (
            <Link
              href={adminLink.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#564338] hover:bg-[#1a1f21] hover:text-white font-bold transition-all border-b-3 border-transparent"
            >
              <span className="material-symbols-outlined text-[18px]">{adminLink.icon}</span>
              <span>{adminLink.label}</span>
            </Link>
          )}
        </nav>

        {/* Gamification Stats Bar (Streak, Hearts, Gems, Level, Sound) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1 bg-[#ffdbc9] text-[#6a2d00] px-2.5 py-1 rounded-xl text-xs font-black border border-[#ff8c42]"
            title={`${user.streakDays} Day Streak!`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#9b4500] animate-pulse">
              local_fire_department
            </span>
            <span>{user.streakDays}</span>
          </div>

          {/* Hearts */}
          <Link
            href="/shop"
            className="flex items-center gap-1 bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-xl text-xs font-black border border-[#ffb4ab] hover:scale-105 transition-transform"
            title="Hearts (Lives) - Click to Refill"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">favorite</span>
            <span>{user.infiniteHeartsUntil && Date.now() < user.infiniteHeartsUntil ? '∞' : user.hearts}</span>
          </Link>

          {/* Gems */}
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 bg-[#d4e3ff] text-[#0060ac] px-2.5 py-1 rounded-xl text-xs font-black border border-[#a2c5ff] hover:scale-105 transition-transform"
            title="Gems Balance - Click to Shop"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0060ac]">diamond</span>
            <span>{user.gems}</span>
          </Link>

          {/* Level Badge */}
          <div
            className="hidden md:flex items-center gap-1 bg-[#ffd700]/20 text-[#594100] px-2.5 py-1 rounded-xl text-xs font-black border border-[#ffd700]"
            title={`Player Level ${user.level} (${user.xp} Total XP)`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#b8860b]">bolt</span>
            <span>Lvl {user.level}</span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 rounded-xl text-[#564338] hover:bg-[#e8eff1] transition-colors"
            title={user.soundMuted ? 'Unmute game sounds' : 'Mute game sounds'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {user.soundMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* User Profile Avatar */}
          <Link href="/profile" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#ff8c42] bg-[#ffdbc9] text-[#6a2d00] font-black text-xs sm:text-sm flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
              {user.name.charAt(0)}
            </div>
          </Link>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer & Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header & User Card */}
          <div>
            <div className="p-5 bg-gradient-to-br from-[#ffdbc9]/60 to-white border-b border-[#ddc1b3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-[#ff8c42] bg-[#ffdbc9] text-[#6a2d00] font-extrabold text-lg flex items-center justify-center shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading text-base font-extrabold text-[#161d1f]">{user.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-extrabold text-[#9b4500] uppercase bg-white px-2 py-0.5 rounded border border-[#ff8c42]/30">
                      Level {user.level}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#0060ac] uppercase bg-white px-2 py-0.5 rounded border border-[#a2c5ff]">
                      {user.leagueTier} League
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-[#564338] hover:bg-[#e8eff1] transition-colors"
                aria-label="Close sidebar navigation"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Primary Navigation Links */}
            <div className="p-4 flex flex-col gap-1">
              <span className="text-[11px] font-black text-[#897266] uppercase tracking-wider px-3 mb-1">
                Gamified Modules
              </span>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border-b-3 active:border-b-0 active:translate-y-0.5 ${
                      isActive
                        ? 'bg-[#ff8c42] text-white border-[#9b4500] font-extrabold shadow-xs'
                        : 'text-[#161d1f] border-transparent hover:bg-[#ffdbc9]/40 font-bold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
              {adminLink && (
                <Link
                  href={adminLink.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[#161d1f] hover:bg-[#1a1f21] hover:text-white font-extrabold transition-all"
                >
                  <span className="material-symbols-outlined text-[22px]">{adminLink.icon}</span>
                  <span className="text-sm">{adminLink.label}</span>
                </Link>
              )}
            </div>

            {/* Class 12 Subject Links */}
            <div className="px-4 py-2 flex flex-col gap-1 border-t border-[#dde4e6] mt-2">
              <span className="text-[11px] font-black text-[#897266] uppercase tracking-wider px-3 mb-1">
                Class 12 Subject Paths
              </span>
              {sidebarExtraLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#564338] hover:bg-[#e8eff1] hover:text-[#9b4500] text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#9b4500]">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#dde4e6] bg-[#f4fafd] flex flex-col gap-2.5">
            {/* Download Mobile App Button */}
            <a
              href="/EduStride_Class12_v1.0.2.apk?v=1.0.2"
              download="EduStride_Class12_v1.0.2.apk"
              className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#9b4500] to-[#ba5600] text-white font-black text-xs transition-all shadow-md flex items-center justify-between group active:scale-[0.98] cursor-pointer border border-[#ff8c42]/30"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">android</span>
                <span className="leading-tight font-extrabold text-[12px]">Download Official App</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold">v1.0.2</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full py-2 rounded-full border border-[#ba1a1a]/80 text-[#ba1a1a] font-bold text-xs hover:bg-[#ffdad6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span> Log Out / Switch Account
            </button>
          </div>
        </div>
      </div>

      {/* Mobile BottomNavBar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#ddc1b3]/60 pb-safe pt-2 px-2 flex justify-around items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {navLinks.slice(0, 5).map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center flex-1 py-1 group transition-all"
            >
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${
                  isActive
                    ? 'bg-[#ffdbc9] text-[#9b4500] shadow-xs scale-105 border border-[#ff8c42]/40'
                    : 'text-[#564338] group-hover:text-[#9b4500]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              </div>
              <span
                className={`text-[10px] mt-0.5 transition-colors ${
                  isActive ? 'font-black text-[#9b4500]' : 'font-semibold text-[#564338]'
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
