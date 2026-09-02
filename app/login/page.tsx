'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';
import { ParticleSphere } from '@/components/ParticleSphere';
import { VoiceCosmos } from '@/components/VoiceCosmos';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const loginSectionRef = useRef<HTMLDivElement | null>(null);
  const cosmosSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAbout = () => {
    playButtonClick();
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setError('');
    setLoading(true);
    playButtonClick();

    const result = await login(identifier.trim(), password);
    setLoading(false);

    if (result.success) {
      playGemDing();
      router.push('/');
    } else {
      setError(result.error || 'Invalid username or password.');
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory overscroll-y-contain scroll-smooth font-sans select-none bg-[#09111e]">
      
      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 1: Photorealistic Night Sconce Login Screen
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={loginSectionRef}
        className="h-[100dvh] w-full shrink-0 snap-start snap-always flex flex-col justify-between items-center p-4 relative overflow-hidden bg-cover bg-top sm:bg-center"
        style={{
          backgroundImage: `url('/images/night_brick_sconce_bg.jpg')`,
          scrollSnapStop: 'always',
        }}
      >
        {/* Top Back Navigation */}
        <header className="w-full shrink-0 flex justify-between items-center max-w-sm mx-auto pt-2 z-30">
          <Link
            href="/"
            onClick={playButtonClick}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          
          <button
            type="button"
            onClick={scrollToAbout}
            className="text-[11px] font-bold text-amber-200/90 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore Showcase</span>
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
          </button>
        </header>

        {/* Main Frosted Glassmorphism Login Card */}
        <main className="w-full max-w-[340px] sm:max-w-[370px] relative z-20 my-auto">
          <div 
            className="w-full rounded-[30px] p-6 sm:p-7 backdrop-blur-md border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(254,240,138,0.12)] flex flex-col items-center"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(13, 27, 49, 0.55) 100%)',
            }}
          >
            {/* Card Title */}
            <h1 className="font-heading font-black text-3xl text-white tracking-wide text-center mb-5 drop-shadow-md">
              Login
            </h1>

            {/* Error Message Banner */}
            {error && (
              <div className="w-full mb-3 p-2.5 rounded-xl bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs font-semibold text-center backdrop-blur-md">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-3.5">
              {/* Field 1: Username */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-5 pr-11 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 material-symbols-outlined text-[20px] pointer-events-none">
                  person
                </span>
              </div>

              {/* Field 2: Password */}
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-5 pr-11 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 hover:text-white cursor-pointer flex items-center"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {showPassword ? 'visibility_off' : 'lock'}
                  </span>
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="w-full flex items-center justify-between text-xs text-white/90 pt-0.5 px-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border border-white/50 bg-white/10 accent-white cursor-pointer"
                  />
                  <span className="text-[11px] font-medium text-white/90">Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  onClick={playButtonClick}
                  className="text-[11px] font-medium text-white/90 hover:text-white hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#09111e] font-heading font-black text-sm sm:text-base shadow-[0_8px_25px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-[#09111e] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-white/85">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  onClick={playButtonClick}
                  className="font-black text-white hover:underline cursor-pointer"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* ─── Minimal Single Line Pull Indicator ─── */}
        <footer className="w-full shrink-0 flex flex-col items-center pb-3 pt-2 z-20">
          <button
            type="button"
            onClick={scrollToAbout}
            aria-label="View Showcase"
            className="p-2 flex items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 group-active:scale-95 transition-all shadow-xs" />
          </button>
        </footer>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 2: Ultra-Premium Dribbble/Stripe Quality Showcase
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={showcaseRef}
        className="min-h-[100dvh] w-full shrink-0 snap-start snap-always bg-[#0f1d30] text-slate-900 overflow-y-auto py-6 px-3 sm:px-8 relative"
        style={{
          scrollSnapStop: 'always',
        }}
      >
        {/* Main Canvas Deck */}
        <div className="max-w-[500px] sm:max-w-[580px] mx-auto bg-[#eef5fc] rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 relative">
          
          {/* ─── 1. Ultra-Modern Big Digital Clock Deck ─── */}
          <div className="w-full bg-gradient-to-b from-[#091526] via-[#0d1f38] to-[#122844] pt-6 px-4 pb-5 relative overflow-hidden flex flex-col items-center justify-center text-white border-b border-white/10 shadow-inner">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-20 bg-cyan-400/20 blur-2xl pointer-events-none" />

            {/* Top Status & Date Header */}
            <div className="flex items-center justify-between w-full max-w-[360px] mb-3 px-2 z-10">
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Live Focus Clock
              </span>
              <span className="text-[10px] font-bold text-slate-300 tracking-wide">
                {time ? time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Live Clock'}
              </span>
            </div>

            {/* Big Digital Clock Display Box */}
            <div className="w-full max-w-[370px] bg-black/45 backdrop-blur-xl border-2 border-white/15 rounded-[26px] p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(56,189,248,0.12)] flex items-center justify-center gap-2 sm:gap-3 relative z-10">
              
              {/* Hours Block */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-19 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
                    {time ? (time.getHours() % 12 || 12).toString().padStart(2, '0') : '--'}
                  </span>
                </div>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Hours</span>
              </div>

              {/* Pulsing Colon */}
              <div className="flex flex-col gap-1.5 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Minutes Block */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-19 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-cyan-300 tracking-tight drop-shadow-[0_2px_12px_rgba(34,211,238,0.45)]">
                    {time ? time.getMinutes().toString().padStart(2, '0') : '--'}
                  </span>
                </div>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Minutes</span>
              </div>

              {/* Pulsing Colon */}
              <div className="flex flex-col gap-1.5 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Seconds Block */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-17 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg relative">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 tracking-tight drop-shadow-[0_2px_10px_rgba(251,191,36,0.45)]">
                    {time ? time.getSeconds().toString().padStart(2, '0') : '--'}
                  </span>
                  {/* AM/PM Tag */}
                  <span className="absolute top-1.5 right-1.5 text-[6.5px] font-black px-1 rounded bg-white/20 text-white leading-none py-0.5">
                    {time ? (time.getHours() >= 12 ? 'PM' : 'AM') : 'AM'}
                  </span>
                </div>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Seconds</span>
              </div>

            </div>

            {/* Live Study Tracker Subtitle */}
            <div className="mt-2.5 flex items-center gap-1.5 text-[9.5px] text-slate-300/90 font-medium z-10">
              <span className="material-symbols-outlined text-[13px] text-amber-400">timer</span>
              <span>Study Focus Mode &bull; Real-Time Precision</span>
            </div>

          </div>

          {/* ─── 2. Main Hero Showcase with Full-Height Mascot & Spacious Depth ─── */}
          <div className="w-full min-h-[440px] sm:min-h-[520px] pt-3 px-4 pb-6 relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#b8d6f5] via-[#d7e9fa] to-white">
            
            {/* ══ Edge-to-Edge Fitted Mascot ══ */}
            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none flex items-center justify-center">
              <img
                src="/images/image.png"
                alt="Parrot Mascot Full Fit"
                className="w-full h-full object-contain object-center transform scale-100 sm:scale-105"
              />
            </div>

            {/* ══ Authentic Depth Watermark Positioned Behind Parrot Head (z-0) ══ */}
            <div className="absolute inset-x-0 top-7.5 sm:top-18 flex items-center justify-center z-0 select-none pointer-events-none w-full overflow-visible px-2">
              <h1 
                className="font-heading font-bold text-[5rem] sm:text-[7.2rem] md:text-[100px] tracking-[0.15em] sm:tracking-[0.22em] uppercase text-center leading-none whitespace-nowrap pl-3 sm:pl-6 text-transparent bg-clip-text bg-gradient-to-b from-white/95 via-white/45 to-white/5 drop-shadow-[0_6px_20px_rgba(255,255,255,0.5)]"
                style={{
                  fontFamily: "'Outfit', 'Montserrat', sans-serif",
                }}
              >
                NAINIX
              </h1>
            </div>

          </div>

          {/* ─── 3. Important Community & App Quick Links ─── */}
          <div className="w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-5 flex flex-col gap-3 relative z-20">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Important Links
              </span>
              <span className="text-[9px] font-bold text-slate-400">Join Community</span>
            </div>

            {/* 2x2 Clean Action Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp Channel */}
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

              {/* Official App */}
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
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SCREEN 3: CUTE MIMIC VOICE ASSISTANT (3D Particle Sphere + Echo Voice)
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={cosmosSectionRef}
        className="snap-start snap-always w-full h-[100dvh] min-h-[100dvh] bg-black relative flex items-center justify-center overflow-hidden p-0 m-0"
        style={{
          scrollSnapStop: 'always',
        }}
      >
        <VoiceCosmos />
      </section>

    </div>
  );
}
