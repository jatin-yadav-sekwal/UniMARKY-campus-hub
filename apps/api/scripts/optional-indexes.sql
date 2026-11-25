-- ============================================================================
-- OPTIONAL performance indexes.
-- Run manually against the target database. Safe to re-run.
--
-- These are NOT part of the Drizzle migration: they need the `pg_trgm`
-- extension, which not every database role can create. Apply them after
-- `npm run db:migrate` if you want faster fuzzy text search.
--
-- Supabase ships `pg_trgm`; on a self-managed Postgres you may need to
-- `CREATE EXTENSION pg_trgm;` as a superuser.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Accelerates the case-insensitive `%q%` search in GET /api/lostfound
-- (see server/routes/lostfound.ts).
CREATE INDEX IF NOT EXISTS lost_found_item_name_trgm_idx
    ON lost_found USING gin (item_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS lost_found_description_trgm_idx
    ON lost_found USING gin (description gin_trgm_ops);
