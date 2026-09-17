import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

import type { ArticleBlock } from "@/lib/content/blocks";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
  role: text("role").notNull().default("admin"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const adminInvites = pgTable("admin_invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  tokenHash: text("tokenHash").notNull(),
  invitedByUserId: text("invitedByUserId").references(() => users.id, {
    onDelete: "set null",
  }),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  acceptedAt: timestamp("acceptedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("tokenHash").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  usedAt: timestamp("usedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  eyebrow: text("eyebrow").notNull(),
  summary: text("summary").notNull(),
  body: jsonb("body").$type<string[]>().notNull().default([]),
  imageUrl: text("imageUrl").notNull(),
  showOnHome: boolean("showOnHome").notNull().default(false),
  visible: boolean("visible").notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  source: text("source").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImageUrl: text("coverImageUrl").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("draft"),
  featuredOnHome: boolean("featuredOnHome").notNull().default(false),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  blocks: jsonb("blocks").$type<ArticleBlock[]>().notNull().default([]),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const supplementBrands = pgTable("supplement_brands", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  logoUrl: text("logoUrl").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountText: text("discountText"),
  referralLink: text("referralLink").notNull(),
  ctaLabel: text("ctaLabel").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const productCategories = pgTable("product_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const storeBrands = pgTable("store_brands", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  logoUrl: text("logoUrl").notNull(),
  ctaLabel: text("ctaLabel").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const SITE_SETTINGS_ID = "default";

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().$defaultFn(() => SITE_SETTINGS_ID),
  openaiApiKeyEncrypted: text("openaiApiKeyEncrypted"),
  systemPrompt: text("systemPrompt").notNull(),
  knowledgeBase: text("knowledgeBase").notNull(),
  chatModel: text("chatModel").notNull().default("gpt-4o-mini"),
  contentModel: text("contentModel").notNull().default("gpt-4o-mini"),
  productModel: text("productModel").notNull().default("gpt-4o-mini"),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const recommendedProducts = pgTable("recommended_products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  category: text("category").notNull(),
  imageUrl: text("imageUrl").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  referralLink: text("referralLink").notNull(),
  storeBrandId: text("storeBrandId")
    .notNull()
    .references(() => storeBrands.id, { onDelete: "restrict" }),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const notificationRecipients = pgTable("notification_recipients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  label: text("label"),
  receiveContact: boolean("receiveContact").notNull().default(true),
  receiveNewsletter: boolean("receiveNewsletter").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  emailSent: boolean("emailSent").notNull().default(false),
  emailError: text("emailError"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  status: text("status").notNull().default("active"),
  emailSent: boolean("emailSent").notNull().default(false),
  emailError: text("emailError"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type SupplementBrand = typeof supplementBrands.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type StoreBrand = typeof storeBrands.$inferSelect;
export type RecommendedProduct = typeof recommendedProducts.$inferSelect;
export type AdminInvite = typeof adminInvites.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NotificationRecipient = typeof notificationRecipients.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
