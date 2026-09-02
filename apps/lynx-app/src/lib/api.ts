import { supabase } from './supabase'

// Safe environment variable access for Lynx
const getEnv = (key: string) => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] : undefined;
  } catch {
    return undefined;
  }
};

const API_BASE = getEnv('LYNX_APP_API_URL') || ''

interface FetchOptions {
  method?: string
  body?: string
  headers?: Record<string, string>
}

async function fetchWithAuth(endpoint: string, options: FetchOptions = {}): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error((errorData as any).error || `API Error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) =>
    fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) =>
    fetchWithAuth(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
}
