'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { playButtonClick } from '@/lib/soundEffects';
import { slideVariants } from './slideVariants';

interface LoginFormProps {
  slideDirection: number;
  identifier: string;
  setIdentifier: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({
  slideDirection,
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  onSubmit,
  onSwitchToSignup,
}: LoginFormProps) {
  return (
    <motion.div
      key="login-form"
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
        if (offset.x < -40 || swipe < -200) {
          onSwitchToSignup();
        }
      }}
      className="w-full flex flex-col items-center touch-pan-y"
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-3">
        <span className="w-11 h-11 rounded-2xl bg-purple-100 text-[#7c3aed] flex items-center justify-center mb-1 shadow-inner">
          <span className="material-symbols-outlined text-[24px]">lock_open</span>
        </span>
        <h1 className="font-heading font-black text-xl text-slate-900 tracking-tight text-center">
          Welcome Back!
        </h1>
        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
          Log in to continue your streak 🔥
        </p>
      </div>

      <form onSubmit={onSubmit} className="w-full space-y-3">
        {/* Username */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
            required
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px] pointer-events-none">
            person
          </span>
        </div>

        {/* Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showPassword ? 'visibility_off' : 'lock'}
            </span>
          </button>
        </div>

        {/* Options Row */}
        <div className="w-full flex items-center justify-between text-xs pt-0.5 px-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border border-slate-300 text-[#7c3aed] focus:ring-purple-500 accent-[#7c3aed] cursor-pointer"
            />
            <span className="text-[10.5px] font-bold text-slate-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            onClick={playButtonClick}
            className="text-[10.5px] font-bold text-[#7c3aed] hover:underline cursor-pointer"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1.5 py-3 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-purple-500/20 border-b-4 border-[#5b21b6] active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      {/* Swipe Hint */}
      <div className="mt-3.5 text-center flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
        <span>Swipe left or</span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-black text-[#7c3aed] hover:underline cursor-pointer ml-0.5"
        >
          Register Free →
        </button>
      </div>
    </motion.div>
  );
}
