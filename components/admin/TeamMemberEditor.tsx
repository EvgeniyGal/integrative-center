"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
} from "@/app/admin/actions/team-members";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TeamMember } from "@/lib/db/schema";

export function TeamMemberEditor({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const id = member?.id ?? "new";

  const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? "");
  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");

  const action = member ? updateTeamMemberAction : createTeamMemberAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!member && state.success) {
      router.push("/admin/team-members");
      router.refresh();
    }
  }, [member, state.success, router]);

  const imageReady = Boolean(imageUrl) && !imageUrl.startsWith("blob:");

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      {member ? <input type="hidden" name="id" value={member.id} /> : null}

      <AdminSection
        title="Team member"
        description="Shown on the About page. The first published member by sort order appears on the home page."
      >
        <ImageField
          label="Portrait"
          urlName="imageUrl"
          uploadFolder="team-members"
          value={imageUrl}
          onChange={setImageUrl}
          required={!member}
        />
        <AdminField label="Name" htmlFor={`name-${id}`}>
          <Input
            id={`name-${id}`}
            name="name"
            variant="box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Elina Belilovskiy, ARNP, MSN"
          />
        </AdminField>
        <AdminField label="Role" htmlFor={`role-${id}`}>
          <Input
            id={`role-${id}`}
            name="role"
            variant="box"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            placeholder="Founder & Family Medicine Nurse Practitioner"
          />
        </AdminField>
        <AdminField label="Bio" htmlFor={`bio-${id}`}>
          <Textarea
            id={`bio-${id}`}
            name="bio"
            variant="box"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={5}
            placeholder="Short biography shown on the About page."
          />
        </AdminField>
      </AdminSection>

      <AdminSection title="Visibility" description="Control order and publishing.">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
          <AdminField label="Sort order" htmlFor={`sort-${id}`}>
            <Input
              id={`sort-${id}`}
              name="sortOrder"
              variant="box"
              type="number"
              defaultValue={String(member?.sortOrder ?? 0)}
            />
          </AdminField>
          <AdminToggle
            name="published"
            label="Published"
            description="Show on the About page (and home if first by order)"
            defaultChecked={member?.published ?? true}
          />
        </div>
      </AdminSection>

      {state.error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
          {state.success}
        </p>
      ) : null}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
        <p className="text-xs text-muted">
          {!imageReady
            ? "Add an image before saving."
            : "Changes apply after you save."}
        </p>
        <Button type="submit" disabled={pending || !imageReady}>
          {pending
            ? "Saving…"
            : member
              ? "Update member"
              : "Create member"}
        </Button>
      </div>
    </form>
  );
}
