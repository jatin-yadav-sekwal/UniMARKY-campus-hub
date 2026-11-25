import {
  pgTable,
  uuid,
  text,
  boolean,
  numeric,
  integer,
  timestamp,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Tables ---

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // Linked to auth.users in Supabase
  fullName: text("full_name"),
  universityName: text("university_name"),
  department: text("department"),
  class: text("class"),
  mobileNumber: text("mobile_number"),
  idCardUrl: text("id_card_url"),
  role: text("role", { enum: ["normal", "superuser", "userX"] }).default("normal"),
  isVerified: boolean("is_verified").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("profiles_university_idx").on(table.universityName),
]);

export const roleRequests = pgTable("role_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  requestedRole: text("requested_role", { enum: ["superuser"] }).notNull().default("superuser"),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => profiles.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("role_requests_status_created_idx").on(table.status, table.createdAt),
  index("role_requests_user_idx").on(table.userId),
  index("role_requests_reviewed_by_idx").on(table.reviewedBy),
]);

/**
 * Scoped capability grants. A row grants `permission` to `userId` either
 * globally or limited to one university/department. `expires_at` NULL means
 * no expiry. Admins (`role = userX`) bypass these rows entirely.
 */
export const userPermissions = pgTable("user_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  permission: text("permission").notNull(),
  scopeType: text("scope_type", { enum: ["global", "university", "department"] })
    .notNull()
    .default("global"),
  scopeValue: text("scope_value"),
  grantedBy: uuid("granted_by").references(() => profiles.id, { onDelete: "set null" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("user_permissions_lookup_idx").on(table.userId, table.permission),
  index("user_permissions_granted_by_idx").on(table.grantedBy),
  uniqueIndex("user_permissions_grant_idx").on(
    table.userId,
    table.permission,
    table.scopeType,
    table.scopeValue
  ),
]);

/** Append-only trail for privileged actions (approvals, deletes, grants). */
export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata"),
  universityName: text("university_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("audit_log_created_idx").on(table.createdAt),
  index("audit_log_entity_idx").on(table.entityType, table.entityId),
  index("audit_log_actor_idx").on(table.actorId),
]);

export const marketplaceItems = pgTable("marketplace_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  category: text("category"),
  condition: text("condition"),
  manufacturedYear: text("manufactured_year"),
  isNegotiable: boolean("is_negotiable").default(false),
  imageUrl: text("image_url"),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("marketplace_items_university_created_idx").on(table.universityName, table.createdAt),
  index("marketplace_items_seller_idx").on(table.sellerId),
]);

export const lostFound = pgTable("lost_found", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: uuid("reporter_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  itemName: text("item_name").notNull(),
  description: text("description"),
  type: text("type", { enum: ["lost", "found"] }).notNull(),
  location: text("location"),
  imageUrl: text("image_url"),
  status: text("status").default("open"),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("lost_found_university_created_idx").on(table.universityName, table.createdAt),
  index("lost_found_reporter_idx").on(table.reporterId),
]);

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("announcements_university_created_idx").on(table.universityName, table.createdAt),
]);

export const socialPosts = pgTable("social_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  type: text("type", { enum: ["post", "event", "announcement"] }).default("post").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  eventDate: timestamp("event_date", { withTimezone: true }),
  hostedBy: text("hosted_by"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  sharesCount: integer("shares_count").default(0),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("social_posts_university_created_idx").on(table.universityName, table.createdAt),
  index("social_posts_author_idx").on(table.authorId),
]);

export const postLikes = pgTable("post_likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => socialPosts.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  // One like per user per post. Deduplicate existing rows before migrating.
  uniqueIndex("post_likes_post_user_idx").on(table.postId, table.userId),
  index("post_likes_user_idx").on(table.userId),
]);

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => socialPosts.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("comments_post_created_idx").on(table.postId, table.createdAt),
  index("comments_user_idx").on(table.userId),
]);

// --- Communities ---

/**
 * University-scoped interest groups. Replaces the retired Unimedia feed.
 * `memberCount` / `postCount` are maintained by the API on join/leave and
 * post create/delete so listings stay cheap.
 */
export const communities = pgTable("communities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["academic", "tech", "sports", "cultural", "housing", "placement", "other"],
  }).notNull().default("other"),
  universityName: text("university_name").notNull(),
  createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
  memberCount: integer("member_count").notNull().default(0),
  postCount: integer("post_count").notNull().default(0),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("communities_university_created_idx").on(table.universityName, table.createdAt),
  index("communities_university_category_idx").on(table.universityName, table.category),
  index("communities_creator_idx").on(table.createdBy),
]);

export const communityMembers = pgTable("community_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["member", "moderator"] }).notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  uniqueIndex("community_members_unique_idx").on(table.communityId, table.userId),
  index("community_members_user_idx").on(table.userId),
]);

export const communityPosts = pgTable("community_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => profiles.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("community_posts_community_created_idx").on(table.communityId, table.createdAt),
  index("community_posts_author_idx").on(table.authorId),
]);

export const communityComments = pgTable("community_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => profiles.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("community_comments_post_created_idx").on(table.postId, table.createdAt),
  index("community_comments_author_idx").on(table.authorId),
]);

// --- Food & Restaurants ---

