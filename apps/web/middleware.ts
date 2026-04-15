import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware for lightweight route protection.
 *
 * This checks for the presence of the refresh token cookie:
 * - No cookie on protected routes → redirect to /login
 * - Cookie present on auth routes (/login, /register) → redirect to /
 *
 * NOTE: This is a LIGHTWEIGHT guard only. Actual token verification
 * happens server-side in the API routes. The middleware just prevents
 * unnecessary page loads.
 */

// Routes that require authentication
const protectedPaths = ['/dashboard', '/saved', '/profile', '/settings'];

// Routes that should redirect to home if already authenticated
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refreshToken');

  // ── Protected routes: redirect to login if no token ─────────────────────────
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth routes: redirect to home if already authenticated ──────────────────
  const isAuthRoute = authPaths.some((path) => pathname === path);

  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// ── Only run middleware on specific paths ──────────────────────────────────────
export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/saved/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
