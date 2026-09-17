"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  sendContactRequestEmail,
  sendNewsletterSignupEmail,
} from "@/lib/email";
import { db } from "@/lib/db";
import { contactSubmissions, newsletterSubscribers } from "@/lib/db/schema";
import { getRecipientEmails } from "@/lib/notifications";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 8;
const hits = new Map<string, number[]>();

const contactSchema = z.object({
  first: z.string().trim().min(1).max(80),
  last: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(40),
  email: z.string().email().max(120),
  message: z.string().trim().min(1).max(4000),
});

const newsletterSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().email().max(120),
});

async function takeFormLimit(kind: string) {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";
  const key = `${kind}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

function revalidateInquiries() {
  revalidatePath("/admin");
  revalidatePath("/admin/contact-requests");
  revalidatePath("/admin/subscribers");
}

async function notifyContact(params: {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}) {
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
        .where(eq(contactSubmissions.id, params.id));
      return;
    }
    const result = await sendContactRequestEmail({
      to,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      email: params.email,
      message: params.message,
    });
    await db
      .update(contactSubmissions)
      .set({
        emailSent: result.sent > 0,
        emailError: result.error,
        updatedAt: new Date(),
      })
      .where(eq(contactSubmissions.id, params.id));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Email could not be sent.";
    console.error("Contact notification failed", error);
    await db
      .update(contactSubmissions)
      .set({
        emailSent: false,
        emailError: message,
        updatedAt: new Date(),
      })
      .where(eq(contactSubmissions.id, params.id));
  }
}

async function notifyNewsletter(params: {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}) {
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
        .where(eq(newsletterSubscribers.id, params.id));
      return;
    }
    const result = await sendNewsletterSignupEmail({
      to,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
    });
    await db
      .update(newsletterSubscribers)
      .set({
        emailSent: result.sent > 0,
        emailError: result.error,
        updatedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, params.id));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Email could not be sent.";
    console.error("Newsletter notification failed", error);
    await db
      .update(newsletterSubscribers)
      .set({
        emailSent: false,
        emailError: message,
        updatedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, params.id));
  }
}

export async function submitContactAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await takeFormLimit("contact"))) {
    return { error: "Too many messages. Please try again later." };
  }

  const parsed = contactSchema.safeParse({
    first: formData.get("first"),
    last: formData.get("last"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: "Please complete every field with a valid email so we can reach you." };
  }

  let saved: { id: string } | undefined;
  try {
    const inserted = await db
      .insert(contactSubmissions)
      .values({
        firstName: parsed.data.first,
        lastName: parsed.data.last,
        phone: parsed.data.phone,
        email: parsed.data.email.toLowerCase(),
        message: parsed.data.message,
      })
      .returning({ id: contactSubmissions.id });
    saved = inserted[0];
  } catch (error) {
    console.error("Contact save failed", error);
    return { error: "We could not save your message. Please try again or call the office." };
  }

  if (!saved) {
    return { error: "We could not save your message. Please try again or call the office." };
  }

  await notifyContact({
    id: saved.id,
    firstName: parsed.data.first,
    lastName: parsed.data.last,
    phone: parsed.data.phone,
    email: parsed.data.email,
    message: parsed.data.message,
  });
  revalidateInquiries();

  return { success: "Message sent." };
}

export async function submitNewsletterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await takeFormLimit("newsletter"))) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = newsletterSchema.safeParse({
    firstName: String(formData.get("firstName") ?? "").trim() || undefined,
    lastName: String(formData.get("lastName") ?? "").trim() || undefined,
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email." };
  }

  const email = parsed.data.email.toLowerCase();
  const firstName = parsed.data.firstName ?? null;
  const lastName = parsed.data.lastName ?? null;

  try {
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);
    const current = existing[0];

    if (current) {
      const wasInactive = current.status !== "active";
      await db
        .update(newsletterSubscribers)
        .set({
          firstName: firstName ?? current.firstName,
          lastName: lastName ?? current.lastName,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(newsletterSubscribers.id, current.id));

      if (wasInactive) {
        await notifyNewsletter({
          id: current.id,
          firstName: firstName ?? current.firstName ?? undefined,
          lastName: lastName ?? current.lastName ?? undefined,
          email,
        });
      }
    } else {
      const inserted = await db
        .insert(newsletterSubscribers)
        .values({
          email,
          firstName,
          lastName,
        })
        .returning({ id: newsletterSubscribers.id });
      const saved = inserted[0];
      if (saved) {
        await notifyNewsletter({
          id: saved.id,
          firstName: firstName ?? undefined,
          lastName: lastName ?? undefined,
          email,
        });
      }
    }
  } catch (error) {
    console.error("Newsletter save failed", error);
    return { error: "We could not complete your signup. Please try again later." };
  }

  revalidateInquiries();
  return { success: "Subscribed." };
}
