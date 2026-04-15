import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/api-auth';

/**
 * GET /api/auth/me
 *
 * Protected route. Returns the currently authenticated user's profile.
 * Requires a valid access token in the Authorization header.
 */
export async function GET(req: Request) {
  try {
    // ── Verify access token ───────────────────────────────────────────────────
    let payload;
    try {
      payload = getAuthUser(req);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // ── Fetch user from DB (exclude sensitive fields) ─────────────────────────
    const user = await User.findById(payload.userId).select(
      'name email role isVerified createdAt'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Me error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
