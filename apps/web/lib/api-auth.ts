import { verifyAccessToken, type JwtPayload } from './auth';

/**
 * Extract and verify the access token from the Authorization header.
 * Used in protected API routes to identify the authenticated user.
 *
 * @throws Error if token is missing or invalid
 * @returns The decoded JWT payload containing userId and role
 */
export function getAuthUser(request: Request): JwtPayload {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token not provided');
  }

  try {
    return verifyAccessToken(token);
  } catch {
    throw new Error('Invalid or expired access token');
  }
}
