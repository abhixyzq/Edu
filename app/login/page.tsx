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
      setError('Please enter your email/username and password.');
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
      setError(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-x-hidden select-none"
      style={{
        backgroundColor: '#fff0f5',
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(251, 207, 232, 0.45) 0px, rgba(251, 207, 232, 0.45) 32px, transparent 32px, transparent 64px),
          repeating-linear-gradient(90deg, rgba(251, 207, 232, 0.45) 0px, rgba(251, 207, 232, 0.45) 32px, transparent 32px, transparent 64px)
        `,
      }}
    >
      {/* ─── Top Bar ─── */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-sm mx-auto pt-2 z-20">
        <Link
          href="/"
          onClick={playButtonClick}
          className="w-9 h-9 rounded-full bg-white/80 border-2 border-[#475569] shadow-[0_2px_0_#475569] flex items-center justify-center text-slate-700 hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="text-xs font-black uppercase tracking-widest text-[#be185d]">
          nainixOne
        </span>
        <div className="w-9" />
      </header>

      {/* ─── Main Center Login Card Container ─── */}
      <main className="w-full max-w-[360px] sm:max-w-[380px] my-auto py-4 flex flex-col items-center z-10">
        
        {/* ─── 1. "LOGIN" 3D Title with Peeking Cat & Sparkles ─── */}
        <div className="relative flex items-center justify-center mb-8 mt-2">
          
          {/* Peeking Cute Cat on Top-Left of LOGIN */}
          <div className="absolute -top-10 -left-6 z-20 w-16 h-16 pointer-events-none select-none drop-shadow-md transform -rotate-12 animate-pulse">
            <img
              src="/images/trophy_cat.png"
              alt="Cat"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Yellow Sparkle Diamonds on Top-Right */}
          <div className="absolute -top-4 -right-7 flex flex-col items-start gap-1 pointer-events-none select-none">
            <div className="w-3.5 h-3.5 bg-yellow-300 border border-amber-400 rotate-45 shadow-2xs animate-bounce" />
            <div className="w-2.5 h-2.5 bg-yellow-300 border border-amber-400 rotate-45 shadow-2xs ml-3" />
            <div className="w-3 h-3 bg-yellow-300 border border-amber-400 rotate-45 shadow-2xs ml-5 -mt-1" />
          </div>

          {/* 3D Bubble "LOGIN" Heading */}
          <h1
            className="font-bubble font-black text-5xl sm:text-6xl tracking-wider select-none text-[#ff8fb3]"
            style={{
              WebkitTextStroke: '5px #ffffff',
              paintOrder: 'stroke fill',
              filter: 'drop-shadow(0 5px 0 #9f5074) drop-shadow(0 10px 14px rgba(0,0,0,0.15))',
            }}
          >
            LOGIN
          </h1>
        </div>

        {/* ─── 2. Form Container ─── */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-2 rounded-2xl text-xs font-bold text-center shadow-xs">
              {error}
            </div>
          )}

          {/* ─── Field 1: Email or Username ─── */}
          <div className="relative w-full rounded-full bg-[#f1f5f9] border-2 border-[#475569] shadow-[0_5px_0_#475569] p-1.5 flex items-center gap-2.5 transition-all focus-within:ring-2 focus-within:ring-pink-300">
            {/* Left Pink Icon Badge */}
            <div className="w-10 h-10 rounded-full bg-[#f472b6] border border-white text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>

            {/* Input Element */}
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 pr-4"
              required
            />
          </div>

          {/* ─── Field 2: Password with Peek-a-boo Cat ─── */}
          <div className="relative w-full mt-2">
            
            {/* Little Cat Peeking over the Password Box */}
            <div className="absolute -top-5 right-6 z-20 pointer-events-none select-none">
              <div className="w-9 h-7 rounded-t-full bg-white border-2 border-[#475569] border-b-0 flex items-center justify-center pt-1 shadow-2xs">
                {/* Cat face whiskers & eyes */}
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#475569]" />
                  <span className="w-1 h-1 rounded-full bg-[#475569]" />
                </div>
              </div>
            </div>

            {/* Password Input Pill */}
            <div className="w-full rounded-full bg-[#f1f5f9] border-2 border-[#475569] shadow-[0_5px_0_#475569] p-1.5 flex items-center gap-2.5 transition-all focus-within:ring-2 focus-within:ring-pink-300">
              {/* Left Pink Lock Icon Badge */}
              <div className="w-10 h-10 rounded-full bg-[#f472b6] border border-white text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[19px]">lock</span>
              </div>

              {/* Password Input */}
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 pr-2"
                required
              />

              {/* Eye Visibility Toggle */}
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
          </div>

          {/* ─── Forgot Password Link ─── */}
          <div className="w-full flex justify-end -mt-1">
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your registered email.')}
              className="text-[11px] font-bold text-[#be185d] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* ─── 3. Big 3D Pill Login Button ─── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full bg-[#d87093] hover:bg-[#c95f82] text-white font-heading font-black text-base sm:text-lg border-2 border-[#475569] shadow-[0_5px_0_#475569] active:translate-y-1 active:shadow-[0_1px_0_#475569] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* ─── 4. "or continue with" Divider ─── */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-[1.5px] bg-[#947080]/30" />
          <span className="text-[11px] font-bold text-[#886070] select-none">
            or continue with
          </span>
          <div className="flex-1 h-[1.5px] bg-[#947080]/30" />
        </div>

        {/* ─── 5. Circular Social Login Buttons ─── */}
        <div className="flex items-center justify-center gap-5">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => alert('Google login integration active.')}
            className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:scale-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => alert('Apple login integration active.')}
            className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:scale-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.38-.56.65-1.06 1.71-.93 2.74 1.04.08 2.07-.5 2.68-1.25z" />
            </svg>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => alert('Facebook login integration active.')}
            className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:scale-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

      </main>

      {/* ─── Footer: Don't have an account? Sign Up ─── */}
      <footer className="w-full shrink-0 text-center py-2 z-20">
        <p className="text-xs font-bold text-slate-700">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            onClick={playButtonClick}
            className="font-black text-[#be185d] hover:underline cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </footer>

    </div>
  );
}
