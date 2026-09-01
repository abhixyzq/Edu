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

  const [interactiveTab, setInteractiveTab] = useState<'map' | 'battles' | 'rewards'>('map');

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
            className="text-[11px] font-bold text-amber-200/90 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>✨ Feature Deck</span>
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
            aria-label="View Game Showcase"
            className="p-2 flex items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 group-active:scale-95 transition-all shadow-xs" />
          </button>
        </footer>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 2: Interactive Gamified Feature & World Deck
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={showcaseRef}
        className="min-h-[100dvh] w-full shrink-0 snap-start bg-gradient-to-b from-[#09111e] via-[#0f172a] to-[#1e1b4b] text-white p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden"
      >
        {/* Background ambient glowing spheres */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10 pb-4 border-b border-white/10">
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

        {/* Main Interactive World Deck */}
        <div className="max-w-4xl mx-auto w-full my-auto py-6 z-10 space-y-6">
          
          {/* Hero Gamified Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <span>🎮 Turn Studies into an Adventure</span>
            </div>
            <h2 className="font-game-num font-black text-2xl sm:text-4xl text-white tracking-tight">
              Level Up Your Exam Ranks
            </h2>
          </div>

          {/* Interactive Feature Category Tabs */}
          <div className="flex items-center justify-center gap-2 max-w-sm mx-auto p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setInteractiveTab('map');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                interactiveTab === 'map'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🗺️ 3D Map
            </button>

            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setInteractiveTab('battles');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                interactiveTab === 'battles'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ⚡ Mock Arena
            </button>

            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setInteractiveTab('rewards');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                interactiveTab === 'rewards'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              💎 Perks & Shop
            </button>
          </div>

          {/* Interactive Showcase Screen */}
          <div className="rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            
            {/* Tab 1: 3D Map Tree Preview */}
            {interactiveTab === 'map' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-300/20">
                    Step-by-Step Mastery
                  </span>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                    Non-Linear 3D Learning Path
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Progress topic-by-topic like a game. Beat levels, unlock treasure chest checkpoints, maintain your streak fire, and level up with our cat mascot!
                  </p>
                  
                  {/* Mini Stats Badges */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                      🔥 Daily Streaks
                    </span>
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-black">
                      ❤️ 5 Heart Lives
                    </span>
                    <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-black">
                      ⚡ Level 1-20
                    </span>
                  </div>
                </div>

                {/* Visual 3D Road Map Demonstration */}
                <div className="rounded-2xl bg-[#131d33] border border-white/10 p-5 flex flex-col items-center justify-center gap-4 relative">
                  {/* Level 3 Node (Active Golden) */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-3 border-white shadow-[0_6px_0_#b45309] flex items-center justify-center text-slate-950 font-game-num font-black text-lg animate-bounce">
                      3
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-amber-300">Active Level</p>
                      <p className="text-[11px] text-slate-300 font-bold">Coulomb&apos;s Force & Vectors</p>
                    </div>
                  </div>

                  {/* Level 2 Node (Completed) */}
                  <div className="flex items-center gap-3 opacity-90">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border-2 border-white shadow-[0_4px_0_#047857] flex items-center justify-center text-white font-black text-sm">
                      ✓
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-emerald-400">Mastered</p>
                      <p className="text-[11px] text-slate-400">Electric Charges & Fields</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Mock Arena */}
            {interactiveTab === 'battles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-violet-300 bg-violet-400/10 px-2.5 py-1 rounded-full border border-violet-300/20">
                    Timed Test Simulator
                  </span>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                    Instant AI Accuracy & Solutions
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Attempt real board-pattern timed mock papers. Get instant scorecards, accuracy rates, state leaderboard ranks, and step-by-step LaTeX formula explanations.
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black">
                      ⏱️ 20-Min Timers
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                      📊 Accuracy %
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                      🏆 State Ranks
                    </span>
                  </div>
                </div>

                {/* Question Card Mockup */}
                <div className="rounded-2xl bg-[#131d33] border border-white/10 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-violet-300">Physics Drill 01</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">14:22 Left</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    Q: What is the force between two point charges placed in a medium of dielectric constant K?
                  </p>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold flex items-center justify-between">
                      <span>A. Decreases by factor 1/K</span>
                      <span className="text-emerald-400 font-black">✓ Correct</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                      <span>B. Increases by factor K</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Rewards & Shop */}
            {interactiveTab === 'rewards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-300/20">
                    Rewards Economy
                  </span>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                    Gems, Heart Refills & Avatars
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Earn Gems on every correct answer. Trade them in the Shop for Streak Freezes, Heart Refills, Custom Cat Mascot skins, and exclusive Title Badges!
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-black">
                      💎 50 Welcome Gems
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                      🛡️ Streak Shield
                    </span>
                  </div>
                </div>

                {/* Shop Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#131d33] border border-white/10 text-center space-y-1.5">
                    <span className="text-2xl">🛡️</span>
                    <p className="text-xs font-black text-white">Streak Freeze</p>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-400/30">
                      200 💎
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131d33] border border-white/10 text-center space-y-1.5">
                    <span className="text-2xl">💖</span>
                    <p className="text-xs font-black text-white">Full Heart Refill</p>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-400/30">
                      350 💎
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              onClick={playButtonClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:scale-105 text-slate-950 font-black text-sm text-center shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              Join the Game for Free (+50 💎)
            </Link>

            <button
              type="button"
              onClick={scrollToLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm text-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Sign In to Account ↑
            </button>
          </div>

        </div>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto w-full text-center text-[10px] text-slate-500 pt-3 border-t border-white/10 z-10">
          nainixOne Gamified Learning Ecosystem • Built for high-scorers
        </footer>
      </section>

    </div>
  );
}
