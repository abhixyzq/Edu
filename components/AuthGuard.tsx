'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const PUBLIC_ROUTES = [
    '/login',
    '/signup',
    '/forgot-password',
    '/forgot-pass',
    '/privacy',
    '/terms',
    '/refund',
    '/disclaimer',
  ];

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    if (!isMounted) return;

    if (!isPublicRoute && !user.isLoggedIn) {
      router.replace('/login');
    }
  }, [user.isLoggedIn, pathname, router, isMounted, isPublicRoute]);

  // Prevent flash of protected content before redirect
  if (isMounted && !isPublicRoute && !user.isLoggedIn) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f4fafd]">
        <div className="w-10 h-10 border-4 border-[#ff8c42] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-[#564338]">Redirecting to Login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
