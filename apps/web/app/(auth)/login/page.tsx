'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeSlash, EnvelopeSimple, Lock, SpinnerGap } from '@phosphor-icons/react';

function getSafeRedirect(redirect: string | null): string {
  if (!redirect) return '/';
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/';
  return redirect;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, googleLogin } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));
  const registerHref =
    redirectTo === '/'
      ? '/register'
      : `/register?redirect=${encodeURIComponent(redirectTo)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.message);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
        >
          <span className="flex px-4 py-2 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
            Kraaft
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Google Login */}
        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                setError('');
                setIsSubmitting(true);
                const result = await googleLogin(credentialResponse.credential);
                if (result.success) {
                  router.push(redirectTo);
                } else {
                  setError(result.message);
                }
                setIsSubmitting(false);
              }
            }}
            onError={() => {
              setError('Google login failed. Please try again.');
            }}
            useOneTap
            width="100%"
            theme="filled_black"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <div className="relative mb-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground backdrop-blur-xl">
            Or continue with
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <EnvelopeSimple
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.address"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-border bg-background/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-background/50 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <SpinnerGap className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href={registerHref}
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
