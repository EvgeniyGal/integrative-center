"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { contactSubmissions, newsletterSubscribers } from "@/lib/db/schema";

function revalidateContactRequests() {
  revalidatePath("/admin/contact-requests");
  revalidatePath("/admin");
}

function revalidateSubscribers() {
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");
}

export async function setContactReadAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing request id.");
  if (field !== "read") {
    throw new Error("Invalid request flag.");
  }

  await db
    .update(contactSubmissions)
    .set({
      status: value ? "read" : "new",
      updatedAt: new Date(),
    })
    .where(eq(contactSubmissions.id, id));

  revalidateContactRequests();
}

export async function deleteContactSubmissionAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing request id.");
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  revalidateContactRequests();
}

export async function setSubscriberActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing subscriber id.");
  if (field !== "active") {
    throw new Error("Invalid subscriber flag.");
  }

  await db
    .update(newsletterSubscribers)
    .set({
      status: value ? "active" : "unsubscribed",
      updatedAt: new Date(),
    })
    .where(eq(newsletterSubscribers.id, id));

  revalidateSubscribers();
}

export async function deleteSubscriberAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing subscriber id.");
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  revalidateSubscribers();
}
