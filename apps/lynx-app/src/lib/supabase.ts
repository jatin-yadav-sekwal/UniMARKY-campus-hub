import { createClient } from '@supabase/supabase-js'

// Use Lynx's websocket if available, or fallback
// In Lynx, the background thread may not have a global WebSocket, or it might be indexed under 'lynx'
const LynxWebSocket = (globalThis as any).WebSocket || (globalThis as any).lynx?.WebSocket;

// Safe environment variable access for Lynx
const getEnv = (key: string) => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] : undefined;
  } catch {
    return undefined;
  }
};

const SUPABASE_URL = getEnv('LYNX_APP_SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = getEnv('LYNX_APP_SUPABASE_ANON_KEY') || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[Supabase] Missing environment variables. Auth and data will not work.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Lynx doesn't have localStorage — Supabase will use in-memory storage
    // For session persistence, we'd need a Lynx-compatible storage adapter
    persistSession: false,
    autoRefreshToken: true,
  },
  realtime: {
    // @ts-ignore
    transport: LynxWebSocket ? { WebSocket: LynxWebSocket } : undefined,
  },
})
