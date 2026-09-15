import { and, asc, count, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import {
  articles,
  questions,
  recommendedProducts,
  services,
  supplementBrands,
  testimonials,
} from "@/lib/db/schema";

export async function getPublishedQuestions() {
  "use cache";
  cacheTag("questions");
  cacheLife("hours");

  return db
    .select()
    .from(questions)
    .where(eq(questions.published, true))
    .orderBy(asc(questions.sortOrder), asc(questions.createdAt));
}

export async function getAllQuestions() {
  return db
    .select()
    .from(questions)
    .orderBy(asc(questions.sortOrder), asc(questions.createdAt));
}

export async function getVisibleServices() {
  "use cache";
  cacheTag("services");
  cacheLife("hours");

  return db
    .select()
    .from(services)
    .where(eq(services.visible, true))
    .orderBy(asc(services.sortOrder), asc(services.createdAt));
}

export async function getHomeServices() {
  "use cache";
  cacheTag("services");
  cacheLife("hours");

  return db
    .select()
    .from(services)
    .where(and(eq(services.visible, true), eq(services.showOnHome, true)))
    .orderBy(asc(services.sortOrder), asc(services.createdAt));
}

export async function getAllServices() {
  return db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder), asc(services.createdAt));
}

export async function getServiceBySlug(slug: string) {
  "use cache";
  cacheTag("services");
  cacheTag(`service:${slug}`);
  cacheLife("hours");

  const rows = await db
    .select()
    .from(services)
    .where(and(eq(services.slug, slug), eq(services.visible, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublishedTestimonials() {
  "use cache";
  cacheTag("testimonials");
  cacheLife("hours");

  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}

export async function getAllTestimonials() {
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}

export async function getPublishedArticles() {
  "use cache";
  cacheTag("articles");
  cacheLife("hours");

  return db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt));
}

export async function getFeaturedArticles(limit = 3) {
  "use cache";
  cacheTag("articles");
  cacheLife("hours");

  return db
    .select()
    .from(articles)
    .where(
      and(eq(articles.status, "published"), eq(articles.featuredOnHome, true)),
    )
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
    .limit(limit);
}

export async function getArticleBySlug(slug: string) {
  "use cache";
  cacheTag("articles");
  cacheTag(`article:${slug}`);
  cacheLife("hours");

  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllArticles() {
  return db
    .select()
    .from(articles)
    .orderBy(desc(articles.updatedAt));
}

export async function getPublishedSupplementBrands() {
  "use cache";
  cacheTag("supplement-brands");
  cacheLife("hours");

  return db
    .select()
    .from(supplementBrands)
    .where(eq(supplementBrands.published, true))
    .orderBy(asc(supplementBrands.sortOrder), asc(supplementBrands.createdAt));
}

export async function getAllSupplementBrands() {
  return db
    .select()
    .from(supplementBrands)
    .orderBy(asc(supplementBrands.sortOrder), asc(supplementBrands.createdAt));
}

export async function getPublishedRecommendedProducts() {
  "use cache";
  cacheTag("recommended-products");
  cacheLife("hours");

  return db
    .select()
    .from(recommendedProducts)
    .where(eq(recommendedProducts.published, true))
    .orderBy(
      asc(recommendedProducts.sortOrder),
      asc(recommendedProducts.createdAt),
    );
}

export async function getAllRecommendedProducts() {
  return db
    .select()
    .from(recommendedProducts)
    .orderBy(
      asc(recommendedProducts.sortOrder),
      asc(recommendedProducts.createdAt),
    );
}

export async function getDashboardCounts() {
  const [q, s, t, a, brands, products] = await Promise.all([
    db.select({ value: count() }).from(questions),
    db.select({ value: count() }).from(services),
    db.select({ value: count() }).from(testimonials),
    db.select({ value: count() }).from(articles),
    db.select({ value: count() }).from(supplementBrands),
    db.select({ value: count() }).from(recommendedProducts),
  ]);

  return {
    questions: q[0]?.value ?? 0,
    services: s[0]?.value ?? 0,
    testimonials: t[0]?.value ?? 0,
    articles: a[0]?.value ?? 0,
    supplementBrands: brands[0]?.value ?? 0,
    recommendedProducts: products[0]?.value ?? 0,
  };
}
