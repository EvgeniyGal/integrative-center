"use server";

import { headers } from "next/headers";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  sendContactRequestEmail,
  sendNewsletterSignupEmail,
} from "@/lib/email";
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

  const to = await getRecipientEmails("contact");
  if (to.length === 0) {
    return { error: "We could not send your message. Please call the office." };
  }

  try {
    await sendContactRequestEmail({
      to,
      firstName: parsed.data.first,
      lastName: parsed.data.last,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message: parsed.data.message,
    });
  } catch {
    return { error: "We could not send your message. Please try again or call the office." };
  }

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

  const to = await getRecipientEmails("newsletter");
  if (to.length === 0) {
    return { error: "We could not complete your signup. Please try again later." };
  }

  try {
    await sendNewsletterSignupEmail({
      to,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
    });
  } catch {
    return { error: "We could not complete your signup. Please try again later." };
  }

  return { success: "Subscribed." };
}
