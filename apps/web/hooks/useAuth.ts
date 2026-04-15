'use client';

import { useAuthContext } from '@/context/AuthContext';
import { createAuthFetch } from '@/lib/api';
import { useMemo } from 'react';

/**
 * Hook providing access to the auth context with a pre-configured authFetch.
 *
 * Usage:
 *   const { user, login, logout, authFetch } = useAuth();
 */
export function useAuth() {
  const ctx = useAuthContext();

  // Create a stable authFetch function bound to current token state
  const authFetch = useMemo(
    () => createAuthFetch(ctx.getAccessToken, ctx.refreshAccessToken),
    [ctx.getAccessToken, ctx.refreshAccessToken]
  );

  return {
    user: ctx.user,
    isLoading: ctx.isLoading,
    login: ctx.login,
    googleLogin: ctx.googleLogin,
    register: ctx.register,
    logout: ctx.logout,
    authFetch,
  };
}
