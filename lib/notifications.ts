import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { notificationRecipients } from "@/lib/db/schema";
import { site } from "@/lib/site";

export type NotificationChannel = "contact" | "newsletter";

export async function getNotificationRecipients() {
  "use cache";
  cacheTag("notification-recipients");
  cacheLife("hours");

  return db
    .select()
    .from(notificationRecipients)
    .orderBy(asc(notificationRecipients.email));
}

export async function getRecipientEmails(channel: NotificationChannel) {
  const rows = await getNotificationRecipients();
  const matched = rows.filter((row) =>
    channel === "contact" ? row.receiveContact : row.receiveNewsletter,
  );
  if (matched.length > 0) {
    return matched.map((row) => row.email);
  }
  if (rows.length === 0) {
    return [site.email];
  }
  return [];
}
