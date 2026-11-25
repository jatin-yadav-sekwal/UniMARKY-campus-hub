CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"university_name" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text DEFAULT 'other' NOT NULL,
	"university_name" text NOT NULL,
	"created_by" uuid,
	"member_count" integer DEFAULT 0 NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_id" uuid,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"author_id" uuid,
	"content" text NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"permission" text NOT NULL,
	"scope_type" text DEFAULT 'global' NOT NULL,
	"scope_value" text,
	"granted_by" uuid,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_granted_by_profiles_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_created_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "communities_university_created_idx" ON "communities" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "communities_university_category_idx" ON "communities" USING btree ("university_name","category");--> statement-breakpoint
CREATE INDEX "communities_creator_idx" ON "communities" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "community_comments_post_created_idx" ON "community_comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "community_members_unique_idx" ON "community_members" USING btree ("community_id","user_id");--> statement-breakpoint
CREATE INDEX "community_members_user_idx" ON "community_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_posts_community_created_idx" ON "community_posts" USING btree ("community_id","created_at");--> statement-breakpoint
CREATE INDEX "community_posts_author_idx" ON "community_posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "user_permissions_lookup_idx" ON "user_permissions" USING btree ("user_id","permission");--> statement-breakpoint
CREATE UNIQUE INDEX "user_permissions_grant_idx" ON "user_permissions" USING btree ("user_id","permission","scope_type","scope_value");--> statement-breakpoint
CREATE INDEX "accommodation_listings_university_created_idx" ON "accommodation_listings" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "accommodation_listings_owner_idx" ON "accommodation_listings" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "announcements_university_created_idx" ON "announcements" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "comments_post_created_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "food_listings_university_created_idx" ON "food_listings" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "food_listings_owner_idx" ON "food_listings" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "lost_found_university_created_idx" ON "lost_found" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "lost_found_reporter_idx" ON "lost_found" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "marketplace_items_university_created_idx" ON "marketplace_items" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "marketplace_items_seller_idx" ON "marketplace_items" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "menu_items_restaurant_idx" ON "menu_items" USING btree ("restaurant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "post_likes_post_user_idx" ON "post_likes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "profiles_university_idx" ON "profiles" USING btree ("university_name");--> statement-breakpoint
CREATE INDEX "role_requests_status_created_idx" ON "role_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "social_posts_university_created_idx" ON "social_posts" USING btree ("university_name","created_at");--> statement-breakpoint
CREATE INDEX "social_posts_author_idx" ON "social_posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "study_materials_university_filter_idx" ON "study_materials" USING btree ("university_name","department","year");--> statement-breakpoint
CREATE INDEX "study_materials_uploader_idx" ON "study_materials" USING btree ("uploaded_by");