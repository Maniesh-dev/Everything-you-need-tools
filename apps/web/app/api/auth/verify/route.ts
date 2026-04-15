import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/auth/verify?token=<token>
 *
 * Verifies a user's email address using the verification token sent via email.
 * Sets isVerified=true and clears the token fields.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // ── Find user by verification token ───────────────────────────────────────
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid or expired verification token. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // ── Activate the account ──────────────────────────────────────────────────
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
