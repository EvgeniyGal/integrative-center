import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full resize-y rounded-none border-0 border-b border-stone-300 bg-transparent px-0 py-3 text-base text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-brand disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
