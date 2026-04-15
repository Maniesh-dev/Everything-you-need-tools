'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  SpinnerGap,
} from '@phosphor-icons/react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
      }
    }

    verify();
  }, [token]);

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
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/10 text-center">
        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SpinnerGap className="animate-spin" size={36} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Verifying your email...
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle size={36} weight="fill" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Email verified!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Sign in to your account
              </Link>
            </div>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <XCircle size={36} weight="fill" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Verification failed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Register again
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <SpinnerGap className="animate-spin text-primary" size={36} />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
