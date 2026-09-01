'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

export default function SignupPage() {
  const router = useRouter();
  const { setTargetBoard, signup } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [contact, setContact] = useState('');
  const [board, setBoard] = useState('cbse');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (!usernameTouched) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '_').slice(0, 15);
      setUsername(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    playButtonClick();

    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!username.trim() || username.length < 3) return setError('Username must be 3-20 characters.');
    if (!contact.includes('@')) return setError('Please enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    
    setLoading(true);
    const cleanUser = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const result = await signup(fullName.trim(), contact.trim().toLowerCase(), password, board, cleanUser);
    setLoading(false);

    if (result.success) {
      setTargetBoard(board);
      playGemDing();
      router.push('/');
    } else {
      setError(result.error || 'Account creation failed. Please try again.');
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

      {/* ─── Main Interactive Graphic Registration Window ─── */}
      <main className="w-full max-w-md my-auto py-6 relative flex flex-col items-center justify-center z-10">
        
        {/* Soft Organic Cloud / Blob Background (Brand Violet Theme) */}
        <div className="absolute -inset-4 sm:-inset-8 bg-[#ede9fe]/80 rounded-[60px] transform rotate-1 pointer-events-none -z-10 blur-xs" />

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
            <span className="material-symbols-outlined text-[28px] text-[#7c3aed] font-bold">school</span>
            {/* Thread Base */}
            <div className="absolute -bottom-2 w-5 h-2 bg-[#7c3aed] border border-slate-900 rounded-b-sm" />
          </div>
        </div>

        {/* ─── The Main Browser Registration Window ─── */}
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
              nainixOne • Scholar Registration
            </span>

            <div className="w-12" />
          </div>

          {/* 2. Window Content Body */}
          <div className="p-5 sm:p-7 flex flex-col items-center">
            
            {/* User Icon Circle (Brand Purple Theme) */}
            <div className="w-18 h-18 rounded-full bg-[#7c3aed] border-[3px] border-slate-900 flex items-center justify-center text-white shadow-sm mb-4 relative overflow-hidden">
              <span className="material-symbols-outlined text-[44px] text-white">person_add</span>
              <div className="absolute top-1 left-2 w-14 h-7 bg-white/20 rounded-t-full pointer-events-none" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-3 bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              
              {/* Capsule Input 1: Full Name */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span className="text-[10px] font-black tracking-tight">NAME</span>
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full h-full bg-transparent px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Capsule Input: Unique Handle @username */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="text-xs font-black">@</span>
                  <span className="text-[10px] font-black tracking-tight">HANDLE</span>
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsernameTouched(true);
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                  }}
                  placeholder="rahul_12"
                  maxLength={20}
                  className="w-full h-full bg-transparent px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Capsule Input 2: Email Address */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span className="text-[10px] font-black tracking-tight">EMAIL</span>
                </div>
                <input
                  id="contact"
                  type="email"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full h-full bg-transparent px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Capsule Input 3: Target Board */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all relative">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span className="text-[10px] font-black tracking-tight">BOARD</span>
                </div>
                <select
                  id="board"
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full h-full bg-transparent px-3.5 pr-8 text-xs sm:text-sm font-extrabold text-slate-800 outline-none appearance-none cursor-pointer"
                >
                  <option value="cbse">CBSE Class 12</option>
                  <option value="bihar">Bihar Board (BSEB)</option>
                  <option value="up">UP Board (UPMSP)</option>
                  <option value="icse">ICSE / ISC 12th</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>

              {/* Capsule Input 4: Password */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span className="text-[10px] font-black tracking-tight">PASS</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-full bg-transparent px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none tracking-widest"
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

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1 px-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-slate-900 text-[#7c3aed] focus:ring-[#7c3aed] cursor-pointer accent-[#7c3aed]"
                />
                <label htmlFor="terms" className="text-[11px] font-bold text-slate-600 cursor-pointer">
                  I agree to the <span className="text-[#7c3aed] font-black underline">Terms & Conditions</span>
                </label>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={!agreedTerms || loading}
                className="w-full mt-1 h-12 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_#0f172a] active:shadow-none active:translate-y-1 transition-all duration-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  </>
                )}
              </button>

            </form>

            {/* Login Navigation Link */}
            <div className="mt-4 text-center pt-3 border-t border-slate-100 w-full">
              <p className="text-xs font-bold text-slate-500">
                Already have an account?{' '}
                <Link
                  href="/login"
                  onClick={playButtonClick}
                  className="font-black text-[#7c3aed] hover:underline ml-1"
                >
                  Log In
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* ─── Bottom Interlocking Mechanical Gears (Brand Purple Theme) ─── */}
        <div className="relative w-full max-w-[280px] h-12 -mt-3 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-[#7c3aed] border-2 border-slate-900 flex items-center justify-center shadow-md animate-spin-slow">
            <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-900" />
          </div>

          <div className="w-10 h-10 -ml-2 -mt-4 rounded-full bg-[#8b5cf6] border-2 border-slate-900 flex items-center justify-center shadow-md animate-spin-reverse-slow">
            <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-900" />
          </div>

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
