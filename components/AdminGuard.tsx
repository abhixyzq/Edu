'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

/**
 * AdminGuard — wraps all /admin/* pages.
 * Redirects to / if the user is not logged in or not an admin.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!user.isLoggedIn) {
      router.replace('/login');
    } else if (!user.isAdmin) {
      router.replace('/');
    }
  }, [user.isLoggedIn, user.isAdmin, isMounted, router]);

  if (!isMounted || !user.isLoggedIn || !user.isAdmin) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1a1f21]">
        <div className="w-10 h-10 border-4 border-[#ff8c42] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-[#ff8c42]">Verifying admin access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
