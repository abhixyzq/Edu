'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

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
      className="min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans relative overflow-hidden select-none bg-[#09111e] bg-cover bg-top sm:bg-center"
      style={{
        backgroundImage: `url('/images/night_brick_sconce_bg.jpg')`,
      }}
    >
      
      {/* ─── Top Back Navigation ─── */}
      <header className="absolute top-4 left-4 z-30">
        <Link
          href="/login"
          onClick={playButtonClick}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
      </header>

      {/* ─── Main Frosted Glassmorphism Card (Positioned in Light Beam) ─── */}
      <main className="w-full max-w-[340px] sm:max-w-[370px] relative z-20 mt-32 sm:mt-36 my-6">
        <div 
          className="w-full rounded-[30px] p-6 sm:p-8 backdrop-blur-md border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(254,240,138,0.12)] flex flex-col items-center"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(13, 27, 49, 0.6) 100%)',
          }}
        >
          
          {/* Card Title */}
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide text-center mb-1 drop-shadow-md">
            Reset Password
          </h1>
          <p className="text-[11px] font-medium text-amber-200/90 mb-5 text-center leading-relaxed">
            {sent 
              ? 'Password reset instructions have been sent.' 
              : 'Enter your email and we’ll send you a recovery link.'
            }
          </p>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs font-semibold text-center backdrop-blur-md">
              {error}
            </div>
          )}

          {/* ─── Success Sent State ─── */}
          {sent ? (
            <div className="w-full space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mx-auto flex items-center justify-center shadow-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed px-2">
                We sent a password recovery link to <span className="font-bold text-white underline">{email}</span>. Please check your inbox and spam folder.
              </p>

              <Link
                href="/login"
                onClick={playButtonClick}
                className="w-full mt-3 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#09111e] font-heading font-black text-sm sm:text-base shadow-[0_8px_25px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
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
                  className="w-full pl-5 pr-11 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 material-symbols-outlined text-[20px] pointer-events-none">
                  mail
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#09111e] font-heading font-black text-sm sm:text-base shadow-[0_8px_25px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-[#09111e] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          {!sent && (
            <div className="mt-6 text-center">
              <p className="text-xs text-white/85">
                Remember your password?{' '}
                <Link
                  href="/login"
                  onClick={playButtonClick}
                  className="font-black text-white hover:underline cursor-pointer"
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
