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
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans relative overflow-hidden select-none bg-[#0a1224]">
      
      {/* ─── 1. Deep Midnight Blue Brick Texture Canvas ─── */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#0a1628',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 1px, transparent 1px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 56px)
          `,
          backgroundSize: '56px 28px',
        }}
      />

      {/* ─── 2. Top Mounted Wall Sconce Lamp & Warm Spotlight Glow ─── */}
      <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
        {/* Wall Lamp Fixture (Trapezoid Box) */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Top dark mount bracket */}
          <div className="w-16 h-3 bg-[#0d1d36] rounded-t-md border-t border-x border-white/20 shadow-md" />
          {/* Main Sconce Body */}
          <div 
            className="w-24 h-10 rounded-b-md border-x border-b border-white/20 shadow-2xl relative flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #162b4d 0%, #0d1b33 100%)',
            }}
          >
            {/* Luminous Warm Bulb Strip */}
            <div className="w-16 h-3 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-full shadow-[0_0_20px_#fde047,0_0_35px_#f59e0b] animate-pulse" />
          </div>
        </div>

        {/* ─── Glowing Ambient Cone of Light ─── */}
        <div 
          className="w-[320px] sm:w-[440px] h-[360px] sm:h-[460px] pointer-events-none -mt-4 opacity-90"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.18) 40%, rgba(10, 22, 40, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      </div>

      {/* ─── Top Back Navigation ─── */}
      <header className="absolute top-4 left-4 z-30">
        <Link
          href="/"
          onClick={playButtonClick}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </Link>
      </header>

      {/* ─── 3. Main Frosted Glassmorphism Login Card ─── */}
      <main className="w-full max-w-[340px] sm:max-w-[360px] relative z-20 mt-28 sm:mt-32">
        <div 
          className="w-full rounded-[28px] p-6 sm:p-8 backdrop-blur-xl border border-white/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_30px_rgba(254,240,138,0.08)] flex flex-col items-center"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(15, 28, 54, 0.55) 100%)',
          }}
        >
          
          {/* Card Title */}
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide text-center mb-6 drop-shadow-md">
            Login
          </h1>

          {/* Error Message Banner */}
          {error && (
            <div className="w-full mb-4 p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold text-center backdrop-blur-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            
            {/* Field 1: Username / Email */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-5 pr-11 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/15 focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 material-symbols-outlined text-[20px] pointer-events-none">
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
                className="w-full pl-5 pr-11 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/15 focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? 'visibility_off' : 'lock'}
                </span>
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="w-full flex items-center justify-between text-xs text-white/80 pt-1 px-1">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border border-white/40 bg-white/10 accent-white cursor-pointer"
                />
                <span className="text-[11px] font-medium text-white/90">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[11px] font-medium text-white/90 hover:text-white hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* ─── High Contrast Pure White Pill Login Button ─── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0a1628] font-heading font-black text-sm sm:text-base shadow-[0_8px_20px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/80">
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

    </div>
  );
}
