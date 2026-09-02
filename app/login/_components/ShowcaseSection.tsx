'use client';

import React from 'react';
import Link from 'next/link';
import { playButtonClick } from '@/lib/soundEffects';

export function ShowcaseSection({ time }: { time: Date | null }) {
  return (
    <section
      className="min-h-[100dvh] w-full shrink-0 snap-start snap-always bg-[#0f1d30] text-slate-900 overflow-y-auto py-6 px-3 sm:px-8 relative"
      style={{ scrollSnapStop: 'always' }}
    >
      {/* Main Canvas Deck */}
      <div className="max-w-[500px] sm:max-w-[580px] mx-auto bg-[#eef5fc] rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 relative">

        {/* ─── 1. Live Digital Clock ─── */}
        <div className="w-full bg-gradient-to-b from-[#091526] via-[#0d1f38] to-[#122844] pt-6 px-4 pb-5 relative overflow-hidden flex flex-col items-center justify-center text-white border-b border-white/10 shadow-inner">
          {/* Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-20 bg-cyan-400/20 blur-2xl pointer-events-none" />

          {/* Status header */}
          <div className="flex items-center justify-between w-full max-w-[360px] mb-3 px-2 z-10">
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Live Focus Clock
            </span>
            <span className="text-[10px] font-bold text-slate-300 tracking-wide">
              {time ? time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Live Clock'}
            </span>
          </div>

          {/* Clock Display */}
          <div className="w-full max-w-[370px] bg-black/45 backdrop-blur-xl border-2 border-white/15 rounded-[26px] p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(56,189,248,0.12)] flex items-center justify-center gap-2 sm:gap-3 relative z-10">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-19 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
                  {time ? (time.getHours() % 12 || 12).toString().padStart(2, '0') : '--'}
                </span>
              </div>
              <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Hours</span>
            </div>
            {/* Colon */}
            <div className="flex flex-col gap-1.5 pb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-19 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                <span className="font-heading font-black text-3xl sm:text-4xl text-cyan-300 tracking-tight drop-shadow-[0_2px_12px_rgba(34,211,238,0.45)]">
                  {time ? time.getMinutes().toString().padStart(2, '0') : '--'}
                </span>
              </div>
              <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Minutes</span>
            </div>
            {/* Colon */}
            <div className="flex flex-col gap-1.5 pb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-17 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg relative">
                <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 tracking-tight drop-shadow-[0_2px_10px_rgba(251,191,36,0.45)]">
                  {time ? time.getSeconds().toString().padStart(2, '0') : '--'}
                </span>
                <span className="absolute top-1.5 right-1.5 text-[6.5px] font-black px-1 rounded bg-white/20 text-white leading-none py-0.5">
                  {time ? (time.getHours() >= 12 ? 'PM' : 'AM') : 'AM'}
                </span>
              </div>
              <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Seconds</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[9.5px] text-slate-300/90 font-medium z-10">
            <span className="material-symbols-outlined text-[13px] text-amber-400">timer</span>
            <span>Study Focus Mode &bull; Real-Time Precision</span>
          </div>
        </div>

        {/* ─── 2. Hero Mascot ─── */}
        <div className="w-full min-h-[440px] sm:min-h-[520px] pt-3 px-4 pb-6 relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#b8d6f5] via-[#d7e9fa] to-white">
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none flex items-center justify-center">
            <img
              src="/images/image.png"
              alt="Parrot Mascot Full Fit"
              className="w-full h-full object-contain object-center transform scale-100 sm:scale-105"
            />
          </div>
          <div className="absolute inset-x-0 top-7.5 sm:top-18 flex items-center justify-center z-0 select-none pointer-events-none w-full overflow-visible px-2">
            <h1
              className="font-heading font-bold text-[5rem] sm:text-[7.2rem] md:text-[100px] tracking-[0.15em] sm:tracking-[0.22em] uppercase text-center leading-none whitespace-nowrap pl-3 sm:pl-6 text-transparent bg-clip-text bg-gradient-to-b from-white/95 via-white/45 to-white/5 drop-shadow-[0_6px_20px_rgba(255,255,255,0.5)]"
              style={{ fontFamily: "'Outfit', 'Montserrat', sans-serif" }}
            >
              NAINIX
            </h1>
          </div>
        </div>

        {/* ─── 3. Links + Legal Footer ─── */}
        <div className="w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-5 flex flex-col gap-3 relative z-20">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Important Links
            </span>
            <span className="text-[9px] font-bold text-slate-400">Join Community</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029Vb7D6yP29759"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playButtonClick}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.546 1.84.835 2.796.835 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.391 8.172c-.141.396-.714.733-1.011.777-.282.042-.647.067-2.063-.52-1.808-.75-2.975-2.593-3.065-2.713-.09-.12-1.748-2.327-1.748-4.442 0-2.115 1.109-3.155 1.503-3.585.394-.43.86-.538 1.147-.538.287 0 .573.002.825.014.267.012.624-.1.975.742.361.867 1.233 3.011 1.344 3.237.111.226.185.49.037.784-.148.294-.222.477-.444.738-.222.261-.466.584-.666.784-.222.222-.453.463-.195.906.258.443 1.147 1.892 2.463 3.064 1.691 1.506 3.118 1.973 3.56 2.195.443.222.701.185.96-.111.259-.296 1.109-1.294 1.405-1.737.296-.443.591-.37.998-.222.407.148 2.587 1.22 3.03 1.442.443.222.738.333.849.518.111.185.111 1.072-.03 1.468z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-slate-900 leading-tight truncate">WhatsApp</span>
                <span className="text-[9px] font-bold text-[#128C7E] truncate">Channel</span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/nainix.me"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playButtonClick}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[#E1306C] transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-slate-900 leading-tight truncate">Instagram</span>
                <span className="text-[9px] font-bold text-[#E1306C] truncate">@nainix.me</span>
              </div>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com/nainixone"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playButtonClick}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 text-slate-900 transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-slate-900 leading-tight truncate">Twitter / X</span>
                <span className="text-[9px] font-bold text-slate-500 truncate">@nainixone</span>
              </div>
            </a>

            {/* Download App */}
            <a
              href="/nainixOne_Class12_Latest.apk"
              download="nainixOne_Class12_Latest.apk"
              onClick={playButtonClick}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-600/30 text-[#7c3aed] transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-[18px]">android</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-slate-900 leading-tight truncate">Download App</span>
                <span className="text-[9px] font-bold text-[#7c3aed] truncate">Direct APK</span>
              </div>
            </a>
          </div>

          {/* Legal Footer */}
          <div className="pt-3.5 mt-1 border-t border-slate-100 flex flex-col items-center gap-1.5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500">
              <Link href="/privacy" className="hover:text-slate-900 hover:underline transition-colors">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-slate-900 hover:underline transition-colors">Terms of Service</Link>
              <span>&bull;</span>
              <Link href="/refund" className="hover:text-slate-900 hover:underline transition-colors">Refund Policy</Link>
              <span>&bull;</span>
              <Link href="/disclaimer" className="hover:text-slate-900 hover:underline transition-colors">Disclaimer</Link>
            </div>
            <p className="text-[8.5px] text-slate-400 font-medium">
              &copy; 2026 nainixOne &bull; All Rights Reserved
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
