'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbars on focused auth pages (login/signup) & exam environment
  if (pathname?.startsWith('/test') || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/tests', label: 'Tests', icon: 'quiz' },
    { href: '/results', label: 'Results', icon: 'analytics' },
    { href: '/profile', label: 'Profile', icon: 'person' },
  ];

  const sidebarExtraLinks = [
    { href: '/subjects/physics', label: 'Physics Notes & MCQs', icon: 'psychology' },
    { href: '/subjects/chemistry', label: 'Chemistry Practice', icon: 'science' },
    { href: '/subjects/mathematics', label: 'Maths Calculus', icon: 'calculate' },
    { href: '/subjects/biology', label: 'Biology NCERT Special', icon: 'biotech' },
  ];

  return (
    <>
      {/* Universal TopAppBar (Mobile & Desktop) */}
      <header className="flex justify-between items-center px-4 md:px-6 py-3 w-full bg-[#f4fafd] border-b border-[#ddc1b3] sticky top-0 z-40 shadow-xs backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Stylish 3-Line Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group p-2.5 rounded-2xl bg-[#ffdbc9]/60 hover:bg-[#ffdbc9] border border-[#ff8c42]/30 flex flex-col justify-center gap-1 transition-all duration-300 active:scale-95 shadow-xs cursor-pointer"
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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#ff8c42]/40 p-0.5 shadow-xs overflow-hidden group-hover:scale-105 transition-transform bg-white">
              <img src="/logo.png" alt="NAINIX EDU Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-heading text-2xl md:text-3xl text-[#9b4500] font-extrabold tracking-tight">
              EduStride <span className="hidden sm:inline-block text-xs text-[#564338] font-normal px-2 py-0.5 bg-[#ffdbc9] rounded-md ml-1 border border-[#ff8c42]/30 align-middle">Class 12</span>
            </span>
          </Link>
        </div>

        {/* Desktop Header Links */}
        <nav className="hidden md:flex gap-2 font-medium text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ff8c42] text-white font-bold shadow-xs'
                    : 'text-[#564338] hover:bg-[#e8eff1] hover:text-[#9b4500]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Badge & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-[#ffdbc9] text-[#6a2d00] px-3 py-1.5 rounded-full text-xs font-bold border border-[#ff8c42]">
            <span className="material-symbols-outlined text-[18px] text-[#9b4500]">local_fire_department</span>
            <span>{user.streakDays}d</span>
          </div>

          <Link href="/profile" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#ff8c42] overflow-hidden p-0.5 transition-transform group-hover:scale-105">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </Link>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer & Overlay with Smooth CSS Animations */}
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
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-[#ff8c42] object-cover"
                />
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#161d1f]">{user.name}</h3>
                  <span className="text-xs font-bold text-[#9b4500] uppercase bg-white px-2 py-0.5 rounded border border-[#ff8c42]/30">
                    {user.targetBoard} Board
                  </span>
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
              <span className="text-[11px] font-bold text-[#897266] uppercase tracking-wider px-3 mb-1">
                Main Navigation
              </span>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#ff8c42] text-white font-bold shadow-xs'
                        : 'text-[#161d1f] hover:bg-[#ffdbc9]/40 font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Class 12 Subject Links */}
            <div className="px-4 py-2 flex flex-col gap-1 border-t border-[#dde4e6] mt-2">
              <span className="text-[11px] font-bold text-[#897266] uppercase tracking-wider px-3 mb-1">
                Class 12 Study Materials
              </span>
              {sidebarExtraLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#564338] hover:bg-[#e8eff1] hover:text-[#9b4500] text-xs font-semibold transition-colors"
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
              href="/EduStride_Class12.apk"
              download="EduStride_Class12.apk"
              className="w-full py-2.5 px-3.5 rounded-2xl bg-[#9b4500] hover:bg-[#ff8c42] text-white font-bold text-xs transition-all shadow-md flex items-center justify-between group active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">android</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight font-extrabold text-[12px]">Download App</span>
                  <span className="text-[10px] text-[#ffdbc9] font-normal">Android APK (v1.0)</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-y-0.5 transition-transform">download</span>
            </a>

            <div className="flex items-center justify-between text-xs text-[#564338] px-1 pt-1">
              <span>Class 12 Board Exam Prep</span>
              <span className="font-bold text-[#3a6a00]">2026 Batch</span>
            </div>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 rounded-full border border-[#ba1a1a]/80 text-[#ba1a1a] font-bold text-xs hover:bg-[#ffdad6] transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span> Log Out / Switch Account
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile BottomNavBar - Material Design 3 Pill Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#ddc1b3]/60 pb-safe pt-2 px-2 flex justify-around items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center flex-1 py-1 group transition-all"
            >
              {/* Icon Pill Badge */}
              <div
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ffdbc9] text-[#9b4500] shadow-xs scale-105 border border-[#ff8c42]/40'
                    : 'text-[#564338] group-hover:text-[#9b4500] group-hover:bg-[#e8eff1]/60'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
              </div>

              {/* Label Underneath */}
              <span
                className={`text-[11px] mt-1 transition-colors ${
                  isActive ? 'font-extrabold text-[#9b4500]' : 'font-semibold text-[#564338]'
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
