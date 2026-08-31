'use client';

import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    playButtonClick();

    const result = await login(identifier.trim(), password);
    setLoading(false);

    if (result.success) {
      playGemDing();
      router.push('/');
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-white text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-x-hidden select-none">
      
      {/* ─── Top Brand Header ─── */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-xl mx-auto py-2 z-20">
        <Link href="/" className="cursor-pointer active:scale-95 transition-transform">
          <BrandLogo size="lg" />
        </Link>
        <Link
          href="/"
          onClick={playButtonClick}
          className="text-xs font-black text-slate-600 hover:text-[#7c3aed] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border-2 border-slate-200 hover:border-violet-400 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back</span>
        </Link>
      </header>

      {/* ─── Main Interactive Graphic Login Window ─── */}
      <main className="w-full max-w-md my-auto py-6 relative flex flex-col items-center justify-center z-10">
        
        {/* Soft Organic Cloud / Blob Background (Brand Violet Theme) */}
        <div className="absolute -inset-4 sm:-inset-8 bg-[#ede9fe]/80 rounded-[60px] transform -rotate-1 pointer-events-none -z-10 blur-xs" />

        {/* ─── Top-Left Illuminated Idea Bulb ─── */}
        <div className="absolute -top-3 -left-2 sm:-top-5 sm:-left-6 z-20 flex flex-col items-center pointer-events-none animate-pulse">
          {/* Radiating Light Rays */}
          <div className="flex items-center gap-1 mb-1">
            <span className="w-1 h-3 bg-slate-900 rounded-full transform -rotate-45" />
            <span className="w-1 h-3.5 bg-slate-900 rounded-full -mt-1" />
            <span className="w-1 h-3 bg-slate-900 rounded-full transform rotate-45" />
          </div>

          {/* Light Bulb Icon */}
          <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 shadow-md flex items-center justify-center relative">
            <span className="material-symbols-outlined text-[28px] text-[#7c3aed] font-bold">lightbulb</span>
            {/* Thread Base */}
            <div className="absolute -bottom-2 w-5 h-2 bg-[#7c3aed] border border-slate-900 rounded-b-sm" />
          </div>
        </div>

        {/* ─── The Main Browser Login Window ─── */}
        <div className="w-full bg-white border-[3px] border-slate-900 rounded-3xl shadow-[8px_8px_0px_#0f172a] overflow-hidden relative transition-all">
          
          {/* 1. Browser Title Bar (Brand Purple Theme Header) */}
          <div className="w-full bg-[#7c3aed] border-b-[3px] border-slate-900 px-4 py-3 flex items-center justify-between">
            {/* 3 Circular Window Dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white/90 border border-slate-900 shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-white/90 border border-slate-900 shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-white/90 border border-slate-900 shadow-2xs" />
            </div>

            <span className="text-[11px] font-black uppercase text-violet-100 tracking-wider">
              nainixOne • Portal Access
            </span>

            <div className="w-12" />
          </div>

          {/* 2. Window Content Body */}
          <div className="p-6 sm:p-8 flex flex-col items-center">
            
            {/* Large User Avatar Silhouette Circle (Brand Purple Theme) */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#7c3aed] border-[3px] border-slate-900 flex items-center justify-center text-white shadow-sm mb-6 relative overflow-hidden group">
              <span className="material-symbols-outlined text-[48px] sm:text-[54px] text-white">person</span>
              <div className="absolute top-1 left-2 w-16 h-8 bg-white/20 rounded-t-full pointer-events-none" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-4 bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              
              {/* Capsule Input 1: Username / Email */}
              <div className="w-full h-13 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                {/* Left Solid Violet Segment */}
                <div className="w-24 sm:w-28 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span className="text-[11px] font-black tracking-tight">USER</span>
                </div>
                {/* Right Input Area */}
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Student ID"
                  className="w-full h-full bg-transparent px-4 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Capsule Input 2: Password */}
              <div className="w-full h-13 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                {/* Left Solid Violet Segment */}
                <div className="w-24 sm:w-28 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span className="text-[11px] font-black tracking-tight">PASS</span>
                </div>
                {/* Right Input Area */}
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-full bg-transparent px-4 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 h-12 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 text-white font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_#0f172a] active:shadow-none active:translate-y-1 transition-all duration-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In to Study</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  router.push('/');
                }}
                className="w-full h-11 rounded-xl bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_2px_0_#0f172a] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer mt-1"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335" />
                  <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4" />
                  <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05" />
                  <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853" />
                </svg>
                <span>Continue with Google</span>
              </button>

            </form>

            {/* Signup Navigation */}
            <div className="mt-5 text-center pt-3 border-t border-slate-100 w-full">
              <p className="text-xs font-bold text-slate-500">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  onClick={playButtonClick}
                  className="font-black text-[#7c3aed] hover:underline ml-1"
                >
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* ─── Bottom Interlocking Mechanical Gears (Brand Purple Theme) ─── */}
        <div className="relative w-full max-w-[280px] h-12 -mt-3 flex items-center justify-center z-20 pointer-events-none">
          {/* Main Big Gear Left */}
          <div className="w-14 h-14 rounded-full bg-[#7c3aed] border-2 border-slate-900 flex items-center justify-center shadow-md animate-spin-slow">
            <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-900" />
          </div>

          {/* Small Interlocking Gear Right */}
          <div className="w-10 h-10 -ml-2 -mt-4 rounded-full bg-[#8b5cf6] border-2 border-slate-900 flex items-center justify-center shadow-md animate-spin-reverse-slow">
            <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-900" />
          </div>

          {/* Mini Supporting Gear Bottom */}
          <div className="w-8 h-8 -ml-1 mt-2 rounded-full bg-[#6d28d9] border-2 border-slate-900 flex items-center justify-center shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-900" />
          </div>
        </div>

      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full shrink-0 text-center text-[11px] font-black text-slate-400 py-3 z-10">
        © 2026 nainixOne • Interactive Class 12 Prep Portal
      </footer>

      {/* Animation helper styles */}
      <style jsx global>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverseSlow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spinReverseSlow 15s linear infinite;
        }
      `}</style>

    </div>
  );
}
