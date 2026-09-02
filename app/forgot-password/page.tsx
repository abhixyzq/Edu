'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';
import { BrandLogo } from '@/components/BrandLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }

    setError('');
    setLoading(true);
    playButtonClick();

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login`,
      });

      setLoading(false);

      if (resetErr) {
        // Even if user not found in supabase auth, show success for security best practices or show note
        console.warn('Reset note:', resetErr.message);
      }

      playGemDing();
      setSent(true);
    } catch (err: any) {
      setLoading(false);
      setSent(true); // Graceful recovery UX
    }
  };

  return (
    <div 
      className="min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans relative overflow-hidden select-none bg-[#faf6f0]"
      style={{
        backgroundImage: 'radial-gradient(#e5dec9 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      
      {/* ─── Top Back Navigation ─── */}
      <header className="absolute top-4 left-4 z-30 flex items-center gap-2.5">
        <Link
          href="/login"
          onClick={playButtonClick}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <Link href="/" onClick={playButtonClick} className="cursor-pointer active:scale-95 transition-transform">
          <BrandLogo size="md" />
        </Link>
      </header>

      {/* ─── Main App Theme Card ─── */}
      <main className="w-full max-w-[340px] sm:max-w-[370px] relative z-20 my-auto pt-6">
        <div className="w-full bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center">
          
          {/* Brand Logo & Icon Header */}
          <div className="flex flex-col items-center mb-4">
            <BrandLogo size="lg" className="mb-3" />
            <span className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7c3aed] flex items-center justify-center mb-2 shadow-inner">
              <span className="material-symbols-outlined text-[26px]">lock_reset</span>
            </span>
            <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight text-center">
              Reset Password
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 text-center leading-relaxed">
              {sent 
                ? 'Instructions sent to your email.' 
                : 'Enter your email to receive a recovery link.'
              }
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* ─── Success Sent State ─── */}
          {sent ? (
            <div className="w-full space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed px-2 font-medium">
                We sent a recovery link to <span className="font-bold text-slate-900 underline">{email}</span>. Please check your inbox and spam folder.
              </p>

              <Link
                href="/login"
                onClick={playButtonClick}
                className="w-full mt-3 py-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-sm sm:text-base shadow-lg shadow-purple-500/20 border-b-4 border-[#5b21b6] active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* ─── Reset Form ─── */
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              {/* Field: Email */}
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="Registered Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px] pointer-events-none">
                  mail
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-heading font-black text-sm sm:text-base shadow-lg shadow-purple-500/20 border-b-4 border-[#5b21b6] active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          {!sent && (
            <div className="mt-5 text-center">
              <p className="text-xs font-medium text-slate-500">
                Remember your password?{' '}
                <Link
                  href="/login"
                  onClick={playButtonClick}
                  className="font-black text-[#7c3aed] hover:underline cursor-pointer"
                >
                  Login
                </Link>
              </p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
