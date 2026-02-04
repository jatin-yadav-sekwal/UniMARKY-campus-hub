import { pgTable, uuid, text, boolean, numeric, integer, timestamp } from "drizzle-orm/pg-core";
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
  isVerified: boolean("is_verified").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

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
});

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
});

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const socialPosts = pgTable("social_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0),
  universityName: text("university_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// --- Food & Restaurants ---

export const foodListings = pgTable("food_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
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
});

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
});

// --- Accommodation ---

export const accommodationListings = pgTable("accommodation_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
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
});

// --- Relations ---

export const profilesRelations = relations(profiles, ({ many }) => ({
  marketplaceItems: many(marketplaceItems),
  lostFoundItems: many(lostFound),
  socialPosts: many(socialPosts),
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

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  author: one(profiles, {
    fields: [socialPosts.authorId],
    references: [profiles.id],
  }),
}));

export const foodListingsRelations = relations(foodListings, ({ many }) => ({
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  restaurant: one(foodListings, {
    fields: [menuItems.restaurantId],
    references: [foodListings.id],
  }),
}));
