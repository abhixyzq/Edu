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
    <div 
      className="min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans relative overflow-hidden select-none bg-[#09111e] bg-cover bg-top sm:bg-center"
      style={{
        backgroundImage: `url('/images/night_brick_sconce_bg.jpg')`,
      }}
    >
      
      {/* ─── Top Back Navigation ─── */}
      <header className="absolute top-4 left-4 z-30">
        <Link
          href="/"
          onClick={playButtonClick}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
      </header>

      {/* ─── Main Frosted Glassmorphism Login Card (Positioned in Light Beam) ─── */}
      <main className="w-full max-w-[340px] sm:max-w-[370px] relative z-20 mt-36 sm:mt-40">
        <div 
          className="w-full rounded-[30px] p-6 sm:p-8 backdrop-blur-md border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(254,240,138,0.12)] flex flex-col items-center"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(13, 27, 49, 0.55) 100%)',
          }}
        >
          
          {/* Card Title */}
          <h1 className="font-heading font-black text-3xl text-white tracking-wide text-center mb-6 drop-shadow-md">
            Login
          </h1>

          {/* Error Message Banner */}
          {error && (
            <div className="w-full mb-4 p-2.5 rounded-xl bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs font-semibold text-center backdrop-blur-md">
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

            {/* Remember Me & Forgot Password Row */}
            <div className="w-full flex items-center justify-between text-xs text-white/90 pt-1 px-1">
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

            {/* ─── High Contrast Pure White Pill Login Button ─── */}
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

          {/* Footer Register Link */}
          <div className="mt-6 text-center">
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

    </div>
  );
}
