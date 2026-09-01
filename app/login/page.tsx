'use client';

import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your username/email and password!');
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
      setError(result.error || 'Oops! Incorrect email or password. Try again!');
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-x-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #9574ea 0%, #835cd9 50%, #7045c7 100%)',
      }}
    >
      {/* ─── Playful Floating Background Sparkles ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft clouds & glowing stars */}
        <div className="absolute top-12 left-8 text-white/30 text-2xl animate-pulse">✨</div>
        <div className="absolute top-28 right-10 text-yellow-200/50 text-3xl animate-bounce">⭐</div>
        <div className="absolute bottom-24 left-12 text-yellow-200/40 text-2xl animate-pulse">🌟</div>
        <div className="absolute bottom-40 right-14 text-white/30 text-xl">✨</div>
        
        {/* Translucent background glow spheres */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-900/30 rounded-full blur-3xl" />
      </div>

      {/* ─── Top Game Header ─── */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-sm mx-auto pt-2 z-20">
        <Link
          href="/"
          onClick={playButtonClick}
          className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 shadow-[0_3px_0_rgba(0,0,0,0.15)] flex items-center justify-center text-white hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/30 text-white font-game-num font-black text-xs shadow-xs">
          <span>👑 nainixOne</span>
        </div>

        <div className="w-10" />
      </header>

      {/* ─── Main 3D Game Login Card ─── */}
      <main className="w-full max-w-[370px] sm:max-w-[390px] my-auto py-4 flex flex-col items-center z-10">
        
        {/* Floating Mascot Header */}
        <div className="relative flex flex-col items-center -mb-8 z-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-b from-amber-300 to-amber-500 border-4 border-white shadow-[0_8px_0_#b45309] flex items-center justify-center relative transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
            <img
              src="/images/trophy_cat.png"
              alt="Mascot Cat"
              className="w-14 h-14 object-contain drop-shadow-md animate-bounce"
            />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-xs">
              XP!
            </span>
          </div>
        </div>

        {/* 3D White Card Deck */}
        <div className="w-full bg-white rounded-[32px] border-[3px] border-[#6d28d9] shadow-[0_10px_0_#581c87] pt-12 pb-6 px-5 sm:px-7 flex flex-col items-center relative">
          
          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="font-game-num font-black text-2xl sm:text-3xl text-slate-800 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-xs font-bold text-violet-600 mt-0.5 flex items-center justify-center gap-1">
              <span>🔥 Keep your streak alive & earn Gems</span>
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-3 p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold text-center shadow-xs">
              {error}
            </div>
          )}

          {/* ─── Inputs Form ─── */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            
            {/* Input 1: Email or Username */}
            <div className="relative w-full rounded-2xl bg-slate-100 border-2 border-slate-300 shadow-[0_4px_0_#cbd5e1] p-1.5 flex items-center gap-2.5 transition-all focus-within:border-violet-600 focus-within:bg-white focus-within:shadow-[0_4px_0_#7c3aed]">
              {/* Left Purple Badge */}
              <div className="w-10 h-10 rounded-xl bg-violet-600 border border-violet-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-transparent outline-none text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 pr-3"
                required
              />
            </div>

            {/* Input 2: Password */}
            <div className="relative w-full rounded-2xl bg-slate-100 border-2 border-slate-300 shadow-[0_4px_0_#cbd5e1] p-1.5 flex items-center gap-2.5 transition-all focus-within:border-violet-600 focus-within:bg-white focus-within:shadow-[0_4px_0_#7c3aed]">
              {/* Left Orange Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#ff8c42] border border-amber-300 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 pr-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 pr-3 flex items-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[11px] font-black text-violet-600 hover:text-violet-800 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* ─── Big 3D Gamified Button (Duolingo / CandyCrush 3D Feel) ─── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-game-num font-black text-base sm:text-lg border-2 border-[#3b8701] shadow-[0_6px_0_#2b6400] active:translate-y-1 active:shadow-[0_2px_0_#2b6400] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>LOG IN</span>
                  <span className="material-symbols-outlined text-[22px]">bolt</span>
                </>
              )}
            </button>
          </form>

          {/* ─── Divider ─── */}
          <div className="w-full flex items-center gap-3 my-5">
            <div className="flex-1 h-[2px] bg-slate-200" />
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              OR
            </span>
            <div className="flex-1 h-[2px] bg-slate-200" />
          </div>

          {/* ─── 3D Social Buttons ─── */}
          <div className="w-full flex items-center justify-center gap-4">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => alert('Google login integration ready.')}
              className="flex-1 py-2.5 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 font-black text-xs text-slate-700 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Google</span>
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={() => alert('Apple login integration ready.')}
              className="flex-1 py-2.5 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 font-black text-xs text-slate-700 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 fill-black" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.38-.56.65-1.06 1.71-.93 2.74 1.04.08 2.07-.5 2.68-1.25z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

        </div>

      </main>

      {/* ─── Bottom Footer ─── */}
      <footer className="w-full shrink-0 text-center py-2 z-20">
        <p className="text-xs font-black text-white drop-shadow-xs">
          New Explorer?{' '}
          <Link
            href="/signup"
            onClick={playButtonClick}
            className="text-amber-300 hover:text-amber-200 underline font-black cursor-pointer"
          >
            CREATE ACCOUNT (+50 💎)
          </Link>
        </p>
      </footer>

    </div>
  );
}
