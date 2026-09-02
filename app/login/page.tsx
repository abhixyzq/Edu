'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';
import { BrandLogo } from '@/components/BrandLogo';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 140 : -140,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 340, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 140 : -140,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring', stiffness: 340, damping: 30 },
      opacity: { duration: 0.15 },
    },
  }),
};

function LoginFormContent({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, setTargetBoard, setClassLevel, addGems } = useUser();

  // Mode & sliding state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Sync mode with search param ?mode=signup
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' && authMode !== 'signup') {
      setSlideDirection(1);
      setAuthMode('signup');
    } else if (modeParam === 'login' && authMode !== 'login') {
      setSlideDirection(-1);
      setAuthMode('login');
    }
  }, [searchParams]);

  const switchMode = (newMode: 'login' | 'signup') => {
    if (newMode === authMode) return;
    playButtonClick();
    setError('');
    setSlideDirection(newMode === 'signup' ? 1 : -1);
    setAuthMode(newMode);
  };

  // Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Signup State
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [contact, setContact] = useState('');
  const [classLevelVal, setClassLevelState] = useState('Class 12');
  const [boardVal, setBoardState] = useState('cbse');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [refCode, setRefCode] = useState<string | null>(null);

  // General Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setRefCode(ref.toLowerCase().trim().replace(/[^a-z0-9_]/g, ''));
    }
  }, [searchParams]);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const loginSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAbout = () => {
    playButtonClick();
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (!usernameTouched) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '_').slice(0, 15);
      setSignupUsername(generated);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your username and password.');
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
      setError(result.error || 'Invalid username or password.');
    }
  };

  // Handle Signup Next Step
  const handleSignupNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    playButtonClick();

    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!signupUsername.trim() || signupUsername.length < 3) return setError('Username must be 3-20 characters.');
    if (!contact.includes('@')) return setError('Please enter a valid email address.');

    setSignupStep(2);
  };

  // Handle Signup Final Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    playButtonClick();

    if (signupPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (!agreedTerms) return setError('Please agree to Terms of Service.');
    
    setLoading(true);
    const cleanUser = signupUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const result = await signup(fullName.trim(), contact.trim().toLowerCase(), signupPassword, boardVal, cleanUser);
    setLoading(false);

    if (result.success) {
      setTargetBoard(boardVal);
      setClassLevel(classLevelVal);

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
    <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory overscroll-y-contain scroll-smooth font-sans select-none bg-[#faf6f0]">
      
      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 1: nainixOne App Signature Sliding Auth Screen
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={loginSectionRef}
        className="h-[100dvh] w-full shrink-0 snap-start snap-always flex flex-col justify-between items-center p-4 relative overflow-hidden bg-[#faf6f0]"
        style={{
          backgroundImage: 'radial-gradient(#e5dec9 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          scrollSnapStop: 'always',
        }}
      >
        {/* Top Navigation */}
        <header className="w-full shrink-0 flex justify-between items-center max-w-sm mx-auto pt-2 z-30">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              onClick={playButtonClick}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <Link href="/" onClick={playButtonClick} className="cursor-pointer active:scale-95 transition-transform">
              <BrandLogo size="md" />
            </Link>
          </div>
          
          <button
            type="button"
            onClick={scrollToAbout}
            className="text-[11px] font-black text-[#7c3aed] bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore Showcase</span>
            <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
          </button>
        </header>

        {/* Main Sliding App Theme Auth Card */}
        <main className="w-full max-w-[345px] sm:max-w-[375px] relative z-20 my-auto">
          <div className="w-full bg-white rounded-[32px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center overflow-hidden">
            
            {/* ─── Brand Logo inside Card Header ─── */}
            <div className="mb-3.5 flex flex-col items-center">
              <BrandLogo size="lg" />
            </div>

            {/* ─── Segmented Slide Switcher Tab ─── */}
            <div className="w-full p-1 bg-slate-100 rounded-2xl flex items-center relative mb-4">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`relative z-10 flex-1 py-2 text-xs font-black transition-colors text-center cursor-pointer ${
                  authMode === 'login' ? 'text-[#7c3aed]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
                {authMode === 'login' && (
                  <motion.div
                    layoutId="activeAuthPill"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`relative z-10 flex-1 py-2 text-xs font-black transition-colors text-center cursor-pointer ${
                  authMode === 'signup' ? 'text-[#7c3aed]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Register
                {authMode === 'signup' && (
                  <motion.div
                    layoutId="activeAuthPill"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            </div>

            {/* Error Message Banner */}
            {error && (
              <div className="w-full mb-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* ─── Swipeable & Animated Sliding Container ─── */}
            <div className="w-full overflow-hidden relative">
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                
                {/* ═══════════ LOGIN VIEW ═══════════ */}
                {authMode === 'login' ? (
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
                        switchMode('signup');
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

                    <form onSubmit={handleLoginSubmit} className="w-full space-y-3">
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

                      {/* Options */}
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

                      {/* Login Button */}
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

                    {/* Slide Helper Hint */}
                    <div className="mt-3.5 text-center flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
                      <span>Swipe left or</span>
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="font-black text-[#7c3aed] hover:underline cursor-pointer ml-0.5"
                      >
                        Register Free →
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ═══════════ SIGNUP VIEW ═══════════ */
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
                        switchMode('login');
                      }
                    }}
                    className="w-full flex flex-col items-center touch-pan-y"
                  >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-6 h-1 rounded-full transition-all ${
                          signupStep === 1 ? 'bg-[#7c3aed]' : 'bg-slate-200'
                        }`} />
                        <div className={`w-6 h-1 rounded-full transition-all ${
                          signupStep === 2 ? 'bg-[#7c3aed]' : 'bg-slate-200'
                        }`} />
                      </div>
                      <h1 className="font-heading font-black text-xl text-slate-900 tracking-tight text-center">
                        {signupStep === 1 ? 'Create Account' : 'Choose Goal'}
                      </h1>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {signupStep === 1 
                          ? (refCode ? `🎁 +50 Gems from @${refCode}` : 'Join thousands of scholars')
                          : 'Select target class & set password'
                        }
                      </p>
                    </div>

                    {signupStep === 1 ? (
                      /* Step 1 Form */
                      <form onSubmit={handleSignupNextStep} className="w-full space-y-2.5">
                        <div className="relative w-full">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => handleNameChange(e.target.value)}
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
                      /* Step 2 Form */
                      <form onSubmit={handleSignupSubmit} className="w-full space-y-2.5">
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
                              Agree to Terms & Privacy
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

                    {/* Slide Helper Hint */}
                    <div className="mt-3 text-center flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
                      <span>Swipe right or</span>
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="font-black text-[#7c3aed] hover:underline cursor-pointer ml-0.5"
                      >
                        ← Login
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </main>

        {/* ─── Pull Indicator ─── */}
        <footer className="w-full shrink-0 flex flex-col items-center pb-3 pt-2 z-20">
          <button
            type="button"
            onClick={scrollToAbout}
            aria-label="View Showcase"
            className="p-2 flex items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 group-active:scale-95 transition-all shadow-2xs" />
          </button>
        </footer>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 2: Ultra-Premium Dribbble/Stripe Quality Showcase
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        ref={showcaseRef}
        className="min-h-[100dvh] w-full shrink-0 snap-start snap-always bg-[#0f1d30] text-slate-900 overflow-y-auto py-6 px-3 sm:px-8 relative"
        style={{
          scrollSnapStop: 'always',
        }}
      >
        {/* Main Canvas Deck */}
        <div className="max-w-[500px] sm:max-w-[580px] mx-auto bg-[#eef5fc] rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 relative">
          
          {/* ─── 1. Ultra-Modern Big Digital Clock Deck ─── */}
          <div className="w-full bg-gradient-to-b from-[#091526] via-[#0d1f38] to-[#122844] pt-6 px-4 pb-5 relative overflow-hidden flex flex-col items-center justify-center text-white border-b border-white/10 shadow-inner">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-20 bg-cyan-400/20 blur-2xl pointer-events-none" />

            {/* Top Status & Date Header */}
            <div className="flex items-center justify-between w-full max-w-[360px] mb-3 px-2 z-10">
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Live Focus Clock
              </span>
              <span className="text-[10px] font-bold text-slate-300 tracking-wide">
                {time ? time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Live Clock'}
              </span>
            </div>

            {/* Big Digital Clock Display Box */}
            <div className="w-full max-w-[370px] bg-black/45 backdrop-blur-xl border-2 border-white/15 rounded-[26px] p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(56,189,248,0.12)] flex items-center justify-center gap-2 sm:gap-3 relative z-10">
              
              {/* Hours Block */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-19 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
                    {time ? (time.getHours() % 12 || 12).toString().padStart(2, '0') : '--'}
                  </span>
                </div>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Hours</span>
              </div>

              {/* Pulsing Colon */}
              <div className="flex flex-col gap-1.5 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Minutes Block */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-19 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-cyan-300 tracking-tight drop-shadow-[0_2px_12px_rgba(34,211,238,0.45)]">
                    {time ? time.getMinutes().toString().padStart(2, '0') : '--'}
                  </span>
                </div>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Minutes</span>
              </div>

              {/* Pulsing Colon */}
              <div className="flex flex-col gap-1.5 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Seconds Block */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-17 h-18 sm:h-21 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg relative">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 tracking-tight drop-shadow-[0_2px_10px_rgba(251,191,36,0.45)]">
                    {time ? time.getSeconds().toString().padStart(2, '0') : '--'}
                  </span>
                  {/* AM/PM Tag */}
                  <span className="absolute top-1.5 right-1.5 text-[6.5px] font-black px-1 rounded bg-white/20 text-white leading-none py-0.5">
                    {time ? (time.getHours() >= 12 ? 'PM' : 'AM') : 'AM'}
                  </span>
                </div>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 mt-1">Seconds</span>
              </div>

            </div>

            {/* Live Study Tracker Subtitle */}
            <div className="mt-2.5 flex items-center gap-1.5 text-[9.5px] text-slate-300/90 font-medium z-10">
              <span className="material-symbols-outlined text-[13px] text-amber-400">timer</span>
              <span>Study Focus Mode &bull; Real-Time Precision</span>
            </div>

          </div>

          {/* ─── 2. Main Hero Showcase with Full-Height Mascot & Spacious Depth ─── */}
          <div className="w-full min-h-[440px] sm:min-h-[520px] pt-3 px-4 pb-6 relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#b8d6f5] via-[#d7e9fa] to-white">
            
            {/* ══ Edge-to-Edge Fitted Mascot ══ */}
            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none flex items-center justify-center">
              <img
                src="/images/image.png"
                alt="Parrot Mascot Full Fit"
                className="w-full h-full object-contain object-center transform scale-100 sm:scale-105"
              />
            </div>

            {/* ══ Authentic Depth Watermark Positioned Behind Parrot Head (z-0) ══ */}
            <div className="absolute inset-x-0 top-7.5 sm:top-18 flex items-center justify-center z-0 select-none pointer-events-none w-full overflow-visible px-2">
              <h1 
                className="font-heading font-bold text-[5rem] sm:text-[7.2rem] md:text-[100px] tracking-[0.15em] sm:tracking-[0.22em] uppercase text-center leading-none whitespace-nowrap pl-3 sm:pl-6 text-transparent bg-clip-text bg-gradient-to-b from-white/95 via-white/45 to-white/5 drop-shadow-[0_6px_20px_rgba(255,255,255,0.5)]"
                style={{
                  fontFamily: "'Outfit', 'Montserrat', sans-serif",
                }}
              >
                NAINIX
              </h1>
            </div>

          </div>

          {/* ─── 3. Important Community & App Quick Links ─── */}
          <div className="w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-5 flex flex-col gap-3 relative z-20">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Important Links
              </span>
              <span className="text-[9px] font-bold text-slate-400">Join Community</span>
            </div>

            {/* 2x2 Clean Action Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp Channel */}
              <a
                href="https://whatsapp.com/channel/0029Vb7D6yP29759"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playButtonClick}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.546 1.84.835 2.796.835 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.391 8.172c-.141.396-.714.733-1.011.777-.282.042-.647.067-2.063-.52-1.808-.75-2.975-2.593-3.065-2.713-.09-.12-1.748-2.327-1.748-4.442 0-2.115 1.109-3.155 1.503-3.585.394-.43.86-.538 1.147-.538.287 0 .573.002.825.014.267.012.624-.1.975.742.361.867 1.233 3.011 1.344 3.237.111.226.185.49.037.784-.148.294-.222.477-.444.738-.222.261-.466.584-.666.784-.222.222-.453.463-.195.906.258.443 1.147 1.892 2.463 3.064 1.691 1.506 3.118 1.973 3.56 2.195.443.222.701.185.96-.111.259-.296 1.109-1.294 1.405-1.737.296-.443.591-.37.998-.222.407.148 2.587 1.22 3.03 1.442.443.222.738.333.849.518.111.185.111 1.072-.03 1.468z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-slate-900 leading-tight truncate">WhatsApp</span>
                  <span className="text-[9px] font-bold text-[#128C7E] truncate">Channel</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/nainix.me"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playButtonClick}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[#E1306C] transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-slate-900 leading-tight truncate">Instagram</span>
                  <span className="text-[9px] font-bold text-[#E1306C] truncate">@nainix.me</span>
                </div>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com/nainixone"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playButtonClick}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 text-slate-900 transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-slate-900 leading-tight truncate">Twitter / X</span>
                  <span className="text-[9px] font-bold text-slate-500 truncate">@nainixone</span>
                </div>
              </a>

              {/* Official App */}
              <a
                href="/nainixOne_Class12_Latest.apk"
                download="nainixOne_Class12_Latest.apk"
                onClick={playButtonClick}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-600/30 text-[#7c3aed] transition-all hover:scale-[1.02] active:scale-95 group shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">android</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-slate-900 leading-tight truncate">Download App</span>
                  <span className="text-[9px] font-bold text-[#7c3aed] truncate">Direct APK</span>
                </div>
              </a>
            </div>

            {/* ─── Legal & Compliance Footer Links ─── */}
            <div className="pt-3.5 mt-1 border-t border-slate-100 flex flex-col items-center gap-1.5 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500">
                <Link href="/privacy" className="hover:text-slate-900 hover:underline transition-colors">
                  Privacy Policy
                </Link>
                <span>&bull;</span>
                <Link href="/terms" className="hover:text-slate-900 hover:underline transition-colors">
                  Terms of Service
                </Link>
                <span>&bull;</span>
                <Link href="/refund" className="hover:text-slate-900 hover:underline transition-colors">
                  Refund Policy
                </Link>
                <span>&bull;</span>
                <Link href="/disclaimer" className="hover:text-slate-900 hover:underline transition-colors">
                  Disclaimer
                </Link>
              </div>

              <p className="text-[8.5px] text-slate-400 font-medium">
                &copy; 2026 nainixOne &bull; All Rights Reserved
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default function LoginPage({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#faf6f0]">
        <div className="w-8 h-8 border-3 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginFormContent initialMode={initialMode} />
    </Suspense>
  );
}
