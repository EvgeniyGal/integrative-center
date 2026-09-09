import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "underline" | "box";
};

function Input({ className, type, variant = "underline", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-none text-base text-ink placeholder:text-muted/70 outline-none transition-colors disabled:opacity-50",
        variant === "underline" &&
          "border-0 border-b border-stone-300 bg-transparent px-0 py-3 focus:border-brand",
        variant === "box" &&
          "border border-ink/20 bg-white px-3 py-2.5 shadow-[inset_0_1px_0_rgba(28,27,25,0.03)] focus:border-brand focus:ring-2 focus:ring-brand/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
