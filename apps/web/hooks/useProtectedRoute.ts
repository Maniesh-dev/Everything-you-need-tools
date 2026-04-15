'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

/**
 * Hook that redirects to /login if the user is not authenticated.
 * Use in any page/component that requires authentication.
 *
 * Usage:
 *   useProtectedRoute(); // Redirects to /login if not logged in
 */
export function useProtectedRoute() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is resolved
    if (isLoading) return;

    if (!user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}
