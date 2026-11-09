"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import {
  collectTeamMemberBlobUrls,
  deleteOrphanBlobUrls,
} from "@/lib/media/blob";

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  imageUrl: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

function parseMember(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
}

function toRow(data: z.infer<typeof schema>) {
  return {
    name: data.name.trim(),
    role: data.role.trim(),
    bio: data.bio.trim(),
    imageUrl: data.imageUrl.trim(),
    sortOrder: data.sortOrder,
    published: data.published,
  };
}

function revalidateMemberPaths() {
  updateTag("team-members");
  revalidatePath("/admin/team-members");
  revalidatePath("/about");
  revalidatePath("/");
}

export async function createTeamMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseMember(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the team member fields.",
    };
  }
  if (!parsed.data.imageUrl || parsed.data.imageUrl.startsWith("blob:")) {
    return { error: "Add an image before saving." };
  }

  await db.insert(teamMembers).values(toRow(parsed.data));
  revalidateMemberPaths();
  return { success: "Team member created." };
}

export async function updateTeamMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing team member id." };

  const existing = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.id, id),
  });
  if (!existing) return { error: "Team member not found." };

  const parsed = parseMember(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the team member fields.",
    };
  }
  if (!parsed.data.imageUrl || parsed.data.imageUrl.startsWith("blob:")) {
    return { error: "Add an image before saving." };
  }

  const previousUrls = collectTeamMemberBlobUrls(existing);
  const next = toRow(parsed.data);

  await db
    .update(teamMembers)
    .set({ ...next, updatedAt: new Date() })
    .where(eq(teamMembers.id, id));

  const nextUrls = new Set(collectTeamMemberBlobUrls(next));
  const removed = previousUrls.filter((url) => !nextUrls.has(url));
  await deleteOrphanBlobUrls(removed, { teamMemberId: id });

  revalidateMemberPaths();
  return { success: "Team member updated." };
}

export async function deleteTeamMemberAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing team member id.");

  const existing = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.id, id),
  });
  if (!existing) throw new Error("Team member not found.");

  const urls = collectTeamMemberBlobUrls(existing);
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  await deleteOrphanBlobUrls(urls, { teamMemberId: id });

  revalidateMemberPaths();
}

export async function setTeamMemberPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing team member id.");
  if (field !== "published") throw new Error("Invalid team member flag.");

  await db
    .update(teamMembers)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(teamMembers.id, id));
  revalidateMemberPaths();
}

export async function reorderTeamMembersAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(teamMembers)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(teamMembers.id, id)),
    ),
  );

  revalidateMemberPaths();
}
