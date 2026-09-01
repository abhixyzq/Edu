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
          SCREEN 2: 100% Exact Futuristic Showcase Landing Page (Ref Match)
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={showcaseRef}
        className="min-h-[100dvh] w-full shrink-0 snap-start bg-[#122238] text-slate-900 overflow-y-auto py-6 px-2 sm:px-6 relative"
      >
        {/* Main Framed White/Sky Card Container (Matching 100% Image Canvas) */}
        <div className="max-w-[560px] mx-auto bg-white rounded-[36px] shadow-2xl overflow-hidden border border-slate-200/60 relative">
          
          {/* ─── 1. Top Angled 3D Smartphone App Mockup Cards ─── */}
          <div className="w-full bg-gradient-to-b from-[#b4d4f7] via-[#cce2fa] to-[#e8f1fc] pt-5 px-4 pb-2 relative overflow-hidden flex items-center justify-center">
            <div className="flex items-center justify-center -space-x-4 sm:-space-x-6 py-2 transform scale-[0.88] sm:scale-100">
              
              {/* Left Phone Card */}
              <div className="w-28 h-44 rounded-2xl bg-white shadow-xl border border-white/60 p-2 transform -rotate-12 -translate-y-2 flex flex-col justify-between opacity-85">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-[8px] font-black text-blue-950">PAYROT</span>
                </div>
                <div className="text-[7px] text-slate-400 font-bold">Fast Global Transfers</div>
              </div>

              {/* Center Main Phone App Screen */}
              <div className="w-36 h-52 rounded-2xl bg-[#0d1e3a] text-white shadow-2xl border-2 border-white/40 p-2.5 z-10 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[8px] text-blue-200">
                    <span>Withdrawal To: BRAC BANK LTD</span>
                    <span className="text-emerald-400 font-bold">+$780 USD</span>
                  </div>
                  <div className="flex justify-between items-center text-[8px] text-blue-200">
                    <span>Payment From: M. SHAHID ULLAH</span>
                    <span className="text-blue-300 font-bold">Completed</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border border-blue-400">
                    <span className="material-symbols-outlined text-[16px] text-white">account_balance_wallet</span>
                  </div>
                </div>
              </div>

              {/* Right Card: Apply for Free Card */}
              <div className="w-32 h-44 rounded-2xl bg-white shadow-xl border border-white/60 p-3 transform rotate-12 -translate-y-2 flex flex-col justify-between opacity-95">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-800 leading-tight">
                    Apply for your free <br />
                    <span className="text-blue-600 font-black">Payrot card</span>
                  </h4>
                </div>
                <span className="text-[7px] text-blue-600 font-bold">VISA Platinum &rarr;</span>
              </div>

            </div>
          </div>

          {/* ─── 2. Main Hero Area with Giant "PAYROT" Watermark & 3D Blue Parrot ─── */}
          <div className="w-full bg-gradient-to-b from-[#e8f1fc] via-[#f0f6fd] to-white pt-3 px-4 pb-4 relative overflow-hidden">
            
            {/* Navbar */}
            <div className="w-full flex items-center justify-between z-20 relative pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-xs font-black text-slate-900 tracking-wider">PAYROT</span>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold text-slate-500">
                <span className="hover:text-blue-600 cursor-pointer">Features</span>
                <span className="hover:text-blue-600 cursor-pointer">Saves</span>
                <span className="hover:text-blue-600 cursor-pointer">Vehicles</span>
                <span className="hover:text-blue-600 cursor-pointer">FAQ</span>
              </div>

              <Link
                href="/signup"
                onClick={playButtonClick}
                className="px-3.5 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black shadow-xs transition-all cursor-pointer"
              >
                Sign In &rarr;
              </Link>
            </div>

            {/* Giant "PAYROT" Watermark Title */}
            <div className="w-full text-center relative flex items-center justify-center my-1 pointer-events-none select-none">
              <h1 className="font-heading font-black text-6xl sm:text-7xl text-white tracking-widest uppercase drop-shadow-sm">
                PAYROT
              </h1>
            </div>

            {/* Center Hero: 3D Blue Macaw Parrot with Floating Cards */}
            <div className="w-full relative flex items-center justify-between -mt-6 sm:-mt-8 z-10">
              
              {/* Left Floating Card: Earth Globe */}
              <div className="w-28 sm:w-32 bg-white/95 rounded-2xl p-2.5 shadow-xl border border-blue-100 flex flex-col items-center text-center space-y-1.5 z-20">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 shadow-md flex items-center justify-center p-0.5 relative overflow-hidden animate-pulse">
                  <span className="material-symbols-outlined text-[26px] text-white">public</span>
                </div>
                <p className="text-[8px] text-slate-700 font-bold leading-tight">
                  Send And Receive Money Worldwide Fast, Secure, And Hassle-Free
                </p>
              </div>

              {/* Center 3D Blue Parrot Mascot */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center -mx-3">
                <img
                  src="/images/hero_mascot_parrot.png"
                  alt="Payrot Blue Parrot"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 transform scale-110"
                />
                <div className="absolute -top-1 right-2 bg-white/95 border border-slate-200 px-2 py-0.5 rounded-full shadow-md text-[8px] font-black text-slate-700 z-20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>10M+ Users</span>
                </div>
              </div>

              {/* Right Floating Card: Blue VISA Card */}
              <div className="w-28 sm:w-32 bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] text-white rounded-2xl p-2.5 shadow-xl border border-blue-300/40 space-y-1 z-20">
                <div className="flex justify-between items-center text-[7px] text-blue-200">
                  <span>PAYROT</span>
                  <span className="font-bold text-amber-300">VISA</span>
                </div>
                <div className="w-4 h-3 rounded-sm bg-amber-300/80 my-1" />
                <p className="text-[7px] font-mono tracking-wider text-blue-100">0457 5667 0088 5441</p>
                <div className="flex justify-between text-[6px] text-blue-200 pt-0.5">
                  <span>EXP: 08/29</span>
                  <span>PLATINUM</span>
                </div>
              </div>

            </div>

          </div>

          {/* ─── 3. Curved Dynamic Polygon Ribbon (Matching Exact 3-Pillar Layout) ─── */}
          <div className="w-full px-3 py-2 -mt-2 relative z-20">
            <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100 grid grid-cols-3 gap-2 items-center text-left">
              
              {/* Left Pillar */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="w-2 h-2 rounded-full bg-indigo-900" />
                </div>
                <p className="text-[8px] text-slate-600 font-medium leading-tight">
                  Payrot empowers users to send and receive payments globally.
                </p>
                <span className="text-[7px] font-black text-blue-600 uppercase tracking-wider block hover:underline cursor-pointer">
                  OUR SERVICES &rarr;
                </span>
              </div>

              {/* Center Pillar with Raised Cutout Pill */}
              <div className="bg-gradient-to-b from-[#e0efff] to-[#f4f9ff] rounded-2xl p-2.5 text-center border border-blue-200/70 shadow-xs space-y-1">
                <div className="inline-flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full text-[7px] font-black text-blue-600 border border-blue-200 shadow-2xs">
                  <span>Open Account</span>
                  <span className="material-symbols-outlined text-[9px]">arrow_forward</span>
                </div>
                <h3 className="font-heading font-black text-[10px] sm:text-[11px] text-slate-900 leading-tight uppercase">
                  FAST SEND, <br />
                  FAST RECEIVE
                </h3>
              </div>

              {/* Right Pillar with 90M+ */}
              <div className="space-y-0.5 text-right pr-1">
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider block">
                  TOTAL TRANSFERS
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-blue-600 leading-none">
                  90M+
                </h3>
                <p className="text-[7px] text-slate-400 font-medium">Payment Processed With Payrot</p>
                <span className="text-[7px] font-black text-blue-600 uppercase tracking-wider block hover:underline cursor-pointer">
                  VIEW STATS &rarr;
                </span>
              </div>

            </div>
          </div>

          {/* ─── 4. "HIRE AND PAY GLOBALLY WITH PAYROT" Section ─── */}
          <div className="w-full px-5 py-6 grid grid-cols-2 gap-4 items-center bg-white">
            <div className="space-y-2">
              <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 tracking-tight uppercase leading-snug">
                HIRE AND PAY GLOBALLY WITH PAYROT
              </h3>
              <p className="text-[8px] sm:text-[9px] text-slate-500 leading-relaxed">
                Payrot Workforce helps you onboard and pay freelancers or contractors across 150+ countries quickly, securely, and without borders.
              </p>
              <span className="text-[7px] font-black text-blue-600 uppercase tracking-wider block hover:underline cursor-pointer">
                EXPLORE WORKFORCE TOOLS &rarr;
              </span>
            </div>

            {/* Right Graphic: Professional with Floating Payment Chips */}
            <div className="rounded-2xl bg-gradient-to-tr from-[#93c5fd] via-[#bfdbfe] to-[#dbeafe] p-3 relative flex items-center justify-center shadow-inner">
              <div className="w-24 h-24 rounded-2xl bg-white/90 border border-white shadow-md p-2 flex flex-col items-center justify-center text-center relative">
                <span className="material-symbols-outlined text-[32px] text-blue-600">laptop_mac</span>
                <span className="text-[8px] font-bold text-slate-800">Global Team</span>
                
                {/* Floating Payment Request Chips */}
                <div className="absolute -top-2 -right-3 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-md text-[6px] font-bold text-slate-700 flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>PAYMENT REQUEST</span>
                </div>
                <div className="absolute -bottom-2 -left-3 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-md text-[6px] font-black text-emerald-600">
                  +$500 USD Paid
                </div>
              </div>
            </div>
          </div>

          {/* ─── 5. Dark Symmetrical Arch Pod ("GROW BEYOND BORDERS WITH PAYROT") ─── */}
          <div className="w-full px-4 pb-6 bg-white">
            <div className="rounded-[32px] bg-[#0c1c2e] text-white pt-8 pb-7 px-5 text-center relative overflow-hidden flex flex-col items-center space-y-3">
              
              {/* Symmetrical Arch Cutout with 3D Globe Resting Inside */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-teal-300 p-0.5 shadow-[0_0_25px_rgba(56,189,248,0.7)] flex items-center justify-center -mt-14 mb-1 animate-pulse">
                <span className="material-symbols-outlined text-[36px] text-white">public</span>
              </div>

              <div className="space-y-1 max-w-xs">
                <h3 className="font-heading font-black text-xs sm:text-sm text-white tracking-tight uppercase">
                  GROW BEYOND BORDERS WITH PAYROT
                </h3>
                <p className="text-[8px] text-slate-300 leading-relaxed font-medium">
                  Whether you&apos;re paying a freelancer or a full-scale overseas team, Payrot makes it simple, fast, secure, and with zero card fees to worry about.
                </p>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <Link
                  href="/signup"
                  onClick={playButtonClick}
                  className="px-5 py-2 rounded-full border border-white/60 hover:bg-white hover:text-[#0c1c2e] text-white font-black text-[9px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                >
                  Explore More &rarr;
                </Link>

                <button
                  type="button"
                  onClick={scrollToLogin}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[9px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                >
                  Login ↑
                </button>
              </div>

            </div>
          </div>

          {/* ─── 6. Footer: "WHO WE SERVE" ─── */}
          <div className="w-full py-4 text-center bg-white border-t border-slate-100">
            <h4 className="font-heading font-black text-[11px] text-slate-800 uppercase tracking-widest">
              WHO WE SERVE
            </h4>
          </div>

        </div>
      </section>

    </div>
  );
}
