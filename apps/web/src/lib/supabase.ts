import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const getClientConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return { url, anonKey };
};

const config = getClientConfig();

// supabase-js serialises session reads and token refreshes through the Web
// Locks API. That lock (`lock:sb-<ref>-auth-token`) is shared by every tab on
// the origin, so one tab that is frozen, suspended or killed mid-refresh can
// keep it longer than the 10s acquire timeout. The client's initialize() then
// rejects with an uncaught "Navigator LockManager lock timed out" promise and
// auth never settles.
//
// Try the cross-tab lock first (it is what stops two tabs refreshing the same
// token at once), and if it cannot be acquired in time fall back to a per-tab
// queue. Worst case two tabs refresh concurrently — far better than a hung app.
const AUTH_LOCK_ACQUIRE_MS = 3000;

const localLocks = new Map<string, Promise<unknown>>();

function withLocalLock<R>(name: string, fn: () => Promise<R>): Promise<R> {
  const previous = localLocks.get(name) ?? Promise.resolve();
  const run = previous.then(fn, fn);
  // Keep the queue alive even when this operation rejects.
  localLocks.set(name, run.then(() => undefined, () => undefined));
  return run;
}

async function resilientLock<R>(
  name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>,
): Promise<R> {
  const locks = typeof navigator === 'undefined' ? undefined : navigator.locks;
  if (!locks) return withLocalLock(name, fn);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_LOCK_ACQUIRE_MS);
  try {
    return await locks.request(
      name,
      { mode: 'exclusive', signal: controller.signal },
      () => fn(),
    );
  } catch (error) {
    // AbortError means another tab kept the lock past our budget: stop waiting
    // on the cross-tab lock and continue under the local queue.
    const errorName = (error as { name?: string } | null)?.name;
    if (errorName === 'AbortError') {
      return withLocalLock(name, fn);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export const supabase: SupabaseClient = createClient(config.url, config.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: resilientLock,
  },
});
