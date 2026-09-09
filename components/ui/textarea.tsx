import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  variant?: "underline" | "box";
};

function Textarea({
  className,
  variant = "underline",
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full resize-y rounded-none text-base text-ink placeholder:text-muted/70 outline-none transition-colors disabled:opacity-50",
        variant === "underline" &&
          "min-h-32 border-0 border-b border-stone-300 bg-transparent px-0 py-3 focus:border-brand",
        variant === "box" &&
          "min-h-28 border border-ink/20 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(28,27,25,0.03)] focus:border-brand focus:ring-2 focus:ring-brand/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
