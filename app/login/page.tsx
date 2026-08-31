'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { BrandLogo } from '@/components/BrandLogo';

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
    const result = await login(identifier.trim(), password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans selection:bg-purple-100 selection:text-purple-900"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top Header */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-md mx-auto py-2">
        <Link href="/" className="cursor-pointer active:scale-95 transition-transform">
          <BrandLogo size="lg" />
        </Link>
        <Link
          href="/"
          className="text-xs font-black text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back</span>
        </Link>
      </header>

      {/* Main Glassmorphic Login Card */}
      <main className="w-full max-w-md my-auto">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          
          {/* Top Video / Character Header */}
          <div className="w-full h-36 sm:h-44 mb-4 rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative flex items-center justify-center shadow-xs border border-slate-200">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center pointer-events-none scale-105"
            >
              <source src="/videos/login_character.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Header Titles */}
          <div className="text-center mb-5">
            <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Welcome Back
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Sign in to continue your Class 12 preparation
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Email / Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-700" htmlFor="identifier">
                Email or Phone Number
              </label>
              <div className="relative w-full border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#7c3aed]/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-[#7c3aed] flex items-center">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile"
                  className="w-full bg-transparent border-none py-2.5 px-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-slate-700" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-extrabold text-[#7c3aed] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative w-full border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#7c3aed]/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-[#7c3aed] flex items-center">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none py-2.5 px-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Tactile 3D Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] hover:brightness-105 disabled:opacity-60 text-white font-black text-sm py-3 rounded-2xl border-b-4 border-[#5b21b6] shadow-lg shadow-[#7c3aed]/25 active:border-b-0 active:translate-y-1 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="h-px bg-slate-200 flex-grow" />
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">or</span>
              <div className="h-px bg-slate-200 flex-grow" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335" />
                <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4" />
                <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05" />
                <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-5 text-center pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="font-black text-[#7c3aed] hover:underline ml-1">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full shrink-0 text-center text-[10px] font-bold text-slate-400 py-2">
        © 2026 nainixOne • Empowering Class 12 Scholars
      </footer>
    </div>
  );
}
