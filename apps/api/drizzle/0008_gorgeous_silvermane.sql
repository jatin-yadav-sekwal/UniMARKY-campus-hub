CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_comments_author_idx" ON "community_comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "post_likes_user_idx" ON "post_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "role_requests_user_idx" ON "role_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "role_requests_reviewed_by_idx" ON "role_requests" USING btree ("reviewed_by");--> statement-breakpoint
CREATE INDEX "user_permissions_granted_by_idx" ON "user_permissions" USING btree ("granted_by");