export const foodListings = pgTable("food_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").references(() => profiles.id, { onDelete: 'set null' }),
  name: text("name").notNull(),
  description: text("description"),
  cuisine: text("cuisine"),
  tags: text("tags"), // "Vegetarian, Fast Food, Chinese"
  address: text("address"),
  phone: text("phone"),
  timing: text("timing"), // "9 AM - 11 PM"
  priceRange: text("price_range"), // "₹200-500"
  rating: numeric("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  imageUrl: text("image_url"),
  location: text("location").notNull(),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("food_listings_university_created_idx").on(table.universityName, table.createdAt),
  index("food_listings_owner_idx").on(table.ownerId),
]);

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id").notNull().references(() => foodListings.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  category: text("category"), // "Starters", "Main Course", "Drinks", "Desserts"
  imageUrl: text("image_url"),
  isVeg: boolean("is_veg").default(true),
  isAvailable: boolean("is_available").default(true),
  rating: numeric("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("menu_items_restaurant_idx").on(table.restaurantId),
]);

// --- Accommodation ---

export const accommodationListings = pgTable("accommodation_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").references(() => profiles.id, { onDelete: 'set null' }),
  name: text("name").notNull(),
  type: text("type", { enum: ["PG", "Hostel", "Apartment"] }).notNull(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  amenities: text("amenities"), // "WiFi, AC, Laundry, Gym"
  images: text("images"), // JSON array of image URLs
  minPrice: numeric("min_price"),
  maxPrice: numeric("max_price"),
  rentRange: text("rent_range"),
  rating: numeric("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  location: text("location").notNull(),
  contact: text("contact"),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("accommodation_listings_university_created_idx").on(table.universityName, table.createdAt),
  index("accommodation_listings_owner_idx").on(table.ownerId),
]);

// --- Study Materials ---

export const studyMaterials = pgTable("study_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  department: text("department").notNull(),
  year: text("year", { enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"] }).notNull(),
  subjectName: text("subject_name").notNull(),
  category: text("category", {
    enum: ["previous_year_papers", "notes", "sessional_exams", "assignments", "syllabus", "reference_books"],
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  uploadedBy: uuid("uploaded_by").references(() => profiles.id, { onDelete: "set null" }),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("study_materials_university_filter_idx").on(
    table.universityName,
    table.department,
    table.year
  ),
  index("study_materials_uploader_idx").on(table.uploadedBy),
]);

// --- Relations ---

export const profilesRelations = relations(profiles, ({ many }) => ({
  marketplaceItems: many(marketplaceItems),
  lostFoundItems: many(lostFound),
  socialPosts: many(socialPosts),
  postLikes: many(postLikes),
  comments: many(comments),
  roleRequests: many(roleRequests),
  foodListings: many(foodListings),
  accommodationListings: many(accommodationListings),
  studyMaterials: many(studyMaterials),
  permissions: many(userPermissions),
}));

export const roleRequestsRelations = relations(roleRequests, ({ one }) => ({
  user: one(profiles, {
    fields: [roleRequests.userId],
    references: [profiles.id],
  }),
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
  user: one(profiles, {
    fields: [userPermissions.userId],
    references: [profiles.id],
  }),
}));

export const marketplaceItemsRelations = relations(marketplaceItems, ({ one }) => ({
  seller: one(profiles, {
    fields: [marketplaceItems.sellerId],
    references: [profiles.id],
  }),
}));

export const lostFoundRelations = relations(lostFound, ({ one }) => ({
  reporter: one(profiles, {
    fields: [lostFound.reporterId],
    references: [profiles.id],
  }),
}));

export const socialPostsRelations = relations(socialPosts, ({ one, many }) => ({
  author: one(profiles, {
    fields: [socialPosts.authorId],
    references: [profiles.id],
  }),
  likes: many(postLikes),
  comments: many(comments),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(socialPosts, {
    fields: [postLikes.postId],
    references: [socialPosts.id],
  }),
  user: one(profiles, {
    fields: [postLikes.userId],
    references: [profiles.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(socialPosts, {
    fields: [comments.postId],
    references: [socialPosts.id],
  }),
  user: one(profiles, {
    fields: [comments.userId],
    references: [profiles.id],
  }),
}));

export const foodListingsRelations = relations(foodListings, ({ many, one }) => ({
  menuItems: many(menuItems),
  owner: one(profiles, {
    fields: [foodListings.ownerId],
    references: [profiles.id],
  }),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  restaurant: one(foodListings, {
    fields: [menuItems.restaurantId],
    references: [foodListings.id],
  }),
}));

export const accommodationListingsRelations = relations(accommodationListings, ({ one }) => ({
  owner: one(profiles, {
    fields: [accommodationListings.ownerId],
    references: [profiles.id],
  }),
}));

export const studyMaterialsRelations = relations(studyMaterials, ({ one }) => ({
  uploader: one(profiles, {
    fields: [studyMaterials.uploadedBy],
    references: [profiles.id],
  }),
}));

// --- Communities relations ---

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  creator: one(profiles, {
    fields: [communities.createdBy],
    references: [profiles.id],
  }),
  members: many(communityMembers),
  posts: many(communityPosts),
}));

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
  user: one(profiles, {
    fields: [communityMembers.userId],
    references: [profiles.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  community: one(communities, {
    fields: [communityPosts.communityId],
    references: [communities.id],
  }),
  author: one(profiles, {
    fields: [communityPosts.authorId],
    references: [profiles.id],
  }),
  comments: many(communityComments),
}));

export const communityCommentsRelations = relations(communityComments, ({ one }) => ({
  post: one(communityPosts, {
    fields: [communityComments.postId],
    references: [communityPosts.id],
  }),
  author: one(profiles, {
    fields: [communityComments.authorId],
    references: [profiles.id],
  }),
}));
