'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

import { BrandLogo } from '@/components/BrandLogo';

const navLinks = [
  { href: '/admin', label: 'Overview', icon: 'dashboard', exact: true },
  { href: '/admin/subjects', label: 'Subjects', icon: 'category' },
  { href: '/admin/tests', label: 'Tests & Questions', icon: 'quiz' },
  { href: '/admin/users', label: 'Users', icon: 'group' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
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
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#1a1f21] min-h-screen fixed left-0 top-0 z-30 border-r border-white/5">
        {/* Text Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex flex-col group">
            <BrandLogo size="lg" variant="dark" />
            <span className="text-[#a855f7] text-[10px] font-bold uppercase tracking-widest mt-1.5">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">Management</span>
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? 'bg-[#ff8c42] text-white font-bold shadow-lg shadow-[#ff8c42]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/8 font-medium'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : ''}`}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[#ff8c42] text-white font-bold text-sm flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-bold truncate">{user.name}</p>
              <p className="text-white/40 text-[10px] truncate">{user.email}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 text-xs font-medium transition-colors mb-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to App
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#ff6b6b] hover:bg-[#ff6b6b]/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 bg-[#1a1f21] border-b border-white/10 flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <BrandLogo size="sm" variant="dark" />
          <span className="text-[10px] bg-white/10 text-[#a855f7] font-black px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
          aria-label="Open admin nav"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-[#1a1f21] flex flex-col transform transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <BrandLogo size="md" variant="dark" />
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full text-white/50 hover:bg-white/10">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <nav className="flex-1 p-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all ${
                    active
                      ? 'bg-[#ff8c42] text-white font-bold'
                      : 'text-white/60 hover:text-white hover:bg-white/8 font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/8 text-xs font-medium transition-colors mb-2">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to App
            </Link>
            <button onClick={() => { setMobileOpen(false); logout(); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[#ff6b6b] hover:bg-[#ff6b6b]/10 text-xs font-bold transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
