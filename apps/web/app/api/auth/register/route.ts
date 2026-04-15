import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations/auth';
import { generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST /api/auth/register
 *
 * Creates a new user account with isVerified=false,
 * generates a verification token, and sends a verification email.
 * Does NOT issue JWT tokens — the user must verify their email first.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ── Validate input with Zod ───────────────────────────────────────────────
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    await dbConnect();

    // ── Check for existing user ───────────────────────────────────────────────
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // ── Generate verification token (valid for 24 hours) ──────────────────────
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // ── Create user (password is hashed automatically via pre-save hook) ──────
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    // ── Send verification email ───────────────────────────────────────────────
    try {
      await sendVerificationEmail(email, verificationToken, name);
    } catch (emailError) {
      // If email fails, still create the account but warn the user
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        {
          success: true,
          message:
            'Account created, but we could not send the verification email. Please try again later or contact support.',
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Account created successfully! Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
