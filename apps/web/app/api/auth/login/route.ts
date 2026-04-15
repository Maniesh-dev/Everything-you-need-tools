import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { loginSchema } from '@/lib/validations/auth';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/lib/auth';

// ─── Simple In-Memory Rate Limiter ──────────────────────────────────────────────
// Tracks login attempts per IP. Max 5 attempts per 15-minute window.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    return true;
  }

  return false;
}

/**
 * POST /api/auth/login
 *
 * Validates credentials, checks email verification status,
 * issues access + refresh tokens.
 * Access token → response body, Refresh token → HTTP-only cookie.
 */
export async function POST(req: Request) {
  try {
    // ── Rate limiting ─────────────────────────────────────────────────────────
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many login attempts. Please try again in 15 minutes.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // ── Validate input ────────────────────────────────────────────────────────
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await dbConnect();

    // ── Find user (explicitly select password and refreshTokens) ─────────────
    const user = await User.findOne({ email }).select(
      '+password +refreshTokens'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // ── Check if email is verified ────────────────────────────────────────────
    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Please verify your email address before logging in. Check your inbox for the verification link.',
          code: 'EMAIL_NOT_VERIFIED',
        },
        { status: 403 }
      );
    }

    // ── Compare password ──────────────────────────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // ── Generate tokens ───────────────────────────────────────────────────────
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // ── Store hashed refresh token in DB (for invalidation + multi-device) ───
    const hashedRefreshToken = hashToken(refreshToken);
    user.refreshTokens.push(hashedRefreshToken);

    // Cap stored tokens to 5 to prevent unbounded growth (5 active devices max)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    // ── Build response with HTTP-only cookie ──────────────────────────────────
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 7 * 24 * 60 * 60; // 7 days

    const cookieParts = [
      `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`,
      'HttpOnly',
      'Path=/api/auth',
      `Max-Age=${maxAge}`,
      'SameSite=Strict',
    ];
    if (isProduction) cookieParts.push('Secure');

    const response = NextResponse.json(
      {
        success: true,
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', cookieParts.join('; '));

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
