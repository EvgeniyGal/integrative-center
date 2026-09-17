"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { contactSubmissions, newsletterSubscribers } from "@/lib/db/schema";
import {
  sendContactRequestEmail,
  sendNewsletterSignupEmail,
} from "@/lib/email";
import { getRecipientEmails } from "@/lib/notifications";

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

export async function retryContactEmailAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing request id.");

  const existing = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);
  const item = existing[0];
  if (!item) throw new Error("Request not found.");

  try {
    const to = await getRecipientEmails("contact");
    if (to.length === 0) {
      await db
        .update(contactSubmissions)
        .set({
          emailSent: false,
          emailError: "No notification recipients are configured.",
          updatedAt: new Date(),
        })
        .where(eq(contactSubmissions.id, id));
      revalidateContactRequests();
      return;
    }

    const result = await sendContactRequestEmail({
      to,
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone,
      email: item.email,
      message: item.message,
    });
    await db
      .update(contactSubmissions)
      .set({
        emailSent: result.sent > 0,
        emailError: result.error,
        updatedAt: new Date(),
      })
      .where(eq(contactSubmissions.id, id));
  } catch (error) {
    await db
      .update(contactSubmissions)
      .set({
        emailSent: false,
        emailError:
          error instanceof Error ? error.message : "Email could not be sent.",
        updatedAt: new Date(),
      })
      .where(eq(contactSubmissions.id, id));
  }

  revalidateContactRequests();
}

export async function retrySubscriberEmailAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing subscriber id.");

  const existing = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.id, id))
    .limit(1);
  const item = existing[0];
  if (!item) throw new Error("Subscriber not found.");

  try {
    const to = await getRecipientEmails("newsletter");
    if (to.length === 0) {
      await db
        .update(newsletterSubscribers)
        .set({
          emailSent: false,
          emailError: "No notification recipients are configured.",
          updatedAt: new Date(),
        })
        .where(eq(newsletterSubscribers.id, id));
      revalidateSubscribers();
      return;
    }

    const result = await sendNewsletterSignupEmail({
      to,
      firstName: item.firstName ?? undefined,
      lastName: item.lastName ?? undefined,
      email: item.email,
    });
    await db
      .update(newsletterSubscribers)
      .set({
        emailSent: result.sent > 0,
        emailError: result.error,
        updatedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, id));
  } catch (error) {
    await db
      .update(newsletterSubscribers)
      .set({
        emailSent: false,
        emailError:
          error instanceof Error ? error.message : "Email could not be sent.",
        updatedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, id));
  }

  revalidateSubscribers();
}
