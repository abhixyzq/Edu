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

  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const loginSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAbout = () => {
    playButtonClick();
    aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            className="text-[11px] font-bold text-amber-200/90 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>About nainixOne</span>
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

        {/* ─── Swipe Up / Scroll to About Drawer Prompt ─── */}
        <footer className="w-full shrink-0 flex flex-col items-center pb-2 z-20">
          <button
            type="button"
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 drop-shadow-sm group-hover:scale-105 transition-transform flex items-center gap-1">
              <span>Swipe Up to Explore</span>
              <span className="material-symbols-outlined text-[14px] animate-bounce">expand_less</span>
            </span>
            <div className="w-8 h-1 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors" />
          </button>
        </footer>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 2: Seamless Slide-Up / Scroll-Down ABOUT Section
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={aboutSectionRef}
        className="min-h-[100dvh] w-full shrink-0 snap-start bg-gradient-to-b from-[#09111e] via-[#0f172a] to-[#1e1b4b] text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden"
      >
        {/* Background ambient glowing spheres */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Header */}
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BrandLogo size="lg" />
          </div>

          <button
            type="button"
            onClick={scrollToLogin}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black text-white flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            <span>Back to Login</span>
          </button>
        </div>

        {/* Main About Content Container */}
        <div className="max-w-4xl mx-auto w-full my-auto py-8 z-10 space-y-8">
          
          {/* Hero Pitch */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <span>🚀 India&apos;s #1 Gamified Learning Platform</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Master Your Exams, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-violet-400">
                One Quest at a Time.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              nainixOne transforms stressful Board and Competitive exam preparation into an engaging, rewarded game. Build streaks, earn gems, and conquer interactive chapter roadmaps.
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1 */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <h3 className="font-black text-sm text-white">Gamified Roadmaps</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Topic-by-topic interactive 3D learning trees for Physics, Chemistry, Math & Biology with XP levels, hearts, and milestone unlocks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-violet-400/20 border border-violet-300/30 text-violet-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">analytics</span>
              </div>
              <h3 className="font-black text-sm text-white">Instant AI Analytics</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Take timed mock tests with instant scorecards, accuracy breakdown, LaTeX formula steps, and personalized weak-area drills.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">emoji_events</span>
              </div>
              <h3 className="font-black text-sm text-white">State Rank Leaderboards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compete with classmates across India. Rise from Bronze to Master League, earn exclusive badges, and showcase your rank.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-400/20 border border-blue-300/30 text-blue-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <h3 className="font-black text-sm text-white">All Major Boards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Curriculum tailored for CBSE, Bihar Board (BSEB), UP Board, ICSE/ISC, JEE Main and NEET UG aspirants (Classes 9–12).
              </p>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md grid grid-cols-3 text-center divide-x divide-white/10">
            <div>
              <h4 className="font-black text-lg sm:text-2xl text-amber-300">10,000+</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Scholars</p>
            </div>
            <div>
              <h4 className="font-black text-lg sm:text-2xl text-violet-300">500+</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Mock Papers</p>
            </div>
            <div>
              <h4 className="font-black text-lg sm:text-2xl text-emerald-300">98.4%</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Score Boost</p>
            </div>
          </div>

          {/* CTA Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              onClick={playButtonClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm text-center shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Start Learning for Free (+50 💎)
            </Link>

            <button
              type="button"
              onClick={scrollToLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm text-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Sign In to Existing Account ↑
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 pt-4 border-t border-white/10 z-10">
          © {new Date().getFullYear()} nainixOne Edu Technologies. Built for champions.
        </footer>
      </section>

    </div>
  );
}
