import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ─── Environment Variables ──────────────────────────────────────────────────────
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// ─── Payload Type ───────────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
}

// ─── Generate Access Token (short-lived, 15min) ─────────────────────────────────
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

// ─── Generate Refresh Token (long-lived, 7 days) ────────────────────────────────
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

// ─── Verify Access Token ────────────────────────────────────────────────────────
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
}

// ─── Verify Refresh Token ───────────────────────────────────────────────────────
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
}

// ─── Hash a token (SHA-256) for safe storage in DB ──────────────────────────────
// We never store raw refresh tokens — only their hash.
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─── Generate a random verification token ───────────────────────────────────────
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ─── Cookie configuration for refresh token ─────────────────────────────────────
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export function getRefreshTokenCookieOptions(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

  // Build Set-Cookie header parts
  const parts = [
    `${REFRESH_TOKEN_COOKIE_NAME}=`, // placeholder — actual value prepended elsewhere
    `HttpOnly`,
    `Path=/api/auth`,
    `Max-Age=${maxAge}`,
    `SameSite=Strict`,
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  return parts.join('; ');
}
