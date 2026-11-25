-- ============================================================================
-- Security hardening. Safe to re-run. Apply to every environment after
-- `npm run db:migrate`.
--
-- 1. Lock the two tables that were reachable through PostgREST without RLS.
--    The API connects as the table owner (which bypasses RLS), so app traffic
--    is unaffected; the public `anon` / `authenticated` roles are shut out.
-- 2. Harden Supabase's `handle_new_user` auth trigger so it cannot be invoked
--    via `/rest/v1/rpc/handle_new_user` and no longer inherits a mutable
--    `search_path`. The trigger itself keeps firing on sign-up (trigger
--    invocation does not require EXECUTE grants).
-- ============================================================================

ALTER TABLE public.menu_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
    ) THEN
        ALTER FUNCTION public.handle_new_user() SET search_path = '';
        REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
        REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
    END IF;
END
$$;
