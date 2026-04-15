import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/lib/auth';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/google
 *
 * Receives a Google ID token from the client, verifies it securely with Google's servers,
 * checks if the user exists:
 * - If yes: logs them in.
 * - If no: creates a new account (isVerified: true since Google verified the email)
 *
 * Then issues standard custom JWT access + refresh tokens.
 */
export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No Google token provided.' },
        { status: 400 }
      );
    }

    // ── Verify the Google ID Token ────────────────────────────────────────────
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google token payload.' },
        { status: 400 }
      );
    }

    const { email, name, sub: googleId } = payload;

    await dbConnect();

    // ── Find existing user by email or Google ID ─────────────────────────────
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    }).select('+refreshTokens');

    if (user) {
      // If user exists but via email/password, link their Google account
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        user.isVerified = true; // Auto-verify if they linked via Google
        await user.save();
      }
    } else {
      // ── Create new user ───────────────────────────────────────────────────
      user = await User.create({
        name: name || 'Google User',
        email,
        authProvider: 'google',
        googleId,
        isVerified: true, // Google already verified their email
      });
    }

    // ── Generate our custom JWT tokens ────────────────────────────────────────
    const jwtPayload = { userId: user._id.toString(), role: user.role };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    // ── Store hashed refresh token in DB ──────────────────────────────────────
    const hashedRefreshToken = hashToken(refreshToken);
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(hashedRefreshToken);

    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    // ── Set HTTP-only cookie ──────────────────────────────────────────────────
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
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { success: false, message: `Google authentication failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
