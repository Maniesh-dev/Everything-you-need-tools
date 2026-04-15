/**
 * Authenticated fetch wrapper.
 *
 * Automatically attaches the Bearer access token from AuthContext
 * and handles 401 responses by refreshing the token and retrying once.
 *
 * Usage:
 *   import { createAuthFetch } from '@/lib/api';
 *
 *   // Inside a component:
 *   const authFetch = createAuthFetch(getAccessToken, refreshAccessToken);
 *   const res = await authFetch('/api/saved-data', { method: 'GET' });
 */
export function createAuthFetch(
  getAccessToken: () => string | null,
  refreshAccessToken: () => Promise<string | null>
) {
  return async function authFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = getAccessToken();

    // ── Attach token to request ─────────────────────────────────────────────
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // ── If 401, try to refresh and retry once ───────────────────────────────
    if (response.status === 401) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
      }
    }

    return response;
  };
}
