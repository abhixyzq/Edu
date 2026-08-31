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
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleQuickDemoLogin = async () => {
    playButtonClick();
    setIdentifier('student@nainix.com');
    setPassword('student123');
    setLoading(true);
    const result = await login('student@nainix.com', 'student123');
    setLoading(false);
    if (result.success) {
      playGemDing();
      router.push('/');
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top Header */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-md mx-auto py-2 z-10">
        <Link href="/" className="cursor-pointer active:scale-95 transition-transform">
          <BrandLogo size="lg" />
        </Link>
        <Link
          href="/"
          onClick={playButtonClick}
          className="text-xs font-black text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md my-auto py-4 z-10">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(37,99,235,0.08)] transition-all">
          
          {/* ─── Hero Illustration Box ─── */}
          <div className="w-full mb-6 flex flex-col items-center">
            <div className="relative w-48 h-40 sm:w-56 sm:h-44 flex items-center justify-center">
              {/* Soft decorative background glow */}
              <div className="absolute inset-0 bg-blue-100/60 rounded-3xl blur-xl scale-95 pointer-events-none" />
              
              <img
                src="/images/login_illustration.png"
                alt="nainixOne Student Login Illustration"
                className="relative z-10 w-full h-full object-contain drop-shadow-sm select-none"
              />
            </div>

            <div className="text-center mt-3">
              <h1 className="font-heading text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
                Welcome Back!
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Enter your details to access your learning path & mock tests
              </p>
            </div>
          </div>

          {/* ─── Login Form ─── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email / Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700" htmlFor="identifier">
                Email Address or Username
              </label>
              <div className="relative w-full border-2 border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-blue-600 flex items-center">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-none py-3 px-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-700" htmlFor="password">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to your registered email address.');
                  }}
                  className="text-[11px] font-black text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="relative w-full border-2 border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-blue-600 flex items-center">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-none py-3 px-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-600">Remember me</span>
              </label>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in duration-150">
                <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* 3D Tactile Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-105 disabled:opacity-60 text-white font-black text-sm py-3.5 rounded-2xl border-b-4 border-blue-900 shadow-lg shadow-blue-500/25 active:border-b-0 active:translate-y-1 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="h-px bg-slate-200 flex-grow" />
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">or continue with</span>
              <div className="h-px bg-slate-200 flex-grow" />
            </div>

            {/* Google & Demo Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  router.push('/');
                }}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335" />
                  <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4" />
                  <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05" />
                  <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full bg-blue-50 border-2 border-blue-200 hover:bg-blue-100/80 text-blue-700 font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Demo 1-Click</span>
              </button>
            </div>

          </form>

          {/* Create Account Link */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              New to nainixOne?{' '}
              <Link
                href="/signup"
                onClick={playButtonClick}
                className="font-black text-blue-600 hover:text-blue-800 hover:underline ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full shrink-0 text-center text-[11px] font-bold text-slate-400 py-3 z-10">
        © 2026 nainixOne • AI Powered Class 12 Preparation
      </footer>
    </div>
  );
}
