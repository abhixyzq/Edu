'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f4fafd] text-[#161d1f] flex flex-col justify-between items-center p-4 font-sans selection:bg-[#ffdbc9] selection:text-[#6a2d00]">
      {/* Top Header */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-sm mx-auto py-1.5">
        <Link href="/">
          <span className="font-heading text-2xl font-extrabold text-[#9b4500] tracking-tight">
            EduStride
          </span>
        </Link>
        <Link href="/" className="text-xs font-bold text-[#564338] hover:text-[#9b4500] flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
        </Link>
      </header>

      {/* Centered Borderless Card with Top Illustration Video */}
      <main className="w-full max-w-[420px] bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-[#9b4500]/5 flex flex-col my-auto border-none">
        
        {/* Top Animated Video Header (Full Width Seamless) */}
        <div className="w-full h-44 sm:h-52 mb-4 rounded-2xl overflow-hidden bg-[#e8ddcd] shrink-0 border-none relative flex items-center justify-center shadow-xs">
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

        {/* Header Text */}
        <div className="text-center mb-3">
          <h1 className="font-heading text-xl font-extrabold text-[#161d1f]">
            Welcome Back
          </h1>
          <p className="text-[11px] text-[#564338] mt-0.5">
            Sign in to continue your preparation
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {/* Email or Phone */}
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-bold text-[#161d1f]" htmlFor="identifier">
              Email or Phone Number
            </label>
            <div className="relative w-full border border-[#ddc1b3]/80 rounded-xl bg-white flex items-center overflow-hidden focus-within:border-[#9b4500] transition-all">
              <div className="pl-3 text-[#9b4500] flex items-center">
                <span className="material-symbols-outlined text-[17px]">person</span>
              </div>
              <input
                id="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone"
                className="w-full bg-transparent border-none py-2 px-2.5 text-xs text-[#161d1f] placeholder:text-[#897266] outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#161d1f]" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-[11px] font-bold text-[#9b4500] hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative w-full border border-[#ddc1b3]/80 rounded-xl bg-white flex items-center overflow-hidden focus-within:border-[#9b4500] transition-all">
              <div className="pl-3 text-[#9b4500] flex items-center">
                <span className="material-symbols-outlined text-[17px]">lock</span>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none py-2 px-2.5 text-xs text-[#161d1f] placeholder:text-[#897266] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 flex items-center text-[#564338] hover:text-[#9b4500] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#9b4500] hover:bg-[#ff8c42] text-white font-bold text-xs py-2.5 rounded-full transition-all shadow-xs active:scale-[0.98] mt-0.5 cursor-pointer"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-0.5">
            <div className="h-px bg-[#ddc1b3]/60 flex-grow" />
            <span className="text-[10px] text-[#564338] uppercase font-bold tracking-wider">or</span>
            <div className="h-px bg-[#ddc1b3]/60 flex-grow" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full bg-white border border-[#ddc1b3]/80 text-[#161d1f] font-bold text-xs py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#f4fafd] transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
              <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335" />
              <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4" />
              <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05" />
              <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853" />
            </svg>
            Login with Google
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-3 text-center pt-2 border-t border-[#dde4e6]">
          <p className="text-[11px] text-[#564338]">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-[#9b4500] hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full shrink-0 text-center text-[10px] text-[#897266] py-1">
        © 2026 EduStride PrepMaster
      </footer>
    </div>
  );
}
