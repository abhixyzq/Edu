'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { playButtonClick } from '@/lib/soundEffects';
import { slideVariants } from './slideVariants';

interface SignupFormProps {
  slideDirection: number;
  signupStep: 1 | 2;
  setSignupStep: (s: 1 | 2) => void;
  fullName: string;
  signupUsername: string;
  setSignupUsername: (v: string) => void;
  setUsernameTouched: (v: boolean) => void;
  contact: string;
  setContact: (v: string) => void;
  classLevelVal: string;
  setClassLevelState: (v: string) => void;
  boardVal: string;
  setBoardState: (v: string) => void;
  signupPassword: string;
  setSignupPassword: (v: string) => void;
  showSignupPassword: boolean;
  setShowSignupPassword: (v: boolean) => void;
  agreedTerms: boolean;
  setAgreedTerms: (v: boolean) => void;
  refCode: string | null;
  loading: boolean;
  onNameChange: (v: string) => void;
  onNextStep: (e: React.FormEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({
  slideDirection,
  signupStep,
  setSignupStep,
  fullName,
  signupUsername,
  setSignupUsername,
  setUsernameTouched,
  contact,
  setContact,
  classLevelVal,
  setClassLevelState,
  boardVal,
  setBoardState,
  signupPassword,
  setSignupPassword,
  showSignupPassword,
  setShowSignupPassword,
  agreedTerms,
  setAgreedTerms,
  refCode,
  loading,
  onNameChange,
  onNextStep,
  onSubmit,
  onSwitchToLogin,
}: SignupFormProps) {
  return (
    <motion.div
      key="signup-form"
      custom={slideDirection}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        if (offset.x > 40 || swipe > 200) {
          onSwitchToLogin();
        }
      }}
      className="w-full flex flex-col items-center touch-pan-y"
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <div className={`w-6 h-1 rounded-full transition-all ${signupStep === 1 ? 'bg-[#7c3aed]' : 'bg-slate-200'}`} />
          <div className={`w-6 h-1 rounded-full transition-all ${signupStep === 2 ? 'bg-[#7c3aed]' : 'bg-slate-200'}`} />
        </div>
        <h1 className="font-heading font-black text-xl text-slate-900 tracking-tight text-center">
          {signupStep === 1 ? 'Create Account' : 'Choose Goal'}
        </h1>
        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
          {signupStep === 1
            ? (refCode ? `🎁 +50 Gems from @${refCode}` : 'Join thousands of scholars')
            : 'Select target class & set password'}
        </p>
      </div>

      {signupStep === 1 ? (
        /* ─── Step 1: Name, Username, Email ─── */
        <form onSubmit={onNextStep} className="w-full space-y-2.5">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
              required
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px] pointer-events-none">
              person
            </span>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => {
                setUsernameTouched(true);
                setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
              }}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
              required
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px] pointer-events-none">
              alternate_email
            </span>
          </div>

          <div className="relative w-full">
            <input
              type="email"
              placeholder="Email Address"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
              required
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px] pointer-events-none">
              mail
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-1.5 py-3 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-purple-500/20 border-b-4 border-[#5b21b6] active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>
      ) : (
        /* ─── Step 2: Class, Board, Password, Terms ─── */
        <form onSubmit={onSubmit} className="w-full space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={classLevelVal}
                onChange={(e) => setClassLevelState(e.target.value)}
                className="w-full pl-3 pr-7 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold outline-none focus:border-[#7c3aed] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Class 12">Class 12</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[16px] pointer-events-none">
                expand_more
              </span>
            </div>

            <div className="relative">
              <select
                value={boardVal}
                onChange={(e) => setBoardState(e.target.value)}
                className="w-full pl-3 pr-7 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold outline-none focus:border-[#7c3aed] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
                <option value="state">State Board</option>
                <option value="jee">JEE Main</option>
                <option value="neet">NEET UG</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[16px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="relative w-full">
            <input
              type={showSignupPassword ? 'text' : 'password'}
              placeholder="Password (min. 6 chars)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
              required
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showSignupPassword ? 'visibility_off' : 'lock'}
              </span>
            </button>
          </div>

          <div className="w-full flex items-center text-xs pt-0.5 px-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-slate-300 text-[#7c3aed] focus:ring-purple-500 accent-[#7c3aed] cursor-pointer"
              />
              <span className="text-[10px] font-bold text-slate-600">
                Agree to Terms &amp; Privacy
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setSignupStep(1);
              }}
              className="py-2.5 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all active:scale-95 cursor-pointer"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-purple-500/20 border-b-4 border-[#5b21b6] active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Register</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Swipe Hint */}
      <div className="mt-3 text-center flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
        <span>Swipe right or</span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-black text-[#7c3aed] hover:underline cursor-pointer ml-0.5"
        >
          ← Login
        </button>
      </div>
    </motion.div>
  );
}
