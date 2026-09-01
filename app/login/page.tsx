'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { BrandLogo } from '@/components/BrandLogo';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email or username and password.');
      return;
    }
    setError('');
    setLoading(true);
    playButtonClick();

    const result = await login(identifier.trim(), password);
    setLoading(false);

    if (result.success) {
      playGemDing();
      router.push('/');
    } else {
      setError(result.error || 'Invalid credentials. Please double check and try again.');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-x-hidden select-none">
      
      {/* ─── Ambient Glow Mesh Background ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
        {/* Subtle Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.35]" 
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* ─── Top Header with Brand Logo ─── */}
      <header className="w-full shrink-0 flex justify-between items-center max-w-md mx-auto py-2 z-20">
        <Link href="/" className="cursor-pointer active:scale-95 transition-transform flex items-center gap-2">
          <BrandLogo size="lg" />
        </Link>
        <Link
          href="/"
          onClick={playButtonClick}
          className="text-xs font-bold text-slate-600 hover:text-[#7c3aed] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-violet-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Home</span>
        </Link>
      </header>

      {/* ─── Main Professional Login Card ─── */}
      <main className="w-full max-w-[420px] my-auto py-4 flex flex-col items-center z-10">
        
        <div className="w-full bg-white rounded-[32px] border-2 border-slate-100 shadow-[0_20px_50px_rgba(124,58,237,0.08)] p-6 sm:p-8 relative">
          
          {/* Top Mascot Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-0.5 shadow-md flex items-center justify-center text-white relative">
                <img
                  src="/images/trophy_cat.png"
                  alt="Mascot"
                  className="w-10 h-10 object-contain drop-shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                  Welcome Back!
                </h1>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Sign in to keep your streak alive 🔥
                </p>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input 1: Email or Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Email or Username</span>
                <span className="text-[10px] text-slate-400 font-medium">Required</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 material-symbols-outlined text-[20px] pointer-events-none">
                  alternate_email
                </span>
                <input
                  type="text"
                  placeholder="e.g. rahul@gmail.com or rahul_99"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/70 border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset email sent to your address.')}
                  className="text-[11px] font-bold text-[#7c3aed] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 material-symbols-outlined text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-50/70 border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer flex items-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7c3aed] focus:ring-violet-500 border-slate-300 rounded-md cursor-pointer accent-[#7c3aed]"
                />
                <span className="text-xs font-bold text-slate-600">Remember on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] hover:from-[#6d28d9] hover:to-[#4c1d95] text-white font-heading font-black text-sm sm:text-base shadow-[0_8px_20px_rgba(124,58,237,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Learning Portal</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* ─── Divider ─── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ─── Social Single-Click Buttons ─── */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert('Google Sign-In integration ready.')}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Apple Sign-In integration ready.')}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 fill-black" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.38-.56.65-1.06 1.71-.93 2.74 1.04.08 2.07-.5 2.68-1.25z" />
              </svg>
              <span>Apple ID</span>
            </button>
          </div>

        </div>

      </main>

      {/* ─── Bottom Navigation Prompt ─── */}
      <footer className="w-full shrink-0 text-center py-3 z-20">
        <p className="text-xs font-bold text-slate-600">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/signup"
            onClick={playButtonClick}
            className="font-black text-[#7c3aed] hover:underline cursor-pointer"
          >
            Create Free Account (+50 💎)
          </Link>
        </p>
      </footer>

    </div>
  );
}
