import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {
  verifyRefreshToken,
  hashToken,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/lib/auth';

/**
 * POST /api/auth/logout
 *
 * Reads the refresh token from the HTTP-only cookie,
 * removes its hash from the user's refreshTokens array in the DB,
 * and clears the cookie.
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
    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const hashedToken = hashToken(refreshToken);

        await dbConnect();

        // Remove this specific refresh token from the user's stored tokens
        await User.findByIdAndUpdate(decoded.userId, {
          $pull: { refreshTokens: hashedToken },
        });
      } catch {
        // Token invalid/expired — just clear the cookie anyway
      }
    }

    // ── Clear the cookie ──────────────────────────────────────────────────────
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieParts = [
      `${REFRESH_TOKEN_COOKIE_NAME}=`,
      'HttpOnly',
      'Path=/api/auth',
      'Max-Age=0', // Immediately expire the cookie
      'SameSite=Strict',
    ];
    if (isProduction) cookieParts.push('Secure');

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully.' },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', cookieParts.join('; '));

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
