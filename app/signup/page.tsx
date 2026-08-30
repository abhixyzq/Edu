'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function SignupPage() {
  const router = useRouter();
  const { setTargetBoard, login } = useUser();

  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [board, setBoard] = useState('cbse');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetBoard(board);
    login(fullName || 'Abhishek', contact);
    router.push('/');
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f4fafd] text-[#161d1f] flex flex-col justify-between items-center p-4 sm:p-6 font-sans selection:bg-[#ffdbc9] selection:text-[#6a2d00]">
      {/* Top Header */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-md mx-auto py-1">
        <Link href="/">
          <span className="font-heading text-2xl font-extrabold text-[#9b4500] tracking-tight">
            EduStride
          </span>
        </Link>
        <Link href="/" className="text-xs font-bold text-[#564338] hover:text-[#9b4500] flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
        </Link>
      </header>

      {/* Main Content directly on Screen (NO CARD CONTAINER) */}
      <main className="w-full max-w-md flex flex-col my-auto border-none bg-transparent shadow-none px-2 sm:px-0">
        
        {/* Header Text */}
        <div className="text-center mb-4">
          <h1 className="font-heading text-2xl font-extrabold text-[#161d1f]">
            Create Account
          </h1>
          <p className="text-xs text-[#564338] mt-1">
            Join EduStride Class 12 Board Prep
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#161d1f]" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Sharma"
              className="w-full bg-white border border-[#ddc1b3] rounded-2xl px-3.5 py-2.5 text-xs text-[#161d1f] placeholder:text-[#897266] outline-none focus:border-[#9b4500] shadow-xs"
            />
          </div>

          {/* Email or Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#161d1f]" htmlFor="contact">
              Email or Phone Number
            </label>
            <input
              id="contact"
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="rahul@example.com"
              className="w-full bg-white border border-[#ddc1b3] rounded-2xl px-3.5 py-2.5 text-xs text-[#161d1f] placeholder:text-[#897266] outline-none focus:border-[#9b4500] shadow-xs"
            />
          </div>

          {/* Select Target Board */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#161d1f]" htmlFor="board">
              Target Board Exam
            </label>
            <div className="relative">
              <select
                id="board"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="appearance-none w-full bg-white border border-[#ddc1b3] rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-[#161d1f] outline-none focus:border-[#9b4500] shadow-xs"
              >
                <option value="cbse">CBSE Class 12</option>
                <option value="bihar">Bihar State Board (BSEB)</option>
                <option value="up">UP Board (UPMSP)</option>
                <option value="icse">ICSE / ISC 12th</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#564338]">
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Create Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#161d1f]" htmlFor="password">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#ddc1b3] rounded-2xl px-3.5 py-2.5 pr-10 text-xs text-[#161d1f] placeholder:text-[#897266] outline-none focus:border-[#9b4500] shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#564338] hover:text-[#9b4500] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center pt-0.5">
            <input
              id="terms"
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 rounded border-[#ddc1b3] text-[#9b4500] focus:ring-[#9b4500] cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-xs text-[#564338] cursor-pointer">
              I agree to the <a href="#" className="text-[#9b4500] font-bold hover:underline">Terms & Privacy Policy</a>.
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={!agreedTerms}
            className="w-full bg-[#9b4500] hover:bg-[#ff8c42] disabled:opacity-50 text-white font-bold text-xs py-3 rounded-full transition-all shadow-md active:scale-[0.98] mt-1 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-4 text-center pt-3 border-t border-[#ddc1b3]/60">
          <p className="text-xs text-[#564338]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#9b4500] hover:underline ml-1">
              Login
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
