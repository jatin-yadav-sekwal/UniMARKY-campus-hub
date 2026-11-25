-- ============================================================================
-- Run ONCE, against the target database, BEFORE `npm run db:migrate`.
--
-- The new schema adds a UNIQUE index on post_likes (post_id, user_id).
-- If duplicates exist the migration will fail, so collapse them first.
-- ============================================================================

DELETE FROM post_likes
WHERE id NOT IN (
    SELECT DISTINCT ON (post_id, user_id) id
    FROM post_likes
    ORDER BY post_id, user_id, created_at
);
