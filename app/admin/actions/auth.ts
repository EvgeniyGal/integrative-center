"use server";

import { and, count, eq, isNull, ne } from "drizzle-orm";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { signIn, signOut } from "@/auth";
import { createToken, hashPassword, hashToken } from "@/lib/auth/password";
import { requireAdmin, requireUserManager } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  adminInvites,
  passwordResetTokens,
  users,
} from "@/lib/db/schema";
import { sendAdminInviteEmail, sendPasswordResetEmail } from "@/lib/email";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl.startsWith("/admin") ? callbackUrl : "/admin",
    });
    return { success: "Signed in" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function inviteAdminAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireUserManager();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();

  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existingUser) {
    return { error: "An admin with this email already exists." };
  }

  const pending = await db.query.adminInvites.findFirst({
    where: and(
      eq(adminInvites.email, email),
      isNull(adminInvites.acceptedAt),
    ),
  });

  const token = createToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  if (pending) {
    await db
      .update(adminInvites)
      .set({
        tokenHash,
        expiresAt,
        invitedByUserId: session.user.id,
      })
      .where(eq(adminInvites.id, pending.id));
  } else {
    await db.insert(adminInvites).values({
      email,
      tokenHash,
      expiresAt,
      invitedByUserId: session.user.id,
    });
  }

  try {
    await sendAdminInviteEmail({ to: email, token });
  } catch {
    return {
      error:
        "Invite saved but email failed to send. Check RESEND_API_KEY / EMAIL_FROM.",
    };
  }

  revalidatePath("/admin/users");
  return { success: `Invite sent to ${email}.` };
}

export async function acceptInviteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "Invite token is missing." };
  if (name.length < 2) return { error: "Enter your name." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) return { error: "Passwords do not match." };

  const tokenHash = hashToken(token);
  const invite = await db.query.adminInvites.findFirst({
    where: and(
      eq(adminInvites.tokenHash, tokenHash),
      isNull(adminInvites.acceptedAt),
    ),
  });

  if (!invite || invite.expiresAt < new Date()) {
    return { error: "This invite is invalid or has expired." };
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, invite.email),
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({
    email: invite.email,
    name,
    passwordHash,
    role: "admin",
    status: "active",
    emailVerified: new Date(),
  });

  await db
    .update(adminInvites)
    .set({ acceptedAt: new Date() })
    .where(eq(adminInvites.id, invite.id));

  try {
    await signIn("credentials", {
      email: invite.email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: "Account created. Please sign in." };
    }
    throw error;
  }

  return { success: "Welcome." };
}

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  // Always succeed to avoid email enumeration
  if (!user || user.status !== "active") {
    return {
      success: "If that email exists, a reset link has been sent.",
    };
  }

  const token = createToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  try {
    await sendPasswordResetEmail({ to: user.email, token });
  } catch {
    return { error: "Could not send reset email. Try again later." };
  }

  return { success: "If that email exists, a reset link has been sent." };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "Reset token is missing." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) return { error: "Passwords do not match." };

  const tokenHash = hashToken(token);
  const reset = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.tokenHash, tokenHash),
      isNull(passwordResetTokens.usedAt),
    ),
  });

  if (!reset || reset.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, reset.userId));

  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, reset.id));

  return { success: "Password updated. You can sign in." };
}

export async function updateAdminUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();

  if (!id) return { error: "User id is required." };
  if (name.length < 2) return { error: "Enter a name." };
  const parsedEmail = z.string().email().safeParse(email);
  if (!parsedEmail.success) return { error: "Enter a valid email." };

  const conflict = await db.query.users.findFirst({
    where: and(eq(users.email, email), ne(users.id, id)),
  });
  if (conflict) return { error: "Another user already uses that email." };

  await db
    .update(users)
    .set({ name, email, updatedAt: new Date() })
    .where(eq(users.id, id));

  revalidatePath("/admin/users");
  return { success: "User updated." };
}

export async function setAdminStatusAction(formData: FormData) {
  const session = await requireUserManager();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id) throw new Error("User id is required.");
  if (status !== "active" && status !== "disabled") {
    throw new Error("Invalid status.");
  }
  if (id === session.user.id && status === "disabled") {
    throw new Error("You cannot disable your own account.");
  }

  if (status === "disabled") {
    const [{ value }] = await db
      .select({ value: count() })
      .from(users)
      .where(
        and(
          eq(users.status, "active"),
          eq(users.role, "admin"),
          ne(users.id, id),
        ),
      );
    if (value < 1) {
      throw new Error("Cannot disable the last active admin.");
    }
  }

  await db
    .update(users)
    .set({ status, updatedAt: new Date() })
    .where(eq(users.id, id));
  revalidatePath("/admin/users");
}

export async function setAdminRoleAction(formData: FormData) {
  const session = await requireUserManager();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!id) throw new Error("User id is required.");
  if (role !== "admin" && role !== "editor") {
    throw new Error("Invalid role.");
  }
  if (id === session.user.id && role !== "admin") {
    throw new Error("You cannot remove your own admin role.");
  }

  if (role !== "admin") {
    const [{ value }] = await db
      .select({ value: count() })
      .from(users)
      .where(
        and(
          eq(users.status, "active"),
          eq(users.role, "admin"),
          ne(users.id, id),
        ),
      );
    if (value < 1) {
      throw new Error("Cannot demote the last active admin.");
    }
  }

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, id));
  revalidatePath("/admin/users");
}

export async function deleteAdminUserAction(formData: FormData) {
  const session = await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("User id is required.");
  if (id === session.user.id) {
    throw new Error("You cannot delete your own account.");
  }

  const [{ value }] = await db
    .select({ value: count() })
    .from(users)
    .where(
      and(
        eq(users.status, "active"),
        eq(users.role, "admin"),
        ne(users.id, id),
      ),
    );
  if (value < 1) {
    throw new Error("Cannot delete the last active admin.");
  }

  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/users");
}

export async function deleteInviteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Invite id is required." };
  await db.delete(adminInvites).where(eq(adminInvites.id, id));
  revalidatePath("/admin/users");
  return { success: "Invite removed." };
}

export async function removeInviteAction(formData: FormData) {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Invite id is required.");
  await db.delete(adminInvites).where(eq(adminInvites.id, id));
  revalidatePath("/admin/users");
}
