'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTargetBoard, setClassLevel, signup, addGems } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [contact, setContact] = useState('');
  const [classLevel, setClassLevelState] = useState('Class 12');
  const [board, setBoard] = useState('cbse');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Referral code from URL (?ref=username)
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setRefCode(ref.toLowerCase().trim().replace(/[^a-z0-9_]/g, ''));
    }
  }, [searchParams]);

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
      setClassLevel(classLevel);

      // If signed up via referral, grant bonus gems!
      if (refCode) {
        addGems(50); // New user gets 50 Gems
        // Award referral count to local state if on same device or notify
        try {
          const currentCount = parseInt(localStorage.getItem('edustride_referral_count') || '0', 10);
          localStorage.setItem('edustride_referral_count', (currentCount + 1).toString());
        } catch (e) {
          // ignore
        }
      }

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
            <div className="w-18 h-18 rounded-full bg-[#7c3aed] border-[3px] border-slate-900 flex items-center justify-center text-white shadow-sm mb-3 relative overflow-hidden">
              <span className="material-symbols-outlined text-[44px] text-white">person_add</span>
              <div className="absolute top-1 left-2 w-14 h-7 bg-white/20 rounded-t-full pointer-events-none" />
            </div>

            {/* 🎁 Referral Invitation Banner */}
            {refCode && (
              <div className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-2 border-slate-900 shadow-xs flex items-center gap-2.5 animate-bounce">
                <span className="text-2xl shrink-0">🎁</span>
                <div className="min-w-0">
                  <p className="text-xs font-black leading-tight truncate">
                    Invited by @{refCode}!
                  </p>
                  <p className="text-[10px] text-cyan-100 font-bold">
                    You + @{refCode} will both get <b>+50 Free Gems 💎</b>!
                  </p>
                </div>
              </div>
            )}

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
                  <span className="text-xs font-black tracking-wide">NAME</span>
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Abhishek Kumar"
                  className="w-full h-full px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                />
              </div>

              {/* Capsule Input 2: Instagram-style Unique @username */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#6d28d9] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                  <span className="text-xs font-black tracking-wide">HANDLE</span>
                </div>
                <div className="flex items-center w-full px-3.5">
                  <span className="text-xs font-black text-[#7c3aed] mr-1">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsernameTouched(true);
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20));
                    }}
                    placeholder="unique_username"
                    className="w-full h-full text-xs sm:text-sm font-bold text-[#6d28d9] placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                  />
                </div>
              </div>

              {/* Capsule Input 3: Email */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span className="text-xs font-black tracking-wide">EMAIL</span>
                </div>
                <input
                  type="email"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full h-full px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                />
              </div>

              {/* Capsule Input 4: Class / Grade Selector */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span className="text-xs font-black tracking-wide">CLASS</span>
                </div>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevelState(e.target.value)}
                  className="w-full h-full px-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden bg-transparent cursor-pointer"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="JEE Main / Adv">JEE Main / Adv</option>
                  <option value="NEET UG">NEET UG</option>
                </select>
              </div>

              {/* Capsule Input 5: Target Board Selector */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all">
                <div className="w-22 sm:w-26 h-full bg-[#6d28d9] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span className="text-xs font-black tracking-wide">BOARD</span>
                </div>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full h-full px-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden bg-transparent cursor-pointer"
                >
                  <option value="cbse">CBSE Board</option>
                  <option value="bseb">Bihar Board (BSEB)</option>
                  <option value="up">UP Board</option>
                  <option value="icse">ICSE / ISC Board</option>
                  <option value="state">Other State Board</option>
                </select>
              </div>

              {/* Capsule Input 5: Password */}
              <div className="w-full h-12 rounded-full border-2 border-slate-900 bg-white flex items-center overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-violet-500/20 transition-all relative">
                <div className="w-22 sm:w-26 h-full bg-[#7c3aed] border-r-2 border-slate-900 flex items-center justify-center gap-1 text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span className="text-xs font-black tracking-wide">PASS</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full h-full px-3.5 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-center gap-2 px-1 cursor-pointer select-none mt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-2 border-slate-900 text-[#7c3aed] focus:ring-[#7c3aed] accent-[#7c3aed]"
                />
                <span className="text-[11px] font-semibold text-slate-600">
                  I agree to Practice Rules & Academic Integrity
                </span>
              </label>

              {/* ─── Big 3D Duolingo Action Button (Brand Purple Theme) ─── */}
              <button
                type="submit"
                disabled={loading || !agreedTerms}
                className="w-full mt-2 py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-black text-sm tracking-wider uppercase rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] active:translate-y-1 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Start Practicing</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>

            </form>

            {/* Already have an account link */}
            <div className="mt-4 pt-3 border-t-2 border-slate-100 w-full text-center">
              <p className="text-xs font-bold text-slate-500">
                Already registered?{' '}
                <Link
                  href="/login"
                  onClick={playButtonClick}
                  className="font-black text-[#7c3aed] hover:underline"
                >
                  Log In here
                </Link>
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full text-center py-2 text-[11px] font-bold text-slate-400 shrink-0">
        All Classes (9th - 12th & Beyond) • CBSE • BSEB • UP • ICSE • State Boards
      </footer>

    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><span className="text-xs font-bold text-slate-500">Loading...</span></div>}>
      <SignupForm />
    </Suspense>
  );
}
