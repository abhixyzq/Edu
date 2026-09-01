'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
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
    if (!agreedTerms) return setError('Please agree to Terms of Service.');
    
    setLoading(true);
    const cleanUser = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const result = await signup(fullName.trim(), contact.trim().toLowerCase(), password, board, cleanUser);
    setLoading(false);

    if (result.success) {
      setTargetBoard(board);
      setClassLevel(classLevel);

      // If signed up via referral, grant bonus gems!
      if (refCode) {
        addGems(50);
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
    <div 
      className="min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans relative overflow-hidden select-none bg-[#09111e] bg-cover bg-top sm:bg-center"
      style={{
        backgroundImage: `url('/images/night_brick_sconce_bg.jpg')`,
      }}
    >
      
      {/* ─── Top Back Navigation ─── */}
      <header className="absolute top-4 left-4 z-30">
        <Link
          href="/"
          onClick={playButtonClick}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
      </header>

      {/* ─── Main Frosted Glassmorphic Register Card (Positioned in Light Beam) ─── */}
      <main className="w-full max-w-[360px] sm:max-w-[400px] relative z-20 mt-28 sm:mt-32 my-6">
        <div 
          className="w-full rounded-[30px] p-6 sm:p-7 backdrop-blur-md border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(254,240,138,0.12)] flex flex-col items-center"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(13, 27, 49, 0.6) 100%)',
          }}
        >
          
          {/* Card Title */}
          <h1 className="font-heading font-black text-3xl text-white tracking-wide text-center mb-1 drop-shadow-md">
            Register
          </h1>
          <p className="text-[11px] font-medium text-amber-200/90 mb-5 text-center">
            {refCode ? `🎁 Referred by @${refCode}! +50 Gems bonus` : '✨ Start your learning adventure today'}
          </p>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs font-semibold text-center backdrop-blur-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            
            {/* Field 1: Full Name */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full pl-5 pr-11 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 material-symbols-outlined text-[20px] pointer-events-none">
                person
              </span>
            </div>

            {/* Field 2: Username */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Username (e.g. rahul_99)"
                value={username}
                onChange={(e) => {
                  setUsernameTouched(true);
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                }}
                className="w-full pl-5 pr-11 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 material-symbols-outlined text-[20px] pointer-events-none">
                alternate_email
              </span>
            </div>

            {/* Field 3: Email */}
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Email Address"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full pl-5 pr-11 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 material-symbols-outlined text-[20px] pointer-events-none">
                mail
              </span>
            </div>

            {/* Field 4: Class & Board Selector */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevelState(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 rounded-full bg-[#0d1e38]/80 border border-white/30 text-white text-xs font-semibold outline-none focus:border-white transition-all appearance-none cursor-pointer backdrop-blur-sm"
                >
                  <option value="Class 12" className="bg-[#0d1e38] text-white">Class 12</option>
                  <option value="Class 11" className="bg-[#0d1e38] text-white">Class 11</option>
                  <option value="Class 10" className="bg-[#0d1e38] text-white">Class 10</option>
                  <option value="Class 9" className="bg-[#0d1e38] text-white">Class 9</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 material-symbols-outlined text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 rounded-full bg-[#0d1e38]/80 border border-white/30 text-white text-xs font-semibold outline-none focus:border-white transition-all appearance-none cursor-pointer backdrop-blur-sm"
                >
                  <option value="cbse" className="bg-[#0d1e38] text-white">CBSE Board</option>
                  <option value="icse" className="bg-[#0d1e38] text-white">ICSE Board</option>
                  <option value="state" className="bg-[#0d1e38] text-white">State Board</option>
                  <option value="jee" className="bg-[#0d1e38] text-white">JEE Main/Adv</option>
                  <option value="neet" className="bg-[#0d1e38] text-white">NEET UG</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 material-symbols-outlined text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Field 5: Password */}
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-5 pr-11 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/70 text-xs sm:text-sm font-medium outline-none focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/25 transition-all backdrop-blur-sm shadow-inner"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/85 hover:text-white cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? 'visibility_off' : 'lock'}
                </span>
              </button>
            </div>

            {/* Terms agreement checkbox */}
            <div className="w-full flex items-center text-xs text-white/90 pt-0.5 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border border-white/50 bg-white/10 accent-white cursor-pointer"
                />
                <span className="text-[11px] font-medium text-white/85">
                  I agree to the Terms of Service & Privacy
                </span>
              </label>
            </div>

            {/* ─── High Contrast Pure White Pill Register Button ─── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#09111e] font-heading font-black text-sm sm:text-base shadow-[0_8px_25px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#09111e] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-white/85">
              Already have an account?{' '}
              <Link
                href="/login"
                onClick={playButtonClick}
                className="font-black text-white hover:underline cursor-pointer"
              >
                Login
              </Link>
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#09111e]">
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
