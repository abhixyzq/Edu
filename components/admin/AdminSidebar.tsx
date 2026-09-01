'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick } from '@/lib/soundEffects';
import { BrandLogo } from '@/components/BrandLogo';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true, tag: 'Live' },
  { href: '/admin/subjects', label: 'Subjects & Units', icon: 'auto_stories', tag: 'Curriculum' },
  { href: '/admin/tests', label: 'Tests & Questions', icon: 'quiz', tag: 'Studio' },
  { href: '/admin/users', label: 'Scholars & Roles', icon: 'group', tag: 'Users' },
  { href: '/admin/analytics', label: 'Insights & Reports', icon: 'insights', tag: 'Metrics' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0f172a] min-h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" onClick={playButtonClick} className="flex flex-col group">
            <BrandLogo size="md" variant="dark" />
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-violet-400 text-[10px] font-black uppercase tracking-widest">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 flex flex-col gap-1 overflow-y-auto">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-3 my-2">
            Control Center
          </span>
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={playButtonClick}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-md shadow-violet-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-slate-400'}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {link.tag}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Current Admin Profile Dock */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-black truncate">{user.name}</p>
              <p className="text-slate-400 text-[10px] truncate">@{user.username || 'admin'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              onClick={playButtonClick}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>App</span>
            </Link>

            <button
              onClick={() => {
                playButtonClick();
                logout();
              }}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar Header ────────────────────────────────── */}
      <header className="md:hidden w-full sticky top-0 z-40 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-4 py-3 shrink-0 shadow-md">
        <Link href="/admin" onClick={playButtonClick} className="flex items-center gap-2">
          <BrandLogo size="sm" variant="dark" />
          <span className="text-[10px] bg-violet-900/60 text-violet-300 border border-violet-700/60 font-black px-2.5 py-0.5 rounded-full">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={playButtonClick}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center text-xs font-bold gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>App</span>
          </Link>

          <button
            onClick={() => {
              playButtonClick();
              setMobileOpen(true);
            }}
            className="p-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            aria-label="Open admin navigation menu"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Sliding Drawer ─────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-[#0f172a] flex flex-col transform transition-transform duration-300 ease-out z-10 border-r border-slate-800 shadow-2xl ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <BrandLogo size="md" variant="dark" />
            <button
              onClick={() => {
                playButtonClick();
                setMobileOpen(false);
              }}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    playButtonClick();
                    setMobileOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {link.tag}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            <Link
              href="/"
              onClick={() => {
                playButtonClick();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors mb-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Student Portal</span>
            </Link>

            <button
              onClick={() => {
                playButtonClick();
                setMobileOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-black transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
