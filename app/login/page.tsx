'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';
import { BrandLogo } from '@/components/BrandLogo';
import { AuthCard } from './_components/AuthCard';
import { ShowcaseSection } from './_components/ShowcaseSection';

function LoginFormContent({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, setTargetBoard, setClassLevel, addGems } = useUser();

  // ─── Mode & Sliding State ───
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Sync mode with ?mode= search param
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

  // ─── Login State ───
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ─── Signup State ───
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

  // ─── General Status ───
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState<Date | null>(null);

  // Ref code from URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setRefCode(ref.toLowerCase().trim().replace(/[^a-z0-9_]/g, ''));
    }
  }, [searchParams]);

  // Live clock
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const loginSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAbout = () => {
    playButtonClick();
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-generate username from name
  const handleNameChange = (val: string) => {
    setFullName(val);
    if (!usernameTouched) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '_').slice(0, 15);
      setSignupUsername(generated);
    }
  };

  // ─── Login Submit ───
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setError('');
    setLoadingLogin(true);
    playButtonClick();

    const result = await login(identifier.trim(), password);
    setLoadingLogin(false);

    if (result.success) {
      playGemDing();
      router.push('/');
    } else {
      setError(result.error || 'Invalid username or password.');
    }
  };

  // ─── Signup Step 1 ───
  const handleSignupNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    playButtonClick();
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!signupUsername.trim() || signupUsername.length < 3) return setError('Username must be 3-20 characters.');
    if (!contact.includes('@')) return setError('Please enter a valid email address.');
    setSignupStep(2);
  };

  // ─── Signup Final Submit ───
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    playButtonClick();
    if (signupPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (!agreedTerms) return setError('Please agree to Terms of Service.');

    setLoadingSignup(true);
    const cleanUser = signupUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const result = await signup(fullName.trim(), contact.trim().toLowerCase(), signupPassword, boardVal, cleanUser);
    setLoadingSignup(false);

    if (result.success) {
      setTargetBoard(boardVal);
      setClassLevel(classLevelVal);
      if (refCode) {
        addGems(50);
        try {
          const currentCount = parseInt(localStorage.getItem('edustride_referral_count') || '0', 10);
          localStorage.setItem('edustride_referral_count', (currentCount + 1).toString());
        } catch {
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

      {/* ═══════ SCREEN 1: Auth Screen ═══════ */}
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

        {/* Auth Card */}
        <main className="w-full max-w-[345px] sm:max-w-[375px] relative z-20 my-auto">
          <AuthCard
            authMode={authMode}
            slideDirection={slideDirection}
            error={error}
            switchMode={switchMode}
            identifier={identifier} setIdentifier={setIdentifier}
            password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword}
            rememberMe={rememberMe} setRememberMe={setRememberMe}
            loadingLogin={loadingLogin}
            onLoginSubmit={handleLoginSubmit}
            signupStep={signupStep} setSignupStep={setSignupStep}
            fullName={fullName}
            signupUsername={signupUsername} setSignupUsername={setSignupUsername}
            setUsernameTouched={setUsernameTouched}
            contact={contact} setContact={setContact}
            classLevelVal={classLevelVal} setClassLevelState={setClassLevelState}
            boardVal={boardVal} setBoardState={setBoardState}
            signupPassword={signupPassword} setSignupPassword={setSignupPassword}
            showSignupPassword={showSignupPassword} setShowSignupPassword={setShowSignupPassword}
            agreedTerms={agreedTerms} setAgreedTerms={setAgreedTerms}
            refCode={refCode}
            loadingSignup={loadingSignup}
            onNameChange={handleNameChange}
            onSignupNextStep={handleSignupNextStep}
            onSignupSubmit={handleSignupSubmit}
          />
        </main>

        {/* Pull Indicator */}
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

      {/* ═══════ SCREEN 2: Showcase ═══════ */}
      <div ref={showcaseRef}>
        <ShowcaseSection time={time} />
      </div>

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
