import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/lib/auth';

/**
 * POST /api/auth/refresh
 *
 * Reads the refresh token from the HTTP-only cookie, verifies it,
 * performs token rotation (old token removed, new one issued),
 * and returns a new access token.
 *
 * Token rotation is a security best practice — each refresh token
 * can only be used once. If a stolen token is reused, the legitimate
 * user's next refresh will fail, alerting them to compromise.
 */
export async function POST(req: Request) {
  try {
    // ── Extract refresh token from cookie ─────────────────────────────────────
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...val] = c.trim().split('=');
        return [key, val.join('=')];
      })
    );
    const oldRefreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!oldRefreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token found.' },
        { status: 401 }
      );
    }

    // ── Verify the refresh token ──────────────────────────────────────────────
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired refresh token.' },
        { status: 401 }
      );
    }

    await dbConnect();

    // ── Find user and check the hashed token exists in DB ─────────────────────
    const oldHashedToken = hashToken(oldRefreshToken);
    const user = await User.findById(decoded.userId).select('+refreshTokens');

    if (!user || !user.refreshTokens.includes(oldHashedToken)) {
      // Possible token reuse attack — clear ALL refresh tokens for this user
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token has been revoked. Please log in again.',
        },
        { status: 401 }
      );
    }

    // ── Token rotation: remove old, generate new ──────────────────────────────
    const payload = { userId: user._id.toString(), role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    const newHashedToken = hashToken(newRefreshToken);

    // Replace old token with new one
    user.refreshTokens = user.refreshTokens.filter(
      (t: string) => t !== oldHashedToken
    );
    user.refreshTokens.push(newHashedToken);
    await user.save();

    // ── Set new cookie ────────────────────────────────────────────────────────
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 7 * 24 * 60 * 60;

    const cookieParts = [
      `${REFRESH_TOKEN_COOKIE_NAME}=${newRefreshToken}`,
      'HttpOnly',
      'Path=/api/auth',
      `Max-Age=${maxAge}`,
      'SameSite=Strict',
    ];
    if (isProduction) cookieParts.push('Secure');

    const response = NextResponse.json(
      {
        success: true,
        accessToken: newAccessToken,
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
    console.error('Refresh error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
