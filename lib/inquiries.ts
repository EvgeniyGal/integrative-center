import { desc, eq, count } from "drizzle-orm";

import { db } from "@/lib/db";
import { contactSubmissions, newsletterSubscribers } from "@/lib/db/schema";

export async function getContactSubmissions() {
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt));
}

export async function getNewsletterSubscribers() {
  return db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));
}

export async function getInquiryCounts() {
  const [contacts, unread, subscribers] = await Promise.all([
    db.select({ value: count() }).from(contactSubmissions),
    db
      .select({ value: count() })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.status, "new")),
    db
      .select({ value: count() })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, "active")),
  ]);

  return {
    contactRequests: contacts[0]?.value ?? 0,
    unreadContactRequests: unread[0]?.value ?? 0,
    subscribers: subscribers[0]?.value ?? 0,
  };
}
