"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function AddPatientFormButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      className={className}
      onClick={() => {
        router.push(`/admin/patient-forms/new?t=${Date.now()}`);
      }}
    >
      Add patient form
    </Button>
  );
}

export function BackToPatientFormsLink(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const router = useRouter();

  return (
    <Link
      href="/admin/patient-forms"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push("/admin/patient-forms");
        router.refresh();
      }}
    />
  );
}
