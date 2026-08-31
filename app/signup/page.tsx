'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { BrandLogo } from '@/components/BrandLogo';

export default function SignupPage() {
  const router = useRouter();
  const { setTargetBoard, signup } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [board, setBoard] = useState('cbse');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!contact.includes('@')) return setError('Please enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    const result = await signup(fullName.trim(), contact.trim().toLowerCase(), password, board);
    setLoading(false);
    if (result.success) {
      setTargetBoard(board);
      router.push('/');
    } else {
      setError(result.error || 'Account creation failed. Please try again.');
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

      {/* Main Glassmorphic Signup Card */}
      <main className="w-full max-w-md my-auto py-2">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          
          {/* Header Text */}
          <div className="text-center mb-5">
            <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Create Account
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Join nainixOne for Class 12 Board Prep
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-700" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative w-full border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#7c3aed]/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-[#7c3aed] flex items-center">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-transparent border-none py-2.5 px-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-700" htmlFor="contact">
                Email Address
              </label>
              <div className="relative w-full border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#7c3aed]/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-[#7c3aed] flex items-center">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <input
                  id="contact"
                  type="email"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-transparent border-none py-2.5 px-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Target Board Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-700" htmlFor="board">
                Target Board Exam
              </label>
              <div className="relative border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white flex items-center overflow-hidden focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#7c3aed]/15 transition-all shadow-2xs">
                <div className="pl-3.5 text-[#7c3aed] flex items-center">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <select
                  id="board"
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="appearance-none w-full bg-transparent border-none py-2.5 px-3 pr-8 text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
                >
                  <option value="cbse">CBSE Class 12</option>
                  <option value="bihar">Bihar State Board (BSEB)</option>
                  <option value="up">UP Board (UPMSP)</option>
                  <option value="icse">ICSE / ISC 12th</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-slate-700" htmlFor="password">
                Password
              </label>
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
                  placeholder="At least 6 characters"
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

            {/* Terms Checkbox */}
            <div className="flex items-center pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#7c3aed] focus:ring-[#7c3aed] cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-600 cursor-pointer">
                I agree to the <a href="#" className="text-[#7c3aed] font-extrabold hover:underline">Terms & Privacy</a>.
              </label>
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
              disabled={!agreedTerms || loading}
              className="w-full mt-1 bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] hover:brightness-105 disabled:opacity-50 text-white font-black text-sm py-3 rounded-2xl border-b-4 border-[#5b21b6] shadow-lg shadow-[#7c3aed]/25 active:border-b-0 active:translate-y-1 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-5 text-center pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-black text-[#7c3aed] hover:underline ml-1">
                Log In
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
