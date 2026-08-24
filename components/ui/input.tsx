import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-none border-0 border-b border-stone-300 bg-transparent px-0 py-3 text-base text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-brand disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
