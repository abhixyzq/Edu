'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const loginSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAbout = () => {
    playButtonClick();
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLogin = () => {
    playButtonClick();
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth font-sans select-none bg-[#09111e]">
      
      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 1: Photorealistic Night Sconce Login Screen
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={loginSectionRef}
        className="h-[100dvh] w-full shrink-0 snap-start flex flex-col justify-between items-center p-4 relative overflow-hidden bg-cover bg-top sm:bg-center"
        style={{
          backgroundImage: `url('/images/night_brick_sconce_bg.jpg')`,
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
        className="min-h-[100dvh] w-full shrink-0 snap-start bg-[#0f1d30] text-slate-900 overflow-y-auto py-6 px-3 sm:px-8 relative"
      >
        {/* Main Canvas Deck */}
        <div className="max-w-[500px] sm:max-w-[580px] mx-auto bg-[#eef5fc] rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 relative">
          
          {/* ─── 1. Top 3D Isometric Mobile App Cards ─── */}
          <div className="w-full bg-gradient-to-b from-[#b3d3f5] via-[#c9e1fa] to-[#e4f0fd] pt-6 px-4 pb-3 relative overflow-hidden flex items-center justify-center">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-white/60 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-center -space-x-5 sm:-space-x-7 py-3 relative z-10">
              
              {/* Left Angled Phone Card */}
              <div className="w-28 sm:w-32 h-44 sm:h-48 rounded-[20px] bg-white/90 backdrop-blur-md shadow-[0_15px_30px_rgba(30,64,175,0.12)] border border-white p-3 transform -rotate-12 -translate-y-2 flex flex-col justify-between opacity-90 hover:opacity-100 transition-all hover:scale-105">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
                  <span className="text-[9px] font-black tracking-wider text-slate-900">NAINIX</span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-1.5 rounded-full bg-slate-200" />
                  <div className="w-14 h-1.5 rounded-full bg-blue-100" />
                  <p className="text-[7px] text-slate-400 font-bold pt-2">Fast Practice &bull; AI Mocks</p>
                </div>
              </div>

              {/* Center Main Dark Phone Screen */}
              <div className="w-36 sm:w-44 h-56 sm:h-60 rounded-[24px] bg-[#0c1a2e] text-white shadow-[0_20px_45px_rgba(12,26,46,0.5)] border-2 border-white/60 p-3.5 z-20 flex flex-col justify-between relative transform hover:scale-[1.03] transition-all">
                {/* Phone Speaker Notch */}
                <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto" />

                <div className="space-y-2 my-auto">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center text-[8px]">
                    <span className="text-slate-300 font-medium">Daily Streak</span>
                    <span className="text-amber-400 font-black">🔥 14 Days</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center text-[8px]">
                    <span className="text-slate-300 font-medium">Physics Mock #01</span>
                    <span className="text-emerald-400 font-black">+100 XP</span>
                  </div>
                </div>

                {/* Floating Bottom Center Action Button */}
                <div className="flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_4px_15px_rgba(37,99,235,0.6)] border border-blue-400">
                    <span className="material-symbols-outlined text-[18px] text-white">quiz</span>
                  </div>
                </div>
              </div>

              {/* Right Angled Phone Card */}
              <div className="w-28 sm:w-32 h-44 sm:h-48 rounded-[20px] bg-white/90 backdrop-blur-md shadow-[0_15px_30px_rgba(30,64,175,0.12)] border border-white p-3 transform rotate-12 -translate-y-2 flex flex-col justify-between opacity-90 hover:opacity-100 transition-all hover:scale-105">
                <div className="space-y-1">
                  <span className="text-[7px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">FREE</span>
                  <h4 className="text-[9px] font-black text-slate-800 leading-tight">
                    Get your free <br />
                    <span className="text-blue-600 font-black">Scholar Pass</span>
                  </h4>
                </div>
                <span className="text-[7px] text-blue-600 font-black flex items-center gap-0.5">
                  <span>Claim Now</span>
                  <span className="material-symbols-outlined text-[9px]">arrow_forward</span>
                </span>
              </div>

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

          {/* ─── 3. Minimal Sculpted Cut-Out Contour Ribbon ─── */}
          <div className="w-full relative z-20 -mt-24 sm:-mt-36 pt-0">
            {/* SVG Sculpted White Background Contour with Compact Trapezoid Cut-Out */}
            <div className="w-full relative">
              <svg 
                viewBox="0 0 1000 160" 
                preserveAspectRatio="none" 
                className="w-full h-[125px] sm:h-[145px] drop-shadow-[0_-6px_15px_rgba(30,64,175,0.04)]"
              >
                <path 
                  d="M 0,0 L 330,0 Q 355,0 370,20 L 395,70 Q 410,85 435,85 L 565,85 Q 590,85 605,70 L 630,20 Q 645,0 670,0 L 1000,0 L 1000,160 L 0,160 Z" 
                  fill="#ffffff" 
                />
              </svg>

              {/* Foreground Minimal 3-Pillar Content Overlay */}
              <div className="absolute inset-0 w-full grid grid-cols-12 px-3 sm:px-6 pt-2.5 sm:pt-3">
                
                {/* Left Block - Minimal */}
                <div className="col-span-4 flex flex-col justify-between pr-1 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#0f172a] shadow-2xs flex items-center justify-center text-[6.5px] text-white font-bold">N</span>
                    <span className="w-3 h-3 rounded-full bg-blue-600 shadow-2xs" />
                  </div>
                  <div>
                    <h4 className="text-[9px] sm:text-[11px] font-black text-slate-900 leading-tight">
                      Smart AI Prep
                    </h4>
                    <p className="text-[7px] sm:text-[8px] text-slate-500 font-medium">
                      Class 12 Boards
                    </p>
                  </div>
                  <Link
                    href="/subjects"
                    className="text-[7px] sm:text-[8px] font-black text-blue-600 uppercase tracking-wider hover:underline flex items-center gap-0.5"
                  >
                    <span>SERVICES</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

                {/* Center Dip - Minimal */}
                <div className="col-span-4 flex flex-col items-center justify-start text-center pt-1 px-1">
                  <Link
                    href="/signup"
                    onClick={playButtonClick}
                    className="inline-flex items-center gap-1 bg-white/85 hover:bg-white backdrop-blur-md border border-white px-2.5 py-0.5 rounded-full shadow-xs text-[7.5px] sm:text-[8.5px] font-black text-slate-800 transition-all hover:scale-105 active:scale-95 mb-1"
                  >
                    <span>Start Free</span>
                    <span className="material-symbols-outlined text-[9px]">arrow_forward</span>
                  </Link>
                  <h3 className="font-heading font-black text-[10px] sm:text-[13px] text-white tracking-tight uppercase leading-tight drop-shadow-[0_2px_6px_rgba(30,64,175,0.6)]">
                    FAST PRACTICE <br />
                    FAST RESULTS
                  </h3>
                </div>

                {/* Right Block - Minimal */}
                <div className="col-span-4 flex flex-col justify-between pl-2 pb-2 text-left">
                  <span className="text-[6.5px] sm:text-[7.5px] font-black text-slate-400 uppercase tracking-wider">
                    QUESTIONS SOLVED
                  </span>
                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-blue-600 leading-none tracking-tight">
                      90M+
                    </h3>
                  </div>
                  <Link
                    href="/leaderboard"
                    className="text-[7px] sm:text-[8px] font-black text-blue-600 uppercase tracking-wider hover:underline flex items-center gap-0.5"
                  >
                    <span>RANKS</span>
                    <span>&uarr;</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* ─── 4. Elegant Minimal Action & Navigation Bar ─── */}
          <div className="w-full px-4 pt-4 pb-6 bg-white flex items-center justify-center gap-3">
            <Link
              href="/signup"
              onClick={playButtonClick}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-heading font-black text-[10px] uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              Start Free Roadmaps &rarr;
            </Link>

            <button
              type="button"
              onClick={scrollToLogin}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95"
            >
              Back to Login ↑
            </button>
          </div>

          {/* ─── 6. Footer: "WHO WE SERVE" with Board Badges ─── */}
          <div className="w-full py-6 text-center bg-white border-t border-slate-100/80 px-4 space-y-3">
            <h4 className="font-heading font-black text-[10px] text-slate-400 uppercase tracking-[0.25em]">
              WHO WE SERVE
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
              {['CBSE Board', 'Bihar Board BSEB', 'UP Board', 'ICSE / ISC', 'JEE Main', 'NEET UG'].map((board) => (
                <span
                  key={board}
                  className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[8px] font-bold text-slate-700 hover:border-blue-300 transition-colors"
                >
                  {board}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
