'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { BrandLogo } from '@/components/BrandLogo';
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
            <span>Explore nainixOne</span>
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
            aria-label="View Showcase Deck"
            className="p-2 flex items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 group-active:scale-95 transition-all shadow-xs" />
          </button>
        </footer>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 2: High-End Futuristic SaaS / Showcase Deck (Ref Match)
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={showcaseRef}
        className="min-h-[100dvh] w-full shrink-0 snap-start bg-[#f0f4f8] text-slate-900 overflow-y-auto relative"
      >
        {/* ─── TOP SECTION: Soft Sky Gradient with Giant Watermark Title & 3D Hero ─── */}
        <div className="w-full bg-gradient-to-b from-[#b8d5f3] via-[#d6e7f8] to-[#f0f4f8] pt-6 pb-12 px-4 sm:px-8 relative overflow-hidden">
          
          {/* Top Floating Nav */}
          <div className="max-w-5xl mx-auto flex items-center justify-between z-20 relative mb-4">
            <div className="flex items-center gap-2">
              <BrandLogo size="lg" />
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/signup"
                onClick={playButtonClick}
                className="px-4 py-2 rounded-full bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Get Started &rarr;
              </Link>
              
              <button
                type="button"
                onClick={scrollToLogin}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
            </div>
          </div>

          {/* ─── Giant Translucent Background Watermark Typography ─── */}
          <div className="w-full text-center relative flex items-center justify-center my-2 pointer-events-none select-none">
            <h1 className="font-heading font-black text-6xl sm:text-9xl text-white/50 tracking-widest uppercase">
              NAINIXONE
            </h1>
          </div>

          {/* ─── Hero Centerpiece: 3D Mascot & Floating Cards ─── */}
          <div className="max-w-4xl mx-auto -mt-10 sm:-mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative z-10">
            
            {/* Left Floating Card: All India Boards */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-[0_15px_30px_rgba(30,64,175,0.08)] flex flex-col items-center text-center space-y-2 order-2 md:order-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[32px]">public</span>
              </div>
              <h3 className="font-black text-sm text-slate-800">Board & Exam Mastery</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                CBSE, Bihar Board, UP Board, ICSE/ISC, JEE Main and NEET UG curriculums.
              </p>
            </div>

            {/* Center Hero: Cat Mascot with Active Aura */}
            <div className="flex flex-col items-center justify-center relative order-1 md:order-2">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-blue-400/30 to-indigo-500/20 blur-2xl absolute -z-10" />
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-b from-white/90 to-blue-50/80 border-2 border-white shadow-2xl flex items-center justify-center p-3 relative transform hover:scale-105 transition-transform">
                <img
                  src="/images/trophy_cat.png"
                  alt="Hero Mascot"
                  className="w-full h-full object-contain drop-shadow-md animate-pulse"
                />
                <span className="absolute -bottom-2.5 bg-blue-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                  Top Rank AI
                </span>
              </div>
            </div>

            {/* Right Floating Card: Holographic Pass Card */}
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white rounded-3xl p-5 shadow-[0_15px_30px_rgba(15,23,42,0.25)] border border-blue-400/30 space-y-3 order-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">Scholar Pass</span>
                <span className="material-symbols-outlined text-[18px] text-amber-300">verified</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">Active XP Balance</p>
                <h4 className="text-lg font-black text-white">4,850 XP • 💎 250</h4>
              </div>
              <div className="pt-1 flex items-center justify-between text-[10px] text-blue-200/80 font-mono">
                <span>ID: #NX-99201</span>
                <span>STATE LEAGUE</span>
              </div>
            </div>

          </div>

        </div>

        {/* ─── MIDDLE CUTOUT RIBBON: FAST PRACTICE, INSTANT RESULTS ─── */}
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            <div className="space-y-1 max-w-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Live Engine
              </span>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                FAST PRACTICE, <br />
                INSTANT RESULTS.
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Timed mock tests with instant AI accuracy reports and formula solutions.
              </p>
            </div>

            <div className="flex items-center gap-6 divide-x divide-slate-100">
              <div className="pl-0 sm:pl-4">
                <h3 className="font-heading font-black text-3xl sm:text-4xl text-blue-600">
                  90M+
                </h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Questions Solved
                </p>
              </div>
              <div className="pl-6">
                <h3 className="font-heading font-black text-3xl sm:text-4xl text-emerald-600">
                  98.4%
                </h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Score Boost
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ─── SECTION 2: STUDY GLOBALLY & GROW BEYOND BORDERS ─── */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          
          {/* Side-by-Side Feature Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Gamified Ecosystem
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Study with Friends & Compete Across India.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Challenge school friends, climb weekly state rank leaderboards, and unlock exclusive rewards in the shop with your earned diamonds.
              </p>
              <div className="pt-2">
                <Link
                  href="/signup"
                  onClick={playButtonClick}
                  className="inline-flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-800 underline"
                >
                  <span>Explore Curriculum Paths</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Graphic Card with Student Image / Mock UI */}
            <div className="rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  Physics Drill #04
                </span>
                <span className="text-amber-300 font-bold">100% Accuracy 🔥</span>
              </div>
              <h4 className="font-black text-lg text-white">
                &ldquo;nainixOne made Board revision feel like playing a game!&rdquo;
              </h4>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-black">
                  🎓
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Ananya Sharma</p>
                  <p className="text-[10px] text-blue-200">CBSE Class 12 • State Rank 14</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SECTION 3: DARK CURVED SHOWCASE POD (Ref Match) ─── */}
          <div className="rounded-[36px] bg-[#0c182c] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
            
            {/* Top Center Earth/Globe Graphic Badge */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 p-1 shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-white">globe</span>
            </div>

            <div className="space-y-2 max-w-lg">
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                GROW BEYOND BORDERS WITH NAINIXONE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Whether you&apos;re preparing for Board exams or aiming for JEE & NEET top percentiles, nainixOne gives you the superpower to win.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/signup"
                onClick={playButtonClick}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0c182c] font-black text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                Get Started for Free &rarr;
              </Link>
              
              <button
                type="button"
                onClick={scrollToLogin}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Sign In to Account ↑
              </button>
            </div>

          </div>

        </div>

        {/* ─── FOOTER ─── */}
        <footer className="w-full bg-[#08101e] text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800 space-y-2">
          <p className="font-bold text-slate-300">
            WHO WE SERVE • CBSE, ICSE, STATE BOARDS, JEE & NEET ASPIRANTS
          </p>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} nainixOne Technologies. All rights reserved.
          </p>
        </footer>

      </section>

    </div>
  );
}
