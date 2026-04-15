'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  getAccessToken: () => string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  googleLogin: (idToken: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const router = useRouter();

  // ── Get access token from memory ────────────────────────────────────────────
  const getAccessToken = useCallback(() => {
    return accessTokenRef.current;
  }, []);

  // ── Refresh access token via HTTP-only cookie ───────────────────────────────
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Send cookies
      });

      if (!res.ok) {
        accessTokenRef.current = null;
        setUser(null);
        return null;
      }

      const data = await res.json();
      accessTokenRef.current = data.accessToken;
      setUser(data.user);
      return data.accessToken;
    } catch {
      accessTokenRef.current = null;
      setUser(null);
      return null;
    }
  }, []);

  // ── Silent refresh on mount (persistent login) ─────────────────────────────
  useEffect(() => {
    async function silentRefresh() {
      setIsLoading(true);
      await refreshAccessToken();
      setIsLoading(false);
    }
    silentRefresh();
  }, [refreshAccessToken]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, message: data.message || 'Login failed' };
        }

        accessTokenRef.current = data.accessToken;
        setUser(data.user);
        return { success: true, message: 'Login successful' };
      } catch {
        return { success: false, message: 'Network error. Please try again.' };
      }
    },
    []
  );

  // ── Google Login ────────────────────────────────────────────────────────────
  const googleLogin = useCallback(async (idToken: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Google Login failed' };
      }

      accessTokenRef.current = data.accessToken;
      setUser(data.user);
      return { success: true, message: 'Google Login successful' };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, message: data.message || 'Registration failed' };
        }

        return { success: true, message: data.message };
      } catch {
        return { success: false, message: 'Network error. Please try again.' };
      }
    },
    []
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Best-effort logout
    }

    accessTokenRef.current = null;
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        getAccessToken,
        login,
        googleLogin,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
