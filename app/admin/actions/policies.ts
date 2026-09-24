"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import type { ArticleBlock } from "@/lib/content/blocks";
import { safeParseMarkdown } from "@/lib/content/markdown";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function isPolicySlugTaken(slug: string, exceptId?: string) {
  const [existing] = await db
    .select({ id: policies.id })
    .from(policies)
    .where(
      exceptId
        ? and(eq(policies.slug, slug), ne(policies.id, exceptId))
        : eq(policies.slug, slug),
    )
    .limit(1);
  return Boolean(existing);
}

function slugTakenMessage(slug: string) {
  return `Slug “${slug}” is already in use. Choose a different slug.`;
}

const policySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.array(z.custom<ArticleBlock>()),
  visible: z.boolean(),
  showOnAbout: z.boolean(),
  showInToc: z.boolean(),
  sortOrder: z.number().int(),
});

export type PolicyActionState = ActionState;

function resolveBlocksFromForm(
  formData: FormData,
): { ok: true; blocks: ArticleBlock[] } | { ok: false; error: string } {
  const bodyMarkdown = String(formData.get("bodyMarkdown") ?? "");
  if (bodyMarkdown.trim()) {
    const parsed = safeParseMarkdown(bodyMarkdown);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    return { ok: true, blocks: parsed.blocks };
  }

  const rawBlocks = String(formData.get("blocks") ?? "");
  if (rawBlocks.trim()) {
    try {
      const blocks = JSON.parse(rawBlocks) as ArticleBlock[];
      if (Array.isArray(blocks)) return { ok: true, blocks };
    } catch {
      return { ok: false, error: "Body blocks are invalid." };
    }
  }

  return { ok: true, blocks: [] };
}

function parsePolicyForm(formData: FormData, blocks: ArticleBlock[]) {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  return policySchema.safeParse({
    slug: slugify(slugInput || title),
    title,
    body: blocks,
    visible: formData.get("visible") === "on",
    showOnAbout: formData.get("showOnAbout") === "on",
    showInToc: formData.get("showInToc") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  });
}

function readPolicySlug(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  return slugify(slugInput || title);
}

function revalidatePolicies(slug?: string) {
  updateTag("policies");
  if (slug) updateTag(`policy:${slug}`);
  revalidatePath("/admin/policies");
  revalidatePath("/patient-resources/office-policies");
  revalidatePath("/about");
  revalidatePath("/");
}

export async function createPolicyAction(
  _prev: PolicyActionState,
  formData: FormData,
): Promise<PolicyActionState> {
  await requireAdmin();
  try {
    const slug = readPolicySlug(formData);
    if (!slug) {
      return { error: "Add a title or slug before saving." };
    }
    if (await isPolicySlugTaken(slug)) {
      return { error: slugTakenMessage(slug) };
    }

    const blocksResult = resolveBlocksFromForm(formData);
    if (!blocksResult.ok) {
      return { error: blocksResult.error };
    }

    const parsed = parsePolicyForm(formData, blocksResult.blocks);
    if (!parsed.success) {
      return { error: "Check the policy fields." };
    }

    await db.insert(policies).values(parsed.data);
    revalidatePolicies(parsed.data.slug);
    return { success: "Policy created." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create policy.";
    if (/unique|duplicate/i.test(message)) {
      return { error: "That slug is already in use. Choose a different slug." };
    }
    return { error: message };
  }
}

export async function updatePolicyAction(
  _prev: PolicyActionState,
  formData: FormData,
): Promise<PolicyActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing policy id." };

  try {
    const [existing] = await db
      .select()
      .from(policies)
      .where(eq(policies.id, id))
      .limit(1);
    if (!existing) return { error: "Policy not found." };

    const slug = readPolicySlug(formData);
    if (!slug) {
      return { error: "Add a title or slug before saving." };
    }
    if (await isPolicySlugTaken(slug, id)) {
      return { error: slugTakenMessage(slug) };
    }

    const blocksResult = resolveBlocksFromForm(formData);
    if (!blocksResult.ok) {
      return { error: blocksResult.error };
    }

    const parsed = parsePolicyForm(formData, blocksResult.blocks);
    if (!parsed.success) {
      return { error: "Check the policy fields." };
    }

    await db
      .update(policies)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(policies.id, id));

    revalidatePolicies(parsed.data.slug);
    if (existing.slug !== parsed.data.slug) {
      updateTag(`policy:${existing.slug}`);
    }
    return { success: "Policy updated." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update policy.";
    if (/unique|duplicate/i.test(message)) {
      return { error: "That slug is already in use. Choose a different slug." };
    }
    return { error: message };
  }
}

export async function deletePolicyAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing policy id.");

  const [existing] = await db
    .select({ slug: policies.slug })
    .from(policies)
    .where(eq(policies.id, id))
    .limit(1);
  await db.delete(policies).where(eq(policies.id, id));
  revalidatePolicies(existing?.slug);
}

export async function setPolicyFlagAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing policy id.");
  if (field !== "visible" && field !== "showOnAbout" && field !== "showInToc") {
    throw new Error("Invalid policy flag.");
  }

  await db
    .update(policies)
    .set({ [field]: value, updatedAt: new Date() })
    .where(eq(policies.id, id));

  revalidatePolicies();
}

export async function reorderPoliciesAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(policies)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(policies.id, id)),
    ),
  );

  revalidatePolicies();
}
