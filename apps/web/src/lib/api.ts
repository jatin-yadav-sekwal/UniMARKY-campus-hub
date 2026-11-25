import { supabase } from './supabase';

// Always call the API on our own origin. In production the Vercel rewrite
// (apps/web/vercel.json) proxies `/api/*` to the API, and in development the
// Vite proxy (vite.config.ts) forwards it, so requests never need CORS.
// A cross-origin absolute VITE_API_URL is deliberately ignored: it broke every
// authenticated request whenever the API's CORS allowlist was left unset.
const API_BASE = "/api";

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  // Handle potential double slashes
  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    // Auth-sensitive reads must never be served from a stale cache: a cached
    // /profiles/me would bounce a just-onboarded user back to onboarding.
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => 
    fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => 
    fetchWithAuth(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};
