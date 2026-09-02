'use client';

import React, { Suspense } from 'react';
import LoginPage from '../login/page';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#faf6f0]">
        <div className="w-8 h-8 border-3 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginPage initialMode="signup" />
    </Suspense>
  );
}
