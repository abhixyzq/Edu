'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/BrandLogo';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthCardProps {
  authMode: 'login' | 'signup';
  slideDirection: number;
  error: string;
  switchMode: (mode: 'login' | 'signup') => void;
  // Login props
  identifier: string;
  setIdentifier: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  loadingLogin: boolean;
  onLoginSubmit: (e: React.FormEvent) => void;
  // Signup props
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
  loadingSignup: boolean;
  onNameChange: (v: string) => void;
  onSignupNextStep: (e: React.FormEvent) => void;
  onSignupSubmit: (e: React.FormEvent) => void;
}

export function AuthCard({
  authMode,
  slideDirection,
  error,
  switchMode,
  identifier, setIdentifier,
  password, setPassword,
  showPassword, setShowPassword,
  rememberMe, setRememberMe,
  loadingLogin,
  onLoginSubmit,
  signupStep, setSignupStep,
  fullName,
  signupUsername, setSignupUsername,
  setUsernameTouched,
  contact, setContact,
  classLevelVal, setClassLevelState,
  boardVal, setBoardState,
  signupPassword, setSignupPassword,
  showSignupPassword, setShowSignupPassword,
  agreedTerms, setAgreedTerms,
  refCode,
  loadingSignup,
  onNameChange,
  onSignupNextStep,
  onSignupSubmit,
}: AuthCardProps) {
  return (
    <div className="w-full bg-white rounded-[32px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center overflow-hidden">

      {/* Brand Logo */}
      <div className="mb-3.5 flex flex-col items-center">
        <BrandLogo size="lg" />
      </div>

      {/* Segmented Tab Switcher */}
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

      {/* Error Banner */}
      {error && (
        <div className="w-full mb-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Sliding Form Container */}
      <div className="w-full overflow-hidden relative">
        <AnimatePresence initial={false} custom={slideDirection} mode="wait">
          {authMode === 'login' ? (
            <LoginForm
              slideDirection={slideDirection}
              identifier={identifier}
              setIdentifier={setIdentifier}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              loading={loadingLogin}
              onSubmit={onLoginSubmit}
              onSwitchToSignup={() => switchMode('signup')}
            />
          ) : (
            <SignupForm
              slideDirection={slideDirection}
              signupStep={signupStep}
              setSignupStep={setSignupStep}
              fullName={fullName}
              signupUsername={signupUsername}
              setSignupUsername={setSignupUsername}
              setUsernameTouched={setUsernameTouched}
              contact={contact}
              setContact={setContact}
              classLevelVal={classLevelVal}
              setClassLevelState={setClassLevelState}
              boardVal={boardVal}
              setBoardState={setBoardState}
              signupPassword={signupPassword}
              setSignupPassword={setSignupPassword}
              showSignupPassword={showSignupPassword}
              setShowSignupPassword={setShowSignupPassword}
              agreedTerms={agreedTerms}
              setAgreedTerms={setAgreedTerms}
              refCode={refCode}
              loading={loadingSignup}
              onNameChange={onNameChange}
              onNextStep={onSignupNextStep}
              onSubmit={onSignupSubmit}
              onSwitchToLogin={() => switchMode('login')}
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